import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login, clearError } from '../features/authSlice';
import { getDashboardPath } from '../utils/getDashboardPath';
import Icon from '../components/Icon';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
    dispatch(login(form));
  };

  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <section className="hidden rounded-lg border border-slate-200 bg-white p-8 shadow-sm lg:block">
        <div className="icon-tile bg-primary-50 text-primary-700 ring-primary-100">
          <Icon name="shield" className="h-5 w-5" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-950">Welcome back to SmartHire AI</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Continue managing applications, job postings, AI reviews, and hiring updates from your role dashboard.
        </p>
        <div className="mt-8 grid gap-3">
          {['JWT-secured sessions', 'Role-based dashboards', 'Real-time notifications'].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-700">
              <Icon name="check" className="h-4 w-4 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="card">
          <div className="mb-6">
            <p className="text-sm font-semibold text-primary-700">Sign in</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Access your workspace</h2>
            <p className="mt-2 text-sm text-slate-500">Use your student, recruiter, or admin account.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                placeholder="Enter password"
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>
            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            No account? <Link to="/register" className="font-semibold text-primary-600">Sign up</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
