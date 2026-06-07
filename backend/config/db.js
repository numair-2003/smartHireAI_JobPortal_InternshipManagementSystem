const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);

  if (!uri || typeof uri !== 'string') {
    console.error('\nMONGO_URI is missing.');
    console.error(' Create backend/.env from .env.example and add your MongoDB Atlas connection string.\n');
    process.exit(1);
  }

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
