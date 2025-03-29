import { FC } from 'react';
import { Home, Pill, Camera, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const BottomNavigation: FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer`}>
            <Home className={`h-5 w-5 mb-1 ${isActive('/') ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`text-xs ${isActive('/') ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>Home</span>
          </div>
        </Link>
        <Link href="/medications">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer`}>
            <Pill className={`h-5 w-5 mb-1 ${isActive('/medications') ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`text-xs ${isActive('/medications') ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>Meds</span>
          </div>
        </Link>
        <Link href="/scan">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer`}>
            <div className="bg-blue-600 p-2 rounded-full mb-1">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xs ${isActive('/scan') ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>Scan</span>
          </div>
        </Link>
        <Link href="/reminders">
          <div className={`flex flex-col items-center justify-center py-2 cursor-pointer`}>
            <Bell className={`h-5 w-5 mb-1 ${isActive('/reminders') ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`text-xs ${isActive('/reminders') ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>Reminders</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
