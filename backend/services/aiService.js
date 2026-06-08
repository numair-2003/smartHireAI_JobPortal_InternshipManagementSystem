const OpenAI = require('openai');

const getClient = () => {
  if (!process.env.AI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.AI_API_KEY });
};

const parseJsonFromText = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Invalid AI response');
  return JSON.parse(match[0]);
};

const normalizeSkills = (skills = []) => {
  if (Array.isArray(skills)) return skills.map((skill) => String(skill).trim()).filter(Boolean);
  if (typeof skills === 'string') return skills.split(',').map((skill) => skill.trim()).filter(Boolean);
  return [];
};

const isRecoverableAIError = (error) => {
  const status = error?.status || error?.statusCode;
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    code.includes('quota') ||
    code.includes('rate') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('billing')
  );
};

const createFallbackResumeReview = () => ({
  score: 72,
  feedback: 'Demo mode: Live AI review is temporarily unavailable, so SmartHire generated a structured sample review.',
  strengths: ['Clear structure', 'Relevant experience mentioned'],
  improvements: ['Add measurable achievements', 'Tailor skills to the job'],
});

const createFallbackJobDescription = ({ title, skills, type, location, company }) => {
  const skillList = normalizeSkills(skills);

  return {
    description: `## ${title} at ${company}\n\nWe are hiring a **${title}** (${type}) based in **${location}**.\n\n### Responsibilities\n- Build and improve production-ready features with the team\n- Collaborate with product, design, and engineering stakeholders\n- Write clean, maintainable work that supports real hiring workflows\n- Review requirements, identify gaps, and communicate progress clearly\n\n### Qualifications\n- Strong foundation in ${skillList.join(', ') || 'relevant technologies'}\n- Practical project experience or internship-ready portfolio work\n- Good problem-solving and communication skills\n- Ability to learn quickly and work in a team environment`,
    requirements: [
      `Hands-on experience with ${skillList[0] || 'the required stack'}`,
      'Strong problem-solving and debugging skills',
      'Good written and verbal communication',
      'Ability to collaborate with cross-functional teams',
      'Portfolio, coursework, or equivalent practical experience',
    ],
    skills: skillList.length ? skillList : ['Communication', 'Teamwork'],
  };
};

const reviewResume = async ({ resumeText, jobTitle, jobSkills = [] }) => {
  const client = getClient();
  const skillList = normalizeSkills(jobSkills);
  const prompt = `Review this resume for a "${jobTitle}" role.
Skills needed: ${skillList.join(', ') || 'general'}
Resume:
${resumeText.slice(0, 6000)}

Return ONLY valid JSON:
{"score":0-100,"feedback":"summary","strengths":["..."],"improvements":["..."]}`;

  if (!client) {
    return createFallbackResumeReview();
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    return parseJsonFromText(completion.choices[0].message.content);
  } catch (error) {
    if (isRecoverableAIError(error)) {
      return createFallbackResumeReview();
    }
    throw error;
  }
};

const generateJobDescription = async ({ title, skills, type, location, company }) => {
  const client = getClient();
  const skillList = normalizeSkills(skills);
  const prompt = `Generate a professional job posting as JSON for:
Title: ${title}
Company: ${company}
Type: ${type}
Location: ${location}
Skills: ${skillList.join(', ')}

Return ONLY valid JSON:
{"description":"full markdown description","requirements":["5 items"],"skills":["parsed skills"]}`;

  if (!client) {
    return createFallbackJobDescription({ title, skills, type, location, company });
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    return parseJsonFromText(completion.choices[0].message.content);
  } catch (error) {
    if (isRecoverableAIError(error)) {
      return createFallbackJobDescription({ title, skills, type, location, company });
    }
    throw error;
  }
};

module.exports = { reviewResume, generateJobDescription };
