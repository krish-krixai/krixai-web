This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Razorpay Configuration

To enable payments securely, configure either Test mode or Live mode explicitly:

1. **Mode Setting**: Set `RAZORPAY_MODE=test` or `RAZORPAY_MODE=live`. To disable payments locally, set `RAZORPAY_MODE=disabled`.
2. **Checkout Flag**: Checkout UI is disabled by default. Set `CHECKOUT_ENABLED=true` to enable the purchase buttons in the UI.
3. **Test Mode Keys** (Required if `RAZORPAY_MODE=test`):
   - `RAZORPAY_TEST_KEY_ID`: Must start with `rzp_test_`
   - `RAZORPAY_TEST_KEY_SECRET`
   - `RAZORPAY_TEST_WEBHOOK_SECRET`: Note: This must be the *Webhook Secret* from the Razorpay Webhooks dashboard, NOT the API key secret.
4. **Live Mode Keys** (Required if `RAZORPAY_MODE=live`):
   - `RAZORPAY_LIVE_KEY_ID`: Must start with `rzp_live_`
   - `RAZORPAY_LIVE_KEY_SECRET`
   - `RAZORPAY_LIVE_WEBHOOK_SECRET`: Note: This must be the *Webhook Secret* from the Razorpay Webhooks dashboard, NOT the API key secret.

The application will fail to start if the keys do not match the selected mode.
