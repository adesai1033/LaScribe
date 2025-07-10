import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

interface Project {
  id: string;
  name: string;
  filename: string;
  latex_code: string;
  created_at: string;
  updated_at: string;
}

interface ProjectsProps {
  onLogout?: () => void;
  onProjectSelect?: (project: Project) => void;
  onViewDashboard?: () => void;
}

const Projects = ({ onLogout, onProjectSelect, onViewDashboard }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/projects');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setProjects(data.projects);
      } else {
        setError(data.error || 'Failed to load projects');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete project');
      }
    } catch (err) {
      setError('Network error while deleting project');
      console.error('Error deleting project:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar 
        onLoginClick={() => {}} 
        onRegisterClick={() => {}}
        isAuthenticated={true}
        onLogout={handleLogout}
        onViewProjects={onViewDashboard}
      />
      
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access and manage all your LaTeX conversion projects
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loading Projects
              </h2>
              <p className="text-gray-600">
                Fetching your saved projects...
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error Loading Projects
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadProjects}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Projects Yet</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Upload your first PDF to create a project
                  </p>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    Upload PDF
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {project.filename}
                            </p>
                            <p className="text-xs text-gray-400">
                              Created: {formatDate(project.created_at)}
                            </p>
                            {project.updated_at !== project.created_at && (
                              <p className="text-xs text-gray-400">
                                Updated: {formatDate(project.updated_at)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete project"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => onProjectSelect?.(project)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Open Project
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects; 