import React, { useState } from 'react';
import DateCard from './DateCard';

interface SwipeableDateSelectorProps {
  onDateChange?: (date: { day: string; date: string; fullDate: Date }, isManual: boolean) => void;
}

export default function SwipeableDateSelector({ onDateChange }: SwipeableDateSelectorProps) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Generate 7 days starting from TODAY (today always first!)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    // Generate 7 days starting from TODAY
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      const day = dayNames[date.getDay()];
      const dateNum = date.getDate().toString();
      
      // Check if this is today
      const isToday = i === 0; // First item is always today
      
      dates.push({
        day,
        date: dateNum,
        fullDate: date,
        index: i,
        isToday
      });
    }
    
    return dates;
  };

  const dates = generateDates();
  
  // Set initial selected index to today (index 0) - NOT manual
  React.useEffect(() => {
    setSelectedDateIndex(0); // Today is always first now
    if (onDateChange) {
      onDateChange(dates[0], false); // isManual = false (automatic)
    }
  }, []);

  const handleDateClick = (index: number) => {
    setSelectedDateIndex(index);

    // Callback with selected date - this is MANUAL
    if (onDateChange) {
      onDateChange(dates[index], true); // isManual = true
    }
  };

  return (
    <div className="w-full">
      {/* Week Days Grid - All 7 days visible */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((item) => (
          <div 
            key={item.index} 
            className="w-full h-[70px]"
            onClick={() => handleDateClick(item.index)}
          >
            <DateCard 
              day={item.day} 
              date={item.date} 
              active={selectedDateIndex === item.index} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
