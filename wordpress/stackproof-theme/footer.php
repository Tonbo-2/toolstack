<?php
/**
 * 共通フッター。ブランドの説明と規約系リンク。
 */
$sp_brand = sp_brand();
?>
</main>

<footer class="sp-footer">
	<div class="sp-container">
		<div class="sp-footer__grid">
			<div class="sp-footer__brand">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<img src="<?php echo esc_url( $sp_brand['logo'] ); ?>" alt="<?php echo esc_attr( $sp_brand['name'] ); ?>" />
					</a>
				<?php endif; ?>
				<p class="sp-footer__blurb"><?php echo esc_html( sp_t( 'site.blurb' ) ); ?></p>
			</div>

			<nav aria-label="<?php echo esc_attr( sp_t( 'a11y.footerNav' ) ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => false,
						'items_wrap'     => '<ul class="sp-nav__list">%3$s</ul>',
						'depth'          => 1,
						'fallback_cb'    => 'sp_nav_fallback',
						'sp_footer'      => true,
					)
				);
				?>
			</nav>
		</div>

		<div class="sp-footer__bottom">
			<p><?php echo esc_html( sp_t( 'site.copyright', array( 'year' => date_i18n( 'Y' ), 'site' => $sp_brand['name'] ) ) ); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
