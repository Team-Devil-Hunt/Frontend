/*
 * API Schema for Home Page:
 * 
 * GET /api/overview
 * Response: {
 *   title: string,
 *   description: string,
 *   stats: {
 *     students: number,
 *     faculty: number,
 *     programs: number,
 *     research: number
 *   },
 *   heroImage: string
 * }
 * 
 * GET /api/announcements
 * Response: {
 *   announcements: [{
 *     id: string,
 *     title: string,
 *     content: string,
 *     date: string,
 *     type: 'academic' | 'admin' | 'general',
 *     priority: 'high' | 'medium' | 'low',
 *     image?: string
 *   }]
 * }
 * 
 * GET /api/quick-links
 * Response: {
 *   links: [{
 *     id: string,
 *     title: string,
 *     description: string,
 *     href: string,
 *     icon: string,
 *     category: string
 *   }]
 * }
 */

import React from 'react'

// Import components
import HeroSection from '../components/home/HeroSection'
import AnnouncementsSection from '../components/home/AnnouncementsSection'
import QuickLinksSection from '../components/home/QuickLinksSection'
import CallToActionSection from '../components/home/CallToActionSection'

// Import images
import department1 from '../assets/department1.jpg'
import department2 from '../assets/department2.jpg'
import department3 from '../assets/department3.jpg'
import department4 from '../assets/department4.jpg'
import chairman1 from '../assets/chairman1.jpg'

import { useEffect , useState } from 'react'
import Api from '../constant/Api'

// Mock API Data
const mockOverviewData = {
  title: "Department of Computer Science & Engineering",
  description: "Leading the future of technology education and research at the University of Dhaka. Our department is committed to excellence in computer science education, cutting-edge research, and innovation that shapes tomorrow's digital world.",
  stats: {
    students: 1200,
    faculty: 45,
    programs: 8,
    research: 150
  },
  heroImage: department1
}

// const mockAnnouncementsData = {
//   announcements: [
//     {
//       id: '1',
//       title: 'Spring 2024 Semester Registration Open',
//       content: 'Registration for Spring 2024 semester is now open. Students can register for courses through the online portal until January 15, 2024.',
//       date: '2024-01-05',
//       type: 'academic',
//       priority: 'high',
//       image: department2
//     },
//     {
//       id: '2',
//       title: 'Research Symposium 2024',
//       content: 'Annual research symposium showcasing student and faculty research projects. Join us on February 20-21, 2024.',
//       date: '2024-01-03',
//       type: 'academic',
//       priority: 'medium',
//       image: department3
//     },
//     {
//       id: '3',
//       title: 'New Faculty Joining',
//       content: 'We welcome Dr. Sarah Ahmed and Dr. Mohammad Rahman to our faculty team, bringing expertise in AI and Cybersecurity.',
//       date: '2024-01-01',
//       type: 'general',
//       priority: 'medium',
//       image: chairman1
//     },
//     {
//       id: '4',
//       title: 'Lab Equipment Upgrade',
//       content: 'Our computer labs have been upgraded with latest hardware and software to enhance student learning experience.',
//       date: '2023-12-28',
//       type: 'admin',
//       priority: 'low',
//       image: department4
//     }
//   ]
// }

const mockQuickLinksData = {
  links: [
    {
      id: '1',
      title: 'Academic Programs',
      description: 'Explore our undergraduate and graduate programs',
      href: '/programs',
      icon: 'GraduationCap',
      category: 'Academic'
    },
    {
      id: '2',
      title: 'Faculty Directory',
      description: 'Meet our distinguished faculty members',
      href: '/faculty',
      icon: 'Users',
      category: 'People'
    },
    {
      id: '3',
      title: 'Course Catalog',
      description: 'Browse available courses and descriptions',
      href: '/courses',
      icon: 'BookOpen',
      category: 'Academic'
    },
    {
      id: '4',
      title: 'Admissions',
      description: 'Apply to join our department',
      href: '/admissions',
      icon: 'FileText',
      category: 'Admissions'
    },
    {
      id: '5',
      title: 'Class Schedule',
      description: 'View current semester schedules',
      href: '/schedule',
      icon: 'Calendar',
      category: 'Academic'
    },
    {
      id: '6',
      title: 'Research Projects',
      description: 'Discover ongoing research initiatives',
      href: '/projects',
      icon: 'Award',
      category: 'Research'
    },
    {
      id: '7',
      title: 'Contact Us',
      description: 'Get in touch with our department',
      href: '/contact',
      icon: 'Phone',
      category: 'Contact'
    },
    {
      id: '8',
      title: 'Student Portal',
      description: 'Access grades, assignments, and more',
      href: '/login',
      icon: 'ExternalLink',
      category: 'Student'
    }
  ]
}

const Home = () => {
  // Animation variants
  const variants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5
        }
      }
    }
  }


  const [overviewData, setOverviewData] = useState(mockOverviewData);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [quickLinksData, setQuickLinksData] = useState({ links: [] });
  const [loading, setLoading] = useState({
    overview: true,
    announcements: true,
    quickLinks: true
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(prev => ({ ...prev, overview: true }));
        const response = await Api.get('api/overview');
        setOverviewData(response.data);
        console.log('Overview data:', response.data);
      } catch (error) {
        console.error('Error fetching overview data:', error);
        // Fallback to mock data if API fails
      } finally {
        setLoading(prev => ({ ...prev, overview: false }));
      }
    };

    const fetchAnnouncementsData = async () => {
      try {
        setLoading(prev => ({ ...prev, announcements: true }));
        const response = await Api.get('api/announcements');
        setAnnouncementsData(response.data);
        console.log('Announcements data:', response.data);
      } catch (error) {
        console.error('Error fetching announcements data:', error);
      } finally {
        setLoading(prev => ({ ...prev, announcements: false }));
      }
    };

    const fetchQuickLinksData = async () => {
      try {
        setLoading(prev => ({ ...prev, quickLinks: true }));
        const response = await Api.get('api/quick-links');
        setQuickLinksData(response.data);
        console.log('Quick links data:', response.data);
      } catch (error) {
        console.error('Error fetching quick links data:', error);
        // Fallback to mock data if API fails
        setQuickLinksData(mockQuickLinksData);
      } finally {
        setLoading(prev => ({ ...prev, quickLinks: false }));
      }
    };

    fetchOverviewData();
    fetchAnnouncementsData();
    fetchQuickLinksData();
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <HeroSection data={overviewData} variants={variants} loading={loading.overview} />
      <AnnouncementsSection data={announcementsData} variants={variants} loading={loading.announcements} />
      <QuickLinksSection data={quickLinksData} variants={variants} loading={loading.quickLinks} />
      <CallToActionSection variants={variants} />
    </div>
  )
}

export default Home
