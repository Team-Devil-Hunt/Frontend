import Api from './Api';

/**
 * Meetings API Service
 * 
 * API Schema:
 * 
 * 1. List Meetings (with filters)
 * GET /api/meetings/
 * Query Params: start_date, end_date, status, meeting_type, search, upcoming
 * Response: Array of Meeting objects
 * 
 * 2. Get Upcoming Meetings
 * GET /api/meetings/?upcoming=true
 * Query Params: days (optional, default: 7)
 * Response: Array of Meeting objects
 * 
 * 3. Create a Meeting
 * POST /api/meetings/
 * Body: {
 *   faculty_id: number,
 *   student_id: number,
 *   title: string,
 *   description: string,
 *   date: string (YYYY-MM-DD),
 *   start_time: string (HH:MM),
 *   end_time: string (HH:MM),
 *   location: string,
 *   meeting_type: string,
 *   notes?: string
 * }
 * 
 * 4. Get Meeting by ID
 * GET /api/meetings/{meetingId}
 * Response: Meeting object
 * 
 * 5. Update Meeting
 * PUT /api/meetings/{meetingId}
 * Body: { ...updatedFields }
 * 
 * 6. Delete Meeting
 * DELETE /api/meetings/{meetingId}
 * 
 * 7. Update RSVP Status
 * POST /api/meetings/{meetingId}/rsvp
 * Query Params: rsvp_status, notes
 * 
 * 8. Get Meeting Types
 * GET /api/meetings/types
 * Response: Array of { value, label } objects
 * 
 * 9. Get Faculty Availability
 * GET /api/meetings/{facultyId}/availability
 * Query Params: date (YYYY-MM-DD)
 * Response: { date, faculty_id, available_slots: Array }
 * 
 * 10. Get Faculty Members
 * GET /api/faculty
 * Query Params: search, department
 * Response: Array of Faculty objects
 */

