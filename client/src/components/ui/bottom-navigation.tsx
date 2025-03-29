import { FC } from 'react';
import { Home, Pill, Camera, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const BottomNavigation: FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-10">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </div>
        </Link>
        <Link href="/medications">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${isActive('/medications') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Pill className="h-5 w-5 mb-1" />
            <span className="text-xs">Medications</span>
          </div>
        </Link>
        <Link href="/scan">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${isActive('/scan') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Camera className="h-5 w-5 mb-1" />
            <span className="text-xs">Scan</span>
          </div>
        </Link>
        <Link href="/reminders">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${isActive('/reminders') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Bell className="h-5 w-5 mb-1" />
            <span className="text-xs">Reminders</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
