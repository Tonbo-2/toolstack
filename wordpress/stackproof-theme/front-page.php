<?php
/**
 * トップページ。ヒーロー → 評価の作り方 → 一覧の全体像 → 組み合わせ →
 * 最新記事 → このサイトにないもの → チートシート（暗い帯）。
 */
get_header();

$sp_brand      = sp_brand();
$sp_tools      = sp_tools_query();
$sp_categories = sp_categories();
$sp_stacks     = sp_stacks();
$sp_featured   = array();
foreach ( sp_featured_slugs() as $sp_slug ) {
	$sp_tool = sp_tool_by_slug( $sp_slug );
	if ( $sp_tool ) {
		$sp_featured[] = $sp_tool;
	}
}
$sp_recent = get_posts( array( 'post_type' => 'post', 'numberposts' => 3 ) );
?>

<section id="hero" class="sp-section">
	<div class="sp-container sp-hero">
		<div>
			<p class="sp-eyebrow"><?php echo esc_html( sp_t( 'home.eyebrow' ) ); ?></p>
			<h1 class="sp-h1 sp-hero__title"><?php echo esc_html( sp_t( 'home.title' ) ); ?></h1>
			<p class="sp-lead sp-hero__lead"><?php echo esc_html( sp_t( 'home.lead' ) ); ?></p>
			<div class="sp-hero__actions">
				<a class="sp-btn sp-btn--primary" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) ); ?>"><?php echo esc_html( sp_t( 'home.ctaPrimary' ) ); ?></a>
				<a class="sp-btn sp-btn--secondary" href="<?php echo esc_url( sp_page_url( 'cheat-sheet' ) ); ?>"><?php echo esc_html( sp_t( 'home.ctaSecondary' ) ); ?></a>
			</div>
			<p class="sp-small sp-hero__note"><?php echo esc_html( sp_t( 'home.heroNote' ) ); ?></p>
		</div>
		<figure class="sp-hero__figure">
			<img src="<?php echo esc_url( $sp_brand['heroImage'] ); ?>" alt="<?php echo esc_attr( sp_t( 'home.heroAlt' ) ); ?>" width="1600" height="900" fetchpriority="high" />
		</figure>
	</div>
</section>

<section id="method" class="sp-section sp-section--card">
	<div class="sp-container">
		<h2 class="sp-h2"><?php echo esc_html( sp_t( 'home.methodTitle' ) ); ?></h2>
		<ul class="sp-grid-4">
			<?php foreach ( sp_copy_path( 'home.method' ) as $sp_item ) : ?>
				<li class="sp-item-top">
					<h3 class="sp-item__title"><?php echo esc_html( $sp_item['title'] ); ?></h3>
					<p class="sp-item__body"><?php echo esc_html( $sp_item['body'] ); ?></p>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<section id="directory" class="sp-section">
	<div class="sp-container">
		<div class="sp-head">
			<div>
				<h2 class="sp-h2"><?php echo esc_html( sp_t( 'home.directoryTitle' ) ); ?></h2>
				<p class="sp-small sp-head__lead">
					<?php
					echo esc_html(
						sp_t(
							'home.directoryLead',
							array(
								'categories' => count( $sp_categories ),
								'tools'      => count( $sp_tools ),
							)
						)
					);
					?>
				</p>
			</div>
			<a class="sp-link-underline" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) ); ?>">
				<?php echo esc_html( sp_t( 'home.seeAll', array( 'tools' => count( $sp_tools ) ) ) ); ?>
			</a>
		</div>

		<ul class="sp-row-list">
			<?php foreach ( $sp_featured as $sp_tool ) : ?>
				<li class="sp-row">
					<span class="sp-row__name">
						<?php sp_tool_mark( $sp_tool->ID ); ?>
						<a href="<?php echo esc_url( get_permalink( $sp_tool ) ); ?>"><?php echo esc_html( $sp_tool->post_title ); ?></a>
					</span>
					<span class="sp-row__meta"><?php echo esc_html( sp_tool_category_label( $sp_tool->ID ) ); ?></span>
					<span class="sp-row__meta"><?php echo esc_html( get_post_meta( $sp_tool->ID, 'best_for', true ) ); ?></span>
				</li>
			<?php endforeach; ?>
		</ul>

		<p style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:2rem">
			<?php
			foreach ( $sp_categories as $sp_slug => $sp_data ) :
				$sp_term = get_term_by( 'slug', $sp_slug, 'sp_category' );
				?>
				<a class="sp-chip" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) . '?category=' . $sp_slug ); ?>">
					<?php echo esc_html( $sp_data['label'] ); ?>
					<span class="sp-chip__count"><?php echo esc_html( $sp_term ? (int) $sp_term->count : 0 ); ?></span>
				</a>
			<?php endforeach; ?>
		</p>
	</div>
</section>

<section id="stacks" class="sp-section sp-section--card">
	<div class="sp-container">
		<h2 class="sp-h2"><?php echo esc_html( sp_t( 'home.stacksTitle' ) ); ?></h2>
		<p class="sp-small sp-head__lead"><?php echo esc_html( sp_t( 'home.stacksLead' ) ); ?></p>

		<div style="margin-top:2rem">
			<?php foreach ( $sp_stacks as $sp_stack ) : ?>
				<article class="sp-stack">
					<div>
						<h3 class="sp-h3"><?php echo esc_html( $sp_stack['name'] ); ?></h3>
						<p class="sp-small" style="margin-top:0.5rem"><?php echo esc_html( $sp_stack['for_who'] ); ?></p>
					</div>
					<div>
						<ul class="sp-tags">
							<?php
							foreach ( $sp_stack['tools'] as $sp_slug ) :
								$sp_tool = sp_tool_by_slug( $sp_slug );
								if ( ! $sp_tool ) {
									continue;
								}
								?>
								<li>
									<a class="sp-chip" href="<?php echo esc_url( get_permalink( $sp_tool ) ); ?>">
										<?php sp_tool_mark( $sp_tool->ID, 'sm' ); ?>
										<?php echo esc_html( $sp_tool->post_title ); ?>
									</a>
								</li>
							<?php endforeach; ?>
						</ul>
						<p class="sp-small" style="margin-top:1rem"><?php echo esc_html( $sp_stack['why'] ); ?></p>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php if ( $sp_recent ) : ?>
<section id="teardowns" class="sp-section">
	<div class="sp-container">
		<h2 class="sp-h2"><?php echo esc_html( sp_t( 'home.teardownsTitle' ) ); ?></h2>
		<ul class="sp-cards">
			<?php foreach ( $sp_recent as $sp_post ) : ?>
				<li>
					<a class="sp-card" href="<?php echo esc_url( get_permalink( $sp_post ) ); ?>">
						<time class="sp-card__meta" datetime="<?php echo esc_attr( get_the_date( 'c', $sp_post ) ); ?>"><?php echo esc_html( get_the_date( '', $sp_post ) ); ?></time>
						<span class="sp-card__title"><?php echo esc_html( get_the_title( $sp_post ) ); ?></span>
						<?php if ( has_excerpt( $sp_post ) ) : ?>
							<span class="sp-card__body"><?php echo esc_html( wp_trim_words( get_the_excerpt( $sp_post ), 40, '…' ) ); ?></span>
						<?php endif; ?>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
<?php endif; ?>

<section id="policy" class="sp-section sp-section--card">
	<div class="sp-container sp-columns">
		<img src="<?php echo esc_url( $sp_brand['deskImage'] ); ?>" alt="<?php echo esc_attr( sp_t( 'home.deskAlt' ) ); ?>" width="1536" height="1024" loading="lazy" />
		<div>
			<h2 class="sp-h2"><?php echo esc_html( sp_t( 'home.policyTitle' ) ); ?></h2>
			<ul class="sp-small" style="margin-top:1.5rem;padding-left:1.1rem">
				<?php foreach ( sp_copy_path( 'home.policyItems' ) as $sp_item ) : ?>
					<li style="margin-top:0.75rem"><?php echo esc_html( $sp_item ); ?></li>
				<?php endforeach; ?>
			</ul>
			<p style="margin-top:1.5rem">
				<a class="sp-link-underline" href="<?php echo esc_url( sp_page_url( 'disclosure' ) ); ?>"><?php echo esc_html( sp_t( 'home.policyLink' ) ); ?></a>
			</p>
		</div>
	</div>
</section>

<section id="cheat-sheet" class="sp-section sp-section--dark">
	<div class="sp-container sp-columns sp-columns--wide-left">
		<div>
			<h2 class="sp-h2"><?php echo esc_html( sp_t( 'home.cheatTitle' ) ); ?></h2>
			<p class="sp-small" style="margin-top:1rem;max-width:36rem"><?php echo esc_html( sp_t( 'home.cheatLead' ) ); ?></p>
			<p class="sp-small" style="margin-top:1rem">
				<a style="text-decoration:underline;text-decoration-color:var(--sp-accent);text-underline-offset:4px" href="<?php echo esc_url( sp_page_url( 'cheat-sheet' ) ); ?>"><?php echo esc_html( sp_t( 'home.cheatRead' ) ); ?></a>
				<?php echo esc_html( sp_t( 'home.cheatJoinNote' ) ); ?>
			</p>
		</div>
		<div class="sp-panel">
			<?php echo sp_render_form( 'email', 'dark' ); // phpcs:ignore WordPress.Security.EscapeOutput -- テーマが組み立てたフォーム。 ?>
			<p class="sp-xs" style="margin-top:1rem;color:rgba(250,250,250,0.7)"><?php echo esc_html( sp_t( 'home.cheatFormNote' ) ); ?></p>
		</div>
	</div>
</section>

<?php get_footer(); ?>
