# G$ Tip Jar

An app built to make tipping creators easy, powered by **GoodDollar (G$)** on **Celo**.

Tip Jar lets digital creators set up a public tipping page so fans can support them with G$ — GoodDollar's daily Universal Basic Income token.

> **Status:** Prototype — tipping flow is simulated; wallet integration with GoodWallet on Celo is planned.

## Overview

**Creator dashboard**
- Manage profile (name, handle, bio, social links)
- Track tip analytics and recent messages
- Share a tipping link, QR code, or embeddable widget

**Public tipping page**
- Fans choose an amount in G$ and optionally leave a message
- Tips are recorded in a local ledger (simulated for now)

## Tech Stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | React 19, Vite, Lucide icons, hash-based routing |
| Backend  | Express.js, CORS                               |
| Storage  | Local `database.json` (profiles + tip ledger)    |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5001`.

### 2. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## API Endpoints

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | `/api/profile` | Get creator profile      |
| POST   | `/api/profile` | Create or update profile |
| GET    | `/api/tips`    | List all tips            |
| POST   | `/api/tips`    | Record a new tip         |

## License

MIT
