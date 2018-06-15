"use strict";

function uiInit() {
	const uipanels = new gsuiPanels( document.querySelector( "#app" ) );

	uipanels.attached();

	// Global load all the periodicWaves to the visual component
	Object.entries( gswaPeriodicWaves ).forEach(
		( [ name, w ] ) => gsuiPeriodicWave.addWave( name, w.real, w.imag ) );

	// Append all panels to the DOM
	document.querySelectorAll( "div[data-panel]" ).forEach( pan => {
		const div = document.getElementById( pan.dataset.panel );

		div && div.append.apply( div, pan.children );
	} );

	// Fill the window.dom object with each [id] elements
	document.querySelectorAll( "[id]" ).forEach( el => dom[ el.id ] = el );
	dom.version.textContent = env.version;

	// Panels resizing callbacks
	dom[ "pan-rightside" ].onresizing = () => {
		ui.mainGrid.patternroll.resized();
		ui.pattern.pianoroll.resized();
	};
	dom[ "pan-pianoroll" ].onresizing = () => {
		ui.pattern.pianoroll.resized();
	};

	// Initialisation of the rest of the app
	window.ui = {
		cmps: new uiCmps(),
		history: new uiHistory(),
		synths: new uiSynths(),
		patterns: new uiPatterns(),
		controls: new uiControls(),
		mainGrid: new uiMainGrid(),
		synth: new uiSynth(),
		pattern: new uiPattern(),
		openPopup: new uiOpenPopup(),
		aboutPopup: new uiAboutPopup(),
		settingsPopup: new uiSettingsPopup(),
		shortcutsPopup: new uiShortcutsPopup(),
	};

	// Global events (mouse, keyboard, resize, etc.)
	uiWindowEvents();
	window.onresize();
}
