import en from "../en";
import type { Translation } from "../i18n-types";

const ptOverrides = {
  ACTION: "Ação",
  ADD_ARGUMENT: "Adicionar argumento",
  ADD_NEW_SOLUTION: "Adicionar nova solução",
  ARGUMENTS: "Argumentos",
  BROWSE: "Explorar",
  BROWSE_PROJECTS: "Explorar projetos",
  BACK: "Voltar",
  CALLSTACK: "Pilha de chamadas",
  CANCEL: "Cancelar",
  CODE: "Código",
  CHOOSE_LOCALE: "Escolher idioma...",
  CODE_COPIED_TO_CLIPBOARD: "Código copiado para a área de transferência",
  CODE_RUNNER: "Executor de código",
  CONSOLE_OUTPUT: "Saída do console",
  CONTINUE: "Continuar",
  COPY: "Copiar",
  COPY_CODE_TO_CLIPBOARD: "Copiar código para a área de transferência",
  CREATE_NEW_PROJECT: "Criar novo projeto",
  CURRENT_PROJECT: "Projeto atual",
  CURRENT_USER_ACCOUNT: "Conta de usuário atual",
  DARK_MODE: "Modo escuro",
  DASHBOARD: "Painel",
  DATA_STRUCTURES_SIMPLIFIED: "Estruturas de dados simplificadas",
  DELETE: "Excluir",
  DELETE_THIS_PROJECT: "Excluir este projeto",
  DELETE_X_ARGUMENT: "Excluir argumento {name:string}",
  DAILY_PROBLEM_NAV: "Problema do dia",
  DESCRIPTION: "Descrição",
  DSTRUCT_LOGO: "Logotipo DStruct",
  EDIT_AND_SAVE:
    "Edite <code>pages/index.tsx</code> e salve para recarregar.",
  EDIT_SELECTED_PROJECT: "Editar projeto selecionado",
  EDIT_SOLUTION: "Editar solução",
  EDIT_TEST_CASE: "Editar caso de teste",
  EDIT_TEST_CASE_SUMMARY: "Edite os detalhes do seu caso de teste.",
  FEEDBACK: "Feedback",
  FORWARD: "Avançar",
  FORMATTING_ICON: "Ícone de formatação",
  FORMAT_CODE_WITH: "Formatar código com",
  HI: "Olá, {name:string}!",
  INPUT: "Entrada",
  LANGUAGE: "Idioma",
  LOGOUT: "Sair",
  MAIN_MENU: "Menu principal",
  MS: "ms",
  NAME: "Nome",
  NEW: "Novo",
  NODE: "Nó",
  NO_DATA: "Sem dados",
  OPEN_OPTIONS: "Abrir opções",
  OUTPUT: "Saída",
  PANEL_TABS: "Abas do painel",
  PENDING_CHANGES: "Alterações pendentes",
  PLAYBACK_INTERVAL: "Intervalo de reprodução",
  PLAYGROUND: "Playground",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Digite o nome da sua conta LeetCode:",
  PROFILE: "Perfil",
  PROJECT: "Projeto",
  PROJECT_BROWSER: "Navegador de projetos",
  SEARCH_PROJECTS: "Buscar projetos por título...",
  NO_PROJECTS_FOUND: "Nenhum projeto encontrado",
  NO_PROJECTS_MATCH_FILTERS: "Nenhum projeto corresponde aos filtros",
  FILTERS: "Filtros",
  FILTER_BY_DIFFICULTY: "Dificuldade",
  SHOW_ONLY_NEW: "Mostrar apenas projetos novos",
  SHOW_ONLY_MINE: "Mostrar apenas meus projetos",
  CLEAR_ALL_FILTERS: "Limpar todos os filtros",
  SORT_BY: "Ordenar por",
  SORT_TITLE: "Título",
  SORT_TITLE_ASC: "Título (A-Z)",
  SORT_TITLE_DESC: "Título (Z-A)",
  SORT_DIFFICULTY: "Dificuldade",
  SORT_DIFFICULTY_ASC: "Dificuldade (Fácil → Difícil)",
  SORT_DIFFICULTY_DESC: "Dificuldade (Difícil → Fácil)",
  SORT_DATE: "Data",
  SORT_DATE_ASC: "Data (mais recentes primeiro)",
  SORT_DATE_DESC: "Data (mais antigos primeiro)",
  SORT_CATEGORY: "Categoria",
  SORT_CATEGORY_ASC: "Categoria (A-Z)",
  SORT_CATEGORY_DESC: "Categoria (Z-A)",
  REPLAY: "Repetir",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Repetir visualização anterior do resultado do código",
  RESET: "Redefinir",
  RESULTS: "Resultados",
  RESET_DATA_STRUCTURES:
    "Redefinir estruturas de dados para o estado inicial",
  RETRY: "Tentar novamente",
  RETURNED: "Retornado",
  RUN: "Executar",
  RUNTIME: "Tempo de execução",
  RUN_CODE: "Executar código",
  SAVED_IN_THE_CLOUD: "Salvo na nuvem",
  SELECTED_LOCALE: "Idioma selecionado:",
  SETTINGS: "Configurações",
  SIGN_IN: "Entrar",
  SIGN_IN_FAILED: "Falha ao entrar",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Entre para acompanhar seu progresso e muito mais!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Entre com GitHub ou Google no canto superior direito",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Complexidade de espaço",
  SUBMIT: "Enviar",
  SUCCESS: "Sucesso",
  SYNCING_WITH_SERVER: "Sincronizando com o servidor",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Descrição opcional do caso de teste",
  TEST_CASE_NAME_HELPER_TEXT: "Nome curto do caso de teste",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Você pode editar o slug usado na URL deste caso de teste",
  TIMESTAMP: "Carimbo de data/hora",
  TIME_COMPLEXITY: "Complexidade de tempo",
  TODAY: "Hoje é {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Visualizador de árvore",
  TRY_IT_OUT_NOW: "Experimente agora",
  TYPE: "Tipo",
  UPDATE: "Atualizar",
  USERNAME: "Nome de usuário",
  USER_DASHBOARD: "Painel de {name:string}",
  USER_SETTINGS: "Configurações do usuário",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Visualize seus problemas do LeetCode diretamente do seu código",
  YOUR_CHANGES_WILL_BE_LOST: "Suas alterações serão perdidas",
  YOUR_LEETCODE_ACCOUNT_NAME: "Nome da sua conta LeetCode:",
  YOUR_NAME: "Seu nome:",
  YOU_DONT_OWN_THIS_PROJECT: "Você não é dono deste projeto",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "É necessário entrar para salvar o código",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Execute o código primeiro",

  HOME_LANDING_TITLE:
    "Seu código, quadro a quadro. Um passo à frente. Um passo atrás.",
  HOME_LANDING_SUBTITLE:
    "Um playground estilo LeetCode onde sua solução vira um rastro visual de execução: árvores, grafos, grades, estruturas encadeadas e mapas aninhados. JavaScript e Python no navegador, reprodução passo a passo e estatísticas de tempo opcionais para JS.",
  HOME_HERO_FAQ_LINK: "Perguntas frequentes",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Passo {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Reproduzir",
  HOME_LANDING_PREVIEW_PAUSE: "Pausa",
  HOME_PREVIEW_STEP_BACK: "Passo anterior",
  HOME_PREVIEW_STEP_FORWARD: "Próximo passo",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Não foi possível carregar a prévia da página inicial.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Erro inesperado ao inicializar a prévia.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "inverter árvore binária",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "verificar caminho no grafo",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "menor caminho em matriz binária",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Problema do dia",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Pergunta do dia",
  QUESTION_OF_TODAY_LABEL: "Pergunta do dia",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Nenhum projeto encontrado para \"{query:string}\"",
  HOME_SECTION_HOW_IT_WORKS: "Como funciona",
  HOME_HOW_STEP_1_TITLE: "Escreva sua solução",
  HOME_HOW_STEP_1_BODY:
    "Use o editor integrado com padrões familiares para cada categoria de projeto.",
  HOME_HOW_STEP_2_TITLE: "Execute e grave",
  HOME_HOW_STEP_2_BODY:
    "APIs rastreadas transformam o trabalho estrutural em uma pilha de quadros—sem animação pronta.",
  HOME_HOW_STEP_3_TITLE: "Percorra a linha do tempo",
  HOME_HOW_STEP_3_BODY:
    "Avance e volte, altere a velocidade e inspecione cada operação no log.",
  HOME_SECTION_WHY_DSTUCT: "Recursos",
  HOME_PILLAR_VIS_TITLE: "Veja o algoritmo, não só a saída",
  HOME_PILLAR_VIS_BODY:
    "Reproduza como suas estruturas de dados mudam. Entenda e depure com um rastro real de execução.",
  HOME_PILLAR_WORKERS_TITLE: "Interface fluida enquanto o código roda",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript em um Web Worker; Python com Pyodide em worker próprio—a página permanece responsiva.",
  HOME_PILLAR_REPLAY_TITLE: "Reprodução com viagem no tempo",
  HOME_PILLAR_REPLAY_BODY:
    "Reproduzir, pausar, passo, repetir e ajustar velocidade—com atalhos de teclado.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Muitas execuções com mediana, percentis e gráfico. Modo benchmark é só JS por enquanto.",
  HOME_SECTION_LANGUAGES: "Duas linguagens, um playground",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Roda localmente em worker—sem ida e volta para visualização. Suporte completo a benchmark.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "CPython real via Pyodide no navegador—sem instalação. Pré-carrega ao abrir solução Python; primeira visita baixa o runtime (depois em cache). Apenas biblioteca padrão.",
  HOME_SECTION_TRY_DEMOS: "Galeria de algoritmos",
  HOME_TRY_DEMOS_LEAD:
    "Abra um playground curado para ver o depurador em um problema real ou vá ao navegador completo.",
  HOME_DEMO_TREE: "Árvore binária",
  HOME_DEMO_GRAPH: "Caminho no grafo",
  HOME_DEMO_GRID: "BFS em grade",
  HOME_DEMO_TRIE: "Trie / mapa",
  HOME_SECTION_FAQ: "Perguntas comuns",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Salve o progresso na nuvem",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Entre para sincronizar projetos, casos de teste e soluções. Explore exemplos públicos sem conta.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "As execuções rodam no navegador; entrar serve para salvar e recursos sociais.",
  HOME_OPEN_PROFILE: "Abrir perfil",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Não foi possível gerar o link do perfil. Abra pelo menu da conta no cabeçalho.",
  HOME_DAILY_QUESTION_ERROR:
    "Não foi possível carregar o problema do dia. Tente mais tarde.",
  HOME_DAILY_SECTION_TITLE: "Não sabe o que resolver?",
  HOME_DAILY_SECTION_LEAD:
    "Aqui está um problema diário do LeetCode—abra no playground quando estiver pronto.",

  HOME_FAQ_Q_01: "Por que não há visualização depois de executar?",
  HOME_FAQ_A_01:
    "A reprodução visual vem das APIs rastreadas de estruturas de dados do dStruct. Escolha a categoria certa e use os wrappers que o playground espera. Objetos simples sem essas APIs podem imprimir saída, mas não um replay passo a passo.",
  HOME_FAQ_Q_02: "Quais problemas e estruturas são suportados?",
  HOME_FAQ_A_02:
    "Árvores, BST, listas encadeadas, grafos, grades e matrizes, arrays, heaps, pilhas, trie, DP, dois ponteiros, janela deslizante, backtracking e mais. Explore o playground ou categorias ao criar um projeto.",
  HOME_FAQ_Q_03: "Preciso instalar Python?",
  HOME_FAQ_A_03:
    "Não para uso normal. JavaScript em Web Worker; Python com Pyodide no navegador. Servidor Python local é opcional para desenvolvedores.",
  HOME_FAQ_Q_04: "Meu código roda nos seus servidores?",
  HOME_FAQ_A_04:
    "Por padrão não—a execução é no navegador. Salvar projetos, login e nuvem usam o backend como qualquer app web.",
  HOME_FAQ_Q_05: "Posso usar JavaScript e Python?",
  HOME_FAQ_A_05:
    "Sim. Projetos podem ter soluções separadas em JS e Python. Modo benchmark é só JavaScript por enquanto.",
  HOME_FAQ_Q_06: "Por que o Python mostra barra de carregamento?",
  HOME_FAQ_A_06:
    "Pyodide pré-carrega em segundo plano ao abrir página Python. A primeira visita baixa o runtime (~30 MB, depois cache); o WASM pode levar alguns segundos mesmo do cache.",
  HOME_FAQ_Q_07: "Posso usar NumPy ou pacotes pip?",
  HOME_FAQ_A_07:
    "Não no playground padrão—apenas biblioteca padrão. Importações de terceiros falham.",
  HOME_FAQ_Q_08: "Quanto tempo pode durar uma execução?",
  HOME_FAQ_A_08:
    "Python expira após 30 segundos por padrão; o worker é recriado. Cancelamento é grosseiro para cargas muito pesadas.",
  HOME_FAQ_Q_09: "Como salvo meu trabalho?",
  HOME_FAQ_A_09:
    "Use projetos públicos e o editor sem entrar. Para persistir projetos, testes e soluções nomeadas, entre.",
  HOME_FAQ_Q_10: "Posso compartilhar projetos ou aprender com outros?",
  HOME_FAQ_A_10:
    "Sim. Torne o projeto público e use Explorar para descobrir exemplos.",
  HOME_FAQ_Q_11: "Para que serve vincular minha conta LeetCode?",
  HOME_FAQ_A_11:
    "Recursos opcionais de perfil, colar URL do problema para metadados e atalhos para o mesmo problema no LeetCode. Enviar soluções continua no LeetCode—dStruct é um playground complementar.",
  HOME_FAQ_Q_12: "Posso medir a velocidade da minha solução?",
  HOME_FAQ_A_12:
    "Sim, para JavaScript—modo Benchmark (muitas iterações, mediana, percentis, gráfico). Python ainda não tem benchmark.",
  HOME_FAQ_Q_13: "O dStruct funciona no celular ou tablet?",
  HOME_FAQ_A_13:
    "Há fluxo de playground adaptado ao mobile com keep-alive ao trocar de aba. Sessões longas de edição são mais fáceis no desktop.",
  HOME_FAQ_Q_14: "O dStruct é open source?",
  HOME_FAQ_A_14:
    "Sim. Veja o arquivo LICENSE no repositório (AGPL-3.0).",
} satisfies Partial<Record<keyof Translation, string>>;

const pt = { ...en, ...ptOverrides } as Translation;
export default pt;
