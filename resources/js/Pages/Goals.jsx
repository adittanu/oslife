import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const CATEGORY_COLORS = {
    Career: 'bg-pink-100 text-primary',
    Personal: 'bg-green-100 text-green-700',
    Finance: 'bg-blue-100 text-blue-700',
    Health: 'bg-orange-100 text-orange-700',
    Learning: 'bg-purple-100 text-purple-700',
};

const COLOR_OPTIONS = [
    { value: 'primary', className: 'bg-primary' },
    { value: 'green-500', className: 'bg-green-500' },
    { value: 'blue-500', className: 'bg-blue-500' },
    { value: 'orange-500', className: 'bg-orange-500' },
    { value: 'purple-500', className: 'bg-purple-500' },
];

export default function Goals({ goals: propGoals }) {
    const [goals, setGoals] = useState(propGoals || []);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: '',
        category: 'Personal',
        deadline: '',
        progress: 0,
        color: 'primary',
    });
    const [newMilestones, setNewMilestones] = useState([]);
    const [milestoneText, setMilestoneText] = useState('');

    useEffect(() => {
        setGoals(propGoals || []);
    }, [propGoals]);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/goals', {
                ...newGoal,
                milestones: newMilestones,
            });
            setGoals([...goals, res.data]);
            setShowAddForm(false);
            setNewGoal({ title: '', category: 'Personal', deadline: '', progress: 0, color: 'primary' });
            setNewMilestones([]);
            router.reload({ only: ['goals'] });
        } catch (e) {
            console.error('Failed to add goal', e);
        }
    };

    const handleAddMilestone = () => {
        if (milestoneText.trim()) {
            setNewMilestones([...newMilestones, { text: milestoneText.trim(), completed: false }]);
            setMilestoneText('');
        }
    };

    const handleToggleMilestone = async (goalId, milestoneId, completed) => {
        try {
            await axios.patch(`/api/milestones/${milestoneId}`, { completed: !completed });
            setGoals(goals.map(g => {
                if (g.id === goalId) {
                    return {
                        ...g,
                        milestones: g.milestones.map(m =>
                            m.id === milestoneId ? { ...m, completed: !m.completed } : m
                        ),
                    };
                }
                return g;
            }));
            router.reload({ only: ['goals'] });
        } catch (e) {
            console.error('Failed to toggle milestone', e);
        }
    };

    const handleDeleteGoal = async (id) => {
        try {
            await axios.delete(`/api/goals/${id}`);
            setGoals(goals.filter(g => g.id !== id));
            router.reload({ only: ['goals'] });
        } catch (e) {
            console.error('Failed to delete goal', e);
        }
    };

    const formatDeadline = (dateString) => {
        if (!dateString) return 'No deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <JournalLayout
            pageTitle="Mosiku - Goals"
            headerTitle="Goals"
            headerSubtitle="Dream big, plan smart, work hard."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-yellow-400 rotate-12">flag</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl">
                    {/* Year header */}
                    <div className="text-center mb-8">
                        <h3 className="font-handwriting text-4xl font-bold text-gray-800">2026 Goals</h3>
                        <div className="h-1 w-24 bg-primary/30 mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Goals grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {goals.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">flag</span>
                                <p className="font-note text-lg text-gray-300 italic">No goals set yet. Start dreaming!</p>
                            </div>
                        ) : (
                            goals.map((goal, i) => (
                                <div
                                    key={goal.id}
                                    className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative overflow-hidden hover:-translate-y-1 transition-transform"
                                >
                                    <div className={`washi-tape-accent -top-2 left-1/2 -translate-x-1/2 w-20 ${
                                        goal.color === 'primary' ? 'bg-pink-200/60' : goal.color === 'green-500' ? 'bg-green-200/60' : 'bg-blue-200/60'
                                    } rotate-1`}></div>

                                    <div className="mt-4">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            CATEGORY_COLORS[goal.category] || 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {goal.category}
                                        </span>
                                        <h4 className="font-handwriting text-2xl font-bold text-gray-800 mt-2">{goal.title}</h4>
                                        <p className="font-note text-sm text-gray-400 mt-1">Target: {formatDeadline(goal.deadline)}</p>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4 mb-4">
                                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{goal.progress}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${COLOR_OPTIONS.find(c => c.value === goal.color)?.className || 'bg-primary'}`}
                                                style={{ width: `${goal.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Milestones */}
                                    <div className="space-y-2 mt-4">
                                        {goal.milestones && goal.milestones.map((ms) => (
                                            <div key={ms.id} className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleMilestone(goal.id, ms.id, ms.completed)}
                                                    className="focus:outline-none"
                                                >
                                                    <span className={`material-symbols-outlined text-lg ${ms.completed ? 'text-green-500' : 'text-gray-300'}`}>
                                                        {ms.completed ? 'check_circle' : 'radio_button_unchecked'}
                                                    </span>
                                                </button>
                                                <span className={`font-note text-sm ${ms.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                                    {ms.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleDeleteGoal(goal.id)}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add new goal */}
                    {!showAddForm ? (
                        <div
                            onClick={() => setShowAddForm(true)}
                            className="bg-page-bg rounded-2xl shadow-notebook border-2 border-dashed border-gray-200 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                        >
                            <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-primary transition-colors">add_circle</span>
                            <p className="font-handwriting text-xl text-gray-400 mt-2 group-hover:text-primary transition-colors">Add New Goal</p>
                        </div>
                    ) : (
                        <form onSubmit={handleAddGoal} className="bg-page-bg rounded-2xl shadow-notebook border border-gray-200 p-8">
                            <h4 className="font-handwriting text-2xl font-bold text-gray-800 mb-4">Create New Goal</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Goal title"
                                    className="p-3 border rounded-lg font-note text-lg"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    required
                                />
                                <select
                                    className="p-3 border rounded-lg font-note text-lg"
                                    value={newGoal.category}
                                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Career">Career</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Health">Health</option>
                                    <option value="Learning">Learning</option>
                                </select>
                                <input
                                    type="date"
                                    className="p-3 border rounded-lg font-note text-lg"
                                    value={newGoal.deadline}
                                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="font-note text-gray-500">Color:</span>
                                    {COLOR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setNewGoal({ ...newGoal, color: opt.value })}
                                            className={`w-8 h-8 rounded-full border-2 ${opt.className} ${newGoal.color === opt.value ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Milestones */}
                            <div className="mb-4">
                                <label className="font-note text-sm text-gray-500 block mb-2">Milestones (optional)</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Add a milestone"
                                        className="flex-1 p-2 border rounded-lg font-note"
                                        value={milestoneText}
                                        onChange={(e) => setMilestoneText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMilestone())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddMilestone}
                                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {newMilestones.map((ms, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="material-symbols-outlined text-gray-300 text-sm">radio_button_unchecked</span>
                                            {ms.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-note hover:opacity-90">
                                    Create Goal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-2 bg-gray-100 rounded-lg font-note hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Motivational sticky note */}
                    <div className="mt-8 flex justify-center">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] max-w-md">
                            <p className="font-handwriting text-xl text-gray-800 text-center leading-relaxed">
                                "A goal without a plan is just a wish."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">— Antoine de Saint-Exupéry</p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
