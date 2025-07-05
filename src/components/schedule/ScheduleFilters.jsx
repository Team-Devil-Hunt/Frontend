import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

const ScheduleFilters = ({ 
  filters, 
  setFilters, 
  batches, 
  semesters, 
  rooms, 
  days,
  activeFiltersCount 
}) => {
  const handleBatchToggle = (batch) => {
    setFilters(prev => ({
      ...prev,
      batch: prev.batch === batch ? '' : batch
    }))
  }

  const handleSemesterToggle = (semester) => {
    setFilters(prev => ({
      ...prev,
      semester: prev.semester === semester ? '' : semester
    }))
  }

  const handleRoomToggle = (room) => {
    setFilters(prev => ({
      ...prev,
      room: prev.room === room ? '' : room
    }))
  }

  const handleDayToggle = (day) => {
    setFilters(prev => ({
      ...prev,
      day: prev.day === day ? '' : day
    }))
  }

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      batch: '',
      semester: '',
      room: '',
      day: ''
    })
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold">Filter Class Schedule</h2>
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
            Clear filters ({activeFiltersCount})
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by course or instructor..."
            className="pl-10"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
          
          <Badge 
            variant={filters.day === 'Today' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleDayToggle('Today')}
          >
            Today
          </Badge>
          
          <Badge 
            variant={filters.day === 'Tomorrow' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleDayToggle('Tomorrow')}
          >
            Tomorrow
          </Badge>
          
          <Badge 
            variant={filters.day === 'This Week' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleDayToggle('This Week')}
          >
            This Week
          </Badge>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Batch:</h3>
          <div className="flex flex-wrap gap-2">
            {batches.map(batch => (
              <Badge 
                key={batch}
                variant={filters.batch === batch ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleBatchToggle(batch)}
              >
                {batch}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Semester:</h3>
          <div className="flex flex-wrap gap-2">
            {semesters.map(semester => (
              <Badge 
                key={semester}
                variant={filters.semester === semester ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleSemesterToggle(semester)}
              >
                {semester}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Room:</h3>
          <div className="flex flex-wrap gap-2">
            {rooms.map(room => (
              <Badge 
                key={room}
                variant={filters.room === room ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleRoomToggle(room)}
              >
                {room}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ScheduleFilters
