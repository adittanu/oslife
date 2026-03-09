# Muslim Mode Dynamic Features Design

## Overview

Membuat 5 halaman utama Muslim mode menjadi dinamis dengan ghost UI placeholders dan backend lengkap, mengikuti pola Life mode DailySpread.

## Scope

5 Halaman utama:
1. **Muslim Daily Spread** - Jadwal sholat & dzikir harian
2. **Sholat Tracker** - Tracking sholat 5 waktu mingguan
3. **Quran Journal** - Tadarus, hafalan, tadabbur
4. **Dzikir** - Counter dzikir
5. **Muhasabah** - Refleksi diri harian

## Approach

**Paralel per Fitur**: Setiap halaman dikerjakan secara lengkap end-to-end:
migration → model → controller → API → frontend

Selesaikan satu halaman baru lanjut ke berikutnya.

## Placeholder Style

**Ghost UI**: Placeholder dengan text seperti "Ketuk untuk tambah..." atau "Belum ada data" saat state kosong, mengikuti pola Life mode DailySpread.

---

## 1. Muslim Daily Spread

### Database Schema

```sql
-- Sholat logs per day
CREATE TABLE sholat_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    sholat_name VARCHAR(20) NOT NULL, -- Subuh, Dzuhur, Ashar, Maghrib, Isya
    time VARCHAR(10), -- actual time prayed
    status VARCHAR(20) DEFAULT 'missed', -- missed, alone, jamaah
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, sholat_name)
);

-- Dzikir checklist per day
CREATE TABLE dzikir_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    dzikir_name VARCHAR(100) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, dzikir_name)
);

-- Quran target per day
CREATE TABLE quran_daily_targets (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    juz INTEGER,
    surah VARCHAR(100),
    ayat_start INTEGER,
    ayat_end INTEGER,
    progress INTEGER DEFAULT 0, -- percentage
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
);

-- Muhasabah text per day
CREATE TABLE muhasabah_entries (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
);
```

### API Endpoints

```
GET  /api/muslim/daily-spread?date=YYYY-MM-DD
POST /api/muslim/daily-spread/sholat
POST /api/muslim/daily-spread/dzikir
POST /api/muslim/daily-spread/quran-target
POST /api/muslim/daily-spread/muhasabah
```

### Ghost UI

- **Sholat Schedule**: 5 placeholder waktu sholat dengan checkbox kosong
- **Dzikir Checklist**: 6 placeholder checklist dzikir dengan "Tap untuk centang"
- **Quran Target**: Card kosong dengan text "Set target bacaan hari ini..."
- **Muhasabah**: Textarea dengan placeholder "Tulis refleksi harian..."

---

## 2. Sholat Tracker

### Database Schema

```sql
-- Weekly sholat tracking
CREATE TABLE sholat_weekly_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL, -- specific date
    prayer_name VARCHAR(20) NOT NULL, -- Subuh, Dzuhur, Ashar, Maghrib, Isya
    status VARCHAR(20) DEFAULT 'missed', -- missed, alone, jamaah
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, prayer_name)
);

-- Sunnah prayer tracking
CREATE TABLE sunnah_prayer_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    prayer_name VARCHAR(50) NOT NULL, -- Tahajud, Dhuha, Rawatib Qabliyah, Rawatib Ba'diyah
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, prayer_name)
);
```

### API Endpoints

```
GET  /api/muslim/sholat-tracker?week_start=YYYY-MM-DD
POST /api/muslim/sholat-tracker/log
POST /api/muslim/sholat-tracker/sunnah
```

### Ghost UI

- **Grid**: 5 baris sholat × 7 hari dengan semua cell menampilkan icon "minus" atau "tap to log"
- **Sunnah**: 4 card sholat sunnah dengan checkbox kosong per hari

---

## 3. Quran Journal

### Database Schema

