import { FC } from 'react';
import { Eye, Download, Share } from 'lucide-react';
import { Prescription } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PrescriptionCardProps {
  prescription: Prescription;
  onView?: (id: number) => void;
  onDownload?: (id: number) => void;
  onShare?: (id: number) => void;
}

const PrescriptionCard: FC<PrescriptionCardProps> = ({ 
  prescription,
  onView,
  onDownload,
  onShare
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">{prescription.title}</h3>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {prescription.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Uploaded on {formatDate(prescription.uploadDate)}
        </p>
        
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
              <path d="M12 11V3"></path>
              <path d="M10 7H8"></path>
              <path d="M16 7h-2"></path>
              <path d="M5 11a7 7 0 0 1 14 0"></path>
            </svg>
            <span>{prescription.medicationsCount} Medications</span>
          </div>
          {prescription.source && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M8 4v16"></path>
                <path d="M16 4v16"></path>
              </svg>
              <span>{prescription.source}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 p-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-600 flex items-center"
          onClick={() => onView && onView(prescription.id)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 flex items-center"
          onClick={() => onDownload && onDownload(prescription.id)}
        >
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 flex items-center"
          onClick={() => onShare && onShare(prescription.id)}
        >
          <Share className="h-4 w-4 mr-1" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrescriptionCard;
