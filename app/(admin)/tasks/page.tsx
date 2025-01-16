"use client";

import React, { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/types/Task";
import TaskAdminCard from "./components/TaskAdminCard";
import AddEditTaskModal from "./components/AddEditTaskModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

// If you have an Application type:
import { Application } from "@/context/TaskContext";

export default function AdminTasksPage() {
  // Pull tasks, applications, plus methods from your context
  const {
    tasks,
    applications,
    addTask,
    editTask,
    deleteTask,
    approveApplication,
    rejectApplication,
  } = useTasks();

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // --- Sorting State ---
  const [sortMode, setSortMode] = useState<"none" | "date" | "points">("none");

  // Helper to sort tasks based on the selected mode
  function sortTasks(taskArr: Task[]): Task[] {
    // Make a copy so we don’t mutate original
    const copy = [...taskArr];
    switch (sortMode) {
      case "date":
        // Sort by dueDate ascending; treat missing dueDate as 0
        return copy.sort((a, b) => {
          const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return aTime - bTime;
        });
      case "points":
        // Sort by points descending
        return copy.sort((a, b) => b.points - a.points);
      default:
        // "none" = no sorting
        return taskArr;
    }
  }

  // Filter tasks by type
  const dailyTasksUnsorted = tasks.filter((t) => t.type === "daily");
  const specialTasksUnsorted = tasks.filter((t) => t.type === "special");

  // Sort them
  const dailyTasks = sortTasks(dailyTasksUnsorted);
  const specialTasks = sortTasks(specialTasksUnsorted);

  // Filter applications for “pending” vs. “archived”
  const pendingRequests = applications.filter((app) => app.status === "pending");
  const archivedRequests = applications.filter(
    (app) => app.status === "completed" || app.status === "rejected"
  );

  // --- Task CRUD logic ---
  const handleAddTask = () => {
    setCurrentTask(null);
    setShowAddEdit(true);
  };

  const handleSaveTask = (data: Omit<Task, "id">) => {
    if (currentTask) {
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

  // --- Application Approve/Reject ---
  const handleApprove = (applicationId: string) => {
    approveApplication(applicationId);
  };
  const handleReject = (applicationId: string) => {
    rejectApplication(applicationId);
  };

  return (
    <main className="p-6">
      {/* Top bar: Page title and Add Task button */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Tasks</h1>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Sort by:</label>
          <select
            value={sortMode}
            onChange={(e) =>
              setSortMode(e.target.value as "none" | "date" | "points")
            }
            className="p-1 border rounded"
          >
            <option value="none">None</option>
            <option value="date">Date</option>
            <option value="points">Points</option>
          </select>
        </div>

        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* ----- Daily Tasks ----- */}
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

      {/* ----- Special Tasks ----- */}
      <section className="mb-8">
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

      {/* ----- Pending Requests ----- */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-gray-500">No pending requests.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingRequests.map((app) => {
              const associatedTask = tasks.find((t) => t.id === app.taskId);
              return (
                <div
                  key={app.id}
                  className="border rounded p-4 bg-white shadow flex flex-col"
                >
                  <h3 className="font-semibold mb-1">Pending Request</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User ID:</span> {app.userId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Task:</span>{" "}
                    {associatedTask ? associatedTask.name : app.taskId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {app.status}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ----- Archives (Completed or Rejected) ----- */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Archives</h2>
        {archivedRequests.length === 0 ? (
          <p className="text-sm text-gray-500">No archives.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedRequests.map((app) => {
              const associatedTask = tasks.find((t) => t.id === app.taskId);
              return (
                <div
                  key={app.id}
                  className="border rounded p-4 bg-gray-100 shadow flex flex-col"
                >
                  <h3 className="font-semibold mb-1">Archived Request</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User ID:</span> {app.userId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Task:</span>{" "}
                    {associatedTask ? associatedTask.name : app.taskId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {app.status}
                  </p>
                  {app.status === "completed" && (
                    <p className="text-sm text-gray-600">
                      Points Awarded: {app.pointsAwarded}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ----- Add/Edit Task Modal ----- */}
      <AddEditTaskModal
        visible={showAddEdit}
        onClose={() => setShowAddEdit(false)}
        onSave={handleSaveTask}
        editData={currentTask || undefined}
      />

      {/* ----- Delete Confirmation Modal ----- */}
      <DeleteConfirmModal
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={currentTask?.name}
      />
    </main>
  );
}
