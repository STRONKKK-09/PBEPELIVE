import React, { useState } from 'react';
import { Key, ShieldCheck, Globe, Star, Package, ShoppingCart, HelpCircle, MessageSquare } from 'lucide-react';
import { DeliveryOrder } from '../types';
import WhatsAppShareDialog from './WhatsAppShareDialog';

interface WebOrderPortalProps {
  onAddFromWebOrder: (newDO: { driverName: string; driverCode: string; vehiclePlate: string; targetWeight: number; location: string }) => void;
}

export default function WebOrderPortal({ onAddFromWebOrder }: WebOrderPortalProps) {
  // Login states
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Booking states
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [driverCode, setDriverCode] = useState('2511');
  const [vehiclePlate, setVehiclePlate] = useState('B 9132 SUJ');
  const [orderItem, setOrderItem] = useState<'Ayam Broiler Liveweight' | 'Pakan Starter S10' | 'Pakan Grower S12'>('Ayam Broiler Liveweight');
  const [targetWeight, setTargetWeight] = useState(4500);
  const [location, setLocation] = useState('Mekarjaya');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  // WhatsApp Share Dialog State
  const [isWAOpen, setIsWAOpen] = useState(false);
  const [lastOrderedDO, setLastOrderedDO] = useState<DeliveryOrder[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = userId.trim().toUpperCase();
    const cleanPass = password.trim();

    // Verifying credentials from the WhatsApp image:
    // ID: SKAGU21
    // Pas :: init1234
    if (cleanId === 'SKAGU21' && cleanPass === 'init1234') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('ID Pelanggan atau Password salah. Gunakan ID: SKAGU21, Pas: init1234 sesuai slip instruksi.');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !vehiclePlate) return;

    // Trigger parent callback to put interactive DO in queue
    onAddFromWebOrder({
      driverName,
      driverCode,
      vehiclePlate: vehiclePlate.toUpperCase(),
      targetWeight,
      location,
    });

    // Create a local DO preview for WhatsApp
    const localDO: DeliveryOrder = {
      id: `do-pending`,
      driverName,
      driverCode: driverCode || '2511',
      vehiclePlate: vehiclePlate.toUpperCase(),
      targetWeight,
      actualWeight: 0,
      tareWeight: 0,
      grossWeight: 0,
      status: 'Menunggu',
      location,
      date: new Date().toISOString().split('T')[0]
    };
    setLastOrderedDO([localDO]);

    setShowOrderSuccess(true);
    setTimeout(() => {
      // Don't auto hide order success too quickly so they have time to click the WhatsApp button
    }, 10000);
  };

  const handleQuickAutofill = () => {
    setUserId('SKAGU21');
    setPassword('init1234');
    setLoginError('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-indigo-100 bg-indigo-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>Portal Order Pelanggan PBEPE</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Simulasi Pemesanan Digital pbepe.id/customer/</p>
        </div>
        <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-sm">
          CUSTOMER B2B
        </div>
      </div>

      <div className="p-6">
        {!isLoggedIn ? (
          /* LOGIN PANEL */
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Petunjuk Kredensial</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Silakan login menggunakan data akun yang ada di slip percakapan untuk memesan muatan unggas, pakan, atau DO baru.
              </p>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] space-y-0.5 font-mono text-slate-700">
                  <div>ID Pelanggan: <span className="font-bold text-slate-900">SKAGU21</span></div>
                  <div>Password: <span className="font-bold text-slate-900">init1234</span></div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickAutofill}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                >
                  Autofill Akun
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ID Pelanggan (Customer ID)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Masukkan ID Pelanggan"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-800 placeholder:text-slate-400 font-semibold uppercase tracking-wider"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-900 placeholder:text-slate-400"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-rose-600 font-semibold leading-relaxed">
                  ⚠️ {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Masuk Portal Pelanggan</span>
              </button>
            </form>
          </div>
        ) : (
          /* NEW ORDER BOOKING PANEL (Logged In) */
          <div className="space-y-4 animate-fadeIn">
            
            {/* Logged in success banner */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ID Pelanggan: SKAGU21 (MITRA PBEPE)</span>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>

            {/* Notification of synchronous updates with WA share */}
            {showOrderSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-3 shadow-md animate-fadeIn">
                <div className="flex items-center space-x-2 font-bold text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sukses! DO telah disinkronisasikan ke Antrean Jembatan Timbang.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWAOpen(true)}
                  className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Notifikasi WA ke 6285156653112</span>
                </button>
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                Buat Web Order & Delivery Order (DO)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Item Komoditas</label>
                <select
                  value={orderItem}
                  onChange={(e) => setOrderItem(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold"
                >
                  <option value="Ayam Broiler Liveweight">Ayam Broiler Hidup (Liveweight)</option>
                  <option value="Pakan Starter S10">Pakan Starter S10 (CJ Feed)</option>
                  <option value="Pakan Grower S12">Pakan Grower S12 (CJ Feed)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Berat (Kg)</label>
                  <input
                    type="number"
                    step="100"
                    min="1000"
                    max="10000"
                    required
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Distribusi</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="Mekarjaya">Mekarjaya</option>
                    <option value="Subang Barat">Subang Barat</option>
                    <option value="Subang Timur">Subang Timur</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Delegasi Pengemudi & Armada Jemput
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Supir / Driver</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Supir"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kode Driver</label>
                    <input
                      type="text"
                      required
                      placeholder="Kode ID"
                      value={driverCode}
                      onChange={(e) => setDriverCode(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nopol Armada Truk</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: B 9003 VQB"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-bold font-mono placeholder:font-sans placeholder:font-normal uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Kirim DO ke Antrean Timbangan</span>
              </button>
            </form>
          </div>
        )}
      </div>

      <WhatsAppShareDialog
        isOpen={isWAOpen}
        onClose={() => setIsWAOpen(false)}
        orders={lastOrderedDO}
        title="Kirim Tiket Web Order ke WhatsApp"
      />

    </div>
  );
}
