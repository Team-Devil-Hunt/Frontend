import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Check, AlertCircle, Paperclip, Trash2 } from 'lucide-react';

const AssignmentSubmissionModal = ({ isOpen, onClose, assignment, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Reset state when a new assignment is selected
  useEffect(() => {
    if (isOpen && assignment) {
      // If there's an existing submission, pre-populate the form
      if (assignment.submissionDetails) {
        setNotes(assignment.submissionDetails.notes || '');
        setFiles(assignment.submissionDetails.files.map(filename => ({
          name: filename,
          size: '(Previously uploaded)',
          type: 'application/pdf',
          isExisting: true
        })));
      } else {
        setNotes('');
        setFiles([]);
      }
      setError('');
      setShowSuccess(false);
    }
  }, [isOpen, assignment]);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check file size (max 10MB per file)
    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Files must be under 10MB each. ${oversizedFiles.map(f => f.name).join(', ')} exceed this limit.`);
      return;
    }
    
    // Add new files to the list
    setFiles(prev => [
      ...prev,
      ...selectedFiles.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        file: file,
        isExisting: false
      }))
    ]);
    
    // Clear error if present
    setError('');
  };
  
  // Remove a file from the list
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate submission
    if (files.length === 0) {
      setError('Please attach at least one file.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Mock API call - would be replaced with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare submission data
      const submissionData = {
        assignmentId: assignment.id,
        submittedDate: new Date().toISOString(),
        files: files.map(f => f.name),
        notes: notes,
        status: 'submitted'
      };
      
      // Call the onSubmit callback
      onSubmit(assignment.id, submissionData);
      
      // Show success message
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Close modal after delay
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      setIsSubmitting(false);
      setError('Failed to submit assignment. Please try again.');
      console.error('Submission error:', error);
    }
  };
  
  if (!isOpen || !assignment) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative z-10"
      >
        {showSuccess ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Submitted!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your submission has been successfully recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium text-gray-900">Submit Assignment</h2>
              <button 
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                <p className="text-sm text-gray-500">{assignment.course}</p>
              </div>
              
              <div className="mb-4 p-3 bg-indigo-50 rounded-md">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-indigo-800">Assignment Details</h4>
                    <p className="text-sm text-indigo-700 mt-1">{assignment.description}</p>
                  </div>
                </div>
              </div>
              
              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Files
                </label>
                
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload files</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          multiple
                          className="sr-only" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, ZIP, or code files up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{file.size}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Notes */}
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Add any notes or comments about your submission..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Submit Assignment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AssignmentSubmissionModal;
