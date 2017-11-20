"use strict";

ui.init = function() {
	var div,
		uipanels = new gsuiPanels( document.querySelector( "#app" ) );

	gsuiGridSamples.getNewId = common.smallId;

	document.querySelectorAll( "div[data-panel]" ).forEach( function( pan ) {
		div = document.getElementById( pan.dataset.panel );
		div && div.append.apply( div, pan.children );
	} );

	// Fill the window.dom object with each [id] elements:
	document.querySelectorAll( "[id]" ).forEach( function( el ) {
		dom[ el.id ] = el;
	} );

	dom.version.textContent = env.version;

	dom[ "pan-rightside" ].onresizing = function( pan ) {
		ui.mainGridSamples.resized();
		ui.keysGridSamples.resized();
	};

	// Initialisation of the rest of the app:
	ui.cmps.init();
	ui.history.init();
	ui.patterns.init();
	ui.mainGrid.init();
	ui.controls.init();
	ui.pattern.init();
	ui.openPopup.init();
	ui.settingsPopup.init();
	ui.shortcutsPopup.init();
	ui.windowEvents();

	window.onresize();
};
