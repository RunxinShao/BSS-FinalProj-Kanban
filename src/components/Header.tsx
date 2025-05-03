
import React from 'react';
import { Kanban, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import DataControls from './DataControls';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="w-full bg-background border-b py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Kanban size={24} className="text-primary mr-2" />
          <h1 className="text-xl font-semibold">Neo Kanban</h1>
        </div>
        
        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <DataControls />
            <div className="flex items-center gap-2">
              <User size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">{user.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;