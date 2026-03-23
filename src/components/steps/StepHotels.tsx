'use client';

import { useRef } from 'react';
import { useBookingStore, HOTELS_DATA } from '@/store/booking-store';
import { Star, MapPin, Check, ChevronLeft, ChevronRight, ChevronsRight, Info } from 'lucide-react';

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// Hotel card component - taller aspect ratio for luxury feel
function HotelCard({ 
  hotel, 
  isSelected, 
  onSelect,
  nights 
}: { 
  hotel: typeof HOTELS_DATA[0]; 
  isSelected: boolean;
  onSelect: () => void;
  nights: number;
}) {
  const totalPrice = hotel.pricePerNight * Math.max(1, nights);

  return (
    <div
      onClick={onSelect}
      className={`
        flex-shrink-0 w-[calc(100%-3rem)] max-w-[300px] bg-white rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 snap-start border
        ${isSelected 
          ? 'border-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)]' 
          : 'border-stone-200/60 hover:border-stone-300'
        }
      `}
    >
      {/* Image - taller aspect ratio */}
      <div className="relative aspect-[4/5]">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
        )}
        
        {/* Hotel info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <StarRating rating={hotel.rating} />
          <h3 className="font-serif text-lg font-medium text-white mt-2">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
            <MapPin className="w-3 h-3" strokeWidth={1.5} />
            <span>{hotel.location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-stone-500 line-clamp-2">{hotel.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex justify-between items-baseline">
          <div>
            <span className="font-serif text-xl font-medium text-stone-900">${hotel.pricePerNight}</span>
            <span className="text-sm text-stone-400">/night</span>
          </div>
          {nights > 0 && (
            <span className="text-sm font-medium text-stone-700">
              ${totalPrice} total
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Skip button component
function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      onClick={onSkip}
      className="w-full py-3.5 px-4 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors flex items-center justify-center gap-2 text-sm"
    >
      <ChevronsRight className="w-4 h-4" strokeWidth={1.5} />
      Skip — I'll arrange my own accommodation
    </button>
  );
}

export default function StepHotels() {
  const { 
    selectedHotel, 
    setSelectedHotel, 
    getTripDuration,
    skipStep,
    setCurrentStep,
    markStepComplete,
  } = useBookingStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const nights = Math.max(0, getTripDuration() - 1);
  const selectedHotelData = HOTELS_DATA.find(h => h.id === selectedHotel);
  const totalPrice = selectedHotelData ? selectedHotelData.pricePerNight * Math.max(1, nights) : 0;

  const handleSkip = () => {
    setSelectedHotel(null);
    skipStep(7);
    markStepComplete(7);
    setCurrentStep(8);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Accommodation
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Where will you stay?</h2>
        <p className="mt-2 text-stone-500">
          {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''} accommodation` : 'Select your hotel'}
        </p>
      </div>

      {/* Selection summary */}
      {selectedHotel && selectedHotelData && (
        <div className="mb-6 p-5 bg-stone-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img src={selectedHotelData.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-stone-900">{selectedHotelData.name}</p>
                <p className="text-sm text-stone-600">${selectedHotelData.pricePerNight}/night</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-xl font-medium text-stone-900">${totalPrice}</p>
              <p className="text-xs text-stone-500">{nights} night{nights > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* Carousel navigation buttons */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={() => scroll('left')}
          className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Horizontal carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-5 px-5"
      >
        {HOTELS_DATA.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isSelected={selectedHotel === hotel.id}
            onSelect={() => setSelectedHotel(hotel.id)}
            nights={nights}
          />
        ))}
        {/* Spacer for peek effect */}
        <div className="flex-shrink-0 w-4" />
      </div>

      {/* Scroll hint */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-stone-400">
        <span>Swipe to explore more</span>
      </div>

      {/* Skip button */}
      <div className="mt-6">
        <SkipButton onSkip={handleSkip} />
      </div>

      {/* Info note */}
      <div className="mt-5 p-4 bg-stone-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm text-stone-600">
            Rates are per room. For larger groups, additional rooms will be arranged. Final configuration confirmed by our team.
          </p>
        </div>
      </div>
    </div>
  );
}
