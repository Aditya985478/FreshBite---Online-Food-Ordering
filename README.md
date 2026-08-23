# 🍕 FreshBite – Online Food Ordering Platform

A fully functional, **frontend-only** online food ordering website built for the
*Free Web Development Internship Online* task (**WD-EC-001 · Data Alcott Systems**).

FreshBite lets users browse restaurants, explore rich menus, filter by dietary needs,
add dishes to a cart, apply coupons, check out with simulated payments and follow their
order live on a tracking page — all without a backend or database.

---

## 🚀 Live Demo

> Deploy on GitHub Pages / Netlify / Vercel and paste your link here:
>
> **Live URL:** `_add your deployed link_`
>
> **Demo Video (YouTube):** `_add your video link_`

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Structure  | HTML5 (semantic tags) |
| Styling    | CSS3 (custom properties, grid/flexbox, animations, media queries) |
| Logic      | Vanilla JavaScript (ES6+) – no frameworks |
| Icons      | Font Awesome 6 (CDN) |
| Fonts      | Google Fonts – *Baloo 2* + *Poppins* |
| Data       | JavaScript arrays/objects (`js/data.js`) + `localStorage` persistence |

**No database required** — every piece of data (restaurants, menu, cart, orders,
users, wishlist) lives in plain JS structures and/or the browser's localStorage.

---

## ✨ Features

### Core (required)
- 🏪 **Restaurant listing** – grid view with search + cuisine / rating / price filters
- 🍽️ **Food menu display** – images, descriptions, prices, dietary tags
- 📄 **Product detail page** – ingredients, nutrition info, reviews & ratings
- 🛒 **Add to cart** with quantity adjustment (+/−) and live price calculation
- 🧾 **Order summary** – subtotal, coupon discount, delivery fee, tax, total
- 💳 **Checkout process** – address form, delivery-time slot, payment method
- 🔐 **User Login/Register** (simulated, persisted in localStorage)

### Bonus (implemented)
- 🥗 **Dietary filters** – Veg / Non-Veg / Vegan / Gluten-Free toggles
- ⏰ **Delivery time selection** – ASAP or scheduled slots
- 📍 **Order tracking (simulated)** – animated stepper that advances automatically
  *(Placed → Preparing → Out for Delivery → Delivered)*
- ⭐ **Customer reviews & ratings** on product pages
- 🎟️ **Special offers & coupons**:

  | Code | Benefit |
  |------|---------|
  | `FRESH10`   | 20% off (min $15) |
  | `WELCOME50` | Flat $5 off (min $20) |
  | `FREEDEL`   | Free delivery on any order |
  | `WEEKEND25` | 25% off up to $10 (min $30) |

- ❤️ **Wishlist** with heart toggles across the site
- 💳 **Payment gateway simulation** – Card / UPI / Cash-on-Delivery with input
  formatting & validation (no real money moves)

### Extras
- Single-page hash router (`#/home`, `#/menu`, …) with working back/forward buttons
- Fully responsive (desktop → tablet → mobile) with animated hamburger menu
- Toast notification system
- Image fallbacks (emoji tiles) so the UI never looks broken offline
- Contact form + newsletter with inline validation
- Smooth scrolling, hover effects, floating hero animations

---

## ▶️ How to Run

No build step needed:

```bash
# Option 1 – just open it
double-click index.html

# Option 2 – tiny local server (recommended)
python -m http.server 5500
# then visit http://localhost:5500
```

> Tip: register any email/password on the site to try login, orders,
> addresses and the wishlist. Everything persists in your browser via localStorage.

---

## 📁 Project Structure

```
freshbite/
├── index.html          # All views (SPA sections) + auth modal + footer
├── css/
│   └── style.css       # Design tokens, layout, components, responsive rules
├── js/
│   ├── data.js         # "Database": restaurants, food items, coupons, reviews…
│   ├── cart.js         # Cart ops, coupons, totals, checkout, order tracking
│   ├── auth.js         # Simulated auth, profile, addresses, wishlist
│   └── app.js          # Router, rendering, filters, global events, boot
├── README.md
└── PROJECT_REPORT.md   # 1–2 page internship report
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary (Orange) | `#FF6B35` |
| Background (Cream) | `#FFF8F0` |
| Text (Dark Brown) | `#2D1B12` |
| Headings font | *Baloo 2* |
| Body font | *Poppins* |

---

## 🧠 What I Learned (summary)

- Structuring a multi-"page" experience as a single-page app with hash routing
- State management with plain JavaScript + localStorage
- Event delegation for dynamically rendered content
- Form validation patterns (inline errors, regex, live input masking)
- CSS custom properties, responsive grids and keyframe animations
- Writing accessible markup (aria labels, roles, keyboard dismissal)

Full write-up in [`PROJECT_REPORT.md`](PROJECT_REPORT.md).

---

## 🙏 Credits

- Food photography: [Unsplash](https://unsplash.com) (free license)
- Avatars: [randomuser.me](https://randomuser.me)
- Icons: [Font Awesome](https://fontawesome.com)
- Map embed: Google Maps

---

© 2026 FreshBite · Built with ❤️ for the Free Web Development Internship Online (WD-EC-001)