import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const BookingModal = ({ equipment, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    purpose: '',
    agreeToTerms: false
  });
  
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
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    
    // Check if end date/time is after start date/time
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Pass data to parent component
      onSubmit({
        equipmentId: equipment.id,
        startTime: `${formData.startDate}T${formData.startTime}`,
        endTime: `${formData.endDate}T${formData.endTime}`,
        purpose: formData.purpose
      });
      
      // Reset form after success message display
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          purpose: '',
          agreeToTerms: false
        });
        onClose();
      }, 2000);
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden"
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
                {equipment.requiresApproval 
                  ? "Your booking request has been submitted and is pending approval."
                  : "Your booking has been confirmed. You'll receive a confirmation email shortly."}
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
            <h3 className="text-lg font-medium">Book Equipment</h3>
            <p className="text-indigo-100 mt-1">{equipment.name}</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Equipment details summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-start mb-2">
                <div className="font-medium w-1/3 text-gray-500">Equipment:</div>
                <div className="w-2/3">{equipment.name}</div>
              </div>
              <div className="flex items-start mb-2">
                <div className="font-medium w-1/3 text-gray-500">Location:</div>
                <div className="w-2/3">{equipment.location}</div>
              </div>
              <div className="flex items-start">
                <div className="font-medium w-1/3 text-gray-500">Availability:</div>
                <div className="w-2/3">{equipment.available} of {equipment.quantity} available</div>
              </div>
              
              {equipment.requiresApproval && (
                <div className="mt-3 flex items-center text-amber-600 text-sm">
                  <AlertTriangle size={16} className="mr-2" />
                  <span>This equipment requires admin approval before booking is confirmed</span>
                </div>
              )}
            </div>
            
            {/* Date and time selection */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    min={getTomorrowDate()}
                    max={getMaxDate()}
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-2 w-full border ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-2 w-full border ${
                      errors.startTime ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    min={formData.startDate || getTomorrowDate()}
                    max={getMaxDate()}
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-2 w-full border ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-2 w-full border ${
                      errors.endTime ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
              </div>
            </div>
            
            {/* Purpose */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Booking
              </label>
              <textarea
                name="purpose"
                rows="3"
                placeholder="Describe how you will use this equipment..."
                value={formData.purpose}
                onChange={handleChange}
                className={`w-full border ${
                  errors.purpose ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
              )}
            </div>
            
            {/* Terms and conditions */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`form-checkbox h-5 w-5 ${
                    errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'
                  } rounded text-indigo-600 focus:ring-indigo-500 mt-1`}
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to handle the equipment with care and return it in the same condition. 
                  I understand that I am responsible for any damage caused during my booking period.
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
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
