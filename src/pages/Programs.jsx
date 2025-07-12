/*
API Schema for Programs Page:

1. GET /api/programs
   Response: {
     programs: [
       {
         id: string,
         title: string,
         level: 'Undergraduate' | 'Graduate' | 'Postgraduate',
         duration: string,
         totalStudents: number,
         totalCourses: number,
         totalCredits: number,
         shortDescription: string,
         description: string,
         specializations: string[],
         learningObjectives: string[],
         careerProspects: [{
           title: string,
           description: string,
           avgSalary: string
         }]
       }
     ]
   }

2. GET /api/courses
   Response: {
     courses: [
       {
         id: string,
         code: string,
         title: string,
         description: string,
         credits: number,
         duration: string,
         difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
         rating: number,
         enrolledStudents: number,
         prerequisites: string[],
         specialization: string,
         semester: number,
         year: number
       }
     ]
   }
*/

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import ProgramCard from '../components/programs/ProgramCard'
import CourseCard from '../components/programs/CourseCard'
import ProgramFilters from '../components/programs/ProgramFilters'
import ProgramDetails from '../components/programs/ProgramDetails'

import Api from '../constant/Api'

const Programs = () => {
  const [activeTab, setActiveTab] = useState('programs')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  
  const [programsData, setProgramsData] = useState([])  
  const [coursesData, setCoursesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        setLoading(true)
        const response = await Api.get('api/programs')
        setProgramsData(response.data.programs)
        console.log('Programs data:', response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching programs data:', error)
        setError('Failed to load programs data. Please try again later.')
        setLoading(false)
      }
    }
    
    const fetchCoursesData = async () => {
      try {
        const response = await Api.get('api/courses')
        setCoursesData(response.data.courses)
        console.log('Courses data:', response.data)
      } catch (error) {
        console.error('Error fetching courses data:', error)
      }
    }
    
    fetchProgramsData()
    fetchCoursesData()
  }, [])

  // Filter programs based on search and filters
  const filteredPrograms = useMemo(() => {
    return programsData.filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = selectedLevel === '' || program.level === selectedLevel
      const matchesSpecialization = selectedSpecialization === '' || 
                                   program.specializations.some(spec => spec.includes(selectedSpecialization))
      
      return matchesSearch && matchesLevel && matchesSpecialization
    })
  }, [searchTerm, selectedLevel, selectedSpecialization, programsData])

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return coursesData.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialization = selectedSpecialization === '' || 
                                   course.specialization.includes(selectedSpecialization)
      const matchesDifficulty = selectedDifficulty === '' || course.difficulty === selectedDifficulty
      const matchesYear = selectedYear === '' || course.year.toString() === selectedYear
      
      return matchesSearch && matchesSpecialization && matchesDifficulty && matchesYear
    })
  }, [searchTerm, selectedSpecialization, selectedDifficulty, selectedYear, coursesData])

  // Count active filters
  const activeFilters = useMemo(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedLevel !== '') count++
    if (selectedSpecialization !== '') count++
    if (selectedDifficulty !== '') count++
    if (selectedYear !== '') count++
    return count
  }, [searchTerm, selectedLevel, selectedSpecialization, selectedDifficulty, selectedYear])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLevel('')
    setSelectedSpecialization('')
    setSelectedDifficulty('')
    setSelectedYear('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Academic Programs
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore our comprehensive degree programs and courses designed to prepare you for success in the digital age
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : (
          <>
            {/* Filters */}
            <ProgramFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={setSelectedSpecialization}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              activeFilters={activeFilters}
              clearFilters={clearFilters}
              programsData={programsData}
              coursesData={coursesData}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="programs">Degree Programs ({filteredPrograms.length})</TabsTrigger>
                <TabsTrigger value="courses">Courses ({filteredCourses.length})</TabsTrigger>
              </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProgramCard
                    program={program}
                    onViewDetails={() => console.log('View details')}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {filteredPrograms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No programs found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
            
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <ProgramDetails
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  )
}

export default Programs
