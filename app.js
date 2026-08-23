/* ============================================================
   FreshBite – Online Food Ordering Platform
   File: js/app.js
   ------------------------------------------------------------
   The "brain" of the app:
     · Hash router (#/home, #/menu, #/cart …) that shows/hides views
     · Renders home page sections, restaurants, menu, product detail
     · Filtering (category, diet, cuisine, rating, price) + sorting
     · Global click handling via data-action attributes
     · Toast notifications, hamburger menu, back-to-top, forms
   ============================================================ */

/* ------------------------- GLOBAL STATE ------------------------- */
var currentRoute = "home";          // active route name (used by cart.js / auth.js)
let currentProductId = null;        // product currently open in detail view
let productQty = 1;                 // qty selector on the product page

const menuState = {
  category: "All",
  search: "",
  sort: "popular",
  restaurantId: null,               // set when arriving from a restaurant card
  diets: { veg: false, nonveg: false, vegan: false, gf: false }
};

const restState = { search: "", cuisine: "all", rating: "all", price: "all" };

/* ------------------------- TOASTS ------------------------- */
const TOAST_ICONS = {
  success: "fa-solid fa-circle-check",
  error:   "fa-solid fa-circle-exclamation",
  info:    "fa-solid fa-circle-info"
};

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="${TOAST_ICONS[type] || TOAST_ICONS.info}"></i><span></span>`;
  toast.querySelector("span").textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/* ------------------------- SHARED CARD TEMPLATES ------------------------- */

/** Dietary tags for a food item (Veg / Non-Veg / Vegan / Gluten-Free) */
function dietTagsHTML(item) {
  let tags = item.veg
    ? `<span class="diet-tag veg"><span class="diet-dot veg-dot"></span> Veg</span>`
    : `<span class="diet-tag nonveg"><span class="diet-dot nonveg-dot"></span> Non-Veg</span>`;
  if (item.vegan)      tags += `<span class="diet-tag vegan"><i class="fa-solid fa-leaf"></i> Vegan</span>`;
  if (item.glutenFree) tags += `<span class="diet-tag gf">GF</span>`;
  return tags;
}

/** Reusable food card (menu grid, featured dishes, wishlist) */
function foodCardHTML(item) {
  const badge = item.badge
    ? `<span class="food-badge ${item.badge.includes("%") ? "offer" : ""}">${item.badge}</span>` : "";
  const fav = isWishlisted(item.id);
  return `
    <article class="food-card">
      <div class="food-img-wrap">
        ${badge}
        <button class="fav-btn ${fav ? "active" : ""}" data-action="wishlist" data-id="${item.id}"
                title="${fav ? "Remove from" : "Add to"} wishlist" aria-label="Toggle wishlist">
          <i class="${fav ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>
        <img src="${item.image}" alt="${item.name}" class="food-img" loading="lazy"
             onerror="this.onerror=null;this.classList.add('img-fallback');this.removeAttribute('src');this.textContent='${item.emoji}'">
      </div>
      <div class="food-body">
        <div class="food-title-row">
          <h3 data-action="view-product" data-id="${item.id}">${item.name}</h3>
          <span class="rating-chip">${item.rating} <i class="fa-solid fa-star"></i></span>
        </div>
        <div class="product-tags">${dietTagsHTML(item)}</div>
        <p class="food-desc">${item.description}</p>
        <div class="food-meta">
          <span><i class="fa-regular fa-clock"></i>${item.prepTime}</span>
          <span><i class="fa-solid fa-fire"></i>${item.nutrition.calories} kcal</span>
        </div>
        <div class="food-footer">
          <span class="price">${money(item.price)}</span>
          <button class="add-btn" data-action="add-cart" data-id="${item.id}">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    </article>`;
}

/** Reusable restaurant card */
function restaurantCardHTML(rest) {
  return `
    <article class="restaurant-card">
      <div class="rest-img-wrap">
        <img src="${rest.image}" alt="${rest.name}" loading="lazy"
             onerror="this.onerror=null;this.classList.add('img-fallback');this.removeAttribute('src');this.textContent='${rest.emoji}'">
        <span class="rest-cuisine">${rest.cuisine}</span>
      </div>
      <div class="rest-info">
        <div class="rest-top">
          <h3 data-action="open-restaurant" data-id="${rest.id}">${rest.name}</h3>
          <span class="rating-chip">${rest.rating} <i class="fa-solid fa-star"></i></span>
        </div>
        <p class="rest-desc">${rest.description}</p>
        <div class="rest-meta">
          <span><i class="fa-regular fa-clock"></i>${rest.deliveryTime}</span>
          <span><i class="fa-solid fa-location-dot"></i>${rest.distance}</span>
          <span><i class="fa-solid fa-user-group"></i>${rest.priceForTwo} for two</span>
        </div>
        <div style="margin-top:16px">
          <button class="add-btn" data-action="open-restaurant" data-id="${rest.id}">
            View Menu <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>`;
}

/* ------------------------- HOME PAGE ------------------------- */
function renderHomeSections() {
  /* Category tiles */
  document.getElementById("categoryTiles").innerHTML = HOME_CATEGORIES.map(cat => `
    <button class="category-tile" data-action="category" data-category="${cat.query}">
      <span class="tile-emoji">${cat.emoji}</span><span>${cat.label}</span>
    </button>`).join("");

  /* Featured dishes (top 8 by rating among featured items) */
  const featured = FOOD_ITEMS.filter(f => f.featured)
    .sort((a, b) => b.rating - a.rating).slice(0, 8);
  document.getElementById("featuredGrid").innerHTML =
    featured.map(foodCardHTML).join("");

  /* Special offers */
  document.getElementById("offersGrid").innerHTML = SPECIAL_OFFERS.map(o => `
    <div class="offer-card">
      <span class="offer-emoji">${o.emoji}</span>
      <h3>${o.title}</h3>
      <p>${o.subtitle}</p>
      <button class="offer-code" data-action="copy-code" data-code="${o.code}">${o.code}</button>
    </div>`).join("");

  /* Popular restaurants (top 4 by rating) */
  const popular = [...RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  document.getElementById("popularRestaurants").innerHTML =
    popular.map(restaurantCardHTML).join("");

  /* Testimonials */
  document.getElementById("testimonialsGrid").innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="t-stars">${"★".repeat(t.stars)}${"☆".repeat(5 - t.stars)}</div>
      <p class="t-text">${t.text}</p>
      <div class="t-person">
        <img class="t-avatar" src="${t.avatar}" alt="${t.name}" loading="lazy"
             onerror="this.style.display='none'">
        <div><strong>${t.name}</strong><small>${t.role}</small></div>
      </div>
    </div>`).join("");
}