const MeetingsApi = {
  /**
   * Fetches meetings for a specific student with optional filters
   * @param {string} studentId - The ID of the student
   * @param {Object} filters - Filter options
   * @param {string} [filters.status] - Filter by status (e.g., 'upcoming', 'past')
   * @param {string} [filters.meeting_type] - Filter by meeting type
   * @param {string} [filters.start_date] - Start date for range filter (YYYY-MM-DD)
   * @param {string} [filters.end_date] - End date for range filter (YYYY-MM-DD)
   * @returns {Promise<Array>} - Array of meeting objects
   */
  /**
   * List all meetings with optional filters
   * @param {Object} filters - Filter options
   * @param {string} [filters.status] - Filter by meeting status
   * @param {string} [filters.meeting_type] - Filter by meeting type
   * @param {string} [filters.start_date] - Start date for range filter (YYYY-MM-DD)
   * @param {string} [filters.end_date] - End date for range filter (YYYY-MM-DD)
   * @param {string} [filters.search] - Search term for title/description
   * @returns {Promise<Array>} - Array of meeting objects
   */
  listMeetings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.meeting_type) params.append('meeting_type', filters.meeting_type);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.search) params.append('search', filters.search);
      
      console.log('Fetching meetings with params:', params.toString());
      const response = await Api.get(`/api/meetings/?${params.toString()}`);
      console.log('Meetings API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  },
  
  /**
   * Get upcoming meetings for the current user
   * @param {number} days - Number of days to look ahead (default: 7)
   * @returns {Promise<Array>} - Array of upcoming meeting objects
   */
  getUpcomingMeetings: async (days = 7) => {
    try {
      console.log('Fetching upcoming meetings for next', days, 'days');
      const response = await Api.get(`/api/meetings/?upcoming=true&days=${days}`);
      console.log('Upcoming meetings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  },

  /**
   * Create a new meeting
   * @param {Object} meetingData - Meeting details
   * @returns {Promise<Object>} - Created meeting object
   */
  createMeeting: async (meetingData) => {
    try {
      // Ensure meeting_type is lowercase to match backend enum values
      if (meetingData.meeting_type) {
        meetingData.meeting_type = meetingData.meeting_type.toLowerCase();
      }
      
      // Ensure status and rsvp_status are lowercase to match backend enum values
      if (meetingData.status) {
        meetingData.status = meetingData.status.toLowerCase();
      }
      
      if (meetingData.rsvp_status) {
        meetingData.rsvp_status = meetingData.rsvp_status.toLowerCase();
      }
      
      // Log the user state before making the request
      const globalState = localStorage.getItem('globalState');
      const parsedState = globalState ? JSON.parse(globalState) : {};
      console.log('User state before creating meeting:', parsedState?.user);
      
      // Make the API request with withCredentials to ensure cookies are sent
      const response = await Api.post('/api/meetings/', meetingData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = '/login';
        throw new Error('Authentication required. Please log in.');
      }
      const errorMessage = error.response?.data?.detail || 'Failed to create meeting';
      throw new Error(errorMessage);
    }
  },

  /**
   * Updates the RSVP status for a meeting
   * @param {string} meetingId - The ID of the meeting
   * @param {string} rsvp_status - The new RSVP status ('CONFIRMED', 'TENTATIVE', 'DECLINED')
   * @param {string} [rsvp_notes] - Optional notes for the RSVP
   * @returns {Promise<Object>} - Updated meeting object
   */
  updateRsvpStatus: async (meetingId, rsvp_status, rsvp_notes = '') => {
    try {
      const params = new URLSearchParams();
      params.append('rsvp_status', rsvp_status);
      if (rsvp_notes) params.append('rsvp_notes', rsvp_notes);
      
      const response = await Api.post(`/api/meetings/${meetingId}/rsvp?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      throw error;
    }
  },

  /**
   * Fetches a list of all faculty members
   * @param {Object} filters - Filter options
   * @param {string} [filters.search] - Search term for name/email/department
   * @param {string} [filters.department] - Filter by department
   * @returns {Promise<Array>} - Array of faculty objects
   */
  getFacultyMembers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      
      // Faculty endpoint is in a different router
      const response = await Api.get(`/api/faculty/?${params.toString()}`);
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.faculty && Array.isArray(response.data.faculty)) {
        // If the response has a faculty property that's an array
        return response.data.faculty;
      } else {
        console.warn('Unexpected faculty data format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching faculty members:', error);
      return [];
    }
  },

  /**
   * Cancels a meeting
   * @param {string} meetingId - The ID of the meeting to cancel
   * @returns {Promise<Object>} - Updated meeting object
   */
  /**
   * Delete a meeting
   * @param {number} meetingId - The ID of the meeting to delete
   * @returns {Promise<void>}
   */
  deleteMeeting: async (meetingId) => {
    try {
      await Api.delete(`/api/meetings/${meetingId}`);
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },
  
  /**
   * Update a meeting
   * @param {number} meetingId - The ID of the meeting
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} - Updated meeting object
   */
  updateMeeting: async (meetingId, updateData) => {
    try {
      const response = await Api.put(`/api/meetings/${meetingId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  /**
   * Gets meeting details by ID
   * @param {string} meetingId - The ID of the meeting
   * @returns {Promise<Object>} - Meeting details
   */
  getMeetingById: async (meetingId) => {
    try {
      const response = await Api.get(`/api/meetings/${meetingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  },

  /**
   * Gets meeting types
   * @returns {Promise<Array>} - Array of meeting type objects
   */
  getMeetingTypes: async () => {
    try {
      console.log('Fetching meeting types');
      // Use the updated endpoint path
      const response = await Api.get('/api/meetings/types');
      console.log('Meeting types API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching meeting types:', error);
      // Return hardcoded meeting types as fallback
      return [
        {"value": "advising", "label": "Advising"},
        {"value": "thesis", "label": "Thesis"},
        {"value": "project", "label": "Project"},
        {"value": "general", "label": "General"},
        {"value": "other", "label": "Other"}
      ];
    }
  },

  /**
   * Get faculty availability for a specific date
   * @param {number} facultyId - Faculty ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} - Array of available time slots
   */
  getFacultyAvailability: async (facultyId, date) => {
    try {
      console.log(`Fetching availability for faculty ${facultyId} on ${date}`);
      const response = await Api.get(`/api/meetings/faculty/${facultyId}/availability?date=${date}`);
      console.log('Faculty availability response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching faculty availability:', error);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  },
};

export default MeetingsApi;
