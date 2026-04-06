import type { Translation } from "../i18n-types";

const uk: Record<keyof Translation, string> = {
  ACTION: "Дія",
  ADD_ARGUMENT: "Додати аргумент",
  ADD_NEW_SOLUTION: "Додати нове рішення",
  ARGUMENTS: "Аргументи",
  BROWSE: "Огляд",
  BROWSE_PROJECTS: "Огляд проєктів",
  BACK: "Назад",
  CALLSTACK: "Стек викликів",
  CANCEL: "Скасувати",
  CODE: "Код",
  CHOOSE_LOCALE: "Виберіть мову...",
  CODE_COPIED_TO_CLIPBOARD: "Код скопійовано в буфер обміну",
  CODE_RUNNER: "Запуск коду",
  CONSOLE_OUTPUT: "Вивід консолі",
  CONTINUE: "Продовжити",
  COPY: "Копіювати",
  COPY_CODE_TO_CLIPBOARD: "Скопіювати код у буфер обміну",
  CREATE_NEW_PROJECT: "Створити новий проєкт",
  CURRENT_PROJECT: "Поточний проєкт",
  CURRENT_USER_ACCOUNT: "Поточний обліковий запис",
  DARK_MODE: "Темний режим",
  DASHBOARD: "Панель",
  DATA_STRUCTURES_SIMPLIFIED: "Спрощені структури даних",
  DELETE: "Видалити",
  DELETE_THIS_PROJECT: "Видалити цей проєкт",
  DELETE_X_ARGUMENT: "Видалити аргумент {name:string}",
  DAILY_PROBLEM_NAV: "Задача дня",
  DESCRIPTION: "Опис",
  DSTRUCT_LOGO: "Логотип DStruct",
  EDIT_AND_SAVE:
    "Редагуйте <code>pages/index.tsx</code> і збережіть, щоб перезавантажити.",
  EDIT_SELECTED_PROJECT: "Редагувати вибраний проєкт",
  EDIT_SOLUTION: "Редагувати рішення",
  EDIT_TEST_CASE: "Редагувати тест-кейс",
  EDIT_TEST_CASE_SUMMARY: "Змініть деталі тест-кейса.",
  FEEDBACK: "Зворотний зв'язок",
  FORWARD: "Уперед",
  FORMATTING_ICON: "Піктограма форматування",
  FORMAT_CODE_WITH: "Форматувати код за допомогою",
  FORMAT_CODE_WITH_BLACK: "Format code with Black (Pyodide)",
  HI: "Привіт, {name:string}!",
  INPUT: "Вхід",
  LANGUAGE: "Мова",
  LOGOUT: "Вийти",
  MAIN_MENU: "Головне меню",
  MS: "мс",
  NAME: "Ім'я",
  NEW: "Новий",
  NODE: "Вузол",
  NO_DATA: "Немає даних",
  OPEN_OPTIONS: "Відкрити параметри",
  OUTPUT: "Вихід",
  PANEL_TABS: "Вкладки панелі",
  PENDING_CHANGES: "Незбережені зміни",
  PLAYBACK_INTERVAL: "Інтервал відтворення",
  PLAYGROUND: "Майданчик",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Введіть ім'я вашого облікового запису LeetCode:",
  PROFILE: "Профіль",
  PROJECT: "Проєкт",
  PROJECT_BROWSER: "Оглядач проєктів",
  SEARCH_PROJECTS: "Пошук проєктів за назвою...",
  NO_PROJECTS_FOUND: "Проєктів не знайдено",
  NO_PROJECTS_MATCH_FILTERS: "Немає проєктів, що відповідають фільтрам",
  FILTERS: "Фільтри",
  FILTER_BY_DIFFICULTY: "Складність",
  SHOW_ONLY_NEW: "Лише нові проєкти",
  SHOW_ONLY_MINE: "Лише мої проєкти",
  CLEAR_ALL_FILTERS: "Очистити всі фільтри",
  SORT_BY: "Сортувати за",
  SORT_TITLE: "Назва",
  SORT_TITLE_ASC: "Назва (А–Я)",
  SORT_TITLE_DESC: "Назва (Я–А)",
  SORT_DIFFICULTY: "Складність",
  SORT_DIFFICULTY_ASC: "Складність (Легко → Складно)",
  SORT_DIFFICULTY_DESC: "Складність (Складно → Легко)",
  SORT_DATE: "Дата",
  SORT_DATE_ASC: "Дата (спочатку новіші)",
  SORT_DATE_DESC: "Дата (спочатку старіші)",
  SORT_CATEGORY: "Категорія",
  SORT_CATEGORY_ASC: "Категорія (А–Я)",
  SORT_CATEGORY_DESC: "Категорія (Я–А)",
  REPLAY: "Повтор",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Повторити попередню візуалізацію результату коду",
  RESET: "Скинути",
  RESULTS: "Результати",
  RESET_DATA_STRUCTURES:
    "Скинути структури даних до початкового стану",
  RETRY: "Повторити",
  RETURNED: "Повернуто",
  RUN: "Запуск",
  RUNTIME: "Час виконання",
  RUN_CODE: "Запустити код",
  SAVED_IN_THE_CLOUD: "Збережено в хмарі",
  SELECTED_LOCALE: "Обрана мова:",
  SETTINGS: "Налаштування",
  SIGN_IN: "Увійти",
  SIGN_IN_FAILED: "Не вдалося увійти",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Увійдіть, щоб відстежувати прогрес і більше!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Увійдіть через GitHub або Google у правому верхньому куті",
  SLUG: "Слаг",
  SPACE_COMPLEXITY: "Складність за пам'яттю",
  SUBMIT: "Надіслати",
  SUCCESS: "Успіх",
  SYNCING_WITH_SERVER: "Синхронізація з сервером",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Необов'язковий опис тест-кейса",
  TEST_CASE_NAME_HELPER_TEXT: "Коротка назва тест-кейса",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Можна змінити слаг у URL цього тест-кейса",
  TIMESTAMP: "Мітка часу",
  TIME_COMPLEXITY: "Складність за часом",
  TODAY: "Сьогодні {date:Date|weekday}",
  TOKEN: "Токен",
  TREE_VIEWER: "Перегляд дерева",
  TRY_IT_OUT_NOW: "Спробуйте зараз",
  TYPE: "Тип",
  UPDATE: "Оновити",
  USERNAME: "Ім'я користувача",
  USER_DASHBOARD: "Панель користувача {name:string}",
  USER_SETTINGS: "Налаштування користувача",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Візуалізуйте задачі LeetCode прямо з вашого коду",
  YOUR_CHANGES_WILL_BE_LOST: "Ваші зміни буде втрачено",
  YOUR_LEETCODE_ACCOUNT_NAME: "Ваше ім'я на LeetCode:",
  YOUR_NAME: "Ваше ім'я:",
  YOU_DONT_OWN_THIS_PROJECT: "Ви не власник цього проєкту",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Потрібно увійти, щоб зберігати код",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Спочатку запустіть код",

  HOME_LANDING_TITLE:
    "Ваш код, кадр за кадром. Крок уперед. Крок назад.",
  HOME_LANDING_SUBTITLE:
    "Майданчик у стилі LeetCode, де ваше рішення стає наочною трасою виконання: дерева, графи, сітки, зв'язні структури та вкладені карти. JavaScript і Python у браузері, покрокове відтворення й за бажанням вимірювання часу для JS.",
  HOME_HERO_FAQ_LINK: "Часті запитання",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Крок {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Відтворити",
  HOME_LANDING_PREVIEW_PAUSE: "Пауза",
  HOME_PREVIEW_STEP_BACK: "Крок назад",
  HOME_PREVIEW_STEP_FORWARD: "Крок уперед",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Не вдалося завантажити попередній перегляд на головній.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Неочікувана помилка ініціалізації попереднього перегляду.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "інвертувати бінарне дерево",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "знайти шлях у графі",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "найкоротший шлях у бінарній матриці",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Задача дня",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Питання дня",
  QUESTION_OF_TODAY_LABEL: "Питання дня",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Проєктів не знайдено за запитом «{query:string}»",
  HOME_SECTION_HOW_IT_WORKS: "Як це працює",
  HOME_HOW_STEP_1_TITLE: "Напишіть рішення",
  HOME_HOW_STEP_1_BODY:
    "Використовуйте вбудований редактор із знайомими шаблонами для кожної категорії проєкту.",
  HOME_HOW_STEP_2_TITLE: "Запустіть і запишіть",
  HOME_HOW_STEP_2_BODY:
    "Відстежувані API перетворюють роботу зі структурами на стек кадрів — без заздалегідь підготовленої анімації.",
  HOME_HOW_STEP_3_TITLE: "Перемотуйте часову шкалу",
  HOME_HOW_STEP_3_BODY:
    "Крок уперед і назад, зміна швидкості та перегляд кожної операції в журналі.",
  HOME_SECTION_WHY_DSTUCT: "Можливості",
  HOME_PILLAR_VIS_TITLE: "Бачте алгоритм, а не лише вивід",
  HOME_PILLAR_VIS_BODY:
    "Повторюйте, як змінюються структури даних. Розумійте та дебажте за реальною трасою виконання.",
  HOME_PILLAR_WORKERS_TITLE: "Плавний інтерфейс під час запуску коду",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript у Web Worker; Python через Pyodide в окремому worker — сторінка залишається відзивною.",
  HOME_PILLAR_REPLAY_TITLE: "Відтворення з «подорожжю в часі»",
  HOME_PILLAR_REPLAY_BODY:
    "Відтворення, пауза, крок, повтор і швидкість — зокрема гарячими клавішами.",
  HOME_PILLAR_BENCH_TITLE: "Бенчмарк JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Багато запусків із медіаною, перцентилями та графіком. Режим бенчмарка поки лише для JS.",
  HOME_SECTION_LANGUAGES: "Дві мови, один майданчик",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Виконується локально в worker — без зайвих запитів для візуалізації. Повна підтримка бенчмарка.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "Справжній CPython через Pyodide в браузері — без встановлення. Підвантажується при відкритті Python-рішення; перший візит качає рантайм (далі з кешу). Лише стандартна бібліотека.",
  HOME_SECTION_TRY_DEMOS: "Галерея алгоритмів",
  HOME_TRY_DEMOS_LEAD:
    "Відкрийте підібраний майданчик, щоб побачити дебагер на реальній задачі, або перейдіть до повного оглядача проєктів.",
  HOME_DEMO_TREE: "Бінарне дерево",
  HOME_DEMO_GRAPH: "Шлях у графі",
  HOME_DEMO_GRID: "BFS по сітці",
  HOME_DEMO_TRIE: "Префіксне дерево / map",
  HOME_SECTION_FAQ: "Часті запитання",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Зберігайте прогрес у хмарі",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Увійдіть, щоб синхронізувати проєкти, тести та рішення. Публічні приклади доступні без облікового запису.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Запуски виконуються в браузері; вхід потрібен для збереження та соціальних функцій.",
  HOME_OPEN_PROFILE: "Відкрити профіль",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Не вдалося зібрати посилання на профіль. Відкрийте профіль з меню облікового запису в шапці.",
  HOME_DAILY_QUESTION_ERROR:
    "Не вдалося завантажити задачу дня. Спробуйте пізніше.",
  HOME_DAILY_SECTION_TITLE: "Не знаєте, що розв'язувати?",
  HOME_DAILY_SECTION_LEAD:
    "Ось щоденна задача з LeetCode — відкрийте її на майданчику, коли будете готові.",

  HOME_FAQ_Q_01: "Чому після запуску немає візуалізації?",
  HOME_FAQ_A_01:
    "Наглядове відтворення дають відстежувані API структур даних dStruct. Оберіть відповідну категорію проєкту та обгортки, які очікує майданчик. Звичайні об'єкти без цих API можуть вивести текст, але не дадуть покроковий replay.",
  HOME_FAQ_Q_02: "Які задачі та структури підтримуються?",
  HOME_FAQ_A_02:
    "Дерева, BST, зв'язні списки, графи, сітки й матриці, масиви, купи, стеки, trie, ДП, два вказівники, ковзне вікно, backtracking і більше. Перегляньте майданчик або категорії під час створення проєкту.",
  HOME_FAQ_Q_03: "Чи потрібно встановлювати Python?",
  HOME_FAQ_A_03:
    "Для звичайного використання — ні. JavaScript у Web Worker; Python через Pyodide в браузері. Локальний Python-сервер лише для розробників.",
  HOME_FAQ_Q_04: "Чи виконується код на ваших серверах?",
  HOME_FAQ_A_04:
    "За замовчуванням ні — виконання в браузері. Збереження проєктів, вхід і хмарний огляд використовують бекенд.",
  HOME_FAQ_Q_05: "Чи можна JavaScript і Python?",
  HOME_FAQ_A_05:
    "Так. У проєктах можуть бути окремі рішення на JS і Python. Режим бенчмарка поки лише для JavaScript.",
  HOME_FAQ_Q_06: "Чому в Python смуга завантаження?",
  HOME_FAQ_A_06:
    "Pyodide підвантажується у фоні при відкритті Python-сторінки. Перший візит качає рантайм (~30 МБ, далі кеш); запуск WASM може тривати кілька секунд навіть з кешу.",
  HOME_FAQ_Q_07: "Чи можна NumPy чи пакети з pip?",
  HOME_FAQ_A_07:
    "У стандартному майданчику — ні, лише стандартна бібліотека. Сторонні імпорти не спрацюють.",
  HOME_FAQ_Q_08: "Як довго може тривати запуск?",
  HOME_FAQ_A_08:
    "Python за замовчуванням обривається через 30 с; worker перестворюється. Скасування грубе для дуже важких задач.",
  HOME_FAQ_Q_09: "Як зберегти роботу?",
  HOME_FAQ_A_09:
    "Публічні проєкти й редактор без входу. Щоб зберігати проєкти, тести та іменовані рішення — увійдіть.",
  HOME_FAQ_Q_10: "Чи можна ділитися проєктами чи вчитися в інших?",
  HOME_FAQ_A_10:
    "Так. Зробіть проєкт публічним і використовуйте «Огляд» для прикладів.",
  HOME_FAQ_Q_11: "Навіщо прив'язка LeetCode?",
  HOME_FAQ_A_11:
    "Додаткові функції профілю, вставка URL задачі для метаданих і перехід на LeetCode. Надсилання рішень лишається на LeetCode — dStruct це супутній майданчик.",
  HOME_FAQ_Q_12: "Чи можна виміряти швидкість?",
  HOME_FAQ_A_12:
    "Так, для JavaScript — режим Benchmark. У Python бенчмарка ще немає.",
  HOME_FAQ_Q_13: "Чи працює dStruct на телефоні чи планшеті?",
  HOME_FAQ_A_13:
    "Є мобільний сценарій з keep-alive при перемиканні вкладок. Довгі сесії редагування зручніші на десктопі.",
  HOME_FAQ_Q_14: "Чи dStruct з відкритим кодом?",
  HOME_FAQ_A_14:
    "Так. Див. LICENSE у репозиторії (AGPL-3.0).",
};

export default uk;
