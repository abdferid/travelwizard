'use client';

import { useBookingStore } from '@/store/booking-store';

const STEP_LABELS = [
  'Travelers',
  'Dates',
  'Transport',
  'Guide',
  'Tours',
  'Itinerary',
  'Hotel',
  'Dining',
  'Details',
  'Confirm',
];

export default function ProgressBar() {
  const { currentStep, isSubmitted } = useBookingStore();

  // Hide progress bar on success screen
  if (currentStep === 10 && isSubmitted) {
    return null;
  }

  // Calculate progress percentage
  const progressPercent = ((currentStep - 1) / (STEP_LABELS.length - 1)) * 100;

  return (
    <div className="w-full px-5 pb-4">
      {/* Step indicator text */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400">
            Step {currentStep}
          </span>
          <span className="text-xs text-stone-300">·</span>
          <span className="text-sm font-medium text-stone-700">
            {STEP_LABELS[currentStep - 1]}
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-stone-400">
          {currentStep}/{STEP_LABELS.length}
        </span>
      </div>

      {/* Progress bar - thin elegant line */}
      <div className="relative h-[2px] bg-stone-200 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-stone-900 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
