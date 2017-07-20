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
		if ( e.ctrlKey ) {
			switch ( e.code ) {
				case "KeyS":
					gs.saveCurrentComposition();
					break;
				case "KeyZ":
					e.shiftKey ? gs.redo() : gs.undo();
					break;
				default:
					return;
			}
			e.preventDefault();
		} else if ( e.code === "Escape" ) {
			ui.settingsPopup.hide();
		}
	};

	document.body.onclick = function( e ) {
		ui.cmps._hideMenu();
		ui.keys.toggleList( false );
	};

	document.body.ondrop = function( e ) {
		var gsFile,
			files = Array.from( e.dataTransfer.files ),
			assetsFiles = files.filter( function( f ) {
				var ext = f.name.substr( f.name.lastIndexOf( "." ) + 1 ).toLowerCase();

				if ( ext === "gs" ) {
					gsFile = f;
				}
				return settings.assetsExt.indexOf( ext ) > -1;
			} );

		if ( gsFile ) {
			gs.loadCompositionByBlob( gsFile ).then(
				gs.addAssets.bind( null, assetsFiles ),
				function() {} );
		} else {
			gs.addAssets( assetsFiles );
		}
		return false;
	};

	document.body.ondragover = function() {
		return false;
	};
};
