import React, { useState, useMemo , useEffect} from 'react';
import { motion } from 'framer-motion';
import { Search, XCircle, Calendar, Clock, MapPin, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LabBookingModal from '../components/lab/LabBookingModal';

import Api from '../constant/Api'

// Mock API data for lab booking
// Schema:
// GET /api/labs
// {
//   labs: Array<{
//     id: string,
//     name: string,
//     description: string,
//     location: string,
//     capacity: number,
//     facilities: Array<string>,
//     image: string,
//     availableTimeSlots: Array<{
//       id: string,
//       day: string,
//       startTime: string,
//       endTime: string,
//       isBooked: boolean
//     }>
//   }>,
//   bookings: Array<{
//     id: string,
//     labId: string,
//     userId: string,
//     userName: string,
//     userRole: string,
//     timeSlotId: string,
//     date: string,
//     purpose: string,
//     status: 'pending' | 'approved' | 'rejected',
//     createdAt: string,
//     updatedAt: string
//   }>
// }

const mockLabData = {
  labs: [
    {
      id: 'lab-1',
      name: 'AI & Machine Learning Lab',
      description: 'Equipped with high-performance GPUs and specialized hardware for AI research and development',
      location: 'Building A, 3rd Floor, Room 302',
      capacity: 30,
      facilities: ['NVIDIA RTX GPUs', 'High-performance workstations', 'AI development frameworks', 'Research datasets'],
      image: '/assets/labs/ai-lab.jpg',
      availableTimeSlots: [
        { id: 'ts-1-1', day: 'Monday', startTime: '09:00', endTime: '11:00', isBooked: false },
        { id: 'ts-1-2', day: 'Monday', startTime: '11:00', endTime: '13:00', isBooked: true },
        { id: 'ts-1-3', day: 'Monday', startTime: '14:00', endTime: '16:00', isBooked: false },
        { id: 'ts-1-4', day: 'Tuesday', startTime: '09:00', endTime: '11:00', isBooked: false },
        { id: 'ts-1-5', day: 'Tuesday', startTime: '11:00', endTime: '13:00', isBooked: false },
        { id: 'ts-1-6', day: 'Wednesday', startTime: '14:00', endTime: '16:00', isBooked: true },
      ]
    },
    {
      id: 'lab-2',
      name: 'Networking & Security Lab',
      description: 'Specialized lab for network configuration, security testing, and protocol analysis',
      location: 'Building B, 2nd Floor, Room 203',
      capacity: 25,
      facilities: ['Cisco networking equipment', 'Security testing tools', 'Protocol analyzers', 'Firewall systems'],
      image: '/assets/labs/network-lab.jpg',
      availableTimeSlots: [
        { id: 'ts-2-1', day: 'Monday', startTime: '09:00', endTime: '11:00', isBooked: true },
        { id: 'ts-2-2', day: 'Monday', startTime: '11:00', endTime: '13:00', isBooked: false },
        { id: 'ts-2-3', day: 'Tuesday', startTime: '14:00', endTime: '16:00', isBooked: false },
        { id: 'ts-2-4', day: 'Wednesday', startTime: '09:00', endTime: '11:00', isBooked: false },
        { id: 'ts-2-5', day: 'Thursday', startTime: '11:00', endTime: '13:00', isBooked: true },
      ]
    },
    {
      id: 'lab-3',
      name: 'Software Development Lab',
      description: 'Modern lab for software engineering projects and collaborative development',
      location: 'Building A, 2nd Floor, Room 201',
      capacity: 40,
      facilities: ['Development workstations', 'Collaboration tools', 'Version control systems', 'Testing frameworks'],
      image: '/assets/labs/software-lab.jpg',
      availableTimeSlots: [
        { id: 'ts-3-1', day: 'Tuesday', startTime: '09:00', endTime: '11:00', isBooked: false },
        { id: 'ts-3-2', day: 'Tuesday', startTime: '11:00', endTime: '13:00', isBooked: false },
        { id: 'ts-3-3', day: 'Wednesday', startTime: '14:00', endTime: '16:00', isBooked: false },
        { id: 'ts-3-4', day: 'Thursday', startTime: '09:00', endTime: '11:00', isBooked: true },
        { id: 'ts-3-5', day: 'Friday', startTime: '11:00', endTime: '13:00', isBooked: false },
      ]
    },
    {
      id: 'lab-4',
      name: 'IoT & Embedded Systems Lab',
      description: 'Specialized lab for IoT device development and embedded systems programming',
      location: 'Building B, 3rd Floor, Room 305',
      capacity: 20,
      facilities: ['Microcontrollers', 'Sensors', 'IoT development kits', 'Embedded systems tools'],
      image: '/assets/labs/iot-lab.jpg',
      availableTimeSlots: [
        { id: 'ts-4-1', day: 'Monday', startTime: '14:00', endTime: '16:00', isBooked: false },
        { id: 'ts-4-2', day: 'Wednesday', startTime: '09:00', endTime: '11:00', isBooked: false },
        { id: 'ts-4-3', day: 'Wednesday', startTime: '11:00', endTime: '13:00', isBooked: true },
        { id: 'ts-4-4', day: 'Thursday', startTime: '14:00', endTime: '16:00', isBooked: false },
        { id: 'ts-4-5', day: 'Friday', startTime: '09:00', endTime: '11:00', isBooked: false },
      ]
    },
  ],
  bookings: [
    {
      id: 'booking-1',
      labId: 'lab-1',
      userId: 'user-1',
      userName: 'Tanvir Ahmed',
      userRole: 'student',
      timeSlotId: 'ts-1-2',
      date: '2025-07-08',
      purpose: 'Deep learning model training for thesis project',
      status: 'approved',
      createdAt: '2025-07-01T09:30:00',
      updatedAt: '2025-07-02T11:15:00'
    },
    {
      id: 'booking-2',
      labId: 'lab-2',
      userId: 'user-2',
      userName: 'Nusrat Jahan',
      userRole: 'student',
      timeSlotId: 'ts-2-1',
      date: '2025-07-08',
      purpose: 'Network security testing for course project',
      status: 'pending',
      createdAt: '2025-07-03T14:20:00',
      updatedAt: '2025-07-03T14:20:00'
    },
    {
      id: 'booking-3',
      labId: 'lab-3',
      userId: 'user-3',
      userName: 'Dr. Mahmud Hasan',
      userRole: 'faculty',
      timeSlotId: 'ts-3-4',
      date: '2025-07-11',
      purpose: 'Software engineering class demonstration',
      status: 'approved',
      createdAt: '2025-06-28T10:45:00',
      updatedAt: '2025-06-29T09:30:00'
    },
  ]
};

const LabBooking = () => {
  const [selectedDay, setSelectedDay] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLab, setSelectedLab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBookings, setUserBookings] = useState([]);


  const [labs, setLabs] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await Api.get('api/labs');
        setLabs(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabs();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await Api.get('api/lab-bookings');
        setBookings(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookings();
  }, []);
  
  // Filter labs based on search query and selected day
  // const filteredLabs = useMemo(() => {
  //   return labs.filter(lab => {
  //     // Filter by search query
  //     if (searchQuery) {
  //       const query = searchQuery.toLowerCase();
  //       const matchesQuery = (
  //         lab.name.toLowerCase().includes(query) ||
  //         lab.description.toLowerCase().includes(query) ||
  //         lab.location.toLowerCase().includes(query) ||
  //         lab.facilities.some(facility => facility.toLowerCase().includes(query))
  //       );
  //       if (!matchesQuery) return false;
  //     }
      
  //     // Filter by day
  //     if (selectedDay !== 'all') {
  //       const hasSelectedDay = lab.availableTimeSlots.some(slot => slot.day === selectedDay);
  //       if (!hasSelectedDay) return false;
  //     }
      
  //     return true;
  //   });
  // }, [searchQuery, selectedDay]);

  
  // new filter
  
  const filteredLabs = useMemo(() => {
    return labs.filter(lab => {
      // Filter by search query (only if there's a query)
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery = (
          lab.name.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query) ||
          lab.location.toLowerCase().includes(query) ||
          lab.facilities.some(facility => facility.toLowerCase().includes(query))
        );
        if (!matchesQuery) return false;
      }
  
      // Filter by day
      if (selectedDay !== 'all') {
        const hasSelectedDay = lab.availableTimeSlots.some(slot => slot.day === selectedDay);
        if (!hasSelectedDay) return false;
      }
  
      return true;
    });
  }, [labs, searchQuery, selectedDay]);
  
  
  // Get available days from all labs
  const availableDays = useMemo(() => {
    const days = new Set();
    labs.forEach(lab => {
      lab.availableTimeSlots.forEach(slot => {
        days.add(slot.day);
      });
    });
    return ['all', ...Array.from(days)];
  }, []);
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lab Booking</h1>
        <p className="text-gray-600 mb-8">
          Book computer labs for your research projects, coursework, and academic activities.
        </p>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search labs by name, facilities, or location..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="w-full md:w-auto z-10">
              <select
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {availableDays.map(day => (
                  <option key={day} value={day}>
                    {day === 'all' ? 'All Days' : day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Lab Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredLabs.map(lab => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {/* Lab Image/Placeholder */}
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
                  Capacity: {lab.capacity}
                </div>
                {/* Placeholder for lab image */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500 text-lg">{lab.name}</span>
                </div>
              </div>
              
              {/* Lab Details */}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{lab.name}</h3>
                <p className="text-gray-600 mb-4">{lab.description}</p>
                
                <div className="text-sm text-gray-500 mb-4">
                  <p><strong>Location:</strong> {lab.location}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Facilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lab.facilities.map((facility, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* View Time Slots Button */}
              <div className="px-6 pb-6">
                <button 
                  onClick={() => {
                    setSelectedLab(lab);
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View Available Time Slots
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredLabs.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No labs found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query to find labs.
            </p>
          </div>
        )}
        
        {/* User Bookings Section */}
        {userBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userBookings.map((booking) => {
                    const lab = labs.find(l => l.id === booking.labId);
                    const timeSlot = lab?.availableTimeSlots.find(t => t.id === booking.timeSlotId);
                    
                    return (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lab?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.purpose.length > 30 ? `${booking.purpose.substring(0, 30)}...` : booking.purpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`
                          }>
                            {booking.status === 'approved' && <CheckCircle size={12} className="mr-1" />}
                            {booking.status === 'rejected' && <AlertTriangle size={12} className="mr-1" />}
                            {booking.status === 'pending' && <Clock size={12} className="mr-1" />}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Lab Booking Modal */}
        <LabBookingModal
          lab={selectedLab}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(bookingData) => {
            // Create a new booking with the submitted data
            const newBooking = {
              id: `booking-${Date.now()}`,
              ...bookingData,
              user: {
                id: 'user-123',
                name: 'Current User',
                email: 'user@example.com'
              },
              status: 'pending',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            // Add the new booking to the user's bookings
            setUserBookings(prevBookings => [...prevBookings, newBooking]);
          }}
        />
      </div>
      <Footer />
    </>
  );
};

export default LabBooking;
