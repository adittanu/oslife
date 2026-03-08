/**
 * Detect current mode from user preference or URL path.
 * URL takes priority so sidebar matches the page being viewed.
 */
export function detectMode(user, url) {
    if (url?.startsWith('/muslim')) return 'muslim';
    // future: if (url?.startsWith('/work')) return 'work';
    return user?.default_mode || 'life';
}

export const modeConfig = {
    life: {
        label: 'Life OS v2.4',
        brandTitle: 'My Journal',
        defaultTheme: 'pink',
        homePath: '/daily-spread',
        main: [
            { href: '/daily-spread', icon: 'auto_stories', label: 'Daily Spread' },
            { href: '/calendar', icon: 'calendar_month', label: 'Calendar' },
            { href: '/task-log', icon: 'edit_calendar', label: 'Task Log' },
            { href: '/habit-tracker', icon: 'track_changes', label: 'Habit Tracker' },
        ],
        collections: [
            { href: '/notes', icon: 'edit_document', label: 'Notes' },
            { href: '/finances', icon: 'account_balance_wallet', label: 'Finances' },
            { href: '/idea-dump', icon: 'lightbulb', label: 'Idea Dump' },
            { href: '/gratitude', icon: 'favorite', label: 'Gratitude' },
            { href: '/mood-tracker', icon: 'mood', label: 'Mood Tracker' },
            { href: '/goals', icon: 'flag', label: 'Goals' },
        ],
        tools: [
            { href: '/focus-timer', icon: 'timer', label: 'Focus Timer' },
            { href: '/weekly-review', icon: 'rate_review', label: 'Weekly Review' },
        ],
    },
    muslim: {
        label: 'Muslim OS v2.4',
        brandTitle: 'My Journal',
        defaultTheme: 'green',
        homePath: '/muslim/daily-spread',
        main: [
            { href: '/muslim/daily-spread', icon: 'auto_stories', label: 'Daily Spread' },
            { href: '/muslim/islamic-calendar', icon: 'calendar_month', label: 'Islamic Calendar' },
            { href: '/muslim/sholat-tracker', icon: 'mosque', label: 'Sholat Tracker' },
            { href: '/muslim/quran-journal', icon: 'menu_book', label: "Al-Qur'an Journal" },
        ],
        collections: [
            { href: '/muslim/dzikir', icon: 'prayer_times', label: 'Dzikir Counter' },
            { href: '/muslim/doa', icon: 'volunteer_activism', label: 'Doa Collection' },
            { href: '/muslim/kajian-notes', icon: 'school', label: 'Kajian Notes' },
            { href: '/muslim/muhasabah', icon: 'self_improvement', label: 'Muhasabah' },
            { href: '/muslim/sedekah-tracker', icon: 'savings', label: 'Sedekah Tracker' },
            { href: '/muslim/ramadan-planner', icon: 'nights_stay', label: 'Ramadan Planner' },
        ],
        tools: [
            { href: '/muslim/habit-tracker', icon: 'track_changes', label: 'Habit Islami' },
            { href: '/muslim/weekly-muhasabah', icon: 'rate_review', label: 'Weekly Muhasabah' },
        ],
    },
};
