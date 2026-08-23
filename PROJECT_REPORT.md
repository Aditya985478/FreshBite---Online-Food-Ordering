# FreshBite – Online Food Ordering Platform
### Project Report · Free Web Development Internship Online (Task ID: WD-EC-001)
**Industry:** E-Commerce Food & Restaurant · **Submitted by:** _Your Name_ · **Date:** _Fill in_

---

## 1. Objective

The goal of this project was to design and build **FreshBite**, a fully functional
online food ordering platform that simulates a real-world food delivery e-commerce
website. The platform allows a user to browse partner restaurants, explore detailed
menus, filter dishes by dietary preference, manage a shopping cart, apply discount
coupons, complete a checkout flow with simulated payments, and track the placed order —
entirely on the frontend with **no database**, using JavaScript data structures and
`localStorage` for persistence.

Secondary objectives:
- Apply the required brand identity: warm orange `#FF6B35`, cream `#FFF8F0`,
  dark brown `#2D1B12`, playful typography (*Baloo 2* + *Poppins*).
- Deliver a clean, modern, food-focused layout that is fully responsive.
- Implement all core features plus as many bonus features as possible within one week.

## 2. Technology Used

| Area | Choice | Why |
|------|--------|-----|
| Structure | HTML5 semantic elements | Accessibility & SEO-friendly markup |
| Styling | Pure CSS3 (custom properties, Grid, Flexbox, keyframes) | Full control over the design system; no framework overhead |
| Behaviour | Vanilla JavaScript (ES6+) | Required core skill practice; zero dependencies |
| Data | JS arrays/objects in `js/data.js` + `localStorage` | Meets the "no database" constraint while keeping state persistent |
| Assets | Font Awesome 6, Google Fonts, Unsplash images, Google Maps embed | Free, reliable CDNs |

## 3. Features Implemented

**Core:** restaurant categories & listing (search + cuisine/rating/price filters) ·
menu display with dietary tags (Veg / Non-Veg / Vegan / Gluten-Free) · product detail
page (ingredients, nutrition strip, reviews) · add-to-cart with quantity adjustment ·
live price calculation (subtotal, coupon discount, delivery fee, tax, total) · order
summary · full checkout (address form, delivery-time slots, payment method) ·
simulated login/registration.

**Bonus:** dietary filters · delivery time selection · animated order-tracking
simulator (Placed → Preparing → Out for Delivery → Delivered) · customer reviews &
ratings · four working coupons (`FRESH10`, `WELCOME50`, `FREEDEL`, `WEEKEND25`) ·
wishlist with heart toggles · payment gateway simulation for Card / UPI / COD with
live input formatting (card grouping, expiry auto-slash) and regex validation.

**Engineering extras:** single-page hash router with browser back/forward support,
event delegation for dynamically rendered content, toast notification system,
inline form validation, image `onerror` fallbacks (emoji tiles), responsive
breakpoints at 1024 / 900 / 600 px with an animated hamburger menu.

## 4. Learning Outcomes

1. **SPA thinking without frameworks** – I learned how to emulate multi-page
   navigation using a hash router, per-route render functions and view toggling,
   which deepened my understanding of what frameworks like React do under the hood.
2. **State management** – Keeping cart, coupon, session, wishlist and orders in sync
   across views taught me to centralise state, persist it to `localStorage`, and
   re-render only what changed.
3. **Event delegation** – Because most of the UI is generated from data, I used a
   single delegated click listener driven by `data-action` attributes instead of
   attaching hundreds of individual handlers.
4. **Validation UX** – Building inline error messages, live input masking
   (card number/expiry/CVV/phone/pincode) and regex checks improved my sense of
   user-friendly form design.
5. **Design systems** – Defining CSS custom properties up front (colours, shadows,
   radii, fonts) made the whole site visually consistent and easy to tweak.

## 5. Challenges Faced & Solutions

| Challenge | How I solved it |
|-----------|-----------------|
| Keeping cart totals correct when coupons interact with delivery fees and tax | Isolated all money logic into one `computeTotals()` function that every view reuses, so the cart page, checkout summary and placed order can never disagree |
| Coupon minimums breaking after quantity changes | Re-validating the applied coupon inside `removeFromCart()` and silently removing it when the subtotal drops below the minimum |
| Dynamic content needing event listeners | Switched to event delegation on `document` with `data-action` attributes — one listener handles every button in the app |
| Broken/hot-linked food images | Added an `onerror` fallback that swaps any failed image for a styled emoji tile so the layout never collapses |
| Tracking simulation continuing after leaving the page | Stored `statusIndex` on the order object itself; the timer only advances persisted state and re-renders if the user is still viewing the tracker |

## 6. Future Improvements

Real backend + database (authentication hashing, payment API), restaurant admin
panel, live rider map, PWA offline support, and unit tests for the pricing engine.

---

### Submission Checklist
- [x] Public GitHub repository with source code & meaningful commits
- [x] README.md documentation
- [x] Screenshots (Home desktop/mobile, Menu, Cart, Checkout)
- [x] Project report (this document)
- [ ] Video demonstration uploaded to YouTube (link added to README)
- [ ] Live deployment (GitHub Pages / Netlify / Vercel — link added to README)