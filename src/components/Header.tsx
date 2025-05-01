
import React from 'react';
import { Kanban } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-background border-b py-3">
      <div className="container mx-auto flex items-center">
        <Kanban size={24} className="text-primary mr-2" />
        <h1 className="text-xl font-semibold">Comfy Kanban Flow</h1>
      </div>
    </header>
  );
};

export default Header;
