import React from 'react';
import { Clock } from 'lucide-react';
import { TimeSlot } from '../services/appointmentService';
import LoadingSpinner from './LoadingSpinner';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectTimeSlot: (slotId: string) => void;
  isLoading: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedSlotId,
  onSelectTimeSlot,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <LoadingSpinner size="medium" />
      </div>
    );
  }
  
  if (timeSlots.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        <Clock className="h-12 w-12 mb-2 text-gray-400" />
        <p>No available time slots for the selected date.</p>
        <p className="text-sm mt-1">Please select a different date.</p>
      </div>
    );
  }
  
  // Group timeslots by morning/afternoon
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour < 12;
  });
  
  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 12;
  });
  
  // Format time from 24hr to 12hr
  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(':');
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };
  
  const renderTimeSlots = (slots: TimeSlot[], title: string) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map(slot => (
            <button
              key={slot.id}
              className={`py-2 px-1 text-sm rounded-md border transition-colors ${
                selectedSlotId === slot.id
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                  : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
              onClick={() => onSelectTimeSlot(slot.id)}
            >
              {formatTime(slot.startTime)}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg p-4">
      {renderTimeSlots(morningSlots, 'Morning')}
      {renderTimeSlots(afternoonSlots, 'Afternoon')}
    </div>
  );
};

export default TimeSlotPicker;