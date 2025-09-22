import { Priority } from './types';
export const PRIORITY_CONFIG = {
    // FIX: 'Priority' was imported as a type, but it's used as a value here.
    // The import has been changed to a value import for the enum.
    [Priority.LOW]: { label: 'Low', color: 'bg-sky-500/10 text-sky-400', ringColor: 'ring-sky-500/20' },
    [Priority.MEDIUM]: { label: 'Medium', color: 'bg-amber-500/10 text-amber-400', ringColor: 'ring-amber-500/20' },
    [Priority.HIGH]: { label: 'High', color: 'bg-red-500/10 text-red-400', ringColor: 'ring-red-500/20' },
};
export const FONT_OPTIONS = [
    { name: 'Inter', value: 'sans', class: 'font-sans' },
    { name: 'Lora', value: 'serif', class: 'font-serif' },
    { name: 'Inconsolata', value: 'mono', class: 'font-mono' },
];
export const THEME_OPTIONS = [
    { name: 'Slate', value: 'slate', classes: 'bg-slate-900/70 text-slate-50', bodyClass: 'theme-slate' },
    { name: 'Zinc', value: 'zinc', classes: 'bg-zinc-900/70 text-zinc-50', bodyClass: 'theme-zinc' },
    { name: 'Stone', value: 'stone', classes: 'bg-stone-900/70 text-stone-50', bodyClass: 'theme-stone' },
];
