"use strict";

ui.initElement( "exportToWaveFile", function( el ) {
	return {
		click: function( e ) {
			var renderer = gs.composition.render();

			e.preventDefault();
			renderer && renderer.then( function( blob ) {
				var cmp = gs.compositions.current;

				ui.exportToWaveFile.downloadFile(
					( cmp ? cmp.name : "untitled" ) + ".wav", blob );
			} );
		},
		downloadFile: function( filename, blob ) {
			var a = document.createElement( "a" ),
				url = URL.createObjectURL( blob );

			a.download = filename;
			a.href = url;
			a.click();
			URL.revokeObjectURL( url );
		}
	};
} );
