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
    <div className="h-full w-full">
      {previewUrl && (
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title="PDF Preview"
        />
      )}
    </div>
  );
};

export default PDFViewer; 