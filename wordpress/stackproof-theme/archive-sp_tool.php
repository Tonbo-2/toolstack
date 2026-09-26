<?php
/**
 * ツール一覧（/tools/）。検索とカテゴリ絞り込みつきの比較表。
 * 絞り込みは assets/js/site.js が行い、JavaScript が無い場合は全件を表示します。
 *
 * ファイル名は投稿タイプ sp_tool のアーカイブ（archive-sp_tool.php）。
 */
get_header();

$sp_tools      = sp_tools_query();
$sp_categories = sp_categories();
?>
<section class="sp-page-head">
	<div class="sp-container">
		<h1 class="sp-h1"><?php echo esc_html( sp_t( 'tools.title' ) ); ?></h1>
		<p class="sp-lead sp-head__lead"><?php echo esc_html( sp_t( 'tools.lead', array( 'tools' => count( $sp_tools ) ) ) ); ?></p>
	</div>
</section>

<section class="sp-section">
	<div class="sp-container"
		data-sp-explorer
		data-shown-one="<?php echo esc_attr( sp_t( 'explorer.shownOne' ) ); ?>"
		data-shown-many="<?php echo esc_attr( sp_t( 'explorer.shownMany' ) ); ?>">

		<div style="display:flex;flex-direction:column;gap:1rem">
			<div>
				<label class="sp-visually-hidden" for="sp-search"><?php echo esc_html( sp_t( 'explorer.searchLabel' ) ); ?></label>
				<input class="sp-input" id="sp-search" type="search" placeholder="<?php echo esc_attr( sp_t( 'explorer.searchPlaceholder' ) ); ?>" data-sp-search />
			</div>
			<div style="display:flex;flex-wrap:wrap;gap:0.5rem">
				<button class="sp-chip is-active" type="button" data-sp-category=""><?php echo esc_html( sp_t( 'explorer.allTools' ) ); ?></button>
				<?php foreach ( $sp_categories as $sp_slug => $sp_data ) : ?>
					<button class="sp-chip" type="button" data-sp-category="<?php echo esc_attr( $sp_slug ); ?>"><?php echo esc_html( $sp_data['label'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<p class="sp-small" data-sp-count>
				<?php
				echo esc_html(
					count( $sp_tools ) === 1
						? sp_t( 'explorer.shownOne' )
						: sp_t( 'explorer.shownMany', array( 'count' => count( $sp_tools ) ) )
				);
				?>
			</p>
		</div>

		<div class="sp-table-wrap">
			<table class="sp-table">
				<caption class="sp-visually-hidden"><?php echo esc_html( sp_t( 'explorer.caption' ) ); ?></caption>
				<thead>
					<tr>
						<th scope="col"><?php echo esc_html( sp_t( 'explorer.columnTool' ) ); ?></th>
						<th scope="col"><?php echo esc_html( sp_t( 'explorer.columnCategory' ) ); ?></th>
						<th scope="col"><?php echo esc_html( sp_t( 'explorer.columnBestFor' ) ); ?></th>
						<th scope="col"><?php echo esc_html( sp_t( 'explorer.columnWatchFor' ) ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					foreach ( $sp_tools as $sp_tool ) :
						$sp_category = sp_tool_category_label( $sp_tool->ID );
						$sp_best_for = (string) get_post_meta( $sp_tool->ID, 'best_for', true );
						$sp_watch    = (string) get_post_meta( $sp_tool->ID, 'watch_for', true );
						$sp_search   = sp_lower( $sp_tool->post_title . ' ' . $sp_category . ' ' . $sp_best_for . ' ' . get_post_meta( $sp_tool->ID, 'standout', true ) );
						?>
						<tr data-sp-row data-category="<?php echo esc_attr( sp_tool_category_slug( $sp_tool->ID ) ); ?>" data-search="<?php echo esc_attr( $sp_search ); ?>">
							<td class="sp-cell-name" data-label="<?php echo esc_attr( sp_t( 'explorer.columnTool' ) ); ?>">
								<span class="sp-cell-inner">
									<?php sp_tool_mark( $sp_tool->ID ); ?>
									<a href="<?php echo esc_url( get_permalink( $sp_tool ) ); ?>"><?php echo esc_html( $sp_tool->post_title ); ?></a>
								</span>
							</td>
							<td data-label="<?php echo esc_attr( sp_t( 'explorer.columnCategory' ) ); ?>"><?php echo esc_html( $sp_category ); ?></td>
							<td data-label="<?php echo esc_attr( sp_t( 'explorer.columnBestFor' ) ); ?>"><?php echo nl2br( esc_html( $sp_best_for ) ); ?></td>
							<td data-label="<?php echo esc_attr( sp_t( 'explorer.columnWatchFor' ) ); ?>"><?php echo nl2br( esc_html( $sp_watch ) ); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>

		<p class="sp-empty is-hidden" data-sp-empty><?php echo esc_html( sp_t( 'explorer.empty' ) ); ?></p>

		<p class="sp-xs" style="margin-top:2rem">
			<?php echo esc_html( sp_t( 'tools.disclosureBefore' ) ); ?>
			<a href="<?php echo esc_url( sp_page_url( 'disclosure' ) ); ?>"><?php echo esc_html( sp_t( 'tools.disclosureLink' ) ); ?></a>
			<?php echo esc_html( sp_t( 'tools.disclosureAfter' ) ); ?>
		</p>
	</div>
</section>

<?php get_footer(); ?>
