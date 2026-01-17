
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Map, { Marker, Source, Layer, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface Entry {
  id: string;
  city: string;
  date: string;
  content: string;
}

interface MapboxMapProps {
  entries?: Entry[];
  tripLocation?: string;
}

interface Coordinate {
  lng: number;
  lat: number;
  city: string;
}

const MapboxMap = ({ entries = [], tripLocation }: MapboxMapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1
  });
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to geocode a city name
  const geocodeCity = async (city: string): Promise<Coordinate | null> => {
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) return null;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${token}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lng, lat, city };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding city:', city, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsLoading(true);
      const coords: Coordinate[] = [];
      
      // If we have entries, map them
      if (entries && entries.length > 0) {
        const uniqueCities = Array.from(new Set(entries.map(e => e.city)));
        
        for (const city of uniqueCities) {
          const coord = await geocodeCity(city);
          if (coord) {
            coords.push(coord);
          }
        }
      } 
      // Fallback to trip location if no entries
      else if (tripLocation) {
        const coord = await geocodeCity(tripLocation);
        if (coord) {
          coords.push(coord);
        }
      }

      setCoordinates(coords);

      // Fit bounds if we have coordinates
      if (coords.length > 0) {
        // Simple centering logic - can be improved with fitBounds
        // For now, just center on the first one or average
        const avgLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
        const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
        
        setViewState({
          longitude: avgLng,
          latitude: avgLat,
          zoom: coords.length > 1 ? 3 : 8
        });
      }

      setIsLoading(false);
    };

    fetchCoordinates();
  }, [entries, tripLocation]);

  // Force map resize when container size changes or after mount
  useEffect(() => {
    // Delay resize to allow CSS transition to complete
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    }, 350); // Slightly longer than the 300ms transition duration

    return () => clearTimeout(timeoutId);
  }, []); // Run on mount

  // Also listen for window resize just in case
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create GeoJSON for the line connecting points
  const geojson = useMemo(() => {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates.map(c => [c.lng, c.lat])
      }
    };
  }, [coordinates]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full bg-zinc-900 flex items-center justify-center">
        <p className="text-red-500">Mapbox Token not found</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Map
        {...viewState}
        ref={mapRef}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />

        {/* Draw the line connecting cities */}
        {coordinates.length > 1 && (
          <Source id="route" type="geojson" data={geojson as any}>
            <Layer
              id="route"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#c1ea6f', // Primary green
                'line-width': 3,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Markers for each city */}
        {coordinates.map((coord, index) => (
          <Marker 
            key={`${coord.city}-${index}`} 
            longitude={coord.lng} 
            latitude={coord.lat} 
            anchor="bottom"
          >
             <div className="flex flex-col items-center group">
               <div className="bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                 {coord.city}
               </div>
               <MapPin className="w-6 h-6 text-[var(--primary-pink)] fill-[var(--primary-pink)]/20" />
             </div>
          </Marker>
        ))}
      </Map>
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-[var(--primary-green)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
