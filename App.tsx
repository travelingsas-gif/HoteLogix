
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { PropertyDetail } from './pages/PropertyDetail';
import { InventoryForm } from './pages/InventoryForm';
import { LaundryInventoryForm } from './pages/LaundryInventoryForm';
import { OrderForm } from './pages/OrderForm';
import { LaundryOrderForm } from './pages/LaundryOrderForm';
import { IssueReportForm } from './pages/IssueReportForm';
import { UnusedLaundryForm } from './pages/UnusedLaundryForm';
import { PropertyEditForm } from './pages/PropertyEditForm';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { GlobalStock } from './pages/GlobalStock';
import { IssuesList } from './pages/IssuesList';
import { UserManager } from './pages/UserManager';
import { User, Property, Tenant, IssueReport, UnusedLaundryReport, Order } from './types';
import { supabase } from './lib/supabaseClient';
import { MOCK_PROPERTIES, MOCK_PRODUCTS } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewState, setViewState] = useState('LIST'); 
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'RESET'>('LOGIN');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockData, setStockData] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    // 1. Cattura immediata del tipo di evento dall'URL (reset password)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        setAuthView('RESET');
      }
    };

    handleHash();

    // 2. Controllo sessione esistente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setSessionLoading(false);
      }
    });

    // 3. Ascolta cambi di stato Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('RESET');
      }
      
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setTenant(null);
        setSessionLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*, tenants(*)')
        .eq('id', userId)
        .single();

      if (error) {
        // Se l'utente Auth esiste ma non il profilo (delay trigger)
        if (error.code === 'PGRST116') {
          console.warn("Profilo in fase di creazione...");
          return;
        }
        throw error;
      }

      if (data) {
        const userData: User = {
          id: data.id,
          tenantId: data.tenant_id,
          email: data.email,
          name: data.name,
          role: data.role
        };

        const tenantData: Tenant = {
          id: data.tenants.id,
          name: data.tenants.name,
          trialStartDate: data.tenants.trial_start_date,
          subscriptionStatus: data.tenants.subscription_status
        };

        setUser(userData);
        setTenant(tenantData);
        setAuthView('LOGIN'); 
        checkSubscription(tenantData);
      }
    } catch (err) {
      console.error("Errore caricamento dati utente:", err);
    } finally {
      setSessionLoading(false);
    }
  };

  const checkSubscription = (t: Tenant) => {
    const trialDays = 30;
    const start = new Date(t.trialStartDate);
    const now = new Date();
    const diff = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);
    if (diff > trialDays && t.subscriptionStatus !== 'active') {
      setIsSubscribed(false);
    } else {
      setIsSubscribed(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewState('LIST');
    setSelectedProperty(null);
    setAuthView('LOGIN');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'RESET') return <ResetPassword onComplete={() => setAuthView('LOGIN')} />;
    if (authView === 'REGISTER') return <Register onBackToLogin={() => setAuthView('LOGIN')} />;
    if (authView === 'FORGOT') return <ForgotPassword onBack={() => setAuthView('LOGIN')} />;
    return <Login onGoToRegister={() => setAuthView('REGISTER')} onGoToForgot={() => setAuthView('FORGOT')} />;
  }
  
  if (!isSubscribed && user.role !== 'SUPER_ADMIN') {
    return <SubscriptionPage user={user} tenant={tenant!} onLogout={handleLogout} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        if (viewState === 'LIST') {
          return (
            <Dashboard 
              properties={properties}
              onSelectProperty={(p) => { setSelectedProperty(p); setViewState('DETAIL'); }} 
              isAdmin={user.role === 'OWNER' || user.role === 'SUPER_ADMIN'} 
              onAddProperty={(p) => setProperties([...properties, p])}
              tenantId={user.tenantId}
            />
          );
        }
        if (viewState === 'DETAIL' && selectedProperty) {
          return (
            <PropertyDetail 
              property={selectedProperty} 
              onBack={() => setViewState('LIST')} 
              onEdit={() => setViewState('EDIT')}
              currentUser={user}
              onOpenInventory={() => setViewState('FORM_INVENTORY')}
              onOpenOrderProducts={() => setViewState('FORM_ORDER')}
              onOpenLaundryInventory={() => setViewState('FORM_LAUNDRY_INV')}
              onOpenLaundryOrder={() => setViewState('FORM_LAUNDRY_ORD')}
              onOpenIssueReport={() => setViewState('FORM_ISSUE')}
              onOpenUnusedLaundry={() => setViewState('FORM_UNUSED')}
            />
          );
        }
        if (viewState === 'EDIT' && selectedProperty) {
          return (
            <PropertyEditForm 
              property={selectedProperty} 
              onBack={() => setViewState('DETAIL')} 
              onSave={(updated) => { setProperties(properties.map(p => p.id === updated.id ? updated : p)); setViewState('DETAIL'); }} 
            />
          );
        }
        if (viewState === 'FORM_INVENTORY' && selectedProperty) {
          return (
            <InventoryForm 
              property={selectedProperty} 
              availableProducts={MOCK_PRODUCTS.filter(p => p.category !== 'LAUNDRY')} 
              currentStock={stockData[selectedProperty.id] || {}}
              onBack={() => setViewState('DETAIL')}
              onSubmit={(items, sig) => {
                const updatedStock = { ...stockData };
                if (!updatedStock[selectedProperty.id]) updatedStock[selectedProperty.id] = {};
                items.forEach(item => { updatedStock[selectedProperty.id][item.productId] = item.quantityInStock; });
                setStockData(updatedStock);
                setViewState('DETAIL');
              }}
            />
          );
        }
        return null;

      case 'global_stock':
        return <GlobalStock products={MOCK_PRODUCTS} stockData={stockData} properties={properties} />;
      
      case 'issues_list':
        return (
          <IssuesList 
            issues={issues} 
            properties={properties} 
            onResolve={(id) => setIssues(issues.map(i => i.id === id ? {...i, status: 'RESOLVED'} : i))}
            onDelete={(id) => setIssues(issues.filter(i => i.id !== id))}
          />
        );

      case 'users':
        return <UserManager users={[]} onAdd={() => {}} onDelete={() => {}} />;

      case 'profile':
        return (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-center space-y-4 border border-slate-100 max-w-lg mx-auto">
             <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-emerald-600">
               {user.name.charAt(0)}
             </div>
             <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
             <p className="text-slate-500 font-medium">{user.email}</p>
             <div className="bg-slate-50 p-6 rounded-3xl inline-block mt-4 w-full">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Livello Autorizzativo</span>
               <p className="font-bold text-emerald-600">{user.role}</p>
             </div>
             <button 
               onClick={handleLogout}
               className="w-full py-4 mt-6 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all"
             >
               Disconnetti Sessione
             </button>
          </div>
        );

      default:
        return <Dashboard properties={properties} onSelectProperty={() => {}} isAdmin={false} onAddProperty={() => {}} tenantId={user.tenantId} />;
    }
  };

  return (
    <Layout 
      currentUser={user} 
      onLogout={handleLogout} 
      onNavigate={(page) => { setCurrentPage(page); setViewState('LIST'); }}
      currentPage={currentPage}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
