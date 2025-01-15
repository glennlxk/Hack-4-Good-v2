"use client";

import React, { useState } from "react";
import { useTasks} from "@/context/TaskContext";
import { Task } from "@/types/Task";
import TaskAdminCard from "./components/TaskAdminCard";
import AddEditTaskModal from "./components/AddEditTaskModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function AdminTasksPage() {
  const { tasks, addTask, editTask, deleteTask } = useTasks();

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const dailyTasks = tasks.filter((t) => t.type === "daily");
  const specialTasks = tasks.filter((t) => t.type === "special");

  const handleAddTask = () => {
    setCurrentTask(null);
    setShowAddEdit(true);
  };

  const handleSaveTask = (data: Omit<Task, "id">) => {
    if (currentTask) {
      // editing
      editTask(currentTask.id, data);
    } else {
      addTask(data);
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowAddEdit(true);
  };

  const handleDeleteTask = (task: Task) => {
    setCurrentTask(task);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (currentTask) {
      deleteTask(currentTask.id);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Tasks</h1>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded
                     hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* Daily Tasks */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Daily Tasks</h2>
        {dailyTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No daily tasks.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyTasks.map((task) => (
              <TaskAdminCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </section>

      {/* Special Tasks */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Special Tasks</h2>
        {specialTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No special tasks.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialTasks.map((task) => (
              <TaskAdminCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add/Edit Task Modal */}
      <AddEditTaskModal
        visible={showAddEdit}
        onClose={() => setShowAddEdit(false)}
        onSave={handleSaveTask}
        editData={currentTask || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={currentTask?.name}
      />
    </main>
  );
}
