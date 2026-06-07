import { Link } from 'react-router-dom';
import Icon from './Icon';
import { formatDate, timeAgo, typeLabels } from '../utils/formatters';

const JobCard = ({ job }) => (
  <article className="card group flex h-full flex-col transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-primary-700">
          {typeLabels[job.type] || job.type}
        </p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-950">{job.title}</h3>
        <p className="mt-1 truncate text-sm font-semibold text-slate-600">{job.company}</p>
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
        {job.company?.slice(0, 2).toUpperCase() || 'SH'}
      </span>
    </div>

    <div className="mt-4 space-y-2 text-sm text-slate-500">
      <p className="flex items-center gap-2">
        <Icon name="location" className="h-4 w-4 text-slate-400" />
        {job.location}
      </p>
      <p className="flex items-center gap-2">
        <Icon name="clock" className="h-4 w-4 text-slate-400" />
        Posted {timeAgo(job.createdAt)} - Deadline {formatDate(job.applicationDeadline)}
      </p>
    </div>

    {job.skills?.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="chip">{skill}</span>
        ))}
      </div>
    )}

    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
      {job.description}
    </p>

    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
      <span className="text-sm font-semibold text-slate-700">{job.salary || 'Salary not disclosed'}</span>
      <Link to={`/jobs/${job._id}`} className="btn-primary px-3 py-2">
        View Details
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </div>
  </article>
);

export default JobCard;
