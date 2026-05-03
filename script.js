const menuItems = [
  {
    id: 1,
    name: "Double Smash Burger",
    category: "Burgers",
    price: 11.5,
    description: "Two juicy beef patties, cheddar, pickles, onions, and house sauce.",
    tag: "Best Seller",
    visual: "visual-burger"
  },
  {
    id: 2,
    name: "Crispy Zinger Wrap",
    category: "Wraps",
    price: 9.25,
    description: "Spicy crispy chicken, lettuce, tomato, and creamy garlic dressing.",
    tag: "Spicy",
    visual: "visual-wrap"
  },
  {
    id: 3,
    name: "Loaded Fries Bucket",
    category: "Fries",
    price: 7.75,
    description: "Golden fries with melted cheese, jalapenos, and smoky mayo.",
    tag: "Snack Hit",
    visual: "visual-fries"
  },
  {
    id: 4,
    name: "Mega Cola Float",
    category: "Drinks",
    price: 4.5,
    description: "Icy cola with vanilla float and caramel drizzle for extra kick.",
    tag: "Cold Drink",
    visual: "visual-drink"
  },
  {
    id: 5,
    name: "Oreo Blast Shake",
    category: "Desserts",
    price: 6.25,
    description: "Creamy vanilla shake blended with cookies and whipped topping.",
    tag: "Sweet Pick",
    visual: "visual-shake"
  },
  {
    id: 6,
    name: "Crunch Chicken Burger",
    category: "Burgers",
    price: 10.25,
    description: "Crispy chicken fillet, iceberg lettuce, cheese, and spicy mayo.",
    tag: "Fan Favorite",
    visual: "visual-burger"
  }
];

const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
let activeCategory = "All";
let cart = [];

const filterBar = document.getElementById("filterBar");
const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const toast = document.getElementById("toast");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function renderFilters() {
  filterBar.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-btn ${category === activeCategory ? "active" : ""}" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");

  filterBar.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderMenu();
    });
  });
}

function renderMenu() {
  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="menu-card">
          <div class="menu-card-visual ${item.visual}"></div>
          <span class="menu-tag">${item.tag}</span>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="menu-card-footer">
            <div>
              <span class="menu-price">${formatCurrency(item.price)}</span>
              <small>${item.category}</small>
            </div>
            <button class="order-btn add-btn" data-id="${item.id}">Add to cart</button>
          </div>
        </article>
      `
    )
    .join("");

  menuGrid.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(itemId) {
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const menuItem = menuItems.find((item) => item.id === itemId);
    cart.push({ ...menuItem, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(itemId, change) {
  cart = cart
    .map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + change };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-state">Your cart is empty. Add something delicious.</p>`;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <article class="cart-item">
            <div class="cart-item-top">
              <div>
                <strong>${item.name}</strong>
                <span class="cart-item-meta">${item.category}</span>
              </div>
              <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
            <div class="cart-item-bottom">
              <div class="qty-controls">
                <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
              </div>
              <span class="cart-item-meta">${formatCurrency(item.price)} each</span>
            </div>
          </article>
        `
      )
      .join("");

    cartItems.querySelectorAll(".qty-btn").forEach((button) => {
      button.addEventListener("click", () =>
        updateQuantity(Number(button.dataset.id), Number(button.dataset.change))
      );
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cart.length ? 4.5 : 4.5;
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  subtotalEl.textContent = formatCurrency(subtotal);
  deliveryEl.textContent = formatCurrency(delivery);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(total);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

placeOrderBtn.addEventListener("click", () => {
  if (!cart.length) {
    showToast("Add items to your cart before placing an order.");
    return;
  }

  cart = [];
  renderCart();
  showToast("Order placed. Your meal is being prepared.");
});

renderFilters();
renderMenu();
renderCart();
