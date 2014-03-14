$(function() {
	// globals
	var resize = [];

	// fill table with exaple data
	var columns = 5;
	var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
	words = words.replace(/[.,]+/g, '').split(' ');
	function cells(tag, columns, amount) {
		var cells = '<tr>';
		for (var j = 0; j < columns; ++j)
			cells += '<' + tag + '>' + _.sample(words, amount).join(' ') + '</' + tag + '>';
		return cells + '</tr>';
	}
	$('.list thead').append(cells('th', columns, 2));
	for (var i = 0; i < 50; ++i)
		$('.list tbody').append(cells('td', columns, 5));

	// fix table header
	$('.list thead').css('position', 'fixed');
	resize.push(function() {
		$('.list').each(function() {
			var offset = $(this).find('thead').outerHeight();
			$(this).find('thead').css('margin-top', '-' + offset + 'px')
			$(this).css('padding-top', offset + 'px');
			$(this).outerHeight($(window).height() - $(this).offset().top);
		});
		var columns = $('.list tbody tr:first-child td').map(function() { return $(this).width(); });
		$('.list th').each(function(index) {
			if (index > columns.length) return;
			$(this).width(columns[index]);
		});
	});

	// on resize
	var timeout = false;
	$(window).resize(function() {
		resizecall();
		if(!timeout) {
			timeout = setTimeout(function() {
				timeout = false;
				resizecall();
			}, 100);
		} else clearTimeout(timeout);
	});
	function resizecall() {
		for (var i = 0; i < resize.length; ++i)
			resize[i]();
	}
	resizecall();
});
