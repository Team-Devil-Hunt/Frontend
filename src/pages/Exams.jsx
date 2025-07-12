/*
API Schema:
GET /api/exams
{
  exams: [
    {
      id: string,
      courseCode: string,
      courseTitle: string,
      semester: number,
      batch: string,
      examType: "midterm" | "final" | "retake" | "improvement",
      date: string (ISO date),
      startTime: string (format: "HH:MM"),
      endTime: string (format: "HH:MM"),
      room: string,
      invigilators: string[],
      status: "scheduled" | "ongoing" | "completed" | "cancelled",
      notes: string
    }
  ]
}
*/

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Filter, Search, Download, RefreshCw } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Api from '../constant/Api'

// Mock data for initial rendering or fallback
const mockExamData = {
  exams: [
    {
      id: "1",
      courseCode: "CSE-401",
      courseTitle: "Artificial Intelligence",
      semester: 4,
      batch: "25",
      examType: "midterm",
      date: "2025-07-15",
      startTime: "10:00",
      endTime: "12:00",
      room: "Room 301",
      invigilators: ["Dr. Rashid Ahmed", "Ms. Fatima Khan"],
      status: "scheduled",
      notes: "Bring your student ID and calculator."
    },
    {
      id: "2",
      courseCode: "CSE-402",
      courseTitle: "Computer Networks",
      semester: 4,
      batch: "25",
      examType: "final",
      date: "2025-07-20",
      startTime: "09:00",
      endTime: "12:00",
      room: "Room 302",
      invigilators: ["Dr. Kamal Hossain", "Dr. Nusrat Jahan"],
      status: "scheduled",
      notes: "Open book exam. Bring your textbook."
    }
  ]
};

