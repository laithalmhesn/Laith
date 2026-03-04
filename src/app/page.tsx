"use client";

import { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";

type View = 'splash' | 'login' | 'customer-home' | 'order' | 'safety' | 'complaints' | 'account' | 'seller' | 'seller-orders' | 'admin';
type UserRole = 'customer' | 'seller' | 'admin' | null;

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('splash');
  const [role, setRole] = useState<UserRole>(null);
  const [loginType, setLoginType] = useState<'admin' | 'seller' | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [complaintSent, setComplaintSent] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [orderForm, setOrderForm] = useState({ phone: '', cylinders: '', address: '' });
  const [complaintText, setComplaintText] = useState('');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'sellers' | 'complaints' | 'orders'>('dashboard');
  const [acceptedOrders, setAcceptedOrders] = useState<number[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<number[]>([]);
  const [showAddSeller, setShowAddSeller] = useState(false);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');
  const handleExit = () => { setRole(null); setView('login'); };

  // Sample data
  const sampleOrders = [
    { id: 1, phone: '0791234567', cylinders: 2, address: 'Amman, Khalda District', status: 'Pending', date: '2024-03-04', customer: 'Ahmad Ali' },
    { id: 2, phone: '0799876543', cylinders: 1, address: 'Zarqa, New Zarqa', status: 'Accepted', date: '2024-03-04', customer: 'Sara Hassan' },
    { id: 3, phone: '0785551234', cylinders: 3, address: 'Irbid, University Street', status: 'Delivered', date: '2024-03-03', customer: 'Mohammed Khalil' },
    { id: 4, phone: '0776543210', cylinders: 2, address: 'Aqaba, Downtown', status: 'Pending', date: '2024-03-04', customer: 'Fatima Nasser' },
  ];

  const sampleSellers = [
    { id: 1, name: 'Khalid Gas', phone: '0791111111', status: 'active', orders: 45 },
    { id: 2, name: 'Amman Gas Co.', phone: '0792222222', status: 'active', orders: 32 },
    { id: 3, name: 'Quick Gas', phone: '0793333333', status: 'inactive', orders: 18 },
    { id: 4, name: 'Jordan Gas', phone: '0794444444', status: 'active', orders: 67 },
  ];

  const sampleComplaints = [
    { id: 1, customer: 'Ahmad Ali', message: 'Delivery was late by 3 hours', date: '2024-03-04', status: 'pending' },
    { id: 2, customer: 'Sara Hassan', message: 'Wrong number of cylinders delivered', date: '2024-03-03', status: 'resolved' },
    { id: 3, customer: 'Mohammed Khalil', message: 'Seller was rude', date: '2024-03-02', status: 'pending' },
  ];

  const pendingOrders = sampleOrders.filter(o => o.status === 'Pending' && !acceptedOrders.includes(o.id));
  const myAccepted = sampleOrders.filter(o => acceptedOrders.includes(o.id));

  const handleAcceptOrder = (id: number) => setAcceptedOrders(prev => [...prev, id]);
  const handleMarkDelivered = (id: number) => setDeliveredOrders(prev => [...prev, id]);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
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
      'Pending': isRTL ? 'قيد الانتظار' : 'Pending',
      'Accepted': isRTL ? 'مقبول' : 'Accepted',
      'Delivered': isRTL ? 'تم التوصيل' : 'Delivered',
      'Rejected': isRTL ? 'مرفوض' : 'Rejected',
      'pending': isRTL ? 'قيد الانتظار' : 'Pending',
      'resolved': isRTL ? 'محلول' : 'Resolved',
    };
    return map[status] || status;
  };

  // ─── SPLASH SCREEN ───────────────────────────────────────────────────────────
  if (view === 'splash') {
    return (
      <div className="min-h-screen gradient-green flex flex-col items-center justify-center relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />

        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center mb-6 card-shadow-lg animate-bounce-subtle">
            <span className="text-5xl">🔥</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{t.appName}</h1>
          <p className="text-green-100 text-lg mb-10">{t.appTagline}</p>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 w-full max-w-xs">
            <p className="text-white text-sm mb-4 font-medium">
              {isRTL ? 'اختر اللغة / Choose Language' : 'Choose Language / اختر اللغة'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${lang === 'en' ? 'bg-white text-green-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${lang === 'ar' ? 'bg-white text-green-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                🇯🇴 العربية
              </button>
            </div>
          </div>

          <button
            onClick={() => setView('login')}
            className="bg-white text-green-700 font-bold py-4 px-12 rounded-2xl text-lg card-shadow-lg hover:bg-green-50 transition-all active:scale-95"
          >
            {isRTL ? 'ابدأ الآن' : 'Get Started'}
          </button>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gradient-green px-6 pt-12 pb-16 text-center relative">
          <div className="absolute top-4 right-4">
            <button onClick={toggleLang} className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
              {t.switchLanguage}
            </button>
          </div>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🔥</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{t.loginTitle}</h1>
          <p className="text-green-100 mt-1">{t.loginSubtitle}</p>
        </div>

        <div className="flex-1 px-6 -mt-8">
          {!loginType ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">
                  {isRTL ? '👤 دخول العميل' : '👤 Customer Login'}
                </h3>
                <button
                  onClick={() => { setRole('customer'); setView('customer-home'); }}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:border-green-500 hover:text-green-700 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.loginWithGoogle}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">
                  {isRTL ? '🛵 دخول البائع' : '🛵 Seller Login'}
                </h3>
                <button
                  onClick={() => setLoginType('seller')}
                  className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-all"
                >
                  {t.loginAsSeller}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">
                  {isRTL ? '🔐 دخول المشرف' : '🔐 Admin Login'}
                </h3>
                <button
                  onClick={() => setLoginType('admin')}
                  className="w-full bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-900 transition-all"
                >
                  {t.loginAsAdmin}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <button onClick={() => setLoginType(null)} className="text-green-600 text-sm mb-4 flex items-center gap-1">
                {isRTL ? '→ رجوع' : '← Back'}
              </button>
              <h3 className="font-bold text-gray-800 text-lg mb-6">
                {loginType === 'admin' ? (isRTL ? '🔐 دخول المشرف' : '🔐 Admin Login') : (isRTL ? '🛵 دخول البائع' : '🛵 Seller Login')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                  <input
                    type="tel"
                    placeholder="07X XXX XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    defaultValue={loginType === 'admin' ? '0791234567' : '0799999999'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    defaultValue="password123"
                  />
                </div>
                <button
                  onClick={() => {
                    setRole(loginType);
                    setView(loginType === 'admin' ? 'admin' : 'seller');
                    setLoginType(null);
                  }}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all"
                >
                  {t.login}
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
    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gradient-green px-6 pt-12 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div className="relative flex items-center justify-between mb-2">
            <div>
              <p className="text-green-100 text-sm">{isRTL ? 'مرحباً بك في' : 'Welcome to'}</p>
              <h1 className="text-white text-2xl font-bold">{t.appName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full">
                {t.switchLanguage}
              </button>
              <button onClick={handleExit} className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full">
                {isRTL ? 'خروج' : 'Exit'}
              </button>
            </div>
          </div>
          <p className="text-green-100 text-sm mt-2 mb-6">{t.appDescription}</p>
          <button
            onClick={() => setView('order')}
            className="bg-white text-green-700 font-bold py-3 px-8 rounded-2xl card-shadow hover:bg-green-50 transition-all"
          >
            {t.orderNow} 🔥
          </button>
        </div>

        <div className="px-6 -mt-10">
          <div className="bg-white rounded-2xl p-6 card-shadow mb-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">{t.howItWorks}</h2>
            <div className="space-y-4">
              {[
                { num: '1', title: t.step1Title, desc: t.step1Desc },
                { num: '2', title: t.step2Title, desc: t.step2Desc },
                { num: '3', title: t.step3Title, desc: t.step3Desc },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-sm">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-bold text-gray-800 text-lg mb-4">{t.whyChooseUs}</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '⚡', title: t.feature1, desc: t.feature1Desc, color: 'bg-yellow-50 border-yellow-100' },
              { icon: '📱', title: t.feature2, desc: t.feature2Desc, color: 'bg-blue-50 border-blue-100' },
              { icon: '🛡️', title: t.feature3, desc: t.feature3Desc, color: 'bg-green-50 border-green-100' },
              { icon: '📍', title: t.feature4, desc: t.feature4Desc, color: 'bg-purple-50 border-purple-100' },
            ].map(f => (
              <div key={f.title} className={`${f.color} border rounded-2xl p-4`}>
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-semibold text-gray-800 text-sm mt-2">{f.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setView('order')}
            className="w-full gradient-green text-white font-bold py-4 rounded-2xl card-shadow hover:opacity-90 transition-all mb-4"
          >
            {t.orderNow} →
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
          {orderSent ? (
            <div className="bg-white rounded-2xl p-8 card-shadow text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t.orderSuccess}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.orderSuccessDesc}</p>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{isRTL ? 'رقم الطلب' : 'Order ID'}</span>
                  <span className="font-bold text-green-700">#ORD-2024-005</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{t.cylinderCount}</span>
                  <span className="font-semibold">{orderForm.cylinders} {t.cylinders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{isRTL ? 'الحالة' : 'Status'}</span>
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">{t.orderPending}</span>
                </div>
              </div>
              <button
                onClick={() => { setOrderSent(false); setOrderForm({ phone: '', cylinders: '', address: '' }); }}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
              >
                {isRTL ? 'طلب جديد' : 'New Order'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <p className="text-gray-500 text-sm mb-6">{t.orderSubtitle}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.phoneNumber} *</label>
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={orderForm.phone}
                    onChange={e => setOrderForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.cylinderCount} *</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOrderForm(p => ({ ...p, cylinders: String(Math.max(1, parseInt(p.cylinders || '1') - 1)) }))}
                      className="w-12 h-12 bg-gray-100 rounded-xl text-xl font-bold text-gray-600 hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={orderForm.cylinders}
                      onChange={e => setOrderForm(p => ({ ...p, cylinders: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-center text-lg font-bold"
                    />
                    <button
                      onClick={() => setOrderForm(p => ({ ...p, cylinders: String(parseInt(p.cylinders || '0') + 1) }))}
                      className="w-12 h-12 bg-green-100 rounded-xl text-xl font-bold text-green-600 hover:bg-green-200 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.address} *</label>
                  <textarea
                    placeholder={t.addressPlaceholder}
                    value={orderForm.address}
                    onChange={e => setOrderForm(p => ({ ...p, address: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm resize-none"
                  />
                </div>

                <div
                  onClick={() => setLocationShared(!locationShared)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${locationShared ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className={`w-12 h-6 rounded-full transition-all relative ${locationShared ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${locationShared ? (isRTL ? 'right-1' : 'left-7') : (isRTL ? 'right-7' : 'left-1')}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">📍 {t.shareLocation}</p>
                    <p className="text-xs text-gray-500">{t.shareLocationDesc}</p>
                  </div>
                </div>

                {locationShared && (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-green-600">📍</span>
                    <span className="text-green-700 text-sm font-medium">
                      {isRTL ? 'تم مشاركة الموقع: 31.9539° N, 35.9106° E' : 'Location shared: 31.9539° N, 35.9106° E'}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (orderForm.phone && orderForm.cylinders && orderForm.address) {
                      setOrderSent(true);
                    }
                  }}
                  disabled={!orderForm.phone || !orderForm.cylinders || !orderForm.address}
                  className="w-full gradient-green text-white font-bold py-4 rounded-2xl card-shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {t.sendOrder} 🔥
                </button>
              </div>
            </div>
          )}
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
          <p className="text-gray-500 text-sm">{t.safetySubtitle}</p>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-red-700 text-sm">{t.safetyWarning}</h3>
              <p className="text-red-600 text-xs mt-1">{t.safetyWarningText}</p>
            </div>
          </div>

          {[
            { icon: '🔧', title: t.safety1Title, desc: t.safety1Desc, color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100' },
            { icon: '💧', title: t.safety2Title, desc: t.safety2Desc, color: 'bg-cyan-50 border-cyan-100', iconBg: 'bg-cyan-100' },
            { icon: '🏠', title: t.safety3Title, desc: t.safety3Desc, color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100' },
            { icon: '🚨', title: t.safety4Title, desc: t.safety4Desc, color: 'bg-red-50 border-red-100', iconBg: 'bg-red-100' },
          ].map(item => (
            <div key={item.title} className={`${item.color} border rounded-2xl p-5`}>
              <div className="flex items-start gap-4">
                <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="gradient-green rounded-2xl p-5 text-center">
            <p className="text-white font-bold text-lg mb-1">
              {isRTL ? '🚒 رقم الطوارئ' : '🚒 Emergency Number'}
            </p>
            <p className="text-green-100 text-3xl font-bold">911</p>
            <p className="text-green-100 text-sm mt-1">
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
          {complaintSent ? (
            <div className="bg-white rounded-2xl p-8 card-shadow text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t.complaintSuccess}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.complaintSuccessDesc}</p>
              <button
                onClick={() => { setComplaintSent(false); setComplaintText(''); }}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
              >
                {isRTL ? 'شكوى جديدة' : 'New Complaint'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <p className="text-gray-500 text-sm mb-6">{t.complaintsSubtitle}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.complaintMessage}</label>
                  <textarea
                    placeholder={t.complaintPlaceholder}
                    value={complaintText}
                    onChange={e => setComplaintText(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{complaintText.length}/500</p>
                </div>
                <button
                  onClick={() => { if (complaintText.trim()) setComplaintSent(true); }}
                  disabled={!complaintText.trim()}
                  className="w-full gradient-green text-white font-bold py-4 rounded-2xl card-shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.sendComplaint}
                </button>
              </div>
            </div>
          )}
        </div>
        <BottomNav view={view} setView={setView} isRTL={isRTL} role={role} />
      </div>
    );
  }

  // ─── ACCOUNT ──────────────────────────────────────────────────────────────────
  if (view === 'account') {
    const myOrders = [
      { id: 1, cylinders: 2, address: 'Amman, Khalda', status: 'Delivered', date: '2024-03-01' },
      { id: 2, cylinders: 1, address: 'Amman, Khalda', status: 'Accepted', date: '2024-03-04' },
    ];

    return (
      <div className="min-h-screen bg-gray-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <TopBar title={t.accountTitle} isRTL={isRTL} switchLangLabel={t.switchLanguage} onToggleLang={toggleLang} onExit={handleExit} />

        <div className="px-6 py-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Ahmad Ali</h2>
                <p className="text-gray-500 text-sm">ahmad.ali@gmail.com</p>
                <p className="text-gray-500 text-sm">0791234567</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h3 className="font-bold text-gray-800 mb-4">{t.myOrders}</h3>
            {myOrders.length === 0 ? (
              <p className="text-gray-400 text-center py-4">{t.noOrders}</p>
            ) : (
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">🔥 {order.cylinders} {t.cylinders}</p>
                      <p className="text-gray-500 text-xs">{order.address}</p>
                      <p className="text-gray-400 text-xs">{order.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
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
              <p className="text-2xl font-bold text-green-600">{pendingOrders.length}</p>
              <p className="text-xs text-gray-500 mt-1">{isRTL ? 'متاح' : 'Available'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 card-shadow text-center">
              <p className="text-2xl font-bold text-blue-600">{acceptedOrders.length}</p>
              <p className="text-xs text-gray-500 mt-1">{isRTL ? 'مقبول' : 'Accepted'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 card-shadow text-center">
              <p className="text-2xl font-bold text-gray-600">{deliveredOrders.length}</p>
              <p className="text-xs text-gray-500 mt-1">{isRTL ? 'موصّل' : 'Delivered'}</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-4">{t.sellerSubtitle}</p>

          {pendingOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 card-shadow text-center">
              <span className="text-5xl">📭</span>
              <p className="text-gray-500 mt-4">{t.noAvailableOrders}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 card-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">📞 {order.phone}</p>
                      <p className="text-gray-500 text-sm mt-0.5">📍 {order.address}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {getStatusLabel('Pending')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                      🔥 {order.cylinders} {t.cylinders}
                    </span>
                    <span className="text-gray-400 text-xs">{order.date}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 transition text-sm"
                    >
                      ✓ {t.acceptOrder}
                    </button>
                    <button className="flex-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-100 transition text-sm border border-red-100">
                      ✗ {t.rejectOrder}
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
          {myAccepted.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 card-shadow text-center">
              <span className="text-5xl">📦</span>
              <p className="text-gray-500 mt-4">{isRTL ? 'لا توجد طلبات مقبولة بعد' : 'No accepted orders yet'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myAccepted.map(order => {
                const isDelivered = deliveredOrders.includes(order.id);
                return (
                  <div key={order.id} className="bg-white rounded-2xl p-5 card-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-800">📞 {order.phone}</p>
                        <p className="text-gray-500 text-sm mt-0.5">📍 {order.address}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isDelivered ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {isDelivered ? getStatusLabel('Delivered') : getStatusLabel('Accepted')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                        🔥 {order.cylinders} {t.cylinders}
                      </span>
                    </div>
                    {!isDelivered && (
                      <button
                        onClick={() => handleMarkDelivered(order.id)}
                        className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition text-sm"
                      >
                        ✓ {t.markDelivered}
                      </button>
                    )}
                  </div>
                );
              })}
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
            <div>
              <p className="text-gray-400 text-xs">{isRTL ? 'مرحباً،' : 'Welcome,'}</p>
              <h1 className="text-white font-bold text-lg">{isRTL ? 'المشرف' : 'Admin'}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className="text-gray-400 text-xs bg-gray-800 px-2 py-1 rounded-full hover:bg-gray-700 transition">
                {t.switchLanguage}
              </button>
              <button
                onClick={handleExit}
                className="text-gray-400 text-xs bg-gray-800 px-2 py-1 rounded-full hover:bg-gray-700 transition"
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
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${adminTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
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
                  { label: t.totalOrders, value: '127', icon: '📦', color: 'bg-green-500', bg: 'bg-green-50' },
                  { label: t.activeSellers, value: '3', icon: '🛵', color: 'bg-blue-500', bg: 'bg-blue-50' },
                  { label: t.complaintsCount, value: '8', icon: '📝', color: 'bg-orange-500', bg: 'bg-orange-50' },
                  { label: isRTL ? 'تم التوصيل' : 'Delivered', value: '98', icon: '✅', color: 'bg-purple-500', bg: 'bg-purple-50' },
                ].map(stat => (
                  <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 card-shadow`}>
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 card-shadow">
                <h3 className="font-bold text-gray-800 mb-4">{isRTL ? 'آخر الطلبات' : 'Recent Orders'}</h3>
                <div className="space-y-3">
                  {sampleOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{order.customer}</p>
                        <p className="text-gray-400 text-xs">{order.cylinders} {t.cylinders} • {order.date}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'sellers' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowAddSeller(!showAddSeller)}
                className="w-full gradient-green text-white font-bold py-3 rounded-xl card-shadow hover:opacity-90 transition"
              >
                + {t.addSeller}
              </button>

              {showAddSeller && (
                <div className="bg-white rounded-2xl p-5 card-shadow">
                  <h3 className="font-bold text-gray-800 mb-4">{t.addSeller}</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={t.sellerName}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="tel"
                      placeholder={t.sellerPhone}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="password"
                      placeholder={t.sellerPassword}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAddSeller(false)}
                        className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition text-sm"
                      >
                        {isRTL ? 'حفظ' : 'Save'}
                      </button>
                      <button
                        onClick={() => setShowAddSeller(false)}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition text-sm"
                      >
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {sampleSellers.map(seller => (
                <div key={seller.id} className="bg-white rounded-2xl p-5 card-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{seller.name}</p>
                      <p className="text-gray-500 text-sm">📞 {seller.phone}</p>
                      <p className="text-gray-400 text-xs mt-1">{seller.orders} {isRTL ? 'طلب' : 'orders'}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${seller.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {seller.status === 'active' ? t.active : t.inactive}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 text-xs font-semibold py-2 rounded-lg hover:bg-blue-100 transition">
                      ✏️ {t.editSeller}
                    </button>
                    <button className={`flex-1 text-xs font-semibold py-2 rounded-lg transition ${seller.status === 'active' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {seller.status === 'active' ? `⏸ ${t.deactivateSeller}` : `▶ ${t.activateSeller}`}
                    </button>
                    <button className="flex-1 bg-red-50 text-red-600 text-xs font-semibold py-2 rounded-lg hover:bg-red-100 transition">
                      🗑 {t.deleteSeller}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab === 'complaints' && (
            <div className="space-y-4">
              {sampleComplaints.map(complaint => (
                <div key={complaint.id} className="bg-white rounded-2xl p-5 card-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-gray-800 text-sm">{complaint.customer}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{complaint.message}</p>
                  <p className="text-gray-400 text-xs mb-3">{complaint.date}</p>
                  {complaint.status === 'pending' && (
                    <button className="w-full bg-green-50 text-green-700 font-semibold py-2 rounded-xl text-sm hover:bg-green-100 transition">
                      ✓ {t.markResolved}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="space-y-4">
              {sampleOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 card-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{order.customer}</p>
                      <p className="text-gray-500 text-xs">📞 {order.phone}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">📍 {order.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      🔥 {order.cylinders} {t.cylinders}
                    </span>
                    <span className="text-gray-400 text-xs">{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
