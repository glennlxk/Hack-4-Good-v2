"use client";

import React, { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/types/Task";
import TaskAdminCard from "./components/TaskAdminCard";
import AddEditTaskModal from "./components/AddEditTaskModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

// If you have an Application type:
import { Application, ApplicationStatus } from "@/context/TaskContext";
// or wherever you store it

export default function AdminTasksPage() {
  // Pull tasks, applications, plus methods from your context
  const {
    tasks,
    applications,         // <--- ensure your context provides this
    addTask,
    editTask,
    deleteTask,
    approveApplication,    // <--- for marking "completed"
    rejectApplication,     // <--- for marking "rejected"
  } = useTasks();

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Separate tasks by type
  const dailyTasks = tasks.filter((t) => t.type === "daily");
  const specialTasks = tasks.filter((t) => t.type === "special");

  // Filter applications
  const pendingRequests = applications.filter((app) => app.status === "pending");
  const archivedRequests = applications.filter(
    (app) => app.status === "completed" || app.status === "rejected"
  );

  // Add Task
  const handleAddTask = () => {
    setCurrentTask(null);
    setShowAddEdit(true);
  };

  // Save (Add or Edit)
  const handleSaveTask = (data: Omit<Task, "id">) => {
    if (currentTask) {
      // editing
      editTask(currentTask.id, data);
    } else {
      addTask(data);
    }
  };

  // Begin editing
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowAddEdit(true);
  };

  // Begin delete flow
  const handleDeleteTask = (task: Task) => {
    setCurrentTask(task);
    setShowDelete(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (currentTask) {
      deleteTask(currentTask.id);
    }
  };

  // Approve a pending request
  const handleApprove = (applicationId: string) => {
    approveApplication(applicationId);
  };

  // Reject a pending request
  const handleReject = (applicationId: string) => {
    rejectApplication(applicationId);
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Tasks</h1>
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
              // Optionally find the associated task to display info:
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