const Exams = () => {
  const [examData, setExamData] = useState({ exams: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    batch: 'all',
    examType: 'all',
    status: 'all'
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

  const fetchExamData = async () => {
    setLoading(true)
    try {
      const response = await Api.get('/api/exams')
      if (response.data && Array.isArray(response.data.exams)) {
        setExamData(response.data)
        setError(null)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (err) {
      console.error('Error fetching exam data:', err)
      setError('Failed to load exam data. Using mock data instead.')
      setExamData(mockExamData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExamData()
  }, [])

  // Get unique values for filter dropdowns
  const uniqueBatches = examData.exams && examData.exams.length > 0 
    ? [...new Set(examData.exams.map(exam => exam.batch))].sort()
    : []
  const examTypes = ['midterm', 'final', 'retake', 'improvement']
  const statusTypes = ['scheduled', 'ongoing', 'completed', 'cancelled']
  
  // Find upcoming exams (scheduled exams with the closest dates)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to beginning of day for accurate comparison
  
  const upcomingExams = examData.exams ? examData.exams
    .filter(exam => {
      if (!exam || !exam.date || !exam.status) return false
      const examDate = new Date(exam.date)
      return exam.status === 'scheduled' && examDate >= today
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3) // Get the 3 closest upcoming exams
    : []

  // Filter exams based on selected filters
  const filteredExams = examData.exams ? examData.exams.filter(exam => {
    if (!exam) return false
    
    const searchMatch = filters.search === '' || 
      (exam.courseCode?.toLowerCase().includes(filters.search.toLowerCase()) ||
      exam.courseTitle?.toLowerCase().includes(filters.search.toLowerCase()))
    
    const batchMatch = filters.batch === 'all' || exam.batch === filters.batch
    const typeMatch = filters.examType === 'all' || exam.examType === filters.examType
    const statusMatch = filters.status === 'all' || exam.status === filters.status
    
    return searchMatch && batchMatch && typeMatch && statusMatch
  }) : []

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not specified';
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date format';
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Export exam schedule as CSV
  const exportExamSchedule = (exams) => {
    if (!exams || exams.length === 0) {
      alert('No exams to export');
      return;
    }
    
    try {
      // Define CSV headers
      const headers = [
        'Course Code', 
        'Course Title', 
        'Semester',
        'Batch',
        'Exam Type',
        'Date',
        'Start Time',
        'End Time',
        'Room',
        'Invigilators',
        'Status',
        'Notes'
      ];
      
      // Format exam data for CSV
      const csvData = exams.map(exam => [
        exam.courseCode || '',
        exam.courseTitle || '',
        exam.semester || '',
        exam.batch || '',
        exam.examType || '',
        exam.date || '',
        exam.startTime || '',
        exam.endTime || '',
        exam.room || '',
        (exam.invigilators && Array.isArray(exam.invigilators)) ? exam.invigilators.join('; ') : '',
        exam.status || '',
        exam.notes || ''
      ]);
      
      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `exam-schedule-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting exam schedule:', error);
      alert('Failed to export exam schedule. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Exam Schedule</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              View and filter upcoming and past examinations for all courses and batches.
            </p>
            <button 
              onClick={fetchExamData} 
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </motion.div>

          {/* Upcoming Exams */}
          {!loading && !error && upcomingExams.length > 0 && (
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 mb-8 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <Calendar size={20} className="mr-2" />
                Upcoming Exams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingExams.map(exam => (
                  <div 
                    key={exam.id || `upcoming-${Math.random().toString(36).substr(2, 9)}`}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-blue-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{exam.courseCode || 'N/A'}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {exam.examType?.charAt(0).toUpperCase() + exam.examType?.slice(1) || 'Exam'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 truncate">{exam.courseTitle || 'Untitled Course'}</p>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <Calendar size={14} className="mr-1 text-blue-600" />
                      <span>{formatDate(exam.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <Clock size={14} className="mr-1 text-blue-600" />
                      <span>{exam.startTime || '??:??'} - {exam.endTime || '??:??'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin size={14} className="mr-1 text-blue-600" />
                      <span>{exam.room || 'Room not assigned'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by course code or title..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.batch}
                  onChange={(e) => handleFilterChange('batch', e.target.value)}
                >
                  <option value="all">All Batches</option>
                  {uniqueBatches.map(batch => (
                    <option key={batch} value={batch}>Batch {batch}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.examType}
                  onChange={(e) => handleFilterChange('examType', e.target.value)}
                >
                  <option value="all">All Exam Types</option>
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {statusTypes.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
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
              <p className="text-gray-600 text-lg">Loading exam schedule...</p>
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
                <div>
                  <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Data</h3>
                  <p className="text-red-700">{error}</p>
                  <p className="text-red-600 text-sm mt-2">
                    This could be due to a network issue or the server might be temporarily unavailable.
                  </p>
                </div>
                <button
                  onClick={fetchExamData}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          {/* Exams list */}
          {!loading && (
            <>
              <motion.div variants={itemVariants} className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'}
                </p>
                <button 
                  onClick={() => exportExamSchedule(filteredExams)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  disabled={filteredExams.length === 0}
                >
                  <Download size={16} />
                  Export Schedule
                </button>
              </motion.div>

              {filteredExams.length === 0 ? (
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-8 text-center">
                  <p className="text-gray-600">No exams match your filter criteria.</p>
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} className="space-y-4">
                  {filteredExams.map(exam => (
                    <motion.div 
                      key={exam.id || `exam-${Math.random().toString(36).substr(2, 9)}`}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {exam.courseCode || 'N/A'}{exam.courseCode && exam.courseTitle ? ': ' : ''}{exam.courseTitle || 'Untitled Course'}
                            </h3>
                            <p className="text-gray-600">
                              {exam.semester ? `Semester ${exam.semester}` : 'No semester specified'}
                              {exam.semester && exam.batch ? ', ' : ''}
                              {exam.batch ? `Batch ${exam.batch}` : ''}
                            </p>
                          </div>
                          <div>
                            {exam.status ? (
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exam.status)}`}>
                                {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                Unknown Status
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-gray-500" />
                            <span>{formatDate(exam.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={18} className="text-gray-500" />
                            <span>
                              {exam.startTime && exam.endTime ? `${exam.startTime} - ${exam.endTime}` : 
                               exam.startTime ? `Starts at ${exam.startTime}` : 
                               exam.endTime ? `Ends at ${exam.endTime}` : 'Time not specified'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-gray-500" />
                            <span>{exam.room || 'Room not assigned'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-gray-500" />
                            <span>
                              {exam.invigilators && Array.isArray(exam.invigilators) && exam.invigilators.length > 0 
                                ? exam.invigilators.join(', ') 
                                : 'No invigilators assigned'}
                            </span>
                          </div>
                        </div>
                        
                        {exam.notes && (
                          <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">{exam.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Exams
