import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Users, 
  LogOut, 
  Bell,
  Home
} from 'lucide-react';
import cseduLogo from '../../assets/csedu_logo.png';
import { useGlobalState } from '../../context/GlobalStateProvider';
import { toast } from 'react-hot-toast';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { globalState, setGlobalState } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  
  // Get user data from global state
  const user = globalState?.user || {};
  
  // Redirect to login if not authenticated
  useEffect(() => {
    // Check if user exists in global state
    if (!globalState?.user) {
      toast.error('Please login to access the dashboard');
      navigate('/login');
      return;
    }
    
    // Check if user has a role property
    if (!globalState?.user?.role) {
      toast.error('User role information missing. Please login again.');
      navigate('/login');
      return;
    }
    
    // Check if user has the correct role
    const userRole = globalState?.user?.role?.name?.toLowerCase();
    
    if (userRole !== 'faculty') {
      toast.error('Unauthorized access - Faculty access only');
      navigate('/');
      return;
    }
    
    // If we reach here, user is authenticated and has correct role
    fetchFacultyData();
  }, [globalState?.user, navigate]);
  
  const fetchFacultyData = () => {
    try {
      setLoading(true);
      
      // For now, we'll just use the user data from global state
      setFacultyData({
        name: user.name || 'Dr. Md. Shabbir Ahmed',
        id: user.id?.toString() || '200',
        email: user.email || 'shabbir@csedu.edu',
        role: user.role?.name?.toLowerCase() || 'faculty',
        department: user.department || 'Computer Science and Engineering',
        designation: user.designation || 'Associate Professor',
        profileImage: user.profileImage || 'https://randomuser.me/api/portraits/men/42.jpg'
      });
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load faculty data');
      setLoading(false);
    }
  };
  
  // Navigation items for the sidebar
  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <Home size={20} />,
      path: '/faculty',
      description: 'Faculty dashboard overview'
    },
    {
      name: 'Meetings',
      icon: <Calendar size={20} />,
      path: '/faculty/meetings',
      description: 'Manage student meetings and appointments',
      badge: 3 // Number of pending meetings
    },
    {
      name: 'Courses',
      icon: <BookOpen size={20} />,
      path: '/faculty/courses',
      description: 'Manage your courses and materials',
      badge: 2 // Number of active courses
    },
    {
      name: 'Assignments',
      icon: <ClipboardList size={20} />,
      path: '/faculty/assignments',
      description: 'Create and grade assignments',
      badge: 5 // Number of pending assignments to grade
    },
    {
      name: 'Students',
      icon: <Users size={20} />,
      path: '/faculty/students',
      description: 'View and manage student information'
    }
  ];
  
  // Handle logout
  const handleLogout = () => {
    // Clear user data from global state
    setGlobalState(prev => ({ ...prev, user: null }));
    localStorage.removeItem('globalState');
    toast.success('Successfully signed out');
    navigate('/');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
              <span className="ml-2 text-xl font-semibold text-gray-900">Faculty Portal</span>
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
                src={facultyData?.profileImage || 'https://randomuser.me/api/portraits/men/42.jpg'}
                alt={facultyData?.name || 'Faculty User'}
              />
              <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">{facultyData?.name || 'Faculty User'}</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden" 
            onClick={toggleMobileSidebar}
          ></div>
        )}
        
        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center">
                <img src={cseduLogo} alt="CSEDU Logo" className="h-8 w-auto" />
                <span className="ml-2 text-lg font-semibold">Faculty</span>
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {sidebarItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={toggleMobileSidebar}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.badge}
                      </span>
                    )}
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
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Desktop sidebar */}
        <div className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}>
          <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {sidebarItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {isSidebarOpen && (
                      <>
                        <span className="ml-3">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-3">Sign out</span>}
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 md:p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading...</p>
              </div>
            ) : (
              <div>
                {location.pathname === '/faculty' && (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-blue-500">
                      <h2 className="text-xl leading-6 font-bold text-white">Welcome, {facultyData?.name}</h2>
                      <p className="mt-1 max-w-2xl text-sm text-indigo-100">{facultyData?.designation} • {facultyData?.department}</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                      <p className="text-gray-700 mb-6">This is your faculty dashboard. Use the sidebar to navigate to different sections.</p>
                      
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                <Calendar className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Meetings</dt>
                                  <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">3</div>
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                              <NavLink to="/faculty/meetings" className="font-medium text-indigo-700 hover:text-indigo-900">View all</NavLink>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <BookOpen className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-500 truncate">Active Courses</dt>
                                  <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">2</div>
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                              <NavLink to="/faculty/courses" className="font-medium text-blue-700 hover:text-blue-900">View all</NavLink>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <ClipboardList className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Assignments</dt>
                                  <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">5</div>
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                              <NavLink to="/faculty/assignments" className="font-medium text-green-700 hover:text-green-900">View all</NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Outlet />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
