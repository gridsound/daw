"use strict";

ui.init = function() {
	var elPanels,
		tmpImported,
		panelsMain = new gsuiPanels(),
		panelsLeft = new gsuiPanels(),
		panelsRight = new gsuiPanels(),
		idEl = {
			app: document.getElementById( "app" ),
			appContent: document.getElementById( "appContent" )
		};

	gsuiGridSamples.getNewId = common.smallId;

	// Init some gsuiPanels:
	ui.panelsMain = panelsMain;
	panelsLeft.axe( "y" );
	panelsRight.axe( "y" );
	panelsMain.nbPanels( 2 );
	panelsLeft.nbPanels( 3 );
	panelsRight.nbPanels( 2 );
	panelsMain.rootElement.id = "panelsMain";
	panelsMain.panels[ 0 ].id = "panelsLeftWrap";
	panelsLeft.rootElement.id = "panelsLeft";
	panelsRight.rootElement.id = "panelsRight";

	// Insert the gsuiPanels to the DOM:
	panelsMain.panels[ 0 ].append( panelsLeft.rootElement );
	panelsMain.panels[ 1 ].append( panelsRight.rootElement );
	idEl.app.append( panelsMain.rootElement );
	elPanels = idEl.app.querySelectorAll( ".gsui-panel" );
	panelsMain.resized();
	panelsLeft.resized();
	panelsRight.resized();
	panelsMain.panels[ 1 ].onresize = function( w, h ) {
		ui.mainGridSamples.resized();
		ui.keysGridSamples.resized();
	};

	// Clone the whole app's content:
	tmpImported = document.importNode( idEl.appContent.content, true );
	tmpImported.querySelectorAll( "[data-panel]" ).forEach( function( pan ) {
		elPanels[ pan.dataset.panel ].append( pan );
	} );

	// Append the settings popup to the app:
	idEl.app.append( tmpImported.querySelector( "#settingsPopupWrap" ) );

	// Fill the idElements with each new [id] elements:
	ui.idElements = idEl;
	document.querySelectorAll( "[id]" ).forEach( function( el ) {
		idEl[ el.id ] = el;
	} );

	// Initialisation of the rest of the app:
	ui.cmps.init();
	ui.history.init();
	ui.patterns.init();
	ui.pattern.init();
	ui.mainGrid.init();
	ui.settingsPopup.init();
	ui.windowEvents();
};
