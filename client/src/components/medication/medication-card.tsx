import { FC } from 'react';
import { Clock, Calendar, Info, Bell, History } from 'lucide-react';
import { Medication } from '@/lib/types';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface MedicationCardProps {
  medication: Medication;
  onToggle?: (id: number, active: boolean) => void;
}

const MedicationCard: FC<MedicationCardProps> = ({ medication, onToggle }) => {
  const handleToggle = (checked: boolean) => {
    if (onToggle) {
      onToggle(medication.id, checked);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[var(--success)] text-white';
      case 'completed':
        return 'bg-[var(--info)] text-white';
      case 'as needed':
        return 'bg-[var(--warning)] text-white';
      default:
        return 'bg-[var(--text-muted)] text-white';
    }
  };

  // Get pill color based on medication type
  const getMedicationTypeClass = (type?: string) => {
    if (!type) return 'pill pill-generic';
    
    switch (type.toLowerCase()) {
      case 'antibiotic':
        return 'pill pill-antibiotic';
      case 'painkiller':
        return 'pill pill-painkiller';
      case 'vitamin':
        return 'pill pill-vitamin';
      default:
        return 'pill pill-generic';
    }
  };

  return (
    <Card className="w-full card-hover border-l-4 border-l-[var(--blue-primary)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-[var(--text-dark)]">{medication.name}</h3>
              <span className={`ml-2 ${getMedicationTypeClass(medication.medicationType)}`}>
                {medication.medicationType || 'Tablet'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {medication.frequency} - {medication.duration || 'As prescribed'}
            </p>
            
            <div className="flex items-center mt-3">
              <div className="flex items-center mr-4">
                <Clock className="h-3.5 w-3.5 text-[var(--blue-primary)] mr-1" />
                <span className="text-xs">{medication.frequency.split('-')[0].trim()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-[var(--green-primary)] mr-1" />
                <span className="text-xs">{medication.duration || 'As needed'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(medication.status)}`}>
              {medication.status}
            </span>
            <Switch
              className="mt-3"
              checked={medication.isActive}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
        
        {medication.instructions && (
          <div className="mt-3 text-xs bg-[var(--bg-light)] p-2 rounded-md text-[var(--text-dark)]">
            <strong className="text-[var(--blue-primary)]">Instructions:</strong> {medication.instructions}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2 p-3 w-full">
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center text-[var(--blue-primary)]">
            <Info className="h-3.5 w-3.5 mr-1" /> Info
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center text-[var(--green-primary)]">
            <Bell className="h-3.5 w-3.5 mr-1" /> Reminders
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center text-[var(--teal-secondary)]">
            <History className="h-3.5 w-3.5 mr-1" /> Log
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicationCard;
