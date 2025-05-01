
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType } from '@/types/kanban';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: ColumnType;
  index: number;
  onAddTask: (columnId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <h2>{column.title}</h2>
        <div className="flex items-center">
          <span className="bg-secondary-foreground/10 text-secondary-foreground/50 text-xs rounded-full px-2 py-0.5 mr-2">
            {column.tasks.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onAddTask(column.id)}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 overflow-y-auto",
              snapshot.isDraggingOver ? "column-drop-active" : ""
            )}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={() => onEditTask(task.id)}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
