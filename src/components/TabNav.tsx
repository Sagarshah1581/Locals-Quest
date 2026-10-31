import React from 'react';
import { ViewMode } from '../types';

interface TabNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ currentView, onNavigate }) => {
  return (
    <div id="tab-nav" className="px-4 pt-3 pb-1.5 bg-white flex items-center justify-between">
      <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full text-xs font-bold border border-slate-200/50">
        <button
          onClick={() => onNavigate('list')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            currentView === 'list'
              ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-slate-900 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          List View
        </button>
        <button
          onClick={() => onNavigate('map')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            currentView === 'map'
              ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-slate-900 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Map View
        </button>
      </div>
    </div>
  );
};
