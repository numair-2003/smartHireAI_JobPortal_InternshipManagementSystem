import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchJobApplications, updateStatus } from '../features/applicationSlice';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import { averageScore, countByStatus, timeAgo } from '../utils/formatters';

const statuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];

const JobApplications = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { jobApplications } = useSelector((state) => state.applications);
  const statusCounts = countByStatus(jobApplications);
  const score = averageScore(jobApplications);

  useEffect(() => {
    dispatch(fetchJobApplications(jobId));
  }, [dispatch, jobId]);

  const handleStatus = async (id, status) => {
    const result = await dispatch(updateStatus({ id, status }));
    if (result.meta.requestStatus === 'fulfilled') toast.success(`Status updated to ${status}`);
    else toast.error('Update failed');
  };

  return (
    <div className="container-page py-8">
      <section className="mb-8">
        <p className="text-sm font-semibold text-primary-700">Applicant review</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Candidates</h1>
        <p className="mt-2 text-slate-600">Review candidate profiles, AI resume scores, cover letters, and status movement.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Applicants" value={jobApplications.length} detail="For this listing" icon="users" />
        <StatCard label="Shortlisted" value={statusCounts.shortlisted || 0} detail="High-priority candidates" icon="check" tone="emerald" />
        <StatCard label="Reviewed" value={statusCounts.reviewed || 0} detail="Screened profiles" icon="clock" tone="amber" />
        <StatCard label="Avg AI score" value={score ? `${score}/100` : '--'} detail="Resume fit signal" icon="spark" tone="violet" />
      </section>

      <section className="mt-8">
        {jobApplications.length === 0 ? (
          <EmptyState
            icon="users"
            title="No applications yet"
            description="Candidates will appear here once students apply to this listing."
          />
        ) : (
          <div className="space-y-4">
            {jobApplications.map((app) => (
              <article key={app._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      {app.student?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'ST'}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{app.student?.name}</h3>
                      <p className="text-sm text-slate-500">{app.student?.email}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">Applied {timeAgo(app.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={app.status} />
                    <select className="input-field w-auto capitalize" value={app.status}
                      onChange={(e) => handleStatus(app._id, e.target.value)}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">AI score</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                      {app.aiReview?.score ? `${app.aiReview.score}/100` : '--'}
                    </p>
                    {app.student?.resumeUrl && (
                      <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline mt-4 w-full">
                        View Resume
                      </a>
                    )}
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Cover letter</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {app.coverLetter || 'No cover letter provided.'}
                    </p>
                    {app.aiReview?.feedback && (
                      <div className="mt-4 rounded-lg bg-white p-3 text-sm text-slate-600">
                        <div className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
                          <Icon name="spark" className="h-4 w-4 text-primary-600" />
                          AI feedback
                        </div>
                        {app.aiReview.feedback}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default JobApplications;
