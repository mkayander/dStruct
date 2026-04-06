import type { Translation } from "../i18n-types";

const vi: Record<keyof Translation, string> = {
  ACTION: "Hành động",
  ADD_ARGUMENT: "Thêm tham số",
  ADD_NEW_SOLUTION: "Thêm lời giải mới",
  ARGUMENTS: "Tham số",
  BROWSE: "Duyệt",
  BROWSE_PROJECTS: "Duyệt dự án",
  BACK: "Quay lại",
  CALLSTACK: "Ngăn xếp gọi",
  CANCEL: "Hủy",
  CODE: "Mã",
  CHOOSE_LOCALE: "Chọn ngôn ngữ...",
  CODE_COPIED_TO_CLIPBOARD: "Đã sao chép mã vào clipboard",
  CODE_RUNNER: "Trình chạy mã",
  CONSOLE_OUTPUT: "Đầu ra console",
  CONTINUE: "Tiếp tục",
  COPY: "Sao chép",
  COPY_CODE_TO_CLIPBOARD: "Sao chép mã vào clipboard",
  CREATE_NEW_PROJECT: "Tạo dự án mới",
  CURRENT_PROJECT: "Dự án hiện tại",
  CURRENT_USER_ACCOUNT: "Tài khoản hiện tại",
  DARK_MODE: "Chế độ tối",
  DASHBOARD: "Bảng điều khiển",
  DATA_STRUCTURES_SIMPLIFIED: "Cấu trúc dữ liệu đơn giản hóa",
  DELETE: "Xóa",
  DELETE_THIS_PROJECT: "Xóa dự án này",
  DELETE_X_ARGUMENT: "Xóa tham số {name:string}",
  DAILY_PROBLEM_NAV: "Bài hằng ngày",
  DESCRIPTION: "Mô tả",
  DSTRUCT_LOGO: "Logo DStruct",
  EDIT_AND_SAVE:
    "Sửa <code>pages/index.tsx</code> và lưu để tải lại.",
  EDIT_SELECTED_PROJECT: "Sửa dự án đã chọn",
  EDIT_SOLUTION: "Sửa lời giải",
  EDIT_TEST_CASE: "Sửa test case",
  EDIT_TEST_CASE_SUMMARY: "Sửa chi tiết test case của bạn.",
  FEEDBACK: "Phản hồi",
  FORWARD: "Tiến",
  FORMATTING_ICON: "Biểu tượng định dạng",
  FORMAT_CODE_WITH: "Định dạng mã bằng",
  HI: "Xin chào {name:string}!",
  INPUT: "Đầu vào",
  LANGUAGE: "Ngôn ngữ",
  LOGOUT: "Đăng xuất",
  MAIN_MENU: "Menu chính",
  MS: "ms",
  NAME: "Tên",
  NEW: "Mới",
  NODE: "Nút",
  NO_DATA: "Không có dữ liệu",
  OPEN_OPTIONS: "Mở tùy chọn",
  OUTPUT: "Đầu ra",
  PANEL_TABS: "Tab bảng",
  PENDING_CHANGES: "Thay đổi chưa lưu",
  PLAYBACK_INTERVAL: "Khoảng phát lại",
  PLAYGROUND: "Sân chơi",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "Nhập tên tài khoản LeetCode của bạn:",
  PROFILE: "Hồ sơ",
  PROJECT: "Dự án",
  PROJECT_BROWSER: "Trình duyệt dự án",
  SEARCH_PROJECTS: "Tìm dự án theo tiêu đề...",
  NO_PROJECTS_FOUND: "Không tìm thấy dự án",
  NO_PROJECTS_MATCH_FILTERS: "Không dự án nào khớp bộ lọc",
  FILTERS: "Bộ lọc",
  FILTER_BY_DIFFICULTY: "Độ khó",
  SHOW_ONLY_NEW: "Chỉ dự án mới",
  SHOW_ONLY_MINE: "Chỉ dự án của tôi",
  CLEAR_ALL_FILTERS: "Xóa tất cả bộ lọc",
  SORT_BY: "Sắp xếp theo",
  SORT_TITLE: "Tiêu đề",
  SORT_TITLE_ASC: "Tiêu đề (A-Z)",
  SORT_TITLE_DESC: "Tiêu đề (Z-A)",
  SORT_DIFFICULTY: "Độ khó",
  SORT_DIFFICULTY_ASC: "Độ khó (Dễ → Khó)",
  SORT_DIFFICULTY_DESC: "Độ khó (Khó → Dễ)",
  SORT_DATE: "Ngày",
  SORT_DATE_ASC: "Ngày (mới nhất trước)",
  SORT_DATE_DESC: "Ngày (cũ nhất trước)",
  SORT_CATEGORY: "Danh mục",
  SORT_CATEGORY_ASC: "Danh mục (A-Z)",
  SORT_CATEGORY_DESC: "Danh mục (Z-A)",
  REPLAY: "Phát lại",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "Phát lại hình ảnh hóa kết quả mã trước",
  RESET: "Đặt lại",
  RESULTS: "Kết quả",
  RESET_DATA_STRUCTURES:
    "Đặt lại cấu trúc dữ liệu về trạng thái ban đầu",
  RETRY: "Thử lại",
  RETURNED: "Trả về",
  RUN: "Chạy",
  RUNTIME: "Thời gian chạy",
  RUN_CODE: "Chạy mã",
  SAVED_IN_THE_CLOUD: "Đã lưu trên cloud",
  SELECTED_LOCALE: "Ngôn ngữ đã chọn:",
  SETTINGS: "Cài đặt",
  SIGN_IN: "Đăng nhập",
  SIGN_IN_FAILED: "Đăng nhập thất bại",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "Đăng nhập để theo dõi tiến độ và hơn nữa!",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "Đăng nhập bằng GitHub hoặc Google góc trên bên phải",
  SLUG: "Slug",
  SPACE_COMPLEXITY: "Độ phức tạp không gian",
  SUBMIT: "Gửi",
  SUCCESS: "Thành công",
  SYNCING_WITH_SERVER: "Đang đồng bộ với máy chủ",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "Mô tả test case (tuỳ chọn)",
  TEST_CASE_NAME_HELPER_TEXT: "Tên ngắn cho test case",
  TEST_CASE_SLUG_HELPER_TEXT:
    "Bạn có thể sửa slug trong URL của test case này",
  TIMESTAMP: "Dấu thời gian",
  TIME_COMPLEXITY: "Độ phức tạp thời gian",
  TODAY: "Hôm nay là {date:Date|weekday}",
  TOKEN: "Token",
  TREE_VIEWER: "Xem cây",
  TRY_IT_OUT_NOW: "Thử ngay",
  TYPE: "Kiểu",
  UPDATE: "Cập nhật",
  USERNAME: "Tên người dùng",
  USER_DASHBOARD: "Bảng điều khiển của {name:string}",
  USER_SETTINGS: "Cài đặt người dùng",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "Hình ảnh hóa bài LeetCode trực tiếp từ mã của bạn",
  YOUR_CHANGES_WILL_BE_LOST: "Thay đổi của bạn sẽ mất",
  YOUR_LEETCODE_ACCOUNT_NAME: "Tên tài khoản LeetCode:",
  YOUR_NAME: "Tên bạn:",
  YOU_DONT_OWN_THIS_PROJECT: "Bạn không sở hữu dự án này",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "Bạn cần đăng nhập để lưu mã",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "Hãy chạy mã trước",

  HOME_LANDING_TITLE:
    "Mã của bạn, từng khung hình. Bước tới. Bước lui.",
  HOME_LANDING_SUBTITLE:
    "Sân chơi kiểu LeetCode nơi lời giải trở thành dấu vết thực thi trực quan: cây, đồ thị, lưới, cấu trúc liên kết và map lồng nhau. JavaScript và Python trên trình duyệt, phát lại từng bước và thống kê thời gian tuỳ chọn cho JS.",
  HOME_HERO_FAQ_LINK: "Câu hỏi thường gặp",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "Bước {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "Phát",
  HOME_LANDING_PREVIEW_PAUSE: "Tạm dừng",
  HOME_PREVIEW_STEP_BACK: "Bước lùi",
  HOME_PREVIEW_STEP_FORWARD: "Bước tới",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "Không tải được xem trước trang chủ.",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "Lỗi không mong đợi khi khởi tạo xem trước.",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "đảo cây nhị phân",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "đường đi trong đồ thị",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "đường đi ngắn nhất trong ma trận nhị phân",
  HOME_DEMO_SLUG_TRIE_NAME: "trie",
  DAILY_PROBLEM_FALLBACK_TITLE: "Bài hằng ngày",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 Câu hỏi hôm nay",
  QUESTION_OF_TODAY_LABEL: "Câu hỏi hôm nay",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "Không tìm thấy dự án cho \"{query:string}\"",
  HOME_SECTION_HOW_IT_WORKS: "Cách hoạt động",
  HOME_HOW_STEP_1_TITLE: "Viết lời giải",
  HOME_HOW_STEP_1_BODY:
    "Dùng trình soạn thảo tích hợp với mẫu quen thuộc cho từng loại dự án.",
  HOME_HOW_STEP_2_TITLE: "Chạy và ghi",
  HOME_HOW_STEP_2_BODY:
    "API được theo dõi biến công việc cấu trúc thành ngăn xếp khung—không có animation có sẵn.",
  HOME_HOW_STEP_3_TITLE: "Kéo dòng thời gian",
  HOME_HOW_STEP_3_BODY:
    "Tiến và lùi, đổi tốc độ, xem từng thao tác trong nhật ký.",
  HOME_SECTION_WHY_DSTUCT: "Khả năng",
  HOME_PILLAR_VIS_TITLE: "Thấy thuật toán, không chỉ đầu ra",
  HOME_PILLAR_VIS_BODY:
    "Phát lại cách cấu trúc dữ liệu thay đổi. Hiểu và gỡ lỗi với trace thực thi thật.",
  HOME_PILLAR_WORKERS_TITLE: "Giao diện mượt khi chạy mã",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript trong Web Worker; Python với Pyodide trong worker riêng—trang vẫn phản hồi nhanh.",
  HOME_PILLAR_REPLAY_TITLE: "Phát lại du hành thời gian",
  HOME_PILLAR_REPLAY_BODY:
    "Phát, tạm dừng, từng bước, phát lại và chỉnh tốc độ—kèm phím tắt.",
  HOME_PILLAR_BENCH_TITLE: "Benchmark JavaScript",
  HOME_PILLAR_BENCH_BODY:
    "Nhiều lần chạy với trung vị, phân vị và biểu đồ. Chế độ benchmark chỉ JS hiện nay.",
  HOME_SECTION_LANGUAGES: "Hai ngôn ngữ, một sân chơi",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "Chạy cục bộ trong worker—không cần vòng lặp mạng cho hình ảnh hóa. Hỗ trợ benchmark đầy đủ.",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "CPython thật qua Pyodide trên trình duyệt—không cần cài. Tải trước khi mở lời giải Python; lần đầu tải runtime (~30 MB, sau đó cache). Chỉ thư viện chuẩn.",
  HOME_SECTION_TRY_DEMOS: "Thư viện thuật toán",
  HOME_TRY_DEMOS_LEAD:
    "Mở sân chơi được chọn để xem debugger trên bài thật, hoặc vào trình duyệt đầy đủ.",
  HOME_DEMO_TREE: "Cây nhị phân",
  HOME_DEMO_GRAPH: "Đường trên đồ thị",
  HOME_DEMO_GRID: "BFS lưới",
  HOME_DEMO_TRIE: "Trie / map",
  HOME_SECTION_FAQ: "Câu hỏi chung",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "Lưu tiến độ trên cloud",
  HOME_AUTH_BODY_SIGNED_OUT:
    "Đăng nhập để đồng bộ dự án, test và lời giải. Xem ví dụ công khai không cần tài khoản.",
  HOME_AUTH_VISUALIZATION_NOTE:
    "Chạy trong trình duyệt; đăng nhập để lưu và tính năng xã hội.",
  HOME_OPEN_PROFILE: "Mở hồ sơ",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "Không tạo được liên kết hồ sơ. Mở từ menu tài khoản ở đầu trang.",
  HOME_DAILY_QUESTION_ERROR:
    "Không tải được bài hằng ngày. Thử lại sau.",
  HOME_DAILY_SECTION_TITLE: "Chưa biết giải gì?",
  HOME_DAILY_SECTION_LEAD:
    "Đây là bài hằng ngày từ LeetCode—mở trong sân chơi khi sẵn sàng.",

  HOME_FAQ_Q_01: "Sao sau khi chạy không có hình ảnh hóa?",
  HOME_FAQ_A_01:
    "Phát trực quan đến từ API cấu trúc dữ liệu được theo dõi của dStruct. Chọn đúng danh mục và wrapper. Đối tượng thường không có API có thể in ra nhưng không replay từng bước.",
  HOME_FAQ_Q_02: "Hỗ trợ bài và cấu trúc nào?",
  HOME_FAQ_A_02:
    "Cây, BST, danh sách liên kết, đồ thị, lưới và ma trận, mảng, heap, stack, trie, DP, hai con trỏ, cửa sổ trượt, quay lui và hơn nữa. Duyệt sân chơi hoặc danh mục khi tạo dự án.",
  HOME_FAQ_Q_03: "Có cần cài Python không?",
  HOME_FAQ_A_03:
    "Không cho dùng thường. JS trong Web Worker; Python với Pyodide. Máy chủ Python cục bộ tuỳ chọn cho dev.",
  HOME_FAQ_Q_04: "Mã có chạy trên server của bạn không?",
  HOME_FAQ_A_04:
    "Mặc định không—thực thi trong trình duyệt. Lưu và cloud dùng backend như web app khác.",
  HOME_FAQ_Q_05: "Dùng JavaScript và Python được không?",
  HOME_FAQ_A_05:
    "Có. Có thể có lời giải JS và Python riêng. Benchmark chỉ JavaScript hiện nay.",
  HOME_FAQ_Q_06: "Python sao có thanh tải?",
  HOME_FAQ_A_06:
    "Pyodide tải nền khi mở trang Python. Lần đầu ~30 MB runtime; WASM khởi động có thể vài giây kể cả từ cache.",
  HOME_FAQ_Q_07: "NumPy hoặc pip?",
  HOME_FAQ_A_07:
    "Không ở sân chơi mặc định—chỉ thư viện chuẩn. Import bên thứ ba sẽ lỗi.",
  HOME_FAQ_Q_08: "Một lần chạy tối đa bao lâu?",
  HOME_FAQ_A_08:
    "Python hết hạn 30 giây mặc định; worker tạo lại. Hủy thô với tải rất nặng.",
  HOME_FAQ_Q_09: "Lưu công việc thế nào?",
  HOME_FAQ_A_09:
    "Dự án công khai và editor không cần đăng nhập. Để lưu lâu dài, hãy đăng nhập.",
  HOME_FAQ_Q_10: "Chia sẻ dự án?",
  HOME_FAQ_A_10:
    "Có. Đặt công khai và dùng Duyệt.",
  HOME_FAQ_Q_11: "Liên kết LeetCode để làm gì?",
  HOME_FAQ_A_11:
    "Tuỳ chọn hồ sơ, URL bài cho metadata, lối tắt. Nộp bài vẫn trên LeetCode.",
  HOME_FAQ_Q_12: "Đo tốc độ lời giải?",
  HOME_FAQ_A_12:
    "Có với JavaScript—chế độ Benchmark. Python chưa có.",
  HOME_FAQ_Q_13: "Điện thoại hoặc máy tính bảng?",
  HOME_FAQ_A_13:
    "Luồng thân thiện mobile với keep-alive khi đổi tab. Phiên sửa lâu thoải mái hơn trên desktop.",
  HOME_FAQ_Q_14: "dStruct có mã nguồn mở không?",
  HOME_FAQ_A_14:
    "Có. Xem LICENSE trong kho (AGPL-3.0).",
};

export default vi;
