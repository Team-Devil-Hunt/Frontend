import React, { useState, useMemo , useEffect} from 'react';
import { motion } from 'framer-motion';
import { Search, Award, Trophy, BookOpen, Medal, Bookmark } from 'lucide-react';
import AwardCard from '@/components/awards/AwardCard';
import AwardFilters from '@/components/awards/AwardFilters';
import AwardDetails from '@/components/awards/AwardDetails';

import Api from '../constant/Api'

/*
API Schema:

GET /api/awards
Response: {
  awards: [
    {
      id: string,
      title: string,
      description: string,
      details?: string,
      recipient: string,
      recipientType: 'faculty' | 'student',
      year: number,
      type: 'award' | 'grant' | 'fellowship' | 'scholarship' | 'publication',
      organization?: string,
      amount?: number,
      department?: string,
      duration?: string,
      categories?: string[],
      publications?: string[],
      link?: string
    }
  ]
}
*/

// Mock data for awards
const mockAwards = [
  {
    id: 'award-001',
    title: 'Outstanding Research Award in Artificial Intelligence',
    description: 'Awarded for groundbreaking research in deep learning algorithms for medical image analysis, demonstrating significant improvements in early disease detection accuracy.',
    details: 'This prestigious award recognizes exceptional contributions to the field of artificial intelligence research. The recipient demonstrated innovative approaches to medical image analysis using novel deep learning architectures that achieved a 27% improvement in early disease detection compared to previous methods.\n\nThe research has been implemented in several medical institutions and has already contributed to improved patient outcomes through earlier and more accurate diagnoses.',
    recipient: 'Dr. Rashida Ahmed',
    recipientType: 'faculty',
    year: 2024,
    type: 'award',
    organization: 'Bangladesh Association for Computing Machinery',
    department: 'Computer Science and Engineering',
    categories: ['AI', 'Machine Learning', 'Medical Imaging'],
    publications: [
      'Ahmed, R., et al. (2024). "Novel Deep Learning Architectures for Early Disease Detection in Medical Imaging." Journal of Medical AI, 12(3), 245-267.',
      'Ahmed, R., & Khan, S. (2023). "Comparative Analysis of CNN Architectures for Medical Image Segmentation." IEEE Transactions on Medical Imaging, 42(8), 1756-1770.'
    ],
    link: 'https://example.com/awards/ai-research-2024'
  },
  {
    id: 'award-002',
    title: 'National Science Foundation Research Grant',
    description: 'A major research grant awarded for the development of next-generation cybersecurity protocols for critical infrastructure protection.',
    details: 'This three-year research grant funds the development of advanced cybersecurity protocols specifically designed to protect national critical infrastructure from emerging threats. The project aims to create a framework that combines AI-driven threat detection with novel encryption methods tailored for industrial control systems.\n\nThe research team will collaborate with government agencies and private sector partners to ensure practical implementation of the developed protocols.',
    recipient: 'Prof. Mohammad Karim',
    recipientType: 'faculty',
    year: 2023,
    type: 'grant',
    organization: 'National Science Foundation',
    amount: 15000000,
    department: 'Computer Science and Engineering',
    duration: '3 years (2023-2026)',
    categories: ['Cybersecurity', 'Critical Infrastructure', 'Network Security'],
    link: 'https://example.com/nsf-grants/2023'
  },
  {
    id: 'award-003',
    title: 'ACM Student Research Competition - First Place',
    description: 'Awarded first place in the prestigious ACM Student Research Competition for innovative work on privacy-preserving machine learning techniques.',
    recipient: 'Nusrat Jahan',
    recipientType: 'student',
    year: 2024,
    type: 'award',
    organization: 'Association for Computing Machinery',
    categories: ['Privacy', 'Machine Learning', 'Data Security'],
    publications: [
      'Jahan, N. (2024). "Privacy-Preserving Federated Learning for Healthcare Applications." ACM Student Research Competition.'
    ],
    link: 'https://example.com/acm-src/2024'
  },
  {
    id: 'award-004',
    title: 'Microsoft Research Fellowship',
    description: 'Prestigious fellowship awarded to support PhD research in quantum computing algorithms and their applications in cryptography.',
    details: 'The Microsoft Research Fellowship provides full financial support for PhD studies and research, along with mentorship from Microsoft Research scientists. The fellowship recognizes exceptional promise in the field of quantum computing and encourages groundbreaking research that bridges theoretical computer science with practical applications.\n\nAs part of this fellowship, the recipient will have the opportunity to collaborate with Microsoft\'s Quantum Computing team and access to state-of-the-art quantum computing resources.',
    recipient: 'Tanvir Ahmed',
    recipientType: 'student',
    year: 2023,
    type: 'fellowship',
    organization: 'Microsoft Research',
    amount: 5000000,
    duration: '4 years (2023-2027)',
    categories: ['Quantum Computing', 'Cryptography', 'Algorithms'],
    link: 'https://example.com/microsoft-fellowship/2023'
  },
  {
    id: 'award-005',
    title: 'IEEE Outstanding Paper Award',
    description: 'Recognized for the most influential paper in the IEEE International Conference on IoT and Smart Cities for novel urban data analytics framework.',
    recipient: 'Dr. Fatima Khan',
    recipientType: 'faculty',
    year: 2022,
    type: 'award',
    organization: 'IEEE',
    department: 'Computer Science and Engineering',
    categories: ['IoT', 'Smart Cities', 'Data Analytics'],
    publications: [
      'Khan, F., & Rahman, M. (2022). "SmartUrban: A Scalable Framework for Real-time Urban Data Analytics and Decision Support." IEEE International Conference on IoT and Smart Cities, 78-92.'
    ],
    link: 'https://example.com/ieee-papers/2022'
  },
  {
    id: 'award-006',
    title: 'Prime Minister\'s ICT Excellence Scholarship',
    description: 'Prestigious national scholarship awarded to exceptional undergraduate students pursuing studies in information and communication technologies.',
    recipient: 'Anika Rahman',
    recipientType: 'student',
    year: 2024,
    type: 'scholarship',
    organization: 'ICT Division, Government of Bangladesh',
    amount: 1000000,
    duration: '4 years (2024-2028)',
    categories: ['ICT', 'Undergraduate Studies'],
    link: 'https://example.com/ict-scholarship/2024'
  },
  {
    id: 'award-007',
    title: 'Bangladesh Academy of Sciences Research Grant',
    description: 'Research funding awarded for investigating sustainable computing approaches and green IT infrastructure for developing nations.',
    recipient: 'Prof. Aminul Haque',
    recipientType: 'faculty',
    year: 2023,
    type: 'grant',
    organization: 'Bangladesh Academy of Sciences',
    amount: 3500000,
    department: 'Computer Science and Engineering',
    duration: '2 years (2023-2025)',
    categories: ['Green Computing', 'Sustainable IT', 'Energy Efficiency'],
    link: 'https://example.com/bas-grants/2023'
  },
  {
    id: 'award-008',
    title: 'Nature Journal Publication on Quantum Machine Learning',
    description: 'Groundbreaking research paper published in Nature on the intersection of quantum computing and machine learning algorithms.',
    details: 'This highly cited publication presents a novel framework that leverages quantum computing principles to enhance traditional machine learning algorithms. The research demonstrates quantum advantage in specific machine learning tasks, showing exponential speedup for certain classification problems.\n\nThe work has been recognized as a significant contribution to both quantum computing and artificial intelligence fields, bridging theoretical quantum mechanics with practical machine learning applications.',
    recipient: 'Dr. Mizanur Rahman',
    recipientType: 'faculty',
    year: 2022,
    type: 'publication',
    organization: 'Nature',
    department: 'Computer Science and Engineering',
    categories: ['Quantum Computing', 'Machine Learning', 'Quantum ML'],
    publications: [
      'Rahman, M., & Ahmed, T. (2022). "Quantum-Enhanced Neural Networks: A Framework for Machine Learning Acceleration." Nature, 598(7882), 347-352.'
    ],
    link: 'https://example.com/nature/quantum-ml-2022'
  },
  {
    id: 'award-009',
    title: 'Google PhD Fellowship in Machine Learning',
    description: 'Prestigious fellowship awarded to support PhD research in reinforcement learning for robotic systems with limited training data.',
    recipient: 'Imran Hossain',
    recipientType: 'student',
    year: 2023,
    type: 'fellowship',
    organization: 'Google Research',
    amount: 4500000,
    duration: '3 years (2023-2026)',
    categories: ['Machine Learning', 'Reinforcement Learning', 'Robotics'],
    link: 'https://example.com/google-fellowship/2023'
  },
  {
    id: 'award-010',
    title: 'Best Undergraduate Thesis Award',
    description: 'Recognized for exceptional undergraduate thesis on developing accessible mobile applications for visually impaired users.',
    recipient: 'Saima Akter',
    recipientType: 'student',
    year: 2024,
    type: 'award',
    organization: 'Department of Computer Science and Engineering, University of Dhaka',
    categories: ['Accessibility', 'Mobile Computing', 'Human-Computer Interaction'],
    link: 'https://example.com/cse-thesis-awards/2024'
  },
  {
    id: 'award-011',
    title: 'NVIDIA GPU Research Grant',
    description: 'Hardware and funding support for research in accelerating deep learning models for real-time video analysis and object detection.',
    recipient: 'Dr. Abdul Mannan',
    recipientType: 'faculty',
    year: 2022,
    type: 'grant',
    organization: 'NVIDIA Academic Program',
    amount: 2500000,
    department: 'Computer Science and Engineering',
    categories: ['GPU Computing', 'Deep Learning', 'Computer Vision'],
    link: 'https://example.com/nvidia-grants/2022'
  },
  {
    id: 'award-012',
    title: 'International Conference on Data Science Best Paper Award',
    description: 'Awarded for innovative research on privacy-preserving data mining techniques for healthcare datasets.',
    recipient: 'Prof. Shahida Sultana',
    recipientType: 'faculty',
    year: 2021,
    type: 'award',
    organization: 'International Association for Data Science',
    department: 'Computer Science and Engineering',
    categories: ['Data Science', 'Privacy', 'Healthcare'],
    publications: [
      'Sultana, S., & Mannan, A. (2021). "PrivHealth: A Framework for Privacy-Preserving Analysis of Healthcare Data." International Conference on Data Science, 112-125.'
    ],
    link: 'https://example.com/icds/2021'
  },
  {
    id: 'award-013',
    title: 'Fulbright Visiting Scholar Program',
    description: 'Prestigious international exchange program supporting research collaboration on blockchain technologies for secure voting systems.',
    details: 'The Fulbright Visiting Scholar Program enables accomplished faculty members to conduct research at U.S. institutions. This particular award supported a six-month research collaboration with MIT\'s Digital Currency Initiative, focusing on developing blockchain-based secure voting systems for developing nations.\n\nThe research resulted in a prototype system that addresses specific challenges in ensuring election integrity while maintaining voter privacy and preventing fraud.',
    recipient: 'Dr. Tanvir Ahmed',
    recipientType: 'faculty',
    year: 2023,
    type: 'fellowship',
    organization: 'Fulbright Program',
    department: 'Computer Science and Engineering',
    duration: '6 months (2023)',
    categories: ['Blockchain', 'Security', 'Voting Systems'],
    link: 'https://example.com/fulbright/2023'
  },
  {
    id: 'award-014',
    title: 'National Undergraduate Programming Contest - Champion',
    description: 'First place in the national programming competition, demonstrating exceptional problem-solving skills and algorithmic thinking.',
    recipient: 'Nasir Ahmed',
    recipientType: 'student',
    year: 2024,
    type: 'award',
    organization: 'Bangladesh Computer Society',
    categories: ['Competitive Programming', 'Algorithms', 'Problem Solving'],
    link: 'https://example.com/nupc/2024'
  },
  {
    id: 'award-015',
    title: 'Women in Computing Research Grant',
    description: 'Special research grant aimed at promoting women in computer science research, focusing on natural language processing for Bangla language.',
    recipient: 'Salma Khatun',
    recipientType: 'student',
    year: 2023,
    type: 'grant',
    organization: 'Women in Technology Bangladesh',
    amount: 1200000,
    duration: '1 year (2023-2024)',
    categories: ['NLP', 'Bangla Computing', 'Language Processing'],
    link: 'https://example.com/women-in-tech/grants/2023'
  }
];

