import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable, DataRow, DataIssue } from '@/components/DataTable';
import { DataStats } from '@/components/DataStats';
import { CleaningControls } from '@/components/CleaningControls';
import { DataProcessor } from '@/utils/dataProcessor';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Database, Sparkles } from 'lucide-react';

const Index = () => {
  const [originalData, setOriginalData] = useState<DataRow[]>([]);
  const [currentData, setCurrentData] = useState<DataRow[]>([]);
  const [issues, setIssues] = useState<DataIssue[]>([]);
  const [cleanedIssues, setCleanedIssues] = useState<DataIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const [missingValuesFilled, setMissingValuesFilled] = useState(0);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const text = await file.text();
      const parsedData = DataProcessor.parseCSV(text);
      
      if (parsedData.length === 0) {
        toast({
          title: "Error",
          description: "No data found in the file. Please check the file format.",
          variant: "destructive",
        });
        return;
      }

      const detectedIssues = DataProcessor.detectIssues(parsedData);
      
      setOriginalData(parsedData);
      setCurrentData(parsedData);
      setIssues(detectedIssues);
      setCleanedIssues(detectedIssues);
      setDuplicatesRemoved(0);
      setMissingValuesFilled(0);

      toast({
        title: "File uploaded successfully",
        description: `Loaded ${parsedData.length} rows with ${detectedIssues.length} issues detected.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse the file. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDuplicates = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const originalCount = currentData.length;
      const cleanedData = DataProcessor.removeDuplicates(currentData);
      const removed = originalCount - cleanedData.length;
      
      setCurrentData(cleanedData);
      setDuplicatesRemoved(prev => prev + removed);
      
      const newIssues = DataProcessor.detectIssues(cleanedData);
      setCleanedIssues(newIssues);
      
      toast({
        title: "Duplicates removed",
        description: `Removed ${removed} duplicate rows.`,
      });
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleFillMissingValues = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const missingCount = cleanedIssues.filter(issue => issue.type === 'missing').length;
      const cleanedData = DataProcessor.fillMissingValues(currentData);
      
      setCurrentData(cleanedData);
      setMissingValuesFilled(prev => prev + missingCount);
      
      const newIssues = DataProcessor.detectIssues(cleanedData);
      setCleanedIssues(newIssues);
      
      toast({
        title: "Missing values filled",
        description: `Filled ${missingCount} missing values using intelligent defaults.`,
      });
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleDownloadClean = () => {
    DataProcessor.downloadCSV(currentData, 'cleaned-data.csv');
    toast({
      title: "Download started",
      description: "Your cleaned data is being downloaded.",
    });
  };

  const handleReset = () => {
    setCurrentData(originalData);
    setCleanedIssues(issues);
    setDuplicatesRemoved(0);
    setMissingValuesFilled(0);
    
    toast({
      title: "Data reset",
      description: "Reverted to original data.",
    });
  };

  const hasCleanedData = currentData.length > 0 && (duplicatesRemoved > 0 || missingValuesFilled > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Enterprise Data Preprocessor</h1>
              <p className="text-sm text-muted-foreground">
                Clean, validate, and process your business datasets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {currentData.length === 0 ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Transform Your Data</h2>
              <p className="text-lg text-muted-foreground">
                Upload your CSV or Excel files to identify and fix data quality issues automatically
              </p>
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            
            <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/30">
              <h3 className="font-semibold mb-3">What we can do for you:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span>Remove duplicate records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span>Fill missing values intelligently</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span>Validate data consistency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span>Export clean datasets</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <DataTable 
                  data={originalData} 
                  issues={issues} 
                  title="Original Data" 
                />
                {hasCleanedData && (
                  <DataTable 
                    data={currentData} 
                    issues={cleanedIssues} 
                    title="Cleaned Data" 
                  />
                )}
              </div>
              
              <div className="space-y-6">
                <DataStats
                  totalRows={currentData.length}
                  totalColumns={currentData.length > 0 ? Object.keys(currentData[0]).length : 0}
                  issues={cleanedIssues}
                  duplicatesRemoved={duplicatesRemoved}
                  missingValuesFilled={missingValuesFilled}
                />
                
                <CleaningControls
                  issues={cleanedIssues}
                  onRemoveDuplicates={handleRemoveDuplicates}
                  onFillMissingValues={handleFillMissingValues}
                  onDownloadClean={handleDownloadClean}
                  onReset={handleReset}
                  isProcessing={isProcessing}
                  hasCleanedData={hasCleanedData}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;