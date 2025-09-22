import React from 'react';
import { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';
import { TrashIcon, EditIcon, StarIcon, CheckIcon, CalendarIcon, FlagIcon, ShareIcon, ClockIcon } from './Icons';
const getDueDateStatus = (dueDateString) => {
    if (!dueDateString)
        return 'none';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Handles YYYY-MM-DD format from <input type="date"> by setting it to local midnight
    const dueDate = new Date(dueDateString + 'T00:00:00');
    if (dueDate.getTime() < today.getTime())
        return 'overdue';
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = dueDate.getTime() - today.getTime();
    if (diffTime < oneDay)
        return 'today';
    if (diffTime < oneDay * 2)
        return 'tomorrow';
    return 'upcoming';
};
const TodoItem = ({ todo, onToggleComplete, onDelete, onEdit, onToggleImportant, onShare, onToggleChecklistItem }) => {
    const priorityConfig = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG[Priority.LOW];
    const dueDateStatus = todo.completed ? 'none' : getDueDateStatus(todo.dueDate);
    const isImportantAndNotCompleted = todo.important && !todo.completed;
    const dueDateBadgeStyles = {
        overdue: 'bg-red-500/10 text-red-400 ring-red-500/20',
        today: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
        tomorrow: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
        upcoming: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
        none: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
    };
    const itemBorderStyles = {
        overdue: 'border-red-600/30 hover:border-red-500/60',
        today: 'border-amber-600/30 hover:border-amber-500/60',
        tomorrow: 'border-slate-700/70 hover:border-slate-600',
        upcoming: 'border-slate-700/70 hover:border-slate-600',
        none: 'border-slate-700/70 hover:border-slate-600',
    };
    const renderDueDateText = () => {
        if (!todo.dueDate)
            return null;
        const date = new Date(todo.dueDate + 'T00:00:00');
        const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (todo.completed)
            return formattedDate;
        switch (dueDateStatus) {
            case 'overdue': return `Overdue: ${formattedDate}`;
            case 'today': return 'Today';
            case 'tomorrow': return 'Tomorrow';
            default: return formattedDate;
        }
    };
    return (<div id={`task-${todo.id}`} className={`group rounded-xl border transition-all duration-300 animate-item-fade-in ${todo.completed
            ? 'border-slate-800 bg-slate-900/30'
            : `bg-slate-800/40 ${isImportantAndNotCompleted ? 'border-amber-500/40 hover:border-amber-500/70' : itemBorderStyles[dueDateStatus]}`}`}>
      <div className="p-4 flex items-start gap-4">
        <button onClick={() => onToggleComplete(todo.id)} className={`w-6 h-6 mt-1 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'bg-transparent border-slate-600 group-hover:border-indigo-500'}`} aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}>
          <div className={`transition-transform duration-200 ease-in-out ${todo.completed ? 'scale-100' : 'scale-0'}`}>
              {todo.completed && <CheckIcon className="w-4 h-4 text-white"/>}
          </div>
        </button>

        <div className="flex-grow">
          <p className={`font-semibold text-lg transition-colors duration-300 ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
              {todo.title}
          </p>
          {todo.description && (<p className={`text-sm mt-1 transition-colors duration-300 ${todo.completed ? 'text-slate-600' : 'text-slate-400'}`}>
              {todo.description}
            </p>)}
           <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 flex items-center gap-1.5 ${priorityConfig.color} ${priorityConfig.ringColor} ${todo.completed ? 'opacity-40' : 'opacity-100'}`}>
                  <FlagIcon className="w-3 h-3"/>
                  {priorityConfig.label}
              </span>
              {todo.dueDate && (<span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 flex items-center gap-1.5 ${dueDateBadgeStyles[todo.completed ? 'none' : dueDateStatus]} ${todo.completed ? 'opacity-40' : 'opacity-100'}`}>
                      <CalendarIcon className="w-3 h-3"/>
                      {renderDueDateText()}
                  </span>)}
               <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 flex items-center gap-1.5 bg-slate-500/10 text-slate-400 ring-slate-500/20 ${todo.completed ? 'opacity-40' : 'opacity-100'}`}>
                  <ClockIcon className="w-3 h-3"/>
                  {new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 text-slate-500 mt-1">
          <button onClick={() => onToggleImportant(todo.id)} aria-label={todo.important ? "Mark as not important" : "Mark as important"}>
            <StarIcon className={`w-5 h-5 transition-all duration-300 ${todo.important ? 'fill-amber-400 text-amber-400' : 'hover:text-amber-400'}`}/>
          </button>
          <button onClick={() => onShare(todo)} className="hover:text-sky-400 transition-colors duration-300 opacity-0 group-hover:opacity-100" aria-label="Share task">
            <ShareIcon className="w-5 h-5"/>
          </button>
          <button onClick={() => onEdit(todo)} className="hover:text-sky-400 transition-colors duration-300 opacity-0 group-hover:opacity-100" aria-label="Edit task">
            <EditIcon className="w-5 h-5"/>
          </button>
          <button onClick={() => onDelete(todo.id)} className="hover:text-red-400 transition-colors duration-300 opacity-0 group-hover:opacity-100" aria-label="Delete task">
            <TrashIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
      {todo.checklist && todo.checklist.length > 0 && (<div className="pb-4 px-4 pl-14">
            <div className="space-y-2">
                {todo.checklist.map(item => (<div key={item.id} className="flex items-center gap-3 group/checklist">
                        <button onClick={() => onToggleChecklistItem(todo.id, item.id)} className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all duration-200 ${item.completed
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'bg-transparent border-slate-600 group-hover/checklist:border-indigo-500'}`}>
                           {item.completed && <CheckIcon className="w-2.5 h-2.5 text-white"/>}
                        </button>
                        <span className={`text-sm ${item.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                            {item.text}
                        </span>
                    </div>))}
            </div>
        </div>)}
    </div>);
};
export default TodoItem;
