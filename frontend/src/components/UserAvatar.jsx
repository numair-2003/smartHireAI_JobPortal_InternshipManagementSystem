import { getInitials } from '../utils/formatters';

const sizeClasses = {
  sm: 'h-7 w-7 rounded-md text-xs',
  md: 'h-9 w-9 rounded-md text-sm',
  lg: 'h-16 w-16 rounded-xl text-lg',
  xl: 'h-24 w-24 rounded-2xl text-2xl',
};

const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const altText = `${user?.name || 'User'} profile`;

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={altText}
        className={`${sizeClass} shrink-0 object-cover ring-1 ring-slate-200 ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} flex shrink-0 items-center justify-center bg-primary-600 font-bold text-white ring-1 ring-primary-500/20 ${className}`}
    >
      {getInitials(user?.name)}
    </span>
  );
};

export default UserAvatar;
