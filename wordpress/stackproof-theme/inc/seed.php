<?php
/**
 * テーマ有効化時の初期データ投入。
 *
 * ツール10件・カテゴリ5件・固定ページ6枚・メニューを作ります。
 * すでに同じスラッグがあれば作り直しません（何度有効化しても重複しません）。
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function sp_seed_site() {
	sp_seed_taxonomy();
	sp_seed_tools();
	sp_seed_pages();
	sp_seed_menus();

	/*
	 * URLの形（パーマリンク）はここでは決めません。
	 * サーバーが /tools/ のようなURLを返せるかどうかは設置先ごとに違うため、
	 * 実際にHTTPで確かめてから決めます（inc/health.php の sp_align_permalinks()）。
	 * ここで決め打ちすると、サーバーが対応していない場合に全ページが404になります。
	 */
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'sp_seed_site' );

function sp_seed_taxonomy() {
	foreach ( sp_categories() as $slug => $data ) {
		if ( ! term_exists( $slug, 'sp_category' ) ) {
			wp_insert_term(
				$data['label'],
				'sp_category',
				array( 'slug' => $slug, 'description' => $data['blurb'] )
			);
		}
	}
}

/**
 * 同じスラッグのツールが既にあるか。
 *
 * スラッグ名で探します（get_page_by_path は階層のない投稿タイプでは
 * 取りこぼすことがあり、有効化が二重に走ったときに同じツールが増えます）。
 * ゴミ箱にあるものも「ある」と数えます（オーナーが消したものを復活させない）。
 */
function sp_seed_tool_exists( string $slug ): bool {
	// ゴミ箱に入れた投稿はスラッグの末尾が __trashed に変わるので、両方を見る。
	foreach ( array( $slug, $slug . '__trashed' ) as $name ) {
		$found = get_posts(
			array(
				'post_type'   => 'sp_tool',
				'name'        => $name,
				'post_status' => array( 'publish', 'draft', 'pending', 'private', 'future', 'trash' ),
				'numberposts' => 1,
				'fields'      => 'ids',
			)
		);
		if ( $found ) {
			return true;
		}
	}
	return false;
}

function sp_seed_tools() {
	foreach ( sp_tools() as $tool ) {
		if ( sp_seed_tool_exists( $tool['slug'] ) ) {
			continue;
		}
		$post_id = wp_insert_post(
			array(
				'post_type'   => 'sp_tool',
				'post_status' => 'publish',
				'post_title'  => $tool['name'],
				'post_name'   => $tool['slug'],
				// 本文は空のまま。長文の補足を書きたくなったら編集画面から足せます。
				'post_content' => '',
			)
		);
		if ( ! $post_id || is_wp_error( $post_id ) ) {
			continue;
		}
		$meta = array(
			'vendor_url'    => $tool['url'],
			'affiliate_url' => '',
			'logo_url'      => $tool['logo'],
			'reviewed'      => $tool['reviewed'],
			'best_for'      => $tool['best_for'],
			'standout'      => $tool['standout'],
			'watch_for'     => $tool['watch_for'],
			'verdict'       => $tool['verdict'],
			'pairs_with'    => $tool['pairs_with'],
		);
		foreach ( $meta as $key => $value ) {
			update_post_meta( $post_id, $key, $value );
		}
		wp_set_object_terms( $post_id, $tool['category'], 'sp_category' );
	}
}

/** スラッグで固定ページを1枚作る（既にあればそのIDを返す）。 */
function sp_seed_page( string $slug, string $title, string $content = '', string $template = '' ): int {
	$existing = get_page_by_path( $slug );
	if ( $existing ) {
		return (int) $existing->ID;
	}
	$post_id = wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_name'    => $slug,
			'post_content' => $content,
		)
	);
	if ( ! $post_id || is_wp_error( $post_id ) ) {
		return 0;
	}
	if ( $template ) {
		update_post_meta( $post_id, '_wp_page_template', $template );
	}
	return (int) $post_id;
}

function sp_seed_pages() {
	$home_id = sp_seed_page( 'home', 'ホーム' );
	sp_seed_page( 'blog', 'ブログ' );
	sp_seed_page( 'cheat-sheet', sp_t( 'cheat.title' ), '', 'page-cheat-sheet.php' );
	$about_id      = sp_seed_page( 'about', sp_t( 'about.title' ), sp_page_content_about() );
	sp_seed_page( 'disclosure', sp_t( 'disclosure.title' ), sp_page_content_disclosure() );
	sp_seed_page( 'privacy', sp_t( 'privacy.title' ), sp_page_content_privacy() );

	$blog_page = get_page_by_path( 'blog' );
	// フロントページが未設定のときだけ設定する（オーナーの設定を上書きしない）。
	if ( $home_id && $blog_page && ! get_option( 'page_on_front' ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_id );
		update_option( 'page_for_posts', (int) $blog_page->ID );
	}
}

