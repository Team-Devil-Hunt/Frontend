import React from 'react'
import { motion } from 'framer-motion'
import AdmissionHero from '../components/admissions/AdmissionHero'
import ApplicationProcess from '../components/admissions/ApplicationProcess'
import RequirementsDeadlines from '../components/admissions/RequirementsDeadlines'
import AdmissionFAQs from '../components/admissions/AdmissionFAQs'
import AdmissionApplicationForm from '../components/admissions/AdmissionApplicationForm'

import Api from '../constant/Api'
import { useEffect, useState } from 'react'
/**
 * API Schema:
 * 
 * GET /api/admissions/stats
 * {
 *   nextDeadline: string,
 *   programsOffered: number,
 *   applicationTime: string,
 *   acceptanceRate: string
 * }
 * 
 * GET /api/admissions/deadlines
 * [
 *   {
 *     program: string,
 *     level: "Undergraduate" | "Graduate" | "Postgraduate",
 *     date: string (YYYY-MM-DD),
 *     requirements: string,
 *     notes?: string
 *   }
 * ]
 * 
 * GET /api/admissions/faqs
 * [
 *   {
 *     question: string,
 *     answer: string,
 *     category: string
 *   }
 * ]
 */

// Mock API data
// const mockStats = {
//   nextDeadline: "July 30, 2025",
//   programsOffered: 8,
//   applicationTime: "4-6 weeks",
//   acceptanceRate: "12%"
// }

// const mockDeadlines = [
//   {
//     program: "BSc in Computer Science and Engineering",
//     level: "Undergraduate",
//     date: "2025-07-30",
//     requirements: "HSC/A-Level with minimum GPA 4.5, Admission test required",
//     notes: "Limited seats available. Early application recommended."
//   },
//   {
//     program: "BSc in Software Engineering",
//     level: "Undergraduate",
//     date: "2025-08-15",
//     requirements: "HSC/A-Level with minimum GPA 4.5, Admission test required"
//   },
//   {
//     program: "MSc in Computer Science",
//     level: "Graduate",
//     date: "2025-09-10",
//     requirements: "BSc in CS/IT/related field with minimum CGPA 3.0"
//   },
//   {
//     program: "MSc in Data Science",
//     level: "Graduate",
//     date: "2025-09-10",
//     requirements: "BSc in CS/Statistics/Mathematics with minimum CGPA 3.0"
//   },
//   {
//     program: "MSc in Artificial Intelligence",
//     level: "Graduate",
//     date: "2025-10-05",
//     requirements: "BSc in CS/related field with minimum CGPA 3.0, Programming experience required"
//   },
//   {
//     program: "PhD in Computer Science",
//     level: "Postgraduate",
//     date: "2025-11-15",
//     requirements: "MSc in CS/related field with minimum CGPA 3.5, Research proposal required"
//   },
//   {
//     program: "PhD in Machine Learning and AI",
//     level: "Postgraduate",
//     date: "2025-11-15",
//     requirements: "MSc in CS/AI/related field with minimum CGPA 3.5, Research proposal required"
//   }
// ]

// const mockFAQs = [
//   {
//     question: "What are the minimum academic requirements for undergraduate admission?",
//     answer: (
//       <p>
//         For undergraduate programs, applicants must have completed Higher Secondary Certificate (HSC) 
//         or equivalent (A-Level, IB, etc.) with a minimum GPA of 4.5. Additionally, applicants must have 
//         a minimum grade of A in Mathematics and B in Physics and English at the HSC level. The combined 
//         GPA from SSC and HSC should be at least 9.0.
//       </p>
//     ),
//     category: "Requirements"
//   },
//   {
//     question: "Is there an admission test for undergraduate programs?",
//     answer: (
//       <p>
//         Yes, all eligible applicants for undergraduate programs must take a written admission test 
//         covering Mathematics, Physics, and Basic Computer Knowledge. Candidates must score at least 60% 
//         in the admission test to be considered for admission. The final selection is based on a combined 
//         score of academic results and the admission test.
//       </p>
//     ),
//     category: "Admission Test"
//   },
//   {
//     question: "How can I apply for admission?",
//     answer: (
//       <div>
//         <p>The application process involves the following steps:</p>
//         <ol className="list-decimal pl-5 space-y-1 mt-2">
//           <li>Complete the online application form on our admissions portal</li>
//           <li>Pay the application fee</li>
//           <li>Upload all required documents</li>
//           <li>Submit your application before the deadline</li>
//           <li>If eligible, you'll receive an admit card for the admission test</li>
//           <li>Take the admission test on the scheduled date</li>
//           <li>Check results and follow enrollment instructions if selected</li>
//         </ol>
//       </div>
//     ),
//     category: "Application Process"
//   },
//   {
//     question: "What documents are required for the application?",
//     answer: (
//       <div>
//         <p>For undergraduate programs, you need to submit:</p>
//         <ul className="list-disc pl-5 space-y-1 mt-2">
//           <li>Completed application form</li>
//           <li>Attested copies of all academic certificates and transcripts</li>
//           <li>Four passport-sized photographs</li>
//           <li>National ID card or birth certificate</li>
//           <li>Application fee payment receipt</li>
//         </ul>
        
