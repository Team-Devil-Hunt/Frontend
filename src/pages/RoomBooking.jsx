/*
API Schema:
GET /api/rooms
{
  rooms: [
    {
      id: string,
      name: string,
      capacity: number,
      floor: number,
      building: string,
      type: string, // 'classroom', 'lab', 'seminar', 'meeting'
      features: string[], // ['projector', 'whiteboard', 'computers', etc]
      image: string,
      availability: [
        {
          day: string, // 'Monday', 'Tuesday', etc.
          slots: [
            {
              id: string,
              startTime: string, // format: 'HH:MM'
              endTime: string,   // format: 'HH:MM'
              isAvailable: boolean
            }
          ]
        }
      ]
    }
  ]
}

POST /api/room-bookings
Request Body: {
  roomId: string,
  date: string, // ISO date format
  startTime: string, // format: 'HH:MM'
  endTime: string,   // format: 'HH:MM'
  purpose: string,
  attendees: number
}
Response: {
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: string
}
*/

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin, Building, CheckCircle, XCircle, Filter, Search, RefreshCw, AlertTriangle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Api from '../constant/Api'

// Mock data for initial rendering or fallback
const mockRoomsData = {
  rooms: [
    {
      id: '1',
      name: 'Room 301',
      capacity: 60,
      floor: 3,
      building: 'Main Building',
      type: 'classroom',
      features: ['projector', 'whiteboard', 'air conditioning'],
      image: '/assets/rooms/classroom.jpg',
      availability: [
        {
          day: 'Monday',
          slots: [
            { id: 'mon-1', startTime: '08:00', endTime: '09:30', isAvailable: false },
            { id: 'mon-2', startTime: '09:45', endTime: '11:15', isAvailable: true },
            { id: 'mon-3', startTime: '11:30', endTime: '13:00', isAvailable: true },
            { id: 'mon-4', startTime: '14:00', endTime: '15:30', isAvailable: false },
            { id: 'mon-5', startTime: '15:45', endTime: '17:15', isAvailable: true }
          ]
        },
        {
          day: 'Tuesday',
          slots: [
            { id: 'tue-1', startTime: '08:00', endTime: '09:30', isAvailable: true },
            { id: 'tue-2', startTime: '09:45', endTime: '11:15', isAvailable: false },
            { id: 'tue-3', startTime: '11:30', endTime: '13:00', isAvailable: false },
            { id: 'tue-4', startTime: '14:00', endTime: '15:30', isAvailable: true },
            { id: 'tue-5', startTime: '15:45', endTime: '17:15', isAvailable: true }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Room 302',
      capacity: 40,
      floor: 3,
      building: 'Main Building',
      type: 'seminar',
      features: ['projector', 'whiteboard', 'air conditioning', 'conference system'],
      image: '/assets/rooms/seminar.jpg',
      availability: [
        {
          day: 'Monday',
          slots: [
            { id: 'mon-1', startTime: '08:00', endTime: '09:30', isAvailable: true },
            { id: 'mon-2', startTime: '09:45', endTime: '11:15', isAvailable: false },
            { id: 'mon-3', startTime: '11:30', endTime: '13:00', isAvailable: false },
            { id: 'mon-4', startTime: '14:00', endTime: '15:30', isAvailable: true },
            { id: 'mon-5', startTime: '15:45', endTime: '17:15', isAvailable: false }
          ]
        },
        {
          day: 'Tuesday',
          slots: [
            { id: 'tue-1', startTime: '08:00', endTime: '09:30', isAvailable: false },
            { id: 'tue-2', startTime: '09:45', endTime: '11:15', isAvailable: true },
            { id: 'tue-3', startTime: '11:30', endTime: '13:00', isAvailable: true },
            { id: 'tue-4', startTime: '14:00', endTime: '15:30', isAvailable: false },
            { id: 'tue-5', startTime: '15:45', endTime: '17:15', isAvailable: true }
          ]
        }
      ]
    }
  ]
};

const RoomBooking = () => {
  const [roomsData, setRoomsData] = useState({ rooms: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [bookingForm, setBookingForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  })
  const [bookingStatus, setBookingStatus] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    building: 'all',
    roomType: 'all',
    capacity: 'all',
    feature: 'all'
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const fetchRoomsData = async () => {
    setLoading(true)
    try {
      const response = await Api.get('/api/rooms')
      if (response.data && Array.isArray(response.data.rooms)) {
        setRoomsData(response.data)
        setError(null)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (err) {
      console.error('Error fetching rooms data:', err)
      setError('Failed to load rooms data. Using mock data instead.')
      setRoomsData(mockRoomsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoomsData()
  }, [])

  // Get unique values for filter dropdowns
  const buildings = roomsData.rooms && roomsData.rooms.length > 0
    ? [...new Set(roomsData.rooms.filter(room => room && room.building).map(room => room.building))].sort()
    : []
  const roomTypes = roomsData.rooms && roomsData.rooms.length > 0
    ? [...new Set(roomsData.rooms.filter(room => room && room.type).map(room => room.type))].sort()
    : []
  const capacityRanges = ['1-30', '31-50', '51-100', '100+']
  const allFeatures = roomsData.rooms && roomsData.rooms.length > 0
    ? [...new Set(roomsData.rooms
        .filter(room => room && Array.isArray(room.features))
        .flatMap(room => room.features))].sort()
    : []

  // Filter rooms based on selected filters
  const filteredRooms = roomsData.rooms ? roomsData.rooms.filter(room => {
    if (!room) return false
    
    const searchMatch = filters.search === '' || 
      (room.name && room.name.toLowerCase().includes(filters.search.toLowerCase())) ||
      (room.building && room.building.toLowerCase().includes(filters.search.toLowerCase()))
    
    const buildingMatch = filters.building === 'all' || 
      (room.building && room.building === filters.building)
    
    const typeMatch = filters.roomType === 'all' || 
      (room.type && room.type === filters.roomType)
    
    let capacityMatch = true
    if (filters.capacity !== 'all' && room.capacity !== undefined) {
      const [min, max] = filters.capacity.split('-').map(Number)
      if (max) {
        capacityMatch = room.capacity >= min && room.capacity <= max
      } else {
        // For '100+' case
        capacityMatch = room.capacity >= min
      }
    }
    
    const featureMatch = filters.feature === 'all' || 
      (Array.isArray(room.features) && room.features.includes(filters.feature))
    
    return searchMatch && buildingMatch && typeMatch && capacityMatch && featureMatch
  }) : []

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  // Handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    // Reset booking form
    setBookingForm({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: 1
    })
    setBookingStatus(null)
  }

  // Handle booking form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validate booking form
  const validateBookingForm = () => {
    if (!bookingForm.date) return 'Please select a date';
    if (!bookingForm.startTime) return 'Please select a start time';
    if (!bookingForm.endTime) return 'Please select an end time';
    if (!bookingForm.purpose.trim()) return 'Please enter a purpose for your booking';
    if (!bookingForm.attendees || bookingForm.attendees < 1) return 'Please enter a valid number of attendees';
    
    // Validate time format and logic
    const startTimeParts = bookingForm.startTime.split(':').map(Number);
    const endTimeParts = bookingForm.endTime.split(':').map(Number);
    
    if (startTimeParts.length !== 2 || endTimeParts.length !== 2) return 'Invalid time format';
    
    const startMinutes = startTimeParts[0] * 60 + startTimeParts[1];
    const endMinutes = endTimeParts[0] * 60 + endTimeParts[1];
    
    if (startMinutes >= endMinutes) return 'End time must be after start time';
    if (endMinutes - startMinutes < 30) return 'Booking must be at least 30 minutes';
    
    return null; // No validation errors
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      setBookingStatus({ 
        type: 'error', 
        message: 'Please select a room first.' 
      });
      return;
    }
    
    // Validate form
    const validationError = validateBookingForm();
    if (validationError) {
      setBookingStatus({ 
        type: 'error', 
        message: validationError 
      });
      return;
    }
    
    try {
      setBookingStatus({ type: 'loading', message: 'Processing your booking...' });
      
      const response = await Api.post('/api/room-bookings', {
        roomId: selectedRoom.id,
        ...bookingForm
      });
      
      if (response.data && response.data.id) {
        setBookingStatus({ 
          type: 'success', 
          message: `Booking submitted successfully! Status: ${response.data.status || 'pending'}`,
          bookingId: response.data.id
        });
        
        // Reset form after successful submission
        setBookingForm({
          date: new Date().toISOString().split('T')[0],
          startTime: '',
          endTime: '',
          purpose: '',
          attendees: 1
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      setBookingStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to submit booking. Please try again later.' 
      });
    }
  }

  // Get room type display name
  const getRoomTypeDisplay = (type) => {
    const types = {
      'classroom': 'Classroom',
      'lab': 'Laboratory',
      'seminar': 'Seminar Room',
      'meeting': 'Meeting Room'
    }
    return types[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Room Booking</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse available rooms and book them for classes, meetings, or events.
            </p>
            <button 
              onClick={fetchRoomsData} 
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search rooms by name or building..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.building}
                  onChange={(e) => handleFilterChange('building', e.target.value)}
                >
                  <option value="all">All Buildings</option>
                  {buildings.map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                >
                  <option value="all">All Room Types</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{getRoomTypeDisplay(type)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                >
                  <option value="all">Any Capacity</option>
                  {capacityRanges.map(range => (
                    <option key={range} value={range}>{range} people</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Features:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 text-sm rounded-full ${filters.feature === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => handleFilterChange('feature', 'all')}
                >
                  All Features
                </button>
                {allFeatures.map(feature => (
                  <button
                    key={feature}
                    className={`px-3 py-1 text-sm rounded-full ${filters.feature === feature ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    onClick={() => handleFilterChange('feature', feature)}
                  >
                    {feature.charAt(0).toUpperCase() + feature.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-md p-8"
            >
              <div className="flex justify-center items-center mb-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                  <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-transparent border-opacity-50 animate-pulse absolute top-0"></div>
                </div>
              </div>
              <p className="text-gray-600 text-lg">Loading available rooms...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div 
              variants={itemVariants} 
              className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 shadow-sm"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Rooms</h3>
                    <p className="text-red-700">{error}</p>
                    <p className="text-red-600 text-sm mt-2">
                      This could be due to a network issue or the server might be temporarily unavailable.
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchRoomsData}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          {/* Room listing and booking interface */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Room list */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="mb-4">
                  <p className="text-gray-600">
                    Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
                  </p>
                </div>

                {filteredRooms.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-gray-600">No rooms match your filter criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRooms.map(room => (
                      <motion.div 
                        key={room.id}
                        variants={itemVariants}
                        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${selectedRoom?.id === room.id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => handleRoomSelect(room)}
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                              <p className="text-gray-600">{getRoomTypeDisplay(room.type)}</p>
                            </div>
                            <div>
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                Capacity: {room.capacity}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Building size={18} className="text-gray-500" />
                              <span>{room.building}, Floor {room.floor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={18} className="text-gray-500" />
                              <span>Seats {room.capacity} people</span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Features:</p>
                            <div className="flex flex-wrap gap-2">
                              {room.features.map(feature => (
                                <span 
                                  key={feature} 
                                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs"
                                >
                                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
              
              {/* Booking form */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                  {selectedRoom ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Book {selectedRoom.name}</h3>
                      
                      {/* Day selector */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Select day:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRoom.availability.map(day => (
                            <button
                              key={day.day}
                              className={`px-3 py-1 text-sm rounded-full ${selectedDay === day.day ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                              onClick={() => setSelectedDay(day.day)}
                            >
                              {day.day}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Availability display */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Available time slots:</p>
                        <div className="space-y-2">
                          {selectedRoom.availability
                            .find(day => day.day === selectedDay)?.slots
                            .map(slot => (
                              <div 
                                key={slot.id} 
                                className={`p-2 rounded-lg flex justify-between items-center ${slot.isAvailable ? 'bg-green-50' : 'bg-red-50'}`}
                              >
                                <span className="flex items-center gap-2">
                                  <Clock size={16} className={slot.isAvailable ? 'text-green-600' : 'text-red-600'} />
                                  <span>{slot.startTime} - {slot.endTime}</span>
                                </span>
                                <span>
                                  {slot.isAvailable ? 
                                    <CheckCircle size={16} className="text-green-600" /> : 
                                    <XCircle size={16} className="text-red-600" />}
                                </span>
                              </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Booking form */}
                      <form onSubmit={handleBookingSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                              type="date"
                              name="date"
                              value={bookingForm.date}
                              onChange={handleFormChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                              <input
                                type="time"
                                name="startTime"
                                value={bookingForm.startTime}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                              <input
                                type="time"
                                name="endTime"
                                value={bookingForm.endTime}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                            <textarea
                              name="purpose"
                              value={bookingForm.purpose}
                              onChange={handleFormChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="3"
                              placeholder="Briefly describe the purpose of your booking"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees</label>
                            <input
                              type="number"
                              name="attendees"
                              value={bookingForm.attendees}
                              onChange={handleFormChange}
                              min="1"
                              max={selectedRoom.capacity}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">Maximum capacity: {selectedRoom.capacity}</p>
                          </div>
                          
                          {bookingStatus && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 rounded-lg shadow-sm ${
                                {
                                'loading': 'bg-blue-50 border border-blue-100',
                                'success': 'bg-green-50 border border-green-100',
                                'error': 'bg-red-50 border border-red-100'
                              }[bookingStatus.type]}`}
                            >
                              <div className="flex items-start gap-3">
                                {bookingStatus.type === 'loading' && (
                                  <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-blue-600 animate-spin mt-0.5"></div>
                                )}
                                {bookingStatus.type === 'success' && (
                                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                                )}
                                {bookingStatus.type === 'error' && (
                                  <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                                )}
                                <div>
                                  <p className={`font-medium ${
                                    {
                                    'loading': 'text-blue-800',
                                    'success': 'text-green-800',
                                    'error': 'text-red-800'
                                  }[bookingStatus.type]}`}>
                                    {bookingStatus.message}
                                  </p>
                                  {bookingStatus.type === 'success' && bookingStatus.bookingId && (
                                    <p className="text-green-600 text-sm mt-1">
                                      Booking ID: {bookingStatus.bookingId}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                          
                          <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            disabled={bookingStatus?.type === 'loading'}
                          >
                            {bookingStatus?.type === 'loading' ? 'Processing...' : 'Book Room'}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Select a room to book</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}

export default RoomBooking
