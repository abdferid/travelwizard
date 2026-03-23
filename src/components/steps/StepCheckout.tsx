'use client';

import { useState } from 'react';
import { 
  useBookingStore, 
  TOURS_DATA, 
  HOTELS_DATA, 
  TRANSPORT_OPTIONS,
  DINING_EXPERIENCES,
  COUNTRY_CODES 
} from '@/store/booking-store';
import { Calendar, Users, Car, User, Building2, UtensilsCrossed, ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react';

// Elegant input with bottom border style
function ElegantInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  prefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  prefix?: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative">
      <div className={`
        relative bg-stone-100 rounded-t-lg border-b-2 transition-all duration-200
        ${error ? 'border-red-400' : isFocused ? 'border-stone-900' : 'border-stone-300'}
      `}>
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
            {prefix}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 pt-6 pb-2 bg-transparent text-stone-900 text-base
            focus:outline-none
            ${prefix ? 'pl-24' : ''}
          `}
        />
        <label
          htmlFor={id}
          className={`
            absolute transition-all duration-200 pointer-events-none
            ${prefix ? 'left-24' : 'left-4'}
            ${isActive 
              ? 'top-2 text-[10px] font-medium tracking-wide uppercase text-stone-500' 
              : 'top-1/2 -translate-y-1/2 text-base text-stone-400'
            }
          `}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

// Elegant textarea
function ElegantTextarea({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative">
      <div className={`
        relative bg-stone-100 rounded-t-lg border-b-2 transition-all duration-200
        ${isFocused ? 'border-stone-900' : 'border-stone-300'}
      `}>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={3}
          className="w-full px-4 pt-6 pb-2 bg-transparent text-stone-900 text-base focus:outline-none resize-none"
        />
        <label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isActive 
              ? 'top-2 text-[10px] font-medium tracking-wide uppercase text-stone-500' 
              : 'top-4 text-base text-stone-400'
            }
          `}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

// Native country code selector
function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent text-sm font-medium text-stone-700 pr-5 cursor-pointer focus:outline-none"
      >
        {COUNTRY_CODES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.code}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-0 w-3.5 h-3.5 text-stone-400 pointer-events-none" strokeWidth={1.5} />
    </div>
  );
}

