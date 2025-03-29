import { FC } from 'react';
import { Eye, Download, Share, FileText, Calendar, Check } from 'lucide-react';
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

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'bg-[var(--success)] text-white';
      case 'pending':
        return 'bg-[var(--warning)] text-white';
      case 'expired':
        return 'bg-[var(--red-alert)] text-white';
      default:
        return 'bg-[var(--info)] text-white';
    }
  };

  return (
    <Card className="w-full card-hover border-t-4 border-t-[var(--blue-primary)]">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[var(--text-dark)]">{prescription.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(prescription.status)}`}>
            {prescription.status}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3 flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1 text-[var(--blue-primary)]" />
          Uploaded on {formatDate(prescription.uploadDate)}
        </p>
        
        <div className="flex items-center text-sm space-x-4">
          <div className="flex items-center text-[var(--text-dark)]">
            <FileText className="w-4 h-4 mr-1 text-[var(--green-primary)]" />
            <span>{prescription.medicationsCount} Medications</span>
          </div>
          {prescription.source && (
            <div className="flex items-center text-[var(--text-dark)]">
              <Check className="w-4 h-4 mr-1 text-[var(--teal-secondary)]" />
              <span>{prescription.source}</span>
            </div>
          )}
        </div>

        {prescription.language && (
          <div className="mt-3 px-3 py-2 bg-[var(--bg-light)] rounded-md">
            <div className="text-xs flex items-center">
              <span className="font-medium text-[var(--blue-primary)]">Language:</span>
              <span className="ml-2">{prescription.language}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 p-3 flex justify-between bg-[var(--bg-light)]">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[var(--blue-primary)] flex items-center hover:bg-[var(--blue-primary)] hover:text-white"
          onClick={() => onView && onView(prescription.id)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[var(--green-primary)] flex items-center hover:bg-[var(--green-primary)] hover:text-white"
          onClick={() => onDownload && onDownload(prescription.id)}
        >
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[var(--teal-secondary)] flex items-center hover:bg-[var(--teal-secondary)] hover:text-white"
          onClick={() => onShare && onShare(prescription.id)}
        >
          <Share className="h-4 w-4 mr-1" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrescriptionCard;
