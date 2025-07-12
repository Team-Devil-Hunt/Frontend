import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, Clock, Archive, Plus } from 'lucide-react';
import MeetingCard from '../../components/meetings/MeetingCard';
import MeetingFilters from '../../components/meetings/MeetingFilters';
import MeetingRSVP from '../../components/meetings/MeetingRSVP';

/*
API Schema:

GET /api/meetings/student/:studentId
Response: {
  meetings: [
    {
      id: string,
      title: string,
      description: string,
      facultyName: string,
      facultyId: string,
      facultyDepartment: string,
      facultyImage?: string,
      date: string (ISO date),
      startTime: string (HH:MM),
      endTime: string (HH:MM),
      location: string,
      type: 'academic' | 'research' | 'career' | 'general',
      status: 'upcoming' | 'completed' | 'cancelled',
      rsvpStatus: 'confirmed' | 'pending' | 'declined' | null,
      rsvpDeadline: string (ISO date),
      notes?: string,
      attachments?: Array<{name: string, url: string}>,
      isArchived: boolean
    }
  ]
}

POST /api/meetings/:meetingId/rsvp
Request: {
  studentId: string,
  status: 'confirmed' | 'declined',
  notes?: string
}
Response: {
  success: boolean,
  meeting: {
    id: string,
    rsvpStatus: 'confirmed' | 'declined'
  }
}
*/

// Mock data for meetings
const mockMeetings = [
  {
    id: 'meeting-001',
    title: 'Final Year Project Discussion',
    description: 'Discussion about your machine learning project progress and next steps.',
    facultyName: 'Dr. Rashida Ahmed',
    facultyId: 'faculty-001',
    facultyDepartment: 'Computer Science and Engineering',
    facultyImage: '/assets/profile-placeholder.jpg',
    date: '2025-07-10',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Room 302, CSE Building',
    type: 'academic',
    status: 'upcoming',
    rsvpStatus: 'confirmed',
    rsvpDeadline: '2025-07-09',
    notes: 'Please bring your latest experiment results and code repository access.',
    isArchived: false
  },
  {
    id: 'meeting-002',
    title: 'Research Collaboration Opportunity',
    description: 'Discussion about joining the NLP research team for Bangla language processing.',
    facultyName: 'Prof. Mohammad Karim',
    facultyId: 'faculty-002',
    facultyDepartment: 'Computer Science and Engineering',
    facultyImage: '/assets/profile-placeholder.jpg',
    date: '2025-07-15',
    startTime: '11:30',
    endTime: '12:30',
    location: 'Faculty Room 105, CSE Building',
    type: 'research',
    status: 'upcoming',
    rsvpStatus: 'pending',
    rsvpDeadline: '2025-07-12',
    isArchived: false
  },
  {
    id: 'meeting-003',
    title: 'Career Guidance Session',
    description: 'One-on-one career counseling session to discuss your post-graduation plans.',
    facultyName: 'Dr. Fatima Khan',
    facultyId: 'faculty-005',
    facultyDepartment: 'Computer Science and Engineering',
    facultyImage: '/assets/profile-placeholder.jpg',
    date: '2025-07-20',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Career Center, Main Building',
    type: 'career',
    status: 'upcoming',
    rsvpStatus: null,
    rsvpDeadline: '2025-07-18',
    isArchived: false
  },
  {
    id: 'meeting-004',
    title: 'Course Registration Guidance',
    description: 'Meeting to discuss your course selection for the upcoming semester.',
    facultyName: 'Prof. Aminul Haque',
    facultyId: 'faculty-007',
    facultyDepartment: 'Computer Science and Engineering',
    facultyImage: '/assets/profile-placeholder.jpg',
    date: '2025-06-15',
    startTime: '09:30',
    endTime: '10:00',
    location: 'Room 201, CSE Building',
    type: 'academic',
    status: 'completed',
    rsvpStatus: 'confirmed',
    rsvpDeadline: '2025-06-14',
    isArchived: true
  },
  {
    id: 'meeting-005',
    title: 'Thesis Defense Preparation',
    description: 'Meeting to review your thesis presentation and prepare for defense.',
    facultyName: 'Dr. Rashida Ahmed',
    facultyId: 'faculty-001',
    facultyDepartment: 'Computer Science and Engineering',
    facultyImage: '/assets/profile-placeholder.jpg',
    date: '2025-06-05',
    startTime: '15:00',
    endTime: '16:30',
    location: 'Conference Room, CSE Building',
    type: 'academic',
    status: 'completed',
    rsvpStatus: 'confirmed',
    rsvpDeadline: '2025-06-03',
    isArchived: true
  }
];

