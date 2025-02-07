import { Task } from "./task";
export interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    newName: string,
    newDescription: string
  ) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  isUpdating: boolean; // Add this property
}
