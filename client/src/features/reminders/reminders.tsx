import { FC, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import BottomNavigation from '@/components/ui/bottom-navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getMedications, createMedicationLog } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Pill } from 'lucide-react';

const Reminders: FC = () => {
  const queryClient = useQueryClient();
  
  // Fetch medications
  const { data: medications, isLoading } = useQuery({
    queryKey: ['/api/medications'],
  });
  
  // Create medication log mutation
  const createLogMutation = useMutation({
    mutationFn: ({medicationId, status}: {medicationId: number, status: string}) => 
      createMedicationLog(medicationId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
    },
  });
  
  // Group medications by today and tomorrow
  const today = new Date();
  const todayMedications = medications?.filter(med => med.isActive) || [];
  const tomorrowMedications = medications?.filter(med => med.isActive) || [];
  
  const handleMarkTaken = (medicationId: number) => {
    createLogMutation.mutate({
      medicationId,
      status: 'taken'
    });
  };
  
  const handleSkip = (medicationId: number) => {
    createLogMutation.mutate({
      medicationId,
      status: 'skipped'
    });
  };

  return (
    <div className="min-h-screen relative pb-16">
      <Header />
      
      <div className="pt-16 pb-2 bg-gray-50 min-h-screen">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Medication Reminders</h2>
            <p className="text-gray-500 text-sm">View and manage all your medication reminders</p>
          </div>
          
          {/* Today's Reminders */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Today</h3>
            
            {isLoading ? (
              Array(2).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full mb-3" />
              ))
            ) : todayMedications.length > 0 ? (
              todayMedications.map((medication) => (
                <div key={medication.id} className="bg-white rounded-xl shadow-sm p-4 mb-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <Pill className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-xs text-gray-500">{medication.dosage} {medication.instructions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">2:00 PM</span>
                      <div className="flex mt-1">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="rounded-l-md rounded-r-none h-7 px-2 text-xs"
                          onClick={() => handleMarkTaken(medication.id)}
                        >
                          Taken
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-l-none rounded-r-md h-7 px-2 text-xs"
                          onClick={() => handleSkip(medication.id)}
                        >
                          Skip
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No reminders for today</p>
              </div>
            )}
          </div>
          
          {/* Tomorrow's Reminders */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Tomorrow</h3>
            
            {isLoading ? (
              Array(2).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full mb-3" />
              ))
            ) : tomorrowMedications.length > 0 ? (
              tomorrowMedications.map((medication) => (
                <div key={medication.id} className="bg-white rounded-xl shadow-sm p-4 mb-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <Pill className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-xs text-gray-500">{medication.dosage} {medication.instructions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">2:00 PM</span>
                      <p className="text-xs text-gray-500">Tomorrow</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No reminders for tomorrow</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Reminders;
