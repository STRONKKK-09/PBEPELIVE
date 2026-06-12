import React, { useState } from 'react';
import { DeliveryOrder } from '../types';
import { Truck, Plus, Scale, Trash2, ArrowRightLeft, ShieldAlert, MessageSquare } from 'lucide-react';
import WhatsAppShareDialog from './WhatsAppShareDialog';

interface DOOverviewProps {
  orders: DeliveryOrder[];
  onAddDO: (order: Omit<DeliveryOrder, 'id'>) => void;
  onDeleteDO: (id: string) => void;
  onSelectForWeighing: (order: DeliveryOrder) => void;
  onUpdateStatus: (id: string, status: DeliveryOrder['status']) => void;
}

export default function DOOverview({
  orders,
  onAddDO,
  onDeleteDO,
  onSelectForWeighing,
  onUpdateStatus
}: DOOverviewProps) {
  // Manual adding form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverCode, setDriverCode] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [targetWeight, setTargetWeight] = useState(4500);
  
  // WhatsApp Share Dialog states
  const [isWAOpen, setIsWAOpen] = useState(false);
  const [waOrders, setWaOrders] = useState<DeliveryOrder[]>([]);
  const [location, setLocation] = useState('Mekarjaya');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !vehiclePlate) return;
    
    onAddDO({
      driverName,
      driverCode: driverCode || 'N/A',
      vehiclePlate: vehiclePlate.toUpperCase(),
      targetWeight,
      actualWeight: 0,
      tareWeight: 0,
      grossWeight: 0,
      status: 'Menunggu',
      location,
      date: new Date().toISOString().split('T')[0]
    });

    // Reset Form
    setDriverName('');
    setDriverCode('');
    setVehiclePlate('');
    setTargetWeight(4500);
    setShowAddForm(false);
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Proses Timbang':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Tahan Mobil':
        return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
      case 'Siap Berangkat':
        return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'Selesai':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Container Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>Daftar Delivery Order (DO) Aktif</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Kelola pergerakan armada, antrean berat, dan status jalan kendaraan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={() => {
                setWaOrders(orders);
                setIsWAOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer border border-emerald-500 hover:shadow-emerald-100"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Rekap WA</span>
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form' : 'Registrasi DO Mobil'}</span>
          </button>
        </div>
      </div>

      {/* Add New DO Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 border-b border-blue-50 bg-blue-50/20 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-blue-800">Tambah Delivery Order Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Supir / Driver *</label>
              <input
                type="text"
                placeholder="cth: Agung Nugroho"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kode / ID Driver</label>
              <input
                type="text"
                placeholder="cth: 2225"
                value={driverCode}
                onChange={(e) => setDriverCode(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 text-slate-800 font-medium font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Polisi (No. Pol) *</label>
              <input
                type="text"
                placeholder="cth: AA 8044 OB"
                required
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 text-slate-800 font-bold font-mono placeholder:font-sans placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kuota Target DO (Kg) *</label>
              <input
                type="number"
                step="50"
                min="500"
                max="15000"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 text-slate-800 font-semibold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Kebun / Kandang</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 text-slate-800 font-medium"
              >
                <option value="Mekarjaya">Mekarjaya (Default)</option>
                <option value="Subang Barat">Subang Barat</option>
                <option value="Subang Timur">Subang Timur</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Simpan & Daftarkan Antrean
              </button>
            </div>

          </div>
        </form>
      )}

      {/* Grid Layout of Cards for mobile, elegant responsive list for desktop */}
      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada Delivery Order aktif saat ini</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol registrasi atau simulasi Web Order di sebelah kanan untuk menambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${order.status === 'Tahan Mobil' ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200 bg-white'}`}
              >
                
                {/* Visual Header of Card */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {order.location}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <span className="text-slate-900 font-mono font-extrabold uppercase bg-slate-100 px-2 py-0.5 rounded text-sm border border-slate-200">
                        {order.vehiclePlate}
                      </span>
                    </h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status === 'Tahan Mobil' ? '⚠️ HABIS TIMBANG TAHAN MOBIL' : order.status}
                  </span>
                </div>

                {/* Card Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3 my-3">
                  <div>
                    <p className="text-slate-400 font-medium">Supir / Driver</p>
                    <p className="text-slate-800 font-bold mt-0.5">
                      {order.driverName} <span className="text-[10px] text-slate-400 font-mono">({order.driverCode})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Target Pengambilan</p>
                    <p className="text-slate-800 font-mono font-bold mt-0.5">
                      {order.targetWeight.toLocaleString('id-ID')} Kg
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Berat Timbang Riil</p>
                    <p className={`font-mono font-black mt-0.5 ${order.actualWeight > order.targetWeight ? 'text-rose-600' : 'text-slate-800'}`}>
                      {order.actualWeight > 0 ? `${order.actualWeight.toLocaleString('id-ID')} Kg` : '- belum ditimbang'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Selisih Muat</p>
                    <p className={`font-mono font-bold mt-0.5 ${order.actualWeight > order.targetWeight ? 'text-rose-600 font-extrabold' : 'text-slate-500'}`}>
                      {order.actualWeight > 0 ? `${(order.actualWeight - order.targetWeight).toLocaleString('id-ID')} Kg` : '-'}
                    </p>
                  </div>
                </div>

                {/* Scale Limit alert warning */}
                {/* Scale Limit alert warning */}
                {order.actualWeight > order.targetWeight && (
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-start gap-2 mb-3">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-rose-700 font-semibold leading-relaxed">
                      OVERWEIGHT! Berat timbang {order.actualWeight} Kg melebihi DO {order.targetWeight} Kg. Ambil tindakan bongkar atau tahan kendaraan!
                    </p>
                  </div>
                )}

                {/* Card Action footer */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {order.status !== 'Selesai' && (
                      <button
                        onClick={() => onSelectForWeighing(order)}
                        className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-blue-100"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Timbang Truk</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setWaOrders([order]);
                        setIsWAOpen(true);
                      }}
                      className="flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-emerald-100"
                      title="Kirim ke WhatsApp 6285156653112"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kirim WA</span>
                    </button>

                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as DeliveryOrder['status'])}
                      className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium rounded-lg px-2 py-1 focus:outline-hidden"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Proses Timbang">Proses Timbang</option>
                      <option value="Tahan Mobil">Tahan Mobil</option>
                      <option value="Siap Berangkat">Siap Berangkat</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onDeleteDO(order.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-medium"
                    title="Hapus DO"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Share dialog modal */}
      <WhatsAppShareDialog
        isOpen={isWAOpen}
        onClose={() => {
          setIsWAOpen(false);
          setWaOrders([]);
        }}
        orders={waOrders}
        title={waOrders.length > 1 ? "Kirim Rekapitulasi Pembelian (WhatsApp)" : "Kirim Status DO Mobil (WhatsApp)"}
      />

    </div>
  );
}
