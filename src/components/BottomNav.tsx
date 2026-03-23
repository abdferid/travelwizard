'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { ArrowRight, Loader2, Send } from 'lucide-react';

const TOTAL_STEPS = 10;

interface BottomNavProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function BottomNav({ onNext, onBack }: BottomNavProps) {
  const { 
    currentStep, 
    setCurrentStep, 
    getStepValidation, 
    markStepComplete,
    getTotalPrice,
    getTripDuration,
    submitBooking,
    isSubmitted,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = getStepValidation(currentStep);
  const isFirstStep = currentStep === 1;
  const isCheckoutStep = currentStep === 9;
  const isSuccessStep = currentStep === 10;
  const tripDuration = getTripDuration();
  const totalPrice = getTotalPrice();

  // Hide nav on success step
  if (isSuccessStep && isSubmitted) {
    return null;
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (!validation.isValid) return;
    
    markStepComplete(currentStep);
    
    // Handle submission on checkout step
    if (isCheckoutStep) {
      setIsSubmitting(true);
      try {
        await submitBooking();
        setCurrentStep(10); // Move to success step
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    if (onNext) {
      onNext();
    } else if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Submitting';
    if (isCheckoutStep) return 'Submit Request';
    if (currentStep === 8) return 'Review & Checkout';
    return 'Continue';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200/60">
      {/* Price preview (shown when we have some data) */}
      {(tripDuration > 0 || totalPrice > 0) && (
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
          {tripDuration > 0 && (
            <span className="text-xs font-medium tracking-wide text-stone-500">
              {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
            </span>
          )}
          {totalPrice > 0 && (
            <div className="text-right">
              <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-stone-400 mr-2">
                Est. Total
              </span>
              <span className="font-serif text-lg font-medium text-stone-900">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))] flex gap-3">
        {/* Back button */}
        <button
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className={`
            flex-1 py-3.5 px-6 rounded-lg font-medium text-sm tracking-wide
            transition-colors duration-200
            ${isFirstStep || isSubmitting
              ? 'text-stone-300 cursor-not-allowed' 
              : 'text-stone-600 hover:bg-stone-100'
            }
          `}
        >
          Back
        </button>
        
        {/* Next/Submit button */}
        <button
          onClick={handleNext}
          disabled={!validation.isValid || isSubmitting}
          className={`
            flex-[1.5] py-3.5 px-6 rounded-lg font-medium text-sm tracking-wide
            transition-all duration-200
            flex items-center justify-center gap-2
            ${validation.isValid && !isSubmitting
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
          ) : isCheckoutStep ? (
            <Send className="w-4 h-4" strokeWidth={1.5} />
          ) : null}
          {getButtonText()}
          {!isSubmitting && !isCheckoutStep && validation.isValid && (
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
      
      {/* Validation error message */}
      {!validation.isValid && validation.error && (
        <div className="absolute -top-10 left-5 right-5 text-center">
          <span className="inline-block px-4 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-full shadow-lg">
            {validation.error}
          </span>
        </div>
      )}
    </div>
  );
}