//         <p className="mt-3">For graduate and postgraduate programs, additional documents include:</p>
//         <ul className="list-disc pl-5 space-y-1 mt-2">
//           <li>Statement of purpose</li>
//           <li>Letters of recommendation</li>
//           <li>CV/Resume</li>
//           <li>Research proposal (for PhD applicants)</li>
//         </ul>
//       </div>
//     ),
//     category: "Requirements"
//   },
//   {
//     question: "What is the application fee?",
//     answer: (
//       <div>
//         <p>The application fees are as follows:</p>
//         <ul className="list-disc pl-5 space-y-1 mt-2">
//           <li>Undergraduate programs: BDT 1,000</li>
//           <li>Graduate programs: BDT 1,500</li>
//           <li>Postgraduate programs: BDT 2,000</li>
//         </ul>
//         <p className="mt-2">Payment can be made online through bKash, Nagad, or bank transfer.</p>
//       </div>
//     ),
//     category: "Fees"
//   },
//   {
//     question: "Are there any scholarships available for international students?",
//     answer: (
//       <p>
//         Yes, the department offers a limited number of scholarships for international students based on 
//         academic merit and financial need. These include tuition waivers, monthly stipends, and research 
//         grants. International applicants can indicate their interest in scholarships in the application 
//         form and will be considered automatically based on their academic profile.
//       </p>
//     ),
//     category: "Scholarships"
//   },
//   {
//     question: "Can I transfer credits from another university?",
//     answer: (
//       <p>
//         Yes, the department accepts transfer credits from recognized universities for equivalent courses. 
//         Transfer applicants must have completed at least one year of study at their current institution 
//         with a minimum CGPA of 3.0. The transfer credit evaluation committee will assess which credits 
//         can be transferred. A maximum of 40% of the total credits required for the degree can be transferred.
//       </p>
//     ),
//     category: "Transfer"
//   },
//   {
//     question: "What English language proficiency tests are accepted?",
//     answer: (
//       <div>
//         <p>We accept the following English language proficiency tests:</p>
//         <ul className="list-disc pl-5 space-y-1 mt-2">
//           <li>IELTS: Minimum score of 6.5</li>
//           <li>TOEFL iBT: Minimum score of 90</li>
//           <li>PTE Academic: Minimum score of 63</li>
//           <li>Duolingo English Test: Minimum score of 110</li>
//         </ul>
//         <p className="mt-2">
//           Applicants who have completed their previous degree entirely in English may be eligible for a waiver.
//         </p>
//       </div>
//     ),
//     category: "Requirements"
//   },
//   {
//     question: "How competitive is the admission process?",
//     answer: (
//       <p>
//         Admission to our programs is highly competitive. For undergraduate programs, we typically receive 
//         over 5,000 applications for approximately 120 seats, making the acceptance rate around 2.4%. 
//         For graduate programs, the acceptance rate is approximately 15%, and for PhD programs, it's about 10%. 
//         Successful applicants generally have outstanding academic records, strong test scores, and demonstrate 
//         a clear passion for computer science.
//       </p>
//     ),
//     category: "Admission Process"
//   },
//   {
//     question: "Can I apply for multiple programs simultaneously?",
//     answer: (
//       <p>
//         Yes, you can apply for up to two programs within the department in the same application cycle. 
//         However, you will need to pay a separate application fee for each program and indicate your order 
//         of preference. If you are accepted to both programs, you will be offered admission to your higher 
//         preference only.
//       </p>
//     ),
//     category: "Application Process"
//   },
//   {
//     question: "What are the tuition fees for the programs?",
//     answer: (
//       <div>
//         <p>The tuition fees per semester are approximately:</p>
//         <ul className="list-disc pl-5 space-y-1 mt-2">
//           <li>BSc programs: BDT 25,000 - 30,000</li>
//           <li>MSc programs: BDT 35,000 - 45,000</li>
//           <li>PhD programs: BDT 50,000 - 60,000</li>
//         </ul>
//         <p className="mt-2">
//           Additional fees include registration fees, library fees, lab fees, and student activity fees. 
//           International students pay approximately 1.5 times the regular tuition fees.
//         </p>
//       </div>
//     ),
//     category: "Fees"
//   },
//   {
//     question: "Is on-campus housing available for students?",
//     answer: (
//       <p>
//         Yes, the university provides on-campus housing for both domestic and international students. 
//         Housing options include dormitories, shared apartments, and family housing. Due to limited 
//         availability, housing is allocated on a first-come, first-served basis with priority given to 
//         international students and those from outside Dhaka. Applications for housing should be submitted 
//         immediately after receiving an admission offer.
//       </p>
//     ),
//     category: "Housing"
//   }
// ]

