/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnalyticsPanel from './components/AnalyticsPanel';
import DOOverview from './components/DOOverview';
import WeighingSimulator from './components/WeighingSimulator';
import WebOrderPortal from './components/WebOrderPortal';
import BarcodeScanner from './components/BarcodeScanner';
import LandingPage from './components/LandingPage';
import CustomerDashboard from './components/CustomerDashboard';
import HarvestsManager from './components/HarvestsManager';
import { DeliveryOrder, UserAccount, HarvestItem } from './types';
import { Info, HelpCircle, Phone, FileText, CheckCircle2, ChevronLeft, LogOut, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_DOS: DeliveryOrder[] = [
  {
    id: 'do-1',
    driverName: 'Agung Nugroho',
    driverCode: '2225',
    vehiclePlate: 'AA 8044 OB',
    targetWeight: 4500,
    actualWeight: 4500,
    tareWeight: 6150,
    grossWeight: 10650,
    status: 'Tahan Mobil', // "habis timbang tahan mobil"
    location: 'Mekarjaya',
    date: '2026-05-31' // Sesuai tanggal di gambar: Minggu, 31 Mei 2026
  },
  {
    id: 'do-2',
    driverName: 'Agung Nugroho',
    driverCode: '2225',
    vehiclePlate: 'B 9003 VQB',
    targetWeight: 4500,
    actualWeight: 0,
    tareWeight: 0,
    grossWeight: 0,
    status: 'Menunggu',
    location: 'Mekarjaya',
    date: '2026-05-31'
  }
];

const INITIAL_HARVESTS: HarvestItem[] = [
  { id: 'PANEN-A01', location: 'Depot Mekarjaya (Kandang B1)', ageDays: 34, weightMin: 1.70, weightMax: 2.00, stockCount: 15400, pricePerKg: 21500, status: 'Siap Panen' },
  { id: 'PANEN-C09', location: 'Depot Subang Barat (Kandang C4)', ageDays: 36, weightMin: 1.90, weightMax: 2.30, stockCount: 9200, pricePerKg: 22200, status: 'Sedang Panen' },
  { id: 'PANEN-S03', location: 'Depot Subang Timur (Kandang A3)', ageDays: 31, weightMin: 1.40, weightMax: 1.80, stockCount: 21000, pricePerKg: 20800, status: 'Estimasi Besok' }
];

export default function App() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    const cached = localStorage.getItem('suja_broiler_dos');
    return cached ? JSON.parse(cached) : INITIAL_DOS;
  });

  const [harvests, setHarvests] = useState<HarvestItem[]>(() => {
    const cached = localStorage.getItem('pbepe_broiler_harvests');
    return cached ? JSON.parse(cached) : INITIAL_HARVESTS;
  });

  const [selectedForWeighing, setSelectedForWeighing] = useState<DeliveryOrder | null>(null);
  
  // Synchronized registered users & active session
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const cachedUsers = localStorage.getItem('pbepe_broiler_users');
    return cachedUsers ? JSON.parse(cachedUsers) : [
      { username: 'ADMIN', password: 'admin', role: 'admin', name: 'Operator PBEPE Subang' },
      { username: 'SKAGU21', password: 'init1234', role: 'customer', name: 'MITRA PBEPE SKAGU21' }
    ];
  });

  const [activeUser, setActiveUser] = useState<UserAccount | null>(() => {
    const cachedActive = localStorage.getItem('pbepe_broiler_active_user');
    return cachedActive ? JSON.parse(cachedActive) : null;
  });

  // Calculate userRole dynamically based on the activeUser
  const userRole = activeUser ? activeUser.role : 'guest';

  // Sync users list
  useEffect(() => {
    localStorage.setItem('pbepe_broiler_users', JSON.stringify(users));
  }, [users]);

  // Sync active user
  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('pbepe_broiler_active_user', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('pbepe_broiler_active_user');
    }
  }, [activeUser]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('suja_broiler_dos', JSON.stringify(orders));
  }, [orders]);

  // Sync harvests to local storage
  useEffect(() => {
    localStorage.setItem('pbepe_broiler_harvests', JSON.stringify(harvests));
  }, [harvests]);

  const handleAddHarvest = (newHarvest: Omit<HarvestItem, 'id'>) => {
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const id = `PANEN-${randomSuffix}${Math.floor(100 + Math.random() * 900)}`;
    const newItem: HarvestItem = {
      id,
      ...newHarvest
    };
    setHarvests((prev) => [newItem, ...prev]);
  };

  const handleUpdateHarvest = (updated: HarvestItem) => {
    setHarvests((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteHarvest = (id: string) => {
    setHarvests((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddDO = (newDO: Omit<DeliveryOrder, 'id'>) => {
    const id = `do-${Date.now()}`;
    const target: DeliveryOrder = {
      id,
      ...newDO
    };
    setOrders((prev) => [target, ...prev]);
  };

  const handleAddFromWebOrder = (webDO: {
    driverName: string;
    driverCode: string;
    vehiclePlate: string;
    targetWeight: number;
    location: string;
  }) => {
    handleAddDO({
      driverName: webDO.driverName,
      driverCode: webDO.driverCode,
      vehiclePlate: webDO.vehiclePlate,
      targetWeight: webDO.targetWeight,
      actualWeight: 0,
      tareWeight: 0,
      grossWeight: 0,
      status: 'Menunggu',
      location: webDO.location,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteDO = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (selectedForWeighing?.id === id) {
      setSelectedForWeighing(null);
    }
  };

  const handleUpdateStatus = (id: string, status: DeliveryOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    // synchronize active selection
    if (selectedForWeighing?.id === id) {
      setSelectedForWeighing((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleUpdateWeights = (
    id: string,
    grossWeight: number,
    tareWeight: number,
    status: DeliveryOrder['status']
  ) => {
    const actualWeight = grossWeight - tareWeight;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              grossWeight,
              tareWeight,
              actualWeight: actualWeight > 0 ? actualWeight : 0,
              status
            }
          : o
      )
    );
    // clear active selection after applying
    setSelectedForWeighing(null);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke default bawaan slip WA?')) {
      setOrders(INITIAL_DOS);
      setSelectedForWeighing(null);
      localStorage.removeItem('suja_broiler_dos');
    }
  };

  // Wrapper incorporating high-fidelity AnimatePresence transition routes
  return (
    <AnimatePresence mode="wait">
      {userRole === 'guest' ? (
        <motion.div
          key="guest"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          <LandingPage 
            users={users}
            onLoginSuccess={(user) => setActiveUser(user)}
            onRegisterUser={(newUser) => setUsers((prev) => [...prev, newUser])}
          />
        </motion.div>
      ) : userRole === 'customer' ? (
        <motion.div
          key="customer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800"
        >
          <Header onResetData={handleResetData} />
          
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CustomerDashboard 
              orders={orders}
              onAddFromWebOrder={handleAddFromWebOrder} 
              onLogout={() => setActiveUser(null)}
              currentUser={activeUser}
              harvests={harvests}
            />
          </main>

          <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
              <p className="font-bold text-slate-200 uppercase tracking-widest text-[10px]">
                Sistem DO & Jembatan Timbang Broiler PBEPE
              </p>
              <p>
                Diimplementasikan berdasarkan dokumen instruksi Kemitraan Broiler PBEPE Subang.
              </p>
              <p className="text-slate-505 font-mono">
                Vite v6 • Tailwind CSS v4 • React 19 • © 2026. All rights secured.
              </p>
            </div>
          </footer>
        </motion.div>
      ) : (
        <motion.div
          key="admin"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="min-h-screen bg-slate-50 flex flex-col text-slate-800"
        >
          
          {/* Brand & Systems Navigation top area */}
          <Header onResetData={handleResetData} />

          {/* Main Content Area: Responsive Grid Layout */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Top Navigation banner for admin with back arrow */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs gap-3">
              <div className="flex items-center space-x-3">
                <button
                   onClick={() => setActiveUser(null)}
                  className="text-slate-600 hover:text-slate-950 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali Ke Landing</span>
                </button>
                <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
                <div>
                  <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded uppercase font-mono mr-2">
                    MODE: OPERATOR YARD
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Bypass Akses Lapangan Aktif: {activeUser?.name}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveUser(null)}
                className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors border border-rose-150 cursor-pointer self-end sm:self-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Top Header Section Intro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">
                  Portal Logistik Broiler - PBEPE Subang
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Visualisasi & Simulator operasional untuk koordinasi pengiriman pakan dan penimbangan ayam broiler.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dokumen Depo Mekarjaya</span>
                </span>
                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hotline Sales Subang</span>
                </span>
              </div>
            </div>

            {/* Analytics Warnings Rules Panel */}
            <AnalyticsPanel orders={orders} />

            {/* Kelola Informasi Stok Broiler */}
            <HarvestsManager
              harvests={harvests}
              onAddHarvest={handleAddHarvest}
              onUpdateHarvest={handleUpdateHarvest}
              onDeleteHarvest={handleDeleteHarvest}
            />

            {/* Dynamic Multi-column Dashboard Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1 & 2: Active delivery queue DO list (Takes 2 columns on large screen) */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DOOverview
                    orders={orders}
                    onAddDO={handleAddDO}
                    onDeleteDO={handleDeleteDO}
                    onSelectForWeighing={(order) => setSelectedForWeighing(order)}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </motion.div>

                {/* Quick Reference / Guidance Card explaining the app's relation to the screenshot */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Analisis Slip & Cara Penggunaan Simulator</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                    <div>
                      <p className="font-semibold text-slate-800 mb-1">🔍 Hasil Analisis Foto Slip:</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li>Depo penimbangan utama: <span className="font-bold text-slate-900">Mekarjaya</span>.</li>
                        <li>Sopir terdata: <span className="font-bold text-slate-900">Agung Nugroho</span> (Kode 2225).</li>
                        <li>Nopol Armada: <span className="font-bold text-slate-900">AA 8044 OB</span> dan <span className="font-bold text-slate-900">B 9003 VQB</span>.</li>
                        <li>Regulasi Utama: Muatan <span className="font-bold text-slate-900">maksimal 4500 Kg</span>. Jika timbang kotor melebihi target, kendaraan wajib ditahan.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 mb-1">🎮 Langkah Mencoba:</p>
                      <ul className="list-decimal list-inside space-y-1 pl-1">
                        <li>Gunakan panel kanan untuk login <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900">SKAGU21 / init1234</span>.</li>
                        <li>Buat pesanan atau tambahkan manual DO antrean.</li>
                        <li>Pilih plat mobil di panel jembatan timbang tengah/bawah.</li>
                        <li>Sesuaikan berat kotor truk, perhatikan jika lampu peringatan menyala merah saat berat muatan melebihi DO.</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 3: Scale Simulator, Barcode Scanner, & Web Order Platform */}
              <div className="space-y-6">
                
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BarcodeScanner 
                    orders={orders}
                    onSelectForWeighing={setSelectedForWeighing}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <WebOrderPortal onAddFromWebOrder={handleAddFromWebOrder} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <WeighingSimulator
                    orders={orders}
                    selectedOrder={selectedForWeighing}
                    onSelectOrder={setSelectedForWeighing}
                    onUpdateWeights={handleUpdateWeights}
                  />
                </motion.div>

              </div>

            </div>

          </main>

          {/* Footer info branding */}
          <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
              <p className="font-bold text-slate-200 uppercase tracking-widest text-[10px]">
                Sistem DO & Jembatan Timbang Broiler PBEPE
              </p>
              <p>
                Diimplementasikan berdasarkan dokumen instruksi Kemitraan Broiler PBEPE Subang.
              </p>
              <p className="text-slate-500 font-mono">
                Vite v6 • Tailwind CSS v4 • React 19 • © 2026. All rights secured.
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

