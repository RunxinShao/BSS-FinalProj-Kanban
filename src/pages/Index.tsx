
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import AuthForms from '@/components/AuthForms';
import { KanbanBoard as KanbanBoardType } from '@/types/kanban';
import { useAuth } from '@/contexts/AuthContext';
import * as localStorageService from '@/services/localStorage';

const initialBoard: KanbanBoardType = {
  id: uuidv4(),
  title: 'My Project Board',
  columns: [
    {
      id: uuidv4(),
      title: 'To Do',
      tasks: [
        {
          id: uuidv4(),
          title: 'work out',
          description: 'leg day!',
          priority: 'medium',
          createdAt: new Date('2025-05-03')
        },
        {
          id: uuidv4(),
          title: 'finish reading a paper',
          description: 'take notes',
          priority: 'low',
          createdAt: new Date('2025-04-27')
        },
        
      ]
    },
    {
      id: uuidv4(),
      title: 'In Progress',
      tasks: [
        {
          id: uuidv4(),
          title: 'happy happy happy',
          description: 'drink drink drink',
          priority: 'high',
          createdAt: new Date('2025-04-20')
        },
       
      ]
    },
    {
      id: uuidv4(),
      title: 'Done',
      tasks: [
        {
          id: uuidv4(),
          title: 'finish the project',
          description: ' have fun',
          priority: 'high',
          createdAt: new Date('2025-04-20')
        },
       
      ]
    }
    
  ]
};

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const boards = localStorageService.getUserBoards();
  const boardToUse = boards.length > 0 ? boards[0] : initialBoard;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-1">
        {isAuthenticated ? (
          <KanbanBoard initialBoard={boardToUse} />
        ) : (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome to Neo Kanban!</h2>
            <p className="text-center text-muted-foreground mb-8">
              Please login or register to access your Kanban boards
            </p>
            <AuthForms />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;