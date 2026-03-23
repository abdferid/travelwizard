'use client';

import { useBookingStore, GUIDE_CERTIFICATION_OPTIONS, GUIDE_GENDER_OPTIONS } from '@/store/booking-store';
import { Award, ChevronsRight, Info, Check } from 'lucide-react';

interface ChipGroupProps {
  title: string;
  subtitle?: string;
  options: { id: string; label: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

function ChipGroup({ title, subtitle, options, selectedId, onSelect, disabled }: ChipGroupProps) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <div className="mb-4">
        <h3 className="font-medium text-stone-900">{title}</h3>
        {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`
                px-5 py-3 rounded-lg font-medium text-sm
                transition-colors duration-200
                ${isSelected
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
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
      Skip — decide later
    </button>
  );
}

export default function StepGuides() {
  const { 
    guideCertification, 
    guideGender, 
    setGuideCertification, 
    setGuideGender,
    getTripDuration,
    skipStep,
    setCurrentStep,
    markStepComplete,
  } = useBookingStore();

  const needsGuide = guideCertification === 'certified';
  const tripDuration = getTripDuration();
  const guidePrice = needsGuide ? 50 * Math.max(1, tripDuration) : 0;

  const handleCertificationSelect = (id: string) => {
    setGuideCertification(id);
    // Clear gender preference if no guide needed
    if (id !== 'certified') {
      setGuideGender(null);
    }
  };

  const handleSkip = () => {
    setGuideCertification(null);
    setGuideGender(null);
    skipStep(4);
    markStepComplete(4);
    setCurrentStep(5);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Local Expertise
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Would you like a private guide?</h2>
        <p className="mt-2 text-stone-500">Enhance your experience with local knowledge</p>
      </div>

      <div className="space-y-6">
        {/* Guide certification group */}
        <div className="bg-white rounded-lg border border-stone-200/60 p-5">
          <ChipGroup
            title="Guide Preference"
            subtitle="Choose your experience style"
            options={GUIDE_CERTIFICATION_OPTIONS}
            selectedId={guideCertification}
            onSelect={handleCertificationSelect}
          />
          
          {needsGuide && (
            <div className="mt-5 pt-5 border-t border-stone-100">
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Award className="w-4 h-4 text-stone-600" strokeWidth={1.5} />
                <span>
                  <span className="font-medium">$50/day</span> for certified guide
                  {tripDuration > 0 && (
                    <span className="text-stone-500"> · ${guidePrice} total</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Guide gender group - only show if certified guide selected */}
        <div className={`
          bg-white rounded-lg border border-stone-200/60 p-5
          transition-all duration-300
          ${needsGuide ? 'opacity-100' : 'opacity-40'}
        `}>
          <ChipGroup
            title="Guide Gender"
            subtitle={needsGuide ? "Select your preference" : "Available with certified guide"}
            options={GUIDE_GENDER_OPTIONS}
            selectedId={guideGender}
            onSelect={setGuideGender}
            disabled={!needsGuide}
          />
        </div>
      </div>

      {/* Skip button */}
      <div className="mt-6">
        <SkipButton onSkip={handleSkip} />
      </div>

      {/* Info cards */}
      {guideCertification && (
        <div className="mt-6 space-y-3">
          {guideCertification === 'certified' && (
            <div className="px-5 py-4 bg-stone-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-stone-700" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900">Certified Guide Benefits</h4>
                  <ul className="mt-2 text-sm text-stone-600 space-y-1.5">
                    <li>· Licensed and background-checked professionals</li>
                    <li>· Deep local knowledge and historical expertise</li>
                    <li>· Multilingual capabilities available</li>
                    <li>· Flexible itinerary adjustments on the go</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {(guideCertification === 'not-necessary' || guideCertification === 'no-need') && (
            <div className="px-5 py-4 bg-stone-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900">Self-Guided Experience</h4>
                  <p className="mt-1 text-sm text-stone-600">
                    You'll receive detailed itineraries, curated recommendations, and audio guides to explore at your own pace.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
