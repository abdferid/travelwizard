'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { RotateCcw } from 'lucide-react';
import ProgressBar from './ProgressBar';
import BottomNav from './BottomNav';
import StepPartySize from './steps/StepPartySize';
import StepDates from './steps/StepDates';
import StepTransport from './steps/StepTransport';
import StepGuides from './steps/StepGuides';
import StepTours from './steps/StepTours';
import StepItinerary from './steps/StepItinerary';
import StepHotels from './steps/StepHotels';
import StepDining from './steps/StepDining';
import StepCheckout from './steps/StepCheckout';
import StepSuccess from './steps/StepSuccess';

const TOTAL_STEPS = 10;

export default function BookingWizard() {
  const { currentStep, isSubmitted } = useBookingStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch with localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render loading state until client-side hydration completes
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
          <p className="text-stone-500 text-sm tracking-wide">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPartySize />;
      case 2:
        return <StepDates />;
      case 3:
        return <StepTransport />;
      case 4:
        return <StepGuides />;
      case 5:
        return <StepTours />;
      case 6:
        return <StepItinerary />;
      case 7:
        return <StepHotels />;
      case 8:
        return <StepDining />;
      case 9:
        return <StepCheckout />;
      case 10:
        return <StepSuccess />;
      default:
        return <StepPartySize />;
    }
  };

  // Success step has different layout
  const isSuccessStep = currentStep === 10 && isSubmitted;

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Sticky header - hidden on success */}
      {!isSuccessStep && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
          <div className="max-w-lg mx-auto">
            {/* Logo/Title area */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-1">
                  Azerbaijan Tours
                </p>
                <h1 className="text-xl font-serif font-medium text-stone-900 tracking-tight">
                  Craft Your Journey
                </h1>
              </div>
              <ResetButton />
            </div>
            
            {/* Progress bar */}
            <ProgressBar />
          </div>
        </header>
      )}

      {/* Main content area */}
      <main className={`flex-1 max-w-lg mx-auto w-full px-5 py-8 ${isSuccessStep ? 'pt-10' : 'pb-44'}`}>
        {renderStep()}
      </main>

      {/* Fixed bottom navigation - hidden on success */}
      {!isSuccessStep && (
        <div className="max-w-lg mx-auto w-full">
          <BottomNav />
        </div>
      )}
    </div>
  );
}

function ResetButton() {
  const { resetBooking, isSubmitted } = useBookingStore();
  const [showConfirm, setShowConfirm] = useState(false);

  // Hide on success
  if (isSubmitted) return null;

  const handleReset = () => {
    resetBooking();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
      aria-label="Reset booking"
    >
      <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
    </button>
  );
}
