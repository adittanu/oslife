import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const DEFAULT_COLORS = [
    { name: 'Primary Orange', hex: '#F97316', bg: 'bg-orange-500' },
    { name: 'Warm Cream', hex: '#FFF7ED', bg: 'bg-orange-50' },
    { name: 'Deep Charcoal', hex: '#1C1917', bg: 'bg-stone-900' },
    { name: 'Soft Gray', hex: '#A8A29E', bg: 'bg-stone-400' },
    { name: 'Accent Pink', hex: '#F472B6', bg: 'bg-pink-400' },
    { name: 'Success Green', hex: '#22C55E', bg: 'bg-green-500' },
];

const DEFAULT_FONTS = [
    { role: 'Headings', font: 'Playfair Display', weight: 'Bold / Semi-Bold', example: 'The Quick Brown Fox' },
    { role: 'Body Text', font: 'Inter', weight: 'Regular / Medium', example: 'The quick brown fox jumps over the lazy dog.' },
    { role: 'Accents', font: 'Caveat', weight: 'Regular', example: 'Add a personal touch!' },
];

const DEFAULT_TONE = [
    { tone: 'Friendly', emoji: 'sentiment_satisfied', color: 'bg-yellow-100 border-yellow-200', example: '"Hey friend! I just tried this amazing hack and I HAD to share it with you."' },
    { tone: 'Professional', emoji: 'business_center', color: 'bg-blue-100 border-blue-200', example: '"Based on my experience working with 50+ brands, here are the key takeaways."' },
    { tone: 'Witty', emoji: 'mood', color: 'bg-pink-100 border-pink-200', example: '"My content calendar said I needed to post today. My bed said otherwise. Guess who won?"' },
];

const DEFAULT_KEYWORDS = ['Authentic', 'Empowering', 'Creative', 'Relatable', 'Inspiring'];

