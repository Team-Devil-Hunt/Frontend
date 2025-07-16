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
      headerBg: 'bg-blue-500',
      iconColor: 'text-blue-400',
      badgeVariant: 'default',
      buttonVariant: 'default',
      buttonClass: 'bg-blue-500 hover:bg-blue-600',
      borderColor: 'border-t-blue-400',
      badgeBg: 'bg-blue-50/90 text-blue-700',
      durationBadge: 'bg-blue-50/70 text-blue-700 border-blue-100',
      hoverShadow: 'hover:shadow-blue-100'
    },
    Graduate: {
      headerBg: 'bg-purple-500',
      iconColor: 'text-purple-400',
      badgeVariant: 'secondary',
      buttonVariant: 'secondary',
      buttonClass: 'bg-purple-500 hover:bg-purple-600',
      borderColor: 'border-t-purple-400',
      badgeBg: 'bg-purple-50/90 text-purple-700',
      durationBadge: 'bg-purple-50/70 text-purple-700 border-purple-100',
      hoverShadow: 'hover:shadow-purple-100'
    },
    Postgraduate: {
      headerBg: 'bg-emerald-500',
      iconColor: 'text-emerald-400',
      badgeVariant: 'outline',
      buttonVariant: 'outline',
      buttonClass: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500',
      borderColor: 'border-t-emerald-400',
      badgeBg: 'bg-emerald-50/90 text-emerald-700',
      durationBadge: 'bg-emerald-50/70 text-emerald-700 border-emerald-100',
      hoverShadow: 'hover:shadow-emerald-100'
    }
  }
  
  const colors = colorScheme[program.level] || colorScheme.Undergraduate
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`h-full transition-all duration-300 overflow-hidden border-t-4 ${colors.borderColor} ${colors.hoverShadow} hover:shadow-md`}>
        <div className={`${colors.headerBg} text-white p-6`}>
          <div className="flex justify-between items-start mb-3">
            <Badge className={`${colors.badgeBg} border-none font-medium`}>
              {program.level}
            </Badge>
            <Badge className={`${colors.durationBadge} border font-medium`}>
              {program.duration}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{program.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{program.shortDescription}</p>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-3 bg-gray-50/70 rounded-lg border border-gray-100 hover:shadow-sm hover:bg-white/80 transition-all">
                <Clock className={`w-5 h-5 mb-1.5 ${colors.iconColor}`} />
                <span className="text-sm font-medium text-gray-800">{program.duration}</span>
                <span className="text-xs text-gray-500 mt-0.5">Duration</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50/70 rounded-lg border border-gray-100 hover:shadow-sm hover:bg-white/80 transition-all">
                <Users className={`w-5 h-5 mb-1.5 ${colors.iconColor}`} />
                <span className="text-sm font-medium text-gray-800">{program.totalStudents}</span>
                <span className="text-xs text-gray-500 mt-0.5">Students</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50/70 rounded-lg border border-gray-100 hover:shadow-sm hover:bg-white/80 transition-all">
                <BookOpen className={`w-5 h-5 mb-1.5 ${colors.iconColor}`} />
                <span className="text-sm font-medium text-gray-800">{program.totalCourses}</span>
                <span className="text-xs text-gray-500 mt-0.5">Courses</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50/70 rounded-lg border border-gray-100 hover:shadow-sm hover:bg-white/80 transition-all">
                <Award className={`w-5 h-5 mb-1.5 ${colors.iconColor}`} />
                <span className="text-sm font-medium text-gray-800">{program.totalCredits}</span>
                <span className="text-xs text-gray-500 mt-0.5">Credits</span>
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
