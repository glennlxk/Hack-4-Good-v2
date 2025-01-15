"use client";

import { Task } from "@/types/Task";

interface TaskAdminCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskAdminCard({
  task,
  onEdit,
  onDelete,
}: TaskAdminCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow
                 p-4 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        <p className="mt-2">
          <span className="text-gray-700 font-medium">Type:</span> {task.type}
        </p>
        {task.type === "special" && task.dueDate && (
          <p>
            <span className="text-gray-700 font-medium">Due Date:</span>{" "}
            {task.dueDate}
          </p>
        )}
        <p>
          <span className="text-gray-700 font-medium">Points:</span> {task.points}
        </p>
        <p>
          <span className="text-gray-700 font-medium">Quota:</span> {task.quota}
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-blue-600 text-white py-2 rounded text-sm
                     hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="flex-1 bg-red-500 text-white py-2 rounded text-sm
                     hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
