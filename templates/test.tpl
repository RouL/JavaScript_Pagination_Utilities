{include file="documentHeader"}
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
			(function($, undefined) { 
				$('#testPaginator').wcfPages({
					maxPage: 10000,
					switched: function(event, ui) {
						$('#pageNumber').text(String(ui.activePage));
					},
					'wcf.global.thousandsSeparator': '{lang}wcf.global.thousandsSeparator{/lang}',
                                        'wcf.global.page.next': '{lang}wcf.global.page.next{/lang}',
                                        'wcf.global.page.previous': '{lang}wcf.global.page.previous{/lang}',
				});
			}(jQuery));
			//]]>
		</script>
	</div>

	{include file='footer' sandbox=false}

</body>
</html>
