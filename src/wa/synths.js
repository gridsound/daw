"use strict";

wa.synths = {
	init() {
		wa.synths._synths = {};
	},
	empty() {
		Object.keys( wa.synths._synths ).forEach( wa.synths.delete );
		delete wa.synths.current;
	},
	create( id, obj ) {
		var syn = new gswaSynth();

		syn.setContext( wa.ctx );
		syn.connect( wa.destination.get() );
		syn.change( obj );
		wa.synths._synths[ id ] = syn;
	},
	update( id, obj ) {
		wa.synths._synths[ id ].change( obj );
	},
	delete( id ) {
		wa.synths._synths[ id ].stop();
		delete wa.synths._synths[ id ];
	},
	setContext( ctx ) {
		Object.values( wa.synths._synths ).forEach( syn => {
			syn.setContext( ctx );
			syn.connect( wa.destination.get() );
		} );
	},
	select( id ) {
		wa.synths.current = wa.synths._synths[ id ];
	},
	start( smp, when, offset, dur ) {
		wa.synths._synths[ smp.synthId ].start( smp.key, when, offset, dur );
	},
	stop() {
		Object.values( wa.synths._synths ).forEach( syn => syn.stop() );
	}
};
