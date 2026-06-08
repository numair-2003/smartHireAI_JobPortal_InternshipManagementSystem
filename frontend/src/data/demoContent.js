export const platformStats = [
  { label: 'Active opportunities', value: '240+', detail: 'Internships and entry roles', icon: 'briefcase', tone: 'blue' },
  { label: 'Resume reviews', value: '8.7k', detail: 'AI-assisted candidate checks', icon: 'spark', tone: 'emerald' },
  { label: 'Hiring partners', value: '120+', detail: 'Recruiter-ready workflows', icon: 'building', tone: 'violet' },
  { label: 'Avg response time', value: '36h', detail: 'From application to first update', icon: 'clock', tone: 'amber' },
];

export const trustedCompanies = [
  'TechNova',
  'DataPulse',
  'CloudBridge',
  'FinEdge',
  'NeuralForge',
  'NexaWorks',
  'SecureWave',
  'PixelForge',
];

export const roleTracks = [
  {
    title: 'Student workspace',
    icon: 'users',
    desc: 'Track every application, upload resumes, and compare AI fit signals before applying.',
    points: ['Resume profile', 'Application timeline', 'AI feedback'],
  },
  {
    title: 'Recruiter command center',
    icon: 'briefcase',
    desc: 'Create postings, review applicants, and move candidates through a clear hiring pipeline.',
    points: ['Job publishing', 'Applicant scoring', 'Status updates'],
  },
  {
    title: 'Admin control room',
    icon: 'shield',
    desc: 'Monitor users, roles, jobs, applications, and platform health from one place.',
    points: ['Role management', 'Platform stats', 'Account controls'],
  },
];

export const hiringSteps = [
  { title: 'Discover', desc: 'Students search curated internships by role, type, city, and skill match.' },
  { title: 'Apply', desc: 'Candidates upload a resume and receive an AI readiness score before submitting.' },
  { title: 'Review', desc: 'Recruiters compare applicants with status workflows and activity updates.' },
  { title: 'Notify', desc: 'Socket notifications and email updates keep everyone in sync.' },
];

export const sampleActivities = [
  'A recruiter shortlisted a MERN intern candidate',
  'New React internship posted in Lahore',
  'AI resume score improved after skills update',
  'Application status changed to reviewed',
];

export const demoJobs = [
  {
    _id: 'demo-mern-intern',
    title: 'MERN Stack Intern',
    company: 'TechNova Labs',
    location: 'Lahore, Hybrid',
    type: 'internship',
    salary: 'PKR 35k - 55k',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    description: 'Join a product engineering team building internal hiring tools and dashboard experiences.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    _id: 'demo-frontend-associate',
    title: 'Frontend Developer Associate',
    company: 'CloudCraft Systems',
    location: 'Remote',
    type: 'full-time',
    salary: 'PKR 90k - 140k',
    skills: ['React', 'Tailwind CSS', 'Redux', 'UI Systems'],
    description: 'Own responsive product screens, reusable components, and high-quality user experiences.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    _id: 'demo-ai-product-intern',
    title: 'AI Product Intern',
    company: 'DataPulse AI',
    location: 'Islamabad',
    type: 'internship',
    salary: 'PKR 45k - 65k',
    skills: ['Prompting', 'APIs', 'Analytics', 'Communication'],
    description: 'Support AI feature testing, product analytics, and resume review workflow improvements.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    _id: 'demo-cloud-engineer',
    title: 'Junior Cloud Engineer',
    company: 'CloudBridge Analytics',
    location: 'London, United Kingdom',
    type: 'full-time',
    salary: 'GBP 38k - 48k',
    skills: ['Azure', 'Docker', 'CI/CD', 'Monitoring'],
    description: 'Support cloud-hosted analytics products, deployment pipelines, and platform reliability.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    _id: 'demo-ai-engineer',
    title: 'AI Engineer Associate',
    company: 'NeuralForge AI',
    location: 'San Francisco, USA',
    type: 'full-time',
    salary: 'USD 95k - 125k',
    skills: ['OpenAI API', 'Node.js', 'Prompt Engineering', 'Evaluation'],
    description: 'Build AI-assisted workflow features, evaluate LLM outputs, and integrate production APIs.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 32).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    _id: 'demo-data-analyst',
    title: 'Data Analyst Intern',
    company: 'FinEdge Digital',
    location: 'Dubai, UAE',
    type: 'internship',
    salary: 'AED 4k - 6k',
    skills: ['SQL', 'Power BI', 'Analytics', 'Fintech'],
    description: 'Analyze fintech product metrics and build reporting dashboards for customer onboarding insights.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
];
