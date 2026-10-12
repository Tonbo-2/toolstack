/**
 * The reviewed tool directory — the single source for /tools, /tools/[slug]
 * and the home page matrix.
 *
 * Editorial rules for anything added here (see .claude/design.md, Voice & tone):
 * - Only QUALITATIVE, defensible statements: what a tool is good at, who should
 *   skip it, how it behaves next to its neighbours.
 * - NEVER invent prices, ratings, review counts, user numbers, or awards. A
 *   concrete fact goes in only if it came from the vendor's own page, read
 *   while writing the entry.
 * - `reviewed` is the month the entry was written, shown to the reader.
 * - `logo` may be an empty string when no verified mark could be hosted; the UI
 *   then renders the name alone rather than a stand-in badge.
 * - Every reader-facing string is Japanese (`{ ja }`). Product names stay as the
 *   vendor writes them; Japanese readings are shown separately.
 */

import { formatDate, type Locale } from "@/lib/i18n";

/**
 * A reader-facing string. The site serves Japanese only (2026-09-26: the English
 * copy was removed), so there is one field; adding a language means adding its
 * key here and filling it in every entry below.
 */
export interface Localized {
  ja: string;
}

export interface Tool {
  slug: string;
  /** Real product name, exactly as the vendor writes it. Never translated. */
  name: string;
  /** Japanese reading shown alongside the official product name. */
  reading: string;
  /** Vendor homepage — used by /go/[slug] when no affiliate link is set yet. */
  url: string;
  /** Hosted vendor mark (favicon-grade, never recolored or re-composed). */
  logo: string;
  category: CategorySlug;
  /**
   * Two lines, split by "\n": 先頭が「どんなツールか」の一言説明、改行して「向いている人」。
   * Rendered with `whitespace-pre-line` on the home list, the directory table and
   * the tool page, so a one-line entry still reads as a fit statement on its own.
   */
  bestFor: Localized;
  /** What it is genuinely good at. */
  standout: Localized;
  /** The honest cost of choosing it. */
  watchFor: Localized;
  /** Two or three sentences of verdict. */
  verdict: Localized;
  /** Slugs of tools that work well beside it. */
  pairsWith: string[];
  reviewed: string;
}

/** A tool with its strings resolved for one locale — what pages render. */
export interface LocalizedTool extends Omit<Tool, "bestFor" | "standout" | "watchFor" | "verdict"> {
  bestFor: string;
  standout: string;
  watchFor: string;
  verdict: string;
}

/** Add a pronunciation while keeping the vendor's official name intact. */
export function toolDisplayName(tool: Pick<LocalizedTool, "name" | "reading">): string {
  const formerName = tool.name.match(/^(.*?)（旧(.+?)）$/u);
  return formerName
    ? `${formerName[1]}（${tool.reading}、旧${formerName[2]}）`
    : `${tool.name}（${tool.reading}）`;
}

export type CategorySlug = "workspace" | "automation" | "writing-seo" | "email" | "audio-meetings";

export interface Category {
  slug: CategorySlug;
  label: Localized;
  blurb: Localized;
}

export interface LocalizedCategory {
  slug: CategorySlug;
  label: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "workspace",
    label: { ja: "ワークスペースとドキュメント" },
    blurb: {
      ja: "作業の内容を書き留めて、ひとまとめに置いておく場所。",
    },
  },
  {
    slug: "automation",
    label: { ja: "自動化" },
    blurb: {
      ja: "すでに使っているツールの間で、データを自動で行き来させる。",
    },
  },
  {
    slug: "writing-seo",
    label: { ja: "文章作成とSEO" },
    blurb: {
      ja: "文章をまとめて書き、検索で上位の記事と比べて確かめる。",
    },
  },
  {
    slug: "email",
    label: { ja: "メールと情報発信" },
    blurb: {
      ja: "登録者に直接届けられる、自分で持てる連絡手段。",
    },
  },
  {
    slug: "audio-meetings",
    label: { ja: "音声と会議" },
    blurb: {
      ja: "音声、文字起こし、通話のあとに残る記録。",
    },
  },
];

