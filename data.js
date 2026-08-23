/* ============================================================
   FreshBite – Online Food Ordering Platform
   File: js/data.js
   ------------------------------------------------------------
   This file acts as our "database". Everything is stored in
   plain JavaScript arrays/objects – no backend required.

   Contents:
     1. RESTAURANTS      – partner restaurants
     2. FOOD_ITEMS       – full menu catalogue
     3. CATEGORIES       – menu filter chips
     4. HOME_CATEGORIES  – category tiles shown on the home page
     5. COUPONS          – discount codes used at checkout
     6. SPECIAL_OFFERS   – promo cards rendered on the home page
     7. REVIEWS          – sample customer reviews (keyed by item id)
     8. TESTIMONIALS     – home-page testimonials
     9. TEAM / AWARDS    – About Us page content
    10. DELIVERY_SLOTS   – checkout delivery time options
    11. Helper lookup functions
   ============================================================ */

/* ------------------------- 1. RESTAURANTS ------------------------- */
const RESTAURANTS = [
  {
    id: 1,
    name: "Pizza Palace",
    cuisine: "Italian",
    tags: ["Pizza", "Pasta", "Italian"],
    rating: 4.6,
    reviewsCount: 1240,
    deliveryTime: "25–35 min",
    distance: "1.2 km",
    priceForTwo: "$25",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=60",
    emoji: "🍕",
    description: "Wood-fired pizzas and handmade pasta, straight from our stone oven to your doorstep."
  },
  {
    id: 2,
    name: "Burger Barn",
    cuisine: "American",
    tags: ["Burgers", "Fries", "Fast Food"],
    rating: 4.5,
    reviewsCount: 980,
    deliveryTime: "20–30 min",
    distance: "0.8 km",
    priceForTwo: "$18",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=60",
    emoji: "🍔",
    description: "Juicy flame-grilled burgers stacked high with fresh, locally sourced ingredients."
  },
  {
    id: 3,
    name: "Spice Garden",
    cuisine: "Indian",
    tags: ["Indian", "Curry", "Biryani"],
    rating: 4.8,
    reviewsCount: 2110,
    deliveryTime: "30–40 min",
    distance: "2.1 km",
    priceForTwo: "$22",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=60",
    emoji: "🍛",
    description: "Authentic Indian flavours – slow-cooked curries, fragrant biryanis and fresh tandoor breads."
  },
  {
    id: 4,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    tags: ["Sushi", "Japanese", "Asian"],
    rating: 4.7,
    reviewsCount: 860,
    deliveryTime: "30–45 min",
    distance: "3.4 km",
    priceForTwo: "$38",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=60",
    emoji: "🍣",
    description: "Hand-rolled sushi crafted each morning from the freshest market fish and produce."
  },
  {
    id: 5,
    name: "Green Bowl",
    cuisine: "Healthy",
    tags: ["Salads", "Healthy", "Vegan"],
    rating: 4.4,
    reviewsCount: 540,
    deliveryTime: "15–25 min",
    distance: "1.0 km",
    priceForTwo: "$20",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=60",
    emoji: "🥗",
    description: "Bright, nourishing bowls and salads made from organic farm-fresh vegetables."
  },
  {
    id: 6,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    tags: ["Mexican", "Tacos", "Burritos"],
    rating: 4.5,
    reviewsCount: 720,
    deliveryTime: "20–35 min",
    distance: "1.7 km",
    priceForTwo: "$19",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=60",
    emoji: "🌮",
    description: "Street-style Mexican eats – loaded tacos, burritos and hand-smashed guacamole."
  },
  {
    id: 7,
    name: "Sweet Cravings",
    cuisine: "Desserts",
    tags: ["Desserts", "Bakery", "Cakes"],
    rating: 4.7,
    reviewsCount: 1130,
    deliveryTime: "20–30 min",
    distance: "1.5 km",
    priceForTwo: "$14",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=60",
    emoji: "🍰",
    description: "Freshly baked cakes, cheesecakes and desserts that make every day a celebration."
  },
  {
    id: 8,
    name: "Noodle Nest",
    cuisine: "Asian",
    tags: ["Ramen", "Noodles", "Asian"],
    rating: 4.6,
    reviewsCount: 650,
    deliveryTime: "25–40 min",
    distance: "2.8 km",
    priceForTwo: "$24",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=60",
    emoji: "🍜",
    description: "Slow-simmered broths and springy noodles – proper comfort in a bowl."
  }
];

