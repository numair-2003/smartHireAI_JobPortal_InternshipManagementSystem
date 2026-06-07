import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { applyToJob } from '../features/applicationSlice';
import api from '../services/api';
import Icon from './Icon';

const ApplyForm = ({ job }) => {
  const dispatch = useDispatch();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const runAiReview = async () => {
    if (!resumeText.trim()) {
      toast.error('Paste resume text for AI review');
      return;
    }
    setReviewing(true);
    try {
      const { data } = await api.post('/ai/resume-review', {
        resumeText,
        jobTitle: job.title,
        jobSkills: job.skills,
      });
      setAiResult(data);
      toast.success('AI review complete');
    } catch {
      toast.error('AI review failed');
    } finally {
      setReviewing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('jobId', job._id);
    formData.append('coverLetter', coverLetter);
    if (resumeText) formData.append('resumeText', resumeText);
    if (file) formData.append('resume', file);

    const result = await dispatch(applyToJob(formData));
    setLoading(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setCoverLetter('');
      setResumeText('');
      setFile(null);
      setAiResult(null);
      toast.success('Application submitted!');
    } else {
      toast.error(result.payload || 'Application failed');
    }
  };

  return (
    <section className="card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Apply for this position</h2>
          <p className="mt-1 text-sm text-slate-500">Attach your resume, review fit, and submit your application.</p>
        </div>
        <div className="icon-tile bg-primary-50 text-primary-700 ring-primary-100">
          <Icon name="spark" className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Resume file</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])}
            className="input-field" />
          {file && <span className="mt-2 block text-xs font-medium text-slate-500">{file.name}</span>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Resume text</span>
          <textarea className="input-field min-h-[150px]" placeholder="Paste resume text for AI review"
            value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        </label>

        <button type="button" onClick={runAiReview} className="btn-outline" disabled={reviewing}>
          {reviewing ? 'Reviewing...' : 'Run AI Resume Review'}
          {!reviewing && <Icon name="spark" className="h-4 w-4" />}
        </button>

        {aiResult && (
          <div className="rounded-lg border border-primary-100 bg-primary-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary-700">AI fit score</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">{aiResult.score}/100</p>
              </div>
              <div className="progress-track w-full max-w-xs bg-white">
                <div className="progress-fill" style={{ width: `${aiResult.score || 0}%` }} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{aiResult.feedback}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-slate-900">Strengths</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {aiResult.strengths?.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Icon name="check" className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Improvements</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {aiResult.improvements?.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Icon name="spark" className="mt-0.5 h-4 w-4 text-primary-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Cover letter</span>
          <textarea className="input-field min-h-[110px]" placeholder="Share why you are a strong fit"
            value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </section>
  );
};

export default ApplyForm;
