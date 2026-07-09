'use client';
import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onParsedData: (data: any[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onParsedData }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const processFile = (file: File) => {
    // Basic format safeguard verification
    if (!file.name.endsWith('.csv')) {
      alert("Please upload a valid CSV file format.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onParsedData(results.data);
      },
      error: (error) => {
        alert("Parsing configuration structure standard error: " + error.message);
      }
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border border-dashed rounded-xl p-10 text-center transition-all min-h-[180px] flex flex-col items-center justify-center ${
        isDragActive 
          ? 'border-[#10705B] bg-[#10705B]/5 scale-[0.99]' 
          : 'border-[#A0AEC0] bg-transparent hover:border-gray-400'
      }`}
    >
      <input 
        type="file" 
        accept=".csv" 
        id="csv-upload" 
        className="hidden" 
        onChange={handleFileInput} 
      />
      <label 
        htmlFor="csv-upload" 
        className="cursor-pointer flex flex-col items-center gap-3 w-full h-full"
      >
        <div className="p-3 bg-[#E6F4F1] text-[#10705B] rounded-full">
          <Upload className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <p className="text-base font-semibold text-[#2D3748]">
            Drop a CSV here or <span className="text-[#10705B] underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-gray-400 font-medium">
            AI extraction starts only after confirmation
          </p>
        </div>
      </label>
    </div>
  );
};