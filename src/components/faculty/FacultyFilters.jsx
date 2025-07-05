import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

const FacultyFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedRole, 
  setSelectedRole, 
  selectedExpertise, 
  setSelectedExpertise,
  roles,
  expertiseAreas,
  totalResults,
  filteredResults
}) => {
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedRole('')
    setSelectedExpertise('')
  }

  const hasActiveFilters = searchTerm || selectedRole || selectedExpertise

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Search & Filter Faculty</h2>
        {hasActiveFilters && (
          <Button 
            onClick={clearFilters}
            variant="ghost" 
            size="sm"
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name, designation, or research area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Expertise Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Expertise</label>
          <select
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Expertise Areas</option>
            {expertiseAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchTerm}"
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedRole && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Role: {selectedRole}
              <button 
                onClick={() => setSelectedRole('')}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedExpertise && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Expertise: {selectedExpertise}
              <button 
                onClick={() => setSelectedExpertise('')}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredResults} of {totalResults} faculty members
      </div>
    </div>
  )
}

export default FacultyFilters
