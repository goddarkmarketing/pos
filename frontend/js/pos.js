async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = `${p.name} $${p.price}`;
    btn.onclick = () => addToCart(p);
    container.appendChild(btn);
  });
}

const cart = [];
function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart');
  list.innerHTML = '';
  let total = 0;
  cart.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.name} $${p.price}`;
    list.appendChild(li);
    total += p.price;
  });
  document.getElementById('total').textContent = total.toFixed(2);
}

document.getElementById('checkout').onclick = async () => {
  const items = cart.map(p => ({ product_id: p.id, qty: 1, price: p.price }));
  const total = items.reduce((sum, i) => sum + i.price, 0);
  await fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, total, payment_method: 'cash' })
  });
  alert('Sale completed');
};

loadProducts();
