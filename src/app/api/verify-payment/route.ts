import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, workspace_id, plan_name } = await req.json();

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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay payment parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Verify the payment signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Determine limits based on plan
    const limits = { starter: 10000, pro: 100000, enterprise: 1000000 };
    const requestLimit = limits[plan_name as keyof typeof limits] || 1000;

    // 2 & 4. Update the workspace plan and monthly_request_limit in Supabase
    const { error: workspaceError } = await supabase
      .from('workspaces')
      .update({ 
        plan: plan_name,
        monthly_request_limit: requestLimit 
      })
      .eq('id', workspace_id);

    if (workspaceError) throw workspaceError;

    // 3. Update the subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        workspace_id,
        plan: plan_name,
        status: 'active',
        payment_provider: 'razorpay',
        provider_subscription_id: razorpay_payment_id,
      });

    if (subError) throw subError;

    // Optional: update the razorpay_orders table status to PAID
    await supabase.from('razorpay_orders').update({ status: 'PAID' }).eq('razorpay_order_id', razorpay_order_id);

    return NextResponse.json({ success: true, message: "Payment verified and workspace updated" }, { status: 200 });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
