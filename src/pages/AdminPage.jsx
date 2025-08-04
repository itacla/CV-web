import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import UserManagement from '../components/UserManagement';
import ExperienceManagement from '../components/ExperienceManagement';
import ProfileManagement from '../components/ProfileManagement';
import SkillsManagement from '../components/SkillsManagement'; // Import the new component

// Simple Tab component for navigation
const Tab = ({ activeTab, setActiveTab, label, tabName }) => (
  <li className="nav-item">
    <button
      className={`nav-link ${activeTab === tabName ? 'active' : ''}`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
    </button>
  </li>
);

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // Default tab

  useEffect(() => {
    const checkSessionAndAuthorization = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data, error } = await supabase
          .from('authorized_users')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (data && !error) {
          setIsAuthorized(true);
        }
      }
      setLoading(false);
    };

    checkSessionAndAuthorization();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthorized(false);
      if (session) {
        supabase
          .from('authorized_users')
          .select('email')
          .eq('email', session.user.email)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              setIsAuthorized(true);
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(false);
  };

  if (loading) {
    return <div className="container text-center pt-5">Caricamento...</div>;
  }

  if (!session) {
    return (
      <div className="container" style={{ maxWidth: '500px', paddingTop: '50px' }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          redirectTo={window.location.href} // Add this line
        />
      </div>
    );
  }

  if (isAuthorized) {
    //console.log('Your Supabase User ID:', session.user.id);
    return (
      <div className="container pt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Pannello di Amministrazione</h2>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
        <p>Benvenuto, <strong>{session.user.email}</strong>!</p>
        <hr />

        <ul className="nav nav-tabs mb-3">
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} label="Gestione Profilo" tabName="profile" />
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} label="Gestione Esperienze" tabName="experiences" />
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} label="Gestione Competenze" tabName="skills" />
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} label="Gestione Utenti" tabName="users" />
        </ul>

        <div className="tab-content">
          {activeTab === 'profile' && <ProfileManagement />}
          {activeTab === 'experiences' && <ExperienceManagement />}
          {activeTab === 'skills' && <SkillsManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container text-center" style={{ paddingTop: '50px' }}>
        <h2>Accesso Negato</h2>
        <p>L'utente <strong>{session.user.email}</strong> non è autorizzato.</p>
        <button className="btn btn-warning" onClick={handleLogout}>Esegui il Logout</button>
      </div>
    );
  }
}
