import type { Translation } from "../i18n-types";

const pl: Record<keyof Translation, string> = {
  ACTION: "Akcja",
  ADD_ARGUMENT: "Dodaj argument",
  ADD_NEW_SOLUTION: "Dodaj nowe rozwiązanie",
  ARGUMENTS: "Argumenty",
  BROWSE: "Przeglądaj",
  BROWSE_PROJECTS: "Przeglądaj projekty",
  BACK: "Wstecz",
  CALLSTACK: "Stos wywołań",
  CANCEL: "Anuluj",
  CODE: "Kod",
  CHOOSE_LOCALE: "Wybierz język...",
  CODE_COPIED_TO_CLIPBOARD: "Skopiowano kod do schowka",
  CODE_RUNNER: "Runner kodu",
  CONSOLE_OUTPUT: "Wyjście konsoli",
  CONTINUE: "Kontynuuj",
  COPY: "Kopiuj",
  COPY_CODE_TO_CLIPBOARD: "Kopiuj kod do schowka",
  CREATE_NEW_PROJECT: "Utwórz nowy projekt",
  CURRENT_PROJECT: "Bieżący projekt",
  CURRENT_USER_ACCOUNT: "Bieżące konto użytkownika",
  DARK_MODE: "Tryb ciemny",
  DASHBOARD: "Panel",
  DATA_STRUCTURES_SIMPLIFIED: "Uproszczone struktury danych",
  DELETE: "Usuń",
  DELETE_THIS_PROJECT: "Usuń ten projekt",
  DELETE_X_ARGUMENT: "Usuń argument {name:string}",
  DAILY_PROBLEM_NAV: "Zadanie dnia",
  DESCRIPTION: "Opis",
  DSTRUCT_LOGO: "Logo DStruct",
  EDIT_AND_SAVE:
    "Edytuj <code>pages/index.tsx</code> i zapisz, aby przeładować.",
  EDIT_SELECTED_PROJECT: "Edytuj wybrany projekt",
  EDIT_SOLUTION: "Edytuj rozwiązanie",
  EDIT_TEST_CASE: "Edytuj przypadek testowy",
  EDIT_TEST_CASE_SUMMARY: "Edytuj szczegóły przypadku testowego.",
  FEEDBACK: "Opinie",
  FORWARD: "Dalej",
  FORMATTING_ICON: "Ikona formatowania",
  FORMAT_CODE_WITH: "Formatuj kod za pomocą",
  HI: "Cześć, {name:string}!",
  INPUT: "Wejście",
  LANGUAGE: "Język",
  LOGOUT: "Wyloguj",
  MAIN_MENU: "Menu główne",
  MS: "ms",
  NAME: "Nazwa",
  NEW: "Nowy",
  NODE: "Węzeł",
  NO_DATA: "Brak danych",
  OPEN_OPTIONS: "Otwórz opcje",
  OUTPUT: "Wyjście",
  PANEL_TABS: "Zakładki panelu",
  PENDING_CHANGES: "Niezapisane zmiany",
  PLAYBACK_INTERVAL: "Interwał odtwarzania",
  PLAYGROUND: "Piaskownica",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Podaj nazwę konta LeetCode:",
  PROFILE: "Profil",
  PROJECT: "Projekt",
  PROJECT_BROWSER: "Przeglądarka projektów",
  SEARCH_PROJECTS: "Szukaj projektów po tytule...",
  NO_PROJECTS_FOUND: "Nie znaleziono projektów",
  NO_PROJECTS_MATCH_FILTERS: "Żaden projekt nie pasuje do filtrów",
  FILTERS: "Filtry",
  FILTER_BY_DIFFICULTY: "Trudność",
  SHOW_ONLY_NEW: "Tylko nowe projekty",
  SHOW_ONLY_MINE: "Tylko moje projekty",
  CLEAR_ALL_FILTERS: "Wyczyść wszystkie filtry",
  SORT_BY: "Sortuj według",
  SORT_TITLE: "Tytuł",
  SORT_TITLE_ASC: "Tytuł (A-Z)",
  SORT_TITLE_DESC: "Tytuł (Z-A)",
  SORT_DIFFICULTY: "Trudność",
  SORT_DIFFICULTY_ASC: "Trudność (Łatwe → Trudne)",
  SORT_DIFFICULTY_DESC: "Trudność (Trudne → Łatwe)",
  SORT_DATE: "Data",
  SORT_DATE_ASC: "Data (najnowsze pierwsze)",
  SORT_DATE_DESC: "Data (najstarsze pierwsze)",
  SORT_CATEGORY: "Kategoria",
  SORT_CATEGORY_ASC: "Kategoria (A-Z)",
  SORT_CATEGORY_DESC: "Kategoria (Z-A)",
  REPLAY: "Powtórz",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Powtórz poprzednią wizualizację wyniku kodu",
  RESET: "Resetuj",
  RESULTS: "Wyniki",
  RESET_DATA_STRUCTURES:
    "Resetuj struktury danych do stanu początkowego",
  RETRY: "Spróbuj ponownie",
  RETURNED: "Zwrócono",
  RUN: "Uruchom",
  RUNTIME: "Czas wykonania",
  RUN_CODE: "Uruchom kod",
  SAVED_IN_THE_CLOUD: "Zapisano w chmurze",
  SELECTED_LOCALE: "Wybrany język:",
  SETTINGS: "Ustawienia",
  SIGN_IN: "Zaloguj się",
  SIGN_IN_FAILED: "Logowanie nie powiodło się",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Zaloguj się, aby śledzić postępy i więcej!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Zaloguj się przez GitHub lub Google w prawym górnym rogu",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Złożoność pamięciowa",
  SUBMIT: "Wyślij",
  SUCCESS: "Sukces",
  SYNCING_WITH_SERVER: "Synchronizacja z serwerem",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Opcjonalny opis przypadku testowego",
  TEST_CASE_NAME_HELPER_TEXT: "Krótka nazwa przypadku testowego",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Możesz edytować slug w URL tego przypadku testowego",
  TIMESTAMP: "Znacznik czasu",
  TIME_COMPLEXITY: "Złożoność czasowa",
  TODAY: "Dziś jest {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Podgląd drzewa",
  TRY_IT_OUT_NOW: "Wypróbuj teraz",
  TYPE: "Typ",
  UPDATE: "Aktualizuj",
  USERNAME: "Nazwa użytkownika",
  USER_DASHBOARD: "Panel użytkownika {name:string}",
  USER_SETTINGS: "Ustawienia użytkownika",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Wizualizuj zadania LeetCode prosto z kodu",
  YOUR_CHANGES_WILL_BE_LOST: "Zmiany zostaną utracone",
  YOUR_LEETCODE_ACCOUNT_NAME: "Nazwa konta LeetCode:",
  YOUR_NAME: "Twoje imię:",
  YOU_DONT_OWN_THIS_PROJECT: "Nie jesteś właścicielem tego projektu",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Musisz być zalogowany, aby zapisać kod",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Najpierw uruchom kod",

  HOME_LANDING_TITLE:
    "Twój kod, klatka po klatce. Krok naprzód. Krok wstecz.",
  HOME_LANDING_SUBTITLE:
    "Piaskownica w stylu LeetCode, gdzie rozwiązanie staje się wizualnym śladem wykonania: drzewa, grafy, siatki, struktury powiązane i zagnieżdżone mapy. JavaScript i Python w przeglądarce, odtwarzanie krok po kroku i opcjonalny pomiar czasu dla JS.",
  HOME_HERO_FAQ_LINK: "Często zadawane pytania",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Krok {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Odtwórz",
  HOME_LANDING_PREVIEW_PAUSE: "Pauza",
  HOME_PREVIEW_STEP_BACK: "Krok wstecz",
  HOME_PREVIEW_STEP_FORWARD: "Krok naprzód",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Nie udało się załadować podglądu strony głównej.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Nieoczekiwany błąd inicjalizacji podglądu.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "odwróć drzewo binarne",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "ścieżka w grafie",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "najkrótsza ścieżka w macierzy binarnej",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Zadanie dnia",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Pytanie dnia",
  QUESTION_OF_TODAY_LABEL: "Pytanie dnia",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Nie znaleziono projektów dla „{query:string}”",
  HOME_SECTION_HOW_IT_WORKS: "Jak to działa",
  HOME_HOW_STEP_1_TITLE: "Napisz rozwiązanie",
  HOME_HOW_STEP_1_BODY:
    "Użyj wbudowanego edytora ze znanymi wzorcami dla każdej kategorii.",
  HOME_HOW_STEP_2_TITLE: "Uruchom i zapisz",
  HOME_HOW_STEP_2_BODY:
    "Śledzone API zamieniają pracę na stos ramek—bez gotowej animacji.",
  HOME_HOW_STEP_3_TITLE: "Przewijaj oś czasu",
  HOME_HOW_STEP_3_BODY:
    "Do przodu i wstecz, zmiana prędkości, podgląd każdej operacji w logu.",
  HOME_SECTION_WHY_DSTUCT: "Możliwości",
  HOME_PILLAR_VIS_TITLE: "Zobacz algorytm, nie tylko wynik",
  HOME_PILLAR_VIS_BODY:
    "Odtwarzaj zmiany struktur danych. Rozumiej i debuguj z prawdziwym trace.",
  HOME_PILLAR_WORKERS_TITLE: "Płynny interfejs podczas działania kodu",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript w Web Worker; Python przez Pyodide w osobnym workerze—strona pozostaje responsywna.",
  HOME_PILLAR_REPLAY_TITLE: "Odtwarzanie „podróży w czasie”",
  HOME_PILLAR_REPLAY_BODY:
    "Odtwarzanie, pauza, krok, powtórka, prędkość—także skróty klawiszowe.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Wiele uruchomień z medianą, percentylami i wykresem. Benchmark tylko dla JS.",
  HOME_SECTION_LANGUAGES: "Dwa języki, jedna piaskownica",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Lokalnie w workerze—bez dodatkowych zapytań o wizualizację. Pełny benchmark.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Prawdziwy CPython przez Pyodide—bez instalacji. Preload przy otwarciu Pythona; pierwsza wizyta pobiera runtime (~30 MB, potem cache). Tylko biblioteka standardowa.",
  HOME_SECTION_TRY_DEMOS: "Galeria algorytmów",
  HOME_TRY_DEMOS_LEAD:
    "Otwórz wybraną piaskownicę, by zobaczyć debugger na prawdziwym zadaniu, lub pełną przeglądarkę.",
  HOME_DEMO_TREE: "Drzewo binarne",
  HOME_DEMO_GRAPH: "Ścieżka w grafie",
  HOME_DEMO_GRID: "BFS na siatce",
  HOME_DEMO_TRIE: "Trie / mapa",
  HOME_SECTION_FAQ: "Częste pytania",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Zapisuj postępy w chmurze",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Zaloguj się, by synchronizować projekty, testy i rozwiązania. Publiczne przykłady bez konta.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Wykonanie w przeglądarce; logowanie dla zapisu i funkcji społecznościowych.",
  HOME_OPEN_PROFILE: "Otwórz profil",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Nie udało się zbudować linku profilu. Otwórz z menu konta w nagłówku.",
  HOME_DAILY_QUESTION_ERROR:
    "Nie udało się załadować zadania dnia. Spróbuj później.",
  HOME_DAILY_SECTION_TITLE: "Nie wiesz, co rozwiązać?",
  HOME_DAILY_SECTION_LEAD:
    "Oto dzienne zadanie LeetCode—otwórz w piaskownicy, gdy będziesz gotów.",

  HOME_FAQ_Q_01: "Dlaczego po uruchomieniu nie ma wizualizacji?",
  HOME_FAQ_A_01:
    "Wizualne odtwarzanie pochodzi ze śledzonych API struktur dStruct. Wybierz kategorię i oczekiwane opakowania. Zwykłe obiekty mogą wypisać tekst, ale nie krok-po-kroku replay.",
  HOME_FAQ_Q_02: "Jakie problemy i struktury są obsługiwane?",
  HOME_FAQ_A_02:
    "Drzewa, BST, listy, grafy, siatki i macierze, tablice, kopce, stosy, trie, DP, dwa wskaźniki, okno przesuwne, backtracking i więcej. Przeglądaj lub sprawdź kategorie przy tworzeniu projektu.",
  HOME_FAQ_Q_03: "Czy muszę instalować Pythona?",
  HOME_FAQ_A_03:
    "Nie przy zwykłym użyciu. JS w Web Worker; Python z Pyodide. Lokalny serwer opcjonalny dla devów.",
  HOME_FAQ_Q_04: "Czy kod działa na waszych serwerach?",
  HOME_FAQ_A_04:
    "Domyślnie nie—wykonanie w przeglądarce. Zapis i chmura używają backendu.",
  HOME_FAQ_Q_05: "JavaScript i Python razem?",
  HOME_FAQ_A_05:
    "Tak. Osobne rozwiązania JS i Python. Benchmark na razie tylko JS.",
  HOME_FAQ_Q_06: "Dlaczego Python pokazuje pasek ładowania?",
  HOME_FAQ_A_06:
    "Pyodide ładuje się w tle. Pierwsza wizyta ~30 MB runtime; start WASM może trwać sekundy.",
  HOME_FAQ_Q_07: "NumPy lub pip?",
  HOME_FAQ_A_07:
    "Nie w domyślnej piaskownicy—tylko stdlib. Importy zewnętrzne zawiodą.",
  HOME_FAQ_Q_08: "Jak długo może trwać uruchomienie?",
  HOME_FAQ_A_08:
    "Python: timeout 30 s; worker odtwarzany. Anulowanie zgrubne przy ciężkiej pracy.",
  HOME_FAQ_Q_09: "Jak zapisać pracę?",
  HOME_FAQ_A_09:
    "Publiczne projekty bez logowania. Aby trwale zapisać—zaloguj się.",
  HOME_FAQ_Q_10: "Udostępnianie projektów?",
  HOME_FAQ_A_10:
    "Tak. Projekt publiczny i Przeglądaj dla przykładów.",
  HOME_FAQ_Q_11: "Po co łączyć LeetCode?",
  HOME_FAQ_A_11:
    "Opcje profilu, URL zadania, skróty. Wysyłka rozwiązań nadal na LeetCode.",
  HOME_FAQ_Q_12: "Pomiar szybkości?",
  HOME_FAQ_A_12:
    "Tak dla JS—Benchmark. Python jeszcze nie.",
  HOME_FAQ_Q_13: "Telefon lub tablet?",
  HOME_FAQ_A_13:
    "Przyjazny mobile z keep-alive. Długa edycja wygodniejsza na desktopie.",
  HOME_FAQ_Q_14: "Open source?",
  HOME_FAQ_A_14:
    "Tak. Zobacz LICENSE (AGPL-3.0).",
};

export default pl;
