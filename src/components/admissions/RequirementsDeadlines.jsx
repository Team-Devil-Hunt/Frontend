import React from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarClock, GraduationCap, FileText, Globe, Languages, Calculator } from 'lucide-react'

const RequirementItem = ({ icon: Icon, title, children }) => {
  return (
    <div className="flex gap-4 items-start mb-6">
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium mb-2">{title}</h4>
        <div className="text-gray-600">
          {children}
        </div>
      </div>
    </div>
  )
}

const DeadlineCard = ({ deadline }) => {
  // Calculate days remaining
  const today = new Date();
  const deadlineDate = new Date(deadline.date);
  const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  
  // Determine status badge
  let badgeVariant = "default";
  let badgeText = "Open";
  
  if (daysRemaining < 0) {
    badgeVariant = "destructive";
    badgeText = "Closed";
  } else if (daysRemaining <= 7) {
    badgeVariant = "destructive";
    badgeText = "Closing Soon";
  } else if (daysRemaining <= 30) {
    badgeVariant = "secondary";
    badgeText = "Upcoming";
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-md transition-all duration-300 overflow-hidden border-t-4 border-blue-600">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{deadline.program}</h3>
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-medium">Deadline:</span> {deadline.date}
                {daysRemaining > 0 && (
                  <span className="text-blue-600 ml-2">({daysRemaining} days remaining)</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-medium">Program:</span> {deadline.level}
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <FileText className="w-4 h-4 text-blue-600 mt-1" />
              <div>
                <span className="font-medium">Requirements:</span> {deadline.requirements}
              </div>
            </div>
            
            {deadline.notes && (
              <div className="bg-blue-50 p-3 rounded-md text-sm mt-2">
                <p className="font-medium text-blue-700">Note:</p>
                <p className="text-blue-800">{deadline.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const RequirementsDeadlines = ({ requirements, deadlines }) => {
  return (
    <section className="py-16 bg-gray-50" id="requirements-deadlines">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Requirements & Deadlines</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review our admission requirements and upcoming application deadlines for all programs.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="undergraduate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="graduate">Graduate (MSc)</TabsTrigger>
              <TabsTrigger value="postgraduate">Postgraduate (PhD)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="undergraduate" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Requirements</h3>
                  
                  <RequirementItem icon={GraduationCap} title="Academic Qualifications">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Higher Secondary Certificate (HSC) or equivalent with minimum GPA of 4.5</li>
                      <li>Secondary School Certificate (SSC) or equivalent with minimum GPA of 4.0</li>
                      <li>Combined GPA of at least 9.0 in SSC and HSC examinations</li>
                      <li>Minimum grade of A in Mathematics at HSC level</li>
                      <li>Minimum grade of B in Physics and English at HSC level</li>
                    </ul>
                  </RequirementItem>
                  
                  <RequirementItem icon={Calculator} title="Admission Test">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Written test covering Mathematics, Physics, and Basic Computer Knowledge</li>
                      <li>Minimum 60% marks required to qualify for the next round</li>
                      <li>Final selection based on combined score of academic results and admission test</li>
                    </ul>
                  </RequirementItem>
                  
                  <RequirementItem icon={FileText} title="Required Documents">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Completed application form</li>
                      <li>Attested copies of all academic certificates and transcripts</li>
                      <li>Four passport-sized photographs</li>
                      <li>National ID card or birth certificate</li>
                      <li>Application fee payment receipt</li>
                    </ul>
                  </RequirementItem>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6">Upcoming Deadlines</h3>
                  <div className="space-y-6">
                    {deadlines.filter(d => d.level === "Undergraduate").map((deadline, index) => (
                      <DeadlineCard key={index} deadline={deadline} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="graduate" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Requirements</h3>
                  
                  <RequirementItem icon={GraduationCap} title="Academic Qualifications">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Bachelor's degree in Computer Science, Computer Engineering, or related field</li>
                      <li>Minimum CGPA of 3.0 on a 4.0 scale or equivalent</li>
                      <li>Strong background in programming, algorithms, and data structures</li>
                    </ul>
                  </RequirementItem>
                  
                  <RequirementItem icon={Languages} title="English Proficiency">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>IELTS score of at least 6.5 or equivalent TOEFL score</li>
                      <li>Waiver for applicants from English-medium institutions</li>
                    </ul>
                  </RequirementItem>
                  
                  <RequirementItem icon={FileText} title="Required Documents">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Completed application form</li>
                      <li>Statement of purpose (500-700 words)</li>
                      <li>Two letters of recommendation</li>
                      <li>Attested copies of all academic certificates and transcripts</li>
                      <li>CV/Resume highlighting relevant experience</li>
                      <li>Research proposal (for thesis track)</li>
                      <li>Application fee payment receipt</li>
                    </ul>
                  </RequirementItem>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6">Upcoming Deadlines</h3>
                  <div className="space-y-6">
                    {deadlines.filter(d => d.level === "Graduate").map((deadline, index) => (
                      <DeadlineCard key={index} deadline={deadline} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="postgraduate" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Requirements</h3>
                  
                  <RequirementItem icon={GraduationCap} title="Academic Qualifications">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Master's degree in Computer Science or closely related field</li>
                      <li>Minimum CGPA of 3.5 on a 4.0 scale or equivalent</li>
                      <li>Demonstrated research capability through publications or thesis</li>
                    </ul>
                  </RequirementItem>
                  
                  <RequirementItem icon={Globe} title="Research Proposal">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Comprehensive research proposal (1500-2000 words)</li>
                      <li>Clear research objectives and methodology</li>
                      <li>Literature review demonstrating knowledge of the field</li>
                      <li>Alignment with departmental research areas</li>
                    </ul>
                  </RequirementItem>
                  
                  <RequirementItem icon={FileText} title="Required Documents">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Completed application form</li>
                      <li>Detailed research proposal</li>
                      <li>Three letters of recommendation (at least two academic)</li>
                      <li>Attested copies of all academic certificates and transcripts</li>
                      <li>CV/Resume with research experience and publications</li>
                      <li>Sample of academic writing or published papers</li>
                      <li>Application fee payment receipt</li>
                    </ul>
                  </RequirementItem>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6">Upcoming Deadlines</h3>
                  <div className="space-y-6">
                    {deadlines.filter(d => d.level === "Postgraduate").map((deadline, index) => (
                      <DeadlineCard key={index} deadline={deadline} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default RequirementsDeadlines
