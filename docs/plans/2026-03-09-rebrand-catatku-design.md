# Rebrand: Life OS → Mosiku

## Identitas Brand

| Aspek | Detail |
|-------|--------|
| Nama App | Mosiku |
| Tagline | "Semua hidupmu, satu catatan" |
| Mascot | Ciku — blob mochi, mata besar, tangan kecil, pegang pensil |
| Package name | tetap `oslife` (internal) |
| Asal nama | "Mochi" + "OS" + "ku" (personal) |

### Naming per Mode

- Life → "Mosiku"
- Muslim → "Mosiku Muslim"
- Creator → "Mosiku Creator"
- Work → "Mosiku Work"

## Visual Identity — Mascot Ciku

### Bentuk Dasar

- Blob/mochi shape — bulat bawah, agak lancip atas (tetesan air terbalik)
- Mata besar bulat hitam dengan highlight putih
- Pipi merah muda (blush)
- Tangan kecil tanpa jari (stub hands)
- Kaki kecil pendek
- Selalu pegang pensil kuning di tangan kanan
- Outline hand-drawn (doodle style)

### Variasi per Mode

| Mode | Warna Ciku | Aksesoris |
|------|-----------|-----------|
| Life (pink) | Pink pastel #F9A8D4 | Bandana pink + pensil |
| Muslim (green) | Hijau pastel #86EFAC | Peci/hijab + tasbih |
| Creator (orange) | Orange pastel #FDBA74 | Headset + kamera mini |
| Work (blue) | Biru pastel #93C5FD | Kacamata + laptop mini |

### Icon App

- Default: kepala Ciku (Life/pink) dalam lingkaran putih
- Outline doodle tipis
- Sizes: 512x512, 192x192, 64x64

## Perubahan Teknis

### Files yang Diupdate

| File | Perubahan |
|------|-----------|
| `public/manifest.json` | name, short_name, description |
| `resources/views/app.blade.php` | Meta tags, OG tags, structured data |
| `resources/js/Pages/Welcome.jsx` | Hero text, navbar brand |
| `resources/js/Components/Sidebar.jsx` | Logo image + brand text |
| `resources/js/Components/Header.jsx` | Brand references |
| `resources/js/config/modeConfig.js` | Mode labels |
| `public/favicon.ico` | Icon Ciku |

### Assets Baru

- `public/images/ciku-default.svg` — Ciku versi Life
- `public/images/ciku-muslim.svg` — Ciku versi Muslim
- `public/images/ciku-creator.svg` — Ciku versi Creator
- `public/images/ciku-work.svg` — Ciku versi Work
- `public/images/icon-192x192.png` — PWA icon
- `public/images/icon-512x512.png` — PWA icon

### Yang Tidak Berubah

- Package name (`oslife`)
- Warna theme per mode
- Layout, fitur, functionality
- Typography

### Notes

- SVG placeholder dibuat dulu untuk development
- File `docs/plans/ciku-mascot-prompts.md` berisi prompt untuk generate artwork final
- Artwork final bisa pakai AI image generator atau hire illustrator
