"use strict";

function uiWindowEvents() {
	window.onresize = () => {
		dom[ "pan-rightside" ].onresizing();
	};

	window.onbeforeunload = () => {
		if ( gs.isCompositionNeedSave() ) {
			return "Data unsaved";
		}
	};

	const keyPressed = {};

	window.onkeydown = e => {
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
	window.onkeyup = e => {
		if ( !keyPressed[ e.key ] ) {
			ui.pattern.keyboardEvent( false, e );
		}
		delete keyPressed[ e.key ];
	};

	document.body.ondragover = () => false;
	document.body.ondrop = e => {
		let gsFile;
		const audioFiles = Array.from( e.dataTransfer.files )
				.filter( f => {
					const ext = f.name.substr( f.name.lastIndexOf( "." ) + 1 ).toLowerCase();

					if ( ext === "gs" || ext === "txt" || ext === "json" ) {
						gsFile = f;
					}
					return env.audioFileExt.indexOf( ext ) > -1;
				} );

		if ( gsFile ) {
			gs.loadCompositionByBlob( gsFile );
		}
		return false;
	};
}
