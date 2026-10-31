import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Experience } from '../types';

interface MapViewProps {
  experiences: Experience[];
  selectedExperience: Experience | null;
  onSelectExperience: (id: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  experiences,
  selectedExperience,
  onSelectExperience,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activePreviewExp, setActivePreviewExp] = useState<Experience | null>(null);

  const createTeardropIcon = () => {
    return L.divIcon({
      className: 'custom-pin-wrapper',
      html: `
        <div class="custom-pin-marker">
          <span>📍</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [43.6532, -79.3832],
        zoom: 9,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const markerGroup = L.layerGroup().addTo(map);
      markerGroupRef.current = markerGroup;
      mapInstanceRef.current = map;
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Update markers when experiences change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();
    const bounds: [number, number][] = [];

    experiences.forEach((exp) => {
      const marker = L.marker([exp.lat, exp.lng], { icon: createTeardropIcon() });

      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 text-slate-800 min-w-[170px]';
      popupDiv.innerHTML = `
        <b class="text-indigo-600 block text-xs font-bold leading-tight">${exp.event_name}</b>
        <span class="text-[10px] text-slate-500 block mt-0.5">${exp.host_business_name}</span>
        <p class="text-[10px] text-slate-600 mt-1 leading-tight">📍 ${exp.exact_address}</p>
        <div class="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-black text-slate-900">${exp.base_price_cad}</span>
          <button id="popup-btn-${exp.id}" class="px-2 py-0.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">
            Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${exp.id}`);
        if (btn) {
          btn.onclick = () => onSelectExperience(exp.id);
        }
      });

      marker.on('click', () => {
        setActivePreviewExp(exp);
      });

      marker.addTo(markerGroup);
      bounds.push([exp.lat, exp.lng]);
    });

    if (selectedExperience) {
      map.setView([selectedExperience.lat, selectedExperience.lng], 13);
      setActivePreviewExp(selectedExperience);
    } else if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }, [experiences, selectedExperience, onSelectExperience]);

  const fitAllPins = () => {
    if (!mapInstanceRef.current || experiences.length === 0) return;
    const bounds = experiences.map((exp) => [exp.lat, exp.lng] as [number, number]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
  };

  return (
    <div className="flex-1 relative flex flex-col w-full" style={{ minHeight: '550px' }}>
      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between z-20">
        <span className="text-xs font-bold text-slate-700">
          📍 Showing {experiences.length} quest locations
        </span>
        <button
          onClick={fitAllPins}
          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          Fit All Pins
        </button>
      </div>

      <div
        ref={mapContainerRef}
        style={{ height: '72vh', minHeight: '520px', width: '100%' }}
        className="z-10 bg-slate-100"
      />

      {activePreviewExp && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3.5 border border-slate-200 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <img
            src={activePreviewExp.images[0]}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
            alt={activePreviewExp.event_name}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200';
            }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{activePreviewExp.event_name}</h4>
            <p className="text-[10px] text-slate-500 truncate">📍 {activePreviewExp.exact_address}</p>
            <span className="text-[11px] font-black text-indigo-600">{activePreviewExp.base_price_cad} CAD</span>
          </div>
          <button
            onClick={() => onSelectExperience(activePreviewExp.id)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shrink-0 transition"
          >
            Details
          </button>
        </div>
      )}
    </div>
  );
};
