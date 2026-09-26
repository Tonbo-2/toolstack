<?php
/**
 * サイトの中身（ブランド資産・カテゴリ・ツール10件・スタック3種）。
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
		// トップの「このサイトにないもの」を外したため、いまは未使用（2026-09-26）。
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
		'email'          => array( 'label' => 'メールと情報発信', 'blurb' => '登録者に直接届けられる、自分で持てる連絡手段。' ),
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
			'best_for' => 'メモ作成、タスク管理、社内Wiki、データベースなどの機能を一つにまとめたクラウド型のオールインワン・ワークスペース。
情報や業務を1か所にまとめたいフリーランスや小規模チームの方。',
			'standout' => '文書・データベース・AIでの下書きが同じ画面で使え、よくある用途のテンプレートも一通りそろっています。',
			'watch_for' => '自由度が高いぶん、ルールを決めずに使うと情報が散らかりやすい点に注意が必要。
決まった形式で管理したいチームは、運用ルールをあらかじめ決めておく必要がある。',
			'verdict' => 'まだ何を使うか決めていない小規模チームにとって、最初の1つとして最も無難です。何でも入るぶん、何を入れるかを決めてから使い始めてください。',
			'pairs_with' => 'zapier, otter-ai', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'zapier', 'name' => 'Zapier', 'category' => 'automation',
			'url' => 'https://zapier.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/23ae37879fbb05be.png',
			'best_for' => 'さまざまなWebサービスやアプリをノーコードで連携させ、定型業務を自動化するクラウドツール（iPaaS）。
プログラムを書かずに、普段使っているアプリ同士をつないで業務を自動化したい方。',
			'standout' => '対応しているアプリの数がもっとも多く、あまり知られていない連携もたいてい用意されています。',
			'watch_for' => '複雑な分岐や多段のワークフローになるほど、設計や管理が難しくなる。
高度な自動化を行いたい場合は、ほかのiPaaSとの違いも確認しておきたいところ。',
			'verdict' => '2〜5ステップの自動化をいくつか安定して動かしたいなら、ここから始めるのがおすすめです。ほかのツールが対応していないアプリまでつなげられるのがメリットです。',
			'pairs_with' => 'notion, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'make', 'name' => 'Make', 'category' => 'automation',
			'url' => 'https://www.make.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3c847799933a657d.jpg',
			'best_for' => 'プログラミング知識がなくても、さまざまなアプリやWebサービスを視覚的に連携させ、複雑な業務フローを自動化できるノーコードの業務自動化プラットフォーム（iPaaS）。
条件分岐を含む複雑な処理を、画面上で組み立てながら自動化したい方。',
			'standout' => '複雑な条件分岐やデータの整形を、1つの画面に収めて組み立てられます。',
			'watch_for' => '自由度が高く、複雑な処理まで組み立てられる一方、初めて使う人には操作や設定がやや複雑になる。
シンプルな連携だけなら、より手軽なツールのほうが使いやすい場合がある。',
			'verdict' => '長く育てていく自動化の置き場所としては、こちらのほうが向いています。Zapierの制限を避けるために連携を増やし始めたら、乗り換えどきです。',
			'pairs_with' => 'zapier, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'jasper', 'name' => 'Jasper', 'category' => 'writing-seo',
			'url' => 'https://www.jasper.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3348b05b9e8b740e.png',
			'best_for' => 'キーワードや指示をもとに、ブログ記事やSNS投稿などのマーケティングコンテンツをAIで生成できる、マーケティング特化型のAIプラットフォーム。
ブランドに合ったトーンや表現で、マーケティング向けの文章を効率よく作成したい方。',
			'standout' => '複数の媒体で発信するチーム向けに、文章のトーン管理とキャンペーンの進行が組み込まれています。単発の質問に答えさせる使い方には向きません。',
			'watch_for' => 'マーケティング向けの機能が多いため、文章をたまに作成するだけでは機能を持て余す可能性がある。
シンプルな文章作成なら、汎用AIツールとの機能や料金の違いも確認しておきたいところ。',
			'verdict' => '書く人が複数いて、文章のトーンをそろえる必要があるなら、導入して損はありません。1人で運営しているなら、たいてい持て余します。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'writesonic', 'name' => 'Writesonic', 'category' => 'writing-seo',
			'url' => 'https://writesonic.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/85aa54a0adf0098f.png',
			'best_for' => 'AIを活用して、SEOを意識したブログ記事やマーケティング文章、広告コピーなどを効率よく作成・最適化できるAIコンテンツ制作ツール。
SEO向けの記事作成やコンテンツ制作を効率化したい方。',
			'standout' => '記事の下書きと競合の調査が同じ場所にあり、構成を考える作業と書く作業を行き来せずに済みます。',
			'watch_for' => '生成された文章は、内容の確認や手直しが必要になる場合がある。
AIの下書きをそのまま使うのではなく、自分の視点や経験を加えるための材料として活用するとよい。',
			'verdict' => '調査だけを担当する人を置けない小規模な記事運用には、ちょうどよい中間です。人の手直しと、無理のない公開ペースと組み合わせて使ってください。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'surfer-seo', 'name' => 'Surfer SEO', 'category' => 'writing-seo',
			'url' => 'https://surferseo.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/332cd34458cf503a.png',
			'best_for' => '検索上位の競合ページを分析し、SEOに必要な要素を確認しながら、コンテンツの作成・最適化を支援するAI搭載のSEOプラットフォーム。
検索順位が伸び悩んでいる記事を分析し、改善につなげたい方。',
			'standout' => '上位表示されているページと比べて、自分の原稿にどの言葉が足りないかを1語ずつ示してくれます。',
			'watch_for' => 'コンテンツスコアを意識しすぎると、キーワードや関連語を詰め込みすぎて文章が不自然になる場合がある。
点数を上げることより、記事に不足している情報を確認するチェックリストとして使うとよい。',
			'verdict' => '表示回数はあるのにクリックされていない既存ページに使うのが一番効きます。書き直す相手が実在するからです。新しいページにも使えますが、まず自分の主張を固めてからにしてください。',
			'pairs_with' => 'writesonic, jasper', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'kit', 'name' => 'Kit（旧ConvertKit）', 'category' => 'email',
			'url' => 'https://kit.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/53257fe889d1112a.png',
			'best_for' => 'メールマガジンの配信をはじめ、登録フォームやランディングページの作成、デジタル商品の販売など、クリエイターの情報発信と読者・顧客との関係づくりを支援するプラットフォーム。
メールを中心に継続的な情報発信やファンとの関係づくりに取り組みたい個人や小規模チーム。',
			'standout' => '登録直後のメール配信やタグ付けの設定が見やすく、全体がメール配信を中心に作られています。',
			'watch_for' => 'メールマーケティングを中心としたサービスのため、営業管理の機能は限定的。
商談の進捗管理や営業レポートなど、CRM（顧客関係管理）としての機能を重視する場合は別のツールを検討する必要がある。',
			'verdict' => 'ニュースレターそのものが成果につながるなら、最もすっきりした選択です。毎週書くつもりのリスト向けで、一度だけの告知には要りません。',
			'pairs_with' => 'surfer-seo, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'getresponse', 'name' => 'GetResponse', 'category' => 'email',
			'url' => 'https://www.getresponse.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/6e3d791f0876b07e.jpg',
			'best_for' => 'メール配信を中心に、ランディングページ作成やマーケティング自動化（MA）などを一つにまとめたオールインワン型のデジタルマーケティングプラットフォーム。
メール配信から集客、見込み客へのフォローまでを1つのサービスでまとめたい小規模チーム。',
			'standout' => 'メール配信に特化したツールより扱う範囲が広く、キャンペーンに必要な機能が最初からそろっています。',
			'watch_for' => '機能が豊富なぶん、設定や管理に手間がかかる。
メール配信だけを目的とする場合は、機能を持て余す可能性がある。',
			'verdict' => 'メールだけでなく、ランディングページや導線まで作る予定ならこちらです。メール配信だけなら、機能の少ないツールのほうが運用は楽です。',
			'pairs_with' => 'writesonic, zapier', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'elevenlabs', 'name' => 'ElevenLabs', 'category' => 'audio-meetings',
			'url' => 'https://elevenlabs.io',
			'logo' => '',
			'best_for' => '自然で表現力のある音声をAIで生成できる音声生成・音声合成プラットフォーム。
ナレーションや音声ガイドなど、書いたものを音声でも用意したい方。',
			'standout' => 'そのまま公開できる声の質で、複数の言語に対応しています。',
			'watch_for' => '音声のクローン機能を使う際は、本人の同意や音声の利用権を確認する必要がある。
第三者の声を利用する場合は、権利関係を事前に確認すること。',
			'verdict' => '書いた記事を音声でも届けたいなら、この一覧でもっとも有力な選択です。最初の音声を公開する前に、AIの音声であることをどう伝えるかを決めてください。',
			'pairs_with' => 'writesonic, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'otter-ai', 'name' => 'Otter.ai', 'category' => 'audio-meetings',
			'url' => 'https://otter.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9b8a90ec8dc37495.png',
			'best_for' => '会議やインタビューの音声をリアルタイムでテキスト化し、自動で要約や話者の識別まで行うAIを活用した議事録・文字起こしツール。
議事録担当を置かずに、通話の内容を後から確認したい方。',
			'standout' => '会議に参加して文字起こしをし、数週間後でも探せる要約を作ります。',
			'watch_for' => '人名や数字、専門用語などは誤認識される場合がある。
顧客や社外に共有する前に、文字起こしの内容を確認すること。',
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
			'name' => '個人向けの構成',
			'for_who' => '顧客対応、通話、メールを1人で回している人。',
			'why' => '顧客の資料と通話の記録が1か所にまとまり、専任の担当者を置かずに定期的な情報発信を続けられます。',
			'tools' => array( 'notion', 'otter-ai', 'kit' ),
		),
		array(
			'slug' => 'content-led-startup',
			'name' => '記事から商談につなげる構成',
			'for_who' => '公開した記事をきっかけに商談が始まる小規模チーム。',
			'why' => '下書き、検索順位のチェック、メールリストの管理が1つの流れになり、人を増やさずに毎週続けられます。',
			'tools' => array( 'writesonic', 'surfer-seo', 'kit' ),
		),
		array(
			'slug' => 'lean-operations',
			'name' => '担当者を増やさず効率化する構成',
			'for_who' => 'すでに使っているツールを活用しながら、少人数で業務を効率化したいチーム。',
			'why' => '決まった作業は簡単な連携で自動化し、条件に応じた作業は1つの画面で管理。必要な資料も、チーム全員がすぐに見つけられるようにまとめます。',
			'tools' => array( 'zapier', 'make', 'notion' ),
		),
	);
}

/** ホームに並べる注目ツール（一覧の抜粋）。 */
function sp_featured_slugs(): array {
	return array( 'notion', 'zapier', 'writesonic', 'kit', 'elevenlabs', 'otter-ai' );
}
