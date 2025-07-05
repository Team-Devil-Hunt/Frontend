import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar, ListFilter, Grid3X3 } from 'lucide-react'
import ScheduleFilters from '@/components/schedule/ScheduleFilters'
import ScheduleCard from '@/components/schedule/ScheduleCard'
import WeeklyView from '@/components/schedule/WeeklyView'

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
  const [scheduleData, setScheduleData] = useState(mockScheduleData)
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
  const filteredClasses = scheduleData.classes.filter(cls => {
    return (
      (filters.batch === '' || cls.batch === filters.batch) &&
      (filters.semester === '' || cls.semester === filters.semester) &&
      (filters.room === '' || cls.room === filters.room) &&
      (filters.day === '' || 
        (filters.day === 'Today' && cls.day === getWeekDay(new Date().getDay())) ||
        (filters.day === 'Tomorrow' && cls.day === getWeekDay((new Date().getDay() + 1) % 7)) ||
        (filters.day === 'This Week')) &&
      (filters.search === '' || 
        cls.courseName.toLowerCase().includes(filters.search.toLowerCase()) ||
        cls.courseCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        cls.instructorName.toLowerCase().includes(filters.search.toLowerCase()))
    )
  })
  
  // Helper function to get weekday name
  function getWeekDay(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayIndex]
  }
  
  // Fetch schedule data from API
  useEffect(() => {
    // In a real application, this would be an API call
    // fetch('/api/schedule/classes')
    //   .then(response => response.json())
    //   .then(data => setScheduleData(data))
    //   .catch(error => console.error('Error fetching schedule data:', error))
    
    // Using mock data for now
    setScheduleData(mockScheduleData)
  }, [])
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Class Schedule</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View and filter the weekly class schedule for all batches, semesters, and rooms. 
          Use the filters below to find specific classes.
        </p>
      </motion.div>
      
      <ScheduleFilters 
        filters={filters}
        setFilters={setFilters}
        batches={scheduleData.batches}
        semesters={scheduleData.semesters}
        rooms={scheduleData.rooms}
        days={['Today', 'Tomorrow', 'This Week']}
        activeFiltersCount={activeFiltersCount}
      />
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {filteredClasses.length} {filteredClasses.length === 1 ? 'Class' : 'Classes'} 
          {activeFiltersCount > 0 ? ' (Filtered)' : ''}
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View:</span>
          <Tabs value={view} onValueChange={setView} className="w-[300px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="weekly" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Weekly</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListFilter className="w-4 h-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {view === 'weekly' ? (
        <WeeklyView classes={scheduleData.classes} filters={filters} />
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classInfo, index) => (
              <ScheduleCard key={classInfo.id} classInfo={classInfo} index={index} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Grid3X3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Found</h3>
              <p className="text-gray-600 mb-6">
                No classes match your current filter criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={() => setFilters({
                search: '',
                batch: '',
                semester: '',
                room: '',
                day: ''
              })}>
                Clear All Filters
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Schedule
