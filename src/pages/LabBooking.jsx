import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, XCircle, Calendar, Clock, MapPin, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LabBookingModal from '../components/lab/LabBookingModal';

import Api from '../constant/Api';

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
        // Transform the API response to match the expected format
        const transformedLabs = response.data.map(lab => ({
          ...lab,
          // Map time_slots to availableTimeSlots and add isBooked property
          availableTimeSlots: lab.time_slots ? lab.time_slots.map(slot => ({
            id: slot.id,
            day: slot.day,
            startTime: slot.start_time,
            endTime: slot.end_time,
            isBooked: false // Default to not booked
          })) : []
        }));
        setLabs(transformedLabs);
        console.log('Transformed labs:', transformedLabs);
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    };
    fetchLabs();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await Api.get('api/lab-bookings');
        setBookings(response.data || []);
        
        // Mark booked time slots
        if (response.data && response.data.length > 0 && labs.length > 0) {
          const updatedLabs = labs.map(lab => {
            const labBookings = response.data.filter(booking => booking.labId === lab.id);
            
            const updatedTimeSlots = lab.availableTimeSlots.map(slot => {
              const isSlotBooked = labBookings.some(booking => 
                booking.timeSlotId === slot.id && booking.status !== 'rejected'
              );
              return { ...slot, isBooked: isSlotBooked };
            });
            
            return { ...lab, availableTimeSlots: updatedTimeSlots };
          });
          
          setLabs(updatedLabs);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    if (labs.length > 0) {
      fetchBookings();
    }
  }, [labs.length]);
  
  // This commented code is no longer needed

  
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
  
  const openBookingModal = (lab) => {
    // Transform the lab data to include time_slots if needed
    const labWithTimeSlots = {
      ...lab,
      // Ensure time_slots exists for the hardcoded time slot ID
      time_slots: lab.time_slots || [{
        id: 1,
        day: 'Monday',
        start_time: '09:00',
        end_time: '11:00'
      }]
    };
    
    setSelectedLab(labWithTimeSlots);
    setIsModalOpen(true);
  };
  
  const handleBookingSubmit = (bookingData) => {
    // In a real app, you would send this to your API
    console.log('Booking submitted:', bookingData);
    
    // Add user information from authentication (simulated here)
    const completeBookingData = {
      ...bookingData,
      userId: 1, // This would come from authentication
      userName: 'Student User', // This would come from authentication
      userRole: 'Student', // This would come from authentication
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Make API call to create booking
    const createBooking = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await Api.post('api/lab-bookings', completeBookingData);
        console.log('Booking created:', completeBookingData);
        
        // Add the new booking to the user's bookings
        setUserBookings(prevBookings => [...prevBookings, completeBookingData]);
        
        // Refresh bookings after submission
        // fetchBookings();
      } catch (error) {
        console.error('Error creating booking:', error);
      }
    };
    
    createBooking();
  };  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-6 pb-12 px-4">
        <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-800 mb-3">Lab Booking</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Book computer labs for your research projects, coursework, and academic activities.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-indigo-500">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search labs by name, facilities, or location..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="w-full md:w-auto z-10">
              <select
                className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {filteredLabs.map(lab => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100"
            >
              {/* Lab Image/Placeholder */}
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                <div className="absolute top-3 right-3 bg-white text-indigo-700 px-3 py-1 text-sm font-medium rounded-full shadow-md">
                  <Users className="inline-block mr-1" size={16} /> {lab.capacity}
                </div>
                {/* Placeholder for lab image */}
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{lab.name}</span>
                </div>
              </div>
              
              {/* Lab Details */}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">{lab.name}</h3>
                <p className="text-gray-600 mb-4">{lab.description}</p>
                
                <div className="text-sm text-gray-600 mb-4 flex items-start">
                  <MapPin className="mr-2 text-indigo-500 flex-shrink-0" size={18} />
                  <p>{lab.location}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-indigo-700 mb-2">Facilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lab.facilities.map((facility, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200"
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
                  onClick={() => openBookingModal(lab)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md flex items-center justify-center"
                >
                  <Calendar className="mr-2" size={18} /> View Available Time Slots
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredLabs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
              <XCircle className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-indigo-800 mb-3">No labs found</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Try adjusting your filters or search query to find available labs.
            </p>
          </div>
        )}
        
        {/* User Bookings Section */}
        {userBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
              <CheckCircle className="mr-2" size={20} />
              Your Bookings
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-50 to-teal-50">
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
        {selectedLab && (
          <LabBookingModal
            lab={selectedLab}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleBookingSubmit}
          />
        )}
      </div>
      </div>
      <Footer />
    </>
  );
};

export default LabBooking;
