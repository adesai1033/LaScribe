import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LaTeXViewerProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
}

const LaTeXViewer = ({ code, onCodeChange }: LaTeXViewerProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [editableCode, setEditableCode] = useState(code);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState<string>('');
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string>('');

  // Update editable code when prop changes
  useEffect(() => {
    setEditableCode(code);
  }, [code]);

  // Clean up PDF URL when component unmounts
  useEffect(() => {
    return () => {
      if (compiledPdfUrl) {
        URL.revokeObjectURL(compiledPdfUrl);
      }
    };
  }, [compiledPdfUrl]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditableCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editableCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_latex.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCompilePDF = async () => {
    if (!editableCode.trim()) {
      setCompilationError('No LaTeX code to compile');
      return;
    }

    setIsCompiling(true);
    setCompilationError('');

    try {
      console.log('Compiling LaTeX code...');
      const response = await fetch('http://localhost:5001/api/compile-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: editableCode }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        // Store the PDF for preview
        const blob = await response.blob();
        console.log('PDF blob size:', blob.size);
        const url = URL.createObjectURL(blob);
        
        // Clean up previous PDF URL if it exists
        if (compiledPdfUrl) {
          URL.revokeObjectURL(compiledPdfUrl);
        }
        
        setCompiledPdfUrl(url);
        setCompilationError('');
        
        // Switch to preview tab to show the PDF
        setActiveTab('preview');
      } else {
        const errorData = await response.json();
        console.error('Compilation error:', errorData);
        setCompilationError(errorData.error || 'Compilation failed');
      }
    } catch (error) {
      console.error('Compilation error:', error);
      setCompilationError('Network error. Please check if the backend server is running.');
    } finally {
      setIsCompiling(false);
    }
  };

  // Simple LaTeX syntax highlighting
  const highlightLatex = (text: string) => {
    return text
      .replace(/\\[a-zA-Z]+/g, '<span class="text-blue-400">$&</span>')
      .replace(/\{[^}]*\}/g, '<span class="text-green-400">$&</span>')
      .replace(/\[[^\]]*\]/g, '<span class="text-purple-400">$&</span>')
      .replace(/\$[^$]*\$/g, '<span class="text-yellow-400">$&</span>')
      .replace(/\\\[([^\\]*)\\\]/g, '<span class="text-orange-400">\\[$1\\]</span>')
      .replace(/\\\(([^\\]*)\\\)/g, '<span class="text-orange-400">\\($1\\)</span>');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'code'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Download .tex
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompilePDF}
            disabled={isCompiling || !editableCode.trim()}
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
              isCompiling || !editableCode.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            {isCompiling ? 'Compiling...' : 'Compile PDF'}
          </motion.button>
        </div>
      </div>

      {/* Error Display */}
      {compilationError && (
        <div className="p-3 bg-red-900 border-b border-red-700">
          <div className="flex items-center space-x-2 text-red-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{compilationError}</span>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'code' ? (
          // Code Tab
          editableCode ? (
            <div className="p-4 h-full">
              <div className="h-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="flex h-full">
                  {/* Line Numbers */}
                  <div className="bg-gray-800 text-gray-500 text-sm font-mono p-4 pr-2 border-r border-gray-700 select-none w-12 overflow-hidden">
                    {editableCode.split('\n').map((_, index) => (
                      <div key={index} className="text-right" style={{ lineHeight: '1.5rem' }}>
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  {/* Editable Code */}
                  <div className="flex-1 overflow-auto">
                    <textarea
                      value={editableCode}
                      onChange={handleCodeChange}
                      onScroll={(e) => {
                        const lineNumbers = e.currentTarget.parentElement?.previousElementSibling as HTMLElement;
                        if (lineNumbers) {
                          lineNumbers.scrollTop = e.currentTarget.scrollTop;
                        }
                      }}
                      className="w-full h-full bg-gray-900 text-gray-300 font-mono text-sm leading-relaxed p-4 focus:outline-none focus:ring-0 border-0 resize-none"
                      placeholder="LaTeX code will appear here..."
                      spellCheck={false}
                      style={{ lineHeight: '1.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No LaTeX code generated yet</p>
                <p className="text-sm">Upload a PDF to see the converted LaTeX code here</p>
              </div>
            </div>
          )
        ) : (
          // Preview Tab
          editableCode ? (
            <div className="h-full bg-white">
              {isCompiling ? (
                // Compiling state
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Compiling PDF</h3>
                    <p className="text-gray-600 mb-4">Converting your LaTeX code to PDF...</p>
                    <div className="flex items-center justify-center space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ) : compiledPdfUrl ? (
                // PDF Preview
                <div className="h-full w-full">
                  <iframe
                    src={compiledPdfUrl}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                  />
                </div>
              ) : (
                // Compile prompt
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50">
                  <div className="max-w-md mx-auto text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Compile</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Generate a professional PDF from your LaTeX code
                    </p>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        What you'll get
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Professional PDF
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Math formatting
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Publication quality
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          LaTeX IDE quality
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-lg font-medium">No preview available</p>
                <p className="text-sm">Upload a PDF to see the compiled preview here</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Code Stats */}
      {editableCode && activeTab === 'code' && (
        <div className="p-3 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Lines: {editableCode.split('\n').length}</span>
              <span>Characters: {editableCode.length}</span>
              <span>Words: {editableCode.split(/\s+/).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>LaTeX</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaTeXViewer; 