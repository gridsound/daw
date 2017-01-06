"use strict";

ui.initElement( "exportToWaveFile", function( el ) {
	return {
		click: function( e ) {
			gs.composition.render().then( function( blob ) {
				ui.exportToWaveFile.downloadFile( gs.compositions.current.name + ".wav", blob );
			} );
			e.preventDefault();
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
