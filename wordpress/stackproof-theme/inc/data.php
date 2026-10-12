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
			'best_for' => '・「Slackのチャット履歴やGoogleドライブの奥底に書類が埋もれて探せない」と悩んでいる人\n・ツールごとに別々の月額課金をせず、仕事の書類や進捗管理を1つの画面で完結させたいフリーランス・少人数チーム\n・チーム専用のポータル画面や案件管理シートを、プログラミングなしで自分たちの業務に合わせて自由に作りたい人',
			'standout' => '・ツールを行き来せず、メモ・タスク・AI下書きが1つの画面で完結する\n・ゼロから作らなくても、テンプレートですぐ実用化できる\n・AIが議事録の要約やアイデア出しをその場でアシスト',
			'watch_for' => '・自由度が高すぎて「社内迷路（情報のゴミ箱化）」になりやすい\n・使い始める前に「置く場所・タイトルの型」をチームで決めておく必要がある\n・オフライン環境での動作や、数十万件規模の大規模データ処理には不向き',
			'verdict' => 'ツール概要： メモ書き、タスク管理、マニュアル（社内Wiki）、顧客や案件の管理リストまで、バラバラになりがちな仕事の情報を1箇所に集約できるクラウド型のワークスペースです。\n「社内の情報共有ツールがまだ決まっておらず、どこから手をつければいいか迷っている少人数チーム」にとって、最初の1つとして最も失敗のない定番ツールです。',
			'pairs_with' => 'zapier, otter-ai', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'zapier', 'name' => 'Zapier', 'reading' => 'ザピアー', 'category' => 'automation',
			'url' => 'https://zapier.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/23ae37879fbb05be.png',
			'best_for' => '・「毎日コピペでデータを別ツールに移す作業」をゼロにしたいフリーランスやバックオフィス担当者\n・プログラミングやAPIの知識がなくても、ブロックを並べる感覚でアプリ同士を繋ぎたい人\n・国内外のSaaS（Notion、Gmail、Slack、Shopify、HubSpotなど）を複数併用している小規模チーム',
			'standout' => '連携できるアプリ数が世界最多（7,000以上）
テンプレートが豊富で、数分で自動化が完成する
エラーが起きても原因を特定しやすい',
			'watch_for' => '「分岐が10個ある」「複雑なループ処理」になると管理が破綻しやすい
動いた回数（タスク数）で課金されるため、大量処理だとコストが膨らむ
日本語対応は一部のみ（基本は英語UI）',
			'verdict' => 'ツール概要： ・「毎日コピペでデータを別ツールに移す作業」をゼロにしたいフリーランスやバックオフィス担当者\n・プログラミングやAPIの知識がなくても、ブロックを並べる感覚でアプリ同士を繋ぎたい人\n・国内外のSaaS（Notion、Gmail、Slack、Shopify、HubSpotなど）を複数併用している小規模チーム\n「問い合わせが来たらSlackに通知してスプレッドシートに追記する」といった、2〜5ステップ前後の日常業務を自動化したいなら、まず選んで間違いのない定番ツールです。',
			'pairs_with' => 'notion, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'make', 'name' => 'Make', 'reading' => 'メイク', 'category' => 'automation',
			'url' => 'https://www.make.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3c847799933a657d.jpg',
			'best_for' => '・「Aなら通知、Bならスプレッドシートに追記、Cならメール送信」といった複数の条件分岐を1つのワークフローでまとめたい人\n・日々の実行回数（タスク数）が多く、Zapierの従量課金だと毎月の固定費が高くなってしまう人\n・プログラミングは書けないが、パズルや回路図を組み立てるようにロジックを直感的に組みたい人',
			'standout' => '・1枚のキャンバス全体で複雑な分岐やループ処理を見渡せる
・データの加工・計算（文字列の置換や日時の変換）が追加コストなしで自由自在
・Zapierに比べて圧倒的にコストパフォーマンスが高い',
			'watch_for' => '・初期の学習ハードルが高く、直感だけで動かすのは難しい
