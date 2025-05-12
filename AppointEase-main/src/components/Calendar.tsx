import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  // Get current date info
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [currentMonth, setCurrentMonth] = React.useState<Date>(today);
  
  // Day names for the header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Get days in current view
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Create array of date objects
    const daysInMonth = [];
    
    // Add empty spaces for days before the first day of month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysInMonth.push(null);
    }
    
    // Add all days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      daysInMonth.push(date);
    }
    
    return daysInMonth;
  };
  
  // Format date as YYYY-MM-DD for comparison
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const daysInMonth = getDaysInMonth();
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-10"></div>;
          }
          
          const dateString = formatDateForComparison(day);
          const isToday = formatDateForComparison(today) === dateString;
          const isSelected = selectedDate === dateString;
          const isPast = day < today;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          
          // Determine if the day is available (not in past, not a weekend)
          const isAvailable = !isPast && !isWeekend;
          
          let dayClasses = 'calendar-day';
          
          if (isSelected) {
            dayClasses += ' calendar-day-selected';
          } else if (!isAvailable) {
            dayClasses += ' calendar-day-unavailable';
          } else {
            dayClasses += ' calendar-day-available';
          }
          
          // Add today indicator
          if (isToday) {
            dayClasses += ' ring-2 ring-indigo-200';
          }
          
          return (
            <button
              key={dateString}
              className={dayClasses}
              onClick={() => isAvailable && onSelectDate(dateString)}
              disabled={!isAvailable}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;