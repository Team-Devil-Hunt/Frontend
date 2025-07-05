import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Building, Trophy, ExternalLink, Tag, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const AwardDetails = ({ award, isOpen, onClose }) => {
  if (!award) return null
  
  // Get award type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'award':
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-500',
          text: 'text-amber-700',
          light: 'bg-amber-50',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          gradient: 'from-amber-500 to-amber-700'
        }
      case 'grant':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500',
          text: 'text-emerald-700',
          light: 'bg-emerald-50',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          gradient: 'from-emerald-500 to-emerald-700'
        }
      case 'fellowship':
        return {
          bg: 'bg-indigo-600',
          border: 'border-indigo-500',
          text: 'text-indigo-700',
          light: 'bg-indigo-50',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          gradient: 'from-indigo-500 to-indigo-700'
        }
      case 'scholarship':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-500',
          text: 'text-blue-700',
          light: 'bg-blue-50',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          gradient: 'from-blue-500 to-blue-700'
        }
      case 'publication':
        return {
          bg: 'bg-purple-600',
          border: 'border-purple-500',
          text: 'text-purple-700',
          light: 'bg-purple-50',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          gradient: 'from-purple-500 to-purple-700'
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

  const typeColors = getTypeColor(award.type)
  const recipientType = award.recipientType === 'faculty' ? 'Faculty' : 'Student'
  
  // Format amount if present
  const formattedAmount = award.amount ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0
  }).format(award.amount) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${typeColors.gradient} p-6 relative`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 capitalize">
                    {award.type}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    {recipientType}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold text-white">{award.title}</h2>
                
                <div className="flex items-center gap-3 mt-4 text-white/90">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{award.recipient}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{award.year}</span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{award.description}</p>
                </div>
                
                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Organization */}
                  {award.organization && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${typeColors.light} flex items-center justify-center flex-shrink-0`}>
                        <Building className={`w-5 h-5 ${typeColors.text}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Awarding Organization</h4>
                        <p className="text-gray-900">{award.organization}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Amount */}
                  {formattedAmount && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${typeColors.light} flex items-center justify-center flex-shrink-0`}>
                        <Trophy className={`w-5 h-5 ${typeColors.text}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Award Amount</h4>
                        <p className="text-gray-900 font-semibold">{formattedAmount}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Department */}
                  {award.department && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${typeColors.light} flex items-center justify-center flex-shrink-0`}>
                        <Award className={`w-5 h-5 ${typeColors.text}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Department</h4>
                        <p className="text-gray-900">{award.department}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Duration */}
                  {award.duration && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${typeColors.light} flex items-center justify-center flex-shrink-0`}>
                        <Calendar className={`w-5 h-5 ${typeColors.text}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                        <p className="text-gray-900">{award.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Categories */}
                {award.categories && award.categories.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {award.categories.map((category, i) => (
                        <Badge 
                          key={i} 
                          className={`${typeColors.badge}`}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Additional Details */}
                {award.details && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Details</h3>
                    <p className="text-gray-700 whitespace-pre-line">{award.details}</p>
                  </div>
                )}
                
                {/* Publications */}
                {award.publications && award.publications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Publications</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {award.publications.map((pub, i) => (
                        <li key={i}>{pub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end">
                {award.link && (
                  <Button
                    className={`${typeColors.bg} hover:opacity-90`}
                    onClick={() => window.open(award.link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AwardDetails
