import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const LabBookingModal = ({ lab, isOpen, onClose, onSubmit }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get tomorrow's date in YYYY-MM-DD format for min date input
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  // Get date 30 days from now for max date input
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedTimeSlot) newErrors.timeSlot = 'Please select a time slot';
    if (!bookingDate) newErrors.bookingDate = 'Booking date is required';
    if (!purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Pass data to parent component
      onSubmit({
        labId: lab.id,
        timeSlotId: selectedTimeSlot.id,
        date: bookingDate,
        purpose: purpose
      });
      
      // Reset form after success message display
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedTimeSlot(null);
        setBookingDate('');
        setPurpose('');
        setAgreeToTerms(false);
        onClose();
      }, 2000);
    }, 1500);
  };
  
  // Group time slots by day
  const timeSlotsByDay = lab?.availableTimeSlots.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }
    acc[slot.day].push(slot);
    return acc;
  }, {});
  
  if (!isOpen || !lab) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Success overlay */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Booking Submitted!</h3>
              <p className="text-gray-500 text-center px-6">
                Your lab booking request has been submitted and is pending approval.
                You'll receive a confirmation email shortly.
              </p>
            </motion.div>
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-white">
            <h3 className="text-lg font-medium">Book Lab</h3>
            <p className="text-indigo-100 mt-1">{lab.name}</p>
          </div>
          
          <div className="p-6">
            {/* Lab details summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-start mb-2">
                <div className="font-medium w-1/3 text-gray-500">Lab:</div>
                <div className="w-2/3">{lab.name}</div>
              </div>
              <div className="flex items-start mb-2">
                <div className="font-medium w-1/3 text-gray-500">Location:</div>
                <div className="w-2/3">{lab.location}</div>
              </div>
              <div className="flex items-start">
                <div className="font-medium w-1/3 text-gray-500">Capacity:</div>
                <div className="w-2/3">{lab.capacity} people</div>
              </div>
            </div>
            
            {/* Available Time Slots */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Available Time Slots</h4>
              
              {Object.keys(timeSlotsByDay).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(timeSlotsByDay).map(([day, slots]) => (
                    <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700">
                        {day}
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {slots.map(slot => (
                          <div
                            key={slot.id}
                            onClick={() => !slot.isBooked && setSelectedTimeSlot(slot)}
                            className={`p-3 rounded-md border ${
                              selectedTimeSlot?.id === slot.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : slot.isBooked
                                ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              {slot.isBooked ? (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Booked</span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available time slots for this lab.
                </div>
              )}
              
              {errors.timeSlot && (
                <p className="mt-2 text-sm text-red-600">{errors.timeSlot}</p>
              )}
            </div>
            
            {/* Booking Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={getTomorrowDate()}
                      max={getMaxDate()}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className={`pl-10 pr-4 py-2 w-full border ${
                        errors.bookingDate ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.bookingDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.bookingDate}</p>
                  )}
                </div>
                
                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Booking
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe how you will use this lab..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={`w-full border ${
                      errors.purpose ? 'border-red-500' : 'border-gray-300'
                    } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.purpose && (
                    <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                  )}
                </div>
                
                {/* Terms and conditions */}
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className={`form-checkbox h-5 w-5 ${
                        errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'
                      } rounded text-indigo-600 focus:ring-indigo-500 mt-1`}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to follow lab rules and regulations. I understand that I am responsible for any damage 
                      caused during my booking period and will leave the lab in the same condition.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
                
                {/* Submit button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LabBookingModal;
