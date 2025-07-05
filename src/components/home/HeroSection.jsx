import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'

const HeroSection = ({ data, variants }) => {
  return (
    <motion.section 
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={variants.container}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={variants.item}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {data.title.split('&')[0]}
              <span className="text-blue-600 block">& {data.title.split('&')[1]}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {data.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{data.stats.students}+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{data.stats.faculty}+</div>
                <div className="text-sm text-gray-600">Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{data.stats.programs}</div>
                <div className="text-sm text-gray-600">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{data.stats.research}+</div>
                <div className="text-sm text-gray-600">Research Projects</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/programs">Explore Programs</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/admissions">Apply Now</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div variants={variants.item} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={data.heroImage} 
                alt="Department Overview" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