function sp_page_content_about(): string {
	$html  = '<p>' . esc_html( sp_t( 'about.lead' ) ) . '</p>';
	$html .= '<p>' . esc_html( sp_t( 'about.lead2' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'about.rulesTitle' ) ) . '</h2>';
	$html .= '<ul class="sp-grid-4">';
	foreach ( sp_copy_path( 'about.rules' ) as $rule ) {
		$html .= '<li class="sp-item-top"><h3 class="sp-item__title">' . esc_html( $rule['title'] ) . '</h3>';
		$html .= '<p class="sp-item__body">' . esc_html( $rule['body'] ) . '</p></li>';
	}
	$html .= '</ul>';
	$html .= '<h2>' . esc_html( sp_t( 'about.fundingTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'about.funding' ) ) . '</p>';
	$html .= '<p><a href="' . esc_url( sp_page_url( 'disclosure' ) ) . '">' . esc_html( sp_t( 'about.fundingLink' ) ) . '</a></p>';
	$html .= '<h2>' . esc_html( sp_t( 'about.correctionsTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'about.correctionsBody' ) ) . '</p>';
	$html .= '<p>' . esc_html( sp_t( 'about.correctionsBody2' ) ) . '</p>';
	$html .= '[sp_contact_form]';
	return $html;
}

function sp_page_content_disclosure(): string {
	$html  = '<p class="sp-small">' . esc_html( sp_t( 'disclosure.date' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'disclosure.shortTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'disclosure.shortBody' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'disclosure.unchangedTitle' ) ) . '</h2>';
	$html .= '<ul>';
	foreach ( sp_copy_path( 'disclosure.unchangedItems' ) as $item ) {
		$html .= '<li>' . esc_html( $item ) . '</li>';
	}
	$html .= '</ul>';
	$html .= '<p>' . esc_html( sp_t( 'disclosure.unchangedOutro' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'disclosure.spotTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'disclosure.spotBefore' ) ) . '<code>' . esc_html( sp_t( 'disclosure.spotCode' ) ) . '</code>' . esc_html( sp_t( 'disclosure.spotAfter' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'disclosure.notDoTitle' ) ) . '</h2>';
	$html .= '<ul>';
	foreach ( sp_copy_path( 'disclosure.notDoItems' ) as $item ) {
		$html .= '<li>' . esc_html( $item ) . '</li>';
	}
	$html .= '</ul>';
	$html .= '<h2>' . esc_html( sp_t( 'disclosure.questionsTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'disclosure.questionsBefore' ) );
	$html .= '<a href="' . esc_url( sp_page_url( 'about' ) ) . '">' . esc_html( sp_t( 'disclosure.questionsLink' ) ) . '</a>';
	$html .= esc_html( sp_t( 'disclosure.questionsMid' ) );
	$html .= '<a href="' . esc_url( sp_page_url( 'privacy' ) ) . '">' . esc_html( sp_t( 'disclosure.questionsPrivacyLink' ) ) . '</a>';
	$html .= esc_html( sp_t( 'disclosure.questionsAfter' ) ) . '</p>';
	return $html;
}

function sp_page_content_privacy(): string {
	$html  = '<p class="sp-small">' . esc_html( sp_t( 'privacy.date' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'privacy.collectedTitle' ) ) . '</h2>';
	$html .= '<ul>';
	foreach ( sp_copy_path( 'privacy.collectedItems' ) as $item ) {
		$html .= '<li><strong>' . esc_html( $item['lead'] ) . '</strong>' . esc_html( $item['body'] ) . '</li>';
	}
	$html .= '</ul>';
	$html .= '<h2>' . esc_html( sp_t( 'privacy.notDoneTitle' ) ) . '</h2>';
	$html .= '<ul>';
	foreach ( sp_copy_path( 'privacy.notDoneItems' ) as $item ) {
		$html .= '<li>' . esc_html( $item ) . '</li>';
	}
	$html .= '</ul>';
	$html .= '<h2>' . esc_html( sp_t( 'privacy.outboundTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'privacy.outboundBody' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'privacy.removalTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'privacy.removalBefore' ) );
	$html .= '<a href="' . esc_url( sp_page_url( 'about' ) ) . '">' . esc_html( sp_t( 'privacy.removalLink' ) ) . '</a>';
	$html .= esc_html( sp_t( 'privacy.removalAfter' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'privacy.changesTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'privacy.changesBody' ) ) . '</p>';
	return $html;
}

function sp_seed_menus() {
	$locations = get_theme_mod( 'nav_menu_locations' );
	$locations = is_array( $locations ) ? $locations : array();

	$menus = array(
		'primary' => array( 'name' => 'メインメニュー', 'items' => sp_default_nav_items() ),
		'footer'  => array( 'name' => 'フッター', 'items' => sp_default_footer_items() ),
	);

	foreach ( $menus as $location => $menu_data ) {
		if ( ! empty( $locations[ $location ] ) ) {
			continue; // すでにメニューが割り当てられている。
		}
		$menu = wp_get_nav_menu_object( $menu_data['name'] );
		if ( $menu ) {
			$menu_id = (int) $menu->term_id;
		} else {
			$menu_id = wp_create_nav_menu( $menu_data['name'] );
		}
		if ( is_wp_error( $menu_id ) || ! $menu_id ) {
			continue;
		}
		if ( ! wp_get_nav_menu_items( $menu_id ) ) {
			$position = 0;
			foreach ( $menu_data['items'] as $item ) {
				$position++;
				// ページとツール一覧はIDで参照する（URLを固定しない）。
				// URLの形が変わっても、メニューのリンクが切れません。
				wp_update_nav_menu_item(
					$menu_id,
					0,
					sp_menu_item_args( $item['label'], (array) ( $item['target'] ?? array() ), $position )
				);
			}
		}
		$locations[ $location ] = $menu_id;
	}

	set_theme_mod( 'nav_menu_locations', $locations );
}
