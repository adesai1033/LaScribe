import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';

interface Project {
  id: string;
  name: string;
  filename: string;
  latex_code: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedProject(null);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('dashboard');
  };

  const handleViewProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        currentView === 'dashboard' ? (
          <Dashboard 
            onLogout={handleLogout} 
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
            onViewProjects={handleViewProjects}
          />
        ) : (
          <Projects 
            onLogout={handleLogout}
            onProjectSelect={handleProjectSelect}
            onViewDashboard={handleViewDashboard}
          />
        )
      ) : (
        <LandingPage onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;
