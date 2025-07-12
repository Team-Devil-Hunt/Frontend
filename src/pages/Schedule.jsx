import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Button } from '../components/ui/button'
import { Calendar, ListFilter, Grid3X3, RefreshCw, AlertTriangle } from 'lucide-react'
import ScheduleFilters from '../components/schedule/ScheduleFilters'
import ScheduleCard from '../components/schedule/ScheduleCard'
import WeeklyView from '../components/schedule/WeeklyView'

import Api from '../constant/Api'

/*
API Schema:
GET /api/schedule/classes
Response:
{
  "classes": [
    {
      "id": "string",
      "courseCode": "string",
      "courseName": "string",
      "type": "Lecture" | "Lab" | "Tutorial",
      "batch": "string",
      "semester": "string",
      "day": "string",
      "startTime": "string",
      "endTime": "string",
      "room": "string",
      "instructorName": "string",
      "instructorDesignation": "string",
      "status": "In Progress" | "Upcoming" | "Completed" | "Cancelled"
    }
  ],
  "batches": ["string"],
  "semesters": ["string"],
  "rooms": ["string"]
}
*/

// Mock API data
const mockScheduleData = {
  classes: [
    {
      id: "cs101-1",
      courseCode: "CSE-101",
      courseName: "Introduction to Computer Science",
      type: "Lecture",
      batch: "25",
      semester: "1",
      day: "Sunday",
      startTime: "9:00 AM",
      endTime: "10:30 AM",
      room: "301",
      instructorName: "Dr. Mahmuda Naznin",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs101-2",
      courseCode: "CSE-101",
      courseName: "Introduction to Computer Science",
      type: "Lab",
      batch: "25",
      semester: "1",
      day: "Tuesday",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      room: "Lab 1",
      instructorName: "Asif Ahmed",
      instructorDesignation: "Assistant Professor",
      status: "Upcoming"
    },
    {
      id: "cs203-1",
      courseCode: "CSE-203",
      courseName: "Data Structures",
      type: "Lecture",
      batch: "24",
      semester: "3",
      day: "Monday",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      room: "302",
      instructorName: "Dr. Syed Monowar Hossain",
      instructorDesignation: "Associate Professor",
      status: "Upcoming"
    },
    {
      id: "cs203-2",
      courseCode: "CSE-203",
      courseName: "Data Structures",
      type: "Lab",
      batch: "24",
      semester: "3",
      day: "Wednesday",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      room: "Lab 2",
      instructorName: "Fahim Ahmed",
      instructorDesignation: "Lecturer",
      status: "Upcoming"
    },
    {
      id: "cs303-1",
      courseCode: "CSE-303",
      courseName: "Database Systems",
      type: "Lecture",
      batch: "23",
      semester: "5",
      day: "Sunday",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      room: "303",
      instructorName: "Dr. Saifuddin Md. Tareeq",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs303-2",
      courseCode: "CSE-303",
      courseName: "Database Systems",
      type: "Lab",
      batch: "23",
      semester: "5",
      day: "Thursday",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      room: "Lab 3",
      instructorName: "Nusrat Jahan",
      instructorDesignation: "Lecturer",
      status: "Upcoming"
    },
    {
      id: "cs405-1",
      courseCode: "CSE-405",
      courseName: "Computer Networks",
      type: "Lecture",
      batch: "22",
      semester: "7",
      day: "Monday",
      startTime: "9:00 AM",
      endTime: "10:30 AM",
      room: "304",
      instructorName: "Dr. Muhammad Masroor Ali",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs405-2",
      courseCode: "CSE-405",
      courseName: "Computer Networks",
      type: "Lab",
      batch: "22",
      semester: "7",
      day: "Wednesday",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      room: "Lab 4",
      instructorName: "Tanvir Ahmed",
      instructorDesignation: "Assistant Professor",
      status: "Upcoming"
    },
    {
      id: "cs501-1",
      courseCode: "CSE-501",
      courseName: "Advanced Machine Learning",
      type: "Lecture",
      batch: "MSc",
      semester: "1",
      day: "Tuesday",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      room: "501",
      instructorName: "Dr. Md. Mustafizur Rahman",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs501-2",
      courseCode: "CSE-501",
      courseName: "Advanced Machine Learning",
      type: "Lab",
      batch: "MSc",
      semester: "1",
      day: "Thursday",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      room: "Research Lab",
      instructorName: "Dr. Md. Mustafizur Rahman",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs601-1",
      courseCode: "CSE-601",
      courseName: "Advanced Research Methods",
      type: "Lecture",
      batch: "PhD",
      semester: "1",
      day: "Friday",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      room: "601",
      instructorName: "Dr. Md. Abdur Rahman",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs307-1",
      courseCode: "CSE-307",
      courseName: "Software Engineering",
      type: "Lecture",
      batch: "23",
      semester: "5",
      day: "Monday",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      room: "303",
      instructorName: "Dr. Kazi Muheymin-Us-Sakib",
      instructorDesignation: "Professor",
      status: "Upcoming"
    },
    {
      id: "cs307-2",
      courseCode: "CSE-307",
      courseName: "Software Engineering",
      type: "Tutorial",
      batch: "23",
      semester: "5",
      day: "Wednesday",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      room: "303",
      instructorName: "Rayhan Ahmed",
      instructorDesignation: "Lecturer",
      status: "Upcoming"
    },
    {
      id: "cs205-1",
      courseCode: "CSE-205",
      courseName: "Digital Logic Design",
      type: "Lecture",
      batch: "24",
      semester: "3",
      day: "Thursday",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      room: "302",
      instructorName: "Dr. Md. Rezaul Karim",
      instructorDesignation: "Associate Professor",
      status: "Upcoming"
    },
    {
      id: "cs205-2",
      courseCode: "CSE-205",
      courseName: "Digital Logic Design",
      type: "Lab",
      batch: "24",
      semester: "3",
      day: "Sunday",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      room: "Hardware Lab",
      instructorName: "Md. Shariful Islam",
      instructorDesignation: "Assistant Professor",
      status: "Upcoming"
    }
  ],
  batches: ["25", "24", "23", "22", "MSc", "PhD"],
  semesters: ["1", "2", "3", "4", "5", "6", "7", "8"],
  rooms: ["301", "302", "303", "304", "501", "601", "Lab 1", "Lab 2", "Lab 3", "Lab 4", "Hardware Lab", "Research Lab"]
}

