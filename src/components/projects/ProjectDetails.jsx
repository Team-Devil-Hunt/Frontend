import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, Calendar, User, Tag, Users, ExternalLink, Github, 
  BookOpen, GraduationCap, Award, FileText, Mail 
} from 'lucide-react'
import { format } from 'date-fns'

const ProjectDetails = ({ project, isOpen, onClose }) => {
  if (!project) return null

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
          bg: 'bg-gray-600',
          border: 'border-gray-500',
          text: 'text-gray-700',
          light: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          gradient: 'from-gray-500 to-gray-700'
        }
    }
  }

  const categoryColors = getCategoryColor(project.category)
  const projectType = project.type === 'faculty' ? 'Faculty Research' : 'Student Project'
  const formattedDate = format(new Date(project.completionDate), 'MMMM yyyy')
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-none">
              {/* Header */}
              <div className={`bg-gradient-to-r ${categoryColors.gradient} text-white p-6`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {projectType}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 capitalize">
                        {project.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">{project.title}</h2>
                    <p className="text-white/80 mb-4">{project.summary}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/80" />
                        <span>{formattedDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/80" />
                        <span>Supervised by <strong>{project.supervisor}</strong></span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white/80 hover:text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Project Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Abstract */}
                    <div className="lg:col-span-2 space-y-6">
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FileText className={`w-5 h-5 ${categoryColors.text}`} />
                          Abstract
                        </h3>
                        <div className="text-gray-700 space-y-4">
                          {project.abstract.split('\n\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </section>
                      
                      {/* Technologies */}
                      {project.technologies && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">Technologies & Tools</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <Badge key={i} className={categoryColors.badge}>
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </section>
                      )}
                      
                      {/* Key Features */}
                      {project.keyFeatures && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {project.keyFeatures.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </section>
                      )}
                      
                      {/* Achievements */}
                      {project.achievements && project.achievements.length > 0 && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Award className={`w-5 h-5 ${categoryColors.text}`} />
                            Achievements
                          </h3>
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {project.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </div>
                    
                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Team Members */}
                      {project.type === 'student' && project.team && (
                        <section className={`${categoryColors.light} p-4 rounded-lg`}>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Users className={`w-5 h-5 ${categoryColors.text}`} />
                            Team Members
                          </h3>
                          <ul className="space-y-3">
                            {project.team.map((member, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 text-sm font-medium text-gray-500">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{member.name}</div>
                                  <div className="text-sm text-gray-500">{member.role || 'Team Member'}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                      
                      {/* Course Info */}
                      {project.course && (
                        <section className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-gray-700" />
                            Course Project
                          </h3>
                          <p className="text-gray-700">{project.course}</p>
                        </section>
                      )}
                      
                      {/* External Links */}
                      <section className="border border-gray-200 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Links & Resources</h3>
                        <div className="space-y-3">
                          {project.demoLink && (
                            <Button 
                              onClick={() => window.open(project.demoLink, '_blank')}
                              className={`w-full ${categoryColors.bg} hover:opacity-90`}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Demo
                            </Button>
                          )}
                          
                          {project.githubLink && (
                            <Button 
                              variant="outline"
                              onClick={() => window.open(project.githubLink, '_blank')}
                              className="w-full"
                            >
                              <Github className="w-4 h-4 mr-2" />
                              View Source Code
                            </Button>
                          )}
                          
                          {project.paperLink && (
                            <Button 
                              variant="outline"
                              onClick={() => window.open(project.paperLink, '_blank')}
                              className="w-full"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Read Paper
                            </Button>
                          )}
                          
                          {project.type === 'faculty' && (
                            <Button 
                              variant="outline"
                              onClick={() => window.location.href = `mailto:${project.contactEmail}`}
                              className="w-full"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Contact Researcher
                            </Button>
                          )}
                        </div>
                      </section>
                      
                      {/* Tags */}
                      <section>
                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t pt-4 mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Project ID: {project.id}
                    </div>
                    <Button onClick={onClose} variant="outline">
                      Close
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProjectDetails
