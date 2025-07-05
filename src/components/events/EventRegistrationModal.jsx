import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Calendar, Clock, MapPin, User, Mail, Phone, GraduationCap, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

const EventRegistrationModal = ({ event, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    specialRequirements: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Call parent callback
    onSubmit({
      event: event,
      registrationData: formData
    })
    
    // Auto close after 3 seconds
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      studentId: '',
      department: '',
      year: '',
      specialRequirements: ''
    })
    setIsSubmitted(false)
    setIsSubmitting(false)
    onClose()
  }

  const isFormValid = formData.fullName && formData.email && formData.phone

  if (!event) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {isSubmitted ? 'Registration Confirmed!' : 'Event Registration'}
                    </CardTitle>
                    <h3 className="font-semibold text-lg text-blue-600">{event.title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {isSubmitted ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Registration Successful!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for registering for <strong>{event.title}</strong>
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-green-700">
                        A confirmation email has been sent to <strong>{formData.email}</strong>
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      This window will close automatically in a few seconds...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Event Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{format(new Date(event.startDate), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{event.venue}</span>
                        </div>
                        {event.fee && event.fee > 0 && (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              Fee: ৳{event.fee}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="pl-10"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="pl-10"
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student ID
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="text"
                              name="studentId"
                              value={formData.studentId}
                              onChange={handleInputChange}
                              className="pl-10"
                              placeholder="Enter your student ID"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                          </label>
                          <Input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            placeholder="e.g., Computer Science & Engineering"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year of Study
                          </label>
                          <Input
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            placeholder="e.g., 3rd Year"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Requirements or Comments
                        </label>
                        <textarea
                          name="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                          placeholder="Any dietary restrictions, accessibility needs, or other requirements..."
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <Button
                          type="submit"
                          disabled={!isFormValid || isSubmitting}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? 'Registering...' : 'Register for Event'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EventRegistrationModal
