import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, CheckSquare, X, Search, Filter, BarChart2 } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateProvider';
import { toast } from 'react-hot-toast';

const FacultyStudents = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  // Mock data for courses
  const mockCourses = [
    {
      id: 1,
      courseCode: 'CSE-401',
      courseTitle: 'Computer Networks',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Sun, Tue 11:00 AM - 12:30 PM',
      room: 'Room 301',
      students: 45
    },
    {
      id: 2,
      courseCode: 'CSE-402',
      courseTitle: 'Computer Architecture',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Mon, Wed 9:30 AM - 11:00 AM',
      room: 'Room 302',
      students: 40
    },
    {
      id: 3,
      courseCode: 'CSE-405',
      courseTitle: 'Machine Learning',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Wed, Thu 2:00 PM - 3:30 PM',
      room: 'Room 303',
      students: 38
    }
  ];

  // Mock data for students
  const mockStudents = [
    { id: 1, name: 'Md. Rakib Hasan', roll: '19-12345', regNo: '2019-235-745' },
    { id: 2, name: 'Fatima Akter', roll: '19-12346', regNo: '2019-235-746' },
    { id: 3, name: 'Abdullah Al Mamun', roll: '19-12347', regNo: '2019-235-747' },
    { id: 4, name: 'Nusrat Jahan', roll: '19-12348', regNo: '2019-235-748' },
    { id: 5, name: 'Tanvir Ahmed', roll: '19-12349', regNo: '2019-235-749' },
    { id: 6, name: 'Sadia Rahman', roll: '19-12350', regNo: '2019-235-750' },
    { id: 7, name: 'Mehedi Hasan', roll: '19-12351', regNo: '2019-235-751' },
    { id: 8, name: 'Tasnim Akter', roll: '19-12352', regNo: '2019-235-752' },
    { id: 9, name: 'Rahat Khan', roll: '19-12353', regNo: '2019-235-753' },
    { id: 10, name: 'Sabrina Islam', roll: '19-12354', regNo: '2019-235-754' },
  ];

  // Mock attendance data by date and course
  const mockAttendanceData = {
    'CSE-401': {
      '2025-07-16': [
        { studentId: 1, present: true },
        { studentId: 2, present: true },
        { studentId: 3, present: false },
        { studentId: 4, present: true },
        { studentId: 5, present: true },
        { studentId: 6, present: false },
        { studentId: 7, present: true },
        { studentId: 8, present: true },
        { studentId: 9, present: true },
        { studentId: 10, present: false },
      ],
      '2025-07-14': [
        { studentId: 1, present: true },
        { studentId: 2, present: true },
        { studentId: 3, present: true },
        { studentId: 4, present: true },
        { studentId: 5, present: false },
        { studentId: 6, present: true },
        { studentId: 7, present: false },
        { studentId: 8, present: true },
        { studentId: 9, present: true },
        { studentId: 10, present: true },
      ],
      '2025-07-12': [
        { studentId: 1, present: false },
        { studentId: 2, present: true },
        { studentId: 3, present: true },
        { studentId: 4, present: true },
        { studentId: 5, present: true },
        { studentId: 6, present: true },
        { studentId: 7, present: true },
        { studentId: 8, present: false },
        { studentId: 9, present: true },
        { studentId: 10, present: true },
      ]
    },
    'CSE-402': {
      '2025-07-15': [
        { studentId: 1, present: true },
        { studentId: 2, present: false },
        { studentId: 3, present: true },
        { studentId: 4, present: true },
        { studentId: 5, present: true },
        { studentId: 6, present: true },
        { studentId: 7, present: false },
        { studentId: 8, present: true },
        { studentId: 9, present: true },
        { studentId: 10, present: true },
      ],
      '2025-07-13': [
        { studentId: 1, present: true },
        { studentId: 2, present: true },
        { studentId: 3, present: true },
        { studentId: 4, present: false },
        { studentId: 5, present: true },
        { studentId: 6, present: true },
        { studentId: 7, present: true },
        { studentId: 8, present: true },
        { studentId: 9, present: false },
        { studentId: 10, present: true },
      ]
    },
    'CSE-405': {
      '2025-07-16': [
        { studentId: 1, present: true },
        { studentId: 2, present: true },
        { studentId: 3, present: true },
        { studentId: 4, present: true },
        { studentId: 5, present: true },
        { studentId: 6, present: false },
        { studentId: 7, present: true },
        { studentId: 8, present: false },
        { studentId: 9, present: true },
        { studentId: 10, present: true },
      ]
    }
  };

  // Get available dates for the selected course
  const getAvailableDates = (courseCode) => {
    if (!courseCode || !mockAttendanceData[courseCode]) return [];
    return Object.keys(mockAttendanceData[courseCode]).sort((a, b) => new Date(b) - new Date(a));
  };

  useEffect(() => {
    // Simulate loading courses
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      // Get attendance data for selected course and date
      const courseAttendance = mockAttendanceData[selectedCourse.courseCode] || {};
      const dateAttendance = courseAttendance[selectedDate] || [];
      
      // Combine student data with attendance data
      const combinedData = mockStudents.map(student => {
        const attendance = dateAttendance.find(a => a.studentId === student.id);
        return {
          ...student,
          present: attendance ? attendance.present : null
        };
      });
      
      setAttendanceData(combinedData);
    } else {
      setAttendanceData([]);
    }
  }, [selectedCourse, selectedDate]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    // Set the most recent date for the selected course
    const dates = getAvailableDates(course.courseCode);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    } else {
      // If no attendance data exists, set today's date
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAttendanceToggle = (studentId) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, present: !student.present } 
          : student
      )
    );
    
    // In a real app, this would update the backend
    toast.success(`Attendance updated for student ID: ${studentId}`);
  };

  const handleSaveAttendance = () => {
    // In a real app, this would save all attendance data to the backend
    toast.success('Attendance saved successfully!');
  };

  const filteredAttendanceData = attendanceData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendanceStats = attendanceData.length > 0 
    ? {
        present: attendanceData.filter(s => s.present).length,
        absent: attendanceData.filter(s => s.present === false).length,
        unmarked: attendanceData.filter(s => s.present === null).length,
        total: attendanceData.length
      }
    : { present: 0, absent: 0, unmarked: 0, total: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Users className="mr-2" /> Student Attendance
      </h1>

      {/* Course selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <BookOpen className="mr-2" size={18} /> Select Course
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div 
              key={course.id}
              onClick={() => handleCourseSelect(course)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCourse?.id === course.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <h3 className="font-bold">{course.courseCode}</h3>
              <p className="text-sm">{course.courseTitle}</p>
              <div className="text-xs text-gray-500 mt-1">
                <p>{course.schedule}</p>
                <p>{course.room} • {course.students} students</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Date selection and attendance stats */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Calendar className="mr-2" size={18} /> Select Date
              </h2>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedDate} 
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getAvailableDates(selectedCourse.courseCode).map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                  {/* Option to create new attendance for today if not already present */}
                  {!getAvailableDates(selectedCourse.courseCode).includes(new Date().toISOString().split('T')[0]) && (
                    <option value={new Date().toISOString().split('T')[0]}>
                      Today ({new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
                    </option>
                  )}
                </select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex flex-wrap gap-3">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <CheckSquare size={16} className="mr-1" /> Present: {attendanceStats.present}
                </div>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <X size={16} className="mr-1" /> Absent: {attendanceStats.absent}
                </div>
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Total: {attendanceStats.total}
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/faculty/students/course/${selectedCourse.id}`)}
                className="mt-2 md:mt-0 px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm flex items-center"
              >
                <BarChart2 size={16} className="mr-1.5" /> View Course Summary
              </button>
            </div>
          </div>

          {/* Search and filter */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Attendance table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendanceData.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.roll}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.regNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAttendanceToggle(student.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            student.present === null
                              ? 'bg-gray-100 text-gray-800'
                              : student.present
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.present === null ? (
                            'Mark'
                          ) : student.present ? (
                            <>
                              <CheckSquare size={16} className="mr-1" /> Present
                            </>
                          ) : (
                            <>
                              <X size={16} className="mr-1" /> Absent
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/faculty/students/${selectedCourse.id}/${student.id}`)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          View History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveAttendance}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Attendance
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyStudents;
