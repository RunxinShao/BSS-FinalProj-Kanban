
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as localStorageService from '@/services/localStorage';

const DataControls: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExportData = () => {
    try {
      const exportData = localStorageService.exportUserData();
      
      // Create a blob from the JSON data
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `kanban-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        const success = localStorageService.importUserData(content);
        
        if (success) {
          toast.success('Data imported successfully. Refresh the page to see changes.');
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          toast.error('Failed to import data');
        }
      } catch (error) {
        toast.error('Invalid data format');
        console.error(error);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExportData}
        className="flex items-center gap-1"
      >
        <Download size={16} />
        <span>Export</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleImportClick}
        className="flex items-center gap-1"
      >
        <Upload size={16} />
        <span>Import</span>
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default DataControls;
