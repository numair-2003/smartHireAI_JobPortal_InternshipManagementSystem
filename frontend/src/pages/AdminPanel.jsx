import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { getInitials, timeAgo } from '../utils/formatters';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/users/stats')])
      .then(([usersRes, statsRes]) => {
        setUsers(usersRes.data);
        setStats(statsRes.data);
      })
      .catch(() => toast.error('Failed to load admin data'));
  }, []);

  const toggleUser = async (id, updates) => {
    try {
      const { data } = await api.put(`/users/${id}`, updates);
      setUsers(users.map((u) => (u._id === id ? data : u)));
      toast.success('User updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredUsers = users.filter((u) => roleFilter === 'all' || u.role === roleFilter);

  return (
    <div className="container-page py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-700">Admin control room</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Platform overview</h1>
          <p className="mt-2 text-slate-600">Monitor users, roles, job activity, and application status from one place.</p>
        </div>
      </section>

      {stats && (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <StatCard label="Users" value={stats.users} detail={`${stats.activeUsers || 0} active accounts`} icon="users" />
            <StatCard label="Jobs" value={stats.jobs} detail={`${stats.activeJobs || 0} visible listings`} icon="briefcase" tone="emerald" />
            <StatCard label="Applications" value={stats.applications} detail="Total candidate records" icon="chart" tone="violet" />
            <StatCard label="Recruiters" value={stats.recruiters} detail={`${stats.students || 0} students`} icon="building" tone="amber" />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="card">
              <h2 className="text-lg font-bold text-slate-950">Application status</h2>
              <p className="mt-1 text-sm text-slate-500">Live distribution across the platform.</p>
              <div className="mt-5 space-y-3">
                {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                  <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <StatusBadge status={status} />
                    <span className="text-sm font-bold text-slate-950">{stats.applicationsByStatus?.[status] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Manage users</h2>
                  <p className="mt-1 text-sm text-slate-500">{filteredUsers.length} visible accounts</p>
                </div>
                <select className="input-field w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="all">All roles</option>
                  <option value="student">Students</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              {filteredUsers.length === 0 ? (
                <EmptyState title="No users found" description="Try a different role filter." icon="users" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="table-head">
                      <tr>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Joined</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="focus-row">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                                {getInitials(u.name)}
                              </span>
                              <div>
                                <p className="font-semibold text-slate-950">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 capitalize text-slate-700">{u.role}</td>
                          <td className="p-3">
                            <span className={`status-badge ${u.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-red-50 text-red-700 ring-red-200'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{timeAgo(u.createdAt)}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-2">
                              {u.role !== 'admin' && (
                                <button type="button" className="btn-outline px-3 py-1.5 text-xs"
                                  onClick={() => toggleUser(u._id, { role: 'admin' })}>
                                  Make Admin
                                </button>
                              )}
                              <button type="button" className="btn-outline px-3 py-1.5 text-xs text-red-600 hover:text-red-700"
                                onClick={() => toggleUser(u._id, { isActive: !u.isActive })}>
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
