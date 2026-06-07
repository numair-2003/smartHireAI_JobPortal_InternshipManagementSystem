import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markRead,
  markAllRead,
  addNotification,
} from '../features/notificationSlice';
import { connectSocket, getSocket } from '../services/socketService';
import Icon from './Icon';
import { timeAgo } from '../utils/formatters';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, unreadCount } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return undefined;
    dispatch(fetchNotifications());
    connectSocket(user._id);
    const socket = getSocket();
    socket?.on('notification', (notif) => dispatch(addNotification(notif)));
    return () => socket?.off('notification');
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const openNotification = (notification) => {
    if (!notification.isRead) dispatch(markRead(notification._id));
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const readAll = () => {
    dispatch(markAllRead());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 transition hover:bg-slate-100"
        aria-label="Notifications"
        title="Notifications"
      >
        <Icon name="bell" className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 max-h-96 w-80 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={readAll}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
              >
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No notifications yet</p>
          ) : (
            items.map((n) => (
              <button
                key={n._id}
                type="button"
                className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${!n.isRead ? 'bg-primary-50/80' : ''}`}
                onClick={() => openNotification(n)}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.isRead ? 'bg-primary-600' : 'bg-slate-300'}`} />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{n.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{n.message}</span>
                    <span className="mt-2 block text-xs font-medium text-slate-400">{timeAgo(n.createdAt)}</span>
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
