import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  return (
    <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
      <div
        {...getRootProps()}
        className={`text-center cursor-pointer space-y-4 ${
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center">
          {isLoading ? (
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          ) : (
            <Upload className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? 'Drop your file here' : 'Upload your data file'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>
          <Button variant="outline" disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Supported formats: CSV, XLS, XLSX (Max 10MB)
        </p>
      </div>
    </Card>
  );
};