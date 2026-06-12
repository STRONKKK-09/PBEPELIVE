export interface DeliveryOrder {
  id: string; // e.g. "DO-1"
  driverName: string; // e.g. "Agung Nugroho"
  driverCode: string; // e.g. "2225"
  vehiclePlate: string; // e.g. "AA 8044 OB"
  targetWeight: number; // e.g. 4500 (in Kg)
  actualWeight: number; // weighed net weight
  tareWeight: number; // truck weight empty (in Kg)
  grossWeight: number; // truck + chicken (in Kg)
  status: 'Menunggu' | 'Proses Timbang' | 'Tahan Mobil' | 'Siap Berangkat' | 'Selesai';
  location: string; // e.g. "Mekarjaya"
  date: string; // e.g. "2026-05-31" atau hari ini
}

export interface WebOrder {
  orderId: string;
  itemType: 'Ayam Broiler' | 'Pakan Starter' | 'Pakan Finisher';
  quantity: number; // in Kg or bags
  address: string;
  orderDate: string;
  status: 'Pending' | 'Approved' | 'Dispatched';
}

export interface UserAccount {
  username: string;
  name: string;
  role: 'customer' | 'admin';
  password?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  companyAddress?: string;
}

export interface HarvestItem {
  id: string;
  location: string;
  ageDays: number;
  weightMin: number;
  weightMax: number;
  stockCount: number;
  pricePerKg: number;
  status: string;
}
