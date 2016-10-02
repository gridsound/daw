"use strict"

gs.save = function() {
	var files = gs.files.map( function( f ) {
			return [ f.id, f.fullname, f.file ? f.file.size : f.size ];
		} ),
		samples = gs.samples.map( function( s ) {
			return [
				s.track.id,
				s.gsfile.id,
				s.wsample ? s.wsample.when : s.savedWhen,
				s.wsample ? s.wsample.offset : s.savedOffset,
				s.wsample ? s.wsample.duration : s.savedDuration
			];
		} ),
		tracks = ui.tracks.reduce( function( arr, t ) {
			if ( !t.isOn || t.samples.length || t.name || ( t.wfilters && t.wfilters.length ) ) {
				arr.push( [ t.id, t.isOn, t.name ] );
			}
			return arr;
		}, [] );

	return {
		download: "gridsound-composition.gs",
		href: "data:text/plain;charset=utf-8," + encodeURIComponent(
			'{' +
				'\n\t"saveformat": 1,' +
				'\n\t"bpm": ' + gs._bpm + ',' +
				'\n\t"files": [\n'   + reduce( files   ) + '\t],' +
				'\n\t"samples": [\n' + reduce( samples ) + '\t],' +
				'\n\t"tracks": [\n'  + reduce( tracks  ) + '\t]'  +
			'\n}'
		)
	};
};

function reduce( arr ) {
	var len = arr.length - 1;
	return arr.reduce( function( _, it, i ) {
		return _ + "\t\t" + JSON.stringify( it ) + ( i < len ? "," : "" ) + "\n";
	}, "" )
}
