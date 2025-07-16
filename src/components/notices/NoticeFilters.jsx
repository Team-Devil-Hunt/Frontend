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
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Filter Notices</h2>
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
          >
            <X className="w-4 h-4" />
            Clear filters ({activeFiltersCount})
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search notices..."
            className="pl-10 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg shadow-sm"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="text-indigo-500 w-5 h-5" />
          <span className="text-sm font-medium text-indigo-700">Timeframe:</span>
          
          <Tabs 
            value={filters.timeframe} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, timeframe: value }))}
            className="w-full max-w-xs"
          >
            <TabsList className="grid grid-cols-2 bg-indigo-100/50">
              <TabsTrigger value="current" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Current</TabsTrigger>
              <TabsTrigger value="archive" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Archive</TabsTrigger>
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
