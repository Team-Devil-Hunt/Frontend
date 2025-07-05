import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Calendar, Clock, MapPin, User } from 'lucide-react';

const MeetingRSVP = ({ meeting, isOpen, onClose, onSubmit }) => {
  const [status, setStatus] = useState('confirmed');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Reset state when modal opens with a new meeting
  useEffect(() => {
    if (isOpen && meeting) {
      setStatus(meeting.rsvpStatus || 'confirmed');
      setNotes('');
      setShowSuccess(false);
    }
  }, [isOpen, meeting]);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (meeting && onSubmit) {
        onSubmit(meeting.id, status, notes);
      }
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Close after showing success message
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <motion.div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {showSuccess ? (
            <div className="bg-white p-6 text-center border-0">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Response Submitted!</h3>
              <p className="text-sm text-gray-500">
                Your RSVP has been successfully recorded.
              </p>
            </div>
          ) : (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start bg-white">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Meeting RSVP
                    </h3>
                    <button
                      onClick={onClose}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{meeting.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(meeting.date)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {meeting.startTime} - {meeting.endTime}
                      </div>
                      <div className="flex items-center text-gray-600 md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {meeting.location}
                      </div>
                      <div className="flex items-center text-gray-600 md:col-span-2">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {meeting.facultyName}
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Response
                      </label>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setStatus('confirmed')}
                          className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            status === 'confirmed'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <Check className="h-4 w-4 mr-2" />
                            Confirm
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus('declined')}
                          className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            status === 'declined'
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-5">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Add any additional information or questions..."
                      />
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-md">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Response'}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MeetingRSVP;
