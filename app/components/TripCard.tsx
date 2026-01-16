"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Trip {
  id: string;
  title: string;
  location: string;
  image: string;
  author: string;
  distance: string;
  cities: string;
  duration: string;
}

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/journal/${trip.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering double click
    console.log(`Deleting trip with ID: ${trip.id}`);
    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(trip.id);
      } else {
        console.error('Failed to delete trip');
      }
    } catch (error) {
      console.error('An error occurred while deleting the trip:', error);
    }
  };

  return (
    <div 
      className="bg-zinc-900 rounded-lg overflow-hidden h-full relative group cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative h-64 w-full">
        {trip.image ? (
          <Image 
            src={trip.image} 
            alt={trip.title} 
            fill 
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600">No Image</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
          <h2 className="text-2xl font-bold text-white">{trip.title}</h2>
          <p className="text-gray-300">{trip.location}</p>
        </div>
        
        {/* Overlay for actions (visible on hover) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
          <Link href={`/trip/edit/${trip.id}`} onClick={(e) => e.stopPropagation()}>
            <button className="btn-tertiary w-32">
              Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-tertiary w-32"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-white text-lg">{trip.author}</p>
        </div>
        <div className="flex justify-between text-center text-white/90">
          <div>
            <p className="font-bold">{trip.distance}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Distance</p>
          </div>
          <div>
            <p className="font-bold">{trip.cities}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Cities</p>
          </div>
          <div>
            <p className="font-bold">{trip.duration}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
