import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, CheckCircle, Download, RotateCcw } from 'lucide-react';
import { DataIssue } from './DataTable';

interface CleaningControlsProps {
  issues: DataIssue[];
  onRemoveDuplicates: () => void;
  onFillMissingValues: () => void;
  onDownloadClean: () => void;
  onReset: () => void;
  isProcessing?: boolean;
  hasCleanedData?: boolean;
}

export const CleaningControls: React.FC<CleaningControlsProps> = ({
  issues,
  onRemoveDuplicates,
  onFillMissingValues,
  onDownloadClean,
  onReset,
  isProcessing = false,
  hasCleanedData = false
}) => {
  const missingCount = issues.filter(issue => issue.type === 'missing').length;
  const duplicateCount = issues.filter(issue => issue.type === 'duplicate').length;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Data Cleaning Operations</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-destructive" />
            <span className="font-medium">Remove Duplicates</span>
            <Badge variant="outline" className="text-xs">
              {duplicateCount} found
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveDuplicates}
            disabled={duplicateCount === 0 || isProcessing}
          >
            Remove
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="font-medium">Fill Missing Values</span>
            <Badge variant="outline" className="text-xs">
              {missingCount} found
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onFillMissingValues}
            disabled={missingCount === 0 || isProcessing}
          >
            Fill
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-primary" />
            <span className="font-medium">Download Clean Data</span>
          </div>
          <Button
            size="sm"
            onClick={onDownloadClean}
            disabled={!hasCleanedData || isProcessing}
          >
            Download CSV
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Reset to Original</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasCleanedData || isProcessing}
          >
            Reset
          </Button>
        </div>
      </div>

      {isProcessing && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm">Processing data...</span>
          </div>
        </div>
      )}
    </Card>
  );
};