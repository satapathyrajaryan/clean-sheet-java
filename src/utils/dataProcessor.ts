import { DataRow, DataIssue } from '@/components/DataTable';

export class DataProcessor {
  static parseCSV(csvText: string): DataRow[] {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: DataRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: DataRow = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (value === '' || value === undefined) {
          row[header] = null;
        } else {
          // Try to parse as number if possible
          const numValue = Number(value);
          row[header] = isNaN(numValue) ? value : numValue;
        }
      });
      
      data.push(row);
    }

    return data;
  }

  static detectIssues(data: DataRow[]): DataIssue[] {
    const issues: DataIssue[] = [];
    if (data.length === 0) return issues;

    const columns = Object.keys(data[0]);

    // Detect missing values
    data.forEach((row, rowIndex) => {
      columns.forEach(column => {
        if (row[column] === null || row[column] === undefined || row[column] === '') {
          issues.push({
            row: rowIndex,
            column,
            type: 'missing',
            value: row[column]
          });
        }
      });
    });

    // Detect duplicates (simple row-based comparison)
    const seen = new Set<string>();
    data.forEach((row, rowIndex) => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        columns.forEach(column => {
          issues.push({
            row: rowIndex,
            column,
            type: 'duplicate',
            value: row[column]
          });
        });
      } else {
        seen.add(rowString);
      }
    });

    return issues;
  }

  static removeDuplicates(data: DataRow[]): DataRow[] {
    const seen = new Set<string>();
    return data.filter(row => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        return false;
      }
      seen.add(rowString);
      return true;
    });
  }

  static fillMissingValues(data: DataRow[]): DataRow[] {
    if (data.length === 0) return data;

    const columns = Object.keys(data[0]);
    const cleanedData = [...data];

    columns.forEach(column => {
      // Get non-null values for this column
      const nonNullValues = cleanedData
        .map(row => row[column])
        .filter(value => value !== null && value !== undefined && value !== '');

      if (nonNullValues.length === 0) return;

      // Determine fill strategy based on data type
      const sampleValue = nonNullValues[0];
      let fillValue: any;

      if (typeof sampleValue === 'number') {
        // For numbers, use mean
        const sum = nonNullValues
          .filter(val => typeof val === 'number')
          .reduce((acc, val) => acc + (val as number), 0);
        const count = nonNullValues.filter(val => typeof val === 'number').length;
        fillValue = count > 0 ? Math.round((sum / count) * 100) / 100 : 0;
      } else {
        // For strings, use most common value
        const counts = new Map<any, number>();
        nonNullValues.forEach(value => {
          counts.set(value, (counts.get(value) || 0) + 1);
        });
        fillValue = Array.from(counts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      }

      // Fill missing values
      cleanedData.forEach(row => {
        if (row[column] === null || row[column] === undefined || row[column] === '') {
          row[column] = fillValue;
        }
      });
    });

    return cleanedData;
  }

  static exportToCSV(data: DataRow[]): string {
    if (data.length === 0) return '';

    const columns = Object.keys(data[0]);
    const csvContent = [
      // Header row
      columns.join(','),
      // Data rows
      ...data.map(row => 
        columns.map(column => {
          const value = row[column];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return String(value);
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  static downloadCSV(data: DataRow[], filename: string = 'cleaned-data.csv'): void {
    const csvContent = this.exportToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}