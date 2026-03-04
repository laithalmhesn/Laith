"use client";

import { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { AppLogo } from "@/components/AppLogo";

type View = 'splash' | 'login' | 'customer-home' | 'order' | 'safety' | 'complaints' | 'account' | 'seller' | 'seller-orders' | 'admin';
type UserRole = 'customer' | 'seller' | 'admin' | null;
type OrderStatus = 'pending' | 'accepted' | 'delivered' | 'rejected';
type ComplaintStatus = 'pending' | 'resolved';

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  cylinders: number;
  address: string;
  status: OrderStatus;
  date: string;
  sellerId?: number;
}

interface Seller {
  id: number;
  name: string;
  phone: string;
  password: string;
}

interface Complaint {
  id: number;
  message: string;
  status: ComplaintStatus;
  date: string;
}

const ADMIN_EMAIL = 'zerogoast@gmail.com';
const ADMIN_PASSWORD = 'laaith20099';

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('splash');
  const [role, setRole] = useState<UserRole>(null);
  const [loginType, setLoginType] = useState<'admin' | 'seller' | null>(null);
  
  // Data stores
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  // Form states
  const [orderForm, setOrderForm] = useState({ phone: '', cylinders: '1', address: '' });
  const [complaintText, setComplaintText] = useState('');
  const [locationShared, setLocationShared] = useState(false);
  
  // Admin tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'sellers' | 'complaints' | 'orders'>('dashboard');
  const [showAddSeller, setShowAddSeller] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', phone: '', password: '' });
  
  // Current logged in seller
  const [currentSellerId, setCurrentSellerId] = useState<number | null>(null);
  
  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  
  // Seller login form state
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerLoginError, setSellerLoginError] = useState('');

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');
  
  const handleExit = () => { 
    setRole(null); 
    setView('login'); 
    setLoginType(null);
    setCurrentSellerId(null);
    setAdminEmail('');
    setAdminPassword('');
    setSellerPhone('');
    setSellerPassword('');
    setAdminLoginError('');
    setSellerLoginError('');
  };

  // Generate order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}`;
  };

  // Get available orders (pending) for sellers
  const availableOrders = orders.filter(o => o.status === 'pending');
  
  // Get orders accepted by current seller
  const sellerAcceptedOrders = orders.filter(o => o.sellerId === currentSellerId && (o.status === 'accepted' || o.status === 'delivered'));

  const handleAcceptOrder = (orderId: number) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'accepted' as OrderStatus, sellerId: currentSellerId || undefined } : o
    ));
  };

  const handleRejectOrder = (orderId: number) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'rejected' as OrderStatus } : o
    ));
  };

  const handleMarkDelivered = (orderId: number) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'delivered' as OrderStatus } : o
    ));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      'pending': isRTL ? 'قيد الانتظار' : 'Pending',
      'accepted': isRTL ? 'مقبول' : 'Accepted',
      'delivered': isRTL ? 'تم التوصيل' : 'Delivered',
      'rejected': isRTL ? 'مرفوض' : 'Rejected',
      'resolved': isRTL ? 'محلول' : 'Resolved',
    };
    return map[status] || status;
  };

  // Admin Login - with email AND password validation
  const handleAdminLogin = () => {
    setAdminLoginError('');
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminLoginError(isRTL ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }
    if (adminEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
      setAdminLoginError(isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email');
      return;
    }
    if (adminPassword.trim() !== ADMIN_PASSWORD) {
      setAdminLoginError(isRTL ? 'كلمة المرور غير صحيحة' : 'Invalid password');
      return;
    }
    // Success
    setRole('admin');
    setView('admin');
    setLoginType(null);
    setAdminEmail('');
    setAdminPassword('');
  };

  // Seller Login - validate against stored sellers
  const handleSellerLogin = () => {
    setSellerLoginError('');
    if (!sellerPhone.trim() || !sellerPassword.trim()) {
      setSellerLoginError(isRTL ? 'يرجى إدخال رقم الهاتف وكلمة المرور' : 'Please enter phone and password');
      return;
    }
    
    const seller = sellers.find(s => s.phone === sellerPhone.trim() && s.password === sellerPassword.trim());
    if (!seller) {
      setSellerLoginError(isRTL ? 'رقم الهاتف أو كلمة المرور غير صحيحة' : 'Invalid phone or password');
      return;
    }
    
    setRole('seller');
    setCurrentSellerId(seller.id);
    setView('seller');
    setLoginType(null);
    setSellerPhone('');
    setSellerPassword('');
    setSellerLoginError('');
  };

  // Add new seller
  const handleAddSeller = () => {
    if (!newSeller.name.trim() || !newSeller.phone.trim() || !newSeller.password.trim()) {
      return;
    }
    const newId = sellers.length > 0 ? Math.max(...sellers.map(s => s.id)) + 1 : 1;
    setSellers(prev => [...prev, { ...newSeller, id: newId }]);
    setNewSeller({ name: '', phone: '', password: '' });
    setShowAddSeller(false);
  };

  // Submit order
  const handleSubmitOrder = () => {
    if (orderForm.phone && orderForm.cylinders && orderForm.address) {
      const newOrder: Order = {
        id: Date.now(),
        customerName: 'Customer',
        customerPhone: orderForm.phone,
        cylinders: parseInt(orderForm.cylinders),
        address: orderForm.address,
        status: 'pending',
        date: new Date().toLocaleDateString(),
      };
      setOrders(prev => [...prev, newOrder]);
      setOrderForm({ phone: '', cylinders: '1', address: '' });
      setLocationShared(false);
    }
  };

  // Submit complaint
  const handleSubmitComplaint = () => {
    if (complaintText.trim()) {
      const newComplaint: Complaint = {
        id: Date.now(),
        message: complaintText.trim(),
        status: 'pending',
        date: new Date().toLocaleDateString(),
      };
      setComplaints(prev => [...prev, newComplaint]);
      setComplaintText('');
    }
  };

  // Resolve complaint
  const handleResolveComplaint = (complaintId: number) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId ? { ...c, status: 'resolved' as ComplaintStatus } : c
    ));
  };

  // ─── SPLASH SCREEN ───────────────────────────────────────────────────────────
  if (view === 'splash') {
    return (
      <div className="min-h-screen gradient-green flex flex-col items-center justify-center relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />

        <div className="relative z-10 flex flex-col items-center text-center px-1">
          <div className="animate-bounce-subtle">
            <AppLogo size="md" />
          </div>

          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
            {isRTL ? 'غاز ناو' : 'GasNow'}
          </h1>
          <p className="text-green-200 text-sm font-semibold mb-1">
            {isRTL ? 'الأردن' : 'Jordan'}
          </p>
          <p className="text-green-100 text-xs mb-2 max-w-xs">
            {t.appTagline}
          </p>

          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 mb-3 w-full max-w-xs border border-white/20">
            <p className="text-white/90 text-sm mb-2 font-semibold text-center">
              {isRTL ? 'اختر اللغة' : 'Choose Language'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${lang === 'en' ? 'bg-white text-green-700 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${lang === 'ar' ? 'bg-white text-green-700 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                🇯🇴 العربية
              </button>
            </div>
          </div>

          <button
            onClick={() => setView('login')}
            className="bg-white text-green-700 font-bold py-3 px-8 rounded-xl text-base card-shadow-lg hover:bg-green-50 transition-all active:scale-95"
          >
            {isRTL ? '🚀 ابدأ الآن' : '🚀 Get Started'}
          </button>

          <p className="text-green-200/70 text-sm mt-2">
            {isRTL ? 'توصيل الغاز إلى بابك في الأردن' : 'Gas delivery to your door across Jordan'}
          </p>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gradient-green px-2 py-2 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div className="absolute top-4 right-4 z-10">
            <button onClick={toggleLang} className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition font-medium">
              {t.switchLanguage}
            </button>
          </div>
          <div className="relative z-10">
            <div className="flex justify-center">
              <AppLogo size="sm" />
            </div>
            <h1 className="text-base font-black text-white">{t.loginTitle}</h1>
            <p className="text-green-100 text-xs">{t.loginSubtitle}</p>
          </div>
        </div>

        <div className="flex-1 px-4 pt-4 pb-6">
          {!loginType ? (
            <div className="space-y-4">
              {/* Customer Login */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {isRTL ? 'دخول العميل' : 'Customer Login'}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {isRTL ? 'ادخل بحساب Google' : 'Sign in with your Google account'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setRole('customer'); setView('customer-home'); }}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.loginWithGoogle}
                </button>
              </div>

              {/* Admin Login */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🔐</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {isRTL ? 'دخول المشرف' : 'Admin Login'}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {isRTL ? 'للمشرفين المعتمدين فقط' : 'Authorized administrators only'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLoginType('admin')}
                  className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-900 transition-all"
                >
                  {t.loginAsAdmin}
                </button>
              </div>

              {/* Seller Login */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🛵</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {isRTL ? 'دخول البائع' : 'Seller Login'}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {isRTL ? 'للبائعين المسجلين فقط' : 'Registered sellers only'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLoginType('seller')}
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition-all"
                >
                  {isRTL ? 'دخول كبائع' : 'Login as Seller'}
                </button>
              </div>
            </div>
          ) : loginType === 'admin' ? (
            /* Admin Login Form */
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <button onClick={() => { setLoginType(null); setAdminLoginError(''); setAdminEmail(''); setAdminPassword(''); }} className="text-green-600 text-sm mb-4 flex items-center gap-1 font-medium">
                {isRTL ? '→ رجوع' : '← Back'}
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔐</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {isRTL ? 'دخول المشرف' : 'Admin Login'}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {isRTL ? 'للمشرفين المعتمدين فقط' : 'Authorized administrators only'}
                  </p>
                </div>
              </div>

              {adminLoginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
                  <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                  <p className="text-red-700 text-sm">{adminLoginError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    placeholder="zerogoast@gmail.com"
                    value={adminEmail}
                    onChange={e => { setAdminEmail(e.target.value); setAdminLoginError(''); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {isRTL ? 'كلمة المرور' : 'Password'} *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm"
                  />
                </div>
                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-all"
                >
                  {isRTL ? 'دخول كمشرف' : 'Login as Admin'}
                </button>
              </div>
            </div>
          ) : (
            /* Seller Login Form */
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <button onClick={() => { setLoginType(null); setSellerLoginError(''); setSellerPhone(''); setSellerPassword(''); }} className="text-green-600 text-sm mb-4 flex items-center gap-1 font-medium">
                {isRTL ? '→ رجوع' : '← Back'}
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🛵</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {isRTL ? 'دخول البائع' : 'Seller Login'}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {isRTL ? 'ادخل بيانات حسابك' : 'Enter your account credentials'}
                  </p>
                </div>
              </div>

              {sellerLoginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
                  <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                  <p className="text-red-700 text-sm">{sellerLoginError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    placeholder="07X XXX XXXX"
                    value={sellerPhone}
                    onChange={e => { setSellerPhone(e.target.value); setSellerLoginError(''); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {isRTL ? 'كلمة المرور' : 'Password'} *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={sellerPassword}
                    onChange={e => { setSellerPassword(e.target.value); setSellerLoginError(''); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm"
                  />
                </div>
                <button
                  onClick={handleSellerLogin}
                  disabled={!sellerPhone.trim() || !sellerPassword.trim()}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRTL ? 'دخول كبائع' : 'Login as Seller'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── CUSTOMER HOME ────────────────────────────────────────────────────────────
  if (view === 'customer-home') {
    // Get customer's own orders
    const myOrders = orders;

    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gradient-green px-3 pt-4 pb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <div>
                <p className="text-green-200 text-xs font-medium">{isRTL ? 'مرحباً بك في' : 'Welcome to'}</p>
                <h1 className="text-white text-xl font-black leading-tight">{t.appName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className="text-white/80 text-xs bg-white/20 px-2.5 py-1.5 rounded-full font-medium">
                {t.switchLanguage}
              </button>
              <button onClick={handleExit} className="text-white/80 text-xs bg-white/20 px-2.5 py-1.5 rounded-full font-medium">
                {isRTL ? 'خروج' : 'Exit'}
              </button>
            </div>
          </div>
          <p className="text-green-100 text-sm mb-6 leading-relaxed">{t.appDescription}</p>
          <button
            onClick={() => setView('order')}
            className="bg-white text-green-700 font-black py-3.5 px-8 rounded-2xl card-shadow hover:bg-green-50 transition-all active:scale-95 text-base"
          >
            🔥 {t.orderNow}
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="bg-white rounded-2xl p-6 card-shadow mb-5">
            <h2 className="font-black text-gray-800 text-lg mb-5">{t.howItWorks}</h2>
            <div className="space-y-4">
              {[
                { num: '1', title: t.step1Title, desc: t.step1Desc, color: 'bg-green-500' },
                { num: '2', title: t.step2Title, desc: t.step2Desc, color: 'bg-blue-500' },
                { num: '3', title: t.step3Title, desc: t.step3Desc, color: 'bg-purple-500' },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className={`w-9 h-9 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-black text-sm">{step.num}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">{step.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-black text-gray-800 text-lg mb-4">{t.whyChooseUs}</h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: '⚡', title: t.feature1, desc: t.feature1Desc, bg: 'bg-yellow-50', border: 'border-yellow-100', iconBg: 'bg-yellow-100' },
              { icon: '📱', title: t.feature2, desc: t.feature2Desc, bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100' },
              { icon: '🛡️', title: t.feature3, desc: t.feature3Desc, bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100' },
              { icon: '📍', title: t.feature4, desc: t.feature4Desc, bg: 'bg-purple-50', border: 'border-purple-100', iconBg: 'bg-purple-100' },
            ].map(f => (
              <div key={f.title} className={`${f.bg} ${f.border} border rounded-2xl p-4`}>
                <div className={`w-9 h-9 ${f.iconBg} rounded-xl flex items-center justify-center mb-2`}>
                  <span className="text-lg">{f.icon}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setView('order')}
            className="w-full gradient-green text-white font-black py-4 rounded-2xl card-shadow hover:opacity-90 transition-all mb-4 text-base"
          >
            🔥 {t.orderNow} →
          </button>
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── ORDER GAS ────────────────────────────────────────────────────────────────
  if (view === 'order') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.orderTitle} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6">
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{t.orderSubtitle}</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.phoneNumber} *</label>
                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={orderForm.phone}
                  onChange={e => setOrderForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.cylinderCount} *</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOrderForm(p => ({ ...p, cylinders: String(Math.max(1, parseInt(p.cylinders || '1') - 1)) }))}
                    className="w-12 h-12 bg-gray-100 rounded-xl text-xl font-black text-gray-600 hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={orderForm.cylinders}
                    onChange={e => setOrderForm(p => ({ ...p, cylinders: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-center text-xl font-black"
                  />
                  <button
                    onClick={() => setOrderForm(p => ({ ...p, cylinders: String(parseInt(p.cylinders || '0') + 1) }))}
                    className="w-12 h-12 bg-green-100 rounded-xl text-xl font-black text-green-600 hover:bg-green-200 transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.address} *</label>
                <textarea
                  placeholder={t.addressPlaceholder}
                  value={orderForm.address}
                  onChange={e => setOrderForm(p => ({ ...p, address: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm resize-none leading-relaxed"
                />
              </div>

              <div
                onClick={() => setLocationShared(!locationShared)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${locationShared ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              >
                <div className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${locationShared ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${locationShared ? (isRTL ? 'right-1' : 'left-7') : (isRTL ? 'right-7' : 'left-1')}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">📍 {t.shareLocation}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.shareLocationDesc}</p>
                </div>
              </div>

              {locationShared && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-green-600 flex-shrink-0">📍</span>
                  <span className="text-green-700 text-sm font-medium">
                    {isRTL ? 'تم مشاركة الموقع' : 'Location shared'}
                  </span>
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={!orderForm.phone || !orderForm.cylinders || !orderForm.address}
                className="w-full gradient-green text-white font-black py-4 rounded-2xl card-shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                🔥 {t.sendOrder}
              </button>
            </div>
          </div>
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── SAFETY ───────────────────────────────────────────────────────────────────
  if (view === 'safety') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.safetyTitle} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6 space-y-4">
          <p className="text-gray-500 text-sm leading-relaxed">{t.safetySubtitle}</p>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-black text-red-700 text-sm">{t.safetyWarning}</h3>
              <p className="text-red-600 text-xs mt-1 leading-relaxed">{t.safetyWarningText}</p>
            </div>
          </div>

          {[
            { icon: '🔧', title: t.safety1Title, desc: t.safety1Desc, bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100' },
            { icon: '💧', title: t.safety2Title, desc: t.safety2Desc, bg: 'bg-cyan-50', border: 'border-cyan-100', iconBg: 'bg-cyan-100' },
            { icon: '🏠', title: t.safety3Title, desc: t.safety3Desc, bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100' },
            { icon: '🚨', title: t.safety4Title, desc: t.safety4Desc, bg: 'bg-red-50', border: 'border-red-100', iconBg: 'bg-red-100' },
          ].map(item => (
            <div key={item.title} className={`${item.bg} ${item.border} border rounded-2xl p-5`}>
              <div className="flex items-start gap-4">
                <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-black text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="gradient-green rounded-2xl p-5 text-center">
            <p className="text-white font-black text-lg mb-1">
              🚒 {isRTL ? 'رقم الطوارئ' : 'Emergency Number'}
            </p>
            <p className="text-white text-4xl font-black">911</p>
            <p className="text-green-100 text-sm mt-2">
              {isRTL ? 'اتصل فوراً في حالة الطوارئ' : 'Call immediately in case of emergency'}
            </p>
          </div>
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── COMPLAINTS ───────────────────────────────────────────────────────────────
  if (view === 'complaints') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.complaintsTitle} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6">
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{t.complaintsSubtitle}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.complaintMessage} *</label>
                <textarea
                  placeholder={t.complaintPlaceholder}
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm resize-none leading-relaxed"
                />
                <p className={`text-xs mt-1 ${complaintText.length > 450 ? 'text-red-400' : 'text-gray-400'} ${isRTL ? 'text-left' : 'text-right'}`}>
                  {complaintText.length}/500
                </p>
              </div>
              <button
                onClick={handleSubmitComplaint}
                disabled={!complaintText.trim()}
                className="w-full gradient-green text-white font-black py-4 rounded-2xl card-shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.sendComplaint}
              </button>
            </div>
          </div>
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── ACCOUNT ──────────────────────────────────────────────────────────────────
  if (view === 'account') {
    // Show all orders in the system
    const myOrders = orders;

    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.accountTitle} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h2 className="font-black text-gray-800 text-lg">{isRTL ? 'عميل' : 'Customer'}</h2>
                <p className="text-gray-500 text-sm">{isRTL ? 'حساب Google' : 'Google Account'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h3 className="font-black text-gray-800 mb-4">{t.myOrders}</h3>
            {myOrders.length === 0 ? (
              <p className="text-gray-400 text-center py-4 text-sm">{t.noOrders}</p>
            ) : (
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">🔥 {order.cylinders} {t.cylinders}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{order.address}</p>
                      <p className="text-gray-400 text-xs">{order.date}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExit}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition"
          >
            🚪 {t.logout}
          </button>
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── SELLER DASHBOARD ─────────────────────────────────────────────────────────
  if (view === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.sellerTitle} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 card-shadow text-center">
              <p className="text-2xl font-black text-amber-500">{availableOrders.length}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{isRTL ? 'متاح' : 'Available'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 card-shadow text-center">
              <p className="text-2xl font-black text-green-600">{sellerAcceptedOrders.filter(o => o.status === 'accepted').length}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{isRTL ? 'مقبول' : 'Accepted'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 card-shadow text-center">
              <p className="text-2xl font-black text-blue-600">{sellerAcceptedOrders.filter(o => o.status === 'delivered').length}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{isRTL ? 'موصّل' : 'Delivered'}</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-4 leading-relaxed">{t.sellerSubtitle}</p>

          {availableOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 card-shadow text-center">
              <span className="text-5xl">📭</span>
              <p className="text-gray-500 mt-4 font-medium">{t.noAvailableOrders}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-4 card-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-gray-800">🔥 {order.cylinders} {t.cylinders}</p>
                      <p className="text-gray-500 text-xs mt-1">{order.address}</p>
                      <p className="text-gray-400 text-xs">📞 {order.customerPhone}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 transition text-sm"
                    >
                      ✓ {isRTL ? 'قبول' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition text-sm"
                    >
                      ✕ {isRTL ? 'رفض' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── SELLER ACCEPTED ORDERS ───────────────────────────────────────────────────
  if (view === 'seller-orders') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.myAcceptedOrders} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6">
          {sellerAcceptedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 card-shadow text-center">
              <span className="text-5xl">📦</span>
              <p className="text-gray-500 mt-4 font-medium">{isRTL ? 'لا توجد طلبات مقبولة بعد' : 'No accepted orders yet'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sellerAcceptedOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-4 card-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-gray-800">🔥 {order.cylinders} {t.cylinders}</p>
                      <p className="text-gray-500 text-xs mt-1">{order.address}</p>
                      <p className="text-gray-400 text-xs">📞 {order.customerPhone}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition text-sm"
                    >
                      ✓ {isRTL ? 'تم التوصيل' : 'Mark as Delivered'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gray-900 px-6 pt-10 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">{isRTL ? 'مرحباً،' : 'Welcome,'}</p>
                <h1 className="text-white font-black text-base">{isRTL ? 'المشرف' : 'Admin'}</h1>
                <p className="text-gray-500 text-xs">{ADMIN_EMAIL}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className="text-gray-400 text-xs bg-gray-800 px-2.5 py-1.5 rounded-full hover:bg-gray-700 transition font-medium">
                {t.switchLanguage}
              </button>
              <button
                onClick={handleExit}
                className="text-gray-400 text-xs bg-gray-800 px-2.5 py-1.5 rounded-full hover:bg-gray-700 transition font-medium"
              >
                {isRTL ? 'خروج' : 'Logout'}
              </button>
            </div>
          </div>

          <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
            {[
              { id: 'dashboard', label: isRTL ? 'الرئيسية' : 'Dashboard', icon: '📊' },
              { id: 'sellers', label: isRTL ? 'البائعون' : 'Sellers', icon: '🛵' },
              { id: 'complaints', label: isRTL ? 'الشكاوى' : 'Complaints', icon: '📝' },
              { id: 'orders', label: isRTL ? 'الطلبات' : 'Orders', icon: '📦' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as typeof adminTab)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${adminTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 pb-10">
          {adminTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t.totalOrders, value: orders.length.toString(), icon: '📦', iconBg: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-100' },
                  { label: t.activeSellers, value: sellers.length.toString(), icon: '🛵', iconBg: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { label: t.complaintsCount, value: complaints.filter(c => c.status === 'pending').length.toString(), icon: '📝', iconBg: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
                  { label: isRTL ? 'تم التوصيل' : 'Delivered', value: orders.filter(o => o.status === 'delivered').length.toString(), icon: '✅', iconBg: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
                ].map(stat => (
                  <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-2xl p-5 card-shadow`}>
                    <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 card-shadow">
                <h3 className="font-black text-gray-800 mb-4">{isRTL ? 'آخر الطلبات' : 'Recent Orders'}</h3>
                {orders.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">{isRTL ? 'لا توجد طلبات' : 'No orders yet'}</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(-5).reverse().map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">🔥 {order.cylinders} {t.cylinders}</p>
                          <p className="text-gray-500 text-xs">{order.address}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {adminTab === 'sellers' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowAddSeller(!showAddSeller)}
                className="w-full gradient-green text-white font-black py-3 rounded-xl card-shadow hover:opacity-90 transition"
              >
                + {t.addSeller}
              </button>

              {showAddSeller && (
                <div className="bg-white rounded-2xl p-5 card-shadow">
                  <h3 className="font-black text-gray-800 mb-4">{t.addSeller}</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={t.sellerName || 'Name'}
                      value={newSeller.name}
                      onChange={e => setNewSeller(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                    <input
                      type="tel"
                      placeholder={t.sellerPhone || 'Phone'}
                      value={newSeller.phone}
                      onChange={e => setNewSeller(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      dir="ltr"
                    />
                    <input
                      type="password"
                      placeholder={t.sellerPassword || 'Password'}
                      value={newSeller.password}
                      onChange={e => setNewSeller(p => ({ ...p, password: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddSeller}
                        disabled={!newSeller.name.trim() || !newSeller.phone.trim() || !newSeller.password.trim()}
                        className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isRTL ? '💾 حفظ' : '💾 Save'}
                      </button>
                      <button
                        onClick={() => { setShowAddSeller(false); setNewSeller({ name: '', phone: '', password: '' }); }}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition text-sm"
                      >
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {sellers.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">{isRTL ? 'لا يوجد بائعون' : 'No sellers yet'}</p>
              ) : (
                <div className="space-y-3">
                  {sellers.map(seller => (
                    <div key={seller.id} className="bg-white rounded-2xl p-4 card-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">🛵</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{seller.name}</p>
                          <p className="text-gray-500 text-xs">📞 {seller.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === 'complaints' && (
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">{isRTL ? 'لا توجد شكاوى' : 'No complaints yet'}</p>
              ) : (
                <div className="space-y-3">
                  {complaints.map(complaint => (
                    <div key={complaint.id} className={`bg-white rounded-2xl p-4 card-shadow ${complaint.status === 'resolved' ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(complaint.status)}`}>
                          {getStatusLabel(complaint.status)}
                        </span>
                        <span className="text-gray-400 text-xs">{complaint.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{complaint.message}</p>
                      {complaint.status === 'pending' && (
                        <button
                          onClick={() => handleResolveComplaint(complaint.id)}
                          className="w-full bg-green-600 text-white font-bold py-2 rounded-xl hover:bg-green-700 transition text-sm"
                        >
                          ✓ {isRTL ? 'تم الحل' : 'Mark as Resolved'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">{isRTL ? 'لا توجد طلبات' : 'No orders yet'}</p>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-4 card-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-800">🔥 {order.cylinders} {t.cylinders}</p>
                          <p className="text-gray-500 text-xs mt-1">{order.address}</p>
                          <p className="text-gray-400 text-xs">📞 {order.customerPhone}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">{order.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
