import './style.css';
import { initializePaddle } from '@paddle/paddle-js';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Missing #app container');
}

app.innerHTML = `
  <main>
    <header>
      <p class="eyebrow">Reproduction</p>
      <h1>Only one Paddle checkout stays mounted</h1>
      <p>
        Click both buttons to mount inline checkout frames. As soon as the second
        checkout renders, the first container is cleared by the Paddle SDK.
      </p>
      <p class="note">
        Enter your Paddle sandbox <strong>client token</strong> and <strong>price ID</strong> below,
        then render each checkout.
      </p>

      <form class="input-grid" autocomplete="off">
        <label>
          <span>Client token</span>
          <input id="client-token" name="client-token" type="text" placeholder="pdl_sandbox_..." />
        </label>
        <label>
          <span>Price ID</span>
          <input id="price-id" name="price-id" type="text" placeholder="pri_..." />
        </label>
      </form>
    </header>

    <section class="grid">
      <article class="panel">
        <div class="panel__head">
          <h2>Checkout A</h2>
          <button id="open-a" type="button">Render Checkout</button>
        </div>
        <div class="checkout-frame checkout-a"></div>
      </article>

      <article class="panel">
        <div class="panel__head">
          <h2>Checkout B</h2>
          <button id="open-b" type="button">Render Checkout</button>
        </div>
        <div class="checkout-frame checkout-b"></div>
      </article>
    </section>
  </main>
`;

let clientToken = '';
let priceId = '';
let paddlePromise: ReturnType<typeof initializePaddle> | null = null;
let lastToken: string | null = null;

const tokenInput = document.getElementById('client-token') as HTMLInputElement | null;
const priceInput = document.getElementById('price-id') as HTMLInputElement | null;

tokenInput?.addEventListener('input', (event) => {
  clientToken = (event.target as HTMLInputElement).value.trim();
  if (clientToken !== lastToken) {
    paddlePromise = null;
  }
});

priceInput?.addEventListener('input', (event) => {
  priceId = (event.target as HTMLInputElement).value.trim();
});

function getPaddle() {
  if (!clientToken) {
    return Promise.resolve(undefined);
  }

  if (!paddlePromise || clientToken !== lastToken) {
    lastToken = clientToken;
    paddlePromise = initializePaddle({
      environment: 'sandbox',
      token: clientToken,
      eventCallback: (event) => {
        console.log('[PADDLE EVENT]', event.name, event);
      },
    });
  }

  return paddlePromise;
}

async function openInline(targetId: string) {
  if (!clientToken || !priceId) {
    alert('Enter client token and price ID before opening the checkout.');
    return;
  }

  const paddle = await getPaddle();
  if (!paddle) {
    alert('Paddle failed to initialize. Check your client token.');
    return;
  }

  await paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData: { example: 'dual-inline' },
    settings: {
      displayMode: 'inline',
      frameTarget: targetId,
      frameInitialHeight: 460,
      frameStyle: 'width: 100%; background-color: transparent; border: none;',
    },
  });
}

document.getElementById('open-a')?.addEventListener('click', () => openInline('checkout-a'));
document.getElementById('open-b')?.addEventListener('click', () => openInline('checkout-b'));
