import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  getAppointmentById, 
  updateAppointmentStatus,
  AppointmentWithDetails 
} from '../services/appointmentService';

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const appointmentData = await getAppointmentById(id);
        
        // Check if appointment exists and belongs to current user
        if (!appointmentData) {
          toast.error('Appointment not found');
          navigate('/dashboard');
          return;
        }
        
        if (user && appointmentData.userId !== user.id && user.role !== 'admin') {
          toast.error('You do not have permission to view this appointment');
          navigate('/dashboard');
          return;
        }
        
        setAppointment(appointmentData);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        toast.error('Failed to load appointment details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointment();
  }, [id, navigate, user]);
  
  const handleCancelAppointment = async () => {
    if (!appointment) return;
    
    try {
      setIsUpdating(true);
      await updateAppointmentStatus(appointment.id, 'cancelled');
      toast.success('Appointment cancelled successfully');
      
      // Update local state
      setAppointment({
        ...appointment,
        status: 'cancelled'
      });
      
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const refreshAppointment = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const refreshedAppointment = await getAppointmentById(id);
      
      if (!refreshedAppointment) {
        toast.error('Appointment not found');
        navigate('/dashboard');
        return;
      }
      
      setAppointment(refreshedAppointment);
      toast.success('Appointment details refreshed');
    } catch (error) {
      console.error('Error refreshing appointment:', error);
      toast.error('Failed to refresh appointment details');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date: "Monday, Jan 1, 2025"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time from 24hr to 12hr
  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(':');
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };
  
  // Calculate if appointment can be cancelled (24 hours before start time)
  const canCancel = () => {
    if (!appointment || appointment.status === 'cancelled') return false;
    
    const appointmentDateTime = new Date(`${appointment.timeSlot.date}T${appointment.timeSlot.startTime}`);
    const now = new Date();
    
    // Calculate time difference in hours
    const timeDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return timeDiff >= 24;
  };
  
  // Get status badge styling
  const getStatusBadgeClasses = () => {
    if (!appointment) return '';
    
    switch (appointment.status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-indigo-100 text-indigo-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Appointment not found</h3>
          <p className="mt-1 text-gray-500">
            The appointment you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <div className="mt-6">
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment Details
            </h1>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses()}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
              
              <button
                onClick={refreshAppointment}
                className="ml-3 p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                title="Refresh appointment"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Details */}
            <div className="border rounded-lg p-4 bg-indigo-50 border-indigo-100">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">Service</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{appointment.service.name}</p>
                  <p className="text-gray-600 text-sm">{appointment.service.description}</p>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                  <span>{appointment.service.duration} minutes</span>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">${appointment.service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">Date & Time</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Date</p>
                    <p>{formatDate(appointment.timeSlot.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Time</p>
                    <p>{formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Location</p>
                    <p>123 Booking Street<br />Appointment City, AC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p>(123) 456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p>info@appointease.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes section if there are any */}
          {appointment.notes && (
            <div className="mt-6 border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-900">Notes</h2>
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          )}
          
          {/* Actions section */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-3 sm:mb-0">
                Appointment ID: {appointment.id.substring(0, 8)}
                <br />
                Created on {new Date(appointment.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="w-full sm:w-auto">
              {appointment.status !== 'cancelled' && (
                <>
                  {canCancel() ? (
                    <>
                      {!showCancelConfirm ? (
                        <button
                          onClick={() => setShowCancelConfirm(true)}
                          className="btn btn-error w-full sm:w-auto"
                        >
                          <X className="h-5 w-5 mr-2" />
                          Cancel Appointment
                        </button>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Are you sure?</span>
                          <button
                            onClick={handleCancelAppointment}
                            disabled={isUpdating}
                            className="btn btn-error"
                          >
                            {isUpdating ? (
                              <LoadingSpinner size="small" className="text-white" />
                            ) : (
                              <>
                                <Check className="h-5 w-5 mr-1" />
                                Yes
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowCancelConfirm(false)}
                            className="btn btn-outline"
                            disabled={isUpdating}
                          >
                            No
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 italic">
                      * Cancellation is only available 24 hours before the appointment
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;