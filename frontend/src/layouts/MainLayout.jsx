import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-slate-100 bg-transparent">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 lg:flex-row lg:items-start">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((value) => !value)} />
        <main className="min-w-0 flex-1 space-y-2">
          <Navbar />
          <div className="pt-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