/* ------------------------- 2. FOOD ITEMS --------------------------
   veg : true  => vegetarian        vegan : suitable for vegans
   glutenFree : no gluten-containing ingredients
   spicy : 0 none · 1 mild · 2 medium · 3 hot
------------------------------------------------------------------- */
const FOOD_ITEMS = [
  /* ---------- Pizza Palace ---------- */
  {
    id: 1, name: "Margherita Pizza", restaurantId: 1, category: "Pizza",
    price: 12.99, veg: true, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.7, reviewsCount: 320, prepTime: "20 min",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=60",
    emoji: "🍕", featured: true, badge: "Bestseller",
    description: "Our signature wood-fired classic with San Marzano tomato sauce, fresh mozzarella and fragrant basil.",
    ingredients: ["Pizza dough", "San Marzano tomatoes", "Mozzarella", "Fresh basil", "Olive oil"],
    nutrition: { calories: 780, protein: 32, carbs: 92, fat: 28 }
  },
  {
    id: 2, name: "Pepperoni Feast", restaurantId: 1, category: "Pizza",
    price: 14.99, veg: false, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.5, reviewsCount: 260, prepTime: "22 min",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=60",
    emoji: "🍕", featured: false,
    description: "Loaded with double pepperoni, mozzarella and a hint of chilli honey over a crispy crust.",
    ingredients: ["Pizza dough", "Pepperoni", "Mozzarella", "Tomato sauce", "Chilli honey"],
    nutrition: { calories: 940, protein: 41, carbs: 89, fat: 46 }
  },
  {
    id: 3, name: "Veggie Supreme", restaurantId: 1, category: "Pizza",
    price: 13.49, veg: true, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.4, reviewsCount: 180, prepTime: "22 min",
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=700&q=60",
    emoji: "🫑", featured: false, badge: "20% OFF",
    description: "A garden on a crust – peppers, olives, mushrooms, red onion and sweet corn.",
    ingredients: ["Pizza dough", "Bell peppers", "Mushrooms", "Olives", "Red onion", "Sweet corn", "Mozzarella"],
    nutrition: { calories: 720, protein: 27, carbs: 94, fat: 24 }
  },
  {
    id: 4, name: "BBQ Chicken Pizza", restaurantId: 1, category: "Pizza",
    price: 15.99, veg: false, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.6, reviewsCount: 210, prepTime: "24 min",
    image: "https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=700&q=60",
    emoji: "🍗", featured: true,
    description: "Smoky BBQ sauce, grilled chicken, caramelised onions and a blend of melted cheeses.",
    ingredients: ["Pizza dough", "BBQ sauce", "Grilled chicken", "Caramelised onions", "Cheese blend"],
    nutrition: { calories: 910, protein: 44, carbs: 91, fat: 39 }
  },

  /* ---------- Burger Barn ---------- */
  {
    id: 5, name: "Classic Chicken Burger", restaurantId: 2, category: "Burgers",
    price: 8.99, veg: false, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.5, reviewsCount: 410, prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=60",
    emoji: "🍔", featured: true, badge: "Bestseller",
    description: "Flame-grilled chicken fillet with crisp lettuce, tomato and our secret barn sauce.",
    ingredients: ["Chicken fillet", "Brioche bun", "Lettuce", "Tomato", "Barn sauce"],
    nutrition: { calories: 560, protein: 34, carbs: 42, fat: 26 }
  },
  {
    id: 6, name: "Double Cheeseburger", restaurantId: 2, category: "Burgers",
    price: 11.49, veg: false, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.7, reviewsCount: 380, prepTime: "16 min",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=60",
    emoji: "🍔", featured: false,
    description: "Two juicy beef patties, double cheddar, pickles and caramelised onions. Pure indulgence.",
    ingredients: ["Beef patties ×2", "Cheddar ×2", "Pickles", "Caramelised onions", "Sesame bun"],
    nutrition: { calories: 840, protein: 48, carbs: 40, fat: 54 }
  },
  {
    id: 7, name: "Crispy Veggie Burger", restaurantId: 2, category: "Burgers",
    price: 7.99, veg: true, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.3, reviewsCount: 190, prepTime: "14 min",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=60",
    emoji: "🥬", featured: false,
    description: "Golden-crusted chickpea and veg patty with avocado, greens and garlic aioli.",
    ingredients: ["Chickpea patty", "Avocado", "Mixed greens", "Garlic aioli", "Whole-wheat bun"],
    nutrition: { calories: 480, protein: 18, carbs: 52, fat: 21 }
  },
  {
    id: 8, name: "Golden French Fries", restaurantId: 2, category: "Burgers",
    price: 3.99, veg: true, vegan: true, glutenFree: true, spicy: 0,
    rating: 4.2, reviewsCount: 520, prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=60",
    emoji: "🍟", featured: false,
    description: "Twice-cooked for a crunchy shell and fluffy centre. Lightly salted, dangerously good.",
    ingredients: ["Potatoes", "Sunflower oil", "Sea salt"],
    nutrition: { calories: 320, protein: 4, carbs: 44, fat: 15 }
  },

  /* ---------- Spice Garden ---------- */
  {
    id: 9, name: "Royal Chicken Biryani", restaurantId: 3, category: "Indian",
    price: 13.99, veg: false, vegan: false, glutenFree: true, spicy: 2,
    rating: 4.8, reviewsCount: 640, prepTime: "30 min",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=60",
    emoji: "🍛", featured: true, badge: "Bestseller",
    description: "Fragrant basmati rice layered with marinated chicken, saffron and slow-cooked spices. Served with raita.",
    ingredients: ["Basmati rice", "Chicken", "Saffron", "Yogurt marinade", "Biryani spices", "Mint raita"],
    nutrition: { calories: 850, protein: 42, carbs: 96, fat: 30 }
  },
  {
    id: 10, name: "Paneer Butter Masala", restaurantId: 3, category: "Indian",
    price: 11.99, veg: true, vegan: false, glutenFree: true, spicy: 1,
    rating: 4.6, reviewsCount: 430, prepTime: "25 min",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=60",
    emoji: "🧈", featured: false,
    description: "Soft paneer cubes simmered in a silky tomato-cashew gravy finished with cream and kasuri methi.",
    ingredients: ["Paneer", "Tomato purée", "Cashew paste", "Butter", "Cream", "Kasuri methi"],
    nutrition: { calories: 620, protein: 24, carbs: 22, fat: 44 }
  },
  {
    id: 11, name: "Crispy Samosa (2 pcs)", restaurantId: 3, category: "Indian",
    price: 4.49, veg: true, vegan: true, glutenFree: false, spicy: 1,
    rating: 4.4, reviewsCount: 350, prepTime: "12 min",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=60",
    emoji: "🥟", featured: false,
    description: "Flaky pastry pockets stuffed with spiced potato and peas. Served with mint & tamarind chutneys.",
    ingredients: ["Pastry", "Potato", "Green peas", "Cumin", "Mint chutney", "Tamarind chutney"],
    nutrition: { calories: 300, protein: 6, carbs: 38, fat: 14 }
  },
  {
    id: 12, name: "Garlic Butter Naan", restaurantId: 3, category: "Indian",
    price: 2.99, veg: true, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.5, reviewsCount: 280, prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=700&q=60",
    emoji: "🫓", featured: false,
    description: "Pillowy tandoor naan brushed with garlic butter and coriander. The perfect curry companion.",
    ingredients: ["Refined flour", "Yogurt", "Garlic butter", "Coriander"],
    nutrition: { calories: 240, protein: 7, carbs: 38, fat: 6 }
  },
  {
    id: 13, name: "Dal Tadka", restaurantId: 3, category: "Indian",
    price: 8.99, veg: true, vegan: true, glutenFree: true, spicy: 1,
    rating: 4.3, reviewsCount: 210, prepTime: "20 min",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=60",
    emoji: "🍲", featured: false,
    description: "Comforting yellow lentils tempered with ghee-free sunflower oil, cumin, garlic and red chilli.",
    ingredients: ["Yellow lentils", "Tomato", "Cumin", "Garlic", "Turmeric", "Coriander"],
    nutrition: { calories: 340, protein: 16, carbs: 46, fat: 9 }
  },

  /* ---------- Sakura Sushi ---------- */
  {
    id: 14, name: "Salmon Avocado Roll", restaurantId: 4, category: "Sushi",
    price: 12.49, veg: false, vegan: false, glutenFree: true, spicy: 0,
    rating: 4.7, reviewsCount: 220, prepTime: "18 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=60",
    emoji: "🍣", featured: true,
    description: "Eight pieces of silky salmon and creamy avocado rolled with seasoned sushi rice and nori.",
    ingredients: ["Salmon", "Avocado", "Sushi rice", "Nori", "Wasabi", "Pickled ginger"],
    nutrition: { calories: 420, protein: 24, carbs: 52, fat: 12 }
  },
  {
    id: 15, name: "California Roll", restaurantId: 4, category: "Sushi",
    price: 10.99, veg: false, vegan: false, glutenFree: true, spicy: 0,
    rating: 4.5, reviewsCount: 190, prepTime: "16 min",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=700&q=60",
    emoji: "🍥", featured: false,
    description: "The crowd-pleaser – crab stick, cucumber and avocado, rolled uramaki-style with toasted sesame.",
    ingredients: ["Crab stick", "Cucumber", "Avocado", "Sushi rice", "Sesame", "Nori"],
    nutrition: { calories: 380, protein: 16, carbs: 54, fat: 10 }
  },
  {
    id: 16, name: "Veggie Tempura Roll", restaurantId: 4, category: "Sushi",
    price: 9.99, veg: true, vegan: true, glutenFree: false, spicy: 1,
    rating: 4.3, reviewsCount: 130, prepTime: "18 min",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=700&q=60",
    emoji: "🥑", featured: false,
    description: "Crisp tempura sweet potato, asparagus and carrot rolled with rice and drizzled in teriyaki.",
    ingredients: ["Sweet potato tempura", "Asparagus", "Carrot", "Sushi rice", "Teriyaki drizzle"],
    nutrition: { calories: 400, protein: 8, carbs: 68, fat: 10 }
  },
  {
    id: 17, name: "Miso Soup", restaurantId: 4, category: "Sushi",
    price: 4.99, veg: true, vegan: true, glutenFree: false, spicy: 0,
    rating: 4.2, reviewsCount: 160, prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=60",
    emoji: "🍜", featured: false,
    description: "Warm savoury broth with silken tofu, wakame seaweed and spring onion. A gentle starter.",
    ingredients: ["Miso paste", "Silken tofu", "Wakame", "Spring onion", "Dashi-style stock (vegan)"],
    nutrition: { calories: 90, protein: 7, carbs: 9, fat: 3 }
  },

  /* ---------- Green Bowl ---------- */
  {
    id: 18, name: "Greek Salad", restaurantId: 5, category: "Salads",
    price: 9.49, veg: true, vegan: false, glutenFree: true, spicy: 0,
    rating: 4.4, reviewsCount: 140, prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=60",
    emoji: "🥗", featured: false,
    description: "Cucumber, cherry tomatoes, olives and feta tossed in oregano-lemon dressing.",
    ingredients: ["Cucumber", "Cherry tomatoes", "Kalamata olives", "Feta", "Red onion", "Oregano dressing"],
    nutrition: { calories: 260, protein: 9, carbs: 14, fat: 19 }
  },
  {
    id: 19, name: "Quinoa Buddha Bowl", restaurantId: 5, category: "Salads",
    price: 10.99, veg: true, vegan: true, glutenFree: true, spicy: 0,
    rating: 4.6, reviewsCount: 175, prepTime: "12 min",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=60",
    emoji: "🥙", featured: true, badge: "Healthy Pick",
    description: "Protein-packed quinoa with roasted chickpeas, avocado, kale and a creamy tahini drizzle.",
    ingredients: ["Quinoa", "Chickpeas", "Avocado", "Kale", "Tahini dressing", "Toasted seeds"],
    nutrition: { calories: 520, protein: 19, carbs: 58, fat: 22 }
  },
  {
    id: 20, name: "Grilled Chicken Salad", restaurantId: 5, category: "Salads",
    price: 11.99, veg: false, vegan: false, glutenFree: true, spicy: 0,
    rating: 4.5, reviewsCount: 165, prepTime: "14 min",
    image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=700&q=60",
    emoji: "🍗", featured: false,
    description: "Herb-marinated grilled chicken over crunchy greens with a light balsamic glaze.",
    ingredients: ["Grilled chicken", "Mixed greens", "Cherry tomatoes", "Balsamic glaze", "Olive oil"],
    nutrition: { calories: 420, protein: 38, carbs: 16, fat: 22 }
  },
  {
    id: 21, name: "Avocado Sourdough Toast", restaurantId: 5, category: "Salads",
    price: 8.49, veg: true, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.3, reviewsCount: 120, prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=700&q=60",
    emoji: "🥑", featured: false,
    description: "Thick sourdough topped with smashed avocado, chilli flakes, feta crumble and microgreens.",
    ingredients: ["Sourdough", "Avocado", "Feta", "Chilli flakes", "Microgreens", "Lemon"],
    nutrition: { calories: 360, protein: 12, carbs: 34, fat: 19 }
  },

  /* ---------- Taco Fiesta ---------- */
  {
    id: 22, name: "Street Beef Tacos (3 pcs)", restaurantId: 6, category: "Mexican",
    price: 10.99, veg: false, vegan: false, glutenFree: false, spicy: 2,
    rating: 4.6, reviewsCount: 240, prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=60",
    emoji: "🌮", featured: true,
    description: "Three soft tacos piled with spiced beef, pico de gallo, red cabbage and lime crema.",
    ingredients: ["Beef", "Corn tortillas", "Pico de gallo", "Red cabbage", "Lime crema"],
    nutrition: { calories: 560, protein: 32, carbs: 44, fat: 26 }
  },
  {
    id: 23, name: "Bean & Cheese Burrito", restaurantId: 6, category: "Mexican",
    price: 9.49, veg: true, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.4, reviewsCount: 180, prepTime: "14 min",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=60",
    emoji: "🌯", featured: false,
    description: "Hearty refried beans, Mexican rice, melted cheese and salsa wrapped in a warm flour tortilla.",
    ingredients: ["Refried beans", "Mexican rice", "Cheese", "Salsa", "Flour tortilla"],
    nutrition: { calories: 610, protein: 22, carbs: 78, fat: 20 }
  },
  {
    id: 24, name: "Fresh Guacamole & Chips", restaurantId: 6, category: "Mexican",
    price: 6.99, veg: true, vegan: true, glutenFree: true, spicy: 1,
    rating: 4.7, reviewsCount: 310, prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=60",
    emoji: "🥑", featured: false, badge: "Fan Favourite",
    description: "Hand-smashed avocado with lime, coriander and jalapeño, served with crispy corn totopos.",
    ingredients: ["Avocado", "Lime", "Coriander", "Jalapeño", "Corn chips"],
    nutrition: { calories: 380, protein: 6, carbs: 30, fat: 26 }
  },
  {
    id: 25, name: "Chicken Quesadilla", restaurantId: 6, category: "Mexican",
    price: 9.99, veg: false, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.5, reviewsCount: 200, prepTime: "13 min",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=700&q=60",
    emoji: "🧀", featured: false,
    description: "Grilled flour tortilla stuffed with chipotle chicken and a molten three-cheese blend.",
    ingredients: ["Chipotle chicken", "Flour tortilla", "Three-cheese blend", "Bell peppers"],
    nutrition: { calories: 640, protein: 34, carbs: 46, fat: 32 }
  },

  /* ---------- Sweet Cravings ---------- */
  {
    id: 26, name: "Chocolate Lava Cake", restaurantId: 7, category: "Desserts",
    price: 6.49, veg: true, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.8, reviewsCount: 420, prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1619596372932-35f3bf8b38d8?auto=format&fit=crop&w=700&q=60",
    emoji: "🍫", featured: true, badge: "Bestseller",
    description: "Warm chocolate cake with a molten centre, dusted with cocoa and served with vanilla bean ice cream.",
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Vanilla ice cream", "Cocoa dust"],
    nutrition: { calories: 520, protein: 8, carbs: 58, fat: 28 }
  },
  {
    id: 27, name: "Strawberry Cheesecake", restaurantId: 7, category: "Desserts",
    price: 6.99, veg: true, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.6, reviewsCount: 290, prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=700&q=60",
    emoji: "🍰", featured: false,
    description: "Creamy baked cheesecake on a buttery biscuit base, crowned with fresh strawberry compote.",
    ingredients: ["Cream cheese", "Biscuit base", "Strawberries", "Cream", "Vanilla"],
    nutrition: { calories: 480, protein: 9, carbs: 46, fat: 29 }
  },
  {
    id: 28, name: "Vanilla Sundae Deluxe", restaurantId: 7, category: "Desserts",
    price: 5.49, veg: true, vegan: false, glutenFree: true, spicy: 0,
    rating: 4.4, reviewsCount: 210, prepTime: "6 min",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=60",
    emoji: "🍨", featured: false,
    description: "Double scoops of vanilla bean ice cream with hot fudge, roasted nuts and a wafer curl.",
    ingredients: ["Vanilla ice cream", "Hot fudge", "Roasted nuts", "Wafer", "Whipped cream"],
    nutrition: { calories: 450, protein: 7, carbs: 52, fat: 23 }
  },
  {
    id: 29, name: "Glazed Donut Duo", restaurantId: 7, category: "Desserts",
    price: 4.99, veg: true, vegan: false, glutenFree: false, spicy: 0,
    rating: 4.3, reviewsCount: 260, prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=60",
    emoji: "🍩", featured: false,
    description: "Two pillowy donuts – one classic sugar glaze, one rich chocolate – baked fresh every morning.",
    ingredients: ["Enriched dough", "Sugar glaze", "Chocolate ganache"],
    nutrition: { calories: 420, protein: 6, carbs: 54, fat: 20 }
  },

  /* ---------- Noodle Nest ---------- */
  {
    id: 30, name: "Tonkotsu Ramen", restaurantId: 8, category: "Ramen",
    price: 12.99, veg: false, vegan: false, glutenFree: false, spicy: 1,
    rating: 4.7, reviewsCount: 230, prepTime: "22 min",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=60",
    emoji: "🍜", featured: true,
    description: "Rich 12-hour pork broth with chashu pork, soft egg, bamboo shoots and springy noodles.",
    ingredients: ["Pork broth", "Chashu pork", "Soft egg", "Bamboo shoots", "Ramen noodles", "Spring onion"],
    nutrition: { calories: 680, protein: 36, carbs: 72, fat: 26 }
  },
  {
    id: 31, name: "Spicy Miso Ramen", restaurantId: 8, category: "Ramen",
    price: 12.49, veg: false, vegan: false, glutenFree: false, spicy: 3,
    rating: 4.6, reviewsCount: 195, prepTime: "22 min",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=60",
    emoji: "🌶️", featured: false, badge: "Spicy 🌶️🌶️🌶️",
    description: "Fiery miso broth with chilli oil, minced pork, corn and a jammy soft-boiled egg. Handle with care!",
    ingredients: ["Miso broth", "Chilli oil", "Minced pork", "Corn", "Soft egg", "Noodles"],
    nutrition: { calories: 700, protein: 34, carbs: 74, fat: 28 }
  },
  {
    id: 32, name: "Veggie Stir-Fry Noodles", restaurantId: 8, category: "Ramen",
    price: 10.49, veg: true, vegan: true, glutenFree: false, spicy: 1,
    rating: 4.4, reviewsCount: 150, prepTime: "18 min",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=60",
    emoji: "🥡", featured: false,
    description: "Wok-tossed noodles with crunchy seasonal vegetables in a glossy soy-ginger glaze.",
    ingredients: ["Noodles", "Broccoli", "Carrot", "Baby corn", "Soy-ginger glaze", "Sesame"],
    nutrition: { calories: 520, protein: 15, carbs: 84, fat: 12 }
  }
];

