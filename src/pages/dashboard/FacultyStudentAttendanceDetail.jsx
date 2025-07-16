import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen, CheckSquare, X, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FacultyStudentAttendanceDetail = () => {
  const { studentId, courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });

  // Mock student data
  const mockStudents = [
    { id: '1', name: 'Md. Rakib Hasan', roll: '19-12345', regNo: '2019-235-745', email: 'rakib@example.com', phone: '01712345678' },
    { id: '2', name: 'Fatima Akter', roll: '19-12346', regNo: '2019-235-746', email: 'fatima@example.com', phone: '01712345679' },
    { id: '3', name: 'Abdullah Al Mamun', roll: '19-12347', regNo: '2019-235-747', email: 'abdullah@example.com', phone: '01712345680' },
    { id: '4', name: 'Nusrat Jahan', roll: '19-12348', regNo: '2019-235-748', email: 'nusrat@example.com', phone: '01712345681' },
    { id: '5', name: 'Tanvir Ahmed', roll: '19-12349', regNo: '2019-235-749', email: 'tanvir@example.com', phone: '01712345682' },
  ];

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
      students: 45
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
      students: 40
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
      students: 38
    }
  ];

  // Mock attendance history data
  const generateMockAttendanceHistory = (studentId, courseId) => {
    const today = new Date();
    const history = [];
    
    // Generate attendance records for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Only include dates that match the course schedule
      // For CSE-401: Sunday and Tuesday
      // For CSE-402: Monday and Wednesday
      // For CSE-405: Wednesday and Thursday
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
        // Randomly determine if student was present (70% chance of being present)
        const present = Math.random() < 0.7;
        
        history.push({
          date: date.toISOString().split('T')[0],
          present: present,
          notes: present ? '' : Math.random() < 0.3 ? 'Medical leave' : ''
        });
      }
    }
    
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        
        // Find student and course from mock data
        const foundStudent = mockStudents.find(s => s.id === studentId);
        const foundCourse = mockCourses.find(c => c.id === courseId);
        
        if (!foundStudent || !foundCourse) {
          toast.error('Student or course not found');
          navigate('/faculty/students');
          return;
        }
        
        setStudent(foundStudent);
        setCourse(foundCourse);
        
        // Generate mock attendance history
        const history = generateMockAttendanceHistory(studentId, courseId);
        setAttendanceHistory(history);
        
        // Calculate attendance statistics
        const presentCount = history.filter(record => record.present).length;
        const absentCount = history.filter(record => !record.present).length;
        const totalCount = history.length;
        const attendancePercentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
        
        setStats({
          present: presentCount,
          absent: absentCount,
          total: totalCount,
          percentage: attendancePercentage.toFixed(1)
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load student attendance data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [studentId, courseId, navigate]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleAttendanceUpdate = (date, present) => {
    // Update the attendance record for the specified date
    setAttendanceHistory(prev => 
      prev.map(record => 
        record.date === date 
          ? { ...record, present } 
          : record
      )
    );
    
    // Recalculate statistics
    const updatedHistory = attendanceHistory.map(record => 
      record.date === date ? { ...record, present } : record
    );
    
    const presentCount = updatedHistory.filter(record => record.present).length;
    const absentCount = updatedHistory.filter(record => !record.present).length;
    const totalCount = updatedHistory.length;
    const attendancePercentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
    
    setStats({
      present: presentCount,
      absent: absentCount,
      total: totalCount,
      percentage: attendancePercentage.toFixed(1)
    });
    
    toast.success(`Attendance updated for ${formatDate(date)}`);
  };

  const handleBack = () => {
    navigate('/faculty/students');
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
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="text-gray-600">Roll: {student.roll} | Reg: {student.regNo}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{course.courseCode}</h2>
              <p className="text-gray-600">{course.courseTitle}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-blue-800">Present</h3>
              <CheckSquare size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-800">{stats.present}</p>
            <p className="text-sm text-blue-600">days</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-800">Absent</h3>
              <X size={20} className="text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-800">{stats.absent}</p>
            <p className="text-sm text-red-600">days</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">Total Classes</h3>
              <Calendar size={20} className="text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600">days</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-green-800">Attendance</h3>
              <BarChart2 size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-800">{stats.percentage}%</p>
            <p className="text-sm text-green-600">attendance rate</p>
          </div>
        </div>
        
        {/* Attendance visualization - simple bar chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* Attendance History Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Attendance History</h2>
          <p className="text-sm text-gray-600">Click on the status to change it</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.map((record, index) => (
                <tr key={record.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => handleAttendanceUpdate(record.date, !record.present)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        record.present
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {record.present ? (
                        <>
                          <CheckSquare size={16} className="mr-1" /> Present
                        </>
                      ) : (
                        <>
                          <X size={16} className="mr-1" /> Absent
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.notes || '-'}
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

export default FacultyStudentAttendanceDetail;
