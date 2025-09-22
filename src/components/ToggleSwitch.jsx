import React from 'react';
const ToggleSwitch = ({ id, checked, onChange, label, accentColor }) => {
    return (<div className="flex items-center">
      <label htmlFor={id} className="text-sm font-medium text-slate-300 cursor-pointer select-none">{label}</label>
      <button id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ml-3" style={{
            backgroundColor: checked ? accentColor : '#475569', // slate-600
            '--tw-ring-color': accentColor
        }}>
        <span aria-hidden="true" className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" style={{ transform: checked ? 'translateX(20px)' : 'translateX(0px)' }}/>
      </button>
    </div>);
};
export default ToggleSwitch;
