<?php
/**
 * 共通ヘッダー。ロゴとメニューを全ページに表示します。
 * メニューは「外観 → メニュー」で編集できます（未設定のときは既定のメニューを表示）。
 */
$sp_brand = sp_brand();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php if ( ! has_site_icon() ) : ?>
<link rel="icon" href="<?php echo esc_url( $sp_brand['icon'] ); ?>">
<?php endif; ?>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="sp-skip" href="#content"><?php echo esc_html( sp_t( 'a11y.skipToContent' ) ); ?></a>

<header class="sp-header">
	<div class="sp-container sp-header__bar">
		<?php if ( has_custom_logo() ) : ?>
			<?php the_custom_logo(); ?>
		<?php else : ?>
			<a class="sp-header__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( sp_t( 'a11y.homeAria', array( 'site' => $sp_brand['name'] ) ) ); ?>">
				<img src="<?php echo esc_url( $sp_brand['logo'] ); ?>" alt="<?php echo esc_attr( $sp_brand['name'] ); ?>" />
			</a>
		<?php endif; ?>

		<nav class="sp-nav sp-nav--desktop" aria-label="<?php echo esc_attr( sp_t( 'a11y.mainNav' ) ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'items_wrap'     => '<ul class="sp-nav__list">%3$s</ul>',
					'depth'          => 1,
					'fallback_cb'    => 'sp_nav_fallback',
				)
			);
			?>
		</nav>
	</div>

	<nav class="sp-nav sp-nav--mobile" aria-label="<?php echo esc_attr( sp_t( 'a11y.sectionsNav' ) ); ?>">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'items_wrap'     => '<ul class="sp-nav__list">%3$s</ul>',
				'depth'          => 1,
				'fallback_cb'    => 'sp_nav_fallback',
			)
		);
		?>
	</nav>
</header>

<main id="content">
