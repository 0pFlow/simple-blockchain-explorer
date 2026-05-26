# Simple Blockchain Explorer

A lightweight Ethereum block explorer built with vanilla TypeScript, Vite, and [viem](https://viem.sh/). It connects to the Sepolia testnet to look up account balances, browse recent blocks, inspect a block's transactions, and broadcast new transactions from a local wallet client.

This project is a school assignment for Medieinstitutet exploring Web3 fundamentals with a minimal toolchain (no framework).

## Features

- **Account balance lookup** — enter any Ethereum address on the start page and see its balance in ETH.
- **Recent blocks list** — view the 10 most recent blocks on the connected network, including block number, hash, and timestamp.
- **Block / transaction details** — click through to see gas used, gas limit, block hash, and every transaction in a block (from, to, gas, value).
- **Create transaction** — a form to send ETH between accounts via a local wallet client, with client-side validation for address format and available balance.
- **Responsive UI** — pure CSS layout with a Font Awesome icon set and a mobile-friendly hamburger menu.
- **Unit tests** — Vitest + happy-dom test setup covering the balance-lookup flow.

## Tech Stack

- **Language:** TypeScript (ES modules)
- **Build tool / dev server:** [Vite](https://vitejs.dev/) (port `3000`)
- **Blockchain client:** [viem](https://viem.sh/) — `createPublicClient` for read calls, `createWalletClient` for sending transactions
- **Networks:** Sepolia testnet (public read client) and `localhost` (wallet client, e.g. for Hardhat/Anvil/Ganache)
- **Testing:** [Vitest](https://vitest.dev/) with [happy-dom](https://github.com/capricorn86/happy-dom)
- **Styling:** Vanilla CSS + [Font Awesome 6.5](https://fontawesome.com/) (via CDN)

## Project Structure

```
.
├── index.html                  # Start page — balance lookup
├── index.ts                    # Start page logic
├── index.test.ts               # Vitest tests for balance lookup
├── helpers/
│   ├── network.ts              # viem public + wallet client factories
│   └── dom.ts                  # Small DOM helpers
├── pages/
│   ├── blocks.html / .ts       # Recent blocks list
│   ├── transaction.html / .ts  # Block + transaction details
│   ├── transactions.html / .ts # Transactions view
│   └── create-transaction.html / .ts  # Send ETH form
├── assets/
│   ├── site.css
│   └── navigation.css
├── vite.config.js
└── vitest.config.js
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- An Ethereum RPC URL for the network you want to use (Sepolia for read calls, a local node such as Hardhat / Anvil / Ganache on `http://127.0.0.1:8545` if you want to test sending transactions)

### Install

```bash
npm install
```

### Configure the RPC endpoint

Both the public client (Sepolia) and the wallet client (localhost) read the RPC URL from the Vite environment variable `VITE_RPC_URL`. Create a `.env` file in the project root:

```
VITE_RPC_URL=https://sepolia.infura.io/v3/<YOUR_PROJECT_ID>
```

You can use any provider that exposes a JSON-RPC HTTPS endpoint (Infura, Alchemy, Ankr, a public Sepolia RPC, or your own node).

`.env` is already in `.gitignore` — do not commit your RPC URL or any API keys.

### Run the dev server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test           # one-shot
npm run test:watch # watch mode
```

## Usage

1. **Start page** — paste an Ethereum address (e.g. `0x93b29E645493441c2DBD78FECe0A477070C881f4`) into the search box and press Enter or click the search icon to see its Sepolia balance.
2. **Block** — opens a list of the 10 latest blocks. Click *Show* on any block to view its transactions.
3. **Transaction** — shows the block summary (gas used / limit, timestamp, hash) and every transaction it contains.
4. **Transaction (create)** — fill in sender, recipient, and value (in ETH) to broadcast a transaction via the wallet client. Note: this targets the `localhost` chain by default, so you'll need a local node with an unlocked account.

## Network Notes

- The **public client** is hard-coded to `sepolia` in `helpers/network.ts`. Change the imported chain (e.g. `mainnet`, `holesky`) if you want to point at a different network.
- The **wallet client** is hard-coded to `localhost`. For real-world signing you'd typically swap this for an injected provider (MetaMask) via `custom(window.ethereum)`.

## License

ISC (see `package.json`).
