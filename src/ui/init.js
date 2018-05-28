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
		ui.keysGridSamples.resized();
	};
	dom[ "pan-pianoroll" ].onresizing = () => {
		ui.keysGridSamples.resized();
	};

	// Initialisation of the rest of the app:
	dom.version.textContent = env.version;
	ui.cmps.init();
	ui.history.init();
	ui.synths.init();
	ui.patterns.init();
	ui.controls.init();
	ui.mainGrid.init();
	ui.synth.init();
	ui.pattern.init();
	ui.openPopup.init();
	ui.aboutPopup.init();
	ui.settingsPopup.init();
	ui.shortcutsPopup.init();
	ui.windowEvents();

	window.onresize();
};
