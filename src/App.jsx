import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Faculty from './pages/Faculty';
import FacultyProfile from './pages/FacultyProfile';
import Programs from './pages/Programs';
import Courses from './pages/Courses';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import Schedule from './pages/Schedule';
import RoomBooking from './pages/RoomBooking';
import Exams from './pages/Exams';
import ExamTimetables from './pages/ExamTimetables';
import Assignments from './pages/Assignments';
import Login from './pages/Login';
import Notices from './pages/Notices';
import Meetings from './pages/Meetings';
import Events from './pages/Events';
import Fees from './pages/Fees';
import LabBooking from './pages/LabBooking';
import Projects from './pages/Projects';
import Awards from './pages/Awards';
import EquipmentBooking from './pages/EquipmentBooking';

// Dashboard Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentMeetings from './pages/dashboard/StudentMeetings';
import StudentAssignments from './pages/dashboard/StudentAssignments';
import StudentFees from './pages/dashboard/StudentFees';
import StudentCourses from './pages/dashboard/StudentCourses';
import StudentExams from './pages/dashboard/StudentExams';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import FacultyMeetings from './pages/dashboard/FacultyMeetings';
import FacultyCourses from './pages/dashboard/FacultyCourses';
import FacultyAssignments from './pages/dashboard/FacultyAssignments';
import FacultyAssignmentDetail from './pages/dashboard/FacultyAssignmentDetail';
import FacultyCreateAssignment from './pages/dashboard/FacultyCreateAssignment';
import FacultyStudents from './pages/dashboard/FacultyStudents';
import FacultyStudentAttendanceDetail from './pages/dashboard/FacultyStudentAttendanceDetail';
import FacultyCourseAttendanceSummary from './pages/dashboard/FacultyCourseAttendanceSummary';
import FacultyCourseDetails from './pages/dashboard/FacultyCourseDetails';



import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <Outlet />
              </motion.main>
              <Footer />
            </div>
          }
        >
          <Route index element={<Home />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="faculty/:id" element={<FacultyProfile />} />
          <Route path="programs" element={<Programs />} />
          <Route path="courses" element={<Courses />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="room-booking" element={<RoomBooking />} />
          <Route path="equipment-booking" element={<EquipmentBooking />} />
          <Route path="exams" element={<Exams />} />
          <Route path="exam-timetables" element={<ExamTimetables />} />
          <Route path="login" element={<Login />} />
          <Route path="notices" element={<Notices />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="events" element={<Events />} />
          <Route path="fees" element={<Fees />} />
          <Route path="lab-booking" element={<LabBooking />} />
          <Route path="projects" element={<Projects />} />
          <Route path="awards" element={<Awards />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Dashboard Routes - No Navbar/Footer */}
        <Route path="student/*" element={<StudentDashboard />}>
          <Route index element={<Navigate to="meetings" replace />} />
          <Route path="meetings" element={<StudentMeetings />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="exams" element={<StudentExams />} />
        </Route>
        
        <Route path="faculty/*" element={<FacultyDashboard />}>
          <Route index element={<Navigate to="meetings" replace />} />
          <Route path="meetings" element={<FacultyMeetings />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="assignments/create" element={<FacultyCreateAssignment />} />
          <Route path="assignments/:assignmentId" element={<FacultyAssignmentDetail />} />
          <Route path="students" element={<FacultyStudents />} />
          <Route path="students/:courseId/:studentId" element={<FacultyStudentAttendanceDetail />} />
          <Route path="students/course/:courseId" element={<FacultyCourseAttendanceSummary />} />
          <Route path="courses/:courseId" element={<FacultyCourseDetails />} />
        </Route>
      </Routes>

      <Toaster />
    </Router>
    </QueryClientProvider>
  );
}

export default App
