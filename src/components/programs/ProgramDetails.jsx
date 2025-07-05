import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, Users, BookOpen, Award, GraduationCap, 
  Target, CheckCircle, X, Download 
} from 'lucide-react'
import { motion } from 'framer-motion'

const ProgramDetails = ({ program, onClose }) => {
  if (!program) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={program.level === 'Undergraduate' ? 'default' : 'secondary'}>
                {program.level}
              </Badge>
              <Badge variant="outline">{program.duration}</Badge>
            </div>
            <h2 className="text-2xl font-bold">{program.title}</h2>
            <p className="text-gray-600 mt-1">{program.shortDescription}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Program Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">{program.duration}</div>
                <div className="text-xs text-gray-500">Duration</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">{program.totalStudents}</div>
                <div className="text-xs text-gray-500">Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">{program.totalCourses}</div>
                <div className="text-xs text-gray-500">Courses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">{program.totalCredits}</div>
                <div className="text-xs text-gray-500">Credits</div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Program Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{program.description}</p>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {program.learningObjectives?.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {program.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Prospects */}
          <Card>
            <CardHeader>
              <CardTitle>Career Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.careerProspects?.map((career, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">{career.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{career.description}</p>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Avg. Salary: {career.avgSalary}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Curriculum
            </Button>
            <Button variant="outline" className="flex-1">
              Apply Now
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProgramDetails
