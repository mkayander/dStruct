import type { Translation } from "../i18n-types";

const id: Record<keyof Translation, string> = {
  ACTION: "Aksi",
  ADD_ARGUMENT: "Tambah argumen",
  ADD_NEW_SOLUTION: "Tambah solusi baru",
  ARGUMENTS: "Argumen",
  BROWSE: "Jelajahi",
  BROWSE_PROJECTS: "Jelajahi proyek",
  BACK: "Kembali",
  CALLSTACK: "Tumpukan panggilan",
  CANCEL: "Batal",
  CODE: "Kode",
  CHOOSE_LOCALE: "Pilih bahasa...",
  CODE_COPIED_TO_CLIPBOARD: "Kode disalin ke clipboard",
  CODE_RUNNER: "Pelari kode",
  CONSOLE_OUTPUT: "Output konsol",
  CONTINUE: "Lanjutkan",
  COPY: "Salin",
  COPY_CODE_TO_CLIPBOARD: "Salin kode ke clipboard",
  CREATE_NEW_PROJECT: "Buat proyek baru",
  CURRENT_PROJECT: "Proyek saat ini",
  CURRENT_USER_ACCOUNT: "Akun pengguna saat ini",
  DARK_MODE: "Mode gelap",
  DASHBOARD: "Dasbor",
  DATA_STRUCTURES_SIMPLIFIED: "Struktur data disederhanakan",
  DELETE: "Hapus",
  DELETE_THIS_PROJECT: "Hapus proyek ini",
  DELETE_X_ARGUMENT: "Hapus argumen {name:string}",
  DAILY_PROBLEM_NAV: "Soal harian",
  DESCRIPTION: "Deskripsi",
  DSTRUCT_LOGO: "Logo DStruct",
  EDIT_AND_SAVE:
    "Edit <code>pages/index.tsx</code> dan simpan untuk memuat ulang.",
  EDIT_SELECTED_PROJECT: "Edit proyek terpilih",
  EDIT_SOLUTION: "Edit solusi",
  EDIT_TEST_CASE: "Edit kasus uji",
  EDIT_TEST_CASE_SUMMARY: "Edit detail kasus uji Anda.",
  FEEDBACK: "Masukan",
  FORWARD: "Maju",
  FORMATTING_ICON: "Ikon pemformatan",
  FORMAT_CODE_WITH: "Format kode dengan",
  FORMAT_CODE_WITH_BLACK: "Format code with Black (Pyodide)",
  HI: "Halo {name:string}!",
  INPUT: "Masukan",
  LANGUAGE: "Bahasa",
  LOGOUT: "Keluar",
  MAIN_MENU: "Menu utama",
  MS: "md",
  NAME: "Nama",
  NEW: "Baru",
  NODE: "Node",
  NO_DATA: "Tidak ada data",
  OPEN_OPTIONS: "Buka opsi",
  OUTPUT: "Keluaran",
  PANEL_TABS: "Tab panel",
  PENDING_CHANGES: "Perubahan tertunda",
  PLAYBACK_INTERVAL: "Interval pemutaran",
  PLAYGROUND: "Playground",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Masukkan nama akun LeetCode Anda:",
  PROFILE: "Profil",
  PROJECT: "Proyek",
  PROJECT_BROWSER: "Penjelajah proyek",
  SEARCH_PROJECTS: "Cari proyek berdasarkan judul...",
  NO_PROJECTS_FOUND: "Tidak ada proyek ditemukan",
  NO_PROJECTS_MATCH_FILTERS: "Tidak ada proyek yang cocok dengan filter",
  FILTERS: "Filter",
  FILTER_BY_DIFFICULTY: "Tingkat kesulitan",
  SHOW_ONLY_NEW: "Hanya proyek baru",
  SHOW_ONLY_MINE: "Hanya proyek saya",
  CLEAR_ALL_FILTERS: "Hapus semua filter",
  SORT_BY: "Urutkan berdasarkan",
  SORT_TITLE: "Judul",
  SORT_TITLE_ASC: "Judul (A-Z)",
  SORT_TITLE_DESC: "Judul (Z-A)",
  SORT_DIFFICULTY: "Kesulitan",
  SORT_DIFFICULTY_ASC: "Kesulitan (Mudah → Sulit)",
  SORT_DIFFICULTY_DESC: "Kesulitan (Sulit → Mudah)",
  SORT_DATE: "Tanggal",
  SORT_DATE_ASC: "Tanggal (terbaru dulu)",
  SORT_DATE_DESC: "Tanggal (terlama dulu)",
  SORT_CATEGORY: "Kategori",
  SORT_CATEGORY_ASC: "Kategori (A-Z)",
  SORT_CATEGORY_DESC: "Kategori (Z-A)",
  REPLAY: "Putar ulang",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Putar ulang visualisasi hasil kode sebelumnya",
  RESET: "Setel ulang",
  RESULTS: "Hasil",
  RESET_DATA_STRUCTURES:
    "Setel ulang struktur data ke keadaan awal",
  RETRY: "Coba lagi",
  RETURNED: "Dikembalikan",
  RUN: "Jalankan",
  RUNTIME: "Waktu jalan",
  RUN_CODE: "Jalankan kode",
  SAVED_IN_THE_CLOUD: "Disimpan di cloud",
  SELECTED_LOCALE: "Bahasa terpilih:",
  SETTINGS: "Pengaturan",
  SIGN_IN: "Masuk",
  SIGN_IN_FAILED: "Gagal masuk",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Masuk untuk melacak progres dan lainnya!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Masuk dengan GitHub atau Google di pojok kanan atas",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Kompleksitas ruang",
  SUBMIT: "Kirim",
  SUCCESS: "Berhasil",
  SYNCING_WITH_SERVER: "Menyinkronkan dengan server",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Deskripsi kasus uji opsional",
  TEST_CASE_NAME_HELPER_TEXT: "Nama singkat kasus uji",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Anda dapat mengedit slug di URL kasus uji ini",
  TIMESTAMP: "Stempel waktu",
  TIME_COMPLEXITY: "Kompleksitas waktu",
  TODAY: "Hari ini {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Penampil pohon",
  TRY_IT_OUT_NOW: "Coba sekarang",
  TYPE: "Tipe",
  UPDATE: "Perbarui",
  USERNAME: "Nama pengguna",
  USER_DASHBOARD: "Dasbor {name:string}",
  USER_SETTINGS: "Pengaturan pengguna",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualisasikan soal LeetCode langsung dari kode Anda",
  YOUR_CHANGES_WILL_BE_LOST: "Perubahan Anda akan hilang",
  YOUR_LEETCODE_ACCOUNT_NAME: "Nama akun LeetCode Anda:",
  YOUR_NAME: "Nama Anda:",
  YOU_DONT_OWN_THIS_PROJECT: "Anda bukan pemilik proyek ini",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Anda harus masuk untuk menyimpan kode",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Jalankan kode terlebih dahulu",

  HOME_LANDING_TITLE:
    "Kode Anda, bingkai demi bingkai. Melangkah maju. Melangkah mundur.",
  HOME_LANDING_SUBTITLE:
    "Playground bergaya LeetCode di mana solusi Anda menjadi jejak eksekusi visual untuk pohon, graf, grid, struktur tertaut, dan peta bersarang. JavaScript dan Python di browser, pemutaran ulang langkah demi langkah, dan statistik waktu opsional untuk JS.",
  HOME_HERO_FAQ_LINK: "Pertanyaan umum",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Langkah {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Putar",
  HOME_LANDING_PREVIEW_PAUSE: "Jeda",
  HOME_PREVIEW_STEP_BACK: "Langkah mundur",
  HOME_PREVIEW_STEP_FORWARD: "Langkah maju",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Gagal memuat pratinjau beranda.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Kesalahan tak terduga saat menginisialisasi pratinjau.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "balik pohon biner",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "cek jalur di graf",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "jalur terpendek di matriks biner",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Soal harian",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Soal hari ini",
  QUESTION_OF_TODAY_LABEL: "Soal hari ini",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Tidak ada proyek untuk \"{query:string}\"",
  HOME_SECTION_HOW_IT_WORKS: "Cara kerja",
  HOME_HOW_STEP_1_TITLE: "Tulis solusi Anda",
  HOME_HOW_STEP_1_BODY:
    "Gunakan editor bawaan dengan pola yang familiar untuk setiap kategori.",
  HOME_HOW_STEP_2_TITLE: "Jalankan dan rekam",
  HOME_HOW_STEP_2_BODY:
    "API yang dilacak mengubah kerja struktural menjadi tumpukan bingkai—tanpa animasi siap pakai.",
  HOME_HOW_STEP_3_TITLE: "Geser timeline",
  HOME_HOW_STEP_3_BODY:
    "Maju dan mundur, ubah kecepatan, periksa setiap operasi di log.",
  HOME_SECTION_WHY_DSTUCT: "Kemampuan",
  HOME_PILLAR_VIS_TITLE: "Lihat algoritma, bukan hanya output",
  HOME_PILLAR_VIS_BODY:
    "Putar ulang perubahan struktur data. Pahami dan debug dengan jejak eksekusi nyata.",
  HOME_PILLAR_WORKERS_TITLE: "UI mulus saat kode berjalan",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript di Web Worker; Python dengan Pyodide di worker sendiri—halaman tetap responsif.",
  HOME_PILLAR_REPLAY_TITLE: "Pemutaran time-travel",
  HOME_PILLAR_REPLAY_BODY:
    "Putar, jeda, langkah, ulang, atur kecepatan—termasuk pintasan keyboard.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Banyak run dengan median, persentil, dan grafik. Mode benchmark hanya JS saat ini.",
  HOME_SECTION_LANGUAGES: "Dua bahasa, satu playground",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Berjalan lokal di worker—tanpa bolak-balik untuk visualisasi. Dukungan benchmark penuh.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "CPython asli via Pyodide di browser—tanpa instalasi. Pramuat saat buka solusi Python; kunjungan pertama mengunduh runtime (~30 MB, lalu cache). Hanya pustaka standar.",
  HOME_SECTION_TRY_DEMOS: "Galeri algoritma",
  HOME_TRY_DEMOS_LEAD:
    "Buka playground pilihan untuk melihat debugger pada soal nyata, atau ke browser penuh.",
  HOME_DEMO_TREE: "Pohon biner",
  HOME_DEMO_GRAPH: "Jalur di graf",
  HOME_DEMO_GRID: "BFS grid",
  HOME_DEMO_TRIE: "Trie / peta",
  HOME_SECTION_FAQ: "Pertanyaan umum",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Simpan progres di cloud",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Masuk untuk menyinkronkan proyek, kasus uji, dan solusi. Jelajahi contoh publik tanpa akun.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Eksekusi di browser; masuk untuk menyimpan dan fitur sosial.",
  HOME_OPEN_PROFILE: "Buka profil",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Tidak dapat membuat tautan profil. Buka dari menu akun di header.",
  HOME_DAILY_QUESTION_ERROR:
    "Gagal memuat soal harian. Coba lagi nanti.",
  HOME_DAILY_SECTION_TITLE: "Bingung mau menyelesaikan apa?",
  HOME_DAILY_SECTION_LEAD:
    "Ini soal harian dari LeetCode—buka di playground saat siap.",

  HOME_FAQ_Q_01: "Mengapa tidak ada visualisasi setelah menjalankan?",
  HOME_FAQ_A_01:
    "Pemutaran visual berasal dari API struktur data terlacak dStruct. Pilih kategori dan wrapper yang diharapkan playground. Objek polos tanpa API itu mungkin mencetak output tetapi tidak replay langkah demi langkah.",
  HOME_FAQ_Q_02: "Soal dan struktur apa yang didukung?",
  HOME_FAQ_A_02:
    "Pohon, BST, linked list, graf, grid dan matriks, array, heap, stack, trie, DP, dua pointer, jendela geser, backtracking, dan lainnya. Jelajahi playground atau kategori saat membuat proyek.",
  HOME_FAQ_Q_03: "Apakah saya perlu menginstal Python?",
  HOME_FAQ_A_03:
    "Tidak untuk penggunaan normal. JS di Web Worker; Python dengan Pyodide. Server Python lokal opsional untuk pengembang.",
  HOME_FAQ_Q_04: "Apakah kode saya berjalan di server Anda?",
  HOME_FAQ_A_04:
    "Secara default tidak—eksekusi di browser. Menyimpan dan cloud memakai backend seperti aplikasi web lain.",
  HOME_FAQ_Q_05: "Bisakah JavaScript dan Python?",
  HOME_FAQ_A_05:
    "Ya. Proyek bisa punya solusi JS dan Python terpisah. Benchmark hanya JavaScript saat ini.",
  HOME_FAQ_Q_06: "Mengapa Python menampilkan bilah muat?",
  HOME_FAQ_A_06:
    "Pyodide dimuat di latar saat membuka halaman Python. Kunjungan pertama mengunduh runtime (~30 MB); startup WASM bisa beberapa detik bahkan dari cache.",
  HOME_FAQ_Q_07: "NumPy atau pip?",
  HOME_FAQ_A_07:
    "Tidak di playground default—hanya pustaka standar. Impor pihak ketiga gagal.",
  HOME_FAQ_Q_08: "Berapa lama satu eksekusi bisa berjalan?",
  HOME_FAQ_A_08:
    "Python timeout 30 detik default; worker dibuat ulang. Pembatalan kasar untuk beban sangat berat.",
  HOME_FAQ_Q_09: "Bagaimana menyimpan pekerjaan?",
  HOME_FAQ_A_09:
    "Proyek publik dan editor tanpa masuk. Untuk persistensi, masuk.",
  HOME_FAQ_Q_10: "Berbagi proyek?",
  HOME_FAQ_A_10:
    "Ya. Buat proyek publik dan gunakan Jelajahi.",
  HOME_FAQ_Q_11: "Menghubungkan akun LeetCode untuk apa?",
  HOME_FAQ_A_11:
    "Fitur profil opsional, URL soal untuk metadata, pintasan. Pengiriman solusi tetap di LeetCode.",
  HOME_FAQ_Q_12: "Mengukur kecepatan solusi?",
  HOME_FAQ_A_12:
    "Ya untuk JavaScript—mode Benchmark. Python belum.",
  HOME_FAQ_Q_13: "HP atau tablet?",
  HOME_FAQ_A_13:
    "Alur ramah mobile dengan keep-alive saat ganti tab. Sesi edit panjang lebih nyaman di desktop.",
  HOME_FAQ_Q_14: "Apakah dStruct open source?",
  HOME_FAQ_A_14:
    "Ya. Lihat LICENSE di repositori (AGPL-3.0).",
};

export default id;
