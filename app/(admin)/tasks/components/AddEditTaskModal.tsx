"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Task, TaskType } from "@/types/Task";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<Task, "id">) => void;
  editData?: Task;
}

export default function AddEditTaskModal({
  visible,
  onClose,
  onSave,
  editData,
}: ModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>("daily");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(0);
  const [quota, setQuota] = useState(0);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setDescription(editData.description);
      setType(editData.type);
      setDueDate(editData.dueDate || "");
      setPoints(editData.points);
      setQuota(editData.quota);
    } else {
      // Clear if adding new
      setName("");
      setDescription("");
      setType("daily");
      setDueDate("");
      setPoints(0);
      setQuota(0);
    }
  }, [editData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      type,
      dueDate: type === "special" ? dueDate : undefined,
      points,
      quota,
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-6 w-full max-w-md mx-auto shadow-xl animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              className="border w-full rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="border w-full rounded p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Type</label>
            <select
              className="border w-full rounded p-2"
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
            >
              <option value="daily">Daily</option>
              <option value="special">Special</option>
            </select>
          </div>
          {type === "special" && (
            <div>
              <label className="block font-medium">Due Date</label>
              <input
                type="date"
                className="border w-full rounded p-2"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium">Points</label>
              <input
                type="number"
                className="border w-full rounded p-2"
                value={points}
                onChange={(e) => setPoints(+e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">Quota</label>
              <input
                type="number"
                className="border w-full rounded p-2"
                value={quota}
                onChange={(e) => setQuota(+e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border rounded px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
