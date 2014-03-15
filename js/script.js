$(function() {
	// globals
	var resize = [];
	var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
	words = words.replace(/[.,]+/g, '').split(' ');

	// populate header
	for (var i = 0; i < 3; ++i)
		$('header').append('<a href="" class="button">' + _.sample(words) + '</a>');

	// populate list
	var columns = 5;
	function cells(tag, columns, amount) {
		var cells = '<tr>';
		for (var j = 0; j < columns; ++j)
			cells += '<' + tag + '>' + _.sample(words, amount).join(' ') + '</' + tag + '>';
		return cells + '</tr>';
	}
	$('.list thead').append(cells('th', columns, 2));
	for (var i = 0; i < 50; ++i)
		$('.list tbody').append(cells('td', columns, 5));

	// populate form
	$('.form').each(function() {
		for (var i = 0; i < 5; ++i) {
			var label = _.sample(words, 2).join(' ');
			var value = _.sample(words, 10).join(' ');
			$(this).append('<label>' + label + '<br><input type="text" value="' + value + '"></label>');
		}
	});

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

	// adjust text fields to content
	$('.form input[type=text]').each(function() {
		var element = $(this);
		// add element to measure pixel length of text
		var id = btoa(Math.floor(Math.random() * Math.pow(2, 64)));
		var tag = $('<span id="' + id + '">' + element.val() + '</span>').css({
			'display': 'none',
			'font-family': element.css('font-family'),
			'font-size': element.css('font-size'),
		}).appendTo('body');
		// adjust element width on keydown
		function update() {
			// give browser time to add current letter
			setTimeout(function() {
				// prevent whitespace from being collapsed
				tag.html(element.val().replace(/ /g, '&nbsp'));
				// clamp length and prevent text from scrolling
				var max = element.parent().width();
				var size = Math.max(100, Math.min(max, tag.width() + 10));
				if (size < max)
					element.scrollLeft(0);
				// apply width to element
				element.width(size);
			}, 0);
		};
		update();
		element.keydown(update);
		resize.push(update);
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
