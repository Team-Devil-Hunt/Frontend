import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, X } from 'lucide-react'

const ProgramFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedLevel, 
  setSelectedLevel,
  selectedSpecialization,
  setSelectedSpecialization,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedYear,
  setSelectedYear,
  activeFilters,
  clearFilters,
  programsData = [],
  coursesData = []
}) => {
  // Dynamically generate filter options from available data
  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(programsData.map(program => program.level))]
    return ['', ...uniqueLevels]
  }, [programsData])
  
  const specializations = useMemo(() => {
    const programSpecs = programsData.flatMap(program => program.specializations || [])
    const courseSpecs = coursesData.map(course => course.specialization)
    const uniqueSpecs = [...new Set([...programSpecs, ...courseSpecs])]
    return ['', ...uniqueSpecs]
  }, [programsData, coursesData])
  
  const difficulties = useMemo(() => {
    const uniqueDifficulties = [...new Set(coursesData.map(course => course.difficulty))]
    return ['', ...uniqueDifficulties]
  }, [coursesData])
  
  const years = useMemo(() => {
    const uniqueYears = [...new Set(coursesData.map(course => course.year))].sort((a, b) => a - b)
    return ['', ...uniqueYears.map(year => year.toString())]
  }, [coursesData])

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {activeFilters > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear ({activeFilters})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search programs or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Level Filter */}
        <div>
          <h4 className="font-medium text-sm mb-2">Program Level</h4>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <Badge
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedLevel(level)}
              >
                {level || 'All Levels'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Specialization Filter */}
        <div>
          <h4 className="font-medium text-sm mb-2">Specialization</h4>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <Badge
                key={spec}
                variant={selectedSpecialization === spec ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                onClick={() => setSelectedSpecialization(spec)}
              >
                {spec || 'All Specializations'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h4 className="font-medium text-sm mb-2">Difficulty Level</h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty || 'All Difficulties'}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Year Filter */}
        <div>
          <h4 className="font-medium text-sm mb-2">Year</h4>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <Badge
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedYear(year)}
              >
                {year ? `Year ${year}` : 'All Years'}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgramFilters
