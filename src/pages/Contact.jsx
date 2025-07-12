/*
API Schema for Contact Page:

1. POST /api/contact
   Request Body: {
     name: string,
     email: string,
     subject: string,
     message: string,
     phone?: string
   }
   Response: {
     id: string,
     name: string,
     email: string,
     subject: string,
     message: string,
     phone?: string,
     created_at: string
   }
*/

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import Api from '../constant/Api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // null, 'success', 'error'
  const [submitMessage, setSubmitMessage] = useState('')
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^\\S+@\\S+\\.\\S+$/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      const response = await Api.post('api/contact', formData)
      
      setSubmitStatus('success')
      setSubmitMessage('Your message has been sent successfully! We will get back to you soon.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      console.log('Contact form submitted:', response.data)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
      setSubmitMessage('Failed to send your message. Please try again later.')
    } finally {
      setIsSubmitting(false)
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
        setSubmitMessage('')
      }, 5000)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with the Department of Computer Science and Engineering at the University of Dhaka
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="h-full bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600 mt-1">
                        Department of Computer Science and Engineering<br />
                        Faculty of Science<br />
                        University of Dhaka<br />
                        Dhaka-1000, Bangladesh
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600 mt-1">+880-2-9661900 Ext. 7423</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600 mt-1">office@cse.du.ac.bd</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Office Hours</h3>
                      <p className="text-gray-600 mt-1">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Find Us On Map</h3>
                  <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3701967527696!2d90.39251661498134!3d23.733733684598378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8e90a449e4f%3A0xb7092a841c01e16a!2sUniversity%20of%20Dhaka!5e0!3m2!1sen!2sbd!4v1625764817794!5m2!1sen!2sbd" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy"
                      title="University of Dhaka Map"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                {submitStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 mb-6 rounded-lg flex items-center ${submitStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                  >
                    {submitStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    <span>{submitMessage}</span>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label 
                        htmlFor="name" 
                        className={`block text-sm font-medium mb-1 ${errors.name ? 'text-red-500' : ''}`}
                      >
                        Name {errors.name && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="email" 
                        className={`block text-sm font-medium mb-1 ${errors.email ? 'text-red-500' : ''}`}
                      >
                        Email {errors.email && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label 
                        htmlFor="phone"
                        className="block text-sm font-medium mb-1"
                      >
                        Phone (Optional)
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your Phone Number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="subject" 
                        className={`block text-sm font-medium mb-1 ${errors.subject ? 'text-red-500' : ''}`}
                      >
                        Subject {errors.subject && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Message Subject"
                        className={`w-full px-3 py-2 border rounded-md ${errors.subject ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="message" 
                      className={`block text-sm font-medium mb-1 ${errors.message ? 'text-red-500' : ''}`}
                    >
                      Message {errors.message && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-md ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