const Admissions = () => {

  const [stats, setStats] = useState({});
  const [deadlines, setDeadlines] = useState([]);
  const [faqs, setFaqs] = useState([
    {
      question: "What are the minimum academic requirements for undergraduate admission?",
      answer: (
        <p>
          For undergraduate programs, applicants must have completed Higher Secondary Certificate (HSC) 
          or equivalent (A-Level, IB, etc.) with a minimum GPA of 4.5. Additionally, applicants must have 
          a minimum grade of A in Mathematics and B in Physics and English at the HSC level. The combined 
          GPA from SSC and HSC should be at least 9.0.
        </p>
      ),
      category: "Requirements"
    },
    {
      question: "Is there an admission test for undergraduate programs?",
      answer: (
        <p>
          Yes, all eligible applicants for undergraduate programs must take a written admission test 
          covering Mathematics, Physics, and Basic Computer Knowledge. Candidates must score at least 60% 
          in the admission test to be considered for admission. The final selection is based on a combined 
          score of academic results and the admission test.
        </p>
      ),
      category: "Admission Test"
    },
    {
      question: "How can I apply for admission?",
      answer: (
        <div>
          <p>The application process involves the following steps:</p>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>Complete the online application form on our admissions portal</li>
            <li>Pay the application fee</li>
            <li>Upload all required documents</li>
            <li>Submit your application before the deadline</li>
            <li>If eligible, you'll receive an admit card for the admission test</li>
            <li>Take the admission test on the scheduled date</li>
            <li>Check results and follow enrollment instructions if selected</li>
          </ol>
        </div>
      ),
      category: "Application Process"
    },
    {
      question: "What documents are required for the application?",
      answer: (
        <div>
          <p>For undergraduate programs, you need to submit:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Completed application form</li>
            <li>Attested copies of all academic certificates and transcripts</li>
            <li>Four passport-sized photographs</li>
            <li>National ID card or birth certificate</li>
            <li>Application fee payment receipt</li>
          </ul>
          
          <p className="mt-3">For graduate and postgraduate programs, additional documents include:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Statement of purpose</li>
            <li>Letters of recommendation</li>
            <li>CV/Resume</li>
            <li>Research proposal (for PhD applicants)</li>
          </ul>
        </div>
      ),
      category: "Requirements"
    },
    {
      question: "What is the application fee?",
      answer: (
        <div>
          <p>The application fees are as follows:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Undergraduate programs: BDT 1,000</li>
            <li>Graduate programs: BDT 1,500</li>
            <li>Postgraduate programs: BDT 2,000</li>
          </ul>
          <p className="mt-2">Payment can be made online through bKash, Nagad, or bank transfer.</p>
        </div>
      ),
      category: "Fees"
    },
    {
      question: "Are there any scholarships available for international students?",
      answer: (
        <p>
          Yes, the department offers a limited number of scholarships for international students based on 
          academic merit and financial need. These include tuition waivers, monthly stipends, and research 
          grants. International applicants can indicate their interest in scholarships in the application 
          form and will be considered automatically based on their academic profile.
        </p>
      ),
      category: "Scholarships"
    },
    {
      question: "Can I transfer credits from another university?",
      answer: (
        <p>
          Yes, the department accepts transfer credits from recognized universities for equivalent courses. 
          Transfer applicants must have completed at least one year of study at their current institution 
          with a minimum CGPA of 3.0. The transfer credit evaluation committee will assess which credits 
          can be transferred. A maximum of 40% of the total credits required for the degree can be transferred.
        </p>
      ),
      category: "Transfer"
    },
    {
      question: "What English language proficiency tests are accepted?",
      answer: (
        <div>
          <p>We accept the following English language proficiency tests:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>IELTS: Minimum score of 6.5</li>
            <li>TOEFL iBT: Minimum score of 90</li>
            <li>PTE Academic: Minimum score of 63</li>
            <li>Duolingo English Test: Minimum score of 110</li>
          </ul>
          <p className="mt-2">
            Applicants who have completed their previous degree entirely in English may be eligible for a waiver.
          </p>
        </div>
      ),
      category: "Requirements"
    },
    {
      question: "How competitive is the admission process?",
      answer: (
        <p>
          Admission to our programs is highly competitive. For undergraduate programs, we typically receive 
          over 5,000 applications for approximately 120 seats, making the acceptance rate around 2.4%. 
          For graduate programs, the acceptance rate is approximately 15%, and for PhD programs, it's about 10%. 
          Successful applicants generally have outstanding academic records, strong test scores, and demonstrate 
          a clear passion for computer science.
        </p>
      ),
      category: "Admission Process"
    },
    {
      question: "Can I apply for multiple programs simultaneously?",
      answer: (
        <p>
          Yes, you can apply for up to two programs within the department in the same application cycle. 
          However, you will need to pay a separate application fee for each program and indicate your order 
          of preference. If you are accepted to both programs, you will be offered admission to your higher 
          preference only.
        </p>
      ),
      category: "Application Process"
    },
    {
      question: "What are the tuition fees for the programs?",
      answer: (
        <div>
          <p>The tuition fees per semester are approximately:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>BSc programs: BDT 25,000 - 30,000</li>
            <li>MSc programs: BDT 35,000 - 45,000</li>
            <li>PhD programs: BDT 50,000 - 60,000</li>
          </ul>
          <p className="mt-2">
            Additional fees include registration fees, library fees, lab fees, and student activity fees. 
            International students pay approximately 1.5 times the regular tuition fees.
          </p>
        </div>
      ),
      category: "Fees"
    },
    {
      question: "Is on-campus housing available for students?",
      answer: (
        <p>
          Yes, the university provides on-campus housing for both domestic and international students. 
          Housing options include dormitories, shared apartments, and family housing. Due to limited 
          availability, housing is allocated on a first-come, first-served basis with priority given to 
          international students and those from outside Dhaka. Applications for housing should be submitted 
          immediately after receiving an admission offer.
        </p>
      ),
      category: "Housing"
    },
    {
      question: "What is the duration of the programs?",
      answer: (
        <div>
          <p>The standard duration for our programs is:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>BSc in CSE: 4 years (8 semesters)</li>
            <li>BSc in Software Engineering: 4 years (8 semesters)</li>
            <li>MSc programs: 1.5 - 2 years (3-4 semesters)</li>
            <li>PhD programs: 3-5 years</li>
          </ul>
        </div>
      ),
      category: "Programs"
    },
    {
      question: "Are there opportunities for internships during the program?",
      answer: (
        <p>
          Yes, undergraduate students are required to complete a mandatory internship as part of their curriculum. 
          The department has partnerships with leading tech companies and research institutions that offer 
          internship opportunities. Our Career Services office assists students in finding suitable internships 
          and also organizes career fairs twice a year where students can connect with potential employers.
        </p>
      ),
      category: "Programs"
    }
  ]);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await Api.get('api/admissions/stats');
        setStats(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await Api.get('api/admissions/deadlines');
        setDeadlines(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };
    fetchDeadlines();
  }, []);

  // Using hardcoded FAQs instead of fetching from API
  // We can reintroduce the API call once the backend endpoint is ready
  // useEffect(() => {
  //   const fetchFaqs = async () => {
  //     try {
  //       const response = await Api.get('api/admissions/faqs');
  //       setFaqs(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error('Error fetching faqs:', error);
  //     }
  //   };
  //   fetchFaqs();
  // }, []);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AdmissionHero 
        stats={stats} 
        onApplyNowClick={() => setIsApplicationFormOpen(true)} 
      />
      
      <ApplicationProcess />
      
      <RequirementsDeadlines 
        requirements={{}}
        deadlines={deadlines}
      />
      
      <AdmissionFAQs faqs={faqs} />
      
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Apply?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take the first step toward your future in computer science and engineering.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-900 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
              onClick={() => setIsApplicationFormOpen(true)}
            >
              Start Application
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Contact Admissions
            </motion.button>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      <AdmissionApplicationForm 
        isOpen={isApplicationFormOpen} 
        onClose={() => setIsApplicationFormOpen(false)} 
      />
    </motion.div>
  )
}

export default Admissions
