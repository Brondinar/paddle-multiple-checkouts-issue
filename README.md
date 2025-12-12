# Paddle multiple inline checkouts repro (Vite)

A minimal Vite + TypeScript app that demonstrates how the Paddle JavaScript SDK only keeps
one checkout instance open at a time. Rendering the checkout inside a second inline target
causes Paddle to close the first iframe automatically.

## Prerequisites

- Node 18+
- `pnpm` (or switch the commands to npm/yarn)
- Paddle sandbox `client_token` and a `price_id`

## Running the repro

1. Install dependencies and start Vite:
   ```sh
   pnpm install
   pnpm dev
   ```
2. Open the page in your browser, paste your sandbox client token and price ID into the
   fields in the header, then click **Render Checkout** on panel A followed by panel B.

## Expected vs actual

- **Expected:** Both containers keep their own inline checkout frames mounted.
- **Actual:** When panel B opens the checkout, Paddle tears down the iframe inside
  panel A before rendering the new one.
