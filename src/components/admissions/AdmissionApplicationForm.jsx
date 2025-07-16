import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import Api from '../../constant/Api'

const AdmissionApplicationForm = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    
    // Academic Information
    educationLevel: '',
    institution: '',
    major: '',
    graduationYear: '',
    cgpa: '',
    
    // Program Selection
    programType: '',
    program: '',
    semester: '',
    
    // Documents
    transcriptFile: null,
    certificateFile: null,
    photoFile: null,
    idFile: null,
    
    // Additional Information
    statement: '',
    source: '',
    specialNeeds: '',
    agreeToTerms: false
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }))
  }
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Create form data object for file uploads
      const formDataObj = new FormData()
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataObj.append(key, formData[key])
        }
      })
      
      // In a real implementation, you would send this to your API
      // const response = await Api.post('api/admissions/apply', formDataObj)
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setLoading(false)
      
      // Reset form after successful submission
      setTimeout(() => {
        if (onClose) {
          onClose()
        }
      }, 3000)
      
    } catch (err) {
      setError('There was an error submitting your application. Please try again.')
      setLoading(false)
    }
  }
  
  if (!isOpen) return null
  
  const programs = {
    undergraduate: [
      'BSc in Computer Science and Engineering',
      'BSc in Software Engineering'
    ],
    graduate: [
      'MSc in Computer Science',
      'MSc in Data Science',
      'MSc in Artificial Intelligence'
    ],
    postgraduate: [
      'PhD in Computer Science',
      'PhD in Machine Learning and AI'
    ]
  }
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup 
                  name="gender" 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange('gender', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input 
                  id="nationality" 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleChange} 
                  placeholder="Enter your nationality"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Current Address *</Label>
              <Textarea 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Enter your current address"
                required
              />
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="educationLevel">Highest Education Level *</Label>
                <Select 
                  value={formData.educationLevel} 
                  onValueChange={(value) => handleSelectChange('educationLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School/HSC</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Institution Name *</Label>
                <Input 
                  id="institution" 
                  name="institution" 
                  value={formData.institution} 
                  onChange={handleChange} 
                  placeholder="Enter your institution name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="major">Major/Subject *</Label>
                <Input 
                  id="major" 
                  name="major" 
                  value={formData.major} 
                  onChange={handleChange} 
                  placeholder="Enter your major or subject"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Input 
                  id="graduationYear" 
                  name="graduationYear" 
                  type="number" 
                  min="1990" 
                  max="2030" 
                  value={formData.graduationYear} 
                  onChange={handleChange} 
                  placeholder="Enter graduation year"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA/GPA *</Label>
                <Input 
                  id="cgpa" 
                  name="cgpa" 
                  value={formData.cgpa} 
                  onChange={handleChange} 
                  placeholder="Enter your CGPA or GPA"
                  required
                />
              </div>
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Program Selection</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type *</Label>
                <Select 
                  value={formData.programType} 
                  onValueChange={(value) => handleSelectChange('programType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="program">Program *</Label>
                <Select 
                  value={formData.program} 
                  onValueChange={(value) => handleSelectChange('program', value)}
                  disabled={!formData.programType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.programType && programs[formData.programType]?.map((program, index) => (
                      <SelectItem key={index} value={program}>{program}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester">Starting Semester *</Label>
                <Select 
                  value={formData.semester} 
                  onValueChange={(value) => handleSelectChange('semester', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall_2025">Fall 2025</SelectItem>
                    <SelectItem value="spring_2026">Spring 2026</SelectItem>
                    <SelectItem value="summer_2026">Summer 2026</SelectItem>
                    <SelectItem value="fall_2026">Fall 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Required Documents</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please upload the following documents in PDF or image format (JPG, PNG). 
              Each file should not exceed 5MB.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transcriptFile">Academic Transcript *</Label>
                <Input 
                  id="transcriptFile" 
                  name="transcriptFile" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-gray-500">Upload your complete academic transcript</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificateFile">Degree Certificate *</Label>
                <Input 
                  id="certificateFile" 
                  name="certificateFile" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-gray-500">Upload your degree certificate or provisional certificate</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photoFile">Passport Size Photo *</Label>
                <Input 
                  id="photoFile" 
                  name="photoFile" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-gray-500">Upload a recent passport size photo with white background</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idFile">ID Proof *</Label>
                <Input 
                  id="idFile" 
                  name="idFile" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-gray-500">Upload your national ID, passport, or birth certificate</p>
              </div>
            </div>
          </div>
        )
        
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="statement">Statement of Purpose *</Label>
                <Textarea 
                  id="statement" 
                  name="statement" 
                  value={formData.statement} 
                  onChange={handleChange} 
                  placeholder="Briefly describe why you want to join this program and your future goals"
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">How did you hear about us?</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => handleSelectChange('source', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">University Website</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="friend">Friend or Family</SelectItem>
                    <SelectItem value="education_fair">Education Fair</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Special Needs or Accommodations</Label>
                <Textarea 
                  id="specialNeeds" 
                  name="specialNeeds" 
                  value={formData.specialNeeds} 
                  onChange={handleChange} 
                  placeholder="Please specify if you have any special needs or require accommodations"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="agreeToTerms" 
                  name="agreeToTerms" 
                  checked={formData.agreeToTerms} 
                  onCheckedChange={(checked) => handleSelectChange('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I confirm that all information provided is accurate and complete. I understand that any false information may result in the rejection of my application or dismissal if admitted. *
                </Label>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Admission Application</h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your application. We have sent a confirmation email to {formData.email}.
                Our admissions team will review your application and contact you soon.
              </p>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div 
                      key={step}
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep === step 
                          ? 'bg-blue-600 text-white' 
                          : currentStep > step 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {currentStep > step ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Personal</span>
                  <span>Academic</span>
                  <span>Program</span>
                  <span>Documents</span>
                  <span>Additional</span>
                </div>
              </div>
              
              {/* Form steps */}
              {renderStep()}
              
              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || loading}
                >
                  Previous
                </Button>
                
                {currentStep < 5 ? (
                  <Button 
                    type="button"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={!formData.agreeToTerms || loading}
                    className="relative"
                  >
                    {loading ? (
                      <>
                        <span className="opacity-0">Submit Application</span>
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdmissionApplicationForm
