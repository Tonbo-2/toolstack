<?php
/**
 * ブログ記事の1ページ。
 */
get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article>
		<section class="sp-page-head">
			<div class="sp-container sp-container--narrow">
				<time class="sp-small" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
				<h1 class="sp-h1" style="margin-top:0.75rem"><?php the_title(); ?></h1>
			</div>
		</section>
		<section class="sp-section">
			<div class="sp-container sp-container--narrow">
				<div class="sp-prose"><?php the_content(); ?></div>
				<p class="sp-small" style="margin-top:2.5rem">
					<a class="sp-link-underline" href="<?php echo esc_url( sp_page_url( 'blog' ) ); ?>"><?php echo esc_html( sp_t( 'blog.title' ) ); ?></a>
				</p>
			</div>
		</section>
	</article>
	<?php
endwhile;

get_footer();
