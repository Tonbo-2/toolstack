<?php
/**
 * ツールの個別レビュー（/tools/{slug}/）。
 * 評価・向いている人・メリット・注意点は編集画面の「レビュー項目」から読みます。
 * 「◯◯を見る」ボタンは /go/{slug} を経由し、クリック数を数えてから
 * 成果リンク（未設定ならベンダーURL）へ転送します。
 *
 * ファイル名は投稿タイプ sp_tool の単一表示（single-sp_tool.php）。
 */
get_header();

while ( have_posts() ) :
	the_post();
	$sp_id        = get_the_ID();
	$sp_category  = sp_tool_category_label( $sp_id );
	$sp_pairs_raw = (string) get_post_meta( $sp_id, 'pairs_with', true );
	$sp_pairs     = array_filter( array_map( 'trim', explode( ',', $sp_pairs_raw ) ) );
	$sp_related   = array();
	foreach ( sp_tools_query( -1, sp_tool_category_slug( $sp_id ) ) as $sp_other ) {
		if ( $sp_other->ID !== $sp_id ) {
			$sp_related[] = $sp_other;
		}
	}
	?>
	<section class="sp-page-head">
		<div class="sp-container sp-container--narrow">
			<p class="sp-small">
				<a class="sp-link-underline" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) ); ?>"><?php echo esc_html( sp_t( 'tool.breadcrumb' ) ); ?></a>
			</p>
			<div class="sp-tool-head">
				<?php sp_tool_mark( $sp_id, 'lg' ); ?>
				<div>
					<h1 class="sp-h1"><?php the_title(); ?></h1>
					<p class="sp-tool-head__meta">
						<?php echo esc_html( $sp_category ? $sp_category . ' · ' : '' ); ?><?php echo esc_html( sp_reviewed_label( $sp_id ) ); ?>
					</p>
				</div>
			</div>
			<p class="sp-verdict"><?php echo esc_html( get_post_meta( $sp_id, 'verdict', true ) ); ?></p>
			<div class="sp-actions">
				<a class="sp-btn sp-btn--primary" href="<?php echo esc_url( sp_go_url( get_post_field( 'post_name', $sp_id ) ) ); ?>" target="_blank" rel="noopener noreferrer">
					<?php echo esc_html( sp_t( 'tool.visitLabel', array( 'name' => get_the_title() ) ) ); ?>
				</a>
				<span class="sp-actions__note"><?php echo esc_html( sp_t( 'tool.outboundNote' ) ); ?></span>
			</div>
		</div>
	</section>

	<section class="sp-section">
		<div class="sp-container sp-container--narrow">
			<dl class="sp-defs">
				<div class="sp-item-top">
					<dt class="sp-item__title" style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.06em"><?php echo esc_html( sp_t( 'tool.bestFor' ) ); ?></dt>
					<dd class="sp-defs__body"><?php echo nl2br( esc_html( get_post_meta( $sp_id, 'best_for', true ) ) ); ?></dd>
				</div>
				<div class="sp-item-top">
					<dt class="sp-item__title" style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.06em"><?php echo esc_html( sp_t( 'tool.standout' ) ); ?></dt>
					<dd class="sp-defs__body"><?php echo esc_html( get_post_meta( $sp_id, 'standout', true ) ); ?></dd>
				</div>
				<div class="sp-item-top sp-item-top--accent">
					<dt class="sp-item__title" style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.06em"><?php echo esc_html( sp_t( 'tool.watchFor' ) ); ?></dt>
					<dd class="sp-defs__body"><?php echo nl2br( esc_html( get_post_meta( $sp_id, 'watch_for', true ) ) ); ?></dd>
				</div>
			</dl>
		</div>
	</section>

	<?php if ( $sp_pairs ) : ?>
		<section class="sp-section sp-section--card">
			<div class="sp-container sp-container--narrow">
				<h2 class="sp-h2"><?php echo esc_html( sp_t( 'tool.runsBeside' ) ); ?></h2>
				<ul class="sp-pair-grid">
					<?php
					foreach ( $sp_pairs as $sp_slug ) :
						$sp_pair = sp_tool_by_slug( $sp_slug );
						if ( ! $sp_pair ) {
							continue;
						}
						?>
						<li>
							<a class="sp-pair" href="<?php echo esc_url( get_permalink( $sp_pair ) ); ?>">
								<?php sp_tool_mark( $sp_pair->ID ); ?>
								<span><?php echo esc_html( $sp_pair->post_title ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</section>
	<?php endif; ?>

	<?php if ( trim( (string) get_post_field( 'post_content', $sp_id ) ) !== '' ) : ?>
		<section class="sp-section">
			<div class="sp-container sp-container--narrow">
				<div class="sp-prose"><?php the_content(); ?></div>
			</div>
		</section>
	<?php endif; ?>

	<?php if ( $sp_related ) : ?>
		<section class="sp-section sp-section--card">
			<div class="sp-container sp-container--narrow">
				<h2 class="sp-h2"><?php echo esc_html( sp_t( 'tool.otherTools', array( 'category' => $sp_category ) ) ); ?></h2>
				<ul class="sp-row-list" style="border-top:0">
					<?php foreach ( $sp_related as $sp_other ) : ?>
						<li style="padding-block:1rem;border-bottom:1px solid var(--sp-border)">
							<p class="sp-row__name">
								<?php sp_tool_mark( $sp_other->ID, 'sm' ); ?>
								<a href="<?php echo esc_url( get_permalink( $sp_other ) ); ?>"><?php echo esc_html( $sp_other->post_title ); ?></a>
							</p>
							<p class="sp-row__meta" style="margin-top:0.5rem"><?php echo nl2br( esc_html( get_post_meta( $sp_other->ID, 'best_for', true ) ) ); ?></p>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</section>
	<?php endif; ?>
	<?php
endwhile;

get_footer();
