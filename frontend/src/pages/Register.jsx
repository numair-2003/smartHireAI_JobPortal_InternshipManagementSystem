import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register, clearError } from '../features/authSlice';
import { getDashboardPath } from '../utils/getDashboardPath';
import Icon from '../components/Icon';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', company: '', phone: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate(getDashboardPath(user.role));
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <section className="mx-auto w-full max-w-xl">
        <div className="card">
          <div className="mb-6">
            <p className="text-sm font-semibold text-primary-700">Create account</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Start with the right workspace</h2>
            <p className="mt-2 text-sm text-slate-500">
              Students get application tracking. Recruiters get job posting and applicant review.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {[
              { value: 'student', label: 'Student', icon: 'users' },
              { value: 'recruiter', label: 'Recruiter', icon: 'briefcase' },
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${form.role === role.value ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
                onClick={() => update('role', role.value)}
              >
                <Icon name={role.icon} className="h-4 w-4" />
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Full name</span>
                <input className="input-field" placeholder="Your name" value={form.name}
                  onChange={(e) => update('name', e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</span>
                <input className="input-field" placeholder="Optional" value={form.phone}
                  onChange={(e) => update('phone', e.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email</span>
              <input type="email" className="input-field" placeholder="you@example.com" value={form.email}
                onChange={(e) => update('email', e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Password</span>
              <input type="password" className="input-field" placeholder="Minimum 6 characters" value={form.password}
                onChange={(e) => update('password', e.target.value)} required minLength={6} />
            </label>
            {form.role === 'recruiter' && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Company name</span>
                <input className="input-field" placeholder="Company" value={form.company}
                  onChange={(e) => update('company', e.target.value)} />
              </label>
            )}
            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            Have an account? <Link to="/login" className="font-semibold text-primary-600">Login</Link>
          </p>
        </div>
      </section>

      <section className="hidden rounded-lg border border-slate-200 bg-white p-8 shadow-sm lg:block">
        <div className="grid gap-4">
          {[
            { title: 'Resume intelligence', desc: 'AI review turns resume text into score, strengths, and improvements.', icon: 'spark' },
            { title: 'Hiring pipeline', desc: 'Recruiters move applicants through pending, reviewed, shortlisted, and accepted states.', icon: 'chart' },
            { title: 'Platform control', desc: 'Admins can monitor users, jobs, applications, roles, and active accounts.', icon: 'shield' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="icon-tile h-10 w-10 bg-primary-50 text-primary-700 ring-primary-100">
                  <Icon name={item.icon} className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Register;
