import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Send, Check, X, Phone, AlertCircle } from 'lucide-react';
import { DeliveryOrder } from '../types';
import { generateWhatsAppMessage, getWhatsAppClickToChatUrl } from '../utils/whatsapp';

interface WhatsAppShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orders: DeliveryOrder[];
  defaultPhone?: string;
  title?: string;
}

export default function WhatsAppShareDialog({
  isOpen,
  onClose,
  orders,
  defaultPhone = '6285156653112',
  title = 'Kirim Informasi Via WhatsApp'
}: WhatsAppShareDialogProps) {
  const [phone, setPhone] = useState(defaultPhone);
  const [text, setText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Regenerate message template when orders or dialog opens
  useEffect(() => {
    if (orders && orders.length > 0) {
      setText(generateWhatsAppMessage(orders));
    }
  }, [orders, isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin teks:', err);
    }
  };

  const handleSend = () => {
    const url = getWhatsAppClickToChatUrl(phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">{title}</h3>
              <p className="text-[10px] text-emerald-700 font-bold">Direct wa.me sender setup</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Recipient Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Nomor WhatsApp Tujuan</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 6285156653112"
              className="w-full text-xs font-bold font-mono bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-500">
              Gunakan kode negara (misl. 62 untuk Indonesia). Default diarahkan ke <span className="font-bold underline text-slate-700">6285156653112</span>.
            </p>
          </div>

          {/* Text Message Preview */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <span>Pratinjau Pesan Terformat</span>
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 text-[11px]">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={11}
              className="w-full text-xs font-semibold font-mono bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-3.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 leading-normal">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Format di atas sudah disesuaikan persis dengan dokumen juklak jembatan timbang PBEPE. Anda dapat mengedit teks langsung di panel pre-view sebelum terkirim.
            </span>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Batalkan
          </button>
          <button
            onClick={handleSend}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-emerald-100"
          >
            <Send className="w-4 h-4" />
            <span>Kirim via WhatsApp Web/App</span>
          </button>
        </div>

      </div>
    </div>
  );
}
