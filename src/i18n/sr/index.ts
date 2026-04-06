import type { Translation } from "../i18n-types";

const sr: Record<keyof Translation, string> = {
  ACTION: "Akcija",
  ADD_ARGUMENT: "Dodaj argument",
  ADD_NEW_SOLUTION: "Dodaj novo rešenje",
  ARGUMENTS: "Argumenti",
  BROWSE: "Pregled",
  BROWSE_PROJECTS: "Pregled projekata",
  BACK: "Nazad",
  CALLSTACK: "Stek poziva",
  CANCEL: "Otkaži",
  CODE: "Kod",
  CHOOSE_LOCALE: "Izaberite jezik...",
  CODE_COPIED_TO_CLIPBOARD: "Kod je kopiran u clipboard",
  CODE_RUNNER: "Izvršilac koda",
  CONSOLE_OUTPUT: "Izlaz konzole",
  CONTINUE: "Nastavi",
  COPY: "Kopiraj",
  COPY_CODE_TO_CLIPBOARD: "Kopiraj kod u clipboard",
  CREATE_NEW_PROJECT: "Kreiraj novi projekat",
  CURRENT_PROJECT: "Trenutni projekat",
  CURRENT_USER_ACCOUNT: "Trenutni korisnički nalog",
  DARK_MODE: "Tamni režim",
  DASHBOARD: "Kontrolna tabla",
  DATA_STRUCTURES_SIMPLIFIED: "Pojednostavljene strukture podataka",
  DELETE: "Obriši",
  DELETE_THIS_PROJECT: "Obriši ovaj projekat",
  DELETE_X_ARGUMENT: "Obriši argument {name:string}",
  DAILY_PROBLEM_NAV: "Dnevni zadatak",
  DESCRIPTION: "Opis",
  DSTRUCT_LOGO: "DStruct logo",
  EDIT_AND_SAVE:
    "Izmenite <code>pages/index.tsx</code> i sačuvajte da biste osvežili.",
  EDIT_SELECTED_PROJECT: "Uredi izabrani projekat",
  EDIT_SOLUTION: "Uredi rešenje",
  EDIT_TEST_CASE: "Uredi test slučaj",
  EDIT_TEST_CASE_SUMMARY: "Izmenite detalje test slučaja.",
  FEEDBACK: "Povratna informacija",
  FORWARD: "Napred",
  FORMATTING_ICON: "Ikona formatiranja",
  FORMAT_CODE_WITH: "Formatiraj kod sa",
  HI: "Zdravo, {name:string}!",
  INPUT: "Ulaz",
  LANGUAGE: "Jezik",
  LOGOUT: "Odjavi se",
  MAIN_MENU: "Glavni meni",
  MS: "ms",
  NAME: "Ime",
  NEW: "Novo",
  NODE: "Čvor",
  NO_DATA: "Nema podataka",
  OPEN_OPTIONS: "Otvori opcije",
  OUTPUT: "Izlaz",
  PANEL_TABS: "Kartice panela",
  PENDING_CHANGES: "Nepotvrđene izmene",
  PLAYBACK_INTERVAL: "Interval reprodukcije",
  PLAYGROUND: "Igralište",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Unesite ime vašeg LeetCode naloga:",
  PROFILE: "Profil",
  PROJECT: "Projekat",
  PROJECT_BROWSER: "Pregledač projekata",
  SEARCH_PROJECTS: "Pretraži projekte po naslovu...",
  NO_PROJECTS_FOUND: "Projekti nisu pronađeni",
  NO_PROJECTS_MATCH_FILTERS: "Nema projekata koji odgovaraju filterima",
  FILTERS: "Filteri",
  FILTER_BY_DIFFICULTY: "Težina",
  SHOW_ONLY_NEW: "Prikaži samo nove projekte",
  SHOW_ONLY_MINE: "Prikaži samo moje projekte",
  CLEAR_ALL_FILTERS: "Obriši sve filtere",
  SORT_BY: "Sortiraj po",
  SORT_TITLE: "Naslov",
  SORT_TITLE_ASC: "Naslov (A-Z)",
  SORT_TITLE_DESC: "Naslov (Z-A)",
  SORT_DIFFICULTY: "Težina",
  SORT_DIFFICULTY_ASC: "Težina (Lako → Teško)",
  SORT_DIFFICULTY_DESC: "Težina (Teško → Lako)",
  SORT_DATE: "Datum",
  SORT_DATE_ASC: "Datum (najnovije prvo)",
  SORT_DATE_DESC: "Datum (najstarije prvo)",
  SORT_CATEGORY: "Kategorija",
  SORT_CATEGORY_ASC: "Kategorija (A-Z)",
  SORT_CATEGORY_DESC: "Kategorija (Z-A)",
  REPLAY: "Ponovi",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Ponovi prethodnu vizualizaciju rezultata koda",
  RESET: "Resetuj",
  RESULTS: "Rezultati",
  RESET_DATA_STRUCTURES:
    "Vrati strukture podataka na početno stanje",
  RETRY: "Pokušaj ponovo",
  RETURNED: "Vraćeno",
  RUN: "Pokreni",
  RUNTIME: "Vreme izvršavanja",
  RUN_CODE: "Pokreni kod",
  SAVED_IN_THE_CLOUD: "Sačuvano u oblaku",
  SELECTED_LOCALE: "Izabrani jezik:",
  SETTINGS: "Podešavanja",
  SIGN_IN: "Prijavi se",
  SIGN_IN_FAILED: "Prijava nije uspela",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Prijavite se da pratite napredak i više toga!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Prijavite se sa GitHub ili Google u gornjem desnom uglu",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Prostorna složenost",
  SUBMIT: "Pošalji",
  SUCCESS: "Uspeh",
  SYNCING_WITH_SERVER: "Sinhronizacija sa serverom",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Opcioni opis test slučaja",
  TEST_CASE_NAME_HELPER_TEXT: "Kratak naziv test slučaja",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Možete urediti slug koji se koristi u URL-u ovog test slučaja",
  TIMESTAMP: "Vremenska oznaka",
  TIME_COMPLEXITY: "Vremenska složenost",
  TODAY: "Danas je {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Pregled drveta",
  TRY_IT_OUT_NOW: "Isprobajte sada",
  TYPE: "Tip",
  UPDATE: "Ažuriraj",
  USERNAME: "Korisničko ime",
  USER_DASHBOARD: "Kontrolna tabla korisnika {name:string}",
  USER_SETTINGS: "Korisnička podešavanja",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Vizualizujte svoje LeetCode zadatke direktno iz koda",
  YOUR_CHANGES_WILL_BE_LOST: "Vaše izmene će biti izgubljene",
  YOUR_LEETCODE_ACCOUNT_NAME: "Vaše ime na LeetCode:",
  YOUR_NAME: "Vaše ime:",
  YOU_DONT_OWN_THIS_PROJECT: "Niste vlasnik ovog projekta",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Morate biti prijavljeni da biste sačuvali kod",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Prvo pokrenite kod",

  HOME_LANDING_TITLE:
    "Vaš kod, kadar po kadar. Korak napred. Korak nazad.",
  HOME_LANDING_SUBTITLE:
    "Igralište u stilu LeetCode-a gde vaše rešenje postaje vizuelni trag izvršavanja: stabla, grafovi, mreže, povezane strukture i ugnježđene mape. JavaScript i Python u pregledaču, reprodukcija korak po korak i opciona merenja vremena za JS.",
  HOME_HERO_FAQ_LINK: "Česta pitanja",
  HOME_SECTION_HOW_IT_WORKS: "Kako radi",
  HOME_HOW_STEP_1_TITLE: "Napišite rešenje",
  HOME_HOW_STEP_1_BODY:
    "Koristite ugrađeni editor sa poznatim obrascima za svaku kategoriju projekta.",
  HOME_HOW_STEP_2_TITLE: "Pokrenite i snimite",
  HOME_HOW_STEP_2_BODY:
    "Praćeni API-ji pretvaraju rad sa strukturama u stek okvira — bez unapred pripremljene animacije.",
  HOME_HOW_STEP_3_TITLE: "Premotajte vremensku liniju",
  HOME_HOW_STEP_3_BODY:
    "Koraci napred i nazad, promena brzine i pregled svake operacije u logu.",
  HOME_SECTION_WHY_DSTUCT: "Mogućnosti",
  HOME_PILLAR_VIS_TITLE: "Vidite algoritam, ne samo izlaz",
  HOME_PILLAR_VIS_BODY:
    "Ponovite kako se menjaju strukture podataka. Razumite i debagujte uz pravi trag izvršavanja.",
  HOME_PILLAR_WORKERS_TITLE: "Fluidan UI dok kod radi",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript u Web Worker-u; Python preko Pyodide u posebnom worker-u — stranica ostaje odzivna.",
  HOME_PILLAR_REPLAY_TITLE: "Reprodukcija sa „putovanjem kroz vreme“",
  HOME_PILLAR_REPLAY_BODY:
    "Reprodukcija, pauza, korak, ponavljanje i brzina — uključujući prečice na tastaturi.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript-a",
  HOME_PILLAR_BENCH_BODY:
    "Mnogo pokretanja sa medijanom, percentilima i grafikonom. Benchmark režim trenutno samo za JS.",
  HOME_SECTION_LANGUAGES: "Dva jezika, jedno igralište",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Radi lokalno u worker-u — bez dodatnih zahteva za vizualizaciju. Puna podrška za benchmark.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Pravi CPython preko Pyodide u pregledaču — bez instalacije. Učitava se pri otvaranju Python rešenja; prva poseta preuzima runtime (zatim keš). Samo standardna biblioteka.",
  HOME_SECTION_TRY_DEMOS: "Galerija algoritama",
  HOME_TRY_DEMOS_LEAD:
    "Otvorite odabrano igralište da vidite debager na pravom zadatku ili pređite na pun pregledač projekata.",
  HOME_DEMO_TREE: "Binarno stablo",
  HOME_DEMO_GRAPH: "Put u grafu",
  HOME_DEMO_GRID: "BFS na mreži",
  HOME_DEMO_TRIE: "Trie / mapa",
  HOME_SECTION_FAQ: "Česta pitanja",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Sačuvajte napredak u oblaku",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Prijavite se da sinhronizujete projekte, test slučajeve i rešenja. Javni primeri su dostupni bez naloga.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Izvršavanje je u pregledaču; prijava služi za čuvanje i društvene funkcije.",
  HOME_OPEN_PROFILE: "Otvori profil",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Nismo mogli da napravimo link ka profilu. Otvorite profil iz menija naloga u zaglavlju.",
  HOME_DAILY_QUESTION_ERROR:
    "Nismo učitali dnevni zadatak. Pokušajte kasnije.",
  HOME_DAILY_SECTION_TITLE: "Ne znate šta da rešavate?",
  HOME_DAILY_SECTION_LEAD:
    "Evo dnevnog zadatka sa LeetCode-a — otvorite ga u igralištu kada budete spremni.",

  HOME_FAQ_Q_01: "Zašto nema vizualizacije posle pokretanja?",
  HOME_FAQ_A_01:
    "Vizuelna reprodukcija dolazi od praćenih API-ja struktura podataka dStruct-a. Izaberite odgovarajuću kategoriju i koristite omotače koje igralište očekuje. Obični objekti bez tih API-ja mogu ispisati izlaz, ali neće dati korak-po-korak replay.",
  HOME_FAQ_Q_02: "Koji problemi i strukture su podržani?",
  HOME_FAQ_A_02:
    "Stabla, BST, povezane liste, grafovi, mreže i matrice, nizovi, heap-ovi, stekovi, trie, DP, dva pokazivača, klizeći prozor, backtracking i više. Pregledajte igralište ili kategorije pri kreiranju projekta.",
  HOME_FAQ_Q_03: "Da li moram da instaliram Python?",
  HOME_FAQ_A_03:
    "Ne za običnu upotrebu. JavaScript u Web Worker-u; Python preko Pyodide u pregledaču. Lokalni Python server je opciono samo za developere.",
  HOME_FAQ_Q_04: "Da li se moj kod izvršava na vašim serverima?",
  HOME_FAQ_A_04:
    "Podrazumevano ne — izvršavanje je u pregledaču. Čuvanje projekata, prijava i oblak koriste backend kao i svaka web aplikacija.",
  HOME_FAQ_Q_05: "Mogu li JavaScript i Python?",
  HOME_FAQ_A_05:
    "Da. Projekti mogu imati odvojena JS i Python rešenja. Benchmark režim je trenutno samo za JavaScript.",
  HOME_FAQ_Q_06: "Zašto Python pokazuje traku učitavanja?",
  HOME_FAQ_A_06:
    "Pyodide se učitava u pozadini pri otvaranju Python stranice. Prva poseta preuzima runtime (~30 MB, zatim keš); WASM pokretanje može potrajati nekoliko sekundi čak i iz keša.",
  HOME_FAQ_Q_07: "Mogu li NumPy ili pip pakete?",
  HOME_FAQ_A_07:
    "Ne u podrazumevanom igralištu — samo standardna biblioteka. Uvozi trećih strana neće raditi.",
  HOME_FAQ_Q_08: "Koliko dugo može trajati izvršavanje?",
  HOME_FAQ_A_08:
    "Python se podrazumevano prekida posle 30 sekundi; worker se ponovo kreira. Otkazivanje je grubo za veoma teške zadatke.",
  HOME_FAQ_Q_09: "Kako da sačuvam rad?",
  HOME_FAQ_A_09:
    "Javni projekti i editor su dostupni bez prijave. Za trajno čuvanje projekata, test slučajeva i imenovanih rešenja — prijavite se.",
  HOME_FAQ_Q_10: "Mogu li deliti projekte ili učiti od drugih?",
  HOME_FAQ_A_10:
    "Da. Učinite projekat javnim i koristite Pregled za primere.",
  HOME_FAQ_Q_11: "Čemu služi povezivanje LeetCode naloga?",
  HOME_FAQ_A_11:
    "Opcione funkcije profila, lepljenje URL-a zadatka za metapodatke i prečice ka istom zadatku na LeetCode-u. Slanje rešenja i dalje na LeetCode-u — dStruct je prateće igralište.",
  HOME_FAQ_Q_12: "Mogu li meriti brzinu rešenja?",
  HOME_FAQ_A_12:
    "Da, za JavaScript — Benchmark režim (mnogo iteracija, medijan, percentili, grafikon). Python još nema benchmark.",
  HOME_FAQ_Q_13: "Da li dStruct radi na telefonu ili tabletu?",
  HOME_FAQ_A_13:
    "Postoji mobilno prilagođen tok sa keep-alive pri promeni kartica. Duge sesije uređivanja su lakše na desktopu.",
  HOME_FAQ_Q_14: "Da li je dStruct otvorenog koda?",
  HOME_FAQ_A_14:
    "Da. Pogledajte LICENSE u repozitorijumu (AGPL-3.0).",
};

export default sr;
