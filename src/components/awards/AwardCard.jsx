import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, User, Building, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AwardCard = ({ award }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-0 bg-white shadow-md">
        {/* Colored Header with Gradient Overlay */}
        <div className="relative h-32 overflow-hidden">
          {/* Background Pattern */}
          <div className={`absolute inset-0 bg-gradient-to-br ${typeColors.gradient} opacity-90`}></div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0)_50%)]">
          </div>
          
          {/* Award Type Badge */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 font-medium capitalize">
              {award.type}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 font-medium">
              {recipientType}
            </Badge>
          </div>
          
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-white/90 transition-colors">
              {award.title}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow flex flex-col">
          {/* Award Description */}
          <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">{award.description}</p>
          
          {/* Award Info */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-8 h-8 rounded-full ${typeColors.light} flex items-center justify-center`}>
                <User className={`w-4 h-4 ${typeColors.text}`} />
              </div>
              <span className="text-gray-700 font-medium line-clamp-1">{award.recipient}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-8 h-8 rounded-full ${typeColors.light} flex items-center justify-center`}>
                <Calendar className={`w-4 h-4 ${typeColors.text}`} />
              </div>
              <span className="text-gray-700 font-medium">{award.year}</span>
            </div>
            
            {award.organization && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <div className={`w-8 h-8 rounded-full ${typeColors.light} flex items-center justify-center`}>
                  <Building className={`w-4 h-4 ${typeColors.text}`} />
                </div>
                <span className="text-gray-700 line-clamp-1">{award.organization}</span>
              </div>
            )}
            
            {formattedAmount && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <div className={`w-8 h-8 rounded-full ${typeColors.light} flex items-center justify-center`}>
                  <Trophy className={`w-4 h-4 ${typeColors.text}`} />
                </div>
                <span className="text-gray-700 font-medium">{formattedAmount}</span>
              </div>
            )}
          </div>
          
          {/* Categories */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {award.categories && award.categories.map((category, i) => (
                <Badge 
                  key={i} 
                  className={`${typeColors.badge} font-normal text-xs px-2 py-0.5`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Link Button */}
          {award.link && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className={`w-full border ${typeColors.border} ${typeColors.text} hover:${typeColors.bg} hover:text-white`}
                onClick={() => window.open(award.link, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AwardCard
