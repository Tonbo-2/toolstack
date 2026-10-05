<?php
/**
 * 設置先のサイトを点検し、必要な直しを1回だけ行うモジュール。
 *
 * 対象は4つ。
 *  1. URLの形（サーバーが /tools/ のようなURLを返せるか）
 *  2. 古い404がキャッシュに残っていないか（サイトは正常なのに404が配られていないか）
 *  3. 有効化が二重に走ったときに増えた重複ツール
 *  4. メニュー項目の行き先（URLを固定せず、ページIDで参照し直す）
 *
 * 結果は管理画面の「お知らせ」に出ます。URLの形は「再チェック」から何度でも
 * やり直せます（サーバー設定やキャッシュを直したあとに押してください）。
 *
 * 1つのURLが404を返しただけで設定を変えることはしません。そのURLにだけ
 * 古い404が残っている場合があり、そこで素のURLに切り替えると、サイト全体の
 * URLが変わって /tools/ が本当に使えなくなるためです（実際に起きました）。
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** 直近の点検結果（オプションに1件だけ保存）。 */
function sp_health_state(): array {
	$state = get_option( 'sp_health' );
	return is_array( $state ) ? $state : array();
}

/** いまのURLの形（きれいなURLか、素のURLか）。 */
function sp_permalink_mode(): string {
	return get_option( 'permalink_structure' ) ? 'pretty' : 'plain';
}

/**
 * 1つのURLをHTTPで確かめ、HTTPステータスを返す（0は応答なし）。
 *
 * $fresh = true は、キャッシュを避けるための使い捨てクエリを付けて確かめる。
 * これは「WordPress まで届いているか」＝配信元の本当の状態を見るため。
 * $fresh = false は、訪問者が実際に開くURLそのものを見るため
 * （配信前のキャッシュに古い404が残っていないか）。
 * 2つを比べると「サイトは正常なのに、そのURLにだけ古い404が配られている」
 * 状態を見分けられる。
 */
function sp_probe_url( string $url, bool $fresh ): int {
	$target = $fresh ? add_query_arg( 'sp_check', time() . '-' . wp_rand( 10000, 99999 ), $url ) : $url;
	$res    = wp_remote_get(
		$target,
		array(
			'timeout'     => 10,
			'redirection' => 3,
			'sslverify'   => false,
			'user-agent'  => 'WordPress/' . get_bloginfo( 'version' ) . '; ' . home_url( '/' ) . ' (ToolStack theme check)',
		)
	);
	if ( is_wp_error( $res ) ) {
		return 0; // 応答そのものが無い（判定できない）。
	}
	return (int) wp_remote_retrieve_response_code( $res );
}

/** 確かめるURL（ツール一覧・固定ページ・ツール1件）。 */
function sp_probe_targets(): array {
	$targets = array();

	$archive = get_post_type_archive_link( 'sp_tool' );
	if ( $archive ) {
		$targets['tools'] = array( 'label' => 'ツール一覧', 'url' => (string) $archive );
	}

	$page = get_page_by_path( 'about' );
	if ( $page ) {
		$targets['page'] = array( 'label' => '固定ページ', 'url' => (string) get_permalink( $page ) );
	}

	$sample = get_posts(
		array(
			'post_type'   => 'sp_tool',
			'numberposts' => 1,
			'orderby'     => 'title',
			'order'       => 'ASC',
		)
	);
	if ( $sample ) {
		$targets['tool'] = array(
			'label' => 'ツール個別（' . $sample[0]->post_title . '）',
			'url'   => (string) get_permalink( $sample[0] ),
		);
	}

	return $targets;
}

/**
 * すべての確認先を調べる。
 *
 * 'fresh' はキャッシュを避けた確認（200なら WordPress は正常に応答している）。
 * 'bare' は訪問者が開くURLそのもの（404なら古い404が配られている）。
 * 往復を減らすため、素のURLはツール一覧だけを見る。
 */
function sp_probe_all(): array {
	$probes = array();
	foreach ( sp_probe_targets() as $key => $target ) {
		$probes[ $key ] = array(
			'label' => $target['label'],
			'url'   => $target['url'],
			'fresh' => sp_probe_url( $target['url'], true ),
			'bare'  => 0,
		);
	}
	if ( isset( $probes['tools'] ) ) {
		$probes['tools']['bare'] = sp_probe_url( $probes['tools']['url'], false );
	}
	return $probes;
}

/**
 * URLの形を「実際に開ける方」に合わせる。
 *
 * 判定は段階的に行います。1つのURLが404を返しただけでは素のURLに戻しません。
 * そのURLにだけ古い404がキャッシュに残っている、ということがあるためです
 * （実際に /tools/ で起きました。この状態で素のURLへ切り替えると、
 * サイト全体のURLが変わり、/tools/ と /llms.txt が本当に使えなくなります）。
 *
 *  - キャッシュを避けた確認で1つでも200が返れば、きれいなURLは使える → そのまま維持
 *  - すべて404なら、サーバーが対応していない → 素のURLへ戻す
 *  - 応答が無いものがあるときは、確かめられないので設定を変えない
 */