const DEFAULT_PILLARS = [
    { pillar: 'Education', icon: 'school', desc: 'Tutorials, tips, how-tos, and industry insights', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { pillar: 'Entertainment', icon: 'theater_comedy', desc: 'Trending audio, funny takes, relatable skits', color: 'bg-pink-50 border-pink-200 text-pink-700' },
    { pillar: 'Inspiration', icon: 'auto_awesome', desc: 'Motivational stories, before/after, milestones', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { pillar: 'Behind-the-Scenes', icon: 'videocam', desc: 'Day-in-my-life, process, workspace tours', color: 'bg-purple-50 border-purple-200 text-purple-700' },
];

const DEFAULT_DOS = [
    'Use warm, natural lighting in all photos',
    'Maintain consistent color grading (warm tones)',
    'Speak directly to the audience like a friend',
    'Share real stories and genuine experiences',
    'Use brand colors in graphics and thumbnails',
];

const DEFAULT_DONTS = [
    'Use overly salesy or pushy language',
    'Post blurry or low-quality images',
    'Use more than 2 fonts in a single graphic',
    'Stray from the warm color palette',
    'Ignore comments or community engagement',
];

export default function BrandKit({ brandKit: propBrandKit }) {
    const [brandKit, setBrandKit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('colors');
    const [formData, setFormData] = useState({
        colors: DEFAULT_COLORS,
        fonts: DEFAULT_FONTS,
        tone_examples: DEFAULT_TONE,
        keywords: DEFAULT_KEYWORDS,
        content_pillars: DEFAULT_PILLARS,
        dos_donts: { dos: DEFAULT_DOS, donts: DEFAULT_DONTS },
    });

    useEffect(() => {
        if (propBrandKit) {
            setBrandKit(propBrandKit);
            setFormData({
                colors: propBrandKit.colors || DEFAULT_COLORS,
                fonts: propBrandKit.fonts || DEFAULT_FONTS,
                tone_examples: propBrandKit.tone_examples || DEFAULT_TONE,
                keywords: propBrandKit.keywords || DEFAULT_KEYWORDS,
                content_pillars: propBrandKit.content_pillars || DEFAULT_PILLARS,
                dos_donts: propBrandKit.dos_donts || { dos: DEFAULT_DOS, donts: DEFAULT_DONTS },
            });
        }
    }, [propBrandKit]);

    const handleSave = async () => {
        try {
            const response = await axios.post('/api/creator/brand-kit', formData);
            setBrandKit(response.data.brandKit);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save brand kit:', err);
        }
    };

    const updateColor = (index, field, value) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData({ ...formData, colors: newColors });
    };

    const addColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: 'New Color', hex: '#000000', bg: 'bg-gray-500' }],
        });
    };

    const removeColor = (index) => {
        const newColors = formData.colors.filter((_, i) => i !== index);
        setFormData({ ...formData, colors: newColors });
    };

    const updateKeyword = (index, value) => {
        const newKeywords = [...formData.keywords];
        newKeywords[index] = value;
        setFormData({ ...formData, keywords: newKeywords });
    };

    const addKeyword = () => {
        setFormData({ ...formData, keywords: [...formData.keywords, 'New'] });
    };

    const removeKeyword = (index) => {
        const newKeywords = formData.keywords.filter((_, i) => i !== index);
        setFormData({ ...formData, keywords: newKeywords });
    };

    const updateDo = (index, value) => {
        const newDos = [...formData.dos_donts.dos];
        newDos[index] = value;
        setFormData({ ...formData, dos_donts: { ...formData.dos_donts, dos: newDos } });
    };

    const addDo = () => {
        setFormData({
            ...formData,
            dos_donts: { ...formData.dos_donts, dos: [...formData.dos_donts.dos, ''] },
        });
    };

    const removeDo = (index) => {
        const newDos = formData.dos_donts.dos.filter((_, i) => i !== index);
        setFormData({ ...formData, dos_donts: { ...formData.dos_donts, dos: newDos } });
    };

    const updateDont = (index, value) => {
        const newDonts = [...formData.dos_donts.donts];
        newDonts[index] = value;
        setFormData({ ...formData, dos_donts: { ...formData.dos_donts, donts: newDonts } });
    };

    const addDont = () => {
        setFormData({
            ...formData,
            dos_donts: { ...formData.dos_donts, donts: [...formData.dos_donts.donts, ''] },
        });
    };

    const removeDont = (index) => {
        const newDonts = formData.dos_donts.donts.filter((_, i) => i !== index);
        setFormData({ ...formData, dos_donts: { ...formData.dos_donts, donts: newDonts } });
    };

    const displayData = isEditing ? formData : (brandKit || {
        colors: DEFAULT_COLORS,
        fonts: DEFAULT_FONTS,
        tone_examples: DEFAULT_TONE,
        keywords: DEFAULT_KEYWORDS,
        content_pillars: DEFAULT_PILLARS,
        dos_donts: { dos: DEFAULT_DOS, donts: DEFAULT_DONTS },
    });

    return (
        <JournalLayout
            pageTitle="Creator OS - Brand Kit"
            headerTitle="Brand Kit"
            headerSubtitle="Your visual identity"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">palette</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Edit Toggle */}
                    <div className="flex justify-end gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Edit Brand Kit
                            </button>
                        )}
                    </div>

                    {/* Color Palette */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/3 bg-orange-100/80 rotate-1"></div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            Color Palette
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {displayData.colors?.map((c, i) => (
                                <div key={i} className="text-center group relative">
                                    <div className={`${c.bg || 'bg-gray-400'} w-full aspect-square rounded-2xl shadow-md border border-gray-200 group-hover:scale-105 transition-transform`}></div>
                                    {isEditing ? (
                                        <div className="mt-2 space-y-1">
                                            <input
                                                type="text"
                                                value={c.name}
                                                onChange={(e) => updateColor(i, 'name', e.target.value)}
                                                className="w-full text-center font-handwriting text-sm font-bold bg-white border border-gray-200 rounded px-1"
                                            />
                                            <input
                                                type="text"
                                                value={c.hex}
                                                onChange={(e) => updateColor(i, 'hex', e.target.value)}
                                                className="w-full text-center font-mono text-xs bg-gray-50 border border-gray-200 rounded px-1"
                                            />
                                            <button
                                                onClick={() => removeColor(i)}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-handwriting text-sm text-gray-700 mt-2 font-bold">{c.name}</p>
                                            <p className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full inline-block mt-1">{c.hex}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                            <button
                                onClick={addColor}
                                className="mt-4 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-note text-sm hover:border-primary hover:text-primary transition-colors"
                            >
                                + Add Color
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Typography */}
                        <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/70 rotate-[-1deg]"></div>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">text_fields</span>
                                Typography
                            </h3>
                            <div className="space-y-5">
                                {displayData.fonts?.map((f, i) => (
                                    <div key={i} className="bg-white/60 rounded-xl p-5 border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{f.role}</span>
                                            <span className="font-note text-xs text-gray-400">{f.weight}</span>
                                        </div>
                                        <p className="font-note text-sm text-gray-500 mb-2">{f.font}</p>
                                        <p className={`text-2xl text-gray-800 ${f.role === 'Headings' ? 'font-serif' : f.role === 'Accents' ? 'font-handwriting' : 'font-sans'}`}>
                                            {f.example}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tone of Voice */}
                        <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 right-8 bg-blue-100/70 rotate-[3deg]"></div>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">record_voice_over</span>
                                Tone of Voice
                            </h3>
                            <div className="space-y-4">
                                {displayData.tone_examples?.map((t, i) => (
                                    <div key={i} className={`${t.color} border rounded-xl p-4`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-gray-600">{t.emoji}</span>
                                            <h4 className="font-handwriting text-xl font-bold text-gray-800">{t.tone}</h4>
                                        </div>
                                        <p className="font-note text-sm text-gray-600 italic leading-relaxed">{t.example}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Brand Keywords - Sticky Notes */}
                    <div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">label</span>
                            Brand Keywords
                        </h3>
                        <div className="flex flex-wrap gap-5 justify-center">
                            {displayData.keywords?.map((k, i) => {
                                const rotations = ['rotate-[-3deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]', 'rotate-[-2deg]'];
                                const colors = ['bg-sticky-yellow', 'bg-sticky-pink', 'bg-orange-100', 'bg-sticky-blue', 'bg-sticky-green'];
                                return (
                                    <div key={i} className={`${colors[i % colors.length]} p-5 shadow-sticky ${rotations[i % rotations.length]} w-36 h-36 flex flex-col items-center justify-center`}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={k}
                                                    onChange={(e) => updateKeyword(i, e.target.value)}
                                                    className="w-full text-center font-handwriting text-lg font-bold text-gray-800 bg-transparent border-b border-gray-400 focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => removeKeyword(i)}
                                                    className="mt-2 text-red-500 text-xs hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <p className="font-handwriting text-xl font-bold text-gray-800 text-center">{k}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {isEditing && (
                            <div className="text-center mt-4">
                                <button
                                    onClick={addKeyword}
                                    className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-note text-sm hover:border-primary hover:text-primary transition-colors"
                                >
                                    + Add Keyword
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Pillars */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/4 bg-green-100/70 rotate-[-1deg]"></div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">view_column</span>
                            Content Pillars
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {displayData.content_pillars?.map((cp, i) => (
                                <div key={i} className={`${cp.color} border rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform`}>
                                    <span className="material-symbols-outlined text-4xl">{cp.icon}</span>
                                    <h4 className="font-handwriting text-xl font-bold mt-2">{cp.pillar}</h4>
                                    <p className="font-note text-xs mt-2 opacity-80">{cp.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Do's and Don'ts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-2xl shadow-notebook border border-green-200 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-green-200/80 rotate-1"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-green-800 mt-2 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                                Do's
                            </h3>
                            <div className="space-y-3">
                                {displayData.dos_donts?.dos?.map((d, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">thumb_up</span>
                                        {isEditing ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={d}
                                                    onChange={(e) => updateDo(i, e.target.value)}
                                                    className="flex-1 font-handwriting text-lg text-gray-700 bg-white border border-gray-200 rounded px-2"
                                                />
                                                <button
                                                    onClick={() => removeDo(i)}
                                                    className="text-red-500 text-sm hover:underline"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="font-handwriting text-lg text-gray-700">{d}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={addDo}
                                    className="mt-4 text-green-600 font-note text-sm hover:underline"
                                >
                                    + Add Do
                                </button>
                            )}
                        </div>

                        <div className="bg-red-50 rounded-2xl shadow-notebook border border-red-200 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-red-200/80 rotate-[-1deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-red-800 mt-2 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">cancel</span>
                                Don'ts
                            </h3>
                            <div className="space-y-3">
                                {displayData.dos_donts?.donts?.map((d, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">thumb_down</span>
                                        {isEditing ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={d}
                                                    onChange={(e) => updateDont(i, e.target.value)}
                                                    className="flex-1 font-handwriting text-lg text-gray-700 bg-white border border-gray-200 rounded px-2"
                                                />
                                                <button
                                                    onClick={() => removeDont(i)}
                                                    className="text-red-500 text-sm hover:underline"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="font-handwriting text-lg text-gray-700">{d}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={addDont}
                                    className="mt-4 text-red-600 font-note text-sm hover:underline"
                                >
                                    + Add Don't
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom sticky note */}
                    <div className="flex justify-center pb-4">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] max-w-md">
                            <p className="font-handwriting text-xl text-gray-800 text-center leading-relaxed">
                                "Your brand is what people say about you when you're not in the room."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">-- Jeff Bezos</p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
