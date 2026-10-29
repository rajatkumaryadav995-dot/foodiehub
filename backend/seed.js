require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running the seed script.');
  }
  if (process.env.ADMIN_PASSWORD.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
  }

  await connectDB();
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const admin = await User.findOne({ email });
  if (admin) {
    admin.name = admin.name || 'Canteen Admin';
    admin.role = 'admin';
    admin.password = process.env.ADMIN_PASSWORD;
    await admin.save();
    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({
      name: 'Canteen Admin',
      email,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log(`Admin account created: ${email}`);
  }
};

seedAdmin()
  .catch((error) => {
    console.error('Unable to seed admin account:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  });
