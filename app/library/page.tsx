
"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import TripCard from '../components/TripCard';
import { ChevronLeft } from 'lucide-react';

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
}

const LibraryPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        } else {
          console.error('Failed to fetch trips');
        }
      } catch (error) {
        console.error('An error occurred while fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDelete = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-10 pb-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Trips</h1>
          <Link href="/trip/create" className="btn-primary">
            Create trip
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden h-[400px] animate-pulse">
                <div className="h-64 bg-zinc-800 w-full" />
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-zinc-800 w-3/4 rounded" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-zinc-800 w-1/4 rounded" />
                    <div className="h-4 bg-zinc-800 w-1/4 rounded" />
                    <div className="h-4 bg-zinc-800 w-1/4 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : trips.length > 0 ? (
            trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p className="text-xl">No trips found. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
