import type { Translation } from "../i18n-types";

const tr: Record<keyof Translation, string> = {
  ACTION: "Eylem",
  ADD_ARGUMENT: "Argüman ekle",
  ADD_NEW_SOLUTION: "Yeni çözüm ekle",
  ARGUMENTS: "Argümanlar",
  BROWSE: "Göz at",
  BROWSE_PROJECTS: "Projelere göz at",
  BACK: "Geri",
  CALLSTACK: "Çağrı yığını",
  CANCEL: "İptal",
  CODE: "Kod",
  CHOOSE_LOCALE: "Dil seçin...",
  CODE_COPIED_TO_CLIPBOARD: "Kod panoya kopyalandı",
  CODE_RUNNER: "Kod çalıştırıcı",
  CONSOLE_OUTPUT: "Konsol çıktısı",
  CONTINUE: "Devam",
  COPY: "Kopyala",
  COPY_CODE_TO_CLIPBOARD: "Kodu panoya kopyala",
  CREATE_NEW_PROJECT: "Yeni proje oluştur",
  CURRENT_PROJECT: "Geçerli proje",
  CURRENT_USER_ACCOUNT: "Geçerli kullanıcı hesabı",
  DARK_MODE: "Karanlık mod",
  DASHBOARD: "Kontrol paneli",
  DATA_STRUCTURES_SIMPLIFIED: "Basitleştirilmiş veri yapıları",
  DELETE: "Sil",
  DELETE_THIS_PROJECT: "Bu projeyi sil",
  DELETE_X_ARGUMENT: "{name:string} argümanını sil",
  DAILY_PROBLEM_NAV: "Günün sorusu",
  DESCRIPTION: "Açıklama",
  DSTRUCT_LOGO: "DStruct logosu",
  EDIT_AND_SAVE:
    "<code>pages/index.tsx</code> dosyasını düzenleyip kaydederek yenileyin.",
  EDIT_SELECTED_PROJECT: "Seçili projeyi düzenle",
  EDIT_SOLUTION: "Çözümü düzenle",
  EDIT_TEST_CASE: "Test senaryosunu düzenle",
  EDIT_TEST_CASE_SUMMARY: "Test senaryosu ayrıntılarını düzenleyin.",
  FEEDBACK: "Geri bildirim",
  FORWARD: "İleri",
  FORMATTING_ICON: "Biçimlendirme simgesi",
  FORMAT_CODE_WITH: "Kodu şununla biçimlendir",
  HI: "Merhaba {name:string}!",
  INPUT: "Girdi",
  LANGUAGE: "Dil",
  LOGOUT: "Çıkış yap",
  MAIN_MENU: "Ana menü",
  MS: "ms",
  NAME: "Ad",
  NEW: "Yeni",
  NODE: "Düğüm",
  NO_DATA: "Veri yok",
  OPEN_OPTIONS: "Seçenekleri aç",
  OUTPUT: "Çıktı",
  PANEL_TABS: "Panel sekmeleri",
  PENDING_CHANGES: "Bekleyen değişiklikler",
  PLAYBACK_INTERVAL: "Oynatma aralığı",
  PLAYGROUND: "Oyun alanı",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Lütfen LeetCode hesap adınızı girin:",
  PROFILE: "Profil",
  PROJECT: "Proje",
  PROJECT_BROWSER: "Proje tarayıcısı",
  SEARCH_PROJECTS: "Projeleri başlığa göre ara...",
  NO_PROJECTS_FOUND: "Proje bulunamadı",
  NO_PROJECTS_MATCH_FILTERS: "Filtrelerinize uyan proje yok",
  FILTERS: "Filtreler",
  FILTER_BY_DIFFICULTY: "Zorluk",
  SHOW_ONLY_NEW: "Yalnızca yeni projeleri göster",
  SHOW_ONLY_MINE: "Yalnızca projelerimi göster",
  CLEAR_ALL_FILTERS: "Tüm filtreleri temizle",
  SORT_BY: "Sırala",
  SORT_TITLE: "Başlık",
  SORT_TITLE_ASC: "Başlık (A-Z)",
  SORT_TITLE_DESC: "Başlık (Z-A)",
  SORT_DIFFICULTY: "Zorluk",
  SORT_DIFFICULTY_ASC: "Zorluk (Kolay → Zor)",
  SORT_DIFFICULTY_DESC: "Zorluk (Zor → Kolay)",
  SORT_DATE: "Tarih",
  SORT_DATE_ASC: "Tarih (önce en yeni)",
  SORT_DATE_DESC: "Tarih (önce en eski)",
  SORT_CATEGORY: "Kategori",
  SORT_CATEGORY_ASC: "Kategori (A-Z)",
  SORT_CATEGORY_DESC: "Kategori (Z-A)",
  REPLAY: "Yeniden oynat",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Önceki kod sonucu görselleştirmesini yeniden oynat",
  RESET: "Sıfırla",
  RESULTS: "Sonuçlar",
  RESET_DATA_STRUCTURES:
    "Veri yapılarını başlangıç durumuna sıfırla",
  RETRY: "Yeniden dene",
  RETURNED: "Döndü",
  RUN: "Çalıştır",
  RUNTIME: "Çalışma süresi",
  RUN_CODE: "Kodu çalıştır",
  SAVED_IN_THE_CLOUD: "Buluta kaydedildi",
  SELECTED_LOCALE: "Seçilen dil:",
  SETTINGS: "Ayarlar",
  SIGN_IN: "Giriş yap",
  SIGN_IN_FAILED: "Giriş başarısız",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "İlerlemenizi takip etmek ve daha fazlası için giriş yapın!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Sağ üstten GitHub veya Google ile giriş yapın",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Uzay karmaşıklığı",
  SUBMIT: "Gönder",
  SUCCESS: "Başarılı",
  SYNCING_WITH_SERVER: "Sunucu ile senkronize ediliyor",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "İsteğe bağlı test senaryosu açıklaması",
  TEST_CASE_NAME_HELPER_TEXT: "Test senaryosu için kısa ad",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Bu test senaryosunun URL'sindeki slug'ı düzenleyebilirsiniz",
  TIMESTAMP: "Zaman damgası",
  TIME_COMPLEXITY: "Zaman karmaşıklığı",
  TODAY: "Bugün {date:Date|weekday}",
  TOKEN: "Jeton",
  TREE_VIEWER: "Ağaç görüntüleyici",
  TRY_IT_OUT_NOW: "Şimdi dene",
  TYPE: "Tür",
  UPDATE: "Güncelle",
  USERNAME: "Kullanıcı adı",
  USER_DASHBOARD: "{name:string} kontrol paneli",
  USER_SETTINGS: "Kullanıcı ayarları",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "LeetCode sorularınızı doğrudan kodunuzdan görselleştirin",
  YOUR_CHANGES_WILL_BE_LOST: "Değişiklikleriniz kaybolacak",
  YOUR_LEETCODE_ACCOUNT_NAME: "LeetCode hesap adınız:",
  YOUR_NAME: "Adınız:",
  YOU_DONT_OWN_THIS_PROJECT: "Bu projenin sahibi değilsiniz",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Kodu kaydetmek için giriş yapmalısınız",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Önce kodu çalıştırın",

  HOME_LANDING_TITLE:
    "Kodunuz, kare kare. İleri adım. Geri adım.",
  HOME_LANDING_SUBTITLE:
    "Çözümünüzün ağaçlar, grafikler, ızgaralar, bağlı yapılar ve iç içe haritalar için görsel bir yürütme izi olduğu LeetCode tarzı bir oyun alanı. Tarayıcıda JavaScript ve Python, adım adım oynatma ve JS için isteğe bağlı süre istatistikleri.",
  HOME_HERO_FAQ_LINK: "Sıkça sorulan sorular",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Adım {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Oynat",
  HOME_LANDING_PREVIEW_PAUSE: "Duraklat",
  HOME_PREVIEW_STEP_BACK: "Geri adım",
  HOME_PREVIEW_STEP_FORWARD: "İleri adım",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Açılış önizlemesi yüklenemedi.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Önizleme başlatılırken beklenmeyen hata.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "ikili ağacı ters çevir",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "grafikte yol var mı",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "ikili matriste en kısa yol",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Günün sorusu",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Bugünün sorusu",
  QUESTION_OF_TODAY_LABEL: "Bugünün sorusu",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "\"{query:string}\" için proje bulunamadı",
  HOME_SECTION_HOW_IT_WORKS: "Nasıl çalışır",
  HOME_HOW_STEP_1_TITLE: "Çözümünüzü yazın",
  HOME_HOW_STEP_1_BODY:
    "Her proje kategorisi için tanıdık kalıplarla yerleşik düzenleyiciyi kullanın.",
  HOME_HOW_STEP_2_TITLE: "Çalıştırın ve kaydedin",
  HOME_HOW_STEP_2_BODY:
    "İzlenen API'ler yapısal işi kare yığınına dönüştürür—hazır animasyon yok.",
  HOME_HOW_STEP_3_TITLE: "Zaman çizelgesinde gezinin",
  HOME_HOW_STEP_3_BODY:
    "İleri ve geri gidin, hızı değiştirin ve günlükteki her işlemi inceleyin.",
  HOME_SECTION_WHY_DSTUCT: "Özellikler",
  HOME_PILLAR_VIS_TITLE: "Yalnızca çıktıyı değil algoritmayı görün",
  HOME_PILLAR_VIS_BODY:
    "Veri yapılarınızın nasıl değiştiğini yeniden oynatın. Gerçek yürütme iziyle anlayın ve hata ayıklayın.",
  HOME_PILLAR_WORKERS_TITLE: "Kod çalışırken akıcı arayüz",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript Web Worker'da; Python kendi worker'ında Pyodide ile—sayfa duyarlı kalır.",
  HOME_PILLAR_REPLAY_TITLE: "Zaman yolculuğu oynatma",
  HOME_PILLAR_REPLAY_BODY:
    "Oynat, duraklat, adım, tekrar ve hız—klavye kısayolları dahil.",
  HOME_PILLAR_BENCH_TITLE: "JavaScript kıyaslama",
  HOME_PILLAR_BENCH_BODY:
    "Medyan, yüzdelikler ve grafikle birçok çalıştırma. Kıyaslama şimdilik yalnızca JS.",
  HOME_SECTION_LANGUAGES: "İki dil, bir oyun alanı",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Worker'da yerel çalışır—görselleştirme için gidiş-dönüş yok. Tam kıyaslama desteği.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Tarayıcıda Pyodide ile gerçek CPython—kurulum gerekmez. Python çözümü açınca ön yüklenir; ilk ziyaret çalışma zamanını indirir (~30 MB, sonra önbellek). Yalnızca standart kütüphane.",
  HOME_SECTION_TRY_DEMOS: "Algoritma galerisi",
  HOME_TRY_DEMOS_LEAD:
    "Gerçek bir sorunda hata ayıklayıcıyı görmek için seçilmiş oyun alanını açın veya tam tarayıcıya geçin.",
  HOME_DEMO_TREE: "İkili ağaç",
  HOME_DEMO_GRAPH: "Grafikte yol",
  HOME_DEMO_GRID: "Izgara BFS",
  HOME_DEMO_TRIE: "Trie / harita",
  HOME_SECTION_FAQ: "Yaygın sorular",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "İlerlemeyi bulutta kaydedin",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Projeleri, testleri ve çözümleri senkronize etmek için giriş yapın. Hesapsız genel örnekleri keşfedin.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Çalıştırmalar tarayıcıda; giriş kaydetme ve sosyal özellikler içindir.",
  HOME_OPEN_PROFILE: "Profili aç",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Profil bağlantısı oluşturulamadı. Üst menüden hesap menüsüyle açın.",
  HOME_DAILY_QUESTION_ERROR:
    "Günün sorusu yüklenemedi. Daha sonra deneyin.",
  HOME_DAILY_SECTION_TITLE: "Ne çözeceğinizi bilmiyor musunuz?",
  HOME_DAILY_SECTION_LEAD:
    "İşte LeetCode'dan günlük bir sorun—hazır olduğunuzda oyun alanında açın.",

  HOME_FAQ_Q_01: "Çalıştırdıktan sonra neden görselleştirme yok?",
  HOME_FAQ_A_01:
    "Görsel oynatma dStruct'ın izlenen veri yapısı API'lerinden gelir. Uygun kategori ve sarmalayıcıları seçin. Bu API'ler olmadan düz nesneler çıktı yazdırabilir ama adım adım tekrar üretemez.",
  HOME_FAQ_Q_02: "Hangi sorular ve yapılar destekleniyor?",
  HOME_FAQ_A_02:
    "Ağaçlar, BST, bağlı listeler, grafikler, ızgaralar ve matrisler, diziler, yığınlar, trie, DP, iki işaretçi, kayan pencere, geri izleme ve daha fazlası. Oyun alanına göz atın veya proje oluştururken kategorilere bakın.",
  HOME_FAQ_Q_03: "Python kurmam gerekir mi?",
  HOME_FAQ_A_03:
    "Normal kullanım için hayır. JS Web Worker'da; Python Pyodide ile tarayıcıda. Yerel Python sunucusu yalnızca geliştiriciler için isteğe bağlı.",
  HOME_FAQ_Q_04: "Kodum sizin sunucularınızda mı çalışır?",
  HOME_FAQ_A_04:
    "Varsayılan olarak hayır—yürütme tarayıcıda. Kayıt ve bulut her web uygulaması gibi backend kullanır.",
  HOME_FAQ_Q_05: "JavaScript ve Python birlikte?",
  HOME_FAQ_A_05:
    "Evet. Ayrı JS ve Python çözümleri. Kıyaslama şimdilik yalnızca JavaScript.",
  HOME_FAQ_Q_06: "Python neden yükleme çubuğu gösteriyor?",
  HOME_FAQ_A_06:
    "Python sayfası açılırken Pyodide arka planda yüklenir. İlk ziyaret ~30 MB çalışma zamanı; WASM başlangıcı önbellekten bile birkaç saniye sürebilir.",
  HOME_FAQ_Q_07: "NumPy veya pip?",
  HOME_FAQ_A_07:
    "Varsayılan oyun alanında hayır—yalnızca standart kütüphane. Üçüncü taraf içe aktarmalar başarısız olur.",
  HOME_FAQ_Q_08: "Bir çalıştırma ne kadar sürebilir?",
  HOME_FAQ_A_08:
    "Python varsayılan olarak 30 saniyede zaman aşımına uğrar; worker yeniden oluşturulur. Çok ağır işlerde iptal kaba kalır.",
  HOME_FAQ_Q_09: "Çalışmamı nasıl kaydederim?",
  HOME_FAQ_A_09:
    "Hesapsız genel projeler ve düzenleyici. Kalıcı kayıt için giriş yapın.",
  HOME_FAQ_Q_10: "Proje paylaşabilir miyim?",
  HOME_FAQ_A_10:
    "Evet. Projeyi herkese açın ve Göz at ile örnek bulun.",
  HOME_FAQ_Q_11: "LeetCode hesabı bağlamak ne işe yarar?",
  HOME_FAQ_A_11:
    "İsteğe bağlı profil, soru URL'si, kısayollar. Gönderim hâlâ LeetCode'da—dStruct yardımcı oyun alanıdır.",
  HOME_FAQ_Q_12: "Hız ölçebilir miyim?",
  HOME_FAQ_A_12:
    "Evet, JavaScript için—Kıyaslama modu. Python henüz yok.",
  HOME_FAQ_Q_13: "Telefon veya tablet?",
  HOME_FAQ_A_13:
    "Sekme değişiminde keep-alive ile mobil uyumlu akış. Uzun düzenleme masaüstünde daha kolay.",
  HOME_FAQ_Q_14: "dStruct açık kaynak mı?",
  HOME_FAQ_A_14:
    "Evet. LICENSE dosyasına bakın (AGPL-3.0).",
};

export default tr;
