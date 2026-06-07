import Icon from './Icon';

const StatCard = ({ label, value, detail, icon = 'chart', tone = 'blue' }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  return (
    <div className="stat-card">
      <div className={`icon-tile ${tones[tone] || tones.blue}`}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-950">{value}</p>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>
    </div>
  );
};

export default StatCard;