・日本語の情報や公式サポートがまだ少なめ
・「AからBへそのまま転送するだけ」の2ステップならZapierのほうが手軽',
			'verdict' => 'ツール概要： ・「Aなら通知、Bならスプレッドシートに追記、Cならメール送信」といった複数の条件分岐を1つのワークフローでまとめたい人\n・日々の実行回数（タスク数）が多く、Zapierの従量課金だと毎月の固定費が高くなってしまう人\n・プログラミングは書けないが、パズルや回路図を組み立てるようにロジックを直感的に組みたい人\n「顧客の種別ごとに3通りに処理を分岐させ、データを計算して集計する」といった、少し複雑な業務フローを安く本格的に自動化したいならMakeが最適です。',
			'pairs_with' => 'zapier, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'jasper', 'name' => 'Jasper', 'reading' => 'ジャスパー', 'category' => 'writing-seo',
			'url' => 'https://www.jasper.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/3348b05b9e8b740e.png',
			'best_for' => '・社内メンバーや外注ライターが書く記事・SNS投稿の「トーン＆マナー（表記ゆれや口調）」を自動で統一したいメディア運営チーム\n・1つの新商品から「ブログ記事」「メルマガ」「X投稿」「広告見出し」を一括でマルチ展開したいマーケティング担当者\n・過去の自社コンテンツやブランドガイドラインを学習させ、「自社らしい文章」を短時間で量産したい企業',
			'standout' => '・自社の文体・語り口（Brand Voice）を学習し、誰が書いても同じトーンになる
・1つの企画から各媒体用の文章（SNS・メルマガ・ブログ）をまるごと一括生成できる
・マーケティング専用のプロンプトテンプレートが50種類以上揃っている',
			'watch_for' => '・個人利用には月額コストが高く、元を取りにくい
・日常の相談や単発のリサーチ用途（Q&A）には向かない
・生成された文章の事実確認（ファクトチェック）は必須',
			'verdict' => 'ツール概要： ChatGPTのような雑談・汎用型ではなく、SEO記事、Web広告のキャッチコピー、メルマガ作成など**「売るための文章生成」に特化したマーケティング向けAIプラットフォーム**です。\n「複数のライターや社員で発信しているが、文章の雰囲気（文末やトーン）がバラバラで統一感がない」という課題を抱えるチームに最適な、マーケティング専用のAIツールです。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'writesonic', 'name' => 'Writesonic', 'reading' => 'ライトソニック', 'category' => 'writing-seo',
			'url' => 'https://writesonic.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/85aa54a0adf0098f.png',
			'best_for' => '・検索上位を狙ったSEO記事を、キーワード選定から見出し構成・本文執筆まで短時間で量産したいオウンドメディア運営者
			・競合サイトを何記事も読み込んで比較・要約する「下調べの時間」を半分以下に削りたい個人ブロガーやアフィリエイター
			・Meta広告の見出し、LPのキャッチコピー、メルマガの導入文など、Webマーケティング用の短文バリエーションを数分で揃えたい担当者',
			'standout' => '・Google上位記事の構成を自動分析し、検索意図に沿った見出しを提案
・リサーチと本文執筆が同じ画面で完結し、ブラウザの行き来が不要
・文字単価や外注費を抑えつつ、記事の初稿作成スピードを大幅に加速',
			'watch_for' => '・そのまま投稿すると「無難で薄い記事」になり、検索順位も上がりにくい
・最新情報のファクトチェック（数値・固有名詞の事実確認）は必須
・日本語の言い回しに時折翻訳調・不自然なニュアンスが残る',
			'verdict' => 'ツール概要： 最新のWeb検索データを取り込みながら、検索順位を意識した「記事の見出し構成作成」「競合調査」「本文の長文執筆」までを1画面でアシストしてくれるSEO特化型AIツールです。\n「リサーチ専任のスタッフを雇う余裕はないが、検索上位を狙える記事をコンスタントに公開したい」という少人数メディアに最適な、SEO特化型のAIライティングツールです。',
			'pairs_with' => 'surfer-seo, kit', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'surfer-seo', 'name' => 'Surfer SEO', 'reading' => 'サーファー・エスイーオー', 'category' => 'writing-seo',
			'url' => 'https://surferseo.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/332cd34458cf503a.png',
			'best_for' => '・既存記事の順位が伸び悩み、「具体的にどのキーワードを何回追加すれば順位が上がるのか」を数値で把握してリライトしたいブログ・サイト運営者\n・外注ライターへの指示出しにおいて、「見出し構成」「文字数」「必ず入れてほしいキーワード群」を客観的な指標で統一したいディレクター\n・Googleの検索アルゴリズム（NLP＝自然言語処理）を意識した、論理的で再現性の高いSEO対策を行いたい個人・法人メディア',
			'standout' => '・上位記事と見比べて「足りない単語」と「推奨使用回数」をピンポイントで可視化
