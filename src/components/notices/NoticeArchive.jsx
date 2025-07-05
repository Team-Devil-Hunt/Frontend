import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'

const NoticeArchive = ({ notices, years }) => {
  const [expandedYears, setExpandedYears] = React.useState([])

  const toggleYear = (year) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter(y => y !== year))
    } else {
      setExpandedYears([...expandedYears, year])
    }
  }

  // Group notices by year
  const noticesByYear = years.reduce((acc, year) => {
    acc[year] = notices.filter(notice => {
      const noticeYear = new Date(notice.publishedDate).getFullYear().toString()
      return noticeYear === year
    })
    return acc
  }, {})

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM dd, yyyy')
  }

  // Determine badge color based on notice category
  const getBadgeColor = (category) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'administrative':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'general':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'event':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'scholarship':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {years.map((year) => (
        <Card key={year} className="overflow-hidden">
          <div 
            className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleYear(year)}
          >
            <h3 className="text-lg font-bold">{year}</h3>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              {expandedYears.includes(year) ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {expandedYears.includes(year) && (
            <CardContent className="p-4">
              {noticesByYear[year].length > 0 ? (
                <div className="space-y-4">
                  {noticesByYear[year].map((notice) => (
                    <div 
                      key={notice.id} 
                      className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getBadgeColor(notice.category)}>
                              {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                            </Badge>
                            
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(notice.publishedDate)}</span>
                            </div>
                          </div>
                          
                          <h4 className="font-medium">{notice.title}</h4>
                          
                          {notice.attachments && notice.attachments.length > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <FileText className="w-3 h-3" />
                              <span>{notice.attachments.length} {notice.attachments.length === 1 ? 'attachment' : 'attachments'}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="shrink-0"
                          onClick={() => window.open(`/notices/${notice.id}`, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No notices found for {year}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </motion.div>
  )
}

export default NoticeArchive
