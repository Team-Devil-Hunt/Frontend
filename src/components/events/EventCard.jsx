import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, ExternalLink, User } from 'lucide-react'
import { format } from 'date-fns'

const EventCard = ({ event, index, onRegister }) => {
  // Determine badge color based on event type
  const getBadgeColor = (type) => {
    switch (type) {
      case 'seminar':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'workshop':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'conference':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'competition':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cultural':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'academic':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Determine card border color based on event type
  const getCardBorderColor = (type) => {
    switch (type) {
      case 'seminar':
        return 'border-blue-400'
      case 'workshop':
        return 'border-green-400'
      case 'conference':
        return 'border-purple-400'
      case 'cultural':
        return 'border-amber-400'
      case 'competition':
        return 'border-red-400'
      case 'academic':
        return 'border-cyan-400'
      default:
        return 'border-gray-200'
    }
  }

  // Determine header background color based on event type
  const getHeaderBgColor = (type) => {
    switch (type) {
      case 'seminar':
        return 'bg-gradient-to-r from-blue-500 to-blue-600'
      case 'workshop':
        return 'bg-gradient-to-r from-green-500 to-green-600'
      case 'conference':
        return 'bg-gradient-to-r from-purple-500 to-purple-600'
      case 'competition':
        return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'cultural':
        return 'bg-gradient-to-r from-amber-500 to-amber-600'
      case 'academic':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  // Determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-500'
      case 'ongoing':
        return 'bg-blue-500'
      case 'registration_open':
        return 'bg-amber-500'
      case 'registration_closed':
        return 'bg-red-500'
      case 'completed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM dd, yyyy')
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'h:mm a')
  }

  // Check if registration is available
  const canRegister = event.registrationRequired && 
    (event.status === 'registration_open' || event.status === 'upcoming') &&
    new Date(event.registrationDeadline) > new Date()

  // Check if event is free
  const isFree = !event.fee || event.fee === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`hover:shadow-lg transition-shadow duration-300 overflow-hidden border-2 ${getCardBorderColor(event.type)}`}>
        {/* Colored Header */}
        <div className={`${getHeaderBgColor(event.type)} text-white p-4`}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-xl">{event.title}</h3>
                <Badge className={`${getStatusColor(event.status)} text-white`}>
                  {event.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-white text-gray-800 border border-white">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                
                {!isFree && (
                  <Badge className="bg-white text-green-600 border border-white">
                    ৳{event.fee}
                  </Badge>
                )}
                
                {isFree && (
                  <Badge className="bg-white text-blue-600 border border-white">
                    Free
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              
                <Button 
                  onClick={() => onRegister(event)}
                  className="bg-white text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Register Now
                </Button>
              
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Description */}
            <div className="text-gray-700">
              <p>{event.description}</p>
            </div>
            
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{event.venue}</span>
              </div>
              
              {event.maxParticipants && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Max {event.maxParticipants} participants</span>
                </div>
              )}
            </div>
            
            {/* Speaker/Organizer */}
            {event.speaker && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Speaker: {event.speaker}</span>
              </div>
            )}
            
            {/* Registration Info */}
            {event.registrationRequired && (
              <div className={`${isFree ? 'bg-green-50' : 'bg-amber-50'} p-3 rounded-md`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="font-medium">Registration Deadline: </span>
                    <span>{formatDate(event.registrationDeadline)}</span>
                  </div>
                  
                  {event.registeredCount !== undefined && event.maxParticipants && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${event.type === 'seminar' ? 'bg-blue-600' : 
                                                        event.type === 'workshop' ? 'bg-green-600' : 
                                                        event.type === 'conference' ? 'bg-purple-600' : 
                                                        event.type === 'competition' ? 'bg-red-600' : 
                                                        event.type === 'cultural' ? 'bg-amber-600' : 'bg-cyan-600'}`}
                          style={{ width: `${(event.registeredCount / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">
                        {event.registeredCount}/{event.maxParticipants}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {canRegister && (
                <Button 
                  onClick={() => onRegister(event)}
                  className={`${event.type === 'seminar' ? 'bg-blue-600 hover:bg-blue-700' : 
                                event.type === 'workshop' ? 'bg-green-600 hover:bg-green-700' : 
                                event.type === 'conference' ? 'bg-purple-600 hover:bg-purple-700' : 
                                event.type === 'competition' ? 'bg-red-600 hover:bg-red-700' : 
                                event.type === 'cultural' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-cyan-600 hover:bg-cyan-700'} 
                                flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <Users className="w-5 h-5" />
                  Register Now
                </Button>
              )}
              
              {event.externalLink && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(event.externalLink, '_blank')}
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                >
                  <ExternalLink className="w-4 h-4" />
                  Event Details
                </Button>
              )}
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-auto">
                  {event.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EventCard
