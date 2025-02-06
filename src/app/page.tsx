"use client";
import { TaskList } from "@/components/task-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Task Manager</h1>
        <TaskList />
      </div>
    </main>
  );
}
