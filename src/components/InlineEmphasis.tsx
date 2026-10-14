/**
 * レビュー欄の本文に混じる「**」の囲みを、太字にして出す。
 *
 * 編集画面から届く文には、強調したい語を `**` で囲んだ箇所がある。
 * 囲みの記号は画面に出さず、中の語だけを `<strong>` にする。
 * 囲みのない語はそのまま出す（記号が1つの文に何度出ても同じ）。
 *
 * 改行には触らない。呼び出し側の `whitespace-pre-line` がそのまま改行を出す
 * ため、文と文の間の改行はこの部品を通しても残る。
 * サーバー側で描画するだけで、状態も操作も持たない。
 */
export function InlineEmphasis({ text }: { text: string }) {
  // 奇数番目（0始まり）が「**」に挟まれた語になる。
  return (
    <>
      {text.split("**").map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-bold">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