/* ------------------------- 3. MENU FILTER CATEGORIES ------------------------- */
const CATEGORIES = ["All", "Pizza", "Burgers", "Indian", "Sushi", "Salads", "Mexican", "Desserts", "Ramen"];

/* --------- 4. HOME PAGE CATEGORY TILES (restaurant categories) --------- */
const HOME_CATEGORIES = [
  { label: "Pizza",    emoji: "🍕", query: "Pizza" },
  { label: "Burgers",  emoji: "🍔", query: "Burgers" },
  { label: "Indian",   emoji: "🍛", query: "Indian" },
  { label: "Sushi",    emoji: "🍣", query: "Sushi" },
  { label: "Healthy",  emoji: "🥗", query: "Salads" },
  { label: "Mexican",  emoji: "🌮", query: "Mexican" },
  { label: "Desserts", emoji: "🍩", query: "Desserts" },
  { label: "Ramen",    emoji: "🍜", query: "Ramen" }
];

/* ------------------------- 5. COUPONS -------------------------
   type: "percent" | "flat" | "freedel"
---------------------------------------------------------------- */
const COUPONS = [
  { code: "FRESH10",    type: "percent", value: 20, minOrder: 15,  maxDiscount: null, description: "20% off your order (min $15)" },
  { code: "WELCOME50",  type: "flat",    value: 5,  minOrder: 20,  maxDiscount: null, description: "Flat $5 off (min $20)" },
  { code: "FREEDEL",    type: "freedel", value: 0,  minOrder: 0,   maxDiscount: null, description: "Free delivery on any order" },
  { code: "WEEKEND25",  type: "percent", value: 25, minOrder: 30,  maxDiscount: 10,   description: "25% off up to $10 (min $30)" }
];

