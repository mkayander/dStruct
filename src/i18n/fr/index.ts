import type { Translation } from "../i18n-types";

const fr: Record<keyof Translation, string> = {
  ACTION: "Action",
  ADD_ARGUMENT: "Ajouter un argument",
  ADD_NEW_SOLUTION: "Ajouter une nouvelle solution",
  ARGUMENTS: "Arguments",
  BROWSE: "Parcourir",
  BROWSE_PROJECTS: "Parcourir les projets",
  BACK: "Retour",
  CALLSTACK: "Pile d'appels",
  CANCEL: "Annuler",
  CODE: "Code",
  CHOOSE_LOCALE: "Choisir la langue...",
  CODE_COPIED_TO_CLIPBOARD: "Code copié dans le presse-papiers",
  CODE_RUNNER: "Exécuteur de code",
  CONSOLE_OUTPUT: "Sortie console",
  CONTINUE: "Continuer",
  COPY: "Copier",
  COPY_CODE_TO_CLIPBOARD: "Copier le code dans le presse-papiers",
  CREATE_NEW_PROJECT: "Créer un nouveau projet",
  CURRENT_PROJECT: "Projet actuel",
  CURRENT_USER_ACCOUNT: "Compte utilisateur actuel",
  DARK_MODE: "Mode sombre",
  DASHBOARD: "Tableau de bord",
  DATA_STRUCTURES_SIMPLIFIED: "Structures de données simplifiées",
  DELETE: "Supprimer",
  DELETE_THIS_PROJECT: "Supprimer ce projet",
  DELETE_X_ARGUMENT: "Supprimer l'argument {name:string}",
  DAILY_PROBLEM_NAV: "Problème du jour",
  DESCRIPTION: "Description",
  DSTRUCT_LOGO: "Logo DStruct",
  EDIT_AND_SAVE:
    "Modifiez <code>pages/index.tsx</code> et enregistrez pour recharger.",
  EDIT_SELECTED_PROJECT: "Modifier le projet sélectionné",
  EDIT_SOLUTION: "Modifier la solution",
  EDIT_TEST_CASE: "Modifier le cas de test",
  EDIT_TEST_CASE_SUMMARY: "Modifiez les détails de votre cas de test.",
  FEEDBACK: "Commentaires",
  FORWARD: "Avancer",
  FORMATTING_ICON: "Icône de formatage",
  FORMAT_CODE_WITH: "Formater le code avec",
  HI: "Bonjour {name:string} !",
  INPUT: "Entrée",
  LANGUAGE: "Langue",
  LOGOUT: "Déconnexion",
  MAIN_MENU: "Menu principal",
  MS: "ms",
  NAME: "Nom",
  NEW: "Nouveau",
  NODE: "Nœud",
  NO_DATA: "Aucune donnée",
  OPEN_OPTIONS: "Ouvrir les options",
  OUTPUT: "Sortie",
  PANEL_TABS: "Onglets du panneau",
  PENDING_CHANGES: "Modifications en attente",
  PLAYBACK_INTERVAL: "Intervalle de lecture",
  PLAYGROUND: "Terrain de jeu",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Veuillez saisir le nom de votre compte LeetCode :",
  PROFILE: "Profil",
  PROJECT: "Projet",
  PROJECT_BROWSER: "Navigateur de projets",
  SEARCH_PROJECTS: "Rechercher des projets par titre...",
  NO_PROJECTS_FOUND: "Aucun projet trouvé",
  NO_PROJECTS_MATCH_FILTERS: "Aucun projet ne correspond à vos filtres",
  FILTERS: "Filtres",
  FILTER_BY_DIFFICULTY: "Difficulté",
  SHOW_ONLY_NEW: "Afficher uniquement les nouveaux projets",
  SHOW_ONLY_MINE: "Afficher uniquement mes projets",
  CLEAR_ALL_FILTERS: "Effacer tous les filtres",
  SORT_BY: "Trier par",
  SORT_TITLE: "Titre",
  SORT_TITLE_ASC: "Titre (A-Z)",
  SORT_TITLE_DESC: "Titre (Z-A)",
  SORT_DIFFICULTY: "Difficulté",
  SORT_DIFFICULTY_ASC: "Difficulté (Facile → Difficile)",
  SORT_DIFFICULTY_DESC: "Difficulté (Difficile → Facile)",
  SORT_DATE: "Date",
  SORT_DATE_ASC: "Date (plus récent d'abord)",
  SORT_DATE_DESC: "Date (plus ancien d'abord)",
  SORT_CATEGORY: "Catégorie",
  SORT_CATEGORY_ASC: "Catégorie (A-Z)",
  SORT_CATEGORY_DESC: "Catégorie (Z-A)",
  REPLAY: "Rejouer",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Rejouer la visualisation précédente du résultat du code",
  RESET: "Réinitialiser",
  RESULTS: "Résultats",
  RESET_DATA_STRUCTURES:
    "Réinitialiser les structures de données à l'état initial",
  RETRY: "Réessayer",
  RETURNED: "Retourné",
  RUN: "Exécuter",
  RUNTIME: "Temps d'exécution",
  RUN_CODE: "Exécuter le code",
  SAVED_IN_THE_CLOUD: "Enregistré dans le cloud",
  SELECTED_LOCALE: "Langue sélectionnée :",
  SETTINGS: "Paramètres",
  SIGN_IN: "Se connecter",
  SIGN_IN_FAILED: "Échec de la connexion",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Connectez-vous pour suivre vos progrès et plus encore !",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Connectez-vous avec GitHub ou Google en haut à droite",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Complexité spatiale",
  SUBMIT: "Soumettre",
  SUCCESS: "Succès",
  SYNCING_WITH_SERVER: "Synchronisation avec le serveur",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Description optionnelle du cas de test",
  TEST_CASE_NAME_HELPER_TEXT: "Nom court de votre cas de test",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Vous pouvez modifier le slug utilisé dans l'URL de ce cas de test",
  TIMESTAMP: "Horodatage",
  TIME_COMPLEXITY: "Complexité temporelle",
  TODAY: "Aujourd'hui nous sommes {date:Date|weekday}",
  TOKEN: "Jeton",
  TREE_VIEWER: "Visualiseur d'arbre",
  TRY_IT_OUT_NOW: "Essayez maintenant",
  TYPE: "Type",
  UPDATE: "Mettre à jour",
  USERNAME: "Nom d'utilisateur",
  USER_DASHBOARD: "Tableau de bord de {name:string}",
  USER_SETTINGS: "Paramètres utilisateur",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualisez vos problèmes LeetCode directement depuis votre code",
  YOUR_CHANGES_WILL_BE_LOST: "Vos modifications seront perdues",
  YOUR_LEETCODE_ACCOUNT_NAME: "Nom de votre compte LeetCode :",
  YOUR_NAME: "Votre nom :",
  YOU_DONT_OWN_THIS_PROJECT: "Vous n'êtes pas propriétaire de ce projet",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Vous devez être connecté pour enregistrer le code",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Exécutez d'abord le code",

  HOME_LANDING_TITLE:
    "Votre code, image par image. Un pas en avant. Un pas en arrière.",
  HOME_LANDING_SUBTITLE:
    "Un terrain de jeu style LeetCode où votre solution devient une trace d'exécution visuelle : arbres, graphes, grilles, structures chaînées et cartes imbriquées. JavaScript et Python dans le navigateur, lecture pas à pas et statistiques de temps optionnelles pour JS.",
  HOME_HERO_FAQ_LINK: "Questions fréquentes",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Étape {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Lecture",
  HOME_LANDING_PREVIEW_PAUSE: "Pause",
  HOME_PREVIEW_STEP_BACK: "Pas en arrière",
  HOME_PREVIEW_STEP_FORWARD: "Pas en avant",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Impossible de charger l'aperçu de la page d'accueil.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Erreur inattendue lors de l'initialisation de l'aperçu.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "inverser l'arbre binaire",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "chemin dans le graphe",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "plus court chemin dans la matrice binaire",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Problème du jour",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Question du jour",
  QUESTION_OF_TODAY_LABEL: "Question du jour",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Aucun projet trouvé pour « {query:string} »",
  HOME_SECTION_HOW_IT_WORKS: "Comment ça marche",
  HOME_HOW_STEP_1_TITLE: "Écrivez votre solution",
  HOME_HOW_STEP_1_BODY:
    "Utilisez l'éditeur intégré avec des modèles familiers pour chaque catégorie de projet.",
  HOME_HOW_STEP_2_TITLE: "Exécuter et enregistrer",
  HOME_HOW_STEP_2_BODY:
    "Les API suivies transforment le travail structurel en pile de cadres—pas d'animation toute faite.",
  HOME_HOW_STEP_3_TITLE: "Faire défiler la chronologie",
  HOME_HOW_STEP_3_BODY:
    "Avancez et reculez, changez la vitesse et inspectez chaque opération dans le journal.",
  HOME_SECTION_WHY_DSTUCT: "Fonctionnalités",
  HOME_PILLAR_VIS_TITLE: "Voyez l'algorithme, pas seulement la sortie",
  HOME_PILLAR_VIS_BODY:
    "Rejouez l'évolution de vos structures de données. Comprenez et déboguez avec une vraie trace d'exécution.",
  HOME_PILLAR_WORKERS_TITLE: "Interface fluide pendant l'exécution",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript dans un Web Worker ; Python via Pyodide dans son propre worker—la page reste réactive.",
  HOME_PILLAR_REPLAY_TITLE: "Lecture « voyage dans le temps »",
  HOME_PILLAR_REPLAY_BODY:
    "Lecture, pause, pas à pas, rejouer et régler la vitesse—raccourcis clavier inclus.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Nombreuses exécutions avec médiane, percentiles et graphique. Le mode benchmark est pour l'instant réservé à JS.",
  HOME_SECTION_LANGUAGES: "Deux langages, un terrain de jeu",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "S'exécute localement dans un worker—pas d'aller-retour pour la visualisation. Prise en charge complète du benchmark.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Vrai CPython via Pyodide dans le navigateur—aucune installation. Préchargé à l'ouverture d'une solution Python ; première visite télécharge le runtime (~30 Mo, puis cache). Bibliothèque standard uniquement.",
  HOME_SECTION_TRY_DEMOS: "Galerie d'algorithmes",
  HOME_TRY_DEMOS_LEAD:
    "Ouvrez un terrain de jeu sélectionné pour voir le débogueur sur un vrai problème, ou passez au navigateur complet.",
  HOME_DEMO_TREE: "Arbre binaire",
  HOME_DEMO_GRAPH: "Chemin dans le graphe",
  HOME_DEMO_GRID: "BFS sur grille",
  HOME_DEMO_TRIE: "Trie / carte",
  HOME_SECTION_FAQ: "Questions courantes",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Enregistrez vos progrès dans le cloud",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Connectez-vous pour synchroniser projets, cas de test et solutions. Explorez des exemples publics sans compte.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Les exécutions ont lieu dans le navigateur ; la connexion sert à enregistrer et aux fonctions sociales.",
  HOME_OPEN_PROFILE: "Ouvrir le profil",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Impossible de générer le lien du profil. Ouvrez-le depuis le menu compte dans l'en-tête.",
  HOME_DAILY_QUESTION_ERROR:
    "Impossible de charger le problème du jour. Réessayez plus tard.",
  HOME_DAILY_SECTION_TITLE: "Vous ne savez pas quoi résoudre ?",
  HOME_DAILY_SECTION_LEAD:
    "Voici un problème quotidien LeetCode—ouvrez-le sur le terrain de jeu quand vous êtes prêt.",

  HOME_FAQ_Q_01: "Pourquoi pas de visualisation après l'exécution ?",
  HOME_FAQ_A_01:
    "La lecture visuelle provient des API suivies des structures de données dStruct. Choisissez la bonne catégorie et les enveloppes attendues par le terrain de jeu. Les objets simples sans ces API peuvent afficher une sortie mais pas de replay pas à pas.",
  HOME_FAQ_Q_02: "Quels problèmes et structures sont pris en charge ?",
  HOME_FAQ_A_02:
    "Arbres, BST, listes chaînées, graphes, grilles et matrices, tableaux, tas, piles, trie, DP, deux pointeurs, fenêtre glissante, backtracking et plus. Parcourez le terrain de jeu ou les catégories à la création d'un projet.",
  HOME_FAQ_Q_03: "Dois-je installer Python ?",
  HOME_FAQ_A_03:
    "Non pour un usage normal. JavaScript en Web Worker ; Python avec Pyodide dans le navigateur. Serveur Python local optionnel pour les développeurs.",
  HOME_FAQ_Q_04: "Mon code s'exécute-t-il sur vos serveurs ?",
  HOME_FAQ_A_04:
    "Par défaut non—l'exécution est dans le navigateur. Sauvegarde, connexion et cloud utilisent le backend comme toute application web.",
  HOME_FAQ_Q_05: "Puis-je utiliser JavaScript et Python ?",
  HOME_FAQ_A_05:
    "Oui. Les projets peuvent avoir des solutions JS et Python séparées. Le mode benchmark est pour l'instant réservé à JavaScript.",
  HOME_FAQ_Q_06: "Pourquoi Python affiche une barre de chargement ?",
  HOME_FAQ_A_06:
    "Pyodide se précharge en arrière-plan à l'ouverture d'une page Python. La première visite télécharge le runtime (~30 Mo, puis cache) ; le démarrage WASM peut prendre quelques secondes même depuis le cache.",
  HOME_FAQ_Q_07: "Puis-je utiliser NumPy ou pip ?",
  HOME_FAQ_A_07:
    "Pas sur le terrain de jeu par défaut—bibliothèque standard uniquement. Les imports tiers échoueront.",
  HOME_FAQ_Q_08: "Combien de temps peut durer une exécution ?",
  HOME_FAQ_A_08:
    "Python expire après 30 secondes par défaut ; le worker est recréé. L'annulation est grossière pour les charges très lourdes.",
  HOME_FAQ_Q_09: "Comment sauvegarder mon travail ?",
  HOME_FAQ_A_09:
    "Projets publics et éditeur sans connexion. Pour persister projets, tests et solutions nommées, connectez-vous.",
  HOME_FAQ_Q_10: "Puis-je partager des projets ou apprendre des autres ?",
  HOME_FAQ_A_10:
    "Oui. Rendez un projet public et utilisez Parcourir pour découvrir des exemples.",
  HOME_FAQ_Q_11: "À quoi sert le lien avec mon compte LeetCode ?",
  HOME_FAQ_A_11:
    "Fonctions de profil optionnelles, collage d'URL de problème pour les métadonnées et raccourcis vers LeetCode. La soumission reste sur LeetCode—dStruct est un terrain de jeu compagnon.",
  HOME_FAQ_Q_12: "Puis-je mesurer la vitesse de ma solution ?",
  HOME_FAQ_A_12:
    "Oui, pour JavaScript—mode Benchmark (nombreuses itérations, médiane, percentiles, graphique). Python n'a pas encore de benchmark.",
  HOME_FAQ_Q_13: "dStruct fonctionne-t-il sur téléphone ou tablette ?",
  HOME_FAQ_A_13:
    "Flux de terrain de jeu adapté au mobile avec keep-alive au changement d'onglet. Les longues sessions d'édition restent plus confortables sur bureau.",
  HOME_FAQ_Q_14: "dStruct est-il open source ?",
  HOME_FAQ_A_14:
    "Oui. Voir le fichier LICENSE dans le dépôt (AGPL-3.0).",
};

export default fr;
