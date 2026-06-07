require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const dns = require('dns');
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const demoPassword = 'password123';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const adminPasswordLabel = process.env.ADMIN_PASSWORD ? '<ADMIN_PASSWORD from backend/.env>' : 'admin123';

const users = [
  {
    name: 'Ayesha Khan',
    email: 'student@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+92 300 1234567',
    resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/smarthire/resumes/ayesha-resume.pdf',
  },
  {
    name: 'Bilal Ahmed',
    email: 'recruiter@smarthire.ai',
    password: demoPassword,
    role: 'recruiter',
    company: 'TechNova Labs',
    phone: '+92 321 9876543',
  },
  {
    name: 'Platform Admin',
    email: 'admin@smarthire.ai',
    password: adminPassword,
    role: 'admin',
  },
  {
    name: 'Sara Malik',
    email: 'sara.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+92 333 4455667',
    resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/smarthire/resumes/sara-resume.pdf',
  },
  {
    name: 'Hamza Raza',
    email: 'hamza.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+92 302 8899001',
    resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/smarthire/resumes/hamza-resume.pdf',
  },
  {
    name: 'Maha Siddiqui',
    email: 'maha.demo@smarthire.ai',
    password: demoPassword,
    role: 'recruiter',
    company: 'DataPulse AI',
  },
];

