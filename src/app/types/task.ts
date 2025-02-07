export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export interface ApiTaskResponse {
  id: string;
  task_name: string;
  task_desc: string;
  status: boolean;
  created_at: string;
}
