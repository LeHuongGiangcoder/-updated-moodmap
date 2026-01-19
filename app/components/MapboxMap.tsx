
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
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
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
      setIsLoading(false);
    };

    fetchCoordinates();
  }, [entries, tripLocation]);

  // Auto-zoom to fit bounds when coordinates change
  useEffect(() => {
    if (coordinates.length === 0 || !mapRef.current) return;

    // Calculate bounds
    const minLng = Math.min(...coordinates.map(c => c.lng));
    const maxLng = Math.max(...coordinates.map(c => c.lng));
    const minLat = Math.min(...coordinates.map(c => c.lat));
    const maxLat = Math.max(...coordinates.map(c => c.lat));

    // If only one point, center on it with fixed zoom
    if (coordinates.length === 1) {
      mapRef.current.flyTo({
        center: [minLng, minLat],
        zoom: 10,
        duration: 2000
      });
      return;
    }

    // Fit bounds with padding
    try {
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        {
          padding: 50,
          duration: 2000
        }
      );
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }

  }, [coordinates]);

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
    // Helper for smooth curve interpolation (Catmull-Rom spline)
    const getCatmullRomPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
      const v0 = (p2 - p0) * 0.5;
      const v1 = (p3 - p1) * 0.5;
      const t2 = t * t;
      const t3 = t * t2;
      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    };

    let lineCoordinates: number[][] = [];

    if (coordinates.length > 1) {
      // If we have enough points, smooth the path
      if (coordinates.length > 2) {
        const points: number[][] = [];
        // Duplicate start and end points for the spline control points
        const extendedCoords = [coordinates[0], ...coordinates, coordinates[coordinates.length - 1]];
        const segments = 20;

        for (let i = 0; i < extendedCoords.length - 3; i++) {
          const p0 = extendedCoords[i];
          const p1 = extendedCoords[i + 1];
          const p2 = extendedCoords[i + 2];
          const p3 = extendedCoords[i + 3];

          for (let j = 0; j < segments; j++) {
            const t = j / segments;
            const x = getCatmullRomPoint(t, p0.lng, p1.lng, p2.lng, p3.lng);
            const y = getCatmullRomPoint(t, p0.lat, p1.lat, p2.lat, p3.lat);
            points.push([x, y]);
          }
        }
        // Add the very last point
        const last = coordinates[coordinates.length - 1];
        points.push([last.lng, last.lat]);
        lineCoordinates = points;
      } else {
        // Just 2 points, straight line is fine
        lineCoordinates = coordinates.map(c => [c.lng, c.lat]);
      }
    }

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: lineCoordinates
      }
    };
  }, [coordinates]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
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
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
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
                'line-opacity': 0.8,
                'line-dasharray': [0.1, 2], // Create dotted effect
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
