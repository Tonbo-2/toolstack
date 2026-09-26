<?php
/**
 * Template Name: ワークフロー・チートシート（廃止）
 *
 * 2026-09-26 に廃止したページの受け皿です。
 * 設置済みサイトのページは inc/health.php の点検がゴミ箱へ移すので、
 * 通常このテンプレートは使われません。古いリンクや検索結果から
 * 直接来たときのために、ツール一覧へ301で送ります。
 */
wp_safe_redirect( get_post_type_archive_link( 'sp_tool' ), 301 );
exit;
