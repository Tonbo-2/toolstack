<?php
/**
 * 404（ページが見つからない）。
 */
get_header();
?>
<section class="sp-section sp-404">
	<div class="sp-container sp-container--narrow">
		<h1 class="sp-h1"><?php echo esc_html( sp_t( 'notFound.title' ) ); ?></h1>
		<p class="sp-lead" style="margin-top:1rem"><?php echo esc_html( sp_t( 'notFound.body' ) ); ?></p>
		<p style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:2rem">
			<a class="sp-btn sp-btn--primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php echo esc_html( sp_t( 'notFound.cta', array( 'site' => sp_brand()['name'] ) ) ); ?>
			</a>
			<a class="sp-btn sp-btn--secondary" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) ); ?>">
				<?php echo esc_html( sp_t( 'nav.directory' ) ); ?>
			</a>
		</p>
	</div>
</section>
<?php get_footer(); ?>
