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
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'as needed':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{medication.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {medication.medicationType || 'Tablet'} - {medication.frequency} - {medication.duration || 'As prescribed'}
            </p>
            
            <div className="flex items-center mt-3">
              <div className="flex items-center mr-4">
                <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                <span className="text-xs">{medication.frequency.split('-')[0].trim()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                <span className="text-xs">{medication.duration || 'As needed'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(medication.status)}`}>
              {medication.status}
            </span>
            <Switch
              className="mt-3"
              checked={medication.isActive}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2 p-3 w-full">
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center">
            <Info className="h-3.5 w-3.5 mr-1" /> Info
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center">
            <Bell className="h-3.5 w-3.5 mr-1" /> Reminders
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center">
            <History className="h-3.5 w-3.5 mr-1" /> Log
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicationCard;
