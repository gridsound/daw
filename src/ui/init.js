"use strict";

ui.init = function() {
	var div,
		uipanels = new gsuiPanels( document.querySelector( "#app" ) );

	gsuiGridSamples.getNewId = common.smallId;

	document.querySelectorAll( "div[data-panel]" ).forEach( function( pan ) {
		div = document.getElementById( pan.dataset.panel );
		div.append.apply( div, pan.children );
	} );

<<<<<<< HEAD
=======
	// Append the settings popup to the app:
	elApp.append(
		tmpImported.querySelector( "#settingsPopupContent" ),
		tmpImported.querySelector( "#shortcutsPopupContent" ),
		tmpImported.querySelector( "#openPopupContent" ) );

>>>>>>> ShortcutsPopup : add some keyboard shortcut in popup helper
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