function sp_align_permalinks(): array {
	$changed  = false;
	$original = (string) get_option( 'permalink_structure' );

	if ( ! get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
		$changed = true;
	}
	flush_rewrite_rules( true ); // .htaccess も書き直す。

	$probes = sp_probe_all();

	$ok      = 0; // 200が返った
	$missing = 0; // 404が返った
	$unknown = 0; // 応答が無かった

	foreach ( $probes as $probe ) {
		$status = (int) $probe['fresh'];
		if ( 200 === $status ) {
			$ok++;
		} elseif ( 404 === $status || 410 === $status ) {
			$missing++;
		} else {
			$unknown++;
		}
	}

	$archive      = $probes['tools'] ?? array( 'url' => home_url( '/' ), 'fresh' => 0, 'bare' => 0 );
	$archive_bare = (int) $archive['bare'];
	// WordPress 側は正常なのに、訪問者が開くURLにだけ404が残っている状態。
	$stale_404 = ( 200 === (int) $archive['fresh'] && ( 404 === $archive_bare || 410 === $archive_bare ) );

	$common = array(
		'probes'    => $probes,
		'stale_404' => $stale_404,
	);

	if ( $ok > 0 ) {
		return array_merge( $common, array( 'mode' => 'pretty', 'code' => 'ok', 'changed' => $changed, 'url' => (string) $archive['url'] ) );
	}

	// きれいなURLが1つも開けず、応答そのものが無いものも無い → サーバーが対応していない。
	if ( $missing > 0 && 0 === $unknown ) {
		update_option( 'permalink_structure', '' );
		flush_rewrite_rules( true );
		return array_merge( $common, array( 'mode' => 'plain', 'code' => 'notfound', 'changed' => true, 'url' => (string) $archive['url'] ) );
	}

	// 判定できないときは設定を元に戻す（確かめられないままURLを変えない）。
	if ( (string) get_option( 'permalink_structure' ) !== $original ) {
		update_option( 'permalink_structure', $original );
		flush_rewrite_rules( true );
	}
	return array_merge( $common, array( 'mode' => sp_permalink_mode(), 'code' => 'unknown', 'changed' => false, 'url' => (string) $archive['url'] ) );
}

/**
 * よく使われるキャッシュの仕組みに、削除を頼む（入っていれば動く）。
 * サーバー会社が持っているキャッシュはここからは消せないため、
 * その場合は管理画面の案内にしたがってサーバー側で削除してもらう。
 */
function sp_purge_known_caches(): array {
	$done = array();

	if ( function_exists( 'wp_cache_clear_cache' ) ) { // WP Super Cache
		wp_cache_clear_cache();
		$done[] = 'WP Super Cache';
	}
	if ( function_exists( 'w3tc_flush_all' ) ) { // W3 Total Cache
		w3tc_flush_all();
		$done[] = 'W3 Total Cache';
	}
	if ( function_exists( 'rocket_clean_domain' ) ) { // WP Rocket
		rocket_clean_domain();
		$done[] = 'WP Rocket';
	}
	if ( has_action( 'litespeed_purge_all' ) ) { // LiteSpeed Cache
		do_action( 'litespeed_purge_all' );
		$done[] = 'LiteSpeed Cache';
	}
	if ( function_exists( 'sg_cachepress_purge_cache' ) ) { // SiteGround Optimizer
		sg_cachepress_purge_cache();
		$done[] = 'SiteGround Optimizer';
	}
	if ( function_exists( 'wp_cache_flush' ) ) {
		wp_cache_flush(); // オブジェクトキャッシュ（報告には出さない）。
	}

	/*
	 * LiteSpeed 系サーバーへの削除指示。
	 * この応答にヘッダーを付けると、サーバー側が該当URLのページキャッシュを消します
	 * （プラグインが入っていないサーバーでも効きます）。LiteSpeed 以外の
	 * サーバーでは無視されるだけです。
	 */
	if ( ! headers_sent() ) {
		header( 'X-LiteSpeed-Purge: /tools/, /tools, /llms.txt' );
		$done[] = 'LiteSpeed（サーバー側）';
	}

	return $done;
}

/**
 * 404の応答はキャッシュに残さない。
 *
 * 残ると、あとで直してもそのURLにだけ古い404が配られ続けます
 * （実際に /tools/ で起きたこと）。原因を直したあと、
 * 訪問者にすぐ正しいページが届くようにします。
 */
function sp_nocache_on_404() {
	if ( is_404() ) {
		nocache_headers();
	}
}
add_action( 'template_redirect', 'sp_nocache_on_404', 0 );

/**
 * 有効化が二重に走ったときに増えた重複ツールをゴミ箱へ移す。
 *
 * 消す条件は3つそろったときだけ。
 *  - スラッグが「正規のスラッグ-数字」
 *  - ベンダーURLが正規のものと一致
 *  - 発リンクのクリック数が0（記録があるものは残す）
 * ゴミ箱なので、管理画面から復元できます。
 */
