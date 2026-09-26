<?php
/**
 * StackProof テーマの本体。
 *
 * 役割:
 *  - ツール（カスタム投稿タイプ sp_tool）とカテゴリの登録
 *  - 発リンク /go/{slug} の転送（成果リンクはツール編集画面で設定）
 *  - メール登録・お問い合わせフォーム（管理画面の「リード」に保存）
 *  - /llms.txt の出力
 *  - 有効化時の初期データ投入（inc/seed.php）
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SP_THEME_VERSION', '1.3.17' );

require get_template_directory() . '/inc/copy.php';
require get_template_directory() . '/inc/data.php';
require get_template_directory() . '/inc/seed.php';
require get_template_directory() . '/inc/health.php';

/* ---------------------------------------------------------------
 * テーマ設定
 * ------------------------------------------------------------- */
function sp_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 48,
			'width'       => 266,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	register_nav_menus(
		array(
			'primary' => 'メインメニュー',
			'footer'  => 'フッター',
		)
	);
}
add_action( 'after_setup_theme', 'sp_setup' );

function sp_assets() {
	wp_enqueue_style(
		'sp-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'sp-style', get_stylesheet_uri(), array( 'sp-fonts' ), SP_THEME_VERSION );
	wp_enqueue_script( 'sp-site', get_template_directory_uri() . '/assets/js/site.js', array(), SP_THEME_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'sp_assets' );

/* ---------------------------------------------------------------
 * 投稿タイプ・タクソノミー
 * ------------------------------------------------------------- */
function sp_register_types() {
	register_post_type(
		'sp_tool',
		array(
			'labels'       => array(
				'name'          => 'ツール',
				'singular_name' => 'ツール',
				'add_new_item'  => 'ツールを追加',
				'edit_item'     => 'ツールを編集',
				'search_items'  => 'ツールを検索',
				'not_found'     => 'ツールがありません',
				'menu_name'     => 'ツール',
			),
			'public'       => true,
			'has_archive'  => 'tools',
			'rewrite'      => array( 'slug' => 'tools', 'with_front' => false ),
			'menu_icon'    => 'dashicons-screenoptions',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'show_in_rest' => true,
		)
	);

	register_taxonomy(
		'sp_category',
		'sp_tool',
		array(
			'labels'            => array(
				'name'          => 'カテゴリ',
				'singular_name' => 'カテゴリ',
				'add_new_item'  => 'カテゴリを追加',
				'menu_name'     => 'カテゴリ',
			),
			'public'            => true,
			'hierarchical'      => false,
			'rewrite'           => array( 'slug' => 'tool-category', 'with_front' => false ),
			'show_admin_column' => true,
			'show_in_rest'      => true,
		)
	);

	register_post_type(
		'sp_lead',
		array(
			'labels'    => array(
				'name'          => 'リード',
				'singular_name' => 'リード',
				'menu_name'     => 'リード',
			),
			'public'    => false,
			'show_ui'   => true,
			'supports'  => array( 'title', 'editor' ),
			'menu_icon' => 'dashicons-email-alt',
		)
	);
}
add_action( 'init', 'sp_register_types' );

/* ---------------------------------------------------------------
 * ツールの項目（編集画面の入力欄）
 * ------------------------------------------------------------- */
function sp_tool_fields(): array {
	return array(
		'vendor_url'    => array( 'label' => 'ベンダーURL', 'type' => 'url' ),
		'affiliate_url' => array(
			'label' => '成果リンク（アフィリエイトURL）',
			'type'  => 'url',
			'help'  => '空のあいだはベンダーURLへ転送します。提携が承認されたら、ここに成果リンクを貼り付けてください。',
		),
		'logo_url'      => array( 'label' => 'ロゴ画像URL', 'type' => 'url', 'help' => '空欄なら名前だけを表示します。' ),
		'reviewed'      => array( 'label' => '検証日（例: 2026-09-20）', 'type' => 'text' ),
		'best_for'      => array( 'label' => '向いている人', 'type' => 'textarea' ),
		'standout'      => array( 'label' => 'メリット', 'type' => 'textarea' ),
		'watch_for'     => array( 'label' => '注意点', 'type' => 'textarea' ),
		'verdict'       => array( 'label' => '評価', 'type' => 'textarea' ),
		'pairs_with'    => array( 'label' => '併用しやすいツール（スラッグをカンマ区切り 例: notion, zapier）', 'type' => 'text' ),
	);
}

function sp_add_meta_box() {
	add_meta_box( 'sp_tool_fields', 'レビュー項目（テーマ）', 'sp_render_meta_box', 'sp_tool', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'sp_add_meta_box' );

function sp_render_meta_box( $post ) {
	wp_nonce_field( 'sp_save_tool', 'sp_tool_nonce' );
	echo '<div style="display:grid;gap:14px">';
	foreach ( sp_tool_fields() as $key => $field ) {
		$value = get_post_meta( $post->ID, $key, true );
		printf( '<p style="margin:0"><label for="sp_%1$s" style="display:block;font-weight:600">%2$s</label>', esc_attr( $key ), esc_html( $field['label'] ) );
		if ( 'textarea' === $field['type'] ) {
			printf(
				'<textarea id="sp_%1$s" name="sp_%1$s" rows="3" style="width:100%%">%2$s</textarea>',
				esc_attr( $key ),
				esc_textarea( $value )
			);
		} else {
			printf(
				'<input type="%1$s" id="sp_%2$s" name="sp_%2$s" value="%3$s" style="width:100%%" />',
				'url' === $field['type'] ? 'url' : 'text',
				esc_attr( $key ),
				esc_attr( $value )
			);
		}
		if ( ! empty( $field['help'] ) ) {
			printf( '<span style="color:#646970">%s</span>', esc_html( $field['help'] ) );
		}
		echo '</p>';
	}
	printf(
		'<p style="margin:0;color:#646970">外部リンクのクリック数: %d（最終: %s）</p>',
		(int) get_post_meta( $post->ID, 'go_clicks', true ),
		esc_html( get_post_meta( $post->ID, 'go_last_click', true ) ?: '記録なし' )
	);
	echo '</div>';
}

function sp_save_meta_box( $post_id, $post ) {
	if ( ! isset( $_POST['sp_tool_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['sp_tool_nonce'] ) ), 'sp_save_tool' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) || 'sp_tool' !== $post->post_type ) {
		return;
	}
	foreach ( sp_tool_fields() as $key => $field ) {
		if ( ! isset( $_POST[ 'sp_' . $key ] ) ) {
			continue;
		}
		$raw = wp_unslash( $_POST[ 'sp_' . $key ] );
		if ( 'url' === $field['type'] ) {
			$value = esc_url_raw( $raw );
		} elseif ( 'textarea' === $field['type'] ) {
			$value = sanitize_textarea_field( $raw );
		} else {
			$value = sanitize_text_field( $raw );
		}
		update_post_meta( $post_id, $key, $value );
	}
}
add_action( 'save_post', 'sp_save_meta_box', 10, 2 );

/* ---------------------------------------------------------------
 * ツールの取得ヘルパー
 * ------------------------------------------------------------- */
/**
 * スラッグからツール1件を取る（見つからなければ null）。
 *
 * 通常は get_posts() の 'name' 指定で引けるが、設置先のプラグインや
 * フィルタの影響で0件になることがある。その場合、発リンク /go/{slug} が
 * 提携先ではなくツール一覧へ飛んでしまうため、データベースから直接引く。
 */
function sp_tool_by_slug( string $slug ) {
	$slug = sanitize_title( $slug );
	if ( '' === $slug ) {
		return null;
	}

	$posts = get_posts(
		array(
			'post_type'   => 'sp_tool',
			'name'        => $slug,
			'numberposts' => 1,
			'post_status' => 'publish',
		)
	);
	if ( $posts ) {
		return $posts[0];
	}

	global $wpdb;
	$id = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- 予備の取得経路（上の get_posts で見つからないときだけ）。
		$wpdb->prepare(
			"SELECT ID FROM {$wpdb->posts} WHERE post_type = %s AND post_name = %s AND post_status NOT IN ( 'trash', 'auto-draft' ) ORDER BY ( post_status = 'publish' ) DESC, ID ASC LIMIT 1",
			'sp_tool',
			$slug
		)
	);

	return $id ? get_post( (int) $id ) : null;
}

function sp_tools_query( int $limit = -1, string $category = '' ) {
	$args = array(
		'post_type'      => 'sp_tool',
		'posts_per_page' => $limit,
		'orderby'        => 'title',
		'order'          => 'ASC',
	);
	if ( $category ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'sp_category',
				'field'    => 'slug',
				'terms'    => $category,
			),
		);
	}
	return get_posts( $args );
}

function sp_tool_category_label( $post_id ): string {
	$terms = get_the_terms( $post_id, 'sp_category' );
	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}
	return $terms[0]->name;
}

function sp_tool_category_slug( $post_id ): string {
	$terms = get_the_terms( $post_id, 'sp_category' );
	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}
	return $terms[0]->slug;
}

