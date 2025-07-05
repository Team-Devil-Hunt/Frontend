import React from 'react';
import { Search, Filter, Calendar, MapPin, Users, Clock } from 'lucide-react';

const ExamFilters = ({ filters, onFilterChange, semesters, rooms, batches }) => {
  const handleSearchChange = (e) => {
    onFilterChange('search', e.target.value);
  };

  const handleSelectChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-indigo-100">
      <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
        <Filter className="mr-2 h-5 w-5 text-indigo-600" />
        Filter Exams
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by course, code or invigilator..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 w-full py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          />
        </div>

        {/* Semester Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleSelectChange}
            className="pl-10 w-full py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-700"
            style={{ backgroundImage: "linear-gradient(to right, rgba(168, 85, 247, 0.05), rgba(168, 85, 247, 0.1))" }}
          >
            <option value="all">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester.toString()}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Type Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-pink-500" />
          </div>
          <select
            name="examType"
            value={filters.examType}
            onChange={handleSelectChange}
            className="pl-10 w-full py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-700"
            style={{ backgroundImage: "linear-gradient(to right, rgba(236, 72, 153, 0.05), rgba(236, 72, 153, 0.1))" }}
          >
            <option value="all">All Exam Types</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="retake">Retake</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>

        {/* Room Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-emerald-500" />
          </div>
          <select
            name="room"
            value={filters.room}
            onChange={handleSelectChange}
            className="pl-10 w-full py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-700"
            style={{ backgroundImage: "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1))" }}
          >
            <option value="all">All Rooms</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-amber-500" />
          </div>
          <select
            name="batch"
            value={filters.batch}
            onChange={handleSelectChange}
            className="pl-10 w-full py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700"
            style={{ backgroundImage: "linear-gradient(to right, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1))" }}
          >
            <option value="all">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
          </div>
          <select
            name="status"
            value={filters.status}
            onChange={handleSelectChange}
            className="pl-10 w-full py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            style={{ backgroundImage: "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))" }}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Quick Filter Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button 
          onClick={() => {
            onFilterChange('status', 'scheduled');
            onFilterChange('examType', 'all');
          }}
          className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          Upcoming Exams
        </button>
        <button 
          onClick={() => {
            onFilterChange('examType', 'midterm');
            onFilterChange('status', 'all');
          }}
          className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          Midterm Exams
        </button>
        <button 
          onClick={() => {
            onFilterChange('examType', 'final');
            onFilterChange('status', 'all');
          }}
          className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-sm font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          Final Exams
        </button>
        <button 
          onClick={() => {
            // Get current date
            const today = new Date();
            const thisWeek = new Date();
            thisWeek.setDate(today.getDate() + 7);
            
            // Reset all filters first
            onFilterChange('status', 'scheduled');
            onFilterChange('examType', 'all');
            onFilterChange('semester', 'all');
            onFilterChange('room', 'all');
            onFilterChange('batch', 'all');
          }}
          className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
        >
          This Week
        </button>
        <button 
          onClick={() => {
            // Reset all filters
            onFilterChange('search', '');
            onFilterChange('semester', 'all');
            onFilterChange('examType', 'all');
            onFilterChange('room', 'all');
            onFilterChange('batch', 'all');
            onFilterChange('status', 'all');
          }}
          className="px-4 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default ExamFilters;