function sp_repair_duplicate_tools(): int {
	$all = get_posts(
		array(
			'post_type'   => 'sp_tool',
			'post_status' => array( 'publish', 'draft', 'pending', 'private', 'future' ),
			'numberposts' => -1,
		)
	);
	if ( ! $all ) {
		return 0;
	}

	$names = array();
	foreach ( $all as $post ) {
		$names[ $post->post_name ] = true;
	}

	$trashed = 0;
	foreach ( sp_tools() as $tool ) {
		if ( ! isset( $names[ $tool['slug'] ] ) ) {
			continue; // 正規の1件が無いなら、何も消さない。
		}
		foreach ( $all as $post ) {
			if ( $post->post_name === $tool['slug'] ) {
				continue;
			}
			if ( ! preg_match( '/^' . preg_quote( $tool['slug'], '/' ) . '-\d+$/', $post->post_name ) ) {
				continue;
			}
			if ( get_post_meta( $post->ID, 'vendor_url', true ) !== $tool['url'] ) {
				continue;
			}
			if ( (int) get_post_meta( $post->ID, 'go_clicks', true ) > 0 ) {
				continue;
			}
			wp_trash_post( $post->ID );
			$trashed++;
		}
	}
	return $trashed;
}

/* ---------------------------------------------------------------
 * メニュー項目
 *
 * ページとツール一覧はURLではなくIDで参照します。こうしておくと、
 * パーマリンクの形が変わってもリンクが自動で追随します（固定URLだと
 * 一度書いたURLがそのまま残り、URLの形を変えた瞬間に全メニューが404になります）。
 * ------------------------------------------------------------- */

/** 管理画面で選べる行き先の一覧（スラッグ => 種別）。 */
function sp_menu_page_slugs(): array {
	return array( 'blog', 'about', 'disclosure', 'privacy' );
}

/** メニュー項目の行き先が、ツール一覧（/tools/ や ?post_type=sp_tool）かどうか。 */
function sp_is_tools_archive_url( string $url ): bool {
	$query = (string) wp_parse_url( $url, PHP_URL_QUERY );
	if ( $query ) {
		parse_str( $query, $args );
		if ( isset( $args['post_type'] ) && 'sp_tool' === $args['post_type'] ) {
			return true;
		}
	}
	$path      = (string) wp_parse_url( $url, PHP_URL_PATH );
	$home_path = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	$relative  = trim( substr( $path, strlen( rtrim( $home_path, '/' ) ) ), '/' );
	return in_array( $relative, array( 'tools', 'index.php/tools' ), true );
}

/** 行き先の指定（target）から、メニュー項目の保存用の値を組み立てる。 */
function sp_menu_item_args( string $label, array $target, int $position = 0 ): array {
	$args = array(
		'menu-item-title'    => $label,
		'menu-item-status'   => 'publish',
		'menu-item-position' => $position,
		'menu-item-type'     => 'custom',
		'menu-item-url'      => '',
	);

	if ( 'archive' === ( $target['type'] ?? '' ) ) {
		$args['menu-item-type']   = 'post_type_archive';
		$args['menu-item-object'] = 'sp_tool';
		return $args;
	}

	if ( 'page' === ( $target['type'] ?? '' ) ) {
		$page = get_page_by_path( (string) ( $target['slug'] ?? '' ) );
		if ( $page ) {
			$args['menu-item-type']      = 'post_type';
			$args['menu-item-object']    = 'page';
			$args['menu-item-object-id'] = (int) $page->ID;
			return $args;
		}
		$args['menu-item-url'] = home_url( '/' );
		return $args;
	}

	$args['menu-item-url'] = (string) ( $target['url'] ?? home_url( '/' ) );
	return $args;
}

/** いま保存されている項目が、どの行き先を指しているかを判定する（無関係なら null）。 */
function sp_menu_item_target( $item ): ?array {
	if ( 'post_type_archive' === $item->type && 'sp_tool' === $item->object ) {
		return array( 'type' => 'archive' );
	}

	if ( 'post_type' === $item->type && 'page' === $item->object && $item->object_id ) {
		foreach ( sp_menu_page_slugs() as $slug ) {
			$page = get_page_by_path( $slug );
			if ( $page && (int) $page->ID === (int) $item->object_id ) {
				return array( 'type' => 'page', 'slug' => $slug );
			}
		}
		if ( $item->url ) {
			return sp_menu_item_target_from_url( (string) $item->url );
		}
		return null;
	}

	return $item->url ? sp_menu_item_target_from_url( (string) $item->url ) : null;
}

/** URLから行き先を判定する（旧バージョンが入れた固定URLのため）。 */
function sp_menu_item_target_from_url( string $url ): ?array {
	if ( sp_is_tools_archive_url( $url ) ) {
		return array( 'type' => 'archive' );
	}

	/*
	 * 旧バージョンが保存した ?page_id=31 のようなURLを、IDから直接解く。
	 * url_to_postid() は設置先の環境によって0を返すことがあるため
	 * （その場合はメニューのリンクが古い形のまま直りません）、まず自分で見る。
	 */
	$query = (string) wp_parse_url( $url, PHP_URL_QUERY );
	if ( '' !== $query ) {
		parse_str( $query, $args );
		$page_id = 0;
		if ( isset( $args['page_id'] ) ) {
			$page_id = (int) $args['page_id'];
		} elseif ( isset( $args['p'] ) ) {
			$page_id = (int) $args['p'];
		}
		if ( $page_id ) {
			foreach ( sp_menu_page_slugs() as $slug ) {
				$page = get_page_by_path( $slug );
				if ( $page && (int) $page->ID === $page_id ) {
					return array( 'type' => 'page', 'slug' => $slug );
				}
			}
		}
	}

	$id = (int) url_to_postid( $url );
	if ( $id ) {
		foreach ( sp_menu_page_slugs() as $slug ) {
			$page = get_page_by_path( $slug );
			if ( $page && (int) $page->ID === $id ) {
				return array( 'type' => 'page', 'slug' => $slug );
			}
		}
	}

	if ( '#stacks' === (string) wp_parse_url( $url, PHP_URL_FRAGMENT ) ) {
		return array( 'type' => 'custom', 'url' => home_url( '/#stacks' ) );
	}

	return null;
}

