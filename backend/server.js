const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());

// Simple auth middleware placeholder
function auth(req, res, next) {
  // Here we should check token or session
  next();
}

// Routes skeleton
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;
  db.query('INSERT INTO users (username, password, role) VALUES (?,?,?)', [username, password, role], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User registered' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login success' });
  });
});

// Product CRUD
app.get('/api/products', auth, (req, res) => {
  db.query('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', auth, (req, res) => {
  const { name, price, stock } = req.body;
  db.query('INSERT INTO products (name, price, stock) VALUES (?,?,?)', [name, price, stock], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product created' });
  });
});

app.put('/api/products/:id', auth, (req, res) => {
  const { name, price, stock } = req.body;
  db.query('UPDATE products SET name=?, price=?, stock=? WHERE id=?', [name, price, stock, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated' });
  });
});

app.delete('/api/products/:id', auth, (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
});

// Record a sale
app.post('/api/sales', auth, (req, res) => {
  const { items, total, payment_method } = req.body;
  db.query('INSERT INTO sales (total, payment_method) VALUES (?,?)', [total, payment_method], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const saleId = result.insertId;
    const saleItems = items.map(it => [saleId, it.product_id, it.qty, it.price]);
    db.query('INSERT INTO sale_items (sale_id, product_id, qty, price) VALUES ?', [saleItems], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      // Update stock
      items.forEach(it => {
        db.query('UPDATE products SET stock = stock - ? WHERE id=?', [it.qty, it.product_id]);
      });
      res.json({ message: 'Sale recorded' });
    });
  });
});

// Simple reports
app.get('/api/reports/daily', auth, (req, res) => {
  db.query('SELECT DATE(created_at) as day, SUM(total) as total FROM sales GROUP BY day', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/reports/monthly', auth, (req, res) => {
  db.query('SELECT DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total) as total FROM sales GROUP BY month', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
