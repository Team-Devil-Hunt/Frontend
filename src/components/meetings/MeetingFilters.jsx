import React from 'react';
import { Search, Filter, Calendar, Archive, X } from 'lucide-react';

const MeetingFilters = ({ filters, onFiltersChange }) => {
  // Meeting types with colors
  const meetingTypes = [
    { id: 'academic', label: 'Academic', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'research', label: 'Research', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'career', label: 'Career', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'general', label: 'General', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  // Status options
  const statusOptions = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All' }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  // Toggle meeting type filter
  const toggleTypeFilter = (typeId) => {
    const updatedTypes = filters.types.includes(typeId)
      ? filters.types.filter(id => id !== typeId)
      : [...filters.types, typeId];
    
    onFiltersChange({
      ...filters,
      types: updatedTypes
    });
  };

  // Set status filter
  const setStatusFilter = (statusId) => {
    onFiltersChange({
      ...filters,
      status: statusId
    });
  };

  // Toggle archived meetings
  const toggleArchivedFilter = () => {
    onFiltersChange({
      ...filters,
      showArchived: !filters.showArchived
    });
  };

  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({
      search: '',
      types: [],
      status: 'upcoming',
      faculty: [],
      showArchived: false
    });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.search !== '' || 
    filters.types.length > 0 || 
    filters.status !== 'upcoming' || 
    filters.faculty.length > 0 || 
    filters.showArchived;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center mb-3 md:mb-0">
          <Filter className="h-5 w-5 mr-2" />
          Filter Meetings
        </h2>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Search */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search meetings by title, description or faculty name"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meeting Types */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Meeting Type</h3>
          <div className="flex flex-wrap gap-2">
            {meetingTypes.map(type => (
              <button
                key={type.id}
                onClick={() => toggleTypeFilter(type.id)}
                className={`inline-flex items-center px-2.5 py-1.5 border rounded-md text-xs font-medium ${
                  filters.types.includes(type.id)
                    ? type.color
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
                className={`inline-flex items-center px-2.5 py-1.5 border rounded-md text-xs font-medium ${
                  filters.status === option.id
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Archive Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={toggleArchivedFilter}
          className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
            filters.showArchived
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Archive className="h-4 w-4 mr-2" />
          {filters.showArchived ? 'Showing Archived' : 'Show Archived Meetings'}
        </button>
      </div>
    </div>
  );
};

export default MeetingFilters;
