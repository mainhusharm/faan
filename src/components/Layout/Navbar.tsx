import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  User, 
  LogOut, 
  Home, 
  Info, 
  BookMarked, 
  TestTube, 
  Zap, 
  GraduationCap, 
  Moon, 
  Sun, 
  Palette, 
  Settings, 
  Plus, 
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Camera,
  Pencil
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle scroll effect with optimized state management
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prevScrolled) => {
        // Only update state if it actually changed to prevent unnecessary re-renders
        if (prevScrolled !== isScrolled) {
          return isScrolled;
        }
        return prevScrolled;
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setIsNavDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home, protected: false },
    { path: '/about', label: 'About', icon: Info, protected: false },
    { path: '/courses', label: 'Courses', icon: BookMarked, protected: true },
    { path: '/homework', label: 'Homework', icon: Camera, protected: true },
    { path: '/diagram', label: 'Draw & Analyze', icon: Pencil, protected: true },
    { path: '/practice', label: 'Practice', icon: TestTube, protected: true },
    { path: '/crash-course', label: 'Crash Course', icon: Zap, protected: true },
    { path: '/creative-learning', label: 'Creative', icon: Palette, protected: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/80 dark:border-gray-700/80'
            : 'bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm shadow-sm border-b border-transparent'
        }`}
        style={{
          boxShadow: scrolled 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center gap-2 sm:gap-3 lg:gap-4 w-full min-w-0 py-4">
            {/* Logo Section - Enhanced */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center space-x-3 group relative"
              >
                {/* Animated logo background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 scale-110" />
                
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <GraduationCap className="h-7 w-7 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                    Fusioned
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 -mt-1 flex items-center">
                    EdTech
                    <Sparkles className="h-2.5 w-2.5 ml-1" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Home and About in Center */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-2 lg:gap-4">
              {/* Home Link */}
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg lg:rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className={`h-4 w-4 ${isActive('/') ? 'animate-pulse' : ''}`} />
                <span>Home</span>
              </Link>

              {/* About Link */}
              <Link
                to="/about"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg lg:rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/about')
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                <Info className={`h-4 w-4 ${isActive('/about') ? 'animate-pulse' : ''}`} />
                <span>About Us</span>
              </Link>

              {/* Other Links Dropdown - Hidden on small screens */}
              <div className="hidden lg:block relative" ref={navDropdownRef}>
                <button
                  onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                  className="flex items-center space-x-2 text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg lg:rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-slate-100 dark:hover:bg-gray-800 group"
                >
                  <span>More</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isNavDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Navigation Dropdown Menu */}
                {isNavDropdownOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
                    
                    <div className="py-2">
                      {navLinks.slice(2).map((link) => {
                        if (link.protected && !user) return null;
                        const Icon = link.icon;
                        const active = isActive(link.path);

                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsNavDropdownOpen(false)}
                            className={`flex items-center space-x-3 px-5 py-3 text-sm font-medium transition-all duration-200 group w-full ${
                              active
                                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20'
                            }`}
                          >
                            <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'animate-pulse' : ''}`} />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Enhanced */}
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              {/* Theme Toggle - Enhanced */}
              <button
                onClick={toggleTheme}
                className="relative p-2 lg:p-3 rounded-lg lg:rounded-xl text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-300 group transform hover:scale-110"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg lg:rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                {isDarkMode ? (
                  <Sun className="h-5 w-5 relative z-10 transform group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="h-5 w-5 relative z-10 transform group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Points Badge - Enhanced */}
                   <div className="relative hidden lg:block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-full opacity-30 blur animate-pulse" />
                    <div className="relative bg-gradient-to-r from-indigo-100 via-purple-100 to-emerald-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-emerald-900/50 text-indigo-800 dark:text-indigo-200 text-xs lg:text-sm font-bold px-3 lg:px-4 py-2 rounded-full backdrop-blur-sm border border-indigo-200 dark:border-indigo-700 shadow-lg">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                        <span>{profile?.points || 0}</span>
                        <span className="text-xs font-medium">pts</span>
                      </span>
                    </div>
                   </div>

                  {/* Profile Dropdown - Enhanced */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="hidden md:flex items-center space-x-1 lg:space-x-2 text-slate-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 lg:px-3 py-2 rounded-lg lg:rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-gray-800 group"
                    >
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-300" />
                        <div className="relative w-9 h-9 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <span className="text-xs lg:text-sm font-semibold max-w-[100px] lg:max-w-[120px] truncate">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu - Enhanced */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-xl transform origin-top-right transition-all duration-300 animate-in fade-in slide-in-from-top-2 z-50">
                        {/* Gradient top bar */}
                        <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
                        
                        {/* User info section */}
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-800/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {profile?.full_name || user.email}
                              </p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                  {profile?.points || 0} points
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                          <Link
                            to="/create-course"
                            className="flex items-center space-x-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                              <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span>Create Course</span>
                          </Link>

                          <Link
                            to="/api-settings"
                            className="flex items-center space-x-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-emerald-50 dark:hover:from-purple-900/20 dark:hover:to-emerald-900/20 transition-all duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                              <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span>Settings</span>
                          </Link>

                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleSignOut();
                            }}
                            className="flex items-center space-x-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200 w-full text-left group"
                          >
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                              <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/signin"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="relative group px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 group-hover:from-indigo-700 group-hover:via-purple-700 group-hover:to-emerald-700" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 blur-xl" />
                    </div>
                    <span className="relative z-10 flex items-center space-x-1">
                      <span>Sign Up</span>
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button - Enhanced */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            </div>
            </div>
            </div>
            </nav>

      {/* Mobile Menu - Enhanced with smooth animations */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-20 right-0 bottom-0 w-full sm:w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-500 ease-out z-50 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Gradient top bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />

          <div className="overflow-y-auto h-full pb-20">
            {/* User section for mobile */}
            {user && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-800/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {profile?.full_name || user.email}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {profile?.points || 0} points
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 w-full ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User actions for mobile */}
            {user && (
              <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/create-course"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 w-full"
                >
                  <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="truncate">Create Course</span>
                </Link>

                <Link
                  to="/api-settings"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-emerald-50 dark:hover:from-purple-900/20 dark:hover:to-emerald-900/20 transition-all duration-300 w-full"
                >
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="truncate">Settings</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 w-full text-left"
                >
                  <LogOut className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="truncate">Sign Out</span>
                </button>
              </div>
            )}

            {/* Auth buttons for mobile */}
            {!user && (
              <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/signin"
                  className="block w-full text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center relative group px-4 py-3 rounded-xl text-base font-semibold text-white overflow-hidden shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
                  <span className="relative z-10 flex items-center justify-center space-x-1">
                    <span>Sign Up</span>
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
