/**
 * @author		Markus Bartz
 * @copyright	2011 Markus Bartz
 * @license		GNU Lesser General Public License <http://www.gnu.org/licenses/lgpl.html>
 * 
 * Parts of the logic are borrowed by "lib/system/template/plugin/TemplatePluginFunctionPages.class.php"
 * from the WoltLab® Community Framework™ which is licensed under the GNU Lesser General Public License.
 */
var Pagination = Class.create({
	// some "static" variables
	SHOW_LINKS: 11,
	SHOW_SUB_LINKS: 20,
	
	/**
	 * Initialize the paginator instance
	 * 
	 * @parameter	string	paginatorID
	 * @parameter	integer	activePage
	 * @parameter	integer	maxPage
	 * @parameter	Object	options
	 */
	initialize: function(paginatorID, activePage, maxPage, options) {
		// bindings
		this.startInput = this._startInput.bindAsEventListener(this);
		this.handleInput = this._handleInput.bindAsEventListener(this);
		this.stopInput = this._stopInput.bindAsEventListener(this);
		
		// initialize variables
		this.paginatorID = paginatorID;
		this.paginator = $(this.paginatorID);
		this.activePage = activePage;
		this.maxPage = maxPage;
		this.options = options;
		if (this.options == undefined || this.options == null) this.options = new Object();
		if (this.options.icon == undefined || this.options.icon == null) this.options.icon = new Object();
		if (this.options.lang == undefined || this.options.lang == null) this.options.lang = new Object();
		
		// now do the "real" work
		if (this.paginator != undefined && this.paginator != null) {
			// add correct class for pagination
			this.paginator.addClassName('pageNavigation');
			
			this.render();
		}
	},
	
	/**
	 * Renders this paginator instance
	 */
	render: function() {
		// makes no sense to think about rendering at all, if we have no paginator
		if (this.paginator != undefined && this.paginator != null) {
			// only render if we have more than 1 page
			if (this.maxPage > 1) {
				// make sure pagination is visible
				if (this.paginator.hasClassName('hidden')) {
					this.paginator.removeClassName('hidden');
				}
				if (!this.paginator.visible()) {
					this.paginator.toggle();
				}
				
				// now do the "real" rendering
				// clear previous pages
				this.paginator.childElements().each(function (element) {
					element.remove();
				});
				
				// add list
				var pageList = new Element('ul');
				this.paginator.insert(pageList);
				
				// add previous button
				var previousElement = new Element('li');
				pageList.insert(previousElement);
				
				if (this.activePage > 1) {
					var previousLink = new Element('a', {
						title: this.getLanguageVar('wcf.global.page.previous')
					});
					previousElement.insert(previousLink);
					previousLink.observe('click', this.switchPage.bindAsEventListener(this, this.activePage - 1));
					
					var previousImage = new Element('img', {
						src: this.getIcon('previousS.png'),
						alt: ''
					});
					previousLink.insert(previousImage);
				}
				else {
					var previousImage = new Element('img', {
						src: this.getIcon('previousDisabledS.png'),
						alt: ''
					});
					previousElement.insert(previousImage);
				}
				previousElement.addClassName('skip');
				
				// add first page
				pageList.insert(this.renderLink(1));
				
				// calculate page links
				var maxLinks = this.SHOW_LINKS - 4;
				var linksBefore = this.activePage - 2;
				if (linksBefore < 0) linksBefore = 0;
				var linksAfter = this.maxPage - (this.activePage + 1);
				if (linksAfter < 0) linksAfter = 0;
				if (this.activePage > 1 && this.activePage < this.maxPage) maxLinks--;
				
				var half = maxLinks / 2;
				var left = this.activePage;
				var right = this.activePage;
				if (left < 1) left = 1;
				if (right < 1) right = 1;
				if (right > this.maxPage - 1) right = this.maxPage - 1;
				
				if (linksBefore >= half) {
					left -= half;
				}
				else {
					left -= linksBefore;
					right += half - linksBefore;
				}
				
				if (linksAfter >= half) {
					right += half;
				}
				else {
					right += linksAfter;
					left -= half - linksAfter;
				}
				
				right = right.ceil();
				left = left.ceil();
				if (left < 1) left = 1;
				if (right > this.maxPage) right = this.maxPage;
				
				// left ... links
				if (left > 1) {
					if (left - 1 < 2) {
						pageList.insert(this.renderLink(2));
					}
					else {
						var leftChildren = new Element('li', {
							'class': 'children'
						});
						pageList.insert(leftChildren);
						
						var leftChildrenLink = new Element('a').update('&hellip;');
						leftChildren.insert(leftChildrenLink);
						leftChildrenLink.observe('click', this.startInput);
						
						var leftChildrenImage = new Element('img', {
							src: this.getIcon('arrowDown.png'),
							alt: ''
						})
						leftChildrenLink.insert(leftChildrenImage);
						
						var leftChildrenInput = new Element('input', {
							type: 'text',
							'class': 'inputText',
							name: 'pageNo'
						});
						leftChildren.insert(leftChildrenInput);
						leftChildrenInput.observe('keydown', this.handleInput);
						leftChildrenInput.observe('keyup', this.handleInput);
						leftChildrenInput.observe('blur', this.stopInput);
						
						var leftChildrenContainer = new Element('div');
						leftChildren.insert(leftChildrenContainer);
						
						var leftChildrenList = new Element('ul');
						leftChildrenContainer.insert(leftChildrenList);
						
						// render sublinks
						var k = 0;
						var step = ((left - 2) / this.SHOW_SUB_LINKS).ceil();
						for (var i = 2; i <= left; i += step) {
							leftChildrenList.insert(this.renderLink(i, (k != 0 && k % 4 == 0)));
							k++;
						}
					}
				}
				
				// visible links
				for (var i = left + 1; i < right; i++) {
					pageList.insert(this.renderLink(i));
				}
				
				// right ... links
				if (right < this.maxPage) {
					if (this.maxPage - right < 2) {
						pageList.insert(this.renderLink(this.maxPage - 1));
					}
					else {
						var rightChildren = new Element('li', {
							'class': 'children'
						});
						pageList.insert(rightChildren);
						
						var rightChildrenLink = new Element('a').update('&hellip;');
						rightChildren.insert(rightChildrenLink);
						rightChildrenLink.observe('click', this.startInput);
						
						var rightChildrenImage = new Element('img', {
							src: this.getIcon('arrowDown.png'),
							alt: ''
						})
						rightChildrenLink.insert(rightChildrenImage);
						
						var rightChildrenInput = new Element('input', {
							type: 'text',
							'class': 'inputText',
							name: 'pageNo'
						});
						rightChildren.insert(rightChildrenInput);
						rightChildrenInput.observe('keydown', this.handleInput);
						rightChildrenInput.observe('keyup', this.handleInput);
						rightChildrenInput.observe('blur', this.stopInput);
						
						var rightChildrenContainer = new Element('div');
						rightChildren.insert(rightChildrenContainer);
						
						var rightChildrenList = new Element('ul');
						rightChildrenContainer.insert(rightChildrenList);
						
						// render sublinks
						var k = 0;
						var step = ((this.maxPage - right) / this.SHOW_SUB_LINKS).ceil();
						for (var i = right; i < this.maxPage; i += step) {
							rightChildrenList.insert(this.renderLink(i, (k != 0 && k % 4 == 0)));
							k++;
						}
					}
				}
				
				// add last page
				pageList.insert(this.renderLink(this.maxPage));
				
				// add next button
				var nextElement = new Element('li');
				pageList.insert(nextElement);
				
				if (this.activePage < this.maxPage) {
					var nextLink = new Element('a', {
						title: this.getLanguageVar('wcf.global.page.next')
					});
					nextElement.insert(nextLink);
					nextLink.observe('click', this.switchPage.bindAsEventListener(this, this.activePage + 1));
					
					var nextImage = new Element('img', {
						src: this.getIcon('nextS.png'),
						alt: ''
					});
					nextLink.insert(nextImage);
				}
				else {
					var nextImage = new Element('img', {
						src: this.getIcon('nextDisabledS.png'),
						alt: ''
					});
					nextElement.insert(nextImage);
				}
				nextElement.addClassName('skip');
			}
			else {
				// otherwise hide the paginator if not already hidden
				this.paginator.addClassName('hidden');
			}
		}
	},
	
	/**
	 * Renders a page link
	 * 
	 * @parameter	integer	page
	 * 
	 * @return		Element
	 */
	renderLink: function(page, lineBreak) {
		var pageElement = new Element('li');
		if (lineBreak != undefined && lineBreak) {
			pageElement.addClassName('break');
		}
		if (page != this.activePage) {
			var pageLink = new Element('a').update(this.formatPageNumber(page)); 
			pageElement.insert(pageLink);
			pageLink.observe('click', this.switchPage.bindAsEventListener(this, page));
		}
		else {
			pageElement.addClassName('active');
			var pageSubElement = new Element('span').update(this.formatPageNumber(page));
			pageElement.insert(pageSubElement);
		}
		
		return pageElement;
	},
	
	/**
	 * Switches to the given page
	 * 
	 * @parameter	Event	event
	 * @parameter	integer	page
	 */
	switchPage: function(event, page) {
		if (page != this.activePage && page > 0 && page <= this.maxPage) {
			var result = this.paginator.fire('pagination:shouldSwitch', {
				page: page
			});
			if (!result.stopped) {
				this.activePage = page;
				this.render();
				this.paginator.fire('pagination:switched', {
					activePage: this.activePage
				});
			}
			else {
				this.paginator.fire('pagination:notSwitched', {
					activePage: this.activePage
				});
			}
		}
	},
	
	/**
	 * Start input of pagenumber
	 * 
	 * @parameter	Event	event
	 */
	_startInput: function(event) {
		// hide a-tag
		var childLink = Event.element(event);
		if (!childLink.match('a')) childLink = childLink.up('a');
		
		childLink.hide();
		
		// show input-tag
		var childInput = childLink.up('li').down('input');
		childInput.setStyle({
			display: 'block'
		});
		childInput.value = '';
		
		childInput.focus();
	},
	
	/**
	 * Handles input of pagenumber
	 * 
	 * @parameter	Event	event
	 */
	_handleInput: function(event) {
		if (event.type != 'keyup' || IS_IE7) {
			// get input-tag
			var childInput = Event.element(event);
			
			// get key
			var key = event.which || event.keyCode;
			
			if (!IS_IE7 || ((key == Event.KEY_RETURN || key == Event.KEY_ESC) && event.type == 'keyup')) {
				if (key == Event.KEY_RETURN) {
					this.switchPage(event, parseInt(childInput.value));
				}
				
				if (key == Event.KEY_RETURN || key == Event.KEY_ESC) {
					this._stopInput(event);
				}
			}
		}
	},
	
	/**
	 * Stops input of pagenumber
	 * 
	 * @parameter	Event	event
	 */
	_stopInput: function(event) {
		// hide input-tag
		var childInput = Event.element(event);
		childInput.setStyle({
			display: 'none'
		});
		
		// show a-tag
		var childContainer = childInput.up('li')
		if (childContainer != undefined && childContainer != null) {
			var childLink = childContainer.down('a');
			childLink.show();
		}
	},
	
	/**
	 * Returns the content of the given language variable
	 * Returns an empty string if the given language variable is
	 * not present
	 * 
	 * @parameter	string	langVar
	 * 
	 * @return		string
	 */
	getLanguageVar: function(langVar) {
		if (this.options.lang[langVar] == undefined || this.options.lang[langVar] == null) {
			return '';
		}
		else {
			return this.options.lang[langVar];
		}
	},
	
	/**
	 * Formats the page number
	 * 
	 * @parameter	integer	page
	 * 
	 * @return		string
	 */
	formatPageNumber: function(page) {
		var pageNum = String(page);
		if (page >= 1000) {
			var separator = this.getLanguageVar('wcf.global.thousandsSeparator');
			
			if (separator != '') {
				var numElements = new Array();
				var firstPart = pageNum.length % 3
				if (firstPart == 0) firstPart = 3;
				for (var i = 0; i < (pageNum.length / 3).ceil(); i++) {
					if (i == 0) numElements.push(pageNum.substring(0, firstPart));
					else {
						var start = ((i - 1) * 3) + firstPart
						numElements.push(pageNum.substring(start, start + 3));
					}
				}
				pageNum = numElements.join(separator);
			}
		}
		
		return pageNum;
	},
	
	/**
	 * Adds the path to the given icon
	 * 
	 * @parameter	string	icon
	 * 
	 * @return		string
	 */
	getIcon: function(icon) {
		if (this.options.icon[icon] == undefined || this.options.icon[icon] == null) {
			return RELATIVE_WCF_DIR + 'icon/' + icon;
		}
		else {
			return this.options.icon[icon];
		}
	}
});
