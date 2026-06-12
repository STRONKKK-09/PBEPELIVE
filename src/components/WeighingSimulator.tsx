import React, { useState, useEffect } from 'react';
import { DeliveryOrder } from '../types';
import { Scale, RotateCcw, AlertTriangle, Check, ShieldCheck, Download } from 'lucide-react';

interface WeighingSimulatorProps {
  orders: DeliveryOrder[];
  selectedOrder: DeliveryOrder | null;
  onUpdateWeights: (id: string, gross: number, tare: number, status: DeliveryOrder['status']) => void;
  onSelectOrder: (order: DeliveryOrder | null) => void;
}

export default function WeighingSimulator({
  orders,
  selectedOrder,
  onUpdateWeights,
  onSelectOrder
}: WeighingSimulatorProps) {
  // Input weights
  const [grossInput, setGrossInput] = useState<number>(10500); // weight of truck with chicken
  const [tareInput, setTareInput] = useState<number>(6000);   // empty truck weight
  const [netWeight, setNetWeight] = useState<number>(4500);   // gross - tare

  // Update inputs if selected order has existing data
  useEffect(() => {
    if (selectedOrder) {
      if (selectedOrder.grossWeight > 0) {
        setGrossInput(selectedOrder.grossWeight);
        setTareInput(selectedOrder.tareWeight);
      } else {
        // Defaults: target is 4500 => gross = 10500, tare = 6000
        const target = selectedOrder.targetWeight;
        setTareInput(6000);
        setGrossInput(6000 + target);
      }
    }
  }, [selectedOrder]);

  // Compute net weight on inputs change
  useEffect(() => {
    const net = grossInput - tareInput;
    setNetWeight(net > 0 ? net : 0);
  }, [grossInput, tareInput]);

  const selectables = orders.filter(o => o.status !== 'Selesai');

  const handleApplyWeight = (e: React.FormEvent, isHold: boolean) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    const finalStatus = isHold ? 'Tahan Mobil' : 'Siap Berangkat';
    onUpdateWeights(selectedOrder.id, grossInput, tareInput, finalStatus);
  };

  const handleNormalizeWeight = () => {
    if (!selectedOrder) return;
    // Set to exact target
    setGrossInput(tareInput + selectedOrder.targetWeight);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Title area */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <span>Pos Jembatan Timbang (Weighing Station)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Lakukan penimbangan riil armada pengangkut untuk mencegah kelebihan muatan.</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Truck Selection Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pilih Kendaraan Antrean Timbang
          </label>
          <select
            value={selectedOrder ? selectedOrder.id : ''}
            onChange={(e) => {
              const found = orders.find(o => o.id === e.target.value);
              onSelectOrder(found || null);
            }}
            className="w-full text-sm border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-800 font-bold focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="">-- Silahkan Pilih Plat Kendaraan di Lokasi --</option>
            {selectables.map(o => (
              <option key={o.id} value={o.id}>
                {o.vehiclePlate} - {o.driverName} ({o.location} [Target: {o.targetWeight} Kg])
              </option>
            ))}
          </select>
        </div>

        {selectedOrder ? (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Live Indicator Panel (Simulated Scale Display) */}
            <div className="bg-slate-900 text-lime-400 p-6 rounded-2xl border-4 border-slate-700 shadow-inner text-center font-mono relative overflow-hidden">
              <div className="absolute top-2 left-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping"></span>
                <span>Live Scale Indicator</span>
              </div>
              <div className="absolute top-2 right-4 text-[10px] text-slate-400 font-mono">
                No. Pol: <span className="text-white font-bold">{selectedOrder.vehiclePlate}</span>
              </div>

              {/* Huge Weight Counter */}
              <div className="py-4">
                <span className="text-5xl font-black">{netWeight.toLocaleString('id-ID')}</span>
                <span className="text-lg font-bold ml-2">Kg</span>
              </div>

              {/* Status footer inside indicator */}
              <div className="flex justify-between border-t border-slate-800 pt-3 mt-2 text-xs text-slate-300">
                <div>
                  Kotor: <span className="text-white font-bold">{grossInput.toLocaleString('id-ID')} Kg</span>
                </div>
                <div>
                  Kosong: <span className="text-white font-bold">{tareInput.toLocaleString('id-ID')} Kg</span>
                </div>
                <div>
                  Target: <span className="text-blue-400 font-bold">{selectedOrder.targetWeight.toLocaleString('id-ID')} Kg</span>
                </div>
              </div>
            </div>

            {/* Warning indicator */}
            {netWeight > selectedOrder.targetWeight ? (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">⚠️ PERINGATAN: PENGAMBILAN MELEBIHI DO!</h4>
                  <p className="text-xs text-rose-600 mt-1 leading-relaxed">
                    Berat Bersih muatan ({netWeight} Kg) melebihi batas toleransi dokumen DO ({selectedOrder.targetWeight} Kg). 
                    Regulasi melarang pemuatan berlebih. Harap lakukan penyesuaian muatan (bongkar sebagian ayam broiler).
                  </p>
                  <button
                    type="button"
                    onClick={handleNormalizeWeight}
                    className="mt-3 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Lakukan Bongkar Muatan Secara Otomatis</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-800 font-medium">
                  Muatan Aman. Berat bersih berada di bawah atau sama dengan target DO ({selectedOrder.targetWeight} Kg). Lolos verifikasi timbangan.
                </p>
              </div>
            )}

            {/* Slider/Input Controls for simulation */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Simulasikan Berat Timbangan</h4>
              
              {/* Gross weight slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Berat Kotor (Gross)</span>
                  <span className="font-mono">{grossInput.toLocaleString('id-ID')} Kg</span>
                </div>
                <input
                  type="range"
                  min={tareInput + 100}
                  max={tareInput + selectedOrder.targetWeight + 1500}
                  value={grossInput}
                  onChange={(e) => setGrossInput(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Tare weight slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Berat Kosong Truk (Tare)</span>
                  <span className="font-mono">{tareInput.toLocaleString('id-ID')} Kg</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="8000"
                  step="50"
                  value={tareInput}
                  onChange={(e) => setTareInput(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Option A: Hold vehicle (like the Whastapp pic: "habis timbang tahan mobil") */}
              <button
                type="button"
                onClick={(e) => handleApplyWeight(e, true)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl text-center flex flex-col items-center justify-center gap-1 shadow-sm transition-all cursor-pointer border border-slate-900"
              >
                <span className="text-amber-400 font-extrabold text-[10px] tracking-wide uppercase">Opsi 1</span>
                <span className="text-xs">Tahan Mobil</span>
              </button>

              {/* Option B: Direct approve and print ticket */}
              <button
                type="button"
                disabled={netWeight > selectedOrder.targetWeight}
                onClick={(e) => handleApplyWeight(e, false)}
                className={`py-3 px-4 rounded-xl text-center flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all shadow-sm ${
                  netWeight > selectedOrder.targetWeight 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer border border-emerald-600'
                }`}
              >
                <span className={`${netWeight > selectedOrder.targetWeight ? 'text-slate-400' : 'text-emerald-300'} font-extrabold text-[10px] tracking-wide uppercase`}>Opsi 2</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Siap Jalan</span>
              </button>

            </div>

          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-600 font-semibold">Silahkan pilih kendaraan di atas untuk mulai menimbang.</p>
            <p className="text-xs text-slate-400 mt-1">Input simulasi timbangan kotor & kosong akan terbuka otomatis.</p>
          </div>
        )}

      </div>

    </div>
  );
}
