"use strict";

( function() {

gs.compositions.serialize = function() {
	var files = gs.files.map( function( f ) {
			return [
				f.id,
				f.fullname,
				f.file ? f.file.size : f.size,
				f.wbuff ? f.wbuff.buffer.duration : f.bufferDuration
			];
		} ),
		samples = wa.composition.samples.map( function( smp ) {
			return [
				smp.data.track.id,
				smp.data.gsfile.id,
				ui.BPMem * smp.when,
				ui.BPMem * smp.offset,
				ui.BPMem * smp.duration
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
				'\n\t"saveformat": 2,' +
				'\n\t"bpm": ' + gs._bpm + ',' +
				'\n\t"files": [\n'   + reduce( files   ) + '\t],' +
				'\n\t"tracks": [\n'  + reduce( tracks  ) + '\t],' +
				'\n\t"samples": [\n' + reduce( samples ) + '\t]'  +
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

} )();
