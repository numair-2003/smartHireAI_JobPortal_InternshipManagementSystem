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
    return {
      score: 72,
      feedback: 'Demo mode: Configure AI_API_KEY for live AI resume review.',
      strengths: ['Clear structure', 'Relevant experience mentioned'],
      improvements: ['Add measurable achievements', 'Tailor skills to the job'],
    };
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  return parseJsonFromText(completion.choices[0].message.content);
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
    return {
      description: `## ${title} at ${company}\n\nWe are hiring a **${title}** (${type}) based in **${location}**.\n\n### Responsibilities\n- Collaborate with cross-functional teams\n- Deliver high-quality work on schedule\n- Contribute to product and process improvements\n\n### Qualifications\n- Strong foundation in ${skillList.join(', ') || 'relevant technologies'}\n- Excellent communication skills\n- Self-motivated team player`,
      requirements: [
        `Experience with ${skillList[0] || 'required stack'}`,
        'Strong problem-solving skills',
        'Good written and verbal communication',
        'Ability to work in a team environment',
        'Bachelor\'s degree or equivalent experience',
      ],
      skills: skillList.length ? skillList : ['Communication', 'Teamwork'],
    };
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  return parseJsonFromText(completion.choices[0].message.content);
};

module.exports = { reviewResume, generateJobDescription };
