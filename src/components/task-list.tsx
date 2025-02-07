import { useState, useEffect } from "react";
import { Task } from "@/app/types/task";
import { TaskItem } from "./task-item";
import { Input, Textarea, Button, Skeleton, Stack } from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch tasks from API when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          "https://taskflow-6z22.onrender.com/api/tasks/user_id/2"
        );

        // Map the response to match Task interface
        const fetchedTasks: Task[] = response.data.map((task: any) => ({
          id: task.id,
          name: task.task_name,
          description: task.task_desc,
          completed: task.status,
          createdAt: new Date(task.created_at),
        }));

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Set loading to false once the fetching is complete
      }
    };

    fetchTasks();
  }, []);

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        name: newTaskName,
        description: newTaskDescription,
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskName("");
      setNewTaskDescription("");
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, newName: string, newDescription: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, name: newName, description: newDescription }
          : task
      )
    );
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-3">
        <Input
          placeholder="Task name..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full"
          borderColor="white" // White border color
          focusBorderColor="white" // White border color when focused
        />
        <Textarea
          placeholder="Task description... (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[80px]"
          borderColor="white" // White border color
          focusBorderColor="white" // White border color when focused
        />
        <Button onClick={addTask} className="w-full">
          <FaPlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <Stack spacing={4}>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
          </Stack>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onToggle={toggleTask}
            />
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
          completed
        </div>
      )}
    </div>
  );
}
