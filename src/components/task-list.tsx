import { useState, useEffect } from "react";
import { Task, ApiTaskResponse } from "@/app/types/task";
import { TaskItem } from "./task-item";
import {
  Input,
  Textarea,
  Button,
  Stack,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for fetching tasks
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null); // ID of the task being updated

  // Fetch tasks from API when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          "https://taskflow-6z22.onrender.com/api/tasks/user_id/2"
        );

        // Map the response to match Task interface
        const fetchedTasks: Task[] = response.data.map(
          (task: ApiTaskResponse) => ({
            id: task.id,
            name: task.task_name,
            description: task.task_desc,
            completed: task.status,
            createdAt: new Date(task.created_at),
          })
        );

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Set loading to false once the fetching is complete
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTaskName.trim()) {
      const newTaskData = {
        task_name: newTaskName,
        user_id: 2, // You can replace with the actual user ID dynamically if needed
        task_desc: newTaskDescription,
        status: false, // Initially false (not completed)
      };

      try {
        // Send POST request to the API
        const response = await axios.post(
          "https://taskflow-6z22.onrender.com/api/tasks/",
          newTaskData
        );

        // After successful addition, update the state with the new task
        setTasks([
          ...tasks,
          {
            id: response.data.id, // Assuming the response contains the newly added task's ID
            name: newTaskName,
            description: newTaskDescription,
            completed: false, // Newly added task is not completed
            createdAt: new Date(),
          },
        ]);

        setNewTaskName("");
        setNewTaskDescription("");

        // Alert for task addition
        alert("Task added successfully!");
      } catch (error) {
        console.error("Error adding task:", error);
        alert("Error adding task!");
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      await axios.delete(
        `https://taskflow-6z22.onrender.com/api/tasks/id/${id}`
      );
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task!");
    }
  };

  const updateTask = async (
    id: string,
    newName: string,
    newDescription: string
  ) => {
    setUpdatingTaskId(id); // Set task ID as updating
    const updatedTaskData = {
      task_name: newName,
      user_id: 2, // Replace with dynamic user ID if necessary
      task_desc: newDescription,
      status: false, // Keeping it false for now, you can modify this for dynamic status
    };

    try {
      const response = await axios.put(
        `https://taskflow-6z22.onrender.com/api/tasks/id/${id}`,
        updatedTaskData
      );

      if (response.status === 200) {
        setTasks(
          tasks.map((task) =>
            task.id === id
              ? { ...task, name: newName, description: newDescription }
              : task
          )
        );
        alert("Task updated successfully!");
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task!");
    } finally {
      setUpdatingTaskId(null); // Reset the updating task ID
    }
  };

  const toggleTask = async (id: string) => {
    setUpdatingTaskId(id); // Set task ID as updating
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      const updatedTaskData = {
        task_name: taskToUpdate.name,
        user_id: 2,
        task_desc: taskToUpdate.description,
        status: !taskToUpdate.completed,
      };

      try {
        const response = await axios.put(
          `https://taskflow-6z22.onrender.com/api/tasks/id/${id}`,
          updatedTaskData
        );

        if (response.status === 200) {
          setTasks(
            tasks.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
            )
          );
          alert("Task status updated successfully!");
        } else {
          console.error("Failed to update task status");
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        alert("Error updating task status!");
      } finally {
        setUpdatingTaskId(null); // Reset the updating task ID
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="xl" color="white" />
        </div>
      )}

      <div className="space-y-3">
        <Input
          placeholder="Task name..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border-white !border-2 !focus:border-white"
        />
        <Textarea
          placeholder="Task description... (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[80px] border-white !border-2 !focus:border-white"
        />
        <Button
          onClick={addTask}
          className="w-full !border-white !focus:border-white"
        >
          <FaPlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <Stack>
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
              isUpdating={updatingTaskId === task.id} // Check if this task is being updated
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
