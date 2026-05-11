import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Phone, User, Calendar, CheckCircle, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const RoomDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(data);
      } catch (error) {
        toast.error('Failed to load room details');
        navigate('/');
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="h-96 flex items-center justify-center">Loading...</div>;
  if (!room) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors">
        <ChevronLeft size={20} />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={room.images[activeImage] || 'https://via.placeholder.com/600x400?text=No+Image'} 
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {room.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? room.images.length - 1 : prev - 1))}
                  className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-full shadow-lg"
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === room.images.length - 1 ? 0 : prev + 1))}
                  className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-full shadow-lg"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {room.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-600 scale-105' : 'border-transparent opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{room.title}</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={18} />
              <span className="text-lg">{room.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 glass rounded-2xl">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Monthly Rent</p>
              <p className="text-3xl font-bold text-primary-600">Rs. {room.price}</p>
            </div>
            <button className="btn-primary flex items-center gap-2 px-8">
              <MessageSquare size={20} />
              Inquire
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">About this room</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {room.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Facilities</h3>
            <div className="grid grid-cols-2 gap-4">
              {room.facilities.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <User className="text-primary-600" />
            </div>
            <div>
              <p className="font-bold">{room.owner.name}</p>
              <p className="text-sm text-slate-500">Property Owner</p>
            </div>
            <a 
              href={`tel:${room.contactNumber}`}
              className="ml-auto flex items-center gap-2 text-primary-600 font-bold hover:underline"
            >
              <Phone size={18} />
              {room.contactNumber}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
