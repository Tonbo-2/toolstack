<?php
/**
 * ブログ一覧（「設定 → 表示設定」でブログページに指定したページ）。
 * 記事は「投稿 → 新規追加」で書きます。検索結果もここで表示します。
 */
get_header();

$sp_is_search = is_search();
?>
<section class="sp-page-head">
	<div class="sp-container">
		<h1 class="sp-h1">
			<?php
			echo esc_html(
				$sp_is_search
					? sp_t( 'blog.searchTitle' ) . ': ' . get_search_query()
					: sp_t( 'blog.title' )
			);
			?>
		</h1>
		<p class="sp-lead sp-head__lead"><?php echo esc_html( sp_t( 'blog.lead' ) ); ?></p>
	</div>
</section>

<section class="sp-section">
	<div class="sp-container">
		<?php if ( have_posts() ) : ?>
			<ul class="sp-cards">
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<li>
						<a class="sp-card" href="<?php the_permalink(); ?>">
							<time class="sp-card__meta" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
							<span class="sp-card__title"><?php the_title(); ?></span>
							<?php if ( has_excerpt() ) : ?>
								<span class="sp-card__body"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 40, '…' ) ); ?></span>
							<?php endif; ?>
						</a>
					</li>
					<?php
				endwhile;
				?>
			</ul>

			<?php
			$sp_pagination = paginate_links(
				array(
					'prev_text' => '前のページ',
					'next_text' => '次のページ',
					'type'      => 'list',
				)
			);
			if ( $sp_pagination ) :
				?>
				<div class="sp-pagination"><?php echo wp_kses_post( $sp_pagination ); ?></div>
			<?php endif; ?>

		<?php else : ?>
			<div class="sp-empty">
				<h2 class="sp-h3"><?php echo esc_html( sp_t( 'blog.emptyTitle' ) ); ?></h2>
				<p class="sp-small" style="margin-top:0.75rem"><?php echo esc_html( sp_t( 'blog.emptyBody' ) ); ?></p>
				<p style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1.5rem">
					<a class="sp-btn sp-btn--primary" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) ); ?>"><?php echo esc_html( sp_t( 'blog.openDirectory' ) ); ?></a>
				</p>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php get_footer(); ?>
