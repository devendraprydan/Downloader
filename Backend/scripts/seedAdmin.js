/**
 * Seed script to create the admin user.
 * Run once: node seedAdmin.js
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in .env
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`Admin user with email ${email} already exists.`);
      process.exit(0);
    }

    const admin = new Admin({ email, password });
    await admin.save();
    console.log(`Admin user created successfully: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seed();
