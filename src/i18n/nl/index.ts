import type { Translation } from "../i18n-types";

const nl: Record<keyof Translation, string> = {
  ACTION: "Actie",
  ADD_ARGUMENT: "Argument toevoegen",
  ADD_NEW_SOLUTION: "Nieuwe oplossing toevoegen",
  ARGUMENTS: "Argumenten",
  BROWSE: "Bladeren",
  BROWSE_PROJECTS: "Projecten bladeren",
  BACK: "Terug",
  CALLSTACK: "Aanroepstack",
  CANCEL: "Annuleren",
  CODE: "Code",
  CHOOSE_LOCALE: "Kies taal...",
  CODE_COPIED_TO_CLIPBOARD: "Code gekopieerd naar klembord",
  CODE_RUNNER: "Code-runner",
  CONSOLE_OUTPUT: "Console-uitvoer",
  CONTINUE: "Doorgaan",
  COPY: "Kopiëren",
  COPY_CODE_TO_CLIPBOARD: "Code naar klembord kopiëren",
  CREATE_NEW_PROJECT: "Nieuw project maken",
  CURRENT_PROJECT: "Huidig project",
  CURRENT_USER_ACCOUNT: "Huidige gebruikersaccount",
  DARK_MODE: "Donkere modus",
  DASHBOARD: "Dashboard",
  DATA_STRUCTURES_SIMPLIFIED: "Datastructuren vereenvoudigd",
  DELETE: "Verwijderen",
  DELETE_THIS_PROJECT: "Dit project verwijderen",
  DELETE_X_ARGUMENT: "Argument {name:string} verwijderen",
  DAILY_PROBLEM_NAV: "Dagelijkse opgave",
  DESCRIPTION: "Beschrijving",
  DSTRUCT_LOGO: "DStruct-logo",
  EDIT_AND_SAVE:
    "Bewerk <code>pages/index.tsx</code> en sla op om te herladen.",
  EDIT_SELECTED_PROJECT: "Geselecteerd project bewerken",
  EDIT_SOLUTION: "Oplossing bewerken",
  EDIT_TEST_CASE: "Testcase bewerken",
  EDIT_TEST_CASE_SUMMARY: "Bewerk de details van je testcase.",
  FEEDBACK: "Feedback",
  FORWARD: "Vooruit",
  FORMATTING_ICON: "Opmaakpictogram",
  FORMAT_CODE_WITH: "Code opmaken met",
  HI: "Hallo {name:string}!",
  INPUT: "Invoer",
  LANGUAGE: "Taal",
  LOGOUT: "Uitloggen",
  MAIN_MENU: "Hoofdmenu",
  MS: "ms",
  NAME: "Naam",
  NEW: "Nieuw",
  NODE: "Knoop",
  NO_DATA: "Geen gegevens",
  OPEN_OPTIONS: "Opties openen",
  OUTPUT: "Uitvoer",
  PANEL_TABS: "Paneeltabbladen",
  PENDING_CHANGES: "Openstaande wijzigingen",
  PLAYBACK_INTERVAL: "Afspeelinterval",
  PLAYGROUND: "Speeltuin",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Voer je LeetCode-accountnaam in:",
  PROFILE: "Profiel",
  PROJECT: "Project",
  PROJECT_BROWSER: "Projectbrowser",
  SEARCH_PROJECTS: "Zoek projecten op titel...",
  NO_PROJECTS_FOUND: "Geen projecten gevonden",
  NO_PROJECTS_MATCH_FILTERS: "Geen projecten komen overeen met je filters",
  FILTERS: "Filters",
  FILTER_BY_DIFFICULTY: "Moeilijkheid",
  SHOW_ONLY_NEW: "Alleen nieuwe projecten",
  SHOW_ONLY_MINE: "Alleen mijn projecten",
  CLEAR_ALL_FILTERS: "Alle filters wissen",
  SORT_BY: "Sorteren op",
  SORT_TITLE: "Titel",
  SORT_TITLE_ASC: "Titel (A-Z)",
  SORT_TITLE_DESC: "Titel (Z-A)",
  SORT_DIFFICULTY: "Moeilijkheid",
  SORT_DIFFICULTY_ASC: "Moeilijkheid (Makkelijk → Moeilijk)",
  SORT_DIFFICULTY_DESC: "Moeilijkheid (Moeilijk → Makkelijk)",
  SORT_DATE: "Datum",
  SORT_DATE_ASC: "Datum (nieuwste eerst)",
  SORT_DATE_DESC: "Datum (oudste eerst)",
  SORT_CATEGORY: "Categorie",
  SORT_CATEGORY_ASC: "Categorie (A-Z)",
  SORT_CATEGORY_DESC: "Categorie (Z-A)",
  REPLAY: "Opnieuw afspelen",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Vorige code-resultaatvisualisatie opnieuw afspelen",
  RESET: "Resetten",
  RESULTS: "Resultaten",
  RESET_DATA_STRUCTURES:
    "Datastructuren naar beginstaat resetten",
  RETRY: "Opnieuw proberen",
  RETURNED: "Geretourneerd",
  RUN: "Uitvoeren",
  RUNTIME: "Looptijd",
  RUN_CODE: "Code uitvoeren",
  SAVED_IN_THE_CLOUD: "Opgeslagen in de cloud",
  SELECTED_LOCALE: "Geselecteerde taal:",
  SETTINGS: "Instellingen",
  SIGN_IN: "Inloggen",
  SIGN_IN_FAILED: "Inloggen mislukt",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Log in om je voortgang en meer bij te houden!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Log in met GitHub of Google rechtsboven",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Ruimtecomplexiteit",
  SUBMIT: "Verzenden",
  SUCCESS: "Gelukt",
  SYNCING_WITH_SERVER: "Synchroniseren met server",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Optionele testcasebeschrijving",
  TEST_CASE_NAME_HELPER_TEXT: "Korte naam voor je testcase",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Je kunt de slug in de URL van deze testcase bewerken",
  TIMESTAMP: "Tijdstempel",
  TIME_COMPLEXITY: "Tijdcomplexiteit",
  TODAY: "Vandaag is het {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Boomweergave",
  TRY_IT_OUT_NOW: "Probeer het nu",
  TYPE: "Type",
  UPDATE: "Bijwerken",
  USERNAME: "Gebruikersnaam",
  USER_DASHBOARD: "Dashboard van {name:string}",
  USER_SETTINGS: "Gebruikersinstellingen",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualiseer je LeetCode-problemen direct vanuit je code",
  YOUR_CHANGES_WILL_BE_LOST: "Je wijzigingen gaan verloren",
  YOUR_LEETCODE_ACCOUNT_NAME: "Je LeetCode-accountnaam:",
  YOUR_NAME: "Je naam:",
  YOU_DONT_OWN_THIS_PROJECT: "Dit project is niet van jou",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Je moet ingelogd zijn om code op te slaan",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Voer eerst de code uit",

  HOME_LANDING_TITLE:
    "Je code, frame voor frame. Stap vooruit. Stap terug.",
  HOME_LANDING_SUBTITLE:
    "Een LeetCode-achtige speeltuin waar je oplossing een visueel uitvoeringsspoor wordt: bomen, grafen, roosters, gekoppelde structuren en geneste maps. JavaScript en Python in de browser, stap-voor-stap afspelen en optionele timing voor JS.",
  HOME_HERO_FAQ_LINK: "Veelgestelde vragen",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Stap {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Afspelen",
  HOME_LANDING_PREVIEW_PAUSE: "Pauze",
  HOME_PREVIEW_STEP_BACK: "Stap terug",
  HOME_PREVIEW_STEP_FORWARD: "Stap vooruit",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Voorbeeld op de startpagina laden is mislukt.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Onverwachte fout bij initialiseren van het voorbeeld.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "binaire boom omkeren",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "pad in graaf",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "kortste pad in binaire matrix",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Dagelijkse opgave",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Vraag van vandaag",
  QUESTION_OF_TODAY_LABEL: "Vraag van vandaag",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Geen projecten gevonden voor \"{query:string}\"",
  HOME_SECTION_HOW_IT_WORKS: "Hoe het werkt",
  HOME_HOW_STEP_1_TITLE: "Schrijf je oplossing",
  HOME_HOW_STEP_1_BODY:
    "Gebruik de ingebouwde editor met bekende patronen per projectcategorie.",
  HOME_HOW_STEP_2_TITLE: "Uitvoeren en vastleggen",
  HOME_HOW_STEP_2_BODY:
    "Getraceerde API's maken van structureel werk een stack van frames—geen kant-en-klare animatie.",
  HOME_HOW_STEP_3_TITLE: "Door de tijdlijn scrubben",
  HOME_HOW_STEP_3_BODY:
    "Vooruit en achteruit, snelheid aanpassen en elke bewerking in het log bekijken.",
  HOME_SECTION_WHY_DSTUCT: "Mogelijkheden",
  HOME_PILLAR_VIS_TITLE: "Zie het algoritme, niet alleen de uitvoer",
  HOME_PILLAR_VIS_BODY:
    "Speel af hoe je datastructuren veranderen. Begrijp en debug met een echte uitvoeringstrace.",
  HOME_PILLAR_WORKERS_TITLE: "Vloeiende UI tijdens code-uitvoering",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript in een Web Worker; Python met Pyodide in eigen worker—de pagina blijft responsief.",
  HOME_PILLAR_REPLAY_TITLE: "Tijdreis-afspelen",
  HOME_PILLAR_REPLAY_BODY:
    "Afspelen, pauzeren, stap, opnieuw en snelheid—including sneltoetsen.",
  HOME_PILLAR_BENCH_TITLE: "JavaScript benchmarken",
  HOME_PILLAR_BENCH_BODY:
    "Veel runs met mediaan, percentielen en grafiek. Benchmark alleen JS nu.",
  HOME_SECTION_LANGUAGES: "Twee talen, één speeltuin",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Lokaal in worker—geen round-trip voor visualisatie. Volledige benchmark.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Echte CPython via Pyodide—geen installatie. Preload bij Python-oplossing; eerste bezoek downloadt runtime (~30 MB, daarna cache). Alleen standaardbibliotheek.",
  HOME_SECTION_TRY_DEMOS: "Algoritmegalerij",
  HOME_TRY_DEMOS_LEAD:
    "Open een uitgekozen speeltuin om de debugger op een echt probleem te zien, of ga naar de volledige browser.",
  HOME_DEMO_TREE: "Binaire boom",
  HOME_DEMO_GRAPH: "Pad in graaf",
  HOME_DEMO_GRID: "BFS op rooster",
  HOME_DEMO_TRIE: "Trie / map",
  HOME_SECTION_FAQ: "Veelgestelde vragen",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Bewaar voortgang in de cloud",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Log in om projecten, testcases en oplossingen te synchroniseren. Publieke voorbeelden zonder account.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Runs draaien in de browser; inloggen is voor opslaan en sociale functies.",
  HOME_OPEN_PROFILE: "Profiel openen",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Profielkoppeling maken mislukt. Open via accountmenu in de kop.",
  HOME_DAILY_QUESTION_ERROR:
    "Dagelijkse opgave laden mislukt. Probeer later opnieuw.",
  HOME_DAILY_SECTION_TITLE: "Weet je niet wat je moet oplossen?",
  HOME_DAILY_SECTION_LEAD:
    "Hier is een dagelijkse LeetCode-opgave—open in de speeltuin wanneer je klaar bent.",

  HOME_FAQ_Q_01: "Waarom geen visualisatie na uitvoeren?",
  HOME_FAQ_A_01:
    "Visueel afspelen komt van getraceerde datastructuur-API's van dStruct. Kies passende categorie en wrappers. Platte objecten zonder API kunnen uitvoer tonen maar geen stap-voor-stap replay.",
  HOME_FAQ_Q_02: "Welke problemen en structuren worden ondersteund?",
  HOME_FAQ_A_02:
    "Bomen, BST, gelinkte lijsten, grafen, roosters en matrices, arrays, heaps, stacks, trie, DP, twee pointers, schuivend venster, backtracking en meer. Blader of check categorieën bij nieuw project.",
  HOME_FAQ_Q_03: "Moet ik Python installeren?",
  HOME_FAQ_A_03:
    "Nee voor normaal gebruik. JS in Web Worker; Python met Pyodide. Lokale Python-server optioneel voor ontwikkelaars.",
  HOME_FAQ_Q_04: "Draait mijn code op jullie servers?",
  HOME_FAQ_A_04:
    "Standaard nee—uitvoering in browser. Opslaan en cloud gebruiken backend.",
  HOME_FAQ_Q_05: "JavaScript en Python samen?",
  HOME_FAQ_A_05:
    "Ja. Aparte JS- en Python-oplossingen. Benchmark nu alleen JavaScript.",
  HOME_FAQ_Q_06: "Waarom laadbalke bij Python?",
  HOME_FAQ_A_06:
    "Pyodide prelaadt op achtergrond. Eerste bezoek ~30 MB runtime; WASM-start kan seconden duren.",
  HOME_FAQ_Q_07: "NumPy of pip?",
  HOME_FAQ_A_07:
    "Nee in standaard speeltuin—alleen stdlib. Derde imports falen.",
  HOME_FAQ_Q_08: "Hoe lang mag een run duren?",
  HOME_FAQ_A_08:
    "Python timeout 30s; worker opnieuw. Annuleren grof bij zware last.",
  HOME_FAQ_Q_09: "Hoe sla ik op?",
  HOME_FAQ_A_09:
    "Publieke projecten zonder login. Voor persistentie: inloggen.",
  HOME_FAQ_Q_10: "Projecten delen?",
  HOME_FAQ_A_10:
    "Ja. Maak publiek en gebruik Bladeren.",
  HOME_FAQ_Q_11: "LeetCode-koppeling?",
  HOME_FAQ_A_11:
    "Optioneel profiel, URL voor metadata, snelkoppelingen. Indienen blijft op LeetCode.",
  HOME_FAQ_Q_12: "Snelheid meten?",
  HOME_FAQ_A_12:
    "Ja voor JavaScript—Benchmark. Python nog niet.",
  HOME_FAQ_Q_13: "Mobiel?",
  HOME_FAQ_A_13:
    "Mobiele flow met keep-alive. Lang bewerken prettiger op desktop.",
  HOME_FAQ_Q_14: "Open source?",
  HOME_FAQ_A_14:
    "Ja. Zie LICENSE (AGPL-3.0).",
};

export default nl;
