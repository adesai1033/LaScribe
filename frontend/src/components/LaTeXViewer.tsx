import { useState } from 'react';
import { motion } from 'framer-motion';

interface LaTeXViewerProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
}

const LaTeXViewer = ({ code, onCodeChange }: LaTeXViewerProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [editableCode, setEditableCode] = useState(code);

  // Update editable code when prop changes
  useState(() => {
    setEditableCode(code);
  });

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
            Download
          </motion.button>
        </div>
      </div>

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
            <div className="p-4 bg-white">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  {/* Mock compiled PDF preview */}
                  <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Mathematical Analysis</h1>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Introduction</h2>
                    <p className="text-gray-700 leading-relaxed">
                      This document contains mathematical equations and formulas converted from handwritten text.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Quadratic Formula</h2>
                    <p className="text-gray-700 mb-2">The quadratic formula is given by:</p>
                    <div className="text-center text-lg font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">
                      x = (-b ± √(b² - 4ac)) / 2a
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Calculus Examples</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-700 mb-1">The derivative of a function f(x) is:</p>
                        <div className="text-center font-mono text-gray-800 bg-gray-50 p-3 rounded border">
                          f'(x) = lim(h→0) [f(x+h) - f(x)] / h
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-1">The integral of f(x) is:</p>
                        <div className="text-center font-mono text-gray-800 bg-gray-50 p-3 rounded border">
                          ∫ f(x) dx = F(x) + C
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Matrix Operations</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-700 mb-1">A 2x2 matrix example:</p>
                        <div className="text-center font-mono text-gray-800 bg-gray-50 p-3 rounded border">
                          A = [a b; c d]
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-1">The determinant is:</p>
                        <div className="text-center font-mono text-gray-800 bg-gray-50 p-3 rounded border">
                          det(A) = ad - bc
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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