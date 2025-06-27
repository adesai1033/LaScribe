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

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Mock LaTeX output for demonstration
      setLatexCode(`\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

\\section{Introduction}

This document contains mathematical equations and formulas converted from handwritten text.

\\section{Quadratic Formula}

The quadratic formula is given by:

\\[x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\]

\\section{Calculus Examples}

The derivative of a function $f(x)$ is:

\\[f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}\\]

The integral of $f(x)$ is:

\\[\\int f(x) \\, dx = F(x) + C\\]

\\section{Matrix Operations}

A 2x2 matrix example:

\\[A = \\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}\\]

The determinant is:

\\[\\det(A) = ad - bc\\]

\\end{document}`);
    }, 3000);
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

        {/* Split Screen Layout */}
        {uploadedFile && !isProcessing && (
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