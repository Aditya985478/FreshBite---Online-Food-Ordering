/* ============================================================
   FreshBite – Online Food Ordering Platform
   File: js/auth.js
   ------------------------------------------------------------
   SIMULATED authentication & user features:
     · Register / Login / Logout  (users kept in localStorage)
     · Profile display
     · Order history
     · Saved addresses
     · Wishlist (heart buttons across the site)

   localStorage keys
     fb_users     – registered users   [{name,email,password,addresses,joined}]
     fb_session   – email of the logged-in user (or null)
     fb_wishlist  – array of wishlisted food-item ids
   ============================================================ */

const USERS_KEY = "fb_users";
const SESSION_KEY = "fb_session";
const WISHLIST_KEY = "fb_wishlist";

let currentAccountTab = "profile";   // which account tab is active

/* ------------------------- STORAGE HELPERS ------------------------- */
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** @returns {object|null} the logged-in user record */
function getCurrentUser() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}

function setSession(email) {
  if (email) localStorage.setItem(SESSION_KEY, email);
  else localStorage.removeItem(SESSION_KEY);
}

/* ------------------------- VALIDATION ------------------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function showAuthError(formId, message) {
  const el = document.getElementById(formId === "loginForm" ? "loginError" : "registerError");
  el.textContent = message;
  el.classList.remove("hidden");
}

function clearAuthErrors() {
  ["loginError", "registerError"].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.add("hidden");
  });
}

/* ------------------------- REGISTER ------------------------- */
function handleRegister(event) {
  event.preventDefault();
  clearAuthErrors();

  const name    = document.getElementById("regName").value.trim();
  const email   = document.getElementById("regEmail").value.trim().toLowerCase();
  const pw      = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;

  if (name.length < 3)                       return showAuthError("registerForm", "Please enter your full name.");
  if (!EMAIL_RE.test(email))                 return showAuthError("registerForm", "Please enter a valid email address.");
  if (pw.length < 6)                         return showAuthError("registerForm", "Password must be at least 6 characters.");
  if (pw !== confirm)                        return showAuthError("registerForm", "Passwords do not match.");

  const users = getUsers();
  if (users.some(u => u.email === email))    return showAuthError("registerForm", "An account with this email already exists. Try logging in.");

  users.push({
    name,
    email,
    password: pw,          // NOTE: plain text – acceptable ONLY because this is a front-end simulation
    addresses: [],
    joined: new Date().toISOString()
  });
  saveUsers(users);

  setSession(email);       // auto-login after registering
  document.getElementById("registerForm").reset();
  closeAuthModal();
  showToast(`Welcome to FreshBite, ${name.split(" ")[0]}! 🎉`, "success");
  refreshAuthDependentUI();
}

/* ------------------------- LOGIN ------------------------- */
function handleLogin(event) {
  event.preventDefault();
  clearAuthErrors();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const pw    = document.getElementById("loginPassword").value;

  if (!EMAIL_RE.test(email)) return showAuthError("loginForm", "Please enter a valid email address.");
  if (!pw)                   return showAuthError("loginForm", "Please enter your password.");

  const user = getUsers().find(u => u.email === email);
  if (!user || user.password !== pw) {
    return showAuthError("loginForm", "Incorrect email or password. New here? Create an account!");
  }

  setSession(email);
  document.getElementById("loginForm").reset();
  closeAuthModal();
  showToast(`Welcome back, ${user.name.split(" ")[0]}! 👋`, "success");
  refreshAuthDependentUI();
}

function logoutUser() {
  const user = getCurrentUser();
  setSession(null);
  showToast(user ? `See you soon, ${user.name.split(" ")[0]}!` : "Logged out", "info");
  refreshAuthDependentUI();
  location.hash = "#/home";
}

/* ------------------------- ADDRESSES ------------------------- */
function saveUserAddress(address) {
  const user = getCurrentUser();
  if (!user) return false;
  // avoid exact duplicates
  if (user.addresses.some(a => a.text === address.text)) return false;
  user.addresses.unshift(address);
  saveUsers(getUsers().map(u => (u.email === user.email ? user : u)));
  return true;
}

