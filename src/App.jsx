import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Priority } from './types';
import TodoItem from './components/TodoItem';
import TodoModal from './components/TodoModal';
import SuggestModal from './components/SuggestModal';
import ConfirmationModal from './components/ConfirmationModal';
import UpcomingTasks from './components/UpcomingTasks';
import ToggleSwitch from './components/ToggleSwitch';
import { PlusIcon, PaletteIcon, FilterIcon, ClipboardListIcon, SparklesIcon, SearchIcon, XIcon } from './components/Icons';
export default function TodoApp() {
    const [tasks, setTasks] = useLocalStorage('todos-v2', []);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [isTodoModalOpen, setTodoModalOpen] = useState(false);
    const [isSuggestModalOpen, setSuggestModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);
    const [filterPriority, setFilterPriority] = useState('all');
    const [showCompleted, setShowCompleted] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showUpcoming, setShowUpcoming] = useLocalStorage('show-upcoming-tasks', true);
    const [settings, setSettings] = useLocalStorage('app-settings', {
        fontFamily: 'Inter',
        textColor: '#e2e8f0', // slate-200
        accentColor: '#6366f1' // indigo-500
    });
    const fontOptions = ['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat'];
    const colorOptions = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    useEffect(() => {
        document.body.style.color = settings.textColor;
        document.body.style.fontFamily = settings.fontFamily;
    }, [settings]);
    const handleSaveTask = (taskData) => {
        if (taskData.id) { // Update existing task
            setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
        }
        else { // Add new task
            const newTask = {
                id: crypto.randomUUID(),
                title: taskData.title,
                description: taskData.description,
                completed: false,
                important: false,
                priority: taskData.priority,
                dueDate: taskData.dueDate || '',
                createdAt: new Date().toISOString(),
                checklist: taskData.checklist || [],
            };
            setTasks([newTask, ...tasks]);
        }
    };
    const handleAddSuggestedTasks = (suggestedTasks) => {
        const newTasks = suggestedTasks.map(st => ({
            id: crypto.randomUUID(),
            title: st.title,
            description: st.description,
            completed: false,
            important: false,
            priority: Priority.MEDIUM,
            dueDate: '',
            createdAt: new Date().toISOString(),
        }));
        setTasks([...newTasks, ...tasks]);
    };
    const handleRequestDelete = (id) => {
        setTaskToDeleteId(id);
        setConfirmModalOpen(true);
    };
    const handleConfirmDelete = () => {
        if (!taskToDeleteId)
            return;
        setTasks(tasks.filter(task => task.id !== taskToDeleteId));
        setTaskToDeleteId(null);
        setConfirmModalOpen(false);
    };
    const handleCancelDelete = () => {
        setTaskToDeleteId(null);
        setConfirmModalOpen(false);
    };
    const toggleComplete = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };
    const toggleImportant = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, important: !task.important } : task));
    };
    const toggleChecklistItem = (taskId, itemId) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    checklist: (task.checklist || []).map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
                };
            }
            return task;
        }));
    };
    const shareTask = async (task) => {
        const checklistText = (task.checklist || []).length > 0
            ? `\n✅ Checklist:\n${(task.checklist || []).map(item => `${item.completed ? '☑' : '☐'} ${item.text}`).join('\n')}`
            : '';
        const shareText = `📝 ${task.title}\n${task.description ? `📋 ${task.description}\n` : ''}🚩 Priority: ${task.priority}\n${task.dueDate ? `📅 Due: ${new Date(task.dueDate).toLocaleDateString()}\n` : ''}${checklistText}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Task: ${task.title}`, text: shareText });
            }
            catch (err) {
                console.error("Share failed:", err);
            }
        }
        else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Task copied to clipboard!');
            });
        }
    };
    const handleOpenEditModal = (task) => {
        setTaskToEdit(task);
        setTodoModalOpen(true);
    };
    const handleOpenAddModal = () => {
        setTaskToEdit(null);
        setTodoModalOpen(true);
    };
    const handleTaskClick = (taskId) => {
        const element = document.getElementById(`task-${taskId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-offset-2', 'transition-shadow', 'duration-1000');
            element.style.borderColor = settings.accentColor;
            element.style.boxShadow = `0 0 15px ${settings.accentColor}`;
            element.style.setProperty('--tw-ring-color', settings.accentColor);
            element.style.setProperty('--tw-ring-offset-color', '#0d1117');
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-offset-2');
                element.style.borderColor = '';
                element.style.boxShadow = '';
            }, 2500);
        }
    };
    const filteredTasks = useMemo(() => tasks.filter(task => {
        if (!showCompleted && task.completed)
            return false;
        if (filterPriority !== 'all' && task.priority !== filterPriority)
            return false;
        if (searchQuery.trim()) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const titleMatch = task.title.toLowerCase().includes(lowerCaseQuery);
            const descriptionMatch = task.description.toLowerCase().includes(lowerCaseQuery);
            if (!titleMatch && !descriptionMatch)
                return false;
        }
        return true;
    }), [tasks, showCompleted, filterPriority, searchQuery]);
    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            if (a.important !== b.important)
                return a.important ? -1 : 1;
            if (a.completed !== b.completed)
                return a.completed ? 1 : -1;
            const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [filteredTasks]);
    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return tasks
            .filter(task => {
            if (task.completed || !task.dueDate)
                return false;
            const dueDate = new Date(task.dueDate + 'T00:00:00');
            return dueDate >= today && dueDate < sevenDaysFromNow;
        })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [tasks]);
    const stats = useMemo(() => ({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
        highPriority: tasks.filter(t => t.priority === Priority.HIGH && !t.completed).length,
    }), [tasks]);
    return (<div className="min-h-screen transition-all duration-300">
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: settings.accentColor }}>
                TaskPalette
              </h1>
              <p className="text-slate-400 mt-1">Craft your perfect workflow</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setSuggestModalOpen(true)} className="px-4 py-2 rounded-lg bg-slate-700/80 text-white font-medium flex items-center space-x-2 hover:bg-slate-700 transition-colors">
                <SparklesIcon className="w-5 h-5 text-indigo-400"/>
                <span>Suggest with AI</span>
              </button>
              <button onClick={handleOpenAddModal} className="px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: settings.accentColor }}>
                <PlusIcon className="w-5 h-5"/>
                <span>Add Task</span>
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 transition-colors text-slate-300">
                <PaletteIcon className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {showUpcoming && (<UpcomingTasks tasks={upcomingTasks} onClose={() => setShowUpcoming(false)} onTaskClick={handleTaskClick} accentColor={settings.accentColor}/>)}
        
        {showSettings && (<div className="bg-slate-800/50 rounded-xl shadow-lg p-6 mb-6 border border-slate-700/50 animate-item-fade-in">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
              <PaletteIcon className="w-5 h-5"/>
              <span>Customize Appearance</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">Font Family</label>
                <select value={settings.fontFamily} onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-700 border-slate-600 text-white">
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => <button key={color} onClick={() => setSettings({ ...settings, accentColor: color })} className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110" style={{ backgroundColor: color, borderColor: settings.accentColor === color ? '#fff' : 'transparent' }}/>)}
                </div>
              </div>
            </div>
          </div>)}

        <div className="bg-slate-800/50 rounded-xl shadow-lg p-4 mb-6 border border-slate-700/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className='flex flex-wrap items-center gap-4 flex-grow'>
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-4 h-4 text-slate-500"/>
                    </div>
                    <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-lg py-1.5 pl-9 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" aria-label="Search tasks"/>
                    {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors" aria-label="Clear search">
                        <XIcon className="w-4 h-4"/>
                      </button>)}
                </div>
                <div className="flex items-center space-x-2">
                  <FilterIcon className="w-4 h-4 text-slate-500"/>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-1 border rounded-lg text-sm bg-slate-700 border-slate-600 text-slate-200">
                    <option value="all">All Priorities</option>
                    <option value={Priority.HIGH}>High</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.LOW}>Low</option>
                  </select>
                </div>
                <ToggleSwitch id="show-completed" checked={showCompleted} onChange={setShowCompleted} label="Show Completed" accentColor={settings.accentColor}/>
            </div>
            <div className="text-sm text-slate-400">
              {sortedTasks.length} of {tasks.length} tasks showing
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedTasks.length === 0 ? (<div className="text-center py-16 px-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl">
              <ClipboardListIcon className="w-12 h-12 mx-auto text-slate-500"/>
              <h3 className="text-xl font-semibold text-slate-300 mt-4">
                {tasks.length === 0 ? 'Your list is empty!' : 'No tasks match your filters'}
              </h3>
              <p className="text-slate-400 mt-2">
                 {tasks.length === 0 ? 'Click "Add Task" to get started.' : 'Try adjusting your filters or suggesting tasks with AI.'}
              </p>
            </div>) : (sortedTasks.map(task => (<TodoItem key={task.id} todo={task} onToggleComplete={toggleComplete} onDelete={handleRequestDelete} onEdit={handleOpenEditModal} onToggleImportant={toggleImportant} onShare={shareTask} onToggleChecklistItem={toggleChecklistItem}/>)))}
        </div>

        {tasks.length > 0 && (<div className="mt-8 bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center"><div className="text-2xl font-bold" style={{ color: settings.accentColor }}>{stats.total}</div><div className="text-sm text-slate-400">Total Tasks</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-emerald-400">{stats.completed}</div><div className="text-sm text-slate-400">Completed</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-amber-400">{stats.pending}</div><div className="text-sm text-slate-400">Pending</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-red-400">{stats.highPriority}</div><div className="text-sm text-slate-400">High Priority</div></div>
            </div>
          </div>)}
      </main>

      <TodoModal isOpen={isTodoModalOpen} onClose={() => setTodoModalOpen(false)} onSave={handleSaveTask} todoToEdit={taskToEdit}/>
      <SuggestModal isOpen={isSuggestModalOpen} onClose={() => setSuggestModalOpen(false)} onAddTasks={handleAddSuggestedTasks}/>
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} title="Confirm Deletion" message="Are you sure you want to permanently delete this task? This action cannot be undone."/>
    </div>);
}
