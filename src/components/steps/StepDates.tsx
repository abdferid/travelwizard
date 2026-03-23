'use client';

import { useState, useMemo } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { format, addDays, startOfDay } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import { Calendar } from 'lucide-react';
import 'react-day-picker/style.css';

export default function StepDates() {
  const { startDate, endDate, setStartDate, setEndDate } = useBookingStore();
  
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (startDate && endDate) {
      return { from: new Date(startDate), to: new Date(endDate) };
    }
    if (startDate) {
      return { from: new Date(startDate), to: undefined };
    }
    return undefined;
  });

  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(today, 365), [today]);

  const handleRangeSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    
    if (newRange?.from) {
      setStartDate(newRange.from.toISOString());
    } else {
      setStartDate(null);
    }
    
    if (newRange?.to) {
      setEndDate(newRange.to.toISOString());
    } else {
      setEndDate(null);
    }
  };

  const tripDuration = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [range]);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Travel Dates
        </p>
        <h2 className="font-serif text-2xl text-stone-900">When shall we expect you?</h2>
        <p className="mt-2 text-stone-500">Select your arrival and departure dates</p>
      </div>

      {/* Date summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`
          p-4 rounded-lg transition-all duration-200 border
          ${range?.from 
            ? 'bg-stone-50 border-stone-900' 
            : 'bg-white border-stone-200'
          }
        `}>
          <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-stone-400">Arrival</span>
          <p className={`mt-1 font-medium ${range?.from ? 'text-stone-900' : 'text-stone-400'}`}>
            {range?.from ? format(range.from, 'MMM d, yyyy') : 'Select date'}
          </p>
        </div>
        
        <div className={`
          p-4 rounded-lg transition-all duration-200 border
          ${range?.to 
            ? 'bg-stone-50 border-stone-900' 
            : 'bg-white border-stone-200'
          }
        `}>
          <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-stone-400">Departure</span>
          <p className={`mt-1 font-medium ${range?.to ? 'text-stone-900' : 'text-stone-400'}`}>
            {range?.to ? format(range.to, 'MMM d, yyyy') : 'Select date'}
          </p>
        </div>
      </div>

      {/* Calendar - Refined styling */}
      <div className="bg-white rounded-lg border border-stone-200/60 p-4 overflow-hidden">
        <style jsx global>{`
          .rdp-root {
            --rdp-accent-color: #1C1917;
            --rdp-accent-background-color: #1C1917;
            --rdp-range_start-color: white;
            --rdp-range_end-color: white;
            --rdp-range_middle-color: #44403c;
            --rdp-range_middle-background-color: #f5f5f4;
            margin: 0 auto;
            font-family: "Inter", system-ui, sans-serif;
          }
          .rdp-month_caption {
            font-family: "Playfair Display", Georgia, serif;
            font-weight: 500;
            font-size: 1.1rem;
            padding: 0.5rem 0;
            color: #1C1917;
          }
          .rdp-weekday {
            font-weight: 500;
            color: #a8a29e;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .rdp-day {
            border-radius: 0.375rem;
            font-weight: 400;
          }
          .rdp-day_button {
            width: 40px;
            height: 40px;
            border-radius: 0.375rem;
            font-size: 0.875rem;
          }
          .rdp-selected .rdp-day_button {
            background-color: #1C1917;
            color: white;
          }
          .rdp-range_middle .rdp-day_button {
            background-color: #f5f5f4;
            color: #44403c;
            border-radius: 0;
          }
          .rdp-range_start .rdp-day_button {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          .rdp-range_end .rdp-day_button {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
          .rdp-today:not(.rdp-selected) .rdp-day_button {
            border: 1px solid #1C1917;
            font-weight: 600;
          }
          .rdp-disabled .rdp-day_button {
            color: #d6d3d1;
          }
          .rdp-chevron {
            fill: #1C1917;
          }
          .rdp-button_previous,
          .rdp-button_next {
            border-radius: 0.375rem;
          }
          .rdp-button_previous:hover,
          .rdp-button_next:hover {
            background-color: #f5f5f4;
          }
        `}</style>
        
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleRangeSelect}
          disabled={{ before: today }}
          startMonth={today}
          endMonth={maxDate}
          showOutsideDays={false}
          fixedWeeks
        />
      </div>

      {/* Trip duration display */}
      {tripDuration > 0 && (
        <div className="mt-5 px-5 py-4 bg-stone-100 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
            <span className="text-stone-700">
              <span className="font-medium text-stone-900">{tripDuration}</span> {tripDuration === 1 ? 'day' : 'days'}
              {tripDuration > 1 && (
                <span className="text-stone-500"> · {tripDuration - 1} {tripDuration - 1 === 1 ? 'night' : 'nights'}</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Quick select options */}
      <div className="mt-5">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-3">
          Quick Select
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { label: 'Weekend', days: 2 },
            { label: '5 Days', days: 5 },
            { label: '1 Week', days: 7 },
            { label: '10 Days', days: 10 },
            { label: '2 Weeks', days: 14 },
          ].map((option) => (
            <button
              key={option.label}
              onClick={() => {
                const from = today;
                const to = addDays(today, option.days);
                handleRangeSelect({ from, to });
              }}
              className="px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
