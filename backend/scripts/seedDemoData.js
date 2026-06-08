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
  {
    name: 'Emma Johnson',
    email: 'emma.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+44 7700 900123',
  },
  {
    name: 'Lucas Meyer',
    email: 'lucas.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+49 1512 3456789',
  },
  {
    name: 'Sofia Garcia',
    email: 'sofia.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+34 612 345 678',
  },
  {
    name: 'Omar Hassan',
    email: 'omar.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+971 50 123 4567',
  },
  {
    name: 'Mei Chen',
    email: 'mei.demo@smarthire.ai',
    password: demoPassword,
    role: 'student',
    phone: '+65 8123 4567',
  },
  {
    name: 'Olivia Smith',
    email: 'olivia.recruiter@smarthire.ai',
    password: demoPassword,
    role: 'recruiter',
    company: 'CloudBridge Analytics',
    phone: '+44 20 7946 0123',
  },
  {
    name: 'Carlos Rivera',
    email: 'carlos.recruiter@smarthire.ai',
    password: demoPassword,
    role: 'recruiter',
    company: 'NexaWorks',
    phone: '+1 512 555 0184',
  },
  {
    name: 'Priya Nair',
    email: 'priya.recruiter@smarthire.ai',
    password: demoPassword,
    role: 'recruiter',
    company: 'FinEdge Digital',
    phone: '+971 55 234 7890',
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
  {
    title: 'Junior Cloud Engineer',
    company: 'CloudBridge Analytics',
    type: 'full-time',
    location: 'London, United Kingdom',
    salary: 'GBP 38k - 48k',
    description:
      'Support cloud-hosted analytics products, deployment pipelines, monitoring dashboards, and customer-facing platform reliability.',
    requirements: [
      'Basic understanding of cloud platforms and Linux',
      'Comfortable reading logs and debugging deployment issues',
      'Foundational knowledge of CI/CD workflows',
      'Interest in observability and production support',
    ],
    skills: ['Azure', 'Docker', 'CI/CD', 'Linux', 'Monitoring'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
  },
  {
    title: 'Data Analyst Intern',
    company: 'FinEdge Digital',
    type: 'internship',
    location: 'Dubai, UAE',
    salary: 'AED 4k - 6k',
    description:
      'Analyze fintech product metrics, build reporting dashboards, and help teams understand customer onboarding and transaction behavior.',
    requirements: [
      'Strong Excel or spreadsheet analysis skills',
      'Basic SQL knowledge',
      'Ability to explain insights clearly',
      'Interest in fintech products and customer journeys',
    ],
    skills: ['SQL', 'Excel', 'Power BI', 'Analytics', 'Fintech'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24),
  },
  {
    title: 'Product Design Intern',
    company: 'PixelForge Studio',
    type: 'internship',
    location: 'Berlin, Germany',
    salary: 'EUR 1.2k - 1.8k',
    description:
      'Design clean SaaS workflows, prototype user journeys, and collaborate with engineers to ship polished interface improvements.',
    requirements: [
      'Figma portfolio with product screens',
      'Understanding of responsive web layouts',
      'Comfort with usability testing notes',
      'Good visual hierarchy and typography sense',
    ],
    skills: ['Figma', 'Product Design', 'Prototyping', 'Usability Testing'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27),
  },
  {
    title: 'AI Engineer Associate',
    company: 'NeuralForge AI',
    type: 'full-time',
    location: 'San Francisco, USA',
    salary: 'USD 95k - 125k',
    description:
      'Build AI-assisted workflow features, evaluate LLM outputs, integrate APIs, and improve prompt-driven automation for business teams.',
    requirements: [
      'Python or JavaScript API development experience',
      'Understanding of LLM prompting and evaluation',
      'Ability to design reliable fallback behavior',
      'Strong debugging and documentation habits',
    ],
    skills: ['OpenAI API', 'Python', 'Node.js', 'Prompt Engineering', 'Evaluation'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 32),
  },
  {
    title: 'QA Automation Intern',
    company: 'NexaWorks',
    type: 'internship',
    location: 'Austin, USA',
    salary: 'USD 22 - 28/hr',
    description:
      'Write automated browser tests, verify release flows, and help product teams catch regressions before customer demos.',
    requirements: [
      'JavaScript testing fundamentals',
      'Interest in Playwright or Cypress',
      'Clear bug reporting skills',
      'Comfort testing forms, dashboards, and APIs',
    ],
    skills: ['Playwright', 'Cypress', 'JavaScript', 'QA', 'Regression Testing'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
  },
  {
    title: 'Mobile App Developer Intern',
    company: 'FinEdge Digital',
    type: 'internship',
    location: 'Singapore',
    salary: 'SGD 1.5k - 2.2k',
    description:
      'Help build mobile-first fintech screens, reusable React Native components, and smooth authentication experiences.',
    requirements: [
      'React or React Native fundamentals',
      'Understanding of mobile UI states',
      'Basic REST API integration experience',
      'Interest in secure fintech workflows',
    ],
    skills: ['React Native', 'React', 'REST APIs', 'Mobile UI', 'Authentication'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
  {
    title: 'Cybersecurity Analyst Trainee',
    company: 'SecureWave Labs',
    type: 'contract',
    location: 'Amsterdam, Netherlands',
    salary: 'EUR 2.8k - 3.6k',
    description:
      'Review security alerts, document incident patterns, and support teams with practical web application security checks.',
    requirements: [
      'Basic networking and web security awareness',
      'Interest in OWASP concepts',
      'Good written investigation notes',
      'Ability to follow triage playbooks',
    ],
    skills: ['OWASP', 'Security Monitoring', 'Networking', 'Incident Triage'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 26),
  },
  {
    title: 'DevOps Intern',
    company: 'CloudBridge Analytics',
    type: 'internship',
    location: 'Toronto, Canada',
    salary: 'CAD 24 - 30/hr',
    description:
      'Assist with deployment automation, environment configuration, uptime checks, and release notes for analytics teams.',
    requirements: [
      'Basic GitHub Actions knowledge',
      'Comfort with environment variables and logs',
      'Interest in cloud deployments',
      'Careful documentation habits',
    ],
    skills: ['GitHub Actions', 'Azure', 'Deployment', 'Environment Variables', 'DevOps'],
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22),
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

  const demoCompanies = [
    'TechNova Labs',
    'DataPulse AI',
    'BrightByte Studio',
    'CloudBridge Analytics',
    'FinEdge Digital',
    'PixelForge Studio',
    'NeuralForge AI',
    'NexaWorks',
    'SecureWave Labs',
  ];
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
    'CloudBridge Analytics': createdUsers['olivia.recruiter@smarthire.ai'],
    'FinEdge Digital': createdUsers['priya.recruiter@smarthire.ai'],
    'PixelForge Studio': createdUsers['carlos.recruiter@smarthire.ai'],
    'NeuralForge AI': createdUsers['olivia.recruiter@smarthire.ai'],
    'NexaWorks': createdUsers['carlos.recruiter@smarthire.ai'],
    'SecureWave Labs': createdUsers['priya.recruiter@smarthire.ai'],
  };

  const createdJobs = [];
  for (const job of jobs) {
    createdJobs.push(await Job.create({
      ...job,
      postedBy: recruiterByCompany[job.company]._id,
      isActive: true,
    }));
  }

  const [student, sara, hamza, emma, lucas, sofia, omar, mei] = [
    createdUsers['student@smarthire.ai'],
    createdUsers['sara.demo@smarthire.ai'],
    createdUsers['hamza.demo@smarthire.ai'],
    createdUsers['emma.demo@smarthire.ai'],
    createdUsers['lucas.demo@smarthire.ai'],
    createdUsers['sofia.demo@smarthire.ai'],
    createdUsers['omar.demo@smarthire.ai'],
    createdUsers['mei.demo@smarthire.ai'],
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
    {
      job: createdJobs[5]._id,
      student: emma._id,
      coverLetter: 'I have completed cloud fundamentals coursework and enjoy debugging deployment pipelines and monitoring dashboards.',
      status: 'reviewed',
      aiReview: {
        score: 79,
        feedback: 'Good cloud learning signal with practical deployment interest.',
        strengths: ['Cloud fundamentals', 'Strong troubleshooting mindset'],
        improvements: ['Add production monitoring examples', 'Mention specific CI/CD tools used'],
      },
    },
    {
      job: createdJobs[6]._id,
      student: omar._id,
      coverLetter: 'My coursework includes SQL dashboards and customer analytics. I am excited to apply data skills in a fintech environment.',
      status: 'shortlisted',
      aiReview: {
        score: 84,
        feedback: 'Strong regional fit and useful analytics foundation for the Dubai internship.',
        strengths: ['SQL and dashboard exposure', 'Clear fintech motivation'],
        improvements: ['Add one quantified analytics project', 'List visualization tools more clearly'],
      },
    },
    {
      job: createdJobs[7]._id,
      student: lucas._id,
      coverLetter: 'I enjoy designing clear product flows in Figma and validating them with quick usability sessions.',
      status: 'pending',
      aiReview: {
        score: 77,
        feedback: 'Relevant design motivation with room to show more shipped product examples.',
        strengths: ['Figma and user flow experience', 'Good usability mindset'],
        improvements: ['Add portfolio links', 'Show responsive design cases'],
      },
    },
    {
      job: createdJobs[8]._id,
      student: mei._id,
      coverLetter: 'I have built Node.js integrations and experimented with prompt evaluation for AI-assisted workflows.',
      status: 'accepted',
      aiReview: {
        score: 89,
        feedback: 'Strong technical alignment with AI workflow and API requirements.',
        strengths: ['API integration experience', 'Prompt evaluation interest'],
        improvements: ['Add reliability testing details'],
      },
    },
    {
      job: createdJobs[9]._id,
      student: sofia._id,
      coverLetter: 'I want to grow in QA automation by testing real user flows, forms, dashboards, and release journeys.',
      status: 'reviewed',
      aiReview: {
        score: 82,
        feedback: 'Good QA fit with a clear interest in browser automation and release quality.',
        strengths: ['Testing mindset', 'Clear bug reporting focus'],
        improvements: ['Add Playwright or Cypress practice examples'],
      },
    },
    {
      job: createdJobs[10]._id,
      student: mei._id,
      coverLetter: 'I have React experience and want to deepen my React Native skills for secure mobile product screens.',
      status: 'pending',
      aiReview: {
        score: 76,
        feedback: 'Good frontend foundation for mobile work, with space to show native mobile experience.',
        strengths: ['React fundamentals', 'API integration awareness'],
        improvements: ['Add mobile project samples', 'Mention authentication flows built'],
      },
    },
    {
      job: createdJobs[11]._id,
      student: lucas._id,
      coverLetter: 'I am interested in web security, OWASP basics, and structured incident notes for application teams.',
      status: 'shortlisted',
      aiReview: {
        score: 80,
        feedback: 'Promising security trainee profile with useful documentation habits.',
        strengths: ['Security interest', 'Good written triage approach'],
        improvements: ['Add home lab or CTF examples', 'Clarify networking fundamentals'],
      },
    },
    {
      job: createdJobs[12]._id,
      student: emma._id,
      coverLetter: 'I have used GitHub Actions in coursework and want hands-on practice with Azure deployment workflows.',
      status: 'pending',
      aiReview: {
        score: 78,
        feedback: 'Relevant DevOps learning path and strong motivation for deployment automation.',
        strengths: ['GitHub Actions interest', 'Environment configuration awareness'],
        improvements: ['Add examples of logs/debugging', 'List any cloud projects deployed'],
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
    {
      user: createdUsers['olivia.recruiter@smarthire.ai']._id,
      title: 'Global roles are live',
      message: 'CloudBridge Analytics and NeuralForge AI demo listings are ready for review.',
      type: 'job',
      link: '/recruiter',
      isRead: false,
    },
    {
      user: createdUsers['priya.recruiter@smarthire.ai']._id,
      title: 'New international applicants',
      message: 'Candidates have applied to your FinEdge Digital and SecureWave Labs roles.',
      type: 'application',
      link: '/recruiter',
      isRead: false,
    },
  ]);

  console.log('Demo data seeded successfully.');
  console.log('Students:');
  [
    'student@smarthire.ai',
    'sara.demo@smarthire.ai',
    'hamza.demo@smarthire.ai',
    'emma.demo@smarthire.ai',
    'lucas.demo@smarthire.ai',
    'sofia.demo@smarthire.ai',
    'omar.demo@smarthire.ai',
    'mei.demo@smarthire.ai',
  ].forEach((email) => console.log(`- ${email} / password123`));
  console.log('Recruiters:');
  [
    'recruiter@smarthire.ai',
    'maha.demo@smarthire.ai',
    'olivia.recruiter@smarthire.ai',
    'carlos.recruiter@smarthire.ai',
    'priya.recruiter@smarthire.ai',
  ].forEach((email) => console.log(`- ${email} / password123`));
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
