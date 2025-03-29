import { FC } from 'react';
import { Home, Pill, Camera, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const BottomNavigation: FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10 shadow-lg">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer relative ${isActive('/') ? 'after:absolute after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-600' : ''}`}>
            <Home className={`h-5 w-5 mb-1 ${isActive('/') ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`text-xs ${isActive('/') ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>Home</span>
          </div>
        </Link>
        <Link href="/medications">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer relative ${isActive('/medications') ? 'after:absolute after:bottom-0 after:w-10 after:h-0.5 after:bg-emerald-500' : ''}`}>
            <Pill className={`h-5 w-5 mb-1 ${isActive('/medications') ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className={`text-xs ${isActive('/medications') ? 'text-emerald-500 font-medium' : 'text-slate-500'}`}>Meds</span>
          </div>
        </Link>
        <Link href="/scan">
          <div className="flex flex-col items-center justify-center -mt-5 cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-full mb-1 shadow-lg border-4 border-white">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xs ${isActive('/scan') ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>Scan</span>
          </div>
        </Link>
        <Link href="/reminders">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer relative ${isActive('/reminders') ? 'after:absolute after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-600' : ''}`}>
            <Bell className={`h-5 w-5 mb-1 ${isActive('/reminders') ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`text-xs ${isActive('/reminders') ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>Reminders</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
