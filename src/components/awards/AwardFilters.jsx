import React from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, Calendar, Trophy, User, Bookmark, BookOpen } from 'lucide-react'

const AwardFilters = ({ awards, filters, onFiltersChange }) => {
  // Extract unique values from awards
  const years = [...new Set(awards.map(a => a.year))].sort((a, b) => b - a)
  const types = [...new Set(awards.map(a => a.type))]
  const recipientTypes = [...new Set(awards.map(a => a.recipientType))]
  
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
      types: [],
      recipientTypes: [],
      categories: []
    })
  }

  // Get badge classes based on filter state
  const getYearBadgeClasses = (year) => {
    return filters.years.includes(year)
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  }
  
  const getTypeBadgeClasses = (type) => {
    const baseClasses = filters.types.includes(type) ? 'text-white' : ''
    
    switch (type) {
      case 'award':
        return filters.types.includes(type)
          ? 'bg-amber-600 hover:bg-amber-700 text-white'
          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
      case 'grant':
        return filters.types.includes(type)
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
      case 'fellowship':
        return filters.types.includes(type)
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
          : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
      case 'scholarship':
        return filters.types.includes(type)
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'publication':
        return filters.types.includes(type)
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      default:
        return filters.types.includes(type)
          ? 'bg-gray-600 hover:bg-gray-700 text-white'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }
  
  const getRecipientTypeBadgeClasses = (type) => {
    return filters.recipientTypes.includes(type)
      ? 'bg-gray-800 hover:bg-gray-900 text-white'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Award Filters
        </h2>
        
        <Button 
          variant="ghost" 
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={!filters.search && filters.years.length === 0 && filters.types.length === 0 && filters.recipientTypes.length === 0}
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search awards..."
            value={filters.search}
            onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Filter by Year */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4" />
          <h3 className="font-medium">Filter by Year</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {years.map(year => (
            <Badge 
              key={year}
              className={`cursor-pointer ${getYearBadgeClasses(year)}`}
              onClick={() => toggleArrayFilter('years', year)}
            >
              {year}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Filter by Type */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
          <Trophy className="w-4 h-4" />
          <h3 className="font-medium">Filter by Type</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map(type => (
            <Badge 
              key={type}
              className={`cursor-pointer capitalize ${getTypeBadgeClasses(type)}`}
              onClick={() => toggleArrayFilter('types', type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Filter by Recipient Type */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
          <User className="w-4 h-4" />
          <h3 className="font-medium">Filter by Recipient</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipientTypes.map(type => (
            <Badge 
              key={type}
              className={`cursor-pointer capitalize ${getRecipientTypeBadgeClasses(type)}`}
              onClick={() => toggleArrayFilter('recipientTypes', type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Filter by Category */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
          <BookOpen className="w-4 h-4" />
          <h3 className="font-medium">Popular Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['AI', 'Machine Learning', 'Cybersecurity', 'Robotics', 'IoT', 'Data Science'].map(category => (
            <Badge 
              key={category}
              variant="outline"
              className={`cursor-pointer ${filters.categories.includes(category) ? 'bg-gray-100' : ''}`}
              onClick={() => toggleArrayFilter('categories', category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AwardFilters