const Awards = () => {

  const [awards, setAwards] = useState([])
  
  useEffect(() => {
    const fetchAwardsData = async () => {
      try {
        const response = await Api.get('api/awards/');
        setAwards(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching awards data:', error);
      }
    };
    fetchAwardsData();
  }, []);


  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    years: [],
    types: [],
    recipientTypes: [],
    categories: []
  });
  
  const [selectedAward, setSelectedAward] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter awards based on selected filters
  const filteredAwards = useMemo(() => {
    return awards.filter(award => {
      // Search filter
      if (filters.search && !(
        award.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        award.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        award.recipient.toLowerCase().includes(filters.search.toLowerCase()) ||
        (award.organization && award.organization.toLowerCase().includes(filters.search.toLowerCase()))
      )) {
        return false;
      }
      
      // Year filter
      if (filters.years.length > 0 && !filters.years.includes(award.year)) {
        return false;
      }
      
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(award.type)) {
        return false;
      }
      
      // Recipient type filter
      if (filters.recipientTypes.length > 0 && !filters.recipientTypes.includes(award.recipientType)) {
        return false;
      }
      
      // Categories filter
      if (filters.categories.length > 0 && (
        !award.categories || !filters.categories.some(cat => award.categories.includes(cat))
      )) {
        return false;
      }
      
      return true;
    });
  }, [filters]);
  
  const handleAwardClick = (award) => {
    setSelectedAward(award);
    setIsDetailsModalOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedAward(null);
  };
  
  const facultyAwards = filteredAwards.filter(a => a.recipientType === 'faculty');
  const studentAwards = filteredAwards.filter(a => a.recipientType === 'student');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Awards &amp; Achievements
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Celebrating excellence in research, innovation, and academic achievements of our faculty and students
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[180px]">
                <div className="text-4xl font-bold text-amber-400 flex items-center justify-center gap-2">
                  <Trophy size={28} />
                  <span>{facultyAwards.length}</span>
                </div>
                <span>{facultyAwards.length} Faculty Achievements</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[180px]">
                <div className="text-4xl font-bold text-emerald-400 flex items-center justify-center gap-2">
                  <Medal size={28} />
                  <span>{studentAwards.length}</span>
                </div>
                <span>{studentAwards.length} Student Achievements</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[180px]">
                <div className="text-4xl font-bold text-indigo-400 flex items-center justify-center gap-2">
                  <Award size={28} />
                  <span>{filteredAwards.length}</span>
                </div>
                <span>Total Achievements</span>
              </div>
            </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Search className="mr-2" size={20} />
                Filter Awards
              </h2>
              
              <AwardFilters 
                awards={awards} 
                filters={filters} 
                onFiltersChange={setFilters} 
              />
            </div>
          </div>
          
          {/* Awards Grid */}
          <div className="lg:w-3/4">
            {filteredAwards.length > 0 ? (
              <>
                {/* Faculty Awards */}
                {facultyAwards.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <BookOpen className="mr-2" size={24} />
                      Faculty Awards &amp; Achievements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {facultyAwards.map((award, index) => (
                        <motion.div
                          key={award.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => handleAwardClick(award)}
                        >
                          <AwardCard award={award} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Student Awards */}
                {studentAwards.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Bookmark className="mr-2" size={24} />
                      Student Awards &amp; Achievements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {studentAwards.map((award, index) => (
                        <motion.div
                          key={award.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => handleAwardClick(award)}
                        >
                          <AwardCard award={award} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-16 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Award size={64} className="mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No awards found</h3>
                <p>Try adjusting your filters to find what you're looking for</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      
      {/* Award Details Modal */}
      {selectedAward && (
        <AwardDetails 
          award={selectedAward} 
          isOpen={isDetailsModalOpen} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default Awards;
