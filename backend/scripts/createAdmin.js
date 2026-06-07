require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const dns = require('dns');
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@smarthire.ai';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is required when NODE_ENV=production');
  }

  if (password.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters long');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    if (process.env.ADMIN_PASSWORD) {
      existing.password = password;
    }
    await existing.save();
    console.log(
      process.env.ADMIN_PASSWORD
        ? 'Existing admin user updated with configured password:'
        : 'Existing user promoted to admin:',
      email
    );
  } else {
    await User.create({
      name: 'Admin',
      email,
      password,
      role: 'admin',
    });
    console.log('Admin created:', email);
    if (!process.env.ADMIN_PASSWORD) {
      console.log('Default demo password used. Set ADMIN_PASSWORD in backend/.env before production.');
    }
  }
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
