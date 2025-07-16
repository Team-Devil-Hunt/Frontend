import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Upload, 
  Download,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const FacultyCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [coursePlan, setCoursePlan] = useState([]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [currentClassIndex, setCurrentClassIndex] = useState(null);
  const [newClassData, setNewClassData] = useState({
    title: '',
    date: '',
    topics: '',
    materials: []
  });

  // Mock courses data
  const mockCourses = [
    {
      id: '1',
      courseCode: 'CSE101',
      courseTitle: 'Introduction to Computer Science',
      semester: 1,
      batch: '26th',
      section: 'A',
      schedule: 'Mon, Wed 10:00-11:30 AM',
      room: 'Room 301',
      students: 45,
      credits: 3,
      level: 'Undergraduate',
      description: 'An introductory course covering the basics of computer science, programming concepts, and problem-solving techniques. Students will learn fundamental algorithms and data structures.',
      objectives: [
        'Understand basic programming concepts',
        'Learn problem-solving techniques',
        'Develop algorithmic thinking',
        'Create simple programs in a high-level language'
      ],
      syllabus: 'This course covers programming fundamentals, data types, control structures, functions, arrays, and basic algorithms.'
    },
    {
      id: '2',
      courseCode: 'CSE-402',
      courseTitle: 'Computer Architecture',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Mon, Wed 9:30 AM - 11:00 AM',
      room: 'Room 302',
      students: 40,
      credits: 3,
      level: 'Undergraduate',
      description: 'Study of computer architecture and organization, focusing on CPU design, memory systems, and I/O interfaces.',
      objectives: [
        'Understand computer system architecture',
        'Learn CPU design principles',
        'Study memory hierarchy and cache systems',
        'Explore I/O and storage systems'
      ],
      syllabus: 'The course covers CPU architecture, pipelining, memory systems, cache design, and I/O interfaces.'
    },
    {
      id: '3',
      courseCode: 'CSE-405',
      courseTitle: 'Machine Learning',
      semester: 4,
      batch: '25th',
      section: 'A',
      schedule: 'Wed, Thu 2:00 PM - 3:30 PM',
      room: 'Room 303',
      students: 38,
      credits: 3,
      level: 'Undergraduate',
      description: 'Introduction to machine learning algorithms and applications.',
      objectives: [
        'Understand supervised and unsupervised learning',
        'Implement common ML algorithms',
        'Apply ML techniques to real-world problems',
        'Evaluate model performance'
      ],
      syllabus: 'This course covers regression, classification, clustering, neural networks, and deep learning fundamentals.'
    }
  ];

  // Mock course plan data (class-by-class schedule)
  const mockCoursePlans = {
    '1': [
      {
        id: '1',
        title: 'Introduction to Programming',
        date: '2025-08-01',
        topics: 'Course overview, introduction to programming concepts, setting up development environment',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/intro.pdf' },
          { name: 'Environment Setup Guide', url: '/assets/docs/setup.pdf' }
        ]
      },
      {
        id: '2',
        title: 'Variables and Data Types',
        date: '2025-08-03',
        topics: 'Variables, primitive data types, operators, expressions',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/variables.pdf' },
          { name: 'Practice Problems', url: '/assets/docs/practice1.pdf' }
        ]
      },
      {
        id: '3',
        title: 'Control Structures',
        date: '2025-08-08',
        topics: 'Conditional statements, loops, branching',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/control.pdf' }
        ]
      },
      {
        id: '4',
        title: 'Functions and Methods',
        date: '2025-08-10',
        topics: 'Function definition, parameters, return values, scope',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/functions.pdf' },
          { name: 'Assignment 1', url: '/assets/assignments/assignment1.pdf' }
        ]
      }
    ],
    '2': [
      {
        id: '1',
        title: 'Introduction to Computer Architecture',
        date: '2025-08-02',
        topics: 'Course overview, history of computing, von Neumann architecture',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/arch_intro.pdf' }
        ]
      },
      {
        id: '2',
        title: 'Digital Logic Design',
        date: '2025-08-04',
        topics: 'Boolean algebra, logic gates, combinational circuits',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/digital_logic.pdf' },
          { name: 'Lab Manual', url: '/assets/docs/lab1.pdf' }
        ]
      }
    ],
    '3': [
      {
        id: '1',
        title: 'Introduction to Machine Learning',
        date: '2025-08-01',
        topics: 'Overview of ML, supervised vs. unsupervised learning, applications',
        materials: [
          { name: 'Lecture Slides', url: '/assets/slides/ml_intro.pdf' }
        ]
      }
    ]
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        
        // Find course from mock data
        const foundCourse = mockCourses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          toast.error('Course not found');
          navigate('/faculty/courses');
          return;
        }
        
        setCourse(foundCourse);
        
        // Get course plan
        const plan = mockCoursePlans[courseId] || [];
        setCoursePlan(plan);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load course data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, navigate]);

  const handleBack = () => {
    navigate('/faculty/courses');
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleAddClass = () => {
    setNewClassData({
      title: '',
      date: '',
      topics: '',
      materials: []
    });
    setShowAddClassModal(true);
  };

  const handleEditClass = (index) => {
    const classToEdit = coursePlan[index];
    setNewClassData({
      title: classToEdit.title,
      date: classToEdit.date,
      topics: classToEdit.topics,
      materials: [...classToEdit.materials]
    });
    setCurrentClassIndex(index);
    setShowEditClassModal(true);
  };

  const handleDeleteClass = (index) => {
    const updatedPlan = [...coursePlan];
    updatedPlan.splice(index, 1);
    setCoursePlan(updatedPlan);
    toast.success('Class deleted successfully');
  };

  const handleAddMaterial = () => {
    setNewClassData(prev => ({
      ...prev,
      materials: [...prev.materials, { name: '', url: '' }]
    }));
  };

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = [...newClassData.materials];
    updatedMaterials.splice(index, 1);
    setNewClassData(prev => ({
      ...prev,
      materials: updatedMaterials
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...newClassData.materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value
    };
    setNewClassData(prev => ({
      ...prev,
      materials: updatedMaterials
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClassData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClass = () => {
    // Validate inputs
    if (!newClassData.title || !newClassData.date || !newClassData.topics) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create new class object
    const newClass = {
      id: Date.now().toString(),
      ...newClassData
    };

    // Add to course plan
    const updatedPlan = [...coursePlan, newClass];
    
    // Sort by date
    updatedPlan.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setCoursePlan(updatedPlan);
    setShowAddClassModal(false);
    toast.success('Class added successfully');
  };

  const handleUpdateClass = () => {
    // Validate inputs
    if (!newClassData.title || !newClassData.date || !newClassData.topics) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Update class
    const updatedPlan = [...coursePlan];
    updatedPlan[currentClassIndex] = {
      ...updatedPlan[currentClassIndex],
      title: newClassData.title,
      date: newClassData.date,
      topics: newClassData.topics,
      materials: newClassData.materials
    };
    
    // Sort by date
    updatedPlan.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setCoursePlan(updatedPlan);
    setShowEditClassModal(false);
    toast.success('Class updated successfully');
  };

  const handleAttendance = () => {
    navigate(`/faculty/students`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to Courses
      </button>
      
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <BookOpen size={24} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{course.courseCode}</h1>
              <p className="text-gray-600">{course.courseTitle}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAttendance}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Manage Attendance
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Course Information</h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-2" /> {course.students} Students
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" /> {course.semester} Semester, {course.batch} Batch
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2" /> {course.schedule}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" /> {course.room}
              </div>
              <div className="mt-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">{course.level}</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{course.credits} Credits</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Course Description</h2>
            <p className="text-gray-600">{course.description}</p>
            
            <h3 className="text-md font-semibold mt-4 mb-2">Course Objectives</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {course.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Course Plan */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Course Plan</h2>
          <button
            onClick={handleAddClass}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" /> Add Class
          </button>
        </div>
        
        {coursePlan.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No classes planned yet. Click "Add Class" to start creating your course plan.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {coursePlan.map((classItem, index) => (
              <div key={classItem.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-lg font-medium">{classItem.title}</h3>
                    <p className="text-sm text-blue-600">{formatDate(classItem.date)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClass(index)}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(index)}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Topics:</h4>
                  <p className="text-sm text-gray-600">{classItem.topics}</p>
                </div>
                
                {classItem.materials.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Materials:</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {classItem.materials.map((material, idx) => (
                        <a 
                          key={idx} 
                          href={material.url} 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          <FileText size={12} className="mr-1" />
                          {material.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Class</h2>
              <button 
                onClick={() => setShowAddClassModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Title</label>
                <input
                  type="text"
                  name="title"
                  value={newClassData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Introduction to Variables"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newClassData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
                <textarea
                  name="topics"
                  value={newClassData.topics}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the topics to be covered in this class"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials</label>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Plus size={14} className="mr-1" /> Add Material
                  </button>
                </div>
                
                {newClassData.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Material name"
                    />
                    <input
                      type="text"
                      value={material.url}
                      onChange={(e) => handleMaterialChange(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="p-1.5 text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => setShowAddClassModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClass}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Class
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Class Modal */}
      {showEditClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Class</h2>
              <button 
                onClick={() => setShowEditClassModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Title</label>
                <input
                  type="text"
                  name="title"
                  value={newClassData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Introduction to Variables"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newClassData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
                <textarea
                  name="topics"
                  value={newClassData.topics}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the topics to be covered in this class"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials</label>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Plus size={14} className="mr-1" /> Add Material
                  </button>
                </div>
                
                {newClassData.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Material name"
                    />
                    <input
                      type="text"
                      value={material.url}
                      onChange={(e) => handleMaterialChange(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="p-1.5 text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => setShowEditClassModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateClass}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCourseDetails;
