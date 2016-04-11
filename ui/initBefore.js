"use strict";

window.ui = {
	jqWindow: $( window ),
	jqBody: $( "body" ),

	jqVisual: $( "#visual" ),
	jqClockMin: $( "#visual .clock .min" ),
	jqClockSec: $( "#visual .clock .sec" ),
	jqClockMs: $( "#visual .clock .ms" ),

	jqMenu: $( "#menu" ),
	jqBpmA: $( "#menu .bpm .a-bpm" ),
	jqBpmInt: $( "#menu .bpm .int" ),
	jqBpmDec: $( "#menu .bpm .dec" ),
	jqBpmList: $( "#menu .bpm-list" ),

	jqFiles: $( "#files" ),
	jqFilelist: $( "#files .filelist" ),

	jqGrid: $( "#grid" ),
	jqGridEm: $( "#grid .emWrapper" ),
	jqGridHeader: $( "#grid .header" ),
	jqTimeline: $( "#grid .timeline" ),
	jqTrackList: $( "#grid .trackList" ),
	jqGridCols: $( "#grid .cols" ),
	jqGridColB: $( "#grid .colB" ),
	jqTrackNames: $( "#grid .trackNames" ),
	jqTrackLines: $( "#grid .trackLines" ),
	jqTrackNamesExtend: $( "#grid .trackNames .extend" )
};

ui.em = parseFloat( ui.jqGrid.css( "fontSize" ) );
ui.files = [];
ui.tracks = [];
ui.nbTracksOn = 0;
ui.gridColsY = ui.jqGridCols.offset().top;
