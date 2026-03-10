import React, { useState } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
const months = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadan', 'Syawal', 'Dzulqaidah', 'Dzulhijjah'];
const tones = {
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-sky-100 text-sky-700 border-sky-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
};

const events = [
    { month: 1, day: 1, title: 'Tahun Baru Hijriyah', detail: 'Saat yang baik untuk reset niat dan target ibadah.', tone: 'emerald' },
    { month: 1, day: 10, title: 'Puasa Asyura', detail: 'Hari sunnah yang sering dijaga untuk puasa.', tone: 'blue' },
    { month: 3, day: 12, title: 'Maulid Nabi', detail: 'Momen memperbanyak shalawat dan meneladani akhlak Rasul.', tone: 'pink' },
    { month: 7, day: 27, title: "Isra Mi'raj", detail: 'Pengingat untuk menjaga kualitas shalat.', tone: 'blue' },
    { month: 8, day: 15, title: "Nisfu Sya'ban", detail: 'Waktu yang sering dipakai untuk doa dan istighfar.', tone: 'emerald' },
    { month: 9, day: 1, title: 'Awal Ramadan', detail: 'Mulai target puasa, tilawah, dan disiplin amal.', tone: 'emerald' },
    { month: 9, day: 17, title: "Nuzulul Qur'an", detail: 'Momentum untuk lebih dekat dengan Al-Qur\'an.', tone: 'amber' },
    { month: 9, day: 21, title: 'Malam Ganjil', detail: 'Mulai puncak 10 malam terakhir Ramadan.', tone: 'purple' },
    { month: 9, day: 23, title: 'Malam Ganjil', detail: 'Lanjutkan qiyam dan doa terbaikmu.', tone: 'purple' },
    { month: 9, day: 25, title: 'Malam Ganjil', detail: 'Jaga ritme ibadah sampai akhir bulan.', tone: 'purple' },
    { month: 9, day: 27, title: 'Malam Ganjil', detail: 'Malam yang paling sering diburu untuk ibadah.', tone: 'purple' },
    { month: 9, day: 29, title: 'Malam Ganjil', detail: 'Penutup kuat di akhir Ramadan.', tone: 'purple' },
    { month: 10, day: 1, title: 'Idul Fitri', detail: 'Hari kemenangan dan syukur setelah Ramadan.', tone: 'emerald' },
    { month: 12, day: 9, title: 'Hari Arafah', detail: 'Hari puasa sunnah yang sangat utama.', tone: 'amber' },
    { month: 12, day: 10, title: 'Idul Adha', detail: 'Hari raya kurban dan makna pengorbanan.', tone: 'rose' },
];

const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
};

const formatGregorian = (date) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

const hijriParts = (date) => {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(date);
    return {
        day: Number(parts.find((part) => part.type === 'day')?.value),
        month: Number(parts.find((part) => part.type === 'month')?.value),
        year: Number(parts.find((part) => part.type === 'year')?.value),
    };
};

const eventFor = (month, day) => events.find((item) => item.month === month && item.day === day) || null;

const buildMonth = (cursor) => {
    const active = hijriParts(cursor);
    const found = [];
    const scanStart = addDays(cursor, -20);

    for (let i = 0; i < 70; i += 1) {
        const current = addDays(scanStart, i);
        const hijri = hijriParts(current);
        if (hijri.month === active.month && hijri.year === active.year) {
            found.push({ date: current, hijri, event: eventFor(hijri.month, hijri.day) });
        }
    }

    const cells = [...Array(found[0]?.date.getDay() || 0).fill(null), ...found];
    while (cells.length % 7 !== 0) cells.push(null);

    return {
        month: active.month,
        year: active.year,
        start: found[0]?.date,
        end: found[found.length - 1]?.date,
        items: found,
        cells,
    };
};

const monthGuide = (month) => {
    if (month === 9) return ['Update target tilawah', 'Siapkan sedekah harian', 'Rancang qiyam 10 malam terakhir'];
    if (month === 12) return ['Catat target kurban', 'Jaga puasa Arafah', 'Rapikan agenda silaturahmi'];
    if (month === 1) return ['Tulis resolusi hijrah', 'Mulai kebiasaan ibadah baru', 'Buat target doa tahunan'];
    return ['Tandai hari penting', 'Atur target ibadah mingguan', 'Sisihkan waktu untuk tilawah dan doa'];
};

