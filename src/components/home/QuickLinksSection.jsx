import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award,
  Calendar,
  FileText,
  Phone,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

const iconMap = {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Calendar,
  Award,
  Phone,
  ExternalLink
}

const QuickLinksSection = ({ data, variants }) => {
  return (
    <motion.section 
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants.container}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={variants.item} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quick Links
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access important resources and information quickly
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.links.map((link) => {
            const IconComponent = iconMap[link.icon] || ExternalLink
            return (
              <motion.div key={link.id} variants={variants.item}>
                <Link to={link.href}>
                  <Card className="h-full hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {link.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {link.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

export default QuickLinksSection
