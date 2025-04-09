import { FC, useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionUploaderProps {
  onUpload: (file: File) => void;
  isProcessing?: boolean;
}

const PrescriptionUploader: FC<PrescriptionUploaderProps> = ({ onUpload, isProcessing = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image (.jpg, .png, .gif) or PDF file.',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive'
      });
      return;
    }
    
    onUpload(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`upload-area rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed ${
        isDragging ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Camera className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="font-medium text-center mb-1">Take a photo or upload</h3>
      <p className="text-xs text-gray-500 text-center mb-4">
        Support .jpg, .png, .pdf up to 10MB
      </p>
      <Button 
        variant="default" 
        className="bg-primary-600 hover:bg-primary-700"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Choose File'}
      </Button>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,application/pdf"
        disabled={isProcessing}
      />
    </div>
  );
};

export default PrescriptionUploader;