/* ------------------------- 6. SPECIAL OFFERS (home page) ------------------------- */
const SPECIAL_OFFERS = [
  { title: "Flat 20% OFF",      subtitle: "On your first FreshBite order",   code: "FRESH10",   emoji: "🎉" },
  { title: "Free Delivery",     subtitle: "On every order, no minimum",      code: "FREEDEL",   emoji: "🛵" },
  { title: "Weekend Feast",     subtitle: "25% off orders above $30",        code: "WEEKEND25", emoji: "🎊" }
];

/* ------------------------- 7. SAMPLE REVIEWS -------------------------
   Keyed by food-item id. Items without entries fall back to a
   generic review pool handled in app.js.
----------------------------------------------------------------------- */
const REVIEWS = {
  1: [
    { name: "Priya K.",  rating: 5, date: "2026-07-02", text: "Absolutely perfect crust! Tastes exactly like the pizzas I had in Naples." },
    { name: "James O.",  rating: 4, date: "2026-06-18", text: "Great flavour and generous cheese. Arrived hot and on time." },
    { name: "Anita R.",  rating: 5, date: "2026-05-30", text: "My go-to Friday night order. The basil is so fresh!" }
  ],
  5: [
    { name: "Marcus T.", rating: 5, date: "2026-07-10", text: "Juicy, smoky and the barn sauce is addictive. 10/10." },
    { name: "Leena S.",  rating: 4, date: "2026-06-25", text: "Solid burger, though I asked for extra crispy next time." }
  ],
  9: [
    { name: "Rahul V.",  rating: 5, date: "2026-07-14", text: "Best biryani on any delivery app. The saffron aroma when you open the box 😍" },
    { name: "Fatima Z.", rating: 5, date: "2026-07-01", text: "Perfect spice level and the raita complements it beautifully." },
    { name: "George P.", rating: 4, date: "2026-06-12", text: "Huge portion, easily feeds two. Will order again." }
  ],
  14: [
    { name: "Emily W.",  rating: 5, date: "2026-07-08", text: "Fish tasted incredibly fresh. Melts in your mouth." },
    { name: "Kenji M.",  rating: 4, date: "2026-06-20", text: "Well-rolled and neat. Rice seasoning was spot on." }
  ],
  19: [
    { name: "Sophie L.", rating: 5, date: "2026-07-05", text: "Finally a healthy bowl that doesn't taste boring. Tahini dressing is chef's kiss." },
    { name: "Adam B.",   rating: 4, date: "2026-06-15", text: "Filling and fresh. Great post-gym meal." }
  ],
  22: [
    { name: "Diego F.",  rating: 5, date: "2026-07-11", text: "Proper street-taco vibes. The lime crema ties everything together." },
    { name: "Nina G.",   rating: 4, date: "2026-06-28", text: "Nice kick of heat. Could use slightly more beef." }
  ],
  24: [
    { name: "Hannah J.", rating: 5, date: "2026-07-03", text: "Guac tastes hand-made because it IS hand-made. Chips stayed crunchy!" },
    { name: "Omar D.",   rating: 5, date: "2026-06-22", text: "Simple, fresh, perfect. My kids demolish it." }
  ],
  26: [
    { name: "Grace H.",  rating: 5, date: "2026-07-12", text: "The lava flow never misses. Warm, gooey heaven." },
    { name: "Tom W.",    rating: 5, date: "2026-06-30", text: "Ordered twice in one week. No regrets whatsoever." },
    { name: "Ishita M.", rating: 4, date: "2026-06-10", text: "Delicious! Just slightly small for sharing." }
  ],
  30: [
    { name: "Yuki N.",   rating: 5, date: "2026-07-09", text: "Broth depth rivals my favourite ramen bar. Egg was jammy perfection." },
    { name: "Chris E.",  rating: 4, date: "2026-06-19", text: "Very good noodles, arrived a touch lukewarm but flavour was great." }
  ]
};

