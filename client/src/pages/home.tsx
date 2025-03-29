import { FC, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Pill, Bell, FileText } from 'lucide-react';
import Header from '@/components/layout/header';
import BottomNavigation from '@/components/ui/bottom-navigation';
import MedicationReminder from '@/components/medication/medication-reminder';
import PrescriptionCard from '@/components/prescription/prescription-card';
import { getMedications, getPrescriptions, createMedicationLog, DEMO_USER_ID } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Medication, Prescription } from '@/lib/types';

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
  const { data: medications, isLoading: isLoadingMedications } = useQuery<Medication[]>({
    queryKey: ['/api/medications'],
    refetchInterval: 60000, // Refresh every minute to update reminders
  });

  const { data: prescriptions, isLoading: isLoadingPrescriptions } = useQuery<Prescription[]>({
    queryKey: ['/api/prescriptions'],
  });

  // Filter active medications with upcoming reminders
  const upcomingMedications = medications?.filter((med: Medication) => med.isActive).slice(0, 3) || [];

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
      
      <div className="pt-16 pb-2 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="p-4 max-w-lg mx-auto">
          {/* Welcome Section with Clean Design */}
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3">
                <span className="text-xl font-bold">R</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1 text-slate-800">Welcome back, Rahul</h2>
                <p className="text-slate-500 text-sm">Manage your medications and prescriptions</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/scan">
              <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow border-b-4 border-blue-500">
                <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 text-base">Scan Prescription</h3>
                <p className="text-xs text-slate-500 mt-1">Upload a new prescription</p>
              </div>
            </Link>
            
            <Link href="/medications">
              <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow border-b-4 border-emerald-500">
                <div className="bg-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 text-base">My Medications</h3>
                <p className="text-xs text-slate-500 mt-1">View & track medications</p>
              </div>
            </Link>
          </div>
          
          {/* Upcoming Medications */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-medium text-slate-800 text-lg">Upcoming Reminders</h3>
              </div>
              <Link href="/reminders">
                <span className="text-blue-600 text-sm font-medium cursor-pointer hover:bg-blue-50 px-3 py-1 rounded hover:underline">View All</span>
              </Link>
            </div>
            
            {isLoadingMedications ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : upcomingMedications.length > 0 ? (
              upcomingMedications.map((medication: Medication, index: number) => (
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
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-100">
                <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No upcoming medication reminders</p>
              </div>
            )}
          </div>
          
          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-medium text-slate-800 text-lg">Recent Prescriptions</h3>
              </div>
              <Link href="/prescriptions">
                <span className="text-blue-600 text-sm font-medium cursor-pointer hover:bg-blue-50 px-3 py-1 rounded hover:underline">View All</span>
              </Link>
            </div>
            
            {isLoadingPrescriptions ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((prescription: Prescription, index: number) => (
                <div key={index} className="flex items-center border-b border-slate-100 pb-3 mb-3 last:mb-0 last:border-b-0 hover:bg-slate-50 p-3 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{prescription.title}</h4>
                    <p className="text-xs text-slate-500">
                      Uploaded {formatDistanceToNow(new Date(prescription.uploadDate), { addSuffix: true })}
                    </p>
                  </div>
                  <Link href={`/prescriptions/${prescription.id}`}>
                    <div className="text-white cursor-pointer bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-100">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No prescriptions uploaded yet</p>
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
