import { getStatusMeta } from '../utils/formatters';

const StatusBadge = ({ status, className = '' }) => {
  const meta = getStatusMeta(status);

  return (
    <span className={`status-badge ${meta.className} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
