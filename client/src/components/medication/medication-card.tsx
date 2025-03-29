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
        return 'bg-emerald-100 text-emerald-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'as needed':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Simple badge for medication type
  const getTypeColor = (type?: string) => {
    if (!type) return 'bg-slate-100 text-slate-700';
    
    switch (type.toLowerCase()) {
      case 'antibiotic':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'painkiller':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'vitamin':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="w-full border border-slate-200 shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-slate-900">{medication.name}</h3>
            <div className="flex items-center mt-1">
              <span className={`text-xs px-2 py-0.5 rounded border ${getTypeColor(medication.medicationType)}`}>
                {medication.medicationType || 'Tablet'}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {medication.frequency}
              </span>
            </div>
            
            <div className="flex items-center mt-3">
              <div className="flex items-center mr-4">
                <Clock className="h-3.5 w-3.5 text-slate-400 mr-1" />
                <span className="text-xs text-slate-600">{medication.frequency.split('-')[0].trim()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1" />
                <span className="text-xs text-slate-600">{medication.duration || 'As needed'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeClass(medication.status)}`}>
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
          <div className="mt-3 text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-700">
            <strong>Instructions:</strong> {medication.instructions}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-1 p-2 w-full">
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50">
            <Info className="h-3.5 w-3.5 mr-1" /> Info
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50">
            <Bell className="h-3.5 w-3.5 mr-1" /> Reminders
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center justify-center text-slate-600 hover:text-violet-600 hover:bg-violet-50">
            <History className="h-3.5 w-3.5 mr-1" /> Log
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicationCard;
