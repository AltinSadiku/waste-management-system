import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, User, LogOut, Menu, X, AlertCircle, BarChart3, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

const Layout = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Report Issue', href: '/report', icon: AlertCircle },
    { name: 'My Reports', href: '/reports', icon: MapPin },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Settings },
  ];

  const workerNavigation = [
    { name: 'Worker Dashboard', href: '/worker', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/70 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary-600 dark:text-primary-400 transition-colors duration-300">
                  WasteKosovo
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 pt-1 border-b-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive(item.href)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2 opacity-80" />
                    {item.name}
                  </Link>
                ))}
                
                {hasRole('ADMIN') && adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 pt-1 border-b-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive(item.href)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2 opacity-80" />
                    {item.name}
                  </Link>
                ))}
                
                {hasRole(['WORKER', 'ADMIN']) && workerNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 pt-1 border-b-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive(item.href)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2 opacity-80" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="inline-flex items-center px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                    aria-label="Toggle theme"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <NotificationBell />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Welcome, {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 inline mr-2" />
                  {item.name}
                </Link>
              ))}
              
              {hasRole('ADMIN') && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 inline mr-2" />
                  {item.name}
                </Link>
              ))}
              
              {hasRole(['WORKER', 'ADMIN']) && workerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 inline mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user?.role}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <NotificationBell />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;
