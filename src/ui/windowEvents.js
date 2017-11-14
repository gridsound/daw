"use strict";

ui.windowEvents = function() {
	window.onresize = function() {
		dom[ "pan-rightside" ].onresizing();
	};

	window.onbeforeunload = function() {
		if ( gs.isCompositionNeedSave() ) {
			return "Data unsaved";
		}
	};

	window.onkeydown = function( e ) {
		var prevent = true;

		if ( e.altKey ){
			switch ( e.code ) {
				case "KeyO": ui.openPopup.show(); break;
				case "KeyS": gs.saveCurrentComposition(); break;
				case "KeyZ": e.shiftKey ? gs.redo() : gs.undo(); break;
				case "KeyN": gs.loadNewComposition(); break;
				default: prevent = false;
			}
		} else {
			switch ( e.code ) {
				case "Space":
					gs.controls.status === "playing"
						? gs.controls.stop()
						: gs.controls.play();
					break;
				default: prevent = false;
			}
		}
		prevent && e.preventDefault();
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
