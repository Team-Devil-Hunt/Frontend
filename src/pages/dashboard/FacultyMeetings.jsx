import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Filter, Users } from 'lucide-react';

/*
API Schema:

GET /api/meetings/faculty/:facultyId
Response: {
  meetings: [
    {
      id: string,
      title: string,
      description: string,
      studentName: string,
      studentId: string,
      studentDepartment: string,
      studentBatch: string,
      studentImage?: string,
      date: string (ISO date),
      startTime: string (HH:MM),
      endTime: string (HH:MM),
      location: string,
      type: 'academic' | 'research' | 'career' | 'general',
      status: 'upcoming' | 'completed' | 'cancelled',
      studentRsvpStatus: 'confirmed' | 'pending' | 'declined' | null,
      notes?: string,
      isArchived: boolean
    }
  ]
}

POST /api/meetings
Request: {
  facultyId: string,
  title: string,
  description: string,
  studentId: string,
  date: string (ISO date),
  startTime: string (HH:MM),
  endTime: string (HH:MM),
  location: string,
  type: string,
  notes?: string
}
Response: {
  success: boolean,
  meeting: {
    id: string,
    ...meeting data
  }
}
*/

// Mock data for meetings
const mockMeetings = [
  {
    id: 'meeting-001',
    title: 'Final Year Project Discussion',
    description: 'Discussion about machine learning project progress and next steps.',
    studentName: 'Fahim Rahman',
    studentId: 'student-001',
    studentDepartment: 'Computer Science and Engineering',
    studentBatch: '25',
    studentImage: '/assets/profile-placeholder.jpg',
    date: '2025-07-10',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Room 302, CSE Building',
    type: 'academic',
    status: 'upcoming',
    studentRsvpStatus: 'confirmed',
    notes: 'Please bring latest experiment results and code repository access.',
    isArchived: false
  },
  {
    id: 'meeting-002',
    title: 'Research Collaboration Opportunity',
    description: 'Discussion about joining the NLP research team for Bangla language processing.',
    studentName: 'Nusrat Jahan',
    studentId: 'student-002',
    studentDepartment: 'Computer Science and Engineering',
    studentBatch: '24',
    studentImage: '/assets/profile-placeholder.jpg',
    date: '2025-07-15',
    startTime: '11:30',
    endTime: '12:30',
    location: 'Faculty Room 105, CSE Building',
    type: 'research',
    status: 'upcoming',
    studentRsvpStatus: 'pending',
    isArchived: false
  },
  {
    id: 'meeting-003',
    title: 'Career Guidance Session',
    description: 'One-on-one career counseling session to discuss post-graduation plans.',
    studentName: 'Tahmid Khan',
    studentId: 'student-003',
    studentDepartment: 'Computer Science and Engineering',
    studentBatch: '23',
    studentImage: '/assets/profile-placeholder.jpg',
    date: '2025-07-20',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Career Center, Main Building',
    type: 'career',
    status: 'upcoming',
    studentRsvpStatus: null,
    isArchived: false
  }
];

const FacultyMeetings = () => {
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    status: 'upcoming',
    batch: [],
    showArchived: false
  });

  // Filter meetings based on selected filters
  const filteredMeetings = useMemo(() => {
    return mockMeetings.filter(meeting => {
      // Filter logic would go here
      return true;
    });
  }, [filters]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Meetings</h1>
        <p className="text-gray-600">
          Manage your scheduled meetings with students
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Meeting
        </button>
        
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter Meetings
        </button>
      </div>
      
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
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(mockMeetings.map(m => m.studentId)).size}
            </p>
          </div>
        </div>
      </div>
      
      {/* Meetings List - Simplified for now */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting, index) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className={`h-2 ${meeting.type === 'academic' ? 'bg-blue-600' : meeting.type === 'research' ? 'bg-purple-600' : 'bg-green-600'}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{meeting.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                </div>
                <div>
                  {meeting.studentRsvpStatus === 'confirmed' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Confirmed
                    </span>
                  ) : meeting.studentRsvpStatus === 'declined' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Declined
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Pending
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <img
                  src={meeting.studentImage || '/assets/profile-placeholder.jpg'}
                  alt={meeting.studentName}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{meeting.studentName}</p>
                  <p className="text-xs text-gray-500">Batch {meeting.studentBatch}, {meeting.studentDepartment}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {meeting.startTime} - {meeting.endTime}
                </div>
                <div className="flex items-center text-sm text-gray-600 md:col-span-2">
                  {meeting.location}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-end items-center mt-4 pt-3 border-t border-gray-100">
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2">
                  View Details
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel Meeting
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FacultyMeetings;