/* ------------------------- RESTAURANTS PAGE ------------------------- */
function renderRestaurants() {
  const grid = document.getElementById("restaurantsGrid");
  const countEl = document.getElementById("restCount");

  let list = [...RESTAURANTS];

  if (restState.search) {
    const q = restState.search.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)));
  }
  if (restState.cuisine !== "all") list = list.filter(r => r.cuisine === restState.cuisine);
  if (restState.rating !== "all")  list = list.filter(r => r.rating >= Number(restState.rating));
  if (restState.price !== "all") {
    list = list.filter(r => {
      const price = Number(r.priceForTwo.replace("$", ""));
      if (restState.price === "low")  return price < 20;
      if (restState.price === "mid")  return price >= 20 && price <= 25;
      return price > 25;
    });
  }

  countEl.textContent = `Showing ${list.length} of ${RESTAURANTS.length} restaurants`;

  grid.innerHTML = list.length
    ? list.map(restaurantCardHTML).join("")
    : `<div class="empty-state" style="grid-column:1/-1"><span class="big">🔍</span>
       <h3>No restaurants match your filters</h3><p>Try widening your search.</p></div>`;
}

/* ------------------------- MENU PAGE ------------------------- */
function renderCategoryChips() {
  document.getElementById("categoryChips").innerHTML = CATEGORIES.map(cat =>
    `<button class="chip ${menuState.category === cat ? "active" : ""}"
             data-action="chip" data-category="${cat}">${cat}</button>`).join("");
}

