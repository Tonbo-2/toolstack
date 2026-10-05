/**
 * ToolStack テーマの小さな動作。
 *  - ツール一覧の検索とカテゴリ絞り込み（JavaScript が無い場合は全件表示のまま）
 * 装飾ではなく操作のための機能なので、動きは最小限です。
 */
(function () {
	'use strict';

	/* ツール一覧の絞り込み */
	var explorer = document.querySelector('[data-sp-explorer]');
	if (explorer) {
		var search = explorer.querySelector('[data-sp-search]');
		var chips = Array.prototype.slice.call(explorer.querySelectorAll('[data-sp-category]'));
		var rows = Array.prototype.slice.call(explorer.querySelectorAll('[data-sp-row]'));
		var countLabel = explorer.querySelector('[data-sp-count]');
		var emptyMessage = explorer.querySelector('[data-sp-empty]');
		var shownOne = explorer.getAttribute('data-shown-one') || '';
		var shownMany = explorer.getAttribute('data-shown-many') || '{count}';
		var activeCategory = '';

		var apply = function () {
			var query = (search && search.value ? search.value : '').trim().toLowerCase();
			var shown = 0;

			rows.forEach(function (row) {
				var inCategory = !activeCategory || row.getAttribute('data-category') === activeCategory;
				var haystack = ((row.getAttribute('data-search') || '') + ' ' + (row.textContent || '')).toLowerCase();
				var inQuery = !query || haystack.indexOf(query) !== -1;
				var visible = inCategory && inQuery;
				row.classList.toggle('is-hidden', !visible);
				if (visible) {
					shown++;
				}
			});

			if (countLabel) {
				countLabel.textContent = shown === 1
					? shownOne
					: shownMany.replace('{count}', String(shown));
			}
			if (emptyMessage) {
				emptyMessage.classList.toggle('is-hidden', shown !== 0);
			}
		};

		if (search) {
			search.addEventListener('input', apply);
		}

		chips.forEach(function (chip) {
			chip.addEventListener('click', function () {
				activeCategory = chip.getAttribute('data-sp-category') || '';
				chips.forEach(function (item) {
					item.classList.toggle('is-active', item === chip);
				});
				apply();
			});
		});

		/* トップページのカテゴリから ?category=… で来たときに合わせる */
		var initial = '';
		if (window.URLSearchParams) {
			initial = new URLSearchParams(window.location.search).get('category') || '';
		}
		if (initial) {
			chips.forEach(function (chip) {
				var isActive = chip.getAttribute('data-sp-category') === initial;
				chip.classList.toggle('is-active', isActive);
				if (isActive) {
					activeCategory = initial;
				}
			});
		}

		apply();
	}
}());
