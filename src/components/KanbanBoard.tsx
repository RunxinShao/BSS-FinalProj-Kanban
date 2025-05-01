
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { KanbanBoard as KanbanBoardType, Task } from '@/types/kanban';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface KanbanBoardProps {
  initialBoard: KanbanBoardType;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialBoard }) => {
  const [board, setBoard] = useState<KanbanBoardType>(initialBoard);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentColumnId, setCurrentColumnId] = useState<string | undefined>(undefined);
  const [columnFormOpen, setColumnFormOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Drop outside the list
    if (!destination) return;

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = board.columns.find(col => col.id === source.droppableId);
    const destColumn = board.columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newTasks = [...sourceColumn.tasks];
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      
      const newColumns = board.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: newTasks };
        }
        return col;
      });
      
      setBoard({ ...board, columns: newColumns });
    }
    // Moving from one column to another
    else {
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);
      
      const newColumns = board.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destColumn.id) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });
      
      setBoard({ ...board, columns: newColumns });
      toast(`Task moved to ${destColumn.title}`);
    }
  };

  const handleAddTask = (columnId: string) => {
    setCurrentTask(undefined);
    setCurrentColumnId(columnId);
    setTaskFormOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = board.columns
      .flatMap(column => column.tasks)
      .find(t => t.id === taskId);
      
    if (task) {
      setCurrentTask(task);
      setTaskFormOpen(true);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const newColumns = board.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));
    
    setBoard({ ...board, columns: newColumns });
    toast('Task deleted');
  };

  const handleTaskFormSubmit = (taskData: Partial<Task>, columnId?: string) => {
    if (currentTask) {
      // Edit existing task
      const newColumns = board.columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === currentTask.id 
            ? { ...task, ...taskData } as Task
            : task
        )
      }));
      
      setBoard({ ...board, columns: newColumns });
      toast('Task updated');
    } else if (columnId) {
      // Add new task
      const newTask: Task = {
        id: uuidv4(),
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        createdAt: new Date()
      };
      
      const newColumns = board.columns.map(column => {
        if (column.id === columnId) {
          return { ...column, tasks: [...column.tasks, newTask] };
        }
        return column;
      });
      
      setBoard({ ...board, columns: newColumns });
      toast('Task created');
    }
    
    setCurrentTask(undefined);
    setCurrentColumnId(undefined);
  };

  const handleAddColumn = () => {
    setColumnFormOpen(true);
  };

  const handleColumnFormSubmit = () => {
    if (!newColumnTitle.trim()) return;
    
    const newColumn = {
      id: uuidv4(),
      title: newColumnTitle,
      tasks: []
    };
    
    setBoard({
      ...board,
      columns: [...board.columns, newColumn]
    });
    
    setNewColumnTitle('');
    setColumnFormOpen(false);
    toast('Column added');
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        <Button onClick={handleAddColumn}>
          <Plus className="mr-2 h-4 w-4" /> Add Column
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {board.columns.map((column, index) => (
            <KanbanColumn
              key={column.id}
              column={column}
              index={index}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>
      
      <TaskForm
        open={taskFormOpen}
        task={currentTask}
        columnId={currentColumnId}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
      />
      
      <Dialog open={columnFormOpen} onOpenChange={setColumnFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Column title"
            value={newColumnTitle}
            onChange={e => setNewColumnTitle(e.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setColumnFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleColumnFormSubmit}>Create Column</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
