import React from 'react';
import { DeliveryOrder } from '../types';
import { ShieldAlert, Scale, CheckCircle2, Clock, Truck, Weight, Download } from 'lucide-react';

interface AnalyticsPanelProps {
  orders: DeliveryOrder[];
}

export default function AnalyticsPanel({ orders }: AnalyticsPanelProps) {
  // Compute analytics from active DO list
  const totalDO = orders.length;
  const completedDO = orders.filter(o => o.status === 'Selesai').length;
  const heldDO = orders.filter(o => o.status === 'Tahan Mobil').length;
  
  const totalTargetWeight = orders.reduce((sum, o) => sum + o.targetWeight, 0);
  const totalActualWeight = orders.reduce((sum, o) => sum + o.actualWeight, 0);
  
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleDownloadCSV = () => {
    // Header definition
    const headers = [
      'ID DO', 
      'Tanggal', 
      'Nama Supir', 
      'Kode Supir', 
      'No. Polisi', 
      'Lokasi Depot', 
      'Target Muatan (Kg)', 
      'Berat Kotor / Gross (Kg)', 
      'Berat Kosong / Tare (Kg)', 
      'Realisasi Bersih / Netto (Kg)', 
      'Selisih Overweight (Kg)', 
      'Status Operasional'
    ];

    const rows = orders.map(order => {
      const actual = order.actualWeight;
      const target = order.targetWeight;
      const diff = actual > target ? actual - target : 0;
      return [
        order.id,
        order.date,
        order.driverName,
        order.driverCode,
        order.vehiclePlate,
        order.location,
        target,
        order.grossWeight || 0,
        order.tareWeight || 0,
        actual || 0,
        diff,
        order.status
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_DO_Broiler_PBEPE_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Important Warning / Policy Banner - Inspired directly by the WhatsApp screenshot */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-xs">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between items-center">
            <div>
              <p className="text-sm font-bold text-amber-900 uppercase tracking-tight">
                PENGAMBILAN TIDAK BOLEH MELEBIHI DO
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Setiap armada wajib melalui jembatan timbang sebelum meninggalkan depo. Jika kelebihan berat, mobil akan ditahan demi kepatuhan muatan.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex items-center space-x-2 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200">
              <Clock className="w-4 h-4 text-amber-800" />
              <span className="text-xs font-bold text-amber-900 uppercase"># DO BERLAKU 1 HARI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Real-time target scale progress */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Weight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Target DO</p>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono">
              {totalTargetWeight.toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-500">Kg</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Akumulasi seluruh Delivery Order</p>
          </div>
        </div>

        {/* Real-time weighed results */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${totalActualWeight > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Realisasi Timbang</p>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono">
              {totalActualWeight.toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-500">Kg</span>
            </h3>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[11px] font-bold text-emerald-600">
                {totalTargetWeight > 0 ? Math.round((totalActualWeight / totalTargetWeight) * 100) : 0}%
              </span>
              <span className="text-[11px] text-slate-400">terpenuhi</span>
            </div>
          </div>
        </div>

        {/* Checked/Held Truck Statuses */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${heldDO > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Armada Ditahan</p>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono">
              {heldDO} / {totalDO} <span className="text-xs font-medium text-slate-500">Unit</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Status: Habis Timbang Tahan</span>
          </div>
        </div>

        {/* Checked Finished Stat */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">DO Selesai Kantor</p>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono">
              {completedDO} / {totalDO} <span className="text-xs font-medium text-slate-500">Selesai</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Administrasi Tuntas</p>
          </div>
        </div>

      </div>

      {/* Date & Shift Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-100 p-4 rounded-xl border border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-md text-xs tracking-wider">
            SHIFT 1
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{currentDateFormatted}</h4>
            <p className="text-xs text-slate-500">Masa Berlaku Dokumen DO s.d 23:59 WIB</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <div className="text-xs bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
            Lokasi Utama Depot: <span className="font-bold text-slate-900">Mekarjaya</span>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
            id="download-csv-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan CSV</span>
          </button>
        </div>
      </div>

    </div>
  );
}