const Schedule = () => {


  const [scheduleData, setScheduleData] = useState({
    classes: [],
    batches: [],
    semesters: [],
    rooms: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      // Use the correct API endpoint as defined in the API schema comment at the top
      const response = await Api.get('/api/schedule/classes');
      
      // Validate response data structure
      if (response.data && Array.isArray(response.data.classes)) {
        setScheduleData(response.data);
        setError(null);
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setError('Failed to load schedule data. Using mock data instead.');
      // Fallback to mock data if API fails
      setScheduleData(mockScheduleData);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchScheduleData();
  }, []);
  const [filters, setFilters] = useState({
    search: '',
    batch: '',
    semester: '',
    room: '',
    day: ''
  })
  const [view, setView] = useState('weekly')
  
  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length
  
  // Filter classes based on active filters
  const filteredClasses = scheduleData?.classes?.filter(cls => {
    if (!cls) return false;
    
    return (
      (filters.batch === '' || (cls.batch && cls.batch === filters.batch)) &&
      (filters.semester === '' || (cls.semester && cls.semester === filters.semester)) &&
      (filters.room === '' || (cls.room && cls.room === filters.room)) &&
      (filters.day === '' || 
        (filters.day === 'Today' && cls.day && cls.day === weekDays[new Date().getDay()]) ||
        (filters.day === 'Tomorrow' && cls.day && cls.day === weekDays[(new Date().getDay() + 1) % 7]) ||
        (filters.day === 'This Week')) &&
      (filters.search === '' || 
        (cls.courseName && cls.courseName.toLowerCase().includes(filters.search.toLowerCase())) ||
        (cls.courseCode && cls.courseCode.toLowerCase().includes(filters.search.toLowerCase())) ||
        (cls.instructorName && cls.instructorName.toLowerCase().includes(filters.search.toLowerCase())))
    )
  }) || [] 
  
  // Define weekdays array for consistent use across components
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  // Helper function to get weekday name
  function getWeekDay(dayIndex) {
    return weekDays[dayIndex]
  }
  
  // Fetch schedule data from API
  // useEffect(() => {
  //   // In a real application, this would be an API call
  //   // fetch('/api/schedule/classes')
  //   //   .then(response => response.json())
  //   //   .then(data => setScheduleData(data))
  //   //   .catch(error => console.error('Error fetching schedule data:', error))
    
  //   // Using mock data for now
  //   setScheduleData(mockScheduleData)
  // }, [])
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Class Schedule</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">
          View and filter the weekly class schedule for all batches, semesters, and rooms. 
          Use the filters below to find specific classes.
        </p>
        <button 
          onClick={fetchScheduleData} 
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Schedule'}
        </button>
      </motion.div>
      
      {/* Loading State */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md p-8"
        >
          <div className="relative mb-6">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
            <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-transparent border-opacity-50 animate-pulse absolute top-0"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading schedule data...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
        </motion.div>
      )}
      
      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Schedule</h3>
                <p className="text-red-700">{error}</p>
                <p className="text-red-600 text-sm mt-2">
                  This could be due to a network issue or the server might be temporarily unavailable.
                </p>
              </div>
            </div>
            <button
              onClick={fetchScheduleData}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Content when data is loaded */}
      {!loading && !error && (
        <div>
          {/* Filters */}
          <div className="mb-8">
            <ScheduleFilters 
              filters={filters} 
              setFilters={setFilters} 
              batches={Array.from(new Set(scheduleData?.classes?.filter(cls => cls && cls.batch).map(cls => cls.batch) || [])).sort()} 
              semesters={Array.from(new Set(scheduleData?.classes?.filter(cls => cls && cls.semester).map(cls => cls.semester) || [])).sort()} 
              rooms={Array.from(new Set(scheduleData?.classes?.filter(cls => cls && cls.room).map(cls => cls.room) || [])).sort()} 
            />
            
            {/* Active filters count */}
            {activeFiltersCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mt-4 p-3 bg-blue-50 text-blue-800 rounded-md"
              >
                <span>
                  <strong>{activeFiltersCount}</strong> active filter{activeFiltersCount !== 1 ? 's' : ''}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFilters({
                    batch: '',
                    semester: '',
                    room: '',
                    day: '',
                    search: ''
                  })}
                  className="text-blue-700 hover:text-blue-900"
                >
                  Clear All
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Classes count summary */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Showing </span>
                <span className="font-medium">{filteredClasses.length}</span>
                <span className="text-gray-600"> of </span>
                <span className="font-medium">{scheduleData?.classes?.length || 0}</span>
                <span className="text-gray-600"> classes</span>
              </div>
              {filteredClasses.length === 0 && activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilters({
                    batch: '',
                    semester: '',
                    room: '',
                    day: '',
                    search: ''
                  })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </motion.div>
          
          {/* Schedule Display */}
          <div>
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-2">
                <TabsTrigger value="weekly" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Weekly View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Grid3X3 size={16} />
                  List View
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="weekly">
                <WeeklyView classes={filteredClasses} filters={filters} />
              </TabsContent>
              
              <TabsContent value="list">
                {filteredClasses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredClasses.map((cls, index) => (
                      <ScheduleCard key={`${cls.courseCode || ''}-${index}`} classData={cls} />
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Found</h3>
                    <p className="text-gray-600 mb-2">
                      There are no classes in the schedule that match your current filter criteria.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Try adjusting your filters or check back later for updated class schedules.
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule
