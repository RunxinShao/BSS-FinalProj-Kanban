
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '@/types/kanban';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Trash2,
  Edit
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'low':
      return 'bg-kanban-green text-green-700';
    case 'medium':
      return 'bg-kanban-yellow text-yellow-700';
    case 'high':
      return 'bg-kanban-orange text-orange-700';
    default:
      return 'bg-kanban-blue text-blue-700';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn("mb-3", snapshot.isDragging ? "task-dragging" : "")}
        >
          <Card className="task-card border">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-left">{task.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary">
                    <MoreVertical size={15} className="text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit size={14} className="mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-2 text-sm text-gray-500 text-left">
              {task.description.length > 100
                ? `${task.description.substring(0, 100)}...`
                : task.description}
            </div>
            
            <div className="flex justify-between mt-3 items-center">
              <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
              <span className="text-xs text-gray-400">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
