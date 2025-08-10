import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export interface DataRow {
  [key: string]: string | number | null;
}

export interface DataIssue {
  row: number;
  column: string;
  type: 'missing' | 'duplicate' | 'invalid';
  value: any;
}

interface DataTableProps {
  data: DataRow[];
  issues: DataIssue[];
  title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, issues, title }) => {
  if (data.length === 0) return null;

  const columns = Object.keys(data[0]);
  const maxRows = Math.min(data.length, 50); // Show first 50 rows for performance

  const getIssueForCell = (rowIndex: number, column: string) => {
    return issues.find(issue => issue.row === rowIndex && issue.column === column);
  };

  const getCellClassName = (issue?: DataIssue) => {
    if (!issue) return 'px-3 py-2 text-sm';
    
    switch (issue.type) {
      case 'missing':
        return 'px-3 py-2 text-sm bg-destructive/10 text-destructive';
      case 'duplicate':
        return 'px-3 py-2 text-sm bg-warning/10 text-warning-foreground';
      case 'invalid':
        return 'px-3 py-2 text-sm bg-accent/10 text-accent-foreground';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const renderValue = (value: any, issue?: DataIssue) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">empty</span>;
    }
    return String(value);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {data.length} rows
          </Badge>
          <Badge variant="outline" className="text-xs">
            {columns.length} columns
          </Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.slice(0, maxRows).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/30">
                <td className="px-3 py-2 text-sm text-muted-foreground">
                  {rowIndex + 1}
                </td>
                {columns.map((column) => {
                  const issue = getIssueForCell(rowIndex, column);
                  return (
                    <td
                      key={column}
                      className={getCellClassName(issue)}
                    >
                      <div className="flex items-center gap-2">
                        {renderValue(row[column], issue)}
                        {issue && (
                          <div title={`${issue.type} value`}>
                            {issue.type === 'missing' && <XCircle className="h-3 w-3 text-destructive" />}
                            {issue.type === 'duplicate' && <AlertTriangle className="h-3 w-3 text-warning" />}
                            {issue.type === 'invalid' && <AlertTriangle className="h-3 w-3 text-accent" />}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > maxRows && (
        <p className="text-sm text-muted-foreground mt-3 text-center">
          Showing first {maxRows} of {data.length} rows
        </p>
      )}
    </Card>
  );
};