/*
 * Faculty Profile API Schema:
 * 
 * GET /api/faculty/:id
 * Response: {
 *   faculty: {
 *     id: string,
 *     name: string,
 *     designation: string,
 *     department: string,
 *     role: string,
 *     expertise: string[],
 *     email: string,
 *     phone: string,
 *     office: string,
 *     image: string,
 *     website?: string,
 *     publications: number,
 *     experience: number,
 *     rating: number,
 *     isChairman: boolean,
 *     bio: string,
 *     shortBio: string,
 *     education: string[],
 *     courses: string[],
 *     researchInterests: string[],
 *     recentPublications: [
 *       {
 *         title: string,
 *         journal: string,
 *         year: number,
 *         doi?: string
 *       }
 *     ],
 *     awards: string[],
 *     officeHours: string
 *   }
 * }
 */

import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Clock,
  Users,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

// Mock faculty data with comprehensive details for all faculty members
const mockFacultyData = {
  'palash-roy': {
    id: 'palash-roy',
    name: 'Palash Roy',
    designation: 'Professor',
    department: 'Computer Science and Engineering',
    role: 'Professor',
    expertise: ['Machine Learning', 'Artificial Intelligence', 'Data Mining', 'Computer Vision'],
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
    bio: 'Dr. Palash Roy is a distinguished Professor in the Department of Computer Science and Engineering at the University of Dhaka. With over 15 years of experience in academia and research, he has established himself as a leading expert in machine learning, artificial intelligence, and data mining. His research focuses on developing innovative algorithms for complex data analysis and computer vision applications.',
    education: [
      'PhD in Computer Science, University of Toronto, Canada (2008)',
      'MSc in Computer Science and Engineering, BUET (2003)',
      'BSc in Computer Science and Engineering, BUET (2001)'
    ],
    courses: [
      'CSE 4108: Software Development',
      'CSE 4120: Technical Writing',
      'CSE 3120: Machine Learning',
      'CSE 4130: Artificial Intelligence'
    ],
    researchInterests: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Mining'],
    recentPublications: [
      {
        title: 'Advanced Deep Learning Techniques for Image Recognition',
        journal: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
        year: 2023,
        doi: '10.1109/TPAMI.2023.1234567'
      },
      {
        title: 'Machine Learning Approaches for Big Data Analytics',
        journal: 'ACM Computing Surveys',
        year: 2022,
        doi: '10.1145/3456789.3456790'
      },
      {
        title: 'Neural Networks for Natural Language Processing',
        journal: 'Journal of Machine Learning Research',
        year: 2022
      }
    ],
    awards: [
      'Best Paper Award, International Conference on Machine Learning (2023)',
      'Excellence in Teaching Award, University of Dhaka (2021)',
      'Young Researcher Award, Bangladesh Computer Society (2019)'
    ],
    officeHours: 'Sunday-Thursday: 2:00 PM - 4:00 PM'
  },
  'ashraful-alam': {
    id: 'ashraful-alam',
    name: 'Ashraful Alam',
    designation: 'Associate Professor',
    department: 'Computer Science and Engineering',
    role: 'Associate Professor',
    expertise: ['Software Engineering', 'Database Systems', 'Web Technologies', 'Mobile Computing'],
    email: 'ashraful.alam@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7457',
    office: 'Room 205, CSE Building',
    image: '/src/assets/teacher/ashraful_alam.jpeg',
    publications: 42,
    experience: 12,
    rating: 4.6,
    isChairman: false,
    shortBio: 'Expert in software engineering methodologies and web.',
    bio: 'Dr. Ashraful Alam is an Associate Professor specializing in software engineering methodologies and database design. With 12 years of experience, he has contributed significantly to web technologies and mobile computing research. His work focuses on developing scalable software solutions and modern database architectures.',
    education: [
      'PhD in Software Engineering, University of Melbourne, Australia (2011)',
      'MSc in Computer Science and Engineering, University of Dhaka (2008)',
      'BSc in Computer Science and Engineering, BUET (2006)'
    ],
    courses: [
      'CSE 2108: Object Oriented Programming',
      'CSE 3108: Database Management',
      'CSE 4108: Software Engineering',
      'CSE 4118: Web Technologies'
    ],
    researchInterests: ['Agile Development', 'NoSQL Databases', 'Cloud Computing', 'Mobile App Development'],
    recentPublications: [
      {
        title: 'Scalable Database Design for Modern Web Applications',
        journal: 'ACM Transactions on Database Systems',
        year: 2023,
        doi: '10.1145/3456789.3456791'
      },
      {
        title: 'Agile Methodologies in Software Development',
        journal: 'IEEE Software',
        year: 2022
      },
      {
        title: 'NoSQL Database Performance Optimization',
        journal: 'Journal of Systems and Software',
        year: 2022
      }
    ],
    awards: [
      'Best Software Engineering Paper Award, ICSE (2022)',
      'Outstanding Teaching Award, University of Dhaka (2020)',
      'Innovation in Database Design Award (2019)'
    ],
    officeHours: 'Sunday-Thursday: 10:00 AM - 12:00 PM'
  },
  'farhan-ahmed': {
    id: 'farhan-ahmed',
    name: 'Farhan Ahmed',
    designation: 'Assistant Professor',
    department: 'Computer Science and Engineering',
    role: 'Assistant Professor',
    expertise: ['Network Security', 'Cryptography', 'Blockchain', 'Cybersecurity'],
    email: 'farhan.ahmed@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7458',
    office: 'Room 108, CSE Building',
    image: '/src/assets/teacher/farhan_ahmed.jpg',
    publications: 28,
    experience: 8,
    rating: 4.5,
    isChairman: false,
    shortBio: 'Cybersecurity researcher focusing on blockchain and network security.',
    bio: 'Dr. Farhan Ahmed is an Assistant Professor specializing in cybersecurity and blockchain technology. With 8 years of research experience, he focuses on developing secure network protocols and blockchain-based solutions. His work contributes to advancing cybersecurity practices in modern computing environments.',
    education: [
      'PhD in Cybersecurity, Massachusetts Institute of Technology, USA (2015)',
      'MSc in Computer Networks, BUET (2012)',
      'BSc in Computer Science and Engineering, BUET (2010)'
    ],
    courses: [
      'CSE 3110: Computer Networks',
      'CSE 4110: Network Security',
      'CSE 4120: Cryptography',
      'CSE 4130: Blockchain Technology'
    ],
    researchInterests: ['Blockchain Technology', 'IoT Security', 'Privacy Protection', 'Network Protocols'],
    recentPublications: [
      {
        title: 'Blockchain-based Security Framework for IoT Networks',
        journal: 'IEEE Transactions on Information Forensics and Security',
        year: 2023,
        doi: '10.1109/TIFS.2023.1234567'
      },
      {
        title: 'Advanced Cryptographic Techniques for Network Security',
        journal: 'Journal of Network and Computer Applications',
        year: 2022
      },
      {
        title: 'Privacy-Preserving Authentication in Wireless Networks',
        journal: 'Computer Networks',
        year: 2022
      }
    ],
    awards: [
      'Best Cybersecurity Research Award, IEEE Security Symposium (2023)',
      'Young Researcher Award in Network Security (2021)',
      'Excellence in Blockchain Research Award (2020)'
    ],
    officeHours: 'Sunday-Thursday: 3:00 PM - 5:00 PM'
  },
  'hasan-babu': {
    id: 'hasan-babu',
    name: 'Hasan Babu',
    designation: 'Professor & Chairman',
    department: 'Computer Science and Engineering',
    role: 'Professor',
    expertise: ['Computer Architecture', 'VLSI Design', 'Embedded Systems', 'Digital Logic'],
    email: 'hasan.babu@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7459',
    office: 'Room 301, CSE Building',
    image: '/src/assets/teacher/hasan_babu.jpg',
    publications: 95,
    experience: 20,
    rating: 4.9,
    isChairman: true,
    shortBio: 'Chairman and expert in computer architecture and VLSI design.',
    bio: 'Dr. Hasan Babu is a distinguished Professor and Chairman of the Department of Computer Science and Engineering at the University of Dhaka. With over 20 years of experience, he is a leading expert in computer architecture and VLSI design. His research has significantly contributed to the advancement of embedded systems and digital logic design.',
    education: [
      'PhD in Computer Engineering, University of Tokyo, Japan (2003)',
      'MSc in Electrical and Electronic Engineering, BUET (1999)',
      'BSc in Electrical and Electronic Engineering, BUET (1997)'
    ],
    courses: [
      'CSE 2104: Computer Architecture',
      'CSE 4104: VLSI Design',
      'CSE 3104: Digital Logic Design',
      'CSE 4114: Embedded Systems'
    ],
    researchInterests: ['Computer Architecture', 'VLSI Design', 'Embedded Systems', 'Digital Signal Processing'],
    recentPublications: [
      {
        title: 'Advanced VLSI Design Techniques for Low Power Applications',
        journal: 'IEEE Transactions on Very Large Scale Integration Systems',
        year: 2023,
        doi: '10.1109/TVLSI.2023.1234567'
      },
      {
        title: 'Computer Architecture Innovations for Modern Computing',
        journal: 'ACM Transactions on Architecture and Code Optimization',
        year: 2022
      },
      {
        title: 'Embedded Systems Design for IoT Applications',
        journal: 'IEEE Embedded Systems Letters',
        year: 2022
      }
    ],
    awards: [
      'Outstanding Leadership Award, University of Dhaka (2023)',
      'Best VLSI Design Paper Award, IEEE VLSI Symposium (2022)',
      'Excellence in Computer Architecture Research Award (2021)'
    ],
    officeHours: 'Sunday-Thursday: 9:00 AM - 11:00 AM'
  },
  'ismat-rahman': {
    id: 'ismat-rahman',
    name: 'Ismat Rahman',
    designation: 'Associate Professor',
    department: 'Computer Science and Engineering',
    role: 'Associate Professor',
    expertise: ['Computer Graphics', 'Image Processing', 'Virtual Reality', 'Game Development'],
    email: 'ismat.rahman@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7460',
    office: 'Room 302, CSE Building',
    image: '/src/assets/teacher/ismat_rahman.jpeg',
    publications: 67,
    experience: 14,
    rating: 4.7,
    isChairman: false,
    shortBio: 'Pioneer in computer graphics and virtual reality research.',
    bio: 'Dr. Ismat Rahman is an Associate Professor and pioneer in computer graphics and virtual reality research in Bangladesh. With 14 years of experience, she has made significant contributions to image processing and game development. Her work focuses on developing innovative graphics algorithms and immersive virtual reality experiences.',
    education: [
      'PhD in Computer Graphics, Stanford University, USA (2009)',
      'MSc in Mathematics, University of Dhaka (2006)',
      'BSc in Mathematics, University of Dhaka (2004)'
    ],
    courses: [
      'CSE 4108: Computer Graphics',
      'CSE 4120: Game Development',
      'CSE 3108: Image Processing',
      'CSE 4128: Virtual Reality'
    ],
    researchInterests: ['3D Modeling', 'Augmented Reality', 'Medical Imaging', 'Interactive Graphics'],
    recentPublications: [
      {
        title: 'Advanced 3D Rendering Techniques for Real-time Applications',
        journal: 'IEEE Computer Graphics and Applications',
        year: 2023,
        doi: '10.1109/MCG.2023.1234567'
      },
      {
        title: 'Virtual Reality Applications in Medical Training',
        journal: 'Computers & Graphics',
        year: 2022
      },
      {
        title: 'Image Processing Algorithms for Medical Diagnosis',
        journal: 'Medical Image Analysis',
        year: 2022
      }
    ],
    awards: [
      'Best Computer Graphics Paper Award, SIGGRAPH Asia (2023)',
      'Innovation in Virtual Reality Award (2021)',
      'Excellence in Image Processing Research Award (2020)'
    ],
    officeHours: 'Sunday-Thursday: 1:00 PM - 3:00 PM'
  },
  'mosaddek-hossain-kamal': {
    id: 'mosaddek-hossain-kamal',
    name: 'Mosaddek Hossain Kamal',
    designation: 'Professor',
    department: 'Computer Science and Engineering',
    role: 'Professor',
    expertise: ['Algorithms', 'Data Structures', 'Computational Geometry', 'Graph Theory'],
    email: 'mosaddek.kamal@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7461',
    office: 'Room 206, CSE Building',
    image: '/src/assets/teacher/mosaddek_hossain_kamal.jpeg',
    publications: 78,
    experience: 18,
    rating: 4.8,
    isChairman: false,
    shortBio: 'Expert in algorithms and computational geometry with extensive research.',
    bio: 'Dr. Mosaddek Hossain Kamal is a renowned Professor and researcher in algorithms and computational geometry. With 18 years of experience, he has made significant contributions to algorithm design and graph theory. His research focuses on developing efficient algorithms for complex computational problems.',
    education: [
      'PhD in Computer Science, University of Waterloo, Canada (2005)',
      'MSc in Mathematics, University of Dhaka (2001)',
      'BSc in Mathematics, University of Dhaka (1999)'
    ],
    courses: [
      'CSE 2110: Data Structures',
      'CSE 3110: Algorithms',
      'CSE 4110: Advanced Algorithms',
      'CSE 4120: Computational Geometry'
    ],
    researchInterests: ['Algorithm Design', 'Computational Geometry', 'Graph Algorithms', 'Optimization'],
    recentPublications: [
      {
        title: 'Efficient Algorithms for Computational Geometry Problems',
        journal: 'Journal of the ACM',
        year: 2023,
        doi: '10.1145/3456789.3456792'
      },
      {
        title: 'Graph Algorithms for Large-scale Networks',
        journal: 'Algorithmica',
        year: 2022
      },
      {
        title: 'Optimization Techniques in Algorithm Design',
        journal: 'SIAM Journal on Computing',
        year: 2022
      }
    ],
    awards: [
      'Best Algorithm Paper Award, STOC (2023)',
      'Excellence in Mathematical Research Award (2021)',
      'Outstanding Contribution to Graph Theory Award (2020)'
    ],
    officeHours: 'Sunday-Thursday: 11:00 AM - 1:00 PM'
  },
  'shabbir-ahmed': {
    id: 'shabbir-ahmed',
    name: 'Shabbir Ahmed',
    designation: 'Assistant Professor',
    department: 'Computer Science and Engineering',
    role: 'Assistant Professor',
    expertise: ['Natural Language Processing', 'Machine Learning', 'Text Mining', 'AI'],
    email: 'shabbir.ahmed@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7462',
    office: 'Room 108, CSE Building',
    image: '/src/assets/teacher/shabbir_ahmed.jpg',
    publications: 35,
    experience: 9,
    rating: 4.6,
    isChairman: false,
    shortBio: 'NLP researcher specializing in text mining and machine learning.',
    bio: 'Dr. Shabbir Ahmed is an Assistant Professor specializing in natural language processing and text mining. With 9 years of research experience, he focuses on developing machine learning algorithms for language understanding and text analysis. His work contributes to advancing AI applications in language processing.',
    education: [
      'PhD in Computer Science, University of Edinburgh, UK (2014)',
      'MSc in Computer Science and Engineering, BUET (2011)',
      'BSc in Computer Science and Engineering, BUET (2009)'
    ],
    courses: [
      'CSE 4120: Natural Language Processing',
      'CSE 3120: Machine Learning',
      'CSE 4130: Text Mining',
      'CSE 4140: Artificial Intelligence'
    ],
    researchInterests: ['NLP', 'Text Mining', 'Sentiment Analysis', 'Deep Learning'],
    recentPublications: [
      {
        title: 'Advanced NLP Techniques for Sentiment Analysis',
        journal: 'Computational Linguistics',
        year: 2023,
        doi: '10.1162/COLI_a_00456'
      },
      {
        title: 'Machine Learning Approaches for Text Classification',
        journal: 'Journal of Machine Learning Research',
        year: 2022
      },
      {
        title: 'Deep Learning for Natural Language Understanding',
        journal: 'Neural Networks',
        year: 2022
      }
    ],
    awards: [
      'Best NLP Paper Award, ACL (2023)',
      'Young Researcher Award in AI (2021)',
      'Excellence in Text Mining Research Award (2020)'
    ],
    officeHours: 'Sunday-Thursday: 2:00 PM - 4:00 PM'
  },
  'suraiya-parvin': {
    id: 'suraiya-parvin',
    name: 'Suraiya Parvin',
    designation: 'Associate Professor',
    department: 'Computer Science and Engineering',
    role: 'Associate Professor',
    expertise: ['Human-Computer Interaction', 'User Experience', 'Accessibility', 'Mobile Interfaces'],
    email: 'suraiya.parvin@cse.du.ac.bd',
    phone: '+880-2-9661900-73 Ext: 7463',
    office: 'Room 207, CSE Building',
    image: '/src/assets/teacher/suraiya_parvin.jpg',
    publications: 38,
    experience: 11,
    rating: 4.7,
    isChairman: false,
    shortBio: 'HCI researcher focused on inclusive design and accessibility.',
    bio: 'Dr. Suraiya Parvin is an Associate Professor specializing in human-computer interaction and inclusive design. With 11 years of experience, she focuses on developing accessible user interfaces and improving user experience design. Her research contributes to making technology more inclusive and user-friendly.',
    education: [
      'PhD in Human-Computer Interaction, Carnegie Mellon University, USA (2012)',
      'MSc in Design, National Institute of Design, India (2009)',
      'BSc in Computer Science and Engineering, BUET (2007)'
    ],
    courses: [
      'CSE 3120: Human-Computer Interaction',
      'CSE 4130: User Interface Design',
      'CSE 4140: Accessibility in Computing',
      'CSE 4150: Mobile Interface Design'
    ],
    researchInterests: ['Inclusive Design', 'Voice Interfaces', 'Gesture Recognition', 'Usability Testing'],
    recentPublications: [
      {
        title: 'Inclusive Design Principles for Mobile Applications',
        journal: 'International Journal of Human-Computer Studies',
        year: 2023,
        doi: '10.1016/j.ijhcs.2023.102890'
      },
      {
        title: 'Voice Interface Design for Accessibility',
        journal: 'ACM Transactions on Accessible Computing',
        year: 2022
      },
      {
        title: 'Gesture Recognition for Mobile Interfaces',
        journal: 'International Journal of Human-Computer Interaction',
        year: 2022
      }
    ],
    awards: [
      'Best HCI Paper Award, CHI Conference (2023)',
      'Excellence in Accessibility Research Award (2021)',
      'Innovation in User Experience Design Award (2020)'
    ],
    officeHours: 'Sunday-Thursday: 10:00 AM - 12:00 PM'
  }
}

