'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Check, MessageCircle, Mail, Calendar, RefreshCw } from 'lucide-react';

// Confetti piece component
function ConfettiPiece({ index }: { index: number }) {
  const colors = ['#B55A42', '#1C3F35', '#D4856F', '#2A5A4A', '#78716c', '#a8a29e'];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 2.5 + Math.random() * 1.5;
  
  return (
    <div
      className="absolute w-2 h-2 rounded-sm animate-confetti"
      style={{
        backgroundColor: color,
        left: `${left}%`,
        top: '-10px',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
}

// Timeline item component
function TimelineItem({ 
  step, 
  title, 
  description,
  isLast = false 
}: { 
  step: number; 
  title: string; 
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-sm font-medium text-stone-700">
          {step}
        </div>
        {!isLast && <div className="w-px h-full bg-stone-200 my-2" />}
      </div>
      <div className="pb-6">
        <h4 className="font-medium text-stone-900">{title}</h4>
        <p className="text-sm text-stone-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function StepSuccess() {
  const { submissionId, resetBooking, contactInfo } = useBookingStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartNew = () => {
    resetBooking();
  };

  const whatsappNumber = '+994501234567'; // Company WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Hi! I just submitted a booking request (Ref: ${submissionId}). I'd like to confirm my trip details.`
  );

  return (
    <div className="animate-fade-in-up text-center">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      {/* Success icon */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto bg-stone-900 rounded-2xl flex items-center justify-center animate-scale-in shadow-lg">
          <Check className="w-10 h-10 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Request Submitted
        </p>
        <h1 className="font-serif text-3xl text-stone-900 mb-3">
          Thank You, {contactInfo.firstName || 'Traveler'}!
        </h1>
        <p className="text-stone-500 max-w-sm mx-auto">
          Your Azerbaijan journey is being prepared. We'll be in touch shortly.
        </p>
      </div>

      {/* Booking reference card */}
      <div className="bg-stone-100 rounded-lg p-6 mb-8 max-w-sm mx-auto">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-2">
          Booking Reference
        </p>
        <p className="font-mono text-2xl font-medium text-stone-900 tracking-wider">
          {submissionId || 'BK-000000'}
        </p>
        <p className="text-xs text-stone-500 mt-3">
          Save this for your records
        </p>
      </div>

      {/* What happens next */}
      <div className="bg-white rounded-lg border border-stone-200/60 p-6 mb-8 text-left max-w-sm mx-auto">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-5">
          What Happens Next
        </p>
        
        <div>
          <TimelineItem
            step={1}
            title="Review Your Request"
            description="Our team reviews your preferences within 24 hours"
          />
          <TimelineItem
            step={2}
            title="Personalized Itinerary"
            description="Receive a detailed day-by-day plan on WhatsApp"
          />
          <TimelineItem
            step={3}
            title="Confirm & Prepare"
            description="Finalize details and prepare for your journey"
            isLast
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 max-w-sm mx-auto">
        {/* WhatsApp CTA - reserved green */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#1da851] transition-colors"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          Chat on WhatsApp
        </a>
        
        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`mailto:support@azerbaijantours.com?subject=Booking ${submissionId}`}
            className="flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-200 transition-colors"
          >
            <Mail className="w-4 h-4" strokeWidth={1.5} />
            Email Us
          </a>
          <button
            onClick={handleStartNew}
            className="flex items-center justify-center gap-2 py-3 border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            New Booking
          </button>
        </div>
      </div>

      {/* Support note */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
          <span className="text-stone-500">Typical response time: 2-4 hours</span>
        </div>
      </div>
    </div>
  );
}
