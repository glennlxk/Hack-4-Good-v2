"use client";

import React from "react";

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-6 w-full max-w-sm mx-auto shadow-xl animate-fadeIn">
        <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{itemName}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border rounded px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
