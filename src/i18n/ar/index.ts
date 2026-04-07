import en from "../en";
import type { Translation } from "../i18n-types";

const arOverrides = {
  ACTION: "إجراء",
  ADD_ARGUMENT: "إضافة وسيط",
  ADD_NEW_SOLUTION: "إضافة حل جديد",
  ARGUMENTS: "وسيطات",
  BROWSE: "تصفح",
  BROWSE_PROJECTS: "تصفح المشاريع",
  BACK: "رجوع",
  CALLSTACK: "مكدس الاستدعاءات",
  CANCEL: "إلغاء",
  CODE: "الكود",
  CHOOSE_LOCALE: "اختر اللغة...",
  CODE_COPIED_TO_CLIPBOARD: "تم نسخ الكود إلى الحافظة",
  CODE_RUNNER: "مشغّل الكود",
  CONSOLE_OUTPUT: "مخرجات الطرفية",
  CONTINUE: "متابعة",
  COPY: "نسخ",
  COPY_CODE_TO_CLIPBOARD: "نسخ الكود إلى الحافظة",
  CREATE_NEW_PROJECT: "إنشاء مشروع جديد",
  CURRENT_PROJECT: "المشروع الحالي",
  CURRENT_USER_ACCOUNT: "حساب المستخدم الحالي",
  DARK_MODE: "الوضع الداكن",
  DASHBOARD: "لوحة التحكم",
  DATA_STRUCTURES_SIMPLIFIED: "هياكل بيانات مبسّطة",
  DELETE: "حذف",
  DELETE_THIS_PROJECT: "حذف هذا المشروع",
  DELETE_X_ARGUMENT: "حذف الوسيط {name:string}",
  DAILY_PROBLEM_NAV: "مسألة اليوم",
  DESCRIPTION: "الوصف",
  DSTRUCT_LOGO: "شعار DStruct",
  EDIT_AND_SAVE:
    "حرّر <code>pages/index.tsx</code> واحفظ لإعادة التحميل.",
  EDIT_SELECTED_PROJECT: "تحرير المشروع المحدد",
  EDIT_SOLUTION: "تحرير الحل",
  EDIT_TEST_CASE: "تحرير حالة الاختبار",
  EDIT_TEST_CASE_SUMMARY: "حرّر تفاصيل حالة الاختبار.",
  FEEDBACK: "ملاحظات",
  FORWARD: "للأمام",
  FORMATTING_ICON: "أيقونة التنسيق",
  FORMAT_CODE_WITH: "تنسيق الكود باستخدام",
  HI: "مرحبًا {name:string}!",
  INPUT: "الإدخال",
  LANGUAGE: "اللغة",
  LOGOUT: "تسجيل الخروج",
  MAIN_MENU: "القائمة الرئيسية",
  MS: "مللي ثانية",
  NAME: "الاسم",
  NEW: "جديد",
  NODE: "عقدة",
  NO_DATA: "لا توجد بيانات",
  OPEN_OPTIONS: "فتح الخيارات",
  OUTPUT: "المخرجات",
  PANEL_TABS: "علامات تبويب اللوحة",
  PENDING_CHANGES: "تغييرات معلّقة",
  PLAYBACK_INTERVAL: "فترة التشغيل",
  PLAYGROUND: "ساحة التجربة",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "يرجى إدخال اسم حساب LeetCode:",
  PROFILE: "الملف الشخصي",
  PROJECT: "مشروع",
  PROJECT_BROWSER: "متصفح المشاريع",
  SEARCH_PROJECTS: "البحث في المشاريع حسب العنوان...",
  NO_PROJECTS_FOUND: "لم يُعثر على مشاريع",
  NO_PROJECTS_MATCH_FILTERS: "لا مشاريع تطابق المرشحات",
  FILTERS: "المرشحات",
  FILTER_BY_DIFFICULTY: "الصعوبة",
  SHOW_ONLY_NEW: "عرض المشاريع الجديدة فقط",
  SHOW_ONLY_MINE: "عرض مشاريعي فقط",
  CLEAR_ALL_FILTERS: "مسح كل المرشحات",
  SORT_BY: "ترتيب حسب",
  SORT_TITLE: "العنوان",
  SORT_TITLE_ASC: "العنوان (أ-ي)",
  SORT_TITLE_DESC: "العنوان (ي-أ)",
  SORT_DIFFICULTY: "الصعوبة",
  SORT_DIFFICULTY_ASC: "الصعوبة (سهل → صعب)",
  SORT_DIFFICULTY_DESC: "الصعوبة (صعب → سهل)",
  SORT_DATE: "التاريخ",
  SORT_DATE_ASC: "التاريخ (الأحدث أولاً)",
  SORT_DATE_DESC: "التاريخ (الأقدم أولاً)",
  SORT_CATEGORY: "الفئة",
  SORT_CATEGORY_ASC: "الفئة (أ-ي)",
  SORT_CATEGORY_DESC: "الفئة (ي-أ)",
  REPLAY: "إعادة تشغيل",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "إعادة تشغيل تصوير نتيجة الكود السابقة",
  RESET: "إعادة ضبط",
  RESULTS: "النتائج",
  RESET_DATA_STRUCTURES:
    "إعادة هياكل البيانات إلى الحالة الأولية",
  RETRY: "إعادة المحاولة",
  RETURNED: "عُيد",
  RUN: "تشغيل",
  RUNTIME: "زمن التشغيل",
  RUN_CODE: "تشغيل الكود",
  SAVED_IN_THE_CLOUD: "حُفظ في السحابة",
  SELECTED_LOCALE: "اللغة المحددة:",
  SETTINGS: "الإعدادات",
  SIGN_IN: "تسجيل الدخول",
  SIGN_IN_FAILED: "فشل تسجيل الدخول",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "سجّل الدخول لتتبع تقدمك والمزيد!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "سجّل الدخول باستخدام GitHub أو Google أعلى اليمين",
  SLUG: "المعرّف المختصر",
  SPACE_COMPLEXITY: "تعقيد المساحة",
  SUBMIT: "إرسال",
  SUCCESS: "نجاح",
  SYNCING_WITH_SERVER: "المزامنة مع الخادم",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "وصف اختياري لحالة الاختبار",
  TEST_CASE_NAME_HELPER_TEXT: "اسم قصير لحالة الاختبار",
  TEST_CASE_SLUG_HELPER_TEXT:
    "يمكنك تعديل المعرّف المستخدم في رابط حالة الاختبار",
  TIMESTAMP: "الطابع الزمني",
  TIME_COMPLEXITY: "تعقيد الزمن",
  TODAY: "اليوم {date:Date|weekday}",
  TOKEN: "رمز",
  TREE_VIEWER: "عارض الشجرة",
  TRY_IT_OUT_NOW: "جرّب الآن",
  TYPE: "النوع",
  UPDATE: "تحديث",
  USERNAME: "اسم المستخدم",
  USER_DASHBOARD: "لوحة {name:string}",
  USER_SETTINGS: "إعدادات المستخدم",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "صوّر مسائل LeetCode مباشرة من كودك",
  YOUR_CHANGES_WILL_BE_LOST: "ستفقد تغييراتك",
  YOUR_LEETCODE_ACCOUNT_NAME: "اسم حساب LeetCode:",
  YOUR_NAME: "اسمك:",
  YOU_DONT_OWN_THIS_PROJECT: "أنت لست مالك هذا المشروع",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "يجب تسجيل الدخول لحفظ الكود",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "شغّل الكود أولاً",

  HOME_LANDING_TITLE:
    "كودك، إطارًا إطارًا. خطوة للأمام. خطوة للخلف.",
  HOME_LANDING_SUBTITLE:
    "ساحة تجربة على نمط LeetCode حيث يصبح حلّك مسار تنفيذًا مرئيًا للأشجار والرسوم البيانية والشبكات والهياكل المرتبطة والخرائط المتداخلة. JavaScript وPython في المتصفح، إعادة تشغيل خطوة بخطوة، وإحصاءات زمنية اختيارية لـ JS.",
  HOME_HERO_FAQ_LINK: "الأسئلة الشائعة",
  HOME_HERO_FAQ_LINK_SUFFIX: " ←",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "الخطوة {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "تشغيل",
  HOME_LANDING_PREVIEW_PAUSE: "إيقاف مؤقت",
  HOME_PREVIEW_STEP_BACK: "خطوة للخلف",
  HOME_PREVIEW_STEP_FORWARD: "خطوة للأمام",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "تعذّر تحميل معاينة الصفحة الرئيسية.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "خطأ غير متوقع عند تهيئة المعاينة.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "عكس الشجرة الثنائية",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "مسار في الرسم البياني",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "أقصر مسار في مصفوفة ثنائية",
  HOME_DEMO_SLUG_TRIE_NAME: "شجرة المفاتيح",
  DAILY_PROBLEM_FALLBACK_TITLE: "مسألة اليوم",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 سؤال اليوم",
  QUESTION_OF_TODAY_LABEL: "سؤال اليوم",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "لم يُعثر على مشاريع لـ \"{query:string}\"",
  HOME_SECTION_HOW_IT_WORKS: "كيف يعمل",
  HOME_HOW_STEP_1_TITLE: "اكتب حلّك",
  HOME_HOW_STEP_1_BODY:
    "استخدم المحرّر المدمج مع أنماط مألوفة لكل فئة مشروع.",
  HOME_HOW_STEP_2_TITLE: "شغّل وسجّل",
  HOME_HOW_STEP_2_BODY:
    "تُحوّل واجهات التتبع العمل الهيكلي إلى مكدس إطارات—دون رسوم متحركة جاهزة.",
  HOME_HOW_STEP_3_TITLE: "تصفّح الخط الزمني",
  HOME_HOW_STEP_3_BODY:
    "تقدّم وتراجع، غيّر السرعة، وافحص كل عملية في السجل.",
  HOME_SECTION_WHY_DSTUCT: "القدرات",
  HOME_PILLAR_VIS_TITLE: "انظر الخوارزمية لا المخرجات فقط",
  HOME_PILLAR_VIS_BODY:
    "أعد تشغيل تغيّر هياكل بياناتك. افهم وصحّح بمسار تنفيذ حقيقي.",
  HOME_PILLAR_WORKERS_TITLE: "واجهة سلسة أثناء تشغيل الكود",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript في Web Worker؛ Python عبر Pyodide في عامل منفصل—تبقى الصفحة مستجيبة.",
  HOME_PILLAR_REPLAY_TITLE: "تشغيل بأسلوب السفر عبر الزمن",
  HOME_PILLAR_REPLAY_BODY:
    "تشغيل، إيقاف مؤقت، خطوة، إعادة، وضبط السرعة—مع اختصارات لوحة المفاتيح.",
  HOME_PILLAR_BENCH_TITLE: "قياس أداء JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "تشغيلات عديدة مع الوسيط والمئينيات والرسم. وضع القياس لـ JS فقط حاليًا.",
  HOME_SECTION_LANGUAGES: "لغتان، ساحة واحدة",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "يعمل محليًا في عامل—دون ذهاب وإياب للتصوير. دعم قياس كامل.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "CPython حقيقي عبر Pyodide في المتصفح—دون تثبيت. يُحمّل مسبقًا عند فتح حل Python؛ الزيارة الأولى تنزّل وقت التشغيل (~30 ميجابايت، ثم ذاكرة تخزين مؤقتة). المكتبة القياسية فقط.",
  HOME_SECTION_TRY_DEMOS: "معرض الخوارزميات",
  HOME_TRY_DEMOS_LEAD:
    "افتح ساحة مختارة لرؤية المصحّح على مسألة حقيقية، أو انتقل إلى المتصفح الكامل.",
  HOME_DEMO_TREE: "شجرة ثنائية",
  HOME_DEMO_GRAPH: "مسار في الرسم",
  HOME_DEMO_GRID: "BFS على شبكة",
  HOME_DEMO_TRIE: "Trie / خريطة",
  HOME_SECTION_FAQ: "أسئلة شائعة",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "احفظ التقدم في السحابة",
  HOME_AUTH_BODY_SIGNED_OUT:
    "سجّل الدخول لمزامنة المشاريع وحالات الاختبار والحلول. استكشف أمثلة عامة دون حساب.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "التشغيل في المتصفح؛ تسجيل الدخول للحفظ والميزات الاجتماعية.",
  HOME_OPEN_PROFILE: "فتح الملف الشخصي",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "تعذّر إنشاء رابط الملف الشخصي. افتحه من قائمة الحساب في الرأس.",
  HOME_DAILY_QUESTION_ERROR:
    "تعذّر تحميل مسألة اليوم. حاول لاحقًا.",
  HOME_DAILY_SECTION_TITLE: "لست متأكدًا ماذا تحل؟",
  HOME_DAILY_SECTION_LEAD:
    "إليك مسألة يومية من LeetCode—افتحها في الساحة عند الجاهزية.",

  HOME_FAQ_Q_01: "لماذا لا يوجد تصوير بعد التشغيل؟",
  HOME_FAQ_A_01:
    "التشغيل المرئي يأتي من واجهات تتبع هياكل البيانات في dStruct. اختر الفئة والغلافات التي تتوقعها الساحة. كائنات بسيطة بدون تلك الواجهات قد تطبع مخرجات دون إعادة خطوة بخطوة.",
  HOME_FAQ_Q_02: "ما المسائل والهياكل المدعومة؟",
  HOME_FAQ_A_02:
    "أشجار، BST، قوائم مرتبطة، رسوم بيانية، شبكات ومصفوفات، مصفوفات، أكوام، مكدسات، trie، DP، مؤشران، نافذة منزلقة، تتبع عكسي، وأكثر. تصفّح الساحة أو الفئات عند إنشاء مشروع.",
  HOME_FAQ_Q_03: "هل أحتاج تثبيت Python؟",
  HOME_FAQ_A_03:
    "لا للاستخدام العادي. JS في Web Worker؛ Python مع Pyodide. خادم Python محلي اختياري للمطورين.",
  HOME_FAQ_Q_04: "هل يعمل كودي على خوادمكم؟",
  HOME_FAQ_A_04:
    "افتراضيًا لا—التنفيذ في المتصفح. الحفظ والسحابة تستخدم الخادم كأي تطبيق ويب.",
  HOME_FAQ_Q_05: "هل يمكن استخدام JavaScript وPython؟",
  HOME_FAQ_A_05:
    "نعم. يمكن تخزين حلول JS وPython منفصلة. وضع القياس لـ JavaScript فقط حاليًا.",
  HOME_FAQ_Q_06: "لماذا يظهر شريط تحميل لـ Python؟",
  HOME_FAQ_A_06:
    "يُحمّل Pyodide في الخلفية عند فتح صفحة Python. الزيارة الأولى تنزّل وقت التشغيل (~30 ميجابايت)؛ بدء WASM قد يستغرق ثوانٍ حتى من الذاكرة المؤقتة.",
  HOME_FAQ_Q_07: "هل يمكن NumPy أو pip؟",
  HOME_FAQ_A_07:
    "لا في الساحة الافتراضية—المكتبة القياسية فقط. استيرادات الطرف الثالث تفشل.",
  HOME_FAQ_Q_08: "كم يمكن أن يستمر التشغيل؟",
  HOME_FAQ_A_08:
    "Python ينتهي افتراضيًا بعد 30 ثانية؛ يُعاد إنشاء العامل. الإلغاء خشن للأعمال الثقيلة جدًا.",
  HOME_FAQ_Q_09: "كيف أحفظ عملي؟",
  HOME_FAQ_A_09:
    "مشاريع عامة ومحرّر دون تسجيل. للاستمرارية سجّل الدخول.",
  HOME_FAQ_Q_10: "هل يمكن مشاركة المشاريع؟",
  HOME_FAQ_A_10:
    "نعم. اجعل المشروع عامًا واستخدم التصفح للأمثلة.",
  HOME_FAQ_Q_11: "ما فائدة ربط حساب LeetCode؟",
  HOME_FAQ_A_11:
    "ميزات ملف اختيارية، لصق رابط المسألة للبيانات الوصفية، اختصارات. الإرسال يبقى على LeetCode—dStruct ساحة مرافقة.",
  HOME_FAQ_Q_12: "هل يمكن قياس سرعة الحل؟",
  HOME_FAQ_A_12:
    "نعم لـ JavaScript—وضع القياس. Python ليس بعد.",
  HOME_FAQ_Q_13: "هل يعمل على الهاتف أو الجهاز اللوحي؟",
  HOME_FAQ_A_13:
    "تدفق مناسب للجوال مع إبقاء الاتصال عند تبديل التبويب. الجلسات الطويلة أسهل على سطح المكتب.",
  HOME_FAQ_Q_14: "هل dStruct مفتوح المصدر؟",
  HOME_FAQ_A_14:
    "نعم. راجع ملف LICENSE في المستودع (AGPL-3.0).",
} satisfies Partial<Record<keyof Translation, string>>;

const ar = { ...en, ...arOverrides } as Translation;
export default ar;
