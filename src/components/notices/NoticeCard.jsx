import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="transform-gpu"
    >
      <Card className={`border-l-4 ${getBorderColor(notice.priority)} hover:shadow-xl transition-all bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden`}>
        <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-indigo-900">{notice.title}</h3>
                  {isNew() && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium animate-pulse">New</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-3">
                  <Badge className={`${getBadgeColor(notice.category)} shadow-sm font-medium`}>
                    {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                  </Badge>
                  
                  {notice.department && (
                    <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50">
                      {notice.department}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-indigo-700">
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Published: {formatDate(notice.publishedDate)}</span>
                  </div>
                  
                  {notice.expiryDate && (
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Expires: {formatDate(notice.expiryDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  asChild
                >
                  <Link to={`/notices/${notice.id}`}>
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                </Button>
                
                {notice.attachments && notice.attachments.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors"
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
                    className="flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800 transition-colors"
                    onClick={() => window.open(notice.externalLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Link</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-gray-700 my-4 bg-white/50 p-4 rounded-lg border-l-2 border-indigo-200">
              <p>{notice.summary}</p>
            </div>
            
            {notice.attachments && notice.attachments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
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