const StudentMeetings = () => {
  // State for filters and selected meeting
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    status: 'upcoming', // 'upcoming', 'completed', 'all'
    faculty: [],
    showArchived: false
  });
  
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  
  // Filter meetings based on selected filters
  const filteredMeetings = useMemo(() => {
    return mockMeetings.filter(meeting => {
      // Search filter
      if (filters.search && !(
        meeting.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        meeting.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        meeting.facultyName.toLowerCase().includes(filters.search.toLowerCase())
      )) {
        return false;
      }
      
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(meeting.type)) {
        return false;
      }
      
      // Status filter
      if (filters.status === 'upcoming' && meeting.status !== 'upcoming') {
        return false;
      }
      if (filters.status === 'completed' && meeting.status !== 'completed') {
        return false;
      }
      
      // Faculty filter
      if (filters.faculty.length > 0 && !filters.faculty.includes(meeting.facultyId)) {
        return false;
      }
      
      // Archive filter
      if (!filters.showArchived && meeting.isArchived) {
        return false;
      }
      
      return true;
    });
  }, [filters]);
  
  const handleRSVP = (meeting) => {
    setSelectedMeeting(meeting);
    // Add a small delay to prevent React state batching issues
    setTimeout(() => {
      setIsRSVPModalOpen(true);
    }, 50);
  };
  
  const handleRSVPSubmit = (meetingId, status, notes) => {
    // This would be an API call in a real application
    console.log(`RSVP for meeting ${meetingId}: ${status}`, notes);
    
    // Update the mock data for demonstration
    const updatedMeetings = mockMeetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          rsvpStatus: status
        };
      }
      return meeting;
    });
    
    // In a real app, we would update state with the response from the API
    // Close modal after submission is complete
    setTimeout(() => {
      setIsRSVPModalOpen(false);
      setSelectedMeeting(null);
    }, 2500); // Allow time for success animation
  };
  
  const handleArchiveToggle = (meetingId) => {
    // This would be an API call in a real application
    console.log(`Toggle archive for meeting ${meetingId}`);
    
    // Update the mock data for demonstration
    const updatedMeetings = mockMeetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          isArchived: !meeting.isArchived
        };
      }
      return meeting;
    });
    
    // In a real app, we would update state with the response from the API
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Faculty Meetings</h1>
        <p className="text-gray-600">
          Manage your scheduled meetings with faculty members
        </p>
      </div>
      
      {/* Filters */}
      <MeetingFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Meetings</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockMeetings.filter(m => m.status === 'upcoming' && !m.isArchived).length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockMeetings.filter(m => m.status === 'completed' && !m.isArchived).length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Archive className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Archived</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockMeetings.filter(m => m.isArchived).length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MeetingCard 
                meeting={meeting} 
                onRSVP={handleRSVP}
                onArchiveToggle={handleArchiveToggle}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="bg-white rounded-lg shadow p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings found</h3>
            <p className="text-gray-500 mb-4">
              {filters.showArchived 
                ? "No archived meetings match your filters." 
                : "No upcoming meetings match your filters."}
            </p>
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Meeting
            </button>
          </motion.div>
        )}
      </div>
      
      {/* RSVP Modal */}
      <MeetingRSVP
        meeting={selectedMeeting}
        isOpen={isRSVPModalOpen}
        onClose={() => {
          setIsRSVPModalOpen(false);
          // Clear selected meeting after modal closes
          setTimeout(() => setSelectedMeeting(null), 300);
        }}
        onSubmit={handleRSVPSubmit}
      />
    </div>
  );
};

export default StudentMeetings;
