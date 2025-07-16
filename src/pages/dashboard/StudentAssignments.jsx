import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, FileText, Clock, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AssignmentSubmissionModal from '../../components/assignments/AssignmentSubmissionModal';
import AssignmentDetailsModal from '../../components/assignments/AssignmentDetailsModal';
import Api from '../../constant/Api';

// Fallback mock data in case API fails
const fallbackAssignments = [
  {
    id: '1',
    title: 'Algorithm Analysis Report',
    course: 'CSE-301: Design and Analysis of Algorithms',
    description: 'Analyze the time and space complexity of the provided algorithms and submit a detailed report.',
    deadline: '2025-07-10T23:59:00',
    assignedDate: '2025-07-01T10:00:00',
    status: 'upcoming',
    submissionType: 'document',
    maxMarks: 20,
    attachments: ['algorithm_problems.pdf'],
    submissionDetails: null
  },
  {
    id: '2',
    title: 'Database Schema Design',
    course: 'CSE-303: Database Systems',
    description: 'Design a comprehensive database schema for the university management system described in the requirements.',
    deadline: '2025-07-15T23:59:00',
    assignedDate: '2025-07-03T14:00:00',
    status: 'upcoming',
    submissionType: 'document',
    maxMarks: 15,
    attachments: ['db_requirements.pdf'],
    submissionDetails: null
  },
  {
    id: '3',
    title: 'Machine Learning Model Implementation',
    course: 'CSE-401: Artificial Intelligence',
    description: 'Implement and train a neural network model for the given classification problem.',
    deadline: '2025-07-08T23:59:00',
    assignedDate: '2025-06-25T09:00:00',
    status: 'submitted',
    submissionType: 'code',
    maxMarks: 25,
    attachments: ['dataset.csv', 'problem_statement.pdf'],
    submissionDetails: {
      submittedDate: '2025-07-05T14:30:00',
      files: ['model.py', 'report.pdf'],
      grade: null,
      feedback: null,
      status: 'submitted'
    }
  },
  {
    id: '4',
    title: 'Operating System Simulation',
    course: 'CSE-307: Operating Systems',
    description: 'Implement a simulation of CPU scheduling algorithms and compare their performance.',
    deadline: '2025-06-30T23:59:00',
    assignedDate: '2025-06-15T11:00:00',
    status: 'past',
    submissionType: 'code',
    maxMarks: 20,
    attachments: ['simulation_requirements.pdf'],
    submissionDetails: null
  },
  {
    id: '5',
    title: 'Computer Networks Lab Report',
    course: 'CSE-407: Computer Networks',
    description: 'Document and analyze the results of the network protocols lab experiments.',
    deadline: '2025-07-12T23:59:00',
    assignedDate: '2025-07-02T13:00:00',
    status: 'upcoming',
    submissionType: 'document',
    maxMarks: 15,
    attachments: ['lab_manual.pdf'],
    submissionDetails: null
  },
  {
    id: '6',
    title: 'Software Engineering Project Proposal',
    course: 'CSE-405: Software Engineering',
    description: 'Prepare a detailed project proposal including requirements analysis, design specifications, and implementation plan.',
    deadline: '2025-07-20T23:59:00',
    assignedDate: '2025-07-05T10:00:00',
    status: 'upcoming',
    submissionType: 'document',
    maxMarks: 30,
    attachments: ['proposal_template.docx'],
    submissionDetails: null
  },
  {
    id: '7',
    title: 'Web Development Project',
    course: 'CSE-309: Web Technologies',
    description: 'Develop a responsive web application according to the provided specifications.',
    deadline: '2025-07-05T23:59:00',
    assignedDate: '2025-06-20T09:00:00',
    status: 'submitted',
    submissionType: 'code',
    maxMarks: 40,
    attachments: ['project_requirements.pdf'],
    submissionDetails: {
      submittedDate: '2025-07-04T22:45:00',
      files: ['source_code.zip', 'documentation.pdf', 'demo_link.txt'],
      grade: 36,
      feedback: 'Excellent work! The application meets all requirements and has a clean, intuitive UI.',
      status: 'graded'
    }
  },
  {
    id: '8',
    title: 'Computer Graphics Assignment',
    course: 'CSE-403: Computer Graphics',
    description: 'Implement the specified 3D rendering algorithms and create visual demonstrations.',
    deadline: '2025-06-28T23:59:00',
    assignedDate: '2025-06-10T14:00:00',
    status: 'past',
    submissionType: 'code',
    maxMarks: 25,
    attachments: ['graphics_assignment.pdf'],
    submissionDetails: null
  }
];

