import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateProvider';
import { toast } from 'react-hot-toast';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  Users, 
  PlusCircle,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courses, setCourses] = useState([]);
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for faculty assignments
    const mockAssignments = [
      {
        id: 1,
        title: 'Mid-term Assignment',
        courseCode: 'CSE-401',
        courseTitle: 'Computer Networks',
        semester: 4,
        batch: '25th',
        deadline: '2025-07-30T23:59:59Z',
        description: 'Design a network topology for a university campus',
        submissionType: 'file',
        status: 'active',
        facultyName: 'Dr. Anisur Rahman',
        createdAt: '2025-07-10T10:00:00Z',
        updatedAt: '2025-07-10T10:00:00Z',
        submissionCount: 12,
        totalStudents: 45
      },
      {
        id: 2,
        title: 'Final Project',
        courseCode: 'CSE-402',
        courseTitle: 'Computer Architecture',
        semester: 4,
        batch: '25th',
        deadline: '2025-08-15T23:59:59Z',
        description: 'Implement a simple CPU design using Verilog',
        submissionType: 'file',
        status: 'active',
        facultyName: 'Dr. Anisur Rahman',
        createdAt: '2025-07-05T14:30:00Z',
        updatedAt: '2025-07-05T14:30:00Z',
        submissionCount: 8,
        totalStudents: 40
      },
      {
        id: 3,
        title: 'Lab Report 1',
        courseCode: 'CSE-401',
        courseTitle: 'Computer Networks',
        semester: 4,
        batch: '25th',
        deadline: '2025-07-05T23:59:59Z',
        description: 'Submit your lab report for the first networking lab',
        submissionType: 'file',
        status: 'past',
        facultyName: 'Dr. Anisur Rahman',
        createdAt: '2025-06-28T09:15:00Z',
        updatedAt: '2025-06-28T09:15:00Z',
        submissionCount: 42,
        totalStudents: 45
      },
      {
        id: 4,
        title: 'Research Paper Review',
        courseCode: 'CSE-405',
        courseTitle: 'Machine Learning',
        semester: 4,
        batch: '25th',
        deadline: '2025-08-10T23:59:59Z',
        description: 'Review a recent paper on deep learning',
        submissionType: 'text',
        status: 'draft',
        facultyName: 'Dr. Anisur Rahman',
        createdAt: '2025-07-12T16:45:00Z',
        updatedAt: '2025-07-12T16:45:00Z',
        submissionCount: 0,
        totalStudents: 38
      }
    ];
    
    // Apply filters if needed
    let filteredAssignments = mockAssignments;
    if (courseFilter) {
      filteredAssignments = filteredAssignments.filter(a => a.courseCode === courseFilter);
    }
    if (statusFilter) {
      filteredAssignments = filteredAssignments.filter(a => a.status === statusFilter);
    }
    
    setAssignments(filteredAssignments);
    
    // Extract unique course codes for filtering
    const uniqueCourses = [...new Set(mockAssignments.map(a => a.courseCode))];
    setCourses(uniqueCourses);
    
    setLoading(false);
  }, [courseFilter, statusFilter]);

  const handleCreateAssignment = () => {
    navigate('/faculty/assignments/create');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'past':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

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

  const isDeadlineSoon = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.floor((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl leading-6 font-bold text-white">My Assignments</h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-100">
              Manage assignments for your courses
            </p>
          </div>
          <button
            onClick={handleCreateAssignment}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Assignment
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="course-filter" className="sr-only">Course</label>
              <select
                id="course-filter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <label htmlFor="status-filter" className="sr-only">Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="past">Past</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Assignment List */}
      <div className="overflow-hidden">
        {assignments.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {courseFilter || statusFilter ? 
                'Try changing your filters or create a new assignment.' : 
                'Get started by creating a new assignment.'}
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateAssignment}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                Create Assignment
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="hover:bg-gray-50">
                <Link to={`/faculty/assignments/${assignment.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ClipboardList className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {assignment.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {assignment.courseCode} - {assignment.courseTitle}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(assignment.status)}`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                        <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>Due: {formatDate(assignment.deadline)}</p>
                          {isDeadlineSoon(assignment.deadline) && assignment.status === 'active' && (
                            <span className="ml-2 text-xs font-medium text-red-600">Due soon!</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          {assignment.submissionCount} / {assignment.totalStudents} submissions
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FacultyAssignments;
