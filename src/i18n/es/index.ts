import type { Translation } from "../i18n-types";

const es: Record<keyof Translation, string> = {
  ACTION: "Acción",
  ADD_ARGUMENT: "Añadir argumento",
  ADD_NEW_SOLUTION: "Añadir nueva solución",
  ARGUMENTS: "Argumentos",
  BROWSE: "Explorar",
  BROWSE_PROJECTS: "Explorar proyectos",
  BACK: "Atrás",
  CALLSTACK: "Pila de llamadas",
  CANCEL: "Cancelar",
  CODE: "Código",
  CHOOSE_LOCALE: "Elegir idioma...",
  CODE_COPIED_TO_CLIPBOARD: "Código copiado al portapapeles",
  CODE_RUNNER: "Ejecutor de código",
  CONSOLE_OUTPUT: "Salida de consola",
  CONTINUE: "Continuar",
  COPY: "Copiar",
  COPY_CODE_TO_CLIPBOARD: "Copiar código al portapapeles",
  CREATE_NEW_PROJECT: "Crear nuevo proyecto",
  CURRENT_PROJECT: "Proyecto actual",
  CURRENT_USER_ACCOUNT: "Cuenta de usuario actual",
  DARK_MODE: "Modo oscuro",
  DASHBOARD: "Panel",
  DATA_STRUCTURES_SIMPLIFIED: "Estructuras de datos simplificadas",
  DELETE: "Eliminar",
  DELETE_THIS_PROJECT: "Eliminar este proyecto",
  DELETE_X_ARGUMENT: "Eliminar el argumento {name:string}",
  DAILY_PROBLEM_NAV: "Problema del día",
  DESCRIPTION: "Descripción",
  DSTRUCT_LOGO: "Logotipo de DStruct",
  EDIT_AND_SAVE:
    "Edita <code>pages/index.tsx</code> y guarda para recargar.",
  EDIT_SELECTED_PROJECT: "Editar proyecto seleccionado",
  EDIT_SOLUTION: "Editar solución",
  EDIT_TEST_CASE: "Editar caso de prueba",
  EDIT_TEST_CASE_SUMMARY: "Edita los detalles de tu caso de prueba.",
  FEEDBACK: "Comentarios",
  FORWARD: "Adelante",
  FORMATTING_ICON: "Icono de formato",
  FORMAT_CODE_WITH: "Formatear código con",
  FORMAT_CODE_WITH_BLACK: "Formatear código con Black (Pyodide)",
  HI: "¡Hola, {name:string}!",
  INPUT: "Entrada",
  LANGUAGE: "Idioma",
  LOGOUT: "Cerrar sesión",
  MAIN_MENU: "Menú principal",
  MS: "ms",
  NAME: "Nombre",
  NEW: "Nuevo",
  NODE: "Nodo",
  NO_DATA: "Sin datos",
  OPEN_OPTIONS: "Abrir opciones",
  OUTPUT: "Salida",
  PANEL_TABS: "Pestañas del panel",
  PENDING_CHANGES: "Cambios pendientes",
  PLAYBACK_INTERVAL: "Intervalo de reproducción",
  PLAYGROUND: "Playground",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Introduce el nombre de tu cuenta de LeetCode:",
  PROFILE: "Perfil",
  PROJECT: "Proyecto",
  PROJECT_BROWSER: "Explorador de proyectos",
  SEARCH_PROJECTS: "Buscar proyectos por título...",
  NO_PROJECTS_FOUND: "No se encontraron proyectos",
  NO_PROJECTS_MATCH_FILTERS: "Ningún proyecto coincide con tus filtros",
  FILTERS: "Filtros",
  FILTER_BY_DIFFICULTY: "Dificultad",
  SHOW_ONLY_NEW: "Mostrar solo proyectos nuevos",
  SHOW_ONLY_MINE: "Mostrar solo mis proyectos",
  CLEAR_ALL_FILTERS: "Borrar todos los filtros",
  SORT_BY: "Ordenar por",
  SORT_TITLE: "Título",
  SORT_TITLE_ASC: "Título (A-Z)",
  SORT_TITLE_DESC: "Título (Z-A)",
  SORT_DIFFICULTY: "Dificultad",
  SORT_DIFFICULTY_ASC: "Dificultad (Fácil → Difícil)",
  SORT_DIFFICULTY_DESC: "Dificultad (Difícil → Fácil)",
  SORT_DATE: "Fecha",
  SORT_DATE_ASC: "Fecha (más recientes primero)",
  SORT_DATE_DESC: "Fecha (más antiguos primero)",
  SORT_CATEGORY: "Categoría",
  SORT_CATEGORY_ASC: "Categoría (A-Z)",
  SORT_CATEGORY_DESC: "Categoría (Z-A)",
  REPLAY: "Repetir",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Repetir la visualización anterior del resultado del código",
  RESET: "Restablecer",
  RESULTS: "Resultados",
  RESET_DATA_STRUCTURES:
    "Restablecer las estructuras de datos a su estado inicial",
  RETRY: "Reintentar",
  RETURNED: "Devuelto",
  RUN: "Ejecutar",
  RUNTIME: "Tiempo de ejecución",
  RUN_CODE: "Ejecutar código",
  SAVED_IN_THE_CLOUD: "Guardado en la nube",
  SELECTED_LOCALE: "Idioma seleccionado:",
  SETTINGS: "Ajustes",
  SIGN_IN: "Iniciar sesión",
  SIGN_IN_FAILED: "Error al iniciar sesión",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Inicia sesión para seguir tu progreso y mucho más.",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Inicia sesión con GitHub o Google arriba a la derecha",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Complejidad espacial",
  SUBMIT: "Enviar",
  SUCCESS: "Correcto",
  SYNCING_WITH_SERVER: "Sincronizando con el servidor",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Descripción opcional del caso de prueba",
  TEST_CASE_NAME_HELPER_TEXT: "Nombre breve del caso de prueba",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Puedes editar el slug usado en la URL de este caso de prueba",
  TIMESTAMP: "Marca de tiempo",
  TIME_COMPLEXITY: "Complejidad temporal",
  TODAY: "Hoy es {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Visor de árbol",
  TRY_IT_OUT_NOW: "Pruébalo ahora",
  TYPE: "Tipo",
  UPDATE: "Actualizar",
  USERNAME: "Nombre de usuario",
  USER_DASHBOARD: "Panel de {name:string}",
  USER_SETTINGS: "Ajustes de usuario",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualiza tus problemas de LeetCode directamente desde tu código",
  YOUR_CHANGES_WILL_BE_LOST: "Tus cambios se perderán",
  YOUR_LEETCODE_ACCOUNT_NAME: "Tu nombre de cuenta de LeetCode:",
  YOUR_NAME: "Tu nombre:",
  YOU_DONT_OWN_THIS_PROJECT: "No eres el dueño de este proyecto",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Debes iniciar sesión para guardar código",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Primero debes ejecutar el código",

  HOME_LANDING_TITLE:
    "Tu código, fotograma a fotograma. Un paso adelante. Un paso atrás.",
  HOME_LANDING_SUBTITLE:
    "Un playground al estilo LeetCode donde tu solución se convierte en un rastro visual de ejecución: árboles, grafos, cuadrículas, estructuras enlazadas y mapas anidados. JavaScript y Python en el navegador, reproducción paso a paso y estadísticas de tiempo opcionales para JS.",
  HOME_HERO_FAQ_LINK: "Preguntas frecuentes",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Paso {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Reproducir",
  HOME_LANDING_PREVIEW_PAUSE: "Pausa",
  HOME_PREVIEW_STEP_BACK: "Paso atrás",
  HOME_PREVIEW_STEP_FORWARD: "Paso adelante",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "No se pudo cargar la vista previa de la página principal.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Error inesperado al inicializar la vista previa.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "invertir árbol binario",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "comprobar si existe un camino en el grafo",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "camino más corto en matriz binaria",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Problema del día",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Pregunta del día",
  QUESTION_OF_TODAY_LABEL: "Pregunta del día",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "No se encontraron proyectos para «{query:string}»",
  HOME_SECTION_HOW_IT_WORKS: "Cómo funciona",
  HOME_HOW_STEP_1_TITLE: "Escribe tu solución",
  HOME_HOW_STEP_1_BODY:
    "Usa el editor integrado con patrones habituales para cada categoría de proyecto.",
  HOME_HOW_STEP_2_TITLE: "Ejecuta y registra",
  HOME_HOW_STEP_2_BODY:
    "Las API rastreadas convierten el trabajo estructural en una pila de marcos: sin animaciones prefabricadas.",
  HOME_HOW_STEP_3_TITLE: "Desplázate por la línea de tiempo",
  HOME_HOW_STEP_3_BODY:
    "Avanza y retrocede, cambia la velocidad e inspecciona cada operación en el registro.",
  HOME_SECTION_WHY_DSTUCT: "Capacidades",
  HOME_PILLAR_VIS_TITLE: "Ve el algoritmo, no solo la salida",
  HOME_PILLAR_VIS_BODY:
    "Reproduce cómo cambian tus estructuras de datos. Comprende y depura con un rastro real de ejecución.",
  HOME_PILLAR_WORKERS_TITLE: "Interfaz fluida mientras corre el código",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript en un Web Worker; Python con Pyodide en su propio worker para que la página siga respondiendo.",
  HOME_PILLAR_REPLAY_TITLE: "Reproducción con viaje en el tiempo",
  HOME_PILLAR_REPLAY_BODY:
    "Reproduce, pausa, avanza paso a paso, repite y ajusta la velocidad, con atajos de teclado.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark de JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Muchas ejecuciones con mediana, percentiles y gráfico. El modo benchmark es solo para JS por ahora.",
  HOME_SECTION_LANGUAGES: "Dos lenguajes, un playground",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Se ejecuta localmente en un worker, sin ida y vuelta para la visualización. Soporte completo de benchmark.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "CPython real vía Pyodide en el navegador, sin instalación. Se precarga al abrir una solución en Python; la primera visita descarga el runtime (luego en caché). Solo biblioteca estándar.",
  HOME_SECTION_TRY_DEMOS: "Galería de algoritmos",
  HOME_TRY_DEMOS_LEAD:
    "Abre un playground seleccionado para ver el depurador en un problema real, o ve al explorador completo.",
  HOME_DEMO_TREE: "Árbol binario",
  HOME_DEMO_GRAPH: "Camino en grafo",
  HOME_DEMO_GRID: "BFS en cuadrícula",
  HOME_DEMO_TRIE: "Trie / mapa",
  HOME_SECTION_FAQ: "Preguntas frecuentes",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Guarda el progreso en la nube",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Inicia sesión para sincronizar proyectos, casos de prueba y soluciones. Explora ejemplos públicos sin cuenta.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Las ejecuciones ocurren en el navegador; iniciar sesión sirve para guardar y funciones sociales.",
  HOME_OPEN_PROFILE: "Abrir perfil",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "No pudimos generar el enlace a tu perfil. Ábrelo desde el menú de cuenta en la cabecera.",
  HOME_DAILY_QUESTION_ERROR:
    "No pudimos cargar el problema del día. Inténtalo más tarde.",
  HOME_DAILY_SECTION_TITLE: "¿No sabes qué resolver?",
  HOME_DAILY_SECTION_LEAD:
    "Aquí tienes un problema diario de LeetCode: ábrelo en el playground cuando quieras.",

  HOME_FAQ_Q_01: "¿Por qué no hay visualización después de ejecutar?",
  HOME_FAQ_A_01:
    "La reproducción visual proviene de las API rastreadas de estructuras de datos de dStruct. Elige una categoría adecuada y usa los envoltorios que espera el playground. Objetos planos sin esas API pueden imprimir salida pero no un replay paso a paso.",
  HOME_FAQ_Q_02: "¿Qué problemas y estructuras se admiten?",
  HOME_FAQ_A_02:
    "Árboles, BST, listas enlazadas, grafos, cuadrículas y matrices, arrays, montículos, pilas, trie, DP, dos punteros, ventana deslizante, backtracking y más. Explora el playground o las categorías al crear un proyecto.",
  HOME_FAQ_Q_03: "¿Necesito instalar Python?",
  HOME_FAQ_A_03:
    "No para el uso normal. JavaScript en Web Worker; Python con Pyodide en el navegador. Un servidor Python local es opcional solo para desarrolladores.",
  HOME_FAQ_Q_04: "¿Mi código se ejecuta en vuestros servidores?",
  HOME_FAQ_A_04:
    "Por defecto no: la ejecución es en tu navegador. Guardar proyectos, inicio de sesión y explorar proyectos en la nube usan el backend como en cualquier web.",
  HOME_FAQ_Q_05: "¿Puedo usar JavaScript y Python?",
  HOME_FAQ_A_05:
    "Sí. Los proyectos pueden tener soluciones separadas en JS y Python. El modo benchmark es solo JavaScript por ahora.",
  HOME_FAQ_Q_06: "¿Por qué Python muestra una barra de carga?",
  HOME_FAQ_A_06:
    "Pyodide se precarga en segundo plano al abrir una página Python. La primera visita descarga el runtime (~30 MB, luego caché); el arranque WASM puede tardar unos segundos incluso desde caché.",
  HOME_FAQ_Q_07: "¿Puedo usar NumPy o paquetes de pip?",
  HOME_FAQ_A_07:
    "No en el playground por defecto: solo biblioteca estándar. Las importaciones de terceros fallarán.",
  HOME_FAQ_Q_08: "¿Cuánto puede durar una ejecución?",
  HOME_FAQ_A_08:
    "Python corta a los 30 segundos por defecto; el worker se recrea. La cancelación es tosca con cargas muy pesadas.",
  HOME_FAQ_Q_09: "¿Cómo guardo mi trabajo?",
  HOME_FAQ_A_09:
    "Puedes usar proyectos públicos y el editor sin iniciar sesión. Para persistir proyectos, casos de prueba y soluciones con nombre, inicia sesión.",
  HOME_FAQ_Q_10: "¿Puedo compartir proyectos o aprender de otros?",
  HOME_FAQ_A_10:
    "Sí. Haz un proyecto público y usa Explorar para descubrir ejemplos.",
  HOME_FAQ_Q_11: "¿Para qué sirve vincular mi cuenta de LeetCode?",
  HOME_FAQ_A_11:
    "Funciones opcionales de perfil, pegar una URL de problema para rellenar metadatos y atajos al mismo problema en LeetCode. Enviar soluciones sigue siendo en LeetCode: dStruct es un playground complementario.",
  HOME_FAQ_Q_12: "¿Puedo medir qué tan rápida es mi solución?",
  HOME_FAQ_A_12:
    "Sí, en JavaScript: modo Benchmark (muchas iteraciones, mediana, percentiles, gráfico). Python aún no tiene benchmark.",
  HOME_FAQ_Q_13: "¿Funciona dStruct en móvil o tableta?",
  HOME_FAQ_A_13:
    "Hay un flujo de playground adaptado al móvil con keep-alive al cambiar de pestaña. Sesiones largas de edición son más cómodas en escritorio.",
  HOME_FAQ_Q_14: "¿dStruct es de código abierto?",
  HOME_FAQ_A_14:
    "Sí. Consulta el archivo LICENSE en el repositorio (AGPL-3.0).",
};

export default es;
