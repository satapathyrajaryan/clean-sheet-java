import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { DataIssue } from './DataTable';

interface DataStatsProps {
  totalRows: number;
  totalColumns: number;
  issues: DataIssue[];
  duplicatesRemoved?: number;
  missingValuesFilled?: number;
}

export const DataStats: React.FC<DataStatsProps> = ({
  totalRows,
  totalColumns,
  issues,
  duplicatesRemoved = 0,
  missingValuesFilled = 0
}) => {
  const missingCount = issues.filter(issue => issue.type === 'missing').length;
  const duplicateCount = issues.filter(issue => issue.type === 'duplicate').length;
  const invalidCount = issues.filter(issue => issue.type === 'invalid').length;
  const totalIssues = issues.length;
  
  const dataQuality = totalRows > 0 ? Math.max(0, 100 - (totalIssues / (totalRows * totalColumns)) * 100) : 0;

  const stats = [
    {
      label: 'Total Rows',
      value: totalRows.toLocaleString(),
      icon: FileText,
      color: 'text-foreground'
    },
    {
      label: 'Columns',
      value: totalColumns.toString(),
      icon: FileText,
      color: 'text-foreground'
    },
    {
      label: 'Missing Values',
      value: missingCount.toString(),
      icon: AlertTriangle,
      color: 'text-destructive'
    },
    {
      label: 'Duplicates',
      value: duplicateCount.toString(),
      icon: AlertTriangle,
      color: 'text-warning'
    }
  ];

  const cleaningStats = [
    {
      label: 'Duplicates Removed',
      value: duplicatesRemoved.toString(),
      icon: Trash2,
      color: 'text-success'
    },
    {
      label: 'Missing Values Filled',
      value: missingValuesFilled.toString(),
      icon: CheckCircle,
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Quality Score</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Quality</span>
            <Badge variant={dataQuality >= 80 ? 'default' : dataQuality >= 60 ? 'secondary' : 'destructive'}>
              {dataQuality.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={dataQuality} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Based on missing values, duplicates, and data consistency
          </p>
        </div>
      </Card>

      {(duplicatesRemoved > 0 || missingValuesFilled > 0) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cleaning Results</h3>
          <div className="grid grid-cols-2 gap-4">
            {cleaningStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};