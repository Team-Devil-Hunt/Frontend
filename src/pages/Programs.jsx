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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProgramCard from '@/components/programs/ProgramCard'
import CourseCard from '@/components/programs/CourseCard'
import ProgramFilters from '@/components/programs/ProgramFilters'
import ProgramDetails from '@/components/programs/ProgramDetails'

// Mock API Data
const mockPrograms = [
  {
    id: 'bsc-cse',
    title: 'Bachelor of Science in Computer Science and Engineering',
    level: 'Undergraduate',
    duration: '4 Years',
    totalStudents: 480,
    totalCourses: 48,
    totalCredits: 144,
    shortDescription: 'Comprehensive undergraduate program covering all aspects of computer science and engineering.',
    description: 'Our BSc in Computer Science and Engineering program provides a solid foundation in computer science theory, software engineering practices, and emerging technologies. Students gain hands-on experience through projects, internships, and research opportunities.',
    specializations: ['Software Engineering', 'Data Science', 'Cybersecurity', 'AI & Machine Learning', 'Web Development', 'Software Engineering'],
    learningObjectives: [
      'Master fundamental concepts of computer science and programming',
      'Develop software engineering and project management skills',
      'Understand data structures, algorithms, and computational complexity',
      'Gain expertise in database systems and web technologies',
      'Learn cybersecurity principles and network administration'
    ],
    careerProspects: [
      { title: 'Software Engineer', description: 'Design and develop software applications', avgSalary: '৳8-15 LPA' },
      { title: 'Data Scientist', description: 'Analyze complex data to drive business decisions', avgSalary: '৳10-20 LPA' },
      { title: 'Cybersecurity Analyst', description: 'Protect organizations from cyber threats', avgSalary: '৳12-18 LPA' },
      { title: 'Full Stack Developer', description: 'Build complete web applications', avgSalary: '৳9-16 LPA' }
    ]
  },
  {
    id: 'msc-cse',
    title: 'Master of Science in Computer Science and Engineering',
    level: 'Graduate',
    duration: '2 Years',
    totalStudents: 120,
    totalCourses: 24,
    totalCredits: 48,
    shortDescription: 'Advanced graduate program focusing on research and specialized areas of computer science.',
    description: 'The MSc program is designed for students who want to deepen their knowledge in specific areas of computer science. The program emphasizes research methodology, advanced algorithms, and cutting-edge technologies.',
    specializations: ['Machine Learning', 'Computer Vision', 'Natural Language Processing', 'Distributed Systems', 'Quantum Computing'],
    learningObjectives: [
      'Conduct independent research in chosen specialization',
      'Master advanced algorithms and computational techniques',
      'Develop expertise in machine learning and AI technologies',
      'Understand research methodology and academic writing',
      'Contribute to the advancement of computer science knowledge'
    ],
    careerProspects: [
      { title: 'Research Scientist', description: 'Lead research projects in academia or industry', avgSalary: '৳15-25 LPA' },
      { title: 'ML Engineer', description: 'Develop and deploy machine learning models', avgSalary: '৳18-30 LPA' },
      { title: 'Technical Lead', description: 'Lead technical teams and architecture decisions', avgSalary: '৳20-35 LPA' },
      { title: 'Data Architect', description: 'Design large-scale data processing systems', avgSalary: '৳16-28 LPA' }
    ]
  },
  {
    id: 'phd-cse',
    title: 'Doctor of Philosophy in Computer Science and Engineering',
    level: 'Postgraduate',
    duration: '3-5 Years',
    totalStudents: 45,
    totalCourses: 12,
    totalCredits: 36,
    shortDescription: 'Doctoral program for advanced research in computer science and engineering.',
    description: 'The PhD program prepares students for careers in research and academia. Students work closely with faculty advisors to conduct original research and contribute new knowledge to the field.',
    specializations: ['Artificial Intelligence', 'Computer Systems', 'Theoretical Computer Science', 'Human-Computer Interaction', 'Bioinformatics'],
    learningObjectives: [
      'Conduct original research contributing to scientific knowledge',
      'Develop expertise in advanced research methodologies',
      'Master theoretical foundations of computer science',
      'Publish research findings in top-tier conferences and journals',
      'Prepare for academic and research leadership roles'
    ],
    careerProspects: [
      { title: 'University Professor', description: 'Teach and conduct research at universities', avgSalary: '৳12-25 LPA' },
      { title: 'Principal Scientist', description: 'Lead research initiatives in industry', avgSalary: '৳25-50 LPA' },
      { title: 'Research Director', description: 'Oversee research programs and strategy', avgSalary: '৳30-60 LPA' },
      { title: 'CTO/Technical Advisor', description: 'Provide technical leadership and vision', avgSalary: '৳40-80 LPA' }
    ]
  }
]

