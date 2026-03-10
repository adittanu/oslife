import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const DEFAULT_COLORS = [
    { name: 'Primary Orange', hex: '#F97316' },
    { name: 'Warm Cream', hex: '#FFF7ED' },
    { name: 'Deep Charcoal', hex: '#1C1917' },
    { name: 'Soft Gray', hex: '#A8A29E' },
    { name: 'Accent Pink', hex: '#F472B6' },
    { name: 'Success Green', hex: '#22C55E' },
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

const defaultBrandKit = {
    colors: DEFAULT_COLORS,
    fonts: DEFAULT_FONTS,
    tone_examples: DEFAULT_TONE,
    keywords: DEFAULT_KEYWORDS,
    content_pillars: DEFAULT_PILLARS,
    dos_donts: { dos: DEFAULT_DOS, donts: DEFAULT_DONTS },
};

export default function BrandKit({ brandKit: propBrandKit }) {
    const [brandKit, setBrandKit] = useState(propBrandKit || defaultBrandKit);
    const [formData, setFormData] = useState(propBrandKit || defaultBrandKit);
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const nextData = propBrandKit || defaultBrandKit;
        setBrandKit(nextData);
        setFormData(nextData);
    }, [propBrandKit]);

    const displayData = isEditing ? formData : brandKit;

    const updateListItem = (key, index, field, value) => {
        const nextItems = [...formData[key]];
        nextItems[index] = { ...nextItems[index], [field]: value };
        setFormData({ ...formData, [key]: nextItems });
    };

    const addListItem = (key, value) => {
        setFormData({ ...formData, [key]: [...formData[key], value] });
    };

    const removeListItem = (key, index) => {
        setFormData({ ...formData, [key]: formData[key].filter((_, itemIndex) => itemIndex !== index) });
    };

    const updateKeyword = (index, value) => {
        const keywords = [...formData.keywords];
        keywords[index] = value;
        setFormData({ ...formData, keywords });
    };

    const updateChecklist = (listName, index, value) => {
        const nextChecklist = [...formData.dos_donts[listName]];
        nextChecklist[index] = value;
        setFormData({
            ...formData,
            dos_donts: {
                ...formData.dos_donts,
                [listName]: nextChecklist,
            },
        });
    };

    const removeChecklist = (listName, index) => {
        setFormData({
            ...formData,
            dos_donts: {
                ...formData.dos_donts,
                [listName]: formData.dos_donts[listName].filter((_, itemIndex) => itemIndex !== index),
            },
        });
    };

    const saveBrandKit = async () => {
        try {
            const response = await axios.post('/api/creator/brand-kit', formData);
            setBrandKit(response.data.brandKit);
            setFormData(response.data.brandKit);
            setIsEditing(false);
            setStatus('Brand kit tersimpan.');
        } catch (error) {
            console.error('Failed to save brand kit:', error);
            setStatus('Gagal menyimpan brand kit.');
        }
    };

    const cancelEdit = () => {
        setFormData(brandKit || defaultBrandKit);
        setIsEditing(false);
        setStatus('');
    };

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
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="font-handwriting text-4xl text-gray-700">Identity Playground</h3>
                            <p className="font-note text-sm text-gray-400 mt-1">Warna, suara, struktur konten, dan guardrail brand kamu ada di satu tempat.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {status && <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">{status}</span>}
                            {isEditing ? (
                                <>
                                    <button onClick={cancelEdit} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button onClick={saveBrandKit} className="px-4 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">save</span>
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit Brand Kit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/3 bg-orange-100/80 rotate-1"></div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            Color Palette
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {displayData.colors?.map((color, index) => (
                                <div key={`${color.name}-${index}`} className="text-center">
                                    <div className="w-full aspect-square rounded-2xl shadow-md border border-gray-200" style={{ backgroundColor: color.hex || '#D6D3D1' }}></div>
                                    {isEditing ? (
                                        <div className="mt-2 space-y-2">
                                            <input value={color.name} onChange={(e) => updateListItem('colors', index, 'name', e.target.value)} className="w-full text-center font-handwriting text-sm font-bold bg-white border border-gray-200 rounded px-2 py-1" />
                                            <input value={color.hex} onChange={(e) => updateListItem('colors', index, 'hex', e.target.value)} className="w-full text-center font-mono text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1" />
                                            <button onClick={() => removeListItem('colors', index)} className="text-red-500 text-xs hover:underline">Remove</button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-handwriting text-sm text-gray-700 mt-2 font-bold">{color.name}</p>
                                            <p className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full inline-block mt-1">{color.hex}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                            <button onClick={() => addListItem('colors', { name: 'New Color', hex: '#C084FC' })} className="mt-4 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-note text-sm hover:border-primary hover:text-primary transition-colors">
                                + Add Color
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/70 rotate-[-1deg]"></div>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">text_fields</span>
                                Typography
                            </h3>
                            <div className="space-y-4">
                                {displayData.fonts?.map((font, index) => (
                                    <div key={`${font.role}-${index}`} className="bg-white/60 rounded-xl p-5 border border-gray-100">
                                        {isEditing ? (
                                            <div className="grid gap-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input value={font.role} onChange={(e) => updateListItem('fonts', index, 'role', e.target.value)} placeholder="Role" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                                    <input value={font.font} onChange={(e) => updateListItem('fonts', index, 'font', e.target.value)} placeholder="Font" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                                </div>
                                                <input value={font.weight} onChange={(e) => updateListItem('fonts', index, 'weight', e.target.value)} placeholder="Weight" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                                <textarea value={font.example} onChange={(e) => updateListItem('fonts', index, 'example', e.target.value)} rows={2} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm resize-none" />
                                                <button onClick={() => removeListItem('fonts', index)} className="text-red-500 text-xs hover:underline text-left">Remove font row</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{font.role}</span>
                                                    <span className="font-note text-xs text-gray-400">{font.weight}</span>
                                                </div>
                                                <p className="font-note text-sm text-gray-500 mb-2">{font.font}</p>
                                                <p className={`text-2xl text-gray-800 ${font.role === 'Headings' ? 'font-serif' : font.role === 'Accents' ? 'font-handwriting' : 'font-sans'}`}>{font.example}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button onClick={() => addListItem('fonts', { role: 'New Role', font: 'Font Name', weight: 'Regular', example: 'Sample line' })} className="mt-4 text-primary font-note text-sm hover:underline">
                                    + Add Font Rule
                                </button>
                            )}
                        </div>

                        <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 right-8 bg-blue-100/70 rotate-[3deg]"></div>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">record_voice_over</span>
                                Tone of Voice
                            </h3>
                            <div className="space-y-4">
                                {displayData.tone_examples?.map((tone, index) => (
                                    <div key={`${tone.tone}-${index}`} className={`${tone.color || 'bg-yellow-100 border-yellow-200'} border rounded-xl p-4`}>
                                        {isEditing ? (
                                            <div className="grid gap-3">
                                                <div className="grid grid-cols-[1fr_2fr] gap-3">
                                                    <input value={tone.emoji} onChange={(e) => updateListItem('tone_examples', index, 'emoji', e.target.value)} placeholder="Material icon" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                                    <input value={tone.tone} onChange={(e) => updateListItem('tone_examples', index, 'tone', e.target.value)} placeholder="Tone label" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                                </div>
                                                <input value={tone.color || ''} onChange={(e) => updateListItem('tone_examples', index, 'color', e.target.value)} placeholder="Tailwind card classes" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                                <textarea value={tone.example} onChange={(e) => updateListItem('tone_examples', index, 'example', e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm resize-none" />
                                                <button onClick={() => removeListItem('tone_examples', index)} className="text-red-500 text-xs hover:underline text-left">Remove tone</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-symbols-outlined text-gray-600">{tone.emoji}</span>
                                                    <h4 className="font-handwriting text-xl font-bold text-gray-800">{tone.tone}</h4>
                                                </div>
                                                <p className="font-note text-sm text-gray-600 italic leading-relaxed">{tone.example}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button onClick={() => addListItem('tone_examples', { tone: 'New Tone', emoji: 'campaign', color: 'bg-orange-100 border-orange-200', example: 'Example copy line' })} className="mt-4 text-primary font-note text-sm hover:underline">
                                    + Add Tone Example
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">label</span>
                            Brand Keywords
                        </h3>
                        <div className="flex flex-wrap gap-5 justify-center">
                            {displayData.keywords?.map((keyword, index) => {
                                const rotations = ['rotate-[-3deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]', 'rotate-[-2deg]'];
                                const colors = ['bg-sticky-yellow', 'bg-sticky-pink', 'bg-orange-100', 'bg-sticky-blue', 'bg-sticky-green'];

                                return (
                                    <div key={`${keyword}-${index}`} className={`${colors[index % colors.length]} p-5 shadow-sticky ${rotations[index % rotations.length]} w-36 h-36 flex flex-col items-center justify-center`}>
                                        {isEditing ? (
                                            <>
                                                <input value={keyword} onChange={(e) => updateKeyword(index, e.target.value)} className="w-full text-center font-handwriting text-lg font-bold text-gray-800 bg-transparent border-b border-gray-400 focus:outline-none" />
                                                <button onClick={() => setFormData({ ...formData, keywords: formData.keywords.filter((_, itemIndex) => itemIndex !== index) })} className="mt-2 text-red-500 text-xs hover:underline">Remove</button>
                                            </>
                                        ) : (
                                            <p className="font-handwriting text-xl font-bold text-gray-800 text-center">{keyword}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {isEditing && (
                            <div className="text-center mt-4">
                                <button onClick={() => setFormData({ ...formData, keywords: [...formData.keywords, 'New Keyword'] })} className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-note text-sm hover:border-primary hover:text-primary transition-colors">
                                    + Add Keyword
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/4 bg-green-100/70 rotate-[-1deg]"></div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">view_column</span>
                            Content Pillars
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {displayData.content_pillars?.map((pillar, index) => (
                                <div key={`${pillar.pillar}-${index}`} className={`${pillar.color || 'bg-gray-50 border-gray-200 text-gray-700'} border rounded-2xl p-5`}>
                                    {isEditing ? (
                                        <div className="grid gap-3">
                                            <input value={pillar.pillar} onChange={(e) => updateListItem('content_pillars', index, 'pillar', e.target.value)} placeholder="Pillar" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                            <input value={pillar.icon} onChange={(e) => updateListItem('content_pillars', index, 'icon', e.target.value)} placeholder="Material icon" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                            <input value={pillar.color || ''} onChange={(e) => updateListItem('content_pillars', index, 'color', e.target.value)} placeholder="Tailwind card classes" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm" />
                                            <textarea value={pillar.desc} onChange={(e) => updateListItem('content_pillars', index, 'desc', e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-sm resize-none" />
                                            <button onClick={() => removeListItem('content_pillars', index)} className="text-red-500 text-xs hover:underline text-left">Remove pillar</button>
                                        </div>
                                    ) : (
                                        <div className="text-center hover:-translate-y-1 transition-transform">
                                            <span className="material-symbols-outlined text-4xl">{pillar.icon}</span>
                                            <h4 className="font-handwriting text-xl font-bold mt-2">{pillar.pillar}</h4>
                                            <p className="font-note text-xs mt-2 opacity-80">{pillar.desc}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                            <button onClick={() => addListItem('content_pillars', { pillar: 'New Pillar', icon: 'star', desc: 'Short pillar description', color: 'bg-slate-50 border-slate-200 text-slate-700' })} className="mt-4 text-primary font-note text-sm hover:underline">
                                + Add Content Pillar
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-2xl shadow-notebook border border-green-200 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-green-200/80 rotate-1"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-green-800 mt-2 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                                Do's
                            </h3>
                            <div className="space-y-3">
                                {displayData.dos_donts?.dos?.map((item, index) => (
                                    <div key={`do-${index}`} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">thumb_up</span>
                                        {isEditing ? (
                                            <div className="flex-1 flex gap-2">
                                                <input value={item} onChange={(e) => updateChecklist('dos', index, e.target.value)} className="flex-1 font-handwriting text-lg text-gray-700 bg-white border border-gray-200 rounded px-2" />
                                                <button onClick={() => removeChecklist('dos', index)} className="text-red-500 text-sm hover:underline">x</button>
                                            </div>
                                        ) : (
                                            <p className="font-handwriting text-lg text-gray-700">{item}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button onClick={() => setFormData({ ...formData, dos_donts: { ...formData.dos_donts, dos: [...formData.dos_donts.dos, ''] } })} className="mt-4 text-green-600 font-note text-sm hover:underline">
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
                                {displayData.dos_donts?.donts?.map((item, index) => (
                                    <div key={`dont-${index}`} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">thumb_down</span>
                                        {isEditing ? (
                                            <div className="flex-1 flex gap-2">
                                                <input value={item} onChange={(e) => updateChecklist('donts', index, e.target.value)} className="flex-1 font-handwriting text-lg text-gray-700 bg-white border border-gray-200 rounded px-2" />
                                                <button onClick={() => removeChecklist('donts', index)} className="text-red-500 text-sm hover:underline">x</button>
                                            </div>
                                        ) : (
                                            <p className="font-handwriting text-lg text-gray-700">{item}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button onClick={() => setFormData({ ...formData, dos_donts: { ...formData.dos_donts, donts: [...formData.dos_donts.donts, ''] } })} className="mt-4 text-red-600 font-note text-sm hover:underline">
                                    + Add Don't
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center pb-4">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] max-w-md">
                            <p className="font-handwriting text-xl text-gray-800 text-center leading-relaxed">
                                "Your brand is what people remember when your content is no longer on screen."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
