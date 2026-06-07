export const typeLabels = {
  internship: 'Internship',
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
};

export const getStatusMeta = (status = 'pending') => {
  const map = {
    pending: {
      label: 'Pending',
      className: 'bg-amber-50 text-amber-700 ring-amber-200',
      dotClass: 'bg-amber-500',
    },
    reviewed: {
      label: 'Reviewed',
      className: 'bg-blue-50 text-blue-700 ring-blue-200',
      dotClass: 'bg-blue-500',
    },
    shortlisted: {
      label: 'Shortlisted',
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      dotClass: 'bg-emerald-500',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-50 text-red-700 ring-red-200',
      dotClass: 'bg-red-500',
    },
    accepted: {
      label: 'Accepted',
      className: 'bg-teal-50 text-teal-700 ring-teal-200',
      dotClass: 'bg-teal-500',
    },
  };

  return map[status] || map.pending;
};

export const getInitials = (name = 'SmartHire AI') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const formatDate = (date) => {
  if (!date) return 'Open deadline';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const timeAgo = (date) => {
  if (!date) return 'Recently';
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

export const averageScore = (items = []) => {
  const scores = items.map((item) => item.aiReview?.score).filter((score) => typeof score === 'number');
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const countByStatus = (items = []) =>
  items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
