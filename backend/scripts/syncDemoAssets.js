require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const Application = require('../models/Application');

const rootDir = path.join(__dirname, '..', '..');
const assetsDir = path.join(rootDir, 'demo-assets');

const profileAssets = [
  { email: 'student@smarthire.ai', file: 'ayesha-khan-profile.png', publicId: 'ayesha-khan-profile' },
  { email: 'sara.demo@smarthire.ai', file: 'sara-malik-profile.png', publicId: 'sara-malik-profile' },
  { email: 'hamza.demo@smarthire.ai', file: 'hamza-raza-profile.png', publicId: 'hamza-raza-profile' },
  { email: 'recruiter@smarthire.ai', file: 'bilal-ahmed-profile.png', publicId: 'bilal-ahmed-profile' },
  { email: 'maha.demo@smarthire.ai', file: 'maha-siddiqui-profile.png', publicId: 'maha-siddiqui-profile' },
];

const resumeAssets = [
  { email: 'student@smarthire.ai', file: 'ayesha-khan-resume.pdf', publicId: 'ayesha-khan-resume.pdf' },
  { email: 'sara.demo@smarthire.ai', file: 'sara-malik-resume.pdf', publicId: 'sara-malik-resume.pdf' },
  { email: 'hamza.demo@smarthire.ai', file: 'hamza-raza-resume.pdf', publicId: 'hamza-raza-resume.pdf' },
  { email: 'emma.demo@smarthire.ai', file: 'emma-johnson-resume.pdf', publicId: 'emma-johnson-resume.pdf' },
  { email: 'lucas.demo@smarthire.ai', file: 'lucas-meyer-resume.pdf', publicId: 'lucas-meyer-resume.pdf' },
  { email: 'sofia.demo@smarthire.ai', file: 'sofia-garcia-resume.pdf', publicId: 'sofia-garcia-resume.pdf' },
  { email: 'omar.demo@smarthire.ai', file: 'omar-hassan-resume.pdf', publicId: 'omar-hassan-resume.pdf' },
  { email: 'mei.demo@smarthire.ai', file: 'mei-chen-resume.pdf', publicId: 'mei-chen-resume.pdf' },
];

const requireEnv = (name) => {
  if (!process.env[name]) {
    throw new Error(`${name} is required in backend/.env`);
  }
};

const configureDns = () => {
  const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }
};

const assertFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing demo asset: ${filePath}`);
  }
};

const uploadAsset = async ({ filePath, folder, publicId, resourceType }) => {
  assertFileExists(filePath);

  return cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    resource_type: resourceType,
    overwrite: true,
    unique_filename: false,
  });
};

const syncProfilePhotos = async () => {
  for (const asset of profileAssets) {
    const uploaded = await uploadAsset({
      filePath: path.join(assetsDir, 'profile-photos', asset.file),
      folder: 'smarthire/profile-photos',
      publicId: asset.publicId,
      resourceType: 'image',
    });

    await User.updateOne(
      { email: asset.email, role: { $ne: 'admin' } },
      { avatar: uploaded.secure_url, avatarPublicId: uploaded.public_id }
    );

    console.log(`Profile photo synced: ${asset.email}`);
  }
};

const syncResumes = async () => {
  for (const asset of resumeAssets) {
    const uploaded = await uploadAsset({
      filePath: path.join(assetsDir, 'resumes', asset.file),
      folder: 'smarthire/resumes',
      publicId: asset.publicId,
      resourceType: 'raw',
    });

    const user = await User.findOneAndUpdate(
      { email: asset.email, role: 'student' },
      { resumeUrl: uploaded.secure_url, resumePublicId: uploaded.public_id },
      { new: true }
    );

    if (!user) {
      console.log(`Skipped resume, user not found: ${asset.email}`);
      continue;
    }

    const result = await Application.updateMany(
      { student: user._id },
      { $set: { resumeUrl: uploaded.secure_url } }
    );

    console.log(`Resume synced: ${asset.email} (${result.modifiedCount} application records updated)`);
  }
};

const run = async () => {
  ['MONGO_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].forEach(requireEnv);
  configureDns();

  await mongoose.connect(process.env.MONGO_URI);
  await syncProfilePhotos();
  await syncResumes();
  await mongoose.disconnect();

  console.log('Demo assets synced successfully.');
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
