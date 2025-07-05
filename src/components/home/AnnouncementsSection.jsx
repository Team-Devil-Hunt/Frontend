import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ChevronRight, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

const AnnouncementsSection = ({ data, variants }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.section 
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants.container}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={variants.item} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Announcements
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news and announcements from our department
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {data.announcements.slice(0, 4).map((announcement) => (
            <motion.div key={announcement.id} variants={variants.item}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative">
                  <img 
                    src={announcement.image} 
                    alt={announcement.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {announcement.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 ml-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{announcement.content}</p>
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={variants.item} className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/notices">
              View All Announcements <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default AnnouncementsSection
