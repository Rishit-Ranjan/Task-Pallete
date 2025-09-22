import React from 'react';
import { CalendarIcon, XIcon } from './Icons';
const UpcomingTasks = ({ tasks, onClose, onTaskClick, accentColor }) => {
    if (tasks.length === 0)
        return null;
    return (<div className="bg-slate-800/50 rounded-xl shadow-lg p-6 mb-6 border border-slate-700/50 animate-item-fade-in relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors z-10" aria-label="Hide upcoming tasks">
        <XIcon className="w-5 h-5"/>
      </button>
      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-white">
        <CalendarIcon className="w-5 h-5" style={{ color: accentColor }}/>
        <span>Upcoming Deadlines</span>
      </h3>
      <div className="flex -mx-2 space-x-4 overflow-x-auto pb-2 -mb-2" style={{ scrollbarWidth: 'none' }}>
        {tasks.map(task => {
            const dueDate = new Date(task.dueDate + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let relativeDate = '';
            if (diffDays === 0)
                relativeDate = 'Due Today';
            else if (diffDays === 1)
                relativeDate = 'Due Tomorrow';
            else
                relativeDate = `Due in ${diffDays} days`;
            return (<div key={task.id} onClick={() => onTaskClick(task.id)} className="flex-shrink-0 w-64 bg-slate-700/40 hover:bg-slate-700/70 p-4 rounded-lg cursor-pointer transition-colors border border-slate-600/50 first:ml-2 last:mr-2">
              <p className="font-medium text-slate-200 truncate">{task.title}</p>
              <p className={`text-sm mt-1 ${diffDays < 2 ? 'text-amber-400' : 'text-sky-400'}`}>{relativeDate}</p>
            </div>);
        })}
      </div>
    </div>);
};
export default UpcomingTasks;
