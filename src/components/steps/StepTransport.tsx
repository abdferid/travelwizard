'use client';

import { useBookingStore, TRANSPORT_OPTIONS } from '@/store/booking-store';
import { Car, Users, Check, ChevronsRight, AlertCircle } from 'lucide-react';

// Skip button component
function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      onClick={onSkip}
      className="w-full py-3.5 px-4 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors flex items-center justify-center gap-2 text-sm"
    >
      <ChevronsRight className="w-4 h-4" strokeWidth={1.5} />
      Skip — I'll arrange my own transport
    </button>
  );
}

export default function StepTransport() {
  const { 
    selectedTransport, 
    setSelectedTransport, 
    adults, 
    children,
    getTripDuration,
    skipStep,
    setCurrentStep,
    markStepComplete,
  } = useBookingStore();
  
  const totalPeople = adults + children;
  const tripDuration = getTripDuration();

  const handleSkip = () => {
    setSelectedTransport(null);
    skipStep(3);
    markStepComplete(3);
    setCurrentStep(4);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Transportation
        </p>
        <h2 className="font-serif text-2xl text-stone-900">How would you like to travel?</h2>
        <p className="mt-2 text-stone-500">
          Select a vehicle for {totalPeople} {totalPeople === 1 ? 'traveler' : 'travelers'}
        </p>
      </div>

      <div className="space-y-3">
        {TRANSPORT_OPTIONS.map((transport) => {
          const isSelected = selectedTransport === transport.id;
          const hasEnoughCapacity = transport.capacity >= totalPeople;
          const priceForTrip = transport.pricePerDay * Math.max(1, tripDuration);
          
          return (
            <button
              key={transport.id}
              onClick={() => setSelectedTransport(transport.id)}
              disabled={!hasEnoughCapacity}
              className={`
                w-full text-left p-5 rounded-lg transition-all duration-200 border
                ${isSelected 
                  ? 'bg-stone-50 border-stone-900' 
                  : hasEnoughCapacity
                    ? 'bg-white border-stone-200/60 hover:border-stone-300'
                    : 'bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Vehicle icon */}
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}
                `}>
                  <Car className="w-6 h-6" strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`font-medium ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>
                        {transport.title}
                      </h3>
                      <p className="text-sm text-stone-500 mt-0.5">{transport.description}</p>
                    </div>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      </div>
                    )}
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium
                      ${hasEnoughCapacity 
                        ? 'bg-stone-100 text-stone-600' 
                        : 'bg-red-50 text-red-600'
                      }
                    `}>
                      <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {hasEnoughCapacity 
                        ? `Up to ${transport.capacity}` 
                        : `Max ${transport.capacity}`
                      }
                    </span>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium text-stone-900">
                        ${transport.pricePerDay}
                      </span>
                      <span className="text-xs text-stone-400">/day</span>
                    </div>
                    
                    {tripDuration > 0 && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span className="text-sm font-medium text-stone-700">
                          ${priceForTrip} total
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Skip button */}
      <div className="mt-6">
        <SkipButton onSkip={handleSkip} />
      </div>

      {/* Capacity warning */}
      {!TRANSPORT_OPTIONS.some(t => t.capacity >= totalPeople) && (
        <div className="mt-5 px-5 py-4 bg-amber-50 border border-amber-200/60 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-amber-800">
              Your group exceeds our largest vehicle capacity. Please contact us for custom arrangements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