・GoogleドキュメントやWordPressの編集画面でそのまま採点しながら書ける
・既存記事のURLを入れるだけで「改善チェックリスト」が数分で完成する',
			'watch_for' => '・「スコア100点」を目指してキーワードを詰め込むと、読者が離脱する
・月額料金が高めで、完全な趣味ブログだとコスト負けしやすい
・日本語の表記ゆれ（ひらがな・漢字・助詞）を機械的に厳密判定しがち',
			'verdict' => 'ツール概要： 競合上位ページを統計分析し、「今Googleに評価されている記事の設計図」を割り出して、リアルタイムで執筆・改善をガイドしてくれるSEO特化型プラットフォームです。\n「勘や感覚ではなく、検索上位を取るための確実なデータに基づいて記事を勝ちに行きたい」というメディア運営者やアフィリエイターに最適な、コンテンツ最適化・SEO分析ツールです。',
			'pairs_with' => 'writesonic, jasper', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'kit', 'name' => 'Kit（旧ConvertKit）', 'reading' => 'キット', 'category' => 'email',
			'url' => 'https://kit.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/53257fe889d1112a.png',
			'best_for' => '・ブログやSNSのフォロワーをメルマガに集め、定期配信を通じて濃いファンに育てたい発信者\n・外部の決済ツールを使わずに、「月額制の有料マガジン」や「PDF教材・限定動画」をその場ですぐ販売したい人\n・登録フォームを複数用意しても、同じ読者を重複カウントされない「無駄な課金ゼロ」の環境で運用したい個人・小規模チーム',
			'standout' => '・ブログを書くような画面で、迷わずメールの執筆に集中できる
・「特典Aを請求した人にはこのタグをつけ、3通のステップメールを送る」が樹形図で一目でわかる
・「Creator Network」により、広告費をかけずに同ジャンルの新規読者が増える',
			'watch_for' => '・BtoBのような商談管理や案件パイプライン（CRM機能）は備わっていない
・ECサイトのような画像多用・ブロック配置のリッチデザインは作りにくい
・全く別の複数ブランドや会社を「完全に隔離して並行運用」するのは難しい',
			'verdict' => 'ツール概要： ・ブログやSNSのフォロワーをメルマガに集め、定期配信を通じて濃いファンに育てたい発信者\n・外部の決済ツールを使わずに、「月額制の有料マガジン」や「PDF教材・限定動画」をその場ですぐ販売したい人\n・登録フォームを複数用意しても、同じ読者を重複カウントされない「無駄な課金ゼロ」の環境で運用したい個人・小規模チーム\n「自分の思考や専門知識をメルマガとして週1〜2回発信し、読者との濃い信頼関係を作りたい」というブロガー、講師、個人クリエイターにとって、最も無駄のない選択肢です。',
			'pairs_with' => 'surfer-seo, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'getresponse', 'name' => 'GetResponse', 'reading' => 'ゲットレスポンス', 'category' => 'email',
			'url' => 'https://www.getresponse.com',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/6e3d791f0876b07e.jpg',
			'best_for' => 'リッチな画像入りメールの配信に加え、離脱防止ポップアップ付きのLP作成、ウェビナー開催、緻密な行動トラッキングまでを網羅した、売上直結型の統合マーケティングプラットフォームです。',
			'standout' => '・外部ツールを買い足さずに「集客〜セミナー開催〜成約」まで完結できる
・ECや新商品の告知に強い、華やかなデザインメールを直感的に作れる
・複数のビジネスを別々の独立リスト（名簿）で安全に並行管理できる',
			'watch_for' => '・同じ読者が別リストに登録されると「2人分」として重複課金される
