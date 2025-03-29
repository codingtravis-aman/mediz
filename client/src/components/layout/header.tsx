import { FC } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  fixed?: boolean;
}

const Header: FC<HeaderProps> = ({ fixed = true }) => {
  return (
    <header className={`gradient-blue-teal shadow-md ${fixed ? 'fixed top-0 left-0 right-0 z-10' : ''}`}>
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-9 w-9 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold">M</span>
          </div>
          <h1 className="ml-2 text-xl font-bold text-white">Mediz</h1>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
