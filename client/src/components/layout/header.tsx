import { FC } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  fixed?: boolean;
}

const Header: FC<HeaderProps> = ({ fixed = true }) => {
  return (
    <header className={`bg-white border-b border-slate-200 ${fixed ? 'fixed top-0 left-0 right-0 z-10' : ''}`}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="ml-2 text-lg font-semibold text-slate-900">Mediz</h1>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
