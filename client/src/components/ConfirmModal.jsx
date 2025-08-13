import React from "react";
const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center p-4 justify-center bg-blue-50/30">
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirmation
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 flex-1 rounded-md bg-red-600 hover:bg-reds-700 text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
