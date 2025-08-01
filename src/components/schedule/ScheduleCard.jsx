import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, BookOpen, CalendarDays } from 'lucide-react'

const ScheduleCard = ({ classData, index = 0 }) => {
  // Ensure we have valid data
  if (!classData) return null;
  // Determine card border color based on class type
  const getBorderColor = (type) => {
    switch (type) {
      case 'Lecture':
        return 'border-l-blue-500'
      case 'Lab':
        return 'border-l-green-500'
      case 'Tutorial':
        return 'border-l-amber-500'
      default:
        return 'border-l-gray-500'
    }
  }

  // Determine status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return <Badge className="bg-green-500">In Progress</Badge>
      case 'Upcoming':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Upcoming</Badge>
      case 'Completed':
        return <Badge variant="outline" className="text-gray-500">Completed</Badge>
      case 'Cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return null
    }
  }

  // Extract data with fallbacks for missing values
  const {
    type = 'Other',
    courseCode = 'Unknown',
    courseName = 'Untitled Course',
    status,
    batch = 'N/A',
    semester = 'N/A',
    startTime = 'TBA',
    endTime = 'TBA',
    day = 'TBA',
    room = 'TBA',
    instructorName = 'TBA',
    instructorDesignation = ''
  } = classData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={`border-l-4 ${getBorderColor(type)} hover:shadow-md transition-shadow`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{courseCode}{courseName !== 'Untitled Course' ? ` - ${courseName}` : ''}</h3>
                {status && getStatusBadge(status)}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <BookOpen className="w-4 h-4" />
                <span>{type}</span>
                <span className="mx-2">•</span>
                <Users className="w-4 h-4" />
                <span>Batch {batch}</span>
                <span className="mx-2">•</span>
                <span>Semester {semester}</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{startTime}{endTime !== 'TBA' ? ` - ${endTime}` : ''}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  <span>{day}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Room {room}</span>
                </div>
              </div>
            </div>
            
            {instructorName && (
              <div className="text-right">
                <div className="text-sm font-medium">{instructorName}</div>
                {instructorDesignation && (
                  <div className="text-xs text-gray-500">{instructorDesignation}</div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ScheduleCard
