import { FC, useState } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PrescriptionUploader from '@/components/prescription/prescription-uploader';
import OcrPreview from '@/components/prescription/ocr-preview';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { processImage } from '@/lib/ocr';
import { createPrescription, createMedication, DEMO_USER_ID } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { OcrResult } from '@/lib/types';

const ScanPrescription: FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [language, setLanguage] = useState('eng');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setOcrResult(null);
    
    try {
      const result = await processImage(file, language);
      setOcrResult(result);
    } catch (error) {
      toast({
        title: 'OCR Processing Failed',
        description: 'We could not process your prescription. Please try again with a clearer image.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToMedications = async () => {
    if (!ocrResult || !uploadedFile) return;
    
    try {
      // Create a new prescription record
      const prescription = await createPrescription({
        userId: DEMO_USER_ID,
        title: `Prescription from ${new Date().toLocaleDateString()}`,
        originalImage: URL.createObjectURL(uploadedFile),
        translatedText: ocrResult.text,
        language: language === 'eng' ? 'english' : 'hindi',
      });
      
      // Add each detected medication to the database
      if (ocrResult.medications && ocrResult.medications.length > 0) {
        for (const med of ocrResult.medications) {
          await createMedication({
            userId: DEMO_USER_ID,
            prescriptionId: prescription.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.instructions,
            medicationType: 'tablet',
            startDate: new Date().toISOString(),
          });
        }
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      
      toast({
        title: 'Prescription Processed Successfully',
        description: 'Medications have been added to your list.',
      });
      
      // Navigate to medications page
      navigate('/medications');
    } catch (error) {
      toast({
        title: 'Failed to Save Prescription',
        description: 'There was an error saving your prescription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (!ocrResult) return;
    
    // Create a text file with the OCR results
    const element = document.createElement('a');
    const file = new Blob([ocrResult.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `prescription_${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen relative pb-16">
      <Header />
      
      <div className="pt-16 pb-2 bg-gray-50 min-h-screen">
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="text-xl font-semibold mb-4">Scan Prescription</h2>
            <p className="text-gray-500 text-sm mb-5">
              Upload your prescription for translation and medication tracking
            </p>
            
            <PrescriptionUploader onUpload={handleUpload} isProcessing={isProcessing} />
            
            <div className="mt-5">
              <h4 className="font-medium mb-2">Language Preference</h4>
              <RadioGroup 
                value={language} 
                onValueChange={setLanguage}
                className="grid grid-cols-2 gap-3 mb-4"
              >
                <div>
                  <RadioGroupItem 
                    value="eng" 
                    id="eng" 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="eng"
                    className="flex flex-col items-center justify-between rounded-lg border border-primary-600 bg-primary-50 p-2 hover:bg-primary-100 peer-data-[state=checked]:border-primary-700 peer-data-[state=checked]:bg-primary-100 cursor-pointer"
                  >
                    English
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="hin" 
                    id="hin" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="hin"
                    className="flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 peer-data-[state=checked]:border-primary-700 peer-data-[state=checked]:bg-primary-100 cursor-pointer"
                  >
                    Hindi
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-500 h-4 w-4 mt-0.5 mr-2" />
                  <p className="text-xs text-blue-700">
                    For best results, ensure the prescription is clearly visible and taken in good lighting
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* OCR Results */}
          {isProcessing && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold mb-4">Processing...</h3>
              <div className="flex justify-center items-center py-10">
                <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          
          {ocrResult && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold mb-4">Preview</h3>
              <OcrPreview
                result={ocrResult}
                onAddToMedications={handleAddToMedications}
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ScanPrescription;
