/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */
CKEDITOR.stylesSet.add( 'custom', [
    // Block-level styles
	{ name: 'Chú thích ảnh', element: 'p', styles: { 'color': '#0000ff' , 'text-align':'center', 'font-style':'italic'} },
    
    // Inline styles
    /*{ name: 'CSS Style', element: 'span', attributes: { 'class': 'my_style' } },*/
	{ name: 'Tiêu đề xanh', element: 'strong', styles: { 'color': '#015AB4' } },
    { name: 'Tiêu đề xám' , element: 'strong', styles: { 'color': '#153352' } },
	{ name: 'Mô tả' , element: 'strong', styles: { 'color': '#000000' } },
	
	{ name: 'Line Height 1', element: 'span', attributes: { 'style': 'line-height: 1;' } },
    { name: 'Line Height 1.5', element: 'span', attributes: { 'style': 'line-height: 1.5;' } },
    { name: 'Line Height 2', element: 'span', attributes: { 'style': 'line-height: 2;' } }
    
] );
 
CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
	
	config.language = 'vi';
	config.baseFloatZIndex = 9999999;
	// colorbutton, font, image2 and justify were compiled into the old custom build;
	// in the 4.22 build they are loaded as external plugins (panelbutton is a dependency).
	config.extraPlugins = 'html5video,lineheight,dialogadvtab,chart,colorbutton,font,image2,justify';
	// Spell-check plugins call third-party services (webspellchecker.net): never load them.
	config.removePlugins = 'scayt,wsc';
	// Suppress the "version is not secure" notification (4.22.x is the last open-source release).
	config.versionCheck = false;
	// File browser / upload URLs are set by src/components/CKEditorWrapper.js.
	config.fontSize_defaultLabel = '18px';
	
	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'chart', groups: ['chart'] }
	];
	
	//config char
	 config.chart_height = 500;
	 config.chart_width = 'auto';
	 config.chart_maxItems = 200;
	 config.chart_colors =
	 {
		 // Colors for Bar/Line chart.
		 fillColor: 'rgba(151,187,205,0.5)',
		 strokeColor: 'rgba(151,187,205,0.8)',
		 highlightFill: 'rgba(151,187,205,0.75)',
		 highlightStroke: 'rgba(151,187,205,1)',
		 // Colors for Doughnut/Pie/PolarArea charts.
		 data: [ '#B33131', '#B66F2D', '#B6B330', '#71B232', '#33B22D', '#31B272', '#2DB5B5', '#3172B6', '#3232B6', '#6E31B2', '#B434AF', '#B53071' ]
	 };	
	
	// CSP admin khong co 'unsafe-eval': template dang chuoi cua Chart.js 1.x dung new Function.
	// Truyen ham thay cho chuoi thi Chart.js goi thang ham, khong eval (cung ket qua voi mac dinh).
	var chartEsc = function( s ) {
		return String( s == null ? '' : s ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' );
	};
	var chartLegend = function( items, colorKey ) {
		return function( chart ) {
			var name = chartEsc( String( chart.name ).toLowerCase() ), html = '<ul class="' + name + '-legend">';
			var list = chart[ items ] || [];
			for ( var i = 0; i < list.length; i++ ) {
				html += '<li><span class="' + name + '-legend-icon" style="background-color:' + chartEsc( list[ i ][ colorKey ] ) + '"></span>' +
					'<span class="' + name + '-legend-text">' + ( list[ i ].label ? chartEsc( list[ i ].label ) : '' ) + '</span></li>';
			}
			return html + '</ul>';
		};
	};
	var chartTemplates = function( legend ) {
		return {
			scaleLabel: function( o ) { return String( o.value ); },
			tooltipTitleTemplate: function( o ) { return String( o.label ); },
			tooltipTemplate: function( o ) { return ( o.label ? o.label + ': ' : '' ) + o.value; },
			multiTooltipTemplate: function( o ) { return o.datasetLabel + ': ' + o.value; },
			legendTemplate: legend
		};
	};
	var chartWith = function( base, legend ) {
		var t = chartTemplates( legend );
		for ( var k in t ) base[ k ] = t[ k ];
		return base;
	};
	config.chart_configBar = chartWith( { animation: false }, chartLegend( 'datasets', 'fillColor' ) );
	config.chart_configDoughnut = chartWith( { animateRotate: false }, chartLegend( 'segments', 'fillColor' ) );
	config.chart_configLine = chartWith( { animation: false }, chartLegend( 'datasets', 'strokeColor' ) );
	config.chart_configPie = chartWith( { animateRotate: false }, chartLegend( 'segments', 'fillColor' ) );
	config.chart_configPolarArea = chartWith( { animateRotate: false }, chartLegend( 'segments', 'fillColor' ) );
	config.toolbar_chart = [
        { name: 'chart', items: ['Chart', '-', 'ChartColor', 'ChartAddItem'] }
    ];
	
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows
	config.extraAllowedContent = 'figcontent';
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	//Remove font style span tag
	config.pasteFromWordRemoveFontStyles = true;	
	config.disallowedContent = 'div[contenteditable]';
		
	//Custom Combo Styles
	config.stylesCombo_stylesSet = 'custom';

};
CKEDITOR.config.extraAllowedContent  = 'figcontent';