'use client';

import { useEffect, useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBookingStore, TOURS_DATA, ItineraryItem } from '@/store/booking-store';
import { GripVertical, AlertTriangle, RotateCcw, Map, Coffee, Info, X } from 'lucide-react';

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
      <div className="max-w-lg mx-auto bg-stone-900 text-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" strokeWidth={1.5} />
        <p className="text-sm flex-1">{message}</p>
        <button onClick={onClose} className="text-stone-400 hover:text-white">
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// Map placeholder component
function MapPlaceholder() {
  return (
    <div className="relative h-44 bg-gradient-to-br from-stone-100 to-stone-50 rounded-lg overflow-hidden mb-6 border border-stone-200/60">
      {/* Stylized map background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <path d="M0 100 Q100 80 200 100 T400 100" stroke="#78716c" strokeWidth="2" fill="none" />
          <path d="M50 50 Q150 100 250 50 T400 80" stroke="#78716c" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
          <path d="M0 150 Q100 120 200 150 T350 130" stroke="#78716c" strokeWidth="1.5" fill="none" />
          <circle cx="80" cy="90" r="6" fill="#78716c" />
          <circle cx="180" cy="100" r="6" fill="#78716c" />
          <circle cx="300" cy="85" r="6" fill="#78716c" />
        </svg>
      </div>
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-2">
          <Map className="w-6 h-6 text-stone-600" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-stone-700">Route Preview</p>
        <p className="text-xs text-stone-500 mt-1">Drag items below to reorder</p>
      </div>
    </div>
  );
}

// Sortable item component
function SortableItem({ item }: { item: ItineraryItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tour = item.tourId ? TOURS_DATA.find(t => t.id === item.tourId) : null;
  const destinationNames = item.destinations
    .map(destId => tour?.destinations.find(d => d.id === destId)?.name)
    .filter(Boolean);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-lg border p-4 touch-none
        transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg z-50 border-stone-900' : 'border-stone-200/60'}
        ${item.isFreeDay ? 'bg-gradient-to-r from-stone-50 to-white' : ''}
      `}
    >
      {/* Drag handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 cursor-grab active:cursor-grabbing touch-none text-stone-400 hover:text-stone-600"
      >
        <GripVertical className="w-4 h-4" strokeWidth={1.5} />
      </div>
      
      <div className="pl-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
            item.isFreeDay 
              ? 'bg-stone-200 text-stone-700' 
              : 'bg-stone-900 text-white'
          }`}>
            {item.day}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-stone-900">{item.tourTitle}</h4>
            {item.isFreeDay && (
              <p className="text-xs text-stone-500">Explore at your own pace</p>
            )}
          </div>
          {item.isFreeDay && (
            <div className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[10px] font-medium tracking-wide uppercase rounded">
              Leisure
            </div>
          )}
        </div>
        
        {!item.isFreeDay && destinationNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-11">
            {destinationNames.slice(0, 3).map((name, i) => (
              <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded">
                {name}
              </span>
            ))}
            {destinationNames.length > 3 && (
              <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded">
                +{destinationNames.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {item.isFreeDay && (
          <div className="flex flex-wrap gap-1.5 pl-11">
            <span className="px-2 py-0.5 bg-stone-50 text-stone-500 text-xs rounded flex items-center gap-1">
              <Coffee className="w-3 h-3" strokeWidth={1.5} /> Cafes
            </span>
            <span className="px-2 py-0.5 bg-stone-50 text-stone-500 text-xs rounded">Shopping</span>
            <span className="px-2 py-0.5 bg-stone-50 text-stone-500 text-xs rounded">Strolling</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StepItinerary() {
  const { 
    itineraryOrder, 
    itineraryModified,
    initializeItinerary, 
    reorderItinerary,
    resetItineraryOrder,
    getTripDuration,
    selectedTours,
  } = useBookingStore();
  
  const [showToast, setShowToast] = useState(false);
  const hasShownToast = useRef(false);
  const tripDuration = getTripDuration();
  const freeDaysCount = Math.max(0, tripDuration - selectedTours.length);

  // Initialize itinerary on mount
  useEffect(() => {
    initializeItinerary();
  }, [initializeItinerary]);

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = itineraryOrder.findIndex(item => item.id === active.id);
      const newIndex = itineraryOrder.findIndex(item => item.id === over.id);
      
      reorderItinerary(oldIndex, newIndex);
      
      // Show toast on first reorder
      if (!hasShownToast.current) {
        setShowToast(true);
        hasShownToast.current = true;
      }
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Toast notification */}
      {showToast && (
        <Toast 
          message="Route order changed — this may affect travel times"
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-stone-400 mb-2">
          Day by Day
        </p>
        <h2 className="font-serif text-2xl text-stone-900">Your itinerary</h2>
        <p className="mt-2 text-stone-500">
          {tripDuration} day{tripDuration > 1 ? 's' : ''} total
          {freeDaysCount > 0 && ` · ${freeDaysCount} free day${freeDaysCount > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Map placeholder */}
      <MapPlaceholder />

      {/* Modified indicator & reset button */}
      {itineraryModified && (
        <div className="mb-4 flex items-center justify-between p-4 bg-amber-50 border border-amber-200/60 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
            <span className="text-sm text-amber-800">Route has been modified</span>
          </div>
          <button
            onClick={resetItineraryOrder}
            className="px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
            Reset
          </button>
        </div>
      )}

      {/* Itinerary list with dnd-kit */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itineraryOrder.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {itineraryOrder.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Tips */}
      <div className="mt-6 p-4 bg-stone-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <h4 className="font-medium text-stone-800 text-sm">Drag to Reorder</h4>
            <p className="mt-1 text-xs text-stone-600">
              Hold and drag any day to reorder. Free days can be placed anywhere. Your guide will confirm the optimized route.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
