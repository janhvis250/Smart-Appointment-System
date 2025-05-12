import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../services/appointmentService';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow'}`}
      onClick={() => onSelect(service.id)}
    >
      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{service.description}</p>
      
      <div className="mt-4 flex justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <Clock className="h-4 w-4 mr-2 text-indigo-600" />
          {service.duration} min
        </div>
        <div className="flex items-center text-sm font-medium text-gray-900">
          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
          {service.price.toFixed(2)}
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-4 text-sm font-medium text-indigo-600">
          Selected
        </div>
      )}
    </div>
  );
};

export default ServiceCard;