function renderMenu() {
  const grid = document.getElementById("menuGrid");
  const countEl = document.getElementById("menuCount");
  renderCategoryChips();

  let list = [...FOOD_ITEMS];

  /* Restaurant filter (arrived from a restaurant card) */
  if (menuState.restaurantId) {
    list = list.filter(f => f.restaurantId === menuState.restaurantId);
  }
  /* Category filter */
  if (menuState.category !== "All") {
    list = list.filter(f => f.category === menuState.category);
  }
  /* Search (name, description or ingredients) */
  if (menuState.search) {
    const q = menuState.search.toLowerCase();
    list = list.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.ingredients.some(i => i.toLowerCase().includes(q)));
  }
  /* Dietary filters (OR between active toggles) */
  const activeDiets = Object.entries(menuState.diets).filter(([, on]) => on).map(([k]) => k);
  if (activeDiets.length) {
    list = list.filter(f =>
      (activeDiets.includes("veg")    && f.veg)        ||
      (activeDiets.includes("nonveg") && !f.veg)       ||
      (activeDiets.includes("vegan")  && f.vegan)      ||
      (activeDiets.includes("gf")     && f.glutenFree));
  }
  /* Sorting */
  switch (menuState.sort) {
    case "rating":    list.sort((a, b) => b.rating - a.rating); break;
    case "priceLow":  list.sort((a, b) => a.price - b.price); break;
    case "priceHigh": list.sort((a, b) => b.price - a.price); break;
    default:          list.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  /* Result count + active restaurant chip */
  const rest = menuState.restaurantId ? getRestaurantById(menuState.restaurantId) : null;
  countEl.innerHTML =
    (rest ? `<span class="chip active" style="margin-right:10px">🏪 ${rest.name}
              <button data-action="clear-restaurant" style="color:inherit;font-weight:800"> ✕</button></span>` : "") +
    `Showing ${list.length} of ${FOOD_ITEMS.length} dishes`;

  grid.innerHTML = list.length
    ? list.map(foodCardHTML).join("")
    : `<div class="empty-state" style="grid-column:1/-1"><span class="big">🍽️</span>
       <h3>No dishes found</h3><p>Try a different category or clear the filters.</p></div>`;
}

