# AkMoney Standalone React & TypeScript Frontend

[![CI/CD Pipeline](https://github.com/akintoyesodeinde/akmoney-frontend/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/akintoyesodeinde/akmoney-frontend/actions/workflows/ci-cd.yml)

This repository contains the standalone, responsive React 18 + TypeScript single-page application (SPA) for **AkMoney**, designed using Google Stitch fintech design tokens. It provides an intuitive, accessible interface for multi-currency wallets, cross-border remittances, real-time recipient management, and transaction tracking.

---

## 1. Technology Stack

- **Framework:** React 18 (Functional Components, Hooks)
- **Language:** TypeScript 5.5+ (Strict Mode)
- **Build Tool:** Vite 5.x
- **Styling:** Tailwind CSS 3.4 (Google Stitch Fintech Palette: Deep Navy, Mint, Electric Blue)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Web Server:** Production Nginx 1.27 Alpine (SPA routing fallback, gzip, security headers)
- **CI/CD:** GitHub Actions with Docker Hub publishing & AWS IAM OIDC federation

---

## 2. Directory Structure

```
akmoney-frontend/
├── public/               # Favicons, Stitch logos, and static assets
├── src/
│   ├── components/       # UI components, layout structures, and common modals
│   │   ├── common/       # PinModal and shared interactive controls
│   │   ├── layout/       # AppLayout, AuthLayout, Sidebar, Header, BottomNav
│   │   └── ui/           # Button, Card, Badge, Input, Modal, StepWizard
│   ├── context/          # React Context providers (AuthContext, WalletContext)
│   ├── pages/            # View pages (Dashboard, Wallets, SendMoney, Recipients, etc.)
│   ├── services/         # Typed API clients (api.ts, authService, walletService, etc.)
│   ├── types/            # TypeScript data contracts (auth, wallet, recipient, remittance)
│   ├── App.tsx           # Application router and protected route boundaries
│   ├── index.css         # Tailwind directives and custom animation styles
│   └── main.tsx          # React application entrypoint
├── nginx.conf            # Hardened Nginx production configuration
├── Dockerfile            # Multi-stage production container
├── docker-compose.yml    # Standalone container testing
├── .env.example          # Environment template
└── package.json          # Dependencies and build scripts
```

---

## 3. Local Development

### Prerequisites
- Node.js 20.x or higher
- NPM 10.x or higher

### Commands
```bash
# 1. Clone repository
git clone https://github.com/akintoyesodeinde/akmoney-frontend.git
cd akmoney-frontend

# 2. Install dependencies
npm ci

# 3. Configure environment
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000/api

# 4. Run TypeScript checks
npm test

# 5. Start development server
npm run dev
```
Dev server will start at `http://localhost:3000`.

---

## 4. Docker Production Container

### Build and Run Locally
```bash
docker compose up -d --build
```
Access the application at `http://localhost:3000`.

### Health Check Endpoint
```bash
curl http://localhost:3000/health
# Returns: healthy
```
