import React from 'react';
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/60 p-8 animate-modal-fade-in" onClick={(e) => e.stopPropagation()} role="document">
        <h2 id="confirmation-title" className="text-xl font-bold text-white mb-4">{title}</h2>
        <p className="text-slate-400 mb-8">{message}</p>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="py-2 px-5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-medium">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500">
            Delete
          </button>
        </div>
      </div>
    </div>);
};
export default ConfirmationModal;
