/* ============================================================
   FreshBite – Online Food Ordering Platform
   File: js/cart.js
   ------------------------------------------------------------
   Everything related to the shopping cart, coupons, totals,
   checkout validation, placing orders and the SIMULATED
   order-tracking engine.

   Data persistence: localStorage keys
     fb_cart     – current cart        [{id, qty}, ...]
     fb_coupon   – applied coupon code (string | null)
     fb_orders   – placed orders       [orderObject, ...]
   ============================================================ */

/* ------------------------- STATE ------------------------- */
let cart = [];                 // [{ id: foodItemId, qty: number }]
let appliedCoupon = null;      // coupon code string or null
let lastOrderId = null;        // most recently placed order id

const CART_KEY = "fb_cart";
const COUPON_KEY = "fb_coupon";
const ORDERS_KEY = "fb_orders";

/* Statuses used by the tracking simulator */
const TRACK_STEPS = [
  { key: "placed",    label: "Order Placed",   icon: "📝" },
  { key: "preparing", label: "Preparing",      icon: "👨‍🍳" },
  { key: "out",       label: "Out for Delivery", icon: "🛵" },
  { key: "delivered", label: "Delivered",      icon: "🎉" }
];

/* ------------------------- PERSISTENCE ------------------------- */
function loadCartData() {
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    appliedCoupon = JSON.parse(localStorage.getItem(COUPON_KEY)) || null;
    // Validate coupon still exists in COUPONS list
    if (appliedCoupon && !COUPONS.find(c => c.code === appliedCoupon)) appliedCoupon = null;
  } catch { cart = []; appliedCoupon = null; }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
}

function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
  catch { return []; }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/* ------------------------- CART OPERATIONS ------------------------- */

/** Add qty of item to the cart (or increase quantity if already present) */
function addToCart(id, qty = 1) {
  const item = getFoodItemById(id);
  if (!item) return;
  const existing = cart.find(c => c.id === Number(id));
  if (existing) existing.qty += qty;
  else cart.push({ id: Number(id), qty });
  saveCart();
  updateCartBadge();
  showToast(`${qty} × ${item.name} added to cart 🛒`, "success");
  // If we're currently viewing the cart, refresh it live
  if (currentRoute === "cart") renderCart();
  if (currentRoute === "checkout") renderCheckoutSummary();
}

/** Change quantity by delta (+1 / -1). Removes the line at zero. */
function updateQty(id, delta) {
  const line = cart.find(c => c.id === Number(id));
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartBadge(); }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== Number(id));
  // Coupon minimum may no longer be met – re-validate quietly
  if (appliedCoupon) {
    const c = COUPONS.find(x => x.code === appliedCoupon);
    if (c && getSubtotal() < c.minOrder) {
      appliedCoupon = null;
      showToast("Coupon removed – order below minimum value", "info");
    }
  }
  saveCart();
  updateCartBadge();
  renderCart();
}

function clearCart(silent = false) {
  cart = [];
  appliedCoupon = null;
  saveCart();
  updateCartBadge();
  if (!silent) renderCart();
}