function resetMenuFilters() {
  menuState.category = "All";
  menuState.search = "";
  menuState.sort = "popular";
  menuState.restaurantId = null;
  menuState.diets = { veg: false, nonveg: false, vegan: false, gf: false };
  document.getElementById("menuSearch").value = "";
  document.getElementById("sortFilter").value = "popular";
  document.querySelectorAll(".diet-toggle").forEach(b => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
}

/* ------------------------- PRODUCT DETAIL PAGE ------------------------- */
function renderProduct(id) {
  const item = getFoodItemById(id);
  const box = document.getElementById("productDetail");
  if (!item || !box) { location.hash = "#/menu"; return; }

  currentProductId = item.id;
  productQty = 1;

  const rest = getRestaurantById(item.restaurantId);
  const reviews = getReviewsForItem(item.id);
  const fav = isWishlisted(item.id);

  box.innerHTML = `
    <button class="back-link" data-action="go-back"><i class="fa-solid fa-arrow-left"></i> Back to menu</button>

    <div class="product-layout">
      <div class="product-img-wrap">
        <img src="${item.image}" alt="${item.name}"
             onerror="this.onerror=null;this.classList.add('img-fallback');this.removeAttribute('src');this.textContent='${item.emoji}'">
      </div>

      <div class="product-info">
        <div class="product-tags">${dietTagsHTML(item)}</div>
        <h1>${item.name}</h1>
        <a class="product-rest-link" data-action="open-restaurant" data-id="${rest.id}">
          <i class="fa-solid fa-store"></i> ${rest.name} · ${rest.cuisine}
        </a>

        <div class="product-rating-row">
          <span class="product-stars">${starString(item.rating)}</span>
          <span class="muted">${item.rating} · ${item.reviewsCount} reviews</span>
          <span class="muted">·</span>
          <span class="muted"><i class="fa-regular fa-clock"></i> ${item.prepTime}</span>
        </div>

        <p class="product-desc">${item.description}</p>

        <div class="buy-row">
          <span class="price" style="font-size:1.7rem">${money(item.price)}</span>
          <span class="qty-selector">
            <button class="qty-btn" data-action="pqty-dec" aria-label="Decrease quantity">−</button>
            <span class="qty-value" id="productQtyValue">1</span>
            <button class="qty-btn" data-action="pqty-inc" aria-label="Increase quantity">+</button>
          </span>
          <button class="btn btn-primary btn-lg" data-action="add-cart-qty" data-id="${item.id}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
          <button class="fav-btn ${fav ? "active" : ""}" style="position:static;width:48px;height:48px"
                  data-action="wishlist" data-id="${item.id}" aria-label="Toggle wishlist">
            <i class="${fav ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
        </div>

        <div class="nutrition-strip">
          <div class="nutri-box"><strong>${item.nutrition.calories}</strong><span>Calories</span></div>
          <div class="nutri-box"><strong>${item.nutrition.protein}g</strong><span>Protein</span></div>
          <div class="nutri-box"><strong>${item.nutrition.carbs}g</strong><span>Carbs</span></div>
          <div class="nutri-box"><strong>${item.nutrition.fat}g</strong><span>Fat</span></div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h3><i class="fa-solid fa-carrot"></i> Ingredients</h3>
      <div class="ingredients-list">
        ${item.ingredients.map(i => `<span class="ingredient-pill">${i}</span>`).join("")}
      </div>
    </div>

    <div class="detail-section">
      <h3><i class="fa-regular fa-comments"></i> Customer Reviews</h3>
      ${reviews.map(r => `
        <div class="review-card">
          <div class="review-head">
            <div class="review-avatar">${r.name.charAt(0)}</div>
            <div style="flex:1">
              <strong>${r.name}</strong>
              <time>${new Date(r.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</time>
            </div>
            <span class="review-stars">${starString(r.rating)}</span>
          </div>
          <p>${r.text}</p>
        </div>`).join("")}
    </div>`;
}

/* ------------------------- ABOUT PAGE ------------------------- */
function renderAboutSections() {
  document.getElementById("teamGrid").innerHTML = TEAM.map(m => `
    <div class="team-card">
      <img class="team-avatar" src="${m.avatar}" alt="${m.name}" loading="lazy"
           onerror="this.onerror=null;this.removeAttribute('src');this.textContent='${m.name.charAt(0)}';this.classList.add('img-fallback')">
      <h3>${m.name}</h3>
      <div class="team-role">${m.role}</div>
      <p class="team-bio">${m.bio}</p>
    </div>`).join("");

  document.getElementById("awardsGrid").innerHTML = AWARDS.map(a => `
    <div class="award-card">
      <span class="award-emoji">${a.emoji}</span>
      <div>
        <div class="year">${a.year}</div>
        <h4>${a.title}</h4>
        <p>${a.org}</p>
      </div>
    </div>`).join("");
}

/* ------------------------- ROUTER ------------------------- */
const ROUTES = ["home", "restaurants", "menu", "product", "cart", "checkout", "orders", "account", "about", "contact"];

function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, "").split("?")[0];
  return ROUTES.includes(hash) ? hash : "home";
}

function handleRouteChange() {
  const route = parseRoute();
  currentRoute = route;

  /* Guard: can't check out an empty cart */
  if (route === "checkout" && cart.length === 0) {
    showToast("Add something tasty to your cart first! 🛒", "info");
    location.hash = "#/cart";
    return;
  }

  /* Show only the active view */
  document.querySelectorAll(".view").forEach(v =>
    v.classList.toggle("active", v.dataset.view === route));

  /* Highlight matching nav link */
  document.querySelectorAll("[data-nav]").forEach(a =>
    a.classList.toggle("active", a.dataset.nav === route));

  /* Per-route rendering */
  if (route === "cart")       renderCart();
  if (route === "checkout")   renderCheckoutSummary();
  if (route === "orders")     renderTracking(lastOrderId);
  if (route === "account")    renderAccountView();
  if (route === "menu")       renderMenu();
  if (route === "restaurants") renderRestaurants();
  if (route === "product") {
    if (currentProductId) renderProduct(currentProductId);
    else location.hash = "#/menu";
  }

  /* Close mobile nav + start every page at the top */
  document.body.classList.remove("nav-open");
  document.getElementById("hamburger").classList.remove("open");
  window.scrollTo(0, 0);
}

/* ------------------------- GLOBAL CLICK HANDLER -------------------------
   One delegated listener handles every dynamic button via data-action. */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id;

  switch (action) {

    /* ---- navigation ---- */
    case "view-product":
      location.hash = `#/product?id=${id}`;
      renderProduct(id);
      break;

    case "go-back":
      history.length > 1 ? history.back() : (location.hash = "#/menu");
      break;

    case "open-restaurant":
      resetMenuFilters();
      menuState.restaurantId = Number(id);
      location.hash = "#/menu";
      renderMenu();
      break;

    case "clear-restaurant":
      menuState.restaurantId = null;
      renderMenu();
      break;

    case "category":
      resetMenuFilters();
      menuState.category = el.dataset.category;
      location.hash = "#/menu";
      renderMenu();
      break;

    case "chip":
      menuState.category = el.dataset.category;
      renderMenu();
      break;

    /* ---- cart ---- */
    case "add-cart":
      addToCart(id, 1);
      break;

    case "add-cart-qty":
      addToCart(id, productQty);
      productQty = 1;
      document.getElementById("productQtyValue").textContent = "1";
      break;

    case "pqty-inc":
      productQty = Math.min(productQty + 1, 20);
      document.getElementById("productQtyValue").textContent = productQty;
      break;

    case "pqty-dec":
      productQty = Math.max(productQty - 1, 1);
      document.getElementById("productQtyValue").textContent = productQty;
      break;

    case "qty-inc": updateQty(id, +1); break;
    case "qty-dec": updateQty(id, -1); break;
    case "remove-item": removeFromCart(id); break;

    case "clear-cart":
      clearCart();
      showToast("Cart cleared", "info");
      break;

    case "go-checkout": location.hash = "#/checkout"; break;
    case "apply-coupon": applyCoupon(document.getElementById("couponInput").value); break;
    case "remove-coupon": removeCoupon(); break;
    case "place-order": placeOrder(); break;

    /* ---- wishlist ---- */
    case "wishlist": {
      const added = toggleWishlist(id);
      /* Refresh every heart for this item currently on screen */
      document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(btn => {
        btn.classList.toggle("active", added);
        btn.innerHTML = `<i class="${added ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
      });
      if (currentRoute === "account" && currentAccountTab === "wishlist") renderAccountView();
      break;
    }

    /* ---- offers ---- */
    case "copy-code": {
      const code = el.dataset.code;
      const done = () => showToast(`Code ${code} copied – use it at checkout! 🎟️`, "success");
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(() => showToast(`Use code ${code} at checkout`, "info"));
      } else {
        showToast(`Use code ${code} at checkout`, "info");
      }
      break;
    }

    /* ---- auth / account ---- */
    case "open-login":    openAuthModal("login"); break;
    case "open-register": openAuthModal("register"); break;
    case "logout":        logoutUser(); break;

    case "track-order":
      lastOrderId = id;
      location.hash = "#/orders";
      renderTracking(id);
      break;

    case "delete-address":
      deleteUserAddress(Number(el.dataset.index));
      break;

    case "rate-order":
      showToast("Thanks! Your feedback keeps our kitchens sharp ⭐", "success");
      break;
  }
});

/* Account tab switching (delegated because tabs are re-rendered) */
document.addEventListener("click", e => {
  const tab = e.target.closest("[data-account-tab]");
  if (!tab) return;
  currentAccountTab = tab.dataset.accountTab;
  renderAccountView();
});

/* ------------------------- FORMS ------------------------- */

/** Contact form with inline validation */
function initContactForm() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const g = id => document.getElementById(id);
    let ok = true;

    ok = setError(g("cName"),    g("cName").value.trim().length >= 3 ? "" : "Please enter your name.") && ok;
    ok = setError(g("cEmail"),   EMAIL_RE.test(g("cEmail").value.trim()) ? "" : "Please enter a valid email.") && ok;
    ok = setError(g("cMessage"), g("cMessage").value.trim().length >= 10 ? "" : "Message should be at least 10 characters.") && ok;

    if (!ok) return;
    form.reset();
    showToast("Message sent! We'll reply within 24 hours 📬", "success");
  });
}

/** Footer newsletter */
function initNewsletter() {
  document.getElementById("newsletterForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("newsletterEmail");
    if (!EMAIL_RE.test(input.value.trim())) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    input.value = "";
    showToast("Subscribed! Fresh deals coming your way 🎉", "success");
  });
}

/* Prevent native submit on checkout (Place Order lives in the summary card) */
function initCheckoutFormGuard() {
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    placeOrder();
  });
}

/* ------------------------- UI CHROME ------------------------- */
function initChrome() {
  /* Hamburger */
  const burger = document.getElementById("hamburger");
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  /* Cart icon in navbar */
  document.getElementById("cartBtn").addEventListener("click", () => {
    location.hash = "#/cart";
  });

  /* Back-to-top visibility + behaviour */
  const topBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Restaurants filters */
  document.getElementById("restSearch").addEventListener("input", e => {
    restState.search = e.target.value;
    renderRestaurants();
  });
  document.getElementById("cuisineFilter").addEventListener("change", e => {
    restState.cuisine = e.target.value; renderRestaurants();
  });
  document.getElementById("ratingFilter").addEventListener("change", e => {
    restState.rating = e.target.value; renderRestaurants();
  });
  document.getElementById("priceFilter").addEventListener("change", e => {
    restState.price = e.target.value; renderRestaurants();
  });

  /* Menu filters */
  document.getElementById("menuSearch").addEventListener("input", e => {
    menuState.search = e.target.value;
    renderMenu();
  });
  document.getElementById("sortFilter").addEventListener("change", e => {
    menuState.sort = e.target.value;
    renderMenu();
  });
  document.querySelectorAll(".diet-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.diet;
      menuState.diets[key] = !menuState.diets[key];
      btn.classList.toggle("active", menuState.diets[key]);
      btn.setAttribute("aria-pressed", String(menuState.diets[key]));
      renderMenu();
    });
  });
  document.getElementById("clearFilters").addEventListener("click", () => {
    resetMenuFilters();
    renderMenu();
    showToast("Filters cleared", "info");
  });
}

/* ------------------------- BOOT ------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHomeSections();
  renderAboutSections();
  initChrome();
  initContactForm();
  initNewsletter();
  initCheckoutFormGuard();
  initCartUI();     // cart state, badges, payment field formatting
  initAuthUI();     // auth modal, session restore, account page

  /* Router boot-up + future navigation */
  window.addEventListener("hashchange", handleRouteChange);
  handleRouteChange();

  console.log("%c🍕 FreshBite ready! Built with HTML5 + CSS3 + JavaScript.",
              "color:#FF6B35;font-weight:bold;font-size:14px");
});