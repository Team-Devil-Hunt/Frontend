import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const FAQItem = ({ question, answer, category, isOpen, onClick }) => {
  return (
    <motion.div 
      className="border-b border-gray-200 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="mt-1">{category}</Badge>
          <h3 className="text-lg font-medium">{question}</h3>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <motion.div 
          className="mt-3 pl-16 pr-6 text-gray-600"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="prose prose-blue max-w-none">
            {answer}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

const AdmissionFAQs = ({ faqs }) => {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  
  // Extract unique categories
  const categories = ['All', ...new Set(faqs.map(faq => faq.category))]
  
  // Filter FAQs based on search term and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
    
    return matchesSearch && matchesCategory
  })
  
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }
  
  return (
    <section className="py-16 bg-white" id="faqs">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our admissions process, requirements, and programs.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {filteredFAQs.length > 0 ? (
            <div className="space-y-2">
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  category={faq.category}
                  isOpen={openFAQ === index}
                  onClick={() => toggleFAQ(index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No FAQs match your search criteria.</p>
            </div>
          )}
          
          <div className="mt-12 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, please contact our admissions office.
            </p>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-blue-600">admissions@cse.du.ac.bd</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p className="text-blue-600">+880-2-9661920-73 Ext. 7412</p>
              </div>
              <div>
                <p className="font-medium">Office Hours:</p>
                <p>Sun-Thu: 9:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdmissionFAQs
