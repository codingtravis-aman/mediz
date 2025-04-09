import { FC, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import Header from '@/components/layout/header';
import BottomNavigation from '@/components/ui/bottom-navigation';
import MedicationCard from '@/components/medication/medication-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMedications, updateMedication } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Medication } from '@/lib/types';

const Medications: FC = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch medications
  const { data: medications, isLoading } = useQuery({
    queryKey: ['/api/medications'],
  });
  
  // Update medication mutation
  const updateMedicationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Medication> }) => 
      updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
    },
  });
  
  const handleToggleMedication = (id: number, isActive: boolean) => {
    updateMedicationMutation.mutate({
      id,
      data: { isActive }
    });
  };
  
  const handleMedicationClick = (id: number) => {
    navigate(`/medications/${id}`);
  };
  
  // Filter medications by search term
  const filteredMedications = medications?.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen relative pb-16">
      <Header />
      
      <div className="pt-16 pb-2 bg-gray-50 min-h-screen">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">My Medications</h2>
            <p className="text-gray-500 text-sm">Track and manage your medications</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search medications..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Medication List */}
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
              ))
            ) : filteredMedications.length > 0 ? (
              filteredMedications.map((medication) => (
                <div key={medication.id} onClick={() => handleMedicationClick(medication.id)}>
                  <MedicationCard 
                    medication={medication} 
                    onToggle={handleToggleMedication}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No medications found</p>
                {searchTerm && (
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Add Medication Button */}
          <div className="fixed bottom-20 right-4">
            <Button 
              className="w-14 h-14 rounded-full"
              onClick={() => navigate('/medications/add')}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Medications;
