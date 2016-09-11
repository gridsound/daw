gs.history.select = function( action ) {
	var samplesArr = action.samples,
		unselectedArr = action.removedSamples;

	if ( unselectedArr && unselectedArr.length > 0 ) {
		gs.samplesUnselect();
	}
	if ( samplesArr ) {
		samplesArr.forEach( function( s ) {
			gs.sampleSelect( s, !s.selected );
		} );
	}
}

gs.history.undoSelect = function( undo ) {
	var samplesArr = undo.samples,
		unselectedArr = undo.removedSamples;

	if ( samplesArr && samplesArr.length > 0 ) {
		gs.samplesUnselect();
		samplesArr.forEach( function( s ) {
			gs.sampleSelect( s, !s.selected );
		} );
	} else if ( unselectedArr ) {
		unselectedArr.forEach( function( s ) {
			gs.sampleSelect( s, !s.selected );
		} );
	}
}