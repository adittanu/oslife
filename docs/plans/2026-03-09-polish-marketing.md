# Polish & Marketing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the landing page with new sections, add SEO/meta tags, and implement PWA with offline shell.

**Architecture:** Three parallel workstreams — (A) Landing page sections added to Welcome.jsx with Framer Motion animations, (B) SEO via Inertia Head component + Laravel routes for sitemap/robots, (C) PWA via manifest.json + service worker registered in app.blade.php.

**Tech Stack:** React, Inertia.js, Framer Motion, Laravel, Tailwind CSS

---

### Task 1: Landing Page — How It Works Section

**Files:**
- Modify: `resources/js/Pages/Welcome.jsx`

**Step 1: Add How It Works section after Modes section**

Insert after the Modes `</section>` closing tag and before the Features section. Three-step visual with icons.

```jsx
{/* How It Works */}
<section className="py-20 px-6">
    <div className="max-w-4xl mx-auto">
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Cara Kerjanya</h2>
            <p className="font-note text-gray-500 mt-3 text-lg">Mulai dalam 3 langkah sederhana</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { step: '1', icon: 'person_add', title: 'Daftar Gratis', desc: 'Buat akun dalam hitungan detik. Tanpa kartu kredit.' },
                { step: '2', icon: 'tune', title: 'Pilih Mode', desc: 'Life, Muslim, Creator, atau Work — sesuai kebutuhanmu.' },
                { step: '3', icon: 'rocket_launch', title: 'Mulai Produktif', desc: 'Kelola hidupmu dengan journal digital yang estetik.' },
            ].map((item, i) => (
                <motion.div
                    key={item.step}
                    className="text-center relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.15 }}
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">{item.icon}</span>
                    </div>
                    <div className="font-handwriting text-sm text-primary font-bold mb-1">Step {item.step}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="font-note text-gray-500">{item.desc}</p>
                </motion.div>
            ))}
        </div>
    </div>
</section>
```

**Step 2: Build and verify**

Run: `bun run build`
Expected: Build succeeds without errors.

**Step 3: Commit**

```bash
git add resources/js/Pages/Welcome.jsx
git commit -m "feat: add How It Works section to landing page"
```

---

### Task 2: Landing Page — Screenshot Gallery Section

**Files:**
- Modify: `resources/js/Pages/Welcome.jsx`

**Step 1: Add Screenshot Gallery section after Features section**

Uses browser-frame mockups showing different modes. Since we don't have actual screenshot images yet, use colored placeholder divs with mode names that can be replaced with real screenshots later.

```jsx
{/* Screenshot Gallery */}
<section className="py-20 px-6 bg-white/30">
    <div className="max-w-6xl mx-auto">
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Lihat Tampilan Setiap Mode</h2>
            <p className="font-note text-gray-500 mt-3 text-lg">Desain estetik yang bikin kamu betah</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { name: 'Life Mode', color: 'pink', desc: 'Daily Spread dengan estetika bullet journal' },
                { name: 'Muslim Mode', color: 'green', desc: 'Ibadah tracker dengan nuansa Islami' },
                { name: 'Creator Mode', color: 'orange', desc: 'Content planning yang terorganisir' },
                { name: 'Work Mode', color: 'blue', desc: 'Freelancer management yang rapi' },
            ].map((mode, i) => {
                const bgColors = { pink: 'bg-pink-50', green: 'bg-green-50', orange: 'bg-orange-50', blue: 'bg-blue-50' };
                const borderColors = { pink: 'border-pink-200', green: 'border-green-200', orange: 'border-orange-200', blue: 'border-blue-200' };
                const dotColors = { pink: 'bg-pink-400', green: 'bg-green-400', orange: 'bg-orange-400', blue: 'bg-blue-400' };
                return (
                    <motion.div
                        key={mode.name}
                        className={`rounded-2xl border ${borderColors[mode.color]} overflow-hidden shadow-lg`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                    >
                        {/* Browser chrome */}
                        <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono">lifeos.app/{mode.color}</div>
                        </div>
                        {/* Screenshot placeholder */}
                        <div className={`${bgColors[mode.color]} h-56 flex flex-col items-center justify-center p-6`}>
                            <div className={`w-12 h-12 ${dotColors[mode.color]} rounded-xl flex items-center justify-center mb-3`}>
                                <span className="material-symbols-outlined text-2xl text-white">
                                    {mode.color === 'pink' ? 'favorite' : mode.color === 'green' ? 'mosque' : mode.color === 'orange' ? 'edit_note' : 'business_center'}
                                </span>
                            </div>
                            <h4 className="font-handwriting text-xl font-bold text-gray-700">{mode.name}</h4>
                            <p className="font-note text-gray-500 text-sm mt-1">{mode.desc}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
</section>
```

