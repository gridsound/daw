"use strict";

ui.init = function() {
	var elPanels,
		panelsMain = new gsuiPanels(),
		panelsLeft = new gsuiPanels(),
		panelsRight = new gsuiPanels(),
		mainGridSamples = new gsuiGridSamples(),
		sequGridSamples = new gsuiGridSamples();

	// This object will be used to access quickly any [id] element:
	ui.idElements = {
		app: document.getElementById( "app" ),
		appContent: document.getElementById( "appContent" )
	};

	// Init some gsuiPanels:
	panelsLeft.axe( "y" );
	panelsRight.axe( "y" );
	panelsMain.nbPanels( 2 );
	panelsLeft.nbPanels( 2 );
	panelsRight.nbPanels( 2 );
	panelsMain.rootElement.id = "panelsMain";
	panelsMain.panels[ 0 ].id = "panelsLeftWrap";
	panelsLeft.rootElement.id = "panelsLeft";
	panelsRight.rootElement.id = "panelsRight";
	panelsMain.panels[ 1 ].onresize = function( w, h ) {
		mainGridSamples.resized();
		sequGridSamples.resized();
	};

	// Insert the gsuiPanels to the DOM:
	panelsMain.panels[ 0 ].append( panelsLeft.rootElement );
	panelsMain.panels[ 1 ].append( panelsRight.rootElement );
	ui.idElements.app.append( panelsMain.rootElement );
	panelsMain.resized();
	panelsLeft.resized();
	panelsRight.resized();
	window.onresize = function() {
		panelsMain.resized();
	};

	// Clone the whole app's content:
	elPanels = ui.idElements.app.querySelectorAll( ".gsui-panel" );
	document.importNode( ui.idElements.appContent.content, true )
		.querySelectorAll( "[data-panel]" ).forEach( function( tmpPanel ) {
			elPanels[ tmpPanel.dataset.panel ].append( tmpPanel );
		} );

	// Fill the idElements with each new [id] elements:
	document.querySelectorAll( "[id]" ).forEach( function( el ) {
		ui.idElements[ el.id ] = el;
	} );

	// Init some gsuiGridSamples:
	mainGridSamples.loadTrackList();
	mainGridSamples.nbTracks( 42 );
	mainGridSamples.offset( 0, 40 );
	sequGridSamples.loadKeys();
	sequGridSamples.nbOctaves( 4, 3 );
	sequGridSamples.offset( 0, 120 );
	sequGridSamples.setFontSize( 20 );

	// Add the gsuiGridSamples to the DOM:
	ui.idElements.maingridWrap.append( mainGridSamples.rootElement );
	ui.idElements.gridKeysWrap.append( sequGridSamples.rootElement );
	mainGridSamples.resized();
	sequGridSamples.resized();

	// Fill the list of compositions:
	gs.storedCmps.forEach( ui.newComposition );
};