function getCartCount() {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

function getSubtotal() {
  return cart.reduce((sum, line) => {
    const item = getFoodItemById(line.id);
    return sum + (item ? item.price * line.qty : 0);
  }, 0);
}

/* ------------------------- COUPONS ------------------------- */

/**
 * Try to apply a coupon code.
 * @returns {boolean} success
 */
function applyCoupon(codeRaw) {
  const code = (codeRaw || "").trim().toUpperCase();
  const msgEl = document.getElementById("couponMsg");
  if (!code) { setCouponMsg("Please enter a coupon code.", "err"); return false; }

  const coupon = COUPONS.find(c => c.code === code);
  if (!coupon) { setCouponMsg("Invalid coupon code 😕", "err"); return false; }

  const subtotal = getSubtotal();
  if (subtotal < coupon.minOrder) {
    setCouponMsg(`Add $${(coupon.minOrder - subtotal).toFixed(2)} more to use ${code}.`, "err");
    return false;
  }

  appliedCoupon = code;
  saveCart();
  setCouponMsg(`${code} applied! ${coupon.description} 🎉`, "ok");
  showToast(`Coupon ${code} applied!`, "success");
  renderCart();
  return true;
}

function removeCoupon() {
  appliedCoupon = null;
  saveCart();
  setCouponMsg("", "");
  renderCart();
}

function setCouponMsg(text, type) {
  const el = document.getElementById("couponMsg");
  if (!el) return;
  el.textContent = text;
  el.className = "coupon-msg " + (type === "ok" ? "ok" : type === "err" ? "err" : "");
}

/* ------------------------- TOTALS ------------------------- */
/**
 * Compute the full bill.
 * @returns {{subtotal:number, discount:number, deliveryFee:number, tax:number, total:number}}
 */
function computeTotals() {
  const subtotal = getSubtotal();

  let discount = 0;
  let deliveryFee = subtotal >= BUSINESS.freeDeliveryAbove ? 0 : BUSINESS.deliveryFee;
  let freeDelNote = subtotal >= BUSINESS.freeDeliveryAbove;

  const coupon = appliedCoupon ? COUPONS.find(c => c.code === appliedCoupon) : null;
  if (coupon && subtotal >= coupon.minOrder) {
    if (coupon.type === "percent") {
      discount = subtotal * (coupon.value / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.type === "flat") {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === "freedel") {
      deliveryFee = 0;
      freeDelNote = true;
    }
  }

  const taxable = Math.max(subtotal - discount, 0);
  const tax = taxable * BUSINESS.taxRate;
  const total = taxable + deliveryFee + tax;

  return { subtotal, discount, deliveryFee, tax, total, freeDelNote };
}

function money(n) { return "$" + n.toFixed(2); }

/* ------------------------- NAV BADGE ------------------------- */
function updateCartBadge() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = getCartCount();
}

/* ------------------------- CART PAGE RENDERING ------------------------- */
function renderCart() {
  const wrap = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  if (!wrap || !summary) return;

  /* Empty cart state */
  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state">
        <span class="big">🛒</span>
        <h3>Your cart is feeling lonely</h3>
        <p>Add some delicious dishes and they'll appear right here.</p>
        <a href="#/menu" class="btn btn-primary" style="margin-top:18px">Browse the Menu</a>
      </div>`;
    summary.innerHTML = "";
    return;
  }

  /* Cart lines */
  wrap.innerHTML = cart.map(line => {
    const item = getFoodItemById(line.id);
    if (!item) return "";
    const rest = getRestaurantById(item.restaurantId);
    return `
      <div class="cart-item">
        <div class="ci-img">
          <img src="${item.image}" alt="${item.name}" class="food-img"
               onerror="this.onerror=null;this.classList.add('img-fallback');this.removeAttribute('src');this.textContent='${item.emoji}'">
        </div>
        <div>
          <div class="ci-name" data-action="view-product" data-id="${item.id}">${item.name}</div>
          <div class="ci-rest">by ${rest ? rest.name : "FreshBite"} · ${item.category}</div>
          <div class="ci-unit-price">${money(item.price)} each</div>
          <div style="margin-top:8px">
            <span class="qty-controls">
              <button class="qty-btn" data-action="qty-dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="qty-value">${line.qty}</span>
              <button class="qty-btn" data-action="qty-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </span>
          </div>
        </div>
        <div class="ci-right">
          <button class="remove-btn" data-action="remove-item" data-id="${item.id}" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <div class="ci-total">${money(item.price * line.qty)}</div>
        </div>
      </div>`;
  }).join("");

  /* Bill summary */
  const t = computeTotals();
  summary.innerHTML = `
    <h3>Order Summary</h3>

    <div class="coupon-box">
      <input type="text" id="couponInput" placeholder="Coupon code" value="${appliedCoupon || ""}">
      <button class="btn btn-primary" data-action="apply-coupon">Apply</button>
    </div>
    <p class="coupon-msg" id="couponMsg"></p>
    ${appliedCoupon ? `<p class="coupon-msg ok"><span id="appliedCode"></span> <button class="link-btn" data-action="remove-coupon">Remove</button></p>` : ""}

    ${t.freeDelNote ? `<div class="free-delivery-note"><i class="fa-solid fa-check"></i> You've unlocked FREE delivery!</div>`
                    : `<div class="free-delivery-note" style="background:#FFF3D6;color:#A06A00">Add ${money(BUSINESS.freeDeliveryAbove - t.subtotal)} more for free delivery 🛵</div>`}

    <div class="summary-row"><span>Subtotal (${getCartCount()} items)</span><span>${money(t.subtotal)}</span></div>
    ${t.discount > 0 ? `<div class="summary-row discount"><span>Coupon discount</span><span>−${money(t.discount)}</span></div>` : ""}
    <div class="summary-row"><span>Delivery fee</span><span class="${t.deliveryFee === 0 ? "free" : ""}">${t.deliveryFee === 0 ? "FREE" : money(t.deliveryFee)}</span></div>
    <div class="summary-row"><span>Tax (5%)</span><span>${money(t.tax)}</span></div>
    <hr class="summary-divider">
    <div class="summary-total"><span class="label">Total</span><strong>${money(t.total)}</strong></div>
    <button class="btn btn-primary btn-block btn-lg" data-action="go-checkout">
      Proceed to Checkout <i class="fa-solid fa-arrow-right"></i>
    </button>
    <button class="btn btn-outline btn-block" data-action="clear-cart" style="margin-top:12px">Clear Cart</button>`;
}

/* ------------------------- CHECKOUT ------------------------- */
function populateDeliverySlots() {
  const sel = document.getElementById("deliverySlot");
  if (!sel) return;
  sel.innerHTML = DELIVERY_SLOTS.map((slot, i) =>
    `<option value="${i}" ${i === 0 ? "selected" : ""}>${slot}</option>`).join("");
}

function renderCheckoutSummary() {
  const box = document.getElementById("checkoutSummary");
  if (!box) return;

  if (cart.length === 0) {
    box.innerHTML = `
      <h3>Nothing to check out</h3>
      <p class="muted" style="font-size:.9rem">Your cart is empty.</p>
      <a href="#/menu" class="btn btn-primary btn-block" style="margin-top:14px">Go to Menu</a>`;
    return;
  }

  const t = computeTotals();
  const lines = cart.map(line => {
    const item = getFoodItemById(line.id);
    return item ? `<div class="mini-item"><span>${line.qty} × ${item.name}</span><span>${money(item.price * line.qty)}</span></div>` : "";
  }).join("");

  box.innerHTML = `
    <h3>Order Summary</h3>
    ${lines}
    <hr class="summary-divider">
    <div class="summary-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    ${t.discount > 0 ? `<div class="summary-row discount"><span>Coupon (${appliedCoupon})</span><span>−${money(t.discount)}</span></div>` : ""}
    <div class="summary-row"><span>Delivery fee</span><span class="${t.deliveryFee === 0 ? "free" : ""}">${t.deliveryFee === 0 ? "FREE" : money(t.deliveryFee)}</span></div>
    <div class="summary-row"><span>Tax (5%)</span><span>${money(t.tax)}</span></div>
    <hr class="summary-divider">
    <div class="summary-total"><span class="label">To Pay</span><strong>${money(t.total)}</strong></div>
    <button class="btn btn-primary btn-block btn-lg" data-action="place-order">
      <i class="fa-solid fa-lock"></i> Place Order
    </button>
    <p class="muted" style="font-size:.76rem;text-align:center;margin-top:10px">
      By placing this order you agree to FreshBite's (simulated) terms of tastiness.
    </p>`;
}

/** Show/hide the correct payment detail block */
function switchPaymentFields(method) {
  document.getElementById("cardFields")?.classList.toggle("hidden", method !== "card");
  document.getElementById("upiFields")?.classList.toggle("hidden", method !== "upi");
  document.getElementById("codFields")?.classList.toggle("hidden", method !== "cod");
}

/* ---------- tiny validation helpers ---------- */
function setError(inputEl, message) {
  const small = inputEl.parentElement.querySelector(".error-msg");
  if (small) small.textContent = message;
  inputEl.classList.toggle("invalid", !!message);
  return !message;
}

function validExpiry(v) {
  const m = v.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return false;
  const exp = new Date(2000 + Number(m[2]), Number(m[1]), 1); // first day after expiry month
  return exp > new Date();
}

/**
 * Validate the whole checkout form.
 * @returns {object|null} order draft data, or null when invalid
 */
function validateCheckout() {
  let ok = true;
  const g = id => document.getElementById(id);

  ok = setError(g("addrName"),   g("addrName").value.trim().length >= 3 ? "" : "Please enter your full name.") && ok;
  ok = setError(g("addrPhone"),  /^\d{10}$/.test(g("addrPhone").value.trim()) ? "" : "Enter a 10-digit phone number.") && ok;
  ok = setError(g("addrLine"),   g("addrLine").value.trim().length >= 6 ? "" : "Please enter your street address.") && ok;
  ok = setError(g("addrCity"),   g("addrCity").value.trim().length >= 2 ? "" : "Please enter your city.") && ok;
  ok = setError(g("addrPincode"),/^\d{6}$/.test(g("addrPincode").value.trim()) ? "" : "Enter a 6-digit pincode.") && ok;

  const method = document.querySelector('input[name="payment"]:checked').value;
  if (method === "card") {
    ok = setError(g("cardNumber"), /^\d{16}$/.test(g("cardNumber").value.replace(/\s/g, "")) ? "" : "Enter a 16-digit card number.") && ok;
    ok = setError(g("cardName"),   g("cardName").value.trim().length >= 3 ? "" : "Enter the name on the card.") && ok;
    ok = setError(g("cardExpiry"), validExpiry(g("cardExpiry").value.trim()) ? "" : "Use a valid future MM/YY.") && ok;
    ok = setError(g("cardCvv"),    /^\d{3}$/.test(g("cardCvv").value) ? "" : "CVV must be 3 digits.") && ok;
  } else if (method === "upi") {
    ok = setError(g("upiId"), /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(g("upiId").value.trim()) ? "" : "Enter a UPI ID like name@bank.") && ok;
  }

  if (!ok) { showToast("Please fix the highlighted fields.", "error"); return null; }

  return {
    name: g("addrName").value.trim(),
    phone: g("addrPhone").value.trim(),
    address: `${g("addrLine").value.trim()}, ${g("addrCity").value.trim()} – ${g("addrPincode").value.trim()}`,
    instructions: g("addrInstructions").value.trim(),
    slot: DELIVERY_SLOTS[Number(g("deliverySlot").value)],
    payment: method,
    saveAddress: g("saveAddress").checked
  };
}

/** Create the order, persist it, clear the cart and jump to tracking */
function placeOrder() {
  if (cart.length === 0) { showToast("Your cart is empty!", "error"); location.hash = "#/menu"; return; }

  const data = validateCheckout();
  if (!data) return;

  const t = computeTotals();
  const order = {
    id: "FB" + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    items: cart.map(line => {
      const item = getFoodItemById(line.id);
      return { id: item.id, name: item.name, emoji: item.emoji, price: item.price, qty: line.qty };
    }),
    totals: { subtotal: t.subtotal, discount: t.discount, deliveryFee: t.deliveryFee, tax: t.tax, total: t.total },
    coupon: appliedCoupon,
    customer: data,
    statusIndex: 0
  };

  const orders = getOrders();
  orders.unshift(order);           // newest first
  saveOrders(orders);

  // Save address to the logged-in user's profile (optional bonus)
  if (data.saveAddress && typeof getCurrentUser === "function" && getCurrentUser()) {
    saveUserAddress({ label: "Home", text: `${data.address}${data.instructions ? " · " + data.instructions : ""}` });
  }

  clearCart(true);
  lastOrderId = order.id;
  showToast("Order placed successfully! 🎉", "success");

  // Simulated payment processing beat before showing tracking
  setTimeout(() => { location.hash = "#/orders"; }, 400);
}

/* ------------------------- ORDER TRACKING (simulated) ------------------------- */
let trackingTimer = null;

function renderTracking(orderId) {
  const container = document.getElementById("trackingContainer");
  if (!container) return;

  const orders = getOrders();
  const order = orders.find(o => o.id === orderId)
    || orders.find(o => o.statusIndex < 3)   // fall back to newest active order
    || orders[0];

  if (!order) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="big">📦</span>
        <h3>No orders yet</h3>
        <p>Once you place an order you can follow its journey here.</p>
        <a href="#/menu" class="btn btn-primary" style="margin-top:18px">Start an Order</a>
      </div>`;
    return;
  }

  lastOrderId = order.id;
  const step = TRACK_STEPS[order.statusIndex];
  const restName = getRestaurantById(getFoodItemById(order.items[0].id)?.restaurantId)?.name || "FreshBite";

  container.innerHTML = `
    <div class="tracking-card">
      <div class="tracking-success-emoji">${step.icon}</div>
      <h2>${step.key === "delivered" ? "Enjoy your meal!" : step.label + "…"}</h2>
      <p class="tracking-order-id">Order <strong>#${order.id}</strong> · ${restName} · ETA ${order.customer.slot.split("·")[0].trim()}</p>

      <div class="tracker">
        ${TRACK_STEPS.map((s, i) => `
          <div class="track-step ${i < order.statusIndex ? "done" : i === order.statusIndex ? "current" : ""}">
            <div class="track-dot">${s.icon}</div><span>${s.label}</span>
          </div>`).join("")}
      </div>

      ${order.statusIndex < 3
        ? `<p class="muted" style="font-size:.85rem;margin-top:26px"><i class="fa-solid fa-circle-info"></i> This tracker updates automatically (simulated).</p>`
        : `<button class="btn btn-primary" data-action="rate-order" style="margin-top:24px"><i class="fa-solid fa-star"></i> Rate your experience</button>`}
    </div>

    <div class="tracking-summary">
      <h3>Order Details</h3>
      ${order.items.map(it => `<div class="mini-item"><span>${it.qty} × ${it.emoji} ${it.name}</span><span>${money(it.price * it.qty)}</span></div>`).join("")}
      <hr class="summary-divider">
      <div class="mini-item"><span>Delivery to</span><span style="text-align:right;max-width:60%">${order.customer.address}</span></div>
      <div class="mini-item"><span>Payment</span><span>${{ card: "Credit / Debit Card", upi: "UPI", cod: "Cash on Delivery" }[order.payment]} · ${money(order.totals.total)}</span></div>
      <div class="mini-item"><span>Placed on</span><span>${new Date(order.date).toLocaleString()}</span></div>
    </div>`;

  scheduleNextStatus(order.id);
}

