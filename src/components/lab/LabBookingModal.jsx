import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const LabBookingModal = ({ lab, isOpen, onClose, onSubmit }) => {
  // Using hardcoded time slot instead of selection
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
    
    if (!bookingDate) {
      newErrors.bookingDate = 'Please select a date';
    } else {
      const selectedDate = new Date(bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Booking date cannot be in the past';
      }
    }
    
    if (!purpose || purpose.trim() === '') {
      newErrors.purpose = 'Please provide a purpose for the booking';
    }
    
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Get the first time slot ID or use a default value
    const hardcodedTimeSlotId = lab.time_slots && lab.time_slots.length > 0 
      ? lab.time_slots[0].id 
      : 1;
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Pass data to parent component with hardcoded time slot
      onSubmit({
        labId: lab.id,
        timeSlotId: hardcodedTimeSlotId,
        date: bookingDate,
        purpose: purpose
      });
      
      // Reset form after success message display
      setTimeout(() => {
        setIsSuccess(false);
        setBookingDate('');
        setPurpose('');
        setAgreeToTerms(false);
        onClose();
      }, 1500);
    }, 1500);
  };
  
  // We're not using time slots anymore, but keeping this for compatibility
  const timeSlotsByDay = useMemo(() => ({}), []);

  if (!isOpen || !lab) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] overflow-y-auto border border-indigo-100"
        >
          {/* Success overlay */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 z-10 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-green-700 mt-4 mb-3">Booking Submitted!</h3>
              <p className="text-gray-600 text-center px-6 max-w-md">
                Your lab booking request has been submitted and is pending approval.
                You'll receive a confirmation email shortly.
              </p>
            </motion.div>
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-indigo-100 z-20 bg-indigo-400 hover:bg-indigo-500 p-1 rounded-full transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h3 className="text-2xl font-bold">Book Lab</h3>
            <p className="text-indigo-100 mt-2 text-lg">{lab.name}</p>
          </div>
          
          <div className="p-6">
            {/* Lab details summary */}
            <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-sm border border-indigo-100 shadow-sm">
              <div className="flex items-start mb-3">
                <div className="font-medium w-1/3 text-indigo-700">Lab:</div>
                <div className="w-2/3 font-medium">{lab.name}</div>
              </div>
              <div className="flex items-start mb-3">
                <div className="font-medium w-1/3 text-indigo-700">Location:</div>
                <div className="w-2/3">{lab.location}</div>
              </div>
              <div className="flex items-start">
                <div className="font-medium w-1/3 text-indigo-700">Capacity:</div>
                <div className="w-2/3">{lab.capacity} people</div>
              </div>
            </div>
            
            {/* Time slot selection removed */}
            <div className="mb-6">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-indigo-500 mr-2" />
                  <p className="text-indigo-800 font-medium">
                    All bookings will be scheduled for the 9:00 AM - 11:00 AM time slot
                  </p>
                </div>
              </div>
            </div>
            
            {/* Booking Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-bold text-indigo-800 mb-2">
                    Booking Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={getTomorrowDate()}
                      max={getMaxDate()}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className={`pl-10 pr-4 py-3 w-full border ${
                        errors.bookingDate ? 'border-red-500' : 'border-indigo-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200`}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.bookingDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.bookingDate}</p>
                  )}
                </div>
                
                {/* Purpose */}
                <div>
                  <label className="block text-sm font-bold text-indigo-800 mb-2">
                    Purpose of Booking
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe how you will use this lab..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={`w-full border ${
                      errors.purpose ? 'border-red-500' : 'border-indigo-200'
                    } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200`}
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
                        errors.agreeToTerms ? 'border-red-500' : 'border-indigo-300'
                      } rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 mt-1`}
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
                    className="mr-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-300"
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
