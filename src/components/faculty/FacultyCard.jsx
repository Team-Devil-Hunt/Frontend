import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
// Import default image
import defaultTeacherImage from '../../assets/teacher/shabbir_ahmed.jpg'

const FacultyCard = ({ faculty, variants }) => {
  const { 
    id, 
    name = 'Faculty Member',
    designation = 'Faculty',
    role = designation || 'Faculty',
    shortBio = '',
    expertise = [],
    image = null,
    contact = '',
    slug = null,
    displayIndex = null
  } = faculty || {}
  
  const facultySlug = slug || id || name?.toLowerCase().replace(/\s+/g, '-')
  
  // Generate star rating (4-5 stars for faculty)
  const rating = faculty?.rating || (4 + Math.random())
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <motion.div variants={variants}>
      <Link to={`/faculty/${facultySlug}`}>
        <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <CardContent className="p-6 text-center">
            {/* Profile Image */}
            <div className="mb-4">
              <img 
                src={image ? (image.startsWith('/src') ? image : `/src${image}`) : defaultTeacherImage} 
                alt={name || 'Faculty Member'}
                className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white/20 group-hover:border-white/40 transition-colors"
                onError={(e) => {
                  e.target.onerror = null;
                  try {
                    const teacherName = name.split(' ').pop().toLowerCase();
                    import(`../../assets/teacher/${teacherName}.jpg`)
                      .then(img => e.target.src = img.default)
                      .catch(() => {
                        e.target.src = defaultTeacherImage;
                        e.target.onerror = () => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Faculty')}&background=random`;
                        };
                      });
                  } catch (error) {
                    e.target.src = defaultTeacherImage;
                  }
                }}
              />
            </div>
            
            {/* Name and Title */}
            <div className="relative">
              {displayIndex && (
                <div className="absolute -top-10 -left-10 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                  {displayIndex}
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-100 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-blue-100 mb-3">
                {role || designation}
              </p>
            </div>
            
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
              {shortBio || (expertise && expertise.length > 0 ? `Expert in ${expertise.slice(0, 2).join(' & ')}` : 'Faculty member')}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default FacultyCard
