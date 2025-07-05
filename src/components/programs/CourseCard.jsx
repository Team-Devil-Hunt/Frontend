import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const CourseCard = ({ course }) => {
  // Define color schemes based on course difficulty
  const colorScheme = {
    Beginner: {
      headerBg: 'bg-gradient-to-r from-green-600 to-green-500',
      iconColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-800 hover:bg-green-200',
      badgeVariant: 'default'
    },
    Intermediate: {
      headerBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      iconColor: 'text-orange-600',
      badgeColor: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      badgeVariant: 'secondary'
    },
    Advanced: {
      headerBg: 'bg-gradient-to-r from-red-600 to-rose-500',
      iconColor: 'text-red-600',
      badgeColor: 'bg-red-100 text-red-800 hover:bg-red-200',
      badgeVariant: 'destructive'
    }
  }
  
  const colors = colorScheme[course.difficulty] || colorScheme.Intermediate
  
  // Calculate semester display
  const semesterDisplay = `Year ${course.year}, Semester ${course.semester}`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4" style={{ borderLeftColor: course.difficulty === 'Beginner' ? '#16a34a' : course.difficulty === 'Intermediate' ? '#f97316' : '#dc2626' }}>
        <div className={`${colors.headerBg} text-white p-4`}>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              {course.code}
            </Badge>
            <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-white">{course.rating}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold leading-tight mb-1">{course.title}</h3>
          <p className="text-xs text-white/80">{semesterDisplay}</p>
        </div>
        
        <CardContent className="p-4">
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {course.description}
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <BookOpen className={`w-4 h-4 mb-1 ${colors.iconColor}`} />
              <span className="text-sm font-medium">{course.credits}</span>
              <span className="text-xs text-gray-500">Credits</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Users className={`w-4 h-4 mb-1 ${colors.iconColor}`} />
              <span className="text-sm font-medium">{course.enrolledStudents}</span>
              <span className="text-xs text-gray-500">Students</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-700">Difficulty</span>
            <Badge 
              variant={colors.badgeVariant}
              className={`text-xs ${colors.badgeColor}`}
            >
              {course.difficulty}
            </Badge>
          </div>
          
          <div>
            <span className="text-xs font-medium text-gray-700 block mb-1">Specialization:</span>
            <Badge className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800">
              {course.specialization}
            </Badge>
          </div>
          
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-700 block mb-1">Prerequisites:</span>
              <div className="flex flex-wrap gap-1">
                {course.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="outline" className="text-xs hover:bg-gray-100">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CourseCard
