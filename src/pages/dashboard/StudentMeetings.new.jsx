import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter, Clock, Archive, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateProvider';
import Api from '../../constant/Api';
import MeetingCard from '../../components/meetings/MeetingCard';
import MeetingFilters from '../../components/meetings/MeetingFilters';
import MeetingRSVP from '../../components/meetings/MeetingRSVP';
import RequestMeetingDialog from '../../components/meetings/RequestMeetingDialog';

// API endpoints
const MEETINGS_API = {
  getMeetings: (studentId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.meeting_type) params.append('meeting_type', filters.meeting_type);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    
    return Api.get(`/meetings/student/${studentId}?${params.toString()}`);
  },
  updateRsvp: (meetingId, status) => 
    Api.post(`/meetings/${meetingId}/rsvp?rsvp_status=${status}`)
};

const StudentMeetings = () => {
  const { globalState } = useGlobalState();
  const queryClient = useQueryClient();
  const studentId = globalState?.user?.id;
  
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: 'upcoming',
    meeting_type: 'all',
    types: [],
    start_date: '',
    end_date: ''
  });
  
  // Fetch meetings data
  const { data: meetings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['studentMeetings', studentId, filters],
    queryFn: () => 
      MEETINGS_API.getMeetings(studentId, filters)
        .then(res => res.data)
        .then(meetings => 
          meetings.map(m => ({
            ...m,
            facultyImage: m.faculty_image || '/assets/profile-placeholder.jpg',
            startTime: m.start_time,
            endTime: m.end_time,
            meetingType: m.meeting_type,
            rsvpStatus: m.rsvp_status,
            rsvpDeadline: m.rsvp_deadline,
            isArchived: m.status === 'COMPLETED' || m.status === 'CANCELLED'
          }))
        ),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Update RSVP mutation
  const updateRsvpMutation = useMutation({
    mutationFn: ({ meetingId, status }) => 
      Api.post(`/meetings/${meetingId}/rsvp`, { status }),
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
  
  const handleRsvpUpdate = (meetingId, status) => {
    updateRsvpMutation.mutate({ meetingId, status });
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter(meeting => {
      // Apply filters here
      return true;
    });
  }, [meetings, filters]);

  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'SCHEDULED' || m.status === 'CONFIRMED');
  const pastMeetings = filteredMeetings.filter(m => m.status === 'COMPLETED' || m.status === 'CANCELLED');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load meetings. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings found</h3>
              <p className="text-gray-500 mb-4">
                {filters.status === 'COMPLETED' || filters.status === 'CANCELLED'
                  ? "No archived meetings match your filters." 
                  : "No upcoming meetings match your filters."}
              </p>
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowRequestDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Request a Meeting
              </button>
            </motion.div>
          )}
        </div>
        
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
