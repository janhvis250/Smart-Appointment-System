import { v4 as uuidv4 } from 'uuid';

export interface TimeSlot {
  id: string;
  date: string; // ISO format
  startTime: string; // 24hr format HH:MM
  endTime: string; // 24hr format HH:MM
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  slotId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
  notes?: string;
}

export interface AppointmentWithDetails extends Appointment {
  service: Service;
  timeSlot: TimeSlot;
  userName: string;
  userEmail: string;
}

// Mock services
const services: Service[] = [
  {
    id: 's1',
    name: 'Consultation',
    duration: 30,
    price: 50,
    description: 'Initial consultation to discuss your needs',
  },
  {
    id: 's2',
    name: 'Regular Checkup',
    duration: 45,
    price: 80,
    description: 'Standard checkup appointment',
  },
  {
    id: 's3',
    name: 'Premium Service',
    duration: 60,
    price: 120,
    description: 'Comprehensive premium service with detailed analysis',
  },
  {
    id: 's4',
    name: 'Express Service',
    duration: 15,
    price: 35,
    description: 'Quick express service for simple matters',
  },
];

// Generate mock available time slots for the next 14 days
const generateMockTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  // Generate slots for next 14 days
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Generate time slots from 9 AM to 5 PM with 30-min intervals
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Calculate end time (30 minutes later)
        let endHour = hour;
        let endMinute = minute + 30;
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Make some slots unavailable randomly
        const isAvailable = Math.random() > 0.3;
        
        slots.push({
          id: uuidv4(),
          date: dateString,
          startTime,
          endTime,
          isAvailable
        });
      }
    }
  }
  
  return slots;
};

let timeSlots = generateMockTimeSlots();
const appointments: Appointment[] = [];

// Mock user data for appointments
const mockUsers = {
  'admin-123': { name: 'Admin User', email: 'admin@example.com' },
  'user-456': { name: 'Regular User', email: 'user@example.com' }
};

// Get available time slots
export const getAvailableTimeSlots = async (date?: string): Promise<TimeSlot[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (date) {
    return timeSlots.filter(slot => slot.date === date && slot.isAvailable);
  }
  
  return timeSlots.filter(slot => slot.isAvailable);
};

// Get available services
export const getServices = async (): Promise<Service[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return services;
};

// Book an appointment
export const bookAppointment = async (
  userId: string,
  serviceId: string,
  slotId: string,
  notes?: string
): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if slot is available
  const slot = timeSlots.find(s => s.id === slotId);
  if (!slot || !slot.isAvailable) {
    throw new Error('This time slot is no longer available');
  }
  
  // Update slot to unavailable
  timeSlots = timeSlots.map(s => 
    s.id === slotId ? { ...s, isAvailable: false } : s
  );
  
  // Create new appointment
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    id: uuidv4(),
    userId,
    serviceId,
    slotId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    notes
  };
  
  appointments.push(newAppointment);
  return newAppointment;
};

// Get user appointments
export const getUserAppointments = async (userId: string): Promise<AppointmentWithDetails[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return appointments
    .filter(appointment => appointment.userId === userId)
    .map(appointment => {
      const service = services.find(s => s.id === appointment.serviceId)!;
      const timeSlot = timeSlots.find(s => s.id === appointment.slotId)!;
      const user = mockUsers[appointment.userId as keyof typeof mockUsers];
      
      return {
        ...appointment,
        service,
        timeSlot,
        userName: user.name,
        userEmail: user.email
      };
    })
    .sort((a, b) => {
      // Sort by date/time, newest first
      const dateA = new Date(`${a.timeSlot.date}T${a.timeSlot.startTime}`);
      const dateB = new Date(`${b.timeSlot.date}T${b.timeSlot.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<AppointmentWithDetails | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const appointment = appointments.find(a => a.id === id);
  if (!appointment) return null;
  
  const service = services.find(s => s.id === appointment.serviceId)!;
  const timeSlot = timeSlots.find(s => s.id === appointment.slotId)!;
  const user = mockUsers[appointment.userId as keyof typeof mockUsers];
  
  return {
    ...appointment,
    service,
    timeSlot,
    userName: user.name,
    userEmail: user.email
  };
};

// Update appointment status
export const updateAppointmentStatus = async (
  id: string, 
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const appointmentIndex = appointments.findIndex(a => a.id === id);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  appointments[appointmentIndex] = updatedAppointment;
  
  // If cancelled, make the slot available again
  if (status === 'cancelled') {
    timeSlots = timeSlots.map(s => 
      s.id === updatedAppointment.slotId ? { ...s, isAvailable: true } : s
    );
  }
  
  return updatedAppointment;
};

// Reschedule appointment
export const rescheduleAppointment = async (id: string, newSlotId: string): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Check if new slot is available
  const newSlot = timeSlots.find(s => s.id === newSlotId);
  if (!newSlot || !newSlot.isAvailable) {
    throw new Error('This time slot is no longer available');
  }
  
  const appointmentIndex = appointments.findIndex(a => a.id === id);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  const oldSlotId = appointments[appointmentIndex].slotId;
  
  // Update appointment with new slot
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    slotId: newSlotId,
    updatedAt: new Date().toISOString()
  };
  
  appointments[appointmentIndex] = updatedAppointment;
  
  // Make old slot available, new slot unavailable
  timeSlots = timeSlots.map(s => {
    if (s.id === oldSlotId) return { ...s, isAvailable: true };
    if (s.id === newSlotId) return { ...s, isAvailable: false };
    return s;
  });
  
  return updatedAppointment;
};

// Admin: Get all appointments
export const getAllAppointments = async (): Promise<AppointmentWithDetails[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return appointments
    .map(appointment => {
      const service = services.find(s => s.id === appointment.serviceId)!;
      const timeSlot = timeSlots.find(s => s.id === appointment.slotId)!;
      const user = mockUsers[appointment.userId as keyof typeof mockUsers] || 
        { name: 'Unknown User', email: 'unknown@example.com' };
      
      return {
        ...appointment,
        service,
        timeSlot,
        userName: user.name,
        userEmail: user.email
      };
    })
    .sort((a, b) => {
      // Sort by date/time, newest first
      const dateA = new Date(`${a.timeSlot.date}T${a.timeSlot.startTime}`);
      const dateB = new Date(`${b.timeSlot.date}T${b.timeSlot.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });
};

// Admin: Create time slot
export const createTimeSlot = async (
  date: string,
  startTime: string,
  endTime: string
): Promise<TimeSlot> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newSlot: TimeSlot = {
    id: uuidv4(),
    date,
    startTime,
    endTime,
    isAvailable: true
  };
  
  timeSlots.push(newSlot);
  return newSlot;
};

// Admin: Update time slot availability
export const updateTimeSlotAvailability = async (
  id: string,
  isAvailable: boolean
): Promise<TimeSlot> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const slotIndex = timeSlots.findIndex(s => s.id === id);
  if (slotIndex === -1) {
    throw new Error('Time slot not found');
  }
  
  const updatedSlot = {
    ...timeSlots[slotIndex],
    isAvailable
  };
  
  timeSlots[slotIndex] = updatedSlot;
  return updatedSlot;
};