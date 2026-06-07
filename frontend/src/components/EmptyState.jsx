import Icon from './Icon';

const EmptyState = ({ icon = 'briefcase', title, description, action }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center shadow-sm">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
      <Icon name={icon} className="h-6 w-6" />
    </div>
    <h3 className="text-base font-semibold text-slate-950">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
