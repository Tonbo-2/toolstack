<?php
/**
 * Template Name: ワークフロー・チートシート
 *
 * 印刷できる1ページ。業務ごとに使うツールと、避けるべき場面を並べます。
 * 印刷時はヘッダー・フッター・登録フォームを出しません（style.css の @media print）。
 */
get_header();

$sp_tool_links = array();
foreach ( sp_tools_query() as $sp_tool ) {
	$sp_tool_links[ get_post_field( 'post_name', $sp_tool->ID ) ] = $sp_tool;
}
?>
<section id="sheet-intro" class="sp-page-head sp-no-print">
	<div class="sp-container sp-container--narrow">
		<h1 class="sp-h1"><?php echo esc_html( sp_t( 'cheat.title' ) ); ?></h1>
		<p class="sp-lead" style="margin-top:1rem;max-width:42rem"><?php echo esc_html( sp_t( 'cheat.lead' ) ); ?></p>
		<p class="sp-small" style="margin-top:1.5rem"><?php echo esc_html( sp_t( 'cheat.rule' ) ); ?></p>
		<div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1.5rem">
			<button class="sp-btn sp-btn--secondary" type="button" data-sp-print><?php echo esc_html( sp_t( 'cheat.printLabel' ) ); ?></button>
			<a class="sp-btn sp-btn--secondary" href="<?php echo esc_url( get_post_type_archive_link( 'sp_tool' ) ); ?>"><?php echo esc_html( sp_t( 'cheat.openDirectory' ) ); ?></a>
		</div>
	</div>
</section>

<section id="sheet" class="sp-section">
	<div class="sp-container sp-container--narrow">
		<table class="sp-table sp-table--sheet">
			<caption class="sp-visually-hidden"><?php echo esc_html( sp_t( 'cheat.caption' ) ); ?></caption>
			<thead>
				<tr>
					<th scope="col"><?php echo esc_html( sp_t( 'cheat.columnJob' ) ); ?></th>
					<th scope="col"><?php echo esc_html( sp_t( 'cheat.columnReach' ) ); ?></th>
					<th scope="col"><?php echo esc_html( sp_t( 'cheat.columnSkip' ) ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( sp_cheat_rows() as $sp_row ) : ?>
					<tr>
						<th scope="row" data-label="<?php echo esc_attr( sp_t( 'cheat.columnJob' ) ); ?>"><?php echo esc_html( $sp_row['job'] ); ?></th>
						<td data-label="<?php echo esc_attr( sp_t( 'cheat.columnReach' ) ); ?>">
							<ul class="sp-picks">
								<?php
								foreach ( $sp_row['picks'] as $sp_slug ) :
									if ( ! isset( $sp_tool_links[ $sp_slug ] ) ) {
										continue;
									}
									?>
									<li><a href="<?php echo esc_url( get_permalink( $sp_tool_links[ $sp_slug ] ) ); ?>"><?php echo esc_html( $sp_tool_links[ $sp_slug ]->post_title ); ?></a></li>
								<?php endforeach; ?>
							</ul>
						</td>
						<td data-label="<?php echo esc_attr( sp_t( 'cheat.columnSkip' ) ); ?>"><?php echo esc_html( $sp_row['skip'] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>

		<p class="sp-xs" style="margin-top:2rem">
			<?php echo esc_html( sp_t( 'cheat.noteBefore' ) ); ?>
			<a href="<?php echo esc_url( sp_page_url( 'disclosure' ) ); ?>"><?php echo esc_html( sp_t( 'cheat.noteLink' ) ); ?></a>
			<?php echo esc_html( sp_t( 'cheat.noteAfter' ) ); ?>
		</p>
	</div>
</section>

<section id="list" class="sp-section sp-section--card sp-no-print">
	<div class="sp-container sp-container--narrow sp-columns">
		<div>
			<h2 class="sp-h2"><?php echo esc_html( sp_t( 'cheat.listTitle' ) ); ?></h2>
			<p class="sp-small" style="margin-top:0.75rem"><?php echo esc_html( sp_t( 'cheat.listLead' ) ); ?></p>
		</div>
		<div><?php echo sp_render_form( 'email', 'light' ); // phpcs:ignore WordPress.Security.EscapeOutput -- テーマが組み立てたフォーム。 ?></div>
	</div>
</section>

<?php get_footer(); ?>
