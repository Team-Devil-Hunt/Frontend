import React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, FileCheck, PenTool, CalendarCheck, 
  FileText, CreditCard, CheckCircle, Award 
} from 'lucide-react'

const ProcessStep = ({ icon: Icon, title, description, delay, number }) => {
  return (
    <motion.div 
      className="relative flex gap-4 items-start"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 relative">
          <Icon className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {number}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

const ApplicationProcess = ({ steps }) => {
  return (
    <section className="py-16 bg-white" id="application-process">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Application Process</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow these steps to apply for admission to the Department of Computer Science and Engineering at the University of Dhaka.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-blue-100"></div>
            
            <div className="space-y-12">
              <ProcessStep 
                icon={Search}
                title="Research Programs"
                description="Explore our undergraduate and graduate programs to find the right fit for your academic and career goals."
                delay={0.1}
                number={1}
              />
              
              <ProcessStep 
                icon={FileText}
                title="Check Requirements"
                description="Review admission requirements including academic qualifications, test scores, and supporting documents."
                delay={0.2}
                number={2}
              />
              
              <ProcessStep 
                icon={PenTool}
                title="Complete Online Application"
                description="Fill out the online application form with your personal information, academic history, and program selection."
                delay={0.3}
                number={3}
              />
              
              <ProcessStep 
                icon={FileCheck}
                title="Submit Documents"
                description="Upload or mail all required documents including transcripts, test scores, statement of purpose, and recommendation letters."
                delay={0.4}
                number={4}
              />
              
              <ProcessStep 
                icon={CreditCard}
                title="Pay Application Fee"
                description="Submit the non-refundable application fee through the online payment system or bank transfer."
                delay={0.5}
                number={5}
              />
              
              <ProcessStep 
                icon={CalendarCheck}
                title="Admission Test"
                description="Eligible candidates will be invited to take the departmental admission test (written and/or practical)."
                delay={0.6}
                number={6}
              />
              
              <ProcessStep 
                icon={CheckCircle}
                title="Application Review"
                description="The admissions committee will review your complete application package including test results."
                delay={0.7}
                number={7}
              />
              
              <ProcessStep 
                icon={Award}
                title="Admission Decision"
                description="Receive your admission decision via email and official letter. If accepted, follow instructions to confirm your enrollment."
                delay={0.8}
                number={8}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ApplicationProcess