/**
 * 並び順・クラス・開き方など、オーナーが触ったところを引き継ぐ。
 *
 * wp_update_nav_menu_item() は、渡さなかった項目を初期値で上書きします
 * （行き先が消える、説明が空になる、など）。既存の項目を組み直すときは、
 * 必ずこれを足してから呼びます。
 */
function sp_menu_item_args_keep( $item, array $args ): array {
	$args['menu-item-db-id']       = (int) $item->ID;
	$args['menu-item-parent-id']   = (int) $item->menu_item_parent;
	$args['menu-item-target']      = (string) $item->target;
	$args['menu-item-classes']     = is_array( $item->classes ) ? implode( ' ', array_filter( $item->classes ) ) : (string) $item->classes;
	$args['menu-item-xfn']         = (string) $item->xfn;
	$args['menu-item-description'] = (string) $item->description;
	$args['menu-item-attr-title']  = (string) $item->attr_title;
	return $args;
}

/** 1件のメニュー項目を、動的な参照（または現在のURL）に直す。直したら true。 */
function sp_repair_menu_item( int $menu_id, $item, array $target ): bool {
	$args = sp_menu_item_args( (string) $item->title, $target, (int) $item->menu_order );

	// すでに同じ形なら触らない。
	// カスタム項目は WordPress 側が object を 'custom'、object_id を自分自身のIDとして
	// 保存するため、種類ではなくURLで比べる。
	if ( 'custom' === $args['menu-item-type'] ) {
		$same = ( 'custom' === $item->type && (string) $item->url === (string) $args['menu-item-url'] );
	} else {
		$same = ( (string) $item->type === (string) $args['menu-item-type'] )
			&& ( (string) $item->object === (string) ( $args['menu-item-object'] ?? '' ) )
			&& ( (int) $item->object_id === (int) ( $args['menu-item-object-id'] ?? 0 ) );
	}
	if ( $same ) {
		return false;
	}

	// 並び順・クラス・開き方など、オーナーが触ったところは残したまま行き先だけ直す。
	$args = sp_menu_item_args_keep( $item, $args );

	wp_update_nav_menu_item( $menu_id, (int) $item->ID, $args );
	return true;
}

/** 割り当て済みメニューの項目を点検して直す。直した件数を返す。 */
function sp_repair_menus(): int {
	$locations = get_theme_mod( 'nav_menu_locations' );
	if ( ! is_array( $locations ) ) {
		return 0;
	}

	$fixed = 0;
	foreach ( $locations as $menu_id ) {
		$items = wp_get_nav_menu_items( (int) $menu_id );
		if ( ! $items ) {
			continue;
		}
		foreach ( $items as $item ) {
			$target = sp_menu_item_target( $item );
			if ( ! $target ) {
				continue; // オーナーが足した項目には触らない。
			}
			if ( sp_repair_menu_item( (int) $menu_id, $item, $target ) ) {
				$fixed++;
			}
		}
	}
	return $fixed;
}

/**
 * メニューからチートシートの項目を外す（1回だけ）。外した件数を返す。
 *
 * 1.3.7 で、チートシートはメニューに載せない形にしました。設置済みのサイトでは
 * メニューの項目がデータベースに残っているため、行き先がチートシートの項目だけを
 * ここで外します。実行した印（sp_menu_cheat_removed）を残すので、あとから
 * オーナーが足し直した項目を消してしまうことはありません。
 *
 * 1.3.8 以降はページ本体も廃止したので、この処理は sp_retire_cheat_sheet_page()
 * から呼ばれます（1.3.7 の点検で一度走ったサイトでは、印が残っているため
 * 何もしません。項目はすでに外れています）。
 */
function sp_remove_cheat_sheet_menu_items(): int {
	if ( get_option( 'sp_menu_cheat_removed' ) ) {
		return 0;
	}
	update_option( 'sp_menu_cheat_removed', 1 );

	$locations = get_theme_mod( 'nav_menu_locations' );
	if ( ! is_array( $locations ) ) {
		return 0;
	}

	$removed = 0;
	foreach ( array_unique( array_map( 'intval', $locations ) ) as $menu_id ) {
		$items = wp_get_nav_menu_items( $menu_id );
		if ( ! $items ) {
			continue;
		}
		foreach ( $items as $item ) {
			$target = sp_menu_item_target( $item );
			if ( ! is_array( $target ) || 'page' !== (string) ( $target['type'] ?? '' ) || 'cheat-sheet' !== (string) ( $target['slug'] ?? '' ) ) {
				continue;
			}
			if ( wp_delete_post( (int) $item->ID, true ) ) {
				$removed++;
			}
		}
	}
	return $removed;
}

