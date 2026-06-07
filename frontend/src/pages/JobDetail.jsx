import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import ApplyForm from '../components/ApplyForm';
import Icon from '../components/Icon';
import { formatDate, timeAgo, typeLabels } from '../utils/formatters';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="py-16 text-center text-slate-500">Loading...</p>;
  if (!job) return <p className="py-16 text-center text-slate-500">Job not found</p>;

  return (
    <div className="container-page py-8">
      <Link to="/jobs" className="btn-ghost mb-6 inline-flex">
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        Back to jobs
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-primary-700">{typeLabels[job.type] || job.type}</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">{job.title}</h1>
              <p className="mt-2 text-lg font-semibold text-slate-600">{job.company}</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-lg font-bold text-slate-700">
              {job.company?.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Location</p>
              <p className="mt-1 font-bold text-slate-950">{job.location}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Salary</p>
              <p className="mt-1 font-bold text-slate-950">{job.salary || 'Not disclosed'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Deadline</p>
              <p className="mt-1 font-bold text-slate-950">{formatDate(job.applicationDeadline)}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">About this role</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {job.description}
            </div>
          </div>

          {job.requirements?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-950">Requirements</h2>
              <div className="mt-4 grid gap-3">
                {job.requirements.map((r) => (
                  <div key={r} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-950">Role snapshot</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Posted</span>
                <span className="font-semibold text-slate-900">{timeAgo(job.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Work type</span>
                <span className="font-semibold capitalize text-slate-900">{job.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Recruiter</span>
                <span className="font-semibold text-slate-900">{job.postedBy?.name || 'Recruiter'}</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {job.skills?.map((skill) => <span key={skill} className="chip">{skill}</span>)}
            </div>
          </div>

          {!user && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-950">Ready to apply?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Create a student account to submit applications and run resume review.</p>
              <Link to="/register" className="btn-primary mt-5 w-full">Create Account</Link>
            </div>
          )}
        </aside>
      </section>

      {user?.role === 'student' && (
        <div className="mt-6">
          <ApplyForm job={job} />
        </div>
      )}
    </div>
  );
};

export default JobDetail;
