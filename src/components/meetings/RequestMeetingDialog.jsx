import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar as CalendarIcon, Clock, MapPin, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Api from '../../constant/Api';
import MeetingsApi from '../../constant/MeetingsApi';

const RequestMeetingDialog = ({ isOpen, onClose, studentId }) => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    faculty_id: '',
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    meeting_type: 'advising', // lowercase to match backend enum values
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // Fetch faculty members when dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchFaculty = async () => {
        try {
          const faculty = await MeetingsApi.getFacultyMembers();
          // Ensure faculty is always an array
          setFacultyMembers(Array.isArray(faculty) ? faculty : []);
        } catch (error) {
          console.error('Error fetching faculty members:', error);
          toast.error('Failed to load faculty members');
          setFacultyMembers([]);
        }
      };
      fetchFaculty();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.faculty_id) newErrors.faculty_id = 'Please select a faculty member';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    // Validate time range
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      if (start >= end) {
        newErrors.end_time = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const meetingData = {
        ...formData,
        student_id: studentId,
        status: 'scheduled',
        rsvp_status: 'pending'
      };
      
      // Use the correct API endpoint from MeetingsApi
      await MeetingsApi.createMeeting(meetingData);
      toast.success('Meeting request sent successfully');
      onClose(true); // Notify parent of success
      
      // Reset form
      setFormData({
        faculty_id: '',
        title: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        location: '',
        meeting_type: 'advising', // lowercase to match backend enum values
        notes: ''
      });
    } catch (error) {
      console.error('Error requesting meeting:', error);
      toast.error('Failed to create meeting. Please try again.');
      setIsLoading(false);
      toast.error(error.response?.data?.detail || 'Failed to send meeting request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {
        if (!isLoading) {
          onClose(false);
        }
      }}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Request a Meeting
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => !isLoading && onClose(false)}
                    disabled={isLoading}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="faculty_id" className="block text-sm font-medium text-gray-700">
                      Faculty Member <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="faculty_id"
                      name="faculty_id"
                      value={formData.faculty_id}
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                        errors.faculty_id ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      disabled={isLoading}
                    >
                      <option value="">Select a faculty member</option>
                      {Array.isArray(facultyMembers) && facultyMembers.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name} - {faculty.department}
                        </option>
                      ))}
                    </select>
                    {errors.faculty_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.faculty_id}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Meeting title"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Brief description of the meeting purpose"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`block w-full pl-10 border ${
                            errors.date ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          id="start_time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleChange}
                          className={`block w-full pl-10 border ${
                            errors.start_time ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.start_time && (
                        <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          id="end_time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleChange}
                          className={`block w-full pl-10 border ${
                            errors.end_time ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.end_time && (
                        <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`block w-full pl-10 border ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g., Room 101, CSE Building"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="meeting_type" className="block text-sm font-medium text-gray-700">
                      Meeting Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="meeting_type"
                        name="meeting_type"
                        className={`w-full p-2 border rounded-md ${errors.meeting_type ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.meeting_type}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="advising">Advising</option>
                        <option value="thesis">Thesis</option>
                        <option value="project">Project</option>
                        <option value="general">General</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {errors.meeting_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.meeting_type}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Any additional information or requests"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => onClose(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RequestMeetingDialog;
