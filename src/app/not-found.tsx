/**
 * Root-level 404, for URLs that never enter the locale tree (a missing asset, an
 * unmatched API path). Page 404s are handled inside the locale layout, where the
 * header and footer are known.
 *
 * Renders its own document because it sits above the locale layout. Safe to
 * delete once the repository can be edited outside this session.
 */
export default function RootNotFound() {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>ページが見つかりません</h1>
        <p style={{ marginTop: "0.75rem" }}>
          <a href="/">StackProof のトップへ戻る</a>
        </p>
      </body>
    </html>
  );
}
