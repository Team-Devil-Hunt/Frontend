/*
 * Faculty Directory API Schema:
 * 
 * GET /api/faculty
 * Response: {
 *   faculty: [
 *     {
 *       id: string,
 *       name: string,
 *       designation: string,
 *       department: string,
 *       role: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer',
 *       expertise: string[],
 *       email: string,
 *       phone: string,
 *       office: string,
 *       image: string,
 *       website?: string,
 *       publications: number,
 *       experience: number,
 *       isChairman: boolean,
 *       bio: string,
 *       education: string[],
 *       courses: string[],
 *       researchInterests: string[]
 *     }
 *   ],
 *   roles: string[],
 *   expertiseAreas: string[]
 * }
 */

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, Award, BookOpen, Search } from 'lucide-react'
import FacultyCard from '../components/faculty/FacultyCard'
import FacultyFilters from '../components/faculty/FacultyFilters'
import { Badge } from '../components/ui/badge'
import axios from 'axios'
import { BaseUrl } from '../services/BaseUrl'

// Import teacher images
import palashRoyImg from '../assets/teacher/Palash_Roy.jpg'
import ashrafulAlamImg from '../assets/teacher/ashraful_alam.jpeg'
import farhanAhmedImg from '../assets/teacher/farhan_ahmed.jpg'
import hasanBabuImg from '../assets/teacher/hasan_babu.jpg'
import ismatRahmanImg from '../assets/teacher/ismat_rahman.jpeg'
import mosaddekHossainImg from '../assets/teacher/mosaddek_hossain_kamal.jpeg'
import shabbirAhmedImg from '../assets/teacher/shabbir_ahmed.jpg'
import suraiyaParvinImg from '../assets/teacher/suraiya_parvin.jpg'

