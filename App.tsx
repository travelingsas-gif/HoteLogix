
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
import { User, Property, Tenant, IssueReport, Order, Product } from './types';
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
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [stockData, setStockData] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    // 1. MONITORAGGIO IMMEDIATO URL HASH
    // Quando l'utente clicca sul link nell'email, Supabase lo rimanda qui con un #access_token=...
    const checkHashForRecovery = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
        console.log("Rilevato token di recupero nell'URL.");
        setAuthView('RESET');
      }
    };
    checkHashForRecovery();

    // 2. CONTROLLO SESSIONE SILENTE
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setSessionLoading(false);
      }
    });

    // 3. ASCOLTO EVENTI DI AUTENTICAZIONE
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event);
      
      // Se l'evento è esplicitamente PASSWORD_RECOVERY, forziamo la vista Reset
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('RESET');
      }

      if (session) {
        // Se c'è una sessione, carichiamo i dati utente
        fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setTenant(null);
        setSessionLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*, tenants(*)')
        .eq('id', userId)
        .single();

      if (error) {
        // Se il profilo non esiste ancora (es. nuovo utente in fase di conferma), riprova
        if (error.code === 'PGRST116' && retryCount < 3) {
          setTimeout(() => fetchUserData(userId, retryCount + 1), 1500);
          return;
        }
        
        // CRITICO: Se siamo in fase di reset password, permettiamo l'accesso al componente Reset
        // anche se l'utente non ha ancora un profilo completo nel database
        if (authView === 'RESET') {
          setSessionLoading(false);
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
        
        // Se l'utente è autenticato ma non stiamo facendo un reset, mostriamo il login/dashboard
        if (authView !== 'RESET') {
          setAuthView('LOGIN'); 
        }
        
        checkSubscription(tenantData);
        fetchTenantData(userData.tenantId, userData.role);
      }
    } catch (err) {
      console.error("Errore fetch user data:", err);
      setSessionLoading(false);
    }
  };

  const fetchTenantData = async (tenantId: string, role: string) => {
    let query = supabase.from('properties').select('*');
    if (role !== 'SUPER_ADMIN') query = query.eq('tenant_id', tenantId);
    const { data } = await query;
    if (data) setProperties(data as any);
    setSessionLoading(false);
  };

  const checkSubscription = (t: Tenant) => {
    const trialDays = 30;
    const start = new Date(t.trialStartDate);
    const now = new Date();
    const diff = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);
    if (diff > trialDays && t.subscriptionStatus !== 'active') setIsSubscribed(false);
    else setIsSubscribed(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewState('LIST');
    setSelectedProperty(null);
    setAuthView('LOGIN');
    setUser(null);
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Inizializzazione Protocolli...</p>
        </div>
      </div>
    );
  }

  // GESTIONE VISTA RESET PASSWORD (PRECEDENZA ASSOLUTA)
  if (authView === 'RESET') {
    return <ResetPassword onComplete={() => setAuthView('LOGIN')} />;
  }

  // FLUSSO AUTH
  if (!user) {
    if (authView === 'REGISTER') return <Register onBackToLogin={() => setAuthView('LOGIN')} />;
    if (authView === 'FORGOT') return <ForgotPassword onBack={() => setAuthView('LOGIN')} />;
    return <Login onGoToRegister={() => setAuthView('REGISTER')} onGoToForgot={() => setAuthView('FORGOT')} />;
  }
  
  // ABBONAMENTO
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
        return null;
      case 'profile':
        return (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-center space-y-4 border border-slate-100 max-w-lg mx-auto">
             <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-emerald-600">
               {user.name.charAt(0)}
             </div>
             <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
             <p className="text-slate-500 font-medium">{user.email}</p>
             <button onClick={handleLogout} className="w-full py-4 mt-6 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest text-xs">
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
