'use client';

import { useRef } from 'react';
import { useBookingStore, DINING_EXPERIENCES } from '@/store/booking-store';
import { Clock, Check, ChevronLeft, ChevronRight, ChevronsRight, Utensils, Sparkles } from 'lucide-react';

// Type badge component
function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    signature: 'bg-amber-50 text-amber-700',
    cultural: 'bg-violet-50 text-violet-700',
    rooftop: 'bg-sky-50 text-sky-700',
    traditional: 'bg-emerald-50 text-emerald-700',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-medium tracking-wide uppercase ${styles[type] || 'bg-stone-100 text-stone-600'}`}>
      {type}
    </span>
  );
}

// Dining experience card
function DiningCard({ 
  experience, 
  isSelected, 
  onToggle,
  adults,
  children: childCount
}: { 
  experience: typeof DINING_EXPERIENCES[0]; 
  isSelected: boolean;
  onToggle: () => void;
  adults: number;
  children: number;
}) {
  const totalPrice = experience.price * adults + (experience.price * 0.5 * childCount);

  return (
    <div
      onClick={onToggle}
      className={`
        flex-shrink-0 w-[calc(100%-3rem)] max-w-[280px] bg-white rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 snap-start border
        ${isSelected 
          ? 'border-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)]' 
          : 'border-stone-200/60 hover:border-stone-300'
        }
      `}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <img
          src={experience.image}
          alt={experience.name}
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
        
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <TypeBadge type={experience.type} />
        </div>
        
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-lg font-medium text-white leading-tight">{experience.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-stone-500 line-clamp-2">{experience.description}</p>

        {/* Duration & highlights */}
        <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            {experience.duration}
          </span>
          {experience.highlights[0] && (
            <>
              <span className="text-stone-300">·</span>
              <span>{experience.highlights[0]}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex justify-between items-baseline">
          <div>
            <span className="font-serif text-xl font-medium text-stone-900">${experience.price}</span>
            <span className="text-sm text-stone-400">/person</span>
          </div>
          {isSelected && (
            <span className="text-sm font-medium text-stone-700">
              ${Math.round(totalPrice)} total
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
      Skip — no special dining
    </button>
  );
}

export default function StepDining() {
  const { 
    selectedDiningExperiences,
    toggleDiningExperience,
    getDiningExperiencesPrice,
    adults,
    children: childCount,
    skipStep,
    setCurrentStep,
    markStepComplete,
  } = useBookingStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const totalDiningPrice = getDiningExperiencesPrice();
  const selectedExperiences = DINING_EXPERIENCES.filter(e => selectedDiningExperiences.includes(e.id));

  const handleSkip = () => {
    skipStep(8);
    markStepComplete(8);
    setCurrentStep(9);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
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
          Culinary Experiences
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Taste of Azerbaijan</h2>
        <p className="mt-2 text-stone-500">Add memorable dining experiences to your journey</p>
      </div>

      {/* Selection summary */}
      {selectedExperiences.length > 0 && (
        <div className="mb-6 p-5 bg-stone-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium text-stone-900">
                  {selectedExperiences.length} experience{selectedExperiences.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-stone-600">
                  {selectedExperiences.map(e => e.name).join(', ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-xl font-medium text-stone-900">${Math.round(totalDiningPrice)}</p>
              <p className="text-xs text-stone-500">total</p>
            </div>
          </div>
        </div>
      )}

      {/* Carousel navigation */}
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
        {DINING_EXPERIENCES.map((experience) => (
          <DiningCard
            key={experience.id}
            experience={experience}
            isSelected={selectedDiningExperiences.includes(experience.id)}
            onToggle={() => toggleDiningExperience(experience.id)}
            adults={adults}
            children={childCount}
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

      {/* Feature callout */}
      <div className="mt-5 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <h4 className="font-medium text-amber-900 text-sm">Curated by Local Experts</h4>
            <p className="mt-1 text-xs text-amber-800">
              Each experience features authentic cuisine, live cultural elements, and exclusive access not available to regular diners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