// Trip summary section
function TripSummary() {
  const {
    adults,
    children,
    startDate,
    endDate,
    getTripDuration,
    selectedTransport,
    guideCertification,
    selectedTours,
    itineraryOrder,
    selectedHotel,
    selectedDiningExperiences,
    getTourExtrasPrice,
    getHotelPrice,
    getDiningExperiencesPrice,
    getTotalPrice,
    skippedSteps,
  } = useBookingStore();

  const duration = getTripDuration();
  const transport = TRANSPORT_OPTIONS.find(t => t.id === selectedTransport);
  const hotel = HOTELS_DATA.find(h => h.id === selectedHotel);
  const nights = Math.max(0, duration - 1);

  // Calculate individual prices
  const transportPrice = transport ? transport.pricePerDay * Math.max(1, duration) : 0;
  const guidePrice = guideCertification === 'certified' ? 50 * Math.max(1, duration) : 0;
  const tourExtrasPrice = getTourExtrasPrice();
  const hotelPrice = getHotelPrice();
  const diningPrice = getDiningExperiencesPrice();
  const totalPrice = getTotalPrice();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-8 space-y-5">
      {/* Trip Overview Card */}
      <div className="bg-stone-100 rounded-lg p-5">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-4">
          Trip Summary
        </p>
        
        {/* Date & Travelers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400">Dates</p>
            </div>
            <p className="font-medium text-stone-900 text-sm">
              {formatDate(startDate)} – {formatDate(endDate)}
            </p>
            <p className="text-xs text-stone-500 mt-1">{duration} days</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400">Travelers</p>
            </div>
            <p className="font-medium text-stone-900 text-sm">
              {adults} adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}
            </p>
            <p className="text-xs text-stone-500 mt-1">{adults + children} total</p>
          </div>
        </div>

        {/* Day-by-day Timeline */}
        <div className="mb-4">
          <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400 mb-2">Itinerary</p>
          <div className="space-y-2">
            {itineraryOrder.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium ${
                  item.isFreeDay ? 'bg-stone-200 text-stone-700' : 'bg-stone-900 text-white'
                }`}>
                  {item.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm truncate">{item.tourTitle}</p>
                  {!item.isFreeDay && item.destinations.length > 0 && (
                    <p className="text-xs text-stone-500 truncate">
                      {item.destinations.length} destination{item.destinations.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport & Guide */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400">Transport</p>
            </div>
            {transport ? (
              <p className="font-medium text-stone-900 text-sm">{transport.title}</p>
            ) : (
              <p className="text-sm text-stone-400 italic">Skipped</p>
            )}
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400">Guide</p>
            </div>
            <p className="font-medium text-stone-900 text-sm">
              {guideCertification === 'certified' ? 'Certified Guide' : 
               skippedSteps.includes(4) ? 'Skipped' : 'Self-Guided'}
            </p>
          </div>
        </div>

        {/* Hotel */}
        {hotel && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400">Accommodation</p>
            </div>
            <div className="flex items-center gap-4">
              <img src={hotel.image} alt={hotel.name} className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-stone-900">{hotel.name}</p>
                <p className="text-sm text-stone-500">{nights} night{nights > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dining Experiences */}
        {selectedDiningExperiences.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-wide uppercase text-stone-400">Dining</p>
            </div>
            <div className="space-y-1">
              {selectedDiningExperiences.map(expId => {
                const exp = DINING_EXPERIENCES.find(e => e.id === expId);
                return exp ? (
                  <p key={expId} className="text-sm text-stone-700">• {exp.name}</p>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Itemized Receipt */}
      <div className="bg-white rounded-lg border border-stone-200/60 p-5">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-4">
          Price Breakdown
        </p>
        
        <div className="space-y-3">
          {/* Base Tours */}
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Tours ({selectedTours.length})</span>
            <span className="text-stone-800">Included</span>
          </div>
          
          {/* Tour Extras */}
          {tourExtrasPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Tour Add-ons</span>
              <span className="text-stone-800">+${tourExtrasPrice}</span>
            </div>
          )}
          
          {/* Transport */}
          {transportPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">{transport?.title} ({duration} days)</span>
              <span className="text-stone-800">+${transportPrice}</span>
            </div>
          )}
          
          {/* Guide */}
          {guidePrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Certified Guide ({duration} days)</span>
              <span className="text-stone-800">+${guidePrice}</span>
            </div>
          )}
          
          {/* Hotel */}
          {hotelPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">{hotel?.name} ({nights} nights)</span>
              <span className="text-stone-800">+${hotelPrice}</span>
            </div>
          )}
          
          {/* Dining */}
          {diningPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Dining Experiences ({selectedDiningExperiences.length})</span>
              <span className="text-stone-800">+${Math.round(diningPrice)}</span>
            </div>
          )}
          
          {/* Divider & Total */}
          <div className="border-t border-stone-200 pt-4 mt-4">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-stone-900">Estimated Total</span>
              <span className="font-serif text-2xl font-medium text-stone-900">${totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">Final price confirmed after review</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StepCheckout() {
  const { 
    contactInfo, 
    updateContactInfo, 
    getStepValidation,
  } = useBookingStore();

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const validation = getStepValidation(9);

  const handleFieldChange = (field: keyof typeof contactInfo, value: string) => {
    updateContactInfo(field, value);
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    
    switch (field) {
      case 'firstName':
        return !contactInfo.firstName.trim() ? 'First name is required' : undefined;
      case 'lastName':
        return !contactInfo.lastName.trim() ? 'Last name is required' : undefined;
      case 'whatsappNumber':
        if (!contactInfo.whatsappNumber.trim()) return 'WhatsApp number is required';
        if (contactInfo.whatsappNumber.length < 7) return 'Enter a valid phone number';
        return undefined;
      default:
        return undefined;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Final Step
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Review & Confirm</h2>
        <p className="mt-2 text-stone-500">Check your trip details and enter your contact info</p>
      </div>

      {/* Trip Summary */}
      <TripSummary />

      {/* Contact Form Section */}
      <div className="bg-white rounded-lg border border-stone-200/60 p-5 mb-6">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 mb-4">
          Contact Details
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ElegantInput
              id="firstName"
              label="First Name"
              value={contactInfo.firstName}
              onChange={(v) => handleFieldChange('firstName', v)}
              error={getFieldError('firstName')}
            />
            <ElegantInput
              id="lastName"
              label="Last Name"
              value={contactInfo.lastName}
              onChange={(v) => handleFieldChange('lastName', v)}
              error={getFieldError('lastName')}
            />
          </div>

          {/* WhatsApp number with native country code select */}
          <ElegantInput
            id="whatsapp"
            label="WhatsApp Number"
            type="tel"
            value={contactInfo.whatsappNumber}
            onChange={(v) => handleFieldChange('whatsappNumber', v.replace(/\D/g, ''))}
            error={getFieldError('whatsappNumber')}
            prefix={
              <CountryCodeSelect
                value={contactInfo.countryCode}
                onChange={(code) => updateContactInfo('countryCode', code)}
              />
            }
          />

          <ElegantTextarea
            id="notes"
            label="Special Requests (Optional)"
            value={contactInfo.notes}
            onChange={(v) => handleFieldChange('notes', v)}
          />
        </div>
      </div>

      {/* WhatsApp info */}
      <div className="p-5 bg-stone-50 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-medium text-stone-900">Confirmation via WhatsApp</h4>
            <p className="mt-1 text-sm text-stone-600">
              We'll send your booking confirmation and detailed itinerary to this number. 
              Your concierge will also reach out to finalize arrangements.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="mt-5 flex items-start gap-3 px-1">
        <ShieldCheck className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="text-xs text-stone-400">
          By submitting, you agree to our privacy policy. Your information is used solely to process this booking and communicate about your trip.
        </p>
      </div>
    </div>
  );
}