function sp_tool_target( $post_id ): string {
	$affiliate = get_post_meta( $post_id, 'affiliate_url', true );
	if ( $affiliate ) {
		return $affiliate;
	}
	$vendor = get_post_meta( $post_id, 'vendor_url', true );
	return $vendor ? $vendor : home_url( '/' );
}

function sp_reviewed_label( $post_id ): string {
	$reviewed = get_post_meta( $post_id, 'reviewed', true );
	if ( ! $reviewed ) {
		return '';
	}
	$time = strtotime( $reviewed );
	if ( ! $time ) {
		return $reviewed;
	}
	return sp_t( 'tool.reviewedLabel', array( 'date' => date_i18n( 'Y年n月j日', $time ) ) );
}

/** ロゴがあればロゴ、無ければ何も描かない（名前だけで表示する）。 */
function sp_tool_mark( $post_id, string $size = '' ) {
	$logo = get_post_meta( $post_id, 'logo_url', true );
	if ( ! $logo ) {
		return;
	}
	printf(
		'<span class="sp-mark %1$s"><img src="%2$s" alt="" loading="lazy" decoding="async" /></span>',
		esc_attr( $size ? 'sp-mark--' . $size : '' ),
		esc_url( $logo )
	);
}

/** 固定ページのURL（無ければトップ）。 */
function sp_page_url( string $slug ): string {
	$page = get_page_by_path( $slug );
	return $page ? get_permalink( $page ) : home_url( '/' );
}

