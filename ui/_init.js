"use strict";

( function() {

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

window.ui = {

	// DOM :
	jqWindow: $( window ),
	jqBody: $( "body" ),
	jqVisual: $( "#visual" ),
	jqVisualCanvas: $( "#visual canvas" ),
	jqClockMin: $( "#visual .clock .min" ),
	jqClockSec: $( "#visual .clock .sec" ),
	jqClockMs: $( "#visual .clock .ms" ),
	jqMenu: $( "#menu" ),
	jqPlay: $( "#menu .btn.play" ),
	jqStop: $( "#menu .btn.stop" ),
	jqBpmA: $( "#menu .bpm .a-bpm" ),
	jqBpmInt: $( "#menu .bpm .int" ),
	jqBpmDec: $( "#menu .bpm .dec" ),
	jqBpmList: $( "#menu .bpm-list" ),
	jqBtnTools: $( "#menu .tools [data-tool]" ),
	jqBtnMagnet: $( "#menu .tools .magnet" ),
	jqBtnSave: $( "#menu .tools .save" ),
	jqFiles: $( "#files" ),
	jqFilelist: $( "#files .filelist" ),
	jqInputFile: $( "#files .filelist input[type='file']" ),
	jqGrid: $( "#grid" ),
	jqGridEm: $( "#grid .emWrapper" ),
	jqGridHeader: $( "#grid .header" ),
	jqTimeline: $( "#grid .timeline" ),
	jqTimeArrow: $( "#grid .timeArrow" ),
	jqTimeCursor: $( "#grid .timeCursor" ),
	jqTrackList: $( "#grid .trackList" ),
	jqGridCols: $( "#grid .cols" ),
	jqGridColB: $( "#grid .colB" ),
	jqTrackNames: $( "#grid .trackNames" ),
	jqTrackLines: $( "#grid .trackLines" ),
	jqTrackLinesBg: $( "#grid .trackLinesBg" ),
	jqTrackNamesExtend: $( "#grid .trackNames .extend" ),

	// Attrs :
	tool: {},
	files: [],
	tracks: [],
	nbTracksOn: 0,
};

ui.gridEm = parseFloat( ui.jqGrid.css( "fontSize" ) );
ui.gridColsY = ui.jqGridCols.offset().top;
ui.jqVisualCanvas[ 0 ].height = ui.jqVisualCanvas.height();

} )();
