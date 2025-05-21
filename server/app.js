const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

const corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }
        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Error during login' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ token });
      } else {
        res.status(400).json({ error: 'Invalid password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error during login' });
    }
  });
});

// Product routes
app.post('/api/products', authenticateToken, (req, res) => {
  const { title, description, starting_price, category, end_time } = req.body;
  db.run(
    'INSERT INTO products (title, description, starting_price, current_price, seller_id, category, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, starting_price, starting_price, req.user.id, category, end_time],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error creating product' });
      
      db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, product) => {
        if (err) return res.status(500).json({ error: 'Error retrieving product' });
        res.json(product);
      });
    }
  );
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const query = category 
    ? 'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC'
    : 'SELECT * FROM products ORDER BY created_at DESC';
  const params = category ? [category] : [];
  
  db.all(query, params, (err, products) => {
    if (err) return res.status(500).json({ error: 'Error retrieving products' });
    res.json(products);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Error retrieving product' });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Get bid history
    db.all(
      `SELECT bids.*, users.username 
       FROM bids 
       JOIN users ON bids.bidder_id = users.id 
       WHERE product_id = ? 
       ORDER BY bids.created_at DESC`,
      [req.params.id],
      (err, bids) => {
        if (err) return res.status(500).json({ error: 'Error retrieving bids' });
        res.json({ ...product, bids });
      }
    );
  });
});

// Bid routes
app.post('/api/bids', authenticateToken, (req, res) => {
  const { product_id, amount } = req.body;
  
  db.get('SELECT current_price, end_time FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Error retrieving product' });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const now = new Date();
    const endTime = new Date(product.end_time);
    if (now > endTime) {
      return res.status(400).json({ error: 'Auction has ended' });
    }
    
    if (amount <= product.current_price) {
      return res.status(400).json({ error: 'Bid must be higher than current price' });
    }

    db.run(
      'INSERT INTO bids (product_id, bidder_id, amount) VALUES (?, ?, ?)',
      [product_id, req.user.id, amount],
      function(err) {
        if (err) return res.status(500).json({ error: 'Error placing bid' });
        
        db.run(
          'UPDATE products SET current_price = ? WHERE id = ?',
          [amount, product_id],
          (err) => {
            if (err) return res.status(500).json({ error: 'Error updating product price' });
            res.json({ message: 'Bid placed successfully' });
          }
        );
      }
    );
  });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, categories) => {
    if (err) return res.status(500).json({ error: 'Error retrieving categories' });
    res.json(categories);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
