'use client';

import { useBookingStore, TOURS_DATA } from '@/store/booking-store';
import TourCard from '@/components/TourCard';
import { MapPin, Check } from 'lucide-react';

export default function StepTours() {
  const { selectedTours, getTourExtrasPrice } = useBookingStore();
  
  const selectedCount = selectedTours.length;
  const extrasPrice = getTourExtrasPrice();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Experiences
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Curate your journey</h2>
        <p className="mt-2 text-stone-500">Select one or more experiences to include</p>
      </div>

      {/* Selection summary */}
      {selectedCount > 0 && (
        <div className="mb-6 p-5 bg-stone-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium text-stone-900">
                  {selectedCount} {selectedCount === 1 ? 'experience' : 'experiences'} selected
                </p>
                {extrasPrice > 0 && (
                  <p className="text-sm text-stone-600">
                    +${extrasPrice} in optional extras
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tour cards */}
      <div className="space-y-5">
        {TOURS_DATA.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {/* Helper text */}
      <div className="mt-6 flex items-start gap-3 px-1">
        <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="text-sm text-stone-500">
          Each tour includes several destinations. After selecting, customize which stops to include for a personalized itinerary.
        </p>
      </div>
    </div>
  );
}