/* Generic pool used when an item has no specific reviews */
const GENERIC_REVIEWS = [
  { name: "Happy Customer", rating: 5, date: "2026-06-15", text: "Really tasty and freshly made. Highly recommend!" },
  { name: "Regular Foodie", rating: 4, date: "2026-06-02", text: "Good portion size and great value for money." },
  { name: "Late Night Eater", rating: 5, date: "2026-05-20", text: "Arrived hot and quickly. Exactly what I needed." }
];

/* ------------------------- 8. TESTIMONIALS (home) ------------------------- */
const TESTIMONIALS = [
  { name: "Sarah Mitchell", role: "Verified Customer", avatar: "https://randomuser.me/api/portraits/women/44.jpg", stars: 5, text: "FreshBite has completely changed how our family eats. The delivery is fast, the food always arrives hot, and the veg filters make ordering for my daughter effortless." },
  { name: "David Chen",    role: "Verified Customer", avatar: "https://randomuser.me/api/portraits/men/32.jpg",  stars: 5, text: "The order tracking is weirdly addictive – watching my ramen go from kitchen to doorstep in real time. Best food app UI I've used." },
  { name: "Aisha Khan",    role: "Verified Customer", avatar: "https://randomuser.me/api/portraits/women/68.jpg", stars: 4, text: "Coupons actually work and the wishlist keeps my dessert cravings organised. Customer support replaced a wrong order within minutes." }
];

