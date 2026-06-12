import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Calendar, 
  TrendingUp, 
  Coins, 
  Layers, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { HarvestItem } from '../types';

interface HarvestsManagerProps {
  harvests: HarvestItem[];
  onAddHarvest: (item: Omit<HarvestItem, 'id'>) => void;
  onUpdateHarvest: (item: HarvestItem) => void;
  onDeleteHarvest: (id: string) => void;
}

export default function HarvestsManager({
  harvests,
  onAddHarvest,
  onUpdateHarvest,
  onDeleteHarvest
}: HarvestsManagerProps) {
  // Add state
  const [showAddForm, setShowAddForm] = useState(false);
  const [location, setLocation] = useState('');
  const [ageDays, setAgeDays] = useState<number>(33);
  const [weightMin, setWeightMin] = useState<number>(0.9);
  const [weightMax, setWeightMax] = useState<number>(1.1);
  const [stockCount, setStockCount] = useState<number>(12000);
  const [pricePerKg, setPricePerKg] = useState<number>(21000);
  const [status, setStatus] = useState('Siap Panen');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState('');
  const [editAgeDays, setEditAgeDays] = useState<number>(0);
  const [editWeightMin, setEditWeightMin] = useState<number>(0);
  const [editWeightMax, setEditWeightMax] = useState<number>(0);
  const [editStockCount, setEditStockCount] = useState<number>(0);
  const [editPricePerKg, setEditPricePerKg] = useState<number>(0);
  const [editStatus, setEditStatus] = useState('');

  const STATUS_OPTIONS = ['Siap Panen', 'Sedang Panen', 'Estimasi Besok', 'Selesai Panen'];

  // Handle adding new stock
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!location.trim()) {
      setErrorMsg('Nama Lokasi / Kandang tidak boleh kosong!');
      return;
    }

    if (ageDays <= 0 || weightMin <= 0 || weightMax <= 0 || stockCount <= 0 || pricePerKg <= 0) {
      setErrorMsg('Semua nilai numerik harus lebih besar dari 0!');
      return;
    }

    if (weightMin > weightMax) {
      setErrorMsg('Rentang bobot tidak valid! Bobot kecil harus lebih rendah atau sama dengan bobot besar.');
      return;
    }

    onAddHarvest({
      location: location.trim(),
      ageDays,
      weightMin,
      weightMax,
      stockCount,
      pricePerKg,
      status
    });

    // Reset Form
    setLocation('');
    setAgeDays(33);
    setWeightMin(0.9);
    setWeightMax(1.1);
    setStockCount(12000);
    setPricePerKg(21000);
    setStatus('Siap Panen');
    setShowAddForm(false);
  };

  // Turn on edit mode
  const startEditing = (item: HarvestItem) => {
    setEditingId(item.id);
    setEditLocation(item.location);
    setEditAgeDays(item.ageDays);
    setEditWeightMin(item.weightMin);
    setEditWeightMax(item.weightMax);
    setEditStockCount(item.stockCount);
    setEditPricePerKg(item.pricePerKg);
    setEditStatus(item.status);
  };

  // Submit edits
  const handleSaveEdit = (id: string) => {
    if (!editLocation.trim()) return;

    if (editWeightMin > editWeightMax) {
      alert('Rentang bobot tidak valid! Bobot kecil harus lebih rendah atau sama dengan bobot besar.');
      return;
    }

    onUpdateHarvest({
      id,
      location: editLocation.trim(),
      ageDays: editAgeDays,
      weightMin: editWeightMin,
      weightMax: editWeightMax,
      stockCount: editStockCount,
      pricePerKg: editPricePerKg,
      status: editStatus
    });

    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6" id="harvests-manager">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">Kelola Informasi Stok Broiler (Panen)</h3>
            <p className="text-xs text-slate-500">Buat, perbarui, dan hapus ketersediaan ayam broiler di blok kandang mitra terpadu.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          id="btn-create-stock"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" />
              <span>Tutup Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Tambah Stok Baru</span>
            </>
          )}
        </button>
      </div>

      {/* ERROR MESSAGE FOR ADD STOCK FORM */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Tambah Stok Baru */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fadeIn">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Formulir Informasi Stok Baru</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Lokasi / Unit Kandang */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Lokasi / Nama Kandang *</label>
              <input
                type="text"
                placeholder="Misal: Depot Mekarjaya (Kandang B1)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            {/* Status Panen */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-bold"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Umur Ayam & Rentang Bobot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Umur (Hari)</label>
                <input
                  type="number"
                  min="1"
                  value={ageDays}
                  onChange={(e) => setAgeDays(Number(e.target.value))}
                  className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Rentang Bobot (Kg) *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    placeholder="Min (contoh 0,9)"
                    value={weightMin}
                    onChange={(e) => setWeightMin(Number(e.target.value))}
                    className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    required
                  />
                  <span className="text-slate-400 font-bold text-xs">-</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    placeholder="Max (contoh 1,1)"
                    value={weightMax}
                    onChange={(e) => setWeightMax(Number(e.target.value))}
                    className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Estimasi Stok (Ekor) & Harga Acuan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Est Stok (Ekor)</label>
                <input
                  type="number"
                  min="1"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Harga Acuan (Rp/Kg)</label>
                <input
                  type="number"
                  min="1"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  required
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-500 hover:text-slate-800 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Simpan Stok
            </button>
          </div>
        </form>
      )}

      {/* TABLE / LIST OF STOCK ITEMS */}
      <div className="overflow-x-auto border border-slate-150 rounded-xl bg-slate-50/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <th className="py-2.5 px-4">ID / Lokasi</th>
              <th className="py-2.5 px-4 text-center">Umur Ayam</th>
              <th className="py-2.5 px-4 text-center">Rentang Bobot</th>
              <th className="py-2.5 px-4 text-right">Est. Jumlah</th>
              <th className="py-2.5 px-4 text-right">Harga Acuan</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-xs">
            {harvests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  Belum ada informasi stock ayam broiler Terdaftar. Silakan tambah baru.
                </td>
              </tr>
            ) : (
              harvests.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* ID & Lokasi */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{item.id}</span>
                          <input
                            type="text"
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full text-xs font-bold bg-white text-slate-800 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 font-bold">{item.id}</div>
                          <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Umur Ayam */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={editAgeDays}
                            onChange={(e) => setEditAgeDays(Number(e.target.value))}
                            className="w-16 text-center text-xs bg-white text-slate-800 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <span className="text-[11px] text-slate-500 font-medium">Hari</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-700 font-mono flex items-center justify-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-450" />
                          <span>{item.ageDays} Hari</span>
                        </span>
                      )}
                    </td>

                    {/* Bobot Rentang */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Min"
                            value={editWeightMin}
                            onChange={(e) => setEditWeightMin(Number(e.target.value))}
                            className="w-12 text-center text-xs bg-white text-slate-800 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <span className="text-slate-400 font-bold">-</span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Max"
                            value={editWeightMax}
                            onChange={(e) => setEditWeightMax(Number(e.target.value))}
                            className="w-12 text-center text-xs bg-white text-slate-800 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <span className="text-[10px] text-slate-500 font-medium">Kg</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-700 font-mono flex items-center justify-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-slate-450" />
                          <span>{item.weightMin?.toFixed(1).replace('.', ',')} - {item.weightMax?.toFixed(1).replace('.', ',')} Kg</span>
                        </span>
                      )}
                    </td>

                    {/* Est Jumlah */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editStockCount}
                            onChange={(e) => setEditStockCount(Number(e.target.value))}
                            className="w-20 text-right text-xs bg-white text-slate-800 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <span className="text-[11px] text-slate-500 font-medium">ekor</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-700 font-mono flex items-center justify-end gap-1">
                          <Layers className="w-3.5 h-3.5 text-slate-450" />
                          <span>{item.stockCount.toLocaleString('id-ID')} ekor</span>
                        </span>
                      )}
                    </td>

                    {/* Harga Acuan */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[11px] text-slate-500 font-medium">Rp</span>
                          <input
                            type="number"
                            value={editPricePerKg}
                            onChange={(e) => setEditPricePerKg(Number(e.target.value))}
                            className="w-20 text-right text-xs bg-white text-slate-800 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ) : (
                        <span className="font-extrabold text-indigo-700 font-mono flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Rp {item.pricePerKg.toLocaleString('id-ID')}</span>
                        </span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="text-xs font-bold bg-white text-slate-800 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                          item.status === 'Sedang Panen' 
                            ? 'bg-amber-100 text-amber-850 border border-amber-200' 
                            : item.status === 'Siap Panen'
                            ? 'bg-emerald-100 text-emerald-850 border border-emerald-200'
                            : item.status === 'Selesai Panen'
                            ? 'bg-slate-200 text-slate-800 border border-slate-350'
                            : 'bg-indigo-100 text-indigo-850 border border-indigo-200'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </td>

                    {/* Actions button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Simpan Perubahan"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            title="Batalkan"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-15">
                          <button
                            onClick={() => startEditing(item)}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus informasi stok untuk ${item.location}?`)) {
                                onDeleteHarvest(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
