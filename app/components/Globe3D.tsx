'use client';

import React, { useEffect, useRef, useState } from 'react';
import Map, { MapRef, Layer, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const Globe3D = () => {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: 0,
        latitude: 20,
        zoom: 1.5,
        pitch: 0,
        bearing: 0
    });

    const onMove = React.useCallback((evt: any) => {
        setViewState(evt.viewState);
    }, []);

    // Spin animation
    useEffect(() => {
        let animationFrameId: number;

        const spinGlobe = () => {
            setViewState((prev) => {
                const newLong = prev.longitude + 0.2; // Speed of spin
                return {
                    ...prev,
                    longitude: newLong > 360 ? newLong - 360 : newLong
                };
            });
            animationFrameId = requestAnimationFrame(spinGlobe);
        };

        // Start spinning after map loads or immediately
        animationFrameId = requestAnimationFrame(spinGlobe);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        return (
            <div className="h-full w-full bg-zinc-900 flex items-center justify-center rounded-2xl border border-zinc-800">
                <p className="text-red-500">Mapbox Token not found</p>
            </div>
        );
    }

    return (
        <div className="h-[500px] w-full relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 backdrop-blur-sm shadow-2xl">
            {/* Decorative overlay gradient */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-radial-gradient from-transparent to-black/40" />

            <Map
                {...viewState}
                ref={mapRef}
                onMove={onMove}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                projection={{ name: 'globe' } as any}
                fog={{
                    'range': [0.5, 10],
                    'color': '#000000',
                    'horizon-blend': 0.1,
                    'high-color': '#202020',
                    'space-color': '#000000',
                    'star-intensity': 0.4
                } as any}
                attributionControl={false}
                scrollZoom={false}
                dragPan={false} // Disable user interaction for showcasing
                dragRotate={false}
                doubleClickZoom={false}
            >
                {/* Add some "Active Trips" glowing dots for visual interest */}
                <Source
                    id="random-points"
                    type="geojson"
                    data={{
                        type: 'FeatureCollection',
                        features: [
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [-74.006, 40.7128] }, properties: {} }, // NY
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }, properties: {} },  // Paris
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [139.6917, 35.6895] }, properties: {} }, // Tokyo
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.1276, 51.5074] }, properties: {} }, // London
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [151.2093, -33.8688] }, properties: {} }, // Sydney
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [-43.1729, -22.9068] }, properties: {} }, // Rio
                            { type: 'Feature', geometry: { type: 'Point', coordinates: [106.660172, 10.762622] }, properties: {} }, // Saigon
                        ]
                    }}
                >
                    <Layer
                        id="point-glow"
                        type="circle"
                        paint={{
                            'circle-radius': 8,
                            'circle-color': '#c1ea6f', // Primary Green
                            'circle-opacity': 0.4,
                            'circle-blur': 1
                        }}
                    />
                    <Layer
                        id="point-core"
                        type="circle"
                        paint={{
                            'circle-radius': 4,
                            'circle-color': '#ff7cac', // Primary Pink
                            'circle-opacity': 0.9,
                        }}
                    />
                </Source>
            </Map>
        </div>
    );
};

export default Globe3D;
