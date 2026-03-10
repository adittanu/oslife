import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

export default function WeeklyReview({ currentReview: propCurrent, pastReviews: propPast }) {
    const [currentReview, setCurrentReview] = useState(propCurrent);
    const [wins, setWins] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [lessons, setLessons] = useState('');
    const [priorities, setPriorities] = useState([]);
    const [scores, setScores] = useState({});
    const [gratitude, setGratitude] = useState('');

    const [newWin, setNewWin] = useState('');
    const [newChallenge, setNewChallenge] = useState('');
    const [newPriority, setNewPriority] = useState('');

    useEffect(() => {
        if (propCurrent) {
            setWins(propCurrent.wins || []);
            setChallenges(propCurrent.challenges || []);
            setLessons(propCurrent.lessons || '');
            setPriorities(propCurrent.priorities || []);
            setScores(propCurrent.scores || {});
        }
    }, [propCurrent]);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleSaveReview = async () => {
        try {
            if (currentReview?.id) {
                const res = await axios.patch(`/api/weekly-review/${currentReview.id}`, {
                    wins,
                    challenges,
                    lessons,
                    priorities,
                    scores,
                });
                setCurrentReview(res.data);
            } else {
                const res = await axios.post('/api/weekly-review', {
                    week_start: weekStart.toISOString().split('T')[0],
                    week_end: weekEnd.toISOString().split('T')[0],
                    wins,
                    challenges,
                    lessons,
                    priorities,
                    scores,
                });
                setCurrentReview(res.data);
            }
            router.reload({ only: ['currentReview'] });
        } catch (e) {
            console.error('Failed to save review', e);
        }
    };

    const addWin = () => {
        if (newWin.trim()) {
            setWins([...wins, newWin.trim()]);
            setNewWin('');
        }
    };

    const addChallenge = () => {
        if (newChallenge.trim()) {
            setChallenges([...challenges, newChallenge.trim()]);
            setNewChallenge('');
        }
    };

    const addPriority = () => {
        if (newPriority.trim()) {
            setPriorities([...priorities, newPriority.trim()]);
            setNewPriority('');
        }
    };

    const updateScore = (category, value) => {
        setScores({ ...scores, [category]: value });
    };

    const scoreCategories = [
        { label: 'Productivity', color: 'bg-primary' },
        { label: 'Health', color: 'bg-green-500' },
        { label: 'Relationships', color: 'bg-blue-500' },
        { label: 'Happiness', color: 'bg-yellow-500' },
    ];

    return (
        <JournalLayout
            pageTitle="Mosiku - Weekly Review"
            headerTitle="Weekly Review"
            headerSubtitle="Reflect, learn, and plan ahead."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-purple-300 rotate-12">rate_review</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Left — This week reflection */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-1"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Week Review</h3>
                            <p className="font-note text-gray-400">{formatDate(weekStart)} - {formatDate(weekEnd)}</p>
                        </div>

                        {/* Wins */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Wins This Week</h4>
                            </div>
                            <div className="space-y-3 pl-2">
                                {wins.map((win, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                        <p className="font-handwriting text-xl text-gray-700">{win}</p>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-xl text-gray-500 placeholder-gray-300"
                                        placeholder="Add a win..."
                                        type="text"
                                        value={newWin}
                                        onChange={(e) => setNewWin(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addWin()}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Challenges */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-orange-400">warning</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Challenges</h4>
                            </div>
                            <div className="space-y-3 pl-2">
                                {challenges.map((challenge, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">pending</span>
                                        <p className="font-handwriting text-xl text-gray-700">{challenge}</p>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-xl text-gray-500 placeholder-gray-300"
                                        placeholder="Add a challenge..."
                                        type="text"
                                        value={newChallenge}
                                        onChange={(e) => setNewChallenge(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addChallenge()}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lessons learned */}
                        <div className="bg-sticky-purple p-5 shadow-sticky rotate-[-1deg]">
                            <h4 className="font-sketch text-lg text-purple-800 mb-2 border-b border-purple-200 pb-1">Lessons Learned</h4>
                            <textarea
                                className="w-full bg-transparent border-none resize-none font-handwriting text-xl text-gray-700 leading-relaxed focus:ring-0 outline-none min-h-[80px]"
                                placeholder="What did you learn this week?"
                                value={lessons}
                                onChange={(e) => setLessons(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Right — Next week plan */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-blue-100/70 rotate-[3deg]"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700">Next Week Plan</h3>
                            <p className="font-note text-gray-400">Looking ahead</p>
                        </div>

                        {/* Top priorities */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-red-400">priority_high</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Top 3 Priorities</h4>
                            </div>
                            <div className="space-y-4">
                                {priorities.slice(0, 3).map((p, i) => (
                                    <div key={i} className={`p-4 rounded-xl shadow-sm flex items-start gap-3 ${
                                        i === 0 ? 'bg-sticky-pink' : i === 1 ? 'bg-sticky-blue' : 'bg-sticky-green'
                                    }`}>
                                        <span className="font-handwriting text-2xl font-bold text-gray-400">{i + 1}.</span>
                                        <p className="font-handwriting text-xl text-gray-800">{p}</p>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-300">add_circle</span>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-xl text-gray-500 placeholder-gray-300"
                                        placeholder="Add a priority..."
                                        type="text"
                                        value={newPriority}
                                        onChange={(e) => setNewPriority(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addPriority()}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Weekly scores */}
                        <div className="mb-8">
                            <h4 className="font-handwriting text-2xl font-bold text-gray-700 mb-4">This Week's Score</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {scoreCategories.map((s) => (
                                    <div key={s.label} className="bg-white/60 rounded-xl p-3 border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-note text-sm text-gray-500">{s.label}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                className="w-12 text-center border rounded font-handwriting"
                                                value={scores[s.label] || ''}
                                                onChange={(e) => updateScore(s.label, parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${s.color}`}
                                                style={{ width: `${((scores[s.label] || 0) / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gratitude */}
                        <div className="bg-sticky-yellow p-5 shadow-sticky rotate-[1deg]">
                            <h4 className="font-sketch text-lg text-yellow-800 mb-2 border-b border-yellow-300 pb-1">Grateful For This Week</h4>
                            <textarea
                                className="w-full bg-transparent border-none resize-none font-handwriting text-xl text-gray-700 leading-relaxed focus:ring-0 outline-none min-h-[60px]"
                                placeholder="What are you grateful for?"
                                value={gratitude}
                                onChange={(e) => setGratitude(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Save button */}
                        <button
                            onClick={handleSaveReview}
                            className="mt-8 w-full py-3 bg-primary text-white rounded-xl font-handwriting text-xl hover:opacity-90 transition-opacity"
                        >
                            Save Weekly Review
                        </button>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[80px] text-yellow-300">stars</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
