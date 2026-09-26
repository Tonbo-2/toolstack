import { permanentRedirect } from "next/navigation";

/**
 * 廃止した旧ルート（プロキシの内部rewriteがあるため、通常はここへ到達しません）。
 * 到達した場合も行き止まりにしないよう、ツール一覧へ送ります。
 */
export default function LegacyCheatSheet() {
  permanentRedirect("/tools");
}
