import { FC } from 'react';
import { Home, Pill, Camera, Bell, FileText } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const BottomNavigation: FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10 shadow-lg">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <Link href="/">
          <div className="flex flex-col items-center py-2 cursor-pointer w-16">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive('/') ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-200' : 'bg-gray-100'}`}>
              <Home className={`h-5 w-5 ${isActive('/') ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive('/') ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>Home</span>
          </div>
        </Link>
        
        <Link href="/medications">
          <div className="flex flex-col items-center py-2 cursor-pointer w-16">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive('/medications') ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-200' : 'bg-gray-100'}`}>
              <Pill className={`h-5 w-5 ${isActive('/medications') ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive('/medications') ? 'text-pink-600 font-bold' : 'text-gray-500'}`}>Medications</span>
          </div>
        </Link>
        
        <Link href="/scan">
          <div className="flex flex-col items-center cursor-pointer w-16 -mt-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg border-4 border-white">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <span className={`text-xs mt-1 ${isActive('/scan') ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>Scan</span>
          </div>
        </Link>
        
        <Link href="/prescriptions">
          <div className="flex flex-col items-center py-2 cursor-pointer w-16">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive('/prescriptions') ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md shadow-blue-200' : 'bg-gray-100'}`}>
              <FileText className={`h-5 w-5 ${isActive('/prescriptions') ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive('/prescriptions') ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>Prescriptions</span>
          </div>
        </Link>
        
        <Link href="/reminders">
          <div className="flex flex-col items-center py-2 cursor-pointer w-16">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive('/reminders') ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-orange-200' : 'bg-gray-100'}`}>
              <Bell className={`h-5 w-5 ${isActive('/reminders') ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive('/reminders') ? 'text-amber-600 font-bold' : 'text-gray-500'}`}>Reminders</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