function deleteUserAddress(index) {
  const user = getCurrentUser();
  if (!user) return;
  user.addresses.splice(index, 1);
  saveUsers(getUsers().map(u => (u.email === user.email ? user : u)));
  renderAccountView();
  showToast("Address removed", "info");
}

/* ------------------------- WISHLIST ------------------------- */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}
function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}
function isWishlisted(id) {
  return getWishlist().includes(Number(id));
}
/** Toggle heart state; returns the NEW state (true = now wishlisted) */
function toggleWishlist(id) {
  id = Number(id);
  let list = getWishlist();
  const added = !list.includes(id);
  list = added ? [...list, id] : list.filter(x => x !== id);
  saveWishlist(list);
  updateWishlistBadge();
  const item = getFoodItemById(id);
  showToast(added ? `${item?.name} added to wishlist ❤️` : `${item?.name} removed from wishlist`, added ? "success" : "info");
  return added;
}
function updateWishlistBadge() {
  const el = document.getElementById("wishlistCount");
  if (el) el.textContent = getWishlist().length;
}

/* ------------------------- AUTH MODAL ------------------------- */
function openAuthModal(tab = "login") {
  clearAuthErrors();
  document.getElementById("authModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  switchAuthTab(tab);
}
function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
  document.body.style.overflow = "";
}
function switchAuthTab(tab) {
  document.getElementById("loginTabBtn").classList.toggle("active", tab === "login");
  document.getElementById("registerTabBtn").classList.toggle("active", tab === "register");
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
  clearAuthErrors();
}

