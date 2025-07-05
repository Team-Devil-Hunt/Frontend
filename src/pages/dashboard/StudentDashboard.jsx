import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import cseduLogo from '../../assets/csedu_logo.png'

import { 
  Calendar, 
  LogOut, 
  User, 
  Bell, 
  BookOpen, 
  FileText, 
  Clock, 
  CreditCard,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Mock user data - will be replaced with actual API data later
  const user = {
    name: 'Tanvir Ahmed',
    id: '2018-1-60-001',
    email: 'tanvir@cse.du.ac.bd',
    role: 'student',
    department: 'Computer Science and Engineering',
    batch: '2018',
    profileImage: '/assets/profile-placeholder.jpg'
  };

  const sidebarItems = [
    {
      name: 'Meetings',
      icon: <Calendar size={20} />,
      path: '/student/meetings',
      description: 'Faculty/student meeting schedules'
    },
    {
      name: 'Assignments',
      icon: <FileText size={20} />,
      path: '/student/assignments',
      description: 'View and submit assignments'
    },
    {
      name: 'Courses',
      icon: <BookOpen size={20} />,
      path: '/student/courses',
      description: 'Enrolled courses and materials'
    },
    {
      name: 'Exams',
      icon: <Clock size={20} />,
      path: '/student/exams',
      description: 'Exam schedules and results'
    },
    {
      name: 'Fees',
      icon: <CreditCard size={20} />,
      path: '/student/fees',
      description: 'Fee structure and payment history'
    }
  ];

  const handleLogout = () => {
    // Will implement actual logout logic later
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={toggleMobileSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center ml-4">
              <img 
                src={cseduLogo} 
                alt="CSEDU Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">Student Portal</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <Bell size={20} />
            </button>
            
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={user.profileImage}
                alt={user.name}
              />
              <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile */}
        <motion.div
          className={`fixed inset-0 z-40 md:hidden ${isMobileSidebarOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isMobileSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileSidebar}></div>
          
          <motion.div
            className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg"
            initial={{ x: -100 }}
            animate={{ x: isMobileSidebarOpen ? 0 : -100 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.profileImage}
                    alt={user.name}
                  />
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm font-medium text-gray-500">{user.id}</p>
                  </div>
                </div>
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pt-2 pb-4">
              <nav className="mt-2 px-2 space-y-1">
                <NavLink 
                  to="/"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Home size={20} className="mr-3" />
                  Back to Website
                </NavLink>
                
                {sidebarItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut size={20} className="mr-3" />
                Sign out
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar for desktop */}
        <motion.div
          className={`hidden md:flex md:flex-col md:flex-shrink-0 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'} border-r border-gray-200 bg-white overflow-y-auto`}
          animate={{ width: isSidebarOpen ? 256 : 80 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`p-4 ${!isSidebarOpen && 'flex justify-center'} border-b border-gray-200`}>
            {isSidebarOpen ? (
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.profileImage}
                  alt={user.name}
                />
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm font-medium text-gray-500">{user.id}</p>
                </div>
              </div>
            ) : (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.profileImage}
                alt={user.name}
              />
            )}
          </div>
          
          <div className="flex-1 pt-2 pb-4">
            <nav className="mt-2 px-2 space-y-1">
              <NavLink 
                to="/"
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${!isSidebarOpen && 'justify-center'}`
                }
              >
                <Home size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                {isSidebarOpen && 'Back to Website'}
              </NavLink>
              
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${!isSidebarOpen && 'justify-center'}`
                  }
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <span className={isSidebarOpen ? 'mr-3' : ''}>{item.icon}</span>
                  {isSidebarOpen && item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className={`p-4 ${!isSidebarOpen && 'flex justify-center'} border-t border-gray-200`}>
            <button
              onClick={handleLogout}
              className={`flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 ${!isSidebarOpen && 'justify-center w-12 h-12'}`}
              title={!isSidebarOpen ? 'Sign out' : ''}
            >
              <LogOut size={20} className={isSidebarOpen ? 'mr-3' : ''} />
              {isSidebarOpen && 'Sign out'}
            </button>
          </div>
        </motion.div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
