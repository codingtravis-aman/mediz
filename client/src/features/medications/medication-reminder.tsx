import { FC } from 'react';
import { Medication, Reminder } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface MedicationReminderProps {
  medication: Medication;
  reminder: Reminder;
  isPast?: boolean;
  onMarkTaken?: (medicationId: number, reminderId: number) => void;
  onSkip?: (medicationId: number, reminderId: number) => void;
}

const MedicationReminder: FC<MedicationReminderProps> = ({ 
  medication, 
  reminder, 
  isPast = false, 
  onMarkTaken, 
  onSkip 
}) => {
  const getBorderColor = () => {
    // Different border colors based on medication status or type
    switch (medication.status.toLowerCase()) {
      case 'active':
        return 'border-primary-500 bg-primary-50';
      case 'as needed':
        return 'border-warning-500 bg-amber-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      // Parse time string (assuming format like "14:00")
      const [hours, minutes] = timeString.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes, 0, 0);
      return format(time, 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  const handleMarkTaken = () => {
    if (onMarkTaken) {
      onMarkTaken(medication.id, reminder.id);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip(medication.id, reminder.id);
    }
  };

  return (
    <Card className={`border-l-4 ${getBorderColor()} rounded-r-lg mb-3`}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-800">{medication.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{medication.dosage} {medication.instructions}</p>
          </div>
          <div className="bg-white px-2 py-1 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-primary-700">{formatTime(reminder.time)}</p>
          </div>
        </div>
        
        {!isPast && (
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleMarkTaken}
              className="bg-green-500 text-white rounded-l-md px-3 py-1 text-xs"
            >
              Taken
            </button>
            <button 
              onClick={handleSkip}
              className="bg-gray-200 text-gray-600 rounded-r-md px-3 py-1 text-xs"
            >
              Skip
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationReminder;
