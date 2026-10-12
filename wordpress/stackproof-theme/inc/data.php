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
		'name'      => 'ToolStack',
		'logo'      => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3526382475e7067d.webp',
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
			'slug' => 'notion', 'name' => 'Notion', 'reading' => 'ノーション', 'category' => 'workspace',
			'url' => 'https://www.notion.so',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/5640c98062d12b62.png',
			'best_for' => 'メモ書き、タスク管理、マニュアル（社内Wiki）、顧客や案件の管理リストまで、バラバラになりがちな仕事の情報を1つに集約できるワークスペースです。',
			'standout' => 'ドキュメントの執筆、タスク一覧の確認、AIによる文章の要約や下書き作成がすべて同じ画面内で動くため、タブを何個も切り替える手間がなくなります。',
			'watch_for' => '誰でも新しいページを好きな階層に作れてしまうため、「あの議事録はどこ？」「古い情報が放置されている」といった情報の散らかり（属人化）が起きがちです。',
			'verdict' => '情報共有ツールが決まっていない少人数チームなら、「社内のなんでも置き場」としてNotionを選んでおけば間違いありません。',
			'pairs_with' => 'zapier, otter-ai', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'zapier', 'name' => 'Zapier', 'reading' => 'ザピアー', 'category' => 'automation',
			'url' => 'https://zapier.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/23ae37879fbb05be.png',
			'best_for' => 'プログラミング不要で「Aのアプリで何かが起きたら、Bのアプリでこれを実行する」という連動ルールを作り、単純作業を自動で肩代わりさせるサービス（iPaaS）です。',
			'standout' => '連携できるアプリ数が世界最多（7,000以上）
テンプレートが豊富で、数分で自動化が完成する
エラーが起きても原因を特定しやすい',
			'watch_for' => '「分岐が10個ある」「複雑なループ処理」になると管理が破綻しやすい
動いた回数（タスク数）で課金されるため、大量処理だとコストが膨らむ
日本語対応は一部のみ（基本は英語UI）',
			'verdict' => '「問い合わせが来たらSlackに通知してスプレッドシートに追記する」といった、2〜5ステップ前後の日常業務を自動化したいなら、まず選んで間違いのない定番ツールです。メリットは対応サービスの圧倒的な多さで、「このマイナーな海外ツール、他では繋がらなかったのにZapierなら動いた」というケースが日常茶飯事です。',
			'pairs_with' => 'notion, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'make', 'name' => 'Make', 'reading' => 'メイク', 'category' => 'automation',
			'url' => 'https://www.make.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3c847799933a657d.jpg',
			'best_for' => 'まるでマインドマップを描くように、丸いアイコン（モジュール）を線で繋ぎながら「分岐・計算・フィルター」を画面上で組み立てられる高機能な自動化プラットフォーム（iPaaS）です。',
			'standout' => '1枚のキャンバス全体で複雑な分岐やループ処理を見渡せる
データの加工・計算（文字列の置換や日時の変換）が追加コストなしで自由自在
Zapierに比べて圧倒的にコストパフォーマンスが高い',
			'watch_for' => '初期の学習ハードルが高く、直感だけで動かすのは難しい
日本語の情報や公式サポートがまだ少なめ
「AからBへそのまま転送するだけ」の2ステップならZapierのほうが手軽',
			'verdict' => '「顧客の種別ごとに3通りに処理を分岐させ、データを計算して集計する」といった、少し複雑な業務フローを安く本格的に自動化したいならMakeが最適です。「ステップ数が多すぎて月額料金が高すぎる」「画面が縦に長くなりすぎて全体の構造が見えない」と感じ始めたタイミングが、まさに乗り換えのサインです。',
			'pairs_with' => 'zapier, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'jasper', 'name' => 'Jasper', 'reading' => 'ジャスパー', 'category' => 'writing-seo',
			'url' => 'https://www.jasper.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3348b05b9e8b740e.png',
			'best_for' => 'ChatGPTのような雑談・汎用型ではなく、SEO記事、Web広告のキャッチコピー、メルマガ作成など「売るための文章生成」に特化したマーケティング向けAIプラットフォームです。',
			'standout' => '自社の文体・語り口（Brand Voice）を学習し、誰が書いても同じトーンになる
1つの企画から各媒体用の文章（SNS・メルマガ・ブログ）をまるごと一括生成できる
マーケティング専用のプロンプトテンプレートが50種類以上揃っている',
			'watch_for' => '個人利用には月額コストが高く、元を取りにくい
日常の相談や単発のリサーチ用途（Q&A）には向かない
生成された文章の事実確認（ファクトチェック）は必須',
			'verdict' => '「複数のライターや社員で発信しているが、文章の雰囲気（文末やトーン）がバラバラで統一感がない」という課題を抱えるチームに最適な、マーケティング専用のAIツールです。自社ブランド特有の語り口（Brand Voice）を学習させ、誰が指示を出してもブレないコピーを量産できます。一方、個人が自分のブログやSNSの下書きを書く程度なら、ChatGPTなどの汎用AIで十分であり、月額費用を持て余す可能性が高いです。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'writesonic', 'name' => 'Writesonic', 'reading' => 'ライトソニック', 'category' => 'writing-seo',
			'url' => 'https://writesonic.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/85aa54a0adf0098f.png',
			'best_for' => '最新のWeb検索データを取り込みながら、検索順位を意識した「記事の見出し構成作成」「競合調査」「本文の長文執筆」までを1画面でアシストしてくれるSEO特化型AIツールです。',
			'standout' => 'Google上位記事の構成を自動分析し、検索意図に沿った見出しを提案