const jobs = [
  {
    title: 'MERN Stack Intern',
    company: 'TechNova Labs',
    type: 'internship',
    location: 'Lahore, Hybrid',
    salary: 'PKR 35k - 55k',
    description:
      'Join a product engineering team building dashboard experiences, API integrations, and recruiter tools for early-talent hiring.',
    requirements: [
      'Strong foundation in React and component state',
      'Basic Node.js and Express API knowledge',
      'Comfortable with MongoDB documents and REST endpoints',
      'Portfolio project or internship experience preferred',
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
  },
  {
    title: 'Frontend Developer Associate',
    company: 'TechNova Labs',
    type: 'full-time',
    location: 'Remote',
    salary: 'PKR 90k - 140k',
    description:
      'Own responsive product screens, reusable UI components, accessibility improvements, and polished interface states.',
    requirements: [
      'Experience building React applications',
      'Strong CSS and responsive layout skills',
      'Understanding of Redux Toolkit or similar state tools',
      'Ability to translate product requirements into usable screens',
    ],
    skills: ['React', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
  },
  {
    title: 'AI Product Intern',
    company: 'DataPulse AI',
    type: 'internship',
    location: 'Islamabad',
    salary: 'PKR 45k - 65k',
    description:
      'Support AI feature testing, prompt evaluation, resume review workflows, and product analytics for hiring teams.',
    requirements: [
      'Interest in AI products and user research',
      'Ability to test prompts and document output quality',
      'Basic API and analytics understanding',
      'Strong written communication',
    ],
    skills: ['Prompting', 'APIs', 'Analytics', 'Communication'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
  },
  {
    title: 'Backend API Intern',
    company: 'DataPulse AI',
    type: 'internship',
    location: 'Karachi, On-site',
    salary: 'PKR 40k - 60k',
    description:
      'Work with Express, MongoDB, authentication, and notification APIs that support recruiter and candidate workflows.',
    requirements: [
      'Node.js fundamentals',
      'MongoDB schema and query basics',
      'JWT authentication awareness',
      'Willingness to debug API flows',
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Socket.io'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
  },
  {
    title: 'UI/UX Research Intern',
    company: 'BrightByte Studio',
    type: 'part-time',
    location: 'Lahore',
    salary: 'PKR 30k - 45k',
    description:
      'Help research student job-search behavior, recruiter screening patterns, and dashboard usability for hiring teams.',
    requirements: [
      'Portfolio or coursework in UI/UX',
      'Strong observation and note-taking skills',
      'Basic Figma familiarity',
      'Comfortable interviewing users',
    ],
    skills: ['UX Research', 'Figma', 'User Interviews', 'Product Thinking'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
  },
];

const ensureUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    existing.name = data.name;
    existing.role = data.role;
    existing.company = data.company || '';
    existing.phone = data.phone || '';
    existing.resumeUrl = data.resumeUrl || existing.resumeUrl;
    existing.isActive = true;
    existing.password = data.password;
    await existing.save();
    return existing;
  }
  return User.create(data);
};

const seed = async () => {
  const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const createdUsers = {};
  for (const user of users) {
    createdUsers[user.email] = await ensureUser(user);
  }

  const demoCompanies = ['TechNova Labs', 'DataPulse AI', 'BrightByte Studio'];
  const oldJobs = await Job.find({ company: { $in: demoCompanies } }).select('_id');
  const oldJobIds = oldJobs.map((job) => job._id);
  await Promise.all([
    Application.deleteMany({ job: { $in: oldJobIds } }),
    Job.deleteMany({ _id: { $in: oldJobIds } }),
    Notification.deleteMany({ user: { $in: Object.values(createdUsers).map((user) => user._id) } }),
  ]);

  const recruiterByCompany = {
    'TechNova Labs': createdUsers['recruiter@smarthire.ai'],
    'DataPulse AI': createdUsers['maha.demo@smarthire.ai'],
    'BrightByte Studio': createdUsers['recruiter@smarthire.ai'],
  };

  const createdJobs = [];
  for (const job of jobs) {
    createdJobs.push(await Job.create({
      ...job,
      postedBy: recruiterByCompany[job.company]._id,
      isActive: true,
    }));
  }

  const [student, sara, hamza] = [
    createdUsers['student@smarthire.ai'],
    createdUsers['sara.demo@smarthire.ai'],
    createdUsers['hamza.demo@smarthire.ai'],
  ];

  await Application.insertMany([
    {
      job: createdJobs[0]._id,
      student: student._id,
      resumeUrl: student.resumeUrl,
      coverLetter: 'I have built MERN projects with authentication, dashboards, and MongoDB APIs. I am excited to contribute to a real product team.',
      status: 'shortlisted',
      aiReview: {
        score: 88,
        feedback: 'Strong alignment with MERN stack responsibilities and project-based experience.',
        strengths: ['Relevant full-stack project experience', 'Clear React and Node.js foundation'],
        improvements: ['Add more measurable impact from previous projects', 'Mention deployment experience'],
      },
    },
    {
      job: createdJobs[1]._id,
      student: sara._id,
      resumeUrl: sara.resumeUrl,
      coverLetter: 'My focus is responsive React interfaces and reusable UI systems. I enjoy turning product requirements into polished screens.',
      status: 'reviewed',
      aiReview: {
        score: 81,
        feedback: 'Good frontend fit with room to add deeper state management examples.',
        strengths: ['Strong UI portfolio', 'Good Tailwind CSS experience'],
        improvements: ['Add Redux examples', 'Clarify accessibility work'],
      },
    },
    {
      job: createdJobs[2]._id,
      student: hamza._id,
      resumeUrl: hamza.resumeUrl,
      coverLetter: 'I am interested in AI product testing, prompt evaluation, and analytics-driven improvements.',
      status: 'pending',
      aiReview: {
        score: 74,
        feedback: 'Solid interest in AI workflows with opportunities to show more product analytics evidence.',
        strengths: ['Strong communication', 'Relevant AI interest'],
        improvements: ['Add examples of API testing', 'Include analytics projects'],
      },
    },
    {
      job: createdJobs[3]._id,
      student: student._id,
      resumeUrl: student.resumeUrl,
      coverLetter: 'I have worked with Express APIs, JWT auth, and MongoDB models in my final project.',
      status: 'accepted',
      aiReview: {
        score: 91,
        feedback: 'Excellent match for backend API internship requirements.',
        strengths: ['Relevant Express and MongoDB experience', 'Authentication project experience'],
        improvements: ['Add API testing details'],
      },
    },
  ]);

  await Notification.insertMany([
    {
      user: student._id,
      title: 'Application shortlisted',
      message: 'Your MERN Stack Intern application moved to shortlisted.',
      type: 'status',
      link: '/student',
      isRead: false,
    },
    {
      user: recruiterByCompany['TechNova Labs']._id,
      title: 'New application activity',
      message: 'Candidates are now available for your TechNova roles.',
      type: 'application',
      link: `/recruiter/applications/${createdJobs[0]._id}`,
      isRead: false,
    },
    {
      user: createdUsers['admin@smarthire.ai']._id,
      title: 'Demo platform seeded',
      message: 'Demo users, jobs, applications, and notifications are ready.',
      type: 'system',
      link: '/admin',
      isRead: false,
    },
  ]);

  console.log('Demo data seeded successfully.');
  console.log('Student: student@smarthire.ai / password123');
  console.log('Recruiter: recruiter@smarthire.ai / password123');
  console.log(`Admin: admin@smarthire.ai / ${adminPasswordLabel}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('Warning: seeded admin is using the demo password. Set ADMIN_PASSWORD before public deployment.');
  }
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
