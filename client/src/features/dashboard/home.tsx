import { FC, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Pill, Bell, FileText } from 'lucide-react';
import Header from '../../common/layouts/header';
import BottomNavigation from '../../common/ui/bottom-navigation';
import MedicationReminder from '../../features/medications/medication-reminder';
import PrescriptionCard from '../../features/prescriptions/prescription-card';
import { getMedications, getPrescriptions, createMedicationLog, DEMO_USER_ID } from '../../common/utils/api';
import { useToast } from '../../common/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '../../common/ui/skeleton';
import { Medication, Prescription } from '../../common/utils/types';

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
      
      <div className="pt-20 pb-2 bg-gradient-to-b from-indigo-50 via-purple-50 to-white min-h-screen">
        <div className="p-4 max-w-lg mx-auto">
          {/* Welcome Section with Vibrant Design */}
          <div className="mb-6 p-5 bg-white rounded-2xl shadow-lg border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-bl-full -z-10"></div>
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white mr-3 shadow-lg">
                <span className="text-xl font-extrabold">A</span>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1 text-gray-800">Hi, Aman! 👋</h2>
                <p className="text-gray-500 text-sm">Today is a great day to stay healthy!</p>
              </div>
            </div>
            
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900">Today's Medication Reminders</p>
                  <p className="text-[10px] text-gray-500">You have 3 medications scheduled today</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/scan">
              <div className="group bg-white p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Scan Prescription</h3>
                <p className="text-xs text-gray-500 mt-1">Upload & translate prescriptions</p>
              </div>
            </Link>
            
            <Link href="/medications">
              <div className="group bg-white p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">My Medications</h3>
                <p className="text-xs text-gray-500 mt-1">View & track your medications</p>
              </div>
            </Link>
          </div>
          
          {/* Upcoming Medications */}
          <div className="bg-white rounded-2xl shadow-md p-5 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-bl-full -z-10"></div>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-3 shadow-md">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Today's Reminders</h3>
                  <p className="text-xs text-gray-500">Track your daily medications</p>
                </div>
              </div>
              <Link href="/reminders">
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium cursor-pointer hover:shadow-lg transition-shadow">
                  View All
                </div>
              </Link>
            </div>
            
            {isLoadingMedications ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : upcomingMedications.length > 0 ? (
              <div className="space-y-3">
                {upcomingMedications.map((medication: Medication, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-3 text-white shadow-md">
                          <Pill className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{medication.name}</h4>
                          <p className="text-xs text-gray-500">{medication.dosage} - {medication.frequency}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleMarkTaken(medication.id, index + 1)}
                          className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
                        >
                          Taken
                        </button>
                        <button 
                          onClick={() => handleSkipMedication(medication.id, index + 1)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <Bell className="h-3 w-3 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-600 font-medium">Next time: 14:00 (2:00 PM)</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-3">
                  <Bell className="h-8 w-8 text-amber-400" />
                </div>
                <h4 className="font-bold text-gray-700 mb-1">No Reminders!</h4>
                <p className="text-sm text-gray-500">You have no medication reminders for today</p>
              </div>
            )}
          </div>
          
          {/* Recent Prescriptions */}
          <div className="bg-white rounded-2xl shadow-md p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-bl-full -z-10"></div>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3 shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Recent Prescriptions</h3>
                  <p className="text-xs text-gray-500">View your scanned prescriptions</p>
                </div>
              </div>
              <Link href="/prescriptions">
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium cursor-pointer hover:shadow-lg transition-shadow">
                  View All
                </div>
              </Link>
            </div>
            
            {isLoadingPrescriptions ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : recentPrescriptions.length > 0 ? (
              <div className="space-y-3">
                {recentPrescriptions.map((prescription: Prescription, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3 text-white shadow-md group-hover:scale-110 transition-transform">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{prescription.title}</h4>
                          <div className="flex items-center mt-1">
                            <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                            <p className="text-xs text-gray-500">
                              Uploaded {formatDistanceToNow(new Date(prescription.uploadDate), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link href={`/prescriptions/${prescription.id}`}>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white cursor-pointer shadow-md hover:shadow-lg transition-shadow group-hover:scale-105 transform-gpu duration-300">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      </Link>
                    </div>
                    <div className="mt-3 flex items-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-2 text-white">
                        <Pill className="h-3 w-3" />
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{prescription.medicationsCount} medications found</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-3">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="font-bold text-gray-700 mb-1">No Prescriptions!</h4>
                <p className="text-sm text-gray-500">You haven't uploaded any prescriptions yet</p>
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
