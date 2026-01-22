
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Pickaxe, 
  ShoppingCart, 
  Wallet, 
  MessageSquare, 
  Users, 
  Calendar,
  LogOut,
  ChevronRight,
  TrendingUp,
  Cpu,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  ShieldAlert
} from 'lucide-react';
import { User, WalletState, AppTab, CheckInDay } from './types.ts';
import { CONVERSION_RATE, BASE_MINING_RATE, MINING_PLANS } from './constants.tsx';
import Dashboard from './components/Dashboard.tsx';
import MiningPanel from './components/MiningPanel.tsx';
import Shop from './components/Shop.tsx';
import WalletView from './components/WalletView.tsx';
import Missions from './components/Missions.tsx';
import Referral from './components/Referral.tsx';
import AICustomerService from './components/AICustomerService.tsx';
import Auth from './components/Auth.tsx';
import AdminPanel from './components/AdminPanel.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('minier_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [wallet, setWallet] = useState<WalletState>(() => {
    const saved = localStorage.getItem('minier_wallet');
    return saved ? JSON.parse(saved) : {
      balance: 1.0000,
      hashrate: 1.0,
      lastClaimTime: Date.now(),
      accumulatedMined: 0
    };
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('minier_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('minier_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('minier_wallet', JSON.stringify(wallet));
  }, [wallet]);

  // Real-time mining accumulation simulation
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setWallet(prev => {
        const ratePerSecond = (prev.hashrate * BASE_MINING_RATE) / 86400;
        return {
          ...prev,
          accumulatedMined: prev.accumulatedMined + ratePerSecond
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleClaim = useCallback(() => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + prev.accumulatedMined,
      accumulatedMined: 0,
      lastClaimTime: Date.now()
    }));
  }, []);

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard wallet={wallet} onNavigate={setActiveTab} />;
      case 'mining': return <MiningPanel wallet={wallet} onClaim={handleClaim} />;
      case 'shop': return <Shop wallet={wallet} setWallet={setWallet} />;
      case 'wallet': return <WalletView wallet={wallet} setWallet={setWallet} />;
      case 'missions': return <Missions wallet={wallet} setWallet={setWallet} />;
      case 'referral': return <Referral />;
      case 'support': return <AICustomerService />;
      case 'admin': return user.role === 'admin' ? <AdminPanel /> : <Dashboard wallet={wallet} onNavigate={setActiveTab} />;
      default: return <Dashboard wallet={wallet} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#0a0a0c] text-white shadow-2xl relative border-x border-gray-800">
      <header className="p-4 flex items-center justify-between border-b border-gray-800 sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 p-2 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Pickaxe className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-lg tracking-wider text-yellow-500 leading-none">IDR MINIER</h1>
            {user.role === 'admin' && <span className="text-[8px] bg-red-500 text-white px-1 rounded uppercase font-bold">Admin Mode</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Balance</p>
            <p className="text-sm font-orbitron font-semibold text-yellow-400">
              {wallet.balance.toFixed(4)} <span className="text-[10px]">IDR</span>
            </p>
          </div>
          <button onClick={handleLogout} className="p-2 bg-gray-900 rounded-lg hover:bg-red-900/20 transition-colors">
            <LogOut className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#111114]/90 backdrop-blur-xl border-t border-white/5 px-2 py-3 flex justify-between items-center z-50">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-5 h-5" />} label="Home" />
        <NavButton active={activeTab === 'mining'} onClick={() => setActiveTab('mining')} icon={<Pickaxe className="w-5 h-5" />} label="Mine" />
        <NavButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingCart className="w-5 h-5" />} label="Shop" />
        <NavButton active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={<Wallet className="w-5 h-5" />} label="Wallet" />
        {user.role === 'admin' ? (
           <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<ShieldAlert className="w-5 h-5" />} label="Admin" />
        ) : (
          <NavButton active={activeTab === 'support'} onClick={() => setActiveTab('support')} icon={<MessageSquare className="w-5 h-5" />} label="Support" />
        )}
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[60px] ${active ? 'text-yellow-500 scale-110' : 'text-gray-500'}`}>
    {icon}
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
