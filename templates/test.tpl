nclude file="documentHeader"}
<head>
<title>TestPage - {lang}{PAGE_TITLE}{/lang}</title> {include
file='headInclude' sandbox=false}
<script type="text/javascript"
	src="{@RELATIVE_WCF_DIR}js/Pagination.class.js"></script>
</head>
<body {if $templateName|isset} id="tpl{$templateName|ucfirst}"{/if}>
	{include file='header' sandbox=false}

	<div id="main">

		<div class="mainHeadline">
			<img src="{icon}indexL.png{/icon}" alt="" />
			<div class="headlineContainer">
				<h2>TestPage</h2>
				<p>Test</p>
			</div>
		</div>

		{if $userMessages|isset}{@$userMessages}{/if}

		<p id="pageNumber">1</p>
		<div id="testPaginator"></div>
		<script type="text/javascript">
			//<![CDATA[
			// We're starting with page 1 and the highest page is 10000 in this example.
			// The first 3 parameters are required!
			new Pagination('testPaginator', 1, 10000, {
				lang: {
					// you can use your own language variables and/or thousendsSeparator if you want (as source)
					// you can leave them out if you don't want to use any text
					'wcf.global.thousandsSeparator': '{lang}wcf.global.thousandsSeparator{/lang}',
					'wcf.global.page.next': '{lang}wcf.global.page.next{/lang}',
					'wcf.global.page.previous': '{lang}wcf.global.page.previous{/lang}'
				},
				icon: {
					// you want own icons? here you can set them
					// if you don't use the style system leave this out or define your oen icons
					'previousS.png': '{icon}previousS.png{/icon}',
					'previousDisabledS.png': '{icon}previousDisabledS.png{/icon}',
					'arrowDown.png': '{icon}arrowDown.png{/icon}',
					'nextS.png': '{icon}nextS.png{/icon}',
					'nextDisabledS.png': '{icon}nextDisabledS.png{/icon}'
				}
			});

			// To get informed ybout changes you only have to observe the paginator-element
			// for the event "pagination:switched"
			$('testPaginator').observe('pagination:switched', function(event) {
				// you can get the active page from 'memo.activePage' from the event-object
				$('pageNumber').update(String(event.memo.activePage));
			});
			//]]>
		</script>
	</div>

	{include file='footer' sandbox=false}

</body>
</html>
