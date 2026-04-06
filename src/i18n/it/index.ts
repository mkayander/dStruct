import type { Translation } from "../i18n-types";

const it: Record<keyof Translation, string> = {
  ACTION: "Azione",
  ADD_ARGUMENT: "Aggiungi argomento",
  ADD_NEW_SOLUTION: "Aggiungi nuova soluzione",
  ARGUMENTS: "Argomenti",
  BROWSE: "Sfoglia",
  BROWSE_PROJECTS: "Sfoglia progetti",
  BACK: "Indietro",
  CALLSTACK: "Stack di chiamate",
  CANCEL: "Annulla",
  CODE: "Codice",
  CHOOSE_LOCALE: "Scegli lingua...",
  CODE_COPIED_TO_CLIPBOARD: "Codice copiato negli appunti",
  CODE_RUNNER: "Esecutore codice",
  CONSOLE_OUTPUT: "Output console",
  CONTINUE: "Continua",
  COPY: "Copia",
  COPY_CODE_TO_CLIPBOARD: "Copia codice negli appunti",
  CREATE_NEW_PROJECT: "Crea nuovo progetto",
  CURRENT_PROJECT: "Progetto corrente",
  CURRENT_USER_ACCOUNT: "Account utente corrente",
  DARK_MODE: "Modalità scura",
  DASHBOARD: "Dashboard",
  DATA_STRUCTURES_SIMPLIFIED: "Strutture dati semplificate",
  DELETE: "Elimina",
  DELETE_THIS_PROJECT: "Elimina questo progetto",
  DELETE_X_ARGUMENT: "Elimina argomento {name:string}",
  DAILY_PROBLEM_NAV: "Problema del giorno",
  DESCRIPTION: "Descrizione",
  DSTRUCT_LOGO: "Logo DStruct",
  EDIT_AND_SAVE:
    "Modifica <code>pages/index.tsx</code> e salva per ricaricare.",
  EDIT_SELECTED_PROJECT: "Modifica progetto selezionato",
  EDIT_SOLUTION: "Modifica soluzione",
  EDIT_TEST_CASE: "Modifica caso di test",
  EDIT_TEST_CASE_SUMMARY: "Modifica i dettagli del caso di test.",
  FEEDBACK: "Feedback",
  FORWARD: "Avanti",
  FORMATTING_ICON: "Icona formattazione",
  FORMAT_CODE_WITH: "Formatta codice con",
  FORMAT_CODE_WITH_BLACK: "Format code with Black (Pyodide)",
  HI: "Ciao {name:string}!",
  INPUT: "Input",
  LANGUAGE: "Lingua",
  LOGOUT: "Esci",
  MAIN_MENU: "Menu principale",
  MS: "ms",
  NAME: "Nome",
  NEW: "Nuovo",
  NODE: "Nodo",
  NO_DATA: "Nessun dato",
  OPEN_OPTIONS: "Apri opzioni",
  OUTPUT: "Output",
  PANEL_TABS: "Schede pannello",
  PENDING_CHANGES: "Modifiche in sospeso",
  PLAYBACK_INTERVAL: "Intervallo riproduzione",
  PLAYGROUND: "Playground",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Inserisci il nome del tuo account LeetCode:",
  PROFILE: "Profilo",
  PROJECT: "Progetto",
  PROJECT_BROWSER: "Browser progetti",
  SEARCH_PROJECTS: "Cerca progetti per titolo...",
  NO_PROJECTS_FOUND: "Nessun progetto trovato",
  NO_PROJECTS_MATCH_FILTERS: "Nessun progetto corrisponde ai filtri",
  FILTERS: "Filtri",
  FILTER_BY_DIFFICULTY: "Difficoltà",
  SHOW_ONLY_NEW: "Mostra solo progetti nuovi",
  SHOW_ONLY_MINE: "Mostra solo i miei progetti",
  CLEAR_ALL_FILTERS: "Cancella tutti i filtri",
  SORT_BY: "Ordina per",
  SORT_TITLE: "Titolo",
  SORT_TITLE_ASC: "Titolo (A-Z)",
  SORT_TITLE_DESC: "Titolo (Z-A)",
  SORT_DIFFICULTY: "Difficoltà",
  SORT_DIFFICULTY_ASC: "Difficoltà (Facile → Difficile)",
  SORT_DIFFICULTY_DESC: "Difficoltà (Difficile → Facile)",
  SORT_DATE: "Data",
  SORT_DATE_ASC: "Data (più recenti prima)",
  SORT_DATE_DESC: "Data (più vecchi prima)",
  SORT_CATEGORY: "Categoria",
  SORT_CATEGORY_ASC: "Categoria (A-Z)",
  SORT_CATEGORY_DESC: "Categoria (Z-A)",
  REPLAY: "Riproduci di nuovo",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Riproduci visualizzazione precedente del risultato",
  RESET: "Reimposta",
  RESULTS: "Risultati",
  RESET_DATA_STRUCTURES:
    "Reimposta strutture dati allo stato iniziale",
  RETRY: "Riprova",
  RETURNED: "Restituito",
  RUN: "Esegui",
  RUNTIME: "Tempo di esecuzione",
  RUN_CODE: "Esegui codice",
  SAVED_IN_THE_CLOUD: "Salvato nel cloud",
  SELECTED_LOCALE: "Lingua selezionata:",
  SETTINGS: "Impostazioni",
  SIGN_IN: "Accedi",
  SIGN_IN_FAILED: "Accesso non riuscito",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Accedi per tenere traccia dei progressi e altro!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Accedi con GitHub o Google in alto a destra",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Complessità spaziale",
  SUBMIT: "Invia",
  SUCCESS: "Successo",
  SYNCING_WITH_SERVER: "Sincronizzazione con il server",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Descrizione opzionale del caso di test",
  TEST_CASE_NAME_HELPER_TEXT: "Nome breve del caso di test",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Puoi modificare lo slug nell'URL di questo caso di test",
  TIMESTAMP: "Timestamp",
  TIME_COMPLEXITY: "Complessità temporale",
  TODAY: "Oggi è {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Visualizzatore albero",
  TRY_IT_OUT_NOW: "Provalo ora",
  TYPE: "Tipo",
  UPDATE: "Aggiorna",
  USERNAME: "Nome utente",
  USER_DASHBOARD: "Dashboard di {name:string}",
  USER_SETTINGS: "Impostazioni utente",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualizza i problemi LeetCode direttamente dal tuo codice",
  YOUR_CHANGES_WILL_BE_LOST: "Le modifiche andranno perse",
  YOUR_LEETCODE_ACCOUNT_NAME: "Nome account LeetCode:",
  YOUR_NAME: "Il tuo nome:",
  YOU_DONT_OWN_THIS_PROJECT: "Non possiedi questo progetto",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Devi essere autenticato per salvare il codice",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Esegui prima il codice",

  HOME_LANDING_TITLE:
    "Il tuo codice, fotogramma per fotogramma. Un passo avanti. Un passo indietro.",
  HOME_LANDING_SUBTITLE:
    "Un playground in stile LeetCode dove la soluzione diventa traccia visuale di esecuzione: alberi, grafi, griglie, strutture collegate e mappe annidate. JavaScript e Python nel browser, riproduzione passo passo e statistiche temporali opzionali per JS.",
  HOME_HERO_FAQ_LINK: "Domande frequenti",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Passo {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Riproduci",
  HOME_LANDING_PREVIEW_PAUSE: "Pausa",
  HOME_PREVIEW_STEP_BACK: "Passo indietro",
  HOME_PREVIEW_STEP_FORWARD: "Passo avanti",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Impossibile caricare l'anteprima della home.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Errore imprevisto durante l'inizializzazione dell'anteprima.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "inverti albero binario",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "percorso nel grafo",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "percorso minimo in matrice binaria",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Problema del giorno",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Domanda del giorno",
  QUESTION_OF_TODAY_LABEL: "Domanda del giorno",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Nessun progetto trovato per \"{query:string}\"",
  HOME_SECTION_HOW_IT_WORKS: "Come funziona",
  HOME_HOW_STEP_1_TITLE: "Scrivi la soluzione",
  HOME_HOW_STEP_1_BODY:
    "Usa l'editor integrato con modelli familiari per ogni categoria.",
  HOME_HOW_STEP_2_TITLE: "Esegui e registra",
  HOME_HOW_STEP_2_BODY:
    "Le API tracciate trasformano il lavoro strutturale in stack di frame—niente animazioni preconfezionate.",
  HOME_HOW_STEP_3_TITLE: "Scorri la timeline",
  HOME_HOW_STEP_3_BODY:
    "Avanti e indietro, cambia velocità e ispeziona ogni operazione nel log.",
  HOME_SECTION_WHY_DSTUCT: "Funzionalità",
  HOME_PILLAR_VIS_TITLE: "Vedi l'algoritmo, non solo l'output",
  HOME_PILLAR_VIS_BODY:
    "Rivedi come cambiano le strutture dati. Comprendi e debugga con traccia reale.",
  HOME_PILLAR_WORKERS_TITLE: "UI fluida durante l'esecuzione",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript in Web Worker; Python con Pyodide in worker dedicato—la pagina resta reattiva.",
  HOME_PILLAR_REPLAY_TITLE: "Riproduzione time-travel",
  HOME_PILLAR_REPLAY_BODY:
    "Play, pausa, passo, ripeti e regola velocità—anche con scorciatoie.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Molte esecuzioni con mediana, percentili e grafico. Benchmark solo JS al momento.",
  HOME_SECTION_LANGUAGES: "Due linguaggi, un playground",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Esecuzione locale nel worker—nessun round-trip per la visualizzazione. Benchmark completo.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "CPython reale via Pyodide nel browser—nessuna installazione. Precaricato con soluzione Python; prima visita scarica runtime (~30 MB, poi cache). Solo libreria standard.",
  HOME_SECTION_TRY_DEMOS: "Galleria algoritmi",
  HOME_TRY_DEMOS_LEAD:
    "Apri un playground curato per il debugger su un problema reale o vai al browser completo.",
  HOME_DEMO_TREE: "Albero binario",
  HOME_DEMO_GRAPH: "Percorso nel grafo",
  HOME_DEMO_GRID: "BFS su griglia",
  HOME_DEMO_TRIE: "Trie / mappa",
  HOME_SECTION_FAQ: "Domande comuni",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Salva i progressi nel cloud",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Accedi per sincronizzare progetti, test e soluzioni. Esempi pubblici senza account.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Le esecuzioni sono nel browser; l'accesso serve per salvataggio e social.",
  HOME_OPEN_PROFILE: "Apri profilo",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Impossibile creare il link al profilo. Apri dal menu account nell'intestazione.",
  HOME_DAILY_QUESTION_ERROR:
    "Impossibile caricare il problema del giorno. Riprova più tardi.",
  HOME_DAILY_SECTION_TITLE: "Non sai cosa risolvere?",
  HOME_DAILY_SECTION_LEAD:
    "Ecco un problema giornaliero LeetCode—aprilo nel playground quando sei pronto.",

  HOME_FAQ_Q_01: "Perché non c'è visualizzazione dopo l'esecuzione?",
  HOME_FAQ_A_01:
    "La riproduzione visiva viene dalle API tracciate di dStruct. Scegli categoria e wrapper attesi. Oggetti semplici senza API possono stampare output ma non replay passo passo.",
  HOME_FAQ_Q_02: "Quali problemi e strutture sono supportati?",
  HOME_FAQ_A_02:
    "Alberi, BST, liste collegate, grafi, griglie e matrici, array, heap, stack, trie, DP, due puntatori, finestra scorrevole, backtracking e altro. Sfoglia playground o categorie alla creazione.",
  HOME_FAQ_Q_03: "Devo installare Python?",
  HOME_FAQ_A_03:
    "No per uso normale. JS in Web Worker; Python con Pyodide. Server Python locale opzionale per sviluppatori.",
  HOME_FAQ_Q_04: "Il codice gira sui vostri server?",
  HOME_FAQ_A_04:
    "Di default no—esecuzione nel browser. Salvataggio e cloud usano il backend.",
  HOME_FAQ_Q_05: "Posso usare JavaScript e Python?",
  HOME_FAQ_A_05:
    "Sì. Soluzioni JS e Python separate. Benchmark solo JavaScript ora.",
  HOME_FAQ_Q_06: "Perché Python mostra barra di caricamento?",
  HOME_FAQ_A_06:
    "Pyodide si precarica in background. Prima visita scarica runtime (~30 MB); avvio WASM anche dalla cache può richiedere secondi.",
  HOME_FAQ_Q_07: "NumPy o pip?",
  HOME_FAQ_A_07:
    "No nel playground predefinito—solo stdlib. Import terzi falliscono.",
  HOME_FAQ_Q_08: "Quanto può durare un'esecuzione?",
  HOME_FAQ_A_08:
    "Python timeout 30s di default; worker ricreato. Annullamento grezzo per carichi pesanti.",
  HOME_FAQ_Q_09: "Come salvo?",
  HOME_FAQ_A_09:
    "Progetti pubblici e editor senza login. Per persistenza: accedi.",
  HOME_FAQ_Q_10: "Condividere progetti?",
  HOME_FAQ_A_10:
    "Sì. Progetto pubblico e Sfoglia per esempi.",
  HOME_FAQ_Q_11: "A cosa serve collegare LeetCode?",
  HOME_FAQ_A_11:
    "Profilo opzionale, URL problema per metadati, scorciatoie LeetCode. Invio soluzioni resta su LeetCode.",
  HOME_FAQ_Q_12: "Misurare velocità?",
  HOME_FAQ_A_12:
    "Sì per JavaScript—Benchmark. Python non ancora.",
  HOME_FAQ_Q_13: "Funziona su mobile?",
  HOME_FAQ_A_13:
    "Flusso mobile con keep-alive. Sessioni lunghe meglio su desktop.",
  HOME_FAQ_Q_14: "dStruct è open source?",
  HOME_FAQ_A_14:
    "Sì. Vedi LICENSE (AGPL-3.0).",
};

export default it;
