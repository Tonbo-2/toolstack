<?php
/**
 * サイトの中身（ブランド資産・カテゴリ・ツール10件・スタック3種・チートシート）。
 *
 * ここはテーマ有効化時に WordPress へ流し込む「初期データ」です。
 * 有効化後は管理画面（ツール / 固定ページ）で自由に編集できます。
 * 数値（価格・評価・利用者数）は書いていません。確認できた事実だけを載せています。
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** ブランド資産（ロゴ・アイコン・写真）。ロゴはカスタマイザーで差し替え可。 */
function sp_brand(): array {
	return array(
		'name'      => 'StackProof',
		'logo'      => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/33719bfe29afd94a.webp',
		'icon'      => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3ad674281244d5ab.webp',
		'heroImage' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/d974269c75eee95b.webp',
		'deskImage' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9f1cb80e5d602e02.webp',
	);
}

/**
 * 推奨のサイトタイトル（WordPress の「設定 → 一般 → サイトのタイトル」）。
 *
 * 有効化後の初回点検でこの文字列に一度だけ合わせます（inc/health.php の
 * sp_apply_site_title()）。そのあと管理画面で変えたタイトルは上書きしません。
 */
function sp_site_title(): string {
	return 'AI・SaaSツール比較ガイド｜ToolStack';
}

/** カテゴリ（スラッグ → ラベル・説明）。 */
function sp_categories(): array {
	return array(
		'workspace'      => array( 'label' => 'ワークスペースとドキュメント', 'blurb' => '作業の内容を書き留めて、ひとまとめに置いておく場所。' ),
		'automation'     => array( 'label' => '自動化', 'blurb' => 'すでに使っているツールの間で、データを自動で行き来させる。' ),
		'writing-seo'    => array( 'label' => '文章作成とSEO', 'blurb' => '文章をまとめて書き、検索で上位の記事と比べて確かめる。' ),
		'email'          => array( 'label' => 'メールとニュースレター', 'blurb' => '登録者に直接届けられる、自分で持てる連絡手段。' ),
		'audio-meetings' => array( 'label' => '音声と会議', 'blurb' => '音声、文字起こし、通話のあとに残る記録。' ),
	);
}

