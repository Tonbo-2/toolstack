/**
 * The reviewed tool directory — the single source for /tools, /tools/[slug],
 * the home page matrix and the cheat sheet.
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
 * - Every reader-facing string is Japanese (`{ ja }`) — product names stay as the
 *   vendor writes them, in Latin script, and are never translated.
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
  /** Vendor homepage — used by /go/[slug] when no affiliate link is set yet. */
  url: string;
  /** Hosted vendor mark (favicon-grade, never recolored or re-composed). */
  logo: string;
  category: CategorySlug;
  /** Who it suits, plainly. */
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
    label: { ja: "メールとニュースレター" },
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
    url: "https://www.notion.so",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/5640c98062d12b62.png",
    category: "workspace",
    bestFor: {
      ja: "顧客のメモ、資料、簡単なデータベースを1か所にまとめたいフリーランスや小規模チーム。",
    },
    standout: {
      ja: "文書・データベース・AIでの下書きが同じ画面で使え、よくある用途のテンプレートも一通りそろっています。",
    },
    watchFor: {
      ja: "何にでも使えるぶん、とりあえずの置き場になりがちです。決まった型で管理したいチームは、自由度の高さと戦うことになります。",
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
    url: "https://zapier.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/23ae37879fbb05be.png",
    category: "automation",
    bestFor: {
      ja: "プログラムを書かずに、いつも使っているアプリ同士をつなぎたいチーム。",
    },
    standout: {
      ja: "対応しているアプリの数がもっとも多く、あまり知られていない連携もたいてい用意されています。",
    },
    watchFor: {
      ja: "長い多段のフローは重くなります。複雑な分岐を回すチームは、結局ほかのツールで作り直すことが多いです。",
    },
    verdict: {
      ja: "2〜5ステップの自動化をいくつか安定して動かしたいなら、ここから始めるのがおすすめです。ほかのツールが対応していないアプリまでつなげられるのが強みです。",
    },
    pairsWith: ["notion", "kit"],
    reviewed: "2026-09-20",
  },
  {
    slug: "make",
    name: "Make",
    url: "https://www.make.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3c847799933a657d.jpg",
    category: "automation",
    bestFor: {
      ja: "条件で分かれる複雑な処理を、図を見ながら組み立てたいチーム。",
    },
    standout: {
      ja: "複雑な条件分岐やデータの整形を、1つの画面に収めて組み立てられます。",
    },
    watchFor: {
      ja: "画面の操作に慣れるまで時間がかかります。最初の1時間は、Zapierで2ステップの連携を組むより遅いと感じるはずです。",
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
    url: "https://www.jasper.ai",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3348b05b9e8b740e.png",
    category: "writing-seo",
    bestFor: {
      ja: "ブランドの言葉づかいをそろえた下書きを、まとまった量で必要とするマーケティングチーム。",
    },
    standout: {
      ja: "複数の媒体で発信するチーム向けに、文章のトーン管理とキャンペーンの進行が組み込まれています。単発の質問に答えさせる使い方には向きません。",
    },
    watchFor: {
      ja: "たまに書くだけなら、機能が多すぎます。汎用のAIアシスタントでほとんど足り、設定の手間もかかりません。",
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
    url: "https://writesonic.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/85aa54a0adf0098f.png",
    category: "writing-seo",
    bestFor: {
      ja: "記事の下書きとキーワード調べを、同じ画面で済ませたいブログ中心のチーム。",
    },
    standout: {
      ja: "記事の下書きと競合の調査が同じ場所にあり、構成を考える作業と書く作業を行き来せずに済みます。",
    },
    watchFor: {
      ja: "出てきた文章には、人の手直しが要ります。どの下書きも、自分の視点を足す前の材料だと考えてください。",
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
    url: "https://surferseo.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/332cd34458cf503a.png",
    category: "writing-seo",
    bestFor: {
      ja: "検索で上位に来るはずなのに伸びていないページを見直したいコンテンツチーム。",
    },
    standout: {
      ja: "上位表示されているページと比べて、自分の原稿にどの言葉が足りないかを1語ずつ示してくれます。",
    },
    watchFor: {
      ja: "点数を上げようとすると、同じことを繰り返す文章になりがちです。目標ではなく、抜けがないかを確かめるチェックリストとして使ってください。",
    },
    verdict: {
      ja: "表示回数はあるのにクリックされていない既存ページに使うのが一番効きます。書き直す相手が実在するからです。新しいページにも使えますが、まず自分の主張を固めてからにしてください。",
    },
    pairsWith: ["writesonic", "jasper"],
    reviewed: "2026-09-20",
  },
  {
    slug: "kit",
    name: "Kit",
    url: "https://kit.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/53257fe889d1112a.png",
    category: "email",
    bestFor: {
      ja: "ニュースレターを中心に発信しているクリエイターや小規模チーム。",
    },
    standout: {
      ja: "登録直後のメール配信やタグ付けの設定が見やすく、全体がメール配信を中心に作られています。",
    },
    watchFor: {
      ja: "メールに絞っているぶん、できることは限られます。顧客管理や商談の進捗、営業レポートの機能はありません。",
    },
    verdict: {
      ja: "ニュースレターそのものが成果につながるなら、最もすっきりした選択です。毎週書くつもりのリスト向けで、一度だけの告知には要りません。",
    },
    pairsWith: ["surfer-seo", "notion"],
    reviewed: "2026-09-20",
  },
  {
    slug: "getresponse",
    name: "GetResponse",
    url: "https://www.getresponse.com",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/6e3d791f0876b07e.jpg",
    category: "email",
    bestFor: {
      ja: "メール配信、ランディングページ、簡単な導線づくりを1つのアカウントでまとめたい小規模チーム。",
    },
    standout: {
      ja: "メール配信に特化したツールより扱う範囲が広く、キャンペーンに必要な機能が最初からそろっています。",
    },
    watchFor: {
      ja: "範囲が広いぶん、設定する項目も増えます。配信とタグ付けだけなら、機能の半分は使わないままになります。",
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
    url: "https://elevenlabs.io",
    // No verified mark could be hosted for this entry — the name stands alone.
    logo: "",
    category: "audio-meetings",
    bestFor: {
      ja: "ナレーションや音声ガイドなど、書いたものを音声でも用意したいチーム。",
    },
    standout: {
      ja: "そのまま公開できる声の質で、複数の言語に対応しています。",
    },
    watchFor: {
      ja: "声を複製する機能は、本人の同意と明確な表示が前提です。権利のはっきりしない音声には使わないでください。",
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
    url: "https://otter.ai",
    logo: "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9b8a90ec8dc37495.png",
    category: "audio-meetings",
    bestFor: {
      ja: "議事録を担当する人を置かずに、通話の内容をあとから検索したいリモートチーム。",
    },
    standout: {
      ja: "会議に参加して文字起こしをし、数週間後でも探せる要約を作ります。",
    },
    watchFor: {
      ja: "顧客と共有する前に、人名や数字は必ず確認して直してください。",
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
    name: { ja: "個人コンサルタントの構成" },
    forWho: {
      ja: "顧客対応、通話、小さなメールリストを1人で回している人。",
    },
    why: {
      ja: "顧客の資料と通話の記録が1か所にまとまり、専任の担当者を置かずにニュースレターを続けられます。",
    },
    toolSlugs: ["notion", "otter-ai", "kit"],
  },
  {
    slug: "content-led-startup",
    name: { ja: "コンテンツ起点のスタートアップ構成" },
    forWho: {
      ja: "公開した記事きっかけで商談が始まる小規模チーム。",
    },
    why: {
      ja: "下書き、順位の確認、メールリストが1つの流れになり、人を増やさずに毎週続けられます。",
    },
    toolSlugs: ["writesonic", "surfer-seo", "kit"],
  },
  {
    slug: "lean-operations",
    name: { ja: "省力運用の構成" },
    forWho: {
      ja: "すでに使っているツールを、つなぐ担当者がいないチーム。",
    },
    why: {
      ja: "決まった作業は簡単な連携で片づけ、条件で分かれる処理は1つの画面で扱い、資料は全員が見つけられる場所に置きます。",
    },
    toolSlugs: ["zapier", "make", "notion"],
  },
];

/** Resolve one tool's reader-facing strings for a locale. */
export function localizedTool(tool: Tool, locale: Locale): LocalizedTool {
  return {
    slug: tool.slug,
    name: tool.name,
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
