import { FC, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Check, Clock, Calendar, ChevronLeft } from 'lucide-react';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { getMedication, getMedicationLogs, createMedicationLog, getMedicineInfo } from '@/lib/api';
import { formatDistanceToNow, format } from 'date-fns';

const MedicationDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [showError, setShowError] = useState(false);
  
  // Fetch medication details
  const { data: medication, isLoading: isLoadingMedication } = useQuery({
    queryKey: [`/api/medications/${id}`],
  });
  
  // Fetch medication logs
  const { data: medicationLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: [`/api/medications/${id}/logs`],
    enabled: !!id,
  });
  
  // Fetch medicine info
  const { data: medicineInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: [`/api/medicine-info/${medication?.name}`],
    enabled: !!medication?.name,
    onError: () => setShowError(true)
  });
  
  // Create medication log mutation
  const createLogMutation = useMutation({
    mutationFn: (status: string) => createMedicationLog(Number(id), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/medications/${id}/logs`] });
    },
  });
  
  const handleMarkTaken = () => {
    createLogMutation.mutate('taken');
  };
  
  const handleGoBack = () => {
    navigate('/medications');
  };
  
  if (isLoadingMedication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 p-4">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  if (!medication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 p-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Medication Not Found</h2>
          <p className="text-gray-500 mb-4">The medication you're looking for doesn't exist.</p>
          <Button onClick={handleGoBack}>Back to Medications</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-10 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold ml-2">Medication Details</h1>
      </div>
      
      <div className="pt-14 pb-4">
        <div className="p-4">
          {/* Medication Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{medication.name}</h2>
                <p className="text-gray-500 text-sm">{medicineInfo?.category || medication.medicationType || 'Medication'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                medication.status === 'active' ? 'bg-green-100 text-green-700' :
                medication.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {medication.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Dosage</p>
                <p className="font-medium">{medication.dosage}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Frequency</p>
                <p className="font-medium">{medication.frequency}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium">{medication.duration || 'As prescribed'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="font-medium">
                  {medication.startDate ? format(new Date(medication.startDate), 'dd MMM yyyy') : 'Not set'}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              <h3 className="font-medium mb-3">Reminder Settings</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="text-gray-500 h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">2:00 PM</p>
                    <p className="text-xs text-gray-500">Daily reminder</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="refill" defaultChecked />
                  <label htmlFor="refill" className="text-sm">Refill reminders</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="missed" defaultChecked />
                  <label htmlFor="missed" className="text-sm">Missed dose alerts</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Medication Information */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-semibold mb-4">Medication Information</h3>
            
            {isLoadingInfo ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : medicineInfo ? (
              <div className="space-y-4">
                {medicineInfo.uses && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Uses</h4>
                    <p className="text-sm text-gray-600">{medicineInfo.uses}</p>
                  </div>
                )}
                
                {medicineInfo.sideEffects && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Side Effects</h4>
                    <p className="text-sm text-gray-600">{medicineInfo.sideEffects}</p>
                  </div>
                )}
                
                {medicineInfo.dosageInstructions && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Special Instructions</h4>
                    <p className="text-sm text-gray-600">{medicineInfo.dosageInstructions}</p>
                  </div>
                )}
                
                {medicineInfo.precautions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex">
                      <svg className="h-4 w-4 text-yellow-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div>
                        <h4 className="font-medium text-sm text-yellow-700">Precautions</h4>
                        <p className="text-xs text-yellow-700 mt-1">{medicineInfo.precautions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : showError ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Information not available</p>
              </div>
            ) : null}
          </div>
          
          {/* Medication History */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Medication History</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkTaken}
                disabled={createLogMutation.isPending}
              >
                Mark as Taken
              </Button>
            </div>
            
            {isLoadingLogs ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : medicationLogs && medicationLogs.length > 0 ? (
              <div className="space-y-3">
                {medicationLogs.map((log) => (
                  <div key={log.id} className="flex items-center border-b border-gray-100 pb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${log.status === 'taken' ? 'bg-green-100' : 
                        log.status === 'skipped' ? 'bg-amber-100' : 'bg-red-100'}`
                    }>
                      {log.status === 'taken' ? (
                        <Check className={`h-4 w-4 ${log.status === 'taken' ? 'text-green-600' : 
                          log.status === 'skipped' ? 'text-amber-600' : 'text-red-600'}`} />
                      ) : (
                        <svg className={`h-4 w-4 ${log.status === 'skipped' ? 'text-amber-600' : 'text-red-600'}`} 
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">{log.status}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(log.logDate), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No medication history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;
