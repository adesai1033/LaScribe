import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PDFViewerProps {
  file: File | null;
}

const PDFViewer = ({ file }: PDFViewerProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Cleanup URL when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No PDF selected</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* PDF Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
        {/* PDF Header */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">PDF Preview</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Page 1 of 1</span>
            <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
              Zoom
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Mock PDF Content - In a real app, you'd use a PDF library like react-pdf */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
            <div className="space-y-4">
              {/* Mock handwritten content */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Mathematical Analysis</h2>
                <p className="text-gray-600 text-sm">Handwritten notes and equations</p>
              </div>
              
              <div className="space-y-6">
                {/* Section 1 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Introduction</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This document contains various mathematical equations and formulas that need to be converted to LaTeX format.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Quadratic Formula</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 mb-2">The quadratic formula is:</p>
                    <div className="text-center text-lg font-mono text-gray-800">
                      x = (-b ± √(b² - 4ac)) / 2a
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Calculus Examples</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-gray-700 text-sm mb-1">Derivative:</p>
                      <div className="text-center font-mono text-gray-800">
                        f'(x) = lim(h→0) [f(x+h) - f(x)] / h
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-gray-700 text-sm mb-1">Integral:</p>
                      <div className="text-center font-mono text-gray-800">
                        ∫ f(x) dx = F(x) + C
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Matrix Operations</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 mb-2">2x2 Matrix:</p>
                    <div className="text-center font-mono text-gray-800">
                      A = [a b; c d]
                    </div>
                    <p className="text-gray-700 mt-3 mb-2">Determinant:</p>
                    <div className="text-center font-mono text-gray-800">
                      det(A) = ad - bc
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm">
              Previous
            </button>
            <span className="px-3 py-1 text-gray-600 text-sm">Page 1 of 1</span>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>{file.name}</span>
          </div>
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer; 