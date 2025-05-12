import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar';
import ServiceCard from '../components/ServiceCard';
import TimeSlotPicker from '../components/TimeSlotPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Service, 
  TimeSlot, 
  getServices, 
  getAvailableTimeSlots,
  bookAppointment 
} from '../services/appointmentService';

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Get available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const availableServices = await getServices();
        setServices(availableServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services. Please try again.');
      } finally {
        setIsLoadingServices(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Get time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) {
        setTimeSlots([]);
        return;
      }
      
      try {
        setIsLoadingTimeSlots(true);
        const availableSlots = await getAvailableTimeSlots(selectedDate);
        setTimeSlots(availableSlots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load available time slots.');
      } finally {
        setIsLoadingTimeSlots(false);
      }
    };
    
    fetchTimeSlots();
  }, [selectedDate]);
  
  // Handle service selection
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };
  
  // Handle date selection
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotId(null); // Reset selected slot when date changes
  };
  
  // Handle time slot selection
  const handleSelectTimeSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
  };
  
  // Move to next step
  const goToNextStep = () => {
    if (currentStep === 1 && !selectedServiceId) {
      toast.error('Please select a service');
      return;
    }
    
    if (currentStep === 2 && !selectedSlotId) {
      toast.error('Please select a date and time');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  // Move to previous step
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Submit booking
  const handleSubmitBooking = async () => {
    if (!user || !selectedServiceId || !selectedSlotId) {
      toast.error('Missing required information');
      return;
    }
    
    try {
      setIsBooking(true);
      await bookAppointment(user.id, selectedServiceId, selectedSlotId, notes);
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  
  // Get selected service details
  const selectedService = selectedServiceId 
    ? services.find(service => service.id === selectedServiceId) 
    : null;
    
  // Get selected time slot details
  const selectedSlot = selectedSlotId
    ? timeSlots.find(slot => slot.id === selectedSlotId)
    : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
        <p className="text-gray-600 mt-1">
          Schedule your appointment in just a few steps
        </p>
      </div>
      
      {/* Stepper */}
      <div className="mb-8">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 md:text-base">
          <li className={`flex w-full items-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
              currentStep >= 1 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
            </span>
            <span className="ml-2">Service</span>
            <span className="flex-1 mx-2 sm:mx-4 h-0.5 bg-gray-200"></span>
          </li>
          <li className={`flex w-full items-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
              currentStep >= 2 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
            </span>
            <span className="ml-2">Date & Time</span>
            <span className="flex-1 mx-2 sm:mx-4 h-0.5 bg-gray-200"></span>
          </li>
          <li className={`flex items-center ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
              currentStep >= 3 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {currentStep > 3 ? <Check className="w-5 h-5" /> : "3"}
            </span>
            <span className="ml-2">Confirm</span>
          </li>
        </ol>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
            
            {isLoadingServices ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedServiceId === service.id}
                    onSelect={handleSelectService}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Step 2: Select Date and Time */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Select a Date</h3>
                <Calendar 
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">
                  {selectedDate 
                    ? `Available Times for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}` 
                    : 'Select a date to see available times'}
                </h3>
                <TimeSlotPicker
                  timeSlots={timeSlots}
                  selectedSlotId={selectedSlotId}
                  onSelectTimeSlot={handleSelectTimeSlot}
                  isLoading={isLoadingTimeSlots}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Confirm Details */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Appointment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Appointment Details</h3>
                
                {selectedService && selectedSlot && (
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p>{new Date(selectedSlot.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p>{selectedSlot.startTime} - {selectedSlot.endTime} ({selectedService.duration} minutes)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p>123 Booking Street, Appointment City, AC 12345</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-2">Service Selected</h3>
                  {selectedService && (
                    <div>
                      <p className="font-semibold">{selectedService.name}</p>
                      <p className="text-gray-600 text-sm mt-1">{selectedService.description}</p>
                      <p className="mt-2 font-medium text-indigo-700">${selectedService.price.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="notes" className="form-label">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="form-input"
                    placeholder="Any special requests or information we should know about?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="btn btn-outline"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="btn btn-primary"
            >
              Next
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitBooking}
              disabled={isBooking}
              className="btn btn-primary"
            >
              {isBooking ? (
                <LoadingSpinner size="small" className="text-white" />
              ) : (
                'Confirm Booking'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;