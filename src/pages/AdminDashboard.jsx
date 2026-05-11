import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Users, Home, ShieldAlert, Trash2, Ban, CheckCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ userCount: 0, roomCount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [roomsRes, usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms'),
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/stats', config)
      ]);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlockUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('User status updated');
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user and all their data? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this listing as admin?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Room removed');
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-amber-500" />
          Admin Control Center
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold">{stats.userCount}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Listings</p>
            <p className="text-2xl font-bold">{stats.roomCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('rooms')}
          className={`pb-4 px-4 font-bold transition-all ${activeTab === 'rooms' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}
        >
          Manage Listings
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-4 font-bold transition-all ${activeTab === 'users' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}
        >
          Manage Users
        </button>
      </div>

      {/* Content */}
      <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/20">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase tracking-wider font-bold">
            {activeTab === 'rooms' ? (
              <tr>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td className="p-12 text-center" colSpan="4">Loading...</td></tr>
            ) : activeTab === 'rooms' ? (
              rooms.map(room => (
                <tr key={room._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={room.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium truncate max-w-[200px]">{room.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{room.owner.name}</td>
                  <td className="px-6 py-4 font-bold text-primary-600">Rs. {room.price}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDeleteRoom(room._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleBlockUser(u._id)}
                      className={`p-2 rounded-lg transition-all ${u.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}
                      title={u.isBlocked ? 'Unblock' : 'Block'}
                    >
                      <Ban size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
