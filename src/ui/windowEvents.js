"use strict";

ui.windowEvents = function() {
	window.onresize = function() {
		ui.panelsMain.resized();
	};

	window.onbeforeunload = function() {
		if ( gs.isCompositionNeedSave() ) {
			return "Data unsaved";
		}
	};

	window.onkeydown = function( e ) {
		switch ( e.code ) {
			case "KeyS":
				if ( e.ctrlKey ) {
					gs.saveCurrentComposition();
				}
				break;
			case "KeyZ":
				if ( e.ctrlKey ) {
					e.shiftKey ? gs.redo() : gs.undo();
				}
				break;
			case "Space":
				gs.controls.status === "playing"
					? gs.controls.stop()
					: gs.controls.play();
				break;
			default:
				return;
			}
		e.preventDefault();
	};

	document.body.onclick = function( e ) {
		ui.cmps._hideMenu();
	};

	document.body.ondrop = function( e ) {
		var gsFile,
			files = Array.from( e.dataTransfer.files ),
			audioFiles = files.filter( function( f ) {
				var ext = f.name.substr( f.name.lastIndexOf( "." ) + 1 ).toLowerCase();

				if ( ext === "gs" || ext === "txt" || ext === "json" ) {
					gsFile = f;
				}
				return env.audioFileExt.indexOf( ext ) > -1;
			} );

		if ( gsFile ) {
			gs.loadCompositionByBlob( gsFile ).then(
				gs.addAudioFiles.bind( null, audioFiles ),
				function() {} );
		} else {
			gs.addAudioFiles( audioFiles );
		}
		return false;
	};

	document.body.ondragover = function() {
		return false;
	};
};
