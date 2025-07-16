import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateProvider';
import { toast } from 'react-hot-toast';
import { 
  ChevronLeft,
  Calendar,
  Upload,
  X,
  Plus
} from 'lucide-react';

const FacultyCreateAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    courseTitle: '',
    semester: '',
    batch: '',
    deadline: '',
    description: '',
    submissionType: 'file',
    status: 'active',
    attachments: []
  });
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock courses data
    const mockCourses = [
      {
        id: 1,
        courseCode: 'CSE-401',
        courseTitle: 'Computer Networks',
        semester: 4,
        batch: '25th',
        section: 'A',
        schedule: 'Sun, Tue 11:00 AM - 12:30 PM',
        room: 'Room 301'
      },
      {
        id: 2,
        courseCode: 'CSE-402',
        courseTitle: 'Computer Architecture',
        semester: 4,
        batch: '25th',
        section: 'A',
        schedule: 'Mon, Wed 9:30 AM - 11:00 AM',
        room: 'Room 302'
      },
      {
        id: 3,
        courseCode: 'CSE-405',
        courseTitle: 'Machine Learning',
        semester: 4,
        batch: '25th',
        section: 'A',
        schedule: 'Wed, Thu 2:00 PM - 3:30 PM',
        room: 'Room 303'
      }
    ];
    
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCourseChange = (e) => {
    const courseCode = e.target.value;
    const selectedCourse = courses.find(course => course.courseCode === courseCode);
    
    if (selectedCourse) {
      setFormData({
        ...formData,
        courseCode: selectedCourse.courseCode,
        courseTitle: selectedCourse.title
      });
    } else {
      setFormData({
        ...formData,
        courseCode: '',
        courseTitle: ''
      });
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      file: file,
      url: URL.createObjectURL(file)
    }));
    
    setAttachmentFiles([...attachmentFiles, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...attachmentFiles];
    updatedAttachments.splice(index, 1);
    setAttachmentFiles(updatedAttachments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.courseCode || !formData.deadline || !formData.description || !formData.submissionType) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real implementation, we would upload attachments first
      // For now, just prepare the attachments data
      const attachmentsData = attachmentFiles.map(attachment => ({
        name: attachment.name,
        url: `/assets/assignments/${attachment.name}` // Mock URL
      }));
      
      // Format the deadline as ISO string
      const deadlineDate = new Date(formData.deadline);
      
      // Prepare the assignment data
      const assignmentData = {
        ...formData,
        deadline: deadlineDate.toISOString(),
        attachments: attachmentsData
      };
      
      // Mock successful assignment creation with ID 5
      const mockResponse = {
        id: 5,
        ...assignmentData,
        facultyName: 'Dr. Anisur Rahman',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submissionCount: 0,
        totalStudents: 45
      };
      
      // Simulate a short delay for realism
      setTimeout(() => {
        toast.success('Assignment created successfully');
        navigate(`/faculty/assignments/1`); // Navigate to first assignment for demo
        setSubmitting(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error creating assignment:', err);
      toast.error('Failed to create assignment');
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/faculty/assignments');
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 text-white hover:text-indigo-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl leading-6 font-bold text-white">Create New Assignment</h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-100">
              Add a new assignment for your students
            </p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Assignment Title *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
                Course *
              </label>
              <div className="mt-1">
                <select
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleCourseChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.courseCode} value={course.courseCode}>
                      {course.courseCode} - {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="deadline"
                  id="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="semester"
                  id="semester"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                Batch
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="batch"
                  id="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Provide detailed instructions for the assignment.
              </p>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="submissionType" className="block text-sm font-medium text-gray-700">
                Submission Type
              </label>
              <div className="mt-1">
                <select
                  id="submissionType"
                  name="submissionType"
                  value={formData.submissionType}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="file">File Upload</option>
                  <option value="link">Link</option>
                  <option value="text">Text</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleAttachmentChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, ZIP up to 10MB
                  </p>
                </div>
              </div>
              
              {attachmentFiles.length > 0 && (
                <ul className="mt-4 border border-gray-200 rounded-md divide-y divide-gray-200">
                  {attachmentFiles.map((attachment, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleGoBack}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyCreateAssignment;
