import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Calendar, Tag, GraduationCap, BookOpen, ExternalLink, Github, ArrowUpRight } from 'lucide-react'

const ProjectCard = ({ project, onClick }) => {
  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'machine_learning':
        return {
          bg: 'bg-purple-600',
          border: 'border-purple-500',
          text: 'text-purple-700',
          light: 'bg-purple-50',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          gradient: 'from-purple-500 to-purple-700'
        }
      case 'web_development':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-500',
          text: 'text-blue-700',
          light: 'bg-blue-50',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          gradient: 'from-blue-500 to-blue-700'
        }
      case 'mobile_app':
        return {
          bg: 'bg-green-600',
          border: 'border-green-500',
          text: 'text-green-700',
          light: 'bg-green-50',
          badge: 'bg-green-100 text-green-800 border-green-200',
          gradient: 'from-green-500 to-green-700'
        }
      case 'algorithms':
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-500',
          text: 'text-amber-700',
          light: 'bg-amber-50',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          gradient: 'from-amber-500 to-amber-700'
        }
      case 'iot':
        return {
          bg: 'bg-red-600',
          border: 'border-red-500',
          text: 'text-red-700',
          light: 'bg-red-50',
          badge: 'bg-red-100 text-red-800 border-red-200',
          gradient: 'from-red-500 to-red-700'
        }
      case 'security':
        return {
          bg: 'bg-slate-600',
          border: 'border-slate-500',
          text: 'text-slate-700',
          light: 'bg-slate-50',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          gradient: 'from-slate-500 to-slate-700'
        }
      case 'robotics':
        return {
          bg: 'bg-cyan-600',
          border: 'border-cyan-500',
          text: 'text-cyan-700',
          light: 'bg-cyan-50',
          badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
          gradient: 'from-cyan-500 to-cyan-700'
        }
      case 'graphics':
        return {
          bg: 'bg-indigo-600',
          border: 'border-indigo-500',
          text: 'text-indigo-700',
          light: 'bg-indigo-50',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          gradient: 'from-indigo-500 to-indigo-700'
        }
      default:
        return {
          bg: 'bg-orange-600',
          border: 'border-orange-500',
          text: 'text-orange-700',
          light: 'bg-orange-50',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          gradient: 'from-orange-500 to-orange-700'
        }
    }
  }

  const categoryColors = getCategoryColor(project.category)
  const projectType = project.type === 'faculty' ? 'Faculty Research' : 'Student Project'
  const formattedDate = new Date(project.completionDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-0 bg-white shadow-md">
        {/* Colored Header with Gradient Overlay */}
        <div 
          className={`relative h-48 overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors.gradient} opacity-90`}></div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0)_50%)]">
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 font-medium">
              {projectType}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 font-medium capitalize">
              {project.category.replace('_', ' ')}
            </Badge>
          </div>
          
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-white/90 transition-colors">
              {project.title}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow flex flex-col">
          {/* Project Summary */}
          <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">{project.summary}</p>
          
          {/* Project Info */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-8 h-8 rounded-full ${categoryColors.light} flex items-center justify-center`}>
                <User className={`w-4 h-4 ${categoryColors.text}`} />
              </div>
              <span className="text-gray-700 font-medium line-clamp-1">{project.supervisor}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-8 h-8 rounded-full ${categoryColors.light} flex items-center justify-center`}>
                <Calendar className={`w-4 h-4 ${categoryColors.text}`} />
              </div>
              <span className="text-gray-700 font-medium">{project.year}</span>
            </div>
            
            {project.course && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <div className={`w-8 h-8 rounded-full ${categoryColors.light} flex items-center justify-center`}>
                  <BookOpen className={`w-4 h-4 ${categoryColors.text}`} />
                </div>
                <span className="text-gray-700 line-clamp-1">{project.course}</span>
              </div>
            )}
            
            {project.team && (
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-8 h-8 rounded-full ${categoryColors.light} flex items-center justify-center`}>
                  <GraduationCap className={`w-4 h-4 ${categoryColors.text}`} />
                </div>
                <span className="text-gray-700">
                  {project.team.length} {project.team.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag, i) => (
                <Badge 
                  key={i} 
                  className={`${categoryColors.badge} font-normal text-xs px-2 py-0.5`}
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 font-normal text-xs px-2 py-0.5">
                  +{project.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between">
          <Button 
            onClick={() => onClick(project)}
            className={`${categoryColors.bg} hover:opacity-90 flex gap-2 items-center`}
          >
            View Details
            <ArrowUpRight className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-2">
            {project.demoLink && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open(project.demoLink, '_blank')}
                className="h-9 w-9 rounded-full"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            
            {project.githubLink && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open(project.githubLink, '_blank')}
                className="h-9 w-9 rounded-full"
              >
                <Github className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ProjectCard
