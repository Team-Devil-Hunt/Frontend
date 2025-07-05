import React from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamCard = ({ exam }) => {
  // Define color schemes based on exam type
  const examTypeColors = {
    midterm: {
      bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      border: 'border-purple-400',
      light: 'bg-purple-100 text-purple-800',
      icon: 'text-purple-500'
    },
    final: {
      bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      border: 'border-blue-400',
      light: 'bg-blue-100 text-blue-800',
      icon: 'text-blue-500'
    },
    retake: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      border: 'border-amber-400',
      light: 'bg-amber-100 text-amber-800',
      icon: 'text-amber-500'
    },
    improvement: {
      bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      border: 'border-emerald-400',
      light: 'bg-emerald-100 text-emerald-800',
      icon: 'text-emerald-500'
    }
  };

  // Define color schemes based on exam status
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    ongoing: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get color scheme
  const colorScheme = examTypeColors[exam.examType] || examTypeColors.final;
  const statusColor = statusColors[exam.status] || statusColors.scheduled;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl overflow-hidden shadow-lg border ${colorScheme.border} hover:shadow-xl transition-all`}
    >
      {/* Header */}
      <div className={`${colorScheme.bg} text-white p-4`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{exam.courseCode}</h3>
            <p className="text-white/90 font-medium">{exam.courseTitle}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Date */}
          <div className="flex items-center">
            <Calendar className={`h-4 w-4 mr-2 ${colorScheme.icon}`} />
            <span className="text-sm text-gray-700">{formatDate(exam.date)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center">
            <Clock className={`h-4 w-4 mr-2 ${colorScheme.icon}`} />
            <span className="text-sm text-gray-700">{exam.startTime} - {exam.endTime}</span>
          </div>

          {/* Room */}
          <div className="flex items-center">
            <MapPin className={`h-4 w-4 mr-2 ${colorScheme.icon}`} />
            <span className="text-sm text-gray-700">{exam.room}</span>
          </div>

          {/* Batch & Semester */}
          <div className="flex items-center">
            <Users className={`h-4 w-4 mr-2 ${colorScheme.icon}`} />
            <span className="text-sm text-gray-700">Batch {exam.batch}, Semester {exam.semester}</span>
          </div>
        </div>

        {/* Exam Type Badge */}
        <div className="flex items-center mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colorScheme.light} mr-2`}>
            {exam.examType.toUpperCase()}
          </div>
          <BookOpen className={`h-4 w-4 ${colorScheme.icon}`} />
        </div>

        {/* Invigilators */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Invigilators:</p>
          <p className="text-sm text-gray-700">{exam.invigilators.join(', ')}</p>
        </div>

        {/* Notes */}
        {exam.notes && (
          <div className="flex items-start mt-3 bg-gray-50 p-2 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">{exam.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-500">ID: {exam.id}</span>
        <button className={`px-3 py-1 rounded-md text-xs font-medium text-white ${colorScheme.bg} hover:opacity-90 transition-opacity`}>
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ExamCard;
