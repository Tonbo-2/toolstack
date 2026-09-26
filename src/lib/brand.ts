/**
 * Brand assets + one-line identity for StackProof.
 *
 * Asset URLs are returned by the asset pipeline (generate_image) and must be
 * embedded verbatim. Keep every reference to the logo, icon and photography
 * here so a later change is one edit, not a search across pages.
 */
export const BRAND = {
  name: "StackProof",
  tagline: "仕事で使えるAIツールの比較・レビュー",
  blurb:
    "仕事で使うAIツールを、個人や小規模チームの目線で比較しています。文章作成、会議、業務の自動化、メールなどが対象です。メリットもデメリットも同じように書き、情報を確認した日付を添えています。",
  /** 3:1 wordmark (navy on transparent) — header and footer. */
  logoUrl:
    "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/33719bfe29afd94a.webp",
  logoWidth: 1333,
  logoHeight: 221,
  /** 1:1 square icon — favicon + JSON-LD logo. */
  iconUrl:
    "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3ad674281244d5ab.webp",
  /** 16:9 hero (2K). */
  heroImage:
    "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/d974269c75eee95b.webp",
  /**
   * 3:2 supporting photo (notebook + comparison grid). トップページの
   * 「このサイトにないもの」を外したため、いまは未使用（2026-09-26）。
   */
  deskImage:
    "https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9f1cb80e5d602e02.webp",
} as const;