・設定項目やメニューが膨大で、最初の動線構築にまとまった学習時間が必要
・クリエイター向けの「手軽な教材直販」や「読者の相互紹介機能」はない',
			'verdict' => 'ツール概要： リッチな画像入りメールの配信に加え、離脱防止ポップアップ付きのLP作成、ウェビナー開催、緻密な行動トラッキングまでを網羅した、売上直結型の統合マーケティングプラットフォームです。\n「メルマガを送るだけでなく、集客用LPの制作からZoom不要のオンライン説明会（ウェビナー）、商品成約までのセールス動線を1本化したい」なら、迷わず選ぶべきオールインワンツールです。',
			'pairs_with' => 'writesonic, zapier', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'elevenlabs', 'name' => 'ElevenLabs', 'reading' => 'イレブンラボ', 'category' => 'audio-meetings',
			'url' => 'https://elevenlabs.io',
			'logo' => '',
			'best_for' => '自然で表現力のある音声をAIで生成できる音声生成・音声合成プラットフォーム。
ナレーションや音声ガイドなど、書いたものを音声でも用意したい方。',
			'standout' => '・機械っぽさ（ロボット感）がなく、無調整でもそのまま配信で使える声のクオリティ\n・自分の声（または専属ナレーターの声）を数分のサンプルから複製できる「ボイスクローン」\n・日本語の原稿を別言語へ自然に吹き替えられる多言語対応',
			'watch_for' => '音声のクローン機能を使う際は、本人の同意や音声の利用権を確認する必要がある。
第三者の声を利用する場合は、権利関係を事前に確認すること。',
			'verdict' => 'ツール概要： 人間の声の抑揚・感情・リズムを極めて高い精度で学習し、入力したテキストから違和感のない高品質な肉声データを数秒で生成できるAI音声合成プラットフォームです。\n「ブログ記事やメルマガのテキストを、人がスタジオで収録したような自然なナレーションに変換して音声配信や動画に使いたい」なら、現在の生成AIの中で最も完成度が高い選択肢です。',
			'pairs_with' => 'writesonic, notion', 'reviewed' => '2026-09-20',
		),
		array(
			'slug' => 'otter-ai', 'name' => 'Otter.ai', 'reading' => 'オッター・エーアイ', 'category' => 'audio-meetings',
			'url' => 'https://otter.ai',
			'logo' => 'https://storage.googleapis.com/noimosai-webpage-assets-prod/cmu465q5g00cz01s6iagko9jv/cmu9favrp000801s6hnjuzujt/9b8a90ec8dc37495.png',
			'best_for' => '・メモを取るのに必死で「顧客との会話やリアクションに集中できない」と悩んでいる営業担当者や採用インタビュアー
・会議専任の書記役を置くリソースがなく、打ち合わせ終了後すぐにチームへ決定事項を展開したい少人数チーム
・英語での商談や海外クライアントとの定例が多く、「誰が何を言ったか」の英語テキストと要約をその場で手元に残したい人',
			'standout' => '・ZoomやGoogle MeetにBotが自動参加し、手ぶらで会議に集中できる\n・誰が発言したかを自動で識別し、「後からの検索」が数秒で終わる\n・会議終了後すぐに「決定事項」「ToDo」を箇条書きで自動抽出',
			'watch_for' => '・英語に比べて「日本語の文字起こし・認識精度」はまだ発展途上\n・「金額・納期・会社名・専門用語」の聞き間違いは必ず手直しが必要\n・社外ミーティングでは「AI入室の事前周知・許可取り」が欠かせない　
顧客や社外に共有する前に、文字起こしの内容を確認すること。',
			'verdict' => 'ツール概要： Zoom、Google Meet、Microsoft Teamsに自動で同席し、話者を識別しながらリアルタイムで会話をテキスト化・重要ポイントの箇条書き要約まで一括作成するAIミーティングアシスタントです。\n「商談、顧客ヒアリング、週次の定例ミーティングなど、似たパターンのオンライン会議を毎日のようにこなす人」に最も刺さるAI議事録ツールです。ZoomやGoogle Meetに自動で参加してリアルタイムで文字起こしを行い、会議終了直後に「決定事項」や「次のアクション」を箇条書きで要約してくれます。',
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