```sql
-- Reading log
CREATE TABLE quran_reading_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    juz INTEGER NOT NULL,
    surah VARCHAR(100) NOT NULL,
    ayat_start INTEGER,
    ayat_end INTEGER,
    pages INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Hifz progress
CREATE TABLE hifz_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    surah VARCHAR(100) NOT NULL,
    total_ayat INTEGER NOT NULL,
    memorized INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'not-started', -- not-started, in-progress, done
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, surah)
);

-- Tadabbur notes
CREATE TABLE tadabbur_notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    surah VARCHAR(100) NOT NULL,
    ayat VARCHAR(50) NOT NULL,
    arabic TEXT,
    reflection TEXT,
    color VARCHAR(50) DEFAULT 'bg-blue-50',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### API Endpoints

```
GET  /api/muslim/quran-journal
POST /api/muslim/quran-journal/reading-log
POST /api/muslim/quran-journal/hifz
GET  /api/muslim/quran-journal/tadabbur
POST /api/muslim/quran-journal/tadabbur
PUT  /api/muslim/quran-journal/tadabbur/{id}
DELETE /api/muslim/quran-journal/tadabbur/{id}
```

### Ghost UI

- **Progress**: Card kosong "Mulai tadarus hari ini..."
- **Reading Log**: Tabel dengan 1 row placeholder "Belum ada log bacaan"
- **Hafalan**: List kosong "Belum ada progress hafalan. Mulai dari Juz 30..."
- **Tadabbur**: Sticky note kosong "Tambah catatan tadabbur..."

---

## 4. Dzikir

### Database Schema

```sql
-- Dzikir counter (ba'da sholat)
CREATE TABLE dzikir_counters (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL, -- Subhanallah, Alhamdulillah, Allahu Akbar
    count INTEGER DEFAULT 0,
    target INTEGER DEFAULT 33,
    date DATE NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, name, date)
);

-- Morning dzikir checklist
CREATE TABLE dzikir_morning_checklist (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    item_text VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, item_text)
);

-- Evening dzikir checklist
CREATE TABLE dzikir_evening_checklist (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    item_text VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, item_text)
);

-- Custom dzikir
CREATE TABLE custom_dzikir (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    text VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 0,
    target INTEGER DEFAULT 100,
    date DATE NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### API Endpoints

```
GET  /api/muslim/dzikir?date=YYYY-MM-DD
POST /api/muslim/dzikir/counter
POST /api/muslim/dzikir/morning
POST /api/muslim/dzikir/evening
POST /api/muslim/dzikir/custom
PUT  /api/muslim/dzikir/custom/{id}
DELETE /api/muslim/dzikir/custom/{id}
```

### Ghost UI

- **Counter**: 3 card dzikir dengan counter 0/33 dan button "+" disabled
- **Morning/Evening**: Checklist dengan placeholder items "Belum ada dzikir"
- **Custom**: Card "Tambah dzikir custom..." dengan button

---

## 5. Muhasabah

### Database Schema

```sql
-- Good deeds
CREATE TABLE good_deeds (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    text VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sins to repent
CREATE TABLE sins_to_repent (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    text VARCHAR(255) NOT NULL,
    level VARCHAR(20) DEFAULT 'sedang', -- ringan, sedang, berat
    repented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Improvements
CREATE TABLE improvements (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    text VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'sedang', -- rendah, sedang, tinggi
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Gratitude items
CREATE TABLE gratitude_items (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Istighfar tracker
CREATE TABLE istighfar_tracker (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    target INTEGER DEFAULT 100,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
);
```

### API Endpoints

```
GET  /api/muslim/muhasabah?date=YYYY-MM-DD
POST /api/muslim/muhasabah/good-deed
PUT  /api/muslim/muhasabah/good-deed/{id}
DELETE /api/muslim/muhasabah/good-deed/{id}
POST /api/muslim/muhasabah/sin
POST /api/muslim/muhasabah/improvement
POST /api/muslim/muhasabah/gratitude
POST /api/muslim/muhasabah/istighfar
```

### Ghost UI

- **Good Deeds**: 3 placeholder "Tambah amal baik..." dengan checkbox
- **Sins**: Card kosong "Catat dosa untuk bertaubat..."
- **Improvements**: 3 placeholder "Target perbaikan..."
- **Gratitude**: 3 placeholder "Syukur hari ini..."
- **Istighfar**: Grid 7 hari dengan counter 0/100

---

## Implementation Order

1. Muslim Daily Spread (core daily feature)
2. Sholat Tracker (tracking feature)
3. Quran Journal (reading progress)
4. Dzikir (counter feature)
5. Muhasabah (reflection feature)

## Technical Notes

- All tables use SQLite (existing config)
- Foreign key to users table for authentication
- Auto-save with debounce (1 second delay)
- Date-based queries for daily/weekly views
- Consistent with Life mode DailySpread patterns