/* ------------------------- ACCOUNT PAGE ------------------------- */
function renderAccountView() {
  const box = document.getElementById("accountContent");
  if (!box) return;

  /* ---- Not logged in ---- */
  const user = getCurrentUser();
  if (!user) {
    box.innerHTML = `
      <div class="empty-state">
        <span class="big">🔐</span>
        <h3>You're not logged in</h3>
        <p>Log in or create a free account to see your profile,<br>order history, addresses and wishlist.</p>
        <div style="display:flex;gap:14px;justify-content:center;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" data-action="open-login">Login</button>
          <button class="btn btn-outline btn-lg" data-action="open-register">Register</button>
        </div>
      </div>`;
    return;
  }

  /* ---- Logged in: profile header ---- */
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const orders = getOrders();

  let panelHTML = "";

  if (currentAccountTab === "profile") {
    panelHTML = `
      <div class="form-card">
        <h3><i class="fa-regular fa-id-badge"></i> Profile Details</h3>
        <div class="summary-row"><span><strong>Name</strong></span><span>${user.name}</span></div>
        <div class="summary-row"><span><strong>Email</strong></span><span>${user.email}</span></div>
        <div class="summary-row"><span><strong>Member since</strong></span><span>${new Date(user.joined).toLocaleDateString()}</span></div>
        <div class="summary-row"><span><strong>Total orders</strong></span><span>${orders.length}</span></div>
        <div class="summary-row"><span><strong>Wishlist items</strong></span><span>${getWishlist().length}</span></div>
      </div>`;
  }

  if (currentAccountTab === "orders") {
    panelHTML = orders.length === 0
      ? `<div class="empty-state"><span class="big">🧾</span><h3>No orders yet</h3>
         <p>Your delicious history starts with your first order.</p>
         <a href="#/menu" class="btn btn-primary" style="margin-top:18px">Browse Menu</a></div>`
      : orders.map(order => {
          const statusKey = TRACK_STEPS[order.statusIndex].key;
          const preview = order.items.map(i => `${i.qty}× ${i.name}`).join(", ");
          return `
            <div class="order-card">
              <div>
                <div class="order-id">#${order.id}</div>
                <div class="order-date">${new Date(order.date).toLocaleString()}</div>
              </div>
              <div class="order-items-preview">${preview}</div>
              <span class="order-status ${statusKey}">${TRACK_STEPS[order.statusIndex].label}</span>
              <div class="order-total">${money(order.totals.total)}</div>
              <button class="btn btn-outline" data-action="track-order" data-id="${order.id}">
                <i class="fa-solid fa-location-crosshairs"></i> Track
              </button>
            </div>`;
        }).join("");
  }

  if (currentAccountTab === "addresses") {
    panelHTML = user.addresses.length === 0
      ? `<div class="empty-state"><span class="big">🏠</span><h3>No saved addresses</h3>
         <p>Tick “Save this address” during checkout and it will appear here.</p></div>`
      : user.addresses.map((addr, i) => `
          <div class="address-card">
            <i class="fa-solid fa-house"></i>
            <div style="flex:1">
              <strong>${addr.label}</strong>
              <p>${addr.text}</p>
            </div>
            <button class="remove-btn" data-action="delete-address" data-index="${i}" title="Delete address">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>`).join("");
  }

  if (currentAccountTab === "wishlist") {
    const items = getWishlist().map(getFoodItemById).filter(Boolean);
    panelHTML = items.length === 0
      ? `<div class="empty-state"><span class="big">💔</span><h3>Your wishlist is empty</h3>
         <p>Tap the ♥ on any dish to save it here for later.</p>
         <a href="#/menu" class="btn btn-primary" style="margin-top:18px">Find Favourites</a></div>`
      : `<div class="food-grid">${items.map(foodCardHTML).join("")}</div>`;
  }

  box.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${initials}</div>
      <div>
        <h3>${user.name}</h3>
        <p>${user.email}</p>
      </div>
      <div class="profile-actions">
        <button class="btn-danger-ghost" data-action="logout">
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </div>

    <div class="account-tabs">
      <button class="account-tab ${currentAccountTab === "profile"   ? "active" : ""}" data-account-tab="profile">👤 Profile</button>
      <button class="account-tab ${currentAccountTab === "orders"    ? "active" : ""}" data-account-tab="orders">🧾 Orders (${orders.length})</button>
      <button class="account-tab ${currentAccountTab === "addresses" ? "active" : ""}" data-account-tab="addresses">🏠 Addresses</button>
      <button class="account-tab ${currentAccountTab === "wishlist"  ? "active" : ""}" data-account-tab="wishlist">❤️ Wishlist (${getWishlist().length})</button>
    </div>

    <div class="account-panel">${panelHTML}</div>`;
}

/** Re-render anything that depends on auth state (called after login/logout) */
function refreshAuthDependentUI() {
  renderAccountView();
  if (currentRoute === "account") window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ------------------------- INIT ------------------------- */
function initAuthUI() {
  updateWishlistBadge();

  /* Modal controls */
  document.getElementById("authModalClose").addEventListener("click", closeAuthModal);
  document.getElementById("authModal").addEventListener("click", e => {
    if (e.target.id === "authModal") closeAuthModal();   // click on dark backdrop closes
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAuthModal();
  });

  document.getElementById("loginTabBtn").addEventListener("click", () => switchAuthTab("login"));
  document.getElementById("registerTabBtn").addEventListener("click", () => switchAuthTab("register"));
  document.getElementById("switchToRegister").addEventListener("click", e => { e.preventDefault(); switchAuthTab("register"); });
  document.getElementById("switchToLogin").addEventListener("click", e => { e.preventDefault(); switchAuthTab("login"); });

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("registerForm").addEventListener("submit", handleRegister);

  /* Nav buttons */
  document.getElementById("accountBtn").addEventListener("click", () => {
    if (getCurrentUser()) location.hash = "#/account";
    else openAuthModal("login");
  });

  document.getElementById("wishlistBtn").addEventListener("click", () => {
    currentAccountTab = "wishlist";
    if (getCurrentUser()) location.hash = "#/account";
    else { location.hash = "#/account"; }   // account page shows login prompt
  });

  renderAccountView();
}