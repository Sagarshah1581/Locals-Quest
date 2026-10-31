import React from 'react';
import { ViewMode } from '../types';

interface TabNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ currentView, onNavigate }) => {
  return (
    <div id="tab-nav" className="px-4 pt-3 pb-1 bg-white flex items-center justify-between">
      <div className="flex bg-slate-100 p-1 rounded-xl w-full text-sm font-semibold">
        <button
          onClick={() => onNavigate('list')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 transition ${
            currentView === 'list'
              ? 'bg-white shadow-sm text-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          List View
        </button>
        <button
          onClick={() => onNavigate('map')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 transition ${
            currentView === 'map'
              ? 'bg-white shadow-sm text-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Map View
        </button>
      </div>
    </div>
  );
};
