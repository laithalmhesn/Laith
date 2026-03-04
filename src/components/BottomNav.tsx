"use client";

type View = 'splash' | 'login' | 'customer-home' | 'order' | 'safety' | 'complaints' | 'account' | 'seller' | 'seller-orders' | 'admin';

interface BottomNavProps {
  view: View;
  setView: (v: View) => void;
  isRTL: boolean;
  role: 'customer' | 'seller' | 'admin' | null;
}

export function BottomNav({ view, setView, isRTL, role }: BottomNavProps) {
  if (role === 'customer') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50" dir={isRTL ? 'rtl' : 'ltr'}>
        {[
          { id: 'customer-home' as View, icon: '🏠', label: isRTL ? 'الرئيسية' : 'Home' },
          { id: 'order' as View, icon: '🔥', label: isRTL ? 'اطلب' : 'Order' },
          { id: 'safety' as View, icon: '🛡️', label: isRTL ? 'السلامة' : 'Safety' },
          { id: 'complaints' as View, icon: '📝', label: isRTL ? 'شكوى' : 'Complaint' },
          { id: 'account' as View, icon: '👤', label: isRTL ? 'حسابي' : 'Account' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${view === item.id ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
            {view === item.id && <div className="w-1 h-1 bg-green-600 rounded-full" />}
          </button>
        ))}
      </div>
    );
  }

  if (role === 'seller') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50" dir={isRTL ? 'rtl' : 'ltr'}>
        {[
          { id: 'seller' as View, icon: '📥', label: isRTL ? 'الطلبات' : 'Orders' },
          { id: 'seller-orders' as View, icon: '📦', label: isRTL ? 'طلباتي' : 'My Orders' },
          { id: 'account' as View, icon: '👤', label: isRTL ? 'حسابي' : 'Account' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${view === item.id ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
            {view === item.id && <div className="w-1 h-1 bg-green-600 rounded-full" />}
          </button>
        ))}
      </div>
    );
  }

  return null;
}
