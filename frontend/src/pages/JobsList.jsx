import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../features/jobSlice';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';

const jobTypes = [
  { value: '', label: 'All roles' },
  { value: 'internship', label: 'Internships' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];

const JobsList = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { jobs, isLoading } = useSelector((state) => state.jobs);
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    type: params.get('type') || '',
    location: params.get('location') || '',
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchJobs(filters));
    const nextParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
    });
    setParams(nextParams, { replace: true });
  }, [dispatch, filters, setParams]);

  const sortedJobs = useMemo(() => {
    const copy = [...jobs];
    if (sortBy === 'deadline') {
      return copy.sort((a, b) => new Date(a.applicationDeadline || 8640000000000000) - new Date(b.applicationDeadline || 8640000000000000));
    }
    if (sortBy === 'company') {
      return copy.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    }
    return copy.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [jobs, sortBy]);

  const activeFilters = Object.values(filters).filter(Boolean).length;

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const clearFilters = () => {
    setFilters({ search: '', type: '', location: '' });
    setSortBy('newest');
  };

  return (
    <div className="container-page py-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950 md:text-4xl">Browse jobs and internships</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Search by role, skill, company, city, and work type. Recruiters can publish roles from their dashboard,
              and students can apply with resume review support.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-950">{jobs.length}</p>
              <p className="text-sm text-slate-500">Open roles</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-950">
                {new Set(jobs.map((job) => job.company)).size}
              </p>
              <p className="text-sm text-slate-500">Companies</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-950">
                {jobs.filter((job) => job.type === 'internship').length}
              </p>
              <p className="text-sm text-slate-500">Internships</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.7fr_0.6fr_auto]">
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              className="input-field pl-10"
              placeholder="Search title, company, skills..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
          <div className="relative">
            <Icon name="location" className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              className="input-field pl-10"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
          <select className="input-field" value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
            {jobTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <select className="input-field" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="deadline">Deadline</option>
            <option value="company">Company</option>
          </select>
          <button type="button" onClick={clearFilters} className="btn-outline whitespace-nowrap">
            Clear
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {jobTypes.slice(1).map((type) => (
            <button
              type="button"
              key={type.value}
              className={`chip transition hover:bg-primary-50 hover:text-primary-700 ${filters.type === type.value ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100' : ''}`}
              onClick={() => updateFilter('type', filters.type === type.value ? '' : type.value)}
            >
              {type.label}
            </button>
          ))}
          {activeFilters > 0 && (
            <span className="chip bg-emerald-50 text-emerald-700">{activeFilters} active filter{activeFilters > 1 ? 's' : ''}</span>
          )}
        </div>
      </section>

      <section className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card animate-pulse">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-6 h-20 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : sortedJobs.length === 0 ? (
          <EmptyState
            icon="briefcase"
            title="No matching roles found"
            description="Try a broader search or come back after recruiters publish more opportunities."
            action={<Link to="/register" className="btn-primary">Create Account</Link>}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedJobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default JobsList;
