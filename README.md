# 🚀 CMS-PLATFORM | Enterprise Headless CMS Platform

An enterprise-grade, **multi-tenant**, API-first headless CMS platform built for high-scale digital experiences. Designed with a **Monorepo** architecture for seamless development across the admin dashboard, serverless backend, and shared libraries.

## 🏗 System Architecture

This project is managed as a high-performance monorepo using **pnpm workspaces** and **Turborepo**:

- **`apps/admin` (Next.js 15):** A robust, role-based Admin Panel with real-time content editing, tenant management, and a high-fidelity UI built on Shadcn/UI.
- **`apps/backend` (Firebase Functions v2):** A scalable, serverless API layer handling multi-tenant isolation, media processing, and enterprise workflows.
- **`packages/ui`:** A shared React component library ensuring design consistency across all current and future internal applications.
- **`packages/shared`:** Centralized TypeScript definitions, validation schemas (Zod), and utility functions shared between the frontend and backend.

## ✨ Key Features

- 🌍 **Multi-Tenancy:** Hard-isolated data environments with custom tenant-specific configurations and subdomains.
- 🔐 **Enterprise Auth:** Powered by Firebase Identity Platform with support for Custom Claims, RBAC (Role-Based Access Control), and Multi-Factor Authentication.
- 📦 **API-First & Headless:** High-performance REST/GraphQL endpoints for content delivery to any frontend or mobile application.
- 🚀 **Edge Optimized:** Leveraging Next.js App Router and Cloud Functions v2 for low-latency global delivery.
- 🎨 **Structured Content:** Dynamic content modeling with versioning, draft/publish workflows, and localization support.

## 🛠 Tech Stack

| Component            | Technology                                                     |
| :------------------- | :------------------------------------------------------------- |
| **Frontend**         | Next.js 15, Tailwind CSS, Shadcn/UI, TanStack Query            |
| **Backend**          | Firebase Functions v2 (Node.js/TypeScript), Cloud Firestore    |
| **Database**         | Google Cloud Firestore (NoSQL, Multi-tenant structure)         |
| **Auth/Identity**    | Firebase Identity Platform (Blocking Functions, Custom Claims) |
| **Monorepo Tooling** | Turborepo, pnpm workspaces, tsup (bundling)                    |

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ & pnpm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase Project with **Identity Platform** enabled.

### Installation

```bash
# Clone the repository
git clone [https://github.com/sunildivyam/cms-platform.git](https://github.com/sunildivyam/cms-platform.git)

# Install dependencies
pnpm install

# Start development environment
pnpm dev
```

## 🔐 Security & Multi-tenancy

This platform utilizes **Firebase Auth Blocking Functions** `(beforeUserCreated)` to atomically provision tenants and inject `tenantId`custom claims into user tokens. This ensures data isolation at the infrastructure level via Firestore Security Rules.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
