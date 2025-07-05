import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CalendarDays, FileText, Clock, Users } from 'lucide-react'

const AdmissionHero = ({ stats }) => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16 md:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0xOGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0wIDM2YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Join the Next Generation of Tech Innovators
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The Department of Computer Science and Engineering at the University of Dhaka 
            offers world-class education and research opportunities for aspiring technologists.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              Apply Now
            </Button>
            <Button size="lg" className="border-white text-white hover:bg-white/10">
              Download Prospectus
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h3 className="text-2xl font-bold">{stats.nextDeadline}</h3>
            <p className="text-blue-200 text-sm">Next Deadline</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h3 className="text-2xl font-bold">{stats.programsOffered}</h3>
            <p className="text-blue-200 text-sm">Programs Offered</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h3 className="text-2xl font-bold">{stats.applicationTime}</h3>
            <p className="text-blue-200 text-sm">Application Time</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h3 className="text-2xl font-bold">{stats.acceptanceRate}</h3>
            <p className="text-blue-200 text-sm">Acceptance Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AdmissionHero