/**
 * メニューに残った古い呼び名を、いまの呼び名に直す（1回だけ）。直した件数を返す。
 *
 * リンクの名前（例:「運営方針と評価方法」）は、設置したときにWordPress側の
 * メニューへ保存されます。テーマの文言（inc/copy.php の nav.aboutMethodology）を
 * あとから直しても、設置済みのサイトでは古い呼び名のまま残り、「外観 → メニュー」で
 * 手直ししていただく必要がありました。ここでは、その古い呼び名が付いた項目だけを
 * いまの呼び名に直します（行き先・並び順・クラスなどはそのまま）。
 *
 * 実行した印（sp_menu_methodology_renamed）を残すので、あとからオーナーが
 * 別の名前に変えたものを戻してしまうことはありません。
 */
function sp_rename_retired_menu_labels(): int {
	if ( get_option( 'sp_menu_methodology_renamed' ) ) {
		return 0;
	}
	update_option( 'sp_menu_methodology_renamed', 1 );

	$locations = get_theme_mod( 'nav_menu_locations' );
	if ( ! is_array( $locations ) ) {
		return 0;
	}

	// 1.3.23 まで、フッターのリンクはこの呼び名で保存されていました。
	$retired = '運営方針と検証手法';
	$current = (string) sp_t( 'nav.aboutMethodology' );
	if ( '' === $current || $retired === $current ) {
		return 0;
	}

	$renamed = 0;
	foreach ( array_unique( array_map( 'intval', $locations ) ) as $menu_id ) {
		$items = wp_get_nav_menu_items( $menu_id );
		if ( ! $items ) {
			continue;
		}
		foreach ( $items as $item ) {
			if ( $retired !== (string) $item->title ) {
				continue;
			}
			// 行き先が「このサイトについて」の項目だけを直す
			// （同じ言葉を別の行き先に使っている項目には触らない）。
			$target = sp_menu_item_target( $item );
			if ( ! is_array( $target ) || 'page' !== (string) ( $target['type'] ?? '' ) || 'about' !== (string) ( $target['slug'] ?? '' ) ) {
				continue;
			}
			$args = sp_menu_item_args( $current, $target, (int) $item->menu_order );
			$args = sp_menu_item_args_keep( $item, $args );
			wp_update_nav_menu_item( $menu_id, (int) $item->ID, $args );
			$renamed++;
		}
	}
	return $renamed;
}

/**
 * 廃止したチートシートのページをゴミ箱へ移す（1回だけ）。
 *
 * 2026-09-26 に、ページ本体・トップページの案内・メール登録をまとめて外しました。
 * 設置済みのサイトには固定ページが残っているため、ここでゴミ箱へ移します。
 * 消してはいません。管理画面の「固定ページ → ゴミ箱」から戻せるので、判断を
 * やり直したくなったときは復元できます（実行した印 sp_cheat_sheet_retired）。
 *
 * 戻り値は array( 'menu' => 外したメニュー項目数, 'page' => 移したページ数 )。
 */
function sp_retire_cheat_sheet_page(): array {
	if ( get_option( 'sp_cheat_sheet_retired' ) ) {
		return array( 'menu' => 0, 'page' => 0 );
	}
	update_option( 'sp_cheat_sheet_retired', 1 );

	// メニューに残っている項目（1.3.7 の点検がまだ走っていないサイト）を外してから、
	// ページ本体をゴミ箱へ。順番はどちらでも構いませんが、先に項目を外しておくと
	// 行き先のないメニューが一瞬できません。
	$menu = sp_remove_cheat_sheet_menu_items();

	$page = get_page_by_path( 'cheat-sheet' );
	if ( ! $page || 'trash' === $page->post_status ) {
		return array( 'menu' => $menu, 'page' => 0 );
	}
	$trashed = wp_trash_post( (int) $page->ID ) ? 1 : 0;
	return array( 'menu' => $menu, 'page' => $trashed );
}

/* ---------------------------------------------------------------
 * 点検の実行とお知らせ
 * ------------------------------------------------------------- */

/**
 * サイトのタイトル（設定 → 一般）を推奨のものに一度だけ合わせる。
 *
 * 実行した印（sp_site_title_applied）を残すので、二度目以降は何もしません。
 * オーナーが管理画面で変えたタイトルを、再チェックのたびに戻してしまわないためです。
 * 変更したときだけ、その文字列を返します（お知らせ用）。
 */
function sp_apply_site_title(): string {
	if ( get_option( 'sp_site_title_applied' ) ) {
		return '';
	}
	update_option( 'sp_site_title_applied', 1 );

	$recommended = sp_site_title();
	if ( trim( (string) get_option( 'blogname' ) ) === $recommended ) {
		return ''; // すでに同じタイトル。
	}
	update_option( 'blogname', $recommended );
	return $recommended;
}

/**
 * 点検と修復をまとめて実行する。
 * $force = false のときは、このテーマの版でまだ実行していなければ走る。
 */
