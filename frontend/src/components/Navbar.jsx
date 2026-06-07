import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { clearNotifications } from '../features/notificationSlice';
import { disconnectSocket } from '../services/socketService';
import { getDashboardPath } from '../utils/getDashboardPath';
import NotificationBell from './NotificationBell';
import Icon from './Icon';
import UserAvatar from './UserAvatar';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
    dispatch(clearNotifications());
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm shadow-primary-600/30">
            <Icon name="spark" className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold text-slate-950">
            SmartHire <span className="text-primary-600">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/jobs" className="nav-link">Jobs</Link>
          {user ? (
            <>
              <NotificationBell />
              <Link to={getDashboardPath(user.role)} className="nav-link">Dashboard</Link>
              <div className="ml-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                <UserAvatar user={user} size="sm" />
                <div className="leading-tight">
                  <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user.role}</p>
                </div>
              </div>
              <button type="button" onClick={handleLogout} className="btn-outline py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-ghost md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-2 py-4">
            <Link to="/jobs" onClick={closeMenu} className="nav-link">Jobs</Link>
            {user ? (
              <>
                <div className="self-end">
                  <NotificationBell />
                </div>
                <Link to={getDashboardPath(user.role)} onClick={closeMenu} className="nav-link">Dashboard</Link>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs capitalize text-slate-500">{user.role}</p>
                  </div>
                </div>
                <button type="button" onClick={handleLogout} className="btn-outline w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="nav-link">Login</Link>
                <Link to="/register" onClick={closeMenu} className="btn-primary w-full">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
