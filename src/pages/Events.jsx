/*
API Schema for Events:

GET /api/events
Response: {
  events: [
    {
      id: string,
      title: string,
      description: string,
      type: 'seminar' | 'workshop' | 'conference' | 'competition' | 'cultural' | 'academic',
      status: 'upcoming' | 'ongoing' | 'registration_open' | 'registration_closed' | 'completed',
      startDate: string (ISO date),
      endDate: string (ISO date),
      venue: string,
      speaker?: string,
      organizer: string,
      maxParticipants?: number,
      registeredCount?: number,
      registrationRequired: boolean,
      registrationDeadline?: string (ISO date),
      fee?: number,
      externalLink?: string,
      tags: string[]
    }
  ]
}

POST /api/events/:id/register
Request: {
  fullName: string,
  email: string,
  phone: string,
  studentId?: string,
  department?: string,
  year?: string,
  specialRequirements?: string
}
Response: {
  success: boolean,
  registrationId: string,
  message: string
}
*/

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Trophy, Sparkles } from 'lucide-react'
import EventCard from '@/components/events/EventCard'
import EventFilters from '@/components/events/EventFilters'
import EventRegistrationModal from '@/components/events/EventRegistrationModal'

import Api from '../constant/Api'


// Mock API Data
// const mockEvents = [
//   {
//     id: '1',
//     title: 'AI & Machine Learning Symposium 2024',
//     description: 'Join leading researchers and industry experts as they discuss the latest advances in artificial intelligence and machine learning technologies.',
//     type: 'conference',
//     status: 'registration_open',
//     startDate: '2024-08-15T09:00:00Z',
//     endDate: '2024-08-15T17:00:00Z',
//     venue: 'Main Auditorium, CSE Building',
//     speaker: 'Dr. Sarah Ahmed, MIT',
//     organizer: 'CSE Department',
//     maxParticipants: 200,
//     registeredCount: 145,
//     registrationRequired: true,
//     registrationDeadline: '2024-08-10T23:59:59Z',
//     fee: 500,
//     externalLink: 'https://ai-symposium.csedu.ac.bd',
//     tags: ['AI', 'Machine Learning', 'Research']
//   },
//   {
//     id: '2',
//     title: 'Web Development Workshop',
//     description: 'Hands-on workshop covering modern web development technologies including React, Node.js, and MongoDB.',
//     type: 'workshop',
//     status: 'upcoming',
//     startDate: '2024-07-20T14:00:00Z',
//     endDate: '2024-07-20T18:00:00Z',
//     venue: 'Computer Lab 1, 3rd Floor',
//     speaker: 'Md. Rafiq Hassan, Senior Developer',
//     organizer: 'Programming Club',
//     maxParticipants: 30,
//     registeredCount: 28,
//     registrationRequired: true,
//     registrationDeadline: '2024-07-18T23:59:59Z',
//     fee: 0,
//     tags: ['Web Development', 'React', 'Node.js']
//   },
//   {
//     id: '3',
//     title: 'Cybersecurity Awareness Seminar',
//     description: 'Learn about the latest cybersecurity threats and how to protect yourself and your organization from cyber attacks.',
//     type: 'seminar',
//     status: 'registration_open',
//     startDate: '2024-07-25T10:00:00Z',
//     endDate: '2024-07-25T12:00:00Z',
//     venue: 'Seminar Room 201',
//     speaker: 'Prof. Dr. Aminul Islam',
//     organizer: 'CSE Department',
//     maxParticipants: 100,
//     registeredCount: 67,
//     registrationRequired: true,
//     registrationDeadline: '2024-07-23T23:59:59Z',
//     fee: 0,
//     externalLink: 'https://cybersec.csedu.ac.bd',
//     tags: ['Cybersecurity', 'Awareness', 'Protection']
//   },
//   {
//     id: '4',
//     title: 'Inter-University Programming Contest',
//     description: 'Annual programming competition featuring teams from universities across Bangladesh. Test your coding skills!',
//     type: 'competition',
//     status: 'registration_open',
//     startDate: '2024-08-05T09:00:00Z',
//     endDate: '2024-08-05T17:00:00Z',
//     venue: 'Computer Lab Complex',
//     organizer: 'ACM Student Chapter',
//     maxParticipants: 150,
//     registeredCount: 89,
//     registrationRequired: true,
//     registrationDeadline: '2024-08-01T23:59:59Z',
//     fee: 300,
//     tags: ['Programming', 'Competition', 'ACM']
//   },
//   {
//     id: '5',
//     title: 'Cultural Night 2024',
//     description: 'Annual cultural program featuring music, dance, drama, and poetry performances by students and faculty.',
//     type: 'cultural',
//     status: 'upcoming',
//     startDate: '2024-07-30T18:00:00Z',
//     endDate: '2024-07-30T22:00:00Z',
//     venue: 'University Auditorium',
//     organizer: 'Cultural Committee',
//     maxParticipants: 500,
//     registeredCount: 234,
//     registrationRequired: false,
//     fee: 0,
//     tags: ['Cultural', 'Music', 'Dance', 'Entertainment']
//   },
//   {
//     id: '6',
//     title: 'Research Methodology Workshop',
//     description: 'Essential workshop for graduate students covering research methodologies, paper writing, and publication strategies.',
//     type: 'academic',
//     status: 'registration_open',
//     startDate: '2024-08-12T09:00:00Z',
//     endDate: '2024-08-12T16:00:00Z',
//     venue: 'Graduate Seminar Room',
//     speaker: 'Prof. Dr. Md. Abdur Rahman',
//     organizer: 'Graduate Studies Committee',
//     maxParticipants: 50,
//     registeredCount: 32,
//     registrationRequired: true,
//     registrationDeadline: '2024-08-08T23:59:59Z',
//     fee: 200,
//     tags: ['Research', 'Academic', 'Graduate']
//   },
//   {
//     id: '7',
//     title: 'Blockchain Technology Seminar',
//     description: 'Explore the fundamentals of blockchain technology and its applications in various industries.',
//     type: 'seminar',
//     status: 'upcoming',
//     startDate: '2024-08-20T15:00:00Z',
//     endDate: '2024-08-20T17:00:00Z',
//     venue: 'Seminar Room 301',
//     speaker: 'Dr. Tanvir Ahmed, Blockchain Expert',
//     organizer: 'Innovation Lab',
//     maxParticipants: 80,
//     registeredCount: 45,
//     registrationRequired: true,
//     registrationDeadline: '2024-08-18T23:59:59Z',
//     fee: 0,
//     tags: ['Blockchain', 'Technology', 'Innovation']
//   },
//   {
//     id: '8',
//     title: 'Mobile App Development Bootcamp',
//     description: '3-day intensive bootcamp covering iOS and Android app development using React Native and Flutter.',
//     type: 'workshop',
//     status: 'registration_open',
//     startDate: '2024-09-01T09:00:00Z',
//     endDate: '2024-09-03T17:00:00Z',
//     venue: 'Mobile Development Lab',
//     speaker: 'Team of Industry Experts',
//     organizer: 'Mobile Development Club',
//     maxParticipants: 25,
//     registeredCount: 18,
//     registrationRequired: true,
//     registrationDeadline: '2024-08-25T23:59:59Z',
//     fee: 1500,
//     externalLink: 'https://mobiledev.csedu.ac.bd',
//     tags: ['Mobile Development', 'React Native', 'Flutter']
//   }
// ]

