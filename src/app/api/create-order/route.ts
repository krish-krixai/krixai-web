import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { checkRateLimit } = await import('@/utils/rate-limit');
    const rateLimitResponse = await checkRateLimit('order', `order:${user.id}`);
    if (rateLimitResponse) return rateLimitResponse;

    const { plan_name, workspace_id, amount, currency } = await req.json();

    // Workspace ownership check
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    // Create order with Razorpay
    // Assume amount is already passed appropriately or mapped
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency: currency || "USD",
      receipt: `rcpt_${workspace_id.substring(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
    }

    // Save pending order to database
    await supabase.from('razorpay_orders').insert({
      workspace_id: workspace_id,
      razorpay_order_id: order.id,
      plan_name: plan_name,
      amount: amount,
      currency: options.currency,
      status: 'CREATED'
    });

    // Return the order ID to frontend
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: key_id
    }, { status: 200 });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
