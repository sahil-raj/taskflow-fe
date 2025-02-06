"use client";

import { useState } from "react";
import { Task } from "@/app/types/task";
import { TaskItem } from "./task-item";
import { Input } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

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
        />
        <Textarea
          placeholder="Task description... (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[80px]"
        />
        <Button onClick={addTask} className="w-full">
          <FaPlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
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