function sp_run_health_check( bool $force = false ): array {
	$state = sp_health_state();
	if ( ! $force && isset( $state['version'] ) && SP_THEME_VERSION === $state['version'] ) {
		return $state;
	}

	$title = sp_apply_site_title();
	$urls  = sp_align_permalinks();
	$dupes = sp_repair_duplicate_tools();
	$menus = sp_repair_menus();
	$sheet = sp_retire_cheat_sheet_page();
	// ツールの説明文を新しい内容に入れ替える（版ごとに1回。手を入れた欄は残す）。
	$copy  = sp_sync_tool_copy();
	// 決まった3ページ（このサイトについて・アフィリエイト開示・プライバシーポリシー）の
	// 本文とページ名も、同じ仕組みで入れ替える（版ごとに1回。書き換えたページは残す）。
	$pages = sp_sync_page_content();
	// メニューに残った古い呼び名（「運営方針と検証手法」）をいまの呼び名に直す（1回だけ）。
	$methodology = sp_rename_retired_menu_labels();

	// 古い404がキャッシュに残っているときだけ、心当たりのある仕組みに削除を頼む。
	$purged = array();
	if ( ! empty( $urls['stale_404'] ) ) {
		$purged = sp_purge_known_caches();
	}

	$state = array(
		'version'     => SP_THEME_VERSION,
		'mode'        => $urls['mode'],
		'code'        => $urls['code'],
		'probe'       => $urls['url'],
		'probes'      => is_array( $urls['probes'] ?? null ) ? $urls['probes'] : array(),
		'stale404'    => ! empty( $urls['stale_404'] ),
		'purged'      => $purged,
		'duplicates'  => $dupes,
		'menus'       => $menus,
		'cheat_menu'  => (int) ( $sheet['menu'] ?? 0 ),
		'cheat_page'  => (int) ( $sheet['page'] ?? 0 ),
		'copy'        => $copy,
		'pages'       => $pages,
		'methodology' => $methodology,
		'title'       => $title,
		'time'        => time(), // 時差の影響を受けないよう、保存はUNIX時刻で。
	);
	update_option( 'sp_health', $state, false );
	return $state;
}

/**
 * 管理画面を開いたときに点検する（オーナーの権限が必要）。
 *
 *  - テーマを更新した直後（この版でまだ点検していないとき）は、必ず1回走ります。
 *  - 注意が必要な状態のときは1時間おきに見直します。キャッシュが消えていれば
 *    警告も自然に消えるようにするためです（同じお知らせが出たままになりません）。
 */
function sp_health_check_on_admin() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$state = sp_health_state();

	if ( ! isset( $state['version'] ) || SP_THEME_VERSION !== $state['version'] ) {
		sp_run_health_check( true );
		return;
	}

	$needs_review = 'plain' === (string) ( $state['mode'] ?? '' )
		|| ! empty( $state['stale404'] )
		|| 'unknown' === (string) ( $state['code'] ?? '' );

	if ( $needs_review && ( time() - (int) ( $state['time'] ?? 0 ) > HOUR_IN_SECONDS ) ) {
		sp_run_health_check( true );
	}
}
add_action( 'admin_init', 'sp_health_check_on_admin' );

/** 「再チェック」ボタン。サーバー設定を直したあとに押してもらう。 */
function sp_handle_url_recheck() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html( 'この操作には管理者権限が必要です。' ) );
	}
	check_admin_referer( 'sp_recheck' );

	sp_run_health_check( true );

	$back = wp_get_referer();
	wp_safe_redirect( $back ? $back : admin_url() );
	exit;
}
add_action( 'admin_post_sp_recheck', 'sp_handle_url_recheck' );

/** 確認結果を1行で表す（0は応答なし）。 */
function sp_probe_status_label( int $status ): string {
	if ( 200 === $status ) {
		return '200（正常）';
	}
	if ( 404 === $status || 410 === $status ) {
		return $status . '（見つかりません）';
	}
	if ( 0 === $status ) {
		return '応答なし';
	}
	return $status . '（その他）';
}

/** 確認結果の表（お知らせ用）。中身はこの関数の中でエスケープ済み。 */
function sp_probe_table( $probes ): string {
	if ( ! is_array( $probes ) || ! $probes ) {
		return '';
	}
	$rows = '';
	foreach ( $probes as $probe ) {
		if ( ! is_array( $probe ) ) {
			continue;
		}
		$bare = (int) ( $probe['bare'] ?? 0 );
		$rows .= '<tr>'
			. '<td>' . esc_html( (string) ( $probe['label'] ?? '' ) ) . '</td>'
			. '<td><code>' . esc_html( (string) ( $probe['url'] ?? '' ) ) . '</code></td>'
			. '<td>' . esc_html( sp_probe_status_label( (int) ( $probe['fresh'] ?? 0 ) ) ) . '</td>'
			. '<td>' . ( $bare ? esc_html( sp_probe_status_label( $bare ) ) : esc_html( '（未確認）' ) ) . '</td>'
			. '</tr>';
	}
	if ( '' === $rows ) {
		return '';
	}
	return '<table class="widefat striped" style="max-width:1000px;margin:8px 0">'
		. '<thead><tr><th>確認したURL</th><th>URL</th><th>キャッシュを避けた確認</th><th>訪問者が開くURL</th></tr></thead>'
		. '<tbody>' . $rows . '</tbody></table>';
}

