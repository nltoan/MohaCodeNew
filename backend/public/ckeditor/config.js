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
	config.extraPlugins = 'html5video,lineheight,dialogadvtab,chart';
	//Browser Image
	config.filebrowserImageBrowseUrl = '/UserControls/AnhDaiDien/fckFinder.aspx?type=Images&UrlWeb=/KND/TT/Lists/TinTuc&option=1&CKEditor=MoTa&CKEditorFuncNum=517&langCode=vi';
	//Upload
	config.filebrowserImageUploadUrl = '/UserControls/AnhDaiDien/pUploadImages.ashx?folder=PublishingImages/VKS Ảnh Nội Dung&UrlWeb=/knd/tt&type=pImage';
	//Browser Link (Attachment)
	config.filebrowserLinkBrowseUrl = "/UserControls/AnhDaiDien/fckFinder.aspx?type=Video&UrlWeb=/content/hinhanhvideo/&option=1";
	//Browser Video
	config.filebrowserBrowseUrl = "/UserControls/AnhDaiDien/fckFinder.aspx?type=Video&UrlWeb=/content/hinhanhvideo/&option=1";
	
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
	
	config.chart_configBar = { animation: false };
	config.chart_configDoughnut = { animateRotate: false };
	config.chart_configLine = { animation: false };
	config.chart_configPie = { animateRotate: false };
	config.chart_configPolarArea = { animateRotate: false };
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