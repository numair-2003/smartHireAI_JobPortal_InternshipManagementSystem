import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../features/applicationSlice';
import { updateCurrentUser } from '../features/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import ProfilePhotoCard from '../components/ProfilePhotoCard';
import { averageScore, countByStatus, timeAgo } from '../utils/formatters';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myApplications } = useSelector((state) => state.applications);
  const statusCounts = countByStatus(myApplications);
  const score = averageScore(myApplications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await api.post('/applications/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateCurrentUser({ resumeUrl: data.resumeUrl }));
      toast.success('Resume uploaded to profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="container-page py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-700">Student workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Welcome, {user?.name}</h1>
          <p className="mt-2 text-slate-600">Track applications, resume readiness, and status updates in one place.</p>
        </div>
        <Link to="/jobs" className="btn-primary">
          Browse Jobs
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Applications" value={myApplications.length} detail="Total submitted" icon="briefcase" />
        <StatCard label="Shortlisted" value={statusCounts.shortlisted || 0} detail="Recruiter interest" icon="check" tone="emerald" />
        <StatCard label="Reviewed" value={statusCounts.reviewed || 0} detail="Moved forward" icon="clock" tone="amber" />
        <StatCard label="AI average" value={score ? `${score}/100` : '--'} detail="Across reviewed resumes" icon="spark" tone="violet" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <ProfilePhotoCard />

          <div className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Resume profile</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep a resume attached so applications move faster and AI review can compare your skills.
                </p>
              </div>
              <div className="icon-tile bg-emerald-50 text-emerald-700 ring-emerald-100">
                <Icon name="upload" className="h-5 w-5" />
              </div>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Upload resume</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="input-field" />
            </label>
            {user?.resumeUrl ? (
              <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline mt-4 w-full">
                View Current Resume
              </a>
            ) : (
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                No resume is attached to your profile yet.
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Application pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">Your current hiring journey by status.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((status) => (
              <div key={status} className="rounded-lg bg-slate-50 p-3">
                <StatusBadge status={status} />
                <p className="mt-3 text-2xl font-bold text-slate-950">{statusCounts[status] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">My applications</h2>
          <span className="text-sm font-medium text-slate-500">{myApplications.length} records</span>
        </div>

        {myApplications.length === 0 ? (
          <EmptyState
            icon="briefcase"
            title="No applications yet"
            description="Browse active roles and submit your first application with resume review support."
            action={<Link to="/jobs" className="btn-primary">Browse Jobs</Link>}
          />
        ) : (
          <div className="space-y-4">
            {myApplications.map((app) => (
              <article key={app._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{app.job?.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary-700">{app.job?.company}</p>
                    <p className="mt-2 text-sm text-slate-500">Applied {timeAgo(app.createdAt)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[0.35fr_0.65fr]">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">AI resume score</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                      {app.aiReview?.score ? `${app.aiReview.score}/100` : '--'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Feedback</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {app.aiReview?.feedback || 'AI review appears after resume text is included with an application.'}
                    </p>
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

export default StudentDashboard;
