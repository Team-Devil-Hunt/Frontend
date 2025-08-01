import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, Cpu, Server, Database, Layers, HardDrive, Smartphone, Wifi, Zap, ChevronDown, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BookingModal from '../components/equipment/BookingModal';
import Api from '../constant/Api';
import { useEffect } from 'react';

// Mock API data for equipment booking
// Schema:
// GET /api/equipment
// {
//   categories: Array<{
//     id: string,
//     name: string,
//     icon: string,
//     description: string
//   }>,
//   equipment: Array<{
//     id: string,
//     name: string,
//     description: string,
//     categoryId: string,
//     specifications: string,
//     quantity: number,
//     available: number,
//     image: string,
//     location: string,
//     requiresApproval: boolean
//   }>,
//   bookings: Array<{
//     id: string,
//     equipmentId: string,
//     userId: string,
//     userName: string,
//     userRole: string,
//     startTime: string,
//     endTime: string,
//     purpose: string,
//     status: 'pending' | 'approved' | 'rejected' | 'completed',
//     createdAt: string,
//     updatedAt: string,
//     rejectionReason?: string
//   }>
// }

// const mockEquipmentData = {
//   categories: [
//     {
//       id: 'cat-1',
//       name: 'Computing Hardware',
//       icon: 'Cpu',
//       description: 'High-performance computing resources including GPUs, servers, and specialized processors'
//     },
//     {
//       id: 'cat-2',
//       name: 'Sensors & IoT',
//       icon: 'Wifi',
//       description: 'Various sensors, actuators, and Internet of Things devices for research and projects'
//     },
//     {
//       id: 'cat-3',
//       name: 'Storage & Memory',
//       icon: 'Database',
//       description: 'Storage devices and memory modules for data-intensive applications'
//     },
//     {
//       id: 'cat-4',
//       name: 'Mobile & Embedded',
//       icon: 'Smartphone',
//       description: 'Mobile devices and embedded systems for testing and development'
//     },
//     {
//       id: 'cat-5',
//       name: 'Networking',
//       icon: 'Layers',
//       description: 'Networking equipment for communication and distributed systems research'
//     }
//   ],
//   equipment: [
//     {
//       id: 'eq-1',
//       name: 'NVIDIA RTX 4090 GPU',
//       description: 'High-end graphics processing unit for AI and deep learning applications',
//       categoryId: 'cat-1',
//       specifications: '24GB GDDR6X, 16384 CUDA cores, 2.52 GHz boost clock',
//       quantity: 4,
//       available: 2,
//       image: '/assets/equipment/gpu.jpg',
//       location: 'AI Lab (Room 302)',
//       requiresApproval: true
//     },
//     {
//       id: 'eq-2',
//       name: 'Temperature & Humidity Sensor Kit',
//       description: 'Precision sensors for environmental monitoring in IoT projects',
//       categoryId: 'cat-2',
//       specifications: 'DHT22 sensors, -40 to 80°C range, ±0.5°C accuracy',
//       quantity: 20,
//       available: 15,
//       image: '/assets/equipment/temp-sensor.jpg',
//       location: 'IoT Lab (Room 201)',
//       requiresApproval: false
//     },
//     {
//       id: 'eq-3',
//       name: 'High-Performance Server',
//       description: 'Multi-core server for distributed computing and virtualization',
//       categoryId: 'cat-1',
//       specifications: 'AMD EPYC 7763, 64 cores, 128 threads, 256GB RAM',
//       quantity: 2,
//       available: 1,
//       image: '/assets/equipment/server.jpg',
//       location: 'Server Room (Room 405)',
//       requiresApproval: true
//     },
//     {
//       id: 'eq-4',
//       name: 'Motion Capture System',
//       description: 'Advanced motion tracking system for computer vision research',
//       categoryId: 'cat-2',
//       specifications: '12-camera setup, 120fps, sub-millimeter accuracy',
//       quantity: 1,
//       available: 1,
//       image: '/assets/equipment/motion-capture.jpg',
//       location: 'Graphics Lab (Room 304)',
//       requiresApproval: true
//     },
//     {
//       id: 'eq-5',
//       name: 'SSD Storage Array',
//       description: 'High-speed storage array for data-intensive applications',
//       categoryId: 'cat-3',
//       specifications: '10TB total, NVMe SSDs, 7000MB/s read, 5000MB/s write',
//       quantity: 3,
//       available: 3,
//       image: '/assets/equipment/ssd-array.jpg',
//       location: 'Data Science Lab (Room 303)',
//       requiresApproval: false
//     },
//     {
//       id: 'eq-6',
//       name: 'Raspberry Pi Kit',
//       description: 'Complete Raspberry Pi development kit with accessories',
//       categoryId: 'cat-4',
//       specifications: 'Raspberry Pi 4B, 8GB RAM, 64GB SD, sensors, display',
//       quantity: 15,
//       available: 8,
//       image: '/assets/equipment/raspberry-pi.jpg',
//       location: 'Embedded Systems Lab (Room 202)',
//       requiresApproval: false
//     },
//     {
//       id: 'eq-7',
//       name: 'Network Testing Kit',
//       description: 'Professional networking equipment for protocol testing and research',
//       categoryId: 'cat-5',
//       specifications: 'Cisco switches, routers, packet analyzers, cables',
//       quantity: 5,
//       available: 4,
//       image: '/assets/equipment/network-kit.jpg',
//       location: 'Networking Lab (Room 203)',
//       requiresApproval: true
//     },
//     {
//       id: 'eq-8',
//       name: 'Drone Development Kit',
//       description: 'Programmable drone with sensors and development interface',
//       categoryId: 'cat-2',
//       specifications: 'Quadcopter, 4K camera, programmable flight controller',
//       quantity: 3,
//       available: 2,
//       image: '/assets/equipment/drone.jpg',
//       location: 'Robotics Lab (Room 305)',
//       requiresApproval: true
//     }
//   ],
//   bookings: [
//     {
//       id: 'book-1',
//       equipmentId: 'eq-1',
//       userId: 'user-1',
//       userName: 'Tanvir Ahmed',
//       userRole: 'student',
//       startTime: '2025-07-08T10:00:00',
//       endTime: '2025-07-08T14:00:00',
//       purpose: 'Deep learning model training for thesis project',
//       status: 'approved',
//       createdAt: '2025-07-01T09:30:00',
//       updatedAt: '2025-07-02T11:15:00'
//     },
//     {
//       id: 'book-2',
//       equipmentId: 'eq-1',
//       userId: 'user-2',
//       userName: 'Nusrat Jahan',
//       userRole: 'student',
//       startTime: '2025-07-09T09:00:00',
//       endTime: '2025-07-09T13:00:00',
//       purpose: 'Computer vision research project',
//       status: 'pending',
//       createdAt: '2025-07-03T14:20:00',
//       updatedAt: '2025-07-03T14:20:00'
//     },
//     {
//       id: 'book-3',
//       equipmentId: 'eq-3',
//       userId: 'user-3',
//       userName: 'Dr. Mahmud Hasan',
//       userRole: 'faculty',
//       startTime: '2025-07-10T13:00:00',
//       endTime: '2025-07-12T17:00:00',
//       purpose: 'Distributed database performance testing',
//       status: 'approved',
//       createdAt: '2025-06-28T10:45:00',
//       updatedAt: '2025-06-29T09:30:00'
//     },
//     {
//       id: 'book-4',
//       equipmentId: 'eq-7',
//       userId: 'user-4',
//       userName: 'Samiha Rahman',
//       userRole: 'student',
//       startTime: '2025-07-07T15:00:00',
//       endTime: '2025-07-07T18:00:00',
//       purpose: 'Network protocol testing for course project',
//       status: 'rejected',
//       createdAt: '2025-07-02T16:30:00',
//       updatedAt: '2025-07-03T11:20:00',
//       rejectionReason: 'Conflicting schedule with higher priority research'
//     },
//     {
//       id: 'book-5',
//       equipmentId: 'eq-8',
//       userId: 'user-5',
//       userName: 'Fahim Khan',
//       userRole: 'student',
//       startTime: '2025-07-15T10:00:00',
//       endTime: '2025-07-15T16:00:00',
//       purpose: 'Autonomous drone navigation testing',
//       status: 'pending',
//       createdAt: '2025-07-05T13:15:00',
//       updatedAt: '2025-07-05T13:15:00'
//     }
//   ]
// };

