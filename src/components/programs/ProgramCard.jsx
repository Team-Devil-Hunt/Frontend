import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, BookOpen, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const ProgramCard = ({ program, onViewDetails }) => {
  // Define color schemes based on program level
  const colorScheme = {
    Undergraduate: {
      headerBg: 'bg-gradient-to-r from-blue-600 to-blue-500',
      iconColor: 'text-blue-600',
      badgeVariant: 'default',
      buttonVariant: 'default',
      buttonClass: 'bg-blue-600 hover:bg-blue-700'
    },
    Graduate: {
      headerBg: 'bg-gradient-to-r from-purple-600 to-purple-500',
      iconColor: 'text-purple-600',
      badgeVariant: 'secondary',
      buttonVariant: 'secondary',
      buttonClass: 'bg-purple-600 hover:bg-purple-700'
    },
    Postgraduate: {
      headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
      iconColor: 'text-emerald-600',
      badgeVariant: 'outline',
      buttonVariant: 'outline',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
    }
  }
  
  const colors = colorScheme[program.level] || colorScheme.Undergraduate
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden border-t-4 border-t-primary">
        <div className={`${colors.headerBg} text-white p-6`}>
          <div className="flex justify-between items-start mb-3">
            <Badge variant={colors.badgeVariant} className="bg-white/20 text-white border-none">
              {program.level}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              {program.duration}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{program.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{program.shortDescription}</p>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Clock className={`w-5 h-5 mb-1 ${colors.iconColor}`} />
                <span className="text-sm font-medium">{program.duration}</span>
                <span className="text-xs text-gray-500">Duration</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Users className={`w-5 h-5 mb-1 ${colors.iconColor}`} />
                <span className="text-sm font-medium">{program.totalStudents}</span>
                <span className="text-xs text-gray-500">Students</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <BookOpen className={`w-5 h-5 mb-1 ${colors.iconColor}`} />
                <span className="text-sm font-medium">{program.totalCourses}</span>
                <span className="text-xs text-gray-500">Courses</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Award className={`w-5 h-5 mb-1 ${colors.iconColor}`} />
                <span className="text-sm font-medium">{program.totalCredits}</span>
                <span className="text-xs text-gray-500">Credits</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium text-sm mb-2">Specializations:</h4>
              <div className="flex flex-wrap gap-1">
                {program.specializations.slice(0, 3).map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs hover:bg-gray-100">
                    {spec}
                  </Badge>
                ))}
                {program.specializations.length > 3 && (
                  <Badge variant="outline" className="text-xs hover:bg-gray-100">
                    +{program.specializations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              onClick={() => onViewDetails(program)}
              className={`w-full mt-2 text-white ${colors.buttonClass}`}
              variant={colors.buttonVariant}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProgramCard
