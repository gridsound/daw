"use strict";

( function() {

var k,
	tpl = Handlebars.templates,
	qS = wisdom.qS;

window.ui = {};
ui.elApp = qS( "#app" );

// Creating all the DOM :
for ( k in tpl ) {
	if ( k !== "_app" ) {
		Handlebars.registerPartial( k, tpl[ k ] );
	}
}
ui.elApp.innerHTML = Handlebars.templates._app( {} );

// Remove all whitespace nodes :
function rmChild( el ) {
	var save, n = el.firstChild;
	while ( n !== null ) {
		rmChild( save = n );
		n = n.nextSibling;
		if ( save.nodeType !== 1 && /^\s*$/.test( save.textContent ) ) {
			el.removeChild( save );
		}
	}
}
rmChild( document.body );

ui.tool = {};
ui.tracks = [];
ui.nbTracksOn = 0;

ui.elAbout = qS( "#about" );

ui.elVisual       = qS( "#visual" );
ui.elVisualCanvas = qS( ui.elVisual, "canvas" );
ui.elClockUnits   = qS( ui.elVisual, ".clock .units" );
ui.elClockMin     = qS( ui.elVisual, ".clock > .min" );
ui.elClockSec     = qS( ui.elVisual, ".clock > .sec" );
ui.elClockMs      = qS( ui.elVisual, ".clock > .ms" );

ui.elMenu      = qS( "#menu" );
ui.elPlay      = qS( ui.elMenu, ".btn.play" );
ui.elStop      = qS( ui.elMenu, ".btn.stop" );
ui.elBpmA      = qS( ui.elMenu, ".bpm .a-bpm" );
ui.elBpmInt    = qS( ui.elMenu, ".bpm .int" );
ui.elBpmDec    = qS( ui.elMenu, ".bpm .dec" );
ui.elBpmList   = qS( ui.elMenu, ".bpm-list" );
ui.elTools     = qS( ui.elMenu, ".tools" );
ui.elBtnMagnet = qS( ui.elTools, ".magnet" );
ui.elBtnSave   = qS( ui.elTools, ".save" );

ui.elFiles       = qS( "#files" );
ui.elInputFile   = qS( ui.elFiles, "input[type='file']" );
ui.elFileFilters = qS( ui.elFiles, ".filters" );
ui.elFilelist    = qS( ui.elFiles, ".filelist" );

ui.elGrid         = qS( "#grid" );
ui.elGridEm       = qS( ui.elGrid, ".emWrapper" );
ui.elGridHeader   = qS( ui.elGrid, ".header" );
ui.elTimeline     = qS( ui.elGrid, ".timeline" );
ui.elTimeArrow    = qS( ui.elGrid, ".timeArrow" );
ui.elTimeCursor   = qS( ui.elGrid, ".timeCursor" );
ui.elTrackList    = qS( ui.elGrid, ".trackList" );
ui.elGridCols     = qS( ui.elGrid, ".cols" );
ui.elGridColB     = qS( ui.elGrid, ".colB" );
ui.elTrackNames   = qS( ui.elGrid, ".trackNames" );
ui.elTrackLines   = qS( ui.elGrid, ".trackLines" );
ui.elTrackLinesBg = qS( ui.elGrid, ".trackLinesBg" );

ui.gridEm = parseFloat( getComputedStyle( ui.elGrid ).fontSize );
ui.gridColsY = ui.elGridCols.getBoundingClientRect().top;
ui.elVisualCanvas.width = 256;
ui.elVisualCanvas.height = ui.elVisualCanvas.clientHeight;

} )();