/**
 * 発リンクのURL。きれいなURLが使えるときは /go/{slug}/、
 * 使えないときは ?sp_go={slug}（どちらも同じ場所へ転送する）。
 */
function sp_go_url( string $slug ): string {
	if ( get_option( 'permalink_structure' ) ) {
		return home_url( '/go/' . rawurlencode( $slug ) . '/' );
	}
	return add_query_arg( 'sp_go', $slug, home_url( '/' ) );
}

/** 検索用の小文字化（mbstring が無い環境でも動く）。 */
function sp_lower( string $text ): string {
	return function_exists( 'mb_strtolower' ) ? mb_strtolower( $text ) : strtolower( $text );
}

/* ---------------------------------------------------------------
 * 発リンク /go/{slug} と /llms.txt
 * ------------------------------------------------------------- */
function sp_rewrites() {
	add_rewrite_rule( '^go/([^/]+)/?$', 'index.php?sp_go=$1', 'top' );
	add_rewrite_rule( '^llms\.txt$', 'index.php?sp_llms=1', 'top' );
}
add_action( 'init', 'sp_rewrites' );

function sp_query_vars( $vars ) {
	$vars[] = 'sp_go';
	$vars[] = 'sp_llms';
	return $vars;
}
add_filter( 'query_vars', 'sp_query_vars' );

