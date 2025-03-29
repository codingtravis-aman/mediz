import { FC } from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  fixed?: boolean;
}

const Header: FC<HeaderProps> = ({ fixed = true }) => {
  return (
    <header className={`bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 ${fixed ? 'fixed top-0 left-0 right-0 z-10' : ''}`}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-extrabold text-xl">M</span>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-extrabold text-white">Mediz</h1>
            <p className="text-xs text-purple-200">Your Health Companion</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/10 text-white hover:bg-white/20 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
