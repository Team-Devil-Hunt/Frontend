import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateProvider';
import { toast } from 'react-hot-toast';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  Users, 
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  FileText,
  User,
  Edit
} from 'lucide-react';

const FacultyAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'submissions'
  const [grading, setGrading] = useState({});
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock assignment data
    const mockAssignment = {
      id: parseInt(assignmentId),
      title: 'Mid-term Assignment',
      courseCode: 'CSE-401',
      courseTitle: 'Computer Networks',
      semester: 4,
      batch: '25th',
      deadline: '2025-07-30T23:59:59Z',
      description: 'Design a network topology for a university campus. Include router configurations, IP addressing scheme, and security considerations. The assignment should be submitted as a PDF document with network diagrams created using a professional tool like Cisco Packet Tracer or GNS3.',
      submissionType: 'file',
      status: 'active',
      facultyName: 'Dr. Anisur Rahman',
      createdAt: '2025-07-10T10:00:00Z',
      updatedAt: '2025-07-10T10:00:00Z',
      submissionCount: 12,
      totalStudents: 45,
      attachments: [
        { name: 'assignment_instructions.pdf', url: '/assets/assignments/instructions.pdf' },
        { name: 'network_example.png', url: '/assets/assignments/example.png' }
      ]
    };
    
    setAssignment(mockAssignment);
    setLoading(false);
  }, [assignmentId]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      // Mock submissions data
      const mockSubmissions = [
        {
          id: 101,
          assignmentId: parseInt(assignmentId),
          studentId: 1001,
          studentName: 'Md. Rakib Hasan',
          studentRoll: '19-12345',
          submissionContent: 'network_topology_rakib.pdf',
          submissionType: 'file',
          submittedAt: '2025-07-15T14:23:45Z',
          status: 'submitted',
          grade: null,
          feedback: null,
          gradedAt: null
        },
        {
          id: 102,
          assignmentId: parseInt(assignmentId),
          studentId: 1002,
          studentName: 'Fatima Akter',
          studentRoll: '19-12346',
          submissionContent: 'network_design_fatima.pdf',
          submissionType: 'file',
          submittedAt: '2025-07-14T09:15:22Z',
          status: 'graded',
          grade: 85,
          feedback: 'Good work! Your network design is well thought out. Consider adding more details about the security implementation.',
          gradedAt: '2025-07-16T11:30:00Z'
        },
        {
          id: 103,
          assignmentId: parseInt(assignmentId),
          studentId: 1003,
          studentName: 'Abdullah Al Mamun',
          studentRoll: '19-12347',
          submissionContent: 'university_network_abdullah.pdf',
          submissionType: 'file',
          submittedAt: '2025-07-15T18:45:30Z',
          status: 'submitted',
          grade: null,
          feedback: null,
          gradedAt: null
        },
        {
          id: 104,
          assignmentId: parseInt(assignmentId),
          studentId: 1004,
          studentName: 'Nusrat Jahan',
          studentRoll: '19-12348',
          submissionContent: 'campus_network_nusrat.pdf',
          submissionType: 'file',
          submittedAt: '2025-07-13T22:10:15Z',
          status: 'graded',
          grade: 92,
          feedback: 'Excellent work! Your network topology is very well designed with proper consideration for scalability and security.',
          gradedAt: '2025-07-16T10:20:00Z'
        }
      ];
      
      setSubmissions(mockSubmissions);
      
      // Initialize grading state for each submission
      const gradingState = {};
      mockSubmissions.forEach(submission => {
        gradingState[submission.id] = {
          isEditing: false,
          grade: submission.grade || '',
          feedback: submission.feedback || ''
        };
      });
      
      setGrading(gradingState);
      setSubmissionsLoading(false);
    }
  }, [assignmentId, activeTab]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGoBack = () => {
    navigate('/faculty/assignments');
  };

  const toggleGrading = (submissionId) => {
    setGrading(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        isEditing: !prev[submissionId].isEditing
      }
    }));
  };

  const handleGradeChange = (submissionId, field, value) => {
    setGrading(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }));
  };

  const submitGrade = async (submissionId) => {
    try {
      const { grade, feedback } = grading[submissionId];
      
      // Validate grade
      const numericGrade = parseFloat(grade);
      if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
        toast.error('Grade must be a number between 0 and 100');
        return;
      }
      
      // Update the submission in the state without making API call
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { 
                ...sub, 
                grade: numericGrade, 
                feedback, 
                status: 'graded',
                gradedAt: new Date().toISOString()
              } 
            : sub
        )
      );
      
      // Close the grading form
      toggleGrading(submissionId);
      
      toast.success('Submission graded successfully');
    } catch (err) {
      console.error('Error grading submission:', err);
      toast.error('Failed to grade submission');
    }
  };

  const getSubmissionStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Submitted</span>;
      case 'graded':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Graded</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Assignment not found</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 text-white hover:text-indigo-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl leading-6 font-bold text-white">{assignment.title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-100">
              {assignment.courseCode} - {assignment.courseTitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          >
            Assignment Details
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`${
              activeTab === 'submissions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          >
            Student Submissions
          </button>
        </nav>
      </div>
      
      {/* Content */}
      <div className="px-4 py-5 sm:px-6">
        {activeTab === 'details' ? (
          <div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Course</dt>
                <dd className="mt-1 text-sm text-gray-900">{assignment.courseCode} - {assignment.courseTitle}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    assignment.status === 'active' ? 'bg-green-100 text-green-800' : 
                    assignment.status === 'past' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(assignment.deadline)}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Submissions</dt>
                <dd className="mt-1 text-sm text-gray-900">{assignment.submissionCount} / {assignment.totalStudents} students</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Batch</dt>
                <dd className="mt-1 text-sm text-gray-900">{assignment.batch}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Semester</dt>
                <dd className="mt-1 text-sm text-gray-900">{assignment.semester}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{assignment.description}</dd>
              </div>
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {assignment.attachments.map((attachment, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <span className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a href={attachment.url} className="font-medium text-indigo-600 hover:text-indigo-500">
                              Download
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate(`/faculty/assignments/${assignmentId}/edit`)}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Assignment
              </button>
            </div>
          </div>
        ) : (
          <div>
            {submissionsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no student submissions for this assignment.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Student Submissions</h3>
                  <span className="text-sm text-gray-500">
                    {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <li key={submission.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {submission.studentName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Roll: {submission.studentRoll}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              {getSubmissionStatusBadge(submission.status)}
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                Submitted: {formatDate(submission.submittedAt)}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <a 
                                href="#" 
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // In a real app, this would download the submission
                                  toast.success(`Downloading ${submission.submissionContent}`);
                                }}
                              >
                                <Download className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {submission.submissionContent}
                              </a>
                            </div>
                          </div>
                          
                          {submission.status === 'graded' && !grading[submission.id]?.isEditing && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-md">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-gray-900">Grading</h4>
                                <button 
                                  onClick={() => toggleGrading(submission.id)}
                                  className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </button>
                              </div>
                              <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                  <p className="text-xs text-gray-500">Grade</p>
                                  <p className="text-sm font-medium text-gray-900">{submission.grade}/100</p>
                                </div>
                                <div className="sm:col-span-1">
                                  <p className="text-xs text-gray-500">Graded on</p>
                                  <p className="text-sm text-gray-900">{formatDate(submission.gradedAt)}</p>
                                </div>
                                {submission.feedback && (
                                  <div className="sm:col-span-2 mt-2">
                                    <p className="text-xs text-gray-500">Feedback</p>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">{submission.feedback}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {(submission.status !== 'graded' || grading[submission.id]?.isEditing) && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-md">
                              <h4 className="text-sm font-medium text-gray-900">Grade Submission</h4>
                              <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                  <label htmlFor={`grade-${submission.id}`} className="block text-xs text-gray-500">
                                    Grade (out of 100)
                                  </label>
                                  <input
                                    type="number"
                                    name={`grade-${submission.id}`}
                                    id={`grade-${submission.id}`}
                                    min="0"
                                    max="100"
                                    value={grading[submission.id]?.grade || ''}
                                    onChange={(e) => handleGradeChange(submission.id, 'grade', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="sm:col-span-6">
                                  <label htmlFor={`feedback-${submission.id}`} className="block text-xs text-gray-500">
                                    Feedback (optional)
                                  </label>
                                  <textarea
                                    id={`feedback-${submission.id}`}
                                    name={`feedback-${submission.id}`}
                                    rows={3}
                                    value={grading[submission.id]?.feedback || ''}
                                    onChange={(e) => handleGradeChange(submission.id, 'feedback', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                {grading[submission.id]?.isEditing && (
                                  <button
                                    type="button"
                                    onClick={() => toggleGrading(submission.id)}
                                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => submitGrade(submission.id)}
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  {submission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAssignmentDetail;
