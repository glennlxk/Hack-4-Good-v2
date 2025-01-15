"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";

// ---------- Types ---------- //

export type TaskType = "daily" | "special";

export interface Task {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  dueDate?: string;  // Only for special tasks
  points: number;
  quota: number;
}

// Tracks when a user (e.g., with userId) applies for a task
export type ApplicationStatus = "pending" | "completed" | "rejected";

export interface Application {
  id: string;
  taskId: string;
  userId: string;       // or email, or however you identify users
  status: ApplicationStatus;
  pointsAwarded: number; // so we know how many points they got on completion
}

// ---------- Context Interface ---------- //

interface TaskContextType {
  tasks: Task[];
  applications: Application[];

  // Task CRUD
  addTask: (data: Omit<Task, "id">) => void;
  editTask: (id: string, data: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;

  // Applications
  applyForTask: (taskId: string, userId: string) => void;
  approveApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
}

// ---------- Context & Provider ---------- //

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  // Example: initial tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-daily-1",
      name: "Clear the trash",
      description: "Remove trash from the hallway.",
      type: "daily",
      points: 10,
      quota: 5,
    },
    {
      id: "task-special-1",
      name: "Design event poster",
      description: "Create a poster for the upcoming event.",
      type: "special",
      dueDate: "2025-01-30",
      points: 50,
      quota: 2,
    },
  ]);

  // Store applications in memory
  const [applications, setApplications] = useState<Application[]>([]);

  // 1) Task CRUD
  const addTask = (data: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...data, id: uuidv4() }]);
  };

  const editTask = (id: string, data: Omit<Task, "id">) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Optionally also remove any associated pending applications
    setApplications((prev) => prev.filter((app) => app.taskId !== id));
  };

  // 2) Applications
  const applyForTask = (taskId: string, userId: string) => {
    // Decrement the quota (as user is applying)
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.quota > 0) {
          return { ...task, quota: task.quota - 1 };
        }
        return task;
      })
    );

    // Create an application with status "pending"
    const newApp: Application = {
      id: uuidv4(),
      taskId,
      userId,
      status: "pending",
      pointsAwarded: 0,
    };
    setApplications((prev) => [...prev, newApp]);
  };

  const approveApplication = (applicationId: string) => {
    setApplications((prevApps) =>
      prevApps.map((app) => {
        if (app.id === applicationId) {
          // Mark as completed, award points
          const theTask = tasks.find((t) => t.id === app.taskId);
          const awarded = theTask ? theTask.points : 0;

          return {
            ...app,
            status: "completed",
            pointsAwarded: awarded,
          };
        }
        return app;
      })
    );
    // Optionally, you can track user points in a user database
  };

  const rejectApplication = (applicationId: string) => {
    // Revert the quota for the associated task
    let rejectedTaskId = "";
    setApplications((prevApps) =>
      prevApps.map((app) => {
        if (app.id === applicationId) {
          rejectedTaskId = app.taskId;
          return { ...app, status: "rejected" };
        }
        return app;
      })
    );

    // Increase the task's quota by 1 (since the application was rejected)
    if (rejectedTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === rejectedTaskId
            ? { ...task, quota: task.quota + 1 }
            : task
        )
      );
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        applications,
        addTask,
        editTask,
        deleteTask,
        applyForTask,
        approveApplication,
        rejectApplication,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return context;
}