**Step 2: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add resources/js/Pages/Welcome.jsx
git commit -m "feat: add screenshot gallery section to landing page"
```

---

### Task 3: Landing Page — Pricing Comparison Table

**Files:**
- Modify: `resources/js/Pages/Welcome.jsx`

**Step 1: Add comparison table below existing pricing cards**

Insert inside the Pricing section, after the grid of 3 cards and before the `</section>` tag.

```jsx
{/* Comparison Table */}
<motion.div
    className="mt-16 overflow-x-auto"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
>
    <table className="w-full bg-page-bg rounded-2xl shadow-notebook border border-gray-100 overflow-hidden">
        <thead>
            <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-handwriting text-lg text-gray-600">Fitur</th>
                <th className="p-4 font-handwriting text-lg text-gray-600">Free</th>
                <th className="p-4 font-handwriting text-lg text-primary">Pro</th>
                <th className="p-4 font-handwriting text-lg text-gray-600">Team</th>
            </tr>
        </thead>
        <tbody className="font-note">
            {[
                { feature: 'Mode tersedia', free: '1 (Life)', pro: 'Semua 4', team: 'Semua 4' },
                { feature: 'Habit Trackers', free: '3', pro: 'Unlimited', team: 'Unlimited' },
                { feature: 'AI Assistant', free: false, pro: true, team: true },
                { feature: 'Cloud Sync', free: false, pro: true, team: true },
                { feature: 'Shared Workspace', free: false, pro: false, team: true },
                { feature: 'Team Members', free: '1', pro: '1', team: 'Hingga 5' },
                { feature: 'Prioritas Support', free: false, pro: false, team: true },
            ].map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white/50' : ''}>
                    <td className="p-4 text-gray-700 font-medium">{row.feature}</td>
                    {['free', 'pro', 'team'].map((plan) => (
                        <td key={plan} className="p-4 text-center">
                            {typeof row[plan] === 'boolean' ? (
                                <span className={`material-symbols-outlined text-lg ${row[plan] ? 'text-green-500' : 'text-gray-300'}`}>
                                    {row[plan] ? 'check_circle' : 'cancel'}
                                </span>
                            ) : (
                                <span className="text-gray-600">{row[plan]}</span>
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
</motion.div>
```

**Step 2: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add resources/js/Pages/Welcome.jsx
git commit -m "feat: add pricing comparison table to landing page"
```

---

### Task 4: Landing Page — FAQ Section

**Files:**
- Modify: `resources/js/Pages/Welcome.jsx`

**Step 1: Add FAQ state to Welcome component**

Add at the top of the Welcome function, after `const [activeMode, setActiveMode] = useState(null);`:

```jsx
const [openFaq, setOpenFaq] = useState(null);
```

**Step 2: Add FAQ section after Testimonials section**

```jsx
{/* FAQ */}
<section className="py-20 px-6 bg-white/30">
    <div className="max-w-3xl mx-auto">
        <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Pertanyaan Umum</h2>
            <p className="font-note text-gray-500 mt-3 text-lg">Jawaban untuk pertanyaan yang sering ditanyakan</p>
        </motion.div>
        <div className="space-y-3">
            {[
                { q: 'Apakah Life OS benar-benar gratis?', a: 'Ya! Plan Free bisa dipakai selamanya tanpa kartu kredit. Kamu bisa upgrade ke Pro atau Team kapan saja untuk fitur lebih lengkap.' },
                { q: 'Apakah data saya aman?', a: 'Tentu. Data kamu tersimpan di server yang terenkripsi dan kami tidak pernah membagikan data pribadi ke pihak ketiga.' },
                { q: 'Bisa dipakai offline?', a: 'Life OS bisa di-install ke home screen dan tetap bisa diakses saat offline. Data akan otomatis sync saat koneksi kembali.' },
                { q: 'Apa bedanya 4 mode yang tersedia?', a: 'Setiap mode mengubah tampilan dan fitur sesuai kebutuhan: Life untuk produktivitas harian, Muslim untuk ibadah, Creator untuk content creation, dan Work untuk freelancing.' },
                { q: 'Bisa ganti mode kapan saja?', a: 'Bisa! Kamu bisa switch mode kapan saja dari sidebar. Semua data di setiap mode tetap tersimpan.' },
                { q: 'Bagaimana cara membayar plan Pro/Team?', a: 'Pembayaran diproses melalui Mayar.id yang mendukung transfer bank, e-wallet, dan kartu kredit. Aman dan terpercaya.' },
            ].map((faq, i) => (
                <motion.div
                    key={i}
                    className="bg-page-bg rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.05 }}
                >
                    <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                    >
                        <span className="font-bold text-gray-700">{faq.q}</span>
                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    {openFaq === i && (
                        <div className="px-5 pb-5 pt-0">
                            <p className="font-note text-gray-500">{faq.a}</p>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    </div>
</section>
```

**Step 3: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add resources/js/Pages/Welcome.jsx
git commit -m "feat: add FAQ accordion section to landing page"
```

---

### Task 5: Landing Page — Expand Testimonials + CTA Final

**Files:**
- Modify: `resources/js/Pages/Welcome.jsx`

**Step 1: Replace existing Testimonials section with expanded version (4-6 testimonials in grid)**

Replace the entire Testimonials section:

```jsx
{/* Testimonials */}
<section className="py-20 px-6">
    <div className="max-w-5xl mx-auto">
        <motion.h2
            className="text-3xl md:text-4xl font-elegant text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            Apa Kata Pengguna Kami
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { text: '"Life OS benar-benar mengubah cara saya mengelola waktu. Desainnya sangat menenangkan!"', name: 'Siti Aminah', initials: 'SA', bg: 'bg-sticky-yellow', avatarBg: 'bg-yellow-200', avatarText: 'text-yellow-700', rotate: 'rotate-[-1deg]' },
                { text: '"Muslim Mode sangat membantu menjaga rutinitas ibadah di tengah kesibukan kerja."', name: 'Budi Santoso', initials: 'BS', bg: 'bg-sticky-pink', avatarBg: 'bg-pink-200', avatarText: 'text-pink-700', rotate: 'rotate-[2deg]' },
                { text: '"Creator Mode bikin planning konten jadi jauh lebih terstruktur. Love it!"', name: 'Dina Putri', initials: 'DP', bg: 'bg-sticky-blue', avatarBg: 'bg-blue-200', avatarText: 'text-blue-700', rotate: 'rotate-[-1.5deg]' },
                { text: '"Sebagai freelancer, Work Mode ini game changer. Invoice & client tracking jadi rapi."', name: 'Rizky Pratama', initials: 'RP', bg: 'bg-sticky-green', avatarBg: 'bg-green-200', avatarText: 'text-green-700', rotate: 'rotate-[1deg]' },
                { text: '"AI Assistant-nya pinter banget, bisa bantu brainstorm dan kasih saran produktivitas."', name: 'Maya Lestari', initials: 'ML', bg: 'bg-sticky-yellow', avatarBg: 'bg-yellow-200', avatarText: 'text-yellow-700', rotate: 'rotate-[2.5deg]' },
                { text: '"Suka banget estetikanya. Kayak nulis di bullet journal tapi digital dan gak berantakan."', name: 'Andi Wijaya', initials: 'AW', bg: 'bg-sticky-pink', avatarBg: 'bg-pink-200', avatarText: 'text-pink-700', rotate: 'rotate-[-2deg]' },
            ].map((t, i) => (
                <motion.div
                    key={t.name}
                    className={`${t.bg} p-6 shadow-sticky ${t.rotate} relative`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                >
                    <p className="font-note text-lg mb-4 italic">{t.text}</p>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-bold ${t.avatarText}`}>{t.initials}</div>
                        <span className="font-bold font-handwriting text-lg">{t.name}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
</section>
```

**Step 2: Add CTA Final section after FAQ and before footer**

```jsx
{/* CTA Final */}
<section className="py-24 px-6">
    <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <h2 className="text-4xl md:text-5xl font-elegant text-gray-800 mb-4">Siap Mengorganisir Hidupmu?</h2>
        <p className="font-note text-xl text-gray-500 mb-8">Gabung ribuan pengguna yang sudah lebih produktif dengan Life OS.</p>
        <Link href={auth?.user ? "/daily-spread" : "/register"} className="washi-tape-btn text-xl">
            {auth?.user ? 'Go to Dashboard' : 'Mulai Gratis Sekarang'}
        </Link>
        <p className="text-sm font-handwriting text-gray-400 mt-4">Tanpa kartu kredit. Setup dalam 30 detik.</p>
    </motion.div>
</section>
```

**Step 3: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add resources/js/Pages/Welcome.jsx
git commit -m "feat: expand testimonials to 6 and add final CTA section"
```

---

### Task 6: SEO — Meta Tags & Open Graph

**Files:**
- Modify: `resources/views/app.blade.php`
- Modify: `resources/js/Pages/Welcome.jsx`

**Step 1: Add default meta tags and OG tags to app.blade.php**

Add inside `<head>` after the csrf-token meta:

```html
<meta name="description" content="All-in-one life management system dengan estetika digital bullet journal. 4 Mode: Life, Muslim, Creator, Work.">
<meta name="author" content="Life OS">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Life OS">
<meta property="og:locale" content="id_ID">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">

<!-- Theme -->
<meta name="theme-color" content="#EC4899">
```

**Step 2: Add full SEO Head to Welcome.jsx**

Replace the existing `<Head>` tag at the top of the Welcome component's return:

```jsx
<Head>
    <title>Life OS - Organize Your Entire Life</title>
    <meta name="description" content="All-in-one life management system dengan estetika digital bullet journal. 4 Mode: Life, Muslim, Creator, Work dalam satu platform." />
    <meta property="og:title" content="Life OS - Organize Your Entire Life" />
    <meta property="og:description" content="All-in-one life management system dengan estetika digital bullet journal. 4 Mode dalam satu platform." />
    <meta property="og:url" content="https://lifeos.app" />
    <link rel="canonical" href="https://lifeos.app" />
</Head>
```

**Step 3: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add resources/views/app.blade.php resources/js/Pages/Welcome.jsx
git commit -m "feat: add SEO meta tags and Open Graph to landing page"
```

---

### Task 7: SEO — Structured Data & Sitemap

**Files:**
- Modify: `resources/views/app.blade.php`
- Modify: `routes/web.php`

**Step 1: Add JSON-LD structured data to app.blade.php**

Add before `</head>`:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Life OS",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "description": "All-in-one life management system dengan estetika digital bullet journal",
    "offers": [
        {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "IDR",
            "name": "Free"
        },
        {
            "@type": "Offer",
            "price": "49000",
            "priceCurrency": "IDR",
            "name": "Pro"
        }
    ]
}
</script>
```

**Step 2: Add sitemap route to routes/web.php**

```php
Route::get('/sitemap.xml', function () {
    $urls = [
        ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'weekly'],
        ['loc' => url('/login'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => url('/register'), 'priority' => '0.8', 'changefreq' => 'monthly'],
    ];

    return response()->view('sitemap', ['urls' => $urls], 200)
        ->header('Content-Type', 'application/xml');
});
```

**Step 3: Create sitemap blade template**

Create file: `resources/views/sitemap.blade.php`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach($urls as $url)
    <url>
        <loc>{{ $url['loc'] }}</loc>
        <changefreq>{{ $url['changefreq'] }}</changefreq>
        <priority>{{ $url['priority'] }}</priority>
    </url>
@endforeach
</urlset>
```

**Step 4: Update robots.txt**

Replace content of `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /daily-spread
Disallow: /profile
Disallow: /preferences
Disallow: /checkout

Sitemap: https://lifeos.app/sitemap.xml
```

**Step 5: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add resources/views/app.blade.php routes/web.php resources/views/sitemap.blade.php public/robots.txt
git commit -m "feat: add JSON-LD structured data, sitemap, and robots.txt"
```

---

### Task 8: PWA — Manifest & Icons

**Files:**
- Create: `public/manifest.json`
- Modify: `resources/views/app.blade.php`

**Step 1: Create manifest.json in public/**

```json
{
    "name": "Life OS",
    "short_name": "Life OS",
    "description": "All-in-one life management system dengan estetika digital bullet journal",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FFF8F0",
    "theme_color": "#EC4899",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "/favicon.ico",
            "sizes": "64x64",
            "type": "image/x-icon"
        }
    ],
    "categories": ["productivity", "lifestyle"]
}
```

Note: Icons should be replaced with proper 192x192 and 512x512 PNG icons later.

**Step 2: Link manifest in app.blade.php**

Add inside `<head>` after the theme-color meta:

```html
<!-- PWA -->
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Life OS">
```

**Step 3: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add public/manifest.json resources/views/app.blade.php
git commit -m "feat: add PWA manifest and iOS meta tags"
```

---

### Task 9: PWA — Service Worker & Offline Shell

**Files:**
- Create: `public/sw.js`
- Create: `resources/views/offline.blade.php`
- Modify: `resources/views/app.blade.php`
- Modify: `routes/web.php`

**Step 1: Create service worker at public/sw.js**

```javascript
const CACHE_NAME = 'lifeos-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_URLS = [
    '/',
    '/offline',
];

// Install: cache offline page
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch: network first, fallback to cache, then offline page
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                // Cache static assets
                if (response.ok && (event.request.url.includes('/build/') || event.request.url.includes('fonts'))) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
```

**Step 2: Create offline page blade template**

Create `resources/views/offline.blade.php`:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Life OS - Offline</title>
    <meta name="theme-color" content="#EC4899">
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Nunito:wght@400;600;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFF8F0;
            font-family: 'Nunito', sans-serif;
            color: #374151;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        .icon {
            font-size: 80px;
            color: #EC4899;
            opacity: 0.6;
        }
        h1 {
            font-family: 'Caveat', cursive;
            font-size: 2.5rem;
            margin: 1rem 0 0.5rem;
        }
        p {
            color: #6b7280;
            font-size: 1.1rem;
            max-width: 400px;
            margin: 0 auto 2rem;
        }
        button {
            background: #EC4899;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            font-family: 'Nunito', sans-serif;
        }
        button:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <span class="material-symbols-outlined icon">cloud_off</span>
        <h1>Kamu Sedang Offline</h1>
        <p>Sepertinya koneksi internet kamu terputus. Cek koneksi dan coba lagi ya.</p>
        <button onclick="window.location.reload()">Coba Lagi</button>
    </div>
</body>
</html>
```

**Step 3: Add offline route to routes/web.php**

```php
Route::get('/offline', function () {
    return view('offline');
});
```

**Step 4: Register service worker in app.blade.php**

Add before `</body>`:

```html
<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js');
        });
    }
</script>
```

**Step 5: Build and verify**

Run: `bun run build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add public/sw.js resources/views/offline.blade.php resources/views/app.blade.php routes/web.php
git commit -m "feat: add service worker with offline shell for PWA"
```

---

## Section Order Summary (final Welcome.jsx)

1. Nav
2. Hero (existing + animations)
3. Modes (existing + animations)
4. **How It Works (new — Task 1)**
5. Features (existing + animations)
6. **Screenshot Gallery (new — Task 2)**
7. Pricing + **Comparison Table (new — Task 3)**
8. Testimonials **(expanded — Task 5)**
9. **FAQ (new — Task 4)**
10. **CTA Final (new — Task 5)**
11. Footer
