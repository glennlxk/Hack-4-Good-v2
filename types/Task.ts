export type TaskType = "daily" | "special";

export interface Task {
  id: string;
  name: string;
  description: string;
  type: TaskType;        // "daily" or "special"
  dueDate?: string;      // Only for special tasks
  points: number;
  quota: number;
}
