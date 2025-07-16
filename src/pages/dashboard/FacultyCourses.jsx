import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateProvider';
import { Book, Users, Calendar, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FacultyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  // Mock courses data
  const mockCourses = [
    {
      id: '1',
      courseCode: 'CSE101',
      title: 'Introduction to Computer Science',
      description: 'An introductory course covering the basics of computer science, programming concepts, and problem-solving techniques. Students will learn fundamental algorithms and data structures.',
      semester: 1,
      batch: '26th',
      section: 'A',
      schedule: 'Mon, Wed 10:00-11:30 AM',
      room: 'Room 301',
      students: 45,
      credits: 3,
      level: 'Undergraduate'
    },
    {
      id: '2',
      courseCode: 'CSE-402',
      title: 'Computer Architecture',
      description: 'Study of computer architecture and organization, focusing on CPU design, memory systems, and I/O interfaces.',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Mon, Wed 9:30 AM - 11:00 AM',
      room: 'Room 302',
      students: 40,
      credits: 3,
      level: 'Undergraduate'
    },
    {
      id: '3',
      courseCode: 'CSE-405',
      title: 'Machine Learning',
      description: 'Introduction to machine learning algorithms and applications.',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Wed, Thu 2:00 PM - 3:30 PM',
      room: 'Room 303',
      students: 38,
      credits: 3,
      level: 'Undergraduate'
    }
  ];

  useEffect(() => {
    // Simulate API call with mock data
    const fetchCourses = () => {
      try {
        setLoading(true);
        // Use mock data instead of API call
        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses. Please try again later.');
        toast.error('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
  const handleViewCourseDetails = (courseId) => {
    navigate(`/faculty/courses/${courseId}`);
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
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
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

  if (courses.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>
        <p className="text-gray-500">You are not currently teaching any courses.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-blue-500">
        <h2 className="text-xl leading-6 font-bold text-white">My Courses</h2>
        <p className="mt-1 max-w-2xl text-sm text-indigo-100">
          Courses you are currently teaching this semester
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm text-gray-500">
            Total courses: <span className="font-medium text-gray-900">{courses.length}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Book className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{course.courseCode}</h3>
                    <p className="text-sm text-gray-500">{course.title}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{course.students} Students</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{course.room}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.level}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {course.credits} Credits
                    </span>
                  </div>
                  <button 
                    onClick={() => handleViewCourseDetails(course.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyCourses;
