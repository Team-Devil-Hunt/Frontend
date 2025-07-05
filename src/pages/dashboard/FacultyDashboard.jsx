import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Users, 
  LogOut, 
  ChevronRight,
  User
} from 'lucide-react';

// Mock user data - would come from authentication context in a real app
const mockUser = {
  id: 'faculty-001',
  name: 'Dr. Rashida Ahmed',
  email: 'rashida.ahmed@cse.du.ac.bd',
  role: 'faculty',
  department: 'Computer Science and Engineering',
  designation: 'Associate Professor',
  profileImage: '/assets/profile-placeholder.jpg'
};

const FacultyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items for the sidebar
  const navItems = [
    {
      name: 'Meetings',
      icon: Calendar,
      href: '/faculty/meetings',
      description: 'Manage student meetings and appointments'
    },
    {
      name: 'Courses',
      icon: BookOpen,
      href: '/faculty/courses',
      description: 'Manage your courses and materials'
    },
    {
      name: 'Assignments',
      icon: ClipboardList,
      href: '/faculty/assignments',
      description: 'Create and grade assignments'
    },
    {
      name: 'Students',
      icon: Users,
      href: '/faculty/students',
      description: 'View and manage student information'
    }
  ];
  
  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Handle logout
  const handleLogout = () => {
    // In a real app, this would clear authentication state
    console.log('Logging out...');
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar for mobile */}
      <motion.div
        className={`fixed inset-y-0 left-0 flex flex-col z-50 max-w-xs w-full bg-white shadow-lg transform ease-in-out duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
        animate={sidebarOpen ? { x: 0 } : { x: '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-indigo-700">
          <div className="text-xl font-bold text-white">Faculty Dashboard</div>
          <button
            className="h-10 w-10 flex items-center justify-center rounded-md text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* User profile */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <img
              src={mockUser.profileImage}
              alt={mockUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
              <p className="text-xs text-gray-500">{mockUser.designation}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Logout button */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 w-full"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </motion.div>
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-700">
              <div className="text-xl font-bold text-white">Faculty Dashboard</div>
            </div>
            
            {/* User profile */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center">
                <img
                  src={mockUser.profileImage}
                  alt={mockUser.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">{mockUser.designation}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Logout button */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
          <button
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Faculty Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <User className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Content goes here */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
