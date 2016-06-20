"use strict"

gs.load = function( saveFile ) {
	var that = this,
		reader = new FileReader(),
		ns,
		nf,
		p;

	p = new Promise( function( resolve, reject ) {
		reader.onload = function( event ) {
			that._save = JSON.parse( event.target.result );

			that.bpm( that._save.bpm );

			that._save.files.forEach( function( f ) {
				nf = gs.fileCreate( f );
				nf.samplesToSet = [];
			} );

			that._save.tracks.forEach( function( t ) {
				var id = t[ 0 ],
					isOn = t[ 1 ],
					name = t[ 2 ];

				while ( id >= ui.tracks.length ) {
					ui.newTrack();
				}
				ui.tracks[ id ].isOn = isOn;
				ui.tracks[ id ].name = name;
			} );

			that._save.samples.forEach( function( s ) {
				var xem = s[ 0 ],
					trackId = s[ 1 ],
					fileId = s[ 2 ],
					when = s[ 3 ],
					offset = s[ 4 ],
					duration = s[ 5 ];

				ns = gs.sampleCreate( gs.files[ fileId ] );
				ns.gsfile.samplesToSet.push(ns);

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
			} );
			resolve( that );
		};

		if ( !saveFile ) {
			resolve( that );
		} else {
			reader.readAsText( saveFile );
		}
	});
	return p;
};
