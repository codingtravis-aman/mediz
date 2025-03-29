import { FC } from 'react';
import { Bell, User, Search, LogOut, Settings, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  fixed?: boolean;
}

const Header: FC<HeaderProps> = ({ fixed = true }) => {
  const [, navigate] = useLocation();
  
  // Navigate to profile and settings pages
  const handleProfile = () => navigate('/profile');
  const handleSettings = () => navigate('/settings');
  const handleLogout = () => {
    // Add logout logic here later
    navigate('/login');
  };
  
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="bg-white/10 text-white hover:bg-white/20 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <UserCircle2 className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
