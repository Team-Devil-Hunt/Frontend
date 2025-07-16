import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen, Users, CheckSquare, X, BarChart2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FacultyCourseAttendanceSummary = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({ 
    averageAttendance: 0, 
    totalClasses: 0,
    studentsAboveThreshold: 0,
    studentsBelowThreshold: 0
  });

  // Mock courses data
  const mockCourses = [
    {
      id: '1',
      courseCode: 'CSE-401',
      courseTitle: 'Computer Networks',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Sun, Tue 11:00 AM - 12:30 PM',
      room: 'Room 301',
      students: 10 // Using 10 to match our mock students
    },
    {
      id: '2',
      courseCode: 'CSE-402',
      courseTitle: 'Computer Architecture',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Mon, Wed 9:30 AM - 11:00 AM',
      room: 'Room 302',
      students: 10
    },
    {
      id: '3',
      courseCode: 'CSE-405',
      courseTitle: 'Machine Learning',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Wed, Thu 2:00 PM - 3:30 PM',
      room: 'Room 303',
      students: 10
    }
  ];

  // Mock students data
  const mockStudents = [
    { id: '1', name: 'Md. Rakib Hasan', roll: '19-12345', regNo: '2019-235-745' },
    { id: '2', name: 'Fatima Akter', roll: '19-12346', regNo: '2019-235-746' },
    { id: '3', name: 'Abdullah Al Mamun', roll: '19-12347', regNo: '2019-235-747' },
    { id: '4', name: 'Nusrat Jahan', roll: '19-12348', regNo: '2019-235-748' },
    { id: '5', name: 'Tanvir Ahmed', roll: '19-12349', regNo: '2019-235-749' },
    { id: '6', name: 'Sadia Rahman', roll: '19-12350', regNo: '2019-235-750' },
    { id: '7', name: 'Mehedi Hasan', roll: '19-12351', regNo: '2019-235-751' },
    { id: '8', name: 'Tasnim Akter', roll: '19-12352', regNo: '2019-235-752' },
    { id: '9', name: 'Rahat Khan', roll: '19-12353', regNo: '2019-235-753' },
    { id: '10', name: 'Sabrina Islam', roll: '19-12354', regNo: '2019-235-754' },
  ];

  // Generate mock attendance data for a course
  const generateMockAttendanceSummary = (courseId) => {
    // Get class dates for the course
    const today = new Date();
    const classDates = [];
    
    // Generate class dates for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Only include dates that match the course schedule
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      let includeDate = false;
      if (courseId === '1' && (dayOfWeek === 0 || dayOfWeek === 2)) {
        includeDate = true;
      } else if (courseId === '2' && (dayOfWeek === 1 || dayOfWeek === 3)) {
        includeDate = true;
      } else if (courseId === '3' && (dayOfWeek === 3 || dayOfWeek === 4)) {
        includeDate = true;
      }
      
      if (includeDate) {
        classDates.push(date.toISOString().split('T')[0]);
      }
    }
    
    // Sort dates in ascending order
    classDates.sort((a, b) => new Date(a) - new Date(b));
    
    // Generate attendance summary for each student
    const summary = mockStudents.map(student => {
      // Generate attendance for each class date
      const attendance = classDates.map(date => {
        // 70% chance of being present
        const present = Math.random() < 0.7;
        return { date, present };
      });
      
      // Calculate attendance percentage
      const presentCount = attendance.filter(a => a.present).length;
      const percentage = (presentCount / attendance.length) * 100;
      
      return {
        studentId: student.id,
        studentName: student.name,
        studentRoll: student.roll,
        attendance: attendance,
        presentCount: presentCount,
        totalClasses: attendance.length,
        attendancePercentage: percentage.toFixed(1)
      };
    });
    
    // Set date range
    if (classDates.length > 0) {
      setDateRange({
        start: classDates[0],
        end: classDates[classDates.length - 1]
      });
    }
    
    // Calculate overall statistics
    const totalStudents = summary.length;
    const totalClasses = classDates.length;
    const attendancePercentages = summary.map(s => parseFloat(s.attendancePercentage));
    const averageAttendance = attendancePercentages.reduce((sum, val) => sum + val, 0) / totalStudents;
    const studentsAboveThreshold = summary.filter(s => parseFloat(s.attendancePercentage) >= 75).length;
    const studentsBelowThreshold = totalStudents - studentsAboveThreshold;
    
    setStats({
      averageAttendance: averageAttendance.toFixed(1),
      totalClasses: totalClasses,
      studentsAboveThreshold: studentsAboveThreshold,
      studentsBelowThreshold: studentsBelowThreshold
    });
    
    return summary;
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        
        // Find course from mock data
        const foundCourse = mockCourses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          toast.error('Course not found');
          navigate('/faculty/students');
          return;
        }
        
        setCourse(foundCourse);
        
        // Generate mock attendance summary
        const summary = generateMockAttendanceSummary(courseId);
        setAttendanceSummary(summary);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load course attendance data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleBack = () => {
    navigate('/faculty/students');
  };

  const handleExportAttendance = () => {
    // In a real app, this would generate and download a CSV or Excel file
    toast.success('Attendance report downloaded successfully');
  };

  const handleViewStudentDetails = (studentId) => {
    navigate(`/faculty/students/${courseId}/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to Attendance
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{course.courseCode}</h1>
              <p className="text-gray-600">{course.courseTitle}</p>
              <p className="text-sm text-gray-500">{course.schedule} | {course.room}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleExportAttendance}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download size={18} className="mr-2" /> Export Attendance
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-blue-800">Average Attendance</h3>
              <BarChart2 size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-800">{stats.averageAttendance}%</p>
            <p className="text-sm text-blue-600">class average</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-green-800">Above 75%</h3>
              <CheckSquare size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-800">{stats.studentsAboveThreshold}</p>
            <p className="text-sm text-green-600">students</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-800">Below 75%</h3>
              <X size={20} className="text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-800">{stats.studentsBelowThreshold}</p>
            <p className="text-sm text-red-600">students</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">Total Classes</h3>
              <Calendar size={20} className="text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalClasses}</p>
            <p className="text-sm text-gray-600">{formatDate(dateRange.start)} - {formatDate(dateRange.end)}</p>
          </div>
        </div>
      </div>
      
      {/* Student Attendance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Student Attendance Summary</h2>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Threshold:</span> 75% attendance required
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceSummary.map((student, index) => (
                <tr key={student.studentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentRoll}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {student.presentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {student.totalClasses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            parseFloat(student.attendancePercentage) >= 75 
                              ? 'bg-green-500' 
                              : parseFloat(student.attendancePercentage) >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{student.attendancePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      parseFloat(student.attendancePercentage) >= 75
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {parseFloat(student.attendancePercentage) >= 75 ? 'Good' : 'At Risk'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => handleViewStudentDetails(student.studentId)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyCourseAttendanceSummary;