const FacultyProfile = () => {
  const { id } = useParams()
  const [faculty, setFaculty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const facultyData = mockFacultyData[id]
      setFaculty(facultyData)
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading faculty profile...</p>
        </div>
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Faculty Not Found</h2>
          <p className="text-gray-600 mb-6">The requested faculty profile could not be found.</p>
          <Button asChild>
            <Link to="/faculty">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Faculty Directory
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <Star className="w-4 h-4 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" 
                      style={{ clipPath: 'inset(0 50% 0 0)' }} />
              </div>
            )
          } else {
            return <Star key={index} className="w-4 h-4 text-yellow-400/40" />
          }
        })}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10 mb-4">
            <Link to="/faculty">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Faculty Directory
            </Link>
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <div className="relative">
              <img 
                src={faculty.image} 
                alt={faculty.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
              {faculty.isChairman && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{faculty.name}</h1>
              <p className="text-xl text-blue-100 mb-2">{faculty.designation}</p>
              <p className="text-blue-200 mb-4">{faculty.department}</p>
              
              {renderStars(faculty.rating)}
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-white/20 text-white">
                  {faculty.role}
                </Badge>
                {faculty.isChairman && (
                  <Badge className="bg-yellow-500 text-white">
                    Chairman
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{faculty.bio}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Research Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Research Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {faculty.researchInterests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Publications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Publications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faculty.recentPublications?.map((pub, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900">{pub.title}</h4>
                        <p className="text-sm text-gray-600">{pub.journal} ({pub.year})</p>
                        {pub.doi && (
                          <p className="text-xs text-blue-600">DOI: {pub.doi}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Awards */}
            {faculty.awards && faculty.awards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Awards & Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {faculty.awards.map((award, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{award}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <a href={`mailto:${faculty.email}`} className="text-blue-600 hover:underline">
                      {faculty.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{faculty.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{faculty.office}</span>
                  </div>
                  {faculty.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <a href={faculty.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        Personal Website
                      </a>
                    </div>
                  )}
                  {faculty.officeHours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Office Hours</p>
                        <p className="text-sm text-gray-600">{faculty.officeHours}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{faculty.publications}</div>
                    <div className="text-sm text-gray-600">Publications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{faculty.experience}+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{faculty.courses.length}</div>
                    <div className="text-sm text-gray-600">Courses Teaching</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {faculty.education.map((edu, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {edu}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Courses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {faculty.courses.map((course, index) => (
                      <li key={index} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                        {course}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyProfile
