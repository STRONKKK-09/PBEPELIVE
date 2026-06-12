import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Layers, PhoneCall, Globe } from 'lucide-react';

interface HeaderProps {
  onResetData: () => void;
}

export default function Header({ onResetData }: HeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="relative w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-full overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-6 h-6 bg-lime-400 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-emerald-400 rounded-tr-full"></div>
                <span className="relative z-10 text-white font-black text-xs tracking-wider">PBEPE</span>
              </div>
              <div className="ml-3">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-extrabold tracking-tight text-indigo-900">PBEPE Broiler</span>
                  <div className="w-2 h-2 rounded-full bg-lime-500 mb-2"></div>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Sistem Portal Jembatan Timbang &amp; DO</p>
              </div>
            </div>

            <div className="hidden md:block h-8 w-px bg-slate-200"></div>

            {/* Title */}
            <div className="hidden md:block">
              <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <span>Portal Logistik &amp; Antrean Yard</span>
              </h1>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">PBEPE Integrated</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Globe className="w-3 h-3 text-slate-400" /> pbepe.id/customer
                </span>
              </div>
            </div>
          </div>

          {/* Contact and Time Panel */}
          <div className="flex items-center space-x-4">
            {/* Mini active badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700">Sistem Online</span>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-mono font-medium text-slate-700">{time || "12:00:00"}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetData}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Reset Data
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Title strip */}
      <div className="md:hidden bg-slate-50 border-t border-slate-200 py-2 px-4 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold text-slate-800">Sistem Portal PBEPE</h2>
          <span className="text-[10px] text-slate-500">PBEPE Integrated</span>
        </div>
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] font-mono font-bold text-slate-600">PBEPE Depot</span>
        </div>
      </div>
    </header>
  );
}
