"use strict";

wa.synths = {
	init() {
		this._synths = {};
	},

	empty() {
		Object.keys( this._synths ).forEach( this.delete, this );
		delete this.current;
	},
	setContext( ctx ) {
		Object.values( this._synths ).forEach( syn => {
			syn.setContext( ctx );
			syn.connect( wa.destination.get() );
		} );
	},
	select( id ) {
		this.current = this._synths[ id ];
	},
	create( id, obj ) {
		var syn = new gswaSynth();

		syn.setContext( wa.ctx );
		syn.connect( wa.destination.get() );
		common.assignDeep( syn.data, obj );
		this._synths[ id ] = syn;
	},
	update( id, obj ) {
		common.assignDeep( this._synths[ id ].data, obj );
	},
	delete( id ) {
		this._synths[ id ].stopAllKeys();
		delete this._synths[ id ];
	}
};