export const TOOLS: Tool[] = [
  {
    slug: "notion",
    name: "Notion",
    reading: "ノーション",
    url: "https://www.notion.so",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/5640c98062d12b62.png",
    category: "workspace",
    bestFor: {
      ja: "メモ書き、タスク管理、マニュアル（社内Wiki）、顧客や案件の管理リストまで、バラバラになりがちな仕事の情報を1つに集約できるワークスペースです。",
    },
    standout: {
      ja: "ドキュメントの執筆、タスク一覧の確認、AIによる文章の要約や下書き作成がすべて同じ画面内で動くため、タブを何個も切り替える手間がなくなります。",
    },
    watchFor: {
      ja: "誰でも新しいページを好きな階層に作れてしまうため、「あの議事録はどこ？」「古い情報が放置されている」といった情報の散らかり（属人化）が起きがちです。",
    },
    verdict: {
      ja: "情報共有ツールが決まっていない少人数チームなら、「社内のなんでも置き場」としてNotionを選んでおけば間違いありません。",
    },
    pairsWith: ["zapier", "otter-ai"],
    reviewed: "2026-09-20",
  },
  {
    slug: "zapier",
    name: "Zapier",
    reading: "ザピアー",
    url: "https://zapier.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/23ae37879fbb05be.png",
    category: "automation",
    bestFor: {
      ja: "プログラミング不要で「Aのアプリで何かが起きたら、Bのアプリでこれを実行する」という連動ルールを作り、単純作業を自動で肩代わりさせるサービス（iPaaS）です。",
    },
    standout: {
      ja: "連携できるアプリ数が世界最多（7,000以上）\nテンプレートが豊富で、数分で自動化が完成する\nエラーが起きても原因を特定しやすい",
    },
    watchFor: {
      ja: "「分岐が10個ある」「複雑なループ処理」になると管理が破綻しやすい\n動いた回数（タスク数）で課金されるため、大量処理だとコストが膨らむ\n日本語対応は一部のみ（基本は英語UI）",
    },
    verdict: {
      ja: "「問い合わせが来たらSlackに通知してスプレッドシートに追記する」といった、2〜5ステップ前後の日常業務を自動化したいなら、まず選んで間違いのない定番ツールです。メリットは対応サービスの圧倒的な多さで、「このマイナーな海外ツール、他では繋がらなかったのにZapierなら動いた」というケースが日常茶飯事です。",
    },
    pairsWith: ["notion", "kit"],
    reviewed: "2026-09-20",
  },
  {
    slug: "make",
    name: "Make",
    reading: "メイク",
    url: "https://www.make.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3c847799933a657d.jpg",
    category: "automation",
    bestFor: {
      ja: "まるでマインドマップを描くように、丸いアイコン（モジュール）を線で繋ぎながら「分岐・計算・フィルター」を画面上で組み立てられる高機能な自動化プラットフォーム（iPaaS）です。",
    },
    standout: {
      ja: "1枚のキャンバス全体で複雑な分岐やループ処理を見渡せる\nデータの加工・計算（文字列の置換や日時の変換）が追加コストなしで自由自在\nZapierに比べて圧倒的にコストパフォーマンスが高い",
    },
    watchFor: {
      ja: "初期の学習ハードルが高く、直感だけで動かすのは難しい\n日本語の情報や公式サポートがまだ少なめ\n「AからBへそのまま転送するだけ」の2ステップならZapierのほうが手軽",
    },
    verdict: {
      ja: "「顧客の種別ごとに3通りに処理を分岐させ、データを計算して集計する」といった、少し複雑な業務フローを安く本格的に自動化したいならMakeが最適です。「ステップ数が多すぎて月額料金が高すぎる」「画面が縦に長くなりすぎて全体の構造が見えない」と感じ始めたタイミングが、まさに乗り換えのサインです。",
    },
    pairsWith: ["zapier", "notion"],
    reviewed: "2026-09-20",
  },
  {
    slug: "jasper",
    name: "Jasper",
    reading: "ジャスパー",
    url: "https://www.jasper.ai",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3348b05b9e8b740e.png",
    category: "writing-seo",
    bestFor: {
      ja: "ChatGPTのような雑談・汎用型ではなく、SEO記事、Web広告のキャッチコピー、メルマガ作成など「売るための文章生成」に特化したマーケティング向けAIプラットフォームです。",
    },
    standout: {
      ja: "自社の文体・語り口（Brand Voice）を学習し、誰が書いても同じトーンになる\n1つの企画から各媒体用の文章（SNS・メルマガ・ブログ）をまるごと一括生成できる\nマーケティング専用のプロンプトテンプレートが50種類以上揃っている",
    },
    watchFor: {
      ja: "個人利用には月額コストが高く、元を取りにくい\n日常の相談や単発のリサーチ用途（Q&A）には向かない\n生成された文章の事実確認（ファクトチェック）は必須",
    },
    verdict: {
      ja: "「複数のライターや社員で発信しているが、文章の雰囲気（文末やトーン）がバラバラで統一感がない」という課題を抱えるチームに最適な、マーケティング専用のAIツールです。自社ブランド特有の語り口（Brand Voice）を学習させ、誰が指示を出してもブレないコピーを量産できます。一方、個人が自分のブログやSNSの下書きを書く程度なら、ChatGPTなどの汎用AIで十分であり、月額費用を持て余す可能性が高いです。",
    },
    pairsWith: ["surfer-seo", "kit"],
    reviewed: "2026-09-20",
  },
  {
    slug: "writesonic",
    name: "Writesonic",
    reading: "ライトソニック",
    url: "https://writesonic.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/85aa54a0adf0098f.png",
    category: "writing-seo",
    bestFor: {
      ja: "最新のWeb検索データを取り込みながら、検索順位を意識した「記事の見出し構成作成」「競合調査」「本文の長文執筆」までを1画面でアシストしてくれるSEO特化型AIツールです。",
    },
    standout: {
      ja: "Google上位記事の構成を自動分析し、検索意図に沿った見出しを提案\nリサーチと本文執筆が同じ画面で完結し、ブラウザの行き来が不要\n文字単価や外注費を抑えつつ、記事の初稿作成スピードを大幅に加速",
    },
    watchFor: {
      ja: "そのまま投稿すると「無難で薄い記事」になり、検索順位も上がりにくい\n最新情報のファクトチェック（数値・固有名詞の事実確認）は必須\n日本語の言い回しに時折翻訳調・不自然なニュアンスが残る",
    },
    verdict: {
      ja: "「リサーチ専任のスタッフを雇う余裕はないが、検索上位を狙える記事をコンスタントに公開したい」という少人数メディアに最適な、SEO特化型のAIライティングツールです。Google検索の最新データや競合上位サイトの構成をその場で分析しながら、見出し構成から長文の下書きまでを一気に組み立てられます。",
    },
    pairsWith: ["surfer-seo", "kit"],
    reviewed: "2026-09-20",
  },
  {
    slug: "surfer-seo",
    name: "Surfer SEO",
    reading: "サーファー・エスイーオー",
    url: "https://surferseo.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/332cd34458cf503a.png",
    category: "writing-seo",
    bestFor: {
      ja: "狙うキーワードの上位競合サイトを自動解析し、「必要な文字数・見出し数・必須キーワード（共起語）」をリアルタイムで点数化（Content Score）しながら執筆・リライトできるSEO最適化ツールです。",
    },
    standout: {
      ja: "上位記事と見比べて「足りない単語」と「推奨使用回数」をピンポイントで可視化\nGoogleドキュメントやWordPressの編集画面でそのまま採点しながら書ける\n既存記事のURLを入れるだけで「改善チェックリスト」が数分で完成する",
    },
    watchFor: {
      ja: "「スコア100点」を目指してキーワードを詰め込むと、読者が離脱する\n月額料金が高めで、完全な趣味ブログだとコスト負けしやすい\n日本語の表記ゆれ（ひらがな・漢字・助詞）を機械的に厳密判定しがち",
    },
    verdict: {
      ja: "「検索結果には表示されているのに、順位が2〜3ページ目（10〜30位）で止まっていて読まれない」という既存記事のリライトに使うのが最も効果的です。すでにGoogleから一定の評価を得ている記事なら、「競合上位にあって自社に足りないキーワード」を補うだけで、短期間で検索1ページ目へ順位を押し上げやすいからです。",
    },
    pairsWith: ["writesonic", "jasper"],
    reviewed: "2026-09-20",
  },
  {
    slug: "kit",
    name: "Kit（旧ConvertKit）",
    reading: "キット",
    url: "https://kit.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/53257fe889d1112a.png",
    category: "email",
    bestFor: {
      ja: "複雑な営業システムを省き、「メールの執筆・配信」「読者ごとの興味タグ付け」「デジタルコンテンツの直接決済」をシンプルに完結させる、クリエイター特化型の配信プラットフォームです。",
    },
    standout: {
      ja: "ブログを書くような画面で、迷わずメールの執筆に集中できる\n「特典Aを請求した人にはこのタグをつけ、3通のステップメールを送る」が樹形図で一目でわかる\n「Creator Network」により、広告費をかけずに同ジャンルの新規読者が増える",
    },
    watchFor: {
      ja: "BtoBのような商談管理や案件パイプライン（CRM機能）は備わっていない\nECサイトのような画像多用・ブロック配置のリッチデザインは作りにくい\n全く別の複数ブランドや会社を「完全に隔離して並行運用」するのは難しい",
    },
    verdict: {
      ja: "「自分の思考や専門知識をメルマガとして週1〜2回発信し、読者との濃い信頼関係を作りたい」というブロガー、講師、個人クリエイターにとって、最も無駄のない選択肢です。",
    },
    pairsWith: ["surfer-seo", "notion"],
    reviewed: "2026-09-20",
  },
  {
    slug: "getresponse",
    name: "GetResponse",
    reading: "ゲットレスポンス",
    url: "https://www.getresponse.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/6e3d791f0876b07e.jpg",
    category: "email",
    bestFor: {
      ja: "リッチな画像入りメールの配信に加え、離脱防止ポップアップ付きのLP作成、ウェビナー開催、緻密な行動トラッキングまでを網羅した、売上直結型の統合マーケティングプラットフォームです。",
    },
    standout: {
      ja: "外部ツールを買い足さずに「集客〜セミナー開催〜成約」まで完結できる\nECや新商品の告知に強い、華やかなデザインメールを直感的に作れる\n複数のビジネスを別々の独立リスト（名簿）で安全に並行管理できる",
    },
    watchFor: {
      ja: "同じ読者が別リストに登録されると「2人分」として重複課金される\n設定項目やメニューが膨大で、最初の動線構築にまとまった学習時間が必要\nクリエイター向けの「手軽な教材直販」や「読者の相互紹介機能」はない",
    },
    verdict: {
      ja: "「メルマガを送るだけでなく、集客用LPの制作からZoom不要のオンライン説明会（ウェビナー）、商品成約までのセールス動線を1本化したい」なら、迷わず選ぶべきオールインワンツールです。",
    },
    pairsWith: ["writesonic", "zapier"],
    reviewed: "2026-09-20",
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    reading: "イレブンラボ",
    url: "https://elevenlabs.io",
    // No verified mark could be hosted for this entry — the name stands alone.
    logo: "",
    category: "audio-meetings",
    bestFor: {
      ja: "自然で表現力のある音声をAIで生成できる音声生成・音声合成プラットフォーム。\nナレーションや音声ガイドなど、書いたものを音声でも用意したい方。",
    },
    standout: {
      ja: "そのまま公開できる声の質で、複数の言語に対応しています。",
    },
    watchFor: {
      ja: "音声のクローン機能を使う際は、本人の同意や音声の利用権を確認する必要がある。\n第三者の声を利用する場合は、権利関係を事前に確認すること。",
    },
    verdict: {
      ja: "書いた記事を音声でも届けたいなら、この一覧でもっとも有力な選択です。最初の音声を公開する前に、AIの音声であることをどう伝えるかを決めてください。",
    },
    pairsWith: ["writesonic", "notion"],
    reviewed: "2026-09-20",
  },
  {
    slug: "otter-ai",
    name: "Otter.ai",
    reading: "オッター・エーアイ",
    url: "https://otter.ai",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9b8a90ec8dc37495.png",
    category: "audio-meetings",
    bestFor: {
      ja: "会議やインタビューの音声をリアルタイムでテキスト化し、自動で要約や話者の識別まで行うAIを活用した議事録・文字起こしツール。\n議事録担当を置かずに、通話の内容を後から確認したい方。",
    },
    standout: {
      ja: "会議に参加して文字起こしをし、数週間後でも探せる要約を作ります。",
    },
    watchFor: {
      ja: "人名や数字、専門用語などは誤認識される場合がある。\n顧客や社外に共有する前に、文字起こしの内容を確認すること。",
    },
    verdict: {
      ja: "同じ種類の通話を繰り返す人に一番効きます。営業、ヒアリング、顧客との定例などです。要約は、そのまま信じずに読んでください。",
    },
    pairsWith: ["notion", "zapier"],
    reviewed: "2026-09-20",
  },
];

export interface Stack {
  slug: string;
  name: Localized;
  forWho: Localized;
  why: Localized;
  toolSlugs: string[];
}

export interface LocalizedStack {
  slug: string;
  name: string;
  forWho: string;
  why: string;
  toolSlugs: string[];
}

/** Curated stacks. Editorial curation from the directory above, not a bundle offer. */
export const STACKS: Stack[] = [
  {
    slug: "solo-consultant",
    name: { ja: "個人向けの構成" },
    forWho: {
      ja: "顧客対応、通話、メールを1人で回している人。",
    },
    why: {
      ja: "顧客の資料と通話の記録が1か所にまとまり、担当者を増やさず定期的な情報発信を続けられます。",
    },
    toolSlugs: ["notion", "otter-ai", "kit"],
  },
  {
    slug: "content-led-startup",
    name: { ja: "記事から問い合わせにつながる流れ" },
    forWho: {
      ja: "公開した記事をきっかけに案件が始まる小規模チーム。",
    },
    why: {
      ja: "記事の下書きから検索順位のチェック、メールリストの管理までをツールで分担し、人を増やさずに毎週の運用を続けられます。",
    },
    toolSlugs: ["writesonic", "surfer-seo", "kit"],
  },
  {
    slug: "lean-operations",
    name: { ja: "担当者を増やさず効率化する構成" },
    forWho: {
      ja: "すでに使っているツールを活用しながら、少人数で業務を効率化したいチーム。",
    },
    why: {
      ja: "決まった作業は簡単な連携で自動化し、条件に応じた作業は1つの画面で管理。必要な資料も、チーム全員がすぐに見つけられるようにまとめます。",
    },
    toolSlugs: ["zapier", "make", "notion"],
  },
];

