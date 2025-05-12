import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AppointEase</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-indigo-700 border-b-2 border-indigo-500' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/booking" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/booking') 
                      ? 'text-indigo-700 border-b-2 border-indigo-500' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Book Appointment
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/admin') 
                        ? 'text-indigo-700 border-b-2 border-indigo-500' 
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1 rounded-full text-gray-500 hover:text-indigo-600"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/login') 
                      ? 'text-indigo-700 border-b-2 border-indigo-500' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute z-50 w-full bg-white shadow-lg animate-fade-in">
          <div className="pt-2 pb-4 space-y-1">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-4 py-2 text-base font-medium ${
                    isActive('/dashboard') 
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/booking" 
                  className={`block px-4 py-2 text-base font-medium ${
                    isActive('/booking') 
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Appointment
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`block px-4 py-2 text-base font-medium ${
                      location.pathname.startsWith('/admin') 
                        ? 'text-indigo-700 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                
                <div className="mt-3 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-4 py-2 text-base font-medium ${
                    isActive('/login') 
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block m-4 btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;