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

	// private:
	_create( id, obj ) {
		var syn = new gswaSynth();

		syn.setContext( wa.ctx );
		syn.connect( wa.destination.get() );
		syn.change( obj );
		this._synths[ id ] = syn;
	},
	_update( id, obj ) {
		var syn = this._synths[ id ];

		syn.change( obj );
	},
	_delete( id ) {
		this._synths[ id ].stop();
		delete this._synths[ id ];
	}
};
