<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\DoaFavorite;
use App\Models\DoaLog;
use Illuminate\Http\Request;

class DoaController extends Controller
{
    // Static doa list
    private const DOA_LIST = [
        [
            'id' => 'doa_pagi',
            'name' => 'Doa Pagi',
            'arabic' => 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
            'latin' => 'Ashbahna wa asbahal mulku lillah, walhamdu lillah',
            'translation' => 'Kami memasuki waktu pagi dan kerajaan milik Allah, segala puji bagi Allah',
            'category' => 'pagi_petang',
        ],
        [
            'id' => 'doa_petang',
            'name' => 'Doa Petang',
            'arabic' => 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
            'latin' => 'Amsayna wa amsal mulku lillah, walhamdu lillah',
            'translation' => 'Kami memasuki waktu petang dan kerajaan milik Allah, segala puji bagi Allah',
            'category' => 'pagi_petang',
        ],
        [
            'id' => 'doa_masuk_rumah',
            'name' => 'Doa Masuk Rumah',
            'arabic' => 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ',
            'latin' => 'Allahumma inni as-aluka khairal mawlij',
            'translation' => 'Ya Allah, aku memohon kepada-Mu kebaikan tempat masuk',
            'category' => 'rumah',
        ],
        [
            'id' => 'doa_keluar_rumah',
            'name' => 'Doa Keluar Rumah',
            'arabic' => 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ',
            'latin' => 'Bismillahi tawakkaltu alallah',
            'translation' => 'Dengan nama Allah, aku bertawakkal kepada Allah',
            'category' => 'rumah',
        ],
        [
            'id' => 'doa_makan',
            'name' => 'Doa Makan',
            'arabic' => 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
            'latin' => 'Bismillahi wa ala barakatillah',
            'translation' => 'Dengan nama Allah dan dengan berkah Allah',
            'category' => 'makan_minum',
        ],
        [
            'id' => 'doa_selepas_makan',
            'name' => 'Doa Selepas Makan',
            'arabic' => 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
            'latin' => 'Alhamdulillahilladhi ath-amana wa saqana',
            'translation' => 'Segala puji bagi Allah yang telah memberi makan dan minum kepada kami',
            'category' => 'makan_minum',
        ],
        [
            'id' => 'doa_tidur',
            'name' => 'Doa Tidur',
            'arabic' => 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            'latin' => 'Bismikallahumma amutu wa ahya',
            'translation' => 'Dengan nama-Mu ya Allah, aku mati dan aku hidup',
            'category' => 'tidur',
        ],
        [
            'id' => 'doa_bangun',
            'name' => 'Doa Bangun Tidur',
            'arabic' => 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا',
            'latin' => 'Alhamdulillahilladhi ahyana ba da ma amaatana',
            'translation' => 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami',
            'category' => 'tidur',
        ],
        [
            'id' => 'doa_masuk_masjid',
            'name' => 'Doa Masuk Masjid',
            'arabic' => 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            'latin' => 'Allahumma iftah li abwaba rahmatik',
            'translation' => 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu',
            'category' => 'masjid',
        ],
        [
            'id' => 'doa_keluar_masjid',
            'name' => 'Doa Keluar Masjid',
            'arabic' => 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
            'latin' => 'Allahumma inni as-aluka min fadlik',
            'translation' => 'Ya Allah, aku memohon kepada-Mu dari karunia-Mu',
            'category' => 'masjid',
        ],
    ];

    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        // Get user's favorites
        $favorites = DoaFavorite::where('user_id', $user->id)
            ->get()
            ->keyBy('doa_id');

        // Get today's read logs
        $todayLogs = DoaLog::where('user_id', $user->id)
            ->where('date', $today)
            ->pluck('read', 'doa_name');

        // Merge static doa with user data
        $doaList = collect(self::DOA_LIST)->map(function ($doa) use ($favorites, $todayLogs) {
            $fav = $favorites->get($doa['id']);
            return [
                ...$doa,
                'is_favorite' => $fav !== null,
                'personal_note' => $fav?->personal_note,
                'memorized' => $fav?->memorized ?? 0,
                'read_today' => $todayLogs->get($doa['name']) ?? false,
            ];
        });

        // Categories for filtering
        $categories = [
            'all' => 'Semua',
            'pagi_petang' => 'Pagi & Petang',
            'rumah' => 'Rumah',
            'makan_minum' => 'Makan & Minum',
            'tidur' => 'Tidur',
            'masjid' => 'Masjid',
        ];

        return inertia('Muslim/Doa', [
            'doaList' => $doaList,
            'categories' => $categories,
            'stats' => [
                'totalDoa' => count(self::DOA_LIST),
                'memorized' => $favorites->where('memorized', '>=', 100)->count(),
                'readToday' => $todayLogs->filter()->count(),
            ],
        ]);
    }

    public function toggleFavorite(Request $request)
    {
        $validated = $request->validate([
            'doa_id' => 'required|string',
        ]);

        $favorite = DoaFavorite::where('user_id', $request->user()->id)
            ->where('doa_id', $validated['doa_id'])
            ->first();

        if ($favorite) {
            $favorite->delete();
        } else {
            DoaFavorite::create([
                'user_id' => $request->user()->id,
                'doa_id' => $validated['doa_id'],
            ]);
        }

        return back();
    }

    public function updateNote(Request $request)
    {
        $validated = $request->validate([
            'doa_id' => 'required|string',
            'personal_note' => 'nullable|string',
            'memorized' => 'nullable|integer|min:0|max:100',
        ]);

        DoaFavorite::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'doa_id' => $validated['doa_id'],
            ],
            [
                'personal_note' => $validated['personal_note'] ?? '',
                'memorized' => $validated['memorized'] ?? 0,
            ]
        );

        return back();
    }

    public function markRead(Request $request)
    {
        $validated = $request->validate([
            'doa_name' => 'required|string',
            'date' => 'required|date',
        ]);

        DoaLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'doa_name' => $validated['doa_name'],
            ],
            ['read' => true]
        );

        return back();
    }
}