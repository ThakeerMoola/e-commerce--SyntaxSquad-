const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SyntaxSquad_Db',
  password: 'Capaciti123',
  port: 5432,
});

// Admin data to insert
const adminUsername = 'SyntaxAdmin';
const adminPassword = 'Capaciti123';  // Plaintext password (will be hashed)

// Function to create admin
async function createAdmin() {
  try {
    // Log the start of the process
    console.log('Starting the admin creation process...');
    
    // Hash the password before inserting into the database
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('Password hashed:', hashedPassword);  // Log hashed password

    // Insert the admin data into the database
    const result = await pool.query(
      'INSERT INTO ADMIN (ADMIN_USERNAME, ADMIN_PASSWORD) VALUES ($1, $2)',
      [adminUsername, hashedPassword]
    );

    // Log the result of the insert query
    console.log('Result of insert query:', result);

    // Check if the row was inserted
    if (result.rowCount > 0) {
      console.log('Admin created successfully!');
    } else {
      console.log('Admin creation failed.');
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error creating admin:', error);
  }
}

// Call the createAdmin function to execute the script
createAdmin();
