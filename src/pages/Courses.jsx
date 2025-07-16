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
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
                        <Card className="h-full flex flex-col overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-100 group relative">
                          {/* Deep blue left border */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-blue-800"></div>
                          <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 p-6 pb-4 pl-8">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors">
                                {course.title}
                              </CardTitle>
                              <Badge className="bg-white text-blue-700 hover:bg-blue-50 transition-colors font-medium border border-blue-200 shadow-sm">
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                {course.courseCode}
                              </Badge>
                            </div>
                            <CardDescription className="text-blue-700/90 mt-1">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600/80" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                  </svg>
                                  {course.department}
                                </span>
                                <span className="text-blue-400/70">•</span>
                                <span>{course.level}</span>
                                <span className="text-blue-400/70">•</span>
                                <span>Semester {course.semester}</span>
                              </div>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow p-6">
                            <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                              {course.description}
                            </p>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              {course.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-200 border border-gray-200 shadow-sm"
                                  onClick={() => handleFilterChange('tag', tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center border-t border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center text-sm font-medium text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                              </svg>
                              {course.credits} Credits
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                            >
                              {expandedCourse === course.id ? 'Hide Details' : 'View Details'}
                            </Button>
                          </CardFooter>
                          
                          {/* Expanded details */}
                          {expandedCourse === course.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-6 pb-6 border-t border-gray-100 bg-gray-50"
                            >
                              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Course Details</h4>
                              
                              <div className="space-y-4 text-sm">
                                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                  <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                      <h5 className="font-medium text-gray-700 mb-1">Instructors</h5>
                                      <p className="text-gray-600">{course.instructors.join(', ') || 'Not specified'}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {course.prerequisites.length > 0 && (
                                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-start">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                      <div>
                                        <h5 className="font-medium text-gray-700 mb-1">Prerequisites</h5>
                                        <div className="flex flex-wrap gap-1.5">
                                          {course.prerequisites.map((prereq, idx) => (
                                            <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                              {prereq}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                  <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0014.5 14c-1.669 0-3.218.51-4.5 1.385V4.804z" />
                                    </svg>
                                    <div>
                                      <h5 className="font-medium text-gray-700 mb-2">Syllabus</h5>
                                      <p className="text-gray-600 leading-relaxed">
                                        {course.syllabus || 'No syllabus available.'}
                                      </p>
                                    </div>
                                  </div>
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
                          className="bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-100 relative overflow-hidden"
                        >
                          {/* Blue accent border */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-blue-800"></div>
                          <AccordionItem value={course.id} className="border-none">
                            <AccordionTrigger className="px-6 py-5 hover:no-underline pl-8">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900">{course.title}</span>
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                                      <BookOpen className="h-3 w-3 mr-1.5" />
                                      {course.courseCode}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mt-1.5">
                                    <span className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                      </svg>
                                      {course.department}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span>{course.level}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>Semester {course.semester}</span>
                                  </div>
                                </div>
                                <div className="mt-2 sm:mt-0 text-sm text-gray-600">{course.credits} Credits</div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-2 bg-gray-50">
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
