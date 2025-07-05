import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, Calendar, Clock } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const NoticeFilters = ({ 
  filters, 
  setFilters,
  categories,
  departments,
  years,
  activeFiltersCount 
}) => {
  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }))
  }

  const handleDepartmentToggle = (department) => {
    setFilters(prev => ({
      ...prev,
      department: prev.department === department ? '' : department
    }))
  }

  const handleYearToggle = (year) => {
    setFilters(prev => ({
      ...prev,
      year: prev.year === year ? '' : year
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
      category: '',
      department: '',
      year: '',
      timeframe: 'current'
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
        <h2 className="text-xl font-bold">Filter Notices</h2>
        
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search notices..."
            className="pl-10"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="text-gray-500 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Timeframe:</span>
          
          <Tabs 
            value={filters.timeframe} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, timeframe: value }))}
            className="w-full max-w-xs"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="archive">Archive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge 
                key={category.value}
                variant={filters.category === category.value ? 'default' : 'outline'}
                className={`cursor-pointer ${filters.category === category.value ? category.activeClass : ''}`}
                onClick={() => handleCategoryToggle(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Department:</h3>
          <div className="flex flex-wrap gap-2">
            {departments.map(department => (
              <Badge 
                key={department}
                variant={filters.department === department ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleDepartmentToggle(department)}
              >
                {department}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Year:</h3>
          <div className="flex flex-wrap gap-2">
            {years.map(year => (
              <Badge 
                key={year}
                variant={filters.year === year ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleYearToggle(year)}
              >
                {year}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoticeFilters
