import { Link } from 'react-router-dom';
import Icon from './Icon';

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="container-page grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Icon name="spark" className="h-4 w-4" />
          </span>
          <p className="text-lg font-bold text-white">SmartHire AI</p>
        </div>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
          A MERN job portal with role dashboards, resume uploads, AI review, recruiter workflows, and real-time notifications.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Explore</p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Link to="/jobs" className="hover:text-white">Jobs</Link>
          <Link to="/register" className="hover:text-white">Create Account</Link>
          <Link to="/login" className="hover:text-white">Login</Link>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Project</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Numair Fahad<br />
          MERN Stack Intern @ DawoodTech NextGen
        </p>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-slate-500">
        <p>SmartHire AI - Job Portal and Internship Management System</p>
        <p>React, Node.js, Express, MongoDB, Socket.io</p>
      </div>
    </div>
  </footer>
);

export default Footer;
