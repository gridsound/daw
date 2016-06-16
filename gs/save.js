"use strict"

gs.save = function()
{
	var
		_save = {
			bpm: this._bpm,
			files: [],
			samples: [],
			tracks: []
		}
	;

	ui.files.forEach( function( f ) {
		_save.files.push( [
			f.id,
			f.file.name,
			f.file.size,
			f.file.type
		]);
	});

	gs.samples.forEach( function( s ) {
		_save.samples.push( [
			s.xem,
			s.track.id,
			s.uifile.id,
			s.wsample.when,
			s.wsample.offset,
			s.wsample.duration
		]);
	});

	// TODO save wfilters
	ui.tracks.forEach( function( t ) {
		if ( t.isOn || t.samples.length ||
			 t.name || t.wfilters.length ) {
			_save.tracks.push( [
				t.id,
				t.isOn,
				t.name
			]);
		}
	});

	return {
		href: "data:text/plain;charset=utf-8," + encodeURIComponent( JSON.stringify(_save) ),
		download: "s.txt"
	};
}

gs.load = function( file ) {
	var
		that = this,
		reader = new FileReader(),
		ns,
		nf
	;

	reader.onload = function( event ) {
		that._save = JSON.parse( event.target.result );

		that.bpm( that._save.bpm );

		that._save.files.forEach( function( f ) {
			nf = ui.newFile( f );
			nf.samplesToSet = [];
		});

		that._save.tracks.forEach( function( t ) {
			var
				id = t[ 0 ],
				isOn = t[ 1 ],
				name = t[ 2 ]
			;

			while ( id >= ui.tracks.length ) {
				ui.newTrack();
			}
			ui.tracks[ id ].isOn = isOn;
			ui.tracks[ id ].name = name;
		});

		that._save.samples.forEach( function( s ) {
			var
				xem = s[ 0 ],
				trackId = s[ 1 ],
				fileId = s[ 2 ],
				when = s[ 3 ],
				offset = s[ 4 ],
				duration = s[ 5 ]
			;

			ns = gs.sampleCreate( ui.files[ fileId ] );
			ns.uifile.samplesToSet.push(ns);

			// inTrack()
			ns.track = ui.tracks[ trackId ];
			ns.track.samples.push( ns );
			ui.CSS_sampleTrack( ns );

			// moveX
			ns.xem = xem;
			ns.savedWhen = when;
			ns.jqSample.css( "left", when * ui.BPMem + "em" );

			// slip()
			ns.savedOffset = offset;

			// sample.duration()
			ns.savedDuration = duration;
			ns.jqSample.css( "width", duration * ui.BPMem + "em" );
		});
	};
	reader.readAsText( file );
}
