import React, { useState } from 'react';
import { DeliveryOrder, UserAccount, HarvestItem } from '../types';
import { 
  Globe, 
  User, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  QrCode, 
  Truck, 
  Send, 
  RotateCcw, 
  Printer, 
  ChevronRight, 
  ShieldAlert, 
  HelpCircle,
  LogOut,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import WhatsAppShareDialog from './WhatsAppShareDialog';

interface CustomerDashboardProps {
  orders: DeliveryOrder[];
  onAddFromWebOrder: (newDO: { 
    driverName: string; 
    driverCode: string; 
    vehiclePlate: string; 
    targetWeight: number; 
    location: string; 
  }) => void;
  onLogout: () => void;
  currentUser: UserAccount | null;
  harvests: HarvestItem[];
}

export default function CustomerDashboard({ 
  orders, 
  onAddFromWebOrder, 
  onLogout,
  currentUser,
  harvests
}: CustomerDashboardProps) {
  // Input states for new order
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [driverCode, setDriverCode] = useState('2511');
  const [vehiclePlate, setVehiclePlate] = useState('B 9132 SUJ');
  const [targetWeight, setTargetWeight] = useState(4500);
  const [location, setLocation] = useState('Mekarjaya');
  
  // Interface controls
  const [selectedTicket, setSelectedTicket] = useState<DeliveryOrder | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'tracker'>('tracker');

  // WhatsApp states
  const [isWAOpen, setIsWAOpen] = useState(false);
  const [waOrders, setWaOrders] = useState<DeliveryOrder[]>([]);

  const handleSelectHarvestUnit = (item: typeof harvests[0]) => {
    let mappedLocation = 'Mekarjaya';
    if (item.location.includes('Subang Barat')) mappedLocation = 'Subang Barat';
    if (item.location.includes('Subang Timur')) mappedLocation = 'Subang Timur';
    setLocation(mappedLocation);
    setActiveTab('create');
    alert(`Dipilih: ${item.id} (${item.location}). Mengisi lokasi ke formulir registrasi antrean DO baru. Harap lengkapi plat nomor & nama supir armada Anda.`);
  };

  // Filter orders that belong to this mock customer (SKAGU21)
  // Initially we display all orders registered, since we use same mock dataset for yard operability
  const customerOrders = orders;

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !vehiclePlate) return;

    onAddFromWebOrder({
      driverName,
      driverCode,
      vehiclePlate: vehiclePlate.toUpperCase(),
      targetWeight,
      location
    });

    setShowOrderSuccess(true);
    setActiveTab('tracker'); // Jump to tracker to observe status
    setTimeout(() => {
      setShowOrderSuccess(false);
    }, 4000);
  };

  const getStepProgressIndex = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'Menunggu': return 1;
      case 'Proses Timbang': return 2;
      case 'Tahan Mobil': return 3; // high Alert
      case 'Siap Berangkat': return 4;
      case 'Selesai': return 5;
      default: return 1;
    }
  };

  const handlePrintTicket = (order: DeliveryOrder) => {
    alert(`Mencetak E-Ticket untuk Driver ${order.driverName} (${order.vehiclePlate}). Silakan bawa file digital ini ke jembatan timbang.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Customer Header Info bar */}
      <div className="bg-indigo-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg border border-indigo-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-indigo-500/20 to-transparent rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-200">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase font-mono">PBEPE Portal &bull; pbepe.id/customer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Datang, <span className="text-lime-400">{currentUser?.name || 'Mitra Pelanggan PBEPE'}</span>
            </h1>
            <p className="text-indigo-200 text-xs md:text-sm max-w-xl">
              Gunakan portal ini untuk memantau berat timbangan broiler secara real-time di gerbang jembatan timbang PBEPE, mengunduh E-Ticket DO digital, serta merencanakan jadwal penjemputan unggas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-800/80 px-4 py-2.5 rounded-xl border border-indigo-700 font-mono text-xs">
              <div className="text-white font-bold text-[10px] text-indigo-300">ID PELANGGAN</div>
              <div className="font-black text-sm tracking-widest text-lime-400">{currentUser?.username || 'SKAGU21'}</div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main warning bar duplicated for customer safety */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-xs">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
          </div>
          <div className="ml-3">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
              REGULASI TELESKOPIS: PENGAMBILAN TIDAK BOLEH MELEBIHI TARGET DO 
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              Berdasarkan kebijakan kemitraan PBEPE Broiler, status <span className="font-bold underline text-amber-900"># DO BERLAKU 1 HARI</span>. 
              Armada dengan hasil timbang melebihi alokasi tonase secara otomatis akan dialihkan ke status <span className="font-bold text-rose-700">Tahan Mobil</span> oleh operator jembatan timbang.
            </p>
          </div>
        </div>
      </div>

      {/* KATALOG INFORMASI PANEN - CUSTOMER REQ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Katalog &amp; Informasi Panen Broiler PBEPE</h3>
              <p className="text-[11px] text-slate-500">Ketersediaan ayam siap panen di berbagai blok kandang mitra terpadu.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
            Stok Terkini Update Real-time
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {harvests.map((item) => (
            <div 
              key={item.id} 
              className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold text-slate-400">ID: {item.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.status === 'Sedang Panen' 
                      ? 'bg-amber-100 text-amber-850 border border-amber-200' 
                      : item.status === 'Siap Panen'
                      ? 'bg-emerald-100 text-emerald-850 border border-emerald-200'
                      : 'bg-indigo-100 text-indigo-850 border border-indigo-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-800">{item.location}</h4>
                
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-slate-600 pt-1">
                  <div>Umur Ayam: <span className="font-bold text-slate-800 font-mono">{item.ageDays} Hari</span></div>
                  <div>Rentang Bobot: <span className="font-bold text-slate-800 font-mono">{item.weightMin?.toFixed(1).replace('.', ',')} - {item.weightMax?.toFixed(1).replace('.', ',')} Kg</span></div>
                  <div>Estimasi Stok: <span className="font-bold text-slate-800 font-mono">{(item.stockCount).toLocaleString('id-ID')} ekor</span></div>
                  <div>Harga Acuan: <span className="font-bold text-indigo-600 font-mono">Rp {item.pricePerKg.toLocaleString('id-ID')}/Kg</span></div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectHarvestUnit(item)}
                className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] py-1.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1 mt-1 font-sans"
              >
                <span>Daftarkan Armada ke Kandang Ini</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Customer Workspace Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Order Placing & Status Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Navigation Tab buttons */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit border border-slate-300">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'tracker' 
                  ? 'bg-white shadow-xs text-blue-700' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Pantau Status Armada live ({customerOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'create' 
                  ? 'bg-white shadow-xs text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Registrasi Antrean DO Baru</span>
            </button>
          </div>

          {/* TAB 1: Real-time Live Order Tracker */}
          {activeTab === 'tracker' && (
            <div className="space-y-4">
              
              {showOrderSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-slate-800 rounded-xl space-y-3 shadow-md animate-fadeIn">
                  <div className="flex items-center space-x-2 font-bold text-xs text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Registrasi Berhasil! Armada baru telah diunggah ke antrean lapangan Mekarjaya.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (customerOrders.length > 0) {
                        setWaOrders([customerOrders[0]]);
                        setIsWAOpen(true);
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Kirim Slip Order ke WhatsApp 6285156653112</span>
                  </button>
                </div>
              )}

              {customerOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                  <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">Tidak ada pengiriman terdaftar</p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="mt-3 text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Mulai daftarkan supir & nomor polisi disini &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((order) => {
                    const step = getStepProgressIndex(order.status);
                    const isOverweight = order.actualWeight > order.targetWeight;

                    return (
                      <div 
                        key={order.id} 
                        className={`bg-white rounded-2xl border transition-all hover:shadow-xs p-5 space-y-4 ${
                          order.status === 'Tahan Mobil' 
                            ? 'border-rose-300 bg-rose-50/10' 
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Header info of vehicle */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold font-mono bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-md uppercase">
                                {order.vehiclePlate}
                              </span>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
                                {order.location}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Supir: <span className="font-bold text-slate-700">{order.driverName}</span> &bull; ID: <span className="font-mono">{order.driverCode}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {order.status === 'Tahan Mobil' ? (
                              <span className="text-[11px] font-bold bg-rose-500 text-white px-3 py-1 rounded-full border border-rose-600 animate-pulse">
                                ⚠️ HABIS TIMBANG TAHAN MOBIL
                              </span>
                            ) : (
                              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                                order.status === 'Selesai' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                Status: {order.status}
                              </span>
                            )}

                            <button
                              onClick={() => {
                                setWaOrders([order]);
                                setIsWAOpen(true);
                              }}
                              className="text-slate-500 hover:text-emerald-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Bagikan ke WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setSelectedTicket(order)}
                              className="text-slate-500 hover:text-indigo-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Tampilkan Digital QR E-Ticket"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Status visual step tracker */}
                        <div className="border-t border-slate-100 pt-4">
                          <div className="relative flex justify-between">
                            
                            {/* Horizontal Line background */}
                            <div className="absolute top-2 left-0 right-0 h-0.5 bg-slate-200 -z-0"></div>
                            
                            {/* Visual line progress fill */}
                            <div 
                              className={`absolute top-2 left-0 h-0.5 transition-all duration-500 -z-0 ${
                                order.status === 'Tahan Mobil' ? 'bg-rose-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${((step - 1) / 4) * 100}%` }}
                            ></div>

                            {/* Node 1: Terdaftar */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                                step >= 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                              }`}>
                                1
                              </div>
                              <span className="text-[10px] font-bold mt-1 text-slate-500">Terdaftar</span>
                            </div>

                            {/* Node 2: Antrean */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                                step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                              }`}>
                                2
                              </div>
                              <span className="text-[10px] font-bold mt-1 text-slate-500">Timbangan</span>
                            </div>

                            {/* Node 3: Keputusan Berat / Tahan */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                                order.status === 'Tahan Mobil'
                                  ? 'bg-rose-600 border-rose-600 text-white animate-ping'
                                  : step >= 3 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                              }`}>
                                3
                              </div>
                              <span className={`text-[10px] font-bold mt-1 ${order.status === 'Tahan Mobil' ? 'text-rose-600' : 'text-slate-500'}`}>
                                {order.status === 'Tahan Mobil' ? 'Tahan Muat' : 'Verifikasi'}
                              </span>
                            </div>

                            {/* Node 4: Siap Jalan */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                                step >= 4 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                              }`}>
                                4
                              </div>
                              <span className="text-[10px] font-bold mt-1 text-slate-500">Siap Jalan</span>
                            </div>

                            {/* Node 5: Selesai */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                                step >= 5 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                              }`}>
                                5
                              </div>
                              <span className="text-[10px] font-bold mt-1 text-slate-500">Selesai</span>
                            </div>

                          </div>
                        </div>

                        {/* Critical weigh results explanation */}
                        <div className="bg-slate-50 p-3 rounded-xl flex flex-wrap justify-between items-center text-xs text-slate-600 gap-3">
                          <div className="flex items-center gap-4">
                            <div>
                              Alokasi DO: <span className="font-bold text-slate-900 font-mono">{order.targetWeight.toLocaleString('id-ID')} Kg</span>
                            </div>
                            {order.actualWeight > 0 && (
                              <div>
                                Hasil Timbang: <span className={`font-bold font-mono ${isOverweight ? 'text-rose-600' : 'text-slate-900'}`}>
                                  {order.actualWeight.toLocaleString('id-ID')} Kg
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {order.status === 'Tahan Mobil' && (
                              <div className="text-rose-600 font-bold text-[11px] animate-pulse flex items-center gap-1 bg-rose-50 px-2 py-1 rounded">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Kelebihan {order.actualWeight - order.targetWeight} Kg! Hubungi Kantor</span>
                              </div>
                            )}

                            <button
                              onClick={() => setSelectedTicket(order)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Lihat Detail Tiket</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Self-Service B2B Order Placing */}
          {activeTab === 'create' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800">
                  Formulir Mandiri Alokasi Muatan Broiler (cjfnc)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan target tonase DO dan tunjuk pengemudi penjemput secara real-time.
                </p>
              </div>

              <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Nama Supir / Driver *</label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Kode / ID Driver</label>
                    <input
                      type="text"
                      value={driverCode}
                      onChange={(e) => setDriverCode(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Plat Nomor Truk (No. Pol) *</label>
                    <input
                      type="text"
                      required
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-mono font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Target Kuota Muatan (Kg) *</label>
                    <input
                      type="number"
                      step="100"
                      min="1000"
                      max="12000"
                      required
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(Number(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Kandang Alokasi Depot</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold"
                  >
                    <option value="Mekarjaya">Mekarjaya Depot (Utama)</option>
                    <option value="Subang Barat">Subang Barat Depot</option>
                    <option value="Subang Timur">Subang Timur Depot</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Daftarkan Armada & Terbitkan DO Nomor Urut</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

        {/* Right Column: Active Interactive E-Ticket PDF/QR Card */}
        <div className="space-y-6">
          
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-md p-6 space-y-6 relative overflow-hidden animate-fadeIn">
              
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/10 rounded-bl-full"></div>
              
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">E-Ticket Digital DO Anda</h3>
              </div>

              {/* Printable Ticket Shape */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono space-y-4 relative shadow-inner">
                {/* Visual punches */}
                <div className="absolute -left-2 top-1/2 -mt-1.5 w-3.5 h-3.5 bg-white border-r border-slate-200 rounded-full"></div>
                <div className="absolute -right-2 top-1/2 -mt-1.5 w-3.5 h-3.5 bg-white border-l border-slate-200 rounded-full"></div>

                <div className="text-center pb-2 border-b border-dashed border-slate-300">
                  <span className="font-sans font-bold text-indigo-700 text-xs">PBEPE BROILER &bull; SUBANG DEPOT</span>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-sans">SISTEM VALIDASI JEMBATAN TIMBANG</p>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID TIKET:</span>
                    <span className="font-bold text-slate-800 uppercase">{selectedTicket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SUPIR:</span>
                    <span className="font-bold text-slate-800">{selectedTicket.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PLAT:</span>
                    <span className="font-bold text-slate-800 uppercase">{selectedTicket.vehiclePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TARGET DO:</span>
                    <span className="font-extrabold text-blue-700">{selectedTicket.targetWeight.toLocaleString('id-ID')} Kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">YARD DEPOT:</span>
                    <span className="font-bold text-slate-800">{selectedTicket.location}</span>
                  </div>
                  {selectedTicket.actualWeight > 0 && (
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-xs">
                      <span className="text-slate-400">TIMBANG RIIL:</span>
                      <span className={`font-black ${selectedTicket.actualWeight > selectedTicket.targetWeight ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedTicket.actualWeight.toLocaleString('id-ID')} Kg
                      </span>
                    </div>
                  )}
                </div>

                {/* Simulated QR block */}
                <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-slate-200/50 mt-4">
                  <QrCode className="w-24 h-24 text-slate-800" />
                  <span className="text-[8px] text-slate-400 font-sans tracking-widest mt-1 uppercase font-mono">
                    {selectedTicket.id}-{selectedTicket.vehiclePlate}
                  </span>
                </div>

                {/* Barcode representation */}
                <div className="text-center text-[10px] text-slate-500 font-sans pt-2 border-t border-dashed border-slate-200">
                  Masa Berlaku Hari Ini &bull; {selectedTicket.date}
                </div>
              </div>

              {/* PDF Print/Download button */}
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handlePrintTicket(selectedTicket)}
                  className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors hover:bg-slate-800"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Tiket QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 space-y-3 shadow-xs">
              <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700 uppercase">E-Ticket Generator</h4>
              <p className="text-xs text-slate-500">
                Tekan tombol ikon QR atau tautan detail di daftar armada Anda untuk memunculkan slip Barcode digital untuk supir.
              </p>
              {customerOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTicket(customerOrders[0])}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Tampilkan Tiket Mobil Pertama
                </button>
              )}
            </div>
          )}

          {/* Quick Support Card */}
          <div className="bg-slate-100 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs leading-relaxed text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Butuh Bantuan Lapangan?</span>
            </h4>
            <p>
              Jika armada truk Anda tertahan di depo atau ingin meminta dispensasi toleransi tonase timbang, silakan hubungi Customer Service Yard atau logistik PBEPE Subang.
            </p>
            <div className="pt-1 font-mono font-bold text-indigo-700">
              Hotline PBEPE Depot: +62 811-3000-PBEPE
            </div>
          </div>

        </div>

      </div>

      <WhatsAppShareDialog
        isOpen={isWAOpen}
        onClose={() => {
          setIsWAOpen(false);
          setWaOrders([]);
        }}
        orders={waOrders}
        title="Kirim Tiket DO Air via WhatsApp"
      />

    </div>
  );
}
