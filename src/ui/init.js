"use strict";

function uiInit() {
	const uipanels = new gsuiPanels( document.querySelector( "#app" ) );

	uipanels.attached();
	Object.entries( gswaPeriodicWaves ).forEach( ( [ name, w ] ) => (
		gsuiPeriodicWave.addWave( name, w.real, w.imag )
	) );
	document.querySelectorAll( "div[data-panel]" ).forEach( pan => {
		const div = document.getElementById( pan.dataset.panel );

		div && div.append.apply( div, pan.children );
	} );

	document.querySelectorAll( "[id]" ).forEach( el => dom[ el.id ] = el );
	dom.versionNumber.textContent = env.version;

	dom[ "pan-rightside" ].onresizing = () => {
		ui.mainGrid.patternroll.resized();
		ui.pattern.pianoroll.resized();
	};
	dom[ "pan-pianoroll" ].onresizing = () => {
		ui.pattern.pianoroll.resized();
	};
}
