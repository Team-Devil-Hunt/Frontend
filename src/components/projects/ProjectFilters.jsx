import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, X, Tags, Calendar, User, Flame, GraduationCap } from 'lucide-react'

const ProjectFilters = ({ availableFilters, filters, onFiltersChange }) => {
  // Use the filter options provided by the parent component
  const years = availableFilters?.years || []
  const categories = availableFilters?.categories || []
  const supervisors = availableFilters?.supervisors || []
  
  // Toggle a filter array value
  const toggleArrayFilter = (filterName, value) => {
    onFiltersChange(prev => {
      // If value exists in array, remove it
      if (prev[filterName].includes(value)) {
        return {
          ...prev,
          [filterName]: prev[filterName].filter(item => item !== value)
        }
      }
      // Otherwise add it
      return {
        ...prev,
        [filterName]: [...prev[filterName], value]
      }
    })
  }

  // Toggle project type filter (radio button behavior)
  const setProjectType = (type) => {
    onFiltersChange(prev => ({
      ...prev,
      type: prev.type === type ? '' : type
    }))
  }
  
  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      years: [],
      categories: [],
      supervisors: [],
      type: ''
    })
  }

  // Get badge classes based on filter state
  const getYearBadgeClasses = (year) => {
    const isActive = filters.years.includes(year)
    return isActive 
      ? 'bg-blue-600 hover:bg-blue-500 text-white'
      : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
  }

  // Category filter badge classes
  const getCategoryBadgeClasses = (category) => {
    const isActive = filters.categories.includes(category)
    
    switch (category) {
      case 'machine_learning':
        return isActive 
          ? 'bg-purple-600 hover:bg-purple-500 text-white' 
          : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
      case 'web_development':
        return isActive 
          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
      case 'mobile_app':
        return isActive 
          ? 'bg-green-600 hover:bg-green-500 text-white' 
          : 'bg-green-100 hover:bg-green-200 text-green-800'
      case 'algorithms':
        return isActive 
          ? 'bg-amber-600 hover:bg-amber-500 text-white' 
          : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
      case 'iot':
        return isActive 
          ? 'bg-red-600 hover:bg-red-500 text-white' 
          : 'bg-red-100 hover:bg-red-200 text-red-800'
      case 'security':
        return isActive 
          ? 'bg-slate-600 hover:bg-slate-500 text-white' 
          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
      case 'robotics':
        return isActive 
          ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
          : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800'
      case 'graphics':
        return isActive 
          ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
      default:
        return isActive 
          ? 'bg-gray-600 hover:bg-gray-500 text-white' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    }
  }

  // Supervisor filter badge classes
  const getSupervisorBadgeClasses = (supervisor) => {
    const isActive = filters.supervisors.includes(supervisor)
    return isActive 
      ? 'bg-green-600 hover:bg-green-500 text-white'
      : 'bg-green-100 hover:bg-green-200 text-green-800'
  }

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // Check if any filters are active
  const hasActiveFilters = 
    filters.years.length > 0 ||
    filters.categories.length > 0 ||
    filters.supervisors.length > 0 ||
    filters.type !== ''
  
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.years.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.supervisors.length > 0) count++
    if (filters.type !== '') count++
    return count
  }

  return (
    <motion.div 
      className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-slate-100 mb-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Project Filters
          </span>
          {hasActiveFilters && (
            <Badge className="ml-2 bg-blue-100 text-blue-800 border border-blue-200">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </h2>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50"
            size="sm"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Year Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700 mb-2 pb-1 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Filter by Year</span>
            </div>
            {filters.years.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800 p-0"
                onClick={() => onFiltersChange({...filters, years: []})}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {years.length > 0 ? years.map(year => (
              <Badge 
                key={year} 
                onClick={() => toggleArrayFilter('years', year)}
                className={`cursor-pointer transition-colors ${getYearBadgeClasses(year)}`}
              >
                {year}
              </Badge>
            )) : (
              <p className="text-sm text-gray-500 italic">No years available</p>
            )}
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700 mb-2 pb-1 border-b">
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4 text-purple-600" />
              <span>Filter by Topic/Category</span>
            </div>
            {filters.categories.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs text-purple-600 hover:text-purple-800 p-0"
                onClick={() => onFiltersChange({...filters, categories: []})}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? categories.map(category => (
              <Badge 
                key={category} 
                onClick={() => toggleArrayFilter('categories', category)}
                className={`cursor-pointer transition-colors ${getCategoryBadgeClasses(category)}`}
              >
                {formatCategoryName(category)}
              </Badge>
            )) : (
              <p className="text-sm text-gray-500 italic">No categories available</p>
            )}
          </div>
        </div>
        
        {/* Supervisor Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700 mb-2 pb-1 border-b">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              <span>Filter by Supervisor</span>
            </div>
            {filters.supervisors.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs text-green-600 hover:text-green-800 p-0"
                onClick={() => onFiltersChange({...filters, supervisors: []})}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {supervisors.length > 0 ? supervisors.map(supervisor => (
              <Badge 
                key={supervisor} 
                onClick={() => toggleArrayFilter('supervisors', supervisor)}
                className={`cursor-pointer transition-colors ${getSupervisorBadgeClasses(supervisor)}`}
              >
                {supervisor}
              </Badge>
            )) : (
              <p className="text-sm text-gray-500 italic">No supervisors available</p>
            )}
          </div>
        </div>
        
        {/* Project Type Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700 mb-2 pb-1 border-b">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Project Type</span>
            </div>
            {filters.type !== '' && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs text-amber-600 hover:text-amber-800 p-0"
                onClick={() => onFiltersChange({...filters, type: ''})}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-500 mb-1 italic">Select one option:</div>
            <Badge 
              onClick={() => setProjectType('student')}
              className={`cursor-pointer w-full justify-center py-1.5 transition-colors ${filters.type === 'student' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}
            >
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Student Projects Only
            </Badge>
            
            <Badge 
              onClick={() => setProjectType('faculty')}
              className={`cursor-pointer w-full justify-center py-1.5 transition-colors ${filters.type === 'faculty' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}
            >
              <Flame className="w-4 h-4 mr-1.5" />
              Faculty Research Only
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectFilters
