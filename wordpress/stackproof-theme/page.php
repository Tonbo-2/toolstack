<?php
/**
 * 固定ページ（このサイトについて／アフィリエイト開示／プライバシーポリシーなど）。
 */
get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article>
		<section class="sp-page-head">
			<div class="sp-container sp-container--narrow">
				<h1 class="sp-h1"><?php the_title(); ?></h1>
			</div>
		</section>
		<section class="sp-section">
			<div class="sp-container sp-container--narrow">
				<div class="sp-prose"><?php the_content(); ?></div>
			</div>
		</section>
	</article>
	<?php
endwhile;

get_footer();
