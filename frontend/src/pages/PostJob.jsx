import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createJob } from '../features/jobSlice';
import Icon from '../components/Icon';

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    title: '',
    company: user?.company || '',
    type: 'internship',
    location: '',
    salary: '',
    applicationDeadline: '',
    description: '',
    requirements: '',
    skills: '',
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
  const requirements = form.requirements.split('\n').filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      applicationDeadline: form.applicationDeadline || undefined,
      requirements,
      skills,
    };
    const result = await dispatch(createJob(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Job posted!');
      navigate('/recruiter');
    } else toast.error(result.payload || 'Failed to post job');
  };

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary-700">Create listing</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Post a job or internship</h1>
        <p className="mt-2 text-slate-600">Publish a structured role with skills, requirements, salary, and deadline context.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Job title</span>
              <input className="input-field" placeholder="MERN Stack Intern" required value={form.title}
                onChange={(e) => update('title', e.target.value)} />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Company</span>
              <input className="input-field" placeholder="Company" required value={form.company}
                onChange={(e) => update('company', e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Type</span>
              <select className="input-field" value={form.type} onChange={(e) => update('type', e.target.value)}>
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Location</span>
              <input className="input-field" placeholder="Lahore / Remote" required value={form.location}
                onChange={(e) => update('location', e.target.value)} />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Deadline</span>
              <input type="date" className="input-field" value={form.applicationDeadline}
                onChange={(e) => update('applicationDeadline', e.target.value)} />
            </label>
          </div>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Salary</span>
            <input className="input-field" placeholder="PKR 35k - 55k" value={form.salary}
              onChange={(e) => update('salary', e.target.value)} />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Job description</span>
            <textarea className="input-field min-h-[180px]" placeholder="Describe responsibilities, team, and outcomes." required
              value={form.description} onChange={(e) => update('description', e.target.value)} />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Requirements</span>
            <textarea className="input-field min-h-[110px]" placeholder="One requirement per line"
              value={form.requirements} onChange={(e) => update('requirements', e.target.value)} />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Skills</span>
            <input className="input-field" placeholder="React, Node.js, MongoDB" value={form.skills}
              onChange={(e) => update('skills', e.target.value)} />
          </label>

          <button type="submit" className="btn-primary w-full">
            Publish Job
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </form>

        <aside className="card h-fit">
          <p className="text-sm font-semibold text-primary-700">Live preview</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">{form.title || 'Role title'}</h2>
          <p className="mt-1 font-semibold text-slate-600">{form.company || 'Company name'}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-slate-500">Type</p>
              <p className="mt-1 capitalize text-slate-900">{form.type}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-slate-500">Location</p>
              <p className="mt-1 text-slate-900">{form.location || 'Location'}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            {form.description || 'A clear description helps students understand the work, expectations, and growth opportunity.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(skills.length ? skills : ['React', 'Node.js', 'MongoDB']).slice(0, 5).map((skill) => (
              <span key={skill} className="chip">{skill}</span>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-800">
            <div className="flex gap-2">
              <Icon name="spark" className="mt-0.5 h-4 w-4" />
              <p>{requirements.length || 0} requirements and {skills.length || 0} skill tags ready for candidate matching.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostJob;
