<?php
/**
 * テーマ有効化時の初期データ投入。
 *
 * ツール10件・カテゴリ5件・固定ページ5枚・メニューを作ります。
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
	// ワークフロー・チートシートのページは 2026-09-26 に廃止しました。
	// 新しくは作りません（設置済みサイトのページは inc/health.php がゴミ箱へ移します）。
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
	$html .= '<h2>' . esc_html( sp_t( 'disclosure.questionsTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'disclosure.questionsBefore' ) );
	$html .= '<a href="' . esc_url( sp_page_url( 'about' ) ) . '">' . esc_html( sp_t( 'disclosure.questionsLink' ) ) . '</a>';
	$html .= esc_html( sp_t( 'disclosure.questionsMid' ) ) . '</p>';
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
	$html .= '<h2>' . esc_html( sp_t( 'privacy.outboundTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'privacy.outboundBody' ) ) . '</p>';
	$html .= '<h2>' . esc_html( sp_t( 'privacy.removalTitle' ) ) . '</h2>';
	$html .= '<p>' . esc_html( sp_t( 'privacy.removalBefore' ) );
	$html .= '<a href="' . esc_url( sp_page_url( 'about' ) ) . '">' . esc_html( sp_t( 'privacy.removalLink' ) ) . '</a>';
	$html .= esc_html( sp_t( 'privacy.removalAfter' ) ) . '</p>';
	return $html;
}

/**
 * テーマが本文を持つ固定ページ（スラッグ => ページ名と本文の出どころ）。
 *
 * 「ホーム」「ブログ」の2枚は、本文をテーマが持っていない（WordPress 側の設定で
 * 決まる）ため、入れ替えの対象に入れていません。
 */
function sp_page_copy_targets(): array {
	return array(
		'about'      => array( 'title' => 'about.title', 'content' => 'sp_page_content_about' ),
		'disclosure' => array( 'title' => 'disclosure.title', 'content' => 'sp_page_content_disclosure' ),
		'privacy'    => array( 'title' => 'privacy.title', 'content' => 'sp_page_content_privacy' ),
	);
}

/**
 * 固定ページの本文とページ名を、テーマの新しい内容に合わせる（版ごとに1回）。
 *
 * 対象は「このサイトについて」「アフィリエイト開示」「プライバシーポリシー」の3枚です。
 * 本文は有効化のときにデータベースへ入るため、あとから inc/copy.php や
 * sp_page_content_*() を直しても、設置済みのサイトには入りません。そのため、
 * ここで入れ替えます（これまでは、管理画面から1ページずつ手で書き換えていただいて
 * いました）。
 *
 * 入れ替えるのは、編集画面で書き換えられていないページだけです。書き換えたページには
 * 印が付いているので（functions.php の sp_page_copy_edited_key()。保存のときに
 * sp_note_page_copy_edit() が付けます）、そのページはそのまま残し、件数だけお知らせに
 * 出します。
 *
 * 版は SP_PAGE_COPY_VERSION（functions.php）。inc/copy.php の文や本文の組み立てを
 * 変えたら、その値を上げてください。戻り値は
 * array( 'body' => 入れ替えたページ数, 'title' => 直したページ名の数,
 *        'kept' => 手を入れたままにしたページ数, 'missing' => 見つからなかったページ数 )。
 */
function sp_sync_page_content(): array {
	$result = array(
		'body'    => 0,
		'title'   => 0,
		'kept'    => 0,
		'missing' => 0,
	);

	if ( SP_PAGE_COPY_VERSION === (string) get_option( 'sp_page_copy_version' ) ) {
		return $result; // この版は反映済み。
	}

	sp_copy_sync_running( true );

	foreach ( sp_page_copy_targets() as $slug => $page_data ) {
		$page = get_page_by_path( $slug );
		if ( ! $page || 'trash' === $page->post_status ) {
			$result['missing']++; // オーナーが消したページは、作り直しません。
			continue;
		}

		if ( get_post_meta( (int) $page->ID, sp_page_copy_edited_key( $slug ), true ) ) {
			$result['kept']++; // ご自身で書き換えたページは、そのままにします。
			continue;
		}

		$wanted_title = (string) sp_t( (string) $page_data['title'] );
		$wanted_body  = (string) call_user_func( $page_data['content'] );

		$title_differs = ( '' !== $wanted_title ) && ( (string) $page->post_title !== $wanted_title );
		$body_differs  = ( (string) $page->post_content !== $wanted_body );
		if ( ! $title_differs && ! $body_differs ) {
			continue; // すでに同じ内容。
		}

		$args = array( 'ID' => (int) $page->ID );
		if ( $title_differs ) {
			$args['post_title'] = $wanted_title;
		}
		if ( $body_differs ) {
			$args['post_content'] = $wanted_body;
		}
		wp_update_post( $args );

		if ( $title_differs ) {
			$result['title']++;
		}
		if ( $body_differs ) {
			$result['body']++;
		}
	}

	sp_copy_sync_running( false );
	update_option( 'sp_page_copy_version', SP_PAGE_COPY_VERSION, false );

	return $result;
}