リサーチと本文執筆が同じ画面で完結し、ブラウザの行き来が不要
文字単価や外注費を抑えつつ、記事の初稿作成スピードを大幅に加速',
			'watch_for' => 'そのまま投稿すると「無難で薄い記事」になり、検索順位も上がりにくい
最新情報のファクトチェック（数値・固有名詞の事実確認）は必須
日本語の言い回しに時折翻訳調・不自然なニュアンスが残る',
			'verdict' => '「リサーチ専任のスタッフを雇う余裕はないが、検索上位を狙える記事をコンスタントに公開したい」という少人数メディアに最適な、SEO特化型のAIライティングツールです。Google検索の最新データや競合上位サイトの構成をその場で分析しながら、見出し構成から長文の下書きまでを一気に組み立てられます。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'surfer-seo', 'name' => 'Surfer SEO', 'reading' => 'サーファー・エスイーオー', 'category' => 'writing-seo',
			'url' => 'https://surferseo.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/332cd34458cf503a.png',
			'best_for' => '狙うキーワードの上位競合サイトを自動解析し、「必要な文字数・見出し数・必須キーワード（共起語）」をリアルタイムで点数化（Content Score）しながら執筆・リライトできるSEO最適化ツールです。',
			'standout' => '上位記事と見比べて「足りない単語」と「推奨使用回数」をピンポイントで可視化
GoogleドキュメントやWordPressの編集画面でそのまま採点しながら書ける
既存記事のURLを入れるだけで「改善チェックリスト」が数分で完成する',
			'watch_for' => '「スコア100点」を目指してキーワードを詰め込むと、読者が離脱する
月額料金が高めで、完全な趣味ブログだとコスト負けしやすい
日本語の表記ゆれ（ひらがな・漢字・助詞）を機械的に厳密判定しがち',
			'verdict' => '「検索結果には表示されているのに、順位が2〜3ページ目（10〜30位）で止まっていて読まれない」という既存記事のリライトに使うのが最も効果的です。すでにGoogleから一定の評価を得ている記事なら、「競合上位にあって自社に足りないキーワード」を補うだけで、短期間で検索1ページ目へ順位を押し上げやすいからです。',
			'pairs_with' => 'writesonic, jasper', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'kit', 'name' => 'Kit（旧ConvertKit）', 'reading' => 'キット', 'category' => 'email',
			'url' => 'https://kit.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/53257fe889d1112a.png',
			'best_for' => '複雑な営業システムを省き、「メールの執筆・配信」「読者ごとの興味タグ付け」「デジタルコンテンツの直接決済」をシンプルに完結させる、クリエイター特化型の配信プラットフォームです。',
			'standout' => 'ブログを書くような画面で、迷わずメールの執筆に集中できる
「特典Aを請求した人にはこのタグをつけ、3通のステップメールを送る」が樹形図で一目でわかる
「Creator Network」により、広告費をかけずに同ジャンルの新規読者が増える',
			'watch_for' => 'BtoBのような商談管理や案件パイプライン（CRM機能）は備わっていない
ECサイトのような画像多用・ブロック配置のリッチデザインは作りにくい
全く別の複数ブランドや会社を「完全に隔離して並行運用」するのは難しい',
			'verdict' => '「自分の思考や専門知識をメルマガとして週1〜2回発信し、読者との濃い信頼関係を作りたい」というブロガー、講師、個人クリエイターにとって、最も無駄のない選択肢です。',
			'pairs_with' => 'surfer-seo, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'getresponse', 'name' => 'GetResponse', 'reading' => 'ゲットレスポンス', 'category' => 'email',
			'url' => 'https://www.getresponse.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/6e3d791f0876b07e.jpg',
			'best_for' => 'リッチな画像入りメールの配信に加え、離脱防止ポップアップ付きのLP作成、ウェビナー開催、緻密な行動トラッキングまでを網羅した、売上直結型の統合マーケティングプラットフォームです。',
			'standout' => '外部ツールを買い足さずに「集客〜セミナー開催〜成約」まで完結できる
ECや新商品の告知に強い、華やかなデザインメールを直感的に作れる
複数のビジネスを別々の独立リスト（名簿）で安全に並行管理できる',
			'watch_for' => '同じ読者が別リストに登録されると「2人分」として重複課金される
設定項目やメニューが膨大で、最初の動線構築にまとまった学習時間が必要
クリエイター向けの「手軽な教材直販」や「読者の相互紹介機能」はない',
			'verdict' => '「メルマガを送るだけでなく、集客用LPの制作からZoom不要のオンライン説明会（ウェビナー）、商品成約までのセールス動線を1本化したい」なら、迷わず選ぶべきオールインワンツールです。',
			'pairs_with' => 'writesonic, zapier', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'elevenlabs', 'name' => 'ElevenLabs', 'reading' => 'イレブンラボ', 'category' => 'audio-meetings',
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
			'slug' => 'otter-ai', 'name' => 'Otter.ai', 'reading' => 'オッター・エーアイ', 'category' => 'audio-meetings',
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
			'why' => '顧客の資料と通話の記録が1か所にまとまり、担当者を増やさず定期的な情報発信を続けられます。',
			'tools' => array( 'notion', 'otter-ai', 'kit' ),
		),
		array(
			'slug' => 'content-led-startup',
			'name' => '記事から問い合わせにつながる流れ',
			'for_who' => '公開した記事をきっかけに案件が始まる小規模チーム。',
			'why' => '記事の下書きから検索順位のチェック、メールリストの管理までをツールで分担し、人を増やさずに毎週の運用を続けられます。',
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
