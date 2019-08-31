"use strict";

class gsdata {
	constructor( actions, fnsNames, fns ) {
		this.data = {};
		this.on = this.__fnsSetup( fnsNames, fns );
		this.values = new Map();
		this.__actions = actions;
		Object.freeze( this );
		this.clear();
	}

	// public:
	// .........................................................................
	noop() {}
	clear() {}
	callAction( cb, actionName, ...args ) {
		const act = this.__actions[ actionName ].apply( this, args );

		if ( act ) {
			this.change( act[ 0 ] );
			cb( act[ 0 ], act[ 1 ] );
		}
	}

	// semi-public: ( public only for `gsdata*` classes )
	// .........................................................................
	__lockProp( obj, prop ) {
		Object.defineProperty( obj, prop, gsdata.__lockPropOpt );
	}

	// private:
	// .........................................................................
	__fnsSetup( fnsNames, fns ) {
		const on = fnsNames.reduce( this.__fnsReduce.bind( this ), {} );

		Object.assign( Object.seal( on ), fns );
		return Object.freeze( on );
	}
	__fnsReduce( fns, name ) {
		fns[ name ] = this.noop;
		return fns;
	}
}

gsdata.__lockPropOpt = Object.freeze( {
	writable : false,
	enumerable : true,
	configurable : false,
} );
Object.freeze( gsdata );