/**
 * 固定ページを編集画面で書き換えたら印を付ける（入れ替えの対象から外します）。
 *
 * 保存の前後を比べられる post_updated を使います。テーマが入れ替えている最中は
 * sp_copy_sync_running() で区別し、印を付けません。文が変わっていない保存
 * （更新ボタンを押しただけ）と、テーマと同じ文に戻しただけの保存でも付けません。
 */
function sp_note_page_copy_edit( $post_id, $post_after, $post_before ) {
	if ( sp_copy_sync_running() || 'page' !== $post_after->post_type ) {
		return;
	}
	$targets = sp_page_copy_targets();
	$slug    = (string) $post_after->post_name;
	if ( ! isset( $targets[ $slug ] ) ) {
		return; // 入れ替えの対象ではないページ。
	}
	if ( 'auto-draft' === $post_after->post_status || 'trash' === $post_after->post_status ) {
		return;
	}

	$body_changed  = (string) $post_after->post_content !== (string) $post_before->post_content;
	$title_changed = (string) $post_after->post_title !== (string) $post_before->post_title;
	if ( ! $body_changed && ! $title_changed ) {
		return;
	}

	// テーマが入れる文と同じに戻しただけなら、印は付けません。
	$wanted_body  = (string) call_user_func( $targets[ $slug ]['content'] );
	$wanted_title = (string) sp_t( (string) $targets[ $slug ]['title'] );
	$body_same    = ( ! $body_changed ) || ( (string) $post_after->post_content === $wanted_body );
	$title_same   = ( ! $title_changed ) || ( (string) $post_after->post_title === $wanted_title );
	if ( $body_same && $title_same ) {
		return;
	}

	update_post_meta( (int) $post_id, sp_page_copy_edited_key( $slug ), 1 );
}
add_action( 'post_updated', 'sp_note_page_copy_edit', 10, 3 );

/**
 * ツールの説明文を、テーマの新しい内容に合わせる（版ごとに1回）。
 *
 * ツールの名前と説明文（向いている人・メリット・注意点・評価）は、有効化の
 * ときにデータベースへ入ります。あとからテーマ側の文言を直しても、設置済みの
 * サイトには入りません。そのため、ここで入れ替えます（これまでは、1つずつ
 * 管理画面から手で書き換えていただいていました）。
 *
 * 入れ替えるのは、編集画面で書き換えられていない欄だけです。書き換えた欄には
 * 印が付いているので（functions.php の sp_tool_copy_edited_key() と
 * 'sp_title_edited'）、その欄はそのまま残し、件数だけお知らせに出します。
 * 成果リンク・ベンダーURL・ロゴ・検証日・併用ツールは、管理画面が正なので
 * ここでは触りません。
 *
 * 版は SP_TOOL_COPY_VERSION（functions.php）。inc/data.php の文言を変えたら、
 * その値を上げてください。戻り値は
 * array( 'copy' => 入れ替えた欄の数, 'title' => 直した名前の数,
 *        'kept' => 手を入れたままにした欄の数, 'missing' => 見つからなかったツールの数 )。
 */
function sp_sync_tool_copy(): array {
	$result = array(
		'copy'    => 0,
		'title'   => 0,
		'kept'    => 0,
		'missing' => 0,
	);

	if ( SP_TOOL_COPY_VERSION === (string) get_option( 'sp_tool_copy_version' ) ) {
		return $result; // この版は反映済み。
	}

	sp_copy_sync_running( true );

	foreach ( sp_tools() as $tool ) {
		$post = sp_tool_by_slug( (string) $tool['slug'] );
		if ( ! $post ) {
			$result['missing']++; // オーナーが消したツールは、作り直しません。
			continue;
		}
		$post_id = (int) $post->ID;

		// 名前。編集画面で変えていたら触りません（Kit の「（旧ConvertKit）」など）。
		if ( ! get_post_meta( $post_id, 'sp_title_edited', true )
			&& (string) $post->post_title !== (string) $tool['name']
		) {
			wp_update_post(
				array(
					'ID'         => $post_id,
					'post_title' => (string) $tool['name'],
				)
			);
			$result['title']++;
		}

		foreach ( sp_tool_copy_fields() as $meta_key => $source_key ) {
			$current = (string) get_post_meta( $post_id, $meta_key, true );
			$wanted  = (string) $tool[ $source_key ];

			if ( get_post_meta( $post_id, sp_tool_copy_edited_key( $meta_key ), true ) ) {
				if ( $current !== $wanted ) {
					$result['kept']++; // ご自身で書き換えた欄は、そのままにします。
				}
				continue;
			}

			if ( $current === $wanted ) {
				continue; // すでに同じ内容。
			}

			update_post_meta( $post_id, $meta_key, $wanted );
			$result['copy']++;
		}
	}

	sp_copy_sync_running( false );
	update_option( 'sp_tool_copy_version', SP_TOOL_COPY_VERSION, false );

	return $result;
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
