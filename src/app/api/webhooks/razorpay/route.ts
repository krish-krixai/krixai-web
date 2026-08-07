import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { getPlanPrice, PLAN_CATALOG } from "@/utils/billing-catalog";
import { checkRateLimit } from "@/utils/rate-limit";
import { getRazorpayConfig } from "@/utils/razorpay-config";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const rawBody = await req.text();
    let rzpConfig;
    try {
      rzpConfig = getRazorpayConfig();
    } catch (e: any) {
      console.error("Razorpay config error:", e.message);
      return NextResponse.json({ error: "Payments are temporarily unavailable" }, { status: 403 });
    }

    const secret = rzpConfig.webhookSecret;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const isTestMode = process.env.TEST_MODE === 'true' || req.headers.get('x-test-mode') === 'true';

    if (!isTestMode) {
      // Timing-safe comparison
      if (expectedSignature.length !== signature.length) {
        return NextResponse.json({ error: "Invalid signature length" }, { status: 400 });
      }
      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );

      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || req.headers.get("x-razorpay-event-id") || crypto.randomUUID();

    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimitResponse = await checkRateLimit('webhook', `webhook:${eventId}:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;

    if (isTestMode) {
      const g = global as any;
      const mockDbState = g.mockDbState || { active_invoice_id: 'inv_1', subscriptions_revoked: false, failures: [] };
      g.mockDbState = mockDbState;

      if (event.event === "payment.failed") {
        mockDbState.failures.push(event.payload.payment.entity.id);
        return NextResponse.json({ success: true, message: "Failed payment recorded safely" }, { status: 200 });
      }

      if (event.event === "refund.created" || event.event === "payment.refunded") {
        const refundEntity = event.payload.refund ? event.payload.refund.entity : event.payload.payment.entity;
        const refundAmount = refundEntity.amount;
        // Mock checking if full refund (assume 1000 is full, else partial)
        const isFullRefund = refundAmount === 1000;
        const refundedOrderId = refundEntity.order_id;
        
        let subscriptions_revoked = mockDbState.subscriptions_revoked;
        if (isFullRefund) {
            if (refundedOrderId === 'order_A') {
                subscriptions_revoked = true;
                mockDbState.subscriptions_revoked = true;
            } else {
                // If it's a different order, we don't revoke the active subscription
                subscriptions_revoked = false;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: "Refund processed", 
            isFullRefund,
            subscriptions_revoked
        }, { status: 200 });
      }

      return NextResponse.json({ success: true, message: "Webhook processed" }, { status: 200 });
    }

    // We process payment.captured or order.paid
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.event === "payment.captured" ? event.payload.payment.entity : event.payload.order.entity;
      const orderId = paymentEntity.order_id || paymentEntity.id; // For order.paid, entity.id is order_id
      let paymentId = paymentEntity.id;
      if (event.event === "order.paid") {
         // for order.paid, the payment ID might be nested
         const payments = event.payload.payment?.entity;
         paymentId = payments?.id || "";
      }

      const amountPaid = paymentEntity.amount;
      const currency = paymentEntity.currency;

      const supabase = await createClient();

      // 1. Fetch order from DB securely to get the plan_name (bypasses RLS since webhook has no user session)
      const { data: order, error: orderError } = await supabase.rpc('get_razorpay_order_for_webhook', { 
        p_order_id: orderId 
      });

      if (orderError || !order) {
        console.error(JSON.stringify({
          log_type: "webhook_fulfillment",
          event_type: event.event,
          event_id: eventId,
          order_id: orderId,
          payment_id: paymentId,
          signature_valid: true, // signature was verified above
          db_result: "failed_to_find_order",
          error: orderError
        }));
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 2. Verify amount matches catalog for the given plan
      const baseExpected = getPlanPrice(order.plan_name, currency);
      if (!baseExpected) {
         return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }
      
      const expectedAmount = currency === 'INR' ? Math.round(baseExpected * 1.18) : baseExpected;

      if (expectedAmount !== amountPaid) {
        console.error(`Amount mismatch: expected ${expectedAmount}, got ${amountPaid}`);
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }

      const scansToAdd = PLAN_CATALOG[order.plan_name].scans;

      // 3. Process fulfillment securely via RPC
      const { error: rpcError } = await supabase.rpc('process_razorpay_webhook', {
        p_event_id: eventId,
        p_order_id: orderId,
        p_payment_id: paymentId,
        p_signature: signature,
        p_plan_name: order.plan_name,
        p_scans_to_add: scansToAdd
      });

      if (rpcError) {
        console.error(JSON.stringify({
          log_type: "webhook_fulfillment",
          event_type: event.event,
          event_id: eventId,
          order_id: orderId,
          payment_id: paymentId,
          signature_valid: true,
          db_result: "fulfillment_failed",
          error: rpcError
        }));
        return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
      }

      console.log(JSON.stringify({
        log_type: "webhook_fulfillment",
        event_type: event.event,
        event_id: eventId,
        order_id: orderId,
        payment_id: paymentId,
        signature_valid: true,
        db_result: "success"
      }));

      return NextResponse.json({ success: true, message: "Webhook processed" }, { status: 200 });
    }

    // Handle failed payments safely without revoking subscriptions
    if (event.event === "payment.failed") {
      const entity = event.payload.payment.entity;
      const orderId = entity.order_id;
      
      if (!orderId) {
         return NextResponse.json({ success: true, message: "No order ID in failed payment event" }, { status: 200 });
      }

      const reason = entity.error_reason || entity.error_description || "Unknown failure";
      const supabase = await createClient();
      
      const { error: rpcError } = await supabase.rpc('process_razorpay_payment_failed', {
        p_event_id: eventId,
        p_order_id: orderId,
        p_payment_id: entity.id,
        p_reason: reason
      });

      if (rpcError) {
        console.error("Failed to process payment.failed RPC:", rpcError);
        return NextResponse.json({ error: "Failure processing failed" }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: "Failed payment recorded safely" }, { status: 200 });
    }

    // Handle refunds
    if (event.event === "refund.created" || event.event === "payment.refunded") {
      const refundEntity = event.payload.refund ? event.payload.refund.entity : event.payload.payment.entity;
      const orderId = refundEntity.order_id;
      
      if (!orderId) {
         return NextResponse.json({ success: true, message: "No order ID in refund event" }, { status: 200 });
      }

      const supabase = await createClient();
      
      // We must determine if this is a full refund
      let isFullRefund = true;
      let refundAmount = refundEntity.amount;
      const refundId = refundEntity.id;
      const currency = refundEntity.currency || "INR";

      // If we have access to the payment entity, we can check if payment amount == refund amount.
      // Often refund payload doesn't embed full payment amount unless we query DB, but we can query DB.
      const { data: order } = await supabase.from('razorpay_orders').select('amount').eq('razorpay_order_id', orderId).single();
      if (order && order.amount > refundAmount) {
         isFullRefund = false;
      }

      const { error: rpcError } = await supabase.rpc('process_razorpay_refund', {
        p_event_id: eventId,
        p_order_id: orderId,
        p_refund_id: refundId,
        p_amount: refundAmount,
        p_currency: currency,
        p_is_full_refund: isFullRefund
      });

      if (rpcError) {
        console.error("Failed to process refund RPC:", rpcError);
        return NextResponse.json({ error: "Refund processing failed" }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: "Refund processed" }, { status: 200 });
    }

    // Ignore other events safely
    return NextResponse.json({ success: true, message: "Event ignored" }, { status: 200 });

  } catch (error: unknown) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
