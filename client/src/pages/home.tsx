import { FC, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Pill } from 'lucide-react';
import Header from '@/components/layout/header';
import BottomNavigation from '@/components/ui/bottom-navigation';
import MedicationReminder from '@/components/medication/medication-reminder';
import PrescriptionCard from '@/components/prescription/prescription-card';
import { getMedications, getPrescriptions, createMedicationLog, DEMO_USER_ID } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const Home: FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add a default user-id header for the demo
  useEffect(() => {
    // This sets the user-id for all requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      init = init || {};
      init.headers = init.headers || {};
      init.headers = {
        ...init.headers,
        'user-id': String(DEMO_USER_ID),
      };
      return originalFetch(input, init);
    };
  }, []);

  // Fetch medications and prescriptions
  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: ['/api/medications'],
    refetchInterval: 60000, // Refresh every minute to update reminders
  });

  const { data: prescriptions, isLoading: isLoadingPrescriptions } = useQuery({
    queryKey: ['/api/prescriptions'],
  });

  // Filter active medications with upcoming reminders
  const upcomingMedications = medications?.filter(med => med.isActive).slice(0, 3) || [];

  // Get recent prescriptions
  const recentPrescriptions = prescriptions?.slice(0, 2) || [];

  const handleMarkTaken = async (medicationId: number, reminderId: number) => {
    try {
      await createMedicationLog(medicationId, {
        medicationId,
        userId: DEMO_USER_ID,
        status: 'taken',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      queryClient.invalidateQueries({ queryKey: [`/api/medications/${medicationId}/logs`] });
      
      toast({
        title: 'Medication marked as taken',
        description: 'Your medication log has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update medication log',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleSkipMedication = async (medicationId: number, reminderId: number) => {
    try {
      await createMedicationLog(medicationId, {
        medicationId,
        userId: DEMO_USER_ID,
        status: 'skipped',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      queryClient.invalidateQueries({ queryKey: [`/api/medications/${medicationId}/logs`] });
      
      toast({
        title: 'Medication skipped',
        description: 'Your medication has been marked as skipped.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update medication log',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen relative pb-16">
      <Header />
      
      <div className="pt-16 pb-2 bg-gray-50 min-h-screen">
        <div className="p-4">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Welcome back, Rahul</h2>
            <p className="text-gray-500 text-sm">Manage your medication and prescriptions</p>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link href="/scan">
              <a className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Camera className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-medium">Scan Prescription</h3>
                <p className="text-xs text-gray-500 mt-1">Upload a new prescription</p>
              </a>
            </Link>
            
            <Link href="/medications">
              <a className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="bg-secondary-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Pill className="h-5 w-5 text-secondary-600" />
                </div>
                <h3 className="font-medium">My Medications</h3>
                <p className="text-xs text-gray-500 mt-1">View & track medications</p>
              </a>
            </Link>
          </div>
          
          {/* Upcoming Medications */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Upcoming Reminders</h3>
              <Link href="/reminders">
                <a className="text-primary-600 text-sm font-medium">View All</a>
              </Link>
            </div>
            
            {isLoadingMedications ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : upcomingMedications.length > 0 ? (
              upcomingMedications.map((medication, index) => (
                <MedicationReminder
                  key={index}
                  medication={medication}
                  reminder={{
                    id: index + 1,
                    medicationId: medication.id,
                    userId: DEMO_USER_ID,
                    time: '14:00',
                    daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                    isActive: true
                  }}
                  onMarkTaken={handleMarkTaken}
                  onSkip={handleSkipMedication}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No upcoming medication reminders</p>
              </div>
            )}
          </div>
          
          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Prescriptions</h3>
              <Link href="/prescriptions">
                <a className="text-primary-600 text-sm font-medium">View All</a>
              </Link>
            </div>
            
            {isLoadingPrescriptions ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((prescription, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-3 mb-3 last:mb-0 last:border-b-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{prescription.title}</h4>
                    <p className="text-xs text-gray-500">
                      Uploaded {formatDistanceToNow(new Date(prescription.uploadDate), { addSuffix: true })}
                    </p>
                  </div>
                  <Link href={`/prescriptions/${prescription.id}`}>
                    <a className="text-primary-600">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </a>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No prescriptions uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
