const express = require('express');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer'); // Import multer
const fs = require('fs'); // Import fs module to handle directory creation

const app = express();

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SyntaxSquad_Db',
  password: 'Capaciti123',
  port: 5432,
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'uploads' directory for image URLs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage: storage });

// Admin login route
app.post('/login-admin', async (req, res) => {
  const { adminUsername, adminPassword } = req.body;

  try {
    console.log('Admin Username:', adminUsername);
    console.log('Admin Password:', adminPassword);

    // Find the admin record from the PostgreSQL database
    const result = await pool.query(
      'SELECT * FROM ADMIN WHERE ADMIN_USERNAME = $1',
      [adminUsername]
    );

    if (result.rows.length === 0) {
      return res.status(400).send('Admin not found');
    }

    const admin = result.rows[0];
    console.log('Admin record from DB:', admin);

    // Compare the hashed password with the plain text password
    const isPasswordValid = await bcrypt.compare(adminPassword, admin.admin_password);

    if (isPasswordValid) {
      return res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
    } else {
      return res.status(400).send('Invalid password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Error logging in');
  }
});

// Admin dashboard route
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  res.redirect('/'); // Redirect to the login page after logout
});

// CRUD routes for products

// Fetch all products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});

// Add a new product with image upload
app.post('/products', upload.single('image'), async (req, res) => {
  const { name, price, stock, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Set the image URL

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, stock, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, stock, description, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding product');
  }
});

// Update a product with image upload
app.put('/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Set the image URL

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, stock = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, price, stock, description, imageUrl, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating product');
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.sendStatus(204); // No content
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting product');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
