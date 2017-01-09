"use strict";

gs.compositions.saveCurrent = function() {
	gs.compositions.save( gs.compositions.current );
};

gs.compositions.save = function( cmp ) {
	if ( cmp ) {
		_save( cmp );
	} else {
		ui.gsuiPopup.open( "prompt", "Composition's name",
			"Please enter a name for your new composition :" )
		.then( function( name ) {
			name && _save( { name: name.trim() } );
		} );
	}

	function _save( cmp ) {
		gs.compositions.current = cmp;
		gs.compositions.serialize( cmp );
		gs.compositions.store( cmp );
		ui.save.selectComposition( cmp );
	}
};
