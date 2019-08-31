"use strict";

Object.freeze( Object.assign( gsdataMixer.actions, {
	updateChanProp( id, prop, val ) {
		return [
			{ [ id ]: { [ prop ]: val } },
			[ "mixer", "updateChanProp", this.data[ id ].name, prop, val ],
		];
	},
	toggleChan( id ) {
		const chan = this.data[ id ],
			toggle = !chan.toggle;

		return [
			{ [ id ]: { toggle } },
			[ "mixer", "toggleChan", chan.name, toggle ],
		];
	},
	redirectChan( id, dest ) {
		const chan = this.data[ id ];

		if ( id !== "main" && id !== dest && chan.dest !== dest ) {
			return [
				{ [ id ]: { dest } },
				[ "mixer", "redirectChan", chan.name, this.data[ dest ].name ],
			];
		}
	},
	addChan() {
		const id = this.values.get( "maxId" ) + 1,
			name = `chan ${ id }`,
			chanObj = {
				order: this.values.get( "maxOrder" ) + 1,
				toggle: true,
				name,
				gain: 1,
				pan: 0,
				dest: "main",
			};

		return [
			{ [ id ]: chanObj },
			[ "mixer", "addChan", name ],
		];
	},
	removeChan( id ) {
		const obj = { [ id ]: undefined };

		Object.entries( this.data ).forEach( kv => {
			if ( kv[ 1 ].dest === id ) {
				obj[ kv[ 0 ] ] = { dest: "main" };
			}
		} );
		return [
			obj,
			[ "mixer", "removeChan", this.data[ id ].name ],
		];
	},
} ) );
