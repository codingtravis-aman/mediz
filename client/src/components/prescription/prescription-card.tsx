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
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'expired':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="w-full border border-slate-200 shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-slate-900">{prescription.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(prescription.status)}`}>
            {prescription.status}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3 flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Uploaded on {formatDate(prescription.uploadDate)}
        </p>
        
        <div className="flex items-center text-sm space-x-4">
          <div className="flex items-center text-slate-700">
            <FileText className="w-4 h-4 mr-1 text-blue-500" />
            <span className="text-xs">{prescription.medicationsCount} Medications</span>
          </div>
          {prescription.source && (
            <div className="flex items-center text-slate-700">
              <Check className="w-4 h-4 mr-1 text-emerald-500" />
              <span className="text-xs">{prescription.source}</span>
            </div>
          )}
        </div>

        {prescription.language && (
          <div className="mt-3 px-3 py-2 bg-slate-50 rounded border border-slate-100">
            <div className="text-xs flex items-center">
              <span className="font-medium text-slate-700">Language:</span>
              <span className="ml-2 text-slate-600">{prescription.language}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-slate-100 p-2 flex justify-between bg-slate-50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-700 flex items-center hover:bg-blue-50 hover:text-blue-700"
          onClick={() => onView && onView(prescription.id)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-700 flex items-center hover:bg-emerald-50 hover:text-emerald-700"
          onClick={() => onDownload && onDownload(prescription.id)}
        >
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-700 flex items-center hover:bg-violet-50 hover:text-violet-700"
          onClick={() => onShare && onShare(prescription.id)}
        >
          <Share className="h-4 w-4 mr-1" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrescriptionCard;