/** ツール10件。'logo' が空のものは名前だけで表示します。 */
function sp_tools(): array {
	return array(
		array(
			'slug' => 'notion', 'name' => 'Notion', 'category' => 'workspace',
			'url' => 'https://www.notion.so',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/5640c98062d12b62.png',
			'best_for' => '顧客のメモ、資料、簡単なデータベースを1か所にまとめたいフリーランスや小規模チーム。',
			'standout' => '文書・データベース・AIでの下書きが同じ画面で使え、よくある用途のテンプレートも一通りそろっています。',
			'watch_for' => '何にでも使えるぶん、とりあえずの置き場になりがちです。決まった型で管理したいチームは、自由度の高さと戦うことになります。',
			'verdict' => 'まだ何を使うか決めていない小規模チームにとって、最初の1つとして最も無難です。何でも入るぶん、何を入れるかを決めてから使い始めてください。',
			'pairs_with' => 'zapier, otter-ai', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'zapier', 'name' => 'Zapier', 'category' => 'automation',
			'url' => 'https://zapier.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/23ae37879fbb05be.png',
			'best_for' => 'プログラムを書かずに、いつも使っているアプリ同士をつなぎたいチーム。',
			'standout' => '対応しているアプリの数がもっとも多く、あまり知られていない連携もたいてい用意されています。',
			'watch_for' => '長い多段のフローは重くなります。複雑な分岐を回すチームは、結局ほかのツールで作り直すことが多いです。',
			'verdict' => '2〜5ステップの自動化をいくつか安定して動かしたいなら、ここから始めるのがおすすめです。ほかのツールが対応していないアプリまでつなげられるのが強みです。',
			'pairs_with' => 'notion, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'make', 'name' => 'Make', 'category' => 'automation',
			'url' => 'https://www.make.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3c847799933a657d.jpg',
			'best_for' => '条件で分かれる複雑な処理を、図を見ながら組み立てたいチーム。',
			'standout' => '複雑な条件分岐やデータの整形を、1つの画面に収めて組み立てられます。',
			'watch_for' => '画面の操作に慣れるまで時間がかかります。最初の1時間は、Zapierで2ステップの連携を組むより遅いと感じるはずです。',
			'verdict' => '長く育てていく自動化の置き場所としては、こちらのほうが向いています。Zapierの制限を避けるために連携を増やし始めたら、乗り換えどきです。',
			'pairs_with' => 'zapier, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'jasper', 'name' => 'Jasper', 'category' => 'writing-seo',
			'url' => 'https://www.jasper.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3348b05b9e8b740e.png',
			'best_for' => 'ブランドの言葉づかいをそろえた下書きを、まとまった量で必要とするマーケティングチーム。',
			'standout' => '複数の媒体で発信するチーム向けに、文章のトーン管理とキャンペーンの進行が組み込まれています。単発の質問に答えさせる使い方には向きません。',
			'watch_for' => 'たまに書くだけなら、機能が多すぎます。汎用のAIアシスタントでほとんど足り、設定の手間もかかりません。',
			'verdict' => '書く人が複数いて、文章のトーンをそろえる必要があるなら、導入して損はありません。1人で運営しているなら、たいてい持て余します。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'writesonic', 'name' => 'Writesonic', 'category' => 'writing-seo',
			'url' => 'https://writesonic.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/85aa54a0adf0098f.png',
			'best_for' => '記事の下書きとキーワード調べを、同じ画面で済ませたいブログ中心のチーム。',
			'standout' => '記事の下書きと競合の調査が同じ場所にあり、構成を考える作業と書く作業を行き来せずに済みます。',
			'watch_for' => '出てきた文章には、人の手直しが要ります。どの下書きも、自分の視点を足す前の材料だと考えてください。',
			'verdict' => '調査だけを担当する人を置けない小規模な記事運用には、ちょうどよい中間です。人の手直しと、無理のない公開ペースと組み合わせて使ってください。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'surfer-seo', 'name' => 'Surfer SEO', 'category' => 'writing-seo',
			'url' => 'https://surferseo.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/332cd34458cf503a.png',
			'best_for' => '検索で上位に来るはずなのに伸びていないページを見直したいコンテンツチーム。',
			'standout' => '上位表示されているページと比べて、自分の原稿にどの言葉が足りないかを1語ずつ示してくれます。',
			'watch_for' => '点数を上げようとすると、同じことを繰り返す文章になりがちです。目標ではなく、抜けがないかを確かめるチェックリストとして使ってください。',
			'verdict' => '表示回数はあるのにクリックされていない既存ページに使うのが一番効きます。書き直す相手が実在するからです。新しいページにも使えますが、まず自分の主張を固めてからにしてください。',
			'pairs_with' => 'writesonic, jasper', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'kit', 'name' => 'Kit', 'category' => 'email',
			'url' => 'https://kit.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/53257fe889d1112a.png',
			'best_for' => 'ニュースレターを中心に発信しているクリエイターや小規模チーム。',
			'standout' => '登録直後のメール配信やタグ付けの設定が見やすく、全体がメール配信を中心に作られています。',
			'watch_for' => 'メールに絞っているぶん、できることは限られます。顧客管理や商談の進捗、営業レポートの機能はありません。',
			'verdict' => 'ニュースレターそのものが成果につながるなら、最もすっきりした選択です。毎週書くつもりのリスト向けで、一度だけの告知には要りません。',
			'pairs_with' => 'surfer-seo, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'getresponse', 'name' => 'GetResponse', 'category' => 'email',
			'url' => 'https://www.getresponse.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/6e3d791f0876b07e.jpg',
			'best_for' => 'メール配信、ランディングページ、簡単な導線づくりを1つのアカウントでまとめたい小規模チーム。',
			'standout' => 'メール配信に特化したツールより扱う範囲が広く、キャンペーンに必要な機能が最初からそろっています。',
			'watch_for' => '範囲が広いぶん、設定する項目も増えます。配信とタグ付けだけなら、機能の半分は使わないままになります。',
			'verdict' => 'メールだけでなく、ランディングページや導線まで作る予定ならこちらです。メール配信だけなら、機能の少ないツールのほうが運用は楽です。',
			'pairs_with' => 'writesonic, zapier', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'elevenlabs', 'name' => 'ElevenLabs', 'category' => 'audio-meetings',
			'url' => 'https://elevenlabs.io',
			'logo' => '',
			'best_for' => 'ナレーションや音声ガイドなど、書いたものを音声でも用意したいチーム。',
			'standout' => 'そのまま公開できる声の質で、複数の言語に対応しています。',
			'watch_for' => '声を複製する機能は、本人の同意と明確な表示が前提です。権利のはっきりしない音声には使わないでください。',
			'verdict' => '書いた記事を音声でも届けたいなら、この一覧でもっとも有力な選択です。最初の音声を公開する前に、AIの音声であることをどう伝えるかを決めてください。',
			'pairs_with' => 'writesonic, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'otter-ai', 'name' => 'Otter.ai', 'category' => 'audio-meetings',
			'url' => 'https://otter.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9b8a90ec8dc37495.png',
			'best_for' => '議事録を担当する人を置かずに、通話の内容をあとから検索したいリモートチーム。',
			'standout' => '会議に参加して文字起こしをし、数週間後でも探せる要約を作ります。',
			'watch_for' => '顧客と共有する前に、人名や数字は必ず確認して直してください。',
			'verdict' => '同じ種類の通話を繰り返す人に一番効きます。営業、ヒアリング、顧客との定例などです。要約は、そのまま信じずに読んでください。',
			'pairs_with' => 'notion, zapier', 'reviewed' => '2026-09-20',
		),
	);
}

