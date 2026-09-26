<?php
/**
 * 画面に出す日本語の文言。テーマ内で唯一のコピー元。
 *
 * WordPress 側の文言を変えたいときは、この配列を書き換えるか、
 * 固定ページ（このサイトについて／開示／プライバシー）は管理画面から編集してください。
 *
 * 2026-09-26: Next.js 版（src/lib/dictionaries/ja.ts）と同じ改訂を反映しました。
 * 英語の言い回しをそのまま日本語にした文（「発リンク」「判定」など）を、
 * 日本の読者が一度で読める言い方に書き直しています。語の対応は次のとおり。
 *   - 発リンク（outbound link）→ 外部リンク / アフィリエイトリンク
 *   - 判定（verdict）→ 評価
 *
 * 2026-09-26 追補（1.3.11）: 残っていた「良い点」「良いところ」を「メリット」に
 * そろえました（フッターの紹介文・「このサイトについて」の本文2か所）。
 *
 * 2026-09-26 追補2（1.3.12）: 残っていた「強み」も「メリット」にそろえました
 * （ツール一覧のリード文・ツール個別ページの見出し・Zapier の評価文）。
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function sp_copy(): array {
	static $copy = null;
	if ( null !== $copy ) {
		return $copy;
	}

	$copy = array(
		'site'    => array(
			'name'        => 'StackProof',
			'blurb'       => '仕事で使うAIツールを、個人や小規模チームの目線で比較しています。文章作成、会議、業務の自動化、メールなどが対象です。メリット、デメリットを書いています。',
			'copyright'   => '© {year} {site}. ソフトウェアの比較・レビュー。',
			'fundingNote' => '一部のリンクはアフィリエイト広告です。評価を売ることはなく、その方針はどのページにも書いています。',
		),
		'nav'     => array(
			'tools'             => 'ツール',
			'stacks'            => '組み合わせ',
			'blog'              => 'ブログ',
			'about'             => 'このサイト',
			'directory'         => 'ツール一覧',
			'aboutMethodology'  => '運営方針と検証手法',
			'disclosure'        => 'アフィリエイト開示',
			'privacy'           => 'プライバシー',
		),
		'a11y'    => array(
			'homeAria'      => '{site} のトップページ',
			'mainNav'       => 'メインメニュー',
			'sectionsNav'   => 'セクション',
			'footerNav'     => 'フッター',
			'footerLegal'   => 'フッター（規約関連）',
			'skipToContent' => '本文へ',
		),
		'home'    => array(
			'eyebrow'        => 'ソフトウェアの比較・レビュー',
			'title'          => '仕事で使えるAIツールを比較・レビュー',
			'lead'           => '仕事で使うAIツールを、個人や小規模チームの目線で比較しています。文章作成、会議、業務の自動化、メールなどが対象です。メリット、デメリットを書き、情報を確認した日付を書いています。',
			'ctaPrimary'     => 'ツール一覧を見る',
			'heroNote'       => '各ツールの向いている業務と、導入・利用にかかるコストをまとめています。',
			'heroAlt'        => '朝の光が差し込む机の上。ノートPC、ノート、コーヒーカップが置かれている',
			'methodTitle'    => '評価の作り方',
			'method'         => array(
				array( 'title' => 'デメリットも書く', 'body' => 'メリットだけでなくデメリットも書いています。' ),
				array( 'title' => '掲載枠は売らない', 'body' => '有料の掲載枠や広告枠は販売しておらず、お金で掲載順位を変えることはありません。' ),
				array( 'title' => '情報を確認した日', 'body' => '各ツールのページに、情報を確認した日付を書いています。いつ時点の情報かわかります。' ),
				array( 'title' => 'アフィリエイト広告について', 'body' => '評価は、機能・料金・使いやすさなどの公開情報をもとに書いています。また、一部のリンクから申し込まれると、運営者に報酬が入ることがあります。' ),
			),
			'directoryTitle' => 'ツール一覧',
			'directoryLead'  => '{categories}カテゴリ・{tools}ツール。向いている業務と、導入・利用にかかるコストも書いています。',
			'seeAll'         => '{tools}件すべてを見る',
			'stacksTitle'    => 'ツールは組み合わせで考える',
			'stacksLead'     => 'ツールの良し悪しは、何と組み合わせるかで決まります。次の3つの組み合わせがあれば、個人や小規模チームの1週間の仕事はほぼこなせます。',
			'teardownsTitle' => '最近の運用レビュー',
			'emptyPosts'     => 'まだ公開されている記事はありません。',
		),
		'tools'   => array(
			'title'             => 'ツール一覧',
			'lead'              => '全{tools}件について、向いている人、メリット、導入・利用にかかるコストを書いています。検索はツール名・カテゴリ・「向いている人」の欄が対象なので、「ニュースレター」「顧客対応」のような言葉でも見つかります。',
			'disclosureBefore'  => '外部リンクから成果報酬を得ることがあります。掲載の有無や評価の内容は変わりません。',
			'disclosureLink'    => 'アフィリエイト開示',
			'disclosureAfter'   => 'をお読みください。',
		),
		'tool'    => array(
			'reviewSuffix'  => 'レビュー',
			'breadcrumb'    => 'ツール一覧',
			'reviewedLabel' => '{date} に確認',
			'visitLabel'    => '{name} を見る',
			'outboundNote'  => 'アフィリエイトリンクです。成果報酬が発生することがありますが、評価には影響しません。',
			'bestFor'       => '向いている人',
			'standout'      => 'メリット',
			'watchFor'      => '注意点',
			'runsBeside'    => '一緒に使うとよいツール',
			'otherTools'    => '{category}のほかのツール',
		),
		'explorer' => array(
			'searchLabel'      => 'ツールを検索',
			'searchPlaceholder' => 'ツール名や業務で検索。例: ニュースレター、顧客対応',
			'allTools'         => 'すべてのツール',
			'shownOne'         => '1件を表示',
			'shownMany'        => '{count}件を表示',
			'caption'          => '掲載中のツールと、それぞれが向いている業務',
			'columnTool'       => 'ツール',
			'columnCategory'   => 'カテゴリ',
			'columnBestFor'    => '向いている人',
			'columnWatchFor'   => '注意点',
			'empty'            => '見つかりませんでした。別の言葉で試すか、絞り込みを解除してください。一覧は毎月追加しています。',
		),
		'about'   => array(
			'title'           => 'このサイトについて',
			'lead'            => 'このサイトは文章だけで作っています。動画もポッドキャストも、個人ブランドもありません。これは意図した方針です。文章なら、検索でき、引用でき、あとから直せて、各社の公式ドキュメントと突き合わせて確かめられます。動画では、どれもできません。',
			'lead2'           => '専任の担当者を置かずに、自分でツールを選ぶ人に向けて書いています。ツール代を自分で払う個人、フリーランス、小規模チームです。扱うのは、文章作成・会議・業務自動化・メールなどのAIツール。メリットだけでなく、デメリットや導入・利用にかかるコストも書いています。',
			'rulesTitle'      => '評価の書き方',
			'rules'           => array(
				array( 'title' => '業務があるから載る', 'body' => 'どのツールも、実際にある業務のために載せています。下書き、順位の確認、自動化、顧客対応、メール、音声。ベンダーに頼まれて載るツールはありません。' ),
				array( 'title' => 'デメリットを先に書く', 'body' => '誰が使うべきでないかを書けない記事は、未完成とみなします。メリットだけ並べたレビューは、手間をかけた広告でしかありません。' ),
				array( 'title' => 'ベンダーの文章は使わない', 'body' => '内容は、各社の公式ドキュメントと、実際に使ってみた結果から書きます。宣伝文句をそのまま評価として載せることはしません。' ),
				array( 'title' => '情報を確認した日', 'body' => 'ツールは記事を書いたあとも変わっていきます。各ページの日付が、どこまでの情報かを判断する目安になります。古いものから順に確認し直しています。' ),
			),
			'fundingTitle'    => '運営費の出どころ',
			'funding'         => '一部の外部リンクはアフィリエイトリンクです。そこから申し込むと、各社から当サイトに成果報酬が支払われることがあります。読者が支払う金額は変わりません。お金で掲載や評価を買うことはできず、公開前に各社が記事を確認することもありません。',
			'fundingLink'     => '開示の全文を読む',
			'correctionsTitle' => '訂正と質問',
			'correctionsBody' => 'ツールは、どんな記事よりも速く変わります。内容が古くなっている場合や、一覧にないツールがある場合は、お知らせください。確認します。',
			'correctionsBody2' => 'お金を受け取ってツールを追加することはありません。追加の提案も、ほかのツールと同じ基準で判断します。この一覧が扱う業務に本当に必要かどうか、です。',
			'formCta'         => '送信',
			'formSuccess'     => 'ありがとうございます。確認します。',
		),
		'disclosure' => array(
			'title'            => 'アフィリエイト開示',
			'date'             => '最終確認: 2026年9月',
			'shortTitle'       => '概要',
			'shortBody'        => 'このサイトの一部の外部リンクはアフィリエイトリンクです。そこから申し込むと、各社が当サイトに成果報酬を支払うことがあります。読者が支払う金額は変わりません。',
			'unchangedTitle'   => '成果報酬で変わらないこと',
			'unchangedItems'   => array(
				'ツールが掲載されるかどうか。',
				'一覧の中での掲載位置。',
				'記事の内容。避けたほうがいい理由も含みます。',
				'アフィリエイトプログラムがないツールを紹介するかどうか。',
			),
			'unchangedOutro'   => '公開前に各社が記事を確認することはなく、掲載枠を買うこともできません。',
			'spotTitle'        => 'アフィリエイトリンクの見分け方',
			'spotBefore'       => '各社への外部リンクは、すべてこのサイトを経由します。形式は ',
			'spotCode'         => '/go/tool-name',
			'spotAfter'        => ' です。クリック数と参照元を記録するためです。成果報酬のないリンクも、同じ経路と同じ見た目です。この仕組みは計測のためのもので、報酬の有無とは関係ありません。',
			'notDoTitle'       => 'このサイトがしないこと',
			'notDoItems'       => array(
				'ベンダーが書いたレビューを自社の記事として公開すること。',
				'掲載枠、順位、書き換えた評価を売ること。',
				'有料のまとめ記事、スポンサー一覧、タイアップ記事を作ること。',
			),
			'questionsTitle'   => 'お問い合わせ',
			'questionsBefore'  => 'ご質問は',
			'questionsLink'    => 'お問い合わせフォーム',
			'questionsMid'     => 'からどうぞ。',
			'questionsPrivacyLink' => 'プライバシーポリシー',
			'questionsAfter'   => 'では、収集するデータを説明しています。',
		),
		'privacy' => array(
			'title'          => 'プライバシーポリシー',
			'date'           => '最終確認: 2026年9月',
			'collectedTitle' => '収集する情報',
			'collectedItems' => array(
				array( 'lead' => 'お問い合わせ。', 'body' => ' フォームをご利用の場合、ご入力の名前・メールアドレス・本文を、ご返信のために保存します。' ),
				array( 'lead' => 'アクセス統計。', 'body' => ' 訪問数、閲覧ページ、参照元、外部リンクのクリック数を、当サイト独自の計測で集計しています。広告用の追跡ではなく、ほかのサイトをまたいで個人を特定することはありません。' ),
			),
			'notDoneTitle'   => 'しないこと',
			'notDoneItems'   => array(
				'アドレスやメッセージを販売・貸与したり、各社に渡したりしません。',
				'当サイトの閲覧にアカウントは不要です。',
				'閲覧の履歴から個人を特定しません。',
			),
			'outboundTitle'  => '外部リンク',
			'outboundBody'   => 'ツールのリンクをクリックすると、そのツールのサイトに移動します。移動先では各社のプライバシーポリシーが適用されます。クリックは移動前に当サイトで記録しますが、参照元以外の情報を各社に渡すことはありません。',
			'removalTitle'   => '削除とお問い合わせ',
			'removalBefore'  => 'お送りいただいたアドレスやメッセージの削除、保存内容の確認は、',
			'removalLink'    => 'お問い合わせフォーム',
			'removalAfter'   => 'からご依頼ください。手作業で対応します。',
			'changesTitle'   => '変更',
			'changesBody'    => 'このページを変更したときは、上部の日付も更新します。',
		),
		'blog'    => array(
			'title'         => '運用レビュー',
			'lead'          => '実際の仕事でツールの組み合わせを使った記録です。何を変え、何をやめ、乗り換えてどうだったかを書いています。',
			'emptyTitle'    => '最初の記事を準備しています',
			'emptyBody'     => 'まだ公開されている記事はありません。その間も、ツール一覧は公開しています。',
			'openDirectory' => '一覧を開く',
			'searchTitle'   => '検索結果',
		),
		'notFound' => array(
			'title' => 'ページが見つかりません',
			'body'  => 'お探しのページは存在しないか、移動した可能性があります。',
			'cta'   => '{site} のトップへ',
		),
		'form'    => array(
			'invalidEmail'      => 'メールアドレスの形式が正しくありません。',
			'name'              => 'お名前',
			'namePlaceholder'   => 'お名前',
			'email'             => 'メールアドレス',
			'emailPlaceholder'  => 'you@example.com',
			'message'           => 'ご質問・ご指摘',
			'messagePlaceholder' => '誤りのご指摘、取り上げてほしいツール、ご質問など。',
			'sending'           => '送信中',
			'error'             => '送信できませんでした。入力内容を確認して、もう一度お試しください。',
			'messageTooShort'   => '本文をもう少し具体的にご記入ください。',
		),
	);

	return $copy;
}

/**
 * ドット区切りで文言を取る: sp_t( 'home.title' )。見つからない場合は空文字。
 */
function sp_t( string $path, array $replaces = array() ): string {
	$value = sp_copy();
	foreach ( explode( '.', $path ) as $key ) {
		if ( ! is_array( $value ) || ! array_key_exists( $key, $value ) ) {
			return '';
		}
		$value = $value[ $key ];
	}
	if ( ! is_string( $value ) ) {
		return '';
	}
	foreach ( $replaces as $search => $replace ) {
		$value = str_replace( '{' . $search . '}', (string) $replace, $value );
	}
	return $value;
}

/** 配列（リスト・繰り返しブロック）を取る: sp_copy_path( 'home.method' ) */
function sp_copy_path( string $path ): array {
	$value = sp_copy();
	foreach ( explode( '.', $path ) as $key ) {
		if ( ! is_array( $value ) || ! array_key_exists( $key, $value ) ) {
			return array();
		}
		$value = $value[ $key ];
	}
	return is_array( $value ) ? $value : array();
}
