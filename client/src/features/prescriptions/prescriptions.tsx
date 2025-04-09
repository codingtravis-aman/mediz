import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Header from '@/components/layout/header';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PrescriptionCard from '@/components/prescription/prescription-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPrescriptions } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Prescriptions: FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch prescriptions
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['/api/prescriptions'],
  });
  
  const handleViewPrescription = (id: number) => {
    // In a real app, this would navigate to a detailed view
    navigate(`/prescription/${id}`);
  };
  
  const handleDownloadPrescription = (id: number) => {
    toast({
      title: 'Download Started',
      description: 'Your prescription is being downloaded.',
    });
  };
  
  const handleSharePrescription = (id: number) => {
    if (navigator.share) {
      navigator.share({
        title: 'Prescription',
        text: 'Check out my prescription',
        url: window.location.origin + `/prescription/${id}`,
      })
      .catch((error) => {
        toast({
          title: 'Share Failed',
          description: 'Failed to share prescription.',
          variant: 'destructive',
        });
      });
    } else {
      toast({
        title: 'Share Not Supported',
        description: 'Sharing is not supported on this device.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen relative pb-16">
      <Header />
      
      <div className="pt-16 pb-2 bg-gray-50 min-h-screen">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">My Prescriptions</h2>
            <p className="text-gray-500 text-sm">View and manage all your prescriptions</p>
          </div>
          
          {/* Prescription List */}
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full" />
              ))
            ) : prescriptions && prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onView={handleViewPrescription}
                  onDownload={handleDownloadPrescription}
                  onShare={handleSharePrescription}
                />
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 mb-4">No prescriptions yet</p>
                <button 
                  className="text-primary-600 font-medium"
                  onClick={() => navigate('/scan')}
                >
                  Scan a prescription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Prescriptions;
