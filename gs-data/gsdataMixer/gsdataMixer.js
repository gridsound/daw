"use strict";

class gsdataMixer extends gsdata {
	constructor( fnsUser ) {
		super( gsdataMixer.actions, [
			"addChan",
			"removeChan",
			"toggleChan",
			"renameChan",
			"redirectChan",
			"changePanChan",
			"changeGainChan",
			"changeOrderChan",
		], fnsUser );
		this.values.set( "nbChannels", 0 );
	}

	// .........................................................................
	clear() {
		this.values.set( "maxId", 0 );
		this.values.set( "maxOrder", 0 );
		Object.keys( this.data ).forEach( id => {
			if ( id !== "main" ) {
				this._removeChan( id );
			}
		}, this );
	}
	reset() {
		const ent = Object.entries( this.data );

		ent.forEach( kv => this._removeChan( kv[ 0 ] ) );
		ent.forEach( kv => this._addChan( kv[ 0 ], kv[ 1 ] ) );
	}
	change( obj ) {
		Object.entries( obj ).forEach( ( [ id, chan ] ) => {
			if ( !chan ) {
				if ( this.data[ id ] ) { // 1.
					this._removeChan( id );
				}
			} else if ( !this.data[ id ] ) {
				this._addChan( id, chan );
			} else {
				this._updateChan( id, chan );
			}
		} );
	}
	liveChange( id, prop, val ) {
		switch ( prop ) {
			case "order": this.on.changeOrderChan( id, val ); break;
			case "toggle": this.on.toggleChan( id, val ); break;
			case "name": this.on.renameChan( id, val ); break;
			case "pan": this.on.changePanChan( id, val ); break;
			case "gain": this.on.changeGainChan( id, val ); break;
			case "dest": this.on.redirectChan( id, val ); break;
		}
		return val;
	}

	// .........................................................................
	_removeChan( id ) {
		delete this.data[ id ];
		this.values.set( "nbChannels", this.values.get( "nbChannels" ) - 1 );
		this.on.removeChan( id );
	}
	_updateChan( id, obj ) {
		const data = this.data[ id ];

		Object.keys( obj ).forEach( p => data[ p ] = this.liveChange( id, p, obj[ p ] ) );
	}
	_addChan( id, obj ) {
		const values = this.values,
			chanObj = Object.assign( this._addChanEmpty( id ), obj );

		this.data[ id ] = chanObj;
		if ( id === "main" ) {
			this.__lockProp( this.data.main, "name" );
		}
		values.set( "nbChannels", values.get( "nbChannels" ) + 1 );
		values.set( "maxId", Math.max( values.get( "maxId" ), id ) || 0 ); // 2.
		values.set( "maxOrder", Math.max( values.get( "maxOrder" ), chanObj.order ) );
		this.on.addChan( id, chanObj );
		this.on.renameChan( id, chanObj.name );
		this.on.toggleChan( id, chanObj.toggle );
		this.on.changePanChan( id, chanObj.pan );
		this.on.changeGainChan( id, chanObj.gain );
		if ( "order" in chanObj ) {
			this.on.changeOrderChan( id, chanObj.order );
		}
		if ( "dest" in chanObj ) {
			this.on.redirectChan( id, chanObj.dest );
		}
	}
	_addChanEmpty( id ) {
		const ch = {
				toggle: true,
				name: "",
				gain: 0,
				pan: 0,
			};

		if ( id !== "main" ) {
			ch.dest = "main";
			ch.order = 0;
		}
		return Object.seal( ch );
	}
}

gsdataMixer.actions = {};
Object.freeze( gsdataMixer );

/*
1. Why do we check before calling removeChan?
   Because the components have to do update themselve to work standalone,
   and the history will retrigger the redo object at each action...
2. Why `|| 0` after Math.max ?
   Because the ID of the main channel is "main".
*/
