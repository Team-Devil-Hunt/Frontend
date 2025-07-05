/*
API Schema:
GET /api/exams
{
  exams: [
    {
      id: string,
      courseCode: string,
      courseTitle: string,
      semester: number,
      batch: string,
      examType: "midterm" | "final" | "retake" | "improvement",
      date: string (ISO date),
      startTime: string (format: "HH:MM"),
      endTime: string (format: "HH:MM"),
      room: string,
      invigilators: string[],
      status: "scheduled" | "ongoing" | "completed" | "cancelled",
      notes: string
    }
  ]
}
*/

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Filter, Search, AlertTriangle } from 'lucide-react';
import ExamFilters from '../components/exams/ExamFilters';
import ExamCard from '../components/exams/ExamCard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Mock data for exams
const mockExams = [
  {
    id: "1",
    courseCode: "CSE-401",
    courseTitle: "Artificial Intelligence",
    semester: 4,
    batch: "25",
    examType: "midterm",
    date: "2025-07-15",
    startTime: "10:00",
    endTime: "12:00",
    room: "Room 301",
    invigilators: ["Dr. Rashid Ahmed", "Ms. Fatima Khan"],
    status: "scheduled",
    notes: "Bring your student ID and calculator."
  },
  {
    id: "2",
    courseCode: "CSE-303",
    courseTitle: "Database Systems",
    semester: 3,
    batch: "25",
    examType: "final",
    date: "2025-07-20",
    startTime: "09:00",
    endTime: "12:00",
    room: "Room 201",
    invigilators: ["Prof. Hasanul Karim", "Dr. Tahmina Akter"],
    status: "scheduled",
    notes: "Open book exam. Bring your textbook and notes."
  },
  {
    id: "3",
    courseCode: "CSE-205",
    courseTitle: "Data Structures",
    semester: 2,
    batch: "26",
    examType: "midterm",
    date: "2025-07-10",
    startTime: "14:00",
    endTime: "16:00",
    room: "Room 102",
    invigilators: ["Dr. Shahid Hasan", "Ms. Nusrat Jahan"],
    status: "scheduled",
    notes: "No electronic devices allowed."
  },
  {
    id: "4",
    courseCode: "CSE-501",
    courseTitle: "Advanced Machine Learning",
    semester: 5,
    batch: "24",
    examType: "final",
    date: "2025-07-25",
    startTime: "10:00",
    endTime: "13:00",
    room: "Room 401",
    invigilators: ["Prof. Mahmud Hasan", "Dr. Aisha Begum"],
    status: "scheduled",
    notes: "Bring your laptop with required software installed."
  },
  {
    id: "5",
    courseCode: "CSE-103",
    courseTitle: "Introduction to Programming",
    semester: 1,
    batch: "27",
    examType: "final",
    date: "2025-07-12",
    startTime: "09:00",
    endTime: "11:00",
    room: "Room 101",
    invigilators: ["Dr. Kamal Uddin", "Ms. Sabina Yasmin"],
    status: "scheduled",
    notes: "Bring your student ID."
  },
  {
    id: "6",
    courseCode: "CSE-307",
    courseTitle: "Operating Systems",
    semester: 3,
    batch: "25",
    examType: "midterm",
    date: "2025-07-08",
    startTime: "11:00",
    endTime: "13:00",
    room: "Room 201",
    invigilators: ["Prof. Anisur Rahman", "Dr. Farhana Islam"],
    status: "scheduled",
    notes: "Closed book exam."
  },
  {
    id: "7",
    courseCode: "CSE-407",
    courseTitle: "Computer Networks",
    semester: 4,
    batch: "24",
    examType: "improvement",
    date: "2025-07-30",
    startTime: "14:00",
    endTime: "16:00",
    room: "Room 302",
    invigilators: ["Dr. Zahid Hasan", "Ms. Rumana Akter"],
    status: "scheduled",
    notes: "Only for students who registered for improvement."
  },
  {
    id: "8",
    courseCode: "CSE-203",
    courseTitle: "Discrete Mathematics",
    semester: 2,
    batch: "26",
    examType: "retake",
    date: "2025-07-18",
    startTime: "10:00",
    endTime: "12:00",
    room: "Room 102",
    invigilators: ["Prof. Kamrul Hasan", "Dr. Nasreen Akter"],
    status: "scheduled",
    notes: "Only for students who failed in the regular exam."
  },
  {
    id: "9",
    courseCode: "CSE-601",
    courseTitle: "Advanced Algorithms",
    semester: 6,
    batch: "23",
    examType: "final",
    date: "2025-07-22",
    startTime: "09:00",
    endTime: "12:00",
    room: "Room 401",
    invigilators: ["Prof. Mahbub Alam", "Dr. Sultana Begum"],
    status: "scheduled",
    notes: "Bring your algorithm design handbook."
  },
  {
    id: "10",
    courseCode: "CSE-405",
    courseTitle: "Software Engineering",
    semester: 4,
    batch: "24",
    examType: "final",
    date: "2025-07-28",
    startTime: "10:00",
    endTime: "13:00",
    room: "Room 301",
    invigilators: ["Dr. Rafiqul Islam", "Ms. Taslima Khatun"],
    status: "scheduled",
    notes: "Project documentation submission required before exam."
  }
];

const ExamTimetables = () => {
  const [filters, setFilters] = useState({
    search: '',
    semester: 'all',
    examType: 'all',
    room: 'all',
    batch: 'all',
    status: 'all',
  });

  // Get unique values for filter dropdowns
  const uniqueSemesters = [...new Set(mockExams.map(exam => exam.semester))].sort((a, b) => a - b);
  const uniqueRooms = [...new Set(mockExams.map(exam => exam.room))].sort();
  const uniqueBatches = [...new Set(mockExams.map(exam => exam.batch))].sort((a, b) => b - a);
  
  // Filter exams based on selected filters
  const filteredExams = useMemo(() => {
    return mockExams.filter(exam => {
      // Search filter
      const searchMatch = 
        filters.search === '' || 
        exam.courseCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        exam.courseTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        exam.invigilators.some(inv => inv.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Semester filter
      const semesterMatch = 
        filters.semester === 'all' || 
        exam.semester.toString() === filters.semester;
      
      // Exam type filter
      const examTypeMatch = 
        filters.examType === 'all' || 
        exam.examType === filters.examType;
      
      // Room filter
      const roomMatch = 
        filters.room === 'all' || 
        exam.room === filters.room;
      
      // Batch filter
      const batchMatch = 
        filters.batch === 'all' || 
        exam.batch === filters.batch;
      
      // Status filter
      const statusMatch = 
        filters.status === 'all' || 
        exam.status === filters.status;
      
      return searchMatch && semesterMatch && examTypeMatch && roomMatch && batchMatch && statusMatch;
    });
  }, [filters]);

  // Handler for filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Exam Timetables</h1>
          <p className="text-lg text-gray-600">
            View and filter upcoming examinations for all courses and semesters.
          </p>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Upcoming Exams</h3>
            <p className="text-3xl font-bold">{mockExams.filter(e => e.status === 'scheduled').length}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold mb-2">This Week</h3>
            <p className="text-3xl font-bold">4</p>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Courses</h3>
            <p className="text-3xl font-bold">{[...new Set(mockExams.map(e => e.courseCode))].length}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <ExamFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            semesters={uniqueSemesters}
            rooms={uniqueRooms}
            batches={uniqueBatches}
          />
        </motion.div>

        {/* Exams List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <ExamCard exam={exam} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-500">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ExamTimetables;
