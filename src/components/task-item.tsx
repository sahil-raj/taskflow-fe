"use client";

import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { FaPencil, FaTrash, FaCheck, FaX } from "react-icons/fa6";
import { TaskItemProps } from "@/app/types/taskItemProps";

export function TaskItem({
  task,
  onDelete,
  onUpdate,
  onToggle,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSave = () => {
    if (editedName.trim()) {
      onUpdate(task.id, editedName, editedDescription);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(task.name);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-black text-white border-2 rounded-lg group">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="h-5 w-5 border-2 border-yellow-400 rounded-md cursor-pointer"
        />

        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Task name"
              className="flex-1 border-white !border-2 !focus:border-white"
              autoFocus
              color="gray.100"
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Task description"
              className="min-h-[80px] border-white !border-2 !focus:border-white"
              color="gray.100"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <FaX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <FaCheck className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium ${
                  task.completed ? "line-through text-yellow-400" : "text-white"
                }`}
              >
                {task.name}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <FaPencil className="h-4 w-4 text-yellow-400" />
                </Button>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                >
                  <FaTrash className="h-4 w-4 text-yellow-400" />
                </Button>
              </div>
            </div>
            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "line-through text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
