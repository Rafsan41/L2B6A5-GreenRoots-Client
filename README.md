# MediStore Client

> **"Your Trusted Online Medicine Shop"**

A full-stack OTC (over-the-counter) medicine e-commerce frontend built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Features role-based dashboards, Google OAuth, cart management, and a fully responsive UI with dark mode support.

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)
![Better Auth](https://img.shields.io/badge/Better--Auth-1.6-purple)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

---

## Live Links

| | URL |
|---|---|
| 🖥️ **Frontend Live** | https://medicinestores.vercel.app |
| ⚙️ **Backend Live** | https://medistores.vercel.app |
| 📦 **Frontend Repo** |[ https://github.com/Rafsan41/L2B6A4](https://github.com/Rafsan41/L2B6A4-Prisma-Next-MediStore-Client) |
| 📦 **Backend Repo** | https://github.com/Rafsan41/L2B6A4-Prisma-Next-MediStore-Server |

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medistores.com | admin123456 |
| Seller | rafsundipto116@gmail.com | rafsan1234 |
| Customer | zayan@gmail.com | zayan1234 |

---

## Features

- 🔐 **Authentication** — Email/password + Google OAuth via Better Auth, with email verification flow
- 👤 **Role-based routing** — Separate dashboards for Admin, Seller, and Customer using Next.js parallel routes
- 🏪 **Seller workflow** — Sellers register, verify email, wait for admin approval, then manage their medicines
- 💊 **Medicine catalog** — Browse, search, filter by category/price/manufacturer with pagination
- 🛒 **Cart & Checkout** — Persistent cart via Zustand, checkout with shipping details
- 📦 **Bulk ordering** — Sellers can bulk-order medicines (minimum 100 units) for stock restocking
- ⭐ **Reviews** — Medicine reviews and threaded seller reviews with replies
- 📊 **Dashboards** — Charts and stats for admin, seller, and customer via Recharts
- 🌙 **Dark / Light mode** — System-aware theme toggle via next-themes
- 📱 **Responsive** — Mobile-first design with sheet-based mobile filters and navigation

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework (App Router, Server Components, API proxy rewrites) |
| **React** | 19 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | 4.x | Accessible component library (Radix UI based) |
| **Better Auth** | 1.6.x | Authentication (email/password + Google OAuth) |
| **Zustand** | 5.x | Cart state management |
| **Recharts** | 3.x | Dashboard charts |
| **TanStack Table** | 8.x | Data tables for dashboards |
| **Embla Carousel** | 8.x | Hero & feature carousels |
| **Sonner** | 2.x | Toast notifications |
| **Lucide React** | 1.x | Icon library |
| **next-themes** | 0.4.x | Dark/light mode |
| **Zod** | 4.x | Environment variable validation |

---

## Project Structure

```
src/
├── app/
│   ├── (CommonLayOut)/          # Public + auth pages with shared Navbar/Footer
│   │   ├── home/                # Homepage — hero, categories, featured medicines
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── signup/              # Signup page
│   │   ├── verify-email/        # Email verification callback handler
│   │   ├── about/               # About page
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout flow
│   │   ├── orders/              # Order history + order detail [id]
│   │   ├── profile/             # User profile
│   │   ├── categories/          # All categories + category detail [slug]
│   │   ├── medicines/           # All medicines + medicine detail [slug]
│   │   └── layout.tsx           # Shared layout (Navbar + Footer)
│   │
│   ├── (dashboardlayout)/       # Role-based dashboard with parallel routes
│   │   ├── @admin/              # Admin dashboard slot
│   │   ├── @seller/             # Seller dashboard slot
│   │   ├── @customer/           # Customer dashboard slot
│   │   └── layout.tsx           # Dashboard layout (sidebar navigation)
│   │
│   ├── routes/                  # Sidebar route definitions per role
│   │   ├── adminRoutes.tsx
│   │   ├── sellerRoutes.tsx
│   │   └── customerRoutes.tsx
│   ├── types/                   # App-level TypeScript types
│   ├── providers/               # ThemeProvider (next-themes)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── error.tsx                # Error boundary
│   ├── loading.tsx              # Global loading state
│   └── not-found.tsx            # 404 page
│
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── layout/                  # Navbar, Footer, CartIcon, ModeToggle, Carousel
│   ├── home/                    # HeroCarousel, CategoryCard, MedicineCard, HowItWorks, Testimonials
│   ├── categories/              # CategoriesGrid, CategoryHero, Filters, FeaturedBanner
│   ├── medicines/               # MedicinesHero
│   ├── products/                # ProductCard, ProductFilters, ProductSort, Pagination
│   ├── medicine-detail/         # DetailHero, DetailTabs, RelatedMedicines
│   ├── adminDashboard/          # Chart, Overview
│   ├── auth/                    # LoginBrandPanel, RegisterBrandPanel
│   ├── login-form.tsx           # Login form with Google OAuth
│   └── signup-form.tsx          # Signup form with role selection (Customer / Seller)
│
├── services/                    # API call functions (fetch wrappers per domain)
│   ├── admin.service.ts
│   ├── category.service.ts
│   ├── medicine.service.ts
│   ├── order.service.ts
│   ├── seller.service.ts
│   └── user.service.ts
│
├── store/
│   └── cart.store.ts            # Zustand cart store (persisted to localStorage)
│
├── lib/
│   ├── auth-client.ts           # Better Auth client (baseURL = frontend proxy)
│   ├── utils.ts                 # cn() Tailwind utility helper
│   ├── dashboard-url.ts         # Role → dashboard URL resolver
│   └── category-icon.ts         # Category slug → icon mapping
│
├── hooks/
│   ├── use-mobile.ts            # Mobile breakpoint detection hook
│   └── useRecentlyViewed.ts     # Recently viewed medicines (localStorage)
│
├── constants/
│   └── role.ts                  # ROLE constants (ADMIN, SELLER, CUSTOMER)
│
├── types/                       # Shared TypeScript interfaces
│   ├── medicine.ts
│   ├── category.ts
│   └── order.ts
│
├── env.ts                       # Zod-validated environment variables
└── proxy.ts                     # API base URL helper
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Rafsan41/L2B6A4.git
cd prisma-next-medistore-client
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Frontend URL (used for Google OAuth callback)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

> The Next.js proxy in `next.config.ts` rewrites `/api/*` → `NEXT_PUBLIC_BACKEND_URL/api/*`,
> so all API and auth requests stay on the same origin — no CORS issues, no cookie loss.

### 3. Run Development Server

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Pages Overview

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/home` |
| `/home` | Public | Hero carousel, featured categories, medicines |
| `/categories` | Public | All medicine categories |
| `/categories/[slug]` | Public | Category detail with filtered medicines |
| `/medicines` | Public | Full medicine catalog with search & filters |
| `/medicines/[slug]` | Public | Medicine detail, reviews, related medicines |
| `/about` | Public | About MediStore |
| `/login` | Guest | Email/password + Google OAuth login |
| `/register` / `/signup` | Guest | Create account (Customer or Seller) |
| `/verify-email` | Guest | Email verification callback handler |
| `/cart` | Customer / Seller | Shopping cart |
| `/checkout` | Customer / Seller | Place order with shipping details |
| `/orders` | Customer / Seller | Order history |
| `/orders/[id]` | Customer / Seller | Order detail |
| `/profile` | Authenticated | View & edit profile |
| `/admin-dashboard` | Admin only | Platform overview — users, medicines, orders, stats |
| `/seller-dashboard` | Seller only | Manage medicines, orders, and stats |
| `/dashboard` | Customer only | Order history, reviews, and stats |

---

## Authentication Flow

### Email / Password
```
Register → Verification email sent → Click link → Auto sign-in → Redirect by role
```

### Google OAuth
```
Click "Continue with Google"
→ Google consent screen
→ Callback to /api/auth/callback/google (proxied to backend via Next.js)
→ Session created → Redirect to /home
```

### Seller Approval
```
Register as Seller → Verify email → Status: PENDING
→ Admin approves → Status: ACTIVE → Can log in
```

---

## Role-Based Routing

After login, users are redirected based on their role:

| Role | Redirect |
|------|----------|
| `ADMIN` | `/admin-dashboard` |
| `SELLER` | `/seller-dashboard` |
| `CUSTOMER` | `/home` |

Dashboard pages use **Next.js parallel routes** (`@admin`, `@seller`, `@customer` slots) so each role sees only their own dashboard content within the shared sidebar layout.

---

## Cart & State Management

Cart state is managed with **Zustand** and persisted to `localStorage`:

- Customers: Add to cart with quantity selector
- Sellers: Bulk add only (minimum 100 units per order)
- Quantity update & item removal
- Cart total calculated dynamically
- Cart icon in Navbar shows live item count

---

## API Proxy

All requests go through the Next.js proxy defined in `next.config.ts`:

```ts
{ source: "/api/:path*", destination: `${BACKEND}/api/:path*` }
```

Benefits:
- Auth cookies stay on the same origin — sessions work correctly
- No CORS configuration needed on the frontend
- Google OAuth state cookie is consistent — no `state_mismatch` errors

---

## Deployment

Deployed on **Vercel**. Set the following environment variables in your Vercel project:

```env
NEXT_PUBLIC_BACKEND_URL=https://medistores.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://medicinestores.vercel.app
```

---

## Author

**Rafsan Jani Dipta**