function sp_template_redirect() {
	$go = get_query_var( 'sp_go' );
	if ( $go ) {
		$slug = sanitize_title( $go );
		$tool = sp_tool_by_slug( $slug );
		if ( ! $tool ) {
			wp_safe_redirect( get_post_type_archive_link( 'sp_tool' ) );
			exit;
		}
		update_post_meta( $tool->ID, 'go_clicks', (int) get_post_meta( $tool->ID, 'go_clicks', true ) + 1 );
		update_post_meta( $tool->ID, 'go_last_click', current_time( 'mysql' ) );
		wp_redirect( sp_tool_target( $tool->ID ), 302 ); // phpcs:ignore WordPress.Security.SafeRedirect -- 外部の成果リンクへ転送するため。
		exit;
	}

	if ( get_query_var( 'sp_llms' ) ) {
		header( 'Content-Type: text/plain; charset=utf-8' );
		echo sp_llms_text(); // phpcs:ignore WordPress.Security.EscapeOutput -- テキスト出力。
		exit;
	}
}
add_action( 'template_redirect', 'sp_template_redirect' );

function sp_llms_text(): string {
	$brand = sp_brand();
	$lines = array();
	$lines[] = '# ' . $brand['name'];
	$lines[] = '';
	$lines[] = '> ' . sp_t( 'site.blurb' );
	$lines[] = '';
	$lines[] = '## ツール一覧';
	foreach ( sp_tools_query() as $tool ) {
		$lines[] = '- ' . $tool->post_title . '（' . sp_tool_category_label( $tool->ID ) . '）: ' . get_permalink( $tool );
	}
	$lines[] = '';
	$lines[] = '## ページ';
	$pages = array(
		'ツール一覧' => get_post_type_archive_link( 'sp_tool' ),
		'このサイトについて' => sp_page_url( 'about' ),
		'アフィリエイト開示' => sp_page_url( 'disclosure' ),
		'プライバシーポリシー' => sp_page_url( 'privacy' ),
	);
	foreach ( $pages as $label => $url ) {
		if ( $url ) {
			$lines[] = '- ' . $label . ': ' . $url;
		}
	}
	$posts = get_posts( array( 'post_type' => 'post', 'numberposts' => 20 ) );
	if ( $posts ) {
		$lines[] = '';
		$lines[] = '## 記事';
		foreach ( $posts as $post ) {
			$lines[] = '- ' . $post->post_title . ': ' . get_permalink( $post );
		}
	}
	$lines[] = '';
	return implode( "\n", $lines );
}

/* ---------------------------------------------------------------
 * ナビゲーション（メニュー未設定でも必ず表示する）
 * ------------------------------------------------------------- */
/**
 * メニューの既定項目。
 * 'target' は WordPress へ保存するときの行き先の指定（inc/seed.php が使う）。
 * 'url' はメニュー未設定のときの表示用（その場でURLを組み立てる）。
 */
function sp_default_nav_items(): array {
	return array(
		array( 'label' => sp_t( 'nav.tools' ), 'url' => get_post_type_archive_link( 'sp_tool' ), 'target' => array( 'type' => 'archive' ) ),
		array( 'label' => sp_t( 'nav.stacks' ), 'url' => home_url( '/#stacks' ), 'target' => array( 'type' => 'custom', 'url' => home_url( '/#stacks' ) ) ),
		array( 'label' => sp_t( 'nav.blog' ), 'url' => sp_page_url( 'blog' ), 'target' => array( 'type' => 'page', 'slug' => 'blog' ) ),
		array( 'label' => sp_t( 'nav.about' ), 'url' => sp_page_url( 'about' ), 'target' => array( 'type' => 'page', 'slug' => 'about' ) ),
	);
}

function sp_default_footer_items(): array {
	return array(
		array( 'label' => sp_t( 'nav.directory' ), 'url' => get_post_type_archive_link( 'sp_tool' ), 'target' => array( 'type' => 'archive' ) ),
		array( 'label' => sp_t( 'nav.blog' ), 'url' => sp_page_url( 'blog' ), 'target' => array( 'type' => 'page', 'slug' => 'blog' ) ),
		array( 'label' => sp_t( 'nav.aboutMethodology' ), 'url' => sp_page_url( 'about' ), 'target' => array( 'type' => 'page', 'slug' => 'about' ) ),
		array( 'label' => sp_t( 'nav.disclosure' ), 'url' => sp_page_url( 'disclosure' ), 'target' => array( 'type' => 'page', 'slug' => 'disclosure' ) ),
		array( 'label' => sp_t( 'nav.privacy' ), 'url' => sp_page_url( 'privacy' ), 'target' => array( 'type' => 'page', 'slug' => 'privacy' ) ),
	);
}

