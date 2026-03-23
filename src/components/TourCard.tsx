'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useBookingStore, Tour, Destination } from '@/store/booking-store';
import { 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  Clock,
  MapPin,
  Camera
} from 'lucide-react';

interface TourCardProps {
  tour: Tour;
}

// Toggle Switch Component - refined
function ToggleSwitch({ 
  checked, 
  onChange, 
  disabled = false 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
        focus-visible:ring-stone-900 focus-visible:ring-offset-2
        ${checked ? 'bg-stone-900' : 'bg-stone-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full
          bg-white shadow-sm transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0.5'}
          mt-0.5
        `}
      />
    </button>
  );
}

// Image Carousel Component - refined
function ImageCarousel({ 
  images, 
  isActive,
  onClose 
}: { 
  images: string[]; 
  isActive: boolean;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!isActive) return null;

  return (
    <div className="relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-700 hover:bg-white transition-colors shadow-sm"
        aria-label="Close gallery"
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>

      {/* Image container */}
      <div 
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="relative aspect-[4/5]">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-stone-700" strokeWidth={1.5} />
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-stone-700" strokeWidth={1.5} />
        </button>
      )}

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              h-1.5 rounded-full transition-all duration-200
              ${index === currentIndex 
                ? 'bg-white w-5' 
                : 'bg-white/50 w-1.5 hover:bg-white/75'
              }
            `}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-stone-700 text-xs font-medium shadow-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// Destination Item Component - refined
function DestinationItem({ 
  destination, 
  tourId,
  adults,
  children: childCount
}: { 
  destination: Destination; 
  tourId: string;
  adults: number;
  children: number;
}) {
  const { isDestinationSelected, toggleDestination } = useBookingStore();
  const isSelected = isDestinationSelected(tourId, destination.id);
  
  const totalPrice = destination.isFree 
    ? 0 
    : ((destination.pricePerAdult ?? 0) * adults) + ((destination.pricePerChild ?? 0) * childCount);

  return (
    <div 
      className={`
        flex items-start justify-between gap-4 p-4 rounded-lg
        transition-all duration-200 border
        ${isSelected ? 'bg-stone-50 border-stone-300' : 'bg-white border-stone-100'}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-stone-900">{destination.name}</h4>
          {destination.isFree ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-stone-100 text-stone-600">
              Included
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-amber-50 text-amber-700">
              +${destination.pricePerAdult}/person
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-stone-500 leading-relaxed line-clamp-2">
          {destination.description}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            {destination.duration}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <ToggleSwitch
          checked={isSelected}
          onChange={() => toggleDestination(tourId, destination.id)}
        />
        {isSelected && totalPrice > 0 && (
          <span className="text-sm font-medium text-stone-700">
            +${totalPrice}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TourCard({ tour }: TourCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  const { 
    isTourSelected, 
    selectTour, 
    deselectTour, 
    adults, 
    children: childCount,
    getSelectedDestinations
  } = useBookingStore();
  
  const isSelected = isTourSelected(tour.id);
  const selectedDestinations = getSelectedDestinations(tour.id);

  // Calculate content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, selectedDestinations]);

  const handleSelectTour = () => {
    if (isSelected) {
      deselectTour(tour.id);
      setIsExpanded(false);
    } else {
      selectTour(tour.id);
      setIsExpanded(true);
    }
  };

  const handleViewGallery = () => {
    setShowGallery(!showGallery);
  };

  // Count included and paid selected destinations
  const includedCount = tour.destinations.filter(d => d.isFree && selectedDestinations.includes(d.id)).length;
  const paidCount = selectedDestinations.length - includedCount;

  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden
        transition-all duration-300 ease-out border
        ${isSelected 
          ? 'border-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)]' 
          : 'border-stone-200/60 hover:border-stone-300'
        }
      `}
    >
      {/* Hero Image / Gallery */}
      {showGallery ? (
        <ImageCarousel 
          images={tour.galleryImages} 
          isActive={showGallery}
          onClose={() => setShowGallery(false)}
        />
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay - smooth editorial style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Duration & Difficulty badges - refined */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded text-xs font-medium text-stone-700 shadow-sm">
              {tour.duration}
            </span>
            <span className={`
              px-3 py-1.5 backdrop-blur-sm rounded text-xs font-medium shadow-sm
              ${tour.difficulty === 'Easy' ? 'bg-emerald-50/95 text-emerald-700' :
                tour.difficulty === 'Moderate' ? 'bg-amber-50/95 text-amber-700' :
                'bg-rose-50/95 text-rose-700'}
            `}>
              {tour.difficulty}
            </span>
          </div>

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-4 right-4 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
          )}

          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/70 mb-1">
              {tour.destinations.length} Destinations
            </p>
            <h3 className="font-serif text-2xl font-medium text-white leading-tight">
              {tour.title}
            </h3>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
          {tour.description}
        </p>
        
        {/* Stats row when selected */}
        {isSelected && (
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-stone-700">
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              {selectedDestinations.length} selected
            </span>
            {paidCount > 0 && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-amber-700">
                  {paidCount} extra{paidCount > 1 ? 's' : ''} added
                </span>
              </>
            )}
          </div>
        )}

        {/* Action buttons - refined */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleViewGallery}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-sm
              transition-colors duration-200 flex items-center justify-center gap-2
              ${showGallery 
                ? 'bg-stone-100 text-stone-700' 
                : 'border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              }
            `}
          >
            <Camera className="w-4 h-4" strokeWidth={1.5} />
            {showGallery ? 'Close' : 'Gallery'}
          </button>
          
          <button
            onClick={handleSelectTour}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-sm
              transition-colors duration-200
              ${isSelected
                ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                : 'bg-stone-900 text-white hover:bg-stone-800'
              }
            `}
          >
            {isSelected ? 'Remove' : 'Select Tour'}
          </button>
        </div>
      </div>

      {/* Expandable Destinations Section */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ 
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div ref={contentRef}>
          <div className="border-t border-stone-100">
            {/* Destinations header */}
            <div className="px-5 py-4 bg-stone-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-0.5">
                  Customize
                </p>
                <h4 className="font-medium text-stone-800">Destinations</h4>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                aria-label="Collapse destinations"
              >
                <ChevronUp className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            
            {/* Destinations list */}
            <div className="p-5 space-y-3">
              {tour.destinations.map((destination) => (
                <DestinationItem
                  key={destination.id}
                  destination={destination}
                  tourId={tour.id}
                  adults={adults}
                  children={childCount}
                />
              ))}
            </div>

            {/* Summary footer */}
            {selectedDestinations.length > 0 && (
              <div className="px-5 py-4 bg-stone-50 border-t border-stone-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">
                    {selectedDestinations.length} destination{selectedDestinations.length > 1 ? 's' : ''} selected
                  </span>
                  {paidCount > 0 && (
                    <span className="font-medium text-stone-900">
                      View pricing in summary
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsed state indicator when selected but not expanded */}
      {isSelected && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full px-5 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <span>Customize ({selectedDestinations.length} selected)</span>
          <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
