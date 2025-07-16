import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MeetingRSVP = ({ meeting, onClose, onConfirm, isLoading }) => {
  const [status, setStatus] = useState(meeting?.rsvpStatus || 'pending');
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  
  // Handle close with animation
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300); // Wait for animation to complete
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Date not specified';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm(status, notes);
    }
  };

  if (!meeting) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <motion.div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative z-50"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Meeting RSVP
                      </h3>
                      <button
                        onClick={handleClose}
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        disabled={isLoading}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{meeting.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{meeting.startTime} - {meeting.endTime}</span>
                      </div>
                      <div className="flex items-start text-gray-600 md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{meeting.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{meeting.faculty_name || 'Faculty'}</span>
                      </div>
                    </div>
                    {meeting.description && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p className="font-medium">Description:</p>
                        <p className="whitespace-pre-line">{meeting.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Response
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="rsvp-confirm"
                            name="rsvp"
                            type="radio"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={status === 'confirmed'}
                            onChange={() => setStatus('confirmed')}
                            disabled={isLoading}
                          />
                          <label htmlFor="rsvp-confirm" className="ml-2 block text-sm text-gray-700">
                            I will attend
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="rsvp-pending"
                            name="rsvp"
                            type="radio"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={status === 'pending'}
                            onChange={() => setStatus('pending')}
                            disabled={isLoading}
                          />
                          <label htmlFor="rsvp-pending" className="ml-2 block text-sm text-gray-700">
                            Tentative
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="rsvp-decline"
                            name="rsvp"
                            type="radio"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={status === 'declined'}
                            onChange={() => setStatus('declined')}
                            disabled={isLoading}
                          />
                          <label htmlFor="rsvp-decline" className="ml-2 block text-sm text-gray-700">
                            Can't attend
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Add any additional notes or questions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                          isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Response'
                        )}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={handleClose}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )}
    </AnimatePresence>
  );
};

export default MeetingRSVP;
