'use client';

import { useBookingStore } from '@/store/booking-store';
import { Users, Minus, Plus, AlertCircle } from 'lucide-react';

interface CounterRowProps {
  label: string;
  sublabel: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue?: number;
  maxValue?: number;
}

function CounterRow({ 
  label, 
  sublabel, 
  value, 
  onIncrement, 
  onDecrement,
  minValue = 0,
  maxValue = 20 
}: CounterRowProps) {
  const canDecrement = value > minValue;
  const canIncrement = value < maxValue;

  return (
    <div className="flex items-center justify-between py-6 border-b border-stone-100 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-base font-medium text-stone-900">{label}</span>
        <span className="text-sm text-stone-500">{sublabel}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Decrement button */}
        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label={`Decrease ${label}`}
          className={`
            w-11 h-11 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${canDecrement 
              ? 'bg-stone-100 text-stone-700 hover:bg-stone-200' 
              : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }
          `}
        >
          <Minus className="w-4 h-4" strokeWidth={1.5} />
        </button>
        
        {/* Value display */}
        <span className="w-8 text-center text-xl font-medium text-stone-900 tabular-nums">
          {value}
        </span>
        
        {/* Increment button */}
        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label={`Increase ${label}`}
          className={`
            w-11 h-11 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${canIncrement 
              ? 'bg-stone-900 text-white hover:bg-stone-800' 
              : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }
          `}
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default function StepPartySize() {
  const { adults, children, setAdults, setChildren } = useBookingStore();
  const totalPeople = adults + children;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Travel Party
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Who's joining you?</h2>
        <p className="mt-2 text-stone-500">Tell us about your travel companions</p>
      </div>
      
      <div className="bg-white rounded-lg border border-stone-200/60 p-5">
        <CounterRow
          label="Adults"
          sublabel="Ages 13 or above"
          value={adults}
          onIncrement={() => setAdults(adults + 1)}
          onDecrement={() => setAdults(adults - 1)}
          minValue={1}
          maxValue={20}
        />
        
        <CounterRow
          label="Children"
          sublabel="Ages 2–12"
          value={children}
          onIncrement={() => setChildren(children + 1)}
          onDecrement={() => setChildren(children - 1)}
          minValue={0}
          maxValue={20}
        />
      </div>
      
      {/* Summary card */}
      <div className="mt-5 px-5 py-4 bg-stone-100 rounded-lg">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
          <span className="text-stone-700">
            <span className="font-medium text-stone-900">{totalPeople}</span> {totalPeople === 1 ? 'traveler' : 'travelers'} total
          </span>
        </div>
      </div>

      {totalPeople > 12 && (
        <div className="mt-4 px-5 py-4 bg-amber-50 border border-amber-200/60 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-amber-800">
              Large groups may require multiple vehicles. We'll present suitable options in the transport selection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
