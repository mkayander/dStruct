import type { Translation } from "../i18n-types";

const de: Record<keyof Translation, string> = {
  ACTION: "Aktion",
  ADD_ARGUMENT: "Argument hinzufügen",
  ADD_NEW_SOLUTION: "Neue Lösung hinzufügen",
  ARGUMENTS: "Argumente",
  BROWSE: "Durchsuchen",
  BROWSE_PROJECTS: "Projekte durchsuchen",
  BACK: "Zurück",
  CALLSTACK: "Aufrufstapel",
  CANCEL: "Abbrechen",
  CODE: "Code",
  CHOOSE_LOCALE: "Sprache wählen...",
  CODE_COPIED_TO_CLIPBOARD: "Code in die Zwischenablage kopiert",
  CODE_RUNNER: "Code-Runner",
  CONSOLE_OUTPUT: "Konsolenausgabe",
  CONTINUE: "Weiter",
  COPY: "Kopieren",
  COPY_CODE_TO_CLIPBOARD: "Code in die Zwischenablage kopieren",
  CREATE_NEW_PROJECT: "Neues Projekt erstellen",
  CURRENT_PROJECT: "Aktuelles Projekt",
  CURRENT_USER_ACCOUNT: "Aktuelles Benutzerkonto",
  DARK_MODE: "Dunkelmodus",
  DASHBOARD: "Dashboard",
  DATA_STRUCTURES_SIMPLIFIED: "Datenstrukturen vereinfacht",
  DELETE: "Löschen",
  DELETE_THIS_PROJECT: "Dieses Projekt löschen",
  DELETE_X_ARGUMENT: "Argument {name:string} löschen",
  DAILY_PROBLEM_NAV: "Tagesaufgabe",
  DESCRIPTION: "Beschreibung",
  DSTRUCT_LOGO: "DStruct-Logo",
  EDIT_AND_SAVE:
    "Bearbeiten Sie <code>pages/index.tsx</code> und speichern Sie, um neu zu laden.",
  EDIT_SELECTED_PROJECT: "Ausgewähltes Projekt bearbeiten",
  EDIT_SOLUTION: "Lösung bearbeiten",
  EDIT_TEST_CASE: "Testfall bearbeiten",
  EDIT_TEST_CASE_SUMMARY: "Bearbeiten Sie die Details Ihres Testfalls.",
  FEEDBACK: "Feedback",
  FORWARD: "Vorwärts",
  FORMATTING_ICON: "Formatierungssymbol",
  FORMAT_CODE_WITH: "Code formatieren mit",
  HI: "Hallo, {name:string}!",
  INPUT: "Eingabe",
  LANGUAGE: "Sprache",
  LOGOUT: "Abmelden",
  MAIN_MENU: "Hauptmenü",
  MS: "ms",
  NAME: "Name",
  NEW: "Neu",
  NODE: "Knoten",
  NO_DATA: "Keine Daten",
  OPEN_OPTIONS: "Optionen öffnen",
  OUTPUT: "Ausgabe",
  PANEL_TABS: "Panel-Tabs",
  PENDING_CHANGES: "Ausstehende Änderungen",
  PLAYBACK_INTERVAL: "Wiedergabeintervall",
  PLAYGROUND: "Playground",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Bitte geben Sie Ihren LeetCode-Benutzernamen ein:",
  PROFILE: "Profil",
  PROJECT: "Projekt",
  PROJECT_BROWSER: "Projekt-Browser",
  SEARCH_PROJECTS: "Projekte nach Titel suchen...",
  NO_PROJECTS_FOUND: "Keine Projekte gefunden",
  NO_PROJECTS_MATCH_FILTERS: "Keine Projekte entsprechen Ihren Filtern",
  FILTERS: "Filter",
  FILTER_BY_DIFFICULTY: "Schwierigkeit",
  SHOW_ONLY_NEW: "Nur neue Projekte anzeigen",
  SHOW_ONLY_MINE: "Nur meine Projekte anzeigen",
  CLEAR_ALL_FILTERS: "Alle Filter löschen",
  SORT_BY: "Sortieren nach",
  SORT_TITLE: "Titel",
  SORT_TITLE_ASC: "Titel (A–Z)",
  SORT_TITLE_DESC: "Titel (Z–A)",
  SORT_DIFFICULTY: "Schwierigkeit",
  SORT_DIFFICULTY_ASC: "Schwierigkeit (Einfach → Schwer)",
  SORT_DIFFICULTY_DESC: "Schwierigkeit (Schwer → Einfach)",
  SORT_DATE: "Datum",
  SORT_DATE_ASC: "Datum (Neueste zuerst)",
  SORT_DATE_DESC: "Datum (Älteste zuerst)",
  SORT_CATEGORY: "Kategorie",
  SORT_CATEGORY_ASC: "Kategorie (A–Z)",
  SORT_CATEGORY_DESC: "Kategorie (Z–A)",
  REPLAY: "Erneut abspielen",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Letzte Code-Ergebnisvisualisierung erneut abspielen",
  RESET: "Zurücksetzen",
  RESULTS: "Ergebnisse",
  RESET_DATA_STRUCTURES:
    "Datenstrukturen auf den Anfangszustand zurücksetzen",
  RETRY: "Wiederholen",
  RETURNED: "Zurückgegeben",
  RUN: "Ausführen",
  RUNTIME: "Laufzeit",
  RUN_CODE: "Code ausführen",
  SAVED_IN_THE_CLOUD: "In der Cloud gespeichert",
  SELECTED_LOCALE: "Ausgewählte Sprache:",
  SETTINGS: "Einstellungen",
  SIGN_IN: "Anmelden",
  SIGN_IN_FAILED: "Anmeldung fehlgeschlagen",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Melden Sie sich an, um Ihren Fortschritt und mehr zu verfolgen!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Mit GitHub oder Google oben rechts anmelden",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Speicherkomplexität",
  SUBMIT: "Absenden",
  SUCCESS: "Erfolg",
  SYNCING_WITH_SERVER: "Synchronisiere mit dem Server",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Optionale Beschreibung des Testfalls",
  TEST_CASE_NAME_HELPER_TEXT: "Kurzer Name für Ihren Testfall",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Sie können den Slug bearbeiten, der in der URL dieses Testfalls verwendet wird",
  TIMESTAMP: "Zeitstempel",
  TIME_COMPLEXITY: "Zeitkomplexität",
  TODAY: "Heute ist {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Baumansicht",
  TRY_IT_OUT_NOW: "Jetzt ausprobieren",
  TYPE: "Typ",
  UPDATE: "Aktualisieren",
  USERNAME: "Benutzername",
  USER_DASHBOARD: "Dashboard von {name:string}",
  USER_SETTINGS: "Benutzereinstellungen",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualisieren Sie Ihre LeetCode-Aufgaben direkt aus Ihrem Code",
  YOUR_CHANGES_WILL_BE_LOST: "Ihre Änderungen gehen verloren",
  YOUR_LEETCODE_ACCOUNT_NAME: "Ihr LeetCode-Benutzername:",
  YOUR_NAME: "Ihr Name:",
  YOU_DONT_OWN_THIS_PROJECT: "Dieses Projekt gehört Ihnen nicht",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Sie müssen angemeldet sein, um Code zu speichern",
  YOU_NEED_TO_RUN_THE_CODE_FIRST:
    "Sie müssen den Code zuerst ausführen",

  HOME_LANDING_TITLE:
    "Ihr Code, Bild für Bild. Schritt vor. Schritt zurück.",
  HOME_LANDING_SUBTITLE:
    "Ein Playground im LeetCode-Stil: Ihre Lösung wird zur visuellen Ausführungsspur – Bäume, Graphen, Raster, verkettete Strukturen und verschachtelte Maps. JavaScript und Python im Browser, schrittweise Wiedergabe und optional Zeitmessung für JS.",
  HOME_HERO_FAQ_LINK: "Häufige Fragen",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Schritt {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Wiedergabe",
  HOME_LANDING_PREVIEW_PAUSE: "Pause",
  HOME_PREVIEW_STEP_BACK: "Schritt zurück",
  HOME_PREVIEW_STEP_FORWARD: "Schritt vor",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Landing-Vorschau konnte nicht geladen werden.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Unerwarteter Fehler beim Initialisieren der Landing-Vorschau.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "binären Baum invertieren",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "Pfad im Graph finden",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "kürzester Pfad in binärer Matrix",
  HOME_DEMO_SLUG_TRIE_NAME: "Trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Tagesaufgabe",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Frage des Tages",
  QUESTION_OF_TODAY_LABEL: "Frage des Tages",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Keine Projekte gefunden für „{query:string}“",
  HOME_SECTION_HOW_IT_WORKS: "So funktioniert es",
  HOME_HOW_STEP_1_TITLE: "Schreiben Sie Ihre Lösung",
  HOME_HOW_STEP_1_BODY:
    "Nutzen Sie den eingebauten Editor mit bekannten Mustern pro Projektkategorie.",
  HOME_HOW_STEP_2_TITLE: "Ausführen und aufzeichnen",
  HOME_HOW_STEP_2_BODY:
    "Überwachte APIs machen aus struktureller Arbeit einen Aufrufstapel von Frames – keine vorgefertigte Animation.",
  HOME_HOW_STEP_3_TITLE: "Zeitleiste scrubben",
  HOME_HOW_STEP_3_BODY:
    "Vor und zurück springen, Geschwindigkeit ändern und jeden Schritt im Log prüfen.",
  HOME_SECTION_WHY_DSTUCT: "Funktionen",
  HOME_PILLAR_VIS_TITLE: "Sehen Sie den Algorithmus, nicht nur die Ausgabe",
  HOME_PILLAR_VIS_BODY:
    "Spielen Sie nach, wie sich Ihre Datenstrukturen ändern. Verstehen und debuggen Sie mit einer echten Ausführungsspur.",
  HOME_PILLAR_WORKERS_TITLE: "Flüssige Oberfläche während der Ausführung",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript läuft in einem Web Worker; Python nutzt Pyodide in einem eigenen Worker – die Seite bleibt reaktionsfähig.",
  HOME_PILLAR_REPLAY_TITLE: "Zeitreise-Wiedergabe",
  HOME_PILLAR_REPLAY_BODY:
    "Abspielen, pausieren, schrittweise gehen, wiederholen und Geschwindigkeit anpassen – inklusive Tastenkürzel.",
  HOME_PILLAR_BENCH_TITLE: "JavaScript benchmarken",
  HOME_PILLAR_BENCH_BODY:
    "Viele Läufe mit Median, Perzentilen und Diagramm. Benchmark-Modus derzeit nur für JS.",
  HOME_SECTION_LANGUAGES: "Zwei Sprachen, ein Playground",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Läuft lokal im Worker – kein Roundtrip für die Visualisierung. Volle Benchmark-Unterstützung.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Echtes CPython über Pyodide im Browser – keine Installation. Wird beim Öffnen einer Python-Lösung vorgeladen; beim ersten Besuch wird die Laufzeitumgebung heruntergeladen (danach gecacht). Nur Standardbibliothek.",
  HOME_SECTION_TRY_DEMOS: "Algorithmus-Galerie",
  HOME_TRY_DEMOS_LEAD:
    "Öffnen Sie einen kuratierten Playground, um den Debugger an einer echten Aufgabe zu sehen, oder wechseln Sie zum vollen Projekt-Browser.",
  HOME_DEMO_TREE: "Binärbaum",
  HOME_DEMO_GRAPH: "Graphpfad",
  HOME_DEMO_GRID: "Raster-BFS",
  HOME_DEMO_TRIE: "Trie / Map",
  HOME_SECTION_FAQ: "Häufige Fragen",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Fortschritt in der Cloud speichern",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Melden Sie sich an, um Projekte, Testfälle und Lösungen zu synchronisieren. Öffentliche Beispiele sind ohne Konto möglich.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Ihre Läufe erfolgen im Browser; die Anmeldung dient Speichern und sozialen Funktionen.",
  HOME_OPEN_PROFILE: "Profil öffnen",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Der Profil-Link konnte nicht erstellt werden. Öffnen Sie Ihr Profil über das Kontomenü in der Kopfzeile.",
  HOME_DAILY_QUESTION_ERROR:
    "Die Tagesaufgabe konnte nicht geladen werden. Bitte später erneut versuchen.",
  HOME_DAILY_SECTION_TITLE: "Unsicher, was Sie lösen sollen?",
  HOME_DAILY_SECTION_LEAD:
    "Hier ist eine tägliche Aufgabe von LeetCode – öffnen Sie sie im Playground, wenn Sie bereit sind.",

  HOME_FAQ_Q_01: "Warum gibt es nach dem Ausführen keine Visualisierung?",
  HOME_FAQ_A_01:
    "Die visuelle Wiedergabe kommt von dStructs überwachten Datenstruktur-APIs. Wählen Sie eine passende Projektkategorie und die erwarteten Wrapper. Normale Objekte ohne diese APIs können Ausgabe liefern, aber keine schrittweise Wiedergabe.",
  HOME_FAQ_Q_02: "Welche Probleme und Strukturen werden unterstützt?",
  HOME_FAQ_A_02:
    "Bäume, BST, verkettete Listen, Graphen, Raster und Matrizen, Arrays, Heaps, Stacks, Trie, DP, Zwei-Zeiger, gleitendes Fenster, Backtracking und mehr. Durchsuchen Sie den Playground oder Kategorien beim Anlegen eines Projekts.",
  HOME_FAQ_Q_03: "Muss ich Python installieren?",
  HOME_FAQ_A_03:
    "Für normale Nutzung nein. JavaScript im Web Worker; Python mit Pyodide im Browser. Ein lokaler Python-Server ist nur für Entwickler optional.",
  HOME_FAQ_Q_04: "Läuft mein Code auf Ihren Servern?",
  HOME_FAQ_A_04:
    "Standardmäßig nein – die Ausführung erfolgt im Browser. Speichern, Anmeldung und Cloud-Projekte nutzen das Backend wie üblich.",
  HOME_FAQ_Q_05: "Kann ich JavaScript und Python nutzen?",
  HOME_FAQ_A_05:
    "Ja. Projekte können getrennte JS- und Python-Lösungen haben. Benchmark-Modus ist derzeit nur für JavaScript.",
  HOME_FAQ_Q_06: "Warum zeigt Python einen Ladebalken?",
  HOME_FAQ_A_06:
    "Pyodide wird im Hintergrund geladen, wenn Sie eine Python-Seite öffnen. Beim ersten Besuch wird die Laufzeit (~30 MB) geladen und gecacht; WASM-Start kann auch aus dem Cache einige Sekunden dauern.",
  HOME_FAQ_Q_07: "Kann ich NumPy oder pip-Pakete nutzen?",
  HOME_FAQ_A_07:
    "Nicht im Standard-Playground – nur Standardbibliothek. Fremdimporte schlagen fehl.",
  HOME_FAQ_Q_08: "Wie lange darf ein Lauf dauern?",
  HOME_FAQ_A_08:
    "Python bricht standardmäßig nach 30 Sekunden ab; der Worker wird neu erstellt. Abbruch bei sehr schwerer Arbeit ist grob.",
  HOME_FAQ_Q_09: "Wie speichere ich meine Arbeit?",
  HOME_FAQ_A_09:
    "Öffentliche Projekte und der Editor sind ohne Anmeldung nutzbar. Zum dauerhaften Speichern von Projekten, Testfällen und benannten Lösungen melden Sie sich an.",
  HOME_FAQ_Q_10: "Kann ich Projekte teilen oder von anderen lernen?",
  HOME_FAQ_A_10:
    "Ja. Machen Sie ein Projekt öffentlich und nutzen Sie „Durchsuchen“ für Beispiele.",
  HOME_FAQ_Q_11: "Wozu dient die Verknüpfung mit LeetCode?",
  HOME_FAQ_A_11:
    "Optionale Profilfunktionen, Einfügen einer LeetCode-Problem-URL für Metadaten und Shortcuts zur gleichen Aufgabe auf LeetCode. Einreichen erfolgt weiterhin auf LeetCode – dStruct ist ein Begleit-Playground.",
  HOME_FAQ_Q_12: "Kann ich die Geschwindigkeit messen?",
  HOME_FAQ_A_12:
    "Ja, für JavaScript – Benchmark-Modus (viele Iterationen, Median, Perzentile, Diagramm). Python hat noch keinen Benchmark-Modus.",
  HOME_FAQ_Q_13: "Funktioniert dStruct auf dem Handy oder Tablet?",
  HOME_FAQ_A_13:
    "Es gibt einen mobilfreundlichen Playground mit Keep-Alive beim Tab-Wechsel. Langes Bearbeiten ist auf dem Desktop am bequemsten.",
  HOME_FAQ_Q_14: "Ist dStruct Open Source?",
  HOME_FAQ_A_14:
    "Ja. Siehe LICENSE im Repository (AGPL-3.0).",
};

export default de;
