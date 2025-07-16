/*
API Schema:
GET /api/student/courses
Response: [
  {
    id: number,
    code: string,
    title: string,
    description: string,
    credits: number,
    semester: number,
    year: number,
    difficulty: string,
    has_syllabus: boolean,
    duration: string,
    rating: number,
    enrolled_students: number,
    prerequisites: string[],
    specialization: string,
    program_name: string
  }
]

GET /api/student/courses/{course_id}/syllabus
Response: PDF file download
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from "lucide-react";
import Api from "@/constant/Api";
import { BaseUrl } from "@/services/BaseUrl";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

// Mock API data for initial development
const mockCourses = [
  {
    id: 1,
    code: "CSE101",
    title: "Introduction to Computer Science",
    description: "Fundamental concepts of computer science including algorithms, programming, and computer organization.",
    credits: 4,
    semester: 1,
    year: 1,
    difficulty: "Beginner",
    has_syllabus: true,
    duration: "16 weeks",
    rating: 4.5,
    enrolled_students: 120,
    prerequisites: [],
    specialization: null,
    program_name: "Bachelor of Science in Computer Science and Engineering"
  },
  {
    id: 2,
    code: "CSE203",
    title: "Data Structures",
    description: "Study of fundamental data structures and algorithms including arrays, linked lists, stacks, queues, trees, and graphs.",
    credits: 4,
    semester: 1,
    year: 2,
    difficulty: "Intermediate",
    has_syllabus: true,
    duration: "16 weeks",
    rating: 4.2,
    enrolled_students: 110,
    prerequisites: ["CSE101", "CSE102"],
    specialization: null,
    program_name: "Bachelor of Science in Computer Science and Engineering"
  },
  {
    id: 3,
    code: "CSE307",
    title: "Operating Systems",
    description: "Principles and design of operating systems, including process management, memory management, file systems, and security.",
    credits: 3,
    semester: 1,
    year: 3,
    difficulty: "Advanced",
    has_syllabus: true,
    duration: "16 weeks",
    rating: 4.0,
    enrolled_students: 95,
    prerequisites: ["CSE203", "CSE205"],
    specialization: null,
    program_name: "Bachelor of Science in Computer Science and Engineering"
  },
  {
    id: 4,
    code: "CSE405",
    title: "Machine Learning",
    description: "Introduction to machine learning concepts and techniques, including supervised and unsupervised learning, neural networks, and deep learning.",
    credits: 3,
    semester: 1,
    year: 4,
    difficulty: "Advanced",
    has_syllabus: true,
    duration: "16 weeks",
    rating: 4.8,
    enrolled_students: 80,
    prerequisites: ["CSE307", "CSE309", "CSE311"],
    specialization: "Artificial Intelligence",
    program_name: "Bachelor of Science in Computer Science and Engineering"
  }
];

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all_years');
  const [semesterFilter, setSemesterFilter] = useState('all_semesters');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const navigate = useNavigate();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Prepare query parameters
        const params = {};
        if (yearFilter !== 'all_years') {
          params.year = parseInt(yearFilter);
        }
        if (semesterFilter !== 'all_semesters') {
          params.semester = parseInt(semesterFilter);
        }
        
        // Make API call to get courses with filters
        const response = await Api.get('/api/student/courses', { params });
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        // Use mock data for development/fallback
        setCourses(mockCourses);
        toast.error('Using mock data due to API error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [yearFilter, semesterFilter]); // Re-fetch when filters change

  // Filter courses based on search term and tab
  // Note: year and semester filtering is now handled by the API
  const filteredCourses = courses.filter(course => {
    // Search filter (search in code, title, description, and specialization)
    const matchesSearch = searchTerm === '' || 
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.specialization && course.specialization?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Tab filter (now just for UI organization)
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'beginner' && course.difficulty === 'Beginner') ||
      (activeTab === 'intermediate' && course.difficulty === 'Intermediate') ||
      (activeTab === 'advanced' && course.difficulty === 'Advanced');
    
    return matchesSearch && matchesTab;
  });

  // Toggle expanded course details
  const toggleCourseExpansion = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  // Download syllabus function
  const downloadSyllabus = async (courseId, courseCode) => {
    try {
      toast.loading(`Downloading ${courseCode} syllabus...`);
      
      // Create a direct link to download the syllabus
      const downloadUrl = `${BaseUrl}/api/student/courses/${courseId}/syllabus`;
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${courseCode}_syllabus.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`${courseCode} syllabus download started`);
    } catch (error) {
      console.error('Error downloading syllabus:', error);
      toast.error('Failed to download syllabus. Please try again later.');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setYearFilter('all_years');
    setSemesterFilter('all_semesters');
    setActiveTab('all');
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_years">All Years</SelectItem>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_semesters">All Semesters</SelectItem>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(searchTerm || yearFilter !== 'all_years' || semesterFilter !== 'all_semesters' || activeTab !== 'all') && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Difficulty tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Levels</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* No results */}
      {!loading && !error && filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">No courses found</p>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {course.title}
                    </CardDescription>
                  </div>
                  <Badge variant={course.difficulty === 'Beginner' ? 'default' : 
                                course.difficulty === 'Intermediate' ? 'secondary' : 
                                'destructive'}>
                    {course.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                
                <div className="flex flex-wrap gap-2 text-sm mb-4">
                  <Badge variant="outline">Year {course.year}</Badge>
                  <Badge variant="outline">Semester {course.semester}</Badge>
                  <Badge variant="outline">{course.credits} Credits</Badge>
                  {course.specialization && (
                    <Badge variant="secondary">{course.specialization}</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.enrolled_students}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-sm text-primary flex items-center"
                  onClick={() => toggleCourseExpansion(course.id)}
                >
                  {expandedCourseId === course.id ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
                
                {expandedCourseId === course.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Prerequisites:</h4>
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{prereq}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {course.program_name && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Program:</h4>
                        <p className="text-sm text-gray-500">{course.program_name}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                {course.has_syllabus ? (
                  <Button 
                    onClick={() => downloadSyllabus(course.id, course.code)}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Syllabus
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    No Syllabus Available
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;
