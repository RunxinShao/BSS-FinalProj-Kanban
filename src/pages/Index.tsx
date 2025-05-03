
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
          title: 'Research new UI components',
          description: 'Look into new UI component libraries for the next project phase.',
          priority: 'medium',
          createdAt: new Date('2025-04-25')
        },
        {
          id: uuidv4(),
          title: 'Update documentation',
          description: 'Update the developer documentation with the latest API changes.',
          priority: 'low',
          createdAt: new Date('2025-04-27')
        },
        {
          id: uuidv4(),
          title: 'Fix navigation bug',
          description: 'The navigation menu doesn\'t close properly on mobile devices.',
          priority: 'high',
          createdAt: new Date('2025-04-28')
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'In Progress',
      tasks: [
        {
          id: uuidv4(),
          title: 'Implement authentication',
          description: 'Add user authentication using OAuth and JWT tokens.',
          priority: 'high',
          createdAt: new Date('2025-04-20')
        },
        {
          id: uuidv4(),
          title: 'Create dashboard layout',
          description: 'Design and implement the main dashboard layout with responsive features.',
          priority: 'medium',
          createdAt: new Date('2025-04-22')
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Done',
      tasks: [
        {
          id: uuidv4(),
          title: 'Set up project repository',
          description: 'Initialize the Git repository and configure CI/CD pipelines.',
          priority: 'high',
          createdAt: new Date('2025-04-15')
        },
        {
          id: uuidv4(),
          title: 'Design system implementation',
          description: 'Create a shared design system with core components and tokens.',
          priority: 'medium',
          createdAt: new Date('2025-04-18')
        },
        {
          id: uuidv4(),
          title: 'Project planning',
          description: 'Define project scope, milestones and resource allocation.',
          priority: 'medium',
          createdAt: new Date('2025-04-10')
        }
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
            <h2 className="text-2xl font-bold text-center mb-6">Welcome to Comfy Kanban Flow</h2>
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