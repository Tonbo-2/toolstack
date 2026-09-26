import { permanentRedirect } from "next/navigation";

/**
 * 廃止したページ（ワークフロー・チートシート）の受け皿。
 *
 * 2026-09-26、オーナーの指定でチートシートを廃止しました（ページ本体・トップページの
 * 案内・メール登録）。この環境ではファイルを削除できないため、ルートだけを残し、
 * 中身の代わりにツール一覧へ308で送ります。昔のリンクや検索結果から来た人が
 * 行き止まりにならないようにするためです。サイト内のどこからも、もうリンクしていません。
 */
export default function RetiredCheatSheet() {
  permanentRedirect("/tools");
}
