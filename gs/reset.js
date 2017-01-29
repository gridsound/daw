"use strict";

gs.reset = function() {
	delete gs.compositions.current;
	waFwk.tracks.forEach( function( trkObj ) {
		trkObj.userData.editName( "" );
		trkObj.userData.toggle( true );
	} );
	gs.composition.samples.forEach( function( s ) {
		gs.sample.select( s, true );
	} );
	gs.samples.selected.delete();
	gs.files.forEach( function( f ) {
		f.elFile.remove();
	} );
	gs.files = [];
	gs.history.reset();
	ui.save.unselectComposition();
	return this;
};
