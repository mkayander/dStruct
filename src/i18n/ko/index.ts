import type { Translation } from "../i18n-types";

const ko: Record<keyof Translation, string> = {
  ACTION: "동작",
  ADD_ARGUMENT: "인수 추가",
  ADD_NEW_SOLUTION: "새 풀이 추가",
  ARGUMENTS: "인수",
  BROWSE: "둘러보기",
  BROWSE_PROJECTS: "프로젝트 둘러보기",
  BACK: "뒤로",
  CALLSTACK: "호출 스택",
  CANCEL: "취소",
  CODE: "코드",
  CHOOSE_LOCALE: "언어 선택...",
  CODE_COPIED_TO_CLIPBOARD: "코드가 클립보드에 복사됨",
  CODE_RUNNER: "코드 실행기",
  CONSOLE_OUTPUT: "콘솔 출력",
  CONTINUE: "계속",
  COPY: "복사",
  COPY_CODE_TO_CLIPBOARD: "코드를 클립보드에 복사",
  CREATE_NEW_PROJECT: "새 프로젝트 만들기",
  CURRENT_PROJECT: "현재 프로젝트",
  CURRENT_USER_ACCOUNT: "현재 사용자 계정",
  DARK_MODE: "다크 모드",
  DASHBOARD: "대시보드",
  DATA_STRUCTURES_SIMPLIFIED: "단순화된 자료 구조",
  DELETE: "삭제",
  DELETE_THIS_PROJECT: "이 프로젝트 삭제",
  DELETE_X_ARGUMENT: "{name:string} 인수 삭제",
  DAILY_PROBLEM_NAV: "오늘의 문제",
  DESCRIPTION: "설명",
  DSTRUCT_LOGO: "DStruct 로고",
  EDIT_AND_SAVE:
    "<code>pages/index.tsx</code>를 편집하고 저장하여 새로고침하세요.",
  EDIT_SELECTED_PROJECT: "선택한 프로젝트 편집",
  EDIT_SOLUTION: "풀이 편집",
  EDIT_TEST_CASE: "테스트 케이스 편집",
  EDIT_TEST_CASE_SUMMARY: "테스트 케이스 세부 정보를 편집합니다.",
  FEEDBACK: "피드백",
  FORWARD: "앞으로",
  FORMATTING_ICON: "서식 아이콘",
  FORMAT_CODE_WITH: "다음으로 코드 서식 지정",
  FORMAT_CODE_WITH_BLACK: "Format code with Black (Pyodide)",
  HI: "안녕하세요, {name:string}!",
  INPUT: "입력",
  LANGUAGE: "언어",
  LOGOUT: "로그아웃",
  MAIN_MENU: "메인 메뉴",
  MS: "ms",
  NAME: "이름",
  NEW: "새로 만들기",
  NODE: "노드",
  NO_DATA: "데이터 없음",
  OPEN_OPTIONS: "옵션 열기",
  OUTPUT: "출력",
  PANEL_TABS: "패널 탭",
  PENDING_CHANGES: "보류 중인 변경",
  PLAYBACK_INTERVAL: "재생 간격",
  PLAYGROUND: "플레이그라운드",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "LeetCode 계정 이름을 입력하세요:",
  PROFILE: "프로필",
  PROJECT: "프로젝트",
  PROJECT_BROWSER: "프로젝트 브라우저",
  SEARCH_PROJECTS: "제목으로 프로젝트 검색...",
  NO_PROJECTS_FOUND: "프로젝트를 찾을 수 없음",
  NO_PROJECTS_MATCH_FILTERS: "필터와 일치하는 프로젝트가 없습니다",
  FILTERS: "필터",
  FILTER_BY_DIFFICULTY: "난이도",
  SHOW_ONLY_NEW: "새 프로젝트만 표시",
  SHOW_ONLY_MINE: "내 프로젝트만 표시",
  CLEAR_ALL_FILTERS: "모든 필터 지우기",
  SORT_BY: "정렬 기준",
  SORT_TITLE: "제목",
  SORT_TITLE_ASC: "제목 (A-Z)",
  SORT_TITLE_DESC: "제목 (Z-A)",
  SORT_DIFFICULTY: "난이도",
  SORT_DIFFICULTY_ASC: "난이도 (쉬움 → 어려움)",
  SORT_DIFFICULTY_DESC: "난이도 (어려움 → 쉬움)",
  SORT_DATE: "날짜",
  SORT_DATE_ASC: "날짜 (최신순)",
  SORT_DATE_DESC: "날짜 (오래된순)",
  SORT_CATEGORY: "카테고리",
  SORT_CATEGORY_ASC: "카테고리 (A-Z)",
  SORT_CATEGORY_DESC: "카테고리 (Z-A)",
  REPLAY: "다시 재생",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "이전 코드 결과 시각화 다시 재생",
  RESET: "초기화",
  RESULTS: "결과",
  RESET_DATA_STRUCTURES:
    "자료 구조를 초기 상태로 초기화",
  RETRY: "다시 시도",
  RETURNED: "반환됨",
  RUN: "실행",
  RUNTIME: "실행 시간",
  RUN_CODE: "코드 실행",
  SAVED_IN_THE_CLOUD: "클라우드에 저장됨",
  SELECTED_LOCALE: "선택한 언어:",
  SETTINGS: "설정",
  SIGN_IN: "로그인",
  SIGN_IN_FAILED: "로그인 실패",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "로그인하여 진행 상황 등을 추적하세요!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "오른쪽 위에서 GitHub 또는 Google로 로그인",
  SLUG: "슬러그",
  SPACE_COMPLEXITY: "공간 복잡도",
  SUBMIT: "제출",
  SUCCESS: "성공",
  SYNCING_WITH_SERVER: "서버와 동기화 중",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "선택적 테스트 케이스 설명",
  TEST_CASE_NAME_HELPER_TEXT: "테스트 케이스 짧은 이름",
  TEST_CASE_SLUG_HELPER_TEXT:
    "이 테스트 케이스 URL에 사용되는 슬러그를 편집할 수 있습니다",
  TIMESTAMP: "타임스탬프",
  TIME_COMPLEXITY: "시간 복잡도",
  TODAY: "오늘은 {date:Date|weekday}입니다",
  TOKEN: "토큰",
  TREE_VIEWER: "트리 뷰어",
  TRY_IT_OUT_NOW: "지금 사용해 보기",
  TYPE: "유형",
  UPDATE: "업데이트",
  USERNAME: "사용자 이름",
  USER_DASHBOARD: "{name:string}의 대시보드",
  USER_SETTINGS: "사용자 설정",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "코드에서 바로 LeetCode 문제 시각화",
  YOUR_CHANGES_WILL_BE_LOST: "변경 사항이 사라집니다",
  YOUR_LEETCODE_ACCOUNT_NAME: "LeetCode 계정 이름:",
  YOUR_NAME: "이름:",
  YOU_DONT_OWN_THIS_PROJECT: "이 프로젝트의 소유자가 아닙니다",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "코드를 저장하려면 로그인해야 합니다",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "먼저 코드를 실행하세요",

  HOME_LANDING_TITLE:
    "코드를 한 프레임씩. 앞으로 한 걸음. 뒤로 한 걸음.",
  HOME_LANDING_SUBTITLE:
    "풀이가 트리, 그래프, 그리드, 연결 구조, 중첩 맵의 시각적 실행 추적이 되는 LeetCode 스타일 플레이그라운드. 브라우저의 JavaScript와 Python, 단계별 재생, JS용 선택적 타이밍 통계.",
  HOME_HERO_FAQ_LINK: "자주 묻는 질문",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "단계 {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "재생",
  HOME_LANDING_PREVIEW_PAUSE: "일시 정지",
  HOME_PREVIEW_STEP_BACK: "이전 단계",
  HOME_PREVIEW_STEP_FORWARD: "다음 단계",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "랜딩 미리보기를 불러오지 못했습니다.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "미리보기 초기화 중 예기치 않은 오류가 발생했습니다.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "이진 트리 뒤집기",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "그래프에서 경로 찾기",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "이진 행렬에서 최단 경로",
  HOME_DEMO_SLUG_TRIE_NAME: "트라이",
  DAILY_PROBLEM_FALLBACK_TITLE: "오늘의 문제",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 오늘의 질문",
  QUESTION_OF_TODAY_LABEL: "오늘의 질문",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "\"{query:string}\"에 대한 프로젝트를 찾을 수 없음",
  HOME_SECTION_HOW_IT_WORKS: "작동 방식",
  HOME_HOW_STEP_1_TITLE: "풀이 작성",
  HOME_HOW_STEP_1_BODY:
    "프로젝트 범주별 익숙한 패턴으로 내장 편집기를 사용하세요.",
  HOME_HOW_STEP_2_TITLE: "실행 및 기록",
  HOME_HOW_STEP_2_BODY:
    "추적 API가 구조 작업을 프레임 호출 스택으로 바꿉니다—미리 만든 애니메이션 없음.",
  HOME_HOW_STEP_3_TITLE: "타임라인 탐색",
  HOME_HOW_STEP_3_BODY:
    "앞뒤로 이동하고 속도를 바꾸며 로그의 각 작업을 확인하세요.",
  HOME_SECTION_WHY_DSTUCT: "기능",
  HOME_PILLAR_VIS_TITLE: "출력뿐 아니라 알고리즘 보기",
  HOME_PILLAR_VIS_BODY:
    "자료 구조가 어떻게 바뀌는지 다시 재생하세요. 실제 실행 추적으로 이해하고 디버그.",
  HOME_PILLAR_WORKERS_TITLE: "코드 실행 중에도 부드러운 UI",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript는 Web Worker에서, Python은 전용 Worker의 Pyodide에서—페이지는 반응성을 유지합니다.",
  HOME_PILLAR_REPLAY_TITLE: "타임 트래블 재생",
  HOME_PILLAR_REPLAY_BODY:
    "재생, 일시 정지, 단계, 다시 재생, 속도 조절—키보드 단축키 포함.",
  HOME_PILLAR_BENCH_TITLE: "JavaScript 벤치마크",
  HOME_PILLAR_BENCH_BODY:
    "중앙값, 백분위수, 차트로 여러 실행. 벤치마크 모드는 현재 JS만.",
  HOME_SECTION_LANGUAGES: "두 언어, 하나의 플레이그라운드",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "워커에서 로컬 실행—시각화를 위한 왕복 없음. 전체 벤치마크 지원.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "브라우저의 Pyodide로 실제 CPython—설치 불필요. Python 풀이를 열면 프리로드; 첫 방문 시 런타임 다운로드(~30MB, 이후 캐시). 표준 라이브러리만.",
  HOME_SECTION_TRY_DEMOS: "알고리즘 갤러리",
  HOME_TRY_DEMOS_LEAD:
    "선별된 플레이그라운드에서 실제 문제의 디버거를 보거나 전체 브라우저로 이동.",
  HOME_DEMO_TREE: "이진 트리",
  HOME_DEMO_GRAPH: "그래프 경로",
  HOME_DEMO_GRID: "그리드 BFS",
  HOME_DEMO_TRIE: "Trie / 맵",
  HOME_SECTION_FAQ: "일반 질문",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "클라우드에 진행 상황 저장",
  HOME_AUTH_BODY_SIGNED_OUT:
    "로그인하여 프로젝트, 테스트, 풀이를 동기화하세요. 계정 없이 공개 예제 탐색.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "실행은 브라우저에서; 로그인은 저장 및 소셜 기능용.",
  HOME_OPEN_PROFILE: "프로필 열기",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "프로필 링크를 만들 수 없습니다. 헤더의 계정 메뉴에서 여세요.",
  HOME_DAILY_QUESTION_ERROR:
    "오늘의 문제를 불러오지 못했습니다. 나중에 다시 시도하세요.",
  HOME_DAILY_SECTION_TITLE: "무엇을 풀지 모르겠나요?",
  HOME_DAILY_SECTION_LEAD:
    "LeetCode의 오늘의 문제입니다—준비되면 플레이그라운드에서 여세요.",

  HOME_FAQ_Q_01: "실행 후 시각화가 없는 이유는?",
  HOME_FAQ_A_01:
    "시각 재생은 dStruct의 추적 자료 구조 API에서 옵니다. 맞는 범주와 플레이그라운드가 기대하는 래퍼를 쓰세요. 해당 API 없는 일반 객체는 출력은 나올 수 있으나 단계별 리플레이는 없습니다.",
  HOME_FAQ_Q_02: "어떤 문제와 구조가 지원되나요?",
  HOME_FAQ_A_02:
    "트리, BST, 연결 리스트, 그래프, 그리드와 행렬, 배열, 힙, 스택, trie, DP, 두 포인터, 슬라이딩 윈도우, 백트래킹 등. 플레이그라운드를 보거나 프로젝트 생성 시 범주를 확인하세요.",
  HOME_FAQ_Q_03: "Python을 설치해야 하나요?",
  HOME_FAQ_A_03:
    "일반 사용에는 아니요. JS는 Web Worker, Python은 Pyodide. 로컬 Python 서버는 개발자용 선택 사항.",
  HOME_FAQ_Q_04: "코드가 귀하 서버에서 실행되나요?",
  HOME_FAQ_A_04:
    "기본적으로 아니요—실행은 브라우저. 저장과 클라우드는 백엔드를 사용.",
  HOME_FAQ_Q_05: "JavaScript와 Python을 함께 쓸 수 있나요?",
  HOME_FAQ_A_05:
    "예. 별도의 JS와 Python 풀이 가능. 벤치마크는 현재 JavaScript만.",
  HOME_FAQ_Q_06: "Python에 로딩 바가 보이는 이유는?",
  HOME_FAQ_A_06:
    "Python 페이지를 열면 Pyodide가 백그라운드에서 프리로드. 첫 방문 시 런타임(~30MB) 다운로드; 캐시에서도 WASM 시작에 몇 초 걸릴 수 있음.",
  HOME_FAQ_Q_07: "NumPy나 pip 패키지는?",
  HOME_FAQ_A_07:
    "기본 플레이그라운드에서는 불가—표준 라이브러리만. 서드파티 import 실패.",
  HOME_FAQ_Q_08: "실행은 얼마나 길 수 있나요?",
  HOME_FAQ_A_08:
    "Python은 기본 30초 타임아웃; 워커 재생성. 매우 무거운 작업에서는 취소가 거칠 수 있음.",
  HOME_FAQ_Q_09: "작업을 어떻게 저장하나요?",
  HOME_FAQ_A_09:
    "로그인 없이 공개 프로젝트와 편집기 사용. 영구 저장은 로그인.",
  HOME_FAQ_Q_10: "프로젝트를 공유하거나 배울 수 있나요?",
  HOME_FAQ_A_10:
    "예. 프로젝트를 공개하고 둘러보기로 예제를 찾으세요.",
  HOME_FAQ_Q_11: "LeetCode 계정 연결은 무엇에 쓰이나요?",
  HOME_FAQ_A_11:
    "선택 프로필 기능, 문제 URL 메타데이터, LeetCode 바로가기. 제출은 여전히 LeetCode에서—dStruct는 보조 플레이그라운드.",
  HOME_FAQ_Q_12: "풀이 속도를 측정할 수 있나요?",
  HOME_FAQ_A_12:
    "예, JavaScript는 벤치마크 모드. Python은 아직 없음.",
  HOME_FAQ_Q_13: "휴대폰이나 태블릿에서 되나요?",
  HOME_FAQ_A_13:
    "탭 전환 시 keep-alive가 있는 모바일 친화 흐름. 긴 편집은 데스크톱이 편함.",
  HOME_FAQ_Q_14: "dStruct는 오픈 소스인가요?",
  HOME_FAQ_A_14:
    "예. 저장소의 LICENSE 참조 (AGPL-3.0).",
};

export default ko;
