import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Experience } from '../types';
import { GoogleRatingBadge } from './GoogleRatingBadge';

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
  const [activePreviewExp, setActivePreviewExp] = useState<Experience | null>(selectedExperience);
  const [searchFilter, setSearchFilter] = useState('');

  const createTeardropIcon = () => {
    return L.divIcon({
      className: 'custom-pin-wrapper',
      html: `
        <div class="custom-pin-marker">
          <span>📍</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
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
      popupDiv.className = 'p-1.5 text-slate-800 min-w-[180px] font-sans';
      popupDiv.innerHTML = `
        <div class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">${exp.category}</div>
        <b class="text-slate-900 block text-xs font-extrabold leading-tight">${exp.event_name}</b>
        <span class="text-[11px] text-slate-500 block mt-0.5">${exp.host_business_name}</span>
        <div style="display: flex; align-items: center; gap: 4px; margin: 4px 0; font-size: 11px; font-weight: 700;">
          <span style="color: #4285F4; font-weight: 900; font-size: 10px;">G</span>
          <span style="color: #f59e0b;">★</span>
          <span style="color: #0f172a;">${(exp.google_rating ?? 4.7).toFixed(1)}</span>
          <span style="color: #64748b; font-weight: 500; font-size: 10px;">(${(exp.google_reviews_count ?? 380).toLocaleString()} reviews)</span>
        </div>
        <p class="text-[10px] text-slate-600 mt-1 leading-tight flex items-start gap-1">
          <span>📍</span>
          <span>${exp.exact_address}</span>
        </p>
        <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-black text-slate-900">${exp.base_price_cad}</span>
          <button id="popup-btn-${exp.id}" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition">
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
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [experiences, selectedExperience, onSelectExperience]);

  const fitAllPins = () => {
    if (!mapInstanceRef.current || experiences.length === 0) return;
    const bounds = experiences.map((exp) => [exp.lat, exp.lng] as [number, number]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  };

  const handleCardClick = (exp: Experience) => {
    setActivePreviewExp(exp);
    mapInstanceRef.current?.setView([exp.lat, exp.lng], 13, { animate: true });
  };

  const displayedList = experiences.filter((e) =>
    searchFilter.trim()
      ? e.event_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.location_region.toLowerCase().includes(searchFilter.toLowerCase())
      : true
  );

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-130px)] min-h-[580px] relative">
      {/* Top Map Action Bar */}
      <div className="p-3 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-20 shadow-2xs shrink-0">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span>Showing {experiences.length} quest locations in Ontario</span>
        </span>
        <button
          onClick={fitAllPins}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          Fit All Pins
        </button>
      </div>

      {/* Main Responsive Body: Split Screen on Tablet/Desktop */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Left Sidebar (Visible on md/tablet & desktop) */}
        <div className="hidden md:flex flex-col w-80 lg:w-96 border-r border-slate-200/80 bg-white z-20 shrink-0">
          <div className="p-3 border-b border-slate-100">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search map locations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {displayedList.map((exp) => (
              <div
                key={exp.id}
                onClick={() => handleCardClick(exp)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex gap-3 ${
                  activePreviewExp?.id === exp.id
                    ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-200'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <img
                  src={exp.images[0]}
                  alt={exp.event_name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider truncate">
                      {exp.category}
                    </span>
                    <GoogleRatingBadge
                      rating={exp.google_rating}
                      reviewCount={exp.google_reviews_count}
                      size="xs"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{exp.event_name}</h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">📍 {exp.location_region}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-extrabold text-slate-900">{exp.base_price_cad}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExperience(exp.id);
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Canvas Surface */}
        <div className="flex-1 relative w-full h-full min-h-[400px]">
          <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-10" />

          {/* Floating Mobile Preview Card (Only on mobile < 768px) */}
          {activePreviewExp && (
            <div className="md:hidden absolute bottom-4 left-3 right-3 z-30 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 border border-slate-200/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <img
                src={activePreviewExp.images[0]}
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                alt={activePreviewExp.event_name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    {activePreviewExp.category}
                  </span>
                  <GoogleRatingBadge
                    rating={activePreviewExp.google_rating}
                    reviewCount={activePreviewExp.google_reviews_count}
                    size="xs"
                  />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                  {activePreviewExp.event_name}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">📍 {activePreviewExp.exact_address}</p>
                <span className="text-xs font-black text-slate-900 block mt-1">
                  {activePreviewExp.base_price_cad} CAD
                </span>
              </div>
              <button
                onClick={() => onSelectExperience(activePreviewExp.id)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shrink-0 transition active:scale-95 shadow-md cursor-pointer"
              >
                Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
