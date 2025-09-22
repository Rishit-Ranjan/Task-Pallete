import React, { useState, useEffect } from 'react';
import { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';
import { PlusIcon, TrashIcon } from './Icons';
const TodoModal = ({ isOpen, onClose, onSave, todoToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(Priority.MEDIUM);
    const [dueDate, setDueDate] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        if (isOpen) {
            if (todoToEdit) {
                setTitle(todoToEdit.title);
                setDescription(todoToEdit.description);
                setPriority(todoToEdit.priority);
                setDueDate(todoToEdit.dueDate || '');
                setChecklist(todoToEdit.checklist || []);
            }
            else {
                setTitle('');
                setDescription('');
                setPriority(Priority.MEDIUM);
                setDueDate('');
                setChecklist([]);
            }
            setError('');
        }
    }, [todoToEdit, isOpen]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title cannot be empty.');
            return;
        }
        onSave({
            id: todoToEdit?.id,
            title,
            description,
            priority,
            dueDate,
            checklist,
        });
        onClose();
    };
    const handleAddChecklistItem = () => {
        setChecklist([...checklist, { id: crypto.randomUUID(), text: '', completed: false }]);
    };
    const handleUpdateChecklistItem = (id, text) => {
        setChecklist(checklist.map(item => item.id === id ? { ...item, text } : item));
    };
    const handleDeleteChecklistItem = (id) => {
        setChecklist(checklist.filter(item => item.id !== id));
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-start z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 p-8 my-8 animate-modal-fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">{todoToEdit ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-2">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g., Finish project report"/>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-2">Description (Optional)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g., Draft, review, and submit the final version"/>
          </div>
          
          <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-400 mb-2">Due Date</label>
                <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
              </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-3">Priority</span>
            <div className="flex justify-between gap-3">
              {(Object.values(Priority)).map((p) => (<button type="button" key={p} onClick={() => setPriority(p)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${priority === p ? `ring-2 ${PRIORITY_CONFIG[p].ringColor.replace('ring-', '').replace('/20', '')} text-white` : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'}`}>
                  {PRIORITY_CONFIG[p].label}
                </button>))}
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-400 mb-3">Checklist</span>
            <div className="space-y-2">
                {checklist.map((item, index) => (<div key={item.id} className="flex items-center gap-2">
                         <input type="text" value={item.text} onChange={(e) => handleUpdateChecklistItem(item.id, e.target.value)} placeholder={`Checklist item ${index + 1}`} className="flex-grow bg-slate-800/80 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
                         <button type="button" onClick={() => handleDeleteChecklistItem(item.id)} className="p-2 text-slate-500 hover:text-red-400">
                             <TrashIcon className="w-4 h-4"/>
                         </button>
                    </div>))}
                <button type="button" onClick={handleAddChecklistItem} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium py-1">
                    <PlusIcon className="w-4 h-4"/>
                    Add item
                </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg text-slate-300 hover:bg-slate-800/80 transition-colors font-medium">Cancel</button>
            <button type="submit" className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500">
              {todoToEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
export default TodoModal;