/* ------------------------- 9. ABOUT US CONTENT ------------------------- */
const TEAM = [
  { name: "Aarav Sharma", role: "Founder & Head Chef",    avatar: "https://randomuser.me/api/portraits/men/75.jpg",  bio: "Started FreshBite from a single food truck in 2019 with one belief: good food should travel well." },
  { name: "Maya Patel",   role: "Operations Lead",        avatar: "https://randomuser.me/api/portraits/women/65.jpg", bio: "The reason your biryani arrives in 30 minutes. Maya orchestrates our entire delivery network." },
  { name: "Daniel Cruz",  role: "Master Pizzaiolo",       avatar: "https://randomuser.me/api/portraits/men/41.jpg",  bio: "Trained in Naples for 6 years. His sourdough pizza base has its own fan club." },
  { name: "Sofia Lee",    role: "Head of Pastry",         avatar: "https://randomuser.me/api/portraits/women/26.jpg", bio: "Creator of our legendary lava cake. Believes dessert is not optional – it's essential." }
];

const AWARDS = [
  { year: "2024", title: "Best Food Delivery Startup", org: "FoodTech Innovation Awards", emoji: "🏆" },
  { year: "2025", title: "Top 10 Delivery Experiences", org: "Taste Magazine",              emoji: "🥇" },
  { year: "2025", title: "Service Excellence Gold",     org: "National Diners' Choice",    emoji: "⭐" }
];

