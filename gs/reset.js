"use strict";

gs.reset = function() {
	delete gs.compositions.current;
	ui.tracks.forEach( function( t ) {
		t.editName( "" );
		t.toggle( true );
	} );
	wa.composition.samples.forEach( function( s ) {
		gs.sample.select( s, true );
	} );
	gs.samples.selected.delete();
	gs.files.forEach( function( f ) {
		f.elFile.remove();
	} );
	gs.files = [];
	ui.save.unselectComposition();
	return this;
};
