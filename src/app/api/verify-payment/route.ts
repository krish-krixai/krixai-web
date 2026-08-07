import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { resolveWorkspace } from "@/utils/workspace";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify User Authorization
    try {
      await resolveWorkspace(req, 'OWNER');
    } catch (authError: any) {
      if (authError.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json({ error: authError.message }, { status: 403 });
    }

    const { razorpay_order_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay payment parameters" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Purely poll the DB for the order status which should have been updated by the webhook
    const { data: order, error: orderError } = await supabase
      .from('razorpay_orders')
      .select('status')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === 'PAID') {
      return NextResponse.json({ success: true, message: "Payment verified successfully via webhook" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Payment not yet confirmed by webhook" }, { status: 202 });
    }

  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
