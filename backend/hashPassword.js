const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'password123'; // Replace with your desired plaintext password
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hash);
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

hashPassword();
