import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, PlusSquare, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        RentRoom
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
          <Home size={20} />
          <span className="hidden md:inline">Home</span>
        </Link>
        
        {user ? (
          <>
            <Link to="/add-room" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
              <PlusSquare size={20} />
              <span className="hidden md:inline">List Room</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
              <User size={20} />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-colors">
                <ShieldCheck size={20} />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}
            <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        )}

        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
