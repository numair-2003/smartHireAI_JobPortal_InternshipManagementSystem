import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import Icon from '../components/Icon';

const AIJobGenerator = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    title: '', skills: '', type: 'internship', location: '', company: user?.company || '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/job-description', form);
      setResult(data);
      toast.success('Job description generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    const text = `${result.description}\n\nRequirements:\n${result.requirements?.map((r) => `- ${r}`).join('\n') || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Generated content copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="container-page py-8">
      <section className="mb-8">
        <p className="text-sm font-semibold text-primary-700">AI drafting assistant</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Generate a job description</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Turn a role title, location, and skills into a structured posting with requirements and parsed tags.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={handleGenerate} className="card space-y-4">
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Job title</span>
            <input className="input-field" placeholder="Frontend Developer Intern" required value={form.title}
              onChange={(e) => update('title', e.target.value)} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Company</span>
            <input className="input-field" placeholder="Company" value={form.company}
              onChange={(e) => update('company', e.target.value)} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Skills</span>
            <input className="input-field" placeholder="React, Tailwind CSS, Redux" value={form.skills}
              onChange={(e) => update('skills', e.target.value)} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Location</span>
              <input className="input-field" placeholder="Remote / Lahore" value={form.location}
                onChange={(e) => update('location', e.target.value)} />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Type</span>
              <select className="input-field" value={form.type} onChange={(e) => update('type', e.target.value)}>
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </label>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Generating...' : 'Generate with AI'}
            {!loading && <Icon name="spark" className="h-4 w-4" />}
          </button>
        </form>

        <section className="card">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-700">Generated posting</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {result ? form.title || 'Generated role' : 'Output preview'}
              </h2>
            </div>
            {result && (
              <button type="button" onClick={copyResult} className="btn-outline">
                Copy
              </button>
            )}
          </div>

          {!result ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-primary-700">
                <Icon name="spark" className="h-6 w-6" />
              </div>
              <p className="font-semibold text-slate-900">AI output appears here</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Structured descriptions, requirements, and skill tags render as soon as a draft is generated.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg bg-slate-50 p-5">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                  {result.description}
                </pre>
              </div>
              <div>
                <h3 className="font-bold text-slate-950">Requirements</h3>
                <div className="mt-3 grid gap-2">
                  {result.requirements?.map((r) => (
                    <div key={r} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                      <Icon name="check" className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skills?.map((skill) => <span key={skill} className="chip">{skill}</span>)}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AIJobGenerator;
