"use strict";

ui.initElement( "exportToWaveFile", function( el ) {
	return {
		click: function( e ) {
			e.preventDefault();
			gs.composition.render().then( function( blob ) {
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
