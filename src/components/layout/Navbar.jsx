import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '../ui/button'
import cseduLogo from '../../assets/csedu_logo.png'
import { useGlobalState } from '../../context/GlobalStateProvider'
import { toast } from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { globalState, setGlobalState } = useGlobalState()
  const isLoggedIn = !!globalState?.user;
  const userRole = globalState?.user?.role?.name?.toLowerCase() || 'student';
  console.log('User role:', userRole)
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])
  
  const handleSignOut = () => {
    setGlobalState(prev => ({ ...prev, user: null }))
    localStorage.removeItem('globalState')
    toast.success('Successfully signed out')
    navigate('/')
  }
  
  const handleDropdownClose = () => {
    setTimeout(() => {
      setActiveDropdown(null)
    }, 100)
  }

  const navigationItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'About', 
      href: '#',
      dropdown: [
        { name: 'Overview', href: '/' },
        { name: 'Faculty', href: '/faculty-members' },
        { name: 'Programs', href: '/programs' },
      ]
    },
    { 
      name: 'Academics', 
      href: '#',
      dropdown: [
        { name: 'Courses', href: '/courses' },
        { name: 'Schedule', href: '/schedule' },
        { name: 'Exams', href: '/exam-timetables' },
      ]
    },
    { 
      name: 'Services', 
      href: '#',
      dropdown: [
        { name: 'Equipment Booking', href: '/equipment-booking' },
        { name: 'Lab Booking', href: '/lab-booking' },
        { name: 'Meetings', href: '/meetings' },
      ]
    },
    { 
      name: 'Information', 
      href: '#',
      dropdown: [
        { name: 'Notices', href: '/notices' },
        { name: 'Events', href: '/events' },
        { name: 'Projects', href: '/projects' },
        { name: 'Awards', href: '/awards' },
      ]
    },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href) => location.pathname === href
  // Add null check before accessing user role
  console.log(globalState.user?.role?.name || 'No user role')
  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={cseduLogo} 
                alt="CSEDU Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">CSEDU</h1>
                <p className="text-xs text-gray-600">University of Dhaka</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative group"
                  >
                    <button 
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {/* Added a small invisible bridge to prevent gap between button and dropdown */}
                    <div className="absolute h-2 w-full top-full left-0"></div>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-50"
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            {isLoggedIn ? (
              <div className="relative ml-4 user-menu">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:inline">{globalState.user?.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
                  >
                    <Link
                      to={`/${userRole || 'student'}/meetings`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button asChild className="ml-4">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t z-50 overflow-hidden"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md ${activeDropdown === item.name ? 'text-blue-600 bg-gray-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transform ${activeDropdown === item.name ? 'rotate-180' : ''} transition-transform`} />
                    </button>
                    {activeDropdown === item.name && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 pl-3 border-l-2 border-gray-200 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-sm font-medium rounded-md ${isActive(subItem.href) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