// Mock API Data
const mockFacultyData = {
  faculty: [
    {
      id: 'palash-roy',
      name: 'Palash Roy',
      designation: 'Professor',
      department: 'Computer Science and Engineering',
      role: 'Professor',
      expertise: ['Machine Learning', 'Artificial Intelligence', 'Data Mining', 'Computer Vision'],
      image: palashRoyImg,
      email: 'palash.roy@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7456',
      office: 'Room 301, CSE Building',
      image: '/src/assets/teacher/Palash_Roy.jpg',
      website: 'https://example.com/palash-roy',
      publications: 85,
      experience: 15,
      rating: 4.8,
      isChairman: false,
      shortBio: 'Leading researcher in machine learning and AI.',
      bio: 'Leading researcher in machine learning and AI with over 15 years of experience.',
      education: ['PhD in Computer Science, University of Toronto', 'MSc in CSE, BUET'],
      courses: ['CSE 4108: Software Development', 'CSE 4120: Technical Writing'],
      researchInterests: ['Deep Learning', 'Natural Language Processing', 'Computer Vision']
    },
    {
      id: 'ashraful-alam',
      name: 'Ashraful Alam',
      designation: 'Associate Professor',
      department: 'Computer Science and Engineering',
      role: 'Associate Professor',
      expertise: ['Software Engineering', 'Database Systems', 'Web Technologies', 'Mobile Computing'],
      image: ashrafulAlamImg,
      email: 'ashraful.alam@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7457',
      office: 'Room 205, CSE Building',
      publications: 42,
      experience: 12,
      rating: 4.6,
      isChairman: false,
      shortBio: 'Expert in software engineering methodologies and web.',
      bio: 'Expert in software engineering methodologies and database design.',
      education: ['PhD in Software Engineering, University of Melbourne', 'MSc in CSE, DU'],
      courses: ['CSE 2108: Object Oriented Programming', 'CSE 3108: Database Management'],
      researchInterests: ['Agile Development', 'NoSQL Databases', 'Cloud Computing']
    },
    {
      id: 'farhan-ahmed',
      name: 'Farhan Ahmed',
      designation: 'Assistant Professor',
      department: 'Computer Science and Engineering',
      role: 'Assistant Professor',
      expertise: ['Networking', 'Cybersecurity', 'IoT'],
      image: farhanAhmedImg,
      email: 'farhan.ahmed@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7458',
      office: 'Room 108, CSE Building',
      publications: 28,
      experience: 8,
      rating: 4.5,
      isChairman: false,
      shortBio: 'Cybersecurity researcher focusing on blockchain and network security.',
      bio: 'Cybersecurity researcher focusing on blockchain and network security.',
      education: ['PhD in Cybersecurity, MIT', 'MSc in Computer Networks, BUET'],
      courses: ['CSE 3110: Computer Networks', 'CSE 4110: Network Security'],
      researchInterests: ['Blockchain Technology', 'IoT Security', 'Privacy Protection']
    },
    {
      id: 'hasan-babu',
      name: 'Hasan Babu',
      designation: 'Professor & Chairman',
      department: 'Computer Science and Engineering',
      role: 'Professor',
      expertise: ['Computer Architecture', 'VLSI Design', 'Embedded Systems', 'Digital Logic'],
      email: 'hasan.babu@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7459',
      office: 'Room 301, CSE Building',
      image: hasanBabuImg,
      publications: 95,
      experience: 20,
      rating: 4.9,
      isChairman: true,
      shortBio: 'Chairman and expert in computer architecture and VLSI design.',
      bio: 'Distinguished professor and chairman with expertise in computer architecture.',
      education: ['PhD in Computer Engineering, University of Tokyo', 'MSc in EEE, BUET'],
      courses: ['CSE 2104: Computer Architecture', 'CSE 4104: VLSI Design'],
      researchInterests: ['Computer Architecture', 'VLSI Design', 'Embedded Systems']
    },
    {
      id: 'ismat-rahman',
      name: 'Ismat Rahman',
      designation: 'Associate Professor',
      department: 'Computer Science and Engineering',
      role: 'Associate Professor',
      expertise: ['Computer Graphics', 'Image Processing', 'Virtual Reality', 'Game Development'],
      email: 'ismat.rahman@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7460',
      office: 'Room 302, CSE Building',
      image: ismatRahmanImg,
      publications: 67,
      experience: 14,
      rating: 4.7,
      isChairman: false,
      shortBio: 'Pioneer in computer graphics and virtual reality research.',
      bio: 'Pioneer in computer graphics and virtual reality research in Bangladesh.',
      education: ['PhD in Computer Graphics, Stanford University', 'MSc in Mathematics, DU'],
      courses: ['CSE 4108: Computer Graphics', 'CSE 4120: Game Development'],
      researchInterests: ['3D Modeling', 'Augmented Reality', 'Medical Imaging']
    },
    {
      id: 'mosaddek-hossain-kamal',
      name: 'Mosaddek Hossain Kamal',
      designation: 'Professor',
      department: 'Computer Science and Engineering',
      role: 'Professor',
      expertise: ['Algorithms', 'Data Structures', 'Computational Geometry', 'Graph Theory'],
      email: 'mosaddek.kamal@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7461',
      office: 'Room 206, CSE Building',
      image: mosaddekHossainImg,
      publications: 78,
      experience: 18,
      rating: 4.8,
      isChairman: false,
      shortBio: 'Expert in algorithms and computational geometry with extensive research.',
      bio: 'Renowned researcher in algorithms and computational geometry.',
      education: ['PhD in Computer Science, University of Waterloo', 'MSc in Mathematics, DU'],
      courses: ['CSE 2110: Data Structures', 'CSE 3110: Algorithms'],
      researchInterests: ['Algorithm Design', 'Computational Geometry', 'Graph Algorithms']
    },
    {
      id: 'shabbir-ahmed',
      name: 'Shabbir Ahmed',
      designation: 'Assistant Professor',
      department: 'Computer Science and Engineering',
      role: 'Assistant Professor',
      expertise: ['Natural Language Processing', 'Machine Learning', 'Text Mining', 'AI'],
      email: 'shabbir.ahmed@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7462',
      office: 'Room 108, CSE Building',
      image: shabbirAhmedImg,
      publications: 35,
      experience: 9,
      rating: 4.6,
      isChairman: false,
      shortBio: 'NLP researcher specializing in text mining and machine learning.',
      bio: 'Natural language processing researcher with focus on text mining.',
      education: ['PhD in Computer Science, University of Edinburgh', 'MSc in CSE, BUET'],
      courses: ['CSE 4120: Natural Language Processing', 'CSE 3120: Machine Learning'],
      researchInterests: ['NLP', 'Text Mining', 'Sentiment Analysis', 'Deep Learning']
    },
    {
      id: 'suraiya-parvin',
      name: 'Suraiya Parvin',
      designation: 'Associate Professor',
      department: 'Computer Science and Engineering',
      role: 'Associate Professor',
      expertise: ['Human-Computer Interaction', 'User Experience', 'Accessibility', 'Mobile Interfaces'],
      email: 'suraiya.parvin@cse.du.ac.bd',
      phone: '+880-2-9661900-73 Ext: 7463',
      office: 'Room 207, CSE Building',
      image: suraiyaParvinImg,
      publications: 38,
      experience: 11,
      rating: 4.7,
      isChairman: false,
      shortBio: 'HCI researcher focused on inclusive design and accessibility.',
      bio: 'HCI researcher focused on inclusive design and accessibility.',
      education: ['PhD in HCI, Carnegie Mellon University', 'MSc in Design, NID'],
      courses: ['CSE 3120: Human-Computer Interaction', 'CSE 4130: User Interface Design'],
      researchInterests: ['Inclusive Design', 'Voice Interfaces', 'Gesture Recognition']
    }
  ],
  roles: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'],
  expertiseAreas: [
    'Machine Learning', 'Artificial Intelligence', 'Data Mining', 'Computer Vision',
    'Software Engineering', 'Database Systems', 'Web Technologies', 'Mobile Computing',
    'Network Security', 'Cryptography', 'Blockchain', 'Cybersecurity',
    'Programming Languages', 'Algorithms', 'Data Structures', 'Competitive Programming',
    'Computer Graphics', 'Image Processing', 'Virtual Reality', 'Game Development',
    'Human-Computer Interaction', 'User Experience', 'Accessibility', 'Mobile Interfaces'
  ]
}

