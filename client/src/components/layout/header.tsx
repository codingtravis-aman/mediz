import { FC } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  fixed?: boolean;
}

const Header: FC<HeaderProps> = ({ fixed = true }) => {
  return (
    <header className={`bg-white shadow-sm ${fixed ? 'fixed top-0 left-0 right-0 z-10' : ''}`}>
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-500 rounded-md flex items-center justify-center">
            <span className="text-white font-semibold">M</span>
          </div>
          <h1 className="ml-2 text-xl font-semibold text-gray-800">Mediz</h1>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
