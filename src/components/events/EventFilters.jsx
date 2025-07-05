import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

const EventFilters = ({ filters, setFilters, eventTypes, months, statuses }) => {
  // Count active filters (excluding search)
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== ''
    if (key === 'freeOnly') return value === true
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  }).length

  // Handle search input
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value })
  }

  // Toggle filter value in array
  const toggleFilter = (filterKey, value) => {
    const currentValues = filters[filterKey] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    setFilters({ ...filters, [filterKey]: newValues })
  }

  // Toggle free only filter
  const toggleFreeOnly = () => {
    setFilters({ ...filters, freeOnly: !filters.freeOnly })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      types: [],
      months: [],
      statuses: [],
      freeOnly: false
    })
  }

  // Get badge variant and color based on type
  const getTypeBadgeStyle = (type, isActive) => {
    if (!isActive) return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    
    switch (type) {
      case 'seminar':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'workshop':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'conference':
        return 'bg-purple-500 hover:bg-purple-600 text-white'
      case 'competition':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'cultural':
        return 'bg-amber-500 hover:bg-amber-600 text-white'
      case 'academic':
        return 'bg-cyan-500 hover:bg-cyan-600 text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  // Get badge variant and color based on status
  const getStatusBadgeStyle = (status, isActive) => {
    if (!isActive) return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    
    switch (status) {
      case 'upcoming':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'ongoing':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'registration_open':
        return 'bg-amber-500 hover:bg-amber-600 text-white'
      case 'registration_closed':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'completed':
        return 'bg-gray-500 hover:bg-gray-600 text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  // Get badge variant and color based on month
  const getMonthBadgeStyle = (month, isActive) => {
    if (!isActive) return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month)
    const colors = [
      'bg-blue-500 hover:bg-blue-600',     // Jan - Winter
      'bg-indigo-500 hover:bg-indigo-600', // Feb - Winter
      'bg-green-500 hover:bg-green-600',   // Mar - Spring
      'bg-emerald-500 hover:bg-emerald-600', // Apr - Spring
      'bg-teal-500 hover:bg-teal-600',     // May - Spring
      'bg-amber-500 hover:bg-amber-600',   // Jun - Summer
      'bg-orange-500 hover:bg-orange-600', // Jul - Summer
      'bg-red-500 hover:bg-red-600',       // Aug - Summer
      'bg-rose-500 hover:bg-rose-600',     // Sep - Fall
      'bg-purple-500 hover:bg-purple-600', // Oct - Fall
      'bg-violet-500 hover:bg-violet-600', // Nov - Fall
      'bg-cyan-500 hover:bg-cyan-600'      // Dec - Winter
    ]
    
    return `${colors[monthIndex]} text-white`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-white p-5 mb-4 rounded-lg shadow-md border border-gray-100"
    >
      <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Filter Events</h3>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search events..."
          className="pl-8 border-blue-200 focus:border-blue-400"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter sections */}
      <div className="space-y-4">
        {/* Event Types */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Event Type</h4>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => {
              const isActive = (filters.types || []).includes(type)
              return (
                <Badge
                  key={type}
                  className={`cursor-pointer transition-colors ${getTypeBadgeStyle(type, isActive)}`}
                  onClick={() => toggleFilter('types', type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Months */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Month</h4>
          <div className="flex flex-wrap gap-2">
            {months.map((month) => {
              const isActive = (filters.months || []).includes(month)
              return (
                <Badge
                  key={month}
                  className={`cursor-pointer transition-colors ${getMonthBadgeStyle(month, isActive)}`}
                  onClick={() => toggleFilter('months', month)}
                >
                  {month}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Statuses */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Status</h4>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => {
              const isActive = (filters.statuses || []).includes(status)
              return (
                <Badge
                  key={status}
                  className={`cursor-pointer transition-colors ${getStatusBadgeStyle(status, isActive)}`}
                  onClick={() => toggleFilter('statuses', status)}
                >
                  {status.replace('_', ' ').toUpperCase()}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Free Only */}
        <div>
          <Badge
            className={`cursor-pointer transition-colors ${filters.freeOnly ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            onClick={toggleFreeOnly}
          >
            Free Events Only
          </Badge>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 mt-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
          >
            <X className="h-4 w-4" />
            Clear Filters ({activeFiltersCount})
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default EventFilters
