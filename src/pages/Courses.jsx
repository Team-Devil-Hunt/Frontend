/*
API Schema:

GET /api/courses
Response:
{
  "courses": [
    {
      "id": "string",
      "courseCode": "string",
      "title": "string",
      "description": "string",
      "credits": number,
      "department": "string",
      "level": "string", // "Undergraduate" or "Graduate"
      "semester": number,
      "prerequisites": ["string"],
      "instructors": ["string"],
      "syllabus": "string",
      "tags": ["string"]
    }
  ],
  "departments": ["string"],
  "levels": ["string"],
  "semesters": [number]
}
*/

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RefreshCw, AlertTriangle, BookOpen, Grid, List } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// Real API service
const Api = {
  get: async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Include credentials if your API requires authentication
        // credentials: 'include',
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API fetch error:', error)
      throw error
    }
  }
}

const Courses = () => {
  // State for courses data
  const [coursesData, setCoursesData] = useState({
    courses: [],
    departments: [],
    levels: [],
    semesters: []
  })
  
  // State for loading, error, filters, and view mode
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    department: 'all_departments',
    level: 'all_levels',
    semester: 'all_semesters',
    tag: ''
  })
  const [viewMode, setViewMode] = useState('grid')
  const [expandedCourse, setExpandedCourse] = useState(null)

  // Fetch courses data from API
  const fetchCoursesData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the proxy configured in vite.config.js
      const response = await Api.get('/api/courses')
      
      // Transform the data to match the expected structure
      const transformedData = {
        courses: response.data.courses.map(course => ({
          id: course.id,
          courseCode: course.code,
          title: course.title,
          description: course.description,
          credits: course.credits,
          department: course.specialization || 'Computer Science',
          level: course.year <= 4 ? 'Undergraduate' : 'Graduate',
          semester: course.semester,
          prerequisites: Array.isArray(course.prerequisites) ? 
            course.prerequisites.map(p => {
              try {
                return JSON.parse(p)[0];
              } catch (e) {
                return p;
              }
            }) : [],
          instructors: [],
          syllabus: '',
          tags: [course.specialization || 'Core', course.difficulty || '']
            .filter(tag => tag !== '')
        })),
        departments: [...new Set(response.data.courses.map(c => c.specialization || 'Computer Science'))],
        levels: ['Undergraduate', 'Graduate'],
        semesters: [...new Set(response.data.courses.map(c => c.semester))].sort((a, b) => a - b)
      }
      
      setCoursesData(transformedData)
    } catch (err) {
      console.error('Error fetching courses data:', err)
      setError(err.message || 'Failed to fetch courses data')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch courses data on component mount
  useEffect(() => {
    fetchCoursesData()
  }, [])
  
  // Filter courses based on search and filter criteria
  const filteredCourses = coursesData.courses?.filter(course => {
    // Search filter
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !course.courseCode.toLowerCase().includes(filters.search.toLowerCase()) &&
        !course.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Department filter
    if (filters.department !== 'all_departments' && filters.department && course.department !== filters.department) {
      return false
    }
    
    // Level filter
    if (filters.level !== 'all_levels' && filters.level && course.level !== filters.level) {
      return false
    }
    
    // Semester filter
    if (filters.semester !== 'all_semesters' && filters.semester && course.semester !== parseInt(filters.semester)) {
      return false
    }
    
    // Tag filter
    if (filters.tag && !course.tags.includes(filters.tag)) {
      return false
    }
    
    return true
  }) || []
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    // Keep the special values as is, they'll be handled in the filtering logic
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      department: 'all_departments',
      level: 'all_levels',
      semester: 'all_semesters',
      tag: ''
    })
  }
  
  // Count active filters - exclude special placeholder values
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (!value) return false;
    if (key === 'department' && value === 'all_departments') return false;
    if (key === 'level' && value === 'all_levels') return false;
    if (key === 'semester' && value === 'all_semesters') return false;
    return true;
  }).length

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Courses
          </h1>
        </motion.div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}
        
        {/* Error state */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 p-6 rounded-lg shadow-sm mb-8"
          >
            <div className="flex items-center text-red-600 mb-3">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="font-semibold text-lg">Error Loading Courses</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={fetchCoursesData} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          </motion.div>
        )}
        
        {/* Content when data is loaded */}
        {!loading && !error && (
          <div>
            {/* Filters */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Filter size={20} />
                  Course Filters
                </h2>
                
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Search filter */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Department filter */}
                <Select
                  value={filters.department}
                  onValueChange={(value) => handleFilterChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_departments">All Departments</SelectItem>
                    {coursesData.departments?.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Level filter */}
                <Select
                  value={filters.level}
                  onValueChange={(value) => handleFilterChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                    {coursesData.levels?.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Semester filter */}
                <Select
                  value={filters.semester.toString()}
                  onValueChange={(value) => handleFilterChange('semester', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_semesters">All Semesters</SelectItem>
                    {coursesData.semesters?.map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Active filters display */}
              {activeFiltersCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between mt-4 p-3 bg-blue-50 text-blue-800 rounded-md"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="font-medium">Active Filters:</span>
                    {filters.search && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {filters.search}
                      </Badge>
                    )}
                    {filters.department && filters.department !== 'all_departments' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Department: {filters.department}
                      </Badge>
                    )}
                    {filters.level && filters.level !== 'all_levels' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Level: {filters.level}
                      </Badge>
                    )}
                    {filters.semester && filters.semester !== 'all_semesters' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Semester: {filters.semester}
                      </Badge>
                    )}
                    {filters.tag && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Tag: {filters.tag}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Empty state */}
            {filteredCourses.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-8 rounded-lg shadow-sm text-center"
              >
                <div className="flex flex-col items-center justify-center py-8">
                  <BookOpen size={48} className="text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    No courses match your current filters. Try adjusting your search criteria or clear all filters to see all courses.
                  </p>
                  <Button onClick={clearFilters} className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Course display with view mode toggle */}
            {filteredCourses.length > 0 && (
              <div>
                <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Found
                    </h2>
                    
                    <TabsList className="grid w-[180px] grid-cols-2">
                      <TabsTrigger value="grid" className="flex items-center gap-2">
                        <Grid size={16} />
                        Grid
                      </TabsTrigger>
                      <TabsTrigger value="list" className="flex items-center gap-2">
                        <List size={16} />
                        List
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* Grid View */}
                  <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                          <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                              <span>{course.title}</span>
                              <Badge variant="outline" className="ml-2 shrink-0">
                                {course.courseCode}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {course.department} • {course.level} • Semester {course.semester}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-gray-600 line-clamp-3">{course.description}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              {course.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-blue-100"
                                  onClick={() => handleFilterChange('tag', tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-sm text-gray-600">{course.credits} Credits</div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                            >
                              View Details
                            </Button>
                          </CardFooter>
                          
                          {/* Expanded details */}
                          {expandedCourse === course.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-6 pb-6 border-t pt-4"
                            >
                              <h4 className="font-semibold mb-2">Course Details</h4>
                              
                              <div className="space-y-3 text-sm">
                                <div>
                                  <span className="font-medium">Instructors:</span> {course.instructors.join(', ')}
                                </div>
                                
                                {course.prerequisites.length > 0 && (
                                  <div>
                                    <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
                                  </div>
                                )}
                                
                                <div>
                                  <span className="font-medium">Syllabus:</span>
                                  <p className="mt-1 text-gray-600">{course.syllabus}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* List View */}
                <TabsContent value="list" className="mt-0">
                  <div className="space-y-4">
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Accordion 
                          type="single" 
                          collapsible
                          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <AccordionItem value={course.id} className="border-none">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{course.title}</span>
                                    <Badge variant="outline">{course.courseCode}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {course.department} • {course.level} • Semester {course.semester}
                                  </p>
                                </div>
                                <div className="mt-2 sm:mt-0 text-sm text-gray-600">{course.credits} Credits</div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Description</h4>
                                  <p className="text-gray-600">{course.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Instructors</h4>
                                    <p className="text-gray-600">{course.instructors.join(', ')}</p>
                                  </div>
                                  
                                  {course.prerequisites.length > 0 && (
                                    <div>
                                      <h4 className="font-medium mb-2">Prerequisites</h4>
                                      <p className="text-gray-600">{course.prerequisites.join(', ')}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Syllabus</h4>
                                  <p className="text-gray-600">{course.syllabus}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Tags</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {course.tags.map((tag) => (
                                      <Badge 
                                        key={tag} 
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-blue-100"
                                        onClick={() => handleFilterChange('tag', tag)}
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Courses
