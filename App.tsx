
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { PropertyDetail } from './pages/PropertyDetail';
import { UserManager } from './pages/UserManager';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { GlobalUserManager } from './pages/GlobalUserManager';
import { User, Property, Tenant, IssueReport, Order } from './types';
import { supabase } from './lib/supabaseClient';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewState, setViewState] = useState('LIST');
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'RESET'>('LOGIN');

  // Dati Globali (popolati se Super Admin)
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allIssues, setAllIssues] = useState<IssueReport[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) fetchProfile(session.user.id);
      else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data: profile } = await supabase.from('app_users').select('*, tenants(*)').eq('id', userId).single();
    if (profile) {
      const userData: User = {
        id: profile.id,
        tenantId: profile.tenant_id,
        email: profile.email,
        name: profile.name,
        role: profile.role as any
      };
      setUser(userData);
      if (profile.tenants) setTenant(profile.tenants as any);
      
      // Se Super Admin, carica tutto il mondo
      if (userData.role === 'SUPER_ADMIN') {
        loadGlobalData();
        setCurrentPage('super_dashboard');
      } else {
        loadTenantData(userData.tenantId);
      }
    }
    setLoading(false);
  };

  const loadGlobalData = async () => {
    const { data: users } = await supabase.from('app_users').select('*');
    const { data: tenants } = await supabase.from('tenants').select('*');
    const { data: orders } = await supabase.from('orders').select('*');
    const { data: issues } = await supabase.from('issue_reports').select('*');
    
    if (users) setAllUsers(users as any);
    if (tenants) setAllTenants(tenants as any);
    if (orders) setAllOrders(orders as any);
    if (issues) setAllIssues(issues as any);
  };

  const loadTenantData = async (tid: string) => {
    const { data: props } = await supabase.from('properties').select('*').eq('tenant_id', tid);
    if (props) setProperties(props as any);
    
    // Per l'Owner, carichiamo anche lo staff del suo hotel
    const { data: staff } = await supabase.from('app_users').select('*').eq('tenant_id', tid);
    if (staff) setAllUsers(staff as any);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 font-black text-indigo-600 animate-pulse uppercase tracking-widest">HoteLogix Loading...</div>;

  if (!user) {
    if (authView === 'REGISTER') return <Register onBackToLogin={() => setAuthView('LOGIN')} />;
    if (authView === 'FORGOT') return <ForgotPassword onBack={() => setAuthView('LOGIN')} />;
    return <Login onGoToRegister={() => setAuthView('REGISTER')} onGoToForgot={() => setAuthView('FORGOT')} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'super_dashboard':
        return <SuperAdminDashboard tenants={allTenants} allUsers={allUsers} allOrders={allOrders} allIssues={allIssues} />;
      case 'global_users':
        return <GlobalUserManager 
          allUsers={allUsers} 
          tenants={allTenants} 
          onUpdateUser={async (uid, up) => {
            await supabase.from('app_users').update(up).eq('id', uid);
            loadGlobalData();
          }}
          onDeleteUser={async (uid) => {
             await supabase.from('app_users').delete().eq('id', uid);
             loadGlobalData();
          }}
        />;
      case 'dashboard':
        return <Dashboard properties={properties} onSelectProperty={() => {}} isAdmin={user.role === 'OWNER'} onAddProperty={() => {}} tenantId={user.tenantId} />;
      case 'staff':
        return <UserManager users={allUsers} tenantId={user.tenantId} onRefresh={() => loadTenantData(user.tenantId)} />;
      default:
        return <div>Pagina non trovata</div>;
    }
  };

  return (
    <Layout 
      currentUser={user} 
      onLogout={() => supabase.auth.signOut()} 
      onNavigate={setCurrentPage} 
      currentPage={currentPage}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
