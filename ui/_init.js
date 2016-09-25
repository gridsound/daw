"use strict";

( function() {

var k,
	tpl = Handlebars.templates,
	qS = wisdom.qS,
	qSA = wisdom.qSA;

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

ui.elVisual       = qS( "#visual" );
ui.elVisualCanvas = qS( ui.elVisual, "canvas" );
ui.elClockUnits   = qS( ui.elVisual, ".clock .units" );
ui.elClockMin     = qS( ui.elVisual, ".clock > .min" );
ui.elClockSec     = qS( ui.elVisual, ".clock > .sec" );
ui.elClockMs      = qS( ui.elVisual, ".clock > .ms" );
ui.elBtnHistory   = qS( ui.elVisual, ".btn.history" );
ui.elBtnFiles     = qS( ui.elVisual, ".btn.files" );

ui.elMenu      = qS( "#menu" );
ui.elPlay      = qS( ui.elMenu, ".btn.play" );
ui.elStop      = qS( ui.elMenu, ".btn.stop" );
ui.elBpm       = qS( ui.elMenu, ".bpm" );
ui.elBpmA      = qS( ui.elMenu, ".bpm .a-bpm" );
ui.elBpmInt    = qS( ui.elMenu, ".bpm .int" );
ui.elBpmDec    = qS( ui.elMenu, ".bpm .dec" );
ui.elBpmList   = qS( ui.elMenu, ".bpm-list" );
ui.elBtnMagnet = qS( ui.elMenu, ".btn.magnet" );
ui.elBtnSave   = qS( ui.elMenu, ".btn.save" );
ui.elToolBtns  = qSA( ui.elMenu, ".btn[data-tool]" );

ui.elPanel             = qS( "#panel" );
ui.elHistoryActionList = qS( ui.elPanel, ".actionlist" );
ui.elInputFile         = qS( ui.elPanel, "input[type='file']" );
ui.elFileFilters       = qS( ui.elPanel, ".filters" );
ui.elFilelist          = qS( ui.elPanel, ".filelist" );
ui.elBtnUndo           = qS( "#history .btn.undo" );
ui.elBtnRedo           = qS( "#history .btn.redo" );

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
