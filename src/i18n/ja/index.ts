import type { Translation } from "../i18n-types";

const ja: Record<keyof Translation, string> = {
  ACTION: "操作",
  ADD_ARGUMENT: "引数を追加",
  ADD_NEW_SOLUTION: "新しい解答を追加",
  ARGUMENTS: "引数",
  BROWSE: "閲覧",
  BROWSE_PROJECTS: "プロジェクトを閲覧",
  BACK: "戻る",
  CALLSTACK: "コールスタック",
  CANCEL: "キャンセル",
  CODE: "コード",
  CHOOSE_LOCALE: "言語を選択...",
  CODE_COPIED_TO_CLIPBOARD: "コードをクリップボードにコピーしました",
  CODE_RUNNER: "コードランナー",
  CONSOLE_OUTPUT: "コンソール出力",
  CONTINUE: "続ける",
  COPY: "コピー",
  COPY_CODE_TO_CLIPBOARD: "コードをクリップボードにコピー",
  CREATE_NEW_PROJECT: "新規プロジェクトを作成",
  CURRENT_PROJECT: "現在のプロジェクト",
  CURRENT_USER_ACCOUNT: "現在のユーザーアカウント",
  DARK_MODE: "ダークモード",
  DASHBOARD: "ダッシュボード",
  DATA_STRUCTURES_SIMPLIFIED: "データ構造をシンプルに",
  DELETE: "削除",
  DELETE_THIS_PROJECT: "このプロジェクトを削除",
  DELETE_X_ARGUMENT: "引数 {name:string} を削除",
  DAILY_PROBLEM_NAV: "デイリー問題",
  DESCRIPTION: "説明",
  DSTRUCT_LOGO: "DStruct ロゴ",
  EDIT_AND_SAVE:
    "<code>pages/index.tsx</code> を編集して保存すると再読み込みします。",
  EDIT_SELECTED_PROJECT: "選択中のプロジェクトを編集",
  EDIT_SOLUTION: "解答を編集",
  EDIT_TEST_CASE: "テストケースを編集",
  EDIT_TEST_CASE_SUMMARY: "テストケースの詳細を編集します。",
  FEEDBACK: "フィードバック",
  FORWARD: "進む",
  FORMATTING_ICON: "フォーマットアイコン",
  FORMAT_CODE_WITH: "次でコードを整形",
  HI: "こんにちは、{name:string}！",
  INPUT: "入力",
  LANGUAGE: "言語",
  LOGOUT: "ログアウト",
  MAIN_MENU: "メインメニュー",
  MS: "ミリ秒",
  NAME: "名前",
  NEW: "新規",
  NODE: "ノード",
  NO_DATA: "データなし",
  OPEN_OPTIONS: "オプションを開く",
  OUTPUT: "出力",
  PANEL_TABS: "パネルタブ",
  PENDING_CHANGES: "未保存の変更",
  PLAYBACK_INTERVAL: "再生間隔",
  PLAYGROUND: "プレイグラウンド",
  PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME:
    "LeetCode アカウント名を入力してください:",
  PROFILE: "プロフィール",
  PROJECT: "プロジェクト",
  PROJECT_BROWSER: "プロジェクトブラウザ",
  SEARCH_PROJECTS: "タイトルでプロジェクトを検索...",
  NO_PROJECTS_FOUND: "プロジェクトが見つかりません",
  NO_PROJECTS_MATCH_FILTERS: "フィルターに一致するプロジェクトがありません",
  FILTERS: "フィルター",
  FILTER_BY_DIFFICULTY: "難易度",
  SHOW_ONLY_NEW: "新しいプロジェクトのみ",
  SHOW_ONLY_MINE: "自分のプロジェクトのみ",
  CLEAR_ALL_FILTERS: "すべてのフィルターをクリア",
  SORT_BY: "並べ替え",
  SORT_TITLE: "タイトル",
  SORT_TITLE_ASC: "タイトル (A-Z)",
  SORT_TITLE_DESC: "タイトル (Z-A)",
  SORT_DIFFICULTY: "難易度",
  SORT_DIFFICULTY_ASC: "難易度 (易→難)",
  SORT_DIFFICULTY_DESC: "難易度 (難→易)",
  SORT_DATE: "日付",
  SORT_DATE_ASC: "日付 (新しい順)",
  SORT_DATE_DESC: "日付 (古い順)",
  SORT_CATEGORY: "カテゴリ",
  SORT_CATEGORY_ASC: "カテゴリ (A-Z)",
  SORT_CATEGORY_DESC: "カテゴリ (Z-A)",
  REPLAY: "リプレイ",
  REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION:
    "前回のコード結果の可視化を再生",
  RESET: "リセット",
  RESULTS: "結果",
  RESET_DATA_STRUCTURES:
    "データ構造を初期状態にリセット",
  RETRY: "再試行",
  RETURNED: "戻り値",
  RUN: "実行",
  RUNTIME: "実行時間",
  RUN_CODE: "コードを実行",
  SAVED_IN_THE_CLOUD: "クラウドに保存済み",
  SELECTED_LOCALE: "選択中の言語:",
  SETTINGS: "設定",
  SIGN_IN: "サインイン",
  SIGN_IN_FAILED: "サインインに失敗しました",
  SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE:
    "サインインして進捗などを記録しましょう！",
  SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT:
    "右上から GitHub または Google でサインイン",
  SLUG: "スラッグ",
  SPACE_COMPLEXITY: "空間計算量",
  SUBMIT: "送信",
  SUCCESS: "成功",
  SYNCING_WITH_SERVER: "サーバーと同期中",
  TEST_CASE_DESCRIPTION_HELPER_TEXT:
    "テストケースの説明（任意）",
  TEST_CASE_NAME_HELPER_TEXT: "テストケースの短い名前",
  TEST_CASE_SLUG_HELPER_TEXT:
    "このテストケースの URL に使うスラッグを編集できます",
  TIMESTAMP: "タイムスタンプ",
  TIME_COMPLEXITY: "時間計算量",
  TODAY: "今日は {date:Date|weekday} です",
  TOKEN: "トークン",
  TREE_VIEWER: "ツリービューア",
  TRY_IT_OUT_NOW: "今すぐ試す",
  TYPE: "型",
  UPDATE: "更新",
  USERNAME: "ユーザー名",
  USER_DASHBOARD: "{name:string} のダッシュボード",
  USER_SETTINGS: "ユーザー設定",
  VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE:
    "コードから LeetCode の問題を可視化",
  YOUR_CHANGES_WILL_BE_LOST: "変更は失われます",
  YOUR_LEETCODE_ACCOUNT_NAME: "LeetCode アカウント名:",
  YOUR_NAME: "お名前:",
  YOU_DONT_OWN_THIS_PROJECT: "このプロジェクトの所有者ではありません",
  YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE:
    "コードを保存するにはサインインが必要です",
  YOU_NEED_TO_RUN_THE_CODE_FIRST: "先にコードを実行してください",

  HOME_LANDING_TITLE:
    "あなたのコードを、フレームごと。一歩進んで、一歩戻る。",
  HOME_LANDING_SUBTITLE:
    "解答が木・グラフ・グリッド・連結構造・ネストしたマップの視覚的な実行トレースになる LeetCode 風プレイグラウンド。ブラウザ上の JavaScript と Python、ステップ再生、JS 向けオプションのタイミング統計。",
  HOME_HERO_FAQ_LINK: "よくある質問",
  HOME_HERO_FAQ_LINK_SUFFIX: " →",
  HOME_LANDING_PREVIEW_CODE_LANGUAGE: "JavaScript",
  HOME_LANDING_PREVIEW_CODE_FILENAME: "solution.js",
  HOME_PREVIEW_STEP_PROGRESS: "ステップ {step:number} / {total:number}",
  HOME_LANDING_PREVIEW_PLAY: "再生",
  HOME_LANDING_PREVIEW_PAUSE: "一時停止",
  HOME_PREVIEW_STEP_BACK: "ステップ戻し",
  HOME_PREVIEW_STEP_FORWARD: "ステップ進み",
  HOME_LANDING_PREVIEW_LOAD_FAILED:
    "ランディングプレビューを読み込めませんでした。",
  HOME_LANDING_PREVIEW_ERROR_UNEXPECTED:
    "プレビューの初期化で予期しないエラーが発生しました。",
  HOME_DEMO_SLUG_INVERT_BINARY_TREE: "二分木を反転",
  HOME_DEMO_SLUG_PATH_IN_GRAPH: "グラフ内のパス",
  HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX: "二分行列での最短経路",
  HOME_DEMO_SLUG_TRIE_NAME: "トライ木",
  DAILY_PROBLEM_FALLBACK_TITLE: "デイリー問題",
  DAILY_PROBLEM_SECTION_CAPTION: "📅 今日の問題",
  QUESTION_OF_TODAY_LABEL: "今日の問題",
  NO_PROJECTS_FOUND_FOR_SEARCH:
    "「{query:string}」に一致するプロジェクトはありません",
  HOME_SECTION_HOW_IT_WORKS: "仕組み",
  HOME_HOW_STEP_1_TITLE: "解答を書く",
  HOME_HOW_STEP_1_BODY:
    "カテゴリごとに馴染みのあるパターンで組み込みエディタを使います。",
  HOME_HOW_STEP_2_TITLE: "実行して記録",
  HOME_HOW_STEP_2_BODY:
    "追跡 API が構造操作をフレームのコールスタックに変えます—用意されたアニメーションはありません。",
  HOME_HOW_STEP_3_TITLE: "タイムラインを操作",
  HOME_HOW_STEP_3_BODY:
    "前後に進み、速度を変え、ログの各操作を確認します。",
  HOME_SECTION_WHY_DSTUCT: "機能",
  HOME_PILLAR_VIS_TITLE: "出力だけでなくアルゴリズムを見る",
  HOME_PILLAR_VIS_BODY:
    "データ構造の変化を再生。実際の実行トレースで理解とデバッグ。",
  HOME_PILLAR_WORKERS_TITLE: "コード実行中も滑らかな UI",
  HOME_PILLAR_WORKERS_BODY:
    "JavaScript は Web Worker、Python は専用 Worker の Pyodide—ページは応答性を保ちます。",
  HOME_PILLAR_REPLAY_TITLE: "タイムトラベル再生",
  HOME_PILLAR_REPLAY_BODY:
    "再生・一時停止・ステップ・リプレイ・速度調整—キーボードショートカット対応。",
  HOME_PILLAR_BENCH_TITLE: "JavaScript ベンチマーク",
  HOME_PILLAR_BENCH_BODY:
    "中央値・パーセンタイル・チャートで多数実行。ベンチマークは現状 JS のみ。",
  HOME_SECTION_LANGUAGES: "2 言語、1 つのプレイグラウンド",
  HOME_LANG_JS_TITLE: "JavaScript",
  HOME_LANG_JS_BODY:
    "ワーカー内でローカル実行—可視化の往復なし。フルベンチマーク対応。",
  HOME_LANG_PYTHON_TITLE: "Python",
  HOME_LANG_PYTHON_BODY:
    "ブラウザの Pyodide で本物の CPython—インストール不要。Python 解答を開くとプリロード；初回訪問でランタイム取得（約 30 MB、その後キャッシュ）。標準ライブラリのみ。",
  HOME_SECTION_TRY_DEMOS: "アルゴリズムギャラリー",
  HOME_TRY_DEMOS_LEAD:
    "厳選プレイグラウンドで実問題上のデバッガを見るか、フルブラウザへ。",
  HOME_DEMO_TREE: "二分木",
  HOME_DEMO_GRAPH: "グラフ上のパス",
  HOME_DEMO_GRID: "グリッド BFS",
  HOME_DEMO_TRIE: "Trie / マップ",
  HOME_SECTION_FAQ: "よくある質問",
  HOME_AUTH_HEADLINE_SIGNED_OUT: "クラウドに進捗を保存",
  HOME_AUTH_BODY_SIGNED_OUT:
    "サインインしてプロジェクト・テスト・解答を同期。アカウントなしで公開例を閲覧。",
  HOME_AUTH_VISUALIZATION_NOTE:
    "実行はブラウザ内。サインインは保存とソーシャル機能用。",
  HOME_OPEN_PROFILE: "プロフィールを開く",
  HOME_PROFILE_LINK_UNAVAILABLE:
    "プロフィールリンクを作成できませんでした。ヘッダーのアカウントメニューから開いてください。",
  HOME_DAILY_QUESTION_ERROR:
    "デイリー問題を読み込めませんでした。後でもう一度お試しください。",
  HOME_DAILY_SECTION_TITLE: "何を解けばいいか迷っていますか？",
  HOME_DAILY_SECTION_LEAD:
    "LeetCode のデイリー問題です—準備ができたらプレイグラウンドで開いてください。",

  HOME_FAQ_Q_01: "実行後に可視化が出ないのはなぜ？",
  HOME_FAQ_A_01:
    "視覚再生は dStruct の追跡データ構造 API から来ます。カテゴリとプレイグラウンドが期待するラッパーを選んでください。それらのないプレーンオブジェクトは出力は出てもステップ再生はできません。",
  HOME_FAQ_Q_02: "どんな問題と構造がサポートされていますか？",
  HOME_FAQ_A_02:
    "木、BST、連結リスト、グラフ、グリッドと行列、配列、ヒープ、スタック、trie、DP、二ポインタ、スライディングウィンドウ、バックトラッキングなど。プレイグラウンドを見るかプロジェクト作成時にカテゴリを確認。",
  HOME_FAQ_Q_03: "Python をインストールする必要は？",
  HOME_FAQ_A_03:
    "通常の利用では不要。JS は Web Worker、Python は Pyodide。ローカル Python サーバーは開発者向けオプション。",
  HOME_FAQ_Q_04: "コードはサーバー上で動きますか？",
  HOME_FAQ_A_04:
    "既定ではいいえ—実行はブラウザ。保存やクラウド閲覧はバックエンドを使用。",
  HOME_FAQ_Q_05: "JavaScript と Python の両方は？",
  HOME_FAQ_A_05:
    "はい。別々の JS と Python 解答を保存可能。ベンチマークは現状 JavaScript のみ。",
  HOME_FAQ_Q_06: "Python に読み込みバーが出る理由は？",
  HOME_FAQ_A_06:
    "Python ページを開くと Pyodide がバックグラウンドでプリロード。初回はランタイム（約 30 MB）をダウンロード；キャッシュからでも WASM 起動に数秒かかることがあります。",
  HOME_FAQ_Q_07: "NumPy や pip は？",
  HOME_FAQ_A_07:
    "デフォルトのプレイグラウンドでは不可—標準ライブラリのみ。サードパーティ import は失敗します。",
  HOME_FAQ_Q_08: "実行はどれくらい長くなりますか？",
  HOME_FAQ_A_08:
    "Python は既定で 30 秒でタイムアウト；ワーカー再作成。非常に重い処理ではキャンセルが粗くなります。",
  HOME_FAQ_Q_09: "作業を保存するには？",
  HOME_FAQ_A_09:
    "サインインなしで公開プロジェクトとエディタを利用。永続化にはサインイン。",
  HOME_FAQ_Q_10: "プロジェクトを共有・他者から学べますか？",
  HOME_FAQ_A_10:
    "はい。プロジェクトを公開し、閲覧で例を探してください。",
  HOME_FAQ_Q_11: "LeetCode アカウント連携の意味は？",
  HOME_FAQ_A_11:
    "任意のプロフィール機能、問題 URL のメタデータ入力、LeetCode へのショートカット。提出は LeetCode で—dStruct は補助プレイグラウンドです。",
  HOME_FAQ_Q_12: "解答の速度を測れますか？",
  HOME_FAQ_A_12:
    "はい、JavaScript ではベンチマークモード（多数反復、中央値、パーセンタイル、チャート）。Python はまだありません。",
  HOME_FAQ_Q_13: "スマホやタブレットでは？",
  HOME_FAQ_A_13:
    "タブ切替時のキープアライブ付きモバイル向けフロー。長時間の編集はデスクトップが楽。",
  HOME_FAQ_Q_14: "dStruct はオープンソースですか？",
  HOME_FAQ_A_14:
    "はい。リポジトリの LICENSE を参照（AGPL-3.0）。",
};

export default ja;
