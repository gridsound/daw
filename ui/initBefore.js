"use strict";

window.ui = {
	jqWindow: $( window ),
	jqBody: $( "body" ),

	jqVisual: $( "#visual" ),
	jqVisualCanvas: $( "#visual canvas" ),
	jqClockMin: $( "#visual .clock .min" ),
	jqClockSec: $( "#visual .clock .sec" ),
	jqClockMs: $( "#visual .clock .ms" ),

	jqMenu: $( "#menu" ),
	jqStop: $( "#menu .btn.stop" ),
	jqBpmA: $( "#menu .bpm .a-bpm" ),
	jqBpmInt: $( "#menu .bpm .int" ),
	jqBpmDec: $( "#menu .bpm .dec" ),
	jqBpmList: $( "#menu .bpm-list" ),
	jqBtnTools: $( "#menu .tools .btn" ),

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

ui.gridEm = parseFloat( ui.jqGrid.css( "fontSize" ) );
ui.files = [];
ui.tracks = [];
ui.samples = [];
ui.selectedSamples = [];
ui.nbTracksOn = 0;
ui.gridColsY = ui.jqGridCols.offset().top;
ui.jqVisualCanvas[ 0 ].height = ui.jqVisualCanvas.height();
