import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

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
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import FacultyMeetings from './pages/dashboard/FacultyMeetings';

function App() {
  return (
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
          <Route path="dashboard" element={<Navigate to="/student/meetings" replace />} />
          <Route path="meetings" element={<StudentMeetings />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="fees" element={<StudentFees />} />
        </Route>
        
        <Route path="faculty/*" element={<FacultyDashboard />}>
          <Route path="dashboard" element={<Navigate to="/faculty/meetings" replace />} />
          <Route path="meetings" element={<FacultyMeetings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
