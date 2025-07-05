import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, X, Tags, Calendar, User, Flame, GraduationCap } from 'lucide-react'

const ProjectFilters = ({ projects, filters, onFiltersChange }) => {
  // Extract unique values from projects
  const years = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a)
  const categories = [...new Set(projects.map(p => p.category))]
  const supervisors = [...new Set(projects.map(p => p.supervisor))]
  
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

  // Toggle single boolean filter
  const toggleBooleanFilter = (filterName) => {
    onFiltersChange(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }
  
  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      years: [],
      categories: [],
      supervisors: [],
      studentOnly: false,
      facultyOnly: false
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
  const hasActiveFilters = filters.search !== '' || 
    filters.years.length > 0 ||
    filters.categories.length > 0 ||
    filters.supervisors.length > 0 ||
    filters.studentOnly ||
    filters.facultyOnly
  
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search !== '') count++
    if (filters.years.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.supervisors.length > 0) count++
    if (filters.studentOnly) count++
    if (filters.facultyOnly) count++
    return count
  }

  return (
    <motion.div 
      className="bg-white p-4 sm:p-5 rounded-lg shadow-md mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-lg font-bold mb-2 sm:mb-0">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Project Filters
          </span>
          {hasActiveFilters && (
            <Badge className="ml-2 bg-blue-100 text-blue-800 border border-blue-200">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </h2>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="space-y-4">
        {/* Year Filter */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Filter by Year</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {years.map(year => (
              <Badge 
                key={year} 
                onClick={() => toggleArrayFilter('years', year)}
                className={`cursor-pointer ${getYearBadgeClasses(year)}`}
              >
                {year}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Tags className="w-4 h-4" />
            <span>Filter by Topic/Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge 
                key={category} 
                onClick={() => toggleArrayFilter('categories', category)}
                className={`cursor-pointer ${getCategoryBadgeClasses(category)}`}
              >
                {formatCategoryName(category)}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Supervisor Filter */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4" />
            <span>Filter by Supervisor</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {supervisors.map(supervisor => (
              <Badge 
                key={supervisor} 
                onClick={() => toggleArrayFilter('supervisors', supervisor)}
                className={`cursor-pointer ${getSupervisorBadgeClasses(supervisor)}`}
              >
                {supervisor}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Project Type Filters */}
        <div className="flex flex-wrap gap-3">
          <Badge 
            onClick={() => toggleBooleanFilter('studentOnly')}
            className={`cursor-pointer ${filters.studentOnly ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}
          >
            <GraduationCap className="w-4 h-4 mr-1" />
            Student Projects Only
          </Badge>
          
          <Badge 
            onClick={() => toggleBooleanFilter('facultyOnly')}
            className={`cursor-pointer ${filters.facultyOnly ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}
          >
            <Flame className="w-4 h-4 mr-1" />
            Faculty Research Only
          </Badge>
        </div>
        
        {/* Filter Actions */}
        {hasActiveFilters && (
          <div className="pt-2">
            <Button 
              variant="ghost" 
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectFilters
