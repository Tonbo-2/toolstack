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
      ja: "メモ作成、タスク管理、社内Wiki、データベースなどの機能を一つにまとめたクラウド型のオールインワン・ワークスペース。\n情報や業務を1か所にまとめたいフリーランスや小規模チームの方。",
    },
    standout: {
      ja: "文書・データベース・AIでの下書きが同じ画面で使え、よくある用途のテンプレートも一通りそろっています。",
    },
    watchFor: {
      ja: "自由度が高いぶん、ルールを決めずに使うと情報が散らかりやすい点に注意が必要。\n決まった形式で管理したいチームは、運用ルールをあらかじめ決めておく必要がある。",
    },
    verdict: {
      ja: "まだ何を使うか決めていない小規模チームにとって、最初の1つとして最も無難です。何でも入るぶん、何を入れるかを決めてから使い始めてください。",
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
      ja: "さまざまなWebサービスやアプリをノーコードで連携させ、定型業務を自動化するクラウドツール（iPaaS）。\nプログラムを書かずに、普段使っているアプリ同士をつないで業務を自動化したい方。",
    },
    standout: {
      ja: "対応しているアプリの数がもっとも多く、あまり知られていない連携もたいてい用意されています。",
    },
    watchFor: {
      ja: "複雑な分岐や多段のワークフローになるほど、設計や管理が難しくなる。\n高度な自動化を行いたい場合は、ほかのiPaaSとの違いも確認しておきたいところ。",
    },
    verdict: {
      ja: "2〜5ステップの自動化をいくつか安定して動かしたいなら、ここから始めるのがおすすめです。ほかのツールが対応していないアプリまでつなげられるのがメリットです。",
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
      ja: "プログラミング知識がなくても、さまざまなアプリやWebサービスを視覚的に連携させ、複雑な業務フローを自動化できるノーコードの業務自動化プラットフォーム（iPaaS）。\n条件分岐を含む複雑な処理を、画面上で組み立てながら自動化したい方。",
    },
    standout: {
      ja: "複雑な条件分岐やデータの整形を、1つの画面に収めて組み立てられます。",
    },
    watchFor: {
      ja: "自由度が高く、複雑な処理まで組み立てられる一方、初めて使う人には操作や設定がやや複雑になる。\nシンプルな連携だけなら、より手軽なツールのほうが使いやすい場合がある。",
    },
    verdict: {
      ja: "長く育てていく自動化の置き場所としては、こちらのほうが向いています。Zapierの制限を避けるために連携を増やし始めたら、乗り換えどきです。",
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
      ja: "キーワードや指示をもとに、ブログ記事やSNS投稿などのマーケティングコンテンツをAIで生成できる、マーケティング特化型のAIプラットフォーム。\nブランドに合ったトーンや表現で、マーケティング向けの文章を効率よく作成したい方。",
    },
    standout: {
      ja: "複数の媒体で発信するチーム向けに、文章のトーン管理とキャンペーンの進行が組み込まれています。単発の質問に答えさせる使い方には向きません。",
    },
    watchFor: {
      ja: "マーケティング向けの機能が多いため、文章をたまに作成するだけでは機能を持て余す可能性がある。\nシンプルな文章作成なら、汎用AIツールとの機能や料金の違いも確認しておきたいところ。",
    },
    verdict: {
      ja: "書く人が複数いて、文章のトーンをそろえる必要があるなら、導入して損はありません。1人で運営しているなら、たいてい持て余します。",
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
      ja: "AIを活用して、SEOを意識したブログ記事やマーケティング文章、広告コピーなどを効率よく作成・最適化できるAIコンテンツ制作ツール。\nSEO向けの記事作成やコンテンツ制作を効率化したい方。",
    },
    standout: {
      ja: "記事の下書きと競合の調査が同じ場所にあり、構成を考える作業と書く作業を行き来せずに済みます。",
    },
    watchFor: {
      ja: "生成された文章は、内容の確認や手直しが必要になる場合がある。\nAIの下書きをそのまま使うのではなく、自分の視点や経験を加えるための材料として活用するとよい。",
    },
    verdict: {
      ja: "調査だけを担当する人を置けない小規模な記事運用には、ちょうどよい中間です。人の手直しと、無理のない公開ペースと組み合わせて使ってください。",
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
      ja: "検索上位の競合ページを分析し、SEOに必要な要素を確認しながら、コンテンツの作成・最適化を支援するAI搭載のSEOプラットフォーム。\n検索順位が伸び悩んでいる記事を分析し、改善につなげたい方。",
    },
    standout: {
      ja: "上位表示されているページと比べて、自分の原稿にどの言葉が足りないかを1語ずつ示してくれます。",
    },
    watchFor: {
      ja: "コンテンツスコアを意識しすぎると、キーワードや関連語を詰め込みすぎて文章が不自然になる場合がある。\n点数を上げることより、記事に不足している情報を確認するチェックリストとして使うとよい。",
    },
    verdict: {
      ja: "表示回数はあるのにクリックされていない既存ページに使うのが一番効きます。書き直す相手が実在するからです。新しいページにも使えますが、まず自分の主張を固めてからにしてください。",
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
      ja: "登録フォームやランディングページの作成、デジタル商品の販売などを通じて、クリエイターの情報発信と読者・顧客との関係づくりを支援するプラットフォーム。\nメールを中心に継続的な情報発信やファンとの関係づくりに取り組みたい個人や小規模チーム。",
    },
    standout: {
      ja: "登録直後のメール配信やタグ付けの設定が見やすく、全体がメール配信を中心に作られています。",
    },
    watchFor: {
      ja: "メールマーケティングを中心としたサービスのため、営業管理の機能は限定的。\n案件の進捗管理や営業レポートなど、CRM（顧客関係管理）としての機能を重視する場合は別のツールを検討する必要がある。",
    },
    verdict: {
      ja: "情報発信そのものが成果につながるなら、最もすっきりした選択です。毎週書くつもりのリスト向けで、一度だけの告知には要りません。",
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
      ja: "メール配信を中心に、ランディングページ作成やマーケティング自動化（MA）などを一つにまとめたオールインワン型のデジタルマーケティングプラットフォーム。\nメール配信から集客、見込み客へのフォローまでを1つのサービスでまとめたい小規模チーム。",
    },
    standout: {
      ja: "メール配信に特化したツールより扱う範囲が広く、キャンペーンに必要な機能が最初からそろっています。",
    },
    watchFor: {
      ja: "機能が豊富なぶん、設定や管理に手間がかかる。\nメール配信だけを目的とする場合は、機能を持て余す可能性がある。",
    },
    verdict: {
      ja: "メールだけでなく、ランディングページや導線まで作る予定ならこちらです。メール配信だけなら、機能の少ないツールのほうが運用は楽です。",
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
