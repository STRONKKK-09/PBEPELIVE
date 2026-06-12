import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Search, CheckCircle2, AlertTriangle, QrCode, ShieldAlert, ArrowRight } from 'lucide-react';
import { DeliveryOrder } from '../types';

interface BarcodeScannerProps {
  orders: DeliveryOrder[];
  onSelectForWeighing: (order: DeliveryOrder) => void;
  onUpdateStatus: (id: string, status: DeliveryOrder['status']) => void;
}

export default function BarcodeScanner({
  orders,
  onSelectForWeighing,
  onUpdateStatus
}: BarcodeScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [matchedOrder, setMatchedOrder] = useState<DeliveryOrder | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle webcam stream life-cycle
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Gagal mengakses kamera. Pastikan Anda memberikan izin kamera atau jalankan aplikasi di tab baru dengan protokol HTTPS.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Process search or scanned value
  const handleLookup = (value: string) => {
    const cleanVal = value.trim().toUpperCase();
    if (!cleanVal) return;

    setScannedResult(cleanVal);

    // Look for exact match in ID (case-insensitive), driverCode, or vehiclePlate
    const match = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanVal ||
        o.vehiclePlate.replace(/\s+/g, '').toUpperCase() === cleanVal.replace(/\s+/g, '') ||
        o.driverCode.toUpperCase() === cleanVal
    );

    if (match) {
      setMatchedOrder(match);
    } else {
      setMatchedOrder(null);
    }
  };

  // Simulate scanning a specific DO's code (ideal for sandboxed preview iframe testing)
  const handleMockScan = (plateOrId: string) => {
    handleLookup(plateOrId);
    // Beep sound simulation using standard AudioContext
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // high pitched beep
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // AudioContext fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <span>Pindai Barcode / QR Kartu DO</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gunakan kamera atau input manual untuk verifikasi kilat kendaaraan.</p>
        </div>
        
        {/* Toggle Scan */}
        <button
          onClick={() => {
            setIsActive(!isActive);
            setScannedResult(null);
            setMatchedOrder(null);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isActive 
              ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isActive ? (
            <>
              <CameraOff className="w-3.5 h-3.5" />
              <span>Matikan Kamera</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              <span>Nyalakan Kamera</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* Live Camera Feed or Lookup Area */}
        {isActive ? (
          <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video border border-slate-800 flex flex-col justify-center items-center">
            
            {cameraError ? (
              <div className="p-6 text-center max-w-sm space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">{cameraError}</p>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">
                  Gunakan Fitur Mock Simulator di Bawah
                </span>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Scanner reticle overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-48 h-48 border-2 border-dashed border-blue-400/70 rounded-lg flex items-center justify-center">
                    
                    {/* Pulsing Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-lime-400 opacity-90 animate-[bounce_2s_infinite]"></div>
                    
                    {/* Reticle brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded text-[10px] text-slate-300 font-mono">
                  Mencari format: E-Ticket DO, Plat Nomor, atau ID Driver...
                </div>
              </>
            )}

          </div>
        ) : null}

        {/* Manual Barcode Input Search */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
            Input Nomor Kartu DO / No. Polisi
          </label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="cth: AA 8044 OB, B 9003 VQB, atau DO-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(searchQuery);
                }}
                className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-800 font-semibold uppercase tracking-wider"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={() => handleLookup(searchQuery)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Cari
            </button>
          </div>
        </div>

        {/* Mock QR / Barcode Quick Click Simulator (Perfect for testing inside an iframe) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Simulasi Ketuk Barcode Kartu (Quick Test)
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            Ketuk plat nomor armada di bawah ini untuk mensimulasikan sistem membaca barcode fisik kartu DO yang dibawa supir.
          </p>
          <div className="flex flex-wrap gap-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchQuery(o.vehiclePlate);
                  handleMockScan(o.vehiclePlate);
                }}
                className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold font-mono shadow-xs flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                <span>{o.vehiclePlate}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Results Panel */}
        {scannedResult && (
          <div className="border-t border-slate-100 pt-5 space-y-4 animate-fadeIn">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Hasil Pemindaian Terakhir
            </h3>

            {matchedOrder ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        DOKUMEN VALID ({matchedOrder.vehiclePlate})
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Driver: {matchedOrder.driverName} (Kode: {matchedOrder.driverCode})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                    {matchedOrder.location}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-emerald-200/50 pt-3">
                  <div>
                    <span className="text-slate-500">Kuota Target DO</span>
                    <p className="font-bold text-slate-800 font-mono">{matchedOrder.targetWeight.toLocaleString('id-ID')} Kg</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status Sekarang</span>
                    <p className="font-bold text-slate-800">{matchedOrder.status}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectForWeighing(matchedOrder);
                      // Smooth scroll to weighing station
                      const simulatorDiv = document.querySelector('.bg-slate-900');
                      if (simulatorDiv) {
                        simulatorDiv.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Lanjutkan ke Timbangan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateStatus(matchedOrder.id, 'Selesai')}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 py-2 px-3 rounded-lg cursor-pointer transition-colors"
                  >
                    Set Selesai
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900 uppercase">DO TIDAK DITEMUKAN / EXPIRED</h4>
                  <p className="text-xs text-rose-600 mt-1 leading-relaxed">
                    Kode barcode <span className="font-mono font-bold">"{scannedResult}"</span> tidak terdaftar dalam basis sistem DO aktif hari ini. 
                    Pastikan armada telah teregistrasi atau hubungi Admin Sales Broiler PBEPE.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
