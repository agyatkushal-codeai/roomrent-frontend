import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Trash2, Edit, Plus, User as UserIcon, Mail, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRooms = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/rooms');
      // Filter rooms owned by current user
      setMyRooms(data.filter(room => room.owner._id === user._id));
    } catch (error) {
      console.error('Error fetching my rooms', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Listing deleted');
      setMyRooms(myRooms.filter(r => r._id !== id));
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-lg">
        <div className="w-32 h-32 bg-primary-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-xl">
          <UserIcon size={64} className="text-primary-600" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
            <Mail size={18} />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-4 py-1 rounded-full text-sm font-bold uppercase">
              {user.role} Account
            </span>
          </div>
        </div>
        <button onClick={logout} className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2" title="Logout">
          <LogOut size={20} />
          <span className="hidden md:inline font-bold">Logout</span>
        </button>
      </section>

      {/* My Listings */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Room Listings</h2>
          <Link to="/add-room" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add New
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : myRooms.length > 0 ? (
            myRooms.map((room) => (
              <motion.div 
                layout
                key={room._id}
                className="glass p-4 rounded-2xl flex gap-4 items-center shadow-sm hover:shadow-md transition-all"
              >
                <img src={room.images[0]} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{room.title}</h3>
                  <p className="text-sm text-slate-500">Rs. {room.price} / month</p>
                  <p className="text-xs text-slate-400 mt-1">{room.location}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/edit-room/${room._id}`} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(room._id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 glass rounded-2xl border-dashed border-2">
              <p className="text-slate-500">You haven't listed any rooms yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
