"use strict";

ui.init = () => {
	const uipanels = new gsuiPanels( document.querySelector( "#app" ) );

	uipanels.attached();

	Object.entries( gswaPeriodicWaves ).forEach( ( [ name, wave ] ) => {
		gsuiPeriodicWave.addWave( name, wave.real, wave.imag );
	} );

	document.querySelectorAll( "div[data-panel]" ).forEach( pan => {
		const div = document.getElementById( pan.dataset.panel );

		div && div.append.apply( div, pan.children );
	} );

	// Fill the window.dom object with each [id] elements:
	document.querySelectorAll( "[id]" ).forEach( el => dom[ el.id ] = el );

	dom[ "pan-rightside" ].onresizing = () => {
		ui.mainGridSamples.resized();
		ui.pattern.pianoroll.resized();
	};
	dom[ "pan-pianoroll" ].onresizing = () => {
		ui.pattern.pianoroll.resized();
	};

	// Initialisation of the rest of the app:
	dom.version.textContent = env.version;
	ui.cmps = new uiCmps();
	ui.history = new uiHistory();
	ui.synths = new uiSynths();
	ui.patterns = new uiPatterns();
	ui.controls = new uiControls();
	ui.mainGrid = new uiMainGrid();
	ui.synth = new uiSynth();
	ui.pattern = new uiPattern();
	ui.openPopup = new uiOpenPopup();
	ui.aboutPopup = new uiAboutPopup();
	ui.settingsPopup = new uiSettingsPopup();
	ui.shortcutsPopup = new uiShortcutsPopup();
	ui.windowEvents();

	window.onresize();
};
