/*
API Schema:
GET /api/student/exams
Query Parameters:
  - status: string (upcoming, ongoing, completed) - optional
  - type: string (midterm, final, quiz, etc.) - optional
Response:
{
  "exams": [
    {
      "id": number,
      "title": string,
      "courseCode": string,
      "courseTitle": string,
      "examType": string,
      "date": string (YYYY-MM-DD),
      "startTime": string (HH:MM),
      "endTime": string (HH:MM),
      "room": string,
      "location": string,
      "status": string,
      "total_marks": number,
      "obtained_marks": number (only for completed exams),
      "semester": number,
      "batch": string
    }
  ]
}

GET /api/student/exams/{exam_id}
Response:
{
  "exam": {
    "id": number,
    "title": string,
    "courseCode": string,
    "courseTitle": string,
    "examType": string,
    "date": string (YYYY-MM-DD),
    "startTime": string (HH:MM),
    "endTime": string (HH:MM),
    "room": string,
    "location": string,
    "status": string,
    "total_marks": number,
    "obtained_marks": number (only for completed exams),
    "instructions": string,
    "materials_allowed": string[],
    "syllabus_topics": string[],
    "notes": string,
    "invigilators": string[],
    "semester": number,
    "batch": string
  }
}
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Book, Award, Users, AlertCircle, Search, Filter, X, RefreshCw } from 'lucide-react';
import { BaseUrl } from '../../api/BaseUrl';

// Mock data for initial rendering or fallback
const mockExamData = {
  exams: [
    {
      id: 1,
      title: "Midterm Examination",
      courseCode: "CSE-401",
      courseTitle: "Artificial Intelligence",
      examType: "midterm",
      date: "2025-07-20",
      startTime: "10:00",
      endTime: "12:00",
      room: "Room 301",
      location: "Academic Building 1",
      status: "upcoming",
      total_marks: 50,
      semester: 4,
      batch: "25"
    },
    {
      id: 2,
      title: "Final Examination",
      courseCode: "CSE-303",
      courseTitle: "Database Systems",
      examType: "final",
      date: "2025-07-15",
      startTime: "09:00",
      endTime: "12:00",
      room: "Room 201",
      location: "Academic Building 2",
      status: "ongoing",
      total_marks: 100,
      semester: 3,
      batch: "25"
    },
    {
      id: 3,
      title: "Quiz 2",
      courseCode: "CSE-305",
      courseTitle: "Computer Networks",
      examType: "quiz",
      date: "2025-07-10",
      startTime: "14:00",
      endTime: "15:00",
      room: "Room 103",
      location: "Academic Building 1",
      status: "completed",
      total_marks: 20,
      obtained_marks: 18,
      semester: 3,
      batch: "25"
    }
  ]
};

// Helper components
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'midterm':
        return 'bg-purple-100 text-purple-800';
      case 'final':
        return 'bg-red-100 text-red-800';
      case 'quiz':
        return 'bg-yellow-100 text-yellow-800';
      case 'retake':
        return 'bg-orange-100 text-orange-800';
      case 'improvement':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeStyles()}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-lg font-medium text-gray-700">Loading exams...</span>
  </div>
);

// Helper function to format date
const formatDate = (dateString) => {
  try {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date format';
  }
};

const ExamCard = ({ exam, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick(exam)}
    >
      <div className="border-l-4 border-blue-500 p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{exam.title}</h3>
          <div className="flex space-x-2">
            <StatusBadge status={exam.status} />
            <TypeBadge type={exam.examType} />
          </div>
        </div>
        
        <div className="text-sm font-medium text-blue-600 mb-3">
          {exam.courseCode} - {exam.courseTitle}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>{formatDate(exam.date)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span>{exam.startTime} - {exam.endTime}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-gray-500" />
            <span>{exam.room}, {exam.location}</span>
          </div>
          
          {exam.status === 'completed' && (
            <div className="flex items-center">
              <Award size={16} className="mr-2 text-gray-500" />
              <span className="font-medium">
                Score: {exam.obtained_marks}/{exam.total_marks}
                <span className="ml-1 text-xs text-gray-500">
                  ({Math.round((exam.obtained_marks / exam.total_marks) * 100)}%)
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ExamDetailsDialog = ({ exam, isOpen, onClose }) => {
  if (!exam) return null;
  
  const calculateScore = () => {
    if (exam.status !== 'completed' || !exam.obtained_marks || !exam.total_marks) {
      return null;
    }
    
    const percentage = Math.round((exam.obtained_marks / exam.total_marks) * 100);
    return {
      score: `${exam.obtained_marks}/${exam.total_marks}`,
      percentage: percentage,
      grade: getGrade(percentage)
    };
  };
  
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+'; 
    else if (percentage >= 85) return 'A';
    else if (percentage >= 80) return 'A-';
    else if (percentage >= 75) return 'B+';
    else if (percentage >= 70) return 'B';
    else if (percentage >= 65) return 'B-';
    else if (percentage >= 60) return 'C+';
    else if (percentage >= 55) return 'C';
    else if (percentage >= 50) return 'C-';
    else if (percentage >= 45) return 'D+';
    else if (percentage >= 40) return 'D';
    else return 'F';
  };
  
  const score = calculateScore();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
            <p className="text-sm text-blue-600">{exam.courseCode} - {exam.courseTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Status and type badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <StatusBadge status={exam.status} />
            <TypeBadge type={exam.examType} />
          </div>
          
          {/* Main info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-500" />
                  <span>{formatDate(exam.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-blue-500" />
                  <span>{exam.startTime} - {exam.endTime}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
              <div className="flex items-center">
                <MapPin size={18} className="mr-2 text-blue-500" />
                <span>{exam.room}, {exam.location}</span>
              </div>
            </div>
            
            {/* Score section (only for completed exams) */}
            {exam.status === 'completed' && score && (
              <div className="col-span-1 md:col-span-2 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Your Performance</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{score.score}</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{score.percentage}%</p>
                    <p className="text-sm text-gray-600">Percentage</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{score.grade}</p>
                    <p className="text-sm text-gray-600">Grade</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${score.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Exam details */}
          <div className="space-y-6">
            {/* Instructions */}
            {exam.instructions && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <p>{exam.instructions}</p>
                </div>
              </div>
            )}
            
            {/* Materials allowed */}
            {exam.materials_allowed && exam.materials_allowed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Materials Allowed</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {exam.materials_allowed.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Syllabus topics */}
            {exam.syllabus_topics && exam.syllabus_topics.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Syllabus Topics</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {exam.syllabus_topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Invigilators */}
            {exam.invigilators && exam.invigilators.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Invigilators</h3>
                <div className="flex items-center">
                  <Users size={18} className="mr-2 text-blue-500" />
                  <span>{exam.invigilators.join(', ')}</span>
                </div>
              </div>
            )}
            
            {/* Notes */}
            {exam.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
                <div className="bg-yellow-50 rounded-lg p-4 text-sm border-l-4 border-yellow-400">
                  <div className="flex items-start">
                    <AlertCircle size={18} className="mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>{exam.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Fetch exams data from API
  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, use the actual API endpoint
      // const response = await axios.get(`${BaseUrl}/api/student/exams`);
      // const data = response.data;
      
      // For development, use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = mockExamData;
      
      setExams(data.exams || []);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExams();
  }, []);
  
  // Handle opening exam details
  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };
  
  // Handle closing exam details
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  // Filter exams based on status and type
  const filteredExams = exams.filter(exam => {
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesType = typeFilter === 'all' || exam.examType === typeFilter;
    return matchesStatus && matchesType;
  });
  
  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Exams</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchExams}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Exams</h1>
        <p className="text-gray-600">View and manage your upcoming and past examinations</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="retake">Retake</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={fetchExams}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredExams.map(exam => (
              <ExamCard 
                key={exam.id} 
                exam={exam} 
                onClick={handleExamClick}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Book size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exams Found</h3>
          <p className="text-gray-600 mb-4">
            {exams.length > 0 
              ? 'No exams match your current filters. Try changing your filter criteria.'
              : 'You don\'t have any exams scheduled at the moment.'}
          </p>
          {exams.length > 0 && (
            <button 
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
      
      {/* Exam Details Dialog */}
      <ExamDetailsDialog 
        exam={selectedExam} 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
};

export default StudentExams;
