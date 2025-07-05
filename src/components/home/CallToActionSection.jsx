import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'

const CallToActionSection = ({ variants }) => {
  return (
    <motion.section 
      className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants.container}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={variants.item}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover opportunities for learning, research, and innovation in computer science and engineering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/admissions">Apply for Admission</Link>
            </Button>
            <Button asChild size="lg" className="border-white text-black bg-white hover:text-blue-600 hover:bg-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default CallToActionSection
