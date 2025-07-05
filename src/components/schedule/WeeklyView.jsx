import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, MapPin, Users } from 'lucide-react'

const WeeklyView = ({ classes, filters }) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  
  // Filter classes based on active filters
  const filteredClasses = classes.filter(cls => {
    return (
      (filters.batch === '' || cls.batch === filters.batch) &&
      (filters.semester === '' || cls.semester === filters.semester) &&
      (filters.room === '' || cls.room === filters.room) &&
      (filters.day === '' || 
        (filters.day === 'Today' && cls.day === weekDays[new Date().getDay()]) ||
        (filters.day === 'Tomorrow' && cls.day === weekDays[(new Date().getDay() + 1) % 7]) ||
        (filters.day === 'This Week')) &&
      (filters.search === '' || 
        cls.courseName.toLowerCase().includes(filters.search.toLowerCase()) ||
        cls.courseCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        cls.instructorName.toLowerCase().includes(filters.search.toLowerCase()))
    )
  })

  // Group classes by day
  const classesByDay = weekDays.reduce((acc, day) => {
    acc[day] = filteredClasses.filter(cls => cls.day === day)
    return acc
  }, {})

  // Function to determine class card position and height based on time
  const getClassPosition = (startTime, endTime) => {
    const startHour = parseInt(startTime.split(':')[0])
    const startMinute = parseInt(startTime.split(':')[1].split(' ')[0])
    const isPM = startTime.includes('PM')
    
    const endHour = parseInt(endTime.split(':')[0])
    const endMinute = parseInt(endTime.split(':')[1].split(' ')[0])
    const isEndPM = endTime.includes('PM')
    
    // Convert to 24-hour format
    const start24 = (isPM && startHour !== 12 ? startHour + 12 : startHour) + startMinute / 60
    const end24 = (isEndPM && endHour !== 12 ? endHour + 12 : endHour) + endMinute / 60
    
    // Calculate position and height (each hour is 100px)
    const top = (start24 - 8) * 100 // 8:00 AM is the start time
    const height = (end24 - start24) * 100
    
    return { top, height }
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
                      
                      {/* Classes for this day */}
                      {classesByDay[day].map((cls, i) => {
                        const { top, height } = getClassPosition(cls.startTime, cls.endTime)
                        return (
                          <div
                            key={`${cls.courseCode}-${i}`}
                            className={`absolute left-1 right-1 rounded-md border-l-4 p-2 overflow-hidden ${getClassColor(cls.type)}`}
                            style={{ 
                              top: `${top}px`, 
                              height: `${height}px`,
                              zIndex: 10
                            }}
                          >
                            <div className="text-xs font-bold truncate">{cls.courseCode}</div>
                            <div className="text-xs truncate">{cls.courseName}</div>
                            <div className="text-xs flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>Room {cls.room}</span>
                            </div>
                          </div>
                        )
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
                      .sort((a, b) => {
                        // Sort by start time
                        const aTime = a.startTime
                        const bTime = b.startTime
                        return aTime.localeCompare(bTime)
                      })
                      .map((cls, i) => (
                        <Card key={`${cls.courseCode}-${i}`} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${cls.type === 'Lecture' ? 'bg-blue-500' : cls.type === 'Lab' ? 'bg-green-500' : 'bg-amber-500'}`}>
                                    {cls.type}
                                  </Badge>
                                  <h4 className="font-medium">{cls.courseCode} - {cls.courseName}</h4>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{cls.startTime} - {cls.endTime}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Room {cls.room}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>Batch {cls.batch}, Semester {cls.semester}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                {cls.instructorName}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
