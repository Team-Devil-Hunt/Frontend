import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NoticeFilters from '../components/notices/NoticeFilters'
import NoticeCard from '../components/notices/NoticeCard'
import NoticeArchive from '../components/notices/NoticeArchive'

/*
API Schema:
GET /api/notices
{
  notices: [
    {
      id: string,
      title: string,
      summary: string,
      content: string,
      category: 'academic' | 'administrative' | 'general' | 'exam' | 'event' | 'scholarship',
      priority: 'high' | 'medium' | 'low',
      publishedDate: string (ISO date),
      expiryDate: string (ISO date) | null,
      department: string | null,
      attachments: [
        {
          id: string,
          name: string,
          url: string,
          type: string,
          size: number
        }
      ] | null,
      externalLink: string | null,
      isArchived: boolean
    }
  ]
}
*/

// Mock data for notices
const mockNotices = [
  {
    id: '1',
    title: 'Fall 2025 Registration Deadline Extended',
    summary: 'The registration deadline for Fall 2025 semester has been extended to August 15, 2025. All students must complete their registration by this date.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'academic',
    priority: 'high',
    publishedDate: '2025-07-01T10:00:00Z',
    expiryDate: '2025-08-15T23:59:59Z',
    department: 'Registrar\'s Office',
    attachments: [{
      id: 'a1',
      name: 'Registration_Guidelines_Fall2025.pdf',
      url: '#',
      type: 'application/pdf',
      size: 2500000
    }],
    externalLink: null,
    isArchived: false
  },
  {
    id: '2',
    title: 'Faculty Meeting: Curriculum Review',
    summary: 'All faculty members are invited to attend the curriculum review meeting on July 10, 2025 at 2:00 PM in Room 301.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'administrative',
    priority: 'medium',
    publishedDate: '2025-07-02T09:30:00Z',
    expiryDate: '2025-07-10T14:00:00Z',
    department: 'Academic Affairs',
    attachments: null,
    externalLink: null,
    isArchived: false
  },
  {
    id: '3',
    title: 'Campus Wi-Fi Maintenance',
    summary: 'The campus Wi-Fi network will be undergoing maintenance on July 8, 2025 from 10:00 PM to 2:00 AM.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'general',
    priority: 'low',
    publishedDate: '2025-07-03T14:15:00Z',
    expiryDate: '2025-07-09T02:00:00Z',
    department: 'IT Services',
    attachments: null,
    externalLink: null,
    isArchived: false
  },
  {
    id: '4',
    title: 'Final Examination Schedule Released',
    summary: 'The final examination schedule for Spring 2025 has been released. Please check the attached document for your exam dates and times.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'exam',
    priority: 'high',
    publishedDate: '2025-07-04T11:00:00Z',
    expiryDate: '2025-07-30T23:59:59Z',
    department: 'Examination Committee',
    attachments: [{
      id: 'a3',
      name: 'Final_Exam_Schedule_Spring2025.pdf',
      url: '#',
      type: 'application/pdf',
      size: 3500000
    }],
    externalLink: null,
    isArchived: false
  },
  {
    id: '5',
    title: 'Guest Lecture: AI in Healthcare',
    summary: 'Dr. Sarah Johnson from Stanford University will be giving a guest lecture on "AI Applications in Healthcare" on July 12, 2025.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'event',
    priority: 'medium',
    publishedDate: '2025-07-05T09:00:00Z',
    expiryDate: '2025-07-12T15:00:00Z',
    department: 'Department of Computer Science',
    attachments: null,
    externalLink: 'https://example.com/ai-healthcare-lecture',
    isArchived: false
  },
  {
    id: '6',
    title: 'Microsoft Research Scholarship Applications Open',
    summary: 'Applications for the Microsoft Research Scholarship for the academic year 2025-2026 are now open.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'scholarship',
    priority: 'medium',
    publishedDate: '2025-07-05T10:30:00Z',
    expiryDate: '2025-08-01T23:59:59Z',
    department: 'Office of Financial Aid',
    attachments: null,
    externalLink: 'https://example.com/microsoft-scholarship',
    isArchived: false
  },
  {
    id: '7',
    title: 'Summer Internship Opportunities',
    summary: 'Several companies have posted summer internship opportunities for CSE students.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'academic',
    priority: 'medium',
    publishedDate: '2025-01-15T09:00:00Z',
    expiryDate: '2025-03-30T23:59:59Z',
    department: 'Career Services',
    attachments: null,
    externalLink: 'https://example.com/career-portal',
    isArchived: true
  },
  {
    id: '8',
    title: 'Spring 2025 Graduation Ceremony',
    summary: 'The Spring 2025 Graduation Ceremony will be held on April 30, 2025 at 10:00 AM in the University Stadium.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'event',
    priority: 'high',
    publishedDate: '2025-03-01T10:00:00Z',
    expiryDate: '2025-04-30T10:00:00Z',
    department: 'Office of the Registrar',
    attachments: null,
    externalLink: null,
    isArchived: true
  }
];

const Notices = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    department: '',
    year: '',
    timeframe: 'current'
  })

  const [filteredNotices, setFilteredNotices] = useState([])
  
  const categories = [
    { value: 'academic', label: 'Academic', activeClass: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'administrative', label: 'Administrative', activeClass: 'bg-purple-500 hover:bg-purple-600' },
    { value: 'general', label: 'General', activeClass: 'bg-green-500 hover:bg-green-600' },
    { value: 'exam', label: 'Exam', activeClass: 'bg-red-500 hover:bg-red-600' },
    { value: 'event', label: 'Event', activeClass: 'bg-amber-500 hover:bg-amber-600' },
    { value: 'scholarship', label: 'Scholarship', activeClass: 'bg-cyan-500 hover:bg-cyan-600' }
  ]
  
  const departments = [
    'Department of Computer Science',
    'Academic Affairs',
    'Registrar\'s Office',
    'IT Services',
    'Examination Committee',
    'Office of Financial Aid',
    'Career Services',
    'Office of the Registrar'
  ]
  
  const years = ['2025', '2024', '2023', '2022']
  
  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'current').length
  
  useEffect(() => {
    let result = [...mockNotices]
    
    if (filters.timeframe === 'current') {
      result = result.filter(notice => !notice.isArchived)
    } else {
      result = result.filter(notice => notice.isArchived)
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm) || 
        notice.summary.toLowerCase().includes(searchTerm) ||
        (notice.department && notice.department.toLowerCase().includes(searchTerm))
      )
    }
    
    if (filters.category) {
      result = result.filter(notice => notice.category === filters.category)
    }
    
    if (filters.department) {
      result = result.filter(notice => notice.department === filters.department)
    }
    
    if (filters.year) {
      result = result.filter(notice => {
        const noticeYear = new Date(notice.publishedDate).getFullYear().toString()
        return noticeYear === filters.year
      })
    }
    
    result.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    
    setFilteredNotices(result)
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-center mb-2">Notices & Announcements</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Stay updated with the latest announcements, notices, and important information from the Department of Computer Science and Engineering.
        </p>
      </motion.div>
      
      <NoticeFilters 
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        departments={departments}
        years={years}
        activeFiltersCount={activeFiltersCount}
      />
      
      {filters.timeframe === 'current' ? (
        <div className="space-y-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <NoticeCard key={notice.id} notice={notice} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">No notices found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search criteria to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <NoticeArchive notices={filteredNotices} years={years} />
      )}
    </div>
  )
}

export default Notices
