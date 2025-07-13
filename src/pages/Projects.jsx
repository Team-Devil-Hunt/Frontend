/*
 * API Schema for Projects:
 * GET /api/projects
 * Response: {
 *   projects: [
 *     {
 *       id: string,
 *       title: string,
 *       summary: string,
 *       abstract: string,
 *       supervisor: string,
 *       year: number,
 *       category: 'machine_learning' | 'web_development' | 'mobile_app' | 'algorithms' | 'iot' | 'security' | 'robotics' | 'graphics',
 *       type: 'student' | 'faculty',
 *       tags: string[],
 *       team?: { name: string, role?: string }[],
 *       course?: string,
 *       teamSize?: number,
 *       completionDate: string,
 *       technologies?: string[],
 *       keyFeatures?: string[],
 *       achievements?: string[],
 *       demoLink?: string,
 *       githubLink?: string,
 *       paperLink?: string,
 *       contactEmail?: string
 *     }
 *   ]
 * }
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectDetails from '@/components/projects/ProjectDetails';
import axios from 'axios';
import { BaseUrl } from '@/services/BaseUrl';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    years: [],
    categories: [],
    supervisors: [],
    type: ''
  });
  const [projects, setProjects] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    years: [],
    categories: [],
    supervisors: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching projects from:', `${BaseUrl}/api/projects`);
        const response = await axios.get(`${BaseUrl}/api/projects`);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.projects) {
          setProjects(response.data.projects);
          console.log('Projects set:', response.data.projects);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Received invalid data format from server');
        }
        
        if (response.data && response.data.filters) {
          // Ensure filter options are properly formatted
          const filters = response.data.filters;
          console.log('Raw filter options from API:', filters);
          
          // Convert any numeric years to strings for consistent handling
          const formattedFilters = {
            years: filters.years ? filters.years.map(year => String(year)) : [],
            categories: filters.categories || [],
            supervisors: filters.supervisors || []
          };
          
          console.log('Formatted filter options:', formattedFilters);
          setFilterOptions(formattedFilters);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Memoize filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search term filter
      if (
        searchTerm &&
        !project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.summary.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(project.tags && project.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      ) {
        return false;
      }

      // Year filter
      if (filters.years.length > 0 && !filters.years.includes(project.year)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(project.category)) {
        return false;
      }

      // Supervisor filter
      if (filters.supervisors.length > 0) {
        // Handle both object supervisors and string supervisors
        const supervisorMatches = filters.supervisors.some(sup => {
          if (typeof sup === 'object' && sup !== null) {
            return sup.id === project.supervisor_id;
          } else {
            return sup === project.supervisor_id || sup === project.supervisor;
          }
        });
        
        if (!supervisorMatches) {
          return false;
        }
      }

      // Type filter (student/faculty)
      if (filters.type && project.type !== filters.type) {
        return false;
      }

      return true;
    });
  }, [searchTerm, filters, projects]);

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Explore innovative projects by our students and faculty members.
        </p>
      </div>

      {/* Search Bar - Centered */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Filters - Below Search */}
      {!loading && !error && (
        <div className="mb-8">
          <ProjectFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableFilters={filterOptions}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-slate-50 p-8 rounded-lg max-w-md shadow-sm border border-slate-100">
            <h3 className="text-xl font-semibold mb-3">No Projects Found</h3>
            <p className="text-muted-foreground mb-2">
              No projects match your current filters. Try adjusting your search criteria.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  years: [],
                  categories: [],
                  supervisors: [],
                  type: ''
                });
              }}
              className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Project Grid */}
      {!loading && !error && filteredProjects.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  )
}

export default Projects
