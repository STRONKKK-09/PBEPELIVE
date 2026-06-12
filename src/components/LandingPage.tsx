import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { UserAccount } from '../types';

interface LandingPageProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser: (user: UserAccount) => void;
}

export default function LandingPage({ users, onLoginSuccess, onRegisterUser }: LandingPageProps) {
  // Toggle between 'login' and 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regCompanyAddress, setRegCompanyAddress] = useState('');
  
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Log in processing
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
      const cleanUsername = username.trim().toUpperCase();
      const cleanPassword = password.trim();

      // Find matched user
      const foundMatch = users.find(
        (u) => u.username.toUpperCase() === cleanUsername && u.password === cleanPassword
      );

      if (foundMatch) {
         onLoginSuccess(foundMatch);
      } else {
         setLoginError('ID Pengguna atau Kata Sandi salah. Silakan periksa kembali atau daftarkan akun baru.');
      }
    }, 500);
  };

  // Registration processing
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    // Validations
    if (!regUsername || !regEmail || !regPassword || !regConfirmPassword || !regName || !regPhone || !regCompanyName || !regCompanyAddress) {
      setRegError('Semua kolom bertanda bintang (*) wajib diisi!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Kombinasi sandi tidak cocok. Harap periksa kembali Sandi dan Konfirmasi Sandi.');
      return;
    }

    setRegLoading(true);

    setTimeout(() => {
      setRegLoading(false);
      const cleanUsername = regUsername.trim().toUpperCase();
      const cleanName = regName.trim();
      const cleanPassword = regPassword.trim();

      // Check duplicate
      const exists = users.some((u) => u.username.toUpperCase() === cleanUsername);
      if (exists) {
        setRegError(`ID Pengguna "${cleanUsername}" sudah terdaftar. Gunakan ID lain.`);
        return;
      }

      const newUser: UserAccount = {
        username: cleanUsername,
        name: cleanName,
        role: 'customer', // Registered through form always behaves as Customer/Mitra portal
        password: cleanPassword,
        email: regEmail.trim(),
        phone: regPhone.trim(),
        companyName: regCompanyName.trim(),
        companyAddress: regCompanyAddress.trim()
      };

      onRegisterUser(newUser);
      setRegSuccess(`Registrasi Berhasil! Mentransfer ke halaman masuk...`);

      // Clear register state
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegName('');
      setRegPhone('');
      setRegCompanyName('');
      setRegCompanyAddress('');

      // Auto switch back to login with prefilled values
      setTimeout(() => {
        setActiveTab('login');
        setUsername(cleanUsername);
        setPassword(cleanPassword);
        setRegSuccess('');
      }, 1500);

    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col justify-center items-center relative overflow-hidden font-sans p-4 sm:p-6 md:p-8">
      
      {/* Pristine Light repeating wallpaper pattern based on the screenshot */}
      <div className="absolute inset-0 pointer-events-none opacity-40 select-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bubble-pattern" width="60" height="40" patternUnits="userSpaceOnUse">
              <path d="M 30 0 C 15 0 0 10 0 20 C 0 30 15 40 30 40 C 45 40 60 30 60 20 C 60 10 45 0 30 0 Z" fill="none" stroke="#d1d5db" strokeWidth="1" />
              <path d="M 0 0 C 15 0 15 20 30 20 C 45 20 45 0 60 0" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="30" cy="20" r="4" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bubble-pattern)" />
        </svg>
      </div>

      {/* Ambiance radial glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-100/35 rounded-full blur-3xl -z-10"></div>

      {/* Main card container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/85 shadow-2xl relative z-10 mx-auto overflow-hidden transition-all grid grid-cols-1 md:grid-cols-12 animate-fadeIn">
        
        {/* Left Side: Stunning Large Agribusiness Illustration Panel */}
        <div className="hidden md:flex md:col-span-5 relative bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 flex-col overflow-hidden border-r border-slate-100/50">
          {/* Main Illustration Image with referrerPolicy */}
          <div className="absolute inset-0">
            <img 
              src="/src/assets/images/clean_agri_login_1781271042517.jpg" 
              alt="PBEPE Smart Poultry illustration" 
              className="w-full h-full object-cover opacity-90 select-none scale-100 hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Side: Form (Login/Register) Container */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 md:p-12 relative flex flex-col justify-center min-h-[500px]">
          {/* Decorative Top Bar mimicking the red notification or ribbon element shown at the top edge of screen */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-indigo-500"></div>

          {activeTab === 'login' ? (
            /* ========================================================= */
            /* SCREEN 1: LOGIN COMPONENT ("Selamat Datang di SUJA Mobile") */
            /* ========================================================= */
            <div className="space-y-8 animate-fadeIn max-w-md mx-auto py-4 w-full">
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Selamat Datang di PBEPE LIVE
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Silahkan masuk ke akun Anda
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                
                {/* ID Pengguna field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    ID Pengguna
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan ID Pengguna..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm animate-none"
                      id="id_pengguna_input"
                    />
                    <div className="absolute right-3.5 top-3.5 text-slate-400">
                      <User className="w-5 h-5 stroke-1" />
                    </div>
                  </div>
                </div>

                {/* Kata Sandi field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan Kata Sandi..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-3 pr-12 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-sans tracking-wide"
                      id="kata_sandi_input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                      id="toggle_password_btn"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 stroke-1" />
                      ) : (
                        <Eye className="w-5 h-5 stroke-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Errors */}
                {loginError && (
                  <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Registration Success feedback */}
                {regSuccess && (
                  <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                {/* Outlined "Masuk" Button matching Screen 1 screenshot */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="px-10 py-2.5 border-2 border-indigo-500 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 font-bold rounded-xl transition-all shadow-sm text-sm cursor-pointer"
                    id="masuk_submit_btn"
                  >
                    {loginLoading ? 'Memproses...' : 'Masuk'}
                  </button>
                </div>

              </form>

              {/* Toggle bottom link to Registration */}
              <div className="text-sm text-slate-600 pt-4 border-t border-slate-100">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setLoginError('');
                    setRegError('');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer transition-colors"
                  id="buat_akun_toggle_btn"
                >
                  Buat Akun disini
                </button>
              </div>

            </div>
          ) : (
            /* ======================================================== */
            /* SCREEN 2: REGISTRATION COMPONENT ("Informasi Akun")        */
            /* ======================================================== */
            <div className="space-y-6 animate-fadeIn py-2 w-full max-w-md mx-auto">
              
              <div className="space-y-1 pb-2 border-b border-slate-100">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  Informasi Akun
                </h1>
                <p className="text-sm text-slate-400 font-medium">
                  Masukkan data Anda secara lengkap
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                
                {/* Registration Error */}
                {regError && (
                  <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {/* 2-Column Grid for the top 4 fields */}
                <div className="grid grid-cols-1 gap-4">
                  
                  {/* ID Pengguna * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      ID Pengguna <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Masukkan ID Pengguna..."
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 placeholder:text-slate-400 font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono tracking-wider shadow-xs"
                        id="reg_id_input"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Email * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Masukkan alamat email..."
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                        id="reg_email_input"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Kata Sandi * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        placeholder="Masukkan sandi..."
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 pr-10 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                        id="reg_password_input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        id="reg_toggle_pwd1"
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Kata Sandi * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Ulangi sandi..."
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 pr-10 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                        id="reg_confirm_password_input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        id="reg_toggle_pwd2"
                      >
                        {showRegConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Full Width Fields below */}
                <div className="space-y-4">
                  
                  {/* Nama Lengkap * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap Anda..."
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                        id="reg_fullname_input"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Nomor HP * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Nomor HP <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="Nomor HP aktif..."
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                        id="reg_phone_input"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Nama Perusahaan * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Nama Perusahaan <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Nama perusahaan kemitraan..."
                        value={regCompanyName}
                        onChange={(e) => setRegCompanyName(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                        id="reg_company_input"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Alamat Perusahaan * */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Alamat Perusahaan <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        rows={2}
                        placeholder="Alamat lengkap perusahaan Anda..."
                        value={regCompanyAddress}
                        onChange={(e) => setRegCompanyAddress(e.target.value)}
                        className="w-full text-sm bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-2 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs resize-none"
                        id="reg_address_input"
                      />
                      <div className="absolute right-3 top-2.5 text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Submit Registration Button style matched with Screen 2 */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1"
                    id="reg_submit_btn"
                  >
                    <span>{regLoading ? 'Mendaftarkan...' : 'Daftar Akun'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </form>

              {/* Switch back to login link */}
              <div className="text-sm text-slate-600 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span>Sudah memiliki akun?</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setRegError('');
                    setLoginError('');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer transition-colors"
                  id="back_to_login_btn"
                >
                  Masuk disini
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
      
      {/* Tiny clean footer */}
      <div className="mt-8 text-[11px] font-semibold text-slate-400 tracking-wider uppercase font-mono z-10 text-center">
        PBEPE Broiler Integrated &bull; PBEPE LIVE v2.1
      </div>

    </div>
  );
}
