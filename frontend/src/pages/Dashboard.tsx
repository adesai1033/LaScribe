import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import PDFUpload from '../components/PDFUpload';
import PDFViewer from '../components/PDFViewer';
import LaTeXViewer from '../components/LaTeXViewer';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [latexCode, setLatexCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5001/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLatexCode(data.latex);
      } else {
        setError(data.error || 'Failed to process PDF');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
      console.error('Error uploading file:', err);
    } finally {
      setIsProcessing(false);
    }
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
      />
      
      {/* Main Content */}
      <div className="pt-16">
        {/* Upload Section */}
        {!uploadedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Convert Your Documents
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload your handwritten PDF and watch it transform into clean LaTeX code in seconds.
              </p>
            </div>
            
            <PDFUpload onFileUpload={handleFileUpload} />
          </motion.div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Your Document
              </h2>
              <p className="text-gray-600">
                Our AI is analyzing your handwritten text and converting it to LaTeX...
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Error
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setLatexCode('');
                  setError('');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Split Screen Layout */}
        {uploadedFile && !isProcessing && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="h-screen flex flex-col lg:flex-row"
          >
            {/* PDF Viewer - Left Side */}
            <div className="w-full lg:w-1/2 bg-white border-r border-gray-200">
              <div className="h-full flex flex-col">
                {/* PDF Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">PDF</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Original Document</h3>
                      <p className="text-sm text-gray-500">{uploadedFile.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setLatexCode('');
                      setError('');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* PDF Content */}
                <div className="flex-1 p-4 overflow-auto">
                  <PDFViewer file={uploadedFile} />
                </div>
              </div>
            </div>

            {/* LaTeX Viewer - Right Side */}
            <div className="w-full lg:w-1/2 bg-gray-900">
              <div className="h-full flex flex-col">
                {/* LaTeX Content */}
                <div className="flex-1 p-4 overflow-auto">
                  <LaTeXViewer 
                    code={latexCode} 
                    onCodeChange={(newCode: string) => setLatexCode(newCode)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 