/** Resolve one tool's reader-facing strings for a locale. */
export function localizedTool(tool: Tool, locale: Locale): LocalizedTool {
  return {
    slug: tool.slug,
    name: tool.name,
    reading: tool.reading,
    url: tool.url,
    logo: tool.logo,
    category: tool.category,
    bestFor: tool.bestFor[locale],
    standout: tool.standout[locale],
    watchFor: tool.watchFor[locale],
    verdict: tool.verdict[locale],
    pairsWith: tool.pairsWith,
    reviewed: tool.reviewed,
  };
}

export function localizedCategory(category: Category, locale: Locale): LocalizedCategory {
  return { slug: category.slug, label: category.label[locale], blurb: category.blurb[locale] };
}

export function localizedStack(stack: Stack, locale: Locale): LocalizedStack {
  return {
    slug: stack.slug,
    name: stack.name[locale],
    forWho: stack.forWho[locale],
    why: stack.why[locale],
    toolSlugs: stack.toolSlugs,
  };
}

export const toolsFor = (locale: Locale): LocalizedTool[] =>
  TOOLS.map((tool) => localizedTool(tool, locale));

export const categoriesFor = (locale: Locale): LocalizedCategory[] =>
  CATEGORIES.map((category) => localizedCategory(category, locale));

export const stacksFor = (locale: Locale): LocalizedStack[] =>
  STACKS.map((stack) => localizedStack(stack, locale));

export const toolBySlug = (slug: string, locale: Locale): LocalizedTool | undefined => {
  const tool = TOOLS.find((t) => t.slug === slug);
  return tool ? localizedTool(tool, locale) : undefined;
};

export const categoryBySlug = (slug: string, locale: Locale): LocalizedCategory | undefined => {
  const category = CATEGORIES.find((c) => c.slug === slug);
  return category ? localizedCategory(category, locale) : undefined;
};

export const toolsInCategory = (slug: string, locale: Locale): LocalizedTool[] =>
  TOOLS.filter((t) => t.category === slug).map((tool) => localizedTool(tool, locale));

/** The reviewed date, written the way the reader's language writes dates. */
export function formatReviewed(iso: string, locale: Locale): string {
  return formatDate(iso, locale);
}
