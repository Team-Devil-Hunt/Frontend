/*
 * API Schema for Projects:
 * GET /api/projects
 * Response: {
 *   projects: [
 *     {
 *       id: string,
 *       title: string,
 *       summary: string,
 *       abstract: string,
 *       supervisor: string,
 *       year: number,
 *       category: 'machine_learning' | 'web_development' | 'mobile_app' | 'algorithms' | 'iot' | 'security' | 'robotics' | 'graphics',
 *       type: 'student' | 'faculty',
 *       tags: string[],
 *       team?: { name: string, role?: string }[],
 *       course?: string,
 *       teamSize?: number,
 *       completionDate: string,
 *       technologies?: string[],
 *       keyFeatures?: string[],
 *       achievements?: string[],
 *       demoLink?: string,
 *       githubLink?: string,
 *       paperLink?: string,
 *       contactEmail?: string
 *     }
 *   ]
 * }
 */

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectDetails from '../components/projects/ProjectDetails'
import { GraduationCap, Users, Search } from 'lucide-react'

// Mock API Data
const mockProjects = [
  {
    id: 'proj-001',
    title: 'Smart Campus Navigation System',
    summary: 'An AI-powered mobile app that helps students navigate the campus using AR and real-time location tracking.',
    abstract: 'The Smart Campus Navigation System is an innovative mobile application designed to enhance the campus experience for students and visitors. Using augmented reality (AR) technology and real-time GPS tracking, the app provides turn-by-turn navigation within the university premises.\n\nThe system incorporates machine learning algorithms to optimize routes based on real-time crowd density, weather conditions, and user preferences. It features indoor navigation for complex buildings, integration with class schedules, and accessibility options for students with disabilities.\n\nThe app also includes social features allowing students to share locations, find study groups, and discover campus events. The backend utilizes a microservices architecture deployed on AWS, ensuring scalability and reliability.',
    supervisor: 'Dr. Rashida Ahmed',
    year: 2024,
    category: 'mobile_app',
    type: 'student',
    tags: ['React Native', 'AR', 'Machine Learning', 'AWS', 'GPS'],
    team: [
      { name: 'Fahim Rahman', role: 'Team Lead' },
      { name: 'Sadia Islam', role: 'Frontend Developer' },
      { name: 'Arif Hassan', role: 'Backend Developer' },
      { name: 'Nusrat Jahan', role: 'UI/UX Designer' }
    ],
    course: 'CSE 4000 - Final Year Project',
    teamSize: 4,
    completionDate: '2024-05-15',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'AWS Lambda', 'ARCore', 'ARKit'],
    keyFeatures: [
      'Augmented Reality navigation overlay',
      'Real-time crowd density analysis',
      'Indoor positioning system',
      'Class schedule integration',
      'Accessibility features for disabled users',
      'Social location sharing'
    ],
    achievements: [
      'Winner - Best Innovation Award 2024',
      'Featured in University Tech Showcase',
      'Deployed for campus-wide use'
    ],
    demoLink: 'https://demo.smartcampus.edu',
    githubLink: 'https://github.com/csedu/smart-campus'
  },
  {
    id: 'proj-002',
    title: 'Automated Code Review Assistant',
    summary: 'ML-powered tool that analyzes code quality, detects bugs, and suggests improvements using natural language processing.',
    abstract: 'The Automated Code Review Assistant is a sophisticated machine learning system designed to enhance software development workflows by providing intelligent code analysis and review suggestions.\n\nThe system employs advanced natural language processing techniques and static code analysis to identify potential bugs, security vulnerabilities, code smells, and performance issues. It supports multiple programming languages including Python, Java, JavaScript, and C++.\n\nThe tool integrates seamlessly with popular version control systems like Git and provides detailed reports with actionable recommendations. It uses transformer-based models fine-tuned on large codebases to understand context and provide human-like review comments.',
    supervisor: 'Prof. Mohammad Karim',
    year: 2024,
    category: 'machine_learning',
    type: 'faculty',
    tags: ['NLP', 'Static Analysis', 'Transformers', 'DevOps'],
    completionDate: '2024-03-20',
    technologies: ['Python', 'PyTorch', 'BERT', 'FastAPI', 'Docker', 'PostgreSQL'],
    keyFeatures: [
      'Multi-language code analysis',
      'Security vulnerability detection',
      'Performance optimization suggestions',
      'Git integration',
      'Automated report generation',
      'Custom rule configuration'
    ],
    achievements: [
      'Published in IEEE Software Engineering Conference',
      'Adopted by 5+ tech companies',
      'Open-sourced with 2000+ GitHub stars'
    ],
    demoLink: 'https://codereview.ai/demo',
    githubLink: 'https://github.com/csedu/code-review-ai',
    paperLink: 'https://ieeexplore.ieee.org/document/code-review-2024',
    contactEmail: 'karim@cse.du.ac.bd'
  },
  {
    id: 'proj-003',
    title: 'E-Learning Platform for Programming',
    summary: 'Interactive web platform with coding challenges, automated grading, and personalized learning paths.',
    abstract: 'This comprehensive e-learning platform is designed to revolutionize programming education through interactive learning experiences and personalized instruction.\n\nThe platform features an integrated code editor with real-time syntax highlighting, automated testing, and instant feedback. Students can progress through carefully curated learning paths that adapt to their skill level and learning pace.\n\nThe system includes gamification elements, peer collaboration tools, and detailed analytics for both students and instructors. It supports multiple programming languages and integrates with popular development tools.',
    supervisor: 'Dr. Fatima Khan',
    year: 2023,
    category: 'web_development',
    type: 'student',
    tags: ['React', 'Node.js', 'Education', 'Gamification'],
    team: [
      { name: 'Rakib Ahmed', role: 'Full Stack Developer' },
      { name: 'Tahmina Akter', role: 'Frontend Developer' },
      { name: 'Sabbir Rahman', role: 'Backend Developer' }
    ],
    course: 'CSE 3200 - Software Engineering',
    teamSize: 3,
    completionDate: '2023-12-10',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Docker'],
    keyFeatures: [
      'Interactive code editor',
      'Automated code testing',
      'Personalized learning paths',
      'Real-time collaboration',
      'Progress tracking',
      'Gamification system'
    ],
    demoLink: 'https://codelearn.edu.bd',
    githubLink: 'https://github.com/csedu/elearning-platform'
  },
  {
    id: 'proj-004',
    title: 'IoT-Based Smart Agriculture System',
    summary: 'Sensor network for monitoring crop conditions with automated irrigation and pest detection using computer vision.',
    abstract: 'The IoT-Based Smart Agriculture System represents a cutting-edge approach to precision farming, combining Internet of Things sensors, machine learning, and automated control systems.\n\nThe system deploys a network of environmental sensors throughout agricultural fields to monitor soil moisture, temperature, humidity, light levels, and nutrient content. Computer vision algorithms analyze crop images to detect diseases, pests, and growth patterns.\n\nAutomated irrigation systems respond to real-time data, optimizing water usage and crop yield. The platform provides farmers with a comprehensive dashboard and mobile app for remote monitoring and control.',
    supervisor: 'Dr. Abdul Mannan',
    year: 2023,
    category: 'iot',
    type: 'student',
    tags: ['IoT', 'Computer Vision', 'Agriculture', 'Sensors'],
    team: [
      { name: 'Hasibul Islam', role: 'IoT Developer' },
      { name: 'Ruma Begum', role: 'ML Engineer' },
      { name: 'Kamal Uddin', role: 'Hardware Engineer' }
    ],
    course: 'CSE 4100 - Embedded Systems',
    teamSize: 3,
    completionDate: '2023-11-25',
    technologies: ['Arduino', 'Raspberry Pi', 'Python', 'OpenCV', 'MQTT', 'InfluxDB'],
    keyFeatures: [
      'Multi-sensor environmental monitoring',
      'Computer vision crop analysis',
      'Automated irrigation control',
      'Weather prediction integration',
      'Mobile app for farmers',
      'Data analytics dashboard'
    ],
    achievements: [
      'Winner - National IoT Competition 2023',
      'Pilot deployment in 3 farms'
    ],
    demoLink: 'https://smartfarm.iot.bd',
    githubLink: 'https://github.com/csedu/smart-agriculture'
  },
  {
    id: 'proj-005',
    title: 'Blockchain-Based Voting System',
    summary: 'Secure and transparent digital voting platform using blockchain technology with voter verification.',
    abstract: 'This project develops a secure, transparent, and tamper-proof digital voting system using blockchain technology to address concerns about election integrity and accessibility.\n\nThe system implements a permissioned blockchain network where each vote is recorded as an immutable transaction. Advanced cryptographic techniques ensure voter privacy while maintaining transparency and auditability.\n\nThe platform includes voter registration, identity verification, secure ballot casting, and real-time result tabulation. Smart contracts automate the voting process and ensure compliance with electoral rules.',
    supervisor: 'Prof. Shahida Sultana',
    year: 2024,
    category: 'security',
    type: 'faculty',
    tags: ['Blockchain', 'Cryptography', 'Security', 'Smart Contracts'],
    completionDate: '2024-01-30',
    technologies: ['Ethereum', 'Solidity', 'Web3.js', 'React', 'IPFS', 'MetaMask'],
    keyFeatures: [
      'Immutable vote recording',
      'Zero-knowledge voter verification',
      'Real-time result transparency',
      'Multi-device accessibility',
      'Audit trail generation',
      'Smart contract automation'
    ],
    achievements: [
      'Published in ACM Digital Government Conference',
      'Pilot tested in student elections',
      'Patent application filed'
    ],
    demoLink: 'https://blockvote.demo.bd',
    githubLink: 'https://github.com/csedu/blockchain-voting',
    paperLink: 'https://dl.acm.org/doi/blockchain-voting-2024',
    contactEmail: 'sultana@cse.du.ac.bd'
  },
  {
    id: 'proj-006',
    title: 'Autonomous Drone Delivery System',
    summary: 'AI-powered drone fleet for package delivery with obstacle avoidance and route optimization.',
    abstract: 'The Autonomous Drone Delivery System is an innovative logistics solution that leverages artificial intelligence and robotics to create an efficient package delivery network.\n\nThe system features a fleet of autonomous drones equipped with computer vision, GPS navigation, and obstacle avoidance capabilities. Machine learning algorithms optimize delivery routes based on weather conditions, air traffic, and package priorities.\n\nThe platform includes a comprehensive management system for tracking deliveries, managing drone maintenance, and coordinating with ground operations. Safety protocols ensure compliance with aviation regulations.',
    supervisor: 'Dr. Mizanur Rahman',
    year: 2023,
    category: 'robotics',
    type: 'student',
    tags: ['Robotics', 'Computer Vision', 'Path Planning', 'Drones'],
    team: [
      { name: 'Imran Hossain', role: 'Robotics Engineer' },
      { name: 'Nasir Ahmed', role: 'AI Developer' },
      { name: 'Salma Khatun', role: 'Systems Engineer' }
    ],
    course: 'CSE 4200 - Robotics and Automation',
    teamSize: 3,
    completionDate: '2023-10-15',
    technologies: ['ROS', 'OpenCV', 'Python', 'TensorFlow', 'GPS', 'Lidar'],
    keyFeatures: [
      'Autonomous flight control',
      'Real-time obstacle detection',
      'Dynamic route optimization',
      'Package tracking system',
      'Weather adaptation',
      'Emergency landing protocols'
    ],
    achievements: [
      'Best Project Award - Robotics Fair 2023',
      'Successful test flights completed'
    ],
    demoLink: 'https://dronedelivery.demo.bd',
    githubLink: 'https://github.com/csedu/drone-delivery'
  },
  {
    id: 'proj-007',
    title: 'Real-time 3D Graphics Engine',
    summary: 'High-performance graphics engine with advanced rendering techniques and physics simulation.',
    abstract: 'This project develops a sophisticated real-time 3D graphics engine capable of rendering complex scenes with advanced lighting, shadows, and physics simulation.\n\nThe engine implements modern rendering techniques including physically-based rendering (PBR), screen-space reflections, and volumetric lighting. It features an efficient scene graph system and supports multiple rendering APIs.\n\nThe engine includes a comprehensive physics system for realistic object interactions, particle effects, and fluid simulation. It provides tools for content creation and supports popular 3D model formats.',
    supervisor: 'Prof. Aminul Haque',
    year: 2024,
    category: 'graphics',
    type: 'faculty',
    tags: ['Graphics', 'OpenGL', 'Physics', 'Rendering'],
    completionDate: '2024-02-28',
    technologies: ['C++', 'OpenGL', 'GLSL', 'Bullet Physics', 'Assimp', 'ImGui'],
    keyFeatures: [
      'Physically-based rendering',
      'Real-time global illumination',
      'Advanced shadow mapping',
      'Physics simulation',
      'Particle systems',
      'Multi-threading support'
    ],
    achievements: [
      'Presented at SIGGRAPH Asia 2024',
      'Used in 3 commercial games',
      'Open-source with active community'
    ],
    demoLink: 'https://graphics-engine.demo.bd',
    githubLink: 'https://github.com/csedu/3d-graphics-engine',
    paperLink: 'https://dl.acm.org/doi/graphics-engine-2024',
    contactEmail: 'haque@cse.du.ac.bd'
  },
  {
    id: 'proj-008',
    title: 'Efficient Graph Algorithms Library',
    summary: 'Optimized implementations of graph algorithms with parallel processing and memory efficiency.',
    abstract: 'This research project focuses on developing highly optimized implementations of fundamental graph algorithms with emphasis on parallel processing and memory efficiency.\n\nThe library includes implementations of shortest path algorithms, minimum spanning tree algorithms, network flow algorithms, and graph traversal methods. Each algorithm is optimized for different graph types and sizes.\n\nThe project explores novel parallelization strategies and memory-efficient data structures to handle large-scale graphs. Comprehensive benchmarking demonstrates significant performance improvements over existing libraries.',
    supervisor: 'Dr. Tanvir Ahmed',
    year: 2023,
    category: 'algorithms',
    type: 'student',
    tags: ['Algorithms', 'Graph Theory', 'Parallel Computing', 'Optimization'],
    team: [
      { name: 'Rafiq Islam', role: 'Algorithm Developer' },
      { name: 'Shirin Akter', role: 'Performance Analyst' }
    ],
    course: 'CSE 3100 - Data Structures and Algorithms',
    teamSize: 2,
    completionDate: '2023-09-20',
    technologies: ['C++', 'OpenMP', 'CUDA', 'Python', 'Boost Graph Library'],
    keyFeatures: [
      'Parallel algorithm implementations',
      'Memory-efficient data structures',
      'Support for large-scale graphs',
      'Comprehensive benchmarking suite',
      'Python bindings',
      'Detailed documentation'
    ],
    achievements: [
      '50% performance improvement over standard libraries',
      'Adopted by research community'
    ],
    githubLink: 'https://github.com/csedu/graph-algorithms'
  }
]

