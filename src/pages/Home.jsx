import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, DollarSign, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/rooms?';
      if (search) url += `search=${search}&`;
      if (location) url += `location=${location}&`;
      if (priceRange) {
        const [min, max] = priceRange.split('-');
        if (min) url += `minPrice=${min}&`;
        if (max) url += `maxPrice=${max}&`;
      }
      
      const { data } = await axios.get(url);
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white"
        >
          Find Your Perfect <span className="text-primary-600">Space</span>
        </motion.h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          The easiest way to find and list rental rooms. Beautiful spaces, verified owners.
        </p>
      </section>

      {/* Search & Filter Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 shadow-lg items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium px-1">Search Rooms</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 ring-primary-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium px-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="City or area..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 ring-primary-500 outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium px-1">Price Range</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 ring-primary-500 outline-none appearance-none"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="0-5000">Below 5,000</option>
              <option value="5000-10000">5,000 - 10,000</option>
              <option value="10000-20000">10,000 - 20,000</option>
              <option value="20000-">Above 20,000</option>
            </select>
          </div>
        </div>

        <button 
          onClick={fetchRooms}
          className="btn-primary w-full md:w-auto h-10 flex items-center justify-center gap-2"
        >
          <Filter size={18} />
          Search
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
          ))
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <motion.div 
              layout
              key={room._id}
              className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={room.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-sm font-bold text-primary-600 shadow-md">
                  Rs. {room.price}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-lg truncate">{room.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPin size={14} />
                  <span>{room.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {room.facilities.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
                <Link 
                  to={`/room/${room._id}`}
                  className="block w-full text-center py-2 mt-4 bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white transition-colors rounded-xl font-medium"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-slate-500">No rooms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