const Faculty = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all_roles')
  const [selectedExpertise, setSelectedExpertise] = useState('all_expertise')
  const [facultyData, setFacultyData] = useState({ faculty: [], roles: [], expertiseAreas: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching faculty data from API...')
        // Fetch from API using the BaseUrl
        const response = await axios.get(`${BaseUrl}/api/faculty`)
        
        if (response.data) {
          // Transform API data to match frontend structure
          const faculty = response.data.faculty || [];
          
          // Process faculty data to ensure all fields are properly formatted
          const processedFaculty = faculty.map(f => {
            // Create a slug from the name for routing
            const slug = f.slug || (f.name ? f.name.toLowerCase().replace(/\s+/g, '-') : `faculty-${Math.random().toString(36).substr(2, 9)}`);
            
            // Handle expertise parsing safely
            let expertiseArray = [];
            try {
              if (Array.isArray(f.expertise)) {
                expertiseArray = f.expertise;
              } else if (typeof f.expertise === 'string') {
                if (f.expertise.startsWith('[') && f.expertise.endsWith(']')) {
                  expertiseArray = JSON.parse(f.expertise);
                } else {
                  expertiseArray = [f.expertise];
                }
              }
            } catch (e) {
              console.error('Error parsing expertise:', e);
              expertiseArray = Array.isArray(f.expertise) ? f.expertise : 
                             (f.expertise ? [f.expertise.toString()] : []);
            }
            
            // Map the actual API response fields to what our components expect
            return {
              ...f,
              // Use proper field names and provide defaults
              designation: f.designation || 'Faculty',
              role: f.role || f.designation || 'Faculty',
              expertise: expertiseArray,
              shortBio: f.shortBio || '',
              phone: f.contact || '',
              researchInterests: f.researchInterests || [],
              isChairman: f.isChairman || false,
              publications: Number(f.publications) || 0,
              experience: Number(f.experience) || 0,
              // Ensure we have a valid ID for database reference
              id: f.id ? f.id.toString() : `faculty-${Math.random().toString(36).substr(2, 9)}`,
              // Add the slug for routing
              slug: slug,
              // Add image path if not present
              image: f.image || `/src/assets/teacher/${f.name.split(' ').pop().toLowerCase()}.jpg`
            };
          });
          
          // Calculate statistics for the stats cards
          const totalFaculty = processedFaculty.length;
          const professorCount = processedFaculty.filter(f => 
            f.designation?.toLowerCase().includes('professor') || 
            f.role?.toLowerCase().includes('professor')
          ).length;
          const totalPublications = processedFaculty.reduce((sum, f) => sum + (Number(f.publications) || 0), 0);
          const avgExperience = Math.round(
            processedFaculty.reduce((sum, f) => sum + (Number(f.experience) || 0), 0) / 
            (processedFaculty.length || 1)
          );
          
          // Add index numbers to faculty for consistent numbering in the list
          processedFaculty.forEach((f, index) => {
            f.displayIndex = index + 1;
          });
          
          setFacultyData({
            faculty: processedFaculty,
            roles: response.data.roles || [],
            expertiseAreas: response.data.expertise_areas || [],
            stats: {
              totalFaculty,
              professorCount,
              totalPublications,
              avgExperience
            }
          })
          console.log('Faculty data from API:', processedFaculty)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching faculty data:', error)
        const errorMessage = error.response ? 
          `API Error: ${error.response.status} ${error.response.statusText}` : 
          `Network Error: ${error.message}`
        
        console.log('Error details:', errorMessage)
        setError(`Failed to load faculty data: ${errorMessage}. Using local data instead.`)
        setLoading(false)
        // Fallback to mock data if API fails
        setFacultyData(mockFacultyData)
      }
    }
    
    fetchFacultyData()
  }, [])

  // Filter faculty based on search and filters
  const filteredFaculty = useMemo(() => {
    return facultyData.faculty.filter(faculty => {
      // Handle search term matching
      const matchesSearch = !searchTerm || 
        (faculty.name && faculty.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (faculty.designation && faculty.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (faculty.expertise && Array.isArray(faculty.expertise) && 
          faculty.expertise.some(exp => exp && exp.toLowerCase().includes(searchTerm.toLowerCase())))
      
      // Handle role matching - designation is used as role in the API
      const matchesRole = !selectedRole || selectedRole === 'all_roles' || faculty.designation === selectedRole
      
      // Handle expertise matching with null checks
      const matchesExpertise = !selectedExpertise || 
        selectedExpertise === 'all_expertise' || 
        (faculty.expertise && Array.isArray(faculty.expertise) && 
          faculty.expertise.includes(selectedExpertise))
      
      return matchesSearch && matchesRole && matchesExpertise
    })
  }, [facultyData.faculty, searchTerm, selectedRole, selectedExpertise])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Faculty Directory</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Meet our distinguished faculty members who are leading experts in their fields
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <span className="font-bold text-lg">{facultyData.stats?.totalFaculty || facultyData.faculty.length}</span> Faculty Members
            <div className="text-gray-600">Total Faculty</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {facultyData.stats?.professorCount || facultyData.faculty.filter(f => 
                f.designation?.toLowerCase().includes('professor') || 
                f.role?.toLowerCase().includes('professor')
              ).length}
            </div>
            <div className="text-gray-600">Professors</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {facultyData.stats?.totalPublications || facultyData.faculty.reduce((sum, f) => sum + (Number(f.publications) || 0), 0)}
            </div>
            <div className="text-gray-600">Publications</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {facultyData.stats?.avgExperience || (facultyData.faculty.length > 0 ? 
                Math.round(facultyData.faculty.reduce((sum, f) => sum + (Number(f.experience) || 0), 0) / facultyData.faculty.length) : 0)}
            </div>
            <div className="text-gray-600">Avg. Experience</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FacultyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedExpertise={selectedExpertise}
            setSelectedExpertise={setSelectedExpertise}
            roles={facultyData.roles}
            expertiseAreas={facultyData.expertiseAreas}
            totalResults={facultyData.faculty.length}
            filteredResults={filteredFaculty.length}
          />
        </motion.div>

        {/* Faculty Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : filteredFaculty.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {filteredFaculty.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No faculty found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Faculty
