import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../features/jobSlice';
import { getDashboardPath } from '../utils/getDashboardPath';
import { demoJobs, hiringSteps, platformStats, roleTracks, sampleActivities, trustedCompanies } from '../data/demoContent';
import { typeLabels, timeAgo } from '../utils/formatters';
import StatCard from '../components/StatCard';
import Icon from '../components/Icon';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState({ search: '', location: '', type: '' });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const featuredJobs = (jobs.length ? jobs : demoJobs).slice(0, 3);
  const activeJobCount = jobs.length || demoJobs.length;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 hero-grid opacity-80" />
        <div className="container-page relative grid min-h-[calc(100vh-4rem)] gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              Find internships and hire talent with AI-powered clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              SmartHire AI connects students, recruiters, and admins with resume review, job matching,
              applicant tracking, and real-time hiring updates in one polished MERN platform.
            </p>

            <form onSubmit={handleSearch} className="mt-8 rounded-lg border border-slate-200 bg-white p-3 shadow-glow">
              <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.7fr_auto]">
                <div className="relative">
                  <Icon name="search" className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    className="input-field pl-10"
                    placeholder="Search roles, companies, skills"
                    value={search.search}
                    onChange={(e) => setSearch({ ...search, search: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Icon name="location" className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    className="input-field pl-10"
                    placeholder="City or remote"
                    value={search.location}
                    onChange={(e) => setSearch({ ...search, location: e.target.value })}
                  />
                </div>
                <select
                  className="input-field"
                  value={search.type}
                  onChange={(e) => setSearch({ ...search, type: e.target.value })}
                >
                  <option value="">Any type</option>
                  <option value="internship">Internship</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
                <button type="submit" className="btn-primary px-6">
                  Browse Jobs
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {user ? (
                <Link to={getDashboardPath(user.role)} className="btn-outline">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn-outline">
                  Create Account
                </Link>
              )}
              <p className="text-sm text-slate-500">
                {activeJobCount}+ opportunities ready for demo and real hiring workflows.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              {trustedCompanies.map((company) => (
                <span key={company} className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  {company}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="soft-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">AI resume readiness</p>
                  <p className="mt-1 text-3xl font-bold text-slate-950">86/100</p>
                </div>
                <div className="icon-tile bg-emerald-50 text-emerald-700 ring-emerald-100">
                  <Icon name="spark" className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['React and Node.js alignment', 92],
                  ['Project impact clarity', 78],
                  ['ATS keyword coverage', 84],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <span className="text-slate-500">{value}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="soft-panel">
                <p className="text-sm font-semibold text-slate-500">Recruiter pipeline</p>
                <div className="mt-4 space-y-3">
                  {['New', 'Reviewed', 'Shortlisted'].map((label, index) => (
                    <div key={label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="text-sm font-bold text-slate-950">{[18, 11, 5][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="soft-panel">
                <p className="text-sm font-semibold text-slate-500">Live activity</p>
                <div className="mt-4 space-y-3">
                  {sampleActivities.map((activity) => (
                    <div key={activity} className="flex gap-2 text-sm text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page page-section">
        <div className="grid gap-4 md:grid-cols-4">
          {platformStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              value={index === 0 ? `${activeJobCount}+` : stat.value}
            />
          ))}
        </div>
      </section>

      <section className="container-page page-section pt-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Featured roles</p>
            <h2 className="section-title">Fresh opportunities with realistic hiring data</h2>
            <p className="section-copy">Browse roles with skill signals, deadlines, company context, and AI-supported application readiness.</p>
          </div>
          <Link to="/jobs" className="btn-outline">
            View Marketplace
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-primary-700">{typeLabels[job.type] || job.type}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">{job.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">{job.company}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  {job.company?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{job.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills?.slice(0, 4).map((skill) => <span key={skill} className="chip">{skill}</span>)}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span>{job.location}</span>
                <span>{timeAgo(job.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page page-section">
          <div className="mb-8">
            <p className="section-kicker">Role-based product</p>
            <h2 className="section-title">Built like a real hiring operating system</h2>
            <p className="section-copy">
              The app is more than screens: each role gets a focused workflow with real API-backed state.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {roleTracks.map((track) => (
              <div key={track.title} className="card">
                <div className="icon-tile bg-primary-50 text-primary-700 ring-primary-100">
                  <Icon name={track.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{track.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{track.desc}</p>
                <div className="mt-5 space-y-2">
                  {track.points.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Icon name="check" className="h-4 w-4 text-emerald-600" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page page-section">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="section-kicker">Workflow</p>
            <h2 className="section-title">From discovery to status update</h2>
            <p className="section-copy">
              A realistic project demo should show how data moves across the whole product, not just isolated pages.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {hiringSteps.map((step, index) => (
              <div key={step.title} className="soft-panel">
                <span className="text-sm font-bold text-primary-700">0{index + 1}</span>
                <h3 className="mt-3 font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
