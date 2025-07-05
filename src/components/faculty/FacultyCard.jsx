import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

const FacultyCard = ({ faculty, variants }) => {
  // Generate star rating (4-5 stars for faculty)
  const rating = faculty.rating || (4 + Math.random())
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <motion.div variants={variants}>
      <Link to={`/faculty/${faculty.id}`}>
        <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <CardContent className="p-6 text-center">
            {/* Profile Image */}
            <div className="mb-4">
              <img 
                src={faculty.image} 
                alt={faculty.name}
                className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white/20 group-hover:border-white/40 transition-colors"
              />
            </div>
            
            {/* Name and Title */}
            <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-100 transition-colors">
              {faculty.name}
            </h3>
            <p className="text-sm text-blue-100 mb-3">
              {faculty.designation}
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(5)].map((_, index) => {
                if (index < fullStars) {
                  return (
                    <Star 
                      key={index} 
                      className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                    />
                  )
                } else if (index === fullStars && hasHalfStar) {
                  return (
                    <div key={index} className="relative">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" 
                            style={{ clipPath: 'inset(0 50% 0 0)' }} />
                    </div>
                  )
                } else {
                  return (
                    <Star 
                      key={index} 
                      className="w-4 h-4 text-yellow-400/40" 
                    />
                  )
                }
              })}
            </div>
            
            {/* Brief Description */}
            <p className="text-xs text-blue-100 leading-relaxed">
              {faculty.shortBio || `Expert in ${faculty.expertise.slice(0, 2).join(' & ')}`}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default FacultyCard
