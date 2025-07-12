import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Clock, MapPin, Users, AlertCircle } from 'lucide-react'

const WeeklyView = ({ classes = [], filters = {} }) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  
  // Filter classes based on active filters
  const filteredClasses = Array.isArray(classes) ? classes.filter(cls => {
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
  }) : []

  // Group classes by day
  const classesByDay = weekDays.reduce((acc, day) => {
    acc[day] = filteredClasses.filter(cls => cls && cls.day === day)
    return acc
  }, {})

  // Check if there are any classes at all
  const hasClasses = Object.values(classesByDay).some(dayClasses => dayClasses.length > 0)

  // Function to determine class card position and height based on time
  const getClassPosition = (startTime, endTime) => {
    try {
      // Handle different time formats
      const parseTime = (timeStr) => {
        if (!timeStr) return 8; // Default to 8:00 AM if time is missing
        
        // If time is in 24-hour format (e.g., "14:00")
        if (!timeStr.includes(' ')) {
          const parts = timeStr.split(':');
          if (parts.length !== 2) return 8; // Invalid format, return default
          
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          
          if (isNaN(hours) || isNaN(minutes)) return 8; // Invalid numbers, return default
          return hours + minutes / 60;
        }
        
        // If time is in 12-hour format (e.g., "2:00 PM")
        const timeParts = timeStr.split(' ');
        if (timeParts.length !== 2) return 8; // Invalid format, return default
        
        const [time, period] = timeParts;
        const parts = time.split(':');
        if (parts.length !== 2) return 8; // Invalid format, return default
        
        let hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        if (isNaN(hours) || isNaN(minutes)) return 8; // Invalid numbers, return default
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours + minutes / 60;
      };
      
      const start24 = parseTime(startTime);
      const end24 = parseTime(endTime || startTime); // Fallback to startTime if endTime is missing
      
      // Ensure end time is after start time
      const validEnd24 = end24 > start24 ? end24 : start24 + 1;
      
      // Calculate position and height (each hour is 100px)
      const top = Math.max((start24 - 8) * 100, 0); // 8:00 AM is the start time, ensure not negative
      const height = Math.max((validEnd24 - start24) * 100, 50); // Minimum height of 50px
      
      return { top, height };
    } catch (error) {
      console.error('Error parsing time:', error, { startTime, endTime });
      return { top: 0, height: 100 }; // Default fallback
    }
  }

  // Determine class card color based on class type
  const getClassColor = (type) => {
    switch (type) {
      case 'Lecture':
        return 'bg-blue-100 border-blue-500 text-blue-800'
      case 'Lab':
        return 'bg-green-100 border-green-500 text-green-800'
      case 'Tutorial':
        return 'bg-amber-100 border-amber-500 text-amber-800'
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800'
    }
  }

  // If there are no classes at all, show a message
  if (!hasClasses) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Found</h3>
        <p className="text-gray-600 mb-2">
          There are no classes in the schedule that match your current filter criteria.
        </p>
        <p className="text-gray-500 text-sm">
          Try adjusting your filters or check back later for updated class schedules.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="h-10 flex items-end justify-center">
                  <span className="text-sm font-medium text-gray-500">Time</span>
                </div>
                {weekDays.map(day => (
                  <div 
                    key={day} 
                    className={`h-10 flex items-center justify-center font-medium rounded-md ${
                      day === weekDays[new Date().getDay()] ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Time grid */}
              <div className="relative">
                {/* Time labels */}
                <div className="grid grid-cols-8 gap-2">
                  <div className="space-y-[100px]">
                    {timeSlots.map(time => (
                      <div key={time} className="h-0">
                        <span className="text-xs text-gray-500 -mt-2 block">{time}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Day columns with hour gridlines */}
                  {weekDays.map(day => (
                    <div key={day} className="relative h-[1000px] bg-gray-50 rounded-md">
                      {/* Horizontal hour lines */}
                      {timeSlots.map((time, i) => (
                        <div 
                          key={time} 
                          className="absolute w-full border-t border-gray-200" 
                          style={{ top: `${i * 100}px` }}
                        />
                      ))}
                      
                      {/* No classes message */}
                      {classesByDay[day].length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">No classes scheduled</p>
                        </div>
                      )}
                      
                      {/* Classes for this day */}
                      {classesByDay[day].map((cls, i) => {
                        if (!cls || !cls.startTime) return null;
                        
                        const { top, height } = getClassPosition(cls.startTime, cls.endTime);
                        const courseCode = cls.courseCode || 'Unknown Course';
                        const courseName = cls.courseName || 'Untitled';
                        const room = cls.room || 'TBA';
                        
                        return (
                          <div
                            key={`${courseCode}-${i}`}
                            className={`absolute left-1 right-1 rounded-md border-l-4 p-2 overflow-hidden ${getClassColor(cls.type)}`}
                            style={{ 
                              top: `${top}px`, 
                              height: `${height}px`,
                              zIndex: 10
                            }}
                          >
                            <div className="text-xs font-bold truncate">{courseCode}</div>
                            <div className="text-xs truncate">{courseName}</div>
                            <div className="text-xs flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>Room {room}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <div className="space-y-6">
            {weekDays.map(day => (
              <div key={day}>
                <h3 className={`text-lg font-bold mb-3 pb-2 border-b ${
                  day === weekDays[new Date().getDay()] ? 'text-blue-800' : 'text-gray-800'
                }`}>
                  {day}
                  {day === weekDays[new Date().getDay()] && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-800">Today</Badge>
                  )}
                </h3>
                
                {classesByDay[day].length > 0 ? (
                  <div className="space-y-3">
                    {classesByDay[day]
                      .filter(cls => cls && cls.startTime) // Filter out invalid classes
                      .sort((a, b) => {
                        // Sort by start time
                        const aTime = a.startTime || ''
                        const bTime = b.startTime || ''
                        return aTime.localeCompare(bTime)
                      })
                      .map((cls, i) => {
                        const courseCode = cls.courseCode || 'Unknown Course';
                        const courseName = cls.courseName || 'Untitled';
                        const room = cls.room || 'TBA';
                        const type = cls.type || 'Other';
                        const startTime = cls.startTime || 'TBA';
                        const endTime = cls.endTime || 'TBA';
                        const batch = cls.batch || 'N/A';
                        const semester = cls.semester || 'N/A';
                        const instructorName = cls.instructorName || 'TBA';
                        
                        return (
                          <Card key={`${courseCode}-${i}`} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`${
                                      type === 'Lecture' ? 'bg-blue-500' : 
                                      type === 'Lab' ? 'bg-green-500' : 
                                      'bg-amber-500'
                                    }`}>
                                      {type}
                                    </Badge>
                                    <h4 className="font-medium">{courseCode}{courseName ? ` - ${courseName}` : ''}</h4>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{startTime}{endTime !== 'TBA' ? ` - ${endTime}` : ''}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>Room {room}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      <span>Batch {batch}, Semester {semester}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  {instructorName}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No classes scheduled for {day}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

export default WeeklyView
