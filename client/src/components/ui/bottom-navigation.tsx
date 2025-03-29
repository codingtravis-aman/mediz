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
          <a className={`flex flex-col items-center justify-center py-3 ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </a>
        </Link>
        <Link href="/medications">
          <a className={`flex flex-col items-center justify-center py-3 ${isActive('/medications') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Pill className="h-5 w-5 mb-1" />
            <span className="text-xs">Medications</span>
          </a>
        </Link>
        <Link href="/scan">
          <a className={`flex flex-col items-center justify-center py-3 ${isActive('/scan') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Camera className="h-5 w-5 mb-1" />
            <span className="text-xs">Scan</span>
          </a>
        </Link>
        <Link href="/reminders">
          <a className={`flex flex-col items-center justify-center py-3 ${isActive('/reminders') ? 'text-primary-600' : 'text-gray-500'}`}>
            <Bell className="h-5 w-5 mb-1" />
            <span className="text-xs">Reminders</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
