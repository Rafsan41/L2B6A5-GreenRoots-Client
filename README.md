# GreenRoots — Frontend

> **"Rooted in Nature · Delivered to You"**

A full-stack herbal & organic wellness e-commerce frontend built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Features role-based dashboards, Google OAuth, SSLCommerz online payment, persistent cart, and a fully responsive botanical-themed UI with dark mode support.

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
| 🌿 **Frontend Live** | https://greenroots-mauve.vercel.app |
| ⚙️ **Backend Live** | https://greenroots-server.vercel.app |
| 📦 **Frontend Repo** | https://github.com/Rafsan41/L2B6A5-GreenRoots-Client |
| 📦 **Backend Repo** | https://github.com/Rafsan41/L2B6A5-GreenRoots-Server |

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@greenroots.app | Admin@greenroots1 |
| Seller | seller@greenroots.app | Seller@greenroots1 |
| Customer | customer@greenroots.app | Customer@greenroots1 |

---

## Features

- 🔐 **Authentication** — Email/password with verification + Google OAuth via Better Auth
- 👤 **Role-based routing** — Separate dashboards for Admin, Seller, and Customer using Next.js parallel routes
- 🏪 **Seller workflow** — Register → verify email → admin approval → manage medicines
- 🌿 **Herb catalog** — Browse, search, filter by category/price/manufacturer with pagination
- 🛒 **Cart & Checkout** — Persistent cart via Zustand with Cash on Delivery or Online Payment
- 💳 **SSLCommerz Payment** — bKash, card, and mobile banking via SSLCommerz gateway
- 📦 **Order tracking** — Real-time order status timeline with cancel support
- ⭐ **Reviews** — Medicine reviews and threaded seller reviews with replies
- 📊 **Dashboards** — Charts and stats for admin, seller, and customer via Recharts
- 🌙 **Dark / Light mode** — System-aware theme toggle
- 📱 **Fully responsive** — Mobile-first botanical design across all screen sizes

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework (App Router, API proxy rewrites) |
| **React** | 19 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | — | Accessible component library (Radix UI based) |
| **Better Auth** | 1.6.x | Authentication client |
| **Zustand** | 5.x | Cart state management (persisted to localStorage) |
| **Recharts** | 3.x | Dashboard charts |
| **Sonner** | 2.x | Toast notifications |
| **Lucide React** | — | Icon library |
| **next-themes** | — | Dark/light mode |

---

## Project Structure

```
src/
├── app/
│   ├── (CommonLayOut)/          # Public pages with shared Navbar + Footer
│   │   ├── home/                # Homepage — split hero, categories, testimonials
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── verify-email/        # Email verification handler
│   │   ├── about/               # About page
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout (COD + Online Payment)
│   │   ├── orders/              # Order history + order detail [id]
│   │   ├── profile/             # User profile
│   │   ├── categories/          # All categories + [slug] detail
│   │   ├── medicines/           # All herbs + [slug] detail
│   │   └── payment/             # success / fail / cancel result pages
│   │
│   └── (DashboardLayOut)/       # Role-based dashboard with parallel routes
│       ├── @admin/              # Admin dashboard slot
│       ├── @seller/             # Seller dashboard slot
│       └── @customer/           # Customer dashboard slot
│
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── layout/                  # Navbar, Footer, CartIcon, ModeToggle
│   ├── home/                    # SplitHero, FieldToJar, MagazineTestimonials, HerbLetter
│   ├── categories/              # CategoryHero, FeaturedCategoryBanner, WhyChooseUs
│   └── icons/                   # Botanical SVG icons (FernSVG, JarSVG, CornerVineSVG)
│
├── services/                    # Typed fetch wrappers per domain
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
│   ├── auth-client.ts           # Better Auth client
│   ├── utils.ts                 # cn() Tailwind helper
│   └── dashboard-url.ts         # Role → dashboard URL resolver
│
├── types/                       # Shared TypeScript interfaces
│   ├── medicine.ts
│   ├── category.ts
│   └── order.ts                 # Includes PaymentMethod, PaymentStatus
│
├── constants/
│   └── role.ts                  # ROLE constants
│
├── proxy.ts                     # Next.js middleware — auth + role-based route protection
└── middleware.ts                # Exports proxy config + matcher
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Rafsan41/L2B6A5-GreenRoots-Client.git
cd L2B6A5-GreenRoots-Client
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Backend URL — Next.js rewrites /api/* → this
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Auth URL (server-side session checks)
AUTH_URL=http://localhost:5000/api/auth

# Frontend URL for env.ts schema
FONTEND_URL=http://localhost:3000
```

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
| `/home` | Public | Split hero, herb guide, testimonials, newsletter |
| `/categories` | Public | All herb categories |
| `/categories/[slug]` | Public | Category detail with filtered herbs |
| `/medicines` | Public | Full herb catalog with search & filters |
| `/medicines/[slug]` | Public | Herb detail, dosage, reviews |
| `/about` | Public | About GreenRoots |
| `/login` | Guest | Email/password + Google OAuth |
| `/register` | Guest | Create account (Customer or Seller) |
| `/cart` | Authenticated | Shopping cart |
| `/checkout` | Authenticated | Place order — COD or Online Payment |
| `/orders` | Authenticated | Order history with payment status |
| `/orders/[id]` | Authenticated | Order detail with tracking timeline |
| `/payment/success` | Public | Payment confirmed → redirect to order |
| `/payment/fail` | Public | Payment failed — cart preserved |
| `/payment/cancel` | Public | Payment cancelled — cart preserved |
| `/admin-dashboard` | Admin only | Users, medicines, orders, categories, stats |
| `/seller-dashboard` | Seller only | Manage medicines, orders, dashboard |
| `/dashboard` | Customer only | Order history, reviews, stats |

---

## Payment Flow

```
Checkout → select "Online Payment" → Place Order
→ POST /api/payment/init → redirect to SSLCommerz gateway
→ Customer pays (bKash / card / mobile banking)
→ SSLCommerz → POST to backend success URL
→ Order marked PAID → cart cleared → redirect to /orders/[id]

If payment fails  → /payment/fail  (cart preserved, can retry)
If payment cancel → /payment/cancel (cart preserved)
```

---

## Authentication Flow

### Email / Password
```
Register → Verification email sent → Click link → Auto sign-in → Redirect by role
```

### Google OAuth
```
Click "Continue with Google" → Google consent
→ Callback to /api/auth/callback/google (proxied to backend)
→ Session created → Redirect by role
```

### Seller Approval
```
Register as Seller → Verify email → Status: PENDING
→ Admin approves → Status: ACTIVE → Can log in
```

---

## Role-Based Routing

| Role | Landing Page |
|------|-------------|
| `ADMIN` | `/admin-dashboard` |
| `SELLER` | `/seller-dashboard` |
| `CUSTOMER` | `/home` |

The middleware in `proxy.ts` enforces role isolation — admins can't access seller/customer pages and vice versa.

---

## API Proxy

All requests go through the Next.js rewrite in `next.config.ts`:

```ts
{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }
```

Benefits:
- Auth cookies stay on the same origin
- No CORS issues
- Google OAuth state cookie remains consistent

---

## Deployment (Vercel)

```bash
vercel --prod
```

Set these environment variables in your Vercel project:

```env
NEXT_PUBLIC_BACKEND_URL=https://greenroots-server.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://greenroots-mauve.vercel.app
AUTH_URL=https://greenroots-server.vercel.app/api/auth
FONTEND_URL=https://greenroots-mauve.vercel.app
```

---

## Author

**Rafsan Jani Dipta**