/** Advance the simulated status every 7 seconds until delivered */
function scheduleNextStatus(orderId) {
  clearInterval(trackingTimer);
  trackingTimer = setInterval(() => {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order || order.statusIndex >= TRACK_STEPS.length - 1) { clearInterval(trackingTimer); return; }

    order.statusIndex++;
    saveOrders(orders);

    const labels = ["", "The kitchen is cooking your food 👨‍🍳", "Your rider is on the way 🛵", "Delivered – bon appétit! 🎉"];
    showToast(labels[order.statusIndex] || "Order updated", "info");

    // Re-render only if the user is still looking at the tracking page
    if (currentRoute === "orders") renderTracking(orderId);
    if (currentRoute === "account") renderAccountView(); // keep history badges fresh
    if (order.statusIndex >= TRACK_STEPS.length - 1) clearInterval(trackingTimer);
  }, 7000);
}

/* ------------------------- INIT ------------------------- */
function initCartUI() {
  loadCartData();
  updateCartBadge();
  populateDeliverySlots();

  /* Live formatting for card fields */
  const cardNumber = document.getElementById("cardNumber");
  cardNumber?.addEventListener("input", () => {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  const expiry = document.getElementById("cardExpiry");
  expiry?.addEventListener("input", () => {
    let v = expiry.value.replace(/\D/g, "").slice(0, 4);
    expiry.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
  });

  const cvv = document.getElementById("cardCvv");
  cvv?.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 3);
  });

  const phone = document.getElementById("addrPhone");
  phone?.addEventListener("input", () => {
    phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
  });

  const pincode = document.getElementById("addrPincode");
  pincode?.addEventListener("input", () => {
    pincode.value = pincode.value.replace(/\D/g, "").slice(0, 6);
  });

  /* Payment radio switching */
  document.querySelectorAll('input[name="payment"]').forEach(radio =>
    radio.addEventListener("change", () => switchPaymentFields(radio.value)));
}