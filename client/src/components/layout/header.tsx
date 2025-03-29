import { FC } from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  fixed?: boolean;
}

const Header: FC<HeaderProps> = ({ fixed = true }) => {
  return (
    <header className={`bg-blue-600 ${fixed ? 'fixed top-0 left-0 right-0 z-10' : ''}`}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-blue-600 font-bold text-lg">M</span>
          </div>
          <h1 className="ml-2 text-xl font-bold text-white">Mediz</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500 rounded-lg">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500 rounded-lg">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/10 text-white hover:bg-white/20 rounded-lg">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
