/*
API Schema:
GET /api/assignments
{
  assignments: [
    {
      id: string,
      title: string,
      courseCode: string,
      courseTitle: string,
      semester: number,
      batch: string,
      deadline: string (ISO date),
      description: string,
      attachments: string[],
      submissionType: "file" | "link" | "text",
      status: "active" | "past" | "draft",
      facultyName: string,
      createdAt: string (ISO date),
      updatedAt: string (ISO date)
    }
  ]
}

POST /api/assignments/submit
{
  assignmentId: string,
  studentId: string,
  submissionContent: string, // file path, link URL, or text content
  submissionType: "file" | "link" | "text",
  submittedAt: string (ISO date)
}
*/

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, FileText, Link, File, Download, Upload, Filter, Search, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Api from '../constant/Api';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    course: 'all',
    semester: 'all',
    batch: 'all',
    status: 'active' // Default to active assignments
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await Api.get('api/assignments');
        setAssignments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Failed to load assignments. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, []);

  // Get unique values for filter dropdowns
  const uniqueCourses = useMemo(() => {
    return [...new Set(assignments.map(a => a.courseCode))].sort();
  }, [assignments]);
  
  const uniqueSemesters = useMemo(() => {
    return [...new Set(assignments.map(a => a.semester))].sort((a, b) => a - b);
  }, [assignments]);
  
  const uniqueBatches = useMemo(() => {
    return [...new Set(assignments.map(a => a.batch))].sort();
  }, [assignments]);

  // Filter assignments based on selected filters
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      // Search filter
      const searchMatch = 
        filters.search === '' || 
        assignment.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        assignment.courseCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        assignment.courseTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        assignment.facultyName.toLowerCase().includes(filters.search.toLowerCase());
      
      // Course filter
      const courseMatch = 
        filters.course === 'all' || 
        assignment.courseCode === filters.course;
      
      // Semester filter
      const semesterMatch = 
        filters.semester === 'all' || 
        assignment.semester.toString() === filters.semester;
      
      // Batch filter
      const batchMatch = 
        filters.batch === 'all' || 
        assignment.batch === filters.batch;
      
      // Status filter
      const statusMatch = 
        filters.status === 'all' || 
        assignment.status === filters.status;
      
      return searchMatch && courseMatch && semesterMatch && batchMatch && statusMatch;
    });
  }, [filters, assignments]);

  // Handler for filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
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

  // Calculate time remaining until deadline
  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    
    if (diffTime <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    }
  };

  // Get appropriate icon for submission type
  const getSubmissionTypeIcon = (type) => {
    switch (type) {
      case 'file': return <File size={18} />;
      case 'link': return <Link size={18} />;
      case 'text': return <FileText size={18} />;
      default: return <FileText size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Assignments</h1>
          <p className="text-lg text-gray-600">
            View and submit assignments for your courses.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search assignments..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-2/3 justify-end">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
              >
                <option value="all">All Semesters</option>
                {uniqueSemesters.map(semester => (
                  <option key={semester} value={semester.toString()}>Semester {semester}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={filters.batch}
                onChange={(e) => handleFilterChange('batch', e.target.value)}
              >
                <option value="all">All Batches</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>Batch {batch}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="past">Past</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Assignment List */}
        {filteredAssignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12"
          >
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-1">No assignments found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <BookOpen size={16} className="mr-1" />
                        <span className="mr-3">{assignment.courseCode}: {assignment.courseTitle}</span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Semester {assignment.semester}</span>
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Batch {assignment.batch}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0">
                      {assignment.status === 'active' ? (
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1 text-amber-500" />
                          <span className="text-sm font-medium">
                            {getTimeRemaining(assignment.deadline)} remaining
                          </span>
                        </div>
                      ) : assignment.status === 'past' ? (
                        <span className="text-sm font-medium text-red-500">Deadline passed</span>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">Draft</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                    <p>{assignment.description}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <Calendar size={16} className="mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500 mr-4">Due: {formatDate(assignment.deadline)}</span>
                      
                      <div className="flex items-center">
                        {getSubmissionTypeIcon(assignment.submissionType)}
                        <span className="ml-1 text-sm text-gray-500 capitalize">
                          {assignment.submissionType} submission
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <button className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                          <Download size={16} className="mr-1" />
                          Materials
                        </button>
                      )}
                      
                      {assignment.status === 'active' && (
                        <button className="flex items-center px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                          <Upload size={16} className="mr-1" />
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Assignments;
