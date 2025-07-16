import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { BaseUrl } from '../services/BaseUrl';

// Mock data for notices (same as in Notices.jsx)
const mockNotices = [
  {
    id: '1',
    title: 'Fall 2025 Registration Deadline Extended',
    summary: 'The registration deadline for Fall 2025 semester has been extended to August 15, 2025. All students must complete their registration by this date.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
    content: 'Dear Faculty Members,\n\nYou are cordially invited to attend the upcoming curriculum review meeting scheduled for July 10, 2025 at 2:00 PM in Room 301. This meeting is mandatory for all department heads and program coordinators.\n\nAgenda:\n1. Review of current curriculum structure\n2. Discussion on proposed changes for the upcoming academic year\n3. Integration of new technologies in teaching methodologies\n4. Student feedback analysis\n5. Action items and next steps\n\nPlease come prepared with your suggestions and feedback. If you are unable to attend, kindly inform the Academic Affairs office at least 48 hours in advance.\n\nThank you for your cooperation.',
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
    content: 'Notice to all students and faculty:\n\nThe IT Services department will be conducting essential maintenance on the campus Wi-Fi network on July 8, 2025 from 10:00 PM to 2:00 AM. During this period, wireless internet services across campus will be intermittently unavailable.\n\nThis maintenance is necessary to improve network stability and security. We have scheduled this work during late night hours to minimize disruption to academic activities.\n\nPlease plan accordingly and save your work before the maintenance window begins. If you have any critical tasks that require internet access during this time, please use the wired connections available in the 24-hour computer labs.\n\nWe apologize for any inconvenience this may cause and appreciate your understanding as we work to improve our campus infrastructure.\n\nFor any questions or concerns, please contact the IT Help Desk at helpdesk@csedu.edu or call extension 4357 (HELP).',
    category: 'general',
    priority: 'low',
    publishedDate: '2025-07-03T14:15:00Z',
    expiryDate: '2025-07-09T02:00:00Z',
    department: 'IT Services',
    attachments: null,
    externalLink: null,
    isArchived: false
  }
];

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine badge color based on notice category
  const getBadgeColor = (category) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'administrative':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'general':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'event':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'scholarship':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const response = await axios.get(`${BaseUrl}/api/announcements/${id}`);
          
          // Transform backend data to match frontend expectations
          const transformedData = {
            id: response.data.id.toString(),
            title: response.data.title,
            summary: response.data.content.substring(0, 150) + '...',
            content: response.data.content,
            category: response.data.type.toLowerCase(),
            priority: response.data.priority.toLowerCase(),
            publishedDate: response.data.date,
            expiryDate: null, // Backend doesn't have this field yet
            department: 'Department of Computer Science', // Default department
            attachments: null, // Backend doesn't have this field yet
            externalLink: null, // Backend doesn't have this field yet
            isArchived: false // Assume all are current for now
          };
          
          setNotice(transformedData);
          setError(null);
        } catch (apiError) {
          console.error('Error fetching from API:', apiError);
          // Fallback to mock data if API fails
          const foundNotice = mockNotices.find(n => n.id === id);
          if (foundNotice) {
            setNotice(foundNotice);
            setError(null);
          } else {
            throw new Error('Notice not found');
          }
        }
      } catch (err) {
        console.error('Error fetching notice:', err);
        setError('Failed to load notice details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNoticeDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Notice Not Found</h2>
            <p className="text-gray-700 mb-6">The notice you're looking for doesn't exist or has been removed.</p>
            <Link to="/notices">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Back to Notices
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <Link to="/notices" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          <span>Back to Notices</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-100">
            <div className="p-6 md:p-8 bg-gradient-to-br from-white to-blue-50/30">
              <div className="mb-6">
                <div className="flex flex-wrap gap-3 mb-3">
                  <Badge className={`${getBadgeColor(notice.category)} shadow-sm font-medium`}>
                    {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                  </Badge>
                  
                  {notice.department && (
                    <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50">
                      {notice.department}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-indigo-900 mb-4">{notice.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-indigo-700 mb-6">
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Published: {formatDate(notice.publishedDate)}</span>
                  </div>
                  
                  {notice.expiryDate && (
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Expires: {formatDate(notice.expiryDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="prose prose-indigo max-w-none bg-white/50 p-6 rounded-lg border-l-2 border-indigo-200 mb-6">
                {notice.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8">
                {notice.attachments && notice.attachments.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors"
                    onClick={() => window.open(notice.attachments[0].url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {notice.attachments[0].name}</span>
                  </Button>
                )}
                
                {notice.externalLink && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800 transition-colors"
                    onClick={() => window.open(notice.externalLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit External Link</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NoticeDetail;