/** 点検結果のお知らせ（管理画面のみ）。 */
function sp_health_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$state = sp_health_state();
	if ( ! $state ) {
		return;
	}

	$recheck = wp_nonce_url( admin_url( 'admin-post.php?action=sp_recheck' ), 'sp_recheck' );
	$ago     = isset( $state['time'] ) ? (int) $state['time'] : 0;
	$fresh   = $ago && ( time() - $ago < 6 * HOUR_IN_SECONDS );
	$mode    = (string) ( $state['mode'] ?? 'plain' );
	$code    = (string) ( $state['code'] ?? '' );

	if ( 'plain' === $mode ) {
		?>
		<div class="notice notice-warning">
			<p><strong>ToolStack: サイト内のリンクの形について</strong></p>
			<p>
				このサーバーでは <code>/tools/</code> のような半角スラッシュのURLが開けませんでした（サーバーが404を返しています）。
				サイトが全ページ404にならないよう、いまは WordPress の素のURL（<code>?post_type=sp_tool</code> など）で運用しています。
				サイト内のリンク・メニュー・ツール一覧はすべて開きます。
				なお、この状態では <code>/llms.txt</code> は開けません（同じ内容は <code>?sp_llms=1</code> で返します）。サーバー設定を直すと <code>/llms.txt</code> も使えます。
			</p>
			<p>
				元のきれいなURL（<code>/tools/</code>）に戻すには、サーバー側で次を有効にしてから下の「再チェック」を押してください。
				Apache なら <code>.htaccess</code> を許可（<code>AllowOverride All</code>）、nginx なら <code>try_files $uri $uri/ /index.php?$args;</code> です。
			うまくいかない場合は <strong>設定 → パーマリンク</strong> を開き、「投稿名」を選んで保存してください。
			</p>
			<p>
				<a class="button button-secondary" href="<?php echo esc_url( $recheck ); ?>">再チェック</a>
				<code style="margin-left:8px"><?php echo esc_html( (string) ( $state['probe'] ?? '' ) ); ?></code>
			</p>
		</div>
		<?php
		return;
	}

	if ( 'unknown' === $code ) {
		?>
		<div class="notice notice-warning">
			<p><strong>ToolStack: URLの形を自動で判定できませんでした</strong></p>
			<p>
				このサーバー自身から <code>/tools/</code> を開けなかったため、自動での判定を見送りました（設定は変更していません）。
				ブラウザでサイトを開き、メニューの「ツール」「ブログ」などが表示されるかご確認ください。
				もし404になる場合は <strong>設定 → パーマリンク</strong> を開き、「基本」を選んで保存してください（サイト内のリンクが開くようになります）。
				サーバー側を直したあとは、下の「再チェック」で元のきれいなURLに戻せます。
			</p>
			<p>
				<a class="button button-secondary" href="<?php echo esc_url( $recheck ); ?>">再チェック</a>
				<code style="margin-left:8px"><?php echo esc_html( (string) ( $state['probe'] ?? '' ) ); ?></code>
			</p>
		</div>
		<?php
		return;
	}

	// WordPress 側は正常なのに、訪問者が開くURLにだけ古い404が残っている状態。
	if ( ! empty( $state['stale404'] ) ) {
		$purged    = is_array( $state['purged'] ?? null ) ? $state['purged'] : array();
		$tools_url = (string) ( $state['probe'] ?? '/tools/' );
		?>
		<div class="notice notice-warning">
			<p><strong>ToolStack: ツール一覧のURLに古い404が残っています（サイトの設定は正常です）</strong></p>
			<p>
				下の表のとおり、WordPress 側では <code><?php echo esc_html( $tools_url ); ?></code> は正常に応答しています（「キャッシュを避けた確認」が200）。
				ところが、訪問者が実際に開くURLには <strong>404（見つかりません）が保存されたまま</strong>で、そのURLだけ404が返ります。
				サイトの設定ではなく、<strong>サーバー（またはCDN）のページキャッシュに残った古い404</strong>が原因です。
				そのままだと、キャッシュの期限が切れるまで404が配られ続けます。
				同じ理由で <code>/llms.txt</code> に404が残っていることもあります（下の手順で一緒に直ります）。
			</p>
			<?php echo sp_probe_table( $state['probes'] ?? array() ); // phpcs:ignore WordPress.Security.EscapeOutput -- sp_probe_table() の中でエスケープ済み。 ?>
			<p>直し方は、次のとおりです。</p>
			<ol style="list-style:decimal;margin-left:1.5em">
				<li>
					ご契約のサーバーの管理画面で<strong>キャッシュを削除</strong>してください
					（「キャッシュ削除」「サイトキャッシュのクリア」などの名前です。Cloudflare などのCDNを使っている場合は、そちらでも削除してください）。
				</li>
				<li>そのあと、下の<strong>「再チェック」</strong>を押してください。404が消えていれば、この警告も消えます。</li>
			</ol>
			<?php if ( $purged ) : ?>
				<p>
					この点検で、次の仕組みには削除を依頼しました: <code><?php echo esc_html( implode( ' / ', $purged ) ); ?></code>。
					サーバー会社が持っているキャッシュはここからは削除できないため、上記の手順が必要です。
				</p>
			<?php endif; ?>
			<p>
				<a class="button button-secondary" href="<?php echo esc_url( $recheck ); ?>">再チェック</a>
				<span style="margin-left:8px">最終確認: <?php echo esc_html( $ago ? date_i18n( 'Y年n月j日 H:i', $ago ) : '未確認' ); ?></span>
			</p>
		</div>
		<?php
		return;
	}

	if ( ! $fresh ) {
		return; // 直した報告だけ、しばらくの間出します。
	}

	$dupes = (int) ( $state['duplicates'] ?? 0 );
	$menus = (int) ( $state['menus'] ?? 0 );
	$sheet = (int) ( $state['cheat_menu'] ?? 0 );
	$sheet_page = (int) ( $state['cheat_page'] ?? 0 );
	$title = (string) ( $state['title'] ?? '' );

	$copy        = is_array( $state['copy'] ?? null ) ? $state['copy'] : array();
	$copy_fields = (int) ( $copy['copy'] ?? 0 );
	$copy_titles = (int) ( $copy['title'] ?? 0 );
	$copy_kept   = (int) ( $copy['kept'] ?? 0 );

	$pages       = is_array( $state['pages'] ?? null ) ? $state['pages'] : array();
	$page_body   = (int) ( $pages['body'] ?? 0 );
	$page_titles = (int) ( $pages['title'] ?? 0 );
	$page_kept   = (int) ( $pages['kept'] ?? 0 );
	$renamed     = (int) ( $state['methodology'] ?? 0 );

	if ( ! $dupes && ! $menus && ! $sheet && ! $sheet_page && ! $copy_fields && ! $copy_titles && ! $copy_kept
		&& ! $page_body && ! $page_titles && ! $page_kept && ! $renamed && '' === $title ) {
		return;
	}
	?>
	<div class="notice notice-success is-dismissible">
		<p><strong>ToolStack: 点検で整えたところ</strong></p>
		<ul style="list-style:disc;margin-left:1.5em">
			<?php if ( $copy_fields || $copy_titles ) : ?>
				<li>
					ツールの説明文を新しい内容に更新しました（文章 <?php echo esc_html( (string) $copy_fields ); ?> か所<?php if ( $copy_titles ) : ?>・名前 <?php echo esc_html( (string) $copy_titles ); ?> 件<?php endif; ?>）。
					対象は「向いている人」「メリット」「注意点」「評価」で、ツール一覧・ツール個別ページ・トップページの一覧に反映されています。
				</li>
			<?php endif; ?>
			<?php if ( $copy_kept ) : ?>
				<li>
					ツールの説明文のうち <?php echo esc_html( (string) $copy_kept ); ?> か所は、管理画面で書き換えられた欄のため、そのままにしています。ご自身で書いた内容を、テーマが上書きすることはありません。
				</li>
			<?php endif; ?>
			<?php if ( $page_body || $page_titles ) : ?>
				<li>
					「このサイトについて」「アフィリエイト開示」「プライバシーポリシー」の本文を新しい内容に更新しました（本文 <?php echo esc_html( (string) $page_body ); ?> ページ<?php if ( $page_titles ) : ?>・ページ名 <?php echo esc_html( (string) $page_titles ); ?> 件<?php endif; ?>）。
					これまでは1ページずつ管理画面で書き換えていただく必要がありましたが、次からはテーマを入れ替えるだけで反映されます（これから先、管理画面で書き換えたページはそのまま残します）。
				</li>
			<?php endif; ?>
			<?php if ( $page_kept ) : ?>
				<li>
					固定ページのうち <?php echo esc_html( (string) $page_kept ); ?> ページは、管理画面で書き換えられたため、そのままにしています。ご自身で書いた内容を、テーマが上書きすることはありません。
				</li>
			<?php endif; ?>
			<?php if ( $renamed ) : ?>
				<li>
					メニューに残っていた古い呼び名「運営方針と検証手法」を「<?php echo esc_html( (string) sp_t( 'nav.aboutMethodology' ) ); ?>」に直しました（行き先・並び順はそのままです）。「外観 → メニュー」での手直しは不要になりました。
				</li>
			<?php endif; ?>
			<?php if ( '' !== $title ) : ?>
				<li>
					サイトのタイトルを「<?php echo esc_html( $title ); ?>」に設定しました。
					これは検索結果やタブに表示される名前です。別の名前にする場合は <strong>設定 → 一般</strong> の「サイトのタイトル」で変更してください（このテーマから、あとから戻すことはありません）。
				</li>
			<?php endif; ?>
			<?php if ( $dupes ) : ?>
				<li>同じツールが二重に登録されていたので、重複していた <?php echo esc_html( (string) $dupes ); ?> 件をゴミ箱へ移しました（管理画面の「ツール → ゴミ箱」から復元できます）。</li>
			<?php endif; ?>
			<?php if ( $menus ) : ?>
				<li>メニューの <?php echo esc_html( (string) $menus ); ?> か所のリンクを、URLを固定しない形に直しました（URLの形を変えてもリンクが切れなくなります）。</li>
			<?php endif; ?>
			<?php if ( $sheet ) : ?>
				<li>メニューから「チートシート」の項目を <?php echo esc_html( (string) $sheet ); ?> か所外しました。</li>
			<?php endif; ?>
			<?php if ( $sheet_page ) : ?>
				<li>廃止した「ワークフロー・チートシート」のページ <?php echo esc_html( (string) $sheet_page ); ?> 枚を<strong>ゴミ箱へ移しました</strong>（トップページの案内とメール登録も外しています）。消してはいないので、戻す場合は <strong>固定ページ → ゴミ箱</strong> から復元できます。</li>
			<?php endif; ?>
		</ul>
	</div>
	<?php
}
add_action( 'admin_notices', 'sp_health_notice' );
