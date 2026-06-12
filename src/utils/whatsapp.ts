import { DeliveryOrder } from '../types';

/**
 * Returns a beautiful Indonesian day and date string
 */
export function getFormattedIndonesianDate(customDate?: string): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dateObj = customDate ? new Date(customDate) : new Date();
  
  const dayName = days[dateObj.getDay()];
  const dateNum = dateObj.getDate();
  const monthName = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  
  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

/**
 * Maps the system status to the verbal descriptions shown in the screenshot
 */
export function getStatusText(order: DeliveryOrder): string {
  switch (order.status) {
    case 'Tahan Mobil':
      return 'habis timbang tahan mobil';
    case 'Siap Berangkat':
      return 'habis timbang siap berangkat';
    case 'Menunggu':
      return 'menunggu';
    case 'Proses Timbang':
      return 'proses timbang';
    case 'Selesai':
      return 'selesai';
    default:
      return 'menunggu';
  }
}

/**
 * Generates the exact text block matching the target screenshot format
 */
export function generateWhatsAppMessage(orders: DeliveryOrder[]): string {
  const dateStr = getFormattedIndonesianDate(orders.length > 0 ? orders[0].date : undefined);
  
  // Group orders by location
  const grouped: Record<string, DeliveryOrder[]> = {};
  orders.forEach((order) => {
    const loc = order.location || 'Mekarjaya';
    if (!grouped[loc]) {
      grouped[loc] = [];
    }
    grouped[loc].push(order);
  });

  let message = 'PENGAMBILAN TIDAK BOLEH MELEBIHI DO\n# DO BERLAKU 1 HARI\n\n';
  message += `${dateStr}\n\n`;

  // Append grouped locations
  Object.keys(grouped).forEach((loc) => {
    message += `DO ${loc}\n`;
    grouped[loc].forEach((order) => {
      const statusLabel = getStatusText(order);
      message += `• ${order.driverName} (${order.driverCode})  ${order.vehiclePlate}  ${order.targetWeight} Kg *${statusLabel}*\n`;
    });
    message += '\n';
  });

  // Append portal credentials and instructions footer
  message += `*Order by Web : https://pbepe.id/customer/\n`;
  message += `ID: SKAGU21\n`;
  message += `Pas :: init1234\n\n`;
  message += `PENGAMBILAN TIDAK BOLEH MELEBIHI DO\n`;
  message += `# DO BERLAKU 1 HARI`;

  return message;
}

/**
 * Generates the wa.me link with URL-encoded parameters
 */
export function getWhatsAppClickToChatUrl(phone: string, text: string): string {
  // Clean phone number (remove +, spaces, leading zeros)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
