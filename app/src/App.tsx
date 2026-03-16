import { useStore } from '@/hooks/useStore';
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  UserDashboardPage,
  CreateJobPage,
  DataStructurePage,
  AddCandidatesPage,
  DashboardPage,
  CandidateDetailPage,
} from '@/sections';
import './App.css';

// TalentDash - Sistema de Recrutamento Inteligente
// MVP Visual com fluxo passo a passo

function App() {
  const store = useStore();
  const { state } = store;

  // Renderiza a tela atual baseada no estado de navegação
  switch (state.currentView) {
    case 'landing':
      return <LandingPage store={store} />;
    
    case 'login':
      return <LoginPage store={store} />;
    
    case 'register':
      return <RegisterPage store={store} />;
    
    case 'user-dashboard':
      return <UserDashboardPage store={store} />;
    
    case 'create-job':
      return <CreateJobPage store={store} />;
    
    case 'data-structure':
      return <DataStructurePage store={store} />;
    
    case 'add-candidates':
      return <AddCandidatesPage store={store} />;
    
    case 'dashboard':
      return <DashboardPage store={store} />;
    
    case 'candidate-detail':
      return <CandidateDetailPage store={store} />;
    
    default:
      return <LandingPage store={store} />;
  }
}

export default App;
