import React, { useState } from 'react';
import { suggestTasks } from '../services/localAIService';
import { SparklesIcon } from './Icons';
const SuggestModal = ({ isOpen, onClose, onAddTasks }) => {
    const [goal, setGoal] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleGenerate = async () => {
        if (!goal.trim()) {
            setError('Please enter a goal.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSuggestions([]);
        setSelectedTasks([]);
        try {
            const tasks = await suggestTasks(goal);
            setSuggestions(tasks);
            setSelectedTasks(tasks); // Pre-select all suggestions
        }
        catch (e) {
            setError(e.message || 'An unknown error occurred.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleToggleSelection = (task) => {
        setSelectedTasks(prev => prev.some(t => t.title === task.title) ? prev.filter(t => t.title !== task.title) : [...prev, task]);
    };
    const handleAddSelected = () => {
        onAddTasks(selectedTasks);
        onClose();
    };
    const handleClose = () => {
        setGoal('');
        setSuggestions([]);
        setSelectedTasks([]);
        setError('');
        setIsLoading(false);
        onClose();
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4" onClick={handleClose}>
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 p-8 flex flex-col animate-modal-fade-in" style={{ maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <SparklesIcon className="text-indigo-400 w-7 h-7"/>
            AI Task Suggester
        </h2>
        <p className="text-slate-400 mb-6">Describe a goal, and we'll generate tasks for you.</p>

        <div className="flex gap-3 mb-4">
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Plan a birthday party" className="flex-grow bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" disabled={isLoading} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}/>
            <button onClick={handleGenerate} disabled={isLoading} className="py-2 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center disabled:bg-indigo-800 disabled:cursor-not-allowed">
                {isLoading ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'Generate'}
            </button>
        </div>
        
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        
        <div className="flex-grow overflow-y-auto -mr-4 pr-4 space-y-3 mb-6">
            {suggestions.map((task, index) => (<div key={index} className="flex items-start gap-4 bg-slate-800/50 p-3 rounded-lg">
                    <input type="checkbox" id={`task-${index}`} checked={selectedTasks.some(t => t.title === task.title)} onChange={() => handleToggleSelection(task)} className="h-5 w-5 mt-0.5 rounded-md bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-600 cursor-pointer flex-shrink-0"/>
                    <label htmlFor={`task-${index}`} className="flex-grow cursor-pointer">
                        <p className="font-medium text-slate-200">{task.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{task.description}</p>
                    </label>
                </div>))}
        </div>
        
        {suggestions.length > 0 &&
            <div className="flex justify-end gap-4 mt-auto pt-4 border-t border-slate-700/50">
                <button onClick={handleClose} className="py-2 px-4 rounded-lg text-slate-300 hover:bg-slate-800/80 transition-colors font-medium">Cancel</button>
                <button onClick={handleAddSelected} disabled={selectedTasks.length === 0} className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors">
                    Add {selectedTasks.length} Task{selectedTasks.length !== 1 && 's'}
                </button>
            </div>}
      </div>
    </div>);
};
export default SuggestModal;
