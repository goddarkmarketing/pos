async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const list = document.getElementById('productList');
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.name} ($${p.price}) stock:${p.stock}`;
    list.appendChild(li);
  });
}

document.getElementById('productForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const stock = document.getElementById('stock').value;
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, stock })
  });
  loadProducts();
});

loadProducts();