/** スタック3種（ツールの組み合わせ）。 */
function sp_stacks(): array {
	return array(
		array(
			'slug' => 'solo-consultant',
			'name' => '個人コンサルタントの構成',
			'for_who' => '顧客対応、通話、小さなメールリストを1人で回している人。',
			'why' => '顧客の資料と通話の記録が1か所にまとまり、専任の担当者を置かずにニュースレターを続けられます。',
			'tools' => array( 'notion', 'otter-ai', 'kit' ),
		),
		array(
			'slug' => 'content-led-startup',
			'name' => 'コンテンツ起点のスタートアップ構成',
			'for_who' => '公開した記事きっかけで商談が始まる小規模チーム。',
			'why' => '下書き、順位の確認、メールリストが1つの流れになり、人を増やさずに毎週続けられます。',
			'tools' => array( 'writesonic', 'surfer-seo', 'kit' ),
		),
		array(
			'slug' => 'lean-operations',
			'name' => '省力運用の構成',
			'for_who' => 'すでに使っているツールを、つなぐ担当者がいないチーム。',
			'why' => '決まった作業は簡単な連携で片づけ、条件で分かれる処理は1つの画面で扱い、資料は全員が見つけられる場所に置きます。',
			'tools' => array( 'zapier', 'make', 'notion' ),
		),
	);
}

/** チートシートの7行（業務 / 使うツール / 避けるべき場面）。 */
function sp_cheat_rows(): array {
	return array(
		array( 'job' => '顧客業務とドキュメント', 'picks' => array( 'notion' ), 'skip' => 'チームに決まった型が必要なら、Notionは向きません。自由度の高いツールを無理に縛るより、最初から型が決まっているツールを選んだほうが楽です。' ),
		array( 'job' => '文章作成と下書き', 'picks' => array( 'writesonic', 'jasper' ), 'skip' => '書くのが1人だけで、頻度も低いなら、有料プランは要りません。汎用のAIアシスタントで十分です。' ),
		array( 'job' => '検索順位の確認', 'picks' => array( 'surfer-seo' ), 'skip' => 'まだ誰も見ていないページには不要です。網羅率を追う前に、記事の中身を直してください。' ),
		array( 'job' => '自動化', 'picks' => array( 'zapier', 'make' ), 'skip' => '簡単な自動化で足りているうちは、キャンバス型は要りません。分岐が複雑になってから移せば十分です。' ),
		array( 'job' => 'メールとニュースレター', 'picks' => array( 'kit', 'getresponse' ), 'skip' => '毎週配信するリストになるまでは、ファネル機能つきのツールは要りません。' ),
		array( 'job' => '顧客との通話と記録', 'picks' => array( 'otter-ai' ), 'skip' => '録音するのは、通話に出ている全員が同意した場合だけにしてください。' ),
		array( 'job' => '音声とナレーション', 'picks' => array( 'elevenlabs' ), 'skip' => '声を複製するのは、書面での同意ルールを決めてからにしてください。' ),
	);
}

/** ホームに並べる注目ツール（一覧の抜粋）。 */
function sp_featured_slugs(): array {
	return array( 'notion', 'zapier', 'writesonic', 'kit', 'elevenlabs', 'otter-ai' );
}
