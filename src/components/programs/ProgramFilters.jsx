import React from 'react'
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
  activeFilters,
  clearFilters
}) => {
  const levels = ['All', 'Undergraduate', 'Graduate', 'Postgraduate']
  const specializations = [
    'All', 'Software Engineering', 'Data Science', 'Cybersecurity', 
    'AI & Machine Learning', 'Computer Networks', 'Database Systems',
    'Web Development', 'Mobile Development', 'Computer Graphics'
  ]
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

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
                {level}
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
                {spec}
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
                {difficulty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgramFilters
