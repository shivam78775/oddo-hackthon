import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-950">
      <NavBar />
      <main className="page-container relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
