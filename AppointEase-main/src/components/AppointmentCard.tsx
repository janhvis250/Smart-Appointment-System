import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Info } from 'lucide-react';
import { AppointmentWithDetails } from '../services/appointmentService';

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { id, service, timeSlot, status } = appointment;
  
  // Format date: "Monday, Jan 1, 2025"
  const formattedDate = new Date(timeSlot.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Status styling
  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-indigo-600 bg-indigo-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  // Status badge
  const StatusBadge = () => {
    const statusColor = getStatusColor();
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className={`appointment-card appointment-card-${status} mb-4`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{service.description}</p>
            
            <div className="mt-3 flex flex-col space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                {formattedDate}
              </div>
              
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-indigo-600" />
                {timeSlot.startTime} - {timeSlot.endTime} ({service.duration} min)
              </div>
              
              <div className="flex items-center text-sm text-gray-700">
                <DollarSign className="h-4 w-4 mr-2 text-indigo-600" />
                ${service.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start sm:items-end">
            <StatusBadge />
            
            <Link 
              to={`/appointments/${id}`}
              className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;