const EquipmentBooking = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  const [mockEquipmentData, setMockEquipmentData] = useState(null);

  
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const [catRes, eqRes, bookingRes] = await Promise.all([
          Api.get('/api/equipment/categories'),
          Api.get('/api/equipment/'),
          Api.get('/api/equipment/bookings').catch(() => ({ data: [] })) // Handle unauthorized gracefully
        ]);
        
        // Transform equipment data to match frontend expectations
        const transformedEquipment = eqRes.data.map(item => ({
          ...item,
          categoryId: item.category_id, // Map category_id to categoryId
          requiresApproval: item.requires_approval // Map requires_approval to requiresApproval
        }));
        
        const combinedData = {
          categories: catRes.data || [],
          equipment: transformedEquipment || [],
          bookings: bookingRes.data || []
        };
        setMockEquipmentData(combinedData);
        console.log('Fetched equipment data:', combinedData);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
        // Set default empty data structure if API fails
        setMockEquipmentData({
          categories: [],
          equipment: [],
          bookings: []
        });
      }
    };
    fetchEquipmentData();
  }, []);

  // Load user bookings when data is available
  useEffect(() => {
    if (mockEquipmentData?.bookings?.length > 0) {
      // Transform bookings to match frontend expectations
      const transformedBookings = mockEquipmentData.bookings.map(booking => {
        // Find equipment name
        const equipment = mockEquipmentData.equipment.find(eq => eq.id === booking.equipmentId);
        return {
          ...booking,
          equipmentName: equipment ? equipment.name : 'Unknown Equipment'
        };
      });
      setUserBookings(transformedBookings);
    }
  }, [mockEquipmentData]);
  
  
  // Open booking modal with selected equipment
  const handleBookNow = (equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };
  
  // Handle booking submission
  const handleBookingSubmit = async (bookingData) => {
    try {
      // Send booking data to the backend API
      const response = await Api.post('/api/equipment/bookings', {
        equipmentId: bookingData.equipmentId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose: bookingData.purpose
      });
      
      console.log('Booking submitted successfully:', response.data);
      
      // Add the new booking to the user bookings list
      const newBooking = {
        id: response.data.id || `book-${Date.now()}`,
        equipmentId: bookingData.equipmentId,
        equipmentName: selectedEquipment.name,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose: bookingData.purpose,
        status: response.data.status || (selectedEquipment.requiresApproval ? 'pending' : 'approved'),
        createdAt: response.data.createdAt || new Date().toISOString()
      };
      
      // Refresh equipment data to get updated availability
      fetchEquipmentData();
      
      setUserBookings([newBooking, ...userBookings]);
      
      // Show success notification
      alert('Equipment booking submitted successfully!');
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Fallback to local state if API fails
      const newBooking = {
        id: `book-${Date.now()}`,
        equipmentId: bookingData.equipmentId,
        equipmentName: selectedEquipment.name,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose: bookingData.purpose,
        status: selectedEquipment.requiresApproval ? 'pending' : 'approved',
        createdAt: new Date().toISOString()
      };
      
      setUserBookings([newBooking, ...userBookings]);
      
      // Show error notification
      alert('Failed to submit booking to server. Added to local bookings only.');
    }
  };
  
  // Function to fetch equipment data
  const fetchEquipmentData = async () => {
    try {
      const [catRes, eqRes, bookingRes] = await Promise.all([
        Api.get('/api/equipment/categories'),
        Api.get('/api/equipment/'),
        Api.get('/api/equipment/bookings').catch(() => ({ data: [] })) // Handle unauthorized gracefully
      ]);
      
      // Transform equipment data to match frontend expectations
      const transformedEquipment = eqRes.data.map(item => ({
        ...item,
        categoryId: item.category_id, // Map category_id to categoryId
        requiresApproval: item.requires_approval // Map requires_approval to requiresApproval
      }));
      
      const combinedData = {
        categories: catRes.data || [],
        equipment: transformedEquipment || [],
        bookings: bookingRes.data || []
      };
      setMockEquipmentData(combinedData);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
      // Set default empty data structure if API fails
      setMockEquipmentData({
        categories: [],
        equipment: [],
        bookings: []
      });
    }
  };
  
  // Filter equipment based on category, search query, and availability
  // const filteredEquipment = useMemo(() => {
  //   return mockEquipmentData.equipment.filter(item => {
  //     // Filter by category
  //     if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
  //       return false;
  //     }
      
  //     // Filter by availability
  //     if (showAvailableOnly && item.available === 0) {
  //       return false;
  //     }
      
  //     // Filter by search query
  //     if (searchQuery) {
  //       const query = searchQuery.toLowerCase();
  //       return (
  //         item.name.toLowerCase().includes(query) ||
  //         item.description.toLowerCase().includes(query) ||
  //         item.specifications.toLowerCase().includes(query)
  //       );
  //     }
      
  //     return true;
  //   });
  // }, [selectedCategory, searchQuery, showAvailableOnly]);

  const filteredEquipment = useMemo(() => {
    const equipmentList = mockEquipmentData?.equipment || [];
  
    return equipmentList.filter(item => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
      if (showAvailableOnly && item.available === 0) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.specifications && item.specifications.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [mockEquipmentData, selectedCategory, searchQuery, showAvailableOnly]);
  
  
  // Get category name by ID
  const getCategoryName = (categoryId) => {
    if (!mockEquipmentData?.categories) return 'Unknown';
    const category = mockEquipmentData.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  // Get category icon by ID
  const getCategoryIcon = (categoryId) => {
    if (!mockEquipmentData?.categories) return <Cpu size={20} />;
    const category = mockEquipmentData.categories.find(cat => cat.id === categoryId);
    if (!category) return <Cpu size={20} />;
    
    switch (category.icon) {
      case 'Cpu': return <Cpu size={20} />;
      case 'Wifi': return <Wifi size={20} />;
      case 'Database': return <Database size={20} />;
      case 'Smartphone': return <Smartphone size={20} />;
      case 'Layers': return <Layers size={20} />;
      default: return <HardDrive size={20} />;
    }
  };


  
  return (
    <>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Equipment Booking</h1>
          <p className="text-gray-600">
            Book lab equipment for your research projects and academic work. Some equipment requires admin approval.
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search equipment..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={showAvailableOnly}
                  onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                />
                <span className="ml-2 text-gray-700">Available Only</span>
              </label>
            </div>
            
            <div className="w-full md:w-auto">
              <select
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {mockEquipmentData?.categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                )) || <option value="all">All Categories</option>}
              </select>
            </div>
          </div>
        </div>
        
        {/* Equipment List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map(equipment => (
            <motion.div
              key={equipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-50 hover:shadow-lg transition-all duration-300 hover:border-blue-100 group relative"
            >
              {/* Blue accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-blue-700"></div>
              
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 relative">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-1.5 text-sm font-medium rounded-bl-lg shadow-sm">
                  <span className="font-bold">{equipment.available}</span> / {equipment.quantity} Available
                </div>
                
                {/* Equipment image/icon */}
                <div className="w-full h-full flex items-center justify-center bg-blue-50/50">
                  <div className="p-4 bg-white/80 rounded-full shadow-inner border border-blue-100">
                    {React.cloneElement(getCategoryIcon(equipment.categoryId), { 
                      className: 'w-12 h-12 text-blue-600' 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-b from-white to-blue-50">
                <div className="flex items-center mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    {React.cloneElement(getCategoryIcon(equipment.categoryId), {
                      className: 'w-4 h-4 text-blue-600'
                    })}
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {getCategoryName(equipment.categoryId)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                  {equipment.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                  {equipment.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">Specs:</span> <span className="text-gray-700">{equipment.specifications}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">Location:</span> <span className="text-gray-700">{equipment.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {equipment.requiresApproval ? (
                    <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                      <AlertTriangle size={14} className="mr-1.5" />
                      <span>Requires Approval</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                      <CheckCircle size={14} className="mr-1.5" />
                      <span>Instant Booking</span>
                    </div>
                  )}
                  
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      equipment.available > 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={equipment.available === 0}
                    onClick={() => handleBookNow(equipment)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query to find equipment.
            </p>
          </div>
        )}
      
        {/* User Bookings Section */}
        {userBookings.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Slot
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userBookings.map((booking) => {
                    // Format dates for display
                    const startDate = new Date(booking.startTime);
                    const endDate = new Date(booking.endTime);
                    const formattedStart = startDate.toLocaleString();
                    const formattedEnd = endDate.toLocaleString();
                    
                    return (
                      <motion.tr 
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.equipmentName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1 text-gray-500" />
                              <span>From: {formattedStart}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Calendar size={14} className="mr-1 text-gray-500" />
                              <span>To: {formattedEnd}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{booking.purpose}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Booking Modal */}
        {selectedEquipment && (
          <BookingModal
            equipment={selectedEquipment}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleBookingSubmit}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default EquipmentBooking;