const Projects = () => {
  const [filters, setFilters] = useState({
    search: '',
    years: [],
    categories: [],
    supervisors: [],
    studentOnly: false,
    facultyOnly: false
  })
  
  const [selectedProject, setSelectedProject] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = [
          project.title,
          project.summary,
          project.supervisor,
          ...project.tags
        ].join(' ').toLowerCase()
        
        if (!searchableText.includes(searchTerm)) {
          return false
        }
      }
      
      // Year filter
      if (filters.years.length > 0 && !filters.years.includes(project.year)) {
        return false
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(project.category)) {
        return false
      }
      
      // Supervisor filter
      if (filters.supervisors.length > 0 && !filters.supervisors.includes(project.supervisor)) {
        return false
      }
      
      // Type filters
      if (filters.studentOnly && project.type !== 'student') {
        return false
      }
      
      if (filters.facultyOnly && project.type !== 'faculty') {
        return false
      }
      
      return true
    })
  }, [filters])
  
  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsDetailsModalOpen(true)
  }
  
  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false)
    setSelectedProject(null)
  }
  
  const studentProjects = filteredProjects.filter(p => p.type === 'student')
  const facultyProjects = filteredProjects.filter(p => p.type === 'faculty')
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Student & Faculty Projects
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore innovative research projects and student work from the Department of Computer Science and Engineering
            </motion.p>
            
            <motion.div 
              className="flex justify-center gap-8 mt-6 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span>{studentProjects.length} Student Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span>{facultyProjects.length} Faculty Research</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-green-500" />
                <span>{filteredProjects.length} Total Results</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <ProjectFilters 
                projects={mockProjects}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>
          
          {/* Projects Grid */}
          <div className="flex-1">
            {filteredProjects.length === 0 ? (
              <motion.div 
                className="text-center py-12 bg-white rounded-xl shadow-sm p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </motion.div>
            ) : (
              <div>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.8) }}
                      className="h-full"
                    >
                      <ProjectCard 
                        project={project}
                        onClick={() => handleProjectClick(project)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Project Details Modal */}
      <ProjectDetails 
        project={selectedProject}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  )
}

export default Projects
