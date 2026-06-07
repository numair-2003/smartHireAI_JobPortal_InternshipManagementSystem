import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs, deleteJob } from '../features/jobSlice';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import ProfilePhotoCard from '../components/ProfilePhotoCard';
import { formatDate, timeAgo, typeLabels } from '../utils/formatters';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { myJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    const result = await dispatch(deleteJob(id));
    if (result.meta.requestStatus === 'fulfilled') toast.success('Job deleted');
    else toast.error('Delete failed');
  };

  const totalApplicants = myJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
  const activeJobs = myJobs.filter((job) => job.isActive).length;
  const internships = myJobs.filter((job) => job.type === 'internship').length;

  return (
    <div className="container-page py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-700">Recruiter workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Hiring command center</h1>
          <p className="mt-2 text-slate-600">Publish roles, monitor applicants, and move candidates through the pipeline.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/recruiter/post-job" className="btn-primary">
            Post New Job
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <Link to="/recruiter/ai-generator" className="btn-outline">
            AI Job Generator
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="My listings" value={myJobs.length} detail="Total postings" icon="briefcase" />
        <StatCard label="Active jobs" value={activeJobs} detail="Visible to students" icon="check" tone="emerald" />
        <StatCard label="Applicants" value={totalApplicants} detail="Across all roles" icon="users" tone="violet" />
        <StatCard label="Internships" value={internships} detail="Early-talent roles" icon="spark" tone="amber" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-950">My listings</h2>
            <span className="text-sm font-medium text-slate-500">{myJobs.length} records</span>
          </div>

          {myJobs.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="No jobs posted yet"
              description="Create your first role or generate a posting draft with AI."
              action={<Link to="/recruiter/post-job" className="btn-primary">Post New Job</Link>}
            />
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <article key={job._id} className="card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-primary-700">{typeLabels[job.type] || job.type}</p>
                      <h3 className="mt-2 text-lg font-bold text-slate-950">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{job.location} - Posted {timeAgo(job.createdAt)}</p>
                    </div>
                    <span className={`status-badge ${job.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${job.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">Applicants</p>
                      <p className="mt-1 text-xl font-bold text-slate-950">{job.applicationCount || 0}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">Deadline</p>
                      <p className="mt-1 text-sm font-bold text-slate-950">{formatDate(job.applicationDeadline)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">Salary</p>
                      <p className="mt-1 text-sm font-bold text-slate-950">{job.salary || 'Not disclosed'}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 4).map((skill) => <span key={skill} className="chip">{skill}</span>)}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/recruiter/applications/${job._id}`} className="btn-primary px-3 py-2">
                        View Applicants
                      </Link>
                      <button type="button" onClick={() => handleDelete(job._id)} className="btn-outline px-3 py-2 text-red-600 hover:text-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <ProfilePhotoCard />

          <div className="card">
            <h2 className="text-lg font-bold text-slate-950">Pipeline snapshot</h2>
            <p className="mt-1 text-sm text-slate-500">Applicant volume by listing.</p>
            <div className="mt-5 space-y-4">
              {myJobs.slice(0, 5).map((job) => {
                const width = totalApplicants ? Math.max(8, Math.round(((job.applicationCount || 0) / totalApplicants) * 100)) : 8;
                return (
                  <div key={job._id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-slate-700">{job.title}</span>
                      <span className="font-semibold text-slate-500">{job.applicationCount || 0}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
              {myJobs.length === 0 && <p className="text-sm text-slate-500">Pipeline appears after jobs are posted.</p>}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-slate-950">AI drafting flow</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Generate structured job descriptions, requirements, and parsed skills before publishing a listing.
            </p>
            <Link to="/recruiter/ai-generator" className="btn-outline mt-5 w-full">
              Open Generator
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default RecruiterDashboard;
