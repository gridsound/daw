"use strict";

wa.synths = {
	init() {
		wa.synths._synths = {};
	},
	empty() {
		Object.keys( wa.synths._synths ).forEach( wa.synths._delete );
		delete wa.synths.current;
	},
	select( id ) {
		wa.synths.current = wa.synths._synths[ id ];
	},
	change( obj ) {
		Object.entries( obj ).forEach( ( [ id, obj ] ) => {
			obj ? this._synths[ id ]
				? this._update( id, obj )
				: this._create( id, obj )
				: this._delete( id );
		}, wa.synths );
	},
	setContext( ctx ) {
		Object.values( wa.synths._synths ).forEach( syn => {
			syn.setContext( ctx );
			syn.connect( wa.destination.get() );
		} );
	},
	start( smp, when, offset, dur ) {
		wa.synths._synths[ smp.synthId ].start( smp.key, when, offset, dur );
	},
	stop() {
		Object.values( wa.synths._synths ).forEach( syn => syn.stop() );
	},

	// private:
	_create( id, obj ) {
		var syn = new gswaSynth();

		syn.setContext( wa.ctx );
		syn.connect( wa.destination.get() );
		syn.change( obj );
		wa.synths._synths[ id ] = syn;
	},
	_update( id, obj ) {
		wa.synths._synths[ id ].change( obj );
	},
	_delete( id ) {
		wa.synths._synths[ id ].stop();
		delete wa.synths._synths[ id ];
	}
};
