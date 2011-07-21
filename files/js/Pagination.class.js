/**
 * @author		Markus Bartz
 * @copyright	2011 Markus Bartz
 * @license		GNU Lesser General Public License <http://www.gnu.org/licenses/lgpl.html>
 * 
 * Parts of the logic are borrowed by "lib/system/template/plugin/TemplatePluginFunctionPages.class.php"
 * from the WoltLab® Community Framework™ which is licensed under the GNU Lesser General Public License.
 */
(function( $, undefined ) {

$.widget( "ui.wcfPages", {
	SHOW_LINKS: 11,
	SHOW_SUB_LINKS: 20,
	
	options: {
		// vars
		activePage: 1,
		maxPage: 1,
		
		// icons
		previousIcon: RELATIVE_WCF_DIR + 'icon/previousS.png',
		previousDisabledIcon: RELATIVE_WCF_DIR + 'icon/previousDisabledS.png',
		arrowDownIcon: RELATIVE_WCF_DIR + 'icon/arrowDown.png',
		nextIcon: RELATIVE_WCF_DIR + 'icon/nextS.png',
		nextDisabledIcon: RELATIVE_WCF_DIR + 'icon/nextDisabledS.png',
		
		// language
		'wcf.global.thousandsSeparator': null,
		'wcf.global.page.next': null,
		'wcf.global.page.previous': null,
	},
	
	/**
	 * @see	jQuery.ui.Widget._create()
	 */
	_create: function() {
		this.element.addClass('pageNavigation');
		
		this._render();
	},
	
	/**
	 * @see	jQuery.ui.Widget.destroy()
	 */
	destroy: function() {
		$.Widget.prototype.destroy.apply(this, arguments);
		
		this.element.children().remove();
	},
	
	/**
	 * Renders this paginator instance
	 */
	_render: function() {
		// only render if we have more than 1 page
		if (!this.options.disabled && this.options.maxPage > 1) {
			// make sure pagination is visible
			if (this.element.hasClass('hidden')) {
				this.element.removeClass('hidden');
			}
			this.element.show();
			
			this.element.children().remove();
			
			var $pageList = $('<ul></ul>');
			this.element.append($pageList);
			
			var $previousElement = $('<li></li>');
			$pageList.append($previousElement);
			
			if (this.options.activePage > 1) {
				var $previousLink = $('<a' + ((this.options['wcf.global.page.previous'] != null) ? (' title="' + this.options['wcf.global.page.previous'] + '"') : ('')) + '></a>');
				$previousElement.append($previousLink);
				this._bindSwitchPage($previousLink, this.options.activePage - 1);
				
				var $previousImage = $('<img src="' + this.options.previousIcon + '" alt="" />');
				$previousLink.append($previousImage);
			}
			else {
				var $previousImage = $('<img src="' + this.options.previousDisabledIcon + '" alt="" />');
				$previousElement.append($previousImage);
			}
			$previousElement.addClass('skip');
			
			// add first page
			$pageList.append(this._renderLink(1));
			
			// calculate page links
			var $maxLinks = this.SHOW_LINKS - 4;
			var $linksBefore = this.options.activePage - 2;
			if ($linksBefore < 0) $linksBefore = 0;
			var $linksAfter = this.options.maxPage - (this.options.activePage + 1);
			if ($linksAfter < 0) $linksAfter = 0;
			if (this.options.activePage > 1 && this.options.activePage < this.options.maxPage) $maxLinks--;
			
			var $half = $maxLinks / 2;
			var $left = this.options.activePage;
			var $right = this.options.activePage;
			if ($left < 1) $left = 1;
			if ($right < 1) $right = 1;
			if ($right > this.options.maxPage - 1) $right = this.options.maxPage - 1;
			
			if ($linksBefore >= $half) {
				$left -= $half;
			}
			else {
				$left -= $linksBefore;
				$right += $half - $linksBefore;
			}
			
			if ($linksAfter >= $half) {
				$right += $half;
			}
			else {
				$right += $linksAfter;
				$left -= $half - $linksAfter;
			}
			
			$right = Math.ceil($right);
			$left = Math.ceil($left);
			if ($left < 1) $left = 1;
			if ($right > this.options.maxPage) $right = this.options.maxPage;
			
			// left ... links
			if ($left > 1) {
				if ($left - 1 < 2) {
					$pageList.append(this._renderLink(2));
				}
				else {
					var $leftChildren = $('<li class="children"></li>');
					$pageList.append($leftChildren);
					
					var $leftChildrenLink = $('<a>&hellip;</a>');
					$leftChildren.append($leftChildrenLink);
					$leftChildrenLink.click($.proxy(this._startInput, this));
					
					var $leftChildrenImage = $('<img src="' + this.options.arrowDownIcon + '" alt="" />');
					$leftChildrenLink.append($leftChildrenImage);
					
					var $leftChildrenInput = $('<input type="text" class="inputText" name="pageNo" />');
					$leftChildren.append($leftChildrenInput);
					$leftChildrenInput.keydown($.proxy(this._handleInput, this));
					$leftChildrenInput.keyup($.proxy(this._handleInput, this));
					$leftChildrenInput.blur($.proxy(this._stopInput, this));
					
					var $leftChildrenContainer = $('<div></div>');
					$leftChildren.append($leftChildrenContainer);
					
					var $leftChildrenList = $('<ul></u>');
					$leftChildrenContainer.append($leftChildrenList);
					
					// render sublinks
					var $k = 0;
					var $step = Math.ceil(($left - 2) / this.SHOW_SUB_LINKS);
					for (var $i = 2; $i <= $left; $i += $step) {
						$leftChildrenList.append(this._renderLink($i, ($k != 0 && $k % 4 == 0)));
						$k++;
					}
				}
			}
			
			// visible links
			for (var $i = $left + 1; $i < $right; $i++) {
				$pageList.append(this._renderLink($i));
			}
			
			// right ... links
			if ($right < this.options.maxPage) {
				if (this.options.maxPage - $right < 2) {
					$pageList.append(this._renderLink(this.options.maxPage - 1));
				}
				else {
					var $rightChildren = $('<li class="children"></li>');
					$pageList.append($rightChildren);
					
					var $rightChildrenLink = $('<a>&hellip;</a>');
					$rightChildren.append($rightChildrenLink);
					$rightChildrenLink.click($.proxy(this._startInput, this));
					
					var $rightChildrenImage = $('<img src="' + this.options.arrowDownIcon + '" alt="" />');
					$rightChildrenLink.append($rightChildrenImage);
					
					var $rightChildrenInput = $('<input type="text" class="inputText" name="pageNo" />');
					$rightChildren.append($rightChildrenInput);
					$rightChildrenInput.keydown($.proxy(this._handleInput, this));
					$rightChildrenInput.keyup($.proxy(this._handleInput, this));
					$rightChildrenInput.blur($.proxy(this._stopInput, this));
					
					var $rightChildrenContainer = $('<div></div>');
					$rightChildren.append($rightChildrenContainer);
					
					var $rightChildrenList = $('<ul></ul>');
					$rightChildrenContainer.append($rightChildrenList);
					
					// render sublinks
					var $k = 0;
					var $step = Math.ceil((this.options.maxPage - $right) / this.SHOW_SUB_LINKS);
					for (var $i = $right; $i < this.options.maxPage; $i += $step) {
						$rightChildrenList.append(this._renderLink($i, ($k != 0 && $k % 4 == 0)));
						$k++;
					}
				}
			}
			
			// add last page
			$pageList.append(this._renderLink(this.options.maxPage));
			
			// add next button
			var $nextElement = $('<li></li>');
			$pageList.append($nextElement);
			
			if (this.options.activePage < this.options.maxPage) {
				var $nextLink = $('<a title="' + ((this.options['wcf.global.page.next'] != null) ? (' title="' + this.options['wcf.global.page.next'] + '"') : ('')) + '"></a>');
				$nextElement.append($nextLink);
				this._bindSwitchPage($nextLink, this.options.activePage + 1);
				
				var $nextImage = $('<img src="' + this.options.nextIcon + '" alt="" />');
				$nextLink.append($nextImage);
			}
			else {
				var $nextImage = $('<img src="' + this.options.nextDisabledIcon + '" alt="" />');
				$nextElement.append($nextImage);
			}
			$nextElement.addClass('skip');
		}
		else {
			// otherwise hide the paginator if not already hidden
			this.element.hide();
		}
	},
	
	/**
	 * Renders a page link
	 * 
	 * @parameter	integer	page
	 * 
	 * @return		$(element)
	 */
	_renderLink: function(page, lineBreak) {
		var $pageElement = $('<li></li>');
		if (lineBreak != undefined && lineBreak) {
			$pageElement.addClass('break');
		}
		if (page != this.options.activePage) {
			var $pageLink = $('<a>' + this._formatPageNumber(page) + '</a>'); 
			$pageElement.append($pageLink);
			this._bindSwitchPage($pageLink, page);
		}
		else {
			$pageElement.addClass('active');
			var $pageSubElement = $('<span>' + this._formatPageNumber(page) + '</span>');
			$pageElement.append($pageSubElement);
		}
		
		return $pageElement;
	},
	
	/**
	 * Formats the page number
	 * 
	 * @parameter	integer	page
	 * 
	 * @return		string
	 */
	_formatPageNumber: function(page) {
		var $pageNum = String(page);
		if (page >= 1000) {
			var $separator = this.options['wcf.global.thousandsSeparator'];
			
			if ($separator != null && $separator != '') {
				var $numElements = new Array();
				var $firstPart = $pageNum.length % 3
				if ($firstPart == 0) $firstPart = 3;
				for (var $i = 0; $i < Math.ceil($pageNum.length / 3); $i++) {
					if ($i == 0) $numElements.push($pageNum.substring(0, $firstPart));
					else {
						var $start = (($i - 1) * 3) + $firstPart
						$numElements.push($pageNum.substring($start, $start + 3));
					}
				}
				$pageNum = $numElements.join($separator);
			}
		}
		
		return $pageNum;
	},
	
	/**
	 * Binds the 'click'-event for the page switching to the given element.
	 * 
	 * @parameter	$(element)	element
	 * @paremeter	integer		page
	 */
	_bindSwitchPage: function(element, page) {
		var $self = this;
		element.click(function() {
			$self.switchPage(page);
		});
	},
	
	/**
	 * Switches to the given page
	 * 
	 * @parameter	Event	event
	 * @parameter	integer	page
	 */
	switchPage: function(page) {
		this._setOption('activePage', page);
	},
	
	/**
	 * @see	jQuery.ui.Widget._setOption()
	 */
	_setOption: function(key, value) {
		if (key == 'activePage') {
			if (value != this.options[key] && value > 0 && value <= this.options.maxPage) {
				var $result = this._trigger('shouldSwitch', undefined, {
					nextPage: value,
				});
				
				if ($result) {
					this.options[key] = value;
					this._render();
					this._trigger('switched', undefined, {
						activePage: value,
					});
				}
				else {
					this._trigger('notSwitched', undefined, {
						activePage: value,
					});
				}
			}
		}
		else {
			this.options[key] = value;
			
			if (key == 'disabled') {
				if (value) {
					this.element.children().remove();
				}
				else {
					this._render()
				}
			}
			else if (key == 'maxPage') {
				this._render();
			}
		}
		
		return this;
	},
	
	/**
	 * Start input of pagenumber
	 * 
	 * @parameter	Event	event
	 */
	_startInput: function(event) {
		// hide a-tag
		var $childLink = $(event.currentTarget);
		if (!$childLink.is('a')) $childLink = $childLink.parent('a');
		
		$childLink.hide();
		
		// show input-tag
		var $childInput = $childLink.parent('li').children('input')
			.css('display', 'block')
			.val('');
		
		$childInput.focus();
	},
	
	/**
	 * Stops input of pagenumber
	 * 
	 * @parameter	Event	event
	 */
	_stopInput: function(event) {
		// hide input-tag
		var $childInput = $(event.currentTarget);
		$childInput.css('display', 'none');
		
		// show a-tag
		var $childContainer = $childInput.parent('li')
		if ($childContainer != undefined && $childContainer != null) {
			$childContainer.children('a').show();
		}
	},
	
	/**
	 * Handles input of pagenumber
	 * 
	 * @parameter	Event	event
	 */
	_handleInput: function(event) {
		var $ie7 = ($.browser.msie && $.browser.version == '7.0');
		if (event.type != 'keyup' || $ie7) {
			if (!$ie7 || ((event.which == 13 || event.which == 27) && event.type == 'keyup')) {
				if (event.which == 13) {
					this.switchPage(parseInt($(event.currentTarget).val()));
				}
				
				if (event.which == 13 || event.which == 27) {
					this._stopInput(event);
					event.stopPropagation();
				}
			}
		}
	},
});

}( jQuery ) );