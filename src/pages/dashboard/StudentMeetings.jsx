import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter, Clock, Archive, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateProvider';
import MeetingsApi from '../../constant/MeetingsApi';
import MeetingCard from '../../components/meetings/MeetingCard';
import MeetingFilters from '../../components/meetings/MeetingFilters';
import MeetingRSVP from '../../components/meetings/MeetingRSVP';
import RequestMeetingDialog from '../../components/meetings/RequestMeetingDialog';

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

// Using centralized MeetingsApi

const StudentMeetings = () => {
  const { globalState } = useGlobalState();
  const queryClient = useQueryClient();
  const studentId = globalState?.user?.id;
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: 'upcoming',
    meeting_type: 'all_types', // Use descriptive value instead of empty string
    types: [],
    start_date: '',
    end_date: '',
    search: '',
    faculty: [],
    showArchived: false
  });
  
  // Fetch meetings data
  const { data: meetings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['studentMeetings', studentId, filters],
    queryFn: async () => {
      console.log('Fetching meetings with filters:', filters);
      
      // Prepare API filters
      const apiFilters = {
        ...filters,
        // Convert descriptive values back to empty strings for API
        meeting_type: filters.meeting_type === 'all_types' ? '' : filters.meeting_type
      };
      
      // Use the centralized MeetingsApi
      const data = await MeetingsApi.listMeetings(apiFilters);
      console.log('Meetings data from API:', data);
      
      // Transform the data to match the component's expectations
      return data.map(m => ({
        ...m,
        id: m.id,
        facultyImage: m.faculty?.image || '/assets/profile-placeholder.jpg',
        facultyName: m.faculty?.name || 'Unknown Faculty',
        facultyId: m.faculty_id,
        facultyDepartment: m.faculty?.department || 'Unknown Department',
        startTime: m.start_time,
        endTime: m.end_time,
        meetingType: m.meeting_type,
        rsvpStatus: m.rsvp_status?.toLowerCase() || 'pending',
        rsvpDeadline: m.rsvp_deadline,
        // Convert backend status to frontend status format
        status: m.status?.toLowerCase() || 'upcoming',
        isArchived: m.status?.toUpperCase() === 'COMPLETED' || m.status?.toUpperCase() === 'CANCELLED'
      }));
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (err) => {
      console.error('Error fetching meetings:', err);
      toast.error('Failed to load meetings. Please try again.');
    }
  });
  
  // Update RSVP mutation
  const updateRsvpMutation = useMutation({
    mutationFn: ({ meetingId, status, notes }) => 
      MeetingsApi.updateRsvpStatus(meetingId, status, notes),
    onSuccess: () => {
      toast.success('RSVP updated successfully');
      queryClient.invalidateQueries(['studentMeetings', studentId]);
      setShowRSVPDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update RSVP');
    }
  });

  // Handle meeting request submission
  const handleMeetingRequested = (success) => {
    if (success) {
      queryClient.invalidateQueries(['studentMeetings', studentId]);
      setShowRequestDialog(false);
    }
  };
  
  const handleRsvpUpdate = (meetingId, status, notes = '') => {
    updateRsvpMutation.mutate({ meetingId, status, notes });
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter(meeting => {
      // Search filter
      if (filters.search && !(
        (meeting.title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (meeting.description || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (meeting.facultyName || '').toLowerCase().includes(filters.search.toLowerCase())
      )) {
        return false;
      }
      
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(meeting.meetingType)) {
        return false;
      }
      
      // Status filter
      if (filters.status === 'upcoming' && 
          meeting.status !== 'upcoming' && 
          meeting.status !== 'scheduled' && 
          meeting.status !== 'pending') {
        return false;
      }
      if (filters.status === 'completed' && 
          meeting.status !== 'completed' && 
          meeting.status !== 'cancelled') {
        return false;
      }
      
      // Faculty filter
      if (filters.faculty && filters.faculty.length > 0 && 
          !filters.faculty.includes(String(meeting.facultyId))) {
        return false;
      }
      
      // Archive filter
      if (!filters.showArchived && meeting.isArchived) {
        return false;
      }
      
      return true;
    });
  }, [meetings, filters]);

  const upcomingMeetings = filteredMeetings.filter(m => 
    m.status === 'upcoming' || 
    m.status === 'scheduled' || 
    m.status === 'pending'
  );
  
  const pastMeetings = filteredMeetings.filter(m => 
    m.status === 'completed' || 
    m.status === 'cancelled'
  );
  
  console.log('Filtered meetings:', { 
    all: filteredMeetings.length, 
    upcoming: upcomingMeetings.length, 
    past: pastMeetings.length 
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Meetings</h1>
            <p className="mt-2 text-sm text-gray-600">View and manage your scheduled meetings</p>
          </div>
          <button
            type="button"
            onClick={() => setShowRequestDialog(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Request Meeting
          </button>
        </div>
        
        {/* Request Meeting Dialog */}
        <RequestMeetingDialog 
          isOpen={showRequestDialog} 
          onClose={handleMeetingRequested}
          studentId={studentId}
        />
        
        {/* Filters */}
        <div className="mb-6">
          <MeetingFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
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
                {upcomingMeetings.length}
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
                {pastMeetings.length}
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
                {meetings.filter(m => m.isArchived).length}
              </p>
            </div>
          </div>
        </div>
      
      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length > 0 ? (
          <AnimatePresence>
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MeetingCard 
                    meeting={meeting} 
                    onRSVP={() => {
                      setSelectedMeeting(meeting);
                      setShowRSVPDialog(true);
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No upcoming meetings found</p>
              </div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div 
            className="bg-white rounded-lg shadow p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings found</h3>
            <p className="text-gray-500 mb-4">
              {filters.status === 'past' 
                ? "No past meetings match your filters." 
                : "No upcoming meetings match your filters."}
            </p>
            <button 
              onClick={() => setShowRequestDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Request Meeting
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Request Meeting Dialog */}
      <RequestMeetingDialog 
        isOpen={showRequestDialog} 
        onClose={handleMeetingRequested}
        studentId={studentId}
      />
      
      {/* RSVP Dialog */}
      <AnimatePresence>
        {showRSVPDialog && selectedMeeting && (
          <MeetingRSVP 
            meeting={selectedMeeting} 
            onClose={() => setShowRSVPDialog(false)}
            onConfirm={(status) => {
              handleRsvpUpdate(selectedMeeting.id, status);
            }}
            isLoading={updateRsvpMutation.isLoading}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentMeetings;
