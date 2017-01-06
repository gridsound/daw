"use strict";

gs.compositions.serialize = function( cmp ) {
	cmp.bpm = gs._bpm;
	cmp.duration = gs.composition.duration;
	cmp.files = gs.files.map( function( f ) {
		return [
			f.id,
			f.fullname,
			f.file ? f.file.size : f.size,
			f.wbuff.buffer ? f.wbuff.buffer.duration : f.bufferDuration
		];
	} );
	cmp.samples = gs.composition.samples.map( function( smp ) {
		return [
			smp.data.track.id,
			smp.data.gsfile.id,
			ui.BPMem * smp.when,
			ui.BPMem * smp.offset,
			ui.BPMem * smp.duration
		];
	} );
	cmp.tracks = ui.tracks.reduce( function( arr, t ) {
		if ( !t.isOn || t.samples.length || t.name || ( t.wfilters && t.wfilters.length ) ) {
			arr.push( [ t.id, t.isOn, t.name ] );
		}
		return arr;
	}, [] );
};
