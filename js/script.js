$(function() {
	// create sane resize event
	var resize = new Event('resizing');
	(function() {
		var timeout = false;
		$(window).resize(function() {
			if(!timeout) {
				timeout = setTimeout(function() {
					timeout = false;
					window.dispatchEvent(resize);
				}, 50);
			}
		});
		// trigger once at startup to initiailze
		window.dispatchEvent(resize);
		setTimeout(function() { window.dispatchEvent(resize); }, 50);
	})();

	// populate with content
	(function() {
		var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
		words = words.replace(/[.,]+/g, '').split(' ');

		// populate header buttons
		for (var i = 0; i < 3; ++i)
			$('header div.right').append('<a href="" class="button">' + _.sample(words) + '</a>');

		// populate list
		var columns = 6;
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
			for (var i = 0; i < 25; ++i) {
				var label = _.sample(words, 2).join(' ');
				var value = _.sample(words, 10).join(' ');
				$(this).append('<label>' + label + '<br><input type="text" placeholder="Click to edit" value="' + value + '"></label>');
			}
		});

		// populate text articles
		$('.text').each(function() {
			var text = '';
			var paragraphs = $(this).parent().hasClass('major') ? 100 : 10;
			for (var i = 0; i < paragraphs; ++i)
				text += '<p>' + _.shuffle(_.sample(words, (words.length / 2) * Math.random() + (words.length / 2))).join(' ') + '</p>';
			$(this).html(text);
		});
	})();

	// make content span body
	$(window).on('resizing', function() {
		$('.content').each(function() {
			$(this).outerHeight($(window).height() - $(this).offset().top);
		});
	});

	// adjust text fields to content
	(function() {
		$('.form input[type=text]').each(function() {
			// add element to measure pixel length of text
			var id = btoa(Math.floor(Math.random() * Math.pow(2, 64)));
			var tag = $('<span id="' + id + '">' + $(this).val() + '</span>').css({
				'display': 'none',
				'font-family': $(this).css('font-family'),
				'font-size': $(this).css('font-size'),
			}).appendTo('body');

			// adjust width on keydown
			var self = this;
			function update() {
				// give browser time to add current letter
				setTimeout(function() {
					// prevent whitespace from being collapsed
					tag.html($(self).val().replace(/ /g, '&nbsp'));

					// clamp length and prevent text from scrolling
					var max = $(self).parent().width();
					var size = Math.max(100, Math.min(max, tag.width() + 10));
					if (size < max)
						$(self).scrollLeft(0);

					// apply width to input
					$(self).width(size);

				}, 0);
			};
			$(window).on('resizing', update);
			$(this).keydown(update);
		});
	})();

	// fix table header
	(function() {
		var scroller = $('.content');
		function init() {
			$('.list').each(function() {
				var head     = $(this).children('thead'),
					body     = $(this).children('tbody'),
					firstrow = body.find('tr:first-child td');

				// make table head fixed
				head.css({
					'position': 'fixed',
					'top':      head.offset().top,
					'left':     $(this).offset().left,
					'width':    $(this).width(),
				});
				
				// set padding for fixed table head
				firstrow.css('padding-top', '').css('padding-top', parseInt(firstrow.css('padding-top')) + head.outerHeight());

				// get cell widths from table body
				var columns = firstrow.map(function() { return $(this).width(); });
				$(this).find('th').each(function(index) {
					if (index < columns.length)
						$(this).width(columns[index]);
				});
			});
		}
		var scroller = $('.content');
		function update() {
			$('.list thead').each(function() {
				// scroll element
				var table = $(this).parent();
				var top = table.offset().top;

				// clamp inside viewport and parent
				top = Math.max(top, scroller.offset().top);
				top = Math.min(top, table.offset().top + table.outerHeight() - $(this).outerHeight());

				// apply new offset
				$(this).css('top', top);
			});
		}
		$(window).on('resizing', init);
		$(window).on('resizing', update);
		scroller.scroll(update);
	})();

	// snap inside viewport
	(function() {
		var scroller = $('.content');
		function init() {
			$('.viewport').each(function() {
				// release forced dimensions
				$(this).css('height', '');
				$(this).css('width', '');

				// remove wrapper
				if ($(this).children('.wrapper').length)
					$(this).html($(this).children('.wrapper').html());

				// force to retain dimensions
				$(this).css({
					'height': $(this).css('height'),
					'width':  $(this).css('width'),
				});

				// wrap content by fixed box
				$(this).wrapInner('<div class="wrapper"></div>');

				// style wrapper
				wrapper = $(this).children('.wrapper');
				wrapper.css({
					'position': 'fixed',
					'box-sizing':     $(this).css('box-sizing'),
					'padding-top':    $(this).css('padding-top'),
					'padding-right':  $(this).css('padding-right'),
					'padding-bottom': $(this).css('padding-bottom'),
					'padding-left':   $(this).css('padding-left'),
					'height':         $(this).css('height'),
					'width':          $(this).css('width'),
					'left':           $(this).offset().left,
					'top':            $(this).offset().top,
				});

				// tunnel scroll to parent
				wrapper.on('mousewheel', function() {
					var e = window.event;
					var delta = e.detail ? -e.detail * 100 : e.wheelDelta;
					var parent = $(this).parent().parent();
					parent.scrollTop(parent.scrollTop() - delta);
				});
			});
		}
		var scrolllast = scroller.scrollTop();
		function update() {
			$('.viewport .wrapper').each(function() {
				// scroll element
				var scrollcurrent = scroller.scrollTop();
				var top = parseInt($(this).css('top'));
				top -= scrollcurrent - scrolllast;

				// clamp inside viewport
				top = Math.max(top, $(window).height() - $(this).outerHeight());
				top = Math.min(top, scroller.offset() ? scroller.offset().top : 0);

				// clamp inside parent
				var parent = $(this).parent().parent();
				top = Math.min(top, parent.offset().top + parent[0].scrollHeight - $(this).outerHeight());
				top = Math.max(top, parent.offset().top - scrollcurrent);

				// apply new offset
				$(this).css('top', top);

				// swap varibles
				scrolllast = scrollcurrent;
			});
		}
		$(window).on('resizing', init);
		$(window).on('resizing', update);
		scroller.scroll(update);
	})();
});