function sp_nav_fallback( array $args = array() ): void {
	$items = ! empty( $args['sp_footer'] ) ? sp_default_footer_items() : sp_default_nav_items();
	echo '<ul class="sp-nav__list">';
	foreach ( $items as $item ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $item['url'] ), esc_html( $item['label'] ) );
	}
	echo '</ul>';
}

/* ---------------------------------------------------------------
 * フォーム（お問い合わせのみ）
 *
 * メール登録フォームは 2026-09-26 に廃止しました（チートシートのページと
 * トップページの案内を外したため）。残るのは /about/ の訂正・質問フォームだけです。
 * ------------------------------------------------------------- */
/**
 * お問い合わせフォーム（このサイトで唯一のフォーム）。
 *
 * 2026-09-26: メール登録用の variant（トップページの帯とチートシートで使っていた
 * もの）は廃止しました。ここに出すのは名前・メール・本文の3項目だけです。
 */
function sp_render_form(): string {
	$state   = isset( $_GET['sp_lead'] ) ? sanitize_key( wp_unslash( $_GET['sp_lead'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$form_id = 'sp-lead-' . wp_unique_id();
	$action  = esc_url( admin_url( 'admin-post.php' ) );
	// サブディレクトリ設置でもパスが二重にならないよう、リクエストURIではなく
	// WordPress が解決したパスから組み立てる（クエリは引き継がない）。
	global $wp;
	$current = esc_url_raw( home_url( '/' . ltrim( (string) ( $wp->request ?? '' ), '/' ) ) );

	if ( 'ok' === $state ) {
		return sprintf(
			'<div class="sp-form"><p class="sp-h3">%s</p></div>',
			esc_html( sp_t( 'about.formSuccess' ) )
		);
	}

	$html  = sprintf( '<form class="sp-form" method="post" action="%s">', $action );
	$html .= '<input type="hidden" name="action" value="sp_lead" />';
	$html .= sprintf( '<input type="hidden" name="sp_redirect" value="%s" />', esc_attr( $current ) );
	// ハニーポット（人には見えない。ボットが埋めたら破棄する）
	$html .= '<p class="sp-visually-hidden"><label for="' . esc_attr( $form_id . '-hp' ) . '">入力しないでください</label><input id="' . esc_attr( $form_id . '-hp' ) . '" type="text" name="sp_hp" value="" tabindex="-1" autocomplete="off" /></p>';

	$html .= '<div class="sp-form__row">';
	$html .= sprintf(
		'<div class="sp-field"><label class="sp-label" for="%1$s-name">%2$s</label><input class="sp-input" id="%1$s-name" type="text" name="sp_name" maxlength="200" placeholder="%3$s" /></div>',
		esc_attr( $form_id ),
		esc_html( sp_t( 'form.name' ) ),
		esc_attr( sp_t( 'form.namePlaceholder' ) )
	);
	$html .= sprintf(
		'<div class="sp-field"><label class="sp-label" for="%1$s-email">%2$s</label><input class="sp-input" id="%1$s-email" type="email" name="sp_email" required placeholder="%3$s" /></div>',
		esc_attr( $form_id ),
		esc_html( sp_t( 'form.email' ) ),
		esc_attr( sp_t( 'form.emailPlaceholder' ) )
	);
	$html .= '</div>';
	$html .= sprintf(
		'<div class="sp-field" style="margin-top:0.75rem"><label class="sp-label" for="%1$s-message">%2$s</label><textarea class="sp-textarea" id="%1$s-message" name="sp_message" rows="5" required placeholder="%3$s"></textarea></div>',
		esc_attr( $form_id ),
		esc_html( sp_t( 'form.message' ) ),
		esc_attr( sp_t( 'form.messagePlaceholder' ) )
	);
	$html .= sprintf(
		'<p style="margin-top:0.75rem"><button class="sp-btn sp-btn--primary" type="submit">%s</button></p>',
		esc_html( sp_t( 'about.formCta' ) )
	);

	if ( 'error' === $state ) {
		$html .= sprintf( '<p class="sp-form__error">%s</p>', esc_html( sp_t( 'form.error' ) ) );
	} elseif ( 'short' === $state ) {
		$html .= sprintf( '<p class="sp-form__error">%s</p>', esc_html( sp_t( 'form.messageTooShort' ) ) );
	}

	$html .= '</form>';
	return $html;
}

/**
 * 廃止した [sp_lead_form] の受け皿。
 *
 * メール登録フォームは 2026-09-26 に廃止しました。過去にこのショートコードを
 * 書いたページが残っていても、その文字列がそのまま表示されないように、
 * 何も出さずに終わります（ショートコード自体は登録したままにします）。
 */
function sp_shortcode_lead_form(): string {
	return '';
}
add_shortcode( 'sp_lead_form', 'sp_shortcode_lead_form' );

function sp_shortcode_contact_form(): string {
	return sp_render_form();
}
add_shortcode( 'sp_contact_form', 'sp_shortcode_contact_form' );

function sp_handle_lead() {
	$redirect = isset( $_POST['sp_redirect'] ) ? esc_url_raw( wp_unslash( $_POST['sp_redirect'] ) ) : home_url( '/' );

	// ハニーポットが埋まっていたら、成功したように見せて保存しない。
	if ( ! empty( $_POST['sp_hp'] ) ) {
		wp_safe_redirect( add_query_arg( 'sp_lead', 'ok', $redirect ) );
		exit;
	}

	$email   = isset( $_POST['sp_email'] ) ? sanitize_email( wp_unslash( $_POST['sp_email'] ) ) : '';
	$name    = isset( $_POST['sp_name'] ) ? sanitize_text_field( wp_unslash( $_POST['sp_name'] ) ) : '';
	$message = isset( $_POST['sp_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['sp_message'] ) ) : '';

	if ( ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'sp_lead', 'error', $redirect ) );
		exit;
	}
	$message_length = function_exists( 'mb_strlen' ) ? mb_strlen( $message ) : strlen( $message );
	if ( $message_length < 10 ) {
		wp_safe_redirect( add_query_arg( 'sp_lead', 'short', $redirect ) );
		exit;
	}

	$lead_id = wp_insert_post(
		array(
			'post_type'    => 'sp_lead',
			'post_status'  => 'private',
			'post_title'   => $email,
			'post_content' => $message,
		)
	);
	if ( $lead_id && ! is_wp_error( $lead_id ) ) {
		update_post_meta( $lead_id, 'sp_name', $name );
		// 2026-09-26 以降、届くのはお問い合わせだけです（メール登録は廃止）。
		update_post_meta( $lead_id, 'sp_variant', 'message' );
		update_post_meta( $lead_id, 'sp_source', $redirect );
	}

	$subject = sprintf(
		'【%s】%s',
		wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ),
		'お問い合わせ'
	);
	$body = "メール: {$email}\n";
	if ( $name ) {
		$body .= "お名前: {$name}\n";
	}
	$body .= "ページ: {$redirect}\n";
	if ( $message ) {
		$body .= "\n{$message}\n";
	}
	wp_mail( get_option( 'admin_email' ), $subject, $body );

	wp_safe_redirect( add_query_arg( 'sp_lead', 'ok', $redirect ) );
	exit;
}
add_action( 'admin_post_nopriv_sp_lead', 'sp_handle_lead' );
add_action( 'admin_post_sp_lead', 'sp_handle_lead' );

/* ---------------------------------------------------------------
 * 廃止したURLの受け皿
 * ------------------------------------------------------------- */
/**
 * 廃止した /cheat-sheet/ を、ツール一覧へ301で送る。
 *
 * ページ本体は inc/health.php の点検がゴミ箱へ移すため、そのままでは404に
 * なります。古いリンクや検索結果から来た読者を、いちばん近い一覧へ案内します。
 */
function sp_redirect_retired_paths(): void {
	if ( is_admin() ) {
		return;
	}
	global $wp;
	$path = trim( (string) ( $wp->request ?? '' ), '/' );
	if ( 'cheat-sheet' !== $path ) {
		return;
	}
	$target = get_post_type_archive_link( 'sp_tool' );
	if ( $target ) {
		wp_safe_redirect( $target, 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sp_redirect_retired_paths' );