/* ------------------------- 10. DELIVERY TIME SLOTS (checkout) ------------------------- */
const DELIVERY_SLOTS = [
  "ASAP (35–45 min)",
  "Today · 1:00 PM – 2:00 PM",
  "Today · 2:00 PM – 3:00 PM",
  "Today · 6:00 PM – 7:00 PM",
  "Today · 7:00 PM – 8:00 PM",
  "Today · 8:00 PM – 9:00 PM"
];

/* ------------------------- 11. BUSINESS CONSTANTS ------------------------- */
const BUSINESS = {
  deliveryFee: 2.99,          // standard delivery charge
  freeDeliveryAbove: 30,      // subtotal above which delivery is free
  taxRate: 0.05               // 5% GST/VAT applied on the discounted subtotal
};

/* ------------------------- 12. HELPER LOOKUPS ------------------------- */
/** Find a restaurant by its id */
function getRestaurantById(id) {
  return RESTAURANTS.find(r => r.id === Number(id)) || null;
}

/** Find a food item by its id */
function getFoodItemById(id) {
  return FOOD_ITEMS.find(f => f.id === Number(id)) || null;
}

/** Get all food items belonging to one restaurant */
function getItemsByRestaurant(restaurantId) {
  return FOOD_ITEMS.filter(f => f.restaurantId === Number(restaurantId));
}

/** Get reviews for a food item (falls back to a generic pool) */
function getReviewsForItem(itemId) {
  return REVIEWS[itemId] || GENERIC_REVIEWS;
}

/** Build a star-rating string like "★★★★☆" */
function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}