const mockCourses = [
  {
    id: 'cse-1101',
    code: 'CSE 1101',
    title: 'Introduction to Programming',
    description: 'Fundamental concepts of programming using C language. Covers variables, control structures, functions, arrays, and basic algorithms.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Beginner',
    rating: 4.5,
    enrolledStudents: 120,
    prerequisites: [],
    specialization: 'Software Engineering',
    semester: 1,
    year: 1
  },
  {
    id: 'cse-2110',
    code: 'CSE 2110',
    title: 'Data Structures',
    description: 'Study of fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Implementation and analysis of algorithms.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Intermediate',
    rating: 4.3,
    enrolledStudents: 95,
    prerequisites: ['CSE 1101', 'CSE 1102'],
    specialization: 'Software Engineering',
    semester: 1,
    year: 2
  },
  {
    id: 'cse-3110',
    code: 'CSE 3110',
    title: 'Algorithms',
    description: 'Design and analysis of algorithms. Topics include sorting, searching, graph algorithms, dynamic programming, and complexity analysis.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Advanced',
    rating: 4.7,
    enrolledStudents: 88,
    prerequisites: ['CSE 2110', 'MATH 2107'],
    specialization: 'Software Engineering',
    semester: 1,
    year: 3
  },
  {
    id: 'cse-4120',
    code: 'CSE 4120',
    title: 'Machine Learning',
    description: 'Introduction to machine learning algorithms and techniques. Covers supervised and unsupervised learning, neural networks, and deep learning.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Advanced',
    rating: 4.8,
    enrolledStudents: 75,
    prerequisites: ['CSE 3110', 'MATH 3107', 'STAT 2101'],
    specialization: 'AI & Machine Learning',
    semester: 2,
    year: 4
  },
  {
    id: 'cse-3108',
    code: 'CSE 3108',
    title: 'Database Management Systems',
    description: 'Principles of database design, SQL, normalization, transaction processing, and database administration.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Intermediate',
    rating: 4.4,
    enrolledStudents: 92,
    prerequisites: ['CSE 2110'],
    specialization: 'Database Systems',
    semester: 2,
    year: 3
  },
  {
    id: 'cse-4108',
    code: 'CSE 4108',
    title: 'Computer Graphics',
    description: 'Fundamentals of computer graphics including 2D/3D transformations, rendering, animation, and graphics programming.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Advanced',
    rating: 4.6,
    enrolledStudents: 68,
    prerequisites: ['CSE 2110', 'MATH 2108'],
    specialization: 'Computer Graphics',
    semester: 2,
    year: 4
  },
  {
    id: 'cse-3120',
    code: 'CSE 3120',
    title: 'Computer Networks',
    description: 'Network protocols, TCP/IP, network security, wireless networks, and network programming.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Intermediate',
    rating: 4.2,
    enrolledStudents: 85,
    prerequisites: ['CSE 2104'],
    specialization: 'Computer Networks',
    semester: 2,
    year: 3
  },
  {
    id: 'cse-4130',
    code: 'CSE 4130',
    title: 'Cybersecurity',
    description: 'Information security principles, cryptography, network security, ethical hacking, and security management.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Advanced',
    rating: 4.9,
    enrolledStudents: 72,
    prerequisites: ['CSE 3120', 'CSE 3108'],
    specialization: 'Cybersecurity',
    semester: 1,
    year: 4
  },
  {
    id: 'cse-2108',
    code: 'CSE 2108',
    title: 'Web Programming',
    description: 'Client-side and server-side web development using HTML, CSS, JavaScript, and modern frameworks.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Intermediate',
    rating: 4.5,
    enrolledStudents: 110,
    prerequisites: ['CSE 1101'],
    specialization: 'Web Development',
    semester: 2,
    year: 2
  },
  {
    id: 'cse-4140',
    code: 'CSE 4140',
    title: 'Mobile App Development',
    description: 'Development of mobile applications for Android and iOS platforms using native and cross-platform technologies.',
    credits: 3,
    duration: '1 Semester',
    difficulty: 'Advanced',
    rating: 4.7,
    enrolledStudents: 65,
    prerequisites: ['CSE 2108', 'CSE 2110'],
    specialization: 'Mobile Development',
    semester: 2,
    year: 4
  }
]

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [activeTab, setActiveTab] = useState('programs')

  // Filter programs
  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = selectedLevel === 'All' || program.level === selectedLevel
      const matchesSpecialization = selectedSpecialization === 'All' || 
                                   program.specializations.some(spec => spec.includes(selectedSpecialization))
      
      return matchesSearch && matchesLevel && matchesSpecialization
    })
  }, [searchTerm, selectedLevel, selectedSpecialization])

  // Filter courses
  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialization = selectedSpecialization === 'All' || 
                                   course.specialization.includes(selectedSpecialization)
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty
      
      return matchesSearch && matchesSpecialization && matchesDifficulty
    })
  }, [searchTerm, selectedSpecialization, selectedDifficulty])

  // Count active filters
  const activeFilters = useMemo(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedLevel !== 'All') count++
    if (selectedSpecialization !== 'All') count++
    if (selectedDifficulty !== 'All') count++
    return count
  }, [searchTerm, selectedLevel, selectedSpecialization, selectedDifficulty])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLevel('All')
    setSelectedSpecialization('All')
    setSelectedDifficulty('All')
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
          activeFilters={activeFilters}
          clearFilters={clearFilters}
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
                    onViewDetails={setSelectedProgram}
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
