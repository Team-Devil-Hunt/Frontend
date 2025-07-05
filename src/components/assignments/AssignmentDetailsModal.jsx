import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, FileText, User, BookOpen, CheckCircle, XCircle, Download } from 'lucide-react';

const AssignmentDetailsModal = ({ isOpen, onClose, assignment }) => {
  if (!isOpen || !assignment) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate time remaining until deadline
  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    
    if (diffMs <= 0) {
      return { text: 'Past due', color: 'text-red-600' };
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return { 
        text: `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hr${diffHours > 1 ? 's' : ''} left`, 
        color: diffDays < 2 ? 'text-amber-600' : 'text-green-600'
      };
    } else {
      return { 
        text: `${diffHours} hour${diffHours > 1 ? 's' : ''} left`, 
        color: 'text-red-600'
      };
    }
  };
  
  const timeRemaining = getTimeRemaining(assignment.deadline);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className={`p-6 ${assignment.status === 'submitted' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : assignment.status === 'past' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-violet-500 to-purple-600'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">{assignment.title}</h2>
              <p className="text-white/80 mt-1">{assignment.course}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' : assignment.status === 'past' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>
                {assignment.status === 'submitted' ? 'Submitted' : assignment.status === 'past' ? 'Past Due' : 'Upcoming'}
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Assignment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Assignment Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{assignment.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(assignment.deadline)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(assignment.assignedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Instructor</p>
                    <p className="text-sm font-medium text-gray-900">{assignment.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Maximum Marks</p>
                    <p className="text-sm font-medium text-gray-900">{assignment.maxMarks}</p>
                  </div>
                </div>
              </div>
              
              {/* Time Remaining */}
              <div className="mt-4 p-3 rounded-md bg-gray-100">
                <p className={`text-sm font-medium flex items-center ${timeRemaining.color}`}>
                  {assignment.status === 'submitted' ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Submitted on {formatDate(assignment.submissionDetails?.submittedDate)}
                    </>
                  ) : (
                    <>
                      {assignment.status === 'past' ? (
                        <XCircle className="h-5 w-5 mr-2 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 mr-2 text-amber-500" />
                      )}
                      {timeRemaining.text}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Assignment Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Assignment Files</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {assignment.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Submission Details (if submitted) */}
          {assignment.status === 'submitted' && assignment.submissionDetails && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Your Submission</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Submitted on</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(assignment.submissionDetails.submittedDate)}</p>
                </div>
                
                {/* Submitted Files */}
                {assignment.submissionDetails.files && assignment.submissionDetails.files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Submitted Files</p>
                    <ul className="space-y-2">
                      {assignment.submissionDetails.files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{file}</span>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Submission Notes */}
                {assignment.submissionDetails.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Your Notes</p>
                    <p className="text-sm text-gray-700 p-3 bg-white rounded-md border border-gray-200">
                      {assignment.submissionDetails.notes}
                    </p>
                  </div>
                )}
                
                {/* Grade and Feedback */}
                {assignment.submissionDetails.grade !== undefined && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Grade</span>
                      <span className="text-lg font-bold text-blue-800">{assignment.submissionDetails.grade}/{assignment.maxMarks}</span>
                    </div>
                    {assignment.submissionDetails.feedback && (
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Instructor Feedback</p>
                        <p className="text-sm text-blue-700 bg-blue-100 p-3 rounded-md">
                          {assignment.submissionDetails.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignmentDetailsModal;
