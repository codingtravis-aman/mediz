import { FC } from 'react';
import { Home, Pill, Camera, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const BottomNavigation: FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  // Define icons with active/inactive colors
  const getIconStyleForPath = (path: string) => {
    if (isActive(path)) {
      switch (path) {
        case '/':
          return 'text-[var(--blue-primary)]';
        case '/medications':
          return 'text-[var(--green-primary)]';
        case '/scan':
          return 'text-[var(--teal-secondary)]';
        case '/reminders':
          return 'text-[var(--orange-warning)]';
        default:
          return 'text-[var(--blue-primary)]';
      }
    }
    return 'text-[var(--text-muted)]';
  };

  // Get label style for active/inactive state
  const getLabelStyleForPath = (path: string) => {
    return isActive(path) ? 'font-medium text-[var(--text-dark)]' : 'text-[var(--text-muted)]';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-10">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center py-3 px-1 cursor-pointer ${isActive('/') ? 'nav-item-active' : ''}`}>
            <Home className={`h-5 w-5 mb-1 ${getIconStyleForPath('/')}`} />
            <span className={`text-xs ${getLabelStyleForPath('/')}`}>Home</span>
          </div>
        </Link>
        <Link href="/medications">
          <div className={`flex flex-col items-center justify-center py-3 px-1 cursor-pointer ${isActive('/medications') ? 'nav-item-active' : ''}`}>
            <Pill className={`h-5 w-5 mb-1 ${getIconStyleForPath('/medications')}`} />
            <span className={`text-xs ${getLabelStyleForPath('/medications')}`}>Medications</span>
          </div>
        </Link>
        <Link href="/scan">
          <div className={`flex flex-col items-center justify-center py-3 px-1 cursor-pointer ${isActive('/scan') ? 'nav-item-active' : ''}`}>
            <div className="bg-[var(--blue-teal-gradient)] p-2 rounded-full mb-1 shadow-md">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xs ${getLabelStyleForPath('/scan')}`}>Scan</span>
          </div>
        </Link>
        <Link href="/reminders">
          <div className={`flex flex-col items-center justify-center py-3 px-1 cursor-pointer ${isActive('/reminders') ? 'nav-item-active' : ''}`}>
            <Bell className={`h-5 w-5 mb-1 ${getIconStyleForPath('/reminders')}`} />
            <span className={`text-xs ${getLabelStyleForPath('/reminders')}`}>Reminders</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