export default function IslamicCalendar() {
    const today = new Date();
    const [cursor, setCursor] = useState(today);
    const [selectedKey, setSelectedKey] = useState(null);
    const data = buildMonth(cursor);
    const activeItem = data.items.find((item) => formatGregorian(item.date) === selectedKey) || data.items[0] || null;
    const monthEvents = data.items.filter((item) => item.event);

    return (
        <JournalLayout pageTitle="Muslim OS - Islamic Calendar" headerTitle="Islamic Calendar" headerSubtitle="Hijriyah calendar with monthly highlights" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">calendar_month</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="w-full max-w-7xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                        <button onClick={() => { const next = addDays(cursor, -30); setCursor(next); setSelectedKey(null); }} className="flex items-center gap-1 text-gray-400 hover:text-primary font-medium"><span className="material-symbols-outlined">chevron_left</span><span className="font-note">Bulan sebelumnya</span></button>
                        <div className="text-center">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-800">{months[data.month - 1]} {data.year} H</h3>
                            <p className="font-note text-gray-400 mt-1">{data.start ? formatGregorian(data.start) : '-'} - {data.end ? formatGregorian(data.end) : '-'}</p>
                        </div>
                        <button onClick={() => { const next = addDays(cursor, 30); setCursor(next); setSelectedKey(null); }} className="flex items-center gap-1 text-gray-400 hover:text-primary font-medium"><span className="font-note">Bulan berikutnya</span><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.8fr_0.9fr]">
                        <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-7 border-b border-gray-200 bg-primary/5">
                                {days.map((day, i) => <div key={day} className={`px-2 py-3 text-center text-sm font-bold uppercase tracking-wider ${i === 5 ? 'text-primary' : 'text-gray-400'}`}>{day}</div>)}
                            </div>
                            {Array.from({ length: data.cells.length / 7 }, (_, row) => (
                                <div key={row} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                                    {data.cells.slice(row * 7, row * 7 + 7).map((cell, col) => {
                                        if (!cell) return <div key={`empty-${row}-${col}`} className="min-h-[116px] border-r border-gray-100 last:border-r-0 bg-gray-50/30"></div>;
                                        const key = formatGregorian(cell.date);
                                        const todayFlag = key === formatGregorian(today);
                                        const selected = key === (selectedKey || activeItem ? formatGregorian(activeItem.date) : null);
                                        return (
                                            <button key={key} type="button" onClick={() => setSelectedKey(key)} className={`min-h-[116px] p-3 border-r border-gray-100 last:border-r-0 text-left ${selected ? 'bg-white shadow-inner' : 'hover:bg-white/60'} ${todayFlag ? 'bg-primary/5 ring-2 ring-inset ring-primary/20' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-handwriting text-xl ${todayFlag ? 'text-primary font-bold' : 'text-gray-600'}`}>{cell.hijri.day}</span>
                                                    <span className="font-note text-[11px] text-gray-300">{new Intl.DateTimeFormat('id-ID', { day: 'numeric' }).format(cell.date)}</span>
                                                </div>
                                                <p className="font-note text-xs text-gray-400 mt-1">{new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(cell.date)}</p>
                                                {cell.event && <div className={`mt-3 rounded-xl border px-2 py-1.5 ${tones[cell.event.tone]}`}><p className="font-note text-xs leading-snug">{cell.event.title}</p></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-handwriting text-2xl text-gray-700 mb-3">Tanggal Terpilih</h4>
                                {activeItem ? (
                                    <>
                                        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4">
                                            <p className="font-handwriting text-2xl text-gray-800">{activeItem.hijri.day} {months[activeItem.hijri.month - 1]} {activeItem.hijri.year} H</p>
                                            <p className="font-note text-sm text-gray-500 mt-1">{formatGregorian(activeItem.date)}</p>
                                        </div>
                                        {activeItem.event ? (
                                            <div className={`rounded-2xl border p-4 mt-4 ${tones[activeItem.event.tone]}`}>
                                                <p className="font-display font-semibold">{activeItem.event.title}</p>
                                                <p className="font-note text-sm mt-2">{activeItem.event.detail}</p>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-gray-200 p-4 mt-4 text-center">
                                                <p className="font-note text-sm text-gray-400">Tanggal ini belum punya penanda khusus.</p>
                                            </div>
                                        )}
                                    </>
                                ) : <p className="font-note text-sm text-gray-400">Data bulan belum tersedia.</p>}
                            </div>

                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[-1deg]">
                                <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-yellow-300 pb-2 flex items-center gap-2"><span className="material-symbols-outlined text-amber-600">event_upcoming</span>Sorotan Bulan Ini</h4>
                                <div className="space-y-3">
                                    {monthEvents.length === 0 ? <p className="font-note text-sm text-gray-500">Belum ada event utama yang dipetakan di bulan ini.</p> : monthEvents.map((item) => (
                                        <div key={`${item.hijri.month}-${item.hijri.day}`} className="flex items-start gap-3">
                                            <span className="font-handwriting text-primary font-bold text-sm whitespace-nowrap">{item.hijri.day} {months[data.month - 1].slice(0, 3)}</span>
                                            <div><span className="font-note text-gray-700">{item.event.title}</span><p className="font-note text-xs text-gray-400">{item.event.detail}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-100 p-6 shadow-sticky rotate-[1deg] rounded-lg border border-green-200/50">
                                <h4 className="font-sketch text-xl text-green-800 mb-4 border-b border-green-300 pb-2 flex items-center gap-2"><span className="material-symbols-outlined text-green-600">task_alt</span>Fokus Bulan Ini</h4>
                                <ul className="space-y-2">
                                    {monthGuide(data.month).map((item) => <li key={item} className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-lg">check_box_outline_blank</span><span className="font-handwriting text-gray-800">{item}</span></li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
