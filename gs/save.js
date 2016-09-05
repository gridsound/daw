"use strict"

gs.save = function() {
	var _save = {
			bpm: this._bpm,
			files: [],
			samples: [],
			tracks: []
		};

	gs.files.forEach( function( f ) {
		_save.files.push( [
			f.id,
			f.fullname,
			f.file ? f.file.size : f.size
		] );
	} );

	gs.samples.forEach( function( s ) {
		_save.samples.push( [
			s.track.id,
			s.gsfile.id,
			s.wsample ? s.wsample.when : s.savedWhen,
			s.wsample ? s.wsample.offset : s.savedOffset,
			s.wsample ? s.wsample.duration : s.savedDuration
		] );
	} );

	// TODO save wfilters
	ui.tracks.forEach( function( t ) {
		if ( t.isOn || t.samples.length ||
			 t.name || ( t.wfilters && t.wfilters.length ) ) {
			_save.tracks.push( [
				t.id,
				t.isOn,
				t.name
			] );
		}
	} );

	return {
		href: "data:text/plain;charset=utf-8," + encodeURIComponent( JSON.stringify( _save ) ),
		download: "s.txt"
	};
};
