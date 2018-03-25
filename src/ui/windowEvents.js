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

	var keyPressed = {};

	window.onkeydown = function( e ) {
		var prev, key = e.key;

		if ( key === " " ) {
			prev = true;
			gs.controls.status === "playing"
				? gs.controls.stop()
				: gs.controls.play();
		} else if ( e.ctrlKey || e.altKey ) {
			prev = true;
			     if ( key === "o" ) { ui.openPopup.show(); }
			else if ( key === "s" ) { gs.saveCurrentComposition(); }
			else if ( key === "z" ) { gs.undoredo.undo(); }
			else if ( key === "Z" ) { gs.undoredo.redo(); }
			else if ( key === "n" && e.altKey ) { gs.loadNewComposition(); }
			else { prev = false; }
			keyPressed[ key ] = true;
		} else {
			ui.pattern.keyboardEvent( true, e );
		}
		prev && e.preventDefault();
	};
	window.onkeyup = function( e ) {
		if ( !keyPressed[ e.key ] ) {
			ui.pattern.keyboardEvent( false, e );
		}
		delete keyPressed[ e.key ];
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
