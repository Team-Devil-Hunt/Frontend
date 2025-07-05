import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, FileText, Download, ExternalLink, Eye } from 'lucide-react'
import { format } from 'date-fns'

const NoticeCard = ({ notice, index }) => {
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

  // Determine border color based on notice priority
  const getBorderColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-amber-500'
      case 'low':
        return 'border-l-blue-500'
      default:
        return 'border-l-gray-300'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM dd, yyyy')
  }

  // Check if notice is new (within last 3 days)
  const isNew = () => {
    const noticeDate = new Date(notice.publishedDate)
    const today = new Date()
    const diffTime = Math.abs(today - noticeDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={`border-l-4 ${getBorderColor(notice.priority)} hover:shadow-md transition-shadow`}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{notice.title}</h3>
                  {isNew() && (
                    <Badge className="bg-red-500">New</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-3">
                  <Badge className={getBadgeColor(notice.category)}>
                    {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                  </Badge>
                  
                  {notice.department && (
                    <Badge variant="outline">
                      {notice.department}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Published: {formatDate(notice.publishedDate)}</span>
                  </div>
                  
                  {notice.expiryDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Expires: {formatDate(notice.expiryDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => window.open(`/notices/${notice.id}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </Button>
                
                {notice.attachments && notice.attachments.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => window.open(notice.attachments[0].url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                )}
                
                {notice.externalLink && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => window.open(notice.externalLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Link</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-gray-700">
              <p>{notice.summary}</p>
            </div>
            
            {notice.attachments && notice.attachments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>{notice.attachments.length} {notice.attachments.length === 1 ? 'attachment' : 'attachments'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default NoticeCard