const StudentAssignments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Get user from localStorage
  useEffect(() => {
    try {
      const globalState = localStorage.getItem('globalState');
      if (globalState) {
        const parsedState = JSON.parse(globalState);
        if (parsedState?.user) {
          setUser(parsedState.user);
          console.log('User loaded from localStorage:', parsedState.user);
          console.log('User permissions:', parsedState.user?.role?.permissions);
        } else {
          console.warn('No user found in global state');
        }
      } else {
        console.warn('No global state found in localStorage');
      }
    } catch (err) {
      console.error('Error getting user from localStorage:', err);
    }
  }, []);

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        
        // Get all assignments
        const assignmentsResponse = await Api.get('/api/assignments');
        
        // Get user's submissions if logged in
        let userSubmissions = [];
        if (user && user.id) {
          try {
            // Use a separate API call with proper error handling
            const submissionsResponse = await Api.get('/api/assignments/my-submissions');
            if (submissionsResponse && submissionsResponse.data) {
              userSubmissions = submissionsResponse.data;
            }
          } catch (submissionError) {
            console.error('Error fetching submissions:', submissionError);
            // Continue with empty submissions array
          }
        }
        
        // Transform assignments data
        const transformedAssignments = assignmentsResponse.data.map(assignment => {
          // Find user's submission for this assignment if it exists
          const submission = userSubmissions.find(sub => sub.assignmentId === assignment.id);
          
          // Determine status based on deadline and submission
          let status = assignment.status;
          if (status === 'active') {
            if (submission) {
              status = 'submitted';
            } else if (new Date(assignment.deadline) < new Date()) {
              status = 'past';
            } else {
              status = 'upcoming';
            }
          } else if (status === 'past') {
            status = 'past';
          }
          
          return {
            id: assignment.id,
            title: assignment.title,
            course: `${assignment.courseCode}: ${assignment.courseTitle}`,
            description: assignment.description,
            deadline: assignment.deadline,
            assignedDate: assignment.createdAt,
            status: status,
            submissionType: assignment.submissionType,
            maxMarks: 100, // Default value
            attachments: assignment.attachments ? 
              assignment.attachments.map(att => att.name) : [],
            submissionDetails: submission ? {
              submittedDate: submission.submittedAt,
              files: [submission.submissionContent],
              grade: submission.grade,
              feedback: submission.feedback,
              status: submission.status
            } : null
          };
        });
        
        setAssignments(transformedAssignments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Failed to load assignments');
        // Fall back to mock data in case of error
        setAssignments(fallbackAssignments);
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [user]);

  // Filter assignments based on active tab and search query
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      // Filter by tab
      if (activeTab !== 'all' && assignment.status !== activeTab) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          assignment.title.toLowerCase().includes(query) ||
          assignment.course.toLowerCase().includes(query) ||
          assignment.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [activeTab, searchQuery]);
  
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
  
  // Handle assignment submission
  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };
  
  // Handle view assignment details
  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailsModalOpen(true);
  };
  
  // Handle assignment submission
  const handleSubmissionComplete = async (assignmentId, submissionData) => {
    if (!user) {
      alert('You must be logged in to submit assignments');
      return;
    }
    
    // Permission check removed as requested - all logged-in users can submit assignments
    
    try {
      // Prepare submission content - could be file path, link or text
      const submissionContent = submissionData.files && submissionData.files.length > 0 ? 
        submissionData.files[0] : 
        submissionData.content || '';
      
      console.log('Submitting assignment...');
      console.log('Current cookies:', document.cookie);
      
      // Submit to backend using our configured API service
      // The Api service already has withCredentials:true configured globally
      const response = await Api.post('/api/assignments/submit', {
        assignmentId: assignmentId,
        submissionContent: submissionContent,
        submissionType: submissionData.type || 'text' // Default to text if not specified
      });
      
      // Update local state
      const updatedAssignments = assignments.map(assignment => {
        if (assignment.id === assignmentId) {
          return {
            ...assignment,
            status: 'submitted',
            submissionDetails: {
              ...submissionData,
              status: 'submitted'
            }
          };
        }
        return assignment;
      });
      
      setAssignments(updatedAssignments);
      setTimeout(() => {
        setActiveTab('submitted');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting assignment:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      
      // Provide more detailed error feedback based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          alert('Your session has expired. Please log in again.');
        } else if (error.response.status === 403) {
          // This shouldn't happen anymore since we removed permission checks
          alert('Permission issue detected. Please refresh the page and try again.');
        } else {
          alert(`Submission failed: ${error.response.data?.detail || 'Unknown error'}. Please try again.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response from server. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Failed to submit assignment. Please try again later.');
      }
    }
  };
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center h-screen">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Assignments</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assignments..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'submitted'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'past'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past Due
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Assignments
        </button>
      </div>
      
      {/* Assignment Cards */}
      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => {
            const timeRemaining = getTimeRemaining(assignment.deadline);
            
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className={`p-4 ${assignment.status === 'submitted' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : assignment.status === 'past' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-violet-500 to-purple-600'}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{assignment.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' : assignment.status === 'past' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>
                      {assignment.status === 'submitted' ? 'Submitted' : assignment.status === 'past' ? 'Past Due' : 'Upcoming'}
                    </div>
                  </div>
                  <p className="text-white/80 text-sm mt-1">{assignment.course}</p>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-xs text-gray-600">Due: {formatDate(assignment.deadline)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-xs text-gray-600">Assigned: {formatDate(assignment.assignedDate)}</span>
                    </div>
                  </div>
                  
                  {/* Time Remaining */}
                  <div className="mb-3">
                    <p className={`text-sm font-medium ${timeRemaining.color}`}>
                      {assignment.status === 'submitted' ? (
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          Submitted on {formatDate(assignment.submissionDetails?.submittedDate)}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {assignment.status === 'past' ? (
                            <XCircle className="h-4 w-4 mr-1 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 mr-1 text-amber-500" />
                          )}
                          {timeRemaining.text}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Attachments */}
                  {assignment.attachments && assignment.attachments.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {assignment.attachments.map((attachment, index) => (
                          <div 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center hover:bg-gray-200 cursor-pointer transition-colors"
                          >
                            <FileText className="h-3 w-3 mr-1 text-gray-500" />
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Submission Details */}
                  {assignment.submissionDetails?.grade !== undefined && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Grade:</span>
                        <span className="text-sm font-bold text-blue-800">{assignment.submissionDetails.grade}/{assignment.maxMarks}</span>
                      </div>
                      {assignment.submissionDetails.feedback && (
                        <p className="text-xs text-blue-700 mt-1">{assignment.submissionDetails.feedback}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => handleViewAssignment(assignment)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Book className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    
                    {assignment.status !== 'past' && (
                      <button 
                        onClick={() => handleSubmitAssignment(assignment)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${assignment.status === 'submitted' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {assignment.status === 'submitted' ? 'Update Submission' : 'Submit Assignment'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-500">
            {activeTab === 'all' ? 
              'There are no assignments matching your search criteria.' : 
              `You don't have any ${activeTab} assignments.`}
          </p>
        </div>
      )}
      
      {/* Assignment Details Modal */}
      <AssignmentDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        assignment={selectedAssignment}
      />
      
      {/* Assignment Submission Modal */}
      <AssignmentSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        assignment={selectedAssignment}
        onSubmit={handleSubmissionComplete}
      />
    </div>
  );
};

export default StudentAssignments;
