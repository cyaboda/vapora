
const products = [
  { id: 1, name: "Blue Razz Ice", model: "Pulse X", price: 17.99, tone: "linear-gradient(160deg,#385dff,#10131b)" },
  { id: 2, name: "Watermelon Ice", model: "Pulse", price: 16.99, tone: "linear-gradient(160deg,#ff5d6c,#56c271 58%,#10131b 58%)" },
  { id: 3, name: "Strawberry Banana", model: "Pulse", price: 16.99, tone: "linear-gradient(160deg,#ff7a8a,#ffb744 58%,#10131b 58%)" },
  { id: 4, name: "Miami Mint", model: "Digiflavor", price: 18.99, tone: "linear-gradient(160deg,#2f3b3a,#85d6bd)" },
  { id: 5, name: "Sour Apple Ice", model: "Pulse X", price: 17.99, tone: "linear-gradient(160deg,#51a9ff,#10131b)" },
  { id: 6, name: "Grape Ice", model: "Digiflavor", price: 18.99, tone: "linear-gradient(160deg,#875dff,#10131b)" },
  { id: 7, name: "Peach Mango", model: "Pulse X", price: 17.99, tone: "linear-gradient(160deg,#ff9a6b,#ffd85c 58%,#10131b 58%)" },
  { id: 8, name: "Cool Mint", model: "Pulse", price: 16.99, tone: "linear-gradient(160deg,#5fd2ba,#10131b)" }
];

let activeFilter = "Todos";
let cart = JSON.parse(localStorage.getItem("vapora-cart") || "{}");

const productGrid = document.getElementById("productGrid");
const filters = document.querySelectorAll(".filter");
const cartDrawer = document.getElementById("cartDrawer");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutButton = document.getElementById("checkoutButton");

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function renderProducts() {
  const list = activeFilter === "Todos"
    ? products
    : products.filter(p => p.model === activeFilter);

  productGrid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-visual">
        <div class="mini-device" style="background:${product.tone}">
          ${product.model.toUpperCase()}
        </div>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.model}</p>
        <div class="product-bottom">
          <strong>${money(product.price)}</strong>
          <button class="add-btn" data-id="${product.id}" aria-label="Agregar ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function setFilter(filter) {
  activeFilter = filter;

  filters.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  renderProducts();
  document.getElementById("sabores").scrollIntoView({ behavior: "smooth" });
}

filters.forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

document.querySelectorAll(".collection-card").forEach(card => {
  card.addEventListener("click", () => setFilter(card.dataset.filter));
});

function saveCart() {
  localStorage.setItem("vapora-cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  openCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const totalQty = entries.reduce((sum, [, qty]) => sum + qty, 0);

  cartCount.textContent = totalQty;

  if (!entries.length) {
    cartItems.innerHTML = `<p style="color:#a8abb2">Tu carrito está vacío.</p>`;
    cartTotal.textContent = money(0);
    return;
  }

  let total = 0;

  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    const subtotal = product.price * qty;
    total += subtotal;

    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <p>${product.model} · ${money(product.price)}</p>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${product.id}, -1)">−</button>
          <span>${qty}</span>
          <button onclick="changeQty(${product.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = money(total);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

checkoutButton.addEventListener("click", () => {
  if (!Object.keys(cart).length) {
    alert("Tu carrito está vacío.");
    return;
  }

  alert(
    "Checkout preparado. Aquí conectaremos PayPhone, Kushki, Datafast u otra pasarela compatible con tu negocio."
  );
});

const ageModal = document.getElementById("ageModal");
const confirmAge = document.getElementById("confirmAge");
const leaveSite = document.getElementById("leaveSite");

if (!localStorage.getItem("vapora-age-confirmed")) {
  ageModal.classList.add("show");
}

confirmAge.addEventListener("click", () => {
  localStorage.setItem("vapora-age-confirmed", "yes");
  ageModal.classList.remove("show");
});

leaveSite.addEventListener("click", () => {
  window.location.href = "https://www.google.com";
});

renderProducts();
renderCart();

window.changeQty = changeQty;
