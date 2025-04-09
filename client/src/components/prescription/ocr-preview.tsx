import { FC } from 'react';
import { Download } from 'lucide-react';
import { OcrResult } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface OcrPreviewProps {
  result: OcrResult;
  onAddToMedications: () => void;
  onDownload: () => void;
}

const OcrPreview: FC<OcrPreviewProps> = ({ result, onAddToMedications, onDownload }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Translated Prescription</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
      </div>
      
      {result.patientInfo && Object.keys(result.patientInfo).length > 0 && (
        <div className="border-b border-gray-100 pb-3 mb-3">
          <h4 className="text-sm font-medium">Patient Information</h4>
          <p className="text-xs text-gray-500 mt-1">
            {result.patientInfo.name && <>Name: {result.patientInfo.name}<br /></>}
            {result.patientInfo.age && <>Age: {result.patientInfo.age} years<br /></>}
            {result.patientInfo.date && <>Date: {result.patientInfo.date}</>}
          </p>
        </div>
      )}
      
      {result.medications && result.medications.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium">Medications</h4>
          <ul className="text-xs text-gray-500 mt-1 space-y-2">
            {result.medications.map((med, index) => (
              <li key={index}>
                {med.name} {med.dosage} - {med.instructions}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4 className="text-sm font-medium">Raw Text</h4>
          <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
            {result.text}
          </p>
        </div>
      )}
      
      <div className="mt-4 flex">
        <Button 
          className="flex-1 mr-2" 
          onClick={onAddToMedications}
        >
          Add to Medications
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default OcrPreview;
