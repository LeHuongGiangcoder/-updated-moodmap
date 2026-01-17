"use client";

import React, { useState, useEffect, useCallback } from 'react';
import NavigationBar from '../../components/NavigationBar';
import TiptapEditor from '../../components/TiptapEditor';
import MapboxMap from '../../components/MapboxMap';
import { 
  Map, 
  PanelRightClose, 
  PanelRightOpen, 
  MapPin, 
  Calendar, 
  MoreVertical, 
  Plus,
  Settings,
  User,
  PanelLeftClose,
  CloudSun,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Entry {
  id: string;
  city: string;
  date: string;
  content: string;
}

interface Trip {
  id: string;
  title: string;
  location: string;
  image: string;
  author: string;
  distance: string;
  cities: string;
  duration: string;
  description: string;
  entries?: Entry[];
}

const JournalPage = ({ params }: { params: Promise<{ id: string }> }) => {
  // State Declarations
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEntry, setNewEntry] = useState({ city: '', date: '', content: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Derived State
  const currentEntry = trip?.entries?.[currentEntryIndex];

  useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  useEffect(() => {
    if (currentEntry) {
        setEditContent(currentEntry.content);
    } else {
        setEditContent('');
    }
  }, [currentEntry]);

  useEffect(() => {
    if (!unwrappedParams?.id) return;

    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${unwrappedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setTrip(data);
        } else {
          console.error('Failed to fetch trip');
        }
      } catch (error) {
        console.error('An error occurred while fetching the trip:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [unwrappedParams]);

  // Debounce autosave
  useEffect(() => {
    if (!currentEntry) return;
    
    // Don't save if content hasn't changed from what's in the DB/state
    if (editContent === currentEntry.content) {
        setSaveStatus('saved');
        return;
    }

    setSaveStatus('saving');
    const timeoutId = setTimeout(() => {
      handleUpdateContent(editContent);
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timeoutId);
  }, [editContent, currentEntry]);

  const handleUpdateContent = async (contentToSave: string) => {
    if (!currentEntry || !unwrappedParams?.id) return;

    try {
        const response = await fetch('/api/entries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: currentEntry.id, 
                content: contentToSave,
            })
        });

        if (response.ok) {
            setSaveStatus('saved');
            // Update local state to match saved content
            setTrip(prev => {
                if (!prev || !prev.entries) return prev;
                const updatedEntries = [...prev.entries];
                updatedEntries[currentEntryIndex] = { 
                    ...updatedEntries[currentEntryIndex], 
                    content: contentToSave 
                };
                return { ...prev, entries: updatedEntries };
            });
        } else {
            setSaveStatus('error');
            console.error('Failed to update content');
        }
    } catch (error) {
        setSaveStatus('error');
        console.error('Error updating content:', error);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unwrappedParams?.id) return;
    setIsSubmitting(true);

    try {
      const entryToCreate = {
        ...newEntry,
        content: newEntry.content || '<p>Write about your day...</p>',
        id: unwrappedParams.id
      };

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryToCreate)
      });

      if (response.ok) {
        const tripResponse = await fetch(`/api/trips/${unwrappedParams.id}`);
        const tripData = await tripResponse.json();
        setTrip(tripData);
        
        setNewEntry({ city: '', date: '', content: '' });
        setIsModalOpen(false);
        if (tripData.entries) {
            setCurrentEntryIndex(tripData.entries.length - 1);
        }
      } else {
        console.error('Failed to create entry');
      }
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !trip) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavigationBar />
        <div className="container mx-auto px-4 pt-24 pb-8 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-zinc-800 w-48 mb-4 rounded"></div>
            <div className="h-8 bg-zinc-800 w-96 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090e14] text-white overflow-hidden flex flex-col">
      <NavigationBar />
      
      {/* Header Bar */}
      <div className="pt-20 px-6 pb-4 border-b border-zinc-800 flex justify-between items-center bg-[#090e14] z-20">
        <div>
          <p className="text-sm text-[var(--primary-pink)] font-medium mb-1">TRIP BY {trip.author.toUpperCase()}</p>
          <h1 className="text-3xl font-bold font-['Geomanist']">{trip.title}</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-zinc-900 rounded-lg p-3 flex gap-8">
            <div className="text-center px-4 border-r border-zinc-800 last:border-r-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">DISTANCE</p>
              <p className="font-bold text-lg">{trip.distance}</p>
            </div>
            <div className="text-center px-4 border-r border-zinc-800 last:border-r-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">CITIES</p>
              <p className="font-bold text-lg">{trip.cities}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">DURATION</p>
              <p className="font-bold text-lg">{trip.duration}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar / Map Toggle */}
        <div className={`transition-all duration-300 ease-in-out border-r border-zinc-800 bg-[#090e14] relative z-10 ${showMap ? 'flex-1' : 'w-12 shrink-0'}`}>
          <button 
            onClick={() => setShowMap(!showMap)}
            className="absolute top-4 left-3 p-1.5 hover:bg-zinc-800 rounded-md transition-colors z-20"
          >
            {showMap ? <PanelLeftClose className="w-5 h-5 text-gray-400" /> : <Map className="w-5 h-5 text-gray-400" />}
          </button>
          
          {showMap && (
            <div className="h-full w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
              <MapboxMap entries={trip.entries} tripLocation={trip.location} />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className={`transition-all duration-300 ease-in-out relative ${showMap ? 'w-0 p-0 overflow-hidden opacity-0 pointer-events-none' : 'flex-1 overflow-y-auto p-6 opacity-100'}`}>
          <div className="max-w-4xl mx-auto">
            {/* Entry Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.location}</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-2">{currentEntry ? currentEntry.city : trip.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    {currentEntry && (
                      <>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(currentEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{trip.author}</span>
                    
                    {/* Save Status Indicator */}
                    {/* Removed as per request to reduce distraction */}
                  </div>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center gap-3">
                  <CloudSun className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="font-bold">12°C</p>
                    <p className="text-xs text-gray-400">Partly Cloudy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Entry Content (Rich Text Editor) */}
            <div className="min-h-[500px] mb-20">
              {currentEntry ? (
                <TiptapEditor 
                  content={editContent} 
                  onChange={setEditContent} 
                  editable={true}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border border-zinc-800 rounded-xl bg-zinc-900/20">
                   <p className="text-gray-400 mb-4">{trip.description || "Start your journey by adding a new city!"}</p>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className="btn-primary flex items-center gap-2"
                   >
                     <Plus className="w-4 h-4" /> Add First Entry
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          {trip.entries && trip.entries.length > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 backdrop-blur-sm px-6 py-3 rounded-full border border-zinc-800 flex items-center gap-4 z-30">
                {trip.entries.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentEntryIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                    index === currentEntryIndex
                        ? 'w-3 h-3 bg-[var(--primary-green)] shadow-[0_0_10px_var(--primary-green)]'
                        : 'w-2 h-2 bg-zinc-600 hover:bg-[var(--primary-green)]'
                    }`}
                />
                ))}
                <span className="text-xs text-[var(--primary-green)] ml-2 font-bold whitespace-nowrap">
                Page {currentEntryIndex + 1}
                </span>
            </div>
          )}
        </div>

        {/* Right Sidebar / Timeline */}
        <div className={`transition-all duration-300 ease-in-out border-l border-zinc-800 bg-[#0b1016] ${showTimeline ? 'w-80' : 'w-12'} relative`}>
          <button 
            onClick={() => setShowTimeline(!showTimeline)}
            className="absolute top-4 right-3 p-1.5 hover:bg-zinc-800 rounded-md transition-colors z-20"
          >
            {showTimeline ? <PanelRightClose className="w-5 h-5 text-gray-400" /> : <PanelRightOpen className="w-5 h-5 text-gray-400" />}
          </button>

          {showTimeline && (
            <div className="h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-['Geomanist']">Itinerary</h2>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-0.5 before:bg-zinc-800">
                {trip.entries?.map((entry, index) => (
                  <div key={entry.id} className="relative pl-6">
                    <button 
                      onClick={() => setCurrentEntryIndex(index)}
                      className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-colors z-10 ${
                        index === currentEntryIndex 
                          ? 'bg-[var(--primary-green)] border-[var(--primary-green)] shadow-[0_0_10px_var(--primary-green)]' 
                          : 'bg-[#0b1016] border-zinc-600 hover:border-[var(--primary-green)]'
                      }`}
                    ></button>
                    
                    <div className={`group cursor-pointer transition-all ${index === currentEntryIndex ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                         onClick={() => setCurrentEntryIndex(index)}>
                      <p className="text-xs text-gray-400 mb-1">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <h3 className="font-bold mb-2">{entry.city}</h3>
                      {/* We remove the raw content preview or truncate it safely since it's now HTML */}
                      <div className="bg-zinc-900/50 p-3 rounded-lg text-sm text-gray-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: entry.content || '' }} />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-8 py-3 rounded-full border border-zinc-700 hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New City
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Entry</h2>
            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newEntry.city}
                  onChange={(e) => setNewEntry({ ...newEntry, city: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 focus:border-[var(--primary-green)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 focus:border-[var(--primary-green)] focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-lg bg-[var(--primary-green)] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
