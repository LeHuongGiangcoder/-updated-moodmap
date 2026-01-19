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
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser context menu
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

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
    <>
      <div
        className="bg-zinc-900 rounded-lg overflow-hidden h-full relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[var(--primary-green)] border border-transparent"
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="relative h-64 w-full overflow-hidden">
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
          <div className="absolute inset-x-0 bottom-0 pt-32 pb-4 px-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10">
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md group-hover:text-[var(--primary-green)] transition-colors duration-300 line-clamp-1">{trip.title}</h2>
            <p className="text-gray-200 text-sm flex items-center gap-1 drop-shadow-sm group-hover:text-white transition-colors duration-300 line-clamp-1">
              {trip.location}
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white text-sm">{trip.author}</p>
            </div>
          </div>
          <div className="flex justify-between text-center text-white/90 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
            <div>
              <p className="font-bold text-sm">{trip.distance}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">KM</p>
            </div>
            <div className="w-[1px] bg-zinc-800"></div>
            <div>
              <p className="font-bold text-sm">{trip.cities}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Cities</p>
            </div>
            <div className="w-[1px] bg-zinc-800"></div>
            <div>
              <p className="font-bold text-sm">{trip.duration}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Days</p>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl py-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/trip/edit/${trip.id}`}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Edit Trip
          </Link>
          <div className="h-[1px] bg-zinc-800 my-1"></div>
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default TripCard;
