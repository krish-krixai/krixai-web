"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRazorpayConfig = validateRazorpayConfig;
exports.getRazorpayConfig = getRazorpayConfig;
function validateRazorpayConfig(env) {
    const mode = env.RAZORPAY_MODE || 'disabled';
    if (mode !== 'test' && mode !== 'live' && mode !== 'disabled') {
        throw new Error("RAZORPAY_MODE must be 'test', 'live', or 'disabled'");
    }
    let keyId = '';
    let keySecret = '';
    let webhookSecret = '';
    if (mode === 'test') {
        keyId = env.RAZORPAY_TEST_KEY_ID || '';
        keySecret = env.RAZORPAY_TEST_KEY_SECRET || '';
        webhookSecret = env.RAZORPAY_TEST_WEBHOOK_SECRET || '';
        if (!keyId.startsWith('rzp_test_'))
            throw new Error("Test mode requires rzp_test_ key");
        if (!keySecret)
            throw new Error("Missing RAZORPAY_TEST_KEY_SECRET");
        if (!webhookSecret)
            throw new Error("Missing RAZORPAY_TEST_WEBHOOK_SECRET");
    }
    else if (mode === 'live') {
        keyId = env.RAZORPAY_LIVE_KEY_ID || '';
        keySecret = env.RAZORPAY_LIVE_KEY_SECRET || '';
        webhookSecret = env.RAZORPAY_LIVE_WEBHOOK_SECRET || '';
        if (!keyId.startsWith('rzp_live_'))
            throw new Error("Live mode requires rzp_live_ key");
        if (!keySecret)
            throw new Error("Missing RAZORPAY_LIVE_KEY_SECRET");
        if (!webhookSecret)
            throw new Error("Missing RAZORPAY_LIVE_WEBHOOK_SECRET");
    }
    return {
        mode,
        keyId,
        keySecret,
        webhookSecret,
        isCheckoutEnabled: env.CHECKOUT_ENABLED === 'true'
    };
}
let cachedConfig = null;
function getRazorpayConfig() {
    if (!cachedConfig) {
        cachedConfig = validateRazorpayConfig(process.env);
    }
    return cachedConfig;
}