const Events = () => {

  //real api call

  // const [realEvents, setRealEvents] = useState([])



  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])

  useEffect(() => {
    const fetchEventsData = async () => {
          try {
            const response = await Api.get('api/events');
            setEvents(response.data);
            setFilteredEvents(response.data);
            console.log(response.data);
          } catch (error) {
            console.error('Error fetching overview data:', error);
          }
        };
        fetchEventsData();
  }, [])
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    months: [],
    statuses: [],
    freeOnly: false
  })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  // Event types
  const eventTypes = ['seminar', 'workshop', 'conference', 'competition', 'cultural', 'academic']

  // Available months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Available statuses
  const statuses = ['upcoming', 'ongoing', 'registration_open', 'registration_closed', 'completed']

  // Filter events based on current filters
  useEffect(() => {
    let filtered = events

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.speaker?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Types filter (array)
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(event => filters.types.includes(event.type))
    }

    // Status filter (array)
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(event => filters.statuses.includes(event.status))
    }

    // Month filter (array)
    if (filters.months && filters.months.length > 0) {
      filtered = filtered.filter(event => {
        const eventMonth = new Date(event.startDate).toLocaleString('default', { month: 'short' })
        return filters.months.includes(eventMonth)
      })
    }

    // Free only filter
    if (filters.freeOnly) {
      filtered = filtered.filter(event => !event.fee || event.fee === 0)
    }

    setFilteredEvents(filtered)
  }, [events, filters])

  // Count active filters is now handled in EventFilters component

  // Handle event registration
  const handleRegister = (event) => {
    setSelectedEvent(event)
    setIsRegistrationModalOpen(true)
  }

  // Handle registration submission
  const handleRegistrationSubmit = (registrationData) => {
    console.log('Registration submitted:', registrationData)
    // Here you would typically send the data to your API
  }

  // Get upcoming events count
  const upcomingEventsCount = events.filter(event => 
    event.status === 'upcoming' || event.status === 'registration_open'
  ).length

  // Get total registered participants
  const totalRegistrations = events.reduce((sum, event) => 
    sum + (event.registeredCount || 0), 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Upcoming Events
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover exciting events, workshops, seminars, and competitions happening at the Department of Computer Science and Engineering
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-8 h-8 mr-2" />
                  <span className="text-3xl font-bold">{upcomingEventsCount}</span>
                </div>
                <p className="text-blue-100">Upcoming Events</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 mr-2" />
                  <span className="text-3xl font-bold">{totalRegistrations}+</span>
                </div>
                <p className="text-blue-100">Total Registrations</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 mr-2" />
                  <span className="text-3xl font-bold">{eventTypes.length}</span>
                </div>
                <p className="text-blue-100">Event Categories</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <EventFilters
          filters={filters}
          setFilters={setFilters}
          eventTypes={eventTypes}
          months={months}
          statuses={statuses}
        />

        {/* Events Grid */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onRegister={handleRegister}
              />
            ))
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters to find more events
              </p>
              <Button 
                onClick={() => setFilters({
                  search: '',
                  types: [],
                  months: [],
                  statuses: [],
                  freeOnly: false
                })}
                variant="outline"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>

        {/* Call to Action */}
        {filteredEvents.length > 0 && (
          <motion.section 
            className="bg-white rounded-lg shadow-md p-8 mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don't Miss Out!
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Stay updated with the latest events and opportunities. Register early to secure your spot 
              and be part of our vibrant academic community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe to Updates
              </Button>
              <Button variant="outline">
                View Event Calendar
              </Button>
            </div>
          </motion.section>
        )}
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false)
          setSelectedEvent(null)
        }}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  )
}

export default Events
