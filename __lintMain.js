"use strict";

if ( navigator.serviceWorker &&
	document.cookie.indexOf( "cookieAccepted" ) > -1
) {
	navigator.serviceWorker.register( "serviceWorker.js" )
		.then( reg => {
			console.log( `Service worker ${
				reg.installing ? "installing" :
				reg.waiting ? "installed" :
				reg.active ? "active" : "" }` );
		}, console.log.bind( console, "Service worker registration failed" ) );
}

const GSUtils = {};

GSUtils.addIfNotEmpty = ( obj, attr, valObj ) => {
	if ( GSUtils.isntEmpty( valObj ) ) {
		if ( attr in obj ) {
			GSUtils.deepAssign( obj[ attr ], valObj );
		} else {
			obj[ attr ] = valObj;
		}
	}
	return obj;
};

GSUtils.capitalize = w => w[ 0 ].toUpperCase() + w.substr( 1 );

GSUtils.castToNumber = ( n, def, min, max, fix ) => {
	const x = Number.isFinite( +n )
			? Math.max( min, Math.min( n, max ) )
			: def;

	return typeof fix === "number"
		? +x.toFixed( 2 )
		: +x;
};

GSUtils.composeUndo = ( data, redo ) => {
	if ( GSUtils.isObject( data ) && GSUtils.isObject( redo ) ) {
		return Object.entries( redo ).reduce( ( undo, [ k, val ] ) => {
			if ( data[ k ] !== val ) {
				undo[ k ] = GSUtils.composeUndo( data[ k ], val );
			}
			return undo;
		}, {} );
	}
	return data;
};

GSUtils.deepAssign = ( a, b ) => {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( !GSUtils.isObject( val ) ) {
				a[ k ] = val;
			} else if ( !GSUtils.isObject( a[ k ] ) ) {
				a[ k ] = GSUtils.deepCopy( val );
			} else {
				GSUtils.deepAssign( a[ k ], val );
			}
		} );
	}
	return a;
};

GSUtils.deepCopy = obj => {
	if ( GSUtils.isObject( obj ) ) {
		return Object.entries( obj ).reduce( ( cpy, [ k, v ] ) => {
			cpy[ k ] = GSUtils.deepCopy( v );
			return cpy;
		}, {} );
	}
	return obj;
};

GSUtils.deepFreeze = obj => {
	if ( GSUtils.isObject( obj ) ) {
		Object.freeze( obj );
		Object.values( obj ).forEach( GSUtils.deepFreeze );
	}
	return obj;
};

GSUtils.diffAssign = ( a, b ) => {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( a[ k ] !== val ) {
				if ( val === undefined ) {
					delete a[ k ];
				} else if ( !GSUtils.isObject( val ) ) {
					a[ k ] = val;
				} else if ( !GSUtils.isObject( a[ k ] ) ) {
					a[ k ] = GSUtils.jsonCopy( val );
				} else {
					GSUtils.diffAssign( a[ k ], val );
				}
			}
		} );
	}
	return a;
};

GSUtils.isEmpty = obj => {
	for ( const a in obj ) {
		return false;
	}
	return true;
};

GSUtils.isObject = o => o !== null && typeof o === "object";

GSUtils.isntEmpty = obj => !GSUtils.isEmpty( obj );

GSUtils.jsonCopy = obj => JSON.parse( JSON.stringify( obj ) );

GSUtils.parseBeatsToBeats = ( beats, stepsPerBeat ) => {
	const steps = beats % 1 * stepsPerBeat;

	return [
		`${ beats + 1 | 0 }`,
		`${ steps + 1 | 0 }`.padStart( 2, "0" ),
		`${ steps * 1000 % 1000 | 0 }`.padStart( 3, "0" ),
	];
};

GSUtils.parseBeatsToSeconds = ( beats, bpm ) => {
	const seconds = beats / ( bpm / 60 );

	return [
		`${ seconds / 60 | 0 }`,
		`${ seconds % 60 | 0 }`.padStart( 2, "0" ),
		`${ seconds * 1000 % 1000 | 0 }`.padStart( 3, "0" ),
	];
};

GSUtils.trim2 = str => str ? str.trim().replace( /\s+/g, " " ) : "";

GSUtils.uniqueName = ( nameOri, arr ) => {
	const name = GSUtils.trim2( nameOri );

	if ( arr.indexOf( name ) > -1 ) {
		const name2 = /-\d+$/.test( name )
				? name.substr( 0, name.lastIndexOf( "-" ) ).trim()
				: name,
			reg = new RegExp( `^${ name2 }-(\\d+)$` ),
			nb = arr.reduce( ( nb, str ) => {
				const res = reg.exec( str );

				return res ? Math.max( nb, +res[ 1 ] ) : nb;
			}, 1 );

		return `${ name2 }-${ nb + 1 }`;
	}
	return name;
};

GSUtils.uuid = () => {
	const rnd = crypto.getRandomValues( new Uint8Array( 36 ) ),
		uuid = rnd.reduce( ( arr, n ) => {
			arr.push( ( n % 16 ).toString( 16 ) );
			return arr;
		}, [] );

	uuid[ 14 ] = "4";
	uuid[ 19 ] = ( 8 + rnd[ 19 ] % 4 ).toString( 16 );
	uuid[ 8 ] =
	uuid[ 13 ] =
	uuid[ 18 ] =
	uuid[ 23 ] = "-";
	return uuid.join( "" );
};

Object.freeze( GSUtils );

const gsapiClient = {
	url: "https://api.gridsound.com/",
	headers: Object.freeze( {
		"Content-Type": "application/json; charset=utf-8",
	} ),

	// store
	// ........................................................................
	user: {},

	// ........................................................................
	getMe() {
		return this._fetch( "GET", "getMe.php" )
			.then( me => this._assignMe( me ) );
	},
	getUser( username ) {
		return this._fetch( "GET", `getUser.php?username=${ username }` )
			.then( ( { data } ) => {
				data.usernameLow = data.username.toLowerCase();
				return data;
			} );
	},
	getUserCompositions( iduser ) {
		return this._fetch( "GET", `getUserCompositions.php?id=${ iduser }` )
			.then( ( { data } ) => {
				data.forEach( cmp => cmp.data = JSON.parse( cmp.data ) );
				return data;
			} );
	},
	getComposition( id ) {
		return this._fetch( "GET", `getComposition.php?id=${ id }` )
			.then( ( { data } ) => {
				data.composition.data = JSON.parse( data.composition.data );
				return data;
			} );
	},
	login( email, pass ) {
		return this._fetch( "POST", "login.php", { email, pass } )
			.then( me => this._assignMe( me ) );
	},
	signup( username, email, pass ) {
		return this._fetch( "POST", "createUser.php", { username, email, pass } )
			.then( me => this._assignMe( me ) );
	},
	resendConfirmationEmail() {
		return this._fetch( "POST", "resendConfirmationEmail.php", { email: this.user.email } );
	},
	recoverPassword( email ) {
		return this._fetch( "POST", "recoverPassword.php", { email } );
	},
	resetPassword( email, code, pass ) {
		return this._fetch( "POST", "resetPassword.php", { email, code, pass } );
	},
	logout() {
		return this._fetch( "POST", "logout.php", { confirm: true } )
			.then( res => this._deleteMe( res ) );
	},
	logoutRefresh() {
		return this.logout()
			.then( () => {
				setTimeout( () => location.href =
					location.origin + location.pathname, 500 );
			} );
	},
	updateMyInfo( obj ) {
		return this._fetch( "POST", "updateMyInfo.php", obj )
			.then( me => this._assignMe( me ) );
	},
	saveComposition( cmp ) {
		return this._fetch( "POST", "saveComposition.php",
			{ composition: JSON.stringify( cmp ) } );
	},
	deleteComposition( id ) {
		return this._fetch( "POST", "deleteComposition.php", { id } );
	},

	// private:
	_assignMe( res ) {
		const u = res.data;

		u.usernameLow = u.username.toLowerCase();
		u.emailpublic = u.emailpublic === "1";
		u.emailchecked = u.emailchecked === "1";
		Object.assign( this.user, u );
		return u;
	},
	_deleteMe( res ) {
		Object.keys( this.user ).forEach( k => delete this.user[ k ] );
		return res;
	},
	_fetch( method, url, body ) {
		const obj = {
			method,
			headers: this.headers,
			credentials: "include",
		};

		if ( body ) {
			obj.body = JSON.stringify( body );
		}
		return fetch( this.url + url, obj )
			.then( res => res.text() ) // 1.
			.then( text => {
				try {
					return JSON.parse( text );
				} catch ( e ) {
					return {
						ok: false,
						code: 500,
						msg: text,
					};
				}
			} )
			.then( res => this._fetchThen( res ) );
	},
	_fetchThen( res ) {
		if ( !res.ok ) {
			res.msg = this.errorCode[ res.msg ] || res.msg;
			throw res; // 2.
		}
		return res;
	},

	// ........................................................................
	errorCode: {
		"user:not-connected": "You are not connected",
		"query:bad-format": "The query is incomplete or corrupted",
		"login:fail": "The email/password don't match",
		"pass:too-short": "The password is too short",
		"email:too-long": "The email is too long",
		"email:not-found": "This email is not in the database",
		"email:duplicate": "This email is already used",
		"email:bad-format": "The email is not correct",
		"email:not-verified": "Your email is not verified",
		"username:too-long": "The username is too long",
		"username:too-short": "The username is too short",
		"username:duplicate": "This username is already taken",
		"username:bad-format": "The username can only contains letters, digits and _",
		"password:bad-code": "Can not change the password because the secret code and the email do not match",
		"password:already-recovering": "A recovering email has already been sent to this address less than 1 day ago",
	},
};

/*
1. Why res.text() instead of res.json() ?
   To handle the case where PHP returns a text error/exception with a default 200 code.

2. Every not-ok queries will throw the result instead of return it, why?
   To handle nicely the errors in the UI side, like:
   query().finally().then( OK, KO )
*/

class GSData {
	clear() {}
	recall() {}
	change() {}
	callAction( name, ...args ) {
		const act = this[ `action_${ name }` ]( ...args );

		if ( act ) {
			this.change( act[ 0 ] );
			this.actionCallback( act[ 0 ], act[ 1 ] );
		}
	}

	// .........................................................................
	static noop() {}
	static noopReturn( a ) { return a; }
	static isNoop( fn ) {
		return !fn || fn === GSData.noop || fn === GSData.noopReturn;
	}

	// .........................................................................
	static mapCallbacks( fns, ...names ) {
		const on = {};

		names.forEach( n => on[ n ] = GSData.noop );
		Object.assign( Object.seal( on ), fns );
		return Object.freeze( on );
	}
	static createUpdateRemove( fnAdd, fnUpdate, fnRemove, data, obj ) {
		Object.entries( obj ).forEach( ( [ id, item ] ) => {
			if ( !item ) {
				if ( id in data ) { // 1.
					fnRemove( id, obj );
				}
			} else if ( !( id in data ) ) {
				fnAdd( id, item, obj );
			} else {
				fnUpdate( id, item, obj );
			}
		} );
	}
	static bindCreateUpdateRemove( thisArg, data, prefix ) {
		return GSData.createUpdateRemove.bind( null,
			thisArg[ `${ prefix }Add` ].bind( thisArg ),
			thisArg[ `${ prefix }Update` ].bind( thisArg ),
			thisArg[ `${ prefix }Remove` ].bind( thisArg ),
			data
		);
	}

	// .........................................................................
	_mapCallbacks( names, fns ) {
		const on = {};

		names.forEach( n => on[ n ] = GSData.noop );
		Object.assign( Object.seal( on ), fns );
		return Object.freeze( on );
	}
	_assignAndCall( data, obj, fns, ...args ) {
		Object.entries( obj ).forEach( ( [ prop, val ] ) => {
			data[ prop ] = val;
			if ( prop in fns ) {
				fns[ prop ]( ...args, val );
			}
		} );
	}
}

Object.freeze( GSData );

/*
1. Why do we check before calling the remove function?
   Because the components have to do update themselve to work standalone,
   and the history will retrigger the redo object at each action...
*/

class GSDataSynth extends GSData {
	constructor( fns ) {
		super();
		this.data = Object.seal( {
			name: "",
			lfo: Object.seal( DAWCore.json.lfo() ),
			oscillators: {},
		} );
		this.on = this._mapCallbacks( [
			"addOsc",
			"removeOsc",
			"changeOsc",
			"changeOscProp",
			"updateOscWave",
			"changeLFO",
			"changeLFOProp",
			"updateLFOWave",
		], fns.dataCallbacks );
		this.actionCallback = fns.actionCallback || GSData.noop;
		this._crudOscs = GSData.bindCreateUpdateRemove( this, this.data.oscillators, "_osc" );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data.oscillators ).forEach( this._oscRemove, this );
	}
	recall() {
		const oscs = Object.entries( this.data.oscillators );

		oscs.forEach( kv => this.on.removeOsc( kv[ 0 ] ) );
		oscs.forEach( kv => this.on.addOsc( kv[ 0 ], kv[ 1 ] ) );
	}
	change( obj ) {
		if ( "name" in obj ) {
			this.data.name = obj.name;
		}
		if ( obj.lfo ) {
			this._lfoUpdate( obj.lfo );
		}
		if ( obj.oscillators ) {
			this._crudOscs( obj.oscillators );
		}
	}

	// .........................................................................
	_oscAdd( id, obj ) {
		const osc = Object.assign( {}, obj );

		this.data.oscillators[ id ] = osc;
		this.on.addOsc( id, osc );
		this._oscUpdate( id, osc );
	}
	_oscRemove( id ) {
		delete this.data.oscillators[ id ];
		this.on.removeOsc( id );
	}
	_oscUpdate( id, obj ) {
		const dataOsc = this.data.oscillators[ id ],
			cb = this.on.changeOscProp.bind( null, id );

		this._setProp( dataOsc, cb, "order", obj.order );
		this._setProp( dataOsc, cb, "type", obj.type );
		this._setProp( dataOsc, cb, "pan", obj.pan );
		this._setProp( dataOsc, cb, "gain", obj.gain );
		this._setProp( dataOsc, cb, "detune", obj.detune );
		this.on.updateOscWave( id );
		this.on.changeOsc( id, obj );
	}
	_lfoUpdate( obj ) {
		const dataLFO = this.data.lfo,
			cb = this.on.changeLFOProp;

		this._setProp( dataLFO, cb, "toggle", obj.toggle );
		this._setProp( dataLFO, cb, "type", obj.type );
		this._setProp( dataLFO, cb, "delay", obj.delay );
		this._setProp( dataLFO, cb, "attack", obj.attack );
		this._setProp( dataLFO, cb, "speed", obj.speed );
		this._setProp( dataLFO, cb, "amp", obj.amp );
		this.on.updateLFOWave();
		this.on.changeLFO( obj );
	}
	_setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
}

Object.freeze( GSDataSynth );

class GSDataDrums extends GSData {
	constructor( fns ) {
		super();
		this.data = {};
		this.on = this._mapCallbacks( [
			"addDrum",
			"removeDrum",
			"updateDrum",
		], fns.dataCallbacks );
		this.actionCallback = fns.actionCallback || GSData.noop;
		this._crudDrum = GSData.bindCreateUpdateRemove( this, this.data, "_drum" );
		Object.freeze( this );
	}
	change( obj ) {
		this._crudDrum( obj );
	}
	clear() {
		Object.keys( this.data ).forEach( this._drumRemove, this );
	}

	// .........................................................................
	_drumAdd( id, obj ) {
		const drum = Object.assign( {}, obj );

		this.data[ id ] = drum;
		this.on.addDrum( id, drum );
	}
	_drumRemove( id ) {
		delete this.data[ id ];
		this.on.removeDrum( id );
	}
	_drumUpdate( id, obj ) {
		Object.assign( this.data[ id ], obj );
		this.on.updateDrum( id, obj );
	}
}

Object.freeze( GSDataDrums );

class GSDataMixer extends GSData {
	constructor( fns ) {
		super();
		this.data = {};
		this.values = Object.seal( {
			maxId: 0,
			maxOrder: 0,
			nbChannels: 0,
		} );
		this.on = this._mapCallbacks( [
			"addChan",
			"removeChan",
			"toggleChan",
			"renameChan",
			"redirectChan",
			"changePanChan",
			"changeGainChan",
			"changeOrderChan",
		], fns.dataCallbacks );
		this.actionCallback = fns.actionCallback || GSData.noop;
		this._crud = GSData.createUpdateRemove.bind( null,
			this._addChan.bind( this ),
			this._updateChan.bind( this ),
			this._removeChan.bind( this ),
			this.data
		);
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		this.values.maxId = 0;
		this.values.maxOrder = 0;
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
		if ( obj.channels ) {
			this._crud( obj.channels );
		}
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
		--this.values.nbChannels;
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
		++values.nbChannels;
		values.maxId = Math.max( values.maxId, id ) || 0; // 1.
		values.maxOrder = Math.max( values.maxOrder, chanObj.order ) || 0; // 2.
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

Object.freeze( GSDataMixer );

/*
1. Why `|| 0` after Math.max ?
   Because the ID of the main channel is "main".
2. Why `|| 0` after Math.max ?
   Because the order attribute is inexistant with the "main" channel.
*/

Object.freeze( Object.assign( GSDataMixer.prototype, {
	action_updateChanProp( id, prop, val ) {
		return [
			{ [ id ]: { [ prop ]: val } },
			[ "mixer", "updateChanProp", this.data[ id ].name, prop, val ],
		];
	},
	action_toggleChan( id ) {
		const chan = this.data[ id ],
			toggle = !chan.toggle;

		return [
			{ [ id ]: { toggle } },
			[ "mixer", "toggleChan", chan.name, toggle ],
		];
	},
	action_redirectChan( id, dest ) {
		const chan = this.data[ id ];

		if ( id !== "main" && id !== dest && chan.dest !== dest ) {
			return [
				{ [ id ]: { dest } },
				[ "mixer", "redirectChan", chan.name, this.data[ dest ].name ],
			];
		}
	},
	action_addChan() {
		const id = this.values.maxId + 1,
			name = `chan ${ id }`,
			chanObj = {
				order: this.values.maxOrder + 1,
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
	action_removeChan( id ) {
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

class GSDataEffects extends GSData {
	constructor( fns ) {
		super();
		this.data = {};
		this.on = this._mapCallbacks( [
			"changeBPM",
			"addEffect",
			"removeEffect",
			"changeEffect",
			"connectEffectTo",
			"changeEffectData",
		], fns.dataCallbacks );
		this.actionCallback = fns.actionCallback || GSData.noop;
		this.values = Object.seal( {
			destFilter: null,
		} );
		this._crudEffects = GSData.bindCreateUpdateRemove( this, this.data, "_effect" );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( id => this._effectRemove( id ) );
	}
	reset() {
		const ent = Object.entries( this.data );

		ent.forEach( kv => this._effectRemove( kv[ 0 ] ) );
		ent.forEach( kv => this._effectAdd( kv[ 0 ], kv[ 1 ] ) );
	}
	change( obj ) {
		if ( obj.bpm ) {
			this.on.changeBPM( obj.bpm );
		}
		if ( obj.effects ) {
			this._crudEffects( obj.effects );
		}
	}
	setDestFilter( dest ) {
		const old = this.values.destFilter;

		if ( dest !== old ) {
			this.values.destFilter = dest;
			Object.entries( this.data ).forEach( ( [ id, fx ] ) => {
				if ( fx.dest === old ) {
					this.__effectRemove( id );
				} else if ( fx.dest === dest ) {
					this.__effectAdd( id, fx );
				}
			} );
		}
	}

	// .........................................................................
	_effectAdd( id, obj, diffObj ) {
		const fx = Object.seal( GSUtils.jsonCopy( obj ) );

		this.data[ id ] = fx;
		if ( this._fxDestOk( fx ) ) {
			this.__effectAdd( id, fx, diffObj );
		}
	}
	__effectAdd( id, fx, diffObj ) {
		this.on.addEffect( id, fx );
		this.on.changeEffect( id, "toggle", fx.toggle );
		this.on.changeEffect( id, "order", fx.order );
		this.on.changeEffectData( id, fx.data );
		if ( !GSData.isNoop( this.on.connectEffectTo ) ) {
			const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

			this.on.connectEffectTo( fx.dest, id, nextId );
			this.on.connectEffectTo( fx.dest, prevId, id );
		}
	}
	_effectRemove( id, diffObj ) {
		const fx = this.data[ id ];

		if ( this._fxDestOk( fx ) ) {
			this.__effectRemove( id, diffObj );
		}
		delete this.data[ id ];
	}
	__effectRemove( id, diffObj ) {
		if ( !GSData.isNoop( this.on.connectEffectTo ) ) {
			const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

			this.on.connectEffectTo( this.data[ id ].dest, prevId, nextId );
		}
		this.on.removeEffect( id );
	}
	_effectUpdate( id, fx, diffObj ) {
		const dataObj = this.data[ id ],
			destOk = this._fxDestOk( dataObj );

		if ( "toggle" in fx ) {
			dataObj.toggle = fx.toggle;
			if ( destOk ) {
				this.on.changeEffect( id, "toggle", fx.toggle );
			}
		}
		if ( "data" in fx ) {
			GSUtils.diffAssign( dataObj.data, fx.data );
			if ( destOk ) {
				this.on.changeEffectData( id, fx.data );
			}
		}
		if ( "order" in fx ) {
			if ( destOk && !GSData.isNoop( this.on.connectEffectTo ) ) {
				const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

				this.on.connectEffectTo( dataObj.dest, prevId, nextId );
			}
			dataObj.order = fx.order;
			if ( destOk ) {
				this.on.changeEffect( id, "order", fx.order );
				if ( !GSData.isNoop( this.on.connectEffectTo ) ) {
					const [ prevId, nextId ] = this._findSiblingFxIds( id, diffObj );

					this.on.connectEffectTo( dataObj.dest, prevId, id );
					this.on.connectEffectTo( dataObj.dest, id, nextId );
				}
			}
		}
	}

	// .........................................................................
	_fxDestOk( fx ) {
		return !this.values.destFilter || fx.dest === this.values.destFilter;
	}
	_findSiblingFxIds( id, diffObj = {} ) {
		const { dest, order } = this.data[ id ];
		let prevId = null,
			nextId = null,
			prevOrder = -Infinity,
			nextOrder = Infinity;

		Object.entries( this.data ).forEach( ( [ fxId, fx ] ) => {
			if ( fxId !== id && fx.dest === dest ) {
				const fxOrder = ( diffObj[ fxId ] || fx ).order;

				if ( prevOrder < fxOrder && fxOrder < order ) {
					prevId = fxId;
					prevOrder = fxOrder;
				}
				if ( order < fxOrder && fxOrder < nextOrder ) {
					nextId = fxId;
					nextOrder = fxOrder;
				}
			}
		} );
		return [ prevId, nextId ];
	}
}

GSDataEffects.fxsMap = new Map();
Object.freeze( GSDataEffects );

class GSDataFxFilter extends GSData {
	constructor( fns ) {
		super();
		this.on = GSData.mapCallbacks( fns.dataCallbacks, "type", "Q", "gain", "detune", "frequency", "drawCurve" );
		this.data = Object.seal( DAWCore.json.effects.filter() );
		this.actionCallback = fns.actionCallback || GSData.noop;
		Object.freeze( this );
	}

	recall() {
		this.on.type( this.data.type );
		this.on.Q( this.data.Q );
		this.on.gain( this.data.gain );
		this.on.detune( this.data.detune );
		this.on.frequency( this.data.frequency );
		this.on.drawCurve();
	}
	change( obj ) {
		this._changeProp( "type", obj.type, this.on.type );
		this._changeProp( "Q", obj.Q, this.on.Q );
		this._changeProp( "gain", obj.gain, this.on.gain );
		this._changeProp( "detune", obj.detune, this.on.detune );
		this._changeProp( "frequency", obj.frequency, this.on.frequency );
		this.on.drawCurve();
	}

	_changeProp( prop, val, cb ) {
		if ( val !== undefined ) {
			this.data[ prop ] = val;
			cb( val );
		}
	}
}

Object.freeze( GSDataFxFilter );

if ( typeof GSDataEffects !== "undefined" ) {
	GSDataEffects.fxsMap.set( "filter", GSDataFxFilter );
}

class GSDataDrumrows extends GSData {
	constructor( fns ) {
		super();
		this.data = Object.freeze( {
			patterns: {},
			drumrows: {},
		} );
		this.on = this._mapCallbacks( [
			"addDrumrow",
			"removeDrumrow",
			"changeDrumrow",
		], fns.dataCallbacks );
		this.actionCallback = fns.actionCallback || GSData.noop;
		this._crudDrumrows = GSData.bindCreateUpdateRemove( this, this.data.drumrows, "_drumrow" );
		this._crudPatterns = GSData.bindCreateUpdateRemove( this, this.data.patterns, "_pattern" );
		Object.seal( this );
	}
	change( { patterns, drumrows } ) {
		if ( patterns ) { this._crudPatterns( patterns ); }
		if ( drumrows ) { this._crudDrumrows( drumrows ); }
	}
	clear() {
		Object.keys( this.data.patterns ).forEach( id => delete this.data.patterns[ id ] );
		Object.keys( this.data.drumrows ).forEach( this._drumrowRemove, this );
	}

	// .........................................................................
	_patternAdd( id, { type, name, dest, buffer, duration } ) {
		if ( type === "buffer" ) {
			const pat = Object.seal( { name, dest, buffer, duration } );

			this.data.patterns[ id ] = pat;
			this._patternUpdate( id, pat );
		}
	}
	_patternUpdate( id, { name, duration, dest } ) {
		if ( name !== undefined || duration !== undefined || dest !== undefined ) {
			const pat = this.data.patterns[ id ],
				rowsEnt = Object.entries( this.data.drumrows )
					.filter( kv => kv[ 1 ].pattern === id );

			this.__patternUpdate( pat, rowsEnt, "name", name );
			this.__patternUpdate( pat, rowsEnt, "dest", dest );
			this.__patternUpdate( pat, rowsEnt, "duration", duration );
		}
	}
	__patternUpdate( pat, rowsEnt, prop, val ) {
		if ( val !== undefined ) {
			pat[ prop ] = val;
			rowsEnt.forEach( kv => this.on.changeDrumrow( kv[ 0 ], prop, val ) );
		}
	}
	_patternRemove( id ) {
		delete this.data.patterns[ id ];
	}

	// .........................................................................
	_drumrowAdd( id, obj ) {
		const row = Object.seal( Object.assign( {}, obj ) );

		this.data.drumrows[ id ] = row;
		this.on.addDrumrow( id, row );
		this.__drumrowUpdate( id, row );
	}
	_drumrowRemove( id ) {
		delete this.data.drumrows[ id ];
		this.on.removeDrumrow( id );
	}
	_drumrowUpdate( id, obj ) {
		const row = this.data.drumrows[ id ];

		Object.assign( row, obj );
		this.__drumrowUpdate( id, obj );
	}
	__drumrowUpdate( id, obj ) {
		const pat = this.data.patterns[ obj.pattern ];

		this.___drumrowUpdate( id, "order", obj.order );
		this.___drumrowUpdate( id, "toggle", obj.toggle );
		this.___drumrowUpdate( id, "pattern", obj.pattern );
		this.___drumrowUpdate( id, "name", obj.pattern && pat.name );
		this.___drumrowUpdate( id, "duration", obj.pattern && pat.duration );
	}
	___drumrowUpdate( id, prop, val ) {
		if ( val !== undefined ) {
			this.on.changeDrumrow( id, prop, val );
		}
	}
}

Object.freeze( GSDataDrumrows );

class DAWCore {
	constructor() {
		const ctx = new AudioContext(),
			wadrumrows = new gswaDrumrows();

		this.cb = {};
		this.env = Object.seal( {
			def_bpm: 120,
			def_appGain: 1,
			def_nbTracks: 21,
			def_stepsPerBeat: 4,
			def_beatsPerMeasure: 4,
			analyserFFTsize: 8192,
			analyserEnable: true,
			clockSteps: false,
		} );
		this.cmps = {
			local: new Map(),
			cloud: new Map(),
		};
		this.ctx = ctx;
		this._wadrumrows = wadrumrows;
		this.drums = new DAWCore.Drums( this );
		this.buffers = new DAWCore.Buffers( this );
		this.history = new DAWCore.History( this );
		this.pianoroll = new DAWCore.Pianoroll( this );
		this.composition = new DAWCore.Composition( this );
		this.destination = new DAWCore.Destination( this );
		this._loop = this._loop.bind( this );
		this._loopMs = 1;
		this._focused = this.composition;
		this._focusedStr = "composition";
		this.get = {
			currentTime: () => this.composition.currentTime,
			saveMode: () => this.composition.cmp.options.saveMode,
			composition: ( saveMode, id ) => {
				const cmp = this.composition.cmp;

				return !id || ( cmp && id === cmp.id && saveMode === cmp.options.saveMode )
					? cmp
					: this.cmps[ saveMode ].get( id );
			},
			// .................................................................
			ctx: () => this.ctx,
			audioDestination: () => this.destination.getDestination(),
			audioBuffer: id => this.buffers.getBuffer( this.composition.cmp.buffers[ id ] ).buffer,
			audioChanIn: id => this.composition._wamixer.getChanInput( id ),
			audioChanOut: id => this.composition._wamixer.getChanOutput( id ),
			audioEffect: id => this.composition._waeffects._wafxs.get( id ),
			audioSynth: id => this.composition._synths.get( id ),
			// .................................................................
			cmp: () => this.composition.cmp,
			id: () => this.composition.cmp.id,
			bpm: () => this.composition.cmp.bpm,
			name: () => this.composition.cmp.name,
			loopA: () => this.composition.cmp.loopA,
			loopB: () => this.composition.cmp.loopB,
			duration: () => this.composition.cmp.duration,
			beatsPerMeasure: () => this.composition.cmp.beatsPerMeasure,
			stepsPerBeat: () => this.composition.cmp.stepsPerBeat,
			synthOpened: () => this.composition.cmp.synthOpened,
			patternBufferOpened: () => this.composition.cmp.patternBufferOpened,
			patternDrumsOpened: () => this.composition.cmp.patternDrumsOpened,
			patternKeysOpened: () => this.composition.cmp.patternKeysOpened,
			// .................................................................
			block: id => this.composition.cmp.blocks[ id ],
			blocks: () => this.composition.cmp.blocks,
			buffer: id => this.composition.cmp.buffers[ id ],
			buffers: () => this.composition.cmp.buffers,
			channel: id => this.composition.cmp.channels[ id ],
			channels: () => this.composition.cmp.channels,
			drumrow: id => this.composition.cmp.drumrows[ id ],
			drumrows: () => this.composition.cmp.drumrows,
			drums: id => id ? this.composition.cmp.drums[ id ] : this.composition.cmp.drums, // 1.
			effect: id => this.composition.cmp.effects[ id ],
			effects: () => this.composition.cmp.effects,
			keys: id => id ? this.composition.cmp.keys[ id ] : this.composition.cmp.keys, // 1.
			pattern: id => this.composition.cmp.patterns[ id ],
			patterns: () => this.composition.cmp.patterns,
			synth: id => this.composition.cmp.synths[ id ],
			synths: () => this.composition.cmp.synths,
			track: id => this.composition.cmp.tracks[ id ],
			tracks: () => this.composition.cmp.tracks,
		};

		wadrumrows.getAudioBuffer = this.get.audioBuffer;
		wadrumrows.getChannelInput = this.get.audioChanIn;
		wadrumrows.onstartdrum = rowId => this._call( "onstartdrum", rowId );
		this.setLoopRate( 60 );
		this.setCtx( ctx );
		this.destination.setGain( this.env.def_appGain );
	}

	setCtx( ctx ) {
		this.ctx = ctx;
		this._wadrumrows.setContext( ctx );
		this.destination.setCtx( ctx );
		this.composition.setCtx( ctx );
	}
	envChange( obj ) {
		Object.assign( this.env, obj );
		if ( "clockSteps" in obj ) {
			this._clockUpdate();
		}
	}
	callAction( action, ...args ) {
		const fn = DAWCore.actions[ action ];

		if ( !fn ) {
			console.error( `DAWCore: undefined action "${ action }"` );
		} else {
			const ret = fn( ...args, this.get );

			if ( Array.isArray( ret ) ) {
				this.compositionChange( ...ret );
			} else if ( ret ) {
				const undo = GSUtils.composeUndo( this.get.cmp(), ret );

				this.composition.change( ret, undo );
			}
		}
	}
	compositionChange( obj, msg ) {
		this.history.stackChange( obj, msg );
	}
	compositionNeedSave() {
		return !this.composition._saved;
	}
	getFocusedObject() {
		return this._focused;
	}
	getFocusedName() {
		return this._focusedStr;
	}
	compositionFocus( force ) {
		if ( this._focused !== this.composition ) {
			this._focusOn( "composition", force );
		}
	}
	pianorollFocus( force ) {
		if ( this._focused !== this.pianoroll && this.get.patternKeysOpened() ) {
			this._focusOn( "pianoroll", force );
		}
	}
	drumsFocus( force ) {
		if ( this._focused !== this.drums && this.get.patternDrumsOpened() ) {
			this._focusOn( "drums", force );
		}
	}
	isPlaying() {
		return this.composition.playing || this.pianoroll.playing || this.drums.playing;
	}
	togglePlay() {
		this.isPlaying() ? this.pause() : this.play();
	}
	play() {
		this._focused.play();
		this._call( "play", this._focusedStr );
	}
	pause() {
		this._focused.pause();
		this._call( "pause", this._focusedStr );
		this._clockUpdate();
	}
	stop() {
		this._focused.stop();
		this._call( "stop", this._focusedStr );
		this._call( "currentTime", this._focused.getCurrentTime(), this._focusedStr );
		this._clockUpdate();
	}
	setLoopRate( fps ) {
		this._loopMs = 1000 / fps | 0;
	}

	// private:
	// .........................................................................
	_startLoop() {
		this._clockUpdate();
		this._loop();
	}
	_stopLoop() {
		clearTimeout( this._frameId );
		cancelAnimationFrame( this._frameId );
	}
	_loop() {
		const anData = this.destination.analyserFillData();

		if ( anData ) {
			this.composition.updateChanAudioData();
			this._call( "analyserFilled", anData );
		}
		if ( this.isPlaying() ) {
			const beat = this._focused.getCurrentTime();

			this._call( "currentTime", beat, this._focusedStr );
			this._clockUpdate();
		}
		this._frameId = this._loopMs < 20
			? requestAnimationFrame( this._loop )
			: setTimeout( this._loop, this._loopMs );
	}
	_clockUpdate() {
		this._call( "clockUpdate", this._focused.getCurrentTime() );
	}
	_focusOn( focusedStr, force ) {
		if ( force === "-f" || !this.isPlaying() ) {
			this.pause();
			this._focused = this[ focusedStr ];
			this._focusedStr = focusedStr;
			this._call( "focusOn", "composition", focusedStr === "composition" );
			this._call( "focusOn", "pianoroll", focusedStr === "pianoroll" );
			this._call( "focusOn", "drums", focusedStr === "drums" );
			this._clockUpdate();
		}
	}
	_call( cbName, ...args ) {
		const fn = this.cb[ cbName ];

		return fn && fn( ...args );
	}
}

DAWCore.json = { effects: {} };
DAWCore.utils = {};
DAWCore.common = {};
DAWCore.actions = {};

/*
1. The getter 'keys' and 'drums' can't use their singular form like the others getters
   because 'key' and 'drum' are refering to the objects contained in ONE 'keys' or 'drums'.
   So `keys[0]` is a 'keys' not a 'key', a 'key' would be `keys[0][0]`.
*/

DAWCore.Buffers = class {
	constructor( daw ) {
		this.daw = daw;
		this._files = new Map();
	}

	empty() {
		this._files.clear();
	}
	getBuffer( buf ) {
		return this._files.get( buf.hash || buf.url );
	}
	getSize() {
		return this._files.size;
	}
	setBuffer( buf ) {
		const bufCpy = Object.assign( {}, buf ),
			url = buf.url,
			key = buf.hash || url;

		this._files.set( key, bufCpy );
		return !url
			? Promise.resolve( bufCpy )
			: fetch( `../assets/samples/${ url }` )
				.then( res => res.arrayBuffer() )
				.then( arr => this.daw.ctx.decodeAudioData( arr ) )
				.then( buffer => {
					bufCpy.buffer = buffer;
					bufCpy.duration = +buffer.duration.toFixed( 4 );
					return bufCpy;
				} );
	}
	loadFiles( files ) {
		return new Promise( res => {
			const newBuffers = [],
				knownBuffers = [],
				failedBuffers = [];
			let nbDone = 0;

			Array.from( files ).forEach( file => {
				this._getBufferFromFile( file )
					.then( ( [ hash, buffer ] ) => {
						const buf = {
								hash,
								buffer,
								type: file.type,
								name: file.name,
								duration: +buffer.duration.toFixed( 4 ),
							},
							old = this.getBuffer( buf );

						if ( !old ) {
							newBuffers.push( buf );
						} else if ( !old.buffer ) {
							knownBuffers.push( buf );
						}
					}, () => {
						failedBuffers.push( {
							type: file.type,
							name: file.name,
						} );
					} )
					.finally( () => {
						if ( ++nbDone === files.length ) {
							newBuffers.forEach( this.setBuffer, this );
							knownBuffers.forEach( this.setBuffer, this );
							res( { newBuffers, knownBuffers, failedBuffers } );
						}
					} );
			} );
		} );
	}

	// private:
	_getBufferFromFile( file ) {
		return new Promise( ( res, rej ) => {
			const reader = new FileReader();

			reader.onload = e => {
				const buf = e.target.result,
					hash = this._hashBuffer_v1( new Uint8Array( buf ) ); // 1.

				this.daw.ctx.decodeAudioData( buf ).then( audiobuf => {
					res( [ hash, audiobuf ] );
				}, rej );
			};
			reader.readAsArrayBuffer( file );
		} );
	}
	_hashBuffer_v1( u8buf ) {
		const hash = new Uint8Array( 19 ),
			len = `${ u8buf.length }`.padStart( 9, "0" );
		let i = 0,
			ind = 0;

		for ( const u8 of u8buf ) {
			hash[ ind ] += u8;
			if ( ++ind >= 19 ) {
				ind = 0;
			}
			if ( ++i >= 1000000 ) {
				break;
			}
		}
		return `1-${ len }-${ Array.from( hash )
			.map( u8 => u8.toString( 16 ).padStart( 2, "0" ) )
			.join( "" ) }`;
	}
};

/*
1. the hash is calculed before the data decoded
   to bypass the "neutered ArrayBuffer" error.
*/

DAWCore.LocalStorage = Object.freeze( {
	put( id, cmp ) {
		const cpy = GSUtils.jsonCopy( cmp );

		DAWCore.Composition.epure( cpy );
		localStorage.setItem( id, JSON.stringify( cpy ) );
	},
	delete( id ) {
		localStorage.removeItem( id );
	},
	has( id ) {
		return id in localStorage;
	},
	get( id ) {
		try {
			const cmp = JSON.parse( localStorage.getItem( id ) );

			return id === cmp.id ? cmp : null;
		} catch ( e ) {
			return null;
		}
	},
	getAll() {
		const cmps = Object.keys( localStorage )
				.reduce( ( arr, id ) => {
					const cmp = this.get( id );

					cmp && arr.push( cmp );
					return arr;
				}, [] );

		cmps.sort( ( a, b ) => a.savedAt < b.savedAt );
		return cmps;
	},
} );

DAWCore.Destination = class {
	constructor( daw ) {
		this.daw = daw;
		this._gain = 1;
		this.empty();
	}

	getDestination() {
		return this._inputNode;
	}
	getGain() {
		return this._gain;
	}
	setGain( v ) {
		this._gain = v;
		this._gainNode.gain.value = v * v;
	}
	empty() {
		this._gainNode && this._gainNode.disconnect();
		this._inputNode && this._inputNode.disconnect();
		this._analyserNode && this._analyserNode.disconnect();
		this._gainNode =
		this._inputNode =
		this._analyserNode =
		this._analyserData = null;
	}
	setCtx( ctx ) {
		const offline = ctx instanceof OfflineAudioContext;

		this.empty();
		this.ctx = ctx;
		this._inputNode = ctx.createGain();
		this._gainNode = ctx.createGain();
		this._gainNode.connect( ctx.destination );
		this._inputNode.connect( this._gainNode );
		this.toggleAnalyser( !offline && this.daw.env.analyserEnable );
	}
	analyserFillData() {
		if ( this._analyserNode ) {
			this._analyserNode.getByteFrequencyData( this._analyserData );
			return this._analyserData;
		}
	}
	toggleAnalyser( b ) {
		if ( this._analyserNode ) {
			this._analyserNode.disconnect();
		}
		if ( b ) {
			const an = this.ctx.createAnalyser(),
				fftSize = this.daw.env.analyserFFTsize;

			this._analyserNode = an;
			this._analyserData = new Uint8Array( fftSize / 2 );
			an.fftSize = fftSize;
			an.smoothingTimeConstant = 0;
			an.connect( this._gainNode );
			this._inputNode.connect( an );
		} else {
			this._analyserNode =
			this._analyserData = null;
			this._inputNode.connect( this._gainNode );
		}
	}
};

DAWCore.History = class {
	constructor( daw ) {
		this.daw = daw;
		this._stack = [];
		this._stackInd = 0;
		this._stackCue = -1;
	}

	empty() {
		const stack = this._stack;

		while ( stack.length ) {
			this.daw._call( "historyDeleteAction", stack.pop() );
		}
		this._stackInd = 0;
	}
	stackChange( redo, msg ) {
		const stack = this._stack,
			undo = GSUtils.composeUndo( this.daw.composition.cmp, redo ),
			act = { redo, undo },
			desc = this.nameAction( act, msg );

		act.desc = desc.t;
		act.icon = desc.i;
		while ( stack.length > this._stackInd ) {
			this.daw._call( "historyDeleteAction", stack.pop() );
		}
		++this._stackInd;
		act.index = stack.push( act );
		this._change( GSUtils.deepFreeze( act ), "redo", "historyAddAction" );
	}
	getCurrentAction() {
		return this._stack[ this._stackInd - 1 ] || null;
	}
	goToAction( act ) {
		let n = act.index - this._stackInd;

		     if ( n < 0 ) { while ( n++ < 0 ) { this.undo(); } }
		else if ( n > 0 ) { while ( n-- > 0 ) { this.redo(); } }
		return false;
	}
	undo() {
		return this._stackInd > 0
			? this._change( this._stack[ --this._stackInd ], "undo", "historyUndo" )
			: false;
	}
	redo() {
		return this._stackInd < this._stack.length
			? this._change( this._stack[ this._stackInd++ ], "redo", "historyRedo" )
			: false;
	}

	// private:
	_change( act, undoredo, cbStr ) {
		const obj = act[ undoredo ],
			prevObj = undoredo === "undo" ? act.redo : act.undo;

		this.daw._call( cbStr, act );
		this.daw.composition.change( obj, prevObj );
		return obj;
	}
};

DAWCore.History.prototype.nameAction = function( act, msg ) {
	if ( msg ) {
		const [ part, actionName, ...args ] = msg,
			fn = DAWCore.History.actionsToText[ part ][ actionName ],
			[ i, t ] = fn ? fn( ...args ) : { i: "close", t: "undefined" };

		if ( !fn ) {
			console.error( `DAWCore: description 404 for "${ part }.${ actionName }"` );
		}
		return { i, t };
	}
	return this._nameAction( act );
};

DAWCore.History.actionsToText = {
	cmp: {
		renameComposition: ( old, neww ) => [ "pen", `rename compo "${ old || "untitled" }" to "${ neww }"` ],
		changeTempo: ( bpm, bPM, sPB ) => [ "clock", `new tempo ${ bpm } (${ bPM }/${ sPB })` ],
		changeLoop: ( a, b ) => [ "loop", `change loop ${ a } -> ${ b }` ],
		removeLoop: () => [ "loop", `remove loop` ],
	},
	synth: {
		addOscillator: syn => [ "oscillator", `${ syn }: add osc` ],
		removeOscillator: syn => [ "oscillator", `${ syn }: remove osc` ],
		reorderOscillator: syn => [ "sort", `${ syn }: reorder oscs` ],
		changeOscillator: ( syn, prop, val ) => [ "oscillator", `${ syn }: change osc ${ prop } -> ${ val }` ],
		toggleLFO: ( syn, b ) => [ "osc-sine", `${ syn }: ${ b ? "enable" : "disable" } LFO` ],
		changeLFO: ( syn, prop, val ) => [ "osc-sine", `${ syn }: LFO's ${ prop } = ${ val }` ],
	},
	synths: {
		addSynth: syn => [ "oscillator", `add new synth "${ syn }"` ],
		renameSynth: ( old, neww ) => [ "pen", `rename synth "${ old }" -> "${ neww }"` ],
		removeSynth: syn => [ "minus", `remove synth "${ syn }"` ],
		redirectSynth: ( syn, chanDest ) => [ "redirect", `redirect synth "${ syn }" to chan "${ chanDest }"` ],
	},
	mixer: {
		addChan: chan => [ "plus", `mixer: new channel "${ chan }"`, ],
		removeChan: chan => [ "minus", `mixer: delete "${ chan }"`, ],
		reorderChan: chan => [ "sort", `mixer: reorder "${ chan }"`, ],
		renameChan: ( chan, prev ) => [ "pen", `mixer: rename "${ prev }" -> "${ chan }"` ],
		toggleChan: ( chan, b ) => [ b ? "unmute" : "mute", `mixer: ${ b ? "unmute" : "mute" } "${ chan }"`, ],
		updateChanProp: ( chan, prop, val ) => [ "mixer", `mixer: "${ chan }" ${ prop }: ${ val }`, ],
		redirectChan: ( chan, chanDest ) => [ "redirect", `mixer: redirect "${ chan }" to "${ chanDest }"`, ],
	},
	patterns: {
		addPattern: ( type, pat ) => [ "plus", `add new ${ type } "${ pat }"` ],
		addPatternKeys: ( pat, syn ) => [ "plus", `add new keys "${ pat }" of synth "${ syn }"` ],
		renamePattern: ( type, old, neww ) => [ "pen", `rename ${ type } "${ old }" -> "${ neww }"` ],
		removePattern: ( type, pat ) => [ "minus", `remove ${ type } "${ pat }"` ],
		reorderPattern: ( type, pat ) => [ "sort", `reorder ${ type } "${ pat }"` ],
		clonePattern: ( type, pat, patSrc ) => [ "clone", `clone ${ type } "${ patSrc }" to "${ pat }"` ],
		redirectPattern: ( pat, chanDest ) => [ "redirect", `redirect buffer "${ pat }" to chan "${ chanDest }"` ],
		redirectPatternKeys: ( pat, syn ) => [ "redirect", `redirect keys "${ pat }" to synth "${ syn }"` ],
	},
	effects: {
		addEffect: ( dest, type ) => [ "effects", `fx: new ${ type } on ${ dest }`, ],
		toggleEffect: ( dest, type, b ) => [ b ? "unmute" : "mute", `fx: ${ b ? "unmute" : "mute" } ${ type } of ${ dest }`, ],
		removeEffect: ( dest, type ) => [ "minus", `fx: remove ${ type } of ${ dest }`, ],
		changeEffect: ( dest, type, prop ) => [ "effects", `fx: change ${ type }'s ${ prop } of ${ dest }` ],
	},
	drumrows: {
		addDrumrow: row => [ "drums", `drumrows: new "${ row }"` ],
		removeDrumrow: row => [ "drums", `drumrows: remove "${ row }"` ],
		reorderDrumrow: row => [ "drums", `drumrows: reorder "${ row }"` ],
		changeDrumrow: ( row, prop, val ) => [ "drums", `drumrows: "${ row }" ${ prop }: ${ val }` ],
		changeDrumrowPattern: ( row, newPat ) => [ "drums", `drumrows: "${ row }" -> "${ newPat }"` ],
		toggleDrumrow: ( row, b ) => [ "drums", `drumrows: ${ b ? "unmute" : "mute" } "${ row }"` ],
		toggleOnlyDrumrow: ( row, b ) => [ "drums", `drumrows: ${ b ? "unmute all" : `mute all except "${ row }"` }` ],
	},
	drums: {
		addDrums: ( pat, row, nb ) => [ "drums", `drums: add ${ nb } "${ row }" in "${ pat }"` ],
		removeDrums: ( pat, row, nb ) => [ "drums", `drums: remove ${ nb } "${ row }" of "${ pat }"` ],
	},
};

// Everything below this line has to be removed to be sorted and rewrite above.
// .............................................................................

DAWCore.History.prototype._nameAction = function( act ) {
	const cmp = this.daw.get.composition(),
		r = act.redo,
		u = act.undo;

	return (
		DAWCore.History._nameAction_tracks( cmp, r, u ) ||
		DAWCore.History._nameAction_blocks( cmp, r, u ) ||
		DAWCore.History._nameAction_keys( cmp, r, u ) ||
		{ i: "close", t: "undefined" }
	);
};

DAWCore.History._nameAction_blocks = function( cmp, r, u ) {
	const rBlcs = r.blocks;

	for ( const id in rBlcs ) {
		const arrK = Object.keys( rBlcs ),
			rBlc = rBlcs[ id ],
			msg = `${ arrK.length } block${ arrK.length > 1 ? "s" : "" }`;

		if ( !rBlc )                             { return { i: "erase",  t: `Remove ${ msg }` }; }
		if ( !u.blocks[ id ] )                   { return { i: "music",  t: `Add ${ msg }` }; }
		if ( "duration" in rBlc )                { return { i: "crop",   t: `Crop ${ msg }` }; }
		if ( "when" in rBlc || "track" in rBlc ) { return { i: "arrows", t: `Move ${ msg }` }; }
		if ( "selected" in rBlc ) {
			return rBlc.selected
				? { i: "mouse", t: `Select ${ msg }` }
				: { i: "mouse", t: `Unselect ${ msg }` };
		}
	}
};

DAWCore.History._nameAction_tracks = function( cmp, r, u ) {
	const o = r.tracks;

	if ( o ) {
		let a, i = 0;

		for ( a in o ) {
			if ( o[ a ].name ) {
				return { i: "pen", t: `Name track: "${ u.tracks[ a ].name }" -> "${ o[ a ].name }"` };
			}
			if ( i++ ) {
				break;
			}
		}
		return i > 1
			? { i: "unmute", t: "Un/mute several tracks" }
			: {
				i: o[ a ].toggle ? "unmute" : "mute",
				t: `${ o[ a ].toggle ? "Unmute" : "Mute" } "${ cmp.tracks[ a ].name }" track`
			};
	}
};

DAWCore.History._nameAction_keys = function( cmp, r, u ) {
	for ( const a in r.keys ) {
		const o = r.keys[ a ];

		for ( const b in o ) {
			const arrK = Object.keys( o ),
				msgPat = cmp.patterns[ cmp.patternKeysOpened ].name,
				msgSmp = `${ arrK.length } key${ arrK.length > 1 ? "s" : "" }`,
				oB = o[ b ];

			return (
				( !oB                             && { i: "erase",  t: `${ msgPat }: remove ${       msgSmp }` } ) ||
				( !u.keys[ a ][ b ]               && { i: "keys",   t: `${ msgPat }: add ${          msgSmp }` } ) ||
				( "duration" in oB                && { i: "crop",   t: `${ msgPat }: crop ${         msgSmp }` } ) ||
				( "gain" in oB                    && { i: "keys",   t: `${ msgPat }: edit gain of ${ msgSmp }` } ) ||
				( "pan" in oB                     && { i: "keys",   t: `${ msgPat }: edit pan of ${  msgSmp }` } ) ||
				( ( "when" in oB || "key" in oB ) && { i: "arrows", t: `${ msgPat }: move ${         msgSmp }` } ) ||
				( "selected" in oB && ( oB.selected
					? { i: "mouse", t: `${ msgPat }: select ${ msgSmp }` }
					: { i: "mouse", t: `${ msgPat }: unselect ${ msgSmp }` }
				) )
			);
		}
	}
};

DAWCore.Drums = class {
	constructor( daw ) {
		const waDrums = new gswaDrumsScheduler( daw.ctx );

		this.daw = daw;
		this.looping =
		this.playing = false;
		this.loopA =
		this.loopB = null;
		this.duration = 0;
		this._ctx = daw.ctx;
		this._waDrums = waDrums;
		Object.seal( this );

		waDrums.setDrumrows( daw._wadrumrows );
	}

	change( patObj, drumsObj ) {
		this._waDrums.change( drumsObj );
		if ( patObj && "duration" in patObj ) {
			this.duration = patObj.duration;
			if ( !this.looping && this.playing ) {
				this._waDrums.scheduler.setLoopBeat( 0, this.duration );
			}
		}
	}
	openPattern( id ) {
		const daw = this.daw,
			wasPlaying = this.playing;

		id ? daw.drumsFocus()
			: daw.compositionFocus( "-f" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		this._waDrums.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			this.change( pat, daw.get.drums( pat.drums ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}

	// controls
	// .........................................................................
	getCurrentTime() {
		return this._waDrums.scheduler.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._waDrums.scheduler.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "drums" );
		this.daw._clockUpdate();
	}
	setBPM( bpm ) {
		this._waDrums.scheduler.setBPM( bpm );
	}
	setLoop( a, b ) {
		this.loopA = a;
		this.loopB = b;
		this.looping = true;
		this._waDrums.scheduler.setLoopBeat( a, b );
	}
	clearLoop() {
		this.loopA =
		this.loopB = null;
		this.looping = false;
		this._waDrums.scheduler.setLoopBeat( 0, this.duration || this.daw.get.beatsPerMeasure() );
	}
	startLiveDrum( rowId ) {
		this.daw._wadrumrows.startLiveDrum( rowId );
	}
	stopLiveDrum( rowId ) {
		this.daw._wadrumrows.stopLiveDrum( rowId );
		this.daw._call( "onstopdrumrow", rowId )
	}
	play() {
		if ( !this.playing ) {
			const a = this.looping ? this.loopA : 0,
				b = this.looping ? this.loopB : this.duration;

			this.playing = true;
			this._waDrums.scheduler.setLoopBeat( a, b );
			this._waDrums.scheduler.startBeat( 0, this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._waDrums.stop();
		}
	}
	stop() {
		if ( this.playing ) {
			this.pause();
			this.setCurrentTime( this.loopA || 0 );
		} else {
			this.setCurrentTime( 0 );
		}
	}
};

DAWCore.Pianoroll = class {
	constructor( daw ) {
		const waKeys = new gswaKeysScheduler( daw.ctx );

		this.daw = daw;
		this.keys = {};
		this.looping =
		this.playing = false;
		this._synth =
		this.loopA =
		this.loopB = null;
		this.duration = 0;
		this._ctx = daw.ctx;
		this._waKeys = waKeys;
		this._keysStartedLive = {};
	}

	change( patObj, keysObj ) {
		this._waKeys.change( keysObj );
		if ( patObj && "duration" in patObj ) {
			this.duration = patObj.duration;
			if ( !this.looping && this.playing ) {
				this._waKeys.scheduler.setLoopBeat( 0, this.duration );
			}
		}
	}
	setSynth( id ) {
		const syn = id ? this.daw.get.audioSynth( id ) : null,
			wasPlaying = this.playing;

		if ( syn !== this._synth ) {
			if ( wasPlaying ) {
				this.pause();
			}
			this._synth = syn;
			this._waKeys.setSynth( syn );
			if ( wasPlaying ) {
				this.play();
			}
		}
	}
	openPattern( id ) {
		const daw = this.daw,
			wasPlaying = this.playing;

		id ? daw.pianorollFocus()
			: daw.compositionFocus( "-f" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		this._waKeys.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			this.setSynth( pat.synth );
			this.change( pat, daw.get.keys( pat.keys ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}

	// controls
	// ........................................................................
	getCurrentTime() {
		return this._waKeys.scheduler.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._waKeys.scheduler.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "pianoroll" );
		this.daw._clockUpdate();
	}
	setBPM( bpm ) {
		this._waKeys.scheduler.setBPM( bpm );
	}
	setLoop( a, b ) {
		this.loopA = a;
		this.loopB = b;
		this.looping = true;
		this._waKeys.scheduler.setLoopBeat( a, b );
	}
	clearLoop() {
		this.loopA =
		this.loopB = null;
		this.looping = false;
		this._waKeys.scheduler.setLoopBeat( 0, this.duration || this.daw.get.beatsPerMeasure() );
	}
	liveKeydown( midi ) {
		if ( !( midi in this._keysStartedLive ) ) {
			this._keysStartedLive[ midi ] = this._synth.startKey( [ [ null, {
				key: midi,
				pan: 0,
				gain: .8,
				lowpass: 1,
				highpass: 1,
			} ] ], this._waKeys.scheduler.currentTime(), 0, Infinity );
		}
	}
	liveKeyup( midi ) {
		if ( this._keysStartedLive[ midi ] ) {
			this._synth.stopKey( this._keysStartedLive[ midi ] );
			delete this._keysStartedLive[ midi ];
		}
	}
	play() {
		if ( !this.playing ) {
			const a = this.looping ? this.loopA : 0,
				b = this.looping ? this.loopB : this.duration;

			this.playing = true;
			this._waKeys.scheduler.setLoopBeat( a, b );
			this._waKeys.scheduler.startBeat( 0, this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._waKeys.stop();
		}
	}
	stop() {
		if ( this.playing ) {
			this.pause();
			this.setCurrentTime( this.loopA || 0 );
		} else {
			this.setCurrentTime( 0 );
		}
	}
};

DAWCore.Composition = class {
	constructor( daw ) {
		const sch = new gswaScheduler(),
			wamix = new gswaMixer(),
			wafxs = new gswaEffects( {
				getChanInput: wamix.getChanInput.bind( wamix ),
				getChanOutput: wamix.getChanOutput.bind( wamix ),
			} );

		this.daw = daw;
		this.cmp = null;
		this.loaded =
		this.playing = false;
		this._saved = true;
		this._sched = sch;
		this._wamixer = wamix;
		this._waeffects = wafxs;
		this._synths = new Map();
		this._startedSched = new Map();
		this._startedBuffers = new Map();
		this._actionSavedOn = null;
		sch.currentTime = () => this.ctx.currentTime;
		sch.ondatastart = this._onstartBlock.bind( this );
		sch.ondatastop = this._onstopBlock.bind( this );
	}

	// un/load, change, save
	// .........................................................................
	setCtx( ctx ) {
		gswaPeriodicWaves.clearCache();
		this.ctx = ctx;
		this._wamixer.setContext( ctx ); // 1.
		this._wamixer.connect( this.daw.get.audioDestination() );
		this._waeffects.setContext( ctx );
		this._synths.forEach( ( syn, synId ) => {
			syn.setContext( ctx );
			syn.output.disconnect();
			syn.output.connect( this.daw.get.audioChanIn( this.cmp.synths[ synId ].dest ) );
		} );
	}
	load( cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = GSUtils.jsonCopy( cmpOri );

			if ( DAWCore.Composition.format( cmp ) ) {
				this.unload();
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			this.cmp = cmp;
			this.loaded = true;
			Object.entries( cmp.buffers ).forEach( kv => {
				this.daw.buffers.setBuffer( kv[ 1 ] )
					.then( buf => {
						if ( buf.buffer ) {
							this.daw._call( "buffersLoaded", { [ kv[ 0 ] ]: buf } );
						}
					} );
			} );
			this.change( cmp, {
				keys: {},
				drums: {},
				synths: {},
				blocks: {},
				buffers: {},
				drumrows: {},
				channels: {},
				patterns: {},
			} );
			this._actionSavedOn = null;
			this._saved = cmp.options.saveMode === "cloud" ||
				DAWCore.LocalStorage.has( cmp.id ) || !cmp.savedAt;
			this.daw._call( "compositionSavedStatus", cmp, this._saved );
			return cmp;
		} );
	}
	unload() {
		if ( this.loaded ) {
			const d = this._sched.data;

			this.loaded = false;
			this._waeffects.clear(); // 1.
			this._wamixer.clear();
			this._sched.stop();
			Object.keys( d ).forEach( id => delete d[ id ] );
			this._synths.clear();
			this.daw._wadrumrows.clear();
			this._saved = true;
			this.daw._call( "compositionSavedStatus", this.cmp, true );
			this.cmp = null;
		}
	}
	save() {
		if ( !this._saved ) {
			this._saved = true;
			this._actionSavedOn = this.daw.history.getCurrentAction();
			this.cmp.savedAt = Math.floor( Date.now() / 1000 );
			return true;
		}
	}
	updateChanAudioData() {
		const mix = this._wamixer,
			fn = this.daw._call.bind( this.daw, "channelAnalyserFilled" );

		Object.keys( mix.gsdata.data ).forEach( chanId => {
			mix.fillAudioData( chanId );
			fn( chanId, mix.audioDataL, mix.audioDataR );
		} );
	}

	// controls
	// .........................................................................
	getCurrentTime() {
		return this._sched.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._sched.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "composition" );
		this.daw._clockUpdate();
	}
	play() {
		if ( !this.playing ) {
			this.playing = true;
			this._start( this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._sched.stop();
		}
	}
	stop() {
		if ( this.playing ) {
			this.pause();
			this.setCurrentTime( this.cmp.loopA || 0 );
		} else {
			this.setCurrentTime( 0 );
		}
	}

	// .........................................................................
	_setLoop( a, b ) {
		if ( Number.isFinite( a ) ) {
			this._sched.setLoopBeat( a, b );
		} else {
			this._sched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
		}
	}
	_start( offset ) {
		const sch = this._sched;

		if ( this.ctx instanceof OfflineAudioContext ) {
			sch.clearLoop();
			sch.enableStreaming( false );
			sch.startBeat( 0 );
		} else {
			this._setLoop( this.cmp.loopA, this.cmp.loopB );
			sch.enableStreaming( true );
			sch.startBeat( 0, offset );
		}
	}

	// .........................................................................
	assignPatternChange( patId, keys ) {
		this._startedSched.forEach( ( [ patId2, sched ] ) => {
			if ( patId2 === patId ) {
				sched.change( keys );
			}
		} );
	}
	redirectPatternBuffer( patId, chanId ) {
		this._startedBuffers.forEach( ( [ patId2, absn ] ) => {
			if ( patId2 === patId ) {
				absn.disconnect();
				absn.connect( this.daw.get.audioChanIn( chanId ) );
			}
		} );
	}

	// .........................................................................
	_onstartBlock( startedId, blcs, when, off, dur ) {
		const cmp = this.cmp,
			blc = blcs[ 0 ][ 1 ];

		if ( cmp.tracks[ blc.track ].toggle ) {
			const patId = blc.pattern,
				pat = cmp.patterns[ patId ];

			switch ( pat.type ) {
				case "buffer": {
					const buf = this.daw.get.audioBuffer( pat.buffer );

					if ( buf ) {
						const absn = this.ctx.createBufferSource();

						absn.buffer = buf;
						absn.connect( this.daw.get.audioChanIn( pat.dest ) );
						absn.start( when, off, dur );
						this._startedBuffers.set( startedId, [ patId, absn ] );
					}
				} break;
				case "keys": {
					const waKeys = new gswaKeysScheduler( this.ctx );

					this._startedSched.set( startedId, [ patId, waKeys ] );
					waKeys.scheduler.setBPM( cmp.bpm );
					waKeys.setSynth( this.daw.get.audioSynth( pat.synth ) );
					waKeys.change( cmp.keys[ pat.keys ] );
					waKeys.start( when, off, dur );
				} break;
				case "drums": {
					const waDrums = new gswaDrumsScheduler( this.ctx );

					this._startedSched.set( startedId, [ patId, waDrums ] );
					waDrums.scheduler.setBPM( cmp.bpm );
					waDrums.setDrumrows( this.daw._wadrumrows );
					waDrums.change( cmp.drums[ pat.drums ] );
					waDrums.start( when, off, dur );
				} break;
			}
		}
	}
	_onstopBlock( startedId ) {
		const objStarted =
				this._startedSched.get( startedId ) ||
				this._startedBuffers.get( startedId );

		if ( objStarted ) {
			objStarted[ 1 ].stop();
			this._startedSched.delete( startedId );
			this._startedBuffers.delete( startedId );
		}
	}
};

/*
1. The order between the mixer and the effects is important.
*/

DAWCore.Composition.epure = function( cmp ) {
	delete cmp.options;
	if ( cmp.loopA == null || cmp.loopB == null ) {
		delete cmp.loopA;
		delete cmp.loopB;
	}
	Object.values( cmp.drumrows ).forEach( row => {
		if ( row.toggle ) { delete row.toggle; }
	} );
	Object.values( cmp.tracks ).forEach( tr => {
		if ( !tr.name ) { delete tr.name; }
		if ( tr.toggle ) { delete tr.toggle; }
	} );
	Object.values( cmp.blocks ).forEach( blc => {
		if ( !blc.offset ) { delete blc.offset; }
		if ( !blc.selected ) { delete blc.selected; }
		if ( !blc.durationEdited ) { delete blc.durationEdited; }
	} );
	Object.values( cmp.keys ).forEach( keys => {
		Object.values( keys ).forEach( key => {
			if ( !key.offset ) { delete key.offset; }
			if ( !key.selected ) { delete key.selected; }
			if ( key.prev == null ) { delete key.prev; }
			if ( key.next == null ) { delete key.next; }
		} );
	} );
	return cmp;
};

DAWCore.Composition.format = function( cmp ) {
	const blcsValues = Object.values( cmp.blocks );
	let orderDefault = 0;

	// loopA/B
	// ..........................................
	if ( Number.isFinite( cmp.loopA ) && Number.isFinite( cmp.loopB ) ) {
		cmp.loopA = Math.max( 0, cmp.loopA );
		cmp.loopB = Math.max( 0, cmp.loopB );
		if ( cmp.loopA === cmp.loopB ) {
			cmp.loopA =
			cmp.loopB = null;
		}
	} else {
		cmp.loopA =
		cmp.loopB = null;
	}

	// ***Opened
	// ..........................................
	cmp.synthOpened = cmp.synthOpened ? `${ cmp.synthOpened }` : null;
	cmp.patternKeysOpened = cmp.patternKeysOpened ? `${ cmp.patternKeysOpened }` : null;
	cmp.patternBufferOpened = cmp.patternBufferOpened ? `${ cmp.patternBufferOpened }` : null;
	delete cmp.patternOpened;

	// buffers
	// ..........................................
	cmp.buffers = cmp.buffers || {};

	// drums
	// ..........................................
	cmp.drums = cmp.drums || {};
	cmp.drumrows = cmp.drumrows || {};
	Object.values( cmp.drumrows ).forEach( row => {
		row.toggle = row.toggle !== false;
	} );

	// channels
	// ..........................................
	if ( !cmp.channels ) {
		cmp.channels = DAWCore.json.channels();
		Object.values( cmp.synths ).forEach( syn => syn.dest = "main" );
	}
	if ( ( !cmp.savedAt || cmp.savedAt < 1574550000 ) && cmp.channels.main.gain > .8 ) { // Sun Nov 24 2019 00:00:00 GMT+0100
		cmp.channels.main.gain = .4;
	}
	delete cmp.channels.main.order;

	// effects
	// ..........................................
	cmp.effects = cmp.effects || {};

	// patterns
	// ..........................................
	Object.values( cmp.patterns ).forEach( pat => {
		if ( !( "order" in pat ) ) {
			pat.order = orderDefault;
		}
		orderDefault = Math.max( pat.order, orderDefault ) + 1;
		if ( pat.type === "keys" ) {
			pat.synth = pat.synth || "0";
		}
	} );

	// synths
	// ..........................................
	if ( !cmp.synths ) {
		cmp.synths = { 0: DAWCore.json.synth() };
	}
	Object.values( cmp.synths ).forEach( syn => {
		delete syn.envelopes;
		syn.lfo = syn.lfo || DAWCore.json.lfo();
		Object.values( syn.oscillators ).forEach( osc => {
			osc.detune = Math.min( Math.max( -24, Math.round( osc.detune ) ), 24 );
		} );
	} );

	// ..........................................
	Object.values( cmp.tracks ).reduce( ( order, tr ) => {
		tr.name = typeof tr.name === "string" ? tr.name : "";
		tr.order = typeof tr.order === "number" ? tr.order : order;
		tr.toggle = typeof tr.toggle === "boolean" ? tr.toggle : true;
		return tr.order + 1;
	}, 0 );
	blcsValues.sort( ( a, b ) => a.when - b.when );
	cmp.blocks = blcsValues.reduce( ( obj, blc, i ) => {
		blc.offset = blc.offset || 0;
		blc.selected = !!blc.selected;
		blc.durationEdited = !!blc.durationEdited;
		obj[ i ] = blc;
		return obj;
	}, {} );
	Object.values( cmp.keys ).forEach( keys => {
		Object.values( keys ).forEach( k => {
			k.pan = GSUtils.castToNumber( k.pan, 0, -1, 1, 2 );
			k.gain = GSUtils.castToNumber( k.gain, .8, 0, 1, 2 );
			k.attack = GSUtils.castToNumber( k.attack, 0, 0, Infinity, 3 );
			k.release = GSUtils.castToNumber( k.release, 0, 0, Infinity, 3 );
			k.lowpass = GSUtils.castToNumber( k.lowpass, 1, 0, 1, 2 );
			k.highpass = GSUtils.castToNumber( k.highpass, 1, 0, 1, 2 );
			k.selected = !!k.selected;
			if ( typeof k.prev === "number" ) { k.prev += ""; }
			if ( typeof k.next === "number" ) { k.next += ""; }
			k.prev = k.prev || null;
			k.next = k.next || null;
			delete k.durationEdited;
			if ( typeof k.key === "string" ) {
				if ( window.gsuiKeys ) {
					k.key = window.gsuiKeys.keyStrToMidi( k.key );
				} else {
					console.warn( "DAWCore.Composition.format: gsuiKeys is needed to convert an old midi notation" );
					return false;
				}
			}
		} );
	} );
	return true;
};

DAWCore.Composition.prototype.change = function( obj, prevObj ) {
	const cmp = this.cmp,
		act = this.daw.history.getCurrentAction(),
		saved = act === this._actionSavedOn && !!cmp.savedAt;

	GSUtils.diffAssign( cmp, obj );
	this._wamixer.change( obj );
	this.daw._wadrumrows.change( obj );
	this._waeffects.change( obj );
	this.change.fn.forEach( ( fn, attr ) => {
		if ( typeof attr === "string" ) {
			if ( attr in obj ) {
				fn.call( this, obj, prevObj );
			}
		} else if ( attr.some( attr => attr in obj ) ) {
			fn.call( this, obj, prevObj );
		}
	} );

	if ( saved !== this._saved ) {
		this._saved = saved;
		this.daw._call( "compositionSavedStatus", cmp, saved );
	}
	this.daw._call( "compositionChanged", obj, prevObj );
	return obj;
};

DAWCore.Composition.prototype.change.fn = new Map( [
	[ "bpm", function( { bpm } ) {
		this._sched.setBPM( bpm );
		this._synths.forEach( syn => syn.setBPM( bpm ) );
		this.daw.drums.setBPM( bpm );
		this.daw.pianoroll.setBPM( bpm );
	} ],
	[ "blocks", function( { blocks } ) {
		GSUtils.diffAssign( this._sched.data, blocks );
	} ],
	[ [ "loopA", "loopB" ], function() {
		if ( this.daw.getFocusedObject() === this ) {
			this._sched.setLoopBeat(
				this.cmp.loopA || 0,
				this.cmp.loopB || this.cmp.duration || this.cmp.beatsPerMeasure );
		}
	} ],
	[ "duration", function() {
		if ( this.daw.getFocusedObject() === this && this.cmp.loopA === null ) {
			this._sched.setLoopBeat( 0, this.cmp.duration || this.cmp.beatsPerMeasure );
		}
	} ],
	[ "synths", function( { synths }, { synths: prevSynths } ) {
		Object.entries( synths ).forEach( ( [ id, synthObj ] ) => {
			if ( !synthObj ) {
				this._synths.get( id ).stopAllKeys();
				this._synths.delete( id );
			} else if ( !prevSynths[ id ] ) {
				const syn = new gswaSynth();

				syn.setContext( this.ctx );
				syn.setBPM( this.cmp.bpm );
				syn.change( synthObj );
				syn.output.connect( this._wamixer.getChanInput( synthObj.dest ) );
				this._synths.set( id, syn );
			} else {
				const syn = this._synths.get( id );

				if ( "oscillators" in synthObj || "lfo" in synthObj ) {
					syn.change( synthObj );
				}
				if ( "dest" in synthObj ) {
					syn.output.disconnect();
					syn.output.connect( this._wamixer.getChanInput( synthObj.dest ) );
				}
			}
		} );
	} ],
	[ "patterns", function( { patterns } ) {
		Object.entries( patterns ).forEach( ( [ patId, patObj ] ) => {
			if ( patObj && "dest" in patObj && this.cmp.patterns[ patId ].type === "buffer" ) {
				this.redirectPatternBuffer( patId, patObj.dest );
			}
		} );
	} ],
	[ "keys", function( { keys, patterns } ) {
		const pats = Object.entries( this.cmp.patterns ),
			patOpened = this.cmp.patternKeysOpened;

		Object.entries( keys ).forEach( ( [ keysId, keysObj ] ) => {
			pats.some( ( [ patId, patObj ] ) => {
				if ( patObj.keys === keysId ) {
					this.assignPatternChange( patId, keysObj );
					if ( patId === patOpened ) {
						this.daw.pianoroll.change( patterns && patterns[ patId ], keysObj );
					}
					return true;
				}
			} );
		} );
	} ],
	[ "drums", function( { drums, patterns } ) {
		const pats = Object.entries( this.cmp.patterns ),
			patOpened = this.cmp.patternDrumsOpened;

		Object.entries( drums ).forEach( ( [ drumsId, drumsObj ] ) => {
			pats.some( ( [ patId, patObj ] ) => {
				if ( patObj.drums === drumsId ) {
					this.assignPatternChange( patId, drumsObj );
					if ( patId === patOpened ) {
						this.daw.drums.change( patterns && patterns[ patId ], drumsObj );
					}
					return true;
				}
			} );
		} );
	} ],
	[ "patternKeysOpened", function( obj ) {
		this.daw.pianoroll.openPattern( obj.patternKeysOpened );
	} ],
	[ "patternDrumsOpened", function( obj ) {
		this.daw.drums.openPattern( obj.patternDrumsOpened );
	} ],
	[ "synthOpened", function( obj ) {
		this.daw.pianoroll.setSynth( obj.synthOpened );
	} ],
] );

DAWCore.json.composition = ( env, id ) => {
	const tracks = {},
		sPB = env.def_stepsPerBeat,
		bPM = env.def_beatsPerMeasure;

	for ( let i = 0; i < env.def_nbTracks; ++i ) {
		tracks[ i ] = {};
	}
	return {
		id,
		name: "",
		bpm: env.def_bpm,
		stepsPerBeat: sPB,
		beatsPerMeasure: bPM,
		duration: bPM,
		loopA: false,
		loopB: false,
		synthOpened: "0",
		patternKeysOpened: "0",
		patternDrumsOpened: "1",
		patternBufferOpened: null,
		buffers: {
			0: { type: "audio/wav", duration: .1529, url: "kick-00.wav" },
			1: { type: "audio/wav", duration: .256, url: "clap-00.wav" },
			2: { type: "audio/wav", duration: .0357, url: "hat-00.wav" },
			3: { type: "audio/wav", duration: .1151, url: "snare-00.wav" },
		},
		patterns: {
			0: { order: 0, type: "keys", name: "keys", keys: "0", synth: "0", duration: bPM, },
			1: { order: 0, type: "drums", name: "drums", drums: "0", duration: bPM, },
			2: { order: 0, type: "buffer", dest: "main", buffer: "0", duration: 1, name: "kick" },
			3: { order: 1, type: "buffer", dest: "main", buffer: "1", duration: 1, name: "clap" },
			4: { order: 2, type: "buffer", dest: "main", buffer: "2", duration: 1, name: "hat" },
			5: { order: 3, type: "buffer", dest: "main", buffer: "3", duration: 1, name: "snare" },
		},
		channels: DAWCore.json.channels(),
		tracks,
		blocks: {
			0: { pattern: "0", track: "0", when: 0, duration: bPM },
			1: { pattern: "1", track: "1", when: 0, duration: bPM },
		},
		synths: { 0: DAWCore.json.synth() },
		drumrows: {
			0: { order: 0, pattern: "2", gain: 1, pan: 0 },
			1: { order: 1, pattern: "3", gain: 1, pan: 0 },
			2: { order: 2, pattern: "4", gain: 1, pan: 0 },
			3: { order: 3, pattern: "5", gain: 1, pan: 0 },
		},
		drums: { 0: {} },
		keys: { 0: {} },
	};
};

DAWCore.json.channel = obj => Object.assign( {
	order: 0,
	toggle: true,
	name: "chan",
	dest: "main",
	gain: 1,
	pan: 0,
}, obj );

DAWCore.json.channels = () => {
	const main = DAWCore.json.channel( { name: "main", gain: .4 } );

	delete main.dest;
	delete main.order;
	return {
		main,
		1: DAWCore.json.channel( { order: 0, name: "chan 1" } ),
		2: DAWCore.json.channel( { order: 1, name: "chan 2" } ),
		3: DAWCore.json.channel( { order: 2, name: "chan 3" } ),
		4: DAWCore.json.channel( { order: 3, name: "chan 4" } ),
	};
};

DAWCore.json.drumrow = obj => Object.assign( {
	order: 0,
	toggle: true,
	pattern: null,
	gain: 1,
	pan: 0,
}, obj );

DAWCore.json.drum = obj => Object.assign( {
	when: 0,
	row: null,
	gain: 1,
	pan: 0,
}, obj );

DAWCore.json.effects.filter = obj => Object.assign( {
	type: "lowpass",
	Q: 5,
	gain: -20,
	detune: 0,
	frequency: 500,
}, obj );

DAWCore.json.lfo = obj => Object.assign( {
	toggle: false,
	type: "sine",
	delay: 0,
	attack: 1,
	speed: 1,
	amp: 1,
}, obj );

DAWCore.json.oscillator = obj => Object.assign( {
	order: 0,
	type: "sine",
	pan: 0,
	gain: 1,
	detune: 0,
}, obj );

DAWCore.json.synth = obj => Object.assign( {
	name: "synth",
	dest: "main",
	lfo: DAWCore.json.lfo(),
	oscillators: {
		0: DAWCore.json.oscillator( { gain: .75 } ),
		1: DAWCore.json.oscillator( { order: 1, gain: .2, detune: -24 } ),
	},
}, obj );

DAWCore.common.calcNewDuration = ( newPatDurations, get ) => {
	const bPM = get.beatsPerMeasure(),
		dur = Object.values( get.blocks() ).reduce( ( max, blc ) => {
			const pat = newPatDurations[ blc.pattern ],
				dur = ( pat && !blc.durationEdited ? pat : blc ).duration;

			return Math.max( max, blc.when + dur );
		}, 0 );

	return Math.ceil( dur / bPM ) * bPM;
};

DAWCore.common.createUniqueName = ( collection, name, get ) => {
	const arr = Object.values( get[ collection ]() );

	return GSUtils.uniqueName( name, arr.map( obj => obj.name ) );
};

DAWCore.common.getDrumrowName = ( rowId, get ) => {
	return get.pattern( get.drumrow( rowId ).pattern ).name;
};

DAWCore.common.getNextIdOf = obj => {
	const id = Object.keys( obj )
		.reduce( ( max, id ) => Math.max( max, parseInt( id ) || 0 ), 0 );

	return `${ id + 1 }`;
};

DAWCore.common.getNextOrderOf = obj => {
	return Object.values( obj )
		.reduce( ( max, item ) => Math.max( max, item.order ), -1 ) + 1;
};

DAWCore.actions.addDrumrow = ( pattern, get ) => {
	const pat = get.pattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = get.drumrows(),
			id = DAWCore.common.getNextIdOf( drumrows ),
			order = DAWCore.common.getNextOrderOf( drumrows ),
			rowObj = DAWCore.json.drumrow( { pattern, order } );

		return [
			{ drumrows: { [ id ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
};

DAWCore.actions.addDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( true, patternId, rowId, whenFrom, whenTo, get );
};

DAWCore.actions._addDrums = ( status, patternId, rowId, whenFrom, whenTo, get ) => {
	const stepDur = 1 / get.stepsPerBeat(),
		whenA = Math.round( Math.min( whenFrom, whenTo ) / stepDur ),
		whenB = Math.round( Math.max( whenFrom, whenTo ) / stepDur ),
		pat = get.pattern( patternId ),
		drums = get.drums( pat.drums ),
		drumrows = get.drumrows(),
		patRowId = get.drumrow( rowId ).pattern,
		patRow = get.pattern( patRowId ),
		drumsEnt = Object.entries( drums ),
		drumsMap = drumsEnt.reduce( ( map, [ drumId, drum ] ) => {
			if ( drum.row === rowId ) {
				map.set( Math.round( drum.when / stepDur ), drumId );
			}
			return map;
		}, new Map() ),
		newDrums = {},
		nextDrumId = +DAWCore.common.getNextIdOf( drums );
	let nbDrums = 0,
		drumWhenMax = pat.duration;

	for ( let w = whenA; w <= whenB; ++w ) {
		const drmId = drumsMap.get( w );

		if ( drmId ) {
			if ( !status ) {
				newDrums[ drmId ] = undefined;
				++nbDrums;
			}
		} else if ( status ) {
			const when = w * stepDur;

			drumWhenMax = Math.max( drumWhenMax, when + .001 );
			newDrums[ nextDrumId + nbDrums ] = DAWCore.json.drum( { when, row: rowId } );
			++nbDrums;
		}
	}
	if ( nbDrums > 0 && !status ) {
		drumWhenMax = drumsEnt.reduce( ( dur, [ drumId, drum ] ) => {
			return drumId in newDrums
				? dur
				: Math.max( dur, drum.when + .001 );
		}, 0 );
	}
	if ( nbDrums > 0 ) {
		const bPM = get.beatsPerMeasure(),
			duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM,
			obj = { drums: { [ pat.drums ]: newDrums } };

		if ( pat.duration !== duration ) {
			const blocks = Object.entries( get.blocks() ).reduce( ( obj, [ blcId, blc ] ) => {
					if ( blc.pattern === patternId && !blc.durationEdited ) {
						obj[ blcId ] = { duration };
					}
					return obj;
				}, {} );

			obj.patterns = { [ patternId ]: { duration } };
			if ( GSUtils.isntEmpty( blocks ) ) {
				const duration = DAWCore.common.calcNewDuration( obj.patterns, get );

				obj.blocks = blocks;
				if ( duration !== get.duration() ) {
					obj.duration = duration;
				}
			}
		}
		return [
			obj,
			[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
		];
	}
};

DAWCore.actions.addEffect = ( dest, type, get ) => {
	const fxs = get.effects(),
		destFxs = Object.values( fxs ).filter( fx => fx.dest === dest ),
		id = DAWCore.common.getNextIdOf( fxs ),
		fx = {
			dest,
			type,
			toggle: true,
			order: DAWCore.common.getNextOrderOf( destFxs ),
			data: DAWCore.json.effects[ type ](),
		};

	return [
		{ effects: { [ id ]: fx } },
		[ "effects", "addEffect", get.channel( dest ).name, type ],
	];
};

DAWCore.actions.addOscillator = ( synthId, get ) => {
	const oscs = get.synth( synthId ).oscillators,
		id = DAWCore.common.getNextIdOf( oscs ),
		osc = DAWCore.json.oscillator();

	osc.order = DAWCore.common.getNextOrderOf( oscs );
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", get.synth( synthId ).name ],
	];
};

DAWCore.actions.addPatternDrums = get => {
	const pats = get.patterns(),
		drumsId = DAWCore.common.getNextIdOf( get.keys() ),
		patId = DAWCore.common.getNextIdOf( pats ),
		patName = DAWCore.common.createUniqueName( "patterns", "drums", get ),
		order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.type !== "drums"
				? max
				: Math.max( max, pat.order );
		}, 0 ) + 1,
		obj = {
			drums: { [ drumsId ]: {} },
			patterns: { [ patId ]: {
				order,
				type: "drums",
				name: patName,
				drums: drumsId,
				duration: get.beatsPerMeasure(),
			} },
			patternDrumsOpened: patId,
		};

	return [
		obj,
		[ "patterns", "addPattern", "drums", patName ],
	];
};

DAWCore.actions.addPatternKeys = ( synthId, get ) => {
	const pats = get.patterns(),
		keysId = DAWCore.common.getNextIdOf( get.keys() ),
		patId = DAWCore.common.getNextIdOf( pats ),
		patName = DAWCore.common.createUniqueName( "patterns", "keys", get ),
		synName = get.synth( synthId ).name,
		order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.synth !== synthId
				? max
				: Math.max( max, pat.order );
		}, 0 ) + 1,
		obj = {
			keys: { [ keysId ]: {} },
			patterns: { [ patId ]: {
				order,
				type: "keys",
				name: patName,
				keys: keysId,
				synth: synthId,
				duration: get.beatsPerMeasure(),
			} },
			patternKeysOpened: patId,
		};

	if ( synthId !== get.synthOpened() ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "addPatternKeys", patName, synName ],
	];
};

DAWCore.actions.addSynth = get => {
	const id = DAWCore.common.getNextIdOf( get.synths() ),
		name = DAWCore.common.createUniqueName( "synths", "synth", get ),
		obj = {
			synths: { [ id ]: DAWCore.json.synth( { name } ) },
			synthOpened: id,
		};

	if ( get.patternKeysOpened() != null ) {
		obj.patternKeysOpened = null;
	}
	return [
		obj,
		[ "synths", "addSynth", name ],
	];
};

DAWCore.actions.changeChannels = ( channels, msg, get ) => {
	const synths = Object.entries( get.synths() ),
		patterns = Object.entries( get.patterns() )
			.filter( kv => kv[ 1 ].type === "buffer" ),
		objSynths = {},
		objPatterns = {},
		obj = { channels };

	Object.entries( channels ).forEach( ( [ chanId, chanObj ] ) => {
		if ( !chanObj ) {
			synths.forEach( kv => {
				if ( kv[ 1 ].dest === chanId ) {
					objSynths[ kv[ 0 ] ] = { dest: "main" };
				}
			} );
			patterns.forEach( kv => {
				if ( kv[ 1 ].dest === chanId ) {
					objPatterns[ kv[ 0 ] ] = { dest: "main" };
				}
			} );
		}
	} );
	GSUtils.addIfNotEmpty( obj, "synths", objSynths );
	GSUtils.addIfNotEmpty( obj, "patterns", objPatterns );
	return [ obj, msg ];
};

DAWCore.actions.changeDrumrow = ( rowId, prop, val, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get );

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
};

DAWCore.actions.changeDrumrowPattern = ( rowId, pattern, get ) => {
	const row = get.drumrow( rowId ),
		pat = get.pattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = DAWCore.common.getDrumrowName( rowId, get );

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
};

DAWCore.actions.changeEffect = ( fxId, prop, val, get ) => {
	const fx = get.effect( fxId );

	return [
		{ effects: { [ fxId ]: { data: { [ prop ]: val } } } },
		[ "effects", "changeEffect", get.channel( fx.dest ).name, fx.type, prop ],
	];
};

DAWCore.actions.changeLFO = ( synthId, prop, val, get ) => {
	return [
		{ synths: { [ synthId ]: { lfo: { [ prop ]: val } } } },
		[ "synth", "changeLFO", get.synth( synthId ).name, prop, val ],
	];
};

DAWCore.actions.changeLoop = ( a, b ) => {
	return Number.isFinite( a )
		? [
			{ loopA: a, loopB: b },
			[ "cmp", "changeLoop", a, b ]
		] : [
			{ loopA: null, loopB: null },
			[ "cmp", "removeLoop" ]
		];
};

DAWCore.actions.changeOscillator = ( synthId, oscId, prop, val, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ oscId ]: { [ prop ]: val } } } } },
		[ "synth", "changeOscillator", get.synth( synthId ).name, prop, val ],
	];
};

DAWCore.actions.changePatternKeys = ( patId, keysObj, duration, get ) => {
	const pat = get.pattern( patId ),
		keys = get.keys( pat.keys ),
		obj = { keys: { [ pat.keys ]: keysObj } };

	if ( duration !== pat.duration ) {
		const objPatterns = { [ patId ]: { duration } },
			cmpDur = DAWCore.common.calcNewDuration( objPatterns, get ),
			objBlocks = Object.entries( get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = objPatterns;
		GSUtils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( Math.abs( cmpDur - get.duration() ) > .001 ) {
			obj.duration = cmpDur;
		}
	}
	return [
		obj,
	];
};

DAWCore.actions.changeTempo = ( bpm, bPM, sPB, get ) => {
	const bpmChanged = bpm !== get.bpm(),
		timeSignChanged =
			bPM !== get.beatsPerMeasure() ||
			sPB !== get.stepsPerBeat();

	if ( timeSignChanged || bpmChanged ) {
		const obj = {};

		if ( timeSignChanged ) {
			obj.beatsPerMeasure = bPM;
			obj.stepsPerBeat = sPB;
		}
		if ( bpmChanged ) {
			const objPatterns = {};

			obj.bpm = bpm;
			Object.entries( get.patterns() ).forEach( ( [ id, pat ] ) => {
				if ( pat.type === "buffer" ) {
					const buf = get.buffer( pat.buffer ),
						duration = Math.ceil( buf.duration * ( bpm / 60 ) );

					if ( duration !== pat.duration ) {
						objPatterns[ id ] = { duration };
					}
				}
			} );
			if ( GSUtils.isntEmpty( objPatterns ) ) {
				const objBlocks = {};

				obj.patterns = objPatterns;
				Object.entries( get.blocks() ).forEach( ( [ id, blc ] ) => {
					const pat = objPatterns[ blc.pattern ];

					if ( pat && !blc.durationEdited ) {
						objBlocks[ id ] = { duration: pat.duration };
					}
				} );
				if ( GSUtils.isntEmpty( objBlocks ) ) {
					const cmpDur = DAWCore.common.calcNewDuration( objPatterns, get );

					obj.blocks = objBlocks;
					if ( cmpDur !== get.duration() ) {
						obj.duration = cmpDur;
					}
				}
			}
		}
		return [
			obj,
			[ "cmp", "changeTempo", bpm, bPM, sPB ],
		];
	}
};

DAWCore.actions.clonePattern = ( patId, get ) => {
	const pat = get.pattern( patId ),
		type = pat.type,
		newPat = Object.assign( {}, pat ),
		newPatId = DAWCore.common.getNextIdOf( get.patterns() ),
		obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCore.common.createUniqueName( "patterns", pat.name, get );
	if ( type === "keys" || type === "drums" ) {
		const newCnt = GSUtils.jsonCopy( get[ type ]( pat[ type ] ) ),
			newCntId = DAWCore.common.getNextIdOf( get[ type ]() );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ type === "keys"
			? "patternKeysOpened"
			: "patternDrumsOpened" ] = newPatId;
	}
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
};

DAWCore.actions.redirectToChannel = ( family, id, dest, get ) => {
	const node = get[ family ]( id ),
		chanName = get.channel( dest ).name,
		families = `${ family }s`;

	return [
		{ [ families ]: { [ id ]: { dest } } },
		[ families, `redirect${ GSUtils.capitalize( family ) }`, node.name, chanName ],
	];
};

DAWCore.actions.removeDrumrow = ( rowId, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get );

	return [
		DAWCore.actions._removeDrumrow( {}, rowId, get ),
		[ "drumrows", "removeDrumrow", patName ],
	];
};

DAWCore.actions._removeDrumrow = ( obj, rowId, get ) => {
	const bPM = get.beatsPerMeasure(),
		blocksEnt = Object.entries( get.blocks() ),
		patternsEnt = Object.entries( get.patterns() ),
		objDrums = {},
		objBlocks = {},
		objPatterns = {};

	obj.drumrows = obj.drumrows || {};
	obj.drumrows[ rowId ] = undefined;
	patternsEnt.forEach( ( [ patId, pat ] ) => {
		if ( pat.type === "drums" ) {
			const drumsObj = {},
				drumWhenMax = Object.entries( get.drums( pat.drums ) )
					.reduce( ( max, [ id, { row, when } ] ) => {
						if ( row === rowId ) {
							drumsObj[ id ] = undefined;
						}
						return row in obj.drumrows ? max : Math.max( max, when + .001 );
					}, 0 );

			if ( GSUtils.isntEmpty( drumsObj ) ) {
				const duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM;

				objDrums[ pat.drums ] = drumsObj;
				if ( duration !== pat.duration ) {
					objPatterns[ patId ] = { duration };
					blocksEnt.forEach( ( [ blcId, blc ] ) => {
						if ( blc.pattern === patId && !blc.durationEdited ) {
							objBlocks[ blcId ] = { duration };
						}
					} );
				}
			}
		}
	} );
	GSUtils.addIfNotEmpty( obj, "drums", objDrums );
	GSUtils.addIfNotEmpty( obj, "patterns", objPatterns );
	if ( GSUtils.isntEmpty( objBlocks ) ) {
		const duration = DAWCore.common.calcNewDuration( objPatterns, get );

		obj.blocks = objBlocks;
		if ( duration !== get.duration() ) {
			obj.duration = duration;
		}
	}
	return obj;
};

DAWCore.actions.removeDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( false, patternId, rowId, whenFrom, whenTo, get );
};

DAWCore.actions.removeEffect = ( id, get ) => {
	const fx = get.effect( id );

	return [
		{ effects: { [ id ]: undefined } },
		[ "effects", "removeEffect", get.channel( fx.dest ).name, fx.type ],
	];
};

DAWCore.actions.removeOscillator = ( synthId, id, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", get.synth( synthId ).name ],
	];
};

DAWCore.actions.removePattern = ( patId, get ) => {
	const pat = get.pattern( patId ),
		type = pat.type,
		obj = { patterns: { [ patId ]: undefined } },
		blocks = Object.entries( get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
			if ( blc.pattern === patId ) {
				blocks[ blcId ] = undefined;
			}
			return blocks;
		}, {} );

	if ( type === "buffer" ) {
		Object.entries( get.drumrows() ).forEach( kv => {
			if ( kv[ 1 ].pattern === patId ) {
				GSUtils.deepAssign( obj,
					DAWCore.actions._removeDrumrow( obj, kv[ 0 ], get ) );
			}
		} );
	} else {
		obj[ type ] = { [ pat[ type ] ]: undefined };
	}
	if ( GSUtils.isntEmpty( blocks ) ) {
		const realDur = Object.values( get.blocks() )
				.reduce( ( dur, blc ) => {
					return blc.pattern === patId
						? dur
						: Math.max( dur, blc.when + blc.duration );
				}, 0 ),
			bPM = get.beatsPerMeasure(),
			dur = Math.max( 1, Math.ceil( realDur / bPM ) ) * bPM;

		obj.blocks = blocks;
		if ( dur !== get.duration() ) {
			obj.duration = dur;
		}
	}
	if ( type === "keys" ) {
		if ( patId === get.patternKeysOpened() ) {
			if ( !Object.entries( get.patterns() ).some( ( [ k, v ] ) => {
				if ( k !== patId && v.synth === pat.synth ) {
					obj.patternKeysOpened = k;
					return true;
				}
			} ) ) {
				obj.patternKeysOpened = null;
			}
		}
	} else if ( type === "drums" ) {
		if ( patId === get.patternDrumsOpened() ) {
			if ( !Object.entries( get.patterns() ).some( ( [ k, v ] ) => {
				if ( k !== patId && v.type === "drums" ) {
					obj.patternDrumsOpened = k;
					return true;
				}
			} ) ) {
				obj.patternDrumsOpened = null;
			}
		}
	}
	return [
		obj,
		[ "patterns", "removePattern", pat.type, pat.name ],
	];
};

DAWCore.actions.removeSynth = ( synthId, get ) => {
	const keys = {},
		blocks = {},
		patterns = {},
		cmpBlocks = Object.entries( get.blocks() ),
		cmpPatterns = Object.entries( get.patterns() ),
		obj = { synths: { [ synthId ]: undefined } };

	cmpPatterns.forEach( ( [ patId, pat ] ) => {
		if ( pat.synth === synthId ) {
			keys[ pat.keys ] =
			patterns[ patId ] = undefined;
			cmpBlocks.forEach( ( [ blcId, blc ] ) => {
				if ( blc.pattern === patId ) {
					blocks[ blcId ] = undefined;
				}
			} );
		}
	} );
	GSUtils.addIfNotEmpty( obj, "keys", keys );
	GSUtils.addIfNotEmpty( obj, "patterns", patterns );
	GSUtils.addIfNotEmpty( obj, "blocks", blocks );
	if ( synthId === get.synthOpened() ) {
		if ( !Object.keys( get.synths() ).some( k => {
			if ( k !== synthId ) {
				obj.synthOpened = k;
				if ( !cmpPatterns.some( ( [ patId, pat ] ) => {
					if ( pat.synth === k ) {
						obj.patternKeysOpened = patId;
						return true;
					}
				} ) ) {
					obj.patternKeysOpened = null;
				}
				return true;
			}
		} ) ) {
			obj.synthOpened = null;
		}
	}
	return [
		obj,
		[ "synths", "removeSynth", get.synth( synthId ).name ],
	];
};

DAWCore.actions.renameComposition = ( nameBrut, get ) => {
	const name = GSUtils.trim2( nameBrut ),
		oldName = get.name();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		]
	}
};

DAWCore.actions.renamePattern = ( id, newName, get ) => {
	const name = GSUtils.trim2( newName ),
		pat = get.pattern( id );

	if ( name && name !== pat.name ) {
		return [
			{ patterns: { [ id ]: { name } } },
			[ "patterns", "renamePattern", pat.type, pat.name, name ],
		];
	}
};

DAWCore.actions.renameSynth = ( id, newName, get ) => {
	const syn = get.synth( id ),
		name = GSUtils.trim2( newName );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
};

DAWCore.actions.reorderDrumrow = ( rowId, drumrows, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
};

DAWCore.actions.reorderOscillator = ( synthId, oscillators, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators } } },
		[ "synth", "reorderOscillator", get.synth( synthId ).name ],
	];
};

DAWCore.actions.toggleDrumrow = ( rowId, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get ),
		toggle = !get.drumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
};

DAWCore.actions.toggleEffect = ( fxId, get ) => {
	const fx = get.effect( fxId ),
		toggle = !fx.toggle;

	return [
		{ effects: { [ fxId ]: { toggle } } },
		[ "effects", "toggleEffect", get.channel( fx.dest ).name, fx.type, toggle ],
	];
};

DAWCore.actions.toggleLFO = ( synthId, get ) => {
	const toggle = !get.synth( synthId ).lfo.toggle;

	return [
		{ synths: { [ synthId ]: { lfo: { toggle } } } },
		[ "synth", "toggleLFO", get.synth( synthId ).name, toggle ],
	];
};

DAWCore.actions.toggleOnlyDrumrow = ( rowId, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get ),
		entries = Object.entries( get.drumrows() ),
		someOn = entries.some( kv => kv[ 0 ] !== rowId && kv[ 1 ].toggle === true ),
		drumrows = entries.reduce( ( obj, [ id, row ] ) => {
			const itself = id === rowId;

			if ( ( itself && !row.toggle ) || ( !itself && row.toggle === someOn ) ) {
				obj[ id ] = { toggle: !row.toggle };
			}
			return obj;
		}, {} );

	return [
		{ drumrows },
		[ "drumrows", "toggleOnlyDrumrow", patName, !someOn ],
	];
};

DAWCore.prototype.addCompositionsFromLocalStorage = function() {
	return Promise.all( DAWCore.LocalStorage
		.getAll().map( cmp => this.addComposition( cmp ) ) );
};

DAWCore.prototype.addNewComposition = function( opt ) {
	return this.addComposition(
		DAWCore.json.composition( this.env, GSUtils.uuid() ), opt );
};

DAWCore.prototype.addComposition = function( cmp, opt = {} ) {
	const cpy = GSUtils.jsonCopy( cmp );

	cpy.options = Object.freeze( Object.assign( {
		saveMode: "local",
	}, opt ) );
	this.cmps[ cpy.options.saveMode ].set( cpy.id, cpy );
	this._call( "compositionAdded", cpy );
	this._call( "compositionSavedStatus", cpy, true );
	return Promise.resolve( cpy );
};

DAWCore.prototype.addCompositionByJSON = function( json, opt ) {
	return new Promise( ( res, rej ) => {
		try {
			const cmp = JSON.parse( json );

			this.addComposition( cmp, opt ).then( res, rej );
		} catch ( e ) {
			rej( e );
		}
	} );
};

// a read check is missing somewhere...

DAWCore.prototype.addCompositionByBlob = function( blob, opt ) {
	return new Promise( ( res, rej ) => {
		const rd = new FileReader();

		rd.onload = () => {
			this.addCompositionByJSON( rd.result, opt ).then( res, rej );
		};
		rd.readAsText( blob );
	} );
};

DAWCore.prototype.addCompositionByURL = function( url, opt ) {
	return fetch( url )
		.then( res => {
			if ( !res.ok ) {
				throw `The file is not accessible: ${ url }`;
			}
			return res.json();
		} )
		.then(
			cmp => this.addComposition( cmp, opt ),
			e => { throw e; }
		);
};

DAWCore.prototype.abortWAVExport = function() {
	if ( this.ctx instanceof OfflineAudioContext ) {
		this.composition.stop();
	}
};

DAWCore.prototype.dropAudioFiles = function( files ) {
	const order = this.buffers.getSize();

	this.buffers.loadFiles( files ).then( ( { newBuffers, knownBuffers, failedBuffers } ) => {
		if ( newBuffers.length || knownBuffers.length ) {
			const cmpBuffers = this.get.buffers(),
				bufNextId = +DAWCore.common.getNextIdOf( cmpBuffers ),
				patNextId = +DAWCore.common.getNextIdOf( this.get.patterns() ),
				buffersLoaded = {};

			if ( newBuffers.length ) {
				const obj = {};

				obj.buffers = {};
				obj.patterns = {};
				newBuffers.forEach( ( buf, i ) => {
					const dotind = buf.name.lastIndexOf( "." ),
						patname = dotind > -1 ? buf.name.substr( 0, dotind ) : buf.name,
						bufId = bufNextId + i;

					obj.buffers[ bufId ] = {
						type: buf.type,
						duration: buf.duration,
						hash: buf.hash,
					};
					obj.patterns[ patNextId + i ] = {
						type: "buffer",
						dest: "main",
						buffer: `${ bufId }`,
						duration: Math.ceil( buf.duration * ( this.get.bpm() / 60 ) ),
						name: patname,
						order: order + i,
					};
					buffersLoaded[ bufId ] = this.buffers.getBuffer( buf );
				} );
				this.compositionChange( obj );
			}
			if ( knownBuffers.length ) {
				const bufmap = Object.entries( cmpBuffers )
						.reduce( ( map, [ idBuf, buf ] ) => {
							map.set( buf.hash, idBuf );
							return map;
						}, new Map() );

				knownBuffers.forEach( buf => {
					const idBuf = bufmap.get( buf.hash );

					buffersLoaded[ idBuf ] = this.buffers.getBuffer( buf );
				} );
			}
			this._call( "buffersLoaded", buffersLoaded );
		}
		if ( failedBuffers.length > 0 ) {
			console.log( "failedBuffers", failedBuffers );
			// show a popup
		}
	} );
};

DAWCore.prototype.liveChangeSynth = function( id, obj ) {
	this.composition._synths.get( id ).change( obj );
};

DAWCore.prototype.liveChangeEffect = function( fxId, prop, val ) {
	this.composition._waeffects.liveChangeFxProp( fxId, prop, val );
};

DAWCore.prototype.liveChangeChannel = function( chanId, prop, val ) {
	this.composition._wamixer.gsdata.liveChange( chanId, prop, val );
};

DAWCore.prototype.exportCompositionToWAV = function() {
	const ctx = this.ctx,
		gain = this.destination.getGain(),
		dur = Math.ceil( this.get.duration() * 60 / this.get.bpm() ) || 1,
		ctxOff = new OfflineAudioContext( 2, dur * ctx.sampleRate | 0, ctx.sampleRate );

	this.stop();
	if ( DAWCore._URLToRevoke ) {
		URL.revokeObjectURL( DAWCore._URLToRevoke );
	}
	this.setCtx( ctxOff );
	this.destination.setGain( 1 );
	this.composition.play();
	return ctxOff.startRendering().then( buffer => {
		const pcm = gswaEncodeWAV.encode( buffer, { float32: true } ),
			url = URL.createObjectURL( new Blob( [ pcm ] ) );

		this.composition.stop();
		this.setCtx( ctx );
		this.destination.setGain( gain );
		DAWCore._URLToRevoke = url;
		return {
			url,
			name: `${ this.get.name() || "untitled" }.wav`,
		};
	} );
};

DAWCore.prototype.exportCompositionToJSON = function( saveMode, id ) {
	const cmp = this.get.composition( saveMode, id );

	if ( cmp ) {
		return {
			name: `${ cmp.name || "untitled" }.gs`,
			url: this._exportCompositionToJSON(
				DAWCore.Composition.epure(
				GSUtils.jsonCopy( cmp ) ) )
		};
	}
};

DAWCore._exportJSONTabs = {
	keys: 4,
	synths: 5,
	tracks: 3,
	blocks: 3,
	buffers: 3,
	channels: 3,
	patterns: 3,
	drumrows: 3,
};

DAWCore.prototype._exportCompositionToJSON = function( cmp ) {
	const delTabs = DAWCore._exportJSONTabs,
		reg = /^\t"(\w*)": {$/,
		lines = JSON.stringify( cmp, null, "\t" ).split( "\n" );
	let regTab,
		regTa2,
		delTabCurr;

	if ( DAWCore._URLToRevoke ) {
		URL.revokeObjectURL( DAWCore._URLToRevoke );
	}
	lines.forEach( ( line, i ) => {
		const res = reg.exec( line );

		if ( res ) {
			if ( delTabCurr = delTabs[ res[ 1 ] ] ) {
				regTab = new RegExp( `^\\t{${ delTabCurr }}` );
				regTa2 = new RegExp( `^\\t{${ delTabCurr - 1 }}\\}` );
			}
		}
		if ( delTabCurr ) {
			lines[ i ] = lines[ i ].replace( regTab, "~" ).replace( regTa2, "~}" );
		}
	} );
	return DAWCore._URLToRevoke = URL.createObjectURL( new Blob( [
		lines.join( "\n" ).replace( /\n~/g, " " ) ] ) );
};

DAWCore.prototype.deleteComposition = function( saveMode, id ) {
	if ( this.composition.cmp && id === this.get.id() ) {
		this.closeComposition();
	}
	this._deleteComposition( this.cmps[ saveMode ].get( id ) );
};

DAWCore.prototype._deleteComposition = function( cmp ) {
	if ( cmp ) {
		const saveMode = cmp.options.saveMode;

		this.cmps[ saveMode ].delete( cmp.id );
		if ( saveMode === "local" ) {
			DAWCore.LocalStorage.delete( cmp.id );
		}
		this._call( "compositionDeleted", cmp );
	}
};

DAWCore.prototype.closeComposition = function() {
	if ( this.composition.loaded ) {
		const cmp = this.cmps[ this.get.saveMode() ].get( this.get.id() );

		this.stop();
		this.pianoroll.clearLoop();
		this.pianoroll.setCurrentTime( 0 );
		this.composition.setCurrentTime( 0 );
		this._stopLoop();
		this._call( "compositionClosed", cmp );
		this.composition.unload();
		this.history.empty();
		this.buffers.empty();
		if ( !cmp.savedAt ) {
			this._deleteComposition( cmp );
		}
	}
};

DAWCore.prototype.openComposition = function( saveMode, id ) {
	const cmp = this.get.composition( saveMode, id );

	if ( cmp ) {
		if ( this.composition.loaded ) {
			this.closeComposition();
		}
		return ( this.get.composition( saveMode, id ) // 1.
		? Promise.resolve( cmp )
		: this.addNewComposition( { saveMode } ) )
			.then( cmp => this.composition.load( cmp ) )
			.then( cmp => this._compositionOpened( cmp ) );
	}
};

DAWCore.prototype._compositionOpened = function( cmp ) {
	this.compositionFocus();
	this._call( "compositionOpened", cmp );
	this._startLoop();
	return cmp;
};

/*
1. Why don't we use `cmp` instead of recalling .get.composition() ?
   Because the `cmp` could have been delete in .closeComposition()
   if the composition was a new untitled composition.
*/

DAWCore.prototype.saveComposition = function() {
	const actSave = this.composition._actionSavedOn;

	if ( this.composition.save() ) {
		const cmp = this.get.composition(),
			id = this.get.id();

		if ( this.get.saveMode() === "local" ) {
			this.cmps.local.set( id, cmp );
			DAWCore.LocalStorage.put( id, cmp );
			this._call( "compositionSavedStatus", cmp, true );
		} else {
			this.composition._saved = false;
			this._call( "compositionLoading", cmp, true );
			( this._call( "compositionSavingPromise", cmp )
			|| Promise.resolve( cmp ) )
				.finally( this._call.bind( this, "compositionLoading", cmp, false ) )
				.then( res => {
					this.composition._saved = true;
					this.cmps.cloud.set( id, cmp );
					this._call( "compositionSavedStatus", cmp, true );
					return res;
				}, err => {
					this.composition._actionSavedOn = actSave;
					this._call( "compositionSavedStatus", cmp, false );
					throw err;
				} );
		}
	}
};

DAWCore.prototype.newComposition = function( opt ) {
	const cmp = DAWCore.json.composition( this.env, GSUtils.uuid() );

	return this.addComposition( cmp, opt )
		.then( cmp => this.composition.load( cmp ) )
		.then( cmp => this._compositionOpened( cmp ) );
};

class GSDrums {
	constructor() {
		const uiDrums = new gsuiDrums(),
			uiDrumrows = uiDrums.drumrows,
			dataDrums = new GSDataDrums( {
				dataCallbacks: {
					addDrum: ( id, drum ) => uiDrums.addDrum( id, drum ),
					removeDrum: id => uiDrums.removeDrum( id ),
				},
			} ),
			dataDrumrows = new GSDataDrumrows( {
				dataCallbacks: {
					addDrumrow: id => uiDrumrows.add( id, uiDrums.createDrumrow( id ) ),
					removeDrumrow: id => uiDrumrows.remove( id ),
					changeDrumrow: ( id, prop, val ) => {
						switch ( prop ) {
							default:
								uiDrumrows.change( id, prop, val );
								break;
							case "pattern": {
								const bufId = this._dawcore.get.pattern( val ).buffer;

								uiDrumrows.change( id, prop, this._svgManager.createSVG( bufId ) );
							} break;
							case "duration": {
								const patId = this._dawcore.get.drumrow( id ).pattern,
									bufId = this._dawcore.get.pattern( patId ).buffer;

								uiDrumrows.change( id, prop, this._dawcore.get.buffer( bufId ).duration );
							} break;
						}
					},
				},
			} );

		this.rootElement = uiDrums.rootElement;
		this._uiDrums = uiDrums;
		this._uiDrumrows = uiDrumrows;
		this._dataDrums = dataDrums;
		this._dataDrumrows = dataDrumrows;
		this._dawcore =
		this._drumsId =
		this._patternId =
		this._svgManager = null;
		Object.seal( this );

		uiDrums.onchange = ( act, ...args ) => this._dawcore.callAction( act, this._patternId, ...args );
		uiDrumrows.onchange = ( ...args ) => this._dawcore.callAction( ...args );
		uiDrumrows.onlivestart = rowId => this._dawcore.drums.startLiveDrum( rowId );
		uiDrumrows.onlivestop = rowId => this._dawcore.drums.stopLiveDrum( rowId );
		uiDrums.onchangeCurrentTime = t => this._dawcore.drums.setCurrentTime( t );
		uiDrums.onchangeLoop = ( looping, a, b ) => {
			looping
				? this._dawcore.drums.setLoop( a, b )
				: this._dawcore.drums.clearLoop();
		};
		this._uiDrums.toggleShadow( true );
	}

	// .........................................................................
	setDAWCore( core ) {
		this._dawcore = core;
	}
	selectPattern( id ) {
		if ( id !== this._patternId ) {
			this._patternId = id;
			this._drumsId = null;
			this._dataDrums.clear();
			this._uiDrums.toggleShadow( !id );
			if ( id ) {
				const pat = this._dawcore.get.pattern( id ),
					drums = this._dawcore.get.drums( pat.drums );

				this._drumsId = pat.drums;
				this._dataDrums.change( drums );
			}
		}
	}
	setWaveforms( svgManager ) {
		this._svgManager = svgManager;
	}
	onstartdrum( rowId ) {
		this._uiDrumrows.playRow( rowId );
	}
	onstopdrumrow( rowId ) {
		this._uiDrumrows.stopRow( rowId );
	}
	change( obj ) {
		const drmObj = obj.drums && obj.drums[ this._drumsId ];

		this._dataDrumrows.change( obj );
		if ( obj.drumrows ) {
			this._uiDrums.drumrows.reorderDrumrows( obj.drumrows );
		}
		if ( "beatsPerMeasure" in obj || "stepsPerBeat" in obj ) {
			const bPM = obj.beatsPerMeasure || this._dawcore.get.beatsPerMeasure(),
				sPB = obj.stepsPerBeat || this._dawcore.get.stepsPerBeat();

			this._uiDrums.timeSignature( bPM, sPB );
		}
		if ( drmObj ) {
			this._dataDrums.change( drmObj );
		}
	}
	clear() {
		this.selectPattern( null );
		this._dataDrumrows.clear();
	}

	// .........................................................................
	attached() {
		this._uiDrums.attached();
	}
	resize( w, h ) {
		this._uiDrums.resize( w, h );
	}
	setFontSize( fs ) {
		this._uiDrums.drumrows.setFontSize( fs );
	}
	setPxPerBeat( ppb ) {
		this._uiDrums.setPxPerBeat( ppb );
	}
	currentTime( beat ) {
		this._uiDrums.currentTime( beat );
	}
	loop( a, b ) {
		this._uiDrums.loop( a, b );
	}
}

Object.freeze( GSDrums );

class GSEffects {
	constructor() {
		const uiEffects = new gsuiEffects(),
			dataEffects = new GSDataEffects( {
				dataCallbacks: {
					addEffect: ( id, obj ) => uiEffects.addEffect( id, obj ),
					removeEffect: id => uiEffects.removeEffect( id ),
					changeEffect: ( id, prop, val ) => uiEffects.changeEffect( id, prop, val ),
					changeEffectData: ( id, obj ) => this._changeEffectData( id, obj ),
				},
			} );

		this.rootElement = uiEffects.rootElement;
		this._uiEffects = uiEffects;
		this._dataEffects = dataEffects;
		this._dawcore = null;
		this._destFilter = "main";
		Object.seal( this );

		uiEffects.oninput = this._oninput.bind( this );
		uiEffects.onchange = this._onchange.bind( this );
	}

	// .........................................................................
	setDAWCore( core ) {
		this._dawcore = core;
	}
	setDestFilter( dest ) {
		this._destFilter = dest;
		this._dataEffects.setDestFilter( dest );
	}
	change( obj ) {
		this._dataEffects.change( obj );
		if ( obj.effects ) {
			this._uiEffects.reorderEffects( obj.effects );
		}
	}
	resize() {
		this._uiEffects.resized();
	}
	resizing() {
		this._uiEffects.resized();
	}
	attached() {
		this._uiEffects.attached();
	}
	clear() {
		this._dataEffects.clear();
	}

	// .........................................................................
	_changeEffectData( id, obj ) {
		const uiFx = this._uiEffects._fxsHtml.get( id ).uiFx;

		Object.entries( obj ).forEach( kv => uiFx.change( ...kv ) );
		if ( uiFx.updateWave ) {
			uiFx.updateWave();
		}
	}

	// events:
	// .........................................................................
	_onchange( act, ...args ) {
		if ( act === "addEffect" ) {
			args.unshift( this._destFilter );
		}
		this._dawcore.callAction( act, ...args );
	}
	_oninput( id, prop, val ) {
		this._dawcore.liveChangeEffect( id, prop, val );
	}
}

Object.freeze( GSEffects );

class GSSynth {
	constructor() {
		const uiSynth = new gsuiSynthesizer(),
			uiLFO = new gsuiLFO(),
			dataSynth = new GSDataSynth( {
				dataCallbacks: {
					addOsc: ( id, osc ) => uiSynth.addOscillator( id, osc ),
					removeOsc: id => uiSynth.removeOscillator( id ),
					changeOscProp: ( id, k, v ) => uiSynth.getOscillator( id ).change( k, v ),
					updateOscWave: id => uiSynth.getOscillator( id ).updateWave(),
					changeLFOProp: ( k, v ) => uiLFO.change( k, v ),
					updateLFOWave: () => uiLFO.updateWave(),
				},
			} );

		this.rootElement = uiSynth.rootElement;
		this._uiLFO = uiLFO;
		this._uiSynth = uiSynth;
		this._dataSynth = dataSynth;
		this._dawcore =
		this._synthId = null;
		Object.seal( this );

		uiSynth.rootElement.querySelector( ".gsuiSynthesizer-lfo" ).append( uiLFO.rootElement );
		uiLFO.oninput = this._oninputLFO.bind( this );
		uiSynth.oninput = this._oninputSynth.bind( this );
		uiLFO.onchange =
		uiSynth.onchange = this._onchange.bind( this );
	}

	// .........................................................................
	setDAWCore( core ) {
		this._dawcore = core;
	}
	setWaveList( arr ) {
		this._uiSynth.setWaveList( arr );
	}
	selectSynth( id ) {
		if ( id !== this._synthId ) {
			this._synthId = id;
			this._dataSynth.clear();
			if ( id ) {
				this._dataSynth.change( this._dawcore.get.synth( id ) );
			}
		}
	}
	change( obj ) {
		const synObj = obj.synths && obj.synths[ this._synthId ];

		if ( "beatsPerMeasure" in obj || "stepsPerBeat" in obj ) {
			this._uiLFO.timeSignature( obj.beatsPerMeasure, obj.stepsPerBeat );
		}
		if ( synObj ) {
			this._dataSynth.change( synObj );
			if ( synObj.oscillators ) {
				this._uiSynth.reorderOscillators( obj.oscillators );
			}
		}
	}
	resize() {
		this._uiLFO.resize();
	}
	resizing() {
		this._uiLFO.resizing();
	}
	attached() {
		this._uiLFO.attached();
		this._uiSynth.attached();
	}
	clear() {
		this._dataSynth.clear();
	}

	// events:
	// .........................................................................
	_onchange( act, ...args ) {
		this._dawcore.callAction( act, this._synthId, ...args );
	}
	_oninputSynth( id, prop, val ) {
		const oscillators = { [ id ]: { [ prop ]: val } };

		this._dawcore.liveChangeSynth( this._synthId, { oscillators } );
	}
	_oninputLFO( prop, val ) {
		const lfo = { [ prop ]: val };

		this._dawcore.liveChangeSynth( this._synthId, { lfo } );
	}
}

Object.freeze( GSSynth );

class gswaLFO {
	constructor( ctx ) {
		const node = ctx.createGain();

		this.ctx = ctx;
		this.node = node;
		this._oscNode =
		this._ampNode = null;
		this.data = Object.seal( {
			toggle: false,
			when: 0,
			whenStop: 0,
			offset: 0,
			type: "",
			delay: 0,
			attack: 0,
			amp: 0,
			speed: 0,
		} );
		Object.seal( this );
	}

	// .........................................................................
	start( d ) {
		const data = this.data;

		data.toggle = d.toggle || false;
		data.when = d.when || this.ctx.currentTime;
		data.whenStop = d.whenStop
			? Math.max( d.when + d.delay + d.attack + .1, d.whenStop )
			: 0;
		data.offset = d.offset || 0;
		data.type = d.type || "sine";
		data.delay = d.delay || 0;
		data.attack = d.attack || 0;
		data.amp = "amp" in d ? d.amp : 1;
		data.speed = "speed" in d ? d.speed : 4;
		if ( data.toggle && !this._oscNode ) {
			this._start();
		}
	}
	destroy() {
		if ( this._oscNode ) {
			this._stop( 0 );
			this._oscNode.disconnect();
			this._ampNode.disconnect();
			this._oscNode =
			this._ampNode = null;
		}
	}
	change( obj ) {
		Object.assign( this.data, obj );
		if ( this.data.toggle ) {
			if ( !this._oscNode ) {
				this._start();
			} else {
				this._change( obj );
			}
		} else if ( this._oscNode ) {
			this.destroy();
		}
	}

	// .........................................................................
	_start() {
		const d = this.data,
			osc = this.ctx.createOscillator(),
			amp = this.ctx.createGain();

		this._oscNode = osc;
		this._ampNode = amp;
		this._setAmp();
		this._setType();
		this._setSpeed();
		osc.connect( amp ).connect( this.node.gain );
		osc.start( d.when + d.delay - d.offset );
		if ( d.whenStop > 0 ) {
			this._stop( d.whenStop );
		}
	}
	_stop( when ) {
		this._oscNode.frequency.cancelScheduledValues( when );
		this._ampNode.gain.cancelScheduledValues( when );
		this._oscNode.stop( when );
	}
	_change( obj ) {
		if ( "type" in obj ) {
			this._setType();
		}
		if ( "speed" in obj ) {
			this._oscNode.frequency.cancelScheduledValues( 0 );
			this._setSpeed();
		}
		if ( "when" in obj || "offset" in obj ||
			"delay" in obj || "attack" in obj || "amp" in obj
		) {
			this._ampNode.gain.cancelScheduledValues( 0 );
			this._setAmp();
		}
	}
	_setType() {
		this._oscNode.type = this.data.type;
	}
	_setSpeed() {
		this._oscNode.frequency.setValueAtTime( this.data.speed, this.ctx.currentTime );
	}
	_setAmp() {
		const d = this.data,
			now = this.ctx.currentTime,
			atTime = d.when + d.delay - d.offset;

		if ( now <= atTime && d.attack > 0 ) {
			this._ampNode.gain.setValueAtTime( 0, atTime );
			this._ampNode.gain.setValueCurveAtTime( new Float32Array( [ 0, d.amp ] ), atTime, d.attack );
		} else {
			this._ampNode.gain.setValueAtTime( d.amp, now );
		}
	}
}

Object.freeze( gswaLFO );

class gswaMixer {
	constructor() {
		this.ctx =
		this.connectedTo = null;
		this._chans = {};
		this._fftSize = 4096;
		this.audioDataL = new Uint8Array( this._fftSize / 2 );
		this.audioDataR = new Uint8Array( this._fftSize / 2 );
		this.gsdata = new GSDataMixer( {
			dataCallbacks: {
				addChan: this._addChan.bind( this ),
				removeChan: this._removeChan.bind( this ),
				toggleChan: this._toggleChan.bind( this ),
				redirectChan: this._redirectChan.bind( this ),
				changePanChan: this._updateChanPan.bind( this ),
				changeGainChan: this._updateChanGain.bind( this ),
			},
		} );
		Object.seal( this );
	}

	setContext( ctx ) {
		this.disconnect();
		this.ctx = ctx;
		if ( this.gsdata.values.nbChannels > 0 ) {
			this.gsdata.reset();
		} else {
			this.gsdata.change( {
				channels: {
					main: {
						toggle: true,
						name: "main",
						gain: 1,
						pan: 0,
					},
				},
			} );
		}
	}
	change( obj ) {
		this.gsdata.change( obj );
	}
	clear() {
		this.gsdata.clear();
		this.gsdata.change( {
			channels: {
				main: {
					toggle: true,
					name: "main",
					gain: 1,
					pan: 0,
				},
			},
		} );
	}
	connect( dest ) {
		this.disconnect();
		this._chans.main.output.connect( dest );
		this.connectedTo = dest;
	}
	disconnect() {
		if ( this._chans.main ) {
			this._chans.main.output.disconnect();
			this.connectedTo = null;
		}
	}
	getChanInput( id ) {
		return this._chans[ id ].input;
	}
	getChanOutput( id ) {
		return this._chans[ id ].pan.getInput();
	}
	fillAudioData( chanId ) {
		const nodes = this._chans[ chanId ];

		nodes.analyserL.getByteFrequencyData( this.audioDataL );
		nodes.analyserR.getByteFrequencyData( this.audioDataR );
	}

	// chan:
	_addChan( id ) {
		const ctx = this.ctx,
			pan = new gswaStereoPanner( ctx ),
			gain = ctx.createGain(),
			input = ctx.createGain(),
			output = ctx.createGain(),
			splitter = ctx.createChannelSplitter( 2 ),
			analyserL = ctx.createAnalyser(),
			analyserR = ctx.createAnalyser();

		analyserL.fftSize =
		analyserR.fftSize = this._fftSize;
		analyserL.smoothingTimeConstant =
		analyserR.smoothingTimeConstant = 0;
		input.connect( pan.getInput() );
		pan.connect( gain );
		gain.connect( output );
		gain.connect( splitter );
		splitter.connect( analyserL, 0 );
		splitter.connect( analyserR, 1 );
		this._chans[ id ] = {
			input, pan, gain, output, splitter, analyserL, analyserR,
			analyserData: new Uint8Array( analyserL.frequencyBinCount )
		};
		Object.entries( this.gsdata.data ).forEach( kv => {
			if ( kv[ 1 ].dest === id ) {
				this.gsdata.liveChange( kv[ 0 ], "dest", id );
			}
		} );
	}
	_redirectChan( id, val ) {
		this._chans[ id ].output.disconnect();
		if ( val in this.gsdata.data ) {
			this._chans[ id ].output.connect( this.getChanInput( val ) );
		}
	}
	_toggleChan( id, val ) {
		this._chans[ id ].gain.gain.setValueAtTime( val ? this.gsdata.data[ id ].gain : 0, this.ctx.currentTime );
	}
	_updateChanPan( id, val ) {
		this._chans[ id ].pan.setValueAtTime( val, this.ctx.currentTime );
	}
	_updateChanGain( id, val ) {
		this._chans[ id ].gain.gain.setValueAtTime( val, this.ctx.currentTime );
	}
	_removeChan( id ) {
		const nodes = this._chans[ id ];

		nodes.pan.disconnect();
		nodes.gain.disconnect();
		nodes.input.disconnect();
		nodes.output.disconnect();
		nodes.splitter.disconnect();
		delete this._chans[ id ];
	}
}

class gswaSynth {
	constructor() {
		const gsdata = new GSDataSynth( {
				dataCallbacks: {
					addOsc: this._addOsc.bind( this ),
					removeOsc: this._removeOsc.bind( this ),
					changeOsc: this._changeOsc.bind( this ),
					changeLFO: this._changeLFO.bind( this ),
				},
			} );

		this._bps = 1;
		this.gsdata = gsdata;
		this.ctx =
		this.output = null;
		this.nyquist = 24000;
		this._nodes = new Map();
		this._startedKeys = new Map();
		Object.seal( this );
	}

	// Context, dis/connect
	// .........................................................................
	setContext( ctx ) {
		this.stopAllKeys();
		this.ctx = ctx;
		this.nyquist = ctx.sampleRate / 2;
		this.output = ctx.createGain();
		this.gsdata.recall();
	}
	setBPM( bpm ) {
		this._bps = bpm / 60;
	}
	change( obj ) {
		this.gsdata.change( obj );
	}

	// add/remove/update oscs
	// .........................................................................
	_removeOsc( id ) {
		const obj = this._nodes.get( id );

		obj.pan.disconnect();
		obj.gain.disconnect();
		this._startedKeys.forEach( key => {
			this._destroyOscNode( key.oscs.get( id ) );
			key.oscs.delete( id );
		} );
		this._nodes.delete( id );
	}
	_addOsc( id, osc ) {
		const gain = this.ctx.createGain(),
			pan = this.ctx.createStereoPanner();

		this._nodes.set( id, { gain, pan } );
		pan.pan.value = osc.pan;
		gain.gain.value = osc.gain;
		pan.connect( gain );
		gain.connect( this.output );
		this._startedKeys.forEach( key => key.oscs.set( id, this._createOscNode( key, id ) ) );
	}
	_changeOsc( id, obj ) {
		for ( const prop in obj ) {
			const val = obj[ prop ];

			switch ( prop ) {
				case "pan": this._nodes.get( id ).pan.pan.value = val; break;
				case "gain": this._nodes.get( id ).gain.gain.value = val; break;
				case "type":
				case "detune":
					this._startedKeys.forEach( prop === "detune"
						? key => key.oscs.get( id ).keyOsc.detune.value = val * 100
						: key => this._nodeOscSetType( key.oscs.get( id ).keyOsc, val ) );
			}
		}
	}
	_changeLFO( obj ) {
		const nobj = Object.assign( {}, obj );

		if ( "delay" in obj ) { nobj.delay /= this._bps; }
		if ( "attack" in obj ) { nobj.attack /= this._bps; }
		if ( "speed" in obj ) { nobj.speed *= this._bps; }
		this._startedKeys.forEach( k => k.oscs.forEach( nodes => nodes.keyLFO.change( nobj ) ) );
	}

	// start
	// .........................................................................
	startKey( blocks, when, off, dur ) {
		const id = ++gswaSynth._startedMaxId.value,
			oscs = new Map(),
			blcsLen = blocks.length,
			blc0 = blocks[ 0 ][ 1 ],
			blcLast = blocks[ blcsLen - 1 ][ 1 ],
			blc0when = blc0.when,
			bps = this._bps,
			key = {
				oscs,
				when,
				off,
				dur,
				pan: blc0.pan,
				midi: blc0.key,
				gain: blc0.gain,
				lowpass: blc0.lowpass,
				highpass: blc0.highpass,
				attack: blc0.attack / bps || .005,
				release: blcLast.release / bps || .005,
			};

		if ( blcsLen > 1 ) {
			key.variations = [];
			blocks.reduce( ( prev, [ , blc ] ) => {
				if ( prev ) {
					const prevWhen = prev.when - blc0when,
						when = ( prevWhen + prev.duration ) / bps;

					key.variations.push( {
						when,
						duration: ( blc.when - blc0when ) / bps - when,
						pan: [ prev.pan, blc.pan ],
						midi: [ prev.key, blc.key ],
						gain: [ prev.gain, blc.gain ],
						lowpass: [
							this._calcLowpass( prev.lowpass ),
							this._calcLowpass( blc.lowpass ),
						],
						highpass: [
							this._calcHighpass( prev.highpass ),
							this._calcHighpass( blc.highpass ),
						],
					} );
				}
				return blc;
			}, null );
		}
		Object.keys( this.gsdata.data.oscillators )
			.forEach( oscId => oscs.set( oscId, this._createOscNode( key, oscId ) ) );
		this._startedKeys.set( id, key );
		return id;
	}

	// stop
	// .........................................................................
	stopAllKeys() {
		this._startedKeys.forEach( ( _key, id ) => this.stopKey( id ) );
	}
	stopKey( id ) {
		const key = this._startedKeys.get( id );

		if ( key ) {
			const oscs = key.oscs;

			if ( Number.isFinite( key.dur ) ) {
				this._stopKey( id, oscs );
			} else {
				oscs.forEach( nodes => {
					nodes.keyGain.gain.setValueCurveAtTime(
						new Float32Array( [ key.gain, .1 ] ), this.ctx.currentTime + .01, .02 );
				} );
				setTimeout( this._stopKey.bind( this, id, oscs ), .033 * 1000 );
			}
		} else {
			console.error( "gswaSynth: stopKey id invalid", id );
		}
	}
	_stopKey( id, oscs ) {
		oscs.forEach( this._destroyOscNode, this );
		this._startedKeys.delete( id );
	}

	// private:
	_calcLowpass( val ) {
		return this._calcExp( val, this.nyquist, 2 );
	}
	_calcHighpass( val ) {
		return this._calcExp( 1 - val, this.nyquist, 3 );
	}
	_calcExp( x, total, exp ) {
		return exp === 0
			? x
			: Math.expm1( x ) ** exp / ( ( Math.E - 1 ) ** exp ) * total;
	}

	// default gain envelope
	_scheduleOscNodeGain( key, nodes ) {
		const va = key.variations,
			par = nodes.keyGain.gain,
			{ when, dur, gain, attack, release } = key;

		par.cancelScheduledValues( 0 );
		if ( !va || va[ 0 ].when > key.off ) {
			if ( key.off < .0001 ) {
				par.setValueAtTime( 0, when );
				par.setValueCurveAtTime( new Float32Array( [ 0, gain ] ), when, attack );
			} else {
				par.setValueAtTime( gain, when );
			}
		}
		if ( Number.isFinite( dur ) && dur - attack >= release ) {
			const vaLast = va && va[ va.length - 1 ],
				relWhen = when + dur - release;

			if ( !vaLast || when - key.off + vaLast.when + vaLast.duration < relWhen ) {
				const gainEnd = vaLast ? vaLast.gain[ 1 ] : gain;

				par.setValueCurveAtTime( new Float32Array( [ gainEnd, 0 ] ), relWhen, release );
			}
		}
	}

	// keys linked, variations
	_scheduleVariations( key, nodes ) {
		if ( key.variations ) {
			key.variations.forEach( va => {
				const when = key.when - key.off + va.when,
					dur = va.duration,
					freqArr = new Float32Array( [
						gswaSynth.midiKeyToHz[ va.midi[ 0 ] ],
						gswaSynth.midiKeyToHz[ va.midi[ 1 ] ]
					] );

				if ( when > this.ctx.currentTime && dur > 0 ) {
					nodes.keyOsc.frequency.setValueCurveAtTime( freqArr, when, dur );
					nodes.keyPan.pan.setValueCurveAtTime( new Float32Array( va.pan ), when, dur );
					nodes.keyGain.gain.setValueCurveAtTime( new Float32Array( va.gain ), when, dur );
					nodes.keyLowpass.frequency.setValueCurveAtTime( new Float32Array( va.lowpass ), when, dur );
					nodes.keyHighpass.frequency.setValueCurveAtTime( new Float32Array( va.highpass ), when, dur );
				}
			} );
		}
	}

	// createOscNode
	_createOscNode( key, oscId ) {
		const ctx = this.ctx,
			lfo = this.gsdata.data.lfo,
			osc = this.gsdata.data.oscillators[ oscId ],
			finite = Number.isFinite( key.dur ),
			atTime = key.when - key.off,
			keyLFO = new gswaLFO( ctx ),
			keyOsc = ctx.createOscillator(),
			keyPan = ctx.createStereoPanner(),
			keyGain = ctx.createGain(),
			keyLowpass = ctx.createBiquadFilter(),
			keyHighpass = ctx.createBiquadFilter(),
			nodes = Object.freeze( {
				keyOsc,
				keyLFO,
				keyPan,
				keyGain,
				keyLowpass,
				keyHighpass,
			} );

		this._nodeOscSetType( keyOsc, osc.type );
		keyOsc.detune.setValueAtTime( osc.detune * 100, atTime );
		keyPan.pan.setValueAtTime( key.pan, atTime );
		keyOsc.frequency.setValueAtTime( gswaSynth.midiKeyToHz[ key.midi ], atTime );
		keyLowpass.frequency.setValueAtTime( this._calcLowpass( key.lowpass ), atTime );
		keyHighpass.frequency.setValueAtTime( this._calcHighpass( key.highpass ), atTime );
		keyLowpass.type = "lowpass";
		keyHighpass.type = "highpass";
		this._scheduleOscNodeGain( key, nodes );
		this._scheduleVariations( key, nodes );
		keyOsc
			.connect( keyLFO.node )
			.connect( keyPan )
			.connect( keyLowpass )
			.connect( keyHighpass )
			.connect( keyGain )
			.connect( this._nodes.get( oscId ).pan );
		keyOsc.start( key.when );
		keyLFO.start( {
			toggle: lfo.toggle,
			when: key.when,
			whenStop: finite ? key.when + key.dur : 0,
			offset: key.offset,
			type: lfo.type,
			delay: lfo.delay / this._bps,
			attack: lfo.attack / this._bps,
			speed: lfo.speed * this._bps,
			amp: lfo.amp,
		} );
		if ( finite ) {
			keyOsc.stop( key.when + key.dur );
		}
		return nodes;
	}
	_destroyOscNode( nodes ) {
		nodes.keyOsc.stop();
		nodes.keyOsc.disconnect();
		nodes.keyLFO.destroy();
		nodes.keyGain.disconnect();
	}
	_nodeOscSetType( oscNode, type ) {
		if ( gswaSynth.nativeTypes.indexOf( type ) > -1 ) {
			oscNode.type = type;
		} else {
			oscNode.setPeriodicWave( gswaPeriodicWaves.get( this.ctx, type ) );
		}
	}
}

gswaSynth._startedMaxId = Object.seal( { value: 0 } );
gswaSynth.nativeTypes = Object.freeze( [ "sine", "triangle", "sawtooth", "square" ] );
gswaSynth.midiKeyToHz = [];

Object.freeze( gswaSynth );

/*
This midi array start from 0, this means C#3's frequency is gswaSynth.midiKeyToHz[ 12 * 3 + 1 ].
*/

gswaSynth.midiKeyToHz.push(
	   0, // [0] -> C0 (unused)
	   0,
	   0,
	   0,
	   0,
	   0,
	   0,
	   0,
	   0,
	   0,
	   0,
	   0,

	  32.7032, // [12] -> C1
	  34.6479,
	  36.7081,
	  38.8909,
	  41.2035,
	  43.6536,
	  46.2493,
	  48.9995,
	  51.9130,
	  55,
	  58.2705,
	  61.7354,

	  65.4064, // [24] -> C2
	  69.2957,
	  73.4162,
	  77.7817,
	  82.4069,
	  87.3071,
	  92.4986,
	  97.9989,
	 103.826,
	 110,
	 116.541,
	 123.471,

	 130.813, // [36] -> C3
	 138.591,
	 146.832,
	 155.563,
	 164.814,
	 174.614,
	 184.997,
	 195.998,
	 207.652,
	 220,
	 233.082,
	 246.942,

	 261.626, // [48] -> C4
	 277.183,
	 293.665,
	 311.127,
	 329.628,
	 349.228,
	 369.994,
	 391.995,
	 415.305,
	 440,
	 466.164,
	 493.883,

	 523.251, // [60] -> C5
	 554.365,
	 587.33,
	 622.254,
	 659.255,
	 698.456,
	 739.989,
	 783.991,
	 830.609,
	 880,
	 932.328,
	 987.767,

	1046.5, // [72] -> C6
	1108.73,
	1174.66,
	1244.51,
	1318.51,
	1396.91,
	1479.98,
	1567.98,
	1661.22,
	1760,
	1864.66,
	1975.53,

	2093, // [84] -> C7
	2217.46,
	2349.32,
	2489.02,
	2637.02,
	2793.83,
	2959.96,
	3135.96,
	3322.44,
	3520,
	3729.31,
	3951.07,

	4186.01, // [96] -> C8
);

Object.freeze( gswaSynth.midiKeyToHz );

class gswaKeysScheduler {
	constructor( ctx ) {
		this.scheduler = new gswaScheduler();
		this._synth = null;
		this._startedKeys = new Map();
		Object.seal( this );

		this.scheduler.currentTime = () => ctx.currentTime;
		this.scheduler.ondatastart = this._onstartKey.bind( this );
		this.scheduler.ondatastop = this._onstopKey.bind( this );
		this.scheduler.enableStreaming( !( ctx instanceof OfflineAudioContext ) );
	}

	setSynth( synth ) {
		this._synth = synth;
	}
	change( obj ) {
		GSUtils.diffAssign( this.scheduler.data, obj );
	}
	start( when, off, dur ) {
		this.scheduler.start( when, off, dur );
	}
	stop() {
		this.scheduler.stop();
	}

	_onstartKey( startedId, blcs, when, off, dur ) {
		this._startedKeys.set( startedId,
			this._synth.startKey( blcs, when, off, dur ) );
	}
	_onstopKey( startedId ) {
		this._synth.stopKey( this._startedKeys.get( startedId ) );
		this._startedKeys.delete( startedId );
	}
}

class gswaDrumsScheduler {
	constructor( ctx ) {
		const sch = new gswaScheduler();

		this.scheduler = sch;
		this._drumrows = null;
		this._startedDrums = new Map();
		Object.seal( this );

		sch.currentTime = () => ctx.currentTime;
		sch.ondatastart = this._onstartDrum.bind( this );
		sch.ondatastop = this._onstopDrum.bind( this );
		sch.enableStreaming( !( ctx instanceof OfflineAudioContext ) );
	}

	setDrumrows( drumrows ) {
		this._drumrows = drumrows;
	}
	change( obj ) {
		const cpy = GSUtils.deepCopy( obj );

		Object.values( cpy ).forEach( drum => {
			if ( drum && "when" in drum ) { // 1.
				drum.duration = this._drumrows.getPatternDurationByRowId( drum.row );
			}
		} );
		GSUtils.diffAssign( this.scheduler.data, cpy );
	}
	start( when, off, dur ) {
		this.scheduler.start( when, off, dur );
	}
	stop() {
		this.scheduler.stop();
	}

	_onstartDrum( startedId, [ drum ], when, off, _dur ) {
		this._startedDrums.set( startedId,
			this._drumrows.startDrum( drum[ 1 ], when, off, drum[ 1 ].duration ) );
	}
	_onstopDrum( startedId ) {
		this._drumrows.stopDrum( this._startedDrums.get( startedId ) );
		this._startedDrums.delete( startedId );
	}
}

/*
1. The `if` check if the `drum` is new and not updating.
*/

const gswaBPMTap = {
	_stack: [],
	_timeBefore: 0,
	_stackLimit: 10,

	reset() {
		this._timeBefore =
		this._stack.length = 0;
	},
	tap() {
		const time = Date.now(),
			timeBefore = this._timeBefore;

		this._timeBefore = time;
		if ( timeBefore ) {
			const bpm = 60000 / ( time - timeBefore ),
				stack = this._stack,
				lastBpm = stack.length
					? stack[ stack.length - 1 ]
					: 0;

			if ( lastBpm && ( bpm < lastBpm / 1.5 || bpm > lastBpm * 1.5 ) ) {
				stack.length = 0;
			} else {
				if ( stack.unshift( bpm ) > this._stackLimit ) {
					stack.length = this._stackLimit;
				}
				return stack.reduce( ( sum, bpm ) => sum + bpm, 0 ) / stack.length;
			}
		}
		return 0;
	},
};

class gswaEffects {
	constructor( fns ) {
		this.ctx = null;
		this._getChanInput = fns.getChanInput;
		this._getChanOutput = fns.getChanOutput;
		this._wafxs = new Map();
		this.gsdata = new GSDataEffects( {
			dataCallbacks: {
				changeBPM: bpm => this._wafxs.forEach( fx => fx.setBPM && fx.setBPM( bpm ) ),
				addEffect: this._addEffect.bind( this ),
				removeEffect: this._removeEffect.bind( this ),
				changeEffect: this._changeEffect.bind( this ),
				connectEffectTo: this._connectEffectTo.bind( this ),
				changeEffectData: ( id, data ) => this._wafxs.get( id ).change( data ),
			},
		} );
		Object.seal( this );
	}

	// .........................................................................
	setContext( ctx ) {
		this.ctx = ctx;
		this.gsdata.reset();
	}
	change( obj ) {
		this.gsdata.change( obj );
	}
	clear() {
		this.gsdata.clear();
	}
	liveChangeFxProp( id, prop, val ) {
		this._wafxs.get( id ).liveChange( prop, val );
	}

	// .........................................................................
	_addEffect( id, fx ) {
		const wafx = new ( gswaEffects.fxsMap.get( fx.type ) )();

		this._wafxs.set( id, wafx );
		wafx.setContext( this.ctx );
	}
	_removeEffect( id, prevId, nextId ) {
		const wafx = this._wafxs.get( id );

		wafx.output.disconnect();
		this._wafxs.delete( id );
	}
	_changeEffect( id, prop, val ) {
		if ( prop === "toggle" ) {
			this._wafxs.get( id ).toggle( val );
		}
	}
	_connectEffectTo( chanId, fxId, nextFxId ) {
		const dest = nextFxId
				? this._wafxs.get( nextFxId ).input
				: this._getChanOutput( chanId ),
			node = fxId
				? this._wafxs.get( fxId ).output
				: this._getChanInput( chanId );

		node.disconnect();
		node.connect( dest );
	}
}

gswaEffects.fxsMap = new Map();
Object.freeze( gswaEffects );

class gswaFxFilter {
	constructor() {
		this.ctx =
		this.input =
		this.output =
		this._filter =
		this.responseHzIn =
		this.responseMagOut =
		this.responsePhaseOut = null;
		this._respSize = -1;
		this._enable = false;
		this.gsdata = new GSDataFxFilter( {
			dataCallbacks: {
				type: this._changeType.bind( this ),
				Q: this._changeProp.bind( this, "Q" ),
				gain: this._changeProp.bind( this, "gain" ),
				detune: this._changeProp.bind( this, "detune" ),
				frequency: this._changeProp.bind( this, "frequency" ),
			},
		} );
		Object.seal( this );
	}

	// .........................................................................
	setContext( ctx ) {
		if ( this.ctx ) {
			this.input.disconnect();
			this.output.disconnect();
			this._filter.disconnect();
		}
		this.ctx = ctx;
		this.input = ctx.createGain();
		this.output = ctx.createGain();
		this._filter = ctx.createBiquadFilter();
		this.gsdata.recall();
		this.toggle( this._enable );
	}
	toggle( b ) {
		this._enable = b;
		if ( this.ctx ) {
			if ( b ) {
				this.input.disconnect();
				this.input.connect( this._filter );
				this._filter.connect( this.output );
			} else {
				this._filter.disconnect();
				this.input.connect( this.output );
			}
		}
	}
	change( obj ) {
		this.gsdata.change( obj );
	}
	liveChange( prop, val ) {
		this._changeProp( prop, val );
	}
	clear() {
		this.gsdata.clear();
		this._respSize = -1;
		this.responseHzIn =
		this.responseMagOut =
		this.responsePhaseOut = null;
	}
	updateResponse( size ) {
		this._createResponseArrays( size );
		this._filter.getFrequencyResponse(
			this.responseHzIn,
			this.responseMagOut,
			this.responsePhaseOut );
		return this.responseMagOut;
	}

	// .........................................................................
	_changeType( type ) {
		this._filter.type = type;
	}
	_changeProp( prop, val ) {
		this._filter[ prop ].setValueAtTime( val, this.ctx.currentTime );
	}
	_createResponseArrays( w ) {
		if ( w !== this._respSize ) {
			const nyquist = this.ctx.sampleRate / 2,
				Hz = new Float32Array( w );

			this._respSize = w;
			this.responseHzIn = Hz;
			this.responseMagOut = new Float32Array( w );
			this.responsePhaseOut = new Float32Array( w );
			for ( let i = 0; i < w; ++i ) {
				Hz[ i ] = nyquist * ( 2 ** ( i / w * 11 - 11 ) );
			}
		}
	}
}

Object.freeze( gswaFxFilter );

if ( typeof gswaEffects !== "undefined" ) {
	gswaEffects.fxsMap.set( "filter", gswaFxFilter );
}

class gswaDrumrows {
	constructor() {
		const gsdata = new GSDataDrumrows( {
				dataCallbacks: {
					addDrumrow: this._addDrumrow.bind( this ),
					removeDrumrow: this._removeDrumrow.bind( this ),
					changeDrumrow: this._changeDrumrow.bind( this ),
				},
			} );

		this.ctx =
		this.onstartdrum = null;
		this.gsdata = gsdata;
		this.getAudioBuffer =
		this.getChannelInput = () => {};
		this._startedDrums = new Map();
		this._bps = 1;
		Object.seal( this );
	}

	// .........................................................................
	setContext( ctx ) {
		this.stopAllDrums();
		this.ctx = ctx;
	}
	setBPM( bpm ) {
		this._bps = bpm / 60;
	}
	change( obj ) {
		this.gsdata.change( obj );
	}
	clear() {
		this.gsdata.clear();
	}
	getPatternDurationByRowId( rowId ) {
		const d = this.gsdata.data;

		return d.patterns[ d.drumrows[ rowId ].pattern ].duration;
	}

	// start/stop
	// .........................................................................
	startLiveDrum( rowId ) {
		return this._startDrum( rowId, this.ctx.currentTime, 0, null, true );
	}
	stopLiveDrum( rowId ) {
		this._startedDrums.forEach( ( nodes, id ) => {
			// if ( nodes.live && nodes.rowId === rowId ) {
			if ( nodes.rowId === rowId ) {
				this.stopDrum( id, "-f" );
			}
		} );
	}
	startDrum( drum, when, off, dur ) {
		return this._startDrum( drum.row, when, off, dur, false );
	}
	_startDrum( rowId, when, off, durUser, live ) {
		const data = this.gsdata.data,
			row = data.drumrows[ rowId ],
			pat = data.patterns[ row.pattern ],
			buffer = this.getAudioBuffer( pat.buffer ),
			dur = durUser !== null ? durUser : buffer ? buffer.duration : 0,
			id = ++gswaDrumrows._startedMaxId.value,
			nodes = { rowId, live, when, dur };

		if ( buffer ) {
			const absn = this.ctx.createBufferSource(),
				gain = this.ctx.createGain(),
				dest = this.getChannelInput( pat.dest );

			nodes.absn = absn;
			nodes.gain = gain;
			absn.buffer = buffer;
			gain.gain.setValueAtTime( row.toggle ? row.gain : 0, this.ctx.currentTime );
			absn.connect( gain ).connect( dest );
			absn.start( when, off, dur );
			if ( this.onstartdrum ) {
				const timeoutMs = ( when - this.ctx.currentTime ) * 1000;

				nodes.startDrumTimeoutId = setTimeout( () => this.onstartdrum( rowId ), timeoutMs );
			}
		}
		this._startedDrums.set( id, nodes );
		this._startedDrums.forEach( ( nodes, id ) => {
			if ( nodes && nodes.when + nodes.dur <= this.ctx.currentTime ) {
				this._stopDrum( id, nodes );
			}
		} );
		return id;
	}
	stopAllDrums() {
		this._startedDrums.forEach( ( _nodes, id ) => this.stopDrum( id, "-f" ) );
	}
	stopDrum( id, force ) {
		const nodes = this._startedDrums.get( id );

		if ( nodes && ( force === "-f" ||
			nodes.when + nodes.dur <= this.ctx.currentTime ||
			nodes.when >= this.ctx.currentTime
		) ) {
			this._stopDrum( id, nodes );
		}
	}
	_stopDrum( id, nodes ) {
		this._startedDrums.delete( id );
		clearTimeout( nodes.startDrumTimeoutId );
		if ( nodes.absn ) {
			nodes.absn.stop();
			nodes.gain.disconnect();
		}
	}

	// add/remove/update
	// .........................................................................
	_addDrumrow( id, obj ) {
	}
	_removeDrumrow( id ) {
		this._startedDrums.forEach( ( nodes, startedId ) => {
			if ( nodes.rowId === id ) {
				this.stopDrum( startedId, "-f" );
			}
		} );
	}
	_changeDrumrow( id, prop, val ) {
		const row = this.gsdata.data.drumrows[ id ];

		switch ( prop ) {
			case "toggle":
				this.__changeDrumrow( id, nodes => {
					nodes.gain.gain.setValueAtTime( val ? row.gain : 0, this.ctx.currentTime );
				} );
				break;
			case "dest":
				this.__changeDrumrow( id, nodes => {
					nodes.gain.disconnect();
					nodes.gain.connect( this.getChannelInput( val ) );
				} );
				break;
		}
	}
	__changeDrumrow( rowId, fn ) {
		this._startedDrums.forEach( nodes => {
			if ( nodes.rowId === rowId && nodes.absn ) {
				fn( nodes );
			}
		} );
	}
}

gswaDrumrows._startedMaxId = Object.seal( { value: 0 } );

Object.freeze( gswaDrumrows );

class gswaScheduler {
	constructor() {
		this.ondatastart =
		this.ondatastop =
		this.onended =
		this.currentTime = () => {};
		this.bpm = 60;
		this.bps = 1;
		this.started = false;
		this.duration =
		this._startDur =
		this._startOff =
		this._startWhen =
		this._startFixedDur = 0;
		this._timeoutIdEnded = null;
		this.data = this._proxyCreate();
		this._dataScheduled = {};
		this._dataScheduledPerBlock = {};
		this._lastBlockId = null;
		this.loopA =
		this.loopB = null;
		this.looping = false;
		this.loopDuration = 0;
		this.isStreaming = true;
		this._streamloop = this._streamloop.bind( this );
		this._streamloopId = null;
		Object.seal( this );
	}

	// BPM
	// ........................................................................
	setBPM( bpm ) {
		if ( this.bpm !== bpm ) {
			const ratio = this.bpm / bpm,
				currTime = this.getCurrentOffset() * ratio;

			this.bpm = bpm;
			this.bps = bpm / 60;
			this.duration *= ratio;
			if ( this.looping ) {
				this.loopA *= ratio;
				this.loopB *= ratio;
				this.loopDuration = this.loopB - this.loopA;
				this.setCurrentOffset( this.loopB > currTime ? currTime : this.loopA );
			} else {
				this.setCurrentOffset( currTime );
			}
		}
	}

	// Empty
	// ........................................................................
	empty() {
		Object.keys( this.data ).forEach( id => delete this.data[ id ] );
		this.clearLoop();
	}

	// Loop
	// ........................................................................
	setLoopBeat( a, b ) {
		return this.setLoop( a / this.bps, b / this.bps );
	}
	setLoop( a, b ) {
		const off = this.started && this.getCurrentOffset();

		this.looping = true;
		this.loopA = Math.min( a, b );
		this.loopB = Math.max( a, b );
		this.loopDuration = this.loopB - this.loopA;
		if ( this.started ) {
			this.setCurrentOffset( this.loopB > off ? off : this.loopA );
		}
	}
	clearLoop() {
		if ( this.looping ) {
			const off = this.getCurrentOffset();

			this.looping = false;
			this.setCurrentOffset( off );
		}
	}

	// set/getCurrentOffset
	// ........................................................................
	setCurrentOffsetBeat( off ) {
		this.setCurrentOffset( off / this.bps );
	}
	setCurrentOffset( off ) {
		this._startOff = off;
		this.started && this.start( 0, off );
	}
	getCurrentOffsetBeat() {
		return this.getCurrentOffset() * this.bps;
	}
	getCurrentOffset() {
		return this.started
			? this.getFutureOffsetAt( this.currentTime() )
			: this._startOff;
	}
	getFutureOffsetAt( futureTime ) {
		let t = this._startOff + futureTime - this._startWhen;

		if ( this.looping && t > this.loopB - .001 ) {
			t = this.loopA + ( t - this.loopA ) % this.loopDuration;
			if ( t > this.loopB - .001 ) {
				t = this.loopA;
			}
		}
		return t;
	}

	// Start / stop
	// ........................................................................
	enableStreaming( b = true ) {
		this.isStreaming = b;
	}
	startBeat( when, off = 0, dur ) {
		return this.start( when, off / this.bps,
			Number.isFinite( dur )
				? dur / this.bps
				: dur );
	}
	start( when, off = 0, dur ) {
		const currTime = this.currentTime();

		if ( this.started ) {
			this.stop();
		}
		this.started = true;
		this._startFixedDur = Number.isFinite( dur );
		this._startWhen = Math.max( currTime, when );
		this._startOff = off;
		this._startDur = this._startFixedDur
			? dur
			: this.duration - off;
		if ( this.isStreaming && !this.looping ) {
			this._timeoutIdEnded = setTimeout(
				this.onended.bind( this ),
				this._startDur * 1000 );
		}
		this.isStreaming
			? this._streamloopOn()
			: this._fullStart();
	}
	stop() {
		if ( this.started ) {
			this._startOff = this.getCurrentOffset();
			this.started = false;
			clearTimeout( this._timeoutIdEnded );
			this._streamloopOff();
			Object.keys( this._dataScheduledPerBlock ).forEach( this._blockStop, this );
		}
	}
	_getOffsetEnd() {
		return this.looping ? this.loopB : this._startOff + this._startDur;
	}
	_updateDuration( dur ) {
		if ( dur !== this.duration ) {
			this.duration = dur;
			if ( this.started && !this._startFixedDur ) {
				this._startDur = dur;
			}
			if ( this.looping || !this._startFixedDur ) {
				clearTimeout( this._timeoutIdEnded );
			}
			if ( this.started && this.isStreaming && !this.looping ) {
				this._timeoutIdEnded = setTimeout( this.onended.bind( this ),
					( dur - this._startOff - this.currentTime() + this._startWhen ) * 1000 );
			}
		}
	}

	// Full start
	// ........................................................................
	_fullStart() {
		const when = this._startWhen,
			from = this._startOff,
			to = from + this._startDur;

		Object.entries( this.data ).forEach( ( [ blockId, block ] ) => {
			this._blockStart( when, from, to, to, +blockId, block );
		} );
	}

	// Stream loop
	// ........................................................................
	_streamloopOn() {
		if ( !this._streamloopId ) {
			this._streamloopId = setInterval( this._streamloop, 100 );
			this._streamloop();
		}
	}
	_streamloopOff() {
		if ( this._streamloopId ) {
			clearInterval( this._streamloopId );
			this._streamloopId = null;
		}
	}
	_streamloop() {
		const currTime = this.currentTime();
		let stillSomethingToPlay;

		Object.entries( this._dataScheduled ).forEach( ( [ id, obj ] ) => {
			if ( obj.whenEnd < currTime ) {
				delete this._dataScheduled[ id ];
				delete this._dataScheduledPerBlock[ obj.blockId ].started[ id ];
				this.ondatastop( +id );
			}
		} );
		Object.keys( this.data ).forEach( id => {
			if ( this._blockSchedule( +id ) ) {
				stillSomethingToPlay = true;
			}
		} );
		if ( !this.looping && !stillSomethingToPlay ) {
			this._streamloopOff();
		}
	}

	// Block functions
	// ........................................................................
	_blockStop( id ) {
		const dataScheduled = this._dataScheduled,
			blcSchedule = this._dataScheduledPerBlock[ id ],
			now = this.currentTime();

		Object.keys( blcSchedule.started ).forEach( id => {
			this.ondatastop( +id );
			delete dataScheduled[ id ];
			delete blcSchedule.started[ id ];
		} );
		blcSchedule.scheduledUntil = 0;
	}
	_blockSchedule( id ) {
		if ( this.started ) {
			const currTime = this.currentTime(),
				currTimeEnd = currTime + 1,
				blcSchedule = this._dataScheduledPerBlock[ id ];
			let until = Math.max( currTime, blcSchedule.scheduledUntil || 0 );

			if ( until < currTimeEnd ) {
				const offEnd = this._getOffsetEnd(),
					blc = this.data[ id ];

				do {
					const from = this.getFutureOffsetAt( until ),
						to = Math.min( from + 1, offEnd );

					until += this._blockStart( until, from, to, offEnd, id, blc );
				} while ( this.looping && until < currTimeEnd );
				blcSchedule.scheduledUntil = until;
			}
			return blcSchedule.scheduledUntil <= this._startWhen + this._startDur;
		}
	}
	_blockStart( when, from, to, offEnd, blockId, block ) {
		if ( block.prev == null ) {
			const bps = this.bps,
				blcs = [];
			let bWhn = block.when / bps,
				bOff = block.offset / bps,
				bDur = 0;

			for ( let id = blockId, blc = block; blc; ) {
				blcs.push( [ id, blc ] );
				bDur = blc.when / bps - bWhn + blc.duration / bps;
				id = blc.next;
				blc = id != null ? this.data[ id ] : null;
			}
			if ( from <= bWhn + bDur && bWhn < to ) {
				const startWhen = this._startWhen;

				if ( bWhn + bDur > offEnd ) {
					bDur -= bWhn + bDur - offEnd;
				}
				if ( bWhn < from ) {
					bOff += from - bWhn;
					bDur -= from - bWhn;
					bWhn = from;
				}
				bWhn = when + bWhn - from;
				if ( bWhn < startWhen ) {
					bOff += startWhen - bWhn;
					bDur -= startWhen - bWhn;
					bWhn = startWhen;
				}
				if ( bDur > .000001 ) {
					const id = ++gswaScheduler._startedMaxId.value;

					this._dataScheduledPerBlock[ blockId ].started[ id ] =
					this._dataScheduled[ id ] = {
						block,
						blockId,
						when: bWhn,
						whenEnd: bWhn + bDur,
					};
					this.ondatastart( id, blcs, bWhn, bOff, bDur );
				}
				return offEnd - from;
			}
		}
		return to - from;
	}
	_isLastBlock( id ) {
		if ( this._lastBlockId === id ) {
			this._findLastBlock();
		} else {
			const blc = this.data[ id ],
				whnEnd = ( blc.when + blc.duration ) / this.bps;

			if ( whnEnd > this.duration ) {
				this._lastBlockId = id;
				this._updateDuration( whnEnd );
			}
		}
	}
	_findLastBlock() {
		this._updateDuration( Object.entries( this.data )
			.reduce( ( max, [ id, blc ] ) => {
				const whnEnd = ( blc.when + blc.duration ) / this.bps;

				if ( whnEnd > max ) {
					this._lastBlockId = +id;
					return whnEnd;
				}
				return max;
			}, 0 ) );
	}

	// Data proxy
	// ........................................................................
	_proxyCreate() {
		return new Proxy( {}, {
			set: this._proxySetBlock.bind( this ),
			deleteProperty: this._proxyDelBlock.bind( this )
		} );
	}
	_proxyDelBlock( target, blockId ) {
		const id = +blockId;

		if ( !( id in target ) ) {
			console.warn( "gswaScheduler: data delete unknown id", id );
		} else {
			delete target[ id ];
			if ( this.started ) {
				this._blockStop( id );
			}
			if ( this._lastBlockId === id ) {
				this._findLastBlock();
			}
			delete this._dataScheduledPerBlock[ id ];
		}
		return true;
	}
	_proxySetBlock( target, blockId, block ) {
		const id = +blockId;

		if ( id in target || !block ) {
			this._proxyDelBlock( target, id );
		}
		if ( block ) {
			this._dataScheduledPerBlock[ id ] = {
				started: {},
				scheduledUntil: 0,
			};
			target[ id ] = new Proxy(
				Object.assign( {
					when: 0,
					offset: 0,
					duration: 0,
				}, block ), {
					set: this._proxySetBlockProp.bind( this, id ),
					deleteProperty: this._proxyDelBlockProp.bind( this, id ),
				} );
			this._isLastBlock( id );
			this._blockSchedule( id );
		}
		return true;
	}
	_proxyDelBlockProp( id, target, prop ) {
		return this._proxySetBlockProp( id, target, prop );
	}
	_proxySetBlockProp( id, target, prop, val ) {
		if ( val === undefined ) {
			delete target[ prop ];
		} else {
			target[ prop ] = val;
		}
		if ( prop !== "selected" ) {
			if ( prop === "when" || prop === "offset" || prop === "duration" ) {
				this._isLastBlock( id );
			}
			if ( this.started ) {
				this._blockStop( id );
			}
			this._blockSchedule( id );
		}
		return true;
	}
}

gswaScheduler._startedMaxId = Object.seal( { value: 0 } );

Object.freeze( gswaScheduler );

class gswaEncodeWAV {
	static encode( buffer, opt ) {
		const nbChannels = buffer.numberOfChannels,
			sampleRate = buffer.sampleRate,
			format = opt && opt.float32 ? 3 : 1,
			bitsPerSample = format === 3 ? 32 : 16,
			bytesPerSample = bitsPerSample / 8,
			bytesPerbloc = nbChannels * bytesPerSample,
			samples = nbChannels === 2
				? gswaEncodeWAV._interleave( buffer.getChannelData( 0 ), buffer.getChannelData( 1 ) )
				: buffer.getChannelData( 0 ),
			dataSize = samples.length * bytesPerSample,
			arrBuffer = new ArrayBuffer( 44 + dataSize ),
			data = new DataView( arrBuffer );

		gswaEncodeWAV._setString( data, 0, "RIFF" );           // FileTypeBlocID(4) : "RIFF"
		data.setUint32( 4, 36 + dataSize, true );              // FileSize(4)       : headerSize + dataSize - 8
		gswaEncodeWAV._setString( data, 8, "WAVE" );           // FileFormatID(4)   : "WAVE"
		gswaEncodeWAV._setString( data, 12, "fmt " );          // FormatBlocID(4)   : "fmt "
		data.setUint32( 16, 16, true );                        // BlocSize(4)       : 16
		data.setUint16( 20, format, true );                    // AudioFormat(2)    : Format du stockage dans le fichier (1: PCM, ...)
		data.setUint16( 22, nbChannels, true );                // nbChannels(2)     : 1, 2, ..., 6
		data.setUint32( 24, sampleRate, true );                // sampleRate(4)     : 11025, 22050, 44100
		data.setUint32( 28, sampleRate * bytesPerbloc, true ); // bytesPerSec(4)    : sampleRate * bytesPerbloc
		data.setUint16( 32, bytesPerbloc, true );              // bytesPerbloc(2)   : nbChannels * bitsPerSample / 8
		data.setUint16( 34, bitsPerSample, true );             // bitsPerSample(2)  : 8, 16, 24
		gswaEncodeWAV._setString( data, 36, "data" );          // DataBlocID(4)     : "data"
		data.setUint32( 40, dataSize, true );                  // dataSize(4)       : fileSize - 44

		( format === 1
			? gswaEncodeWAV._bufToInt16
			: gswaEncodeWAV._bufToFloat32
		)( data, 44, samples );
		return arrBuffer;
	}

	// private:
	static _interleave( ldata, rdata ) {
		const len = ldata.length + rdata.length,
			arr = new Float32Array( len );

		for ( let i = 0, j = 0; i < len; ++j ) {
			arr[ i++ ] = ldata[ j ];
			arr[ i++ ] = rdata[ j ];
		}
		return arr;
	}
	static _setString( data, offset, str ) {
		for ( let i = 0; i < str.length; ++i ) {
			data.setUint8( offset + i, str.charCodeAt( i ) );
		}
	}
	static _bufToInt16( data, offset, samples ) {
		for ( let i = 0; i < samples.length; ++i ) {
			const s = Math.max( -1, Math.min( samples[ i ], 1 ) );

			data.setInt16( offset + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true );
		}
	}
	static _bufToFloat32( data, offset, samples ) {
		for ( let i = 0; i < samples.length; ++i ) {
			data.setFloat32( offset + i * 4, samples[ i ], true );
		}
	}
}

class gswaStereoPanner {
	constructor( ctx ) {
		this._splitter = ctx.createChannelSplitter( 2 );
		this._left = ctx.createGain();
		this._right = ctx.createGain();
		this._merger = ctx.createChannelMerger( 2 );
		this._splitter.connect( this._left, 0 );
		this._splitter.connect( this._right, 1 );
		this._left.connect( this._merger, 0, 0 );
		this._right.connect( this._merger, 0, 1 );
	}

	connect( ...args ) {
		return this._merger.connect.apply( this._merger, args );
	}
	disconnect( ...args ) {
		return this._merger.disconnect.apply( this._merger, args );
	}
	getInput() {
		return this._splitter;
	}
	getValue() {
		return this._right.gain.value - this._left.gain.value;
	}
	setValueAtTime( value, when ) {
		this._left.gain.setValueAtTime( Math.min( 1 - value, 1 ), when );
		this._right.gain.setValueAtTime( Math.min( 1 + value, 1 ), when );
	}
}

const gswaPeriodicWaves = Object.freeze( {
	list: new Map(),
	_cache: new Map(),

	clearCache() {
		this._cache.clear();
	},
	get( ctx, name ) {
		let p = this._cache.get( name );

		if ( !p ) {
			const w = gswaPeriodicWaves.list.get( name );

			p = ctx.createPeriodicWave( w.real, w.imag );
			this._cache.set( name, p );
		}
		return p;
	},
} );

// Thanks to:
// https://github.com/lukehorvat/web-audio-oscillators
// (and https://github.com/mohayonao/wave-tables)

[
	// natives:
	[ "sine",     { imag: Array.from( { length: 2048 }, ( _, n ) => n === 1 ? 1 : 0 ) } ],
	[ "triangle", { imag: Array.from( { length: 2048 }, ( _, n ) => 8 * Math.sin( n * Math.PI / 2 ) / Math.pow( n * Math.PI, 2 ) ) } ],
	[ "sawtooth", { imag: Array.from( { length: 2048 }, ( _, n ) => 2 / ( n * Math.PI ) * Math.pow( -1, n + 1 ) ) } ],
	[ "square",   { imag: Array.from( { length: 2048 }, ( _, n ) => 2 / ( n * Math.PI ) * ( 1 - Math.pow( -1, n ) ) ) } ],

	// customs simple:
	[ "bass",     { real: [ 0, .5154639175257731, 1, .8144329896907216, .20618556701030927, .020618556701030927 ] } ],
	[ "brass",    { real: [ 0, .4, 1, 1, 1, .3, .7, .6, .5, .9, .8 ] } ],
	[ "organ",    { imag: [ 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1 ] } ],
	[ "organ2",   { real: [ 0, .4, .8, .6, .6, .7, .6, 0, .8, .3, 1 ] } ],

	// customs complex:
	[ "chiptune",    { real: Array.from( { length: 2048 },  ( _, n ) => 4 / ( n * Math.PI ) * Math.sin( Math.PI * n * .18 ) ) } ],
	[ "organ3",      { real: [ 0, 0, -.042008, .010474, -.138038, .002641, -.001673, .001039, -.021054, .000651, -.000422, .000334, -.000236, .000191, -.000161, .000145, -.018478, .000071, -.000066, .000047, -.000044, .000041, -.000034, .000031, -.00003, .000028, -.000025, .000024, -.000022, .00002, -.000015, .000013, -.01157, .000004, -.000003, .000003, -.000003, .000003, -.000003, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000001, .000001, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000898, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000245, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000106, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, .196487, 0, 0, -.000003, 0, 0, 0, -.000002, 0, 0, 0, 0, 0, 0, 0, -.000007, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000018, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000006, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000006, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.00001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "organ4",      { real: [ 0, 0, -.06072, .030357, -.015136, .006684, -.003512, .002544, -.002455, .002315, -.001264, .004643, -.000089, .000353, -.000165, .000152, -.000145, .000184, -.000123, .000216, -.000135, .000222, -.000219, .000066, -.000701, .000387, -.000125, .000341, -.000117, .004817, -.000568, .003995, -.000035, .000438, -.00028, .000426, -.000038, .000078, -.000108, .000272, -.000161, .000111, -.000165, .000191, -.000156, .000209, -.000072, .000054, -.000111, .001741, -.000161, .001192, -.000127, .000053, -.000044, .000062, -.000095, .00002, -.000102, .000148, -.000051, .00015, -.0001, .000096, -.000095, .000115, -.000081, .000062, -.000022, .000134, -.00008, .000184, -.000018, .000023, -.000044, .000049, -.000057, .000024, -.000033, .000035, -.000057, .000031, -.000044, .000043, -.00001, .000004, -.000062, .000016, -.00005, .000062, -.000051, .00009, -.000036, .000029, -.00005, .000029, -.000025, .000035, -.000036, .000031, -.000028, .000038, -.000064, .000014, -.000031, .000025, -.000042, .000032, -.000045, .000076, -.000025, .000021, -.000029, .000057, -.000019, .000003, -.000039, .000062, -.000035, .000027, -.000024, .000003, -.000051, .000041, -.000047, .000043, -.000039, .000036, -.000045, .000025, -.000067, .000029, -.000021, .000022, -.000038, .000047, -.000029, .000021, -.000037, .000022, -.000047, .000017, -.000051, .000041, -.000031, .000025, -.000013, .000018, -.000041, .000015, -.000018, .000015, -.000022, .00003, -.00003, .000021, -.000027, .000044, -.000023, .000019, -.000024, .00001, -.00002, .000045, -.000038, .000014, -.000017, .000022, -.000025, .00002, -.00001, .000025, -.000004, .000008, -.000013, .000012, -.000028, .000023, -.000022, .000027, -.000008, .000021, -.000016, .000007, -.000022, .000025, -.000008, .000005, -.000005, .000024, -.000025, .000015, -.000017, .000015, -.000012, .000027, -.000023, .000033, -.000004, .000018, -.000026, .000013, -.000012, .000017, -.000021, .000004, -.000015, .000013, -.000002, .000018, -.000011, .000009, -.000016, .000007, -.000009, .000007, -.000009, .00001, -.000018, .000027, -.000011, .000009, -.000012, .000015, -.000019, .000006, -.000008, .00001, -.000007, .000013, -.000005, .000008, -.000018, .000016, -.000015, .000007, -.000011, .000018, -.000012, .00001, -.000019, .000008, -.000008, .000005, -.000001, .000016, -.000008, .000011, -.000002, .000008, -.000013, .000019, -.000005, .00001, -.000012, .000015, -.000016, .000017, -.000013, .000007, -.000013, .000022, -.000012, .000015, -.000012, .00001, -.000009, .000016, -.000012, .000007, -.000008, .000011, -.000007, .000015, -.000005, .000008, -.000001, .000009, -.000015, .000001, -.000012, .000013, -.000012, .000007, -.000013, .000011, -.000013, .000006, -.000008, .000012, -.000005, .000004, -.000005, .000006, -.000013, .000012, -.00001, .000006, -.000007, .000016, -.00001, .000006, -.000006, .000007, -.000007, .000009, -.000009, .000009, -.000008, .000009, -.000008, .000008, -.000008, .000007, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002 ],  imag: [ 0, .168526, 0, 0, 0, 0, 0, 0, 0, 0, 0, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000001, 0, 0, 0, 0, .000006, -.000001, .000006, 0, .000001, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, .000001, 0, 0, 0, .000006, -.000001, .000005, -.000001, 0, 0, 0, 0, 0, -.000001, .000001, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, 0, 0, .000001, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, -.000001, 0, -.000001, .000001, -.000001, .000001, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, .000001, -.000001, 0, -.000001, 0, -.000001, .000001, -.000001, .000001, 0, 0, -.000001, .000001, 0, 0, -.000001, .000001, -.000001, .000001, -.000001, 0, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000002, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000002, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, -.000001, 0, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000001, .000001, -.000001, 0, -.000001, .000002, -.000002, .000001, -.000001, .000001, -.000001, .000001, 0, .000001, 0, 0, -.000001, .000001, -.000001, .000001, -.000001, .000001, 0, .000001, -.000001, 0, -.000001, .000001, 0, 0, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000001, .000002, 0, .000001, -.000002, .000001, -.000001, .000001, -.000001, 0, -.000001, .000001, 0, .000001, -.000001, .000001, -.000001, 0, -.000001, 0, -.000001, .000001, -.000001, .000002, -.000001, .000001, -.000001, .000001, -.000001, 0, -.000001, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000001, .000001, -.000002, .000001, -.000001, 0, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000002, -.000001, .000001, -.000001, .000001, -.000002, .000002, -.000001, .000001, -.000001, .000002, -.000001, .000002, -.000001, .000001, -.000001, .000002, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000001, .000001, 0, .000001, -.000002, 0, -.000001, .000001, -.000001, .000001, -.000002, .000001, -.000002, .000001, -.000001, .000001, -.000001, 0, -.000001, .000001, -.000002, .000002, -.000001, .000001, -.000001, .000002, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000003, .000002, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "organ5",      { real: [ 0, 0, -.265053, .031303, -.066069, .013133, -.009975, .007226, -.031381, .005814, -.004185, .00364, -.002811, .002464, -.002233, .002158, -.021544, .001203, -.001169, .00089, -.000868, .000847, -.000732, .000716, -.000701, .000687, -.000653, .000641, -.00061, .000564, -.000434, .000118, -.013082, .000114, -.000112, .000111, -.000109, .000108, -.000106, .00008, -.000079, .000078, -.000077, .000076, -.000075, .000074, -.000073, .000072, -.000072, .000071, -.00007, .00007, -.000069, .000068, -.000068, .000067, -.000049, .000048, -.000048, .000048, -.000047, .000047, -.000046, .000046, -.007244, .000045, -.000045, .000045, -.000044, .000044, -.000044, .000043, -.000043, .000043, -.000043, .000042, -.000042, .000042, -.000041, .000034, -.000034, .000034, -.000034, .000033, -.000033, .000033, -.000033, .000033, -.000032, .000032, -.000032, .000032, -.000032, .000032, -.000031, .000031, -.000031, .000031, -.00003, .00003, -.00003, .000029, -.000029, .000029, -.000029, .000029, -.000029, .000029, -.000028, .000028, -.000028, .000028, -.000028, .000028, -.000028, .000028, -.000027, .000026, -.000026, .000026, -.000026, .000026, -.000026, .000026, -.000026, .000026, -.000026, .000025, -.003235, .000025, -.000025, .000025, -.000025, .000025, -.000025, .000025, -.00002, .00002, -.00002, .00002, -.00002, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000021, -.000021, .000027, -.000027, .000027, -.000027, .000027, -.000027, .000027, -.000027, .000027, -.000027, .000027, -.000027, .000027, -.000027, .000027, -.000024, .000024, -.000024, .000024, -.000024, .000024, -.000024, .000024, -.000024, .000024, -.000024, .000024, -.000024, .000024, -.000023, .000023, -.000023, .000023, -.000023, .000023, -.000023, .000023, -.000023, .000023, -.000023, .000023, -.000023, .000023, -.001577, .000023, -.000023, .000023, -.000023, .000023, -.000023, .000022, -.000022, .000022, -.000022, .000022, -.000022, .000022, -.000022, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.000021, .000021, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .00002, -.00002, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000019, -.000019, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000018, .000018, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000018, -.000018, .000018, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000017, -.000017, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000388, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000016, -.000016, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000015, -.000015, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000014, -.000014, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000013, -.000013, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, .163431, -.000002, 0, -.000002, 0, -.000001, .000001, -.000003, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000008, .000001, -.000001, 0, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, 0, -.00002, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000044, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000079, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000155, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000004, .000004, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000005, -.000005, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000006, -.000006, .000007, -.000007, .000007, -.000007, .000007, -.000161, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000007, .000007, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000008, .000008, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .000009, -.000009, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .000009, -.000009, .000009, -.000009, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.00001, .00001, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000011, .000011, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, -.000012, .000012, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "bass2",       { real: [ 0, -.000001, -.085652, .034718, -.036957, .014576, -.005792, .003677, -.002998, .001556, -.000486, .0015, -.000809, .000955, -.000169, .000636, -.000682, .000663, -.000166, .000509, -.00042, .000194, -.000025, .000267, -.000299, .000226, -.000038, .000163, -.000273, .000141, -.000047, .000109, -.000162, .000088, -.000035, .000115, -.000157, .000079, -.000035, .000099, -.000064, .000104, -.00002, .000056, -.0001, .000053, -.000039, .000065, -.000082, .000065, -.000051, .000054, -.00006, .000035, -.000011, .000047, -.000049, .000033, -.00002, .000037, -.000041, .000056, -.000004, .000025, -.000048, .000022, -.000008, .000015, -.000052, .000013, -.000011, .000017, -.000029, .000023, -.000003, .000017, -.000031, .000027, -.000008, .000016, -.000033, .000025, -.000013, .00002, -.000021, .000022, -.000004, .000019, -.000024, .00001, -.000006, .000009, -.000019, .000018, -.000006, .000015, -.000018, .000013, -.000009, .000017, -.000022, .000013, -.000001, .000014, -.000013, .000013, -.000006, .000012, -.000015, .000013, -.000001, .000014, -.000012, .000012, -.000003, .000011, -.000014, .000009, -.000004, .000009, -.000011, .000005, -.000001, .000008, -.00001, .000009, -.000003, .000009, -.000012, .000007, -.000002, .000007, -.000008, .000007, -.000003, .000008, -.000009, .000007, -.000003, .000007, -.000008, .000006, -.000003, .000005, -.000009, .000006, -.000001, .000005, -.000007, .000005, -.000001, .000005, -.000008, .000004, -.000001, .000005, -.000006, .000005, -.000001, .000006, -.000007, .000003, -.000002, .000004, -.000006, .000004, -.000002, .000004, -.000005, .000004, -.000002, .000004, -.000006, .000003, -.000001, .000005, -.000005, .000004, -.000002, .000004, -.000004, .000003, -.000001, .000004, -.000005, .000003, -.000001, .000004, -.000004, .000003, -.000002, .000003, -.000004, .000003, -.000002, .000003, -.000004, .000003, -.000001, .000003, -.000004, .000002, -.000002, .000003, -.000003, .000002, -.000001, .000003, -.000003, .000002, -.000001, .000002, -.000003, .000002, -.000002, .000002, -.000003, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000002, .000002, -.000001, .000002, -.000002, .000002, -.000001, .000002, -.000003, .000002, 0, .000002, -.000004, .000003, -.000001, .000003, -.000005, .000005, -.000003, .000004, -.000007, .000007, -.000006, .000006, -.000008, .000009, -.000008, .000007, -.000009, .00001, -.000009, .000007, -.000008, .000009, -.000009, .000007, -.000007, .000008, -.000008, .000006, -.000005, .000006, -.000007, .000005, -.000003, .000005, -.000005, .000004, -.000002, .000004, -.000004, .000003, -.000002, .000003, -.000004, .000003, -.000002, .000003, -.000004, .000003, -.000001, .000003, -.000003, .000002, -.000001, .000003, -.000003, .000002, -.000001, .000003, -.000003, .000002, -.000001, .000002, -.000003, .000002, -.000001, .000002, -.000003, .000002, -.000001, .000002, -.000003, .000002, -.000001, .000002, -.000003, .000002, -.000001, .000002, -.000003, .000002, -.000001, .000002, -.000002, .000002, -.000001, .000002, -.000002, .000002, -.000001, .000002, -.000002, .000002, -.000001, .000002, -.000002, .000001, -.000001, .000002, -.000002, .000001, -.000001, .000002, -.000002, .000001, 0, .000002, -.000002, .000001, 0, .000002, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000002, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, .000001, 0, .000001, -.000001, 0, 0, .000001, -.000001, 0, 0, .000001, -.000001, 0, 0, .000001, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, .5, -.000001, 0, -.000001, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, 0, .000001, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "bass3",       { real: [ 0, -.087481, -.008727, .015668, -.000741, -.002277, -.0016, -.00405, -.001203, -.003604, -.001386, -.00309, -.001163, -.002088, -.001024, -.001233, -.000737, -.000601, -.000461, -.00017, -.000188, -.000004, -.000007, .000086, .000105, .00005, .000133, .000031, .000092, -.000011, .00004, -.000004, -.000029, -.000005, -.000058, .000015, -.000067, .000019, -.000047, .000027, -.000011, .000016, .000018, .000004, .000032, .000002, .000031, -.000006, .000013, -.000011, -.000003, -.000012, -.000019, -.000015, -.000031, -.00001, -.00002, -.000009, -.000014, -.00001, .000004, .000001, .000013, .000001, .000017, .000008, .000019, .000009, .000012, .000008, .000005, .000005, .000001, .000008, -.000007, -.000004, 0, -.000006, -.000001, -.000002, .000002, -.000002, .000005, .000004, .000004, .000009, .000002, .000008, .000003, .000009, .000004, .000006, -.000001, .000001, .000002, -.000002, 0, -.000005, .000001, -.000002, 0, -.000004, .000002, 0, .000002, .000004, .000003, .000006, .000005, .000007, .000003, .000005, .000002, -.000002, .000001, -.000002, 0, -.000001, -.000004, -.000003, .000004, 0, .000001, -.000001, 0, .000005, 0, .000003, .000001, .000002, .000005, .000001, -.000002, .000001, .000003, 0, -.000002, 0, -.000002, 0, 0, .000003, .000001, .000003, .000001, .000003, .000005, .000001, .000003, .000003, .000002, .000001, .000003, .000001, 0, .000002, .000001, .000002, 0, .000004, -.000001, -.000002, .000002, -.000001, 0, .000003, .000002, .000002, .000001, .000001, .000002, -.000001, .000002, .000002, .000003, .000002, .000002, .000002, -.000003, .000002, -.000001, -.000001, .000001, .000002, .000001, .000001, -.000001, .000002, .000003, .000002, 0, .000003, .000001, 0, 0, .000002, .000001, .000003, .000001, -.000001, .000004, 0, .000001, -.000001, .000001, -.000002, -.000001, .000002, -.000001, .000002, .000001, 0, 0, .000001, 0, .000001, -.000001, .000001, 0, -.000001, 0, -.000001, .000003, -.000001, .000002, .000001, 0, 0, -.000002, -.000001, .000001, 0, -.000001, 0, .000002, .000002, .000002, .000001, -.000001, -.000002, .000002, -.000001, .000005, .000003, .000002, .000002, 0, -.000001, -.000001, 0, .000003, -.000002, .000003, .000001, .000002, 0, 0, .000005, 0, .000001, 0, .000001, .000001, 0, -.000002, .000003, 0, .000001, .000001, -.000001, .000001, .000004, 0, 0, .000002, .000002, .000002, 0, 0, -.000002, .000001, 0, .000002, .000002, .000002, .000002, .000005, .000002, -.000002, .000003, 0, .000001, .000002, .000002, -.000002, -.000002, .000002, .000003, 0, -.000001, .000004, -.000001, .000002, -.000003, 0, .000003, -.000001, .000002, .000003, .000001, 0, .000005, .000002, 0, 0, .000001, .000001, .000001, 0, 0, .000003, .000001, .000001, .000003, 0, .000004, .000004, .000001, .000001, -.000001, .000002, .000002, .000001, .000001, .000003, 0, .000003, .000001, .000001, .000002, .000005, .000001, .000004, .000004, .000002, .000003, .000004, .000002, .000003, -.000001, .000002, 0, .000001, 0, .000002, 0, 0, 0, .000001, 0, -.000001, -.000001, 0, -.000001, -.000002, -.000001, -.000002, -.000001, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, .492288, .009944, .032169, .001931, .019775, .001332, .00657, .001131, .004102, .00065, .000918, .000445, .000083, .000082, -.000726, -.000113, -.00063, -.000292, -.000559, -.000277, -.000299, -.000256, -.000153, -.000139, -.000007, -.000037, .000032, .000048, .000041, .00009, .000033, .00009, .000007, .000059, .000009, .000029, .000004, -.000003, .000013, -.000016, .000022, -.000006, .00003, .000007, .000024, .00003, .000031, .000037, .000023, .000037, .000021, .000029, .000019, .000009, .000007, -.000006, .000005, -.000013, -.000003, -.000015, -.000009, -.000008, -.000008, 0, -.000008, .000008, -.000003, .000017, .000005, .00001, .00001, .000008, .000012, .000004, .00001, -.000004, .000004, -.000002, .000006, -.000003, -.000001, -.000002, -.000003, .000004, -.000003, .000004, .000002, .000006, .000006, .000008, .000007, .000004, .000005, .000004, .000005, 0, .000002, -.000001, -.000001, -.000001, -.000002, 0, -.000002, .000002, -.000002, 0, 0, -.000001, .000001, .000001, .000004, .000002, 0, .000005, .000002, .000002, .000001, -.000001, -.000002, -.000003, -.000002, 0, -.000002, -.000003, 0, -.000004, .000002, -.000003, -.000001, .000002, .000001, -.000002, 0, .000001, -.000002, .000003, -.000002, 0, 0, -.000001, -.000005, -.000002, -.000003, -.000002, -.000002, -.000001, .000001, -.000002, .000001, -.000001, -.000002, .000002, .000001, .000004, -.000001, .000002, -.000003, -.000001, -.000001, .000001, .000001, -.000003, 0, -.000002, .000002, -.000001, -.000002, 0, 0, .000001, -.000002, -.000002, .000001, .000002, .000001, 0, -.000001, -.000001, 0, -.000001, .000001, -.000002, .000001, -.000001, -.000001, .000001, -.000003, 0, -.000001, .000001, -.000001, .000001, 0, 0, -.000001, .000003, .000001, -.000001, .000001, -.000001, .000001, -.000002, 0, .000001, -.000001, 0, -.000001, .000001, .000003, -.000003, 0, .000001, 0, 0, .000001, 0, -.000001, -.000001, 0, .000001, -.000002, -.000001, -.000002, -.000002, 0, -.000001, 0, -.000001, .000001, -.000001, -.000001, -.000002, -.000002, -.000001, .000001, .000003, -.000001, .000003, 0, -.000003, -.000002, -.000002, .000001, -.000001, .000002, 0, -.000003, -.000001, -.000001, .000001, -.000002, -.000002, 0, -.000001, 0, -.000002, .000001, -.000002, 0, -.000002, 0, -.000001, -.000001, .000001, .000002, -.000004, 0, -.000001, .000001, .000002, -.000002, .000002, -.000001, -.000002, .000001, 0, .000001, 0, -.000002, -.000002, 0, .000001, 0, 0, -.000001, .000001, 0, -.000002, .000001, 0, -.000003, .000002, -.000001, -.000001, .000001, 0, -.000001, .000001, .000001, -.000001, 0, 0, -.000002, -.000003, -.000002, -.000001, 0, 0, -.000001, .000002, .000001, .000002, .000002, .000001, -.000001, 0, .000002, .000002, -.000002, -.000002, .000001, -.000001, 0, .000001, -.000001, .000002, 0, -.000001, .000001, -.000001, -.000004, .000002, 0, 0, -.000002, 0, -.000001, 0, -.000002, -.000002, -.000002, -.000001, -.000002, -.000001, 0, 0, -.000002, -.000001, -.000002, -.000003, -.000003, -.000003, -.000003, -.000004, -.000004, -.000002, -.000003, -.000003, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "bass4",       { real: [ 0, .001056, -.371626, -.038289, -.241364, .065179, -.127552, .014426, -.00302, -.014399, -.01333, .003929, -.013432, .007582, -.002041, -.000047, .003094, -.002225, -.000156, .000395, -.000159, .00016, .000402, .000149, .000178, .00003, .000372, -.000328, .000189, -.000124, .000033, -.000099, .000096, .000033, .000028, .000108, .000076, .000039, .000098, .000036, .000002, .000056, .000063, -.000052, .000077, .000001, .000032, -.00001, .000019, -.000029, .000014, -.000008, .000004, -.000003, .000016, -.000008, -.000004, -.000003, .000008, .000009, -.000007, .000004, .000004, .000011, .000005, -.000003, .000003, -.000004, .000001, -.000005, .000009, -.000007, .000005, .000002, -.000001, .000008, 0, -.000009, -.000004, -.000001, -.000009, .000007, -.000004, .000003, -.000005, .000004, .000013, -.000003, .000006, .000006, .000009, -.000003, -.000001, .000004, -.000004, -.000005, .000003, -.000005, .000004, .000002, -.000011, -.000006, .000008, .000008, -.000008, -.000003, -.000005, .000005, -.000009, .000009, .000001, -.000002, -.000006, .000001, .000006, 0, .000001, .000003, -.000008, .000002, 0, -.000006, -.000003, .000005, .00001, .000007, .000002, -.000004, .000003, 0, .000002, .000001, .000007, .000011, -.000004, .000005, .000002, -.000001, -.000004, .000013, .000007, .000003, .000001, 0, -.000001, .000005, -.000005, -.000005, .000003, .000002, .00001, -.000001, -.000002, .000002, 0, 0, .000003, -.000005, .000008, .000003, -.000005, .000002, .000001, .000001, .000003, .000001, .000011, .000002, -.000003, .000008, 0, -.000004, .000002, .000005, .000006, -.000007, .000005, 0, -.000005, .000004, .000001, .000003, .000013, .000004, .000004, .000001, .000003, .000005, -.000002, .000005, .000005, .000002, .000007, .000009, .000006, 0, -.000002, .000002, 0, -.000002, .000004, -.000006, .000004, .000004, .000008, -.000004, .00001, .000005, .000008, -.000002, .000005, .000005, .000014, .000002, .000008, .000003, .000005, .000002, .000011, -.000007, .000001, 0, -.000003, 0, .000006, .000006, .000004, .00001, .000009, .000004, .000001, .000001, .000005, .000002, -.000004, 0, .000004, .000003, .000008, 0, .000008, -.000004, .000006, .000009, -.000003, .000004, .000008, .000003, .000007, .000007, .000003, .000002, .000006, .000019, .000001, .000006, -.000005, -.000004, .00001, -.000001, .00001, -.00001, .00001, .000005, .00001, .000006, .000011, -.000001, .000008, .000004, 0, .000004, .000001, .000006, .000013, .000013, .000012, .000009, .000004, .000004, .000003, .000003, .000015, .000012, .000015, .000007, .000013, .000006, .000014, .000014, .000012, .000013, .000012, .000015, .000019, .000013, .00001, .000009, .000006, .000001, .000007, .000006, 0, -.000004, -.000008, -.000007, -.00001, -.000011, -.000011, -.000012, -.000012, -.000013, -.000013, -.000012, -.000012, -.000012, -.000011, -.00001, -.00001, -.000009, -.000009, -.000008, -.000007, -.000007, -.000007, -.000006, -.000006, -.000006, -.000005, -.000005, -.000005, -.000005, -.000005, -.000004, -.000004, -.000004, -.000004, -.000004, -.000004, -.000004, -.000004, -.000004, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000003, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, -.499999, .077463, .070331, .132072, .012785, .003997, .02055, -.010545, -.008137, -.000311, -.013317, -.004685, -.00145, -.006016, -.004443, .0041, -.007229, .002437, -.002378, -.000323, -.000455, .000476, -.000748, .000378, -.000138, .000087, -.000111, .000144, -.00017, -.000052, -.000136, -.000061, -.000182, -.000043, -.000061, -.000048, -.000021, .000033, -.000047, .00005, .000033, -.00001, .00001, .000043, -.000003, .000024, .000028, .00001, .000026, .000003, -.000008, -.000005, .000019, -.000006, -.000004, .000007, .000017, 0, .000007, 0, .00001, .000011, .00001, .000002, .000009, .000007, .000009, -.000001, .000013, -.000001, -.000001, .000005, .000009, .000008, .000005, .000006, .000011, .000004, .000001, -.000008, .000008, .000006, .000002, -.000003, .000004, -.000011, .000004, -.000005, .000008, -.000002, .000003, -.000008, -.000001, .000001, -.000008, .000003, .000001, .000005, .000005, -.000002, -.000003, -.000008, -.000002, .000003, .000005, .000007, -.000005, .000004, .000009, -.000011, .000008, -.000006, .000003, .000004, -.000001, -.000002, -.000001, .000007, -.000002, .000012, -.000006, .000005, -.000001, -.000001, .000002, -.000003, .000012, -.000003, .000008, -.000002, .000002, .000009, -.000003, .000008, .000001, .000007, .000005, -.000004, -.000002, -.000004, -.000001, .000001, .000003, .000008, -.000007, 0, -.000002, -.000003, -.000002, .000002, .000004, 0, .000006, 0, -.000001, -.000006, .000001, -.00001, .000003, -.000003, .000005, -.000002, .000007, -.000005, .000009, .000005, .000001, .000002, .000007, .000001, -.000006, .000005, .000001, .000012, .000003, -.000001, -.000001, .000017, .000005, -.000002, .000001, -.000001, -.000005, -.000003, -.000001, .000002, -.000001, -.000011, -.000002, -.000005, -.000004, -.000004, -.000001, .000008, -.000001, .000002, 0, -.000002, .000004, .000007, .000004, -.000009, .000001, .000001, -.000007, -.000008, -.000002, 0, .000008, -.000015, .000002, .000003, .000007, -.000006, .000003, .000007, 0, -.000001, .000002, .000002, .000005, 0, -.000001, .000002, -.000008, -.000003, .000001, .000002, -.000009, -.000006, -.000017, -.000001, .000008, -.000002, -.000002, -.000004, -.000017, -.000001, -.000005, -.000009, .000001, -.000005, .000007, -.000003, -.000012, -.000003, -.000012, .000001, .000007, -.000014, -.000007, 0, -.000003, -.000001, .000002, .000001, 0, .000005, .000006, .000006, .000005, -.000001, -.000009, .000004, -.000003, .000006, -.000005, -.00001, 0, .000001, -.000001, .000007, -.000006, -.000011, .000003, .000005, .000003, -.000006, .00001, -.000012, -.000007, 0, -.000012, -.000004, .000002, -.00001, 0, -.000004, -.000001, -.000014, -.000002, -.000017, -.000013, -.000019, -.000008, -.000015, -.000022, -.000016, -.000024, -.000026, -.00002, -.000024, -.000024, -.000023, -.000017, -.000019, -.000017, -.000017, -.000013, -.000012, -.00001, -.000009, -.000007, -.000006, -.000005, -.000004, -.000003, -.000003, -.000002, -.000002, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "brass2",      { real: [ 0, .171738, .131907, -.1948, -.129913, -.081043, .049213, .027828, -.008357, -.005044, .002145, .000773, -.001392, -.000916, -.000012, .000323, -.000003, .000127, -.000135, -.000029, -.000031, .000087, -.000091, .000005, -.000026, .000027, -.000062, -.000017, -.000002, .000002, .000012, -.000024, .000011, -.000011, -.000001, 0, .000003, .000006, -.000009, -.000002, .000001, .000007, .000014, -.000008, -.000001, -.000003, -.000011, -.000003, .000004, -.000002, -.000004, .000001, -.000004, .000001, .000003, .000001, .000002, .000003, -.000001, -.000005, 0, .000001, -.000008, .000001, .000003, -.000004, -.000004, -.000002, .000003, 0, -.000002, -.000009, .000009, .000024, .000011, -.000017, -.000024, -.000002, 0, .000002, .000015, .000022, .000001, -.000022, -.000016, .000001, .000002, -.000003, -.000002, .000001, -.000001, .000005, .000001, -.000001, -.000001, 0, -.000001, -.000003, -.000001, -.000002, .000001, -.000003, -.000002, .000004, .000007, -.000002, -.000006, -.000009, -.000003, -.000001, .000001, 0, .000006, 0, -.000009, -.000011, .000003, .000005, -.000002, -.000002, -.000001, .000001, .000001, 0, -.000001, -.000001, .000001, 0, -.000001, .000002, .000001, 0, 0, 0, -.000001, 0, 0, -.000002, -.000001, 0, 0, 0, .000001, .000001, -.000001, -.000001, -.000002, .000001, .000002, -.000001, -.000004, 0, .000004, .000005, .000001, 0, -.000002, 0, -.000004, .000001, .000004, .000007, 0, -.000004, 0, .000002, .000001, -.000001, .000001, 0, 0, -.000001, 0, -.000002, .000001, .000004, 0, -.000007, .000002, .00003, .000007, -.000035, .000007, .000111, .000036, -.000022, -.000053, 0, .000001, -.000004, .000035, .000082, .00004, -.000032, -.000062, -.000012, .000012, -.000008, -.000006, .000004, .000006, .000003, .000001, 0, .000001, 0, 0, -.000001, -.000001, -.000001, -.000001, -.000002, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, -.090905, .482287, .259485, .009402, -.125271, -.046816, .007872, .001762, -.010488, -.002305, .001791, .001101, -.000303, -.000064, .000143, .000059, .000116, .00012, -.000011, -.000066, -.000019, .000024, .000014, .000069, .000056, .000005, .000002, -.000026, -.000015, .000055, .000012, .000046, -.000007, .000007, -.000003, -.000007, .000002, -.000003, -.00001, -.000011, -.000004, .000003, .000001, .000005, -.000001, -.000004, .000001, .000001, .000001, .000004, 0, -.000001, .000001, .000004, -.000001, -.000002, 0, -.000003, -.000004, .000003, -.000007, 0, .000001, .000003, .000002, 0, -.000001, 0, .000001, .000006, -.000008, -.000016, .000013, .000017, .000013, .000001, 0, -.000002, -.000001, -.000004, .000007, .000016, .000021, -.000008, -.000013, .000003, .000006, -.000001, .000001, .000002, 0, .000001, -.000001, .000001, 0, 0, -.000004, .000002, 0, .000001, .000002, -.000001, -.000005, .000004, .000014, .000005, -.000006, -.000007, -.000001, -.000001, 0, .000009, .000009, .000001, -.000006, -.000008, .000001, .000002, -.000001, -.000002, 0, .000001, .000001, 0, 0, .000002, -.000002, 0, -.000001, 0, 0, -.000001, -.000001, 0, 0, .000001, 0, 0, -.000001, 0, 0, 0, 0, .000001, .000001, -.000002, -.000003, -.000001, .000002, -.000001, -.000007, -.000002, .000002, .000004, 0, .000001, .000001, -.000002, -.000006, -.000002, .000003, .000006, .000001, 0, 0, .000002, -.000001, -.000001, -.000001, .000001, 0, 0, -.000001, 0, .000003, .000008, .000001, -.00001, -.000006, .000015, -.000026, -.000075, -.00001, .00005, .000082, .000023, -.000004, 0, -.000002, -.000045, -.000002, .000041, .000093, -.000009, -.000034, .000008, .00002, -.000001, -.000006, -.000001, 0, -.000002, -.000004, -.000003, -.000003, -.000002, -.000003, -.000002, -.000002, -.000002, -.000001, -.000001, -.000001, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "haa",         { real: [ 0, .246738, .08389, .095378, .087885, .165621, .287369, -.328845, -.099613, -.198535, .260484, .012771, .013351, .006221, .003106, .000629, -.003591, -.002876, -.003527, -.002975, -.002648, -.006996, -.004165, -.004266, -.000731, .003727, .018167, .012018, -.017044, -.004816, -.001255, -.002032, .000272, -.001849, .004334, .000773, -.00069, -.000207, .000136, -.000108, .000508, -.000701, -.000958, -.004677, .002005, -.001925, -.00145, -.002212, -.001163, -.000227, .000182, -.000448, .000152, -.000316, -.000054, -.000193, -.00017, -.000138, -.000179, .000059, .000017, .000008, .000252, .000382, -.000319, .00002, -.000087, .00002, -.000024, -.000002, .000044, -.000131, .000145, -.000581, -.000182, -.001087, -.000746, -.002759, -.001195, -.002868, -.000729, -.002915, .000325, -.001489, .000419, -.000322, .000054, -.0002, .000032, .000071, .000196, -.000127, .000355, -.000328, .000518, -.00028, .00062, -.00036, .000553, -.000153, .000088, .000227, .000454, -.000071, .0002, -.000214, .000326, -.00043, .000123, -.000226, .000094, -.000102, -.000003, -.000096, .000084, .000037, -.000107, -.000201, .000152, -.0003, -.000197, -.000083, .000063, -.000092, .000009, -.000076, -.000057, .000094, .000096, -.000071, -.000529, -.000336, -.000661, -.000637, -.001247, -.000167, -.001025, -.001483, .000107, -.000321, -.000251, .000186, .000315, -.000163, -.000102, -.001242, -.001912, -.000113, .000724, .00079, .000078, -.000061, .000077, -.000069, .00005, .000002, -.000077, -.000168, .000073, .000044, .000047, .000093, -.000101, -.000012, -.000048, -.000033, .000034, -.000304, -.000188, -.000116, -.000167, -.000096, -.000298, -.000044, -.000107, -.000036, -.000012, .000043, .000191, -.000126, -.000011, .0001, .000098, -.000021, -.000129, -.000016, -.000182, -.000203, -.000249, -.000452, -.000216, -.000162, .000092, .000246, -.000028, -.000214, .000035, .000038, -.000032, -.000037, -.000015, -.00001, -.000011, -.00004, -.000014, -.00002, -.000031, -.000023, -.000012, 0, 0, .000004, .000008, .000014, .000015, .000016, .000018, .000019, .000019, .000017, .000016, .000015, .000014, .000012, .000011, .00001, .00001, .000009, .000008, .000008, .000008, .000007, .000006, .000007, .000007, .000006, .000005, .000006, .000006, .000005, .000005, .000005, .000005, .000004, .000004, .000004, .000005, .000004, .000004, .000004, .000004, .000004, .000003, .000004, .000004, .000003, .000003, .000003, .000004, .000003, .000003, .000003, .000003, .000003, .000003, .000003, .000003, .000003, .000002, .000003, .000003, .000003, .000002, .000003, .000003, .000002, .000002, .000002, .000003, .000002, .000002, .000002, .000003, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000002, .000001, .000002, .000002, .000002, .000001, .000002, .000002, .000002, .000001, .000002, .000002, .000002, .000001, .000002, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, 0, .000001, .000001, .000001, .000001, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, 0, 0, .000001, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, -.011959, .106385, .027196, .04077, .010807, -.17632, -.376644, .052966, .242678, .322558, -.029071, -.017862, -.018765, -.010794, -.010157, -.004212, -.001923, -.002589, -.000607, -.001983, -.000421, -.001835, .003069, .005389, .012023, .003422, -.013914, -.008548, .007815, .002234, .003867, .000488, .000824, -.002685, -.000085, -.002967, -.000125, -.000831, -.000192, -.000222, -.003892, .000474, -.002069, .001899, .001648, -.00049, .001615, -.000309, -.000211, -.000327, -.000702, .000325, -.000152, .000048, .000011, .000152, -.000106, -.000003, -.000063, .000026, -.000104, -.000479, -.000528, -.000551, -.000202, -.00024, -.000079, -.000078, .000053, -.000058, .000163, .000573, -.000025, .000171, -.001189, .000385, -.000574, -.000608, -.000859, -.00066, -.000638, -.002096, -.000233, -.002119, .000081, -.001687, -.000175, -.00059, .000237, .000237, .000232, .000473, .000578, .00056, .000534, .000858, .001336, .000692, .001099, .000203, -.000084, -.000032, -.000114, -.000094, -.000085, -.000034, -.000303, .000267, .000139, -.000143, .000062, -.000023, -.000049, -.000084, -.000129, -.000141, -.000123, .000102, .000171, -.000007, .000123, .000116, .00012, .000003, .000098, .000055, -.000044, -.000258, -.000552, -.000945, -.00028, -.000222, -.000038, -.000132, -.000249, .00088, .000518, .001033, .000874, .000496, .000873, .000276, -.000206, -.000785, -.000948, -.000148, .001179, .000101, -.000833, -.000357, -.000168, -.000115, -.000072, -.000116, -.000215, -.000148, -.000118, .000104, .000058, -.000093, -.000217, -.000153, -.000159, -.000116, -.000134, -.000078, -.000215, -.000206, .000099, -.000054, -.000095, .000029, -.000054, .000009, -.000064, -.000038, -.000046, -.000145, -.000362, -.00014, -.000172, -.000209, -.000191, -.000257, -.000252, -.000234, -.000525, -.00026, -.000337, .000005, .000083, .000142, -.000229, -.000192, .000069, .000069, .000006, -.000001, -.000011, .000027, .000008, .000009, .000003, .000004, .000022, .000025, .00004, .000038, .000034, .000036, .000037, .000033, .000028, .000026, .000023, .00002, .000016, .000012, .000009, .000008, .000006, .000005, .000003, .000004, .000003, .000003, .000002, .000003, .000003, .000002, .000002, .000002, .000003, .000002, .000002, .000002, .000002, .000002, .000001, .000002, .000002, .000002, .000001, .000002, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000002, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, .000001, 0, .000001, .000001, 0, 0, .000001, .000001, 0, 0, .000001, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, .000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "hoo",         { real: [ 0, -.370874, .288281, -.454893, .061559, .049432, -.012918, .129553, -.041687, -.012594, -.006316, .00813, .000601, -.000181, -.005799, .000374, -.000806, .000236, -.001341, .000891, .000361, .000822, -.000374, .0006, .000703, -.002483, .002295, -.000217, .00045, -.00019, .000034, -.000237, .000719, -.000872, .000771, -.000461, .000487, -.000296, -.000324, .000094, -.000297, .000801, -.000836, .000114, .000064, .000199, -.000033, -.000051, -.000107, -.000221, -.000052, .000198, -.000028, -.000199, .000055, -.000105, -.000255, -.00014, .000114, -.000041, -.000117, .000085, -.000033, -.000004, .000011, -.000273, -.000059, -.000038, -.000255, .000055, -.000013, .000089, -.000059, .000164, .000091, .000001, .00007, -.000004, .000151, -.000148, .000486, -.000242, .000123, -.00005, -.00015, .000053, -.000109, .000183, -.000181, .000331, -.000187, .000227, -.000157, .000145, .000079, -.000158, -.000039, -.000118, .000027, -.000315, .000324, -.000773, .000717, -.000255, -.000114, -.000174, -.000084, -.000107, .00003, -.000092, -.000038, -.00001, -.000173, .000146, -.000033, -.000415, .000811, -.000489, .000142, -.00009, .000044, -.000171, .000034, -.000026, -.000217, -.000042, -.000131, .000229, -.000262, .000534, -.001005, .000352, .000284, -.000795, .000905, -.000018, -.000307, .000268, -.000369, .00047, -.00035, .000241, -.000347, .000472, -.000438, .000056, .000835, -.00025, .000228, -.000023, -.000927, .000283, -.000599, .00017, -.000008, .00022, -.000072, .000262, -.000139, .000048, -.000117, .00016, -.000168, .000174, -.000239, .000141, -.000023, -.000095, .000147, -.000017, -.000049, .000112, .000071, -.000373, .000062, .00012, -.000049, .000005, -.000099, .00001, -.000004, -.000051, .000254, -.000079, -.000125, .000128, -.000043, -.000037, -.000002, .000015, -.000069, .000221, -.000129, .00002, .000037, -.000071, .000027, -.000023, -.000007, -.000008, .000021, -.000001, .000006, .000011, .000011, .000001, -.000005, .000003, -.000004, .000001, .000001, -.000007, -.000006, -.000007, -.000007, -.000007, -.000007, -.000007, -.000007, -.000006, -.000005, -.000005, -.000005, -.000004, -.000003, -.000004, -.000004, -.000003, -.000003, -.000003, -.000003, -.000003, -.000002, -.000003, -.000003, -.000002, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, 0, 0, -.000001, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, .046536, .256926, .019372, -.496196, .016047, -.063615, .021345, -.007871, -.020463, .009909, .003165, -.000942, -.002837, .002435, -.003583, .001061, -.002121, -.00013, .000233, -.00032, .000087, .00095, -.001264, .002961, -.000701, .000715, .000451, -.000291, .000048, .000166, -.000528, .000677, -.000218, -.000003, -.00028, -.000135, .000574, -.000348, .000214, -.00044, .000625, .001131, -.000147, .000135, -.000206, -.000013, -.000018, -.000061, -.000043, .00012, .000051, -.000039, .000039, .000068, -.000041, -.000088, -.00007, .000099, -.000165, .000194, -.000161, -.000109, -.000013, -.000071, .000097, -.000165, -.000033, .000068, .000003, .000068, -.000104, .000159, -.000107, .000065, .000007, .000123, -.000005, -.000101, -.000075, .000024, .000528, -.000422, .000479, -.000171, -.000048, -.00015, .00035, -.000185, -.000023, .000163, .000053, -.000016, .000018, -.000264, .000025, -.000246, -.000067, -.000231, .000039, -.000093, .000095, .000045, .00045, -.000697, .00017, .000055, -.00016, .00012, .000118, -.00007, .000054, .000057, -.000246, .000253, -.000389, .000138, -.000053, .000014, -.000032, -.000162, .000048, -.000089, -.000145, -.000163, .000127, .000215, -.000009, -.000012, .000117, .000425, -.000036, .000827, -.001058, -.000607, .000224, .000075, -.000086, -.00014, .000358, -.000212, .000479, -.000007, -.000196, .000109, .000138, .000173, .000108, -.000153, .000167, -.000805, .000246, -.00006, -.000009, .000113, -.000008, .000042, -.000097, -.00003, .000144, -.00013, .000154, .000024, .000062, -.000026, -.000145, .000156, -.000205, .000047, .000042, -.000049, -.00007, .000232, -.000152, -.000228, .00021, -.000025, .000046, -.000051, .000131, -.000038, -.000125, .000053, .000214, -.000195, .000066, .000045, -.000026, .000015, .000001, -.000146, .000059, .000115, -.000094, .000138, 0, .000007, -.000025, .000013, .000011, .000002, .000016, -.000017, -.000014, -.000017, -.000005, -.000008, -.000006, -.000008, -.000018, -.000007, -.000008, -.00001, -.000009, -.000006, -.000004, -.000004, -.000003, -.000002, -.000001, -.000001, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "hee",         { real: [ 0, -.18267, -.381543, .046629, -.280517, -.058269, .014912, .011407, -.00491, -.008831, .007088, .005653, -.007082, -.004146, .007708, .007322, -.007934, -.001923, .012704, -.003957, -.025076, .081539, -.028921, -.009431, .029387, -.030368, -.027489, .078646, -.029917, .032701, .025565, -.01946, .006748, -.000172, .001069, -.005152, .000071, -.002174, -.009055, .007263, .006293, -.002175, -.002678, -.00915, -.013944, -.006199, -.002361, .000379, .000083, .00035, -.003055, -.002105, -.000272, .00089, .000309, .000372, -.000033, .000019, .000394, .002459, .000636, .000037, -.000448, -.000024, .000167, .00011, -.000273, -.001496, .000576, -.000046, .000392, .001059, -.000534, -.001739, -.000852, .000874, -.000216, -.000045, .00067, -.000683, -.000112, .000774, .00061, -.000969, .001546, -.002348, -.000035, .000377, .000047, -.000193, -.000005, .000063, .00062, .001381, .000166, -.000893, -.001365, .000227, -.001158, -.000931, .000769, .000677, -.001738, -.000036, .00173, -.001, .00118, .000523, .000082, -.001654, .000389, -.000019, .000313, .000609, .000098, -.000023, -.000075, .000049, .000117, .00012, .000112, -.000222, -.000516, .000126, .000504, -.00001, .000212, .000085, -.000913, -.000224, .000658, -.000036, -.000046, -.000009, -.000536, .000095, -.000029, .000541, .001019, .000433, .001496, .000125, .001146, -.000755, .000334, .000348, -.000312, .00007, .000234, -.00004, -.000131, .000076, -.000156, .00013, -.000085, -.000091, .000188, -.000039, .000024, .000344, -.000242, -.00007, .000319, -.000416, .000025, -.00011, .000055, -.000194, .000158, .000058, .000076, -.00024, -.000046, .000113, -.000122, .000069, .000447, -.000375, .00049, -.000148, -.00026, .000153, -.000188, -.000029, .0001, -.00003, -.000155, .000216, .000072, -.00003, .00018, .000012, .00005, .000055, -.000011, -.000057, .000173, .000043, .000086, .000179, .000049, .000115, -.000086, .000031, .000013, -.000048, .000034, -.000004, .000054, .000046, -.000026, -.000003, .000006, -.000024, -.000016, -.000016, -.000021, -.000022, -.000023, -.000021, -.000019, -.000019, -.000019, -.000016, -.000013, -.000013, -.000013, -.000011, -.000009, -.00001, -.00001, -.000009, -.000007, -.000008, -.000008, -.000007, -.000006, -.000007, -.000007, -.000006, -.000005, -.000006, -.000007, -.000006, -.000005, -.000005, -.000006, -.000005, -.000004, -.000005, -.000005, -.000005, -.000004, -.000004, -.000005, -.000004, -.000003, -.000004, -.000005, -.000004, -.000003, -.000004, -.000004, -.000004, -.000003, -.000004, -.000004, -.000003, -.000003, -.000003, -.000004, -.000003, -.000003, -.000003, -.000004, -.000003, -.000002, -.000003, -.000004, -.000003, -.000002, -.000003, -.000003, -.000003, -.000002, -.000003, -.000003, -.000003, -.000002, -.000003, -.000003, -.000003, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000003, -.000002, -.000002, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],  imag: [ 0, -.43237, -.202117, .451975, -.413897, .067733, -.004269, -.003175, -.010887, .002024, .010798, -.007897, -.001622, .006998, .000402, -.004589, .002325, .012148, -.000278, -.026627, .030999, .000779, .003562, .059443, -.000897, -.060501, .050517, -.071021, -.016851, .033358, -.020689, .017911, .003015, -.001239, -.001775, .002736, .004554, -.00915, -.004987, -.002883, -.00365, .007024, .012555, .004629, .005519, -.00267, -.005895, -.002137, .001283, .004861, .001504, .001201, -.000659, -.000842, .000634, .000375, .0001, -.000789, -.000378, .001145, .000364, .000262, -.000061, -.000102, .000159, .000251, -.000692, -.000857, -.000218, -.000893, .000143, .000225, -.000062, -.000535, -.000438, -.000737, -.001102, .000446, .000278, -.000187, .000046, .000234, -.000884, .00202, .000283, -.001297, .001203, -.000222, -.000362, -.000121, .000121, -.000191, .001329, -.000903, .00118, .000885, -.000269, -.000627, -.001597, .000511, .000786, -.000873, -.00213, .002391, -.00209, -.001152, .000507, .000232, -.000004, -.000316, -.000121, -.001509, -.000535, -.000056, .000351, .000182, -.000082, -.000408, .000097, .000283, .000473, -.000282, -.0003, .000261, -.00032, -.000398, .001237, -.000129, .000208, .000185, -.000386, -.00013, .000326, .000293, -.000305, -.000676, -.000229, -.000485, -.00119, -.000019, -.000357, .000688, .00034, -.000466, .0008, .000173, .000018, .000227, -.000105, .000098, .000167, -.000184, -.000029, -.000012, -.00009, -.000032, .000072, -.000079, .000188, -.000016, -.000123, .000382, -.000205, .00008, .000012, -.00011, .000033, -.000315, .000191, -.000128, -.000093, -.000093, .000028, -.000154, -.00029, .0002, -.000182, -.000142, .000841, -.00028, .00006, -.000014, -.000124, .000064, .000018, -.000067, .000051, .000001, -.000068, .00004, .000001, .000026, .000054, .000084, -.000004, -.000021, -.000016, -.000091, .00009, -.000108, .0001, .000023, .000091, .000047, -.000064, .000005, -.000043, -.000018, -.000049, -.000061, -.000034, -.000021, -.000049, -.000041, -.000028, -.00003, -.000024, -.000022, -.000017, -.000012, -.00001, -.000009, -.000006, -.000003, -.000004, -.000004, -.000003, -.000001, -.000002, -.000003, -.000002, -.000001, -.000002, -.000003, -.000002, -.000001, -.000002, -.000003, -.000002, -.000001, -.000002, -.000002, -.000002, -.000001, -.000002, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, -.000001, -.000001, -.000002, -.000001, 0, -.000001, -.000002, -.000001, 0, -.000001, -.000002, -.000001, 0, -.000001, -.000002, -.000001, 0, -.000001, -.000002, -.000001, 0, -.000001, -.000002, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, -.000001, -.000001, -.000001, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } ],
	[ "buzz",        { real: [ 0, -.000001, -.139102, .086216, -.053293, .034018, -.024299, .01707, -.015971, .01553, -.012639, .011335, -.011541, .01043, -.009167, .008078, -.007356, .007138, -.006327, .005447, -.001334, .000749, -.000421, .000303, -.000297, .000234, -.00023, .000212, -.000208, .000246, -.000242, .000238, -.000234, .000389, -.000383, .000378, -.000373, .000582, -.000575, .000567, -.001135, .001121, -.001108, .002151, -.002127, .002103, -.004914, .004862, -.008108, .017829, -.01765, .018022, -.014397, .014261, -.014129, .011645, -.011541, .009515, -.006526, .00647, -.003472, .002311, -.001538, .001573, -.001561, .001549, -.001537, .001525, -.001299, .001289, -.00128, .001271, -.001262, .001417, -.001641, .001631, -.00162, .001609, -.001599, .001589, -.001579, .001569, -.00156, .00155, -.001541, .001532, -.001619, .00161, -.001601, .001592, -.001583, .001574, -.001566, .001557, -.001549, .001541, -.001533, .001525, -.001517, .00151, -.001502, .001495, -.001487, .00148, -.001473, .001466, -.001459, .001452, -.001446, .001439, -.001432, .001426, -.00142, .001413, -.001407, .001401, -.001395, .001389, -.001383, .001377, -.001372, .001366, -.00136, .001355, -.001349, .001344, -.001339, .001333, -.001328, .001323, -.001318, .001313, -.001308, .001303, -.001298, .001293, -.001288, .001284, -.001279, .001397, -.001392, .001387, -.001383, .001378, -.001373, .001368, -.001363, .001359, -.001354, .00135, -.001345, .001341, -.001336, .001332, -.001328, .001323, -.001319, .001315, -.001311, .001306, -.001302, .001298, -.001294, .00129, -.001286, .001282, -.001279, .001275, -.001271, .001267, -.001263, .00126, -.001256, .001252, -.001249, .001245, -.001242, .001238, -.001234, .001231, -.001228, .001224, -.001221, .001217, -.001214, .001211, -.001207, .001204, -.001201, .001198, -.001195, .001191, -.001188, .001185, -.001182, .001179, -.001176, .001173, -.00117, .001167, -.001164, .001161, -.001158, .001155, -.001152, .00115, -.001147, .001144, -.001141, .001138, -.001136, .001133, -.00113, .001128, -.000755, .000753, -.000751, .000773, -.000771, .000769, -.000767, .000766, -.000764, .000762, -.00076, .000759, -.000757, .000755, -.000753, .000752, -.000798, .000796, -.000794, .000792, -.000791, .000789, -.000787, .000786, -.000784, .000782, -.00078, .000779, -.000777, .000775, -.000774, .000772, -.000771, .000769, -.000767, .000766, -.000764, .000836, -.000835, .000833, -.000831, .000829, -.000854, .000852, -.00085, .000848, -.000847, .000845, -.000843, .000842, -.00084, .000838, -.000837, .000835, -.000833, .000832, -.00083, .000829, -.000827, .000825, -.000824, .000822, -.000821, .000819, -.000818, .000816, -.000815, .000813, -.000812, .00081, -.000809, .000783, -.000781, .00078, -.000778, .000777, -.000775, .000751, -.000749, .000748, -.000747, .000745, -.000744, .000743, -.000741, .00074, -.000739, .000737, -.000736, .000735, -.000733, .000732, -.000731, .000729, -.000728, .000727, -.000726, .000724, -.000723, .000722, -.000721, .000719, -.000718, .000717, -.000716, .000714, -.000713, .000712, -.000711, .00071, -.000708, .000707, -.000706, .000705, -.000704, .000702, -.000701, .0007, -.000699, .000698, -.000697, .000696, -.000694, .000693, -.000692, .000691, -.00069, .000689, -.000688, .000686, -.000685, .000684, -.000704, .000703, -.000702, .000701, -.0007, .000699, -.000698, .000696, -.000695, .000694, -.000693, .000692, -.000691, .00069, -.000689, .000688, -.000686, .000685, -.000684, .000683, -.000682, .000681, -.00068, .000679, -.000678, .000677, -.000676, .000675, -.000674, .000672, -.000671, .00067, -.000669, .000668, -.000667, .000666, -.000665, .000664, -.000663, .000662, -.000661, .00066, -.000659, .000658, -.000657, .000656, -.000655, .000654, -.000653, .000652, -.000651, .00065, -.000649, .000648, -.000647, .000646, -.000645, .000644, -.000643, .000642, -.000641, .00064, -.000639, .000638, -.000637, .000636, -.000635, .000634, -.000614, .000613, -.000612, .000611, -.00061, .000609, -.000608, .000607, -.000607, .000606, -.000605, .000604, -.000603, .000602, -.000601, .0006, -.000599, .000598, -.000597, .000596, -.000596, .000595, -.000594, .000593, -.000592, .000591, -.00059, .000589, -.000588, .000587, -.000587, .000586, -.000585, .000584, -.000583, .000582, -.000581, .00058, -.000579, .000579, -.000578, .000577, -.000576, .000575, -.000574, .000573, -.000572, .000571, -.000571, .00057, -.000569, .000568, -.000567, .000566, -.000565, .000564, -.000564, .000563, -.000562, .000561, -.00056, .000559, -.000558, .000558, -.000557, .000556, -.000555, .000554, -.000553, .000552, -.000473, .000472, -.000472, .000471, -.00047, .000469, -.000469, .000468, -.000467, .000466, -.000466, .000465, -.000464, .000463, -.000463, .000462, -.000461, .000461, -.00046, .000459, -.000458, .000458, -.000457, .000456, -.000455, .000455, -.000454, .000453, -.000452, .000452, -.000451, .00045, -.00045, .000449, -.000448, .000447, -.000447, .000446, -.000445, .000445, -.000444, .000443, -.000442, .000442, -.000441, .00044, -.000439, .000439, -.000438, .000437, -.000437, .000436, -.000435, .000434, -.000434, .000433, -.000432, .000431, -.000431, .00043, -.000429, .000429, -.000428, .000427, -.000426, .000426, -.000425, .000424, -.000423, .000423, -.000422, .000421, -.000421, .00042, -.000419, .000418, -.000418, .000417, -.000416, .000415, -.000415, .000414, -.000413, .000413, -.000412, .000411, -.00041, .00041, -.000409, .000408, -.000407, .000407, -.000406, .000405, -.000405, .000404, -.000403, .000402, -.000402, .000401, -.0004, .000399, -.000399, .000398, -.000397, .000396, -.000396, .000349, -.000349, .000348, -.000347, .000347, -.000346, .000345, -.000345, .000344, -.000343, .000343, -.000342, .000341, -.000341, .00034, -.00034, .000339, -.000338, .000338, -.000337, .000336, -.000336, .000335, -.000334, .000334, -.000333, .000332, -.000332, .000331, -.00033, .00033, -.000329, .000328, -.000328, .000327, -.000326, .000326, -.000325, .000324, -.000324, .000323, -.000322, .000322, -.000321, .00032, -.00032, .000319, -.000318, .000318, -.000317, .000316, -.000316, .000315, -.000314, .000314, -.000313, .000312, -.000311, .000311, -.00031, .000309, -.000309, .000308, -.000307, .000307, -.000306, .000305, -.000305, .000304, -.000303, .000303, -.000302, .000301, -.000301, .0003, -.000299, .000298, -.000298, .000297, -.000296, .000296, -.000295, .000294, -.000294, .000293, -.000292, .000291, -.000291, .00029, -.000289, .000271, -.000271, .00027, -.00027, .000269, -.000268, .000268, -.000267, .000266, -.000266, .000265, -.000264, .000264, -.000263, .000262, -.000262, .000261, -.00026, .000259, -.000259, .000258, -.000257, .000257, -.000256, .000255, -.000255, .000254, -.000253, .000253, -.000252, .000251, -.000251, .00025, -.000249, .000249, -.000248, .000247, -.000247, .000246, -.000245, .000245, -.000244, .000243, -.000242, .000242, -.000241, .00024, -.00024, .000239, -.000238, .000238, -.000237, .000236, -.000235, .000235, -.000234, .000233, -.000233, .000232, -.000231, .000231, -.00023, .000229, -.000228, .000228, -.000227, .000226, -.000226, .000225, -.000224, .000223, -.000223, .000222, -.000221, .000221, -.00022, .000219, -.000218, .000218, -.000217, .000216, -.000216, .000215, -.000214, .000213, -.000213, .000212, -.000211, .00021, -.00021, .000209, -.000208, .000208, -.000207, .000206, -.000205, .000205, -.000204, .000203, -.000202, .000178, -.000178, .000177, -.000176, .000176, -.000175, .000174, -.000174, .000173, -.000172, .000172, -.000171, .00017, -.00017, .000169, -.000168, .000168, -.000167, .000166, -.000166, .000165, -.000164, .000164, -.000163, .000162, -.000162, .000161, -.00016, .00016, -.000159, .000158, -.000158, .000157, -.000156, .000156, -.000155, .000154, -.000154, .000153, -.000152, .000152, -.000151, .00015, -.000149, .000149, -.000148, .000147, -.000147, .000146, -.000145, .000145, -.000144, .000143, -.000143, .000142, -.000141, .000141, -.00014, .000139, -.000138, .000138, -.000137, .000136, -.000136, .000135, -.000134, .000134, -.000133, .000132, -.000131, .000131, -.00013, .000129, -.000129, .000128, -.000127, .000126, -.000126, .000125, -.000124, .000124, -.000123, .000122, -.000121, .000121, -.00012, .000119, -.000118, .000118, -.000117, .000116, -.000116, .000115, -.000114, .000113, -.000113, .000112, -.000111, .000111, -.00011, .000109, -.000108, .000108, -.000107, .000106, -.000105, .000105, -.000104, .000103, -.000103, .000102, -.000101, .0001, -.0001, .000099, -.000098, .000097, -.000097, .000096, -.000095, .000094, -.000094, .000093, -.000092, .000091, -.000091, .00009, -.000089, .000088, -.000088, .000087, -.000086, .000085, -.000085, .000084, -.000083, .000083, -.000082, .000081, -.00008, .000079, -.000079, .000078, -.000077, .000076, -.000076, .000075, -.000074, .000073, -.000073, .000072, -.000071, .00007, -.00007, .000069, -.000068, .000067, -.000067, .000066, -.000065, .000064, -.000064, .000063, -.000062, .000061, -.00006, .00006, -.000059, .000058, -.000057, .000057, -.000056, .000055, -.000054, .000052, -.000051, .000051, -.00005, .000049, -.000048, .000048, -.000047, .000046, -.000045, .000045, -.000044, .000043, -.000042, .000042, -.000041, .00004, -.000039, .000039, -.000038, .000037, -.000036, .000036, -.000035, .000034, -.000033, .000033, -.000032, .000031, -.00003, .000029, -.000029, .000028, -.000027, .000026, -.000026, .000025, -.000024, .000023, -.000023, .000022, -.000021, .00002, -.00002, .000019, -.000018, .000017, -.000017, .000016, -.000015, .000014, -.000014, .000013, -.000012, .000011, -.000011, .00001, -.000009, .000008, -.000008, .000007, -.000006, .000005, -.000005, .000004, -.000003, .000002, -.000002, .000001, 0, -.000001, .000002, -.000002, .000003, -.000004, .000005, -.000005, .000006, -.000007, .000008, -.000008, .000009, -.00001, .000011, -.000011, .000012, -.000013, .000014, -.000014, .000015, -.000016, .000017, -.000017, .000018, -.000019, .00002, -.00002, .000021, -.000022, .000023, -.000024, .000024, -.000025, .000026, -.000027, .000027, -.000028, .000029, -.00003, .00003, -.000031, .000032, -.000033, .000033, -.000034, .000035, -.000036, .000036, -.000037, .000038, -.000039, .000039, -.00004, .000041, -.000041, .000042, -.000043, .000044, -.000044, .000045, -.000046, .000047, -.000047, .000048, -.000049, .00005, -.00005, .000051, -.000052, .000053, -.000053, .000054, -.000055, .000056, -.000056, .000057, -.000058, .000059, -.000059, .00006, -.000061, .000062, -.000062, .000063, -.000064, .000065, -.000065, .000066, -.000067, .000067, -.000068, .000069, -.00007, .00007, -.000071, .000072, -.000073, .000073, -.000074, .000075, -.000075, .000076, -.000077, .000078, -.000078, .000079, -.00008, .00008, -.000081, .000082, -.000083, .000083, -.000084, .000085, -.000085, .000086, -.000087, .000087, -.000088, .000089, -.00009, .00009, -.000091, .000092, -.000092, .000093, -.000094, .000095, -.000095, .000096, -.000097, .000097, -.000098, .000099, -.000099, .0001, -.000101, .000101, -.000102, .000103, -.000104, .000104, -.000105, .000106, -.000106, .000107, -.000108, .000108, -.000109, .000109, -.00011, .000111, -.000112, .000112, -.000113, .000114, -.000114, .000115, -.000116, .000116, -.000117, .000118, -.000118, .000119, -.000119, .00012, -.000121, .000121, -.000122, .000123, -.000123, .000124, -.000125, .000125, -.000126, .000126, -.000127, .000128, -.000128, .000129, -.00013, .00013, -.000131, .000131, -.000132, .000133, -.000133, .000134, -.000135, .000135, -.000136, .000136, -.000137, .000138, -.000138, .000139, -.000139, .00014, -.00014, .000141, -.000142, .000142, -.000143, .000144, -.000144, .000145, -.000145, .000146, -.000146, .000147, -.000148, .000148, -.000149, .000149, -.00015, .00015, -.000151, .000152, -.000152, .000153, -.000153, .000154, -.000154, .000155, -.000155, .000156, -.000156, .000157, -.000157, .000158, -.000159, .000159, -.00016, .00016, -.000161, .000161, -.000162, .000162, -.000163, .000163, -.000164, .000164, -.000165, .000165, -.000166, .000166, -.000167, .000178, -.000178, .000179, -.000179, .00018, -.00018, .000181, -.000181, .000182, -.000182, .000183, -.000183, .000184, -.000184, .000185, -.000185, .000186, -.000186, .000187, -.000187, .000188, -.000188, .000189, -.000189, .00019, -.00019, .000191, -.000191, .000191, -.000192, .000192, -.000193, .000193, -.000194, .000194, -.000194, .000195, -.000195, .000196, -.000196, .000197, -.000197, .000197, -.000198, .000198, -.000199, .000199, -.000199, .0002, -.0002, .000201, -.000201, .000201, -.000202, .000202, -.000202, .000203, -.000203, .000204, -.000204, .000204, -.000205, .000205, -.000205, .000206, -.000206, .000206, -.000207, .000207, -.000207, .000208, -.000208, .000208, -.000209, .000209, -.000209, .000209, -.00021, .00021, -.00021, .000211, -.000211, .000211, -.000211, .000212, -.000212, .000212, -.000213, .000213, -.000213, .000213, -.000214, .000214, -.000214, .000214, -.000215, .000215, -.000215, .000215, -.000215, .000216, -.000216, .000216, -.000216, .000217, -.000217, .000217, -.000217, .000217, -.000217, .000218, -.000218, .000218, -.000218, .000218, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .00022, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.00022, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000222, -.000222, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000221, -.000221, .000221, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000218, .000218, -.000218, .000218, -.000218, .000218, -.000217, .000217, -.000217, .000217, -.000217, .000216, -.000216, .000216, -.000216, .000215, -.000215, .000215, -.000215, .000215, -.000214, .000214, -.000214, .000213, -.000213, .000213, -.000213, .000212, -.000212, .000212, -.000211, .000211, -.000211, .000211, -.00021, .00021, -.00021, .000209, -.000209, .000209, -.000208, .000208, -.000208, .000207, -.000207, .000207, -.000206, .000206, -.000205, .000205, -.000205, .000204, -.000204, .000204, -.000203, .000203, -.000202, .000202, -.000202, .000201, -.000201, .0002, -.0002, .000199, -.000199, .000199, -.000198, .000198, -.000197, .000197, -.000196, .000196, -.000195, .000195, -.000194, .000194, -.000193, .000193, -.000192, .000192, -.000191, .000191, -.00019, .00019, -.000189, .000189, -.000188, .000188, -.000187, .000187, -.000186, .000186, -.000185, .000185, -.000184, .000183, -.000183, .000182, -.000182, .000181, -.000181, .00018, -.000179, .000179, -.000178, .000178, -.000177, .000176, -.000176, .000175, -.000175, .000174, -.000173, .000173, -.000172, .000171, -.000171, .00017, -.000169, .000169, -.000168, .000167, -.000167, .000166, -.000165, .000165, -.000164, .000163, -.000163, .000162, -.000161, .000161, -.00016, .000159, -.000158, .000158, -.000157, .000156, -.000156, .000155, -.000154, .000153, -.000153, .000152, -.000151, .00015, -.00015, .000149, -.000148, .000147, -.000147, .000146, -.000145, .000144, -.000143, .000143, -.000142, .000141, -.00014, .000139, -.000139, .000138, -.000137, .000136, -.000135, .000135, -.000134, .000133, -.000132, .000131, -.00013, .00013, -.000129, .000128, -.000127, .000126, -.000125, .000125, -.000124, .000123, -.000122, .000121, -.00012, .000119, -.000118, .000118, -.000117, .000116, -.000115, .000114, -.000113, .000112, -.000111, .00011, -.00011, .000109, -.000108, .000107, -.000106, .000105, -.000104, .000103, -.000102, .000101, -.0001, .000099, -.000099, .000098, -.000097, .000096, -.000095, .000094, -.000093, .000092, -.000091, .00009, -.000089, .000088, -.000087, .000086, -.000085, .000084, -.000083, .000082, -.000081, .00008, -.000079, .000078, -.000077, .000076, -.000075, .000074, -.000073, .000072, -.000071, .00007, -.000069, .000068, -.000067, .000066, -.000065, .000064, -.000063, .000062, -.000061, .00006, -.000059, .000058, -.000057, .000056, -.000055, .000054, -.000053, .000052, -.000051, .00005, -.000049, .000048, -.000047, .000046, -.000045, .000044, -.000043, .000042, -.000041, .00004, -.000039, .000038, -.000037, .000036, -.000035, .000033, -.000032, .000031, -.00003, .000029, -.000028, .000027, -.000026, .000025, -.000024, .000023, -.000022, .000021, -.00002, .000019, -.000018, .000017, -.000016, .000014, -.000013, .000012, -.000011, .00001, -.000009, .000008, -.000007, .000006, -.000005, .000004, -.000003, .000002, -.000001, 0, .000001, -.000003, .000004, -.000005, .000006, -.000007, .000008, -.000009, .00001, -.000011, .000012, -.000013, .000014, -.000015, .000016, -.000017, .000018, -.00002, .000021, -.000022, .000023, -.000024, .000025, -.000026, .000027, -.000028, .000029, -.00003, .000031, -.000032, .000033, -.000034, .000035, -.000036, .000037, -.000038, .000039, -.000041, .000041, -.000043, .000044, -.000045, .000046, -.000047, .000048, -.000049, .00005, -.000051, .000052, -.000053, .000054, -.000055, .000056, -.000057, .000058, -.000059, .00006, -.000061, .000062, -.000063, .000064, -.000065, .000066, -.000067, .000068, -.000069, .00007, -.000071, .000072, -.000073, .000074, -.000075, .000076, -.000077, .000078, -.000079, .00008, -.000081, .000082, -.000083, .000084, -.000085, .000086, -.000087, .000088, -.000089, .00009, -.00009, .000091, -.000092, .000093, -.000094, .000095, -.000096, .000097, -.000098, .000099, -.0001, .000101, -.000101, .000102, -.000103, .000104, -.000105, .000106, -.000107, .000108, -.000109, .000109, -.00011, .000111, -.000112, .000113, -.000114, .000115, -.000116, .000116, -.000117, .000118, -.000119, .00012, -.000121, .000121, -.000122, .000123, -.000124, .000125, -.000125, .000126, -.000127, .000128, -.000129, .000129, -.00013, .000131, -.000132, .000133, -.000133, .000134, -.000135, .000136, -.000149, .00015, -.000151, .000152, -.000153, .000153, -.000154, .000155, -.000156, .000157, -.000157, .000158, -.000159, .00016, -.00016, .000161, -.000162, .000163, -.000163, .000164, -.000165, .000165, -.000166, .000167, -.000168, .000168, -.000169, .00017, -.00017, .000171, -.000172, .000172, -.000173, .000174, -.000174, .000175, -.000175, .000176, -.000177, .000177, -.000178, .000178, -.000179, .00018, -.00018, .000181, -.000181, .000182, -.000182, .000183, -.000184, .000184, -.000185, .000185, -.000186, .000186, -.000187, .000187, -.000188, .000188, -.000189, .000189, -.00019, .00019, -.00019, .000191, -.000191, .000192, -.000192, .000193, -.000193, .000193, -.000194, .000194, -.000195, .000195, -.000195, .000196, -.000196, .000196, -.000197, .000197, -.000197, .000198, -.000198, .000198, -.000199, .000199, -.000199, .000199, -.0002, .0002, -.0002, .0002, -.000201, .000201, -.000201, .000201, -.000201, .000202, -.000202, .000202, -.000202, .000202, -.000203, .000203, -.000203, .000203, -.000203, .000203, -.000203, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000204 ],  imag: [ 0, .341455, -.000001, .000002, -.000001, .000001, -.000001, .000001, -.000002, .000002, -.000002, .000002, -.000002, .000003, -.000003, .000003, -.000003, .000003, -.000003, .000003, -.000001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .000001, -.000001, .000001, -.000001, .000001, -.000001, .000001, -.000003, .000003, -.000003, .000006, -.000006, .000006, -.000016, .000016, -.000028, .000064, -.000066, .00007, -.000058, .00006, -.000062, .000053, -.000054, .000046, -.000033, .000034, -.000019, .000013, -.000009, .000009, -.00001, .00001, -.00001, .00001, -.000009, .000009, -.000009, .00001, -.00001, .000011, -.000013, .000014, -.000014, .000014, -.000015, .000015, -.000015, .000015, -.000016, .000016, -.000016, .000017, -.000018, .000018, -.000019, .000019, -.000019, .00002, -.00002, .00002, -.000021, .000021, -.000021, .000021, -.000022, .000022, -.000023, .000023, -.000023, .000024, -.000024, .000024, -.000025, .000025, -.000025, .000026, -.000026, .000026, -.000027, .000027, -.000027, .000028, -.000028, .000028, -.000029, .000029, -.00003, .00003, -.00003, .000031, -.000031, .000031, -.000032, .000032, -.000033, .000033, -.000033, .000034, -.000034, .000035, -.000035, .000035, -.000036, .000036, -.000036, .00004, -.000041, .000041, -.000042, .000042, -.000043, .000043, -.000044, .000044, -.000044, .000045, -.000045, .000046, -.000046, .000047, -.000047, .000048, -.000048, .000049, -.000049, .000049, -.00005, .00005, -.000051, .000051, -.000052, .000052, -.000053, .000053, -.000054, .000054, -.000055, .000055, -.000056, .000056, -.000057, .000057, -.000058, .000058, -.000059, .000059, -.00006, .00006, -.000061, .000061, -.000062, .000062, -.000063, .000063, -.000064, .000064, -.000065, .000065, -.000066, .000066, -.000067, .000067, -.000068, .000068, -.000069, .000069, -.00007, .00007, -.000071, .000071, -.000072, .000072, -.000073, .000074, -.000074, .000075, -.000075, .000076, -.000076, .000077, -.000052, .000052, -.000053, .000055, -.000055, .000055, -.000056, .000056, -.000057, .000057, -.000057, .000058, -.000058, .000058, -.000059, .000059, -.000063, .000064, -.000064, .000065, -.000065, .000065, -.000066, .000066, -.000067, .000067, -.000067, .000068, -.000068, .000069, -.000069, .00007, -.00007, .00007, -.000071, .000071, -.000072, .000079, -.00008, .00008, -.000081, .000081, -.000084, .000085, -.000085, .000086, -.000086, .000087, -.000087, .000088, -.000088, .000088, -.000089, .00009, -.00009, .000091, -.000091, .000092, -.000092, .000092, -.000093, .000094, -.000094, .000095, -.000095, .000096, -.000096, .000097, -.000097, .000098, -.000098, .000096, -.000096, .000097, -.000097, .000098, -.000098, .000096, -.000096, .000097, -.000097, .000098, -.000098, .000099, -.000099, .0001, -.0001, .000101, -.000101, .000102, -.000102, .000103, -.000103, .000104, -.000104, .000105, -.000105, .000106, -.000106, .000107, -.000107, .000108, -.000108, .000109, -.000109, .00011, -.00011, .000111, -.000111, .000112, -.000112, .000113, -.000113, .000114, -.000114, .000115, -.000115, .000116, -.000116, .000117, -.000118, .000118, -.000119, .000119, -.00012, .00012, -.000121, .000121, -.000122, .000122, -.000123, .000123, -.000128, .000128, -.000129, .000129, -.00013, .00013, -.000131, .000131, -.000132, .000133, -.000133, .000134, -.000134, .000135, -.000135, .000136, -.000136, .000137, -.000138, .000138, -.000139, .000139, -.00014, .00014, -.000141, .000142, -.000142, .000143, -.000143, .000144, -.000144, .000145, -.000145, .000146, -.000147, .000147, -.000148, .000148, -.000149, .000149, -.00015, .000151, -.000151, .000152, -.000152, .000153, -.000153, .000154, -.000155, .000155, -.000156, .000156, -.000157, .000158, -.000158, .000159, -.000159, .00016, -.00016, .000161, -.000162, .000162, -.000163, .000163, -.000164, .000164, -.000165, .000166, -.000161, .000162, -.000162, .000163, -.000163, .000164, -.000165, .000165, -.000166, .000166, -.000167, .000168, -.000168, .000169, -.000169, .00017, -.00017, .000171, -.000171, .000172, -.000173, .000173, -.000174, .000174, -.000175, .000176, -.000176, .000177, -.000177, .000178, -.000179, .000179, -.00018, .00018, -.000181, .000181, -.000182, .000182, -.000183, .000184, -.000184, .000185, -.000185, .000186, -.000187, .000187, -.000188, .000188, -.000189, .00019, -.00019, .000191, -.000191, .000192, -.000192, .000193, -.000194, .000194, -.000195, .000195, -.000196, .000197, -.000197, .000198, -.000198, .000199, -.0002, .0002, -.000201, .000201, -.000173, .000174, -.000174, .000175, -.000175, .000176, -.000176, .000177, -.000177, .000178, -.000178, .000179, -.000179, .00018, -.00018, .000181, -.000181, .000182, -.000182, .000183, -.000183, .000184, -.000184, .000185, -.000185, .000186, -.000186, .000187, -.000187, .000188, -.000188, .000189, -.00019, .00019, -.000191, .000191, -.000192, .000192, -.000193, .000193, -.000194, .000194, -.000195, .000195, -.000196, .000196, -.000197, .000197, -.000198, .000198, -.000199, .000199, -.0002, .0002, -.000201, .000201, -.000202, .000202, -.000203, .000203, -.000204, .000204, -.000205, .000205, -.000206, .000206, -.000207, .000207, -.000208, .000208, -.000209, .000209, -.00021, .00021, -.000211, .000211, -.000212, .000213, -.000213, .000213, -.000214, .000215, -.000215, .000216, -.000216, .000217, -.000217, .000218, -.000218, .000219, -.000219, .00022, -.00022, .000221, -.000221, .000222, -.000222, .000223, -.000223, .000224, -.000224, .000225, -.000225, .000226, -.000226, .000227, -.000227, .000201, -.000202, .000202, -.000203, .000203, -.000204, .000204, -.000205, .000205, -.000205, .000206, -.000206, .000207, -.000207, .000208, -.000208, .000209, -.000209, .00021, -.00021, .00021, -.000211, .000211, -.000212, .000212, -.000213, .000213, -.000214, .000214, -.000214, .000215, -.000215, .000216, -.000216, .000217, -.000217, .000218, -.000218, .000218, -.000219, .000219, -.00022, .00022, -.000221, .000221, -.000221, .000222, -.000222, .000223, -.000223, .000224, -.000224, .000224, -.000225, .000225, -.000226, .000226, -.000227, .000227, -.000227, .000228, -.000228, .000229, -.000229, .00023, -.00023, .00023, -.000231, .000231, -.000232, .000232, -.000233, .000233, -.000234, .000234, -.000234, .000235, -.000235, .000236, -.000236, .000236, -.000237, .000237, -.000238, .000238, -.000238, .000239, -.000239, .00024, -.00024, .000226, -.000227, .000227, -.000227, .000228, -.000228, .000229, -.000229, .000229, -.00023, .00023, -.00023, .000231, -.000231, .000232, -.000232, .000232, -.000233, .000233, -.000234, .000234, -.000234, .000235, -.000235, .000235, -.000236, .000236, -.000237, .000237, -.000237, .000238, -.000238, .000238, -.000239, .000239, -.000239, .00024, -.00024, .000241, -.000241, .000241, -.000242, .000242, -.000242, .000243, -.000243, .000243, -.000244, .000244, -.000244, .000245, -.000245, .000246, -.000246, .000246, -.000247, .000247, -.000247, .000248, -.000248, .000248, -.000249, .000249, -.000249, .00025, -.00025, .00025, -.000251, .000251, -.000251, .000252, -.000252, .000252, -.000253, .000253, -.000253, .000254, -.000254, .000254, -.000255, .000255, -.000255, .000256, -.000256, .000256, -.000257, .000257, -.000257, .000258, -.000258, .000258, -.000259, .000259, -.000259, .00026, -.00026, .00026, -.00026, .000261, -.000261, .000231, -.000231, .000232, -.000232, .000232, -.000232, .000233, -.000233, .000233, -.000234, .000234, -.000234, .000234, -.000235, .000235, -.000235, .000235, -.000236, .000236, -.000236, .000236, -.000237, .000237, -.000237, .000237, -.000238, .000238, -.000238, .000238, -.000239, .000239, -.000239, .000239, -.000239, .00024, -.00024, .00024, -.00024, .000241, -.000241, .000241, -.000241, .000242, -.000242, .000242, -.000242, .000242, -.000243, .000243, -.000243, .000243, -.000244, .000244, -.000244, .000244, -.000244, .000245, -.000245, .000245, -.000245, .000245, -.000246, .000246, -.000246, .000246, -.000246, .000247, -.000247, .000247, -.000247, .000247, -.000248, .000248, -.000248, .000248, -.000248, .000248, -.000249, .000249, -.000249, .000249, -.000249, .000249, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000252, .000252, -.000252, .000252, -.000252, .000252, -.000252, .000253, -.000253, .000253, -.000253, .000253, -.000253, .000253, -.000254, .000254, -.000254, .000254, -.000254, .000254, -.000254, .000254, -.000255, .000255, -.000255, .000255, -.000255, .000255, -.000255, .000255, -.000255, .000256, -.000256, .000256, -.000256, .000256, -.000256, .000256, -.000256, .000256, -.000256, .000257, -.000257, .000257, -.000257, .000257, -.000257, .000257, -.000257, .000257, -.000257, .000257, -.000257, .000257, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000258, -.000258, .000259, -.000259, .000259, -.000259, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.000251, .000251, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.00025, .00025, -.000249, .000249, -.000249, .000249, -.000249, .000249, -.000249, .000249, -.000249, .000249, -.000249, .000249, -.000248, .000248, -.000248, .000248, -.000248, .000248, -.000248, .000248, -.000248, .000247, -.000247, .000247, -.000247, .000247, -.000247, .000247, -.000247, .000246, -.000246, .000246, -.000246, .000246, -.000246, .000246, -.000245, .000245, -.000245, .000245, -.000245, .000245, -.000245, .000244, -.000244, .000244, -.000244, .000244, -.000243, .000243, -.000243, .000243, -.000243, .000243, -.000242, .000242, -.000242, .000242, -.000242, .000241, -.000241, .000241, -.000241, .000241, -.00024, .00024, -.00024, .00024, -.000239, .000239, -.000239, .000239, -.000239, .000238, -.000238, .000238, -.000238, .000237, -.000237, .000237, -.000237, .000236, -.000236, .000236, -.000236, .000235, -.000235, .000235, -.000235, .000234, -.000234, .000234, -.000233, .000233, -.000233, .000233, -.000232, .000232, -.000232, .000231, -.000231, .000231, -.000231, .00023, -.00023, .00023, -.000229, .000229, -.000229, .000228, -.000228, .000228, -.000227, .000227, -.000227, .000226, -.000226, .000226, -.000225, .000225, -.000225, .000224, -.000224, .000224, -.000223, .000223, -.000223, .000222, -.000222, .000222, -.000221, .000221, -.00022, .00022, -.00022, .000219, -.000219, .000218, -.000218, .000218, -.000217, .000217, -.000217, .000216, -.000216, .000215, -.000215, .000214, -.000214, .000214, -.000213, .000213, -.000212, .000212, -.000212, .000211, -.000211, .00021, -.00021, .000209, -.000209, .000209, -.000208, .000208, -.000207, .000207, -.000206, .000206, -.000205, .000205, -.000204, .000204, -.000203, .000203, -.000203, .000202, -.000202, .000201, -.000201, .0002, -.0002, .000199, -.000199, .000198, -.000198, .000197, -.000197, .000196, -.000196, .000195, -.000195, .000194, -.000194, .000193, -.000193, .000192, -.000191, .000191, -.00019, .00019, -.000189, .000189, -.000188, .000188, -.000187, .000187, -.000186, .000185, -.000185, .000184, -.000184, .000183, -.000183, .000182, -.000182, .000181, -.00018, .00018, -.000179, .000179, -.000178, .000177, -.000177, .000176, -.000176, .000175, -.000175, .000174, -.000173, .000173, -.000172, .000172, -.000171, .00017, -.00017, .000169, -.000168, .000168, -.000167, .000167, -.000166, .000165, -.000165, .000164, -.000163, .000163, -.000162, .000161, -.000161, .00016, -.00016, .000159, -.000158, .000158, -.000157, .000156, -.000156, .000155, -.000154, .000154, -.000153, .000152, -.000152, .000151, -.00015, .000149, -.000149, .000148, -.000147, .000147, -.000155, .000155, -.000154, .000153, -.000152, .000152, -.000151, .00015, -.000149, .000149, -.000148, .000147, -.000146, .000145, -.000145, .000144, -.000143, .000142, -.000142, .000141, -.00014, .000139, -.000139, .000138, -.000137, .000136, -.000135, .000135, -.000134, .000133, -.000132, .000131, -.000131, .00013, -.000129, .000128, -.000127, .000127, -.000126, .000125, -.000124, .000123, -.000122, .000122, -.000121, .00012, -.000119, .000118, -.000117, .000117, -.000116, .000115, -.000114, .000113, -.000112, .000111, -.000111, .00011, -.000109, .000108, -.000107, .000107, -.000106, .000105, -.000104, .000103, -.000102, .000101, -.0001, .0001, -.000099, .000098, -.000097, .000096, -.000095, .000094, -.000093, .000093, -.000092, .000091, -.00009, .000089, -.000088, .000087, -.000086, .000085, -.000085, .000084, -.000083, .000082, -.000081, .00008, -.000079, .000078, -.000077, .000077, -.000076, .000075, -.000074, .000073, -.000072, .000071, -.00007, .000069, -.000068, .000067, -.000066, .000065, -.000065, .000064, -.000063, .000062, -.000061, .00006, -.000059, .000058, -.000057, .000056, -.000055, .000054, -.000053, .000052, -.000052, .000051, -.00005, .000049, -.000048, .000047, -.000046, .000045, -.000044, .000043, -.000042, .000041, -.00004, .000039, -.000038, .000037, -.000036, .000035, -.000035, .000034, -.000033, .000032, -.000031, .00003, -.000029, .000028, -.000027, .000026, -.000025, .000024, -.000023, .000022, -.000021, .00002, -.000019, .000018, -.000017, .000016, -.000015, .000015, -.000014, .000013, -.000012, .000011, -.00001, .000009, -.000008, .000007, -.000006, .000005, -.000004, .000003, -.000002, .000001, 0, -.000001, .000002, -.000003, .000004, -.000005, .000006, -.000007, .000008, -.000008, .000009, -.00001, .000011, -.000012, .000013, -.000014, .000015, -.000016, .000017, -.000018, .000019, -.00002, .000021, -.000022, .000023, -.000024, .000025, -.000026, .000027, -.000028, .000029, -.00003, .000031, -.000031, .000032, -.000033, .000034, -.000035, .000036, -.000037, .000038, -.000039, .00004, -.000041, .000042, -.000043, .000044, -.000045, .000046, -.000047, .000047, -.000048, .000049, -.00005, .000051, -.000052, .000053, -.000054, .000055, -.000056, .000057, -.000058, .000059, -.00006, .000061, -.000061, .000062, -.000063, .000064, -.000065, .000066, -.000067, .000068, -.000069, .00007, -.000071, .000072, -.000072, .000073, -.000074, .000075, -.000076, .000077, -.000078, .000079, -.00008, .00008, -.000081, .000082, -.000083, .000084, -.000085, .000086, -.000087, .000088, -.000088, .000089, -.00009, .000091, -.000092, .000093, -.000094, .000094, -.000095, .000096, -.000097, .000098, -.000099, .0001, -.0001, .000101, -.000102, .000103, -.000104, .000105, -.000105, .000106, -.000107, .000108, -.000109, .00011, -.00011, .000111, -.000112, .000113, -.000114, .000115, -.000115, .000116, -.000117, .000118, -.000119, .000119, -.00012, .000121, -.000122, .000122, -.000123, .000124, -.000125, .000126, -.000126, .000127, -.000128, .000129, -.000129, .00013, -.000131, .000132, -.000132, .000133, -.000134, .000135, -.000135, .000136, -.000137, .000138, -.000138, .000139, -.00014, .00014, -.000141, .000142, -.000142, .000143, -.000144, .000145, -.000145, .000146, -.000147, .000147, -.000148, .000149, -.000149, .00015, -.000151, .000151, -.000152, .000153, -.000153, .000154, -.000155, .000155, -.000156, .000156, -.000157, .000158, -.000158, .000159, -.00016, .00016, -.000161, .000161, -.000162, .000162, -.000163, .000164, -.000164, .000165, -.000165, .000166, -.000167, .000167, -.000168, .000168, -.000169, .000169, -.00017, .00017, -.000171, .000171, -.000172, .000172, -.000173, .000173, -.000174, .000174, -.000175, .000175, -.000176, .000176, -.000177, .000177, -.000178, .000178, -.000179, .000179, -.00018, .00018, -.000181, .000181, -.000181, .000182, -.000182, .000183, -.000183, .000184, -.000184, .000184, -.000185, .000185, -.000186, .000186, -.000186, .000187, -.000187, .000187, -.000188, .000188, -.000188, .000189, -.000189, .00019, -.00019, .00019, -.00019, .000191, -.000191, .000191, -.000192, .000192, -.000192, .000193, -.000193, .000193, -.000193, .000194, -.000194, .000194, -.000194, .000195, -.000195, .000195, -.000195, .000196, -.000196, .000196, -.000196, .000196, -.000197, .000197, -.000197, .000197, -.000197, .000198, -.000198, .000198, -.000198, .000198, -.000198, .000199, -.000199, .000199, -.000199, .000199, -.000199, .000199, -.000199, .000199, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.0002, .0002, -.000199, .000199, -.000199, .000199, -.000199, .000199, -.000199, .000199, -.000199, .000198, -.000198, .000198, -.000198, .000198, -.000198, .000197, -.000197, .000197, -.000197, .000197, -.000196, .000196, -.000196, .000196, -.000196, .000195, -.000195, .000195, -.000195, .000194, -.000194, .000194, -.000193, .000193, -.000193, .000193, -.000192, .000192, -.000192, .000191, -.000191, .000191, -.00019, .00019, -.00019, .000189, -.000189, .000189, -.000188, .000188, -.000188, .000187, -.000187, .000186, -.000186, .000186, -.000185, .000185, -.000184, .000184, -.000183, .000183, -.000183, .000182, -.000182, .000181, -.000181, .00018, -.00018, .000179, -.000179, .000178, -.000178, .000177, -.000177, .000176, -.000176, .000175, -.000175, .000174, -.000174, .000173, -.000173, .000172, -.000171, .000171, -.00017, .00017, -.000169, .000168, -.000168, .000167, -.000167, .000166, -.000165, .000165, -.000164, .000164, -.000163, .000162, -.000162, .000161, -.00016, .00016, -.000159, .000158, -.000158, .000157, -.000156, .000156, -.000155, .000154, -.000153, .000153, -.000152, .000151, -.000151, .00015, -.000149, .000148, -.000148, .000147, -.000146, .000145, -.000145, .000144, -.000143, .000142, -.000142, .000141, -.00014, .000139, -.000138, .000138, -.000137, .000149, -.000148, .000147, -.000146, .000145, -.000144, .000144, -.000143, .000142, -.000141, .00014, -.000139, .000138, -.000137, .000136, -.000135, .000134, -.000133, .000132, -.000131, .00013, -.000129, .000128, -.000127, .000126, -.000125, .000124, -.000123, .000122, -.000121, .00012, -.000119, .000118, -.000117, .000116, -.000115, .000114, -.000113, .000112, -.000111, .00011, -.000108, .000107, -.000106, .000105, -.000104, .000103, -.000102, .000101, -.0001, .000099, -.000098, .000096, -.000095, .000094, -.000093, .000092, -.000091, .00009, -.000089, .000087, -.000086, .000085, -.000084, .000083, -.000082, .00008, -.000079, .000078, -.000077, .000076, -.000075, .000074, -.000072, .000071, -.00007, .000069, -.000068, .000066, -.000065, .000064, -.000063, .000062, -.000061, .000059, -.000058, .000057, -.000056, .000054, -.000053, .000052, -.000051, .00005, -.000048, .000047, -.000046, .000045, -.000043, .000042, -.000041, .00004, -.000039, .000037, -.000036, .000035, -.000034, .000032, -.000031, .00003, -.000029, .000027, -.000026, .000025, -.000024, .000023, -.000021, .00002, -.000019, .000018, -.000016, .000015, -.000014, .000013, -.000011, .00001, -.000009, .000008, -.000006, .000005, -.000004, .000003, -.000001 ] } ],
	[ "buzz2",       { real: [ 0, .126773, .017974, -.018236, -.000572, .018139, -.001907, .002945, -.007326, .005861, .000958, .001293, -.001846, -.002062, .001217, -.000753, .001256, -.001891, -.002088, .001745, -.000204, .000173, -.000884, .002247, -.00241, .002232, .002181, -.003279, .003242, -.00095, -.001026, .002184, -.003085, .002124, -.002152, -.001293, .002599, -.002155, -.002941, .002503, .002728, -.001087, .000901, .001888, -.002741, .002782, -.002764, .001516, -.001023, -.001274, .001432, -.002487, .002618, -.00191, .001318, -.000263, -.001235, .00215, -.002365, .002234, -.000981, .000604, .00032, -.000442, .001822, -.001934, .000528, -.00068, -.000302, .001319, -.00185, .001594, -.001648, .00065, -.000618, -.000763, .000747, -.001512, .001385, -.001188, .000802, .000728, -.000843, .001206, -.001445, .001227, -.001186, -.000298, -.000425, -.001364, .000437, -.00135, .001139, -.000642, -.000374, .000923, -.001139, .000224, -.001272, .001266, -.000643, .000204, -.000017, -.001054, -.001249, -.001247, .001118, -.000955, -.001001, .000121, -.001124, .000892, -.00105, -.000692, .001116, -.000923, -.000601, -.001035, .000094, -.000626, .000494, -.000222, -.000828, .000203, -.001105, -.000212, -.001105, -.00089, -.001009, -.00097, -.001022, -.001044, -.001018, -.001014, -.000921, -.000681, -.001038, -.000811, -.001011, -.000766, -.000843, -.00102, -.00062, -.000869, -.001005, -.001001, -.000934, -.000999, -.000986, -.000806, -.000909, -.000986, -.000946, -.000979, -.000912, -.000751, -.000971, -.000805, -.000872, -.000801, -.000869, -.000789, -.000867, -.000866, -.000822, -.000785, -.000851, -.000853, -.000853, -.00082, -.000745, -.000841, -.000843, -.000801, -.000799, -.000835, -.000834, -.00079, -.000815, -.000764, -.000795, -.000708, -.000787, -.000818, -.000806, -.000742, -.000808, -.000783, -.000745, -.000766, -.000766, -.00064, -.000769, -.000747, -.000741, -.000766, -.000744, -.000747, -.000759, -.00076, -.000749, -.000698, -.000736, -.000753, -.000742, -.000743, -.000747, -.00074, -.000716, -.000739, -.00074, -.000731, -.000723, -.000717, -.000716, -.000693, -.000679, -.000631, -.000604, -.000564, -.000485, -.000444, -.000345, -.000282, -.000179, -.00009, .000013, .000107, .000182, .000272, .000354, .000428, .000479, .00053, .00058, .000613, .00063, .000645, .000622, .000631, .000629, .000627, .000632, .000634, .000626, .00062, .000625, .000627, .000617, .00061, .000617, .00062, .000609, .000602, .000611, .000614, .000602, .000595, .000605, .000609, .000596, .000588, .000599, .000604, .00059, .000581, .000594, .0006, .000585, .000575, .000589, .000595, .000579, .00057, .000585, .000591, .000574, .000565, .000581, .000587, .00057, .00056, .000576, .000583, .000566, .000555, .000572, .000579, .000562, .000551, .000569, .000576, .000558, .000547, .000565, .000572, .000554, .000543, .000561, .000569, .00055, .000539, .000558, .000566, .000547, .000536, .000555, .000562, .000543, .000532, .000551, .000559, .00054, .000529, .000548, .000556, .000537, .000525, .000545, .000553, .000534, .000522, .000542, .00055, .000531, .000519, .000539, .000547, .000528, .000516, .000536, .000544, .000525, .000513, .000533, .000541, .000522, .00051, .000531, .000539, .00052, .000508, .000528, .000536, .000517, .000505, .000525, .000533, .000514, .000502, .000522, .00053, .000512, .0005, .00052, .000528, .000509, .000497, .000517, .000525, .000507, .000495, .000514, .000522, .000504, .000492, .000512, .00052, .000502, .00049, .00051, .000518, .000499, .000487, .000507, .000515, .000497, .000485, .000505, .000512, .000495, .000483, .000502, .00051, .000493, .000481, .0005, .000508, .000491, .000478, .000498, .000505, .000488, .000476, .000495, .000503, .000486, .000474, .000493, .000501, .000484, .000472, .000491, .000498, .000482, .00047, .000489, .000496, .00048, .000468, .000487, .000494, .000479, .000466, .000485, .000492, .000476, .000463, .000482, .00049, .000474, .000462, .00048, .000488, .000472, .00046, .000478, .000485, .00047, .000458, .000476, .000483, .000468, .000456, .000474, .000481, .000467, .000455, .000472, .000479, .000465, .000452, .000471, .000477, .000463, .000451, .000468, .000475, .000461, .000449, .000467, .000473, .000459, .000447, .000465, .000471, .000458, .000446, .000463, .000469, .000456, .000444, .000461, .000467, .000454, .000442, .000459, .000465, .000452, .000441, .000457, .000464, .000451, .00044, .000456, .000462, .000449, .000438, .000454, .00046, .000447, .000435, .000452, .000458, .000446, .000434, .00045, .000456, .000445, .000433, .000449, .000455, .000443, .000434, .000447, .000453, .000441, .000429, .000449, .000445, .000441, .000423, .000458, .000468, .000468, .000455, .000469, .000476, .000464, .000452, .000468, .000474, .000462, .000449, .000466, .000473, .000462, .000448, .000465, .00047, .000459, .000447, .000464, .000469, .000457, .000446, .000462, .000467, .000456, .000444, .00046, .000466, .000454, .000442, .000458, .000464, .000453, .000441, .000457, .000462, .000451, .00044, .000455, .00046, .00045, .000439, .000454, .000459, .000448, .000436, .000452, .000457, .000447, .000436, .00045, .000456, .000445, .000434, .000449, .000454, .000444, .000432, .000448, .000452, .000443, .00043, .000446, .000451, .000441, .000429, .000444, .000449, .00044, .000429, .000443, .000448, .000438, .000427, .000442, .000446, .000437, .000425, .00044, .000445, .000436, .000424, .000438, .000443, .000435, .000423, .000436, .000442, .000433, .000421, .000436, .00044, .000431, .00042, .000435, .000439, .00043, .000418, .000434, .000438, .000429, .000417, .000432, .000436, .000428, .000417, .00043, .000435, .000427, .000416, .000429, .000433, .000425, .000414, .000428, .000432, .000424, .000413, .000427, .000431, .000422, .000411, .000426, .000429, .000422, .00041, .000424, .000428, .00042, .00041, .000423, .000427, .000419, .000409, .000421, .000425, .000418, .000406, .00042, .000424, .000417, .000406, .000419, .000423, .000415, .000405, .000418, .000421, .000414, .000404, .000416, .00042, .000413, .000402, .000415, .000419, .000412, .000403, .000414, .000418, .00041, .000401, .000426, .000429, .000422, .000411, .000425, .000428, .000421, .000411, .000423, .000427, .00042, .00041, .000422, .000425, .000419, .000408, .000421, .000424, .000418, .000408, .00042, .000423, .000417, .000407, .000419, .000422, .000415, .000405, .000418, .000421, .000414, .000403, .000416, .000419, .000414, .000403, .000415, .000418, .000412, .000402, .000414, .000417, .000411, .000401, .000413, .000416, .00041, .0004, .000412, .000415, .000409, .000399, .000411, .000414, .000408, .000399, .00041, .000412, .000407, .000398, .000409, .000411, .000406, .000396, .000407, .00041, .000405, .000395, .000407, .000409, .000404, .000395, .000406, .000408, .000403, .000393, .000404, .000407, .000402, .000391, .000404, .000406, .000401, .00039, .000402, .000405, .000399, .000391, .000401, .000404, .000399, .000389, .0004, .000403, .000398, .000389, .000399, .000401, .000396, .000387, .000398, .0004, .000396, .000386, .000397, .000399, .000395, .000386, .000396, .000398, .000394, .000384, .000395, .000397, .000393, .000384, .000394, .000396, .000392, .000383, .000393, .000395, .000391, .000382, .000393, .000394, .00039, .000381, .000391, .000393, .000389, .00038, .00039, .000392, .000388, .000379, .00039, .000391, .000387, .000379, .000389, .00039, .000386, .000378, .000388, .000389, .000386, .000376, .000387, .000388, .000385, .000376, .000386, .000388, .000384, .000374, .000385, .000387, .000384, .000374, .000384, .000386, .000382, .000374, .000383, .000385, .000381, .00037, .000382, .000384, .00038, .000371, .000381, .000383, .000379, .000371, .00038, .000382, .000378, .00037, .00038, .000381, .000378, .000369, .000379, .00038, .000377, .000368, .000378, .000379, .000376, .000367, .000377, .000378, .000375, .000366, .000376, .000377, .000374, .000366, .000376, .000376, .000374, .000366, .000374, .000376, .000373, .000364, .000373, .000375, .000372, .000362, .000373, .000374, .000372, .000363, .000372, .000373, .00037, .000362, .000371, .000372, .000369, .000361, .00037, .000371, .000368, .000361, .00037, .000371, .000368, .000362, .000368, .00037, .000367, .000359, .000368, .000369, .000366, .000358, .000367, .000368, .000366, .000358, .000366, .000367, .000365, .000359, .000366, .000367, .000365, .000355, .000365, .000366, .000363, .000354, .000364, .000365, .000363, .000353, .000363, .000364, .000362, .000355, .000362, .000363, .000361, .000352, .000362, .000362, .00036, .000353, .000361, .000362, .000359, .000351, .00036, .000361, .000359, .000351, .00036, .00036, .000358, .000351, .000359, .000359, .000357, .000348, .000358, .000359, .000357, .000349, .000357, .000357, .000355, .000349, .000357, .000357, .000356, .000348, .000356, .000356, .000355, .000347, .000355, .000356, .000354, .000346, .000354, .000355, .000352, .000347, .000354, .000354, .000352, .000346, .000353, .000353, .000351, .000344, .000352, .000353, .000351, .000342, .000351, .000351, .00035, .000342, .00035, .000351, .000348, .000343, .00035, .000351, .00034, .000342, .00035, .00035, .000338, .000348, .000348, .000348, .000348, .000341, .000349, .000348, .000347, .000336, .000348, .000347, .000347, .000337, .000347, .000347, .000346, .00034, .000346, .000345, .000345, .00034, .000345, .000346, .000345, .000337, .000345, .000345, .000344, .000337, .000344, .000344, .000343, .000338, .000343, .000343, .000342, .000337, .000343, .000343, .000341, .000334, .000342, .000342, .000341, .000334, .000342, .000342, .000341, .000332, .000341, .000341, .00034, .000332, .00034, .00034, .000338, .000332, .00034, .000339, .000338, .000331, .000339, .000339, .000338, .000332, .000339, .000338, .000338, .000332, .000338, .000338, .000337, .000331, .000337, .000337, .000336, .000329, .000337, .000336, .000336, .00033, .000336, .000336, .000336, .000328, .000335, .000336, .000335, .000328, .000335, .000334, .000334, .000326, .000334, .000334, .000333, .000326, .000334, .000334, .000332, .000326, .000333, .000333, .000332, .000325, .000332, .000333, .000331, .000325, .000332, .000332, .000331, .000345, .000352, .00035, .000352, .000347, .000351, .000351, .000351, .000343, .000351, .00035, .00035, .000344, .00035, .00035, .000349, .000342, .00035, .00035, .000349, .000342, .000349, .000349, .000348, .000341, .000348, .000348, .000348, .000341, .000347, .000347, .000347, .000339, .000347, .000346, .000347, .00034, .000347, .000346, .000345, .000339, .000346, .000345, .000346, .00034, .000345, .000345, .000345, .000338, .000345, .000344, .000344, .000336, .000344, .000344, .000343, .000337, .000344, .000343, .000342, .000336, .000343, .000343, .000342, .000338, .000343, .000342, .000342, .000337, .000342, .000342, .000341, .000334, .000341, .000341, .000341, .000335, .000341, .000341, .00034, .000334, .00034, .000339, .000339, .000333, .000339, .000339, .000339, .000334, .000339, .000339, .000339, .000332, .000338, .000338, .000338, .000332, .000338, .000337, .000337, .000331, .000337, .000337, .000337, .00033, .000337, .000336, .000336, .00033, .000337, .000336, .000336, .00033, .000336, .000335, .000336, .000328, .000336, .000335, .000335, .000329, .000335, .000334, .000334, .00033, .000334, .000334, .000334, .000328, .000334, .000334, .000333, .000327, .000333, .000333, .000333, .000327, .000333, .000332, .000332, .000328, .000332, .000331, .000331, .000325, .000332, .000331, .000331, .000326, .000331, .000329, .000331, .000325, .000331, .00033, .00033, .000324, .00033, .000329, .00033, .000324, .000329, .000328, .000329, .000325, .000328, .000328, .000329, .000323, .000329, .000328, .000328, .000323, .000328, .000327, .000328, .000322, .000328, .000327, .000327, .000321, .000327, .000327, .000327, .000321, .000327, .000326, .000326, .000319, .000326, .000325, .000326, .000321, .000325, .000325, .000325, .000316, .000325, .000324, .000325, .000318, .000325, .000324, .000324, .000319, .000324, .000323, .000324, .00032, .000324, .000322, .000323, .000318, .000323, .000322, .000323, .000318, .000323, .000322, .000322, .000316, .000322, .000321, .000322, .000317, .000322, .000321, .000322, .000315, .000321, .00032, .000321, .000317, .000321, .00032, .000321, .000315, .000321, .000319, .00032, .000314, .00032, .000319, .000319, .000312, .000319, .000318, .000319, .000314, .000319, .000317, .000319, .000311, .000319, .000317, .000318, .000314, .000318, .000318, .000318, .000312, .000318, .000316, .000317, .000332, .000337, .000336, .000337, .000329, .000337, .000336, .000336, .000331, .000336, .000334, .000336, .00033, .000336, .000334, .000335, .000329, .000335, .000334, .000335, .00033, .000335, .000333, .000334, .00033, .000335, .000332, .000334, .000328, .000334, .000332, .000333, .00033, .000334, .000333, .000333, .000329, .000333, .000331, .000333, .000326, .000333, .000331, .000332, .000325, .000332, .000331, .000331, .000327, .000331, .00033, .000331, .000326, .000331, .000329, .000331, .000325, .00033, .00033, .000331, .000323, .00033, .000329, .00033, .000325, .00033, .000328, .000329, .000324, .000329, .000328, .000329, .000325, .000329, .000328, .000329, .000323, .000329, .000327, .000327, .000323, .000328, .000326, .000328, .000321, .000328, .000326, .000327, .000323, .000327, .000325, .000327, .000324, .000327, .000325, .000326, .000323, .000326, .000325, .000326, .000321, .000326, .000324, .000325, .000321, .000325, .000324, .000325, .00032, .000325, .000324, .000324, .000319, .000325, .000323, .000324, .00032, .000324, .000321, .000324, .000314, .000324, .000323, .000308, .000305, .000323, .000322, .000323, .000319, .000323, .000321, .000323, .000319, .000323, .00032, .000322, .000316, .000322, .00032, .000322, .000317, .000322, .000321, .000321, .000316, .000321, .00032, .000321, .000315, .000321, .000318, .00032, .000315, .000319, .000314, .00032, .00032, .000319, .000317, .00032, .000313, .00032, .000318, .000319, .000316, .000319, .000317, .000319, .000314, .000318, .000316, .000319, .000314, .000318, .000316, .000318, .000314, .000318, .000315, .000318, .000345, .000348, .000345, .000348, .000342, .000348, .000346, .000347, .000342, .000347, .000346, .000347, .000341, .000347, .000345, .000346, .000344, .000346, .000344, .000346, .000341, .000346, .000342, .000346, .000341, .000345, .000344, .000344, .000344, .000344, .000344, .000343, .000342, .000345, .000342, .000344, .00034, .000344, .000342, .000344, .00034, .000344, .000342, .000344, .000338, .000343, .000341, .000342, .000337, .000343, .000341, .000343, .000338, .000343, .000341, .000342, .000337, .000342, .000339, .000342, .000337, .000342, .000339, .000341, .000336, .000341, .000339, .000341, .000336, .000341, .000336, .00034, .000333, .00034, .000339, .00034, .000335, .00034, .000338, .000339, .000337, .000339, .000337, .000339, .000335, .000339, .000337, .000339, .000333, .000339, .000335, .000338, .000335, .000339, .000337, .000338, .000334, .000338, .000336, .000338, .000333, .000337, .000335, .000337, .000335, .000337, .000336, .000337, .000332, .000337, .000333, .000337, .000332, .000336, .000335, .000336, .000328, .000336, .000334, .000335, .00033, .000336, .000333, .000335, .00033, .000335, .000332, .000335, .000332, .000335, .000332, .000335, .00033, .000334, .000333, .000334, .000327, .000334, .000332, .000334, .000329, .000334, .000331, .000333, .000329, .000333, .00033, .000333, .000329, .000333, .000331, .000333, .000328, .000333, .00033, .000332, .000327, .000332, .00033, .000332, .000327, .000332, .000329, .000331, .000328, .000331, .000331, .000331, .000326, .000331, .000329, .000331, .000326, .000331, .000329, .00033, .000326, .00033, .000329, .00033, .000325, .00033, .000326, .00033, .000325, .000329, .000328, .000329, .000326, .000329, .000325, .000329, .000325, .000329, .000325, .000329, .000323, .000328, .000325, .000328, .000324, .000328, .000324, .000328, .000325, .000328, .000325, .000327, .000322, .000327, .000325, .000327, .000323, .000327, .000324, .000327, .000321, .000326, .000324, .000326, .000322, .000326, .000325, .000326, .00032, .000326, .000323, .000326, .000321, .000325, .000318, .000379, .000376, .000379, .000375, .000379, .000373, .000379, .000375, .000378, .000373, .000378, .000375, .000378, .000373, .000378, .000376, .000377, .000373, .000377, .000374, .000377, .000374, .000377, .000372, .000377, .000372, .000376, .000373, .000376, .000372, .000376, .000374, .000376, .000369, .000376, .000371, .000375, .000371, .000375, .000372, .000375, .000369, .000375, .000371, .000375, .00037, .000374, .000372, .000374, .000372, .000374, .00037, .000374, .000368, .000374, .000371, .000373, .000369, .000373, .00037, .000373, .000368, .000373, .000369, .000373, .000366, .000372, .000369, .000372, .000368, .000372, .000367, .000372, .000366, .000372, .000369, .000371, .000368, .000371, .000367, .000371, .000367, .000371, .000368, .000371, .000366, .00037, .000367, .00037, .000366, .00037, .000365, .00037, .000365, .00037, .000367, .000369, .000362, .000369, .000367, .000369, .000364, .000369, .000364, .000369, .000364, .000369, .000366, .000368, .000364, .000368, .000366, .000368, .000362, .000368, .000365, .000368, .000364, .000367, .000365, .000367, .000361, .000367, .000357, .000367, .000362, .000367, .000366, .000366, .000362, .000366, .000364, .000366, .000362, .000366, .000361, .000365, .000363, .000365, .000362, .000365, .000362, .000365, .00036, .000365, .00036, .000365, .000361, .000364, .00036, .000364, .00036, .000364, .000358, .000364, .000361, .000364, .000359, .000363, .000357, .000363, .000361, .000363, .000361, .000363, .00036, .000363, .000407, .00041, .000403, .00041, .000406, .00041, .000404, .000409, .000407, .000409, .000405, .000409, .000405, .000409, .000403, .000409, .000402, .000408, .000404, .000408, .000404, .000408, .000402, .000408, .000406, .000408, .000404, .000407, .000403, .000407, .000404, .000407, .000402, .000406, .000402, .000406, .000402, .000406, .000402, .000406, .000402, .000405, .000399, .000404, .000397, .000406, .000394, .000404, .000393, .000405, .000398, .000405, .000366, .000369, .000364, .000369, .000366, .000369, .000367, .000369, .000365, .000368, .000364, .000368, .000366, .000368, .000364, .000368, .000363, .000368, .000363, .000367, .000364, .000367, .000363, .000367, .000364, .000367, .000364, .000367, .000363, .000367, .000362, .000366, .000363, .000366, .000362, .000366, .000365 ],  imag: [ 0, -.049064, -.06626, .053048, -.003642, .016123, -.016702, -.003665, .002182, .00251, .003818, -.002636, .001435, -.001056, .001955, .002094, -.00175, .000892, -.000171, .001398, .002456, .003367, -.003502, .003155, .002928, -.002971, .001835, -.000748, -.00063, .003104, -.003022, .002255, -.000799, -.00231, .00222, -.002864, .001688, -.002168, -.000668, .001613, -.001096, .002791, -.002819, .002233, -.000921, .00066, .000596, -.002351, .002573, -.002426, .002304, -.001014, .000473, .001579, -.002072, .002419, -.002071, .001044, -.000144, -.000728, .002113, -.00223, .002269, -.00223, .001087, .000831, -.002021, .001959, -.002036, .001317, -.000024, .000914, .000784, -.001691, .001415, -.00133, .001328, -.000073, -.000587, .000906, -.00125, .001284, -.0012, .000819, .00011, -.000668, .000722, -.001349, .001306, .000069, .001286, -.000006, -.000712, .001172, -.001275, .000947, -.000657, .001289, -.000277, .000272, .001117, -.001266, .001276, -.000708, -.000189, -.000164, -.000563, .0008, -.000732, .001228, .000497, -.000837, .000616, -.000995, .00046, -.000769, .001035, .000591, .001183, .001002, .001068, .001151, -.000822, .001144, .000343, -.001133, .000311, .000718, .000361, .000445, -.000294, .000181, .000278, .000278, -.000499, .000791, .000053, .000644, .000206, -.000686, .000582, -.000056, -.000807, -.000522, -.000101, -.000112, -.000368, -.000054, -.000145, .000581, .000392, -.000041, .00027, -.000042, .00035, -.00062, -.000022, .000363, .000114, .000356, -.000094, .00037, .000061, .000005, .000265, -.000353, -.000116, .000066, .000004, .000226, .000406, .000089, .000016, .000257, .000256, .000045, .000015, .00026, .000154, .000316, .00022, .000418, .000231, -.000003, .000127, .000334, .000072, .000041, .000238, .000149, .000139, .000439, .000094, .000198, .000212, .000066, .000186, .000163, .000073, .000036, .00012, .000292, .00017, .00001, .000115, .000099, -.000037, -.000093, .000204, .000064, .000009, .000106, .000144, .000163, .000158, .000234, .000268, .000363, .000404, .000455, .000537, .000569, .000632, .000661, .000694, .00071, .000714, .000704, .000687, .000655, .000613, .000562, .000517, .000462, .000395, .000338, .000302, .000266, .000203, .000168, .000169, .000171, .000146, .000132, .000159, .000177, .000154, .00014, .000173, .000192, .000163, .000146, .000182, .000201, .000168, .00015, .000188, .000207, .000171, .00015, .000192, .000213, .000173, .00015, .000195, .000216, .000174, .000149, .000197, .000219, .000174, .000148, .000198, .000221, .000173, .000146, .000198, .000222, .000172, .000144, .000198, .000222, .000171, .000142, .000198, .000222, .00017, .000139, .000197, .000221, .000168, .000137, .000196, .000221, .000166, .000135, .000194, .000221, .000164, .000132, .000193, .000219, .000162, .000129, .000191, .000218, .00016, .000126, .000189, .000217, .000158, .000123, .000188, .000215, .000156, .00012, .000186, .000214, .000154, .000117, .000184, .000212, .000152, .000114, .000182, .00021, .00015, .000112, .00018, .000208, .000147, .00011, .000178, .000207, .000146, .000106, .000175, .000206, .000143, .000104, .000174, .000204, .000141, .000102, .000171, .000202, .000138, .000099, .000169, .0002, .000136, .000098, .000167, .000199, .000135, .000095, .000166, .000197, .000133, .000093, .000163, .000195, .000131, .00009, .000161, .000193, .000129, .000087, .000159, .000192, .000127, .000085, .000158, .00019, .000125, .000083, .000155, .000189, .000123, .000082, .000153, .000186, .000121, .000081, .000151, .000185, .000119, .000078, .000149, .000183, .000117, .000076, .000148, .000182, .000116, .000072, .000146, .000179, .000115, .000072, .000143, .000177, .000113, .00007, .000142, .000176, .000111, .000067, .000139, .000175, .000111, .000063, .000135, .000173, .000109, .000066, .000137, .000173, .000107, .000063, .000136, .000171, .000106, .00006, .000133, .000169, .000104, .00006, .000132, .000168, .000104, .000057, .000131, .000166, .000101, .000057, .000128, .000164, .000099, .000055, .000126, .000164, .000098, .000053, .000125, .000162, .000098, .000052, .000123, .000161, .000096, .000049, .000122, .000159, .000094, .000048, .00012, .000156, .000093, .000047, .000119, .000156, .000091, .000046, .000119, .000156, .000091, .000046, .000117, .000152, .000091, .000043, .000114, .00015, .000088, .00004, .000115, .00015, .000087, .000039, .000114, .000152, .000085, .000038, .00011, .00015, .000088, .000038, .000108, .000145, .000085, .000037, .000106, .000138, .000082, .000031, .000106, .000148, .000056, .000082, .0001, .000158, .000144, .000101, .0001, .000147, .000089, .000037, .000112, .000152, .000086, .000033, .000109, .000153, .000087, .00003, .000101, .000151, .000081, .000035, .000107, .000147, .000078, .000031, .000106, .000146, .000078, .00003, .000103, .000144, .000081, .000029, .000104, .000146, .000078, .000027, .000102, .000142, .000076, .000027, .000101, .000142, .000078, .00003, .000101, .00014, .000076, .000026, .000099, .000143, .000076, .000025, .000098, .000138, .000076, .000024, .000098, .000139, .000074, .000026, .000096, .00014, .000072, .000024, .000093, .000139, .000071, .000019, .000093, .000138, .000073, .000021, .000092, .000133, .000071, .000024, .000092, .000133, .00007, .000018, .000091, .000134, .000069, .000023, .00009, .000133, .00007, .000016, .000087, .000131, .000078, .00002, .000088, .000133, .000066, .000016, .000089, .00013, .000065, .000015, .000088, .000132, .000063, .000014, .000085, .00013, .000064, .000017, .000084, .000127, .000066, .000013, .000083, .000125, .000063, .000009, .000082, .000125, .000061, .000011, .00008, .000125, .000061, .000011, .000083, .000126, .00006, .000014, .000079, .000124, .000061, .000011, .00008, .000121, .00006, .000011, .000079, .000119, .000062, .000014, .000077, .000126, .000058, .000005, .000076, .00012, .000058, .000008, .000078, .000119, .000056, .000009, .000075, .000117, .000059, .000008, .000075, .000119, .000057, .000009, .000074, .000113, .000057, .000003, .000076, .000113, .000056, .000006, .000075, .00012, .000056, .000007, .000074, .000117, .000058, .000007, .000073, .000118, .000058, .000015, .00007, .000119, .000054, .000003, .000072, .000114, .000053, .000001, .000069, .000114, .000052, .000004, .000073, .000114, .000052, .000005, .00007, .000117, .000052, .000002, .000067, .000115, .000054, .000004, .000067, .000114, .000051, .000003, .00007, .000114, .000048, -.000003, .000067, .000112, .000052, -.000003, .000065, .00011, .000049, -.000002, .000063, .000108, .000049, -.000001, .000066, .000107, .000047, -.000002, .000066, .000108, .000051, -.000001, .000066, .00011, .000046, -.000005, .00006, .000104, .000044, -.000003, .000063, .000108, .000047, -.000005, .000062, .00011, .000044, 0, .000061, .000109, .000047, -.000003, .000063, .000103, .000047, -.000005, .000058, .000105, .000045, -.000005, .000058, .000102, .000045, -.000004, .000061, .000105, .000044, -.000003, .000058, .000104, .000047, -.000001, .00006, .000102, .000043, -.000009, .000058, .000105, .000045, -.000005, .000056, .000099, .000044, -.000005, .000056, .0001, .000044, -.000008, .000053, .000101, .00004, -.000007, .000054, .0001, .000044, -.000006, .000054, .000101, .000041, -.000012, .000056, .000099, .000039, -.000007, .000056, .000096, .000041, -.000012, .000055, .000098, .000041, -.000009, .000053, .0001, .000037, -.000009, .000051, .000096, .000039, -.000006, .000051, .000099, .000039, -.000009, .000045, .000096, .000039, -.000005, .00005, .000094, .000041, -.000012, .000052, .000103, .000038, -.000015, .00005, .000097, .000037, -.000016, .000053, .000094, .000038, -.00001, .000051, .000095, .000037, -.000009, .000047, .000092, .000038, -.000013, .000049, .000092, .000033, -.000016, .000049, .000093, .000039, -.000011, .00005, .000093, .000037, -.000011, .000049, .00009, .000033, -.000015, .000047, .000089, .000035, -.000014, .000046, .000092, .000037, -.000014, .000044, .000094, .000032, -.000013, .000041, .00009, .000037, -.000019, .000046, .000089, .000034, -.000014, .00005, .000088, .000036, -.000015, .000048, .000085, .000031, 0, .000043, .000079, .000036, -.000016, .000042, .000087, .000033, -.000013, .000044, .000088, .000032, -.000015, .000039, .000087, .000032, -.000022, .000039, .000079, .000031, -.000009, .000037, .000089, .000032, -.000017, .000048, .00009, .000033, -.000012, .000041, .000091, .000034, .000003, .000043, .000082, .000037, -.000008, .000044, .00009, .000031, -.000016, .000046, .000083, .000032, -.000016, .000043, .000087, .000029, -.000023, .000039, .000086, .000027, -.000014, .00004, .00008, .00003, -.00002, .000042, .000091, .000031, -.000014, .000037, .000082, .000032, -.000026, .000043, .000081, .000028, -.000016, .000033, .00008, .000031, -.000019, .000032, .000081, .000031, -.000012, .00004, .000083, .00003, -.00002, .000045, .000073, .000027, -.000024, .000037, .000075, .000031, -.000024, .000041, .00008, .000026, -.000017, .000037, .000087, .000029, -.000028, .000041, .000083, .00004, -.000022, .000052, .000077, .000028, -.000005, .000085, .000077, .000017, .000019, .000092, .000038, .000034, -.000031, .000035, .000073, .000018, -.000018, .000035, .000093, .00002, -.000025, .000028, .000086, .000025, -.000022, .000025, .00007, .000031, -.000038, .000032, .000068, .00003, -.000018, .000029, .000079, .000025, -.000025, .00003, .000073, .000021, -.000018, .000037, .000068, .000025, -.000023, .000037, .00007, .000026, -.000022, .000037, .00008, .000024, -.000021, .000033, .000076, .000021, -.000023, .00003, .000081, .000025, -.000013, .000033, .000078, .000023, -.000021, .00004, .000075, .000025, -.000027, .000036, .000077, .000026, -.000027, .000036, .00007, .00002, -.000022, .000029, .000069, .000024, -.000018, .000033, .000071, .000021, -.000028, .00003, .000075, .000022, -.000027, .00003, .000066, .000021, -.000009, .000025, .000073, .000027, .000004, .000024, .00007, .000021, -.000025, .000032, .000078, .000027, -.000023, .000032, .000075, .000022, -.000018, .000034, .00007, .000022, -.000021, .000026, .000075, .000021, -.000016, .000032, .000071, .000019, -.000023, .000026, .000075, .000021, -.000043, .000026, .000062, .000025, -.000025, .000024, .000078, .000027, -.000028, .000032, .000073, .000023, -.000024, .000034, .000079, .000024, -.000021, .00003, .000072, .000023, -.000026, .000033, .000077, .000022, -.00003, .000029, .000074, .000028, -.000027, .000032, .000078, .000021, -.000037, .000027, .000071, .000015, -.000027, .000033, .000072, .000018, -.000031, .000023, .000067, .000024, -.000031, .000025, .000073, .000021, -.000027, .000031, .000078, .000023, -.000024, .000032, .00007, .000022, -.00003, .000036, .000076, .000017, -.000017, .000034, .000063, .000018, -.000028, .000026, .000062, .00002, -.000024, .000027, .000075, .000024, -.000027, .000026, .000067, .000023, -.000024, .000031, .000068, .00002, -.000031, .000031, .000071, .000026, -.000027, .00003, .000063, .000017, -.000027, .000026, .00007, .000024, -.000032, .000022, .000066, .000018, -.000028, .000027, .000071, .000023, -.000026, .000024, .000072, .000018, -.000032, .000025, .000067, .000019, -.000029, .000029, .000067, .000016, -.000033, .00002, .000073, .000015, -.000029, .000028, .000068, .000021, -.000029, .000028, .000057, .000019, -.000022, .000026, .000063, .000016, -.000022, .00002, .000068, .000015, -.000022, .000021, .000066, .000019, -.000023, .000023, .000058, .000019, -.000028, .000027, .00007, .000019, -.000021, .00002, .000062, .000016, -.000039, .000021, .000063, .000017, -.000022, .000027, .000069, .000015, -.000027, .000022, .000064, .000022, -.000032, .000023, .000056, .000037, -.000028, .000017, .000065, .00001, -.00003, .000018, .000062, .000014, -.00003, .000023, .000066, .00002, -.000025, .000021, .000066, .000009, -.000023, .000022, .000064, .000014, -.000026, .000022, .00007, .000017, -.000026, .000021, .000061, .000022, -.00003, .000025, .000078, .00001, -.000029, .000018, .000066, .000015, -.000026, .000019, .000062, .000018, -.00003, .000022, .000053, .000009, -.000033, .000017, .000059, .000014, -.000032, .000019, .000059, .000016, -.000028, .000021, .000068, .000015, -.000035, .000018, .00006, .000019, -.000028, .000017, .000067, .000018, -.000033, .000025, .000055, .000013, -.000031, .000016, .000064, .000013, -.000028, .000015, .000063, .000014, -.000027, .000025, .00007, .000015, -.000032, .000024, .000057, .000013, -.000039, .00002, .00007, .000013, -.000032, .000017, .000056, .000015, -.000021, .000021, .000063, .000016, -.000032, .000027, .000065, .000016, -.000029, .000014, .000072, .000014, -.000028, .00002, .000061, .000012, -.000038, .000021, .000065, .000014, -.000035, .000021, .000065, .00002, -.000029, .000017, .000061, .00001, -.000035, .000022, .000059, .000008, -.000044, .000013, .000064, .000016, -.000038, .000028, .000054, .000003, -.000023, .000023, .000052, .000018, -.000037, .000017, .000067, .000009, -.000035, .000015, .000071, .000016, -.000034, .000023, .000058, .000018, -.000033, .000017, .000059, .000013, -.000038, .000012, .000062, .000019, -.000029, .000012, .000069, .000008, -.000031, .000019, .000058, .000016, -.000039, .000024, .000059, .000017, -.000031, .000017, .000056, .000011, -.000032, .000016, .000063, .00001, -.000036, .000029, .000057, .000012, -.000042, .000018, .000069, .000013, -.000037, .000013, .000056, .000009, -.000036, .000011, .000045, .000014, -.00003, .000014, .000048, .000013, -.00003, .000012, .000058, .000004, -.000039, .000023, .000054, .000014, -.00003, .000018, .000059, .00001, -.000027, .000019, .00006, .000005, -.000035, .00001, .000055, .000006, -.000042, -.000006, .000081, -.000001, -.000019, .0001, .000108, -.000019, -.000034, .000015, .000054, .000013, -.000035, .000011, .000052, .000006, -.000039, .000022, .000064, .000014, -.00004, .000013, .000053, .000008, -.000024, .000016, .000059, .00001, -.000032, .000014, .00006, .000011, -.000042, .000019, .000059, .000029, -.000065, .000012, .000012, .000021, -.000043, .000014, .000064, .000007, -.000032, .000019, .000048, .000003, -.000034, .000007, .000058, .000021, -.000039, .000009, .000054, .000008, -.000037, .000011, .000053, .00001, -.000041, .000008, .000048, .000013, -.000045, .000006, .000064, .000003, -.000038, .000018, .000062, .000014, -.000029, .000014, .000065, .000014, -.000037, .000015, .000045, .00001, -.00004, .000005, .000059, 0, -.000051, .000013, .000058, .000014, -.000036, .000033, .000027, -.000025, -.000027, .000041, .000045, .00001, -.000041, .000014, .000055, .00001, -.000037, .000009, .000053, .000006, -.000034, .000004, .000062, .000008, -.000043, .000026, .000065, .000009, -.000041, .000011, .000055, .000011, -.000035, .000014, .000058, .000008, -.000047, .00001, .000056, .000005, -.000041, .000013, .000061, .000004, -.00004, .000013, .000056, .000017, -.000055, .000018, .000073, .000014, -.000035, .000011, .000059, .000003, -.000038, .000018, .000047, .000017, -.000042, .000015, .000056, -.000002, -.000037, .000005, .000063, .00001, -.000052, .000019, .000047, .000001, -.000029, -.000002, .000056, .000009, -.000036, .000009, .000059, .000012, -.000043, .000006, .000039, .000004, -.000032, .000007, .000058, .000001, -.000052, .000009, .000054, .000007, -.000031, .000007, .000072, .000006, -.000036, .000022, .000064, .000006, -.000043, .000011, .00006, .000011, -.000043, .00001, .000048, .000008, -.000043, .000007, .000054, .000005, -.000033, .000015, .000068, .000017, -.000034, .000013, .000057, .000008, -.000044, .000014, .000051, .000018, -.000044, .000009, .00005, .000014, -.000036, .000011, .000055, .000001, -.000044, .000003, .000056, .000003, -.000033, 0, .000057, .000002, -.000042, .000012, .000049, .000006, -.000022, .000016, .000058, .000008, -.000036, .000012, .000057, .000009, -.000036, .000005, .000056, .000006, -.000027, .000004, .000055, .000007, -.000047, .000009, .000052, .000006, -.000035, .000005, .000049, .000001, -.000051, .000008, .000049, -.000002, -.000049, 0, .000058, .000002, -.000043, .000004, .000055, .000003, -.000049, .000003, .000044, -.000004, -.000038, -.000014, .00006, .000008, -.000041, -.000002, .000049, .000004, -.00004, .000007, .000058, .000007, -.00004, .000012, .000052, .000001, -.000032, .000002, .000059, .000006, -.000044, .000008, .000052, .000001, -.000067, .000012, .000048, 0, -.000057, .000009, .000064, .000005, -.000051, .000017, .000064, .000003, -.000051, -.000003, .00006, .000008, -.000036, .000006, .000057, .000001, -.000048, .000007, .00005, .00001, -.000062, .000011, .000061, .000011, -.000048, .000006, .000054, -.000001, -.00004, -.000002, .000072, -.000001, -.000056, .000009, .000055, -.000005, -.000046, .000004, .000066, -.000003, -.000054, .000003, .000059, .000006, -.00004, .000009, .000042, 0, -.000053, .000012, .000066, .000008, -.000042, .000003, .000058, .000004, -.000047, .000004, .000058, -.000001, -.000055, .000009, .000069, -.000003, -.00005, -.000005, .000052, .000004, -.000059, .000001, .000065, .000005, -.000047, .000002, .000052, .000003, -.000055, .000006, .000052, -.000003, -.000041, .000001, .000057, .000004, -.00005, .000001, .000058, -.000003, -.000058, .000004, .000059, .000008, -.000047, .000008, .000072, .000006, -.000043, -.000002, .000058, 0, -.000057, .000005, .000059, .000002, -.000044, .000003, .000056, .000001, -.00004, .000008, .000063, .000003, -.000044, -.000001, .000052, .000004, -.000045, 0, .000068, -.000003, -.000084, .000001, .000057, -.000002, -.000004, .000001, .000053, -.000006, -.000035, -.000007, .000052, .000005, -.000057, .000017, .000044, -.000004, -.000053, .000003, .000045, .000007, -.000058, .000003, .000056, .000009, -.000054, .000011, .000058, .000002, -.000055, -.000006, .000065, .000009, -.000048, -.000001, .000058, .000009, -.000066, -.000003, .000039, -.000006, -.000041, .000011, .000047, -.000002, -.000049, .000004, .000076, -.000007, -.000057, .000001, .000067, .000009, -.000041, -.000003, .000055, .000005, -.000055, -.000001, .000066, .000001, -.00007, 0, .000059, .000005, -.000057, .000004, .000068, .000006, -.000036, .000004, .000055, -.000015, -.000056, .000009, .000051, -.000009, -.000061, -.000018, .000059, .000013, -.000058, -.000004, .000058, -.000003, -.000059, .000022, .000075, .000041, -.000082, .000002, .000097, .000031, -.000098, -.000003, .000076, 0, -.00005, 0, .000062, .000007, -.000047, .000006, .000031, -.000004, -.000051, .000004, .000054, .000006, -.000038, .000008, .000052, .000002, -.000056, .000001, .000055, 0, -.000052, .000005, .000055, .00001, -.000051, 0, .000047, .000012, -.000049, 0, .000054, -.000009, -.000045, .000012, .000054, 0, -.00003 ] } ],
	[ "dissonance",  { real: [ 0, -.000001, -.001193, .000975, -.225597, .000556, -.000341, .146408, -.000401, .000356, -.082233, .000203, -.000177, .054735, -.000862, .000714, -.054117, .000464, -.000438, .042607, -.000199, .000105, -.04084, .000061, -.00006, .027337, -.000058, .000057, -.033029, .00005, -.000049, .037746, -.000047, .000047, -.040758, .000062, -.001234, .008164, -.008056, .007953, -.007853, .007757, -.007665, .007575, -.007489, .007405, -.007103, .007028, -.006954, .006675, -.006608, .006543, -.00648, .006419, -.00636, .006302, -.005696, .005646, -.005597, .00555, -.005503, .005458, -.005414, .005371, -.005012, .004973, -.004936, .004899, -.004863, .004827, -.004793, .004759, -.004726, .003904, -.003878, .003852, -.003826, .003802, -.003777, .003753, -.00373, .003707, -.003684, .003662, -.003423, .003403, -.003384, .003364, -.003345, .003326, -.003308, .00329, -.003272, .003254, -.003237, .00322, -.003203, .003186, -.003074, .003059, -.003043, .003028, -.003014, .002999, -.002985, .00297, -.002956, .002942, -.002929, .002915, -.002902, .002889, -.002876, .002863, -.002851, .002839, -.002826, .002814, -.002802, .00279, -.002779, .002767, -.002756, .002745, -.002734, .002723, -.002712, .002701, -.002691, .00268, -.00267, .00266, -.00265, .00264, -.00263, .00262, -.00261, .002601, -.002591, .002582, -.002653, .002644, -.002634, .002625, -.002616, .002607, -.002598, .002589, -.00258, .002572, -.002563, .002555, -.002546, .002538, -.00253, .002521, -.002513, .002505, -.002497, .002489, -.002482, .002474, -.002466, .002459, -.002451, .002444, -.002436, .002429, -.002497, .00249, -.002482, .002475, -.002468, .002461, -.002453, .002446, -.002439, .002432, -.002426, .002419, -.002412, .002405, -.002399, .002392, -.002385, .002379, -.002373, .002366, -.00236, .002353, -.002347, .002341, -.002335, .002329, -.002323, .002317, -.002311, .002305, -.002299, .002293, -.002287, .002281, -.002276, .00227, -.002408, .002402, -.002396, .00239, -.002384, .002378, -.002373, .002367, -.002361, .002356, -.00235, .002345, -.002339, .002334, -.002328, .002323, -.002317, .002312, -.002307, .002301, -.002296, .002291, -.002286, .002281, -.002276, .00227, -.002265, .00226, -.002255, .00225, -.002246, .002241, -.002236, .002231, -.002226, .002221, -.002217, .002212, -.002207, .002202, -.002198, .002193, -.002189, .002184, -.00218, .002175, -.00217, .002166, -.002162, .002157, -.002153, .002148, -.002144, .00214, -.002135, .002198, -.002193, .002189, -.002185, .00218, -.002176, .002172, -.002167, .002163, -.002159, .002155, -.002151, .002146, -.002142, .002138, -.002134, .00213, -.002126, .002122, -.002118, .002114, -.00211, .002106, -.002102, .002098, -.002094, .00209, -.002086, .002083, -.002079, .002075, -.002071, .002067, -.002064, .00206, -.002056, .002052, -.002049, .002045, -.002041, .002038, -.002034, .002031, -.002027, .002023, -.00202, .002016, -.002013, .002009, -.002006, .002002, -.001999, .001995, -.001992, .001988, -.001985, .001981, -.001978, .001975, -.001971, .001968, -.001964, .001961, -.001958, .001954, -.001951, .001948, -.001945, .001941, -.001938, .001935, -.001932, .001928, -.001925, .001922, -.001919, .001916, -.001912, .001909, -.001906, .001903, -.0019, .001897, -.001894, .001891, -.001887, .001884, -.001881, .001878, -.001875, .001872, -.001869, .001866, -.001863, .00186, -.001857, .001854, -.001851, .001848, -.001845, .001842, -.001839, .001836, -.001833, .001831, -.001828, .001825, -.001822, .001819, -.001816, .001813, -.00181, .001807, -.001805, .001802, -.001799, .001796, -.001793, .001791, -.001788, .001785, -.001782, .001779, -.001777, .001774, -.001771, .001768, -.001766, .001763, -.00176, .001757, -.001755, .001752, -.001749, .001747, -.001744, .001741, -.001738, .001736, -.001733, .00173, -.001728, .001725, -.001722, .00172, -.001717, .001715, -.001712, .001709, -.001707, .001704, -.001701, .001699, -.001696, .001694, -.001691, .001689, -.001686, .001683, -.001681, .001678, -.001676, .001673, -.001671, .001668, -.001665, .001663, -.00166, .001658, -.001655, .001143, -.001142, .00114, -.001138, .001137, -.001135, .001133, -.001131, .00113, -.001128, .001126, -.001124, .001123, -.001121, .001119, -.001118, .001116, -.001114, .001112, -.001111, .001109, -.001107, .001106, -.001104, .001102, -.001101, .001099, -.001097, .001096, -.001094, .001092, -.001091, .001158, -.001156, .001154, -.001153, .001151, -.001149, .001147, -.001145, .001144, -.001142, .00114, -.001138, .001137, -.001135, .001133, -.001131, .00113, -.001128, .001126, -.001124, .001123, -.001121, .001119, -.001117, .001116, -.001114, .001112, -.00111, .001109, -.001107, .001105, -.001103, .001102, -.0011, .001098, -.001097, .001095, -.001093, .001091, -.00109, .001088, -.001086, .001084, -.001083, .001081, -.001079, .001078, -.001076, .001074, -.001072, .001071, -.001069, .001067, -.001065, .001064, -.001062, .00106, -.001059, .001057, -.001055, .001053, -.001052, .00105, -.001048, .001047, -.001045, .001043, -.001041, .00104, -.001038, .001036, -.001035, .001033, -.001031, .001029, -.001028, .001026, -.001024, .001023, -.001021, .001019, -.001017, .001016, -.001014, .001012, -.001011, .001009, -.001007, .001005, -.001004, .001002, -.001, .000999, -.000997, .000995, -.000993, .000992, -.00099, .000988, -.000987, .000985, -.000983, .000981, -.00098, .000978, -.000976, .000975, -.000973, .000971, -.000969, .000968, -.000966, .000964, -.000962, .000961, -.000959, .000957, -.000956, .000954, -.000952, .00095, -.000949, .000947, -.000945, .000943, -.000942, .00094, -.000938, .000937, -.000935, .000933, -.000931, .00093, -.000928, .000926, -.000924, .000923, -.000921, .000919, -.000917, .000916, -.000914, .000912, -.00091, .000909, -.000907, .000905, -.000903, .000902, -.0009, .000898, -.000896, .000895, -.000814, .000813, -.000811, .000809, -.000808, .000806, -.000805, .000803, -.000801, .0008, -.000798, .000796, -.000795, .000793, -.000792, .00079, -.000788, .000787, -.000785, .000783, -.000782, .00078, -.000778, .000777, -.000775, .000774, -.000772, .00077, -.000769, .000767, -.000765, .000764, -.000762, .00076, -.000759, .000757, -.000755, .000754, -.000752, .00075, -.000749, .000747, -.000745, .000744, -.000742, .00074, -.000739, .000737, -.000735, .000734, -.000732, .00073, -.000729, .000727, -.000725, .000724, -.000722, .00072, -.000719, .000717, -.000715, .000713, -.000712, .00071, -.000708, .000707, -.000705, .000703, -.000702, .0007, -.000698, .000696, -.000695, .000693, -.000691, .000689, -.000688, .000686, -.000684, .000683, -.000681, .000679, -.000677, .000676, -.000674, .000672, -.00067, .000669, -.000667, .000665, -.000663, .000662, -.00066, .000658, -.000656, .000655, -.000653, .000651, -.000649, .000648, -.000646, .000644, -.000642, .00064, -.000639, .000637, -.000635, .000633, -.000632, .00063, -.000628, .000626, -.000624, .000623, -.000621, .000619, -.000617, .000615, -.000614, .000612, -.00061, .000608, -.000606, .000604, -.000603, .000601, -.000599, .000597, -.000595, .000593, -.000592, .00059, -.000588, .000586, -.000584, .000582, -.000581, .000579, -.000577, .000575, -.000573, .000571, -.000569, .000568, -.000566, .000564, -.000562, .00056, -.000558, .000556, -.000554, .000553, -.000551, .000471, -.000469, .000467, -.000466, .000464, -.000463, .000461, -.000459, .000458, -.000456, .000454, -.000453, .000451, -.00045, .000448, -.000446, .000445, -.000443, .000441, -.00044, .000438, -.000436, .000435, -.000433, .000431, -.00043, .000428, -.000426, .000425, -.000423, .000421, -.00042, .000418, -.000416, .000415, -.000413, .000411, -.00041, .000408, -.000406, .000404, -.000403, .000401, -.000399, .000398, -.000396, .000394, -.000393, .000391, -.000389, .000387, -.000386, .000384, -.000382, .000381, -.000379, .000377, -.000375, .000374, -.000372, .00037, -.000369, .000367, -.000365, .000363, -.000362, .00036, -.000358, .000356, -.000355, .000353, -.000351, .000349, -.000348, .000346, -.000344, .000342, -.000341, .000339, -.000337, .000335, -.000333, .000332, -.00033, .000328, -.000326, .000325, -.000323, .000321, -.000319, .000317, -.000316, .000314, -.000312, .00031, -.000308, .000307, -.000305, .000303, -.000301, .000299, -.000298, .000296, -.000294, .000292, -.00029, .000289, -.000287, .000285, -.000283, .000281, -.00028, .000278, -.000276, .000274, -.000272, .00027, -.000269, .000267, -.000265, .000263, -.000261, .000259, -.000258, .000256, -.000254, .000252, -.00025, .000248, -.000246, .000245, -.000243, .000241, -.000239, .000237, -.000235, .000233, -.000232, .00023, -.000228, .000226, -.000224, .000222, -.00022, .000219, -.000217, .000215, -.000213, .000211, -.000209, .000207, -.000205, .000203, -.000202, .0002, -.000198, .000196, -.000194, .000192, -.00019, .000188, -.000186, .000185, -.000183, .000181, -.000179, .000177, -.000175, .000173, -.000171, .000169, -.000167, .000165, -.000164, .000162, -.00016, .000158, -.000156, .000154, -.000152, .00015, -.000148, .000146, -.000144, .000142, -.000141, .000139, -.000137, .000135, -.000133, .000131, -.000129, .000112, -.000111, .000109, -.000107, .000106, -.000104, .000102, -.0001, .000099, -.000097, .000095, -.000093, .000092, -.00009, .000088, -.000087, .000085, -.000083, .000081, -.00008, .000078, -.000076, .000075, -.000073, .000071, -.000069, .000068, -.000066, .000064, -.000062, .000061, -.000059, .000057, -.000056, .000054, -.000052, .00005, -.000049, .000047, -.000045, .000043, -.000042, .00004, -.000038, .000036, -.000035, .000033, -.000031, .00003, -.000028, .000026, -.000024, .000023, -.000021, .000019, -.000017, .000016, -.000014, .000012, -.00001, .000009, -.000007, .000005, -.000003, .000002, 0, -.000002, .000003, -.000005, .000007, -.000009, .00001, -.000012, .000014, -.000016, .000017, -.000019, .000021, -.000023, .000024, -.000026, .000028, -.00003, .000031, -.000033, .000035, -.000036, .000038, -.00004, .000042, -.000043, .000045, -.000047, .000049, -.00005, .000052, -.000054, .000056, -.000057, .000059, -.000061, .000062, -.000064, .000066, -.000068, .000069, -.000071, .000073, -.000075, .000076, -.000078, .00008, -.000081, .000083, -.000085, .000087, -.000088, .00009, -.000092, .000093, -.000095, .000097, -.000099, .0001, -.000102, .000104, -.000105, .000107, -.000109, .000111, -.000112, .000114, -.000116, .000117, -.000119, .000121, -.000122, .000124, -.000126, .000128, -.000129, .000131, -.000133, .000134, -.000136, .000138, -.000139, .000141, -.000143, .000144, -.000146, .000148, -.000149, .000151, -.000153, .000154, -.000156, .000158, -.000159, .000161, -.000163, .000164, -.000166, .000168, -.000169, .000171, -.000173, .000174, -.000176, .000178, -.000179, .000181, -.000183, .000184, -.000186, .000188, -.000189, .000191, -.000192, .000194, -.000196, .000197, -.000199, .000201, -.000202, .000204, -.000205, .000207, -.000209, .00021, -.000212, .000213, -.000215, .000217, -.000218, .00022, -.000221, .000223, -.000224, .000226, -.000228, .000229, -.000231, .000232, -.000201, .000202, -.000203, .000205, -.000206, .000207, -.000209, .00021, -.000211, .000213, -.000214, .000215, -.000217, .000218, -.000219, .00022, -.000222, .000223, -.000224, .000226, -.000227, .000228, -.00023, .000231, -.000232, .000233, -.000235, .000236, -.000237, .000238, -.00024, .000241, -.000242, .000244, -.000245, .000246, -.000247, .000249, -.00025, .000251, -.000252, .000253, -.000255, .000256, -.000257, .000258, -.00026, .000261, -.000262, .000263, -.000264, .000266, -.000267, .000268, -.000269, .00027, -.000272, .000273, -.000274, .000275, -.000276, .000277, -.000279, .00028, -.000281, .000282, -.000283, .000284, -.000285, .000287, -.000288, .000289, -.00029, .000291, -.000292, .000293, -.000294, .000295, -.000297, .000298, -.000299, .0003, -.000301, .000302, -.000303, .000304, -.000305, .000306, -.000307, .000308, -.000309, .000311, -.000312, .000313, -.000314, .000315, -.000316, .000317, -.000318, .000319, -.00032, .000321, -.000322, .000323, -.000324, .000325, -.000326, .000327, -.000328, .000329, -.00033, .000331, -.000331, .000332, -.000333, .000334, -.000335, .000336, -.000337, .000338, -.000339, .00034, -.000341, .000342, -.000343, .000343, -.000344, .000345, -.000346, .000347, -.000348, .000349, -.00035, .00035, -.000351, .000352, -.000353, .000354, -.000355, .000355, -.000356, .000357, -.000358, .000359, -.000359, .00036, -.000361, .000362, -.000363, .000363, -.000364, .000365, -.000366, .000366, -.000367, .000368, -.000368, .000369, -.00037, .000371, -.000371, .000372, -.000373, .000373, -.000374, .000375, -.000375, .000376, -.000377, .000377, -.000378, .000379, -.000379, .00038, -.000381, .000381, -.000382, .000382, -.000383, .000384, -.000384, .000385, -.000385, .000386, -.000387, .000387, -.000388, .000388, -.000389, .000389, -.00039, .00039, -.000391, .000391, -.000392, .000392, -.000393, .000393, -.000394, .000394, -.000395, .000395, -.000396, .000396, -.000396, .000397, -.000397, .000398, -.000398, .000399, -.000399, .000399, -.0004, .0004, -.0004, .000401, -.000401, .000402, -.000402, .000402, -.000403, .000403, -.000403, .000404, -.000404, .000404, -.000404, .000405, -.000405, .000405, -.000406, .000406, -.000406, .000406, -.000406, .000407, -.000407, .000407, -.000407, .000408, -.000408, .000408, -.000408, .000408, -.000291, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000293, .000293, -.000293, .000293, -.000293, .000293, -.000293, .000293, -.000293, .000293, -.000293, .000293, -.000293, .000293, -.000293, .000293, -.000293, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000292, .000292, -.000291, .000291, -.000291, .000291, -.000291, .000291, -.000291, .00029, -.00029, .00029, -.00029, .00029, -.00029, .000289, -.000289, .000289, -.000289, .000289, -.000288, .000288, -.000288, .000288, -.000288, .000287, -.000287, .000287, -.000287, .000286, -.000286, .000286, -.000286, .000285, -.000285, .000285, -.000284, .000284, -.000284, .000283, -.000283, .000283, -.000282, .000282, -.000282, .000281, -.000281, .000281, -.00028, .00028, -.00028, .000279, -.000279, .000278, -.000278, .000278, -.000277, .000277, -.000276, .000276, -.000276, .000275, -.000275, .000274, -.000274, .000273, -.000273, .000272, -.000272, .000271, -.000271, .00027, -.00027, .000269, -.000269, .000268, -.000268, .000267, -.000267, .000266, -.000266, .000265, -.000265, .000264, -.000263, .000263, -.000262, .000262, -.000261, .000261, -.00026, .000259, -.000259, .000258, -.000258, .000257, -.000256, .000256, -.000255, .000254, -.000254, .000253, -.000252, .000252, -.000251, .00025, -.00025, .000249, -.000248, .000248, -.000247, .000246, -.000245, .000245, -.000244, .000243, -.000243, .000242, -.000241, .00024, -.00024, .000239, -.000238, .000237, -.000236, .000236, -.000235, .000234, -.000233, .000232, -.000232, .000231, -.00023, .000229, -.000228, .000228, -.000227, .000226, -.000225, .000224, -.000223, .000222, -.000222, .000221, -.00022, .000219, -.000218, .000217, -.000216, .000215, -.000214, .000214, -.000213, .000212, -.000211, .00021, -.000209, .000208, -.000207, .000206, -.000205, .000204, -.000203, .000202, -.000201, .0002, -.000199, .000198, -.000197, .000196, -.000195, .000194, -.000193, .000192, -.000191, .00019, -.000189, .000188, -.000187, .000186, -.000185, .000184, -.000183, .000182, -.000181, .00018, -.000179, .000177, -.000176, .000175, -.000174, .000173, -.000172, .000171, -.00017, .000169, -.000168, .000166, -.000165, .000164, -.000163, .000162, -.000161, .00016, -.000159, .000157, -.000156, .000155, -.000154, .000153, -.000152, .00015, -.000149, .000148, -.000147, .000146, -.000144, .000143, -.000142, .000141, -.00014, .000138, -.000137, .000136, -.000135, .000134, -.000132, .000131, -.00013, .000129, -.000127, .000126, -.000125, .000124, -.000122, .000121, -.00012, .000119, -.000117, .000116, -.000115, .000114, -.000112, .000111, -.00011, .000108, -.000107, .000106, -.000105, .000103, -.000102, .000101, -.000099, .000098, -.000097, .000095, -.000094, .000093, -.000092, .00009, -.000089, .000088, -.000086, .000085, -.000084, .000082, -.000081, .00008, -.000078, .000077, -.000076, .000074, -.000073, .000071, -.00007, .000069, -.000067, .000055, -.000054, .000053, -.000052, .00005, -.000049, .000048, -.000047, .000046, -.000045, .000044, -.000042, .000041, -.00004, .000039, -.000038, .000037, -.000036, .000034, -.000033, .000032, -.000031, .00003, -.000029, .000027, -.000026, .000025, -.000024, .000023, -.000022, .000021, -.000019, .000018, -.000017, .000016, -.000015, .000014, -.000012, .000011, -.00001, .000009, -.000008, .000007, -.000005, .000004, -.000003, .000002, -.000001, 0, .000002, -.000003, .000004, -.000005, .000006, -.000007, .000009, -.00001, .000011, -.000012, .000013, -.000014, .000016, -.000017, .000018, -.000019, .00002, -.000021, .000023, -.000024, .000025, -.000026, .000027, -.000028, .000029, -.000031, .000032, -.000033, .000034, -.000035, .000036, -.000038, .000039, -.00004, .000041, -.000042, .000043, -.000044, .000046, -.000047, .000048, -.000049, .00005, -.000051, .000052, -.000054, .000055, -.000056, .000057, -.000058, .000059, -.00006, .000061, -.000062, .000064, -.000065, .000066, -.000067, .000068, -.000069, .00007, -.000071, .000072, -.000074, .000075, -.000076, .000077, -.000078, .000079, -.00008, .000081, -.000082, .000083, -.000084, .000085, -.000087, .000088, -.000089, .00009, -.000091, .000092, -.000093, .000094, -.000095, .000096, -.000097, .000098, -.000099, .0001, -.000101, .000102, -.000103, .000104, -.000105, .000106, -.000107, .000108, -.000109, .00011, -.000111, .000112, -.000113, .000114, -.000115, .000116, -.000117, .000118, -.000119, .00012, -.000121, .000122, -.000123, .000124, -.000125, .000126, -.000127, .000128, -.000129, .000129, -.00013, .000131, -.000132, .000133, -.000134, .000135, -.000136, .000137, -.000138, .000138, -.000139, .00014, -.000141, .000142, -.000143, .000144, -.000144, .000145, -.000146, .000147, -.000148, .000149, -.000149, .00015, -.000151, .000152, -.000153, .000153, -.000154, .000155, -.000156, .000157, -.000157, .000158, -.000159, .00016, -.00016, .000161, -.000162, .000163, -.000163, .000164, -.000165, .000165, -.000166, .000167, -.000168, .000168, -.000169, .00017, -.00017, .000171, -.000172, .000172, -.000173, .000174, -.000174, .000175, -.000175, .000176, -.000177, .000177, -.000178, .000178, -.000179, .00018, -.00018, .000181, -.000181, .000182, -.000182, .000183, -.000184, .000184, -.000185, .000185, -.000186, .000186, -.000187, .000187, -.000188, .000188, -.000189, .000189, -.00019, .00019, -.00019, .000191, -.000191, .000192, -.000192, .000193, -.000193, .000193, -.000194, .000194, -.000195, .000195, -.000195, .000196, -.000196, .000196, -.000197, .000197, -.000197, .000198, -.000198, .000198, -.000199, .000199, -.000199, .000199, -.0002, .0002, -.0002, .0002, -.000201, .000201, -.000201, .000201, -.000201, .000202, -.000202, .000202, -.000202, .000202, -.000203, .000203, -.000203, .000203, -.000203, .000203, -.000203, .000204, -.000204, .000204, -.000204, .000204, -.000204, .000186, -.000186, .000186, -.000186, .000186, -.000186, .000186, -.000186, .000186, -.000186, .000186, -.000186, .000186, -.000186, .000186 ],  imag: [ 0, .670914, 0, 0, -.000005, 0, 0, .000011, 0, 0, -.000012, 0, 0, .000014, 0, 0, -.000021, 0, 0, .000023, 0, 0, -.00003, 0, 0, .000026, 0, 0, -.000039, 0, 0, .000054, 0, 0, -.000071, 0, -.000002, .000017, -.000017, .000018, -.000019, .00002, -.00002, .000021, -.000022, .000022, -.000023, .000023, -.000024, .000024, -.000025, .000025, -.000026, .000027, -.000028, .000029, -.000027, .000027, -.000028, .000029, -.00003, .00003, -.000031, .000032, -.000031, .000031, -.000032, .000033, -.000034, .000034, -.000035, .000036, -.000037, .000031, -.000032, .000032, -.000033, .000034, -.000034, .000035, -.000036, .000036, -.000037, .000038, -.000036, .000037, -.000037, .000038, -.000039, .000039, -.00004, .000041, -.000041, .000042, -.000043, .000044, -.000044, .000045, -.000044, .000045, -.000046, .000046, -.000047, .000048, -.000048, .000049, -.00005, .00005, -.000051, .000052, -.000053, .000053, -.000054, .000055, -.000056, .000056, -.000057, .000058, -.000058, .000059, -.00006, .000061, -.000061, .000062, -.000063, .000064, -.000065, .000065, -.000066, .000067, -.000068, .000068, -.000069, .00007, -.000071, .000072, -.000072, .000073, -.000074, .000075, -.000078, .000079, -.00008, .00008, -.000081, .000082, -.000083, .000084, -.000085, .000086, -.000086, .000087, -.000088, .000089, -.00009, .000091, -.000092, .000093, -.000093, .000094, -.000095, .000096, -.000097, .000098, -.000099, .0001, -.000101, .000102, -.000106, .000107, -.000108, .000108, -.000109, .00011, -.000111, .000112, -.000113, .000114, -.000115, .000116, -.000117, .000118, -.000119, .00012, -.000121, .000122, -.000123, .000124, -.000125, .000126, -.000127, .000128, -.000129, .00013, -.000131, .000132, -.000133, .000134, -.000135, .000136, -.000137, .000138, -.000139, .00014, -.00015, .000151, -.000153, .000154, -.000155, .000156, -.000157, .000158, -.000159, .00016, -.000161, .000163, -.000164, .000165, -.000166, .000167, -.000168, .000169, -.000171, .000172, -.000173, .000174, -.000175, .000176, -.000178, .000179, -.00018, .000181, -.000182, .000183, -.000185, .000186, -.000187, .000188, -.000189, .000191, -.000192, .000193, -.000194, .000195, -.000197, .000198, -.000199, .0002, -.000201, .000203, -.000204, .000205, -.000206, .000207, -.000209, .00021, -.000211, .000212, -.000214, .000222, -.000223, .000224, -.000225, .000227, -.000228, .000229, -.000231, .000232, -.000233, .000234, -.000236, .000237, -.000238, .00024, -.000241, .000242, -.000244, .000245, -.000246, .000248, -.000249, .00025, -.000252, .000253, -.000254, .000256, -.000257, .000258, -.00026, .000261, -.000262, .000264, -.000265, .000266, -.000268, .000269, -.00027, .000272, -.000273, .000275, -.000276, .000277, -.000279, .00028, -.000281, .000283, -.000284, .000286, -.000287, .000288, -.00029, .000291, -.000293, .000294, -.000295, .000297, -.000298, .0003, -.000301, .000302, -.000304, .000305, -.000307, .000308, -.000309, .000311, -.000312, .000314, -.000315, .000317, -.000318, .000319, -.000321, .000322, -.000324, .000325, -.000327, .000328, -.000329, .000331, -.000332, .000334, -.000335, .000337, -.000338, .00034, -.000341, .000343, -.000344, .000345, -.000347, .000348, -.00035, .000351, -.000353, .000354, -.000356, .000357, -.000359, .00036, -.000362, .000363, -.000365, .000366, -.000368, .000369, -.000371, .000372, -.000374, .000375, -.000377, .000378, -.00038, .000381, -.000383, .000384, -.000386, .000387, -.000389, .00039, -.000392, .000393, -.000395, .000396, -.000398, .000399, -.000401, .000402, -.000404, .000405, -.000407, .000408, -.00041, .000411, -.000413, .000415, -.000416, .000418, -.000419, .000421, -.000422, .000424, -.000425, .000427, -.000428, .00043, -.000432, .000433, -.000435, .000436, -.000438, .000439, -.000441, .000442, -.000444, .000446, -.000447, .000449, -.00045, .000452, -.000453, .000455, -.000457, .000458, -.00046, .000461, -.000463, .000464, -.000466, .000323, -.000325, .000326, -.000327, .000328, -.000329, .00033, -.000331, .000332, -.000333, .000334, -.000336, .000337, -.000338, .000339, -.00034, .000341, -.000342, .000343, -.000344, .000346, -.000347, .000348, -.000349, .00035, -.000351, .000352, -.000353, .000354, -.000356, .000357, -.000358, .000382, -.000383, .000384, -.000385, .000386, -.000388, .000389, -.00039, .000391, -.000392, .000393, -.000395, .000396, -.000397, .000398, -.000399, .000401, -.000402, .000403, -.000404, .000405, -.000407, .000408, -.000409, .00041, -.000411, .000413, -.000414, .000415, -.000416, .000417, -.000419, .00042, -.000421, .000422, -.000423, .000425, -.000426, .000427, -.000428, .000429, -.000431, .000432, -.000433, .000434, -.000436, .000437, -.000438, .000439, -.00044, .000442, -.000443, .000444, -.000445, .000446, -.000448, .000449, -.00045, .000451, -.000452, .000454, -.000455, .000456, -.000457, .000458, -.00046, .000461, -.000462, .000463, -.000465, .000466, -.000467, .000468, -.000469, .000471, -.000472, .000473, -.000474, .000475, -.000477, .000478, -.000479, .00048, -.000482, .000483, -.000484, .000485, -.000486, .000488, -.000489, .00049, -.000491, .000492, -.000494, .000495, -.000496, .000497, -.000498, .0005, -.000501, .000502, -.000503, .000505, -.000506, .000507, -.000508, .000509, -.000511, .000512, -.000513, .000514, -.000515, .000517, -.000518, .000519, -.00052, .000521, -.000523, .000524, -.000525, .000526, -.000527, .000529, -.00053, .000531, -.000532, .000533, -.000535, .000536, -.000537, .000538, -.000539, .000541, -.000542, .000543, -.000544, .000545, -.000547, .000548, -.000549, .00055, -.000551, .000553, -.000554, .000555, -.000556, .000557, -.000559, .00056, -.000561, .000562, -.000563, .000564, -.000516, .000517, -.000518, .000519, -.00052, .000521, -.000522, .000523, -.000524, .000526, -.000527, .000528, -.000529, .00053, -.000531, .000532, -.000533, .000534, -.000535, .000536, -.000537, .000538, -.000539, .00054, -.000542, .000543, -.000544, .000545, -.000546, .000547, -.000548, .000549, -.00055, .000551, -.000552, .000553, -.000554, .000555, -.000556, .000557, -.000558, .000559, -.00056, .000561, -.000563, .000564, -.000565, .000566, -.000567, .000568, -.000569, .00057, -.000571, .000572, -.000573, .000574, -.000575, .000576, -.000577, .000578, -.000579, .00058, -.000581, .000582, -.000583, .000584, -.000585, .000586, -.000587, .000588, -.000589, .00059, -.000591, .000592, -.000593, .000594, -.000595, .000596, -.000597, .000598, -.000599, .0006, -.000601, .000602, -.000603, .000604, -.000605, .000606, -.000607, .000608, -.000609, .00061, -.000611, .000612, -.000613, .000614, -.000615, .000615, -.000616, .000617, -.000618, .000619, -.00062, .000621, -.000622, .000623, -.000624, .000625, -.000626, .000627, -.000628, .000629, -.00063, .000631, -.000631, .000632, -.000633, .000634, -.000635, .000636, -.000637, .000638, -.000639, .00064, -.000641, .000641, -.000642, .000643, -.000644, .000645, -.000646, .000647, -.000648, .000649, -.000649, .00065, -.000651, .000652, -.000653, .000654, -.000655, .000655, -.000656, .000657, -.000658, .000659, -.00066, .000661, -.000661, .000662, -.000663, .000664, -.000665, .000571, -.000572, .000572, -.000573, .000574, -.000574, .000575, -.000576, .000577, -.000577, .000578, -.000579, .000579, -.00058, .000581, -.000581, .000582, -.000583, .000583, -.000584, .000585, -.000585, .000586, -.000587, .000587, -.000588, .000589, -.000589, .00059, -.000591, .000591, -.000592, .000592, -.000593, .000594, -.000594, .000595, -.000596, .000596, -.000597, .000597, -.000598, .000599, -.000599, .0006, -.0006, .000601, -.000602, .000602, -.000603, .000603, -.000604, .000604, -.000605, .000606, -.000606, .000607, -.000607, .000608, -.000608, .000609, -.00061, .00061, -.000611, .000611, -.000612, .000612, -.000613, .000613, -.000614, .000614, -.000615, .000615, -.000616, .000616, -.000617, .000617, -.000618, .000618, -.000619, .000619, -.00062, .00062, -.000621, .000621, -.000622, .000622, -.000623, .000623, -.000624, .000624, -.000625, .000625, -.000625, .000626, -.000626, .000627, -.000627, .000628, -.000628, .000628, -.000629, .000629, -.00063, .00063, -.00063, .000631, -.000631, .000632, -.000632, .000632, -.000633, .000633, -.000634, .000634, -.000634, .000635, -.000635, .000635, -.000636, .000636, -.000636, .000637, -.000637, .000637, -.000638, .000638, -.000638, .000639, -.000639, .000639, -.00064, .00064, -.00064, .00064, -.000641, .000641, -.000641, .000642, -.000642, .000642, -.000642, .000643, -.000643, .000643, -.000643, .000644, -.000644, .000644, -.000644, .000644, -.000645, .000645, -.000645, .000645, -.000645, .000646, -.000646, .000646, -.000646, .000646, -.000647, .000647, -.000647, .000647, -.000647, .000647, -.000648, .000648, -.000648, .000648, -.000648, .000648, -.000648, .000648, -.000649, .000649, -.000649, .000649, -.000649, .000649, -.000649, .000649, -.000649, .000649, -.000649, .000649, -.00065, .00065, -.00065, .00065, -.00065, .000575, -.000575, .000575, -.000575, .000575, -.000575, .000575, -.000575, .000575, -.000575, .000575, -.000575, .000575, -.000575, .000575, -.000574, .000574, -.000574, .000574, -.000574, .000574, -.000574, .000574, -.000574, .000574, -.000574, .000574, -.000574, .000574, -.000573, .000573, -.000573, .000573, -.000573, .000573, -.000573, .000573, -.000572, .000572, -.000572, .000572, -.000572, .000572, -.000572, .000571, -.000571, .000571, -.000571, .000571, -.00057, .00057, -.00057, .00057, -.00057, .000569, -.000569, .000569, -.000569, .000568, -.000568, .000568, -.000568, .000567, -.000567, .000567, -.000567, .000566, -.000566, .000566, -.000566, .000565, -.000565, .000565, -.000564, .000564, -.000564, .000563, -.000563, .000563, -.000562, .000562, -.000562, .000561, -.000561, .000561, -.00056, .00056, -.000559, .000559, -.000559, .000558, -.000558, .000557, -.000557, .000557, -.000556, .000556, -.000555, .000555, -.000554, .000554, -.000553, .000553, -.000553, .000552, -.000552, .000551, -.000551, .00055, -.00055, .000549, -.000549, .000548, -.000548, .000547, -.000547, .000546, -.000545, .000545, -.000544, .000544, -.000543, .000543, -.000542, .000542, -.000541, .00054, -.00054, .000539, -.000539, .000538, -.000537, .000537, -.000536, .000535, -.000535, .000534, -.000534, .000533, -.000532, .000532, -.000531, .00053, -.00053, .000529, -.000528, .000527, -.000527, .000526, -.000525, .000525, -.000524, .000523, -.000522, .000522, -.000521, .00052, -.000519, .000519, -.000518, .000517, -.000516, .000516, -.000515, .000514, -.000513, .000512, -.000512, .000511, -.00051, .000509, -.000508, .000507, -.000507, .000506, -.000505, .000504, -.000503, .000502, -.000501, .000501, -.0005, .000499, -.000498, .000497, -.000496, .000495, -.000494, .000493, -.000492, .000491, -.00049, .000489, -.000489, .000488, -.000487, .000486, -.000485, .000484, -.000483, .000482, -.000481, .00048, -.000479, .00041, -.000409, .000408, -.000407, .000406, -.000405, .000404, -.000403, .000403, -.000402, .000401, -.0004, .000399, -.000398, .000397, -.000396, .000395, -.000394, .000393, -.000392, .000391, -.00039, .000389, -.000388, .000387, -.000386, .000385, -.000384, .000383, -.000382, .000381, -.00038, .000379, -.000378, .000377, -.000376, .000375, -.000374, .000373, -.000372, .000371, -.00037, .000369, -.000368, .000367, -.000366, .000364, -.000363, .000362, -.000361, .00036, -.000359, .000358, -.000357, .000356, -.000354, .000353, -.000352, .000351, -.00035, .000349, -.000348, .000346, -.000345, .000344, -.000343, .000342, -.000341, .000339, -.000338, .000337, -.000336, .000335, -.000333, .000332, -.000331, .00033, -.000328, .000327, -.000326, .000325, -.000324, .000322, -.000321, .00032, -.000318, .000317, -.000316, .000315, -.000313, .000312, -.000311, .00031, -.000308, .000307, -.000306, .000304, -.000303, .000302, -.0003, .000299, -.000298, .000296, -.000295, .000294, -.000292, .000291, -.00029, .000288, -.000287, .000286, -.000284, .000283, -.000281, .00028, -.000279, .000277, -.000276, .000274, -.000273, .000272, -.00027, .000269, -.000267, .000266, -.000265, .000263, -.000262, .00026, -.000259, .000257, -.000256, .000255, -.000253, .000252, -.00025, .000249, -.000247, .000246, -.000244, .000243, -.000241, .00024, -.000238, .000237, -.000235, .000234, -.000232, .000231, -.000229, .000228, -.000226, .000225, -.000223, .000222, -.00022, .000219, -.000217, .000215, -.000214, .000212, -.000211, .000209, -.000208, .000206, -.000205, .000203, -.000201, .0002, -.000198, .000197, -.000195, .000194, -.000192, .00019, -.000189, .000187, -.000186, .000184, -.000182, .000181, -.000179, .000177, -.000176, .000174, -.000173, .000171, -.000169, .000168, -.000166, .000164, -.000163, .000161, -.00016, .000158, -.000156, .000155, -.000153, .000151, -.00015, .000148, -.000146, .000145, -.000143, .000141, -.00014, .000138, -.000136, .000135, -.000133, .000131, -.000129, .000128, -.000126, .000124, -.000123, .000121, -.000119, .000118, -.000116, .000114, -.000112, .000111, -.000109, .000107, -.000106, .000104, -.000102, .0001, -.000099, .000097, -.000095, .000094, -.000092, .00009, -.000088, .000087, -.000085, .000083, -.000081, .00008, -.000078, .000076, -.000074, .000052, -.000051, .000049, -.000048, .000047, -.000046, .000044, -.000043, .000042, -.000041, .000039, -.000038, .000037, -.000036, .000034, -.000033, .000032, -.000031, .000029, -.000028, .000027, -.000025, .000024, -.000023, .000022, -.00002, .000019, -.000018, .000017, -.000015, .000014, -.000013, .000012, -.00001, .000009, -.000008, .000007, -.000005, .000004, -.000003, .000001, 0, -.000001, .000002, -.000004, .000005, -.000006, .000007, -.000009, .00001, -.000011, .000012, -.000014, .000015, -.000016, .000018, -.000019, .00002, -.000021, .000023, -.000024, .000025, -.000026, .000028, -.000029, .00003, -.000031, .000033, -.000034, .000035, -.000036, .000038, -.000039, .00004, -.000041, .000043, -.000044, .000045, -.000046, .000048, -.000049, .00005, -.000051, .000053, -.000054, .000055, -.000056, .000058, -.000059, .00006, -.000061, .000063, -.000064, .000065, -.000066, .000068, -.000069, .00007, -.000071, .000072, -.000074, .000075, -.000076, .000077, -.000079, .00008, -.000081, .000082, -.000083, .000085, -.000086, .000087, -.000088, .000089, -.000091, .000092, -.000093, .000094, -.000095, .000097, -.000098, .000099, -.0001, .000101, -.000103, .000104, -.000105, .000106, -.000107, .000108, -.00011, .000111, -.000112, .000113, -.000114, .000115, -.000117, .000118, -.000119, .00012, -.000121, .000122, -.000123, .000125, -.000126, .000127, -.000128, .000129, -.00013, .000131, -.000132, .000134, -.000135, .000136, -.000137, .000138, -.000139, .00014, -.000141, .000142, -.000143, .000145, -.000146, .000147, -.000148, .000149, -.00015, .000151, -.000152, .000153, -.000154, .000155, -.000156, .000157, -.000158, .000159, -.00016, .000161, -.000162, .000163, -.000165, .000166, -.000167, .000168, -.000169, .00017, -.000171, .000172, -.000173, .000174, -.000174, .000175, -.000176, .000177, -.000178, .000179, -.00018, .000181, -.000182, .000183, -.000184, .000185, -.000186, .000187, -.000188, .000189, -.00019, .000191, -.000191, .000192, -.000193, .000194, -.000195, .000196, -.000197, .000198, -.000199, .000199, -.0002, .000201, -.000202, .000203, -.000204, .000205, -.000205, .000206, -.000207, .000208, -.000209, .000209, -.00021, .000211, -.000212, .000213, -.000213, .000214, -.000215, .000216, -.000217, .000217, -.000218, .000219, -.00022, .00022, -.000221, .000222, -.000222, .000223, -.000224, .000225, -.000225, .000226, -.000227, .000227, -.000228, .000229, -.000229, .00023, -.000231, .000231, -.000232, .000233, -.000233, .000234, -.000234, .000235, -.000236, .000236, -.000237, .000237, -.000238, .000239, -.000239, .00024, -.00024, .000241, -.000241, .000242, -.000243, .000243, -.000244, .000244, -.000245, .000245, -.000246, .000246, -.000247, .000247, -.000248, .000248, -.000248, .000249, -.000249, .00025, -.00025, .000251, -.000251, .000252, -.000252, .000252, -.000253, .000253, -.000254, .000254, -.000254, .000255, -.000255, .000255, -.000256, .000256, -.000256, .000257, -.000257, .000257, -.000258, .000258, -.000258, .000258, -.000259, .000215, -.000216, .000216, -.000216, .000216, -.000216, .000217, -.000217, .000217, -.000217, .000217, -.000218, .000218, -.000218, .000218, -.000218, .000218, -.000218, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.00022, .00022, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000219, .000219, -.000218, .000218, -.000218, .000218, -.000218, .000218, -.000218, .000218, -.000217, .000217, -.000217, .000217, -.000217, .000216, -.000216, .000216, -.000216, .000216, -.000215, .000215, -.000215, .000215, -.000214, .000214, -.000214, .000214, -.000213, .000213, -.000213, .000212, -.000212, .000212, -.000211, .000211, -.000211, .000211, -.00021, .00021, -.000209, .000209, -.000209, .000208, -.000208, .000208, -.000207, .000207, -.000206, .000206, -.000206, .000205, -.000205, .000204, -.000204, .000203, -.000203, .000203, -.000202, .000202, -.000201, .000201, -.0002, .0002, -.000199, .000199, -.000198, .000198, -.000197, .000197, -.000196, .000196, -.000195, .000194, -.000194, .000193, -.000193, .000192, -.000192, .000191, -.00019, .00019, -.000189, .000189, -.000188, .000187, -.000187, .000186, -.000185, .000185, -.000184, .000183, -.000183, .000182, -.000181, .000181, -.00018, .000179, -.000179, .000178, -.000177, .000177, -.000176, .000175, -.000174, .000174, -.000173, .000172, -.000171, .000171, -.00017, .000169, -.000168, .000168, -.000167, .000166, -.000165, .000164, -.000164, .000163, -.000162, .000161, -.00016, .000159, -.000159, .000158, -.000157, .000156, -.000155, .000154, -.000153, .000153, -.000152, .000151, -.00015, .000149, -.000148, .000147, -.000146, .000145, -.000144, .000144, -.000143, .000142, -.000141, .00014, -.000139, .000138, -.000137, .000136, -.000135, .000134, -.000133, .000132, -.000131, .00013, -.000129, .000128, -.000127, .000126, -.000125, .000124, -.000123, .000122, -.000121, .00012, -.000119, .000118, -.000117, .000116, -.000115, .000114, -.000113, .000112, -.000111, .00011, -.000108, .000107, -.000106, .000105, -.000104, .000103, -.000102, .000101, -.0001, .000099, -.000098, .000096, -.000095, .000094, -.000093, .000092, -.000091, .00009, -.000089, .000087, -.000086, .000085, -.000084, .000083, -.000082, .000081, -.000079, .000078, -.000077, .000076, -.000075, .000074, -.000072, .000071, -.00007, .000069, -.000068, .000066, -.000065, .000064, -.000063, .000062, -.00006, .000059, -.000058, .000057, -.000056, .000054, -.000053, .000052, -.000051, .00005, -.000048, .000047, -.000046, .000045, -.000044, .000042, -.000041, .00004, -.000039, .000037, -.000036, .000035, -.000034, .000032, -.000031, .00003, -.000029, .000027, -.000026, .000025, -.000024, .000023, -.000021, .00002, -.000017, .000016, -.000015, .000014, -.000013, .000011, -.00001, .000009, -.000008, .000007, -.000006, .000005, -.000003, .000002, -.000001 ] } ],

].forEach( ( [ name, w ] ) => {
	const imag = w.imag || w.real.map( () => 0 ),
		real = w.real || w.imag.map( () => 0 );

	real[ 0 ] =
	imag[ 0 ] = 0;
	gswaPeriodicWaves.list.set( name, Object.freeze( {
		real: new Float32Array( real ),
		imag: new Float32Array( imag ),
	} ) );
} );

class gsuiLFO {
	constructor() {
		const root = gsuiLFO.template.cloneNode( true ),
			elTypeForm = root.querySelector( "form.gsuiLFO-propContent" ),
			elWave = root.querySelector( ".gsuiLFO-wave" ),
			wave = new gsuiPeriodicWave(),
			beatlines = new gsuiBeatlines( elWave ),
			sliders = Object.freeze( {
				delay: [ new gsuiSlider(), root.querySelector( ".gsuiLFO-delay .gsuiLFO-propValue" ) ],
				attack: [ new gsuiSlider(), root.querySelector( ".gsuiLFO-attack .gsuiLFO-propValue" ) ],
				speed: [ new gsuiSlider(), root.querySelector( ".gsuiLFO-speed .gsuiLFO-propValue" ) ],
				amp: [ new gsuiSlider(), root.querySelector( ".gsuiLFO-amp .gsuiLFO-propValue" ) ],
			} );

		this.rootElement = root;
		this.oninput =
		this.onchange = () => {};
		this._wave = wave;
		this._sliders = sliders;
		this._beatlines = beatlines;
		this._dur = 4;
		this._waveWidth = 300;
		this._data = Object.seal( {
			type: '',
			delay: 0,
			attack: 0,
			speed: 0,
			amp: 0,
		} );
		Object.seal( this );

		elTypeForm.onchange = this._onchangeType.bind( this );
		root.querySelector( ".gsuiLFO-toggle" ).onclick = () => this.onchange( "toggleLFO" );
		elWave.append( wave.rootElement );
		this._initSlider( "delay", 0, 4, 1 / 4 / 8 );
		this._initSlider( "attack", 0, 4, 1 / 4 / 8 );
		this._initSlider( "speed", 1 / 4, 18, 1 / 8 );
		this._initSlider( "amp", 0, 1, .001 );
	}

	// .........................................................................
	attached() {
		this._sliders.delay[ 0 ].attached();
		this._sliders.attack[ 0 ].attached();
		this._sliders.speed[ 0 ].attached();
		this._sliders.amp[ 0 ].attached();
		this._wave.attached();
		this.resizing();
	}
	resizing() {
		this._waveWidth = this._beatlines.rootElement.getBoundingClientRect().width;
		this._updatePxPerBeat();
	}
	resize() {
		this.resizing();
		this._wave.resized();
		this._beatlines.render();
	}
	timeSignature( a, b ) {
		this._beatlines.timeSignature( a, b );
	}
	updateWave() {
		const bPM = this._beatlines.getBeatsPerMeasure(),
			d = this._data;

		this._dur =
		this._wave.duration = Math.max( d.delay + d.attack + 2, bPM );
		this._wave.type = d.type;
		this._wave.delay = d.delay;
		this._wave.attack = d.attack;
		this._wave.frequency = d.speed;
		this._wave.amplitude = d.amp;
		this._wave.draw();
		this._wave.rootElement.style.opacity = Math.min( 6 / d.speed, 1 );
		this._updatePxPerBeat();
		this._beatlines.render();
	}

	// .........................................................................
	change( prop, val ) {
		switch ( prop ) {
			case "toggle": this._changeToggle( val ); break;
			case "type": this._changeType( val ); break;
			case "amp":
			case "delay":
			case "speed":
			case "attack": this._changeProp( prop, val ); break;
		}
	}
	_changeToggle( b ) {
		this.rootElement.classList.toggle( "gsuiLFO-enable", b );
		this.rootElement.querySelectorAll( ".gsuiLFO-typeRadio" )
			.forEach( b
				? el => el.removeAttribute( "disabled" )
				: el => el.setAttribute( "disabled", "" ) );
		this._sliders.delay[ 0 ].enable( b );
		this._sliders.attack[ 0 ].enable( b );
		this._sliders.speed[ 0 ].enable( b );
		this._sliders.amp[ 0 ].enable( b );
	}
	_changeType( type ) {
		this._data.type =
		this._wave.type = type;
		this.rootElement.querySelector( `.gsuiLFO-typeRadio[value="${ type }"]` ).checked = true;
	}
	_changeProp( prop, val ) {
		const [ sli, span ] = this._sliders[ prop ];

		this._data[ prop ] = val;
		sli.setValue( val );
		span.textContent = val.toFixed( 2 );
	}

	// .........................................................................
	_updatePxPerBeat() {
		this._beatlines.pxPerBeat( this._waveWidth / this._dur );
	}
	_initSlider( prop, min, max, step ) {
		const elWrap = this.rootElement.querySelector( `.gsuiLFO-${ prop } .gsuiLFO-propContent` ),
			slider = this._sliders[ prop ][ 0 ];

		slider.options( { type: "linear-x", min, max, step } );
		slider.oninput = this._oninputSlider.bind( this, prop );
		slider.onchange = val => this.onchange( "changeLFO", prop, val );
		elWrap.append( slider.rootElement );
	}

	// events:
	// .........................................................................
	_onchangeType( e ) {
		this.onchange( "changeLFO", "type", e.target.value );
	}
	_oninputSlider( prop, val ) {
		this._data[ prop ] = val;
		this._sliders[ prop ][ 1 ].textContent = val.toFixed( 2 );
		this.updateWave();
		this.oninput( prop, val );
	}
}

gsuiLFO.template = document.querySelector( "#gsuiLFO-template" );
gsuiLFO.template.remove();
gsuiLFO.template.removeAttribute( "id" );

Object.freeze( gsuiLFO );

class gsuiClock {
	constructor() {
		const root = gsuiClock.template.cloneNode( true ),
			elModes = root.querySelector( ".gsuiClock-modes" );

		this.rootElement = root;
		this.onchangeDisplay = () => {};
		this._attached = false;
		this._wrapRel = root.querySelector( ".gsuiClock-relative" );
		this._wrapAbs = root.querySelector( ".gsuiClock-absolute" );
		this._timeSave = 0;
		this._display = "";
		this._firstValueLen = -1;
		this._values = [ -1, -1, -1 ];
		this._nodes = [
			root.querySelector( ".gsuiClock-a" ),
			root.querySelector( ".gsuiClock-b" ),
			root.querySelector( ".gsuiClock-c" ),
		];
		this._bpm = 60;
		this._sPB = 4;
		Object.seal( this );

		this.setTime( "second", 0 );
		this.setDisplay( "second" );
		elModes.onclick = this._onclickModes.bind( this );
	}

	attached() {
		this._attached = true;
		this._updateWidth();
	}
	setBPM( bpm ) {
		this._bpm = bpm;
		this._resetTime();
	}
	setStepsPerBeat( sPB ) {
		this._sPB = sPB;
		this._resetTime();
	}
	setDisplay( display ) {
		this._display =
		this.rootElement.dataset.mode = display;
		this._resetTime();
	}
	setTime( beats ) {
		const [ a, b, c ] = this._display === "second"
				? GSUtils.parseBeatsToSeconds( beats, this._bpm )
				: GSUtils.parseBeatsToBeats( beats, this._sPB );

		this._timeSave = beats;
		this._setValue( 0, a );
		this._setValue( 1, b );
		this._setValue( 2, c );
		if ( this._attached && a.length !== this._firstValueLen ) {
			this._firstValueLen = a.length;
			this._updateWidth();
		}
	}

	// events:
	_onclickModes() {
		const dpl = this._display === "second" ? "beat" : "second";

		this.setDisplay( dpl );
		this.onchangeDisplay( dpl );
	}

	// private:
	_resetTime() {
		this.setTime( this._timeSave );
	}
	_setValue( ind, val ) {
		if ( val !== this._values[ ind ] ) {
			this._nodes[ ind ].textContent =
			this._values[ ind ] = val;
		}
	}
	_updateWidth() {
		const bcr = this._wrapAbs.getBoundingClientRect(),
			st = this._wrapRel.style;

		st.width =
		st.minWidth = `${ bcr.width }px`;
		st.minHeight = `${ bcr.height }px`;
	}
}

gsuiClock.template = document.querySelector( "#gsuiClock-template" );
gsuiClock.template.remove();
gsuiClock.template.removeAttribute( "id" );

class gsuiMixer {
	constructor() {
		const root = gsuiMixer.template.cloneNode( true ),
			addBtn = root.querySelector( ".gsuiMixer-addChan" ),
			gsdata = new GSDataMixer( {
				actionCallback: ( obj, msg ) => this.onchange( obj, msg ),
				dataCallbacks: {
					addChan: this._addChan.bind( this ),
					removeChan: this._removeChan.bind( this ),
					redirectChan: this._updateChanConnections.bind( this ),
					toggleChan: ( id, b ) => this._chans[ id ].root.classList.toggle( "gsuiMixerChannel-muted", !b ),
					changePanChan: ( id, val ) => this._chans[ id ].pan.setValue( val ),
					changeGainChan: ( id, val ) => this._chans[ id ].gain.setValue( val ),
					changeOrderChan: ( id, val ) => this._chans[ id ].root.dataset.order = val,
					renameChan: ( id, val ) => {
						this._chans[ id ].name.textContent = val;
						this.onupdateChan( id, "name", val );
					},
				},
			} );

		this.rootElement = root;
		this.gsdata = gsdata;
		this._pmain = root.querySelector( ".gsuiMixer-panMain" );
		this._pchans = root.querySelector( ".gsuiMixer-panChannels" );
		this._chans = {};
		this._chanSelected = null;
		this.oninput =
		this.onchange =
		this.onaddChan =
		this.ondeleteChan =
		this.onupdateChan =
		this.onselectChan = GSData.noop;
		this._analyserW = 32;
		this._analyserH = 10;
		this._attached = false;
		Object.seal( this );

		addBtn.onclick = gsdata.callAction.bind( gsdata, "addChan" );
		new gsuiReorder( {
			rootElement: root,
			direction: "row",
			dataTransferType: "channel",
			itemSelector: ".gsuiMixerChannel",
			handleSelector: ".gsuiMixerChannel-grip",
			parentSelector: ".gsuiMixer-panChannels",
			onchange: elChan => {
				const obj = gsuiReorder.listComputeOrderChange( this._pchans, {} ),
					chanName = this.gsdata.data[ elChan.dataset.id ].name;

				this.onchange( obj, [ "mixer", "reorderChan", chanName ] );
			},
		} );
		this.empty();
		this.selectChan( "main" );
	}

	attached() {
		const pan = this._pchans;

		this._attached = true;
		pan.style.bottom = `${ pan.clientHeight - pan.offsetHeight }px`;
		Object.entries( this.gsdata.data ).forEach( ( [ id, obj ] ) => {
			const html = this._chans[ id ];

			html.pan.attached();
			html.gain.attached();
			this.onaddChan( id, obj );
		} );
		this.resized();
	}
	resized() {
		const chans = Object.values( this._chans ),
			{ width, height } = chans[ 0 ].analyser.rootElement.getBoundingClientRect();

		this._analyserW = width;
		this._analyserH = height;
		chans.forEach( html => html.analyser.setResolution( width, height ) );
	}
	updateAudioData( id, ldata, rdata ) {
		this._chans[ id ].analyser.draw( ldata, rdata );
	}
	empty() {
		this.gsdata.clear();
		this.gsdata.change( {
			channels: {
				main: {
					toggle: true,
					name: "main",
					gain: 1,
					pan: 0,
				},
			},
		} );
		this.selectChan( "main" );
	}
	change( obj ) {
		this.gsdata.change( obj );
		gsuiReorder.listReorder( this._pchans, obj.channels );
	}
	getCurrentChannelId() {
		return this._chanSelected;
	}
	selectChan( id ) {
		if ( id in this.gsdata.data ) {
			const chan = this._chans[ id ].root,
				pchan = this._chans[ this._chanSelected ];

			pchan && pchan.root.classList.remove( "gsuiMixer-selected" );
			chan.classList.add( "gsuiMixer-selected" );
			this._chanSelected = id;
			this._updateChanConnections();
			this.onselectChan( id );
		}
	}

	// private:
	// .........................................................................
	_getNextChan( el, dir ) {
		const sibling = el[ dir ];

		return sibling && "id" in sibling.dataset ? sibling : null;
	}
	_updateChanConnections() {
		const selId = this._chanSelected;

		if ( selId ) {
			const chanDest = this.gsdata.data[ selId ].dest,
				html = this._chans[ selId ];
			let bOnce = false;

			Object.entries( this.gsdata.data ).forEach( ( [ id, chan ] ) => {
				const html = this._chans[ id ],
					a = id === chanDest,
					b = chan.dest === selId;

				html.connectA.dataset.icon = a ? "caret-up" : "";
				html.connectB.dataset.icon = b ? "caret-down" : "";
				bOnce = bOnce || b;
			} );
			html.connectA.dataset.icon = selId !== "main" ? "caret-down" : "";
			html.connectB.dataset.icon = bOnce ? "caret-up" : "";
		}
	}
	_addChan( id, chan ) {
		const root = gsuiMixer.channelTemplate.cloneNode( true ),
			qs = n => root.querySelector( `.gsuiMixerChannel-${ n }` ),
			pan = new gsuiSlider(),
			gain = new gsuiSlider(),
			canvas = qs( "analyser" ),
			call = this.gsdata.callAction,
			html = { root, pan, gain,
				name: qs( "name" ),
				connectA: qs( "connectA" ),
				connectB: qs( "connectB" ),
				analyser: new gsuiAnalyser(),
			};

		this._chans[ id ] = html;
		root.dataset.id = id;
		qs( "pan" ).append( pan.rootElement );
		qs( "gain" ).append( gain.rootElement );
		html.analyser.setCanvas( canvas );
		pan.options( { min: -1, max: 1, step: .001, type: "circular", strokeWidth: 3 } );
		gain.options( { min: 0, max: 1, step: .001, type: "linear-y" } );
		pan.oninput = val => this.oninput( id, "pan", val );
		gain.oninput = val => this.oninput( id, "gain", val );
		pan.onchange = call.bind( this.gsdata, "updateChanProp", id, "pan" );
		gain.onchange = call.bind( this.gsdata, "updateChanProp", id, "gain" );
		canvas.onclick =
		qs( "nameWrap" ).onclick = this.selectChan.bind( this, id );
		qs( "toggle" ).onclick = call.bind( this.gsdata, "toggleChan", id );
		qs( "delete" ).onclick = call.bind( this.gsdata, "removeChan", id );
		qs( "connect" ).onclick = () => this.gsdata.callAction( "redirectChan", this._chanSelected, id );
		( id === "main" ? this._pmain : this._pchans ).append( root );
		if ( this._attached ) {
			pan.attached();
			gain.attached();
			html.analyser.setResolution( this._analyserW, this._analyserH );
		}
		this.onaddChan( id, chan );
		this._updateChanConnections();
	}
	_removeChan( id ) {
		const el = this._chans[ id ].root;

		if ( id === this._chanSelected ) {
			const next = this._getNextChan( el, "nextElementSibling" );

			if ( next ) {
				this.selectChan( next.dataset.id );
			} else {
				const prev = this._getNextChan( el, "previousElementSibling" );

				this.selectChan( prev ? prev.dataset.id : "main" );
			}
		}
		this.ondeleteChan( id );
		delete this._chans[ id ];
		el.remove();
	}
}

gsuiMixer.template = document.querySelector( "#gsuiMixer-template" );
gsuiMixer.template.remove();
gsuiMixer.template.removeAttribute( "id" );

gsuiMixer.channelTemplate = document.querySelector( "#gsuiMixerChannel-template" );
gsuiMixer.channelTemplate.remove();
gsuiMixer.channelTemplate.removeAttribute( "id" );

class gsuiCurves {
	constructor() {
		const svg = gsuiCurves.template.cloneNode( true );

		this.rootElement = svg;
		this._line = svg.querySelector( ".gsuiCurves-line" );
		this._marksWrap = svg.querySelector( ".gsuiCurves-marks" );
		this._curvesWrap = svg.querySelector( ".gsuiCurves-curves" );
		this._curves = new Map();
		this._options = Object.seal( {
			nyquist: 24000,
			nbBands: 8,
		} );
		this._size = Object.seal( [ 0, 0 ] );
		Object.freeze( this );
	}

	resized() {
		const bcr = this.rootElement.getBoundingClientRect(),
			w = bcr.width,
			h = bcr.height;

		this._size[ 0 ] = w;
		this._size[ 1 ] = h;
		this.rootElement.setAttribute( "viewBox", `0 0 ${ w } ${ h }` );
		this.redraw();
	}
	options( opt ) {
		Object.assign( this._options, opt );
		if ( "nbBands" in opt || "nyquist" in opt ) {
			this._updateHzTexts();
		}
	}
	setCurve( id, curve ) {
		const path = this._curvesWrap.querySelector( `[data-id="${ id }"]` );

		if ( curve ) {
			this._curves.set( id, curve );
			if ( path ) {
				path.setAttribute( "d", this._createPathD( curve ) );
			} else {
				this._createPath( id, curve );
			}
		} else {
			this._curves.delete( id );
			path.remove();
		}
	}
	redraw() {
		this._updateHzTexts();
		this._updateLinePos();
		this._curves.forEach( ( curve, id ) => {
			this._curvesWrap.querySelector( `[data-id="${ id }"]` )
				.setAttribute( "d", this._createPathD( curve ) );
		} );
	}
	getWidth() {
		return this._size[ 0 ];
	}

	// .........................................................................
	_updateLinePos() {
		const line = this._line,
			[ w, h ] = this._size;

		line.setAttribute( "x1", 0 );
		line.setAttribute( "x2", w );
		line.setAttribute( "y1", h / 2 );
		line.setAttribute( "y2", h / 2 );
	}
	_updateHzTexts() {
		const [ w, h ] = this._size,
			nb = this._options.nbBands,
			nyquist = this._options.nyquist,
			rects = [],
			marks = [];

		for ( let i = 0; i < nb; ++i ) {
			const txt = document.createElementNS( "http://www.w3.org/2000/svg", "text" ),
				Hz = Math.round( nyquist * ( 2 ** ( i / nb * 11 - 11 ) ) ),
				x = i / nb * w | 0;

			txt.setAttribute( "x", x + 3 );
			txt.setAttribute( "y", 14 );
			txt.classList.add( "gsuiCurves-markText" );
			txt.textContent = Hz < 1000 ? Hz : `${ ( Hz / 1000 ).toFixed( 1 ) }k`;
			marks.push( txt );
			if ( i % 2 === 0 ) {
				const rect = document.createElementNS( "http://www.w3.org/2000/svg", "rect" );

				rect.setAttribute( "x", x );
				rect.setAttribute( "y", 0 );
				rect.setAttribute( "width", w / nb | 0 );
				rect.setAttribute( "height", h );
				rect.setAttribute( "shape-rendering", "crispEdges" );
				rect.classList.add( "gsuiCurves-markBg" );
				rects.push( rect );
			}
		}
		while ( this._marksWrap.lastChild ) {
			this._marksWrap.lastChild.remove();
		}
		this._marksWrap.append( ...rects, ...marks );
	}
	_createPath( id, curve ) {
		const path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );

		path.classList.add( "gsuiCurves-curve" );
		path.dataset.id = id;
		path.setAttribute( "d", this._createPathD( curve ) );
		this._curvesWrap.append( path );
	}
	_createPathD( curve ) {
		const w = this._size[ 0 ],
			len = curve.length,
			d = [ `M 0 ${ this._dbToY( curve[ 0 ] ) } ` ];

		for ( let i = 1; i < len; ++i ) {
		    d.push( `L ${ i / len * w | 0 } ${ this._dbToY( curve[ i ] ) } ` );
		}
		return d.join( "" );
	}
	_dbToY( db ) {
		const h = this._size[ 1 ],
			y = 20 * Math.log( Math.max( db, .0001 ) ) / Math.LN10;

		return h / 2 - y * ( h / 100 );
	}
}

gsuiCurves.template = document.querySelector( "#gsuiCurves-template" );
gsuiCurves.template.remove();
gsuiCurves.template.removeAttribute( "id" );

Object.freeze( gsuiCurves );

class gsuiEffects {
	constructor() {
		const root = gsuiEffects.template.cloneNode( true ),
			elFxsList = root.querySelector( ".gsuiEffects-list" ),
			elBtnSelect = root.querySelector( ".gsuiEffects-addBtn" ),
			elAddSelect = root.querySelector( ".gsuiEffects-addSelect" );

		this.rootElement = root;
		this.askData =
		this.oninput =
		this.onchange = () => {};
		this._fxsHtml = new Map();
		this._attached = false;
		this._elFxsList = elFxsList;
		this._elAddSelect = elAddSelect;
		this._fxResizeTimeoutId = null;
		Object.seal( this );

		elBtnSelect.onclick = () => this._elAddSelect.value = "";
		elAddSelect.onchange = this._onchangeAddSelect.bind( this );
		elAddSelect.onkeydown = () => false;
		new gsuiReorder( {
			rootElement: elFxsList,
			direction: "column",
			dataTransferType: "effect",
			itemSelector: ".gsuiEffects-fx",
			handleSelector: ".gsuiEffects-fx-grip",
			parentSelector: ".gsuiEffects-list",
		} );
		this._fillSelect();
	}

	// .........................................................................
	attached() {
		this._attached = true;
		this._fxsHtml.forEach( html => html.uiFx.attached() );
	}
	resized() {
		this._fxsHtml.forEach( html => html.uiFx.resized() );
	}
	expandToggleEffect( id ) {
		const root = this._fxsHtml.get( id ).root;

		this.expandEffect( id, !root.classList.contains( "gsuiEffects-fx-expanded" ) );
	}
	expandEffect( id, b ) {
		const html = this._fxsHtml.get( id ),
			type = html.root.dataset.type;

		html.root.classList.toggle( "gsuiEffects-fx-expanded", b );
		html.expand.dataset.icon = b ? "caret-down" : "caret-right";
		html.content.style.height = `${ b ? gsuiEffects.fxsMap.get( type ).height : 0 }px`;
		clearTimeout( this._fxResizeTimeoutId );
		if ( b ) {
			this._fxResizeTimeoutId = setTimeout( () => {
				if ( !html.uiFx.isAttached() ) {
					html.uiFx.attached();
				}
			}, 200 );
		}
	}

	// .........................................................................
	addEffect( id, fx ) {
		const root = gsuiEffects.templateFx.cloneNode( true ),
			name = root.querySelector( ".gsuiEffects-fx-name" ),
			expand = root.querySelector( ".gsuiEffects-fx-expand" ),
			toggle = root.querySelector( ".gsuiEffects-fx-toggle" ),
			remove = root.querySelector( ".gsuiEffects-fx-remove" ),
			content = root.querySelector( ".gsuiEffects-fx-content" ),
			fxAsset = gsuiEffects.fxsMap.get( fx.type ),
			uiFx = new fxAsset.cmp(),
			html = Object.seal( {
				uiFx,
				root,
				expand,
				content,
			} );

		expand.onclick = () => this.expandToggleEffect( id );
		toggle.onclick = () => this.onchange( "toggleEffect", id );
		remove.onclick = () => this.onchange( "removeEffect", id );
		uiFx.askData = this.askData.bind( null, id, fx.type );
		uiFx.oninput = ( prop, val ) => this.oninput( id, prop, val );
		uiFx.onchange = ( prop, val ) => this.onchange( "changeEffect", id, prop, val );
		root.dataset.type = fx.type;
		name.textContent = fxAsset.name;
		content.append( uiFx.rootElement );
		this._fxsHtml.set( id, html );
		this._elFxsList.append( root );
	}
	removeEffect( id ) {
		this._fxsHtml.get( id ).root.remove();
		this._fxsHtml.delete( id );
	}
	changeEffect( id, prop, val ) {
		switch ( prop ) {
			case "toggle": this._changeToggle( id, val ); break;
			case "order": this._fxsHtml.get( id ).root.dataset.order = val; break;
		}
	}
	_changeToggle( id, b ) {
		const html = this._fxsHtml.get( id );

		html.root.classList.toggle( "gsuiEffects-fx-enable", b );
		html.uiFx.toggle( b );
	}
	reorderEffects( effects ) {
		gsuiReorder.listReorder( this._elFxsList, effects );
	}

	// events:
	// .........................................................................
	_onchangeAddSelect() {
		const type = this._elAddSelect.value;

		this._elAddSelect.blur();
		this._elAddSelect.value = "";
		this.onchange( "addEffect", type );
	}

	// .........................................................................
	_createOption( enable, fxId, fxName ) {
		const opt = document.createElement( "option" );

		opt.value = fxId;
		opt.disabled = !enable;
		opt.textContent = fxName;
		return opt;
	}
	_fillSelect() {
		const def = this._createOption( false, "", "-- Select an Fx" ),
			options = [ def ];

		gsuiEffects.fxsMap.forEach( ( fx, id ) => {
			options.push( this._createOption( true, id, fx.name ) );
		} );
		this._elAddSelect.append( ...options );
	}
}

gsuiEffects.template = document.querySelector( "#gsuiEffects-template" );
gsuiEffects.template.remove();
gsuiEffects.template.removeAttribute( "id" );

gsuiEffects.templateFx = document.querySelector( "#gsuiEffects-fx-template" );
gsuiEffects.templateFx.remove();
gsuiEffects.templateFx.removeAttribute( "id" );

gsuiEffects.fxsMap = new Map();
Object.freeze( gsuiEffects );

class gsuiFxFilter {
	constructor() {
		const root = gsuiFxFilter.template.cloneNode( true ),
			elType = root.querySelector( ".gsuiFxFilter-areaType .gsuiFxFilter-area-content" ),
			elGraph = root.querySelector( ".gsuiFxFilter-areaGraph .gsuiFxFilter-area-content" ),
			uiCurves = new gsuiCurves(),
			Q = new gsuiSlider(),
			gain = new gsuiSlider(),
			detune = new gsuiSlider(),
			frequency = new gsuiSlider(),
			uiSliders = new Map( [
				[ "Q", Q ],
				[ "gain", gain ],
				[ "detune", detune ],
				[ "frequency", frequency ],
			] );

		this.rootElement = root;
		this.askData =
		this.oninput =
		this.onchange = () => {};
		this._nyquist = 24000;
		this._uiCurves = uiCurves;
		this._uiSliders = uiSliders;
		this._elType = elType;
		this._attached = false;
		this._currType = "lowpass";
		Object.seal( this );

		elType.onclick = this._onclickType.bind( this );
		elGraph.append( uiCurves.rootElement );
		this._initSlider( "areaQ", "Q", { type: "circular", min: .001, max: 25, step: .001 } );
		this._initSlider( "areaGain", "gain", { type: "linear-y", min: -50, max: 50, step: .1 } );
		this._initSlider( "areaDetune", "detune", { type: "circular", min: -12 * 100, max: 12 * 100, step: 10 } );
		this._initSlider( "areaFrequency", "frequency", { type: "linear-x", min: 0, max: 1, step: .0001 }, this._frequencyPow.bind( this ) );
	}

	// .........................................................................
	setNyquist( n ) {
		this._nyquist = n;
	}
	isAttached() {
		return this._attached;
	}
	attached() {
		this._attached = true;
		this._uiSliders.forEach( sli => sli.attached() );
		this._uiCurves.resized();
		this.updateWave();
	}
	resized() {
		this._uiCurves.resized();
	}
	toggle( b ) {
		this.rootElement.classList.toggle( "gsuiFxFilter-enable", b );
		setTimeout( () => this.updateWave(), 150 );
	}
	updateWave() {
		if ( this._attached ) {
			const curve = this.askData( "curve", this._uiCurves.getWidth() );

			if ( curve ) {
				this._uiCurves.setCurve( "0", curve );
			}
		}
	}

	// .........................................................................
	change( prop, val ) {
		switch ( prop ) {
			case "type": this._changeType( val ); break;
			case "frequency": this._changeFrequency( val ); break;
			case "Q":
			case "gain":
			case "detune": this._uiSliders.get( prop ).setValue( val ); break;
		}
	}
	_changeFrequency( hz ) {
		this._uiSliders.get( "frequency" ).setValue( ( Math.log2( hz / this._nyquist ) + 11 ) / 11 );
	}
	_changeType( type ) {
		const gainQ = gsuiFxFilter.typeGainQ[ type ];

		this._toggleTypeBtn( this._currType, false );
		this._toggleTypeBtn( type, true );
		this._currType = type;
		this._uiSliders.get( "Q" ).enable( gainQ.Q );
		this._uiSliders.get( "gain" ).enable( gainQ.gain );
	}

	// .........................................................................
	_frequencyPow( Hz ) {
		return this._nyquist * ( 2 ** ( Hz * 11 - 11 ) );
	}
	_initSlider( area, prop, opt, fnValue = a => a ) {
		const slider = this._uiSliders.get( prop ),
			elArea = this.rootElement.querySelector( `.gsuiFxFilter-${ area } .gsuiFxFilter-area-content` );

		slider.options( opt );
		slider.oninput = val => this._oninputProp( prop, fnValue( val ) );
		slider.onchange = val => this.onchange( prop, fnValue( val ) );
		elArea.append( slider.rootElement );
	}
	_toggleTypeBtn( type, b ) {
		this._elType.querySelector( `[data-type="${ type }"]` )
			.classList.toggle( "gsuiFxFilter-areaType-btnSelected", b );
	}

	// events
	// .........................................................................
	_oninputProp( prop, val ) {
		this.oninput( prop, val );
		this.updateWave();
	}
	_onclickType( e ) {
		const type = e.target.dataset.type;

		if ( type && !e.target.classList.contains( "gsuiFxFilter-areaType-btnSelected" ) ) {
			this.onchange( "type", type );
		}
	}
}

gsuiFxFilter.template = document.querySelector( "#gsuiFxFilter" );
gsuiFxFilter.template.remove();
gsuiFxFilter.template.removeAttribute( "id" );

gsuiFxFilter.typeGainQ = GSUtils.deepFreeze( {
	lowpass:   { gain: false, Q: true },
	highpass:  { gain: false, Q: true },
	bandpass:  { gain: false, Q: true },
	lowshelf:  { gain: true,  Q: false },
	highshelf: { gain: true,  Q: false },
	peaking:   { gain: true,  Q: true },
	notch:     { gain: false, Q: true },
	allpass:   { gain: false, Q: true },
} );

Object.freeze( gsuiFxFilter );

if ( typeof gsuiEffects !== "undefined" ) {
	gsuiEffects.fxsMap.set( "filter", { cmp: gsuiFxFilter, name: "Filter", height: 160 } );
}

class gsuiReorder {
	constructor( opt = {} ) {
		const root = opt.rootElement;

		this.rootElement = root;
		this._dirRow = opt.direction !== "column";
		this._onchange = opt.onchange ?? ( () => console.warn( "gsuiReorder: no onchange set" ) );
		this._dataTransfer = opt.dataTransfer ?? ( () => "" );
		this._dataTransferType = opt.dataTransferType ?? "text";
		this._itemSelector = opt.itemSelector ?? "";
		this._handleSelector = opt.handleSelector ?? "";
		this._parentSelector = opt.parentSelector ?? "";
		this._preventDefault = opt.preventDefault ?? true;
		this._elClicked =
		this._elDragged =
		this._elDragover =
		this._itemDragover =
		this._parentDragover =
		this._elShadowParent =
		this._elShadowDragged =
		this._elDraggedParent = null;
		this._shadowClass = "";
		this._indDragged = 0;
		this._droppedInside = false;
		this._ondrop = this._ondrop.bind( this );
		Object.seal( this );
		
		root.addEventListener( "mousedown", this._onmousedown.bind( this ), { passive: true } );
		root.addEventListener( "dragstart", this._ondragstart.bind( this ), { passive: false } );
		root.addEventListener( "dragover", this._ondragover.bind( this ), { passive: true } );
		root.addEventListener( "dragend", this._ondragend.bind( this ), { passive: true } );
	}

	setShadowElement( el ) {
		this._elShadowParent = el;
	}
	setShadowChildClass( cl ) {
		this._shadowClass = `.${ cl }`;
	}

	// private:
	// .........................................................................
	_getIndex( el ) {
		return Array.prototype.indexOf.call( el.parentNode.children, el );
	}
	_getShadowChild( id ) {
		return this._elShadowParent.querySelector( `${ this._shadowClass }[data-id="${ id }"]` );
	}

	// events:
	// .........................................................................
	_onmousedown( e ) {
		this._elClicked = e.target;
	}
	_ondragstart( e ) {
		if ( this._elClicked && this._elClicked.matches( this._handleSelector ) ) {
			const elItem = e.target,
				itemId = elItem.dataset.id;

			document.addEventListener( "drop", this._ondrop );
			this._elClicked = null;
			this._elDragged = elItem;
			this._elDraggedParent = elItem.parentNode;
			if ( this._elShadowParent ) {
				this._elShadowDragged = this._getShadowChild( itemId );
			}
			this._indDragged = this._getIndex( elItem );
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData( this._dataTransferType, this._dataTransfer( elItem ) );
			setTimeout( () => {
				this._elDragged.classList.add( "gsuiReorder-dragging" );
				if ( this._elShadowDragged ) {
					this._elShadowDragged.classList.add( "gsuiReorder-dragging" );
				}
			}, 20 );
		} else if ( this._preventDefault ) {
			e.preventDefault();
		}
	}
	_ondragover( e ) {
		if ( this._elDragged ) {
			const tar = e.target,
				elDrag = this._elDragged,
				elOver = tar === this._elDragover
					? this._itemDragover
					: tar.closest( this._itemSelector );

			if ( !elOver ) {
				const elOver = tar === this._elDragover
						? this._parentDragover
						: tar.closest( this._parentSelector );

				this._parentDragover = elOver;
				if ( elOver && elOver.lastElementChild !== elDrag ) {
					elOver.append( elDrag );
				}
			} else {
				const bcr = elOver.getBoundingClientRect();

				if ( ( this._dirRow && e.clientX < bcr.left + bcr.width / 2 ) ||
					( !this._dirRow && e.clientY < bcr.top + bcr.height / 2 )
				) {
					if ( elOver.previousElementSibling !== elDrag ) {
						elOver.before( elDrag );
						if ( this._elShadowDragged ) {
							this._getShadowChild( elOver.dataset.id ).before( this._elShadowDragged );
						}
					}
				} else if ( elOver.nextElementSibling !== elDrag ) {
					elOver.after( elDrag );
					if ( this._elShadowDragged ) {
						this._getShadowChild( elOver.dataset.id ).after( this._elShadowDragged );
					}
				}
			}
			this._elDragover = tar;
			this._itemDragover = elOver;
		}
	}
	_ondrop( e ) {
		this._droppedInside = this._elDragged && e.target.closest( this._parentSelector );
	}
	_ondragend() {
		if ( this._elDragged ) {
			const el = this._elDragged,
				oldInd = this._indDragged,
				oldPar = this._elDraggedParent;

			this._elDragged =
			this._elDragover =
			this._itemDragover = null;
			el.classList.remove( "gsuiReorder-dragging" );
			if ( this._elShadowDragged ) {
				this._elShadowDragged.classList.remove( "gsuiReorder-dragging" );
			}
			document.removeEventListener( "drop", this._ondrop );
			if ( this._droppedInside ) {
				const ind = this._getIndex( el );

				this._droppedInside = false;
				if ( ind !== oldInd || el.parentNode !== oldPar ) {
					this._onchange( el, oldInd, ind, oldPar, el.parentNode );
				}
			} else {
				el.remove();
				oldInd === 0
					? oldPar.prepend( el )
					: oldPar.children[ oldInd - 1 ].after( el );
			}
		}
	}
}

gsuiReorder.listReorder = ( list, optObj ) => {
	const toSort = !optObj || Object.values( optObj ).some( obj => obj && "order" in obj );

	if ( toSort ) {
		const arr = Array.prototype
				.filter.call( list.children, el => "order" in el.dataset )
				.sort( ( a, b ) => a.dataset.order - b.dataset.order );

		list.append( ...arr );
	}
};

gsuiReorder.listComputeOrderChange = ( list, obj ) => {
	let i = 0;

	Array.prototype.forEach.call( list.children, el => {
		const dt = el.dataset;

		if ( "id" in dt && "order" in dt ) {
			if ( +dt.order !== i ) {
				const objId = obj[ dt.id ];

				if ( objId ) {
					objId.order = i;
				} else if ( !( dt.id in obj ) ) {
					obj[ dt.id ] = { order: i };
				}
			}
			++i;
		}
	} );
	return obj;
};

class gsuiDragline {
	constructor() {
		const root = gsuiDragline.template.cloneNode( true ),
			svg = root.firstElementChild.firstElementChild;

		this.onchange = () => {};
		this.rootElement = root;
		this.getDropAreas =
		this._linkedTo =
		this._dropAreas =
		this._evKeydown =
		this._evMouseup =
		this._evMousemove = null;
		this._dragging = false;
		this._lineSize = 0;
		this._svg = svg;
		this._to = root.firstElementChild.lastElementChild;
		this._main = root.firstElementChild;
		this._polyline = svg.firstElementChild;
		Object.seal( this );

		this._to.onmousedown = this._mousedownTo.bind( this );
	}

	linkTo( el ) {
		const elem = el || null;

		if ( elem !== this._linkedTo ) {
			this._linkedTo = elem;
			this.rootElement.classList.toggle( "gsuiDragline-linked", !!elem );
			elem ? this.redraw() : this._unlink();
		}
	}
	redraw() {
		if ( this._linkedTo ) {
			const bcr = this._linkedTo.getBoundingClientRect();

			this._updateLineSize();
			this._render( bcr.left, bcr.top );
		}
	}

	// private:
	_updateLineSize() {
		this._lineSize = parseFloat( getComputedStyle( this._polyline ).strokeWidth ) || 0;
	}
	_render( x, y ) {
		const clMain = this._main.classList,
			stMain = this._main.style,
			stSvg = this._svg.style,
			bcr = this.rootElement.getBoundingClientRect(),
			w = x - bcr.left,
			h = y - bcr.top,
			wabs = Math.abs( w ),
			habs = Math.abs( h ),
			whmax = Math.max( wabs, habs ),
			whmax2 = whmax * 2;

		clMain.toggle( "gsuiDragline-down", h > 0 );
		clMain.toggle( "gsuiDragline-right", w > 0 );
		stMain.top = `${ Math.min( h, 0 ) }px`;
		stMain.left = `${ Math.min( w, 0 ) }px`;
		stMain.width = `${ wabs }px`;
		stMain.height = `${ habs }px`;
		stSvg.width =
		stSvg.height = `${ whmax2 }px`;
		stSvg.margin = `${ -whmax }px`;
		this._svg.setAttribute( "viewBox", `0 0 ${ whmax2 } ${ whmax2 }` );
		this._polyline.setAttribute( "points", `${ whmax },${ whmax } ${ whmax + w },${ whmax + h }` );
	}
	_unlink() {
		const stMain = this._main.style,
			stSvg = this._svg.style;

		stMain.top =
		stMain.left =
		stMain.width =
		stMain.height =
		stSvg.width =
		stSvg.height =
		stSvg.margin = "0px";
	}
	_cancelDrag() {
		this._resetDrag();
		if ( this._linkedTo ) {
			this.redraw();
		} else {
			this._unlink();
		}
	}
	_resetDrag() {
		this.rootElement.classList.remove( "gsuiDragline-dragging" );
		this._dropAreas.forEach( el => {
			el.classList.remove( "gsuiDragline-dropActive" );
			delete el.onmouseup;
		} );
		this._dragging = false;
		document.removeEventListener( "mousemove", this._evMousemove );
		document.removeEventListener( "mouseup", this._evMouseup );
		document.removeEventListener( "keydown", this._evKeydown );
	}

	// events:
	_mousedownTo( e ) {
		if ( e.button === 0 ) {
			this._dragging = true;
			this._dropAreas = this.getDropAreas();
			this._dropAreas.forEach( el => {
				el.onmouseup = this._mouseupDrop.bind( this );
				el.classList.add( "gsuiDragline-dropActive" );
			} );
			this.rootElement.classList.add( "gsuiDragline-dragging" );
			this._evMousemove = this._mousemove.bind( this );
			this._evMouseup = this._mouseup.bind( this );
			this._evKeydown = this._keydown.bind( this );
			document.addEventListener( "mousemove", this._evMousemove );
			document.addEventListener( "mouseup", this._evMouseup );
			document.addEventListener( "keydown", this._evKeydown );
			this._updateLineSize();
			this._mousemove( e );
		}
	}
	_keydown( e ) {
		if ( e.key === "Escape" ) {
			this._cancelDrag();
		}
	}
	_mouseupDrop( e ) {
		const tar = e.currentTarget;

		if ( tar !== this._linkedTo ) {
			this.onchange( tar, this._linkedTo );
			this._linkedTo = tar;
		}
		this._resetDrag();
		this.redraw();
		return false;
	}
	_mouseup() {
		if ( this._linkedTo ) {
			this.onchange( null, this._linkedTo );
			this._linkedTo = null;
		}
		this._cancelDrag();
	}
	_mousemove( e ) {
		this._render( e.pageX, e.pageY );
	}
}

gsuiDragline.template = document.querySelector( "#gsuiDragline-template" );
gsuiDragline.template.remove();
gsuiDragline.template.removeAttribute( "id" );

class gsuiBeatlines {
	constructor( el ) {
		this.rootElement = el;
		this._beatsPerMeasure =
		this._stepsPerBeat = 4;
		this._width =
		this._pxPerBeat = 0;
		this._colorBeatsOdd = true;
		Object.seal( this );

		el.classList.add( "gsuiBeatlines" );
		el.style.backgroundAttachment = "local";
		this.pxPerBeat( 32 );
	}

	pxPerBeat( pxBeat ) {
		this._pxPerBeat = pxBeat;
		this._updateWidth();
		this._updateBGSize();
	}
	getBeatsPerMeasure() {
		return this._beatsPerMeasure;
	}
	getStepsPerBeat() {
		return this._stepsPerBeat;
	}
	timeSignature( a, b ) {
		this._beatsPerMeasure = Math.max( 1, ~~a );
		this._stepsPerBeat = Math.max( 1, ~~b );
		this._updateWidth();
		this.render();
	}
	colorBeatsOdd( b ) {
		this._colorBeatsOdd = b;
	}
	render() {
		const alpha = Math.min( this._pxPerBeat / 32, 1 ),
			bPM = this._beatsPerMeasure,
			sPB = this._stepsPerBeat,
			sPM = sPB * bPM,
			beatW = this._width / bPM,
			stepW = beatW / sPB,
			mesrColor = `rgba(0,0,0,${ 1 * alpha })`,
			beatColor = `rgba(0,0,0,${ .5 * alpha })`,
			stepColor = `rgba(0,0,0,${ .2 * alpha })`,
			beatBg = `rgba(0,0,0,${ .05 * alpha })`,
			elems = [];

		for ( let step = 0; step <= sPM * 2; ++step ) {
			const col = step % sPB ? stepColor :
					step % sPM ? beatColor : mesrColor,
				w = col === mesrColor ? 1.25 : 1,
				x = step * stepW - ( w / 2 );

			elems.push( this._createRect( x + stepW / 2, w, col ) );
		}
		if ( this._colorBeatsOdd ) {
			for ( let beat = 0; beat <= bPM; ++beat ) {
				elems.push( this._createRect( beat * 2 * beatW + stepW / 2 - .5, beatW, beatBg ) );
			}
		}
		this._updateBGImage( elems );
		this._updateBGSize();
	}

	// private:
	// .........................................................................
	_createRect( x, w, col ) {
		return `<rect x='${ x }' y='0' height='1' width='${ w }' fill='${ col }'/>`;
	}
	_updateWidth() {
		this._width = this._pxPerBeat * this._beatsPerMeasure;
	}
	_updateBGImage( steps ) {
		this.rootElement.style.backgroundImage = `url("${ encodeURI(
			"data:image/svg+xml,<svg preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' " +
			`viewBox='0 0 ${ this._width * 2 } 1'>${ steps.join( " " ) }</svg>`
		) }")`;
	}
	_updateBGSize() {
		this.rootElement.style.backgroundSize = `${ this._width * 2 }px 1px`;
		this.rootElement.style.backgroundPositionX = `${ this._pxPerBeat / this._stepsPerBeat * -.5 }px`;
	}
}

Object.freeze( gsuiBeatlines );

class gsuiBlocksManager {
	constructor( root ) {
		this.rootElement = root;
		this.timeline = new gsuiTimeline();

		this.__offset = 0;
		this.__fontSize = 16;
		this.__blcs = new Map();
		this.__blcsEditing = new Map();
		this.__blcsSelected = new Map();
		this.__uiPanels = new gsuiPanels( root );
		this.__elPanGridWidth = 0;
		this.__magnet = root.querySelector( ".gsuiBlocksManager-magnet" );
		this.__elLoopA = root.querySelector( ".gsuiBlocksManager-loopA" );
		this.__elLoopB = root.querySelector( ".gsuiBlocksManager-loopB" );
		this.__selection = root.querySelector( ".gsuiBlocksManager-selection" );
		this.__elPanGrid = root.querySelector( ".gsuiBlocksManager-gridPanel" );
		this.__magnetValue = root.querySelector( ".gsuiBlocksManager-magnetValue" );
		this.__sideContent = root.querySelector( ".gsuiBlocksManager-sidePanelContent" );
		this.__elCurrentTime = root.querySelector( ".gsuiBlocksManager-currentTime" );
		this.__rowsContainer = root.querySelector( ".gsuiBlocksManager-rows" );
		this.__rowsWrapinContainer = root.querySelector( ".gsuiBlocksManager-rowsWrapin" );
		this.__rows = this.__rowsContainer.getElementsByClassName( "gsui-row" );
		this.__uiBeatlines = new gsuiBeatlines( root.querySelector( ".gsuiBeatlines" ) );

		this.onaddBlock =
		this.oneditBlock =
		this.onremoveBlock =
		this.onchange =
		this.onchangeLoop =
		this.onchangeCurrentTime = () => {};
		this.__elPanGrid.onresizing = this.__gridPanelResizing.bind( this );
		this.timeline.oninputLoop = this.__loop.bind( this );
		this.timeline.onchangeLoop = ( isLoop, a, b ) => this.onchangeLoop( isLoop, a, b );
		this.timeline.onchangeCurrentTime = t => {
			this.__currentTime( t );
			this.onchangeCurrentTime( t );
		};
		root.querySelector( ".gsuiBlocksManager-timelineWrap" ).append( this.timeline.rootElement );

		this.__rowsContainer.oncontextmenu =
		root.ondragstart = () => false;
		root.onkeydown = this._keydown.bind( this );
		this.__rowsScrollTop =
		this.__rowsScrollLeft = -1;
		this.__magnet.onclick = this.__onclickMagnet.bind( this );
		this.__sideContent.onwheel = this.__onwheelPanelContent.bind( this );
		this.__sideContent.onscroll = this.__onscrollPanelContent.bind( this );
		this.__rowsContainer.onwheel = this.__onwheelRows.bind( this );
		this.__rowsContainer.onscroll = this.__onscrollRows.bind( this );
		root.onwheel = e => { e.ctrlKey && e.preventDefault(); };

		this.__eventReset();
		this.timeline.timeSignature( 4, 4 );
		this.__uiBeatlines.timeSignature( 4, 4 );
		this.__magnetValue.textContent = this.timeline.stepRound;
	}

	// Public methods
	// ............................................................................................
	timeSignature( a, b ) {
		this.timeline.timeSignature( a, b );
		this.__uiBeatlines.timeSignature( a, b );
	}
	currentTime( beat ) {
		this.timeline.currentTime( beat );
		this.__currentTime( beat );
	}
	loop( a, b ) {
		this.timeline.loop( a, b );
		this.__loop( Number.isFinite( a ), a, b );
	}
	setPxPerBeat( px ) {
		const ppb = Math.round( Math.min( Math.max( 8, px ) ), 512 );

		if ( ppb !== this.__pxPerBeat ) {
			const ppbpx = `${ ppb }px`;

			this.__pxPerBeat = ppb;
			this.timeline.offset( this.__offset, ppb );
			this.__uiBeatlines.pxPerBeat( ppb );
			clearTimeout( this.__beatlinesRendering );
			this.__beatlinesRendering = setTimeout( () => this.__uiBeatlines.render(), 100 );
			this.__elLoopA.style.fontSize =
			this.__elLoopB.style.fontSize =
			this.__elCurrentTime.style.fontSize = ppbpx;
			Array.from( this.__rows ).forEach( el => el.firstElementChild.style.fontSize = ppbpx );
			this._setPxPerBeat && this._setPxPerBeat( ppb );
			return true;
		}
		return false;
	}
	setFontSize( px ) {
		const fs = Math.min( Math.max( 8, px ), 64 );

		if ( fs !== this.__fontSize ) {
			const isSmall = fs <= 44;

			this.__fontSize = fs;
			this.__sideContent.style.fontSize =
			this.__rowsContainer.style.fontSize = `${ fs }px`;
			Array.from( this.__rows ).forEach( el => el.classList.toggle( "gsui-row-small", isSmall ) );
			return true;
		}
		return false;
	}
	getDuration() {
		const bPM = this.timeline._beatsPerMeasure,
			dur = Object.values( this._getData() )
				.reduce( ( dur, blc ) => Math.max( dur, blc.when + blc.duration ), 0 );

		return Math.max( 1, Math.ceil( dur / bPM ) ) * bPM;
	}
	getBlocks() {
		return this.__blcs;
	}

	// Blocks methods
	// ............................................................................................
	block_when( el, v ) { el.style.left = `${ v }em`; }
	block_deleted( el, v ) { el.classList.toggle( "gsuiBlocksManager-block-hidden", !!v ); }
	block_selected( el, v ) { el.classList.toggle( "gsuiBlocksManager-block-selected", !!v ); }
	block_duration( el, v ) { el.style.width = `${ v }em`; }

	// Private small getters
	// ............................................................................................
	__getRow0BCR() { return this.__rows[ 0 ].getBoundingClientRect(); }
	__getRowByIndex( ind ) { return this.__rows[ ind ]; }
	__getRowIndexByRow( row ) { return Array.prototype.indexOf.call( this.__rows, row ); }
	__getRowIndexByPageY( pageY ) {
		const ind = Math.floor( ( pageY - this.__getRow0BCR().top ) / this.__fontSize );

		return Math.max( 0, Math.min( ind, this.__rows.length - 1 ) );
	}
	__getWhenByPageX( pageX ) {
		return Math.max( 0, ( pageX - this.__getRow0BCR().left ) / this.__pxPerBeat );
	}
	__roundBeat( beat ) {
		return Math.max( 0, this.timeline.beatFloor( beat ) );
	}

	// Private util methods
	// ............................................................................................
	__resized() {
		this.__gridPanelResized();
	}
	__attached() {
		const elRows = this.__rowsContainer;

		this.__sideContent.style.right =
		this.__sideContent.style.bottom =
		elRows.style.right =
		elRows.style.bottom = `${ elRows.clientWidth - elRows.offsetWidth }px`;
		this.__uiPanels.attached();
		this.__gridPanelResized();
	}
	__loop( isLoop, a, b ) {
		this._loop && this._loop( isLoop && a, b );
		this.__elLoopA.classList.toggle( "gsuiBlocksManager-loopOn", isLoop );
		this.__elLoopB.classList.toggle( "gsuiBlocksManager-loopOn", isLoop );
		if ( isLoop ) {
			this.__elLoopA.style.width = `${ a }em`;
			this.__elLoopB.style.left = `${ b }em`;
		}
	}
	__currentTime( t ) {
		this.__elCurrentTime.style.left = `${ t }em`;
		this._currentTime && this._currentTime( t );
	}
	__isBlc( el ) {
		return el.classList.contains( "gsuiBlocksManager-block" );
	}
	__getBlc( el ) {
		if ( this.__isBlc( el ) ) {
			return el;
		} else if ( this.__isBlc( el.parentNode ) ) {
			return el.parentNode;
		} else if ( this.__isBlc( el.parentNode.parentNode ) ) {
			return el.parentNode.parentNode;
		}
	}
	__fillBlcsMap( blc ) {
		const blcs = this.__blcsEditing;

		if ( blc.classList.contains( "gsuiBlocksManager-block-selected" ) ) {
			this.__blcsSelected.forEach( ( blc, id ) => blcs.set( id, blc ) );
		} else {
			blcs.set( blc.dataset.id, blc );
		}
		return blcs;
	}
	__unselectBlocks( obj ) {
		const dat = this._getData();

		this.__blcsSelected.forEach( ( blc, id ) => {
			if ( !( id in obj ) ) {
				dat[ id ].selected = false;
				obj[ id ] = { selected: false };
			}
		} );
		return obj;
	}
	__getBeatSnap() {
		return 1 / this.timeline._stepsPerBeat * this.timeline.stepRound;
	}
	__eventReset() {
		this.__mmFn =
		this.__valueA =
		this.__valueB = null;
		this.__valueAMin =
		this.__valueBMin = Infinity;
		this.__valueAMax =
		this.__valueBMax = -Infinity;
		this.__status = "";
		this.__blcsEditing.clear();
	}

	// Events
	// ............................................................................................
	__gridPanelResizing( pan ) {
		const width = pan.clientWidth;

		if ( this.__offset > 0 ) {
			this.__offset -= ( width - this.__elPanGridWidth ) / this.__pxPerBeat;
			this.__rowsContainer.scrollLeft -= width - this.__elPanGridWidth;
		}
		this.__gridPanelResized();
	}
	__gridPanelResized() {
		this.__elPanGridWidth = this.__elPanGrid.clientWidth;
		this.timeline.resized();
		this.timeline.offset( this.__offset, this.__pxPerBeat );
	}
	__onscrollPanelContent() {
		if ( this.__sideContent.scrollTop !== this.__rowsScrollTop ) {
			this.__rowsScrollTop =
			this.__rowsContainer.scrollTop = this.__sideContent.scrollTop;
		}
	}
	__onwheelPanelContent( e ) {
		if ( e.ctrlKey ) {
			const layerY = e.pageY - this.__sideContent.firstElementChild.getBoundingClientRect().top,
				oldFs = this.__fontSize;

			this.setFontSize( oldFs * ( e.deltaY > 0 ? .9 : 1.1 ) );
			this.__rowsScrollTop =
			this.__sideContent.scrollTop =
			this.__rowsContainer.scrollTop += layerY / oldFs * ( this.__fontSize - oldFs );
		}
	}
	__onscrollRows( e ) {
		const elRows = this.__rowsContainer;

		this.__mousemove( e );
		if ( elRows.scrollTop !== this.__rowsScrollTop ) {
			this.__rowsScrollTop =
			this.__sideContent.scrollTop = elRows.scrollTop;
		}
		if ( elRows.scrollLeft !== this.__rowsScrollLeft ) {
			const off = elRows.scrollLeft / this.__pxPerBeat;

			this.__offset = off;
			this.__rowsScrollLeft = elRows.scrollLeft;
			this.timeline.offset( off, this.__pxPerBeat );
		}
		this._onscrollRows && this._onscrollRows();
	}
	__onwheelRows( e ) {
		if ( e.ctrlKey ) {
			const elRows = this.__rowsContainer,
				layerX = e.pageX - elRows.getBoundingClientRect().left + elRows.scrollLeft,
				ppb = Math.round( Math.min( Math.max( 8, this.__pxPerBeat * ( e.deltaY > 0 ? .9 : 1.1 ) ), 512 ) );

			this.__rowsScrollLeft =
			elRows.scrollLeft += layerX / this.__pxPerBeat * ( ppb - this.__pxPerBeat );
			this.__offset = elRows.scrollLeft / ppb;
			this.setPxPerBeat( ppb );
		}
	}
	__onclickMagnet() {
		const v = this.timeline.stepRound,
			frac =
				v >= 1 ? 2 :
				v >= .5 ? 4 :
				v >= .25 ? 8 : 1;

		this.timeline.stepRound = 1 / frac;
		this.__magnetValue.textContent = frac <= 1 ? "1" : `1 / ${ frac }`;
		return false;
	}
	__keydown( e ) {
		const dat = this._getData(),
			blcsEditing = this.__blcsEditing;

		switch ( e.key ) {
			case "Delete":
				if ( this.__blcsSelected.size ) {
					this.__blcsSelected.forEach( ( blc, id ) => blcsEditing.set( id, blc ) );
					this.__status = "deleting";
					this.__mouseup();
				}
				break;
			case "b": // copy paste
				if ( e.ctrlKey || e.altKey ) {
					const blcsSel = this.__blcsSelected;

					if ( blcsSel.size ) {
						const data = this._getData();
						let whenMin = Infinity,
							whenMax = 0;

						blcsEditing.clear();
						blcsSel.forEach( ( blc, id ) => {
							const dat = data[ id ];

							whenMin = Math.min( whenMin, dat.when );
							whenMax = Math.max( whenMax, dat.when + dat.duration );
							blcsEditing.set( id, blc );
						} );
						whenMax = this.timeline.beatCeil( whenMax ) - whenMin;
						this.managercallDuplicating( blcsEditing, whenMax );
						blcsEditing.clear();
					}
					e.preventDefault();
					e.stopPropagation();
				}
				break;
			case "a": // select all
			case "d": // deselect
				if ( e.ctrlKey || e.altKey ) {
					const adding = e.key === "a",
						blcs = adding ? this.__blcs : this.__blcsSelected;

					if ( blcs.size ) {
						let notEmpty;

						blcsEditing.clear();
						blcs.forEach( ( blc, id ) => {
							if ( !adding || !dat[ id ].selected ) {
								notEmpty = true;
								blcsEditing.set( id, blc );
							}
						} );
						if ( notEmpty ) {
							this.__status = "selecting-1";
							this.__mouseup();
						}
					}
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	}
}

document.addEventListener( "mousemove", e => {
	gsuiBlocksManager._focused && gsuiBlocksManager._focused._mousemove( e );
} );
document.addEventListener( "mouseup", e => {
	gsuiBlocksManager._focused && gsuiBlocksManager._focused._mouseup( e );
} );

gsuiBlocksManager.prototype.__mousedown = function( e ) {
	if ( !gsuiBlocksManager._focused ) {
		const blc = this.__getBlc( e.currentTarget );

		gsuiBlocksManager._focused = this;
		window.getSelection().removeAllRanges();
		this.__mdBlc = blc;
		this.__mdTarget = e.target;
		if ( e.button === 2 ) {
			this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "deletion" );
			this.__status = "deleting";
			if ( blc ) {
				this.block_deleted( blc, true );
				this.__blcsEditing.set( blc.dataset.id, blc );
			}
		} else if ( e.button === 0 ) {
			this.__mdPageX = e.pageX;
			this.__mdPageY = e.pageY;
			this.__mdWhenReal = this.__getWhenByPageX( e.pageX );
			this.__mdWhen = this.__roundBeat( this.__mdWhenReal );
			this.__beatSnap = this.__getBeatSnap();
			if ( e.shiftKey ) {
				this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "selection1" );
				this.__status = "selecting-1";
				this.__mdRowInd = this.__getRowIndexByPageY( e.pageY );
			} else if ( blc ) {
				const fnAct = gsuiBlocksManager.__mousedownFns.get( e.target.dataset.action );

				if ( fnAct ) {
					const data = this._getData(),
						blcsEditing = this.__fillBlcsMap( blc );

					blc.classList.add( "gsui-hover" );
					e.target.classList.add( "gsui-hover" );
					fnAct.call( this, data, blcsEditing, blc, e );
				}
			}
		}
	}
};

gsuiBlocksManager.__mousedownFns = new Map( [
	[ "move", function( data, blcsEditing, _blc, e ) {
		this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "move" );
		this.__status = "moving";
		this.__mdRowInd = this.__getRowIndexByPageY( e.pageY );
		blcsEditing.forEach( ( blc, id ) => {
			const valB = this.__getRowIndexByRow( blc.parentNode.parentNode );

			this.__valueAMin = Math.min( this.__valueAMin, data[ id ].when );
			this.__valueBMin = Math.min( this.__valueBMin, valB );
			this.__valueBMax = Math.max( this.__valueBMax, valB );
		} );
		this.__valueAMin *= -1;
		this.__valueBMin *= -1;
		this.__valueBMax = this.__rows.length - 1 - this.__valueBMax;
	} ],
	[ "attack", function( data, blcsEditing ) {
		this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "attack" );
		this.__status = "attack";
		this.__valueAMin =
		this.__valueAMax = Infinity;
		blcsEditing.forEach( ( blc, id ) => {
			const dat = data[ id ];

			this.__valueAMin = Math.min( this.__valueAMin, dat.attack );
			this.__valueAMax = Math.min( this.__valueAMax, dat.duration - dat.attack - dat.release );
		} );
		this.__valueAMin *= -1;
		this.__valueAMax = Math.max( 0, this.__valueAMax );
	} ],
	[ "release", function( data, blcsEditing ) {
		this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "release" );
		this.__status = "release";
		this.__valueAMin =
		this.__valueAMax = Infinity;
		blcsEditing.forEach( ( blc, id ) => {
			const dat = data[ id ];

			this.__valueAMin = Math.min( this.__valueAMin, dat.release );
			this.__valueAMax = Math.min( this.__valueAMax, dat.duration - dat.attack - dat.release );
		} );
		this.__valueAMin *= -1;
		this.__valueAMax = Math.max( 0, this.__valueAMax );
	} ],
	[ "cropA", function( data, blcsEditing ) {
		this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "crop" );
		this.__status = "cropping-a";
		this.__valueAMin =
		this.__valueAMax = Infinity;
		blcsEditing.forEach( ( blc, id ) => {
			const dat = data[ id ];

			this.__valueAMin = Math.min( this.__valueAMin, dat.offset );
			this.__valueAMax = Math.min( this.__valueAMax, dat.duration );
		} );
		this.__valueAMin *= -1;
		this.__valueAMax = Math.max( 0, this.__valueAMax - this.__beatSnap );
	} ],
	[ "cropB", function( data, blcsEditing ) {
		this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "crop" );
		this.__status = "cropping-b";
		this.__valueAMin =
		this.__valueAMax = Infinity;
		blcsEditing.forEach( ( blc, id ) => {
			this.__valueAMin = Math.min( this.__valueAMin, data[ id ].duration );
		} );
		this.__valueAMin = -Math.max( 0, this.__valueAMin - this.__beatSnap );
	} ],
] );

gsuiBlocksManager.prototype.__mousemove = function( e ) {
	if ( this.__mmFn ) {
		if ( e.type === "mousemove" ) {
			this.__mmPageX = e.pageX;
			this.__mmPageY = e.pageY;
		}
		this.__mmWhenReal = this.__getWhenByPageX( this.__mmPageX );
		this.__mmWhen = this.__roundBeat( this.__mmWhenReal );
		this.__mmFn( e );
	}
};

gsuiBlocksManager.__mousemoveFns = new Map( [
	[ "crop", function() {
		const croppingB = this.__status === "cropping-b",
			cropBrut = this.__beatSnap * Math.round( ( this.__mmWhen - this.__mdWhen ) / this.__beatSnap ),
			crop = Math.max( this.__valueAMin, Math.min( cropBrut, this.__valueAMax ) );

		if ( crop !== this.__valueA ) {
			const data = this._getData();

			this.__valueA = crop;
			this.__blcsEditing.forEach( ( blc, id ) => {
				const blcObj = Object.assign( {}, data[ id ] );

				if ( croppingB ) {
					blcObj.duration += crop;
				} else {
					blcObj.when += crop;
					blcObj.offset += crop;
					blcObj.duration -= crop;
					this.block_when( blc, blcObj.when );
				}
				this.block_duration( blc, blcObj.duration );
				this.oneditBlock( id, blcObj, blc );
			} );
		}
	} ],
	[ "move", function() {
		const data = this._getData(),
			when = Math.max( this.__valueAMin,
				Math.round( ( this.__mmWhen - this.__mdWhen ) / this.__beatSnap ) * this.__beatSnap ),
			rows = Math.max( this.__valueBMin, Math.min( this.__valueBMax,
				this.__getRowIndexByPageY( this.__mmPageY ) - this.__mdRowInd ) );

		if ( when !== this.__valueA ) {
			this.__valueA = when;
			this.__blcsEditing.forEach( ( blc, id ) => this.block_when( blc, data[ id ].when + when ) );
		}
		if ( rows !== this.__valueB ) {
			this.__valueB = rows;
			this.__blcsEditing.forEach( blc => this.block_row( blc, rows ) );
		}
	} ],
	[ "attack", function() {
		const valBrut = this.__mmWhenReal - this.__mdWhenReal,
			val = Math.max( this.__valueAMin, Math.min( valBrut, this.__valueAMax ) );

		if ( val !== this.__valueA ) {
			const data = this._getData();

			this.__valueA = val;
			this.__blcsEditing.forEach( ( blc, id ) => {
				const blcObj = Object.assign( {}, data[ id ] );

				blcObj.attack += val;
				this.block_attack( blc, blcObj.attack );
				this.oneditBlock( id, blcObj, blc );
			} );
		}
	} ],
	[ "release", function() {
		const valBrut = this.__mdWhenReal - this.__mmWhenReal,
			val = Math.max( this.__valueAMin, Math.min( valBrut, this.__valueAMax ) );

		if ( val !== this.__valueA ) {
			const data = this._getData();

			this.__valueA = val;
			this.__blcsEditing.forEach( ( blc, id ) => {
				const blcObj = Object.assign( {}, data[ id ] );

				blcObj.release += val;
				this.block_release( blc, blcObj.release );
				this.oneditBlock( id, blcObj, blc );
			} );
		}
	} ],
	[ "deletion", function( e ) {
		const blc = this.__getBlc( e.target );

		if ( blc && !this.__blcsEditing.has( blc.dataset.id ) ) {
			this.block_deleted( blc, true );
			this.__blcsEditing.set( blc.dataset.id, blc );
		}
	} ],
	[ "selection1", function() {
		if ( Math.abs( this.__mmPageX - this.__mdPageX ) > 6 ||
			Math.abs( this.__mmPageY - this.__mdPageY ) > 6
		) {
			this.__status = "selecting-2";
			this.__selection.classList.remove( "gsuiBlocksManager-selection-hidden" );
			this.__mmFn = gsuiBlocksManager.__mousemoveFns.get( "selection2" );
			this.__mmFn();
		}
	} ],
	[ "selection2", function() {
		const rowH = this.__fontSize,
			st = this.__selection.style,
			rowIndB = this.__getRowIndexByPageY( this.__mmPageY ),
			when = Math.min( this.__mdWhen, this.__mmWhen ),
			duration = this.__getBeatSnap() + Math.abs( this.__mdWhen - this.__mmWhen ),
			topRow = Math.min( this.__mdRowInd, rowIndB ),
			bottomRow = Math.max( this.__mdRowInd, rowIndB ),
			rowA = this.__getRowByIndex( topRow ),
			rowB = this.__getRowByIndex( bottomRow ),
			blcs = Object.entries( this._getData() )
				.reduce( ( map, [ id, blc ] ) => {
					if ( !this.__blcsSelected.has( id ) &&
						blc.when < when + duration &&
						blc.when + blc.duration > when
					) {
						const elBlc = this.__blcs.get( id ),
							pA = rowA.compareDocumentPosition( elBlc ),
							pB = rowB.compareDocumentPosition( elBlc );

						if ( pA & Node.DOCUMENT_POSITION_CONTAINED_BY ||
							pB & Node.DOCUMENT_POSITION_CONTAINED_BY || (
							pA & Node.DOCUMENT_POSITION_FOLLOWING &&
							pB & Node.DOCUMENT_POSITION_PRECEDING )
						) {
							this.block_selected( elBlc, true );
							map.set( id, elBlc );
						}
					}
					return map;
				}, new Map() );

		st.top = `${ topRow * rowH }px`;
		st.left = `${ when * this.__pxPerBeat }px`;
		st.width = `${ duration * this.__pxPerBeat }px`;
		st.height = `${ ( bottomRow - topRow + 1 ) * rowH }px`;
		this.__blcsEditing.forEach( ( blc, id ) => this.block_selected( blc, blcs.has( id ) ) );
		this.__blcsEditing = blcs;
	} ],
] );

gsuiBlocksManager.prototype.__mouseup = function() {
	const blcsEditing = this.__blcsEditing,
		mdBlc = this.__mdBlc;

	if ( this.__status ) {
		gsuiBlocksManager.__mouseupFns.get( this.__status ).call( this, blcsEditing, mdBlc );
	}
	this.__eventReset();
	if ( mdBlc ) {
		mdBlc.classList.remove( "gsui-hover" );
		this.__mdTarget.classList.remove( "gsui-hover" );
		this.__mdTarget =
		this.__mdBlc = null;
	}
	delete gsuiBlocksManager._focused;
};

gsuiBlocksManager.__mouseupFns = new Map( [
	[ "moving", function( blcsEditing ) {
		if ( this.__valueB || Math.abs( this.__valueA ) > .000001 ) {
			this.managercallMoving( blcsEditing, this.__valueA, this.__valueB );
		}
	} ],
	[ "attack", function( blcsEditing ) {
		if ( Math.abs( this.__valueA ) > .000001 ) {
			this.managercallAttack( blcsEditing, this.__valueA );
		}
	} ],
	[ "release", function( blcsEditing ) {
		if ( Math.abs( this.__valueA ) > .000001 ) {
			this.managercallRelease( blcsEditing, this.__valueA );
		}
	} ],
	[ "deleting", function( blcsEditing ) {
		if ( blcsEditing.size || this.__blcsSelected.size ) {
			this.managercallDeleting( blcsEditing );
		}
	} ],
	[ "cropping-a", function( blcsEditing ) {
		if ( Math.abs( this.__valueA ) > .000001 ) {
			this.managercallCroppingA( blcsEditing, this.__valueA );
		}
	} ],
	[ "cropping-b", function( blcsEditing ) {
		if ( Math.abs( this.__valueA ) > .000001 ) {
			this.managercallCroppingB( blcsEditing, this.__valueA );
		}
	} ],
	[ "selecting-1", function( blcsEditing, mdBlc ) {
		if ( mdBlc ) {
			blcsEditing.set( mdBlc.dataset.id, mdBlc );
		}
		if ( blcsEditing.size ) {
			this.managercallSelecting( blcsEditing );
		}
	} ],
	[ "selecting-2", function( blcsEditing ) {
		this.__selection.classList.add( "gsuiBlocksManager-selection-hidden" );
		if ( blcsEditing.size ) {
			this.managercallSelecting( blcsEditing );
		}
	} ],
] );

class gsuiPatternroll extends gsuiBlocksManager {
	constructor() {
		const root = gsuiPatternroll.template.cloneNode( true );

		super( root );
		this._uiTracklist = new gsuiTracklist();
		this._uiTracklist.onchange = tracks => this.onchange( { tracks } );
		this._uiTracklist.ontrackadded = uiTrk => {
			const row = uiTrk.rowElement;

			row.firstElementChild.style.fontSize = `${ this.__pxPerBeat }px`;
			row.classList.toggle( "gsui-row-small", this.__pxPerBeat <= 44 );
			row.onmousedown = this._rowMousedown.bind( this );
			this._rowsByTrackId.set( row.dataset.track, row );
			this.__rowsWrapinContainer.append( row );
		};

		this.data = this._proxyCreate();
		this._idMax = 0;
		this._rowsByTrackId = new Map();
		this.__sideContent.append( this._uiTracklist.rootElement );
		this.__rowsContainer.ondrop = this._drop.bind( this );
		this.setPxPerBeat( 64 );
		this.__uiBeatlines.colorBeatsOdd( false );
	}

	empty() {
		const blcs = this.data.blocks;

		Object.keys( blcs ).forEach( k => delete blcs[ k ] );
		this._uiTracklist.empty();
	}
	resized() {
		this.__resized();
		this.__gridPanelResized();
	}
	attached() {
		this.__attached();
	}

	// Block's UI functions
	// ........................................................................
	block_row( el, rowIncr ) {
		const trackId = this.data.blocks[ el.dataset.id ].track;

		this.block_track( el, this._incrTrackId( trackId, rowIncr ) );
	}
	block_track( el, trackId ) {
		const row = this._getRowByTrackId( trackId );

		row && row.firstElementChild.append( el );
	}

	// Blocks manager callback
	// ........................................................................
	managercallDuplicating( blcsMap, valA ) {
		const obj = {},
			data = this.data.blocks;

		blcsMap.forEach( ( _blc, id ) => {
			const d = data[ id ],
				nId = ++this._idMax,
				copy = Object.assign( {}, d );

			copy.when += valA;
			obj[ id ] = { selected: false };
			obj[ nId ] =
			data[ nId ] = copy;
			d.selected = false;
		} );
		this.onchange( { blocks: obj } );
	}
	managercallSelecting( blcsMap ) {
		const obj = {},
			data = this.data.blocks;

		blcsMap.forEach( ( _blc, id ) => {
			const d = data[ id ],
				selected = !d.selected;

			obj[ id ] = { selected };
			d.selected = selected;
		} );
		this.onchange( { blocks: obj } );
	}
	managercallMoving( blcsMap, valA, valB ) {
		const obj = {},
			data = this.data.blocks,
			when = Math.abs( valA ) > .000001 ? valA : 0;

		blcsMap.forEach( ( _blc, id ) => {
			const d = data[ id ],
				o = {};

			obj[ id ] = o;
			if ( when ) {
				o.when =
				d.when += when;
			}
			if ( valB ) {
				o.track =
				d.track = this._incrTrackId( d.track, valB );
			}
		} );
		this.onchange( { blocks: obj } );
	}
	managercallDeleting( blcsMap ) {
		const obj = {},
			data = this.data.blocks;

		blcsMap.forEach( ( _blc, id ) => {
			obj[ id ] = undefined;
			delete data[ id ];
		} );
		this.__unselectBlocks( obj );
		this.onchange( { blocks: obj } );
	}
	managercallCroppingA( blcsMap, valA ) {
		const obj = {},
			data = this.data.blocks;

		blcsMap.forEach( ( _blc, id ) => {
			const d = data[ id ],
				when = d.when + valA,
				offset = d.offset + valA,
				duration = d.duration - valA;

			obj[ id ] = { when, offset, duration, durationEdited: true };
			d.when = when;
			d.offset = offset;
			d.duration = duration;
		} );
		this.onchange( { blocks: obj } );
	}
	managercallCroppingB( blcsMap, valA ) {
		const obj = {},
			data = this.data.blocks;

		blcsMap.forEach( ( _blc, id ) => {
			const d = data[ id ],
				duration = d.duration + valA;

			obj[ id ] = { duration, durationEdited: true };
			d.duration = duration;
		} );
		this.onchange( { blocks: obj } );
	}

	// Private small getters
	// ........................................................................
	_getData() { return this.data.blocks; }
	_getRowByTrackId( id ) { return this._rowsByTrackId.get( id ); }
	_incrTrackId( id, incr ) {
		const row = this._getRowByTrackId( id ),
			rowInd = this.__getRowIndexByRow( row ) + incr;

		return this.__getRowByIndex( rowInd ).dataset.track;
	}

	// Mouse and keyboard events
	// ........................................................................
	_keydown( e ) { this.__keydown( e ); }
	_mousemove( e ) { this.__mousemove( e ); }
	_mouseup( e ) { this.__mouseup( e ); }
	_rowMousedown( e ) {
		this.__mousedown( e );
		if ( e.button === 0 && !e.shiftKey && this.__blcsSelected.size ) {
			this.onchange( { blocks: this.__unselectBlocks( {} ) } );
		}
	}
	_blcMousedown( id, e ) {
		e.stopPropagation();
		this.__mousedown( e );
	}
	_drop( e ) {
		const dropData = (
				e.dataTransfer.getData( "pattern-buffer" ) ||
				e.dataTransfer.getData( "pattern-drums" ) ||
				e.dataTransfer.getData( "pattern-keys" ) ).split( ":" );

		if ( dropData.length === 2 ) {
			const id = this._idMax + 1,
				obj = {
					pattern: dropData[ 0 ],
					duration: +dropData[ 1 ],
					durationEdited: false,
					selected: false,
					offset: 0,
					when: this.__roundBeat( this.__getWhenByPageX( e.pageX ) ),
					track: this.__getRowByIndex( this.__getRowIndexByPageY( e.pageY ) ).dataset.track,
				};

			this.data.blocks[ id ] = obj;
			this.onchange( { blocks: { [ id ]: obj } } );
		}
	}

	// Block's functions
	// ........................................................................
	_deleteBlock( id ) {
		this.__blcs.get( id ).remove();
		this.__blcs.delete( id );
		this.__blcsSelected.delete( id );
		this.onremoveBlock( id );
	}
	_setBlock( id, obj ) {
		const blc = gsuiPatternroll.blockTemplate.cloneNode( true );

		blc.dataset.id = id;
		blc.dataset.pattern = obj.pattern;
		blc.onmousedown = this._blcMousedown.bind( this, id );
		obj.selected
			? this.__blcsSelected.set( id, blc )
			: this.__blcsSelected.delete( id );
		this.__blcs.set( id, blc );
		this.block_when( blc, obj.when );
		this.block_track( blc, obj.track );
		this.block_duration( blc, obj.duration );
		this.block_selected( blc, obj.selected );
		this.onaddBlock( id, obj, blc );
	}
	_setBlockProp( id, prop, val ) {
		const uiFn = this[ `block_${ prop }` ];

		if ( uiFn ) {
			const blc = this.__blcs.get( id );

			uiFn.call( this, blc, val );
			if ( prop === "selected" ) {
				val
					? this.__blcsSelected.set( id, blc )
					: this.__blcsSelected.delete( id );
			} else if ( prop === "duration" || prop === "offset" ) {
				this.oneditBlock( id, this.data.blocks[ id ], blc );
			}
		}
	}

	// Data proxy
	// ........................................................................
	_proxyCreate() {
		return Object.freeze( {
			tracks: this._uiTracklist.data,
			blocks: new Proxy( {}, {
				set: this._proxySetBlocks.bind( this ),
				deleteProperty: this._proxyDeleteBlocks.bind( this )
			} )
		} );
	}
	_proxyDeleteBlocks( tar, id ) {
		if ( id in tar ) {
			this._deleteBlock( id );
			delete tar[ id ];
		} else {
			console.warn( `gsuiPatternroll: proxy useless deletion of block [${ id }]` );
		}
		return true;
	}
	_proxySetBlocks( tar, id, obj ) {
		if ( id in tar || !obj ) {
			this._proxyDeleteBlocks( tar, id );
			if ( obj ) {
				console.warn( `gsuiPatternroll: reassignation of block [${ id }]` );
			}
		}
		if ( obj ) {
			const prox = new Proxy( Object.seal( Object.assign( {
					when: 0,
					track: null,
					offset: 0,
					pattern: null,
					selected: false,
					duration: 1,
					durationEdited: false,
				}, obj ) ), {
					set: this._proxySetBlockProp.bind( this, id )
				} );

			tar[ id ] = prox;
			this._idMax = Math.max( this._idMax, id );
			this._setBlock( id, prox );
		}
		return true;
	}
	_proxySetBlockProp( id, tar, prop, val ) {
		tar[ prop ] = val;
		this._setBlockProp( id, prop, val );
		return true;
	}
}

gsuiPatternroll.template = document.querySelector( "#gsuiPatternroll-template" );
gsuiPatternroll.template.remove();
gsuiPatternroll.template.removeAttribute( "id" );
gsuiPatternroll.blockTemplate = document.querySelector( "#gsuiPatternroll-block-template" );
gsuiPatternroll.blockTemplate.remove();
gsuiPatternroll.blockTemplate.removeAttribute( "id" );

class gsuiPianoroll extends gsuiBlocksManager {
	constructor() {
		const root = gsuiPianoroll.template.cloneNode( true ),
			sideTop = root.querySelector( ".gsuiPianoroll-sidePanelTop" ),
			gridTop = root.querySelector( ".gsuiPianoroll-gridPanelTop" ),
			sideBottom = root.querySelector( ".gsuiPianoroll-sidePanelBottom" ),
			gridBottom = root.querySelector( ".gsuiPianoroll-gridPanelBottom" ),
			uiSliderGroup = new gsuiSliderGroup();

		super( root );
		this._uiSliderGroup = uiSliderGroup;
		this._slidersSelect = root.querySelector( ".gsuiPianoroll-slidersSelect" );
		this._slidersSelect.onchange = this._onchangeSlidersSelect.bind( this );
		uiSliderGroup.scrollElement.onscroll = this._onscrollSliderGroup.bind( this,
			uiSliderGroup.scrollElement, this.__rowsContainer );
		sideBottom.onresizing =
		gridBottom.onresizing = panel => {
			const topH = panel.previousElementSibling.style.height,
				bottomH = panel.style.height;

			if ( panel === gridBottom ) {
				sideTop.style.height = topH;
				sideBottom.style.height = bottomH;
			} else {
				gridTop.style.height = topH;
				gridBottom.style.height = bottomH;
			}
		};
		gridBottom.append( uiSliderGroup.rootElement );

		this.data = this._proxyCreate();
		this.uiKeys = new gsuiKeys();
		this._rowsByMidi = {};
		this._currKeyValue = {};
		this.empty();
		this.__sideContent.append( this.uiKeys.rootElement );
		this.__onclickMagnet();
		this._onchangeSlidersSelect();
		uiSliderGroup.onchange = arr => {
			const obj = {},
				nodeName = this._slidersSelect.value;

			arr.forEach( ( [ id, val ] ) => {
				obj[ id ] = { [ nodeName ]: val };
				this.data[ id ][ nodeName ] = val;
			} );
			this.onchange( obj );
		};
		this.setPxPerBeat( 64 );
	}

	empty() {
		Object.keys( this.data ).forEach( k => delete this.data[ k ] );
		this._idMax = 0;
		this.resetKey();
	}
	resetKey() {
		const k = this._currKeyValue;

		k.pan = 0;
		k.gain = .8;
		k.attack = .05;
		k.release = .05;
		k.lowpass = 1;
		k.highpass = 1;
		k.duration = 1;
	}
	resized() {
		this.__resized();
		this.__gridPanelResized();
	}
	attached() {
		this.__attached();
		this.scrollToMiddle();
		this._uiSliderGroup.attached();
	}
	setPxPerBeat( px ) {
		if ( super.setPxPerBeat( px ) ) {
			this.__blcs.forEach( blc => blc._dragline.redraw() );
		}
	}
	setFontSize( px ) {
		if ( super.setFontSize( px ) ) {
			this.__blcs.forEach( blc => blc._dragline.redraw() );
		}
	}
	scrollToMiddle() {
		const rows = this.__rowsContainer;

		rows.scrollTop = ( rows.scrollHeight - rows.clientHeight ) / 2;
	}
	scrollToKeys() {
		const rows = this.__rowsContainer,
			smp = rows.querySelector( ".gsuiBlocksManager-block" );

		if ( smp ) {
			rows.scrollTop += smp.getBoundingClientRect().top -
				rows.getBoundingClientRect().top - 3.5 * this.__fontSize;
		}
	}
	timeSignature( a, b ) {
		super.timeSignature( a, b );
		this._uiSliderGroup.timeSignature( a, b );
	}
	octaves( from, nb ) {
		this.empty();
		Object.keys( this._rowsByMidi ).forEach( k => delete this._rowsByMidi[ k ] );

		const rows = this.uiKeys.octaves( from, nb );

		rows.forEach( el => {
			const midi = +el.dataset.midi;

			el.onmousedown = this._rowMousedown.bind( this, midi );
			el.firstElementChild.style.fontSize = `${ this.__pxPerBeat }px`;
			this._rowsByMidi[ midi ] = el;
		} );
		this.__rowsWrapinContainer.style.height = `${ rows.length }em`;
		this.__rowsWrapinContainer.prepend( ...rows );
	}

	// Block's UI functions
	// ........................................................................
	block_sliderUpdate( nodeName, el, val ) {
		if ( this._slidersSelect.value === nodeName ) {
			this._uiSliderGroup.setProp( el.dataset.id, "value", val );
			this._currKeyValue[ nodeName ] = val;
		}
	}
	block_pan( el, val ) { this.block_sliderUpdate( "pan", el, val ); }
	block_gain( el, val ) { this.block_sliderUpdate( "gain", el, val ); }
	block_lowpass( el, val ) { this.block_sliderUpdate( "lowpass", el, val ); }
	block_highpass( el, val ) { this.block_sliderUpdate( "highpass", el, val ); }
	block_attack( el, beat ) {
		el._attack.style.width = `${ beat }em`;
		this._currKeyValue.attack = beat;
	}
	block_release( el, beat ) {
		el._release.style.width = `${ beat }em`;
		this._currKeyValue.release = beat;
	}
	block_when( el, when ) {
		super.block_when( el, when );
		this._uiSliderGroup.setProp( el.dataset.id, "when", when );
		this.block_redrawDragline( el );
	}
	block_duration( el, dur ) {
		super.block_duration( el, dur );
		this._uiSliderGroup.setProp( el.dataset.id, "duration", dur );
		this._currKeyValue.duration = dur;
		this.block_redrawDragline( el );
	}
	block_selected( el, b ) {
		super.block_selected( el, b );
		this._uiSliderGroup.setProp( el.dataset.id, "selected", b );
	}
	block_row( el, rowIncr ) {
		this.block_key( el, this.data[ el.dataset.id ].key - rowIncr );
	}
	block_key( el, midi ) {
		const row = this._getRowByMidi( midi );

		el.dataset.key = gsuiKeys.keyNames.en[ row.dataset.key ];
		row.firstElementChild.append( el );
		this.block_redrawDragline( el );
	}
	block_prev( el, id ) {
		const blc = this.__blcs.get( id );

		el.classList.toggle( "gsuiPianoroll-block-prevLinked", !!id );
		blc && blc._dragline.linkTo( el._draglineDrop );
	}
	block_next( el, id ) {
		const blc = this.__blcs.get( id );

		el.classList.toggle( "gsuiPianoroll-block-nextLinked", !!id );
		el._dragline.linkTo( blc && blc._draglineDrop );
	}
	block_redrawDragline( el ) {
		const key = this.data[ el.dataset.id ],
			blcPrev = this.__blcs.get( key.prev );

		el._dragline.redraw();
		blcPrev && blcPrev._dragline.redraw();
	}

	// Private small getters
	// ........................................................................
	_getData() { return this.data; }
	_getRowByMidi( midi ) { return this._rowsByMidi[ midi ]; }

	// Mouse and keyboard events
	// ........................................................................
	_keydown( e ) { this.__keydown( e ); }
	_mousemove( e ) { this.__mousemove( e ); }
	_mouseup( e ) {
		if ( this.__status === "cropping-b" ) {
			this.__blcsEditing.forEach( blc => {
				blc._attack.style.maxWidth =
				blc._release.style.maxWidth = "";
			} );
		}
		this.__mouseup( e );
	}
	_onscrollRows() {
		this._onscrollSliderGroup( this.__rowsContainer, this._uiSliderGroup.scrollElement );
	}
	_loop( a, b ) { this._uiSliderGroup.loop( a, b ); }
	_currentTime( beat ) { this._uiSliderGroup.currentTime( beat ); }
	_setPxPerBeat( ppb ) { this._uiSliderGroup.setPxPerBeat( ppb ); }

	// ........................................................................
	_blcMousedown( id, e ) {
		const dline = e.currentTarget._dragline.rootElement;

		e.stopPropagation();
		if ( !dline.contains( e.target ) ) {
			this.__mousedown( e );
			if ( this.__status === "cropping-b" ) {
				this.__blcsEditing.forEach( ( blc, id ) => {
					const { attack, release } = this.data[ id ],
						attRel = attack + release;

					blc._attack.style.maxWidth = `${ attack / attRel * 100 }%`;
					blc._release.style.maxWidth = `${ release / attRel * 100 }%`;
				} );
			}
		}
	}
	_rowMousedown( key, e ) {
		this.__mousedown( e );
		if ( e.button === 0 && !e.shiftKey ) {
			const id = this._idMax + 1,
				curr = this._currKeyValue,
				keyObj = {
					key,
					pan: curr.pan,
					gain: curr.gain,
					attack: curr.attack,
					release: curr.release,
					lowpass: curr.lowpass,
					highpass: curr.highpass,
					duration: curr.duration,
					selected: false,
					prev: null,
					next: null,
					when: this.__roundBeat( this.__getWhenByPageX( e.pageX ) ),
				};

			this.data[ id ] = keyObj;
			this.onchange( this.__unselectBlocks( { [ id ]: keyObj } ) );
		}
	}
	_onscrollSliderGroup( elSrc, elLink ) {
		if ( this._slidersWrapScrollLeft !== elSrc.scrollLeft ) {
			this._slidersWrapScrollLeft =
			elLink.scrollLeft = elSrc.scrollLeft;
		}
	}
	_onchangeSlidersSelect() {
		const data = this.data,
			nodeName = this._slidersSelect.value,
			slidGroup = this._uiSliderGroup;

		switch ( nodeName ) {
			case "pan":      slidGroup.minMaxExp( -1, 1 ); break;
			case "gain":     slidGroup.minMaxExp(  0, 1 ); break;
			case "lowpass":  slidGroup.minMaxExp(  0, 1, 3 ); break;
			case "highpass": slidGroup.minMaxExp(  0, 1, 3 ); break;
		}
		this.__blcs.forEach( ( blc, id ) => {
			this._uiSliderGroup.setProp( id, "value", data[ id ][ nodeName ] );
		} );
	}

	// Key's functions
	// ........................................................................
	_deleteKey( id ) {
		const key = this.data[ id ],
			blc = this.__blcs.get( id ),
			blcPrev = this.__blcs.get( key.prev );

		blc.remove();
		if ( blcPrev ) {
			blcPrev._dragline.linkTo( null );
		}
		this.__blcs.delete( id );
		this.__blcsSelected.delete( id );
		this._uiSliderGroup.delete( id );
	}
	_setKey( id, obj ) {
		const blc = gsuiPianoroll.blockTemplate.cloneNode( true ),
			dragline = new gsuiDragline();

		blc.dataset.id = id;
		blc.onmousedown = this._blcMousedown.bind( this, id );
		dragline.onchange = this._onchangeDragline.bind( this, id );
		blc._attack = blc.querySelector( ".gsuiPianoroll-block-attack" );
		blc._release = blc.querySelector( ".gsuiPianoroll-block-release" );
		blc._dragline = dragline;
		blc._draglineDrop = blc.querySelector( ".gsuiDragline-drop" );
		blc.append( dragline.rootElement );
		dragline.getDropAreas = this._getDropAreas.bind( this, id );
		this.__blcs.set( id, blc );
		obj.selected
			? this.__blcsSelected.set( id, blc )
			: this.__blcsSelected.delete( id );
		this._uiSliderGroup.set( id, obj.when, obj.duration, obj[ this._slidersSelect.value ] );
		this.block_key( blc, obj.key );
		this.block_when( blc, obj.when );
		this.block_duration( blc, obj.duration );
		this.block_selected( blc, obj.selected );
		this.block_attack( blc, obj.attack );
		this.block_release( blc, obj.release );
		this.block_pan( blc, obj.pan );
		this.block_gain( blc, obj.gain );
		this.block_lowpass( blc, obj.lowpass );
		this.block_highpass( blc, obj.highpass );
		this.block_prev( blc, obj.prev );
		this.block_next( blc, obj.next );
	}
	_getDropAreas( id ) {
		const obj = this.data[ id ],
			when = obj.when + obj.duration,
			arr = [];

		this.__blcs.forEach( ( blc, blcId ) => {
			const obj = this.data[ blcId ];

			if ( obj.when >= when && ( obj.prev === null || obj.prev === id ) ) {
				arr.push( blc.firstElementChild );
			}
		} );
		return arr;
	}
	_onchangeDragline( id, el, prevEl ) {
		const obj = {},
			dat = this.data,
			prevId = prevEl && prevEl.parentNode.dataset.id;

		if ( el ) {
			const tarId = el.parentNode.dataset.id;

			obj[ id ] = { next: tarId };
			dat[ id ].next = tarId;
			obj[ tarId ] = { prev: id };
			dat[ tarId ].prev = id;
			if ( prevEl ) {
				obj[ prevId ] = { prev: null };
				dat[ prevId ].prev = null;
			}
		} else {
			obj[ id ] = { next: null };
			obj[ prevId ] = { prev: null };
			dat[ id ].next =
			dat[ prevId ].prev = null;
		}
		this.onchange( obj );
	}

	// Data proxy
	// ........................................................................
	_proxyCreate() {
		return new Proxy( {}, {
			set: this._proxySetKey.bind( this ),
			deleteProperty: this._proxyDeleteKey.bind( this )
		} );
	}
	_proxyDeleteKey( tar, id ) {
		if ( id in tar ) {
			this._deleteKey( id );
			delete tar[ id ];
		} else {
			console.warn( `gsuiPianoroll: proxy useless deletion of [${ id }]` );
		}
		return true;
	}
	_proxySetKey( tar, id, obj ) {
		if ( id in tar || !obj ) {
			this._proxyDeleteKey( tar, id );
			if ( obj ) {
				console.warn( `gsuiPianoroll: reassignation of [${ id }]` );
			}
		}
		if ( obj ) {
			const prox = new Proxy( Object.seal( Object.assign( {
					key: 60,
					when: 0,
					pan: 0,
					gain: 1,
					attack: .05,
					release: .05,
					lowpass: 1,
					highpass: 1,
					duration: 1,
					selected: false,
					prev: null,
					next: null,
				}, obj ) ), {
					set: this._proxySetKeyProp.bind( this, id )
				} );

			tar[ id ] = prox;
			this._idMax = Math.max( this._idMax, id );
			this._setKey( id, prox );
		}
		return true;
	}
	_proxySetKeyProp( id, tar, prop, val ) {
		if ( prop === "offset" ) {
			console.warn( "gsuiPianoroll: proxy set useless 'offset' to key" );
		} else {
			const blc = this.__blcs.get( id ),
				uiFn = this[ `block_${ prop }` ];

			tar[ prop ] = val;
			if ( uiFn ) {
				uiFn.call( this, blc, val );
			}
			if ( prop === "selected" ) {
				val
					? this.__blcsSelected.set( id, blc )
					: this.__blcsSelected.delete( id );
			}
		}
		return true;
	}
}

gsuiPianoroll.template = document.querySelector( "#gsuiPianoroll-template" );
gsuiPianoroll.template.remove();
gsuiPianoroll.template.removeAttribute( "id" );

gsuiPianoroll.blockTemplate = document.querySelector( "#gsuiPianoroll-block-template" );
gsuiPianoroll.blockTemplate.remove();
gsuiPianoroll.blockTemplate.removeAttribute( "id" );

Object.assign( gsuiPianoroll.prototype, {
	managercallDuplicating( blcsMap, valA ) {
		const obj = {},
			mapIds = new Map();

		blcsMap.forEach( ( _blc, id ) => {
			const d = this.data[ id ],
				nId = `${ ++this._idMax }`,
				copy = Object.assign( {}, d );

			copy.when += valA;
			copy.prev =
			copy.next = null;
			obj[ id ] = { selected: false };
			obj[ nId ] =
			this.data[ nId ] = copy;
			mapIds.set( id, nId );
			d.selected = false;
		} );
		blcsMap.forEach( ( _blc, id ) => {
			const d = this.data[ id ];

			if ( blcsMap.has( d.next ) ) {
				const idCurr = mapIds.get( id ),
					idNext = mapIds.get( d.next );

				this.data[ idCurr ].next = obj[ idCurr ].next = idNext;
				this.data[ idNext ].prev = obj[ idNext ].prev = idCurr;
			}
		} );
		this.onchange( obj );
	},
	managercallSelecting( blcsMap ) {
		const obj = {};

		blcsMap.forEach( ( _blc, id ) => {
			const d = this.data[ id ],
				selected = !d.selected;

			obj[ id ] = { selected };
			d.selected = selected;
		} );
		this.onchange( obj );
	},
	managercallMoving( blcsMap, valA, valB ) {
		const obj = {},
			when = Math.abs( valA ) > .000001 ? valA : 0;

		blcsMap.forEach( ( _blc, id ) => {
			const d = this.data[ id ],
				o = {};

			obj[ id ] = o;
			if ( when ) {
				o.when =
				d.when += when;
			}
			if ( valB ) {
				o.key =
				d.key -= valB;
			}
		} );
		this.onchange( obj );
	},
	managercallDeleting( blcsMap ) {
		const obj = {};

		blcsMap.forEach( ( _blc, id ) => {
			const { prev, next } = this.data[ id ];

			obj[ id ] = undefined;
			delete this.data[ id ];
			if ( prev !== null ) {
				const objPrev = obj[ prev ];

				if ( !( prev in obj ) || objPrev !== undefined ) {
					objPrev
						? objPrev.next = null
						: obj[ prev ] = { next: null };
				}
			}
			if ( next !== null ) {
				const objNext = obj[ next ];

				if ( !( next in obj ) || objNext !== undefined ) {
					objNext
						? objNext.prev = null
						: obj[ next ] = { prev: null };
				}
			}
		} );
		this.__unselectBlocks( obj );
		this.onchange( obj );
	},
	managercallCroppingB( blcsMap, valA ) {
		const obj = {};

		blcsMap.forEach( ( _blc, id ) => {
			const d = this.data[ id ],
				attRel = d.attack + d.release,
				duration = d.duration + valA,
				keyobj = { duration };

			if ( duration < attRel ) {
				d.attack =
				keyobj.attack = +( d.attack / attRel * duration ).toFixed( 3 );
				d.release =
				keyobj.release = +( d.release / attRel * duration ).toFixed( 3 );
			}
			obj[ id ] = keyobj;
			d.duration = duration;
		} );
		this.onchange( obj );
	},

	// .........................................................................
	managercallAttack( blcsMap, valA ) {
		this._managercallAttRel( "attack", blcsMap, valA );
	},
	managercallRelease( blcsMap, valA ) {
		this._managercallAttRel( "release", blcsMap, valA );
	},
	_managercallAttRel( prop, blcsMap, incr ) {
		const obj = {};

		blcsMap.forEach( this._managercallAttRelEach.bind( this, obj, prop, incr ) );
		this.onchange( obj );
	},
	_managercallAttRelEach( obj, prop, incr, _blc, id ) {
		const d = this.data[ id ],
			val = +( d[ prop ] + incr ).toFixed( 3 );

		obj[ id ] = { [ prop ]: val };
		d[ prop ] = val;
	},
} );

class gsuiDrumrows {
	constructor() {
		const root = gsuiDrumrows.template.cloneNode( true ),
			reorder = new gsuiReorder( {
				rootElement: root,
				direction: "column",
				dataTransferType: "drumrow",
				itemSelector: ".gsuiDrumrows .gsuiDrumrow",
				handleSelector: ".gsuiDrumrows .gsuiDrumrow-grip",
				parentSelector: ".gsuiDrumrows",
				onchange: this._onreorderRows.bind( this ),
			} );

		this.rootElement = root;
		this.onchange =
		this.onlivestop =
		this.onlivestart = () => {};
		this._rows = new Map();
		this._lines = new Map();
		this._reorder = reorder;
		this._dragoverId =
		this._elDragover =
		this._elLinesParent = null;
		Object.seal( this );

		root.ondrop = this._ondropRows.bind( this );
		root.onclick = this._onclickRows.bind( this );
		root.ondragover = this._ondragoverRows.bind( this );
		root.ondragleave = this._ondragleaveRows.bind( this );
		root.onmousedown = this._onmousedownRows.bind( this );
		root.oncontextmenu = this._oncontextmenuRows.bind( this );
		root.onanimationend = this._onanimationendRows.bind( this );
	}

	// .........................................................................
	setLinesParent( el, childClass ) {
		this._elLinesParent = el;
		this._reorder.setShadowElement( el );
		this._reorder.setShadowChildClass( childClass );
	}
	setFontSize( fs ) {
		this.rootElement.style.fontSize =
		this._elLinesParent.style.fontSize = `${ fs }px`;
	}
	reorderDrumrows( obj ) {
		gsuiReorder.listReorder( this.rootElement, obj );
		gsuiReorder.listReorder( this._elLinesParent, obj );
	}
	playRow( id ) {
		const rect = document.createElement( "div" );

		rect.classList.add( "gsuiDrumrow-startCursor" );
		this._rows.get( id ).querySelector( ".gsuiDrumrow-waveWrap" ).append( rect );
	}
	stopRow( id ) {
		this._rows.get( id ).querySelectorAll( ".gsuiDrumrow-startCursor" )
			.forEach( el => el.remove() );
	}

	// .........................................................................
	add( id, elLine ) {
		const elRow = gsuiDrumrows.templateRow.cloneNode( true );

		elRow.dataset.id =
		elLine.dataset.id = id;
		this._rows.set( id, elRow );
		this._lines.set( id, elLine );
		this.rootElement.append( elRow );
		this._elLinesParent.append( elLine );
	}
	remove( id ) {
		this._rows.get( id ).remove();
		this._lines.get( id ).remove();
		this._rows.delete( id );
		this._lines.delete( id );
	}
	change( id, prop, val ) {
		switch ( prop ) {
			case "name": this._changeName( id, val ); break;
			case "order": this._changeOrder( id, val ); break;
			case "toggle": this._changeToggle( id, val ); break;
			case "pattern": this._changePattern( id, val ); break;
			case "duration": this._changeDuration( id, val ); break;
		}
	}
	_changeName( id, name ) {
		this._rows.get( id ).querySelector( ".gsuiDrumrow-name" ).textContent = name;
	}
	_changeToggle( id, b ) {
		this._rows.get( id ).classList.toggle( "gsuiDrumrow-mute", !b );
		this._lines.get( id ).classList.toggle( "gsuiDrumrow-mute", !b );
	}
	_changeDuration( id, dur ) {
		this._rows.get( id ).querySelector( ".gsuiDrumrow-waveWrap" ).style.animationDuration = `${ dur * 2 }s`;
	}
	_changePattern( id, svg ) {
		const elWave = this._rows.get( id ).querySelector( ".gsuiDrumrow-waveWrap" );

		if ( elWave.firstChild ) {
			elWave.firstChild.remove();
		}
		if ( svg ) {
			svg.classList.add( "gsuiDrumrow-wave" );
			elWave.append( svg );
		}
	}
	_changeOrder( id, order ) {
		this._rows.get( id ).dataset.order =
		this._lines.get( id ).dataset.order = order;
	}

	// .........................................................................
	static _isDrumrow( el ) {
		return (
			el.classList.contains( "gsuiDrumrow" ) ? el :
			el.classList.contains( "gsuiDrumrows-drop" ) ||
			el.classList.contains( "gsuiDrumrow-grip" ) ||
			el.classList.contains( "gsuiDrumrow-toggle" ) ||
			el.classList.contains( "gsuiDrumrow-delete" ) ? el.parentNode : null
		);
	}

	// events:
	// .........................................................................
	_onreorderRows( elRow ) {
		const rows = gsuiReorder.listComputeOrderChange( this.rootElement, {} );

		this.onchange( "reorderDrumrow", elRow.dataset.id, rows );
	}
	_onclickRows( e ) {
		const { classList, parentNode } = e.target;

		if ( classList.contains( "gsuiDrumrow-toggle" ) ) {
			this.onchange( "toggleDrumrow", parentNode.dataset.id );
		} else if ( classList.contains( "gsuiDrumrow-delete" ) ) {
			this.onchange( "removeDrumrow", parentNode.dataset.id );
		}
	}
	_onmousedownRows( e ) {
		if ( e.target.classList.contains( "gsuiDrumrow" ) ) {
			if ( e.button === 0 ) {
				this.onlivestart( e.target.dataset.id );
			} else if ( e.button === 2 ) {
				this.onlivestop( e.target.dataset.id );
			}
		}
	}
	_onanimationendRows( e ) {
		if ( e.target.classList.contains( "gsuiDrumrow-startCursor" ) ) {
			e.target.remove();
		}
	}
	_oncontextmenuRows( e ) {
		const { classList, parentNode } = e.target;

		e.preventDefault();
		if ( classList.contains( "gsuiDrumrow-toggle" ) ) {
			this.onchange( "toggleOnlyDrumrow", parentNode.dataset.id );
		}
	}
	_ondropRows( e ) {
		if ( this._dragoverId ) {
			const [ patId ] = e.dataTransfer.getData( "pattern-buffer" ).split( ":" );

			if ( patId ) {
				this._dragoverId === Infinity
					? this.onchange( "addDrumrow", patId )
					: this.onchange( "changeDrumrowPattern", this._dragoverId, patId );
			}
		}
		this._ondragleaveRows();
	}
	_ondragleaveRows() {
		if ( this._elDragover ) {
			this._elDragover.classList.remove( "gsuiDrumrows-dragover" );
			this._elDragover =
			this._dragoverId = null;
		}
	}
	_ondragoverRows( e ) {
		if ( e.dataTransfer.types.includes( "pattern-buffer" ) ) {
			const tar = e.target,
				isParent = tar.classList.contains( "gsuiDrumrows" ),
				elDragover = isParent
					? tar
					: gsuiDrumrows._isDrumrow( tar );

			if ( elDragover !== this._elDragover ) {
				this._dragoverId = null;
				if ( isParent ) {
					this._dragoverId = Infinity;
				} else if ( elDragover ) {
					this._dragoverId = elDragover.dataset.id;
				}
				if ( this._elDragover ) {
					this._elDragover.classList.remove( "gsuiDrumrows-dragover" );
				}
				this._elDragover = elDragover;
				if ( elDragover ) {
					elDragover.classList.add( "gsuiDrumrows-dragover" );
				}
			}
		}
	}
}

gsuiDrumrows.template = document.querySelector( "#gsuiDrumrows-template" );
gsuiDrumrows.template.remove();
gsuiDrumrows.template.removeAttribute( "id" );

gsuiDrumrows.templateRow = document.querySelector( "#gsuiDrumrow-template" );
gsuiDrumrows.templateRow.remove();
gsuiDrumrows.templateRow.removeAttribute( "id" );

Object.freeze( gsuiDrumrows );

class gsuiDrums {
	constructor() {
		const root = gsuiDrums.template.cloneNode( true ),
			elLines = root.querySelector( ".gsuiDrums-lines" ),
			timeline = new gsuiTimeline(),
			drumrows = new gsuiDrumrows(),
			beatlines = new gsuiBeatlines( elLines ),
			panels = new gsuiPanels( root.querySelector( ".gsuiDrums-panels" ) ),
			elRows = drumrows.rootElement;

		this.rootElement = root;
		this.drumrows = drumrows;
		this.oninput =
		this.onchange =
		this.onchangeLoop =
		this.onchangeCurrentTime = () => {};

		this._panels = panels;
		this._timeline = timeline;
		this._beatlines = beatlines;
		this._elRows = elRows;
		this._elLines = elLines;
		this._timeoutIdBeatlines = null;
		this._width =
		this._height =
		this._offset =
		this._scrollTop =
		this._scrollLeft =
		this._drumHoverX =
		this._drumHoverBeat =
		this._linesPanelWidth = 0;
		this._stepsPerBeat = 4;
		this._pxPerBeat = 80;
		this._pxPerStep = this._pxPerBeat / this._stepsPerBeat;
		this._dragging = false;
		this._draggingRowId = null;
		this._draggingWhenStart = 0;
		this._attached =
		this._drumHovering = false;
		this._drumsMap = new Map();
		this._previewDrums = new Map();
		this._elLoopA = this._qS( "loopA" );
		this._elLoopB = this._qS( "loopB" );
		this._elLinesAbs = this._qS( "linesAbsolute" );
		this._elDrumHover = this._qS( "drumHover" );
		this._elCurrentTime = this._qS( "currentTime" );
		this._nlLinesIn = root.getElementsByClassName( "gsuiDrums-lineIn" );
		this._onmouseupNewDrum = this._onmouseupNewDrum.bind( this );
		Object.seal( this );

		root.oncontextmenu = e => e.preventDefault();
		this._elDrumHover.remove();
		this._elDrumHover.onmousedown = this._onmousedownNewDrum.bind( this );
		drumrows.setLinesParent( this._elLinesAbs, "gsuiDrums-line" );
		elRows.onscroll = this._onscrollRows.bind( this );
		elLines.onclick = this._onclickLines.bind( this );
		elLines.onscroll = this._onscrollLines.bind( this );
		elLines.onwheel = this._onwheelLines.bind( this );
		elLines.onmousemove = this._mousemoveLines.bind( this );
		timeline.oninputLoop = this._oninputLoop.bind( this );
		timeline.onchangeLoop = ( isLoop, a, b ) => this.onchangeLoop( isLoop, a, b );
		timeline.onchangeCurrentTime = t => {
			this._setCurrentTime( t );
			this.onchangeCurrentTime( t );
		};
		this._qS( "sidePanel" ).append( drumrows.rootElement );
		this._qS( "timelineWrap" ).append( timeline.rootElement );
		this._qS( "linesPanel" ).onresizing = this._linesPanelResizing.bind( this );
		this._elLinesAbs.onmouseleave = this._onmouseleaveLines.bind( this );
	}

	// .........................................................................
	attached() {
		this._attached = true;
		this._panels.attached();
		this._timeline.resized();
		this._timeline.offset( this._offset, this._pxPerBeat );
	}
	resize( w, h ) {
		this._width = w;
		this._height = h;
		this._timeline.resized();
		this._timeline.offset( this._offset, this._pxPerBeat );
	}
	toggleShadow( b ) {
		this.rootElement.classList.toggle( "gsuiDrums-shadowed", b );
	}
	currentTime( beat ) {
		this._timeline.currentTime( beat );
		this._setCurrentTime( beat );
	}
	loop( a, b ) {
		this._timeline.loop( a, b );
		this._setLoop( Number.isFinite( a ), a, b );
	}
	timeSignature( a, b ) {
		this._stepsPerBeat = b;
		this._timeline.timeSignature( a, b );
		this._beatlines.timeSignature( a, b );
		this.setPxPerBeat( this._pxPerBeat );
		this._elDrumHover.style.width =
		this._elCurrentTime.style.width = `${ 1 / b }em`;
	}
	setPxPerBeat( ppb ) {
		const ppbpx = `${ ppb }px`;

		this._pxPerBeat = ppb;
		this._pxPerStep = ppb / this._stepsPerBeat;
		this._timeline.offset( this._offset, ppb );
		this._beatlines.pxPerBeat( ppb );
		this._elLoopA.style.fontSize =
		this._elLoopB.style.fontSize =
		this._elCurrentTime.style.fontSize = ppbpx;
		Array.prototype.forEach.call( this._nlLinesIn, el => el.style.fontSize = ppbpx );
		clearTimeout( this._timeoutIdBeatlines );
		this._timeoutIdBeatlines = setTimeout( () => this._beatlines.render(), 100 );
	}

	// .........................................................................
	addDrum( id, drum ) {
		const elDrm = gsuiDrums.templateDrum.cloneNode( true ),
			stepDur = 1 / this._stepsPerBeat;

		elDrm.dataset.id = id;
		elDrm.style.left = `${ drum.when }em`;
		elDrm.style.width = `${ stepDur }em`;
		this._qS( `line[data-id='${ drum.row }'] .gsuiDrums-lineIn` ).append( elDrm );
		this._drumsMap.set( id, [ drum.row, Math.round( drum.when / stepDur ), elDrm ] );
	}
	removeDrum( id ) {
		const elDrm = this._drumsMap.get( id )[ 2 ];

		elDrm.remove();
		this._drumsMap.delete( id );
	}
	createDrumrow( id ) {
		const elLine = gsuiDrums.templateLine.cloneNode( true );

		elLine.firstElementChild.style.fontSize = `${ this._pxPerBeat }px`;
		return elLine;
	}

	// .........................................................................
	_qS( c ) {
		return this.rootElement.querySelector( `.gsuiDrums-${ c }` );
	}
	_has( el, c ) {
		return el.classList.contains( `gsuiDrums-${ c }` );
	}
	_setCurrentTime( t ) {
		const sPB = 1 / this._stepsPerBeat,
			tr = ( t / sPB | 0 ) * sPB;

		this._elCurrentTime.style.left = `${ tr }em`;
	}
	_setLoop( isLoop, a, b ) {
		this._elLoopA.classList.toggle( "gsuiDrums-loopOn", isLoop );
		this._elLoopB.classList.toggle( "gsuiDrums-loopOn", isLoop );
		if ( isLoop ) {
			this._elLoopA.style.width = `${ a }em`;
			this._elLoopB.style.left = `${ b }em`;
		}
	}
	_hideDrumHover() {
		this._drumHovering = false;
		this._elDrumHover.remove();
	}
	_createPreviewDrum( rowId, when ) {
		const el = gsuiDrums.templateDrum.cloneNode( true );

		el.classList.add( "gsuiDrums-drumPreview" );
		el.style.left = `${when }em`;
		el.style.width = `${ 1 / this._stepsPerBeat }em`;
		this._qS( `line[data-id='${ rowId }'] .gsuiDrums-lineIn` ).append( el );
		return el;
	}
	_createPreviewDrums( whenFrom, whenTo ) {
		const rowId = this._draggingRowId,
			adding = this._dragging === 1,
			stepDur = 1 / this._stepsPerBeat,
			whenA = Math.round( Math.min( whenFrom, whenTo ) / stepDur ),
			whenB = Math.round( Math.max( whenFrom, whenTo ) / stepDur ),
			added = new Map(),
			drumpMap = adding ? null : 0;

		for ( let w = whenA; w <= whenB; ++w ) {
			added.set( w );
			if ( !this._previewDrums.has( w ) ) {
				if ( adding ) {
					this._previewDrums.set( w, this._createPreviewDrum( rowId, w * stepDur ) );
				} else {
					let drm;

					this._drumsMap.forEach( arr => {
						if ( arr[ 0 ] === rowId && arr[ 1 ] === w ) {
							drm = arr[ 2 ];
							drm.classList.add( "gsuiDrums-previewDeleted" );
						}
					} );
					this._previewDrums.set( w, drm );
				}
			}
		}
		this._previewDrums.forEach( ( el, w ) => {
			if ( !added.has( w ) ) {
				if ( adding ) {
					el.remove();
				} else if ( el ) {
					el.classList.remove( "gsuiDrums-previewDeleted" );
				}
				this._previewDrums.delete( w );
			}
		} );
	}
	_removePreviewDrums( adding ) {
		this._previewDrums.forEach( el => {
			if ( adding ) {
				el.remove();
			} else if ( el ) {
				el.classList.remove( "gsuiDrums-previewDeleted" );
			}
		} );
		this._previewDrums.clear();
	}

	// events:
	// .........................................................................
	_oninputLoop( isLoop, a, b ) {
		this._setLoop( isLoop, a, b );
	}
	_linesPanelResizing( pan ) {
		const width = pan.clientWidth;

		if ( this._offset > 0 ) {
			this._offset -= ( width - this._linesPanelWidth ) / this._pxPerBeat;
			this._elLines.scrollLeft -= width - this._linesPanelWidth;
		}
		this._linesPanelWidth = width;
		this._timeline.resized();
		this._timeline.offset( this._offset, this._pxPerBeat );
	}
	_onclickLines( e ) {
		const elStep = e.target.parentNode,
			step = elStep.dataset.step,
			rowId = elStep.parentNode.parentNode.dataset.id;

		if ( step ) {
			lg( "_onclickLines", {step, rowId, elStep}, e );
		}
	}
	_onscrollRows( e ) {
		const scrollTop = this._elRows.scrollTop;

		if ( scrollTop !== this._scrollTop ) {
			this._scrollTop =
			this._elLines.scrollTop = scrollTop;
		}
	}
	_onscrollLines( e ) {
		const scrollTop = this._elLines.scrollTop,
			scrollLeft = this._elLines.scrollLeft;

		if ( scrollTop !== this._scrollTop ) {
			this._scrollTop =
			this._elRows.scrollTop = scrollTop;
		}
		if ( scrollLeft !== this._scrollLeft ) {
			this._scrollLeft = scrollLeft;
			this._offset = scrollLeft / this._pxPerBeat;
			this._timeline.offset( this._offset, this._pxPerBeat );
		}
		this.__mousemoveLines();
	}
	_onwheelLines( e ) {
		if ( e.ctrlKey ) {
			const elLines = this._elLines,
				layerX = e.pageX - elLines.getBoundingClientRect().left + elLines.scrollLeft,
				ppb = Math.round( Math.min( Math.max( 48, this._pxPerBeat * ( e.deltaY > 0 ? .9 : 1.1 ) ), 128 ) );

			this._scrollLeft =
			elLines.scrollLeft += layerX / this._pxPerBeat * ( ppb - this._pxPerBeat );
			this._offset = elLines.scrollLeft / ppb;
			this.setPxPerBeat( ppb );
			this.__mousemoveLines();
		}
	}
	_mousemoveLines( e ) {
		const tar = e.target,
			elLine = this._has( tar, "lineIn" ) ? tar :
				this._has( tar, "drum" ) ? tar.parentNode : null;

		if ( elLine ) {
			this._drumHovering = true;
			this._drumHoverX = e.pageX;
			this.__mousemoveLines();
			if ( !this._dragging && this._elDrumHover.parentNode !== elLine ) {
				elLine.append( this._elDrumHover );
			}
		}
	}
	__mousemoveLines() {
		if ( this._drumHovering ) {
			const el = this._elDrumHover,
				bcr = this._elLinesAbs.getBoundingClientRect(),
				pageX = this._drumHoverX,
				beat = ( ( pageX - bcr.left ) / this._pxPerStep | 0 ) / this._stepsPerBeat;

			this._drumHoverBeat = beat;
			el.style.left = `${ beat * this._pxPerBeat }px`;
			if ( this._dragging ) {
				this._createPreviewDrums( this._draggingWhenStart, beat );
			}
		}
	}
	_onmouseleaveLines() {
		if ( !this._dragging ) {
			this._hideDrumHover();
		}
	}
	_onmousedownNewDrum( e ) {
		if ( !this._dragging ) {
			const when = this._drumHoverBeat;

			this._dragging = e.button === 0 ? 1 : 2;
			this._draggingRowId = this._elDrumHover.parentNode.parentNode.dataset.id;
			this._draggingWhenStart = when;
			this._createPreviewDrums( when, when );
			window.getSelection().removeAllRanges();
			document.addEventListener( "mouseup", this._onmouseupNewDrum );
		}
	}
	_onmouseupNewDrum() {
		const adding = this._dragging === 1,
			act = adding ? "addDrums" : "removeDrums";

		this._dragging = false;
		this._removePreviewDrums( adding );
		document.removeEventListener( "mouseup", this._onmouseupNewDrum );
		this.onchange( act, this._draggingRowId, this._draggingWhenStart, this._drumHoverBeat );
	}
}

gsuiDrums.template = document.querySelector( "#gsuiDrums-template" );
gsuiDrums.template.remove();
gsuiDrums.template.removeAttribute( "id" );

gsuiDrums.templateLine = document.querySelector( "#gsuiDrums-line-template" );
gsuiDrums.templateLine.remove();
gsuiDrums.templateLine.removeAttribute( "id" );

gsuiDrums.templateDrum = document.querySelector( "#gsuiDrums-drum-template" );
gsuiDrums.templateDrum.remove();
gsuiDrums.templateDrum.removeAttribute( "id" );

class gsuiKeys {
	constructor() {
		const root = document.createElement( "div" );

		this.rootElement = root;
		this._nlKeys = root.childNodes;
		this._keysDown = new Map();
		this._gain = 1;
		this._nbOct =
		this._rootTop =
		this._octStart =
		this._blackKeyR =
		this._blackKeyH =
		this._keyIndMouse = 0;
		this.onkeyup =
		this.onkeydown =
		this._elKeyMouse = null;
		this._evmuRoot = this._evmuRoot.bind( this );
		this._evmmRoot = this._evmmRoot.bind( this );
		Object.seal( this );

		root.className = "gsuiKeys";
		root.onmousedown = this._evmdRoot.bind( this );
	}

	remove() {
		this.empty();
		this.rootElement.remove();
	}
	empty() {
		Array.from( this._nlKeys ).forEach( el => {
			el.remove();
			el._rowElement.remove();
		} );
	}
	octaves( start, nbOct ) {
		const root = this.rootElement,
			maxOct = start + nbOct;

		this.empty();
		this._nbOct = nbOct;
		this._octStart = start;
		root.style.counterReset = `octave ${ maxOct }`;
		for ( let i = 0; i < nbOct; ++i ) {
			root.append( ...gsuiKeys.template.cloneNode( true ).children );
		}
		Array.from( root.children ).reduce( ( midi, elKey, i ) => {
			const elRow = elKey.firstElementChild;

			elKey._rowElement = elRow;
			elRow._keyElement = elKey;
			elKey.dataset.midi =
			elRow.dataset.midi = midi - 1;
			elKey.style.top =
			elRow.style.top = `${ i }em`;
			return midi - 1;
		}, maxOct * 12 );
		return root.querySelectorAll( ".gsui-row" );
	}
	getKeyElementFromMidi( midi ) {
		return this._nlKeys[ this._nlKeys.length - 1 - ( midi - this._octStart * 12 ) ];
	}
	getMidiKeyFromKeyboard( e ) {
		const k = gsuiKeys.keyboardToKey[ e.code ];

		return k
			? ( 4 + k[ 0 ] ) * 12 + k[ 1 ]
			: false;
	}
	midiReleaseAllKeys() {
		this._keysDown.forEach( ( _, midi ) => this.midiKeyUp( midi ) );
		this._evmuRoot();
	}
	midiKeyDown( midi ) {
		this._keyUpDown( this.getKeyElementFromMidi( midi ), true );
	}
	midiKeyUp( midi ) {
		this._keyUpDown( this.getKeyElementFromMidi( midi ), false );
	}

	// private:
	_isBlack( keyInd ) {
		return keyInd === 1 || keyInd === 3 || keyInd === 5 || keyInd === 8 || keyInd === 10;
	}
	_keyUpDown( elKey, status ) {
		const midi = +elKey.dataset.midi;

		elKey.classList.toggle( "gsui-active", status );
		if ( status ) {
			this._keysDown.set( midi )
			this.onkeydown && this.onkeydown( midi, this._gain );
		} else {
			this._keysDown.delete( midi );
			this.onkeyup && this.onkeyup( midi, this._gain );
		}
	}

	// events:
	_evmdRoot( e ) {
		if ( this._nbOct ) {
			const blackKeyBCR = this.rootElement.childNodes[ 1 ].getBoundingClientRect();

			this._rootTop = this.rootElement.getBoundingClientRect().top;
			this._blackKeyR = blackKeyBCR.right;
			this._blackKeyH = blackKeyBCR.height;
			this._gain = Math.min( e.layerX / ( e.target.clientWidth - 1 ), 1 );
			document.addEventListener( "mouseup", this._evmuRoot );
			document.addEventListener( "mousemove", this._evmmRoot );
			this._evmmRoot( e );
		}
	}
	_evmuRoot() {
		document.removeEventListener( "mouseup", this._evmuRoot );
		document.removeEventListener( "mousemove", this._evmmRoot );
		if ( this._elKeyMouse ) {
			this._keyUpDown( this._elKeyMouse, false );
			this._elKeyMouse =
			this._keyIndMouse = null;
		}
		this._gain = 1;
	}
	_evmmRoot( e ) {
		const fKeyInd = ( e.clientY - this._rootTop ) / this._blackKeyH;
		let iKeyInd = ~~fKeyInd;

		if ( e.clientX > this._blackKeyR && this._isBlack( ~~( iKeyInd % 12 ) ) ) {
			iKeyInd += fKeyInd - iKeyInd < .5 ? -1 : 1;
		}
		if ( this._keyIndMouse !== iKeyInd ) {
			const elKey = this._nlKeys[ iKeyInd ];

			if ( elKey ) {
				if ( this._elKeyMouse ) {
					this._keyUpDown( this._elKeyMouse, false );
				}
				this._elKeyMouse = elKey;
				this._keyIndMouse = iKeyInd;
				this._keyUpDown( elKey, true );
			}
		}
	}
}

gsuiKeys.template = document.querySelector( "#gsuiKeys-octave-template" );
gsuiKeys.template.remove();
gsuiKeys.template.removeAttribute( "id" );

gsuiKeys.midiToKeyStr = m => gsuiKeys.keyIds[ m % 12 ] + ~~( m / 12 );
gsuiKeys.keyStrToMidi = k => {
	const key = k.substr( 0, k[ 1 ] !== "#" ? 1 : 2 );

	return k.substr( key.length ) * 12 + gsuiKeys.keyIds[ key ];
};

gsuiKeys.keyNames = Object.freeze( {
	en: Object.freeze( [ "c",  "c#",  "d",  "d#",  "e",  "f",  "f#",  "g",   "g#",   "a",  "a#",  "b" ] ),
	fr: Object.freeze( [ "do", "do#", "ré", "ré#", "mi", "fa", "fa#", "sol", "sol#", "la", "la#", "si" ] ),
} );

gsuiKeys.keyIds = Array.from( gsuiKeys.keyNames.en );
gsuiKeys.keyIds.forEach( ( k, i, arr ) => arr[ k ] = i );
Object.freeze( gsuiKeys.keyIds );

gsuiKeys.keyboardToKey = {

	//         [ relative octave, key index (C = 0, C# = 1) ]
	// keyboard down
	KeyZ:      [ 0, 0 ],
	KeyS:      [ 0, 1 ],
	KeyX:      [ 0, 2 ],
	KeyD:      [ 0, 3 ],
	KeyC:      [ 0, 4 ],
	KeyV:      [ 0, 5 ],
	KeyG:      [ 0, 6 ],
	KeyB:      [ 0, 7 ],
	KeyH:      [ 0, 8 ],
	KeyN:      [ 0, 9 ],
	KeyJ:      [ 0, 10 ],
	KeyM:      [ 0, 11 ],
	Comma:     [ 1, 0 ],
	KeyL:      [ 1, 1 ],
	Period:    [ 1, 2 ],
	Semicolon: [ 1, 3 ],
	Slash:     [ 1, 4 ],

	// keyboard up
	KeyQ:         [ 1, 0 ],
	Digit2:       [ 1, 1 ],
	KeyW:         [ 1, 2 ],
	Digit3:       [ 1, 3 ],
	KeyE:         [ 1, 4 ],
	KeyR:         [ 1, 5 ],
	Digit5:       [ 1, 6 ],
	KeyT:         [ 1, 7 ],
	Digit6:       [ 1, 8 ],
	KeyY:         [ 1, 9 ],
	Digit7:       [ 1, 10 ],
	KeyU:         [ 1, 11 ],
	KeyI:         [ 2, 0 ],
	Digit9:       [ 2, 1 ],
	KeyO:         [ 2, 2 ],
	Digit0:       [ 2, 3 ],
	KeyP:         [ 2, 4 ],
	BracketLeft:  [ 2, 5 ],
	Equal:        [ 2, 6 ],
	BracketRight: [ 2, 7 ],
};

class gsuiOscillator {
	constructor() {
		const root = gsuiOscillator.template.cloneNode( true ),
			qs = c => root.querySelector( `.gsuiOscillator-${ c }` ),
			waves = [
				new gsuiPeriodicWave(),
				new gsuiPeriodicWave(),
			];

		this.rootElement = root;
		this.oninput =
		this.onchange = () => {};
		this._data = {};
		this._typeSaved = "";
		this._waves = waves;
		this._elSelect = qs( "waveSelect" );
		this._timeidType = null;
		this._sliders = Object.freeze( {
			pan: this._initSlider( "pan", -1, 1, .02 ),
			gain: this._initSlider( "gain", 0, 1, .01 ),
			detune: this._initSlider( "detune", -24, 24, 1 ),
		} );
		this._selectWaves = {
			sine: true,
			triangle: true,
			sawtooth: true,
			square: true,
		};
		Object.seal( this );

		waves[ 0 ].frequency =
		waves[ 1 ].frequency = 1;
		qs( "wave" ).append(
			waves[ 0 ].rootElement,
			waves[ 1 ].rootElement );
		this._elSelect.onchange = this._onchangeSelect.bind( this );
		this._elSelect.onkeydown = this._onkeydownSelect.bind( this );
		qs( "wavePrev" ).onclick = this._onclickPrevNext.bind( this, -1 );
		qs( "waveNext" ).onclick = this._onclickPrevNext.bind( this, 1 );
		qs( "remove" ).onclick = () => this.onchange( "removeOscillator" );
	}

	// .........................................................................
	attached() {
		this._waves[ 0 ].attached();
		this._waves[ 1 ].attached();
		this._sliders.pan[ 0 ].attached();
		this._sliders.gain[ 0 ].attached();
		this._sliders.detune[ 0 ].attached();
	}
	addWaves( arr ) {
		const opts = [];

		arr.sort();
		arr.forEach( w => {
			if ( !this._selectWaves[ w ] ) {
				const opt = document.createElement( "option" );

				this._selectWaves[ w ] = true;
				opt.value = w;
				opt.className = "gsuiOscillator-waveOpt";
				opt.textContent = w;
				opts.push( opt );
			}
		} );
		Element.prototype.append.apply( this._elSelect, opts );
	}
	updateWave() {
		const [ wav0, wav1 ] = this._waves,
			{ type, gain, pan } = this._data;

		wav0.amplitude = Math.min( gain * ( pan < 0 ? 1 : 1 - pan ), .95 );
		wav1.amplitude = Math.min( gain * ( pan > 0 ? 1 : 1 + pan ), .95 );
		wav0.type =
		wav1.type = type;
		wav0.draw();
		wav1.draw();
	}

	// .........................................................................
	change( prop, val ) {
		switch ( prop ) {
			case "order": this._changeOrder( val ); break;
			case "type": this._changeType( val ); break;
			case "pan":
			case "gain":
			case "detune": this._changeProp( prop, val ); break;
		}
	}
	_changeOrder( n ) {
		this.rootElement.dataset.order = n;
	}
	_changeType( type ) {
		this._data.type =
		this._elSelect.value = type;
	}
	_changeProp( prop, val ) {
		const [ sli, span ] = this._sliders[ prop ];

		this._data[ prop ] = val;
		sli.setValue( val );
		span.textContent = prop === "detune" ? val : val.toFixed( 2 );
	}

	// .........................................................................
	_initSlider( prop, min, max, step ) {
		const slider = new gsuiSlider(),
			sel = `.gsuiOscillator-${ prop } .gsuiOscillator-slider`,
			elValue = this.rootElement.querySelector( `${ sel }Value` ),
			elSliderWrap = this.rootElement.querySelector( `${ sel }Wrap` );

		slider.options( { type: "circular", min, max, step } );
		slider.oninput = this._oninputSlider.bind( this, prop );
		slider.onchange = val => this.onchange( "changeOscillator", prop, val );
		elSliderWrap.append( slider.rootElement );
		return Object.freeze( [ slider, elValue ] );
	}

	// events:
	// .........................................................................
	_onclickPrevNext( dir ) {
		const sel = this._elSelect,
			currOpt = sel.querySelector( `option[value="${ sel.value }"]` ),
			opt = dir < 0
				? currOpt.previousElementSibling
				: currOpt.nextElementSibling;

		if ( opt ) {
			sel.value = opt.value;
			this._onchangeSelect();
		}
	}
	_onchangeSelect() {
		const type = this._elSelect.value;

		this._data.type = type;
		clearTimeout( this._timeidType );
		this.updateWave();
		this.oninput( "type", type );
		this._timeidType = setTimeout( () => {
			if ( type !== this._typeSaved ) {
				this.onchange( "changeOscillator", "type", type );
			}
		}, 700 );
	}
	_onkeydownSelect( e ) {
		if ( e.key.length === 1 ) {
			e.preventDefault();
		}
	}
	_oninputSlider( prop, val ) {
		let val2 = val;

		if ( prop === "gain" ) {
			this._data.gain = val;
			this.updateWave();
			val2 = +val.toFixed( 2 );
		} else if ( prop === "pan" ) {
			this._data.pan = val;
			this.updateWave();
			val2 = +val.toFixed( 2 );
		}
		this._sliders[ prop ][ 1 ].textContent = val2;
		this.oninput( prop, val2 );
	}
}

gsuiOscillator.template = document.querySelector( "#gsuiOscillator-template" );
gsuiOscillator.template.remove();
gsuiOscillator.template.removeAttribute( "id" );

Object.freeze( gsuiOscillator );

class gsuiPeriodicWave {
	constructor( svg ) {
		const root = svg || document.createElementNS( "http://www.w3.org/2000/svg", "svg" );

		this.rootElement = root;
		this.polyline = root.querySelector( "polyline" );
		if ( !this.polyline ) {
			this.polyline = document.createElementNS( "http://www.w3.org/2000/svg", "polyline" );
			root.appendChild( this.polyline );
		}
		this.type = "";
		this.delay = 0;
		this.attack = 0;
		this.frequency = 1;
		this.amplitude = 1;
		this.duration = 1;
		this._attached = false;
		this.width =
		this.height = 0;
		Object.seal( this );

		root.setAttribute( "preserveAspectRatio", "none" );
		root.classList.add( "gsuiPeriodicWave" );
	}

	remove() {
		delete this._attached;
		this.rootElement.remove();
	}
	attached() {
		this._attached = true;
		this.resized();
	}
	resized() {
		const bcr = this.rootElement.getBoundingClientRect(),
			w = ~~bcr.width,
			h = ~~bcr.height;

		this.width = w;
		this.height = h;
		this.rootElement.setAttribute( "viewBox", `0 0 ${ w } ${ h }` );
		if ( this.type ) {
			this.draw();
		}
	}
	draw() {
		const dur = this.duration,
			w = this.width,
			h2 = this.height / 2,
			hz = this.frequency * dur,
			amp = -this.amplitude * .95 * h2,
			delX = w / dur * this.delay,
			attX = w / dur * this.attack,
			wave = gsuiPeriodicWave.cache[ this.type ],
			pts = new Float32Array( w * 2 );

		if ( !wave ) {
			console.error( `ERROR: gsuiPeriodicWave: the wave "${ this.type }" is undefined...` );
		} else if ( this._attached ) {
			for ( let x = 0; x < w; ++x ) {
				let y = h2;

				if ( x > delX ) {
					const xd = x - delX,
						att = xd < attX ? xd / attX : 1;

					y += wave[ xd / w * 256 * hz % 256 | 0 ] * amp * att;
				}
				pts[ x * 2 ] = x;
				pts[ x * 2 + 1 ] = y;
			}
			this.polyline.setAttribute( "points", pts.join( " " ) );
		}
	}

	// static:
	static getXFromWave( a, b, t ) {
		return a.reduce( ( val, ak, k ) => {
			const tmp = Math.PI * 2 * k * t;

			return val + ak * Math.cos( tmp ) + b[ k ] * Math.sin( tmp );
		}, 0 );
	}
	static addWave( name, real, imag ) {
		const cache = gsuiPeriodicWave.cache;

		if ( !cache[ name ] ) {
			const arr = [],
				fn = gsuiPeriodicWave.getXFromWave.bind( null, real, imag );

			for ( let x = 0; x < 256; ++x ) {
				arr.push( fn( x / 256 ) );
			}
			cache[ name ] = arr;
		}
	}
}

gsuiPeriodicWave.cache = {};

Object.freeze( gsuiPeriodicWave );

class gsuiSynthesizer {
	constructor() {
		const root = gsuiSynthesizer.template.cloneNode( true );

		this.rootElement = root;
		this.oninput =
		this.onchange = () => {};
		this._waveList = [];
		this._nlOscs = root.getElementsByClassName( "gsuiOscillator" );
		this._elNewOsc = root.querySelector( ".gsuiSynthesizer-newOsc" );
		this._elOscList = root.querySelector( ".gsuiSynthesizer-oscList" );
		this._attached = false;
		this._uiOscs = new Map();
		Object.seal( this );

		this._elNewOsc.onclick = this._onclickNewOsc.bind( this );
		new gsuiReorder( {
			rootElement: this._elOscList,
			direction: "column",
			dataTransferType: "oscillator",
			itemSelector: ".gsuiOscillator",
			handleSelector: ".gsuiOscillator-grip",
			parentSelector: ".gsuiSynthesizer-oscList",
			onchange: this._onchangeReorder.bind( this ),
		} );
	}

	// .........................................................................
	attached() {
		this._attached = true;
		Array.from( this._nlOscs ).forEach( el => {
			this._uiOscs.get( el.dataset.id ).attached();
		} );
	}
	setWaveList( arr ) {
		this._waveList = arr;
		this._uiOscs.forEach( o => o.addWaves( arr ) );
	}
	getOscillator( id ) {
		return this._uiOscs.get( id );
	}

	// .........................................................................
	addOscillator( id, osc ) {
		const uiOsc = new gsuiOscillator();

		this._uiOscs.set( id, uiOsc );
		uiOsc.oninput = ( prop, val ) => this.oninput( id, prop, val );
		uiOsc.onchange = ( act, ...args ) => this.onchange( act, id, ...args );
		uiOsc.addWaves( this._waveList );
		uiOsc.rootElement.dataset.id = id;
		uiOsc.rootElement.dataset.order = osc.order;
		this._elOscList.append( uiOsc.rootElement );
		if ( this._attached ) {
			uiOsc.attached();
		}
	}
	removeOscillator( id ) {
		const osc = this._uiOscs.get( id );

		if ( osc ) {
			osc.rootElement.remove();
			this._uiOscs.delete( id );
		}
	}
	reorderOscillators( obj ) {
		gsuiReorder.listReorder( this._elOscList, obj );
	}

	// events:
	// .........................................................................
	_onclickNewOsc() {
		this.onchange( "addOscillator" );
	}
	_onchangeReorder() {
		const oscs = gsuiReorder.listComputeOrderChange( this._elOscList, {} );

		this.onchange( "reorderOscillator", oscs );
	}
}

gsuiSynthesizer.template = document.querySelector( "#gsuiSynthesizer-template" );
gsuiSynthesizer.template.remove();
gsuiSynthesizer.template.removeAttribute( "id" );

class gsuiDotline {
	constructor() {
		const root = document.createElement( "div" ),
			svg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" ),
			polyline = document.createElementNS( "http://www.w3.org/2000/svg", "polyline" );

		this.rootElement = root;
		this.oninput =
		this.onchange = () => {};
		this._data = {};
		this._dots = {};
		this._dotsMoving = [];
		this._elSVG = svg;
		this._elPoly = polyline;
		this._opt = {};
		this._dotsId =
		this._svgW =
		this._svgH =
		this._pageX =
		this._pageY =
		this._dotMaxX =
		this._dotMinX =
		this._dotMaxY =
		this._dotMinY =
		this._mousebtn = 0;
		this._nlDots = root.getElementsByClassName( "gsuiDotline-dot" );
		this._rootBCR =
		this._activeDot =
		this._attached = false;
		this._mouseupDot = this._mouseupDot.bind( this );
		this._mousemoveDot = this._mousemoveDot.bind( this );
		Object.seal( this );

		svg.append( polyline );
		svg.setAttribute( "preserveAspectRatio", "none" );
		root.append( svg );
		root.className = "gsuiDotline";
		root.oncontextmenu = () => false;
		root.onmousedown = this._mousedown.bind( this );
		this.options( {
			x: "x",
			y: "y",
			step: 1,
			minX: 0,
			minY: 0,
			maxX: 150,
			maxY: 100,
			firstDotLinked: null,
			lastDotLinked: null,
			moveMode: "free",
		} );
	}

	attached() {
		this._attached = true;
		this.resize();
	}
	resize() {
		const { width: w, height: h } = this.updateBCR();

		this._svgW = w;
		this._svgH = h;
		this._elSVG.setAttribute( "viewBox", `0 0 ${ w } ${ h }` );
		this._drawPolyline();
	}
	options( obj ) {
		const opt = this._opt;

		Object.assign( opt, obj );
		if ( this._optionsRedrawNeeded( obj ) ) {
			opt.width = opt.maxX - opt.minX;
			opt.height = opt.maxY - opt.minY;
			this._drawPolyline();
			Object.values( this._dots ).forEach( d => {
				this._updateDotElement( d.id, d.x, d.y );
			} );
		}
		return opt;
	}
	updateBCR() {
		return this._rootBCR = this.rootElement.getBoundingClientRect();
	}
	change( diff ) {
		Object.entries( diff ).forEach( ( [ id, diffDot ] ) => {
			if ( !diffDot ) {
				if ( id in this._data ) {
					delete this._data[ id ];
					this._deleteDotElement( id );
				}
			} else {
				const opt = this._opt,
					dot = this._data[ id ],
					xs = opt.x,
					ys = opt.y,
					x = xs in diffDot ? this._epureNb( diffDot[ xs ], opt.minX, opt.maxX ) : dot ? dot.x : 0,
					y = ys in diffDot ? this._epureNb( diffDot[ ys ], opt.minY, opt.maxY ) : dot ? dot.y : 0;

				if ( dot ) {
					this._updateDotElement( id, x, y );
				} else {
					this._data[ id ] = { x, y };
					this._createDotElement( id );
					this._updateDotElement( id, x, y );
				}
			}
		} );
		this._drawPolyline();
	}

	// private:
	_optionsRedrawNeeded( o ) {
		return (
			"step" in o ||
			"minX" in o ||
			"minY" in o ||
			"maxX" in o ||
			"maxY" in o ||
			"firstDotLinked" in o ||
			"lastDotLinked" in o
		);
	}
	_sortDots( a, b ) {
		return a.x - b.x;
	}
	_drawPolyline() {
		const arr = [],
			dots = Object.values( this._dots ).sort( this._sortDots ),
			svgW = this._svgW,
			svgH = this._svgH,
			{
				minX, minY,
				width, height,
				firstDotLinked,
				lastDotLinked,
			} = this._opt;

		if ( firstDotLinked !== null ) {
			arr.push( 0, svgH - ( firstDotLinked - minY ) / height * svgH );
		}
		dots.forEach( dot => {
			arr.push(
				( dot.x - minX ) / width * svgW,
				svgH - ( dot.y - minY ) / height * svgH
			);
		} );
		if ( lastDotLinked !== null ) {
			arr.push( svgW, svgH - ( lastDotLinked - minY ) / height * svgH );
		}
		this._elPoly.setAttribute( "points", arr.join( " " ) );
	}
	_onchange() {
		const obj = {},
			data = this._data;
		let diff;

		Object.entries( data ).forEach( ( [ id, { x, y } ] ) => {
			const newDot = this._dots[ id ];

			if ( !newDot ) {
				diff = true;
				obj[ id ] = undefined;
				delete data[ id ];
			} else {
				const { x: nx, y: ny } = newDot;

				if ( nx !== x || ny !== y ) {
					const objDot = {};

					diff = true;
					obj[ id ] = objDot;
					if ( nx !== x ) { data[ id ].x = objDot[ this._opt.x ] = nx; }
					if ( ny !== y ) { data[ id ].y = objDot[ this._opt.y ] = ny; }
				}
			}
		} );
		Object.values( this._dots ).forEach( ( { id, x, y } ) => {
			const oldDot = data[ id ];

			if ( !oldDot ) {
				diff = true;
				data[ id ] = { x, y };
				obj[ id ] = {
					[ this._opt.x ]: x,
					[ this._opt.y ]: y,
				};
			}
		} );
		if ( diff ) {
			this.onchange( obj );
		}
	}

	// Math functions
	// .........................................................................
	_epurePageX( px ) {
		const o = this._opt,
			r = this._rootBCR;

		return ( px - r.left - window.scrollX ) / r.width * o.width + o.minX;
	}
	_epurePageY( py ) {
		const o = this._opt,
			r = this._rootBCR;

		return o.height - ( py - r.top - window.scrollY ) / r.height * o.height + o.minY;
	}
	_epureNb( n, min, max ) {
		const step = this._opt.step,
			cut = Math.max( min, Math.min( n, max ) );

		return +( Math.round( cut / step ) * step ).toFixed( 5 );
	}

	// dots[].element
	// .........................................................................
	_createDotElement( id ) {
		const el = document.createElement( "div" );

		el.className = "gsuiDotline-dot";
		el.dataset.id = id;
		this._dotsId = Math.max( this._dotsId, id );
		this.rootElement.append( el );
		return this._dots[ id ] = { id, element: el, x: 0, y: 0 };
	}
	_updateDotElement( id, x, y ) {
		const opt = this._opt,
			dot = this._dots[ id ];

		dot.x = x;
		dot.y = y;
		dot.element.style.left = `${ ( x - opt.minX ) / opt.width * 100 }%`;
		dot.element.style.top = `${ 100 - ( ( y - opt.minY ) / opt.height * 100 ) }%`;
	}
	_deleteDotElement( id ) {
		this._dots[ id ].element.remove();
		delete this._dots[ id ];
	}
	_selectDotElement( id, b ) {
		const dot = this._dots[ id ];

		this._activeDot = b ? dot : null;
		dot.element.classList.toggle( "gsuiDotline-dotSelected", b );
	}

	// events:
	// .........................................................................
	_toggleMouseEvents( b ) {
		if ( b ) {
			document.addEventListener( "mouseup", this._mouseupDot );
			document.addEventListener( "mousemove", this._mousemoveDot );
		} else {
			document.removeEventListener( "mouseup", this._mouseupDot );
			document.removeEventListener( "mousemove", this._mousemoveDot );
		}
	}
	_mousedown( e ) {
		let id = e.target.dataset.id;

		this._toggleMouseEvents( true );
		this._mousebtn = e.button;
		if ( e.button === 2 ) {
			if ( id ) {
				this._deleteDotElement( id );
				this._drawPolyline();
				this.oninput( id );
			}
		} else if ( e.button === 0 ) {
			let isAfter = false,
				dot,
				prevDot;

			this.updateBCR();
			if ( id ) {
				dot = this._dots[ id ];
			} else {
				const x = this._epurePageX( e.pageX ),
					y = this._epurePageY( e.pageY );

				id = this._dotsId + 1;
				dot = this._createDotElement( id );
				this._updateDotElement( id, x, y );
				this._drawPolyline();
				this.oninput( id, x, y );
			}
			this._selectDotElement( id, true );
			this._pageX = e.pageX;
			this._pageY = e.pageY;
			if ( this._opt.moveMode !== "linked" ) {
				this._dotsMoving = [ dot ];
				this._dotMaxX = dot.x;
				this._dotMaxY = dot.y;
				this._dotMinX = dot.x;
				this._dotMinY = dot.y;
			} else {
				this._dotMaxX =
				this._dotMaxY = -Infinity;
				this._dotMinX =
				this._dotMinY = Infinity;
				this._dotsMoving = Object.values( this._dots )
					.sort( this._sortDots )
					.filter( ( d, i, arr ) => {
						isAfter = isAfter || d === dot;
						if ( isAfter ) {
							this._dotMaxX = Math.max( d.x, this._dotMaxX );
							this._dotMaxY = Math.max( d.y, this._dotMaxY );
							this._dotMinX = Math.min( d.x, this._dotMinX );
							this._dotMinY = Math.min( d.y, this._dotMinY );
						}
						if ( arr[ i + 1 ] === dot ) {
							prevDot = d;
						}
						return isAfter;
					} );
				if ( prevDot ) {
					this._dotMinX -= prevDot.x;
				}
			}
			this._dotsMoving.forEach( dot => {
				dot._saveX = dot.x;
				dot._saveY = dot.y;
			} );
		}
	}
	_mouseupDot() {
		if ( this._activeDot ) {
			this._selectDotElement( this._activeDot.id, false );
		}
		this._toggleMouseEvents( false );
		this._dotsMoving.forEach( dot => {
			delete dot._saveX;
			delete dot._saveY;
		} );
		this._dotsMoving.length = 0;
		this._onchange();
	}
	_mousemoveDot( e ) {
		if ( this._mousebtn === 0 ) {
			const opt = this._opt;
			let incX = opt.width / this._rootBCR.width * ( e.pageX - this._pageX ),
				incY = opt.height / this._rootBCR.height * -( e.pageY - this._pageY );

			if ( incX ) {
				incX = incX < 0
					? Math.max( incX, opt.minX - this._dotMinX )
					: Math.min( incX, opt.maxX - this._dotMaxX );
			}
			if ( incY ) {
				incY = incY < 0
					? Math.max( incY, opt.minY - this._dotMinY )
					: Math.min( incY, opt.maxY - this._dotMaxY );
			}
			this._dotsMoving.forEach( dot => {
				const id = dot.id,
					x = this._epureNb( dot._saveX + incX, opt.minX, opt.maxX ),
					y = this._epureNb( dot._saveY + incY, opt.minY, opt.maxY );

				this._updateDotElement( id, x, y );
				this.oninput( id, x, y );
			} );
			this._drawPolyline();
		}
	}
}

class gsuiPanels {
	constructor( root ) {
		this.rootElement = root;
		this._cursorElem = document.createElement( "div" );
		this._cursorElem.className = "gsuiPanels-cursor";
		this._dataPerPanel = new Map();
	}
	attached() {
		this._init();
		this.resized();
	}
	resized() {
		this._panWidth.forEach( this._setSizeClass.bind( this, "width" ) );
		this._panHeight.forEach( this._setSizeClass.bind( this, "height" ) );
	}

	// private:
	_init() {
		const root = this.rootElement,
			qsa = ( c, fn ) => root.querySelectorAll( `.gsuiPanels-${ c }` ).forEach( fn );

		root.style.overflow = "hidden";
		qsa( "extend", el => el.remove() );
		qsa( "last", el => el.classList.remove( "gsuiPanels-last" ) );
		this._convertFlex( root.classList.contains( "gsuiPanels-x" ) ? "width" : "height", root );
		qsa( "x", this._convertFlex.bind( this, "width" ) );
		qsa( "y", this._convertFlex.bind( this, "height" ) );
		qsa( "x > div + div", this._addExtend.bind( this, "width" ) );
		qsa( "y > div + div", this._addExtend.bind( this, "height" ) );
		this._panWidth = root.querySelectorAll( "[data-width-class]" );
		this._panHeight = root.querySelectorAll( "[data-height-class]" );
		this._panWidth.forEach( this._parseSizeClassAttr.bind( this, "width" ) );
		this._panHeight.forEach( this._parseSizeClassAttr.bind( this, "height" ) );
		window.addEventListener( "resize", this.resized.bind( this ) );
	}
	_getChildren( el ) {
		return Array.from( el.children ).filter(
			el => !el.classList.contains( "gsuiPanels-extend" ) );
	}
	_parseSizeClassAttr( dir, pan ) {
		const hasData = this._dataPerPanel.get( pan ),
			data = hasData
				? hasData
				: {
					width: { less: [], more: [] },
					height: { less: [], more: [] },
				},
			{ less, more } = data[ dir ];

		if ( !hasData ) {
			this._dataPerPanel.set( pan, data );
		}
		pan.dataset[ `${ dir }Class` ].split( " " )
			.forEach( w => {
				const [ size, clazz ] = w.split( ":" ),
					arr = size[ 0 ] === "<" ? less : more;

				arr.push( [ +size.substr( 1 ), clazz ] );
			} );
	}
	_convertFlex( dir, panPar ) {
		const pans = this._getChildren( panPar ),
			size = dir === "width"
				? panPar.clientWidth
				: panPar.clientHeight;

		pans[ pans.length - 1 ].classList.add( "gsuiPanels-last" );
		pans.map( pan => pan.getBoundingClientRect()[ dir ] )
			.forEach( ( panW, i ) => {
				pans[ i ].style[ dir ] = `${ panW / size * 100 }%`;
			} );
	}
	_addExtend( dir, pan ) {
		const extend = document.createElement( "div" ),
			pans = this._getChildren( pan.parentNode ),
			panBefore = pans.filter( el => !el.classList.contains( "gsuiPanels-extend" ) &&
				pan.compareDocumentPosition( el ) & Node.DOCUMENT_POSITION_PRECEDING
			).reverse(),
			panAfter = pans.filter( el => !el.classList.contains( "gsuiPanels-extend" ) && (
				pan.compareDocumentPosition( el ) & Node.DOCUMENT_POSITION_FOLLOWING || pan === el
			) );

		extend.className = "gsuiPanels-extend";
		extend.onmousedown = this._onmousedownExtend.bind( this, dir, extend, panBefore, panAfter );
		pan.append( extend );
	}
	_incrSizePans( dir, mov, pans ) {
		const parentsize = this._parentSize;

		return pans.reduce( ( mov, pan ) => {
			let ret = mov;

			if ( Math.abs( mov ) > .1 ) {
				const style = getComputedStyle( pan ),
					size = pan.getBoundingClientRect()[ dir ],
					minsize = parseFloat( style[ `min-${ dir }` ] ) || 10,
					maxsize = parseFloat( style[ `max-${ dir }` ] ) || Infinity,
					newsizeCorrect = Math.max( minsize, Math.min( size + mov, maxsize ) );

				if ( Math.abs( newsizeCorrect - size ) >= .1 ) {
					pan.style[ dir ] = `${ newsizeCorrect / parentsize * 100 }%`;
					if ( mov > 0 ) {
						ret = mov - ( newsizeCorrect - size );
					} else {
						ret = mov + ( size - newsizeCorrect );
					}
					this._setSizeClass( dir, pan );
					if ( pan.onresizing ) {
						pan.onresizing( pan );
					}
				}
			}
			return ret;
		}, mov );
	}
	_setSizeClass( dir, pan ) {
		const panData = this._dataPerPanel.get( pan );

		if ( panData ) {
			const { less, more } = panData[ dir ],
				panCl = pan.classList,
				panSize = dir === "width"
					? pan.clientWidth
					: pan.clientHeight;

			less.forEach( c => panCl.toggle( c[ 1 ], panSize < c[ 0 ] ) );
			more.forEach( c => panCl.toggle( c[ 1 ], panSize > c[ 0 ] ) );
		}
	}

	// events:
	_onmouseup() {
		this._cursorElem.remove();
		this._extend.classList.remove( "gsui-hover" );
		this.rootElement.classList.remove( "gsuiPanels-noselect" );
		delete gsuiPanels._focused;
	}
	_onmousemove( e ) {
		const dir = this._dir,
			px = ( dir === "width" ? e.pageX : e.pageY ) - this._pageN,
			mov = px - this._incrSizePans( dir, px, this._panBefore );

		this._pageN += mov;
		if ( Math.abs( mov ) > 0 ) {
			this._incrSizePans( dir, -mov, this._panAfter );
		}
	}
	_onmousedownExtend( dir, ext, panBefore, panAfter, e ) {
		gsuiPanels._focused = this;
		ext.classList.add( "gsui-hover" );
		this._cursorElem.style.cursor = dir === "width" ? "col-resize" : "row-resize";
		document.body.append( this._cursorElem );
		this.rootElement.classList.add( "gsuiPanels-noselect" );
		this._dir = dir;
		this._extend = ext;
		this._pageN = dir === "width" ? e.pageX : e.pageY;
		this._panBefore = panBefore;
		this._panAfter = panAfter;
		this._parent = ext.parentNode.parentNode;
		this._parentSize = dir === "width"
			? this._parent.clientWidth
			: this._parent.clientHeight;
	}
}

document.addEventListener( "mousemove", e => {
	gsuiPanels._focused && gsuiPanels._focused._onmousemove( e );
} );
document.addEventListener( "mouseup", e => {
	gsuiPanels._focused && gsuiPanels._focused._onmouseup( e );
} );

const gsuiPopup = new class {
	constructor() {
		const qs = s => document.querySelector( `#gsuiPopup${ s }` );

		this.elRoot = qs( "" );
		this.elOk = qs( "Ok" );
		this.elCnt = qs( "Content" );
		this.elMsg = qs( "Message" );
		this.elText = qs( "InputText" );
		this.elForm = qs( "Body" );
		this.elWindow = qs( "Window" );
		this.elHeader = qs( "Head" );
		this.elCancel = qs( "Cancel" );
		this.clWindow = this.elWindow.classList;
		this.type = "";
		this.isOpen = false;
		this.resolve =
		this._fnSubmit = null;
		Object.seal( this );

		this.elRoot.onclick =
		this.elCancel.onclick = this._cancelClick.bind( this );
		this.elForm.onsubmit = this._submit.bind( this );
		this.elWindow.onkeyup =
		this.elWindow.onclick = e => { e.stopPropagation(); };
		this.elWindow.onkeydown = e => {
			if ( e.keyCode === 27 ) {
				this._cancelClick();
			}
			e.stopPropagation();
		};
	}

	alert( title, msg, ok ) {
		this._emptyCnt();
		this.clWindow.add( "gsuiPopup-noText", "gsuiPopup-noCancel" );
		this._setOkCancelBtns( ok, false );
		return this._open( "alert", title, msg );
	}
	confirm( title, msg, ok, cancel ) {
		this._emptyCnt();
		this.clWindow.remove( "gsuiPopup-noCancel" );
		this.clWindow.add( "gsuiPopup-noText" );
		this._setOkCancelBtns( ok, cancel );
		return this._open( "confirm", title, msg );
	}
	prompt( title, msg, val, ok, cancel ) {
		this._emptyCnt();
		this.clWindow.remove( "gsuiPopup-noText", "gsuiPopup-noCancel" );
		this._setOkCancelBtns( ok, cancel );
		return this._open( "prompt", title, msg, val );
	}
	custom( obj ) {
		this._emptyCnt();
		this._fnSubmit = obj.submit || null;
		this.clWindow.remove( "gsuiPopup-noText" );
		this._setOkCancelBtns( obj.ok, obj.cancel || false );
		obj.element
			? this.elCnt.append( obj.element )
			: Element.prototype.append.apply( this.elCnt, obj.elements );
		return this._open( "custom", obj.title );
	}
	close() {
		if ( this.isOpen ) {
			this.elCancel.click();
		}
	}

	// private:,
	_setOkCancelBtns( ok, cancel ) {
		this.clWindow.toggle( "gsuiPopup-noCancel", cancel === false );
		this.elCancel.value = cancel || "Cancel";
		this.elOk.value = ok || "Ok";
	}
	_emptyCnt() {
		const elCnt = this.elCnt;

		while ( elCnt.firstChild ) {
			elCnt.firstChild.remove();
		}
	}
	_open( type, title, msg, value ) {
		this.type = type;
		this.isOpen = true;
		this.elHeader.textContent = title;
		this.elMsg.innerHTML = msg || "";
		this.elText.value = arguments.length > 3 ? value : "";
		this.elWindow.dataset.type = type;
		this.elRoot.classList.add( "gsuiPopup-show" );
		setTimeout( () => {
			if ( type === "prompt" ) {
				this.elText.select();
			} else {
				const inp = type !== "custom" ? null
					: this.elCnt.querySelector( "input, select" );

				( inp || this.elOk ).focus();
			}
		}, 250 );
		return new Promise( res => this.resolve = res )
			.then( val => {
				this.isOpen = false;
				this.elRoot.classList.remove( "gsuiPopup-show" );
				return val;
			} );
	}
	_cancelClick() {
		this.resolve(
			this.type === "confirm" ? false :
			this.type === "prompt" ? null : undefined );
	}
	_submit() {
		switch ( this.type ) {
			case "alert": this.resolve( undefined ); break;
			case "prompt": this.resolve( this.elText.value ); break;
			case "confirm": this.resolve( true ); break;
			case "custom": this._submitCustom(); break;
		}
		return false;
	}
	_getInputValue( inp ) {
		switch ( inp.type ) {
			default: return inp.value;
			case "file": return inp.files;
			case "radio": return inp.checked ? inp.value : null;
			case "number": return +inp.value;
			case "checkbox": return inp.checked;
		}
	}
	_submitCustom() {
		const fn = this._fnSubmit,
			inps = Array.from( this.elForm ),
			obj = inps.reduce( ( obj, inp ) => {
				if ( inp.name ) {
					const val = this._getInputValue( inp );

					if ( val !== null ) {
						obj[ inp.name ] = val;
					}
				}
				return obj;
			}, {} );

		if ( !fn ) {
			this.resolve( obj );
		} else {
			const fnRes = fn( obj );

			if ( fnRes !== false ) {
				fnRes && fnRes.then
					? fnRes.then( res => {
						if ( res !== false ) {
							this.resolve( obj );
						}
					} )
					: this.resolve( obj );
			}
		}
	}
}();

class gsuiSlider {
	constructor() {
		const root = gsuiSlider.template.cloneNode( true ),
			qs = c => root.querySelector( `.gsuiSlider-${ c }` );

		this.rootElement = root;
		this._elSvg = qs( "svg" );
		this._elLine = qs( "line" );
		this._elInput = qs( "input" );
		this._elSvgLine = qs( "svgLine" );
		this._elLineColor = qs( "lineColor" );
		this._elSvgLineColor = qs( "svgLineColor" );
		this._options = Object.seal( {
			value: 0, min: 0, max: 0, step: 0,
			type: "", scrollStep: 0, strokeWidth: 0, wheelChange: false,
		} );
		this.value =
		this._previousval = "";
		this._enable = true;
		this.oninput =
		this.onchange =
		this.oninputend =
		this.oninputstart = null;
		this._circ =
		this._axeX =
		this._locked =
		this._attached = false;
		this.width =
		this.height =
		this._pxval =
		this._pxmoved =
		this._svgLineLen = 0;
		Object.seal( this );

		root._gsuiSlider_instance = this;
		root.onwheel = this._wheel.bind( this );
		root.onmouseup = this._mouseup.bind( this );
		root.onmousedown = this._mousedown.bind( this );
		root.onmousemove = this._mousemove.bind( this );
		root.onmouseleave = this._mouseleave.bind( this );
		this.options( {
			value: 0, min: 0, max: 100, step: 1,
			type: "linear-x", scrollStep: 1, strokeWidth: 4, wheelChange: false,
		} );
	}

	remove() {
		this._attached = false;
		this.rootElement.remove();
	}
	attached() {
		this._attached = true;
		this.resized();
	}
	options( obj ) {
		const inp = this._elInput,
			opt = Object.assign( this._options, obj );

		opt.step = Math.max( 0, opt.step ) || ( opt.max - opt.min ) / 10;
		opt.scrollStep = Math.max( opt.step, opt.scrollStep || opt.step );
		inp.min = opt.min;
		inp.max = opt.max;
		inp.step = opt.step;
		if ( "value" in obj ) {
			inp.value = opt.value;
		}
		this._previousval = this._getInputVal();
		if ( "type" in obj ) {
			this._setType( obj.type );
		}
		if ( "type" in obj || "strokeWidth" in obj ) {
			this._setSVGcirc();
		}
		this._updateVal();
	}
	setValue( val, bymouse ) {
		if ( !this._locked || bymouse ) {
			const prevVal = this._getInputVal(),
				newVal = ( this._elInput.value = val, this._getInputVal() );

			if ( newVal !== prevVal ) {
				this._updateVal();
				if ( bymouse && this.oninput ) {
					this.oninput( +newVal );
				}
			}
			if ( !bymouse ) {
				this._previousval = newVal;
			}
		}
	}
	enable( b ) {
		this._enable = b;
		this.rootElement.classList.toggle( "gsuiSlider-disable", !b );
	}
	resized() {
		const rc = this.rootElement.getBoundingClientRect();

		this.resize( rc.width, rc.height );
	}
	resize( w, h ) {
		if ( w !== this.width || h !== this.height ) {
			this.width = w;
			this.height = h;
			this._setSVGcirc();
			this._updateVal();
		}
	}

	// private:
	_setType( type ) {
		const cl = this.rootElement.classList,
			st = this._elLineColor.style,
			circ = type === "circular",
			axeX = type === "linear-x";

		this._circ = circ;
		this._axeX = axeX;
		cl.toggle( "gsuiSlider-circular", circ );
		cl.toggle( "gsuiSlider-linear", !circ );
		if ( !circ ) {
			if ( axeX ) {
				st.left =
				st.width = "";
				st.top = "0";
				st.height = "100%";
			} else {
				st.top =
				st.height = "";
				st.left = "0";
				st.width = "100%";
			}
		}
	}
	_setSVGcirc() {
		if ( this._circ && this.width && this.height ) {
			const size = Math.min( this.width, this.height ),
				size2 = size / 2,
				stroW = this._options.strokeWidth,
				circR = ~~( ( size - stroW ) / 2 );

			this._elSvg.setAttribute( "viewBox", `0 0 ${ size } ${ size }` );
			this._elSvgLine.setAttribute( "cx", size2 );
			this._elSvgLine.setAttribute( "cy", size2 );
			this._elSvgLine.setAttribute( "r", circR );
			this._elSvgLineColor.setAttribute( "cx", size2 );
			this._elSvgLineColor.setAttribute( "cy", size2 );
			this._elSvgLineColor.setAttribute( "r", circR );
			this._elSvgLine.style.strokeWidth =
			this._elSvgLineColor.style.strokeWidth = stroW;
			this._svgLineLen = circR * 2 * Math.PI;
		}
	}
	_getInputVal() {
		const val = this._elInput.value;

		return Math.abs( +val ) < .000001 ? "0" : val;
	}
	_updateVal() {
		this.value = +this._getInputVal();
		if ( this._attached ) {
			const opt = this._options,
				len = opt.max - opt.min,
				prcval = ( this.value - opt.min ) / len,
				prcstart = -opt.min / len,
				prclen = Math.abs( prcval - prcstart ),
				prcmin = Math.min( prcval, prcstart );

			if ( this._circ ) {
				const line = this._elSvgLineColor.style;

				line.transform = `rotate(${ 90 + prcmin * 360 }deg)`;
				line.strokeDasharray = `${ prclen * this._svgLineLen }, 999999`;
			} else {
				const line = this._elLineColor.style;

				if ( this._axeX ) {
					line.left = `${ prcmin * 100 }%`;
					line.width = `${ prclen * 100 }%`;
				} else {
					line.bottom = `${ prcmin * 100 }%`;
					line.height = `${ prclen * 100 }%`;
				}
			}
		}
	}
	_onchange() {
		const val = this._getInputVal();

		if ( this._previousval !== val ) {
			this.onchange && this.onchange( +val );
			this._previousval = val;
		}
	}

	// events:
	_wheel( e ) {
		if ( this._enable && this._options.wheelChange ) {
			const d = e.deltaY > 0 ? -1 : 1;

			this.setValue( +this._getInputVal() + this._options.scrollStep * d, true );
			return false;
		}
	}
	_mousedown() {
		if ( this._enable ) {
			const opt = this._options,
				bcr = this._elLine.getBoundingClientRect(),
				size = this._circ ? this._svgLineLen :
					this._axeX ? bcr.width : bcr.height;

			this._onchange();
			if ( this.oninputstart ) {
				this.oninputstart( this.value );
			}
			this._pxval = ( opt.max - opt.min ) / size;
			this._pxmoved = 0;
			this.rootElement.requestPointerLock();
		}
	}
	_mousemove( e ) {
		if ( this._locked ) {
			const { min, max } = this._options,
				mov = this._circ || !this._axeX ? -e.movementY : e.movementX,
				bound = ( max - min ) / 5,
				val = +this._previousval + ( this._pxmoved + mov ) * this._pxval;

			if ( min - bound < val && val < max + bound ) {
				this._pxmoved += mov;
			}
			this.setValue( val, true );
		}
	}
	_mouseup() {
		if ( this._locked ) {
			document.exitPointerLock();
			this._locked = false;
			this._onchange();
			if ( this.oninputend ) {
				this.oninputend( this.value );
			}
		}
	}
	_mouseleave() {
		this._onchange();
	}
}

gsuiSlider.template = document.querySelector( "#gsuiSlider-template" );
gsuiSlider.template.remove();
gsuiSlider.template.removeAttribute( "id" );

document.addEventListener( "pointerlockchange", () => {
	const el = document.pointerLockElement;

	if ( el ) {
		const slider = el._gsuiSlider_instance;

		if ( slider ) {
			slider._locked = true;
			gsuiSlider._focused = slider;
		}
	} else if ( gsuiSlider._focused ) {
		gsuiSlider._focused._mouseup();
	}
} );

class gsuiSliderGroup {
	constructor() {
		const root = gsuiSliderGroup.template.cloneNode( true ),
			slidersWrap = root.querySelector( ".gsuiSliderGroup-slidersWrap" ),
			slidersParent = root.querySelector( ".gsuiSliderGroup-sliders" ),
			uiBeatlines = new gsuiBeatlines( slidersParent );

		this.onchange = () => {};
		this.rootElement = root;
		this.scrollElement = slidersWrap;
		this._uiBeatlines = uiBeatlines;
		this._slidersParent = slidersParent;
		this._currentTime = root.querySelector( ".gsuiSliderGroup-currentTime" );
		this._loopA = root.querySelector( ".gsuiSliderGroup-loopA" );
		this._loopB = root.querySelector( ".gsuiSliderGroup-loopB" );
		this._attached = false;
		this._min =
		this._max =
		this._exp =
		this._pxPerBeat = 0;
		this._sliders = new Map();
		this._selected = new Map();
		this._valueSaved = new Map();
		this._bcr =
		this._evMouseup =
		this._evMousemove =
		this._renderTimeoutId = null;
		this._uiFn = Object.freeze( {
			when: this._sliderWhen.bind( this ),
			value: this._sliderValue.bind( this ),
			duration: this._sliderDuration.bind( this ),
			selected: this._sliderSelected.bind( this ),
		} );
		Object.seal( this );

		slidersParent.onmousedown = this._mousedown.bind( this );
	}

	remove() {
		this._attached = false;
		this.rootElement.remove();
	}
	empty() {
		this._sliders.forEach( s => s.element.remove() );
		this._sliders.clear();
		this._selected.clear();
		this._valueSaved.clear();
	}
	attached() {
		const el = this.scrollElement;

		this._attached = true;
		el.style.bottom = `${ el.clientHeight - el.offsetHeight }px`;
	}
	minMaxExp( min, max, exp = 0 ) {
		this._min = min;
		this._max = max;
		this._exp = exp;
	}

	timeSignature( a, b ) {
		this._uiBeatlines.timeSignature( a, b );
	}
	currentTime( beat ) {
		this._currentTime.style.left = `${ beat }em`;
	}
	loop( a, b ) {
		const isLoop = a !== false;

		this._loopA.classList.toggle( "gsuiSliderGroup-loopOn", isLoop );
		this._loopB.classList.toggle( "gsuiSliderGroup-loopOn", isLoop );
		if ( isLoop ) {
			this._loopA.style.width = `${ a }em`;
			this._loopB.style.left = `${ b }em`;
		}
	}
	setPxPerBeat( px ) {
		const ppb = Math.round( Math.min( Math.max( 8, px ) ), 512 );

		if ( ppb !== this._pxPerBeat ) {
			this._pxPerBeat = ppb;
			this._uiBeatlines.pxPerBeat( ppb );
			this._slidersParent.style.fontSize = `${ ppb }px`;
			clearTimeout( this._renderTimeoutId );
			this._renderTimeoutId = setTimeout( () => this._uiBeatlines.render(), 100 );
		}
	}

	// data:
	delete( id ) {
		this._sliders.get( id ).element.remove();
		this._sliders.delete( id );
		this._selected.delete( id );
		delete this._slidersObj;
		this._sliderSelectedClass();
	}
	set( id, when, duration, value ) {
		const element = gsuiSliderGroup.sliderTemplate.cloneNode( true ),
			sli = { element };

		element._slider =
		element.firstElementChild._slider = sli;
		element.dataset.id = id;
		this._sliders.set( id, sli );
		this._sliderWhen( sli, when );
		this._sliderValue( sli, value );
		this._sliderDuration( sli, duration );
		this._slidersParent.append( element );
	}
	setProp( id, prop, value ) {
		const sli = this._sliders.get( id );

		sli[ prop ] = value;
		this._uiFn[ prop ]( sli, value );
	}

	// private:
	_formatValue( val ) {
		return +val.toFixed( 2 );
	}
	_sliderWhen( sli, when ) {
		sli.when = when;
		sli.element.style.left = `${ when }em`;
		sli.element.style.zIndex = Math.floor( when * 100 );
	}
	_sliderDuration( sli, dur ) {
		sli.dur = dur;
		sli.element.style.width = `${ dur }em`;
	}
	_sliderSelected( sli, b ) {
		b
			? this._selected.set( sli.element.dataset.id, sli )
			: this._selected.delete( sli.element.dataset.id );
		sli.element.classList.toggle( "gsuiSliderGroup-sliderSelected", !!b );
		this._sliderSelectedClass();
	}
	_sliderSelectedClass() {
		this._slidersParent.classList.toggle(
			"gsuiSliderGroup-slidersSelected", this._selected.size > 0 );
	}
	_sliderValue( sli, val ) {
		const el = sli.element.firstElementChild,
			st = el.style,
			max = this._max,
			min = this._min,
			valUp = val >= 0,
			perc0 = Math.abs( min ) / ( max - min ) * 100,
			percX = Math.abs( val ) / ( max - min ) * 100;

		sli.roundValue = this._formatValue( val );
		st.height = `${ percX }%`;
		st[ valUp ? "top" : "bottom" ] = "auto";
		st[ valUp ? "bottom" : "top" ] = `${ perc0 }%`;
		el.classList.toggle( "gsuiSliderGroup-sliderInnerDown", !valUp );
	}

	// events:
	_mousedown( e ) {
		if ( !this._evMouseup ) {
			const bcr = this._slidersParent.getBoundingClientRect();

			this._bcr = bcr;
			this._valueSaved.clear();
			this._sliders.forEach( ( sli, id ) => this._valueSaved.set( id, sli.roundValue ) );
			this._evMouseup = this._mouseup.bind( this );
			this._evMousemove = this._mousemove.bind( this );
			document.addEventListener( "mouseup", this._evMouseup );
			document.addEventListener( "mousemove", this._evMousemove );
			this._mousemove( e );
		}
	}
	_mousemove( e ) {
		const sliders = this._selected.size > 0
				? this._selected
				: this._sliders,
			x = e.pageX - this._bcr.left,
			y = e.pageY - this._bcr.top,
			xval = x / this._pxPerBeat,
			yval = Math.min( Math.max( 0, 1 - y / this._bcr.height ), 1 ),
			realyval = yval * ( this._max - this._min ) + this._min;
		let firstWhen = 0;

		sliders.forEach( sli => {
			if ( sli.when <= xval && firstWhen <= xval ) {
				firstWhen = sli.when;
			}
		} );
		sliders.forEach( sli => {
			if ( firstWhen <= sli.when && sli.when <= xval && xval <= sli.when + sli.dur ) {
				sli.realValue = realyval;
				this._sliderValue( sli, realyval );
			}
		} );
	}
	_mouseup() {
		const arr = [];

		document.removeEventListener( "mouseup", this._evMouseup );
		document.removeEventListener( "mousemove", this._evMousemove );
		this._evMouseup =
		this._evMousemove = null;
		this._sliders.forEach( ( sli, id ) => {
			if ( sli.roundValue !== this._valueSaved.get( id ) ) {
				arr.push( [ id, sli.realValue ] );
				delete sli.realValue;
			}
		} );
		if ( arr.length ) {
			this.onchange( arr );
		}
	}
}

gsuiSliderGroup.template = document.querySelector( "#gsuiSliderGroup-template" );
gsuiSliderGroup.template.remove();
gsuiSliderGroup.template.removeAttribute( "id" );
gsuiSliderGroup.sliderTemplate = document.querySelector( "#gsuiSliderGroup-slider-template" );
gsuiSliderGroup.sliderTemplate.remove();
gsuiSliderGroup.sliderTemplate.removeAttribute( "id" );

class gsuiTimeline {
	constructor() {
		const root = gsuiTimeline.template.cloneNode( true ),
			qs = c => root.querySelector( `.gsuiTimeline-${ c }` );

		this.rootElement = root;
		this.stepRound = 1;
		this._evMouseup =
		this._evMousemove =
		this.oninputLoop =
		this.onchangeLoop =
		this.onchangeCurrentTime = null;
		this.width =
		this.height =
		this._loopA =
		this._loopB =
		this._offset =
		this._loopAWas =
		this._loopBWas =
		this._loopClick =
		this._currentTime =
		this._previewCurrentTime = 0;
		this._pxPerBeat = 32;
		this._beatsPerMeasure =
		this._stepsPerBeat = 4;
		this._steps = [];
		this._loop =
		this._loopWas =
		this._timeisdrag =
		this._loopisdrag =
		this._loopisdragA =
		this._loopisdragB = false;
		this._loopSerial =
		this._loopSerialInp = "";
		this._elLoop = qs( "loop" );
		this._elLoopA = qs( "loopA" );
		this._elLoopB = qs( "loopB" );
		this._elCursor = qs( "cursor" );
		this._elLoopBg = qs( "loopBg" );
		this._elLoopBrdA = qs( "loopBrdA" );
		this._elLoopBrdB = qs( "loopBrdB" );
		this._elLoopLine = qs( "loopLine" );
		this._elCurrentTime = qs( "currentTime" );
		this._elCursorPreview = qs( "cursorPreview" );
		Object.seal( this );

		root.onmousedown = this._mousedown.bind( this );
		this._elLoopA.onmousedown = this._mousedownLoop.bind( this, "a" );
		this._elLoopB.onmousedown = this._mousedownLoop.bind( this, "b" );
		this._elLoopBg.onmousedown = this._mousedownLoop.bind( this, "ab" );
		this._elLoopLine.onmousedown = this._mousedownLoopLine.bind( this );
		this._elCurrentTime.onmousedown = this._mousedownTime.bind( this );
		this.currentTime( 0 );
		this.loop( 0, 0 );
	}

	resized() {
		const rc = this.rootElement.getBoundingClientRect();

		this.width = rc.width;
		this.height = rc.height;
	}
	currentTime( beat, isUserAction ) {
		this._currentTime = beat;
		this._elCursor.style.left = this._beatToPx( beat );
		if ( isUserAction && this.onchangeCurrentTime ) {
			this.onchangeCurrentTime( beat );
		}
	}
	offset( beat, pxBeat ) {
		this._offset = Math.max( 0, +beat || 0 );
		this._pxPerBeat = +pxBeat;
		this._render();
	}
	timeSignature( a, b ) {
		this._beatsPerMeasure = Math.max( 1, ~~a );
		this._stepsPerBeat = Math.min( Math.max( 1, ~~b ), 16 );
		this._render();
	}
	beatRound( bt ) { return this._round( bt, "round" ); }
	beatFloor( bt ) { return this._round( bt, "floor" ); }
	beatCeil( bt ) { return this._round( bt, "ceil" ); }
	loop( a, b, isUserAction ) {
		const loopWas = this._loop;
		let la, lb;

		if ( a === false ) {
			this._loop = a;
		} else {
			this._loopA = Math.max( 0, Math.min( a, b ) );
			this._loopB = Math.max( 0, a, b );
		}
		if ( isUserAction ) {
			la = this.beatRound( this._loopA );
			lb = this.beatRound( this._loopB );
		} else {
			la = this._loopA;
			lb = this._loopB;
		}
		if ( a !== false ) {
			this._loop = lb - la > 1 / this._stepsPerBeat / 8;
		}
		if ( isUserAction ) {
			if ( this.oninputLoop ) {
				const serial = loopWas && this._loop
						? this._serialAB( la, lb )
						: undefined;

				if ( loopWas !== this._loop || this._loopSerialInp !== serial ) {
					this._loopSerialInp = serial;
					this.oninputLoop( this._loop, la, lb );
				}
			}
		} else {
			this._loopWas = this._loop;
			this._loopAWas = la;
			this._loopBWas = lb;
			this._loopSerial = this._serialAB( la, lb );
		}
		this._setLoop( la, lb );
	}
	previewCurrentTime( beat ) {
		const el = this._elCursorPreview,
			hide = beat === false;

		if ( !hide ) {
			this._previewCurrentTime = this.beatRound( beat );
			el.style.left = this._beatToPx( this._previewCurrentTime );
		}
		el.classList.toggle( "gsui-hidden", hide );
		return this._previewCurrentTime;
	}

	// private:
	_unselect() {
		window.getSelection().removeAllRanges();
	}
	_round( bt, mathFn ) {
		if ( this.stepRound ) {
			const mod = 1 / this._stepsPerBeat * this.stepRound;

			return Math[ mathFn ]( bt / mod ) * mod;
		}
		return bt;
	}
	_layerX( e ) {
		return e.pageX - this.rootElement.getBoundingClientRect().left;
	}
	_pageXtoBeat( e ) {
		return Math.max( 0, this.beatRound( this._offset + this._layerX( e ) / this._pxPerBeat ) );
	}
	_beatToPx( beat ) {
		return `${ ( beat - this._offset ) * this._pxPerBeat }px`;
	}
	_serialAB( a, b ) {
		return `${ a.toFixed( 4 ) } ${ b.toFixed( 4 ) }`;
	}
	_bindEvents() {
		this._evMouseup = this._mouseup.bind( this );
		this._evMousemove = this._mousemove.bind( this );
		document.addEventListener( "mouseup", this._evMouseup );
		document.addEventListener( "mousemove", this._evMousemove );
	}
	_mousedown() {
		this._unselect();
	}
	_mousedownTime( e ) {
		this._timeisdrag = true;
		this._mousemove( e );
		this._unselect();
		this._bindEvents();
		e.stopPropagation();
	}
	_mousedownLoop( side, e ) {
		this._loopisdrag = true;
		this._loopisdragA = side === "a";
		this._loopisdragB = side === "b";
		this._elLoopBg.classList.toggle( "gsui-hover", side === "ab" );
		this._elLoopBrdA.classList.toggle( "gsui-hover", this._loopisdragA );
		this._elLoopBrdB.classList.toggle( "gsui-hover", this._loopisdragB );
		this._unselect();
		this._bindEvents();
		e.stopPropagation();
	}
	_mousedownLoopLine( e ) {
		const now = Date.now(),
			bt = this._offset + this._layerX( e ) / this._pxPerBeat;

		this._unselect();
		if ( !this._loopClick || now - this._loopClick > 500 ) {
			this._loopClick = now;
		} else {
			this.loop( false, 0, true );
			this.loop( bt, bt, true );
			this._mousedownLoop( "b", e );
		}
		e.stopPropagation();
	}
	_mousemove( e ) {
		if ( this._timeisdrag ) {
			this.previewCurrentTime( this._pageXtoBeat( e ) );
		} else if ( this._loopisdrag ) {
			const la = this._loopisdragA,
				lb = this._loopisdragB;
			let bt = e.movementX / this._pxPerBeat,
				a = this._loopA,
				b = this._loopB;

			if ( la || lb ) {
				la
					? a += bt
					: b += bt;
				if ( a > b ) {
					this._loopisdragA = lb;
					this._loopisdragB = la;
					this._elLoopBrdA.classList.toggle( "gsui-hover", lb );
					this._elLoopBrdB.classList.toggle( "gsui-hover", la );
				}
			} else {
				if ( a + bt < 0 ) {
					bt = -a;
				}
				a += bt;
				b += bt;
			}
			this.loop( a, b, true );
		}
	}
	_mouseup( e ) {
		document.removeEventListener( "mouseup", this._evMouseup );
		document.removeEventListener( "mousemove", this._evMousemove );
		if ( this._timeisdrag ) {
			this.previewCurrentTime( false );
			this.currentTime( this._pageXtoBeat( e ), true );
			this._timeisdrag = false;
		} else if ( this._loopisdrag ) {
			const l = this._loop,
				la = this.beatRound( this._loopA ),
				lb = this.beatRound( this._loopB );

			this._loopA = la;
			this._loopB = lb;
			this._loopisdrag =
			this._loopisdragA =
			this._loopisdragB = false;
			this._elLoopBg.classList.remove( "gsui-hover" );
			this._elLoopBrdA.classList.remove( "gsui-hover" );
			this._elLoopBrdB.classList.remove( "gsui-hover" );
			if ( this.onchangeLoop ) {
				if ( !l ) {
					if ( this._loopWas ) {
						this._loopWas = l;
						this.onchangeLoop( l, this._loopAWas, this._loopBWas );
					}
				} else {
					const serial = this._serialAB( la, lb );

					if ( this._loopWas !== this._loop || this._loopSerial !== serial ) {
						this._loopWas = l;
						this._loopAWas = la;
						this._loopBWas = lb;
						this._loopSerial = serial;
						this.onchangeLoop( l, la, lb );
					}
				}
			}
		}
	}
	_setLoop( beatA, beatB ) {
		const s = this._elLoop.style;

		if ( this._loop ) {
			const px = this._pxPerBeat,
				off = this._offset;

			s.left = `${ ( beatA - off ) * px }px`;
			s.right = `${ this.width - ( beatB - off ) * px }px`;
			s.display = "block";
		} else {
			s.display = "none";
		}
	}
	_render() {
		const rootCL = this.rootElement.classList,
			elSteps = this._steps,
			beatPx = this._pxPerBeat,
			stepsBeat = this._stepsPerBeat,
			stepsMeasure = stepsBeat * this._beatsPerMeasure,
			stepPx = beatPx / stepsBeat,
			stepEm = 1 / stepsBeat,
			stepsDuration = Math.ceil( this.width / stepPx + 2 );
		let stepId = 0,
			step = ~~( this._offset * stepsBeat ),
			em = -this._offset % stepEm;

		rootCL.remove( "gsui-step", "gsui-beat", "gsui-measure" );
		rootCL.add( `gsui-${ beatPx > 24 ? beatPx > 72 ?
				"step" : "beat" : "measure" }` );
		while ( elSteps.length < stepsDuration ) {
			elSteps.push( document.createElement( "div" ) );
		}
		for ( ; stepId < stepsDuration; ++stepId ) {
			const stepRel = step % stepsBeat,
				elStep = elSteps[ stepId ];

			elStep.style.left = `${ em * beatPx }px`;
			elStep.className = `gsuiTimeline-${ step % stepsMeasure ? stepRel
				? "step" : "beat" : "measure" }`;
			elStep.textContent = elStep.className !== "gsuiTimeline-step"
				? ~~( 1 + step / stepsBeat ) : "." ;
			if ( !elStep.parentNode ) {
				this.rootElement.append( elStep );
			}
			++step;
			em += stepEm;
		}
		for ( ; stepId < elSteps.length; ++stepId ) {
			const elStep = elSteps[ stepId ];

			if ( !elStep.parentNode ) {
				break;
			}
			elStep.remove();
		}
		this._elCursor.style.left = this._beatToPx( this._currentTime );
		this._setLoop(
			this.beatRound( this._loopA ),
			this.beatRound( this._loopB ) );
	}
}

gsuiTimeline.template = document.querySelector( "#gsuiTimeline-template" );
gsuiTimeline.template.remove();
gsuiTimeline.template.removeAttribute( "id" );

class gsuiTrack {
	constructor() {
		const root = gsuiTrack.template.cloneNode( true );

		this.onchange =
		this.onrightclickToggle = () => {};
		this.rootElement = root;
		this.rowElement = root.querySelector( ".gsui-row" );
		this._inpName = root.querySelector( ".gsuiTrack-name" );
		this._nameReadonly = true;
		this.data = new Proxy( Object.seal( {
			order: 0,
			name: "",
			toggle: true
		} ), { set: this._setProp.bind( this ) } );
		Object.seal( this );

		this.rowElement.remove();
		this._setToggleEvents( root.querySelector( ".gsuiTrack-toggle" ) );
		this._setNameEvents( this._inpName );
		this.data.toggle = true;
	}

	remove() {
		this.rootElement.remove();
		this.rowElement.remove();
	}
	setPlaceholder( p ) {
		this._inpName.placeholder = p;
	}

	// private:
	_setProp( tar, prop, val ) {
		tar[ prop ] = val;
		if ( prop === "name" ) {
			this._inpName.value = val;
		} else if ( prop === "toggle" ) {
			this.rootElement.classList.toggle( "gsui-mute", !val );
			this.rowElement.classList.toggle( "gsui-mute", !val );
		}
		return true;
	}
	_setToggleEvents( el ) {
		el.oncontextmenu = () => false;
		el.onmousedown = e => {
			if ( e.button === 2 ) {
				this.onrightclickToggle();
			} else if ( e.button === 0 ) {
				this.onchange( { toggle:
					this.data.toggle = !this.data.toggle
				} );
			}
		};
	}
	_setNameEvents( inp ) {
		inp.ondblclick = () => {
			this._nameReadonly = false;
			inp.select();
			inp.focus();
		};
		inp.onfocus = () => {
			if ( this._nameReadonly ) {
				inp.blur();
			}
		};
		inp.onkeydown = e => {
			e.stopPropagation();
			if ( e.key === "Escape" ) {
				inp.value = this.data.name;
				inp.blur();
			} else if ( e.key === "Enter" ) {
				inp.blur();
			}
		};
		inp.onchange = () => {
			this._nameReadonly = true;
			this.onchange( { name:
				this.data.name = inp.value.trim()
			} );
		};
	}
}

gsuiTrack.template = document.querySelector( "#gsuiTrack-template" );
gsuiTrack.template.remove();
gsuiTrack.template.removeAttribute( "id" );

class gsuiTracklist {
	constructor() {
		const root = gsuiTracklist.template.cloneNode( true );

		this.rootElement = root;
		this.onchange =
		this.ontrackadded = () => {};
		this._tracks = new Map();
		this.data = new Proxy( {}, {
			set: this._addTrack.bind( this ),
			deleteProperty: this._delTrack.bind( this )
		} );
		Object.seal( this );
	}

	remove() {
		this.empty();
		this.rootElement.remove();
	}
	empty() {
		Object.keys( this.data ).forEach( id => delete this.data[ id ] );
	}

	// private:
	_addTrack( tar, id, track ) {
		const tr = new gsuiTrack();

		tar[ id ] = tr.data;
		tr.onrightclickToggle = this._muteAll.bind( this, id );
		tr.onchange = obj => this.onchange( { [ id ]: obj } );
		tr.setPlaceholder( `Track ${ this._tracks.size + 1 }` );
		tr.rootElement.dataset.track =
		tr.rowElement.dataset.track = id;
		Object.assign( tr.data, track );
		this._tracks.set( id, tr );
		this.rootElement.append( tr.rootElement );
		this.ontrackadded( tr );
		return true;
	}
	_delTrack( tar, id ) {
		this._tracks.get( id ).remove();
		this._tracks.delete( id );
		delete tar[ id ];
		return true;
	}
	_muteAll( id ) {
		const obj = {},
			trClicked = this._tracks.get( id );
		let allMute = true;

		this._tracks.forEach( tr => {
			allMute = allMute && ( !tr.data.toggle || tr === trClicked );
		} );
		this._tracks.forEach( ( tr, id ) => {
			const toggle = allMute || tr === trClicked;

			if ( toggle !== tr.data.toggle ) {
				obj[ id ] = { toggle };
			}
		} );
		this.onchange( obj );
	}
}

gsuiTracklist.template = document.querySelector( "#gsuiTracklist-template" );
gsuiTracklist.template.remove();
gsuiTracklist.template.removeAttribute( "id" );

class gsuiAnalyser {
	constructor() {
		this.rootElement =
		this._ctx = null;
		Object.seal( this );
	}
	setCanvas( canvas ) {
		this.rootElement = canvas;
		this._ctx = canvas.getContext( "2d" );
	}
	clear() {
		this._ctx.clearRect( 0, 0, this.rootElement.width, this.rootElement.height );
	}
	setResolution( w, h ) {
		const cnv = this.rootElement,
			img = this._ctx.getImageData( 0, 0, cnv.width, cnv.height );

		cnv.width = w;
		cnv.height = h;
		this._ctx.putImageData( img, 0, 0 );
	}
	draw( ldata, rdata ) {
		this._moveImage();
		this._draw( ldata, rdata );
	}

	// private:
	_moveImage() {
		const cnv = this.rootElement,
			img = this._ctx.getImageData( 0, 0, cnv.width, cnv.height - 1 );

		this._ctx.putImageData( img, 0, 1 );
	}
	_draw( ldata, rdata ) {
		const ctx = this._ctx,
			w2 = ctx.canvas.width / 2,
			len = Math.min( w2, ldata.length ),
			imgL = gsuiSpectrum.draw( ctx, ldata, w2 ),
			imgR = gsuiSpectrum.draw( ctx, rdata, w2 ),
			imgLflip = ctx.createImageData( len, 1 );

		for ( let x = 0, x2 = len - 1; x < len; ++x, --x2 ) {
			imgLflip.data[ x * 4     ] = imgL.data[ x2 * 4     ];
			imgLflip.data[ x * 4 + 1 ] = imgL.data[ x2 * 4 + 1 ];
			imgLflip.data[ x * 4 + 2 ] = imgL.data[ x2 * 4 + 2 ];
			imgLflip.data[ x * 4 + 3 ] = imgL.data[ x2 * 4 + 3 ];
		}
		ctx.putImageData( imgLflip, 0, 0 );
		ctx.putImageData( imgR, w2, 0 );
	}
}

class gsuiSpectrum {
	constructor() {
		this.rootElement =
		this._ctx = null;
		Object.seal( this );
	}
	setCanvas( cnv ) {
		this.rootElement = cnv;
		this._ctx = cnv.getContext( "2d" );
		cnv.height = 1;
		cnv.classList.add( "gsuiSpectrum" );
	}
	clear() {
		this._ctx.clearRect( 0, 0, this.rootElement.width, 1 );
	}
	setResolution( w ) {
		this.rootElement.width = w;
		this.rootElement.height = 1;
	}
	draw( data ) {
		this._ctx.putImageData( gsuiSpectrum.draw( this._ctx, data, this.rootElement.width ), 0, 0 );
	}
}

gsuiSpectrum.draw = function( ctx, data, width = data.length ) {
	const img = ctx.createImageData( width, 1 ),
		imgData = img.data,
		datalen = data.length;
	let diSave = -1;

	for ( let i = 0; i < width; ++i ) {
		const x = i * 4,
			di = Math.max( Math.round( datalen * ( 2 ** ( ( i / width ) * 11 - 11 ) ) ), diSave + 1 ),
			datum = 1 - Math.cos( data[ di ] / 255 * Math.PI / 2 );

		diSave = di;
		if ( datum < .05 ) {
			imgData[ x     ] = 4 + 10 * datum | 0;
			imgData[ x + 1 ] = 4 + 10 * datum | 0;
			imgData[ x + 2 ] = 5 + 20 * datum | 0;
		} else {
			const colId = gsuiSpectrum._datumDivision.findIndex( x => datum < x ),
				col = gsuiSpectrum.colors[ colId ],
				datumCut = datum / col[ 3 ];

			imgData[ x     ] = col[ 0 ] * datumCut | 0;
			imgData[ x + 1 ] = col[ 1 ] * datumCut | 0;
			imgData[ x + 2 ] = col[ 2 ] * datumCut | 0;
		}
		imgData[ x + 3 ] = 255;
	}
	return img;
};

gsuiSpectrum._datumDivision = [ .08, .15, .17, .25, .3, .4, .6, .8, Infinity ];
gsuiSpectrum.colors = [
	[   5,   2,  20, .08 ], // 0
	[   8,   5,  30, .15 ], // 1
	[  15,   7,  50, .17 ], // 2
	[  75,   7,  35, .25 ],   // 3
	[  80,   0,   0, .3  ],   // 4
	[ 180,   0,   0, .4  ],   // 5
	[ 200,  25,  10, .6  ], // 6
	[ 200, 128,  10, .8  ], // 7
	[ 200, 200,  20, 1   ], // 8
];

class gsuiSVGDefs {
	constructor() {
		const svg = gsuiSVGDefs.create( "svg" );

		this.rootElement = svg;
		this._defs = new Map();
		this._idPref = `gsuiSVGDefs_${ gsuiSVGDefs._id++ }_`;
		this._elDefs = gsuiSVGDefs.create( "defs" );
		this._optResolution = 0;
		this._w =
		this._h = 0;
		Object.seal( this );

		svg.style.display = "none";
		svg.classList.add( "gsuiSVGDefs" );
		svg.append( this._elDefs );
		document.body.prepend( svg );
	}

	static create( elem ) {
		return document.createElementNS( "http://www.w3.org/2000/svg", elem );
	}

	setDefaultViewbox( w, h ) {
		this._w = w;
		this._h = h;
	}
	empty() {
		this._defs.forEach( def => def.g.remove() );
		this._defs.clear();
	}
	delete( id ) {
		this._defs.get( id ).g.remove();
		this._defs.delete( id );
	}
	add( id, w = 0, h = 0, ...elems ) {
		const g = gsuiSVGDefs.create( "g" );

		g.id = `${ this._idPref }${ id }`;
		g.append( ...elems );
		this._elDefs.append( g );
		this._defs.set( id, { g, w, h } );
	}
	update( id, w, h, ...elems ) {
		const def = this._defs.get( id ),
			g = def.g;

		def.w = w;
		def.h = h;
		while ( g.lastChild ) {
			g.lastChild.remove();
		}
		g.append( ...elems );
	}
	createSVG( id ) {
		const svg = gsuiSVGDefs.create( "svg" ),
			use = gsuiSVGDefs.create( "use" ),
			def = this._defs.get( id ) || {},
			viewBox = `0 0 ${ def.w || this._w } ${ def.h || this._h }`;

		svg.dataset.id = id;
		use.setAttributeNS( "http://www.w3.org/1999/xlink", "href", `#${ this._idPref }${ id }` );
		svg.setAttribute( "viewBox", viewBox );
		svg.setAttribute( "preserveAspectRatio", "none" );
		svg.append( use );
		return svg;
	}
	setSVGViewbox( svg, x, w ) {
		const h = this._defs.get( svg.dataset.id ).h;

		svg.setAttribute( "viewBox", `${ x } 0 ${ w } ${ h }` );
	}
}

gsuiSVGDefs._id = 0;

class gsuiWaveform {
	constructor( el ) {
		const svg = el || document.createElementNS( "http://www.w3.org/2000/svg", "svg" ),
			poly = svg.querySelector( "polygon" );

		this.rootElement = svg;
		this.polygon = poly;
		this.width =
		this.height = 0;
		Object.seal( this );

		svg.setAttribute( "preserveAspectRatio", "none" );
		svg.classList.add( "gsuiWaveform" );
		if ( !poly ) {
			this.polygon = document.createElementNS( "http://www.w3.org/2000/svg", "polygon" );
			svg.append( this.polygon );
		}
	}

	remove() {
		this.empty();
		this.rootElement.remove();
	}
	empty() {
		this.polygon.removeAttribute( "points" );
	}
	setResolution( w, h ) {
		this.width = w;
		this.height = h;
		this.rootElement.setAttribute( "viewBox", `0 0 ${ w } ${ h }` );
	}
	drawBuffer( buf, offset, duration ) {
		gsuiWaveform.drawBuffer( this.polygon, this.width, this.height, buf, offset, duration );
	}
}

gsuiWaveform.drawBuffer = function( polygon, w, h, buf, offset, duration ) {
	const d0 = buf.getChannelData( 0 ),
		d1 = buf.numberOfChannels > 1 ? buf.getChannelData( 1 ) : d0,
		off = offset || 0,
		dur = duration || buf.duration - off;

	gsuiWaveform.draw( polygon, w, h, d0, d1, buf.duration, off, dur );
};

gsuiWaveform.draw = function( polygon, w, h, data0, data1, bufferDuration, offset, duration ) {
	const h2 = h / 2,
		step = duration / bufferDuration * data0.length / w,
		ind = ~~( offset / bufferDuration * data0.length ),
		iinc = ~~Math.max( 1, step / 100 );
	let dots0 = `0,${ h2 + data0[ ind ] * h2 }`,
		dots1 = `0,${ h2 + data1[ ind ] * h2 }`;

	for ( let p = 1; p < w; ++p ) {
		let lmin = Infinity,
			rmax = -Infinity,
			i = ~~( ind + ( p - 1 ) * step );
		const iend = i + step;

		for ( ; i < iend; i += iinc ) {
			lmin = Math.min( lmin, data0[ i ], data1[ i ] );
			rmax = Math.max( rmax, data0[ i ], data1[ i ] );
		}
		if ( Math.abs( rmax - lmin ) * h2 < 1 ) {
			rmax += 1 / h;
			lmin -= 1 / h;
		}
		dots0 += ` ${ p },${ h2 + lmin * h2 }`;
		dots1  =  `${ p },${ h2 + rmax * h2 } ${ dots1 }`;
	}
	polygon.setAttribute( "points", `${ dots0 } ${ dots1 }` );
};

class gsuiWaveforms extends gsuiSVGDefs {
	hdMode( b ) {
		this._optResolution = b ? Infinity : 48;
	}
	update( id, buf ) {
		const polygon = gsuiSVGDefs.create( "polygon" ),
			w = this._optResolution === Infinity ? 260 : buf.duration * 48 | 0,
			h = 48;

		gsuiWaveform.drawBuffer( polygon, w, h, buf );
		return super.update( id, w, h, polygon );
	}
	setSVGViewbox( svg, x, w, bps ) {
		if ( this._optResolution === Infinity ) {
			return super.setSVGViewbox( svg, x * 260, w * 260 );
		}
		return super.setSVGViewbox( svg, x / bps * 48, w / bps * 48 );
	}
}

class gsuiKeysforms extends gsuiSVGDefs {
	update( id, keys, dur ) {
		return super.update( id, dur, 1, ...gsuiKeysforms._render( keys ) );
	}

	static _render( keys ) {
		const arrKeys = Object.values( keys ),
			{ min, size } = gsuiKeysforms._calcMinMax( arrKeys ),
			rowH = 1 / ( size + 1 );

		return arrKeys.map( k => {
			const rect = gsuiSVGDefs.create( "rect" );

			rect.setAttribute( "x", k.when );
			rect.setAttribute( "y", ( size - k.key + min ) * rowH );
			rect.setAttribute( "width", k.duration );
			rect.setAttribute( "height", rowH );
			return rect;
		}, [] );
	}
	static _calcMinMax( arrKeys ) {
		let min = Infinity,
			max = -Infinity;

		arrKeys.forEach( k => {
			min = Math.min( min, k.key );
			max = Math.max( max, k.key );
		} );
		min -= min % 12;
		max += 11 - max % 12;
		return { min, size: max - min };
	}
}

class gsuiDrumsforms extends gsuiSVGDefs {
	update( id, drums, drumrows, dur, stepsPerBeat ) {
		return super.update( id, dur, 1, ...gsuiDrumsforms._render( drums, drumrows, stepsPerBeat ) );
	}

	static _render( drums, drumrows, sPB ) {
		const rowsArr = Object.entries( drumrows ),
			drmW = 1 / sPB,
			drmH = 1 / rowsArr.length,
			orders = rowsArr
				.sort( ( a, b ) => a[ 1 ].order - b[ 1 ].order )
				.reduce( ( obj, [ id ], i ) => {
					obj[ id ] = i;
					return obj;
				}, {} );

		return Object.values( drums )
			.map( d => gsuiDrumsforms._createDrum( d.when, orders[ d.row ], drmW, drmH ), [] );
	}
	static _createDrum( x, y, w, h ) {
		const pol = gsuiSVGDefs.create( "polygon" ),
			yy = y * h,
			mg = h / 7;

		pol.setAttribute( "points", `
			${ x },${ yy + mg }
			${ x },${ yy + h - mg }
			${ x + w },${ yy + h / 2 }
		`);
		return pol;
	}
}

class gsuiWindows {
	constructor() {
		this._arrWindows = [];
		this._objWindows = {};
		this._nbWindowsMaximized = 0;
		this._lowGraphics = false;
		this.onopen =
		this.onclose =
		this._dragLayer =
		this._mouseFnUp =
		this._mouseFnMove =
		this.focusedWindow = null;
		this.setRootElement( document.body );
		Object.seal( this );
	}

	resized() {
		this._arrWindows.forEach( win => {
			if ( win._maximized ) {
				win._callOnresize();
			}
		} );
	}
	lowGraphics( b ) {
		this._lowGraphics = b;
		this.rootElement.classList.toggle( "gsuiWindows-lowGraphics", b );
	}
	setRootElement( el ) {
		if ( el !== this.rootElement ) {
			this._detach();
			this._attachTo( el );
			this._arrWindows.forEach( win => win._attachTo( el ) );
		}
	}
	createWindow( id ) {
		const win = new gsuiWindow( this, id );

		this._arrWindows.push( win );
		this._objWindows[ id ] = win;
		win._attachTo( this.rootElement );
		win.movable( true );
		return win;
	}
	window( winId ) {
		return this._objWindows[ winId ];
	}

	// private and share with gsuiWindow:
	// .........................................................................
	_startMousemoving( cursor, fnMove, fnUp ) {
		window.getSelection().removeAllRanges();
		this._mouseFnUp = this._stopMousemoving.bind( this, fnUp );
		this._mouseFnMove = fnMove;
		document.addEventListener( "mouseup", this._mouseFnUp );
		document.addEventListener( "mousemove", fnMove );
		this._dragLayer.style.cursor = cursor;
		this.rootElement.classList.add( "gsuiWindows-dragging" );
	}
	_stopMousemoving( fnUp, e ) {
		this.rootElement.classList.remove( "gsuiWindows-dragging" );
		document.removeEventListener( "mouseup", this._mouseFnUp );
		document.removeEventListener( "mousemove", this._mouseFnMove );
		this._mouseFnUp =
		this._mouseFnMove = null;
		fnUp( e );
	}

	// private:
	// .........................................................................
	_detach() {
		const el = this.rootElement;

		if ( el ) {
			this._dragLayer.remove();
			el.classList.remove( "gsuiWindows", "gsuiWindows-lowGraphics" );
		}
	}
	_attachTo( el ) {
		const div = document.createElement( "div" );

		this.rootElement = el;
		this._dragLayer = div;
		div.classList.add( "gsuiWindows-drag-layer" );
		el.classList.add( "gsuiWindows" );
		el.classList.toggle( "gsuiWindows-lowGraphics", this._lowGraphics );
		el.prepend( div );
	}
	_open( win ) {
		win.focus();
		if ( this.onopen ) {
			this.onopen( win );
		}
	}
	_close( win ) {
		if ( win === this.focusedWindow ) {
			this.focusedWindow = null;
		}
		if ( this.onclose ) {
			this.onclose( win );
		}
	}
	_onfocusinWin( win, e ) {
		if ( win !== this.focusedWindow ) {
			const z = win.zIndex;

			clearTimeout( win._focusoutTimeoutId );
			this._arrWindows.forEach( win => {
				if ( win.zIndex > z ) {
					win._setZIndex( win.zIndex - 1 );
				}
			} );
			win._setZIndex( this._arrWindows.length - 1 );
			this.focusedWindow = win;
		}
		if ( win.onfocusin ) {
			win.onfocusin( e );
		}
	}
	_winMaximized( _winId ) {
		++this._nbWindowsMaximized;
		this.rootElement.classList.add( "gsuiWindows-maximized" );
		this.rootElement.scrollTop =
		this.rootElement.scrollLeft = 0;
	}
	_winRestored( _winId ) {
		if ( --this._nbWindowsMaximized === 0 ) {
			this.rootElement.classList.remove( "gsuiWindows-maximized" );
		}
	}
}

Object.freeze( gsuiWindows );

class gsuiWindow {
	constructor( parent, id ) {
		const root = gsuiWindow.template.cloneNode( true );

		this.id = id;
		this.parent = parent;
		this.rootElement = root;
		this._elWrap = this._getElem( "wrap" );
		this._elHandlers = this._getElem( "handlers" );
		this._show =
		this._minimized =
		this._maximized = false;
		this.zIndex = 0;
		this.onresize =
		this.onfocusin =
		this.onresizing = null;
		this.rect = Object.seal( { x: 0, y: 0, w: 32, h: 32 } );
		this._restoreRect = Object.seal( { x: 0, y: 0, w: 32, h: 32 } );
		this._magnetPos = Object.seal( { x: 0, y: 0 } );
		this._mousemovePos = Object.seal( { x: 0, y: 0 } );
		this._mousedownPos = Object.seal( { x: 0, y: 0 } );
		this._mousedownHeadHeight = 0;
		this._wMin =
		this._hMin = 32;
		Object.seal( this );

		root.dataset.windowId = id;
		root.addEventListener( "focusin", parent._onfocusinWin.bind( parent, this ) );
		this._getElem( "icon" ).ondblclick = this.close.bind( this );
		this._getElem( "headBtns" ).onclick = this._onclickBtns.bind( this );
		this._getElem( "head" ).onmousedown = this._onmousedownHead.bind( this );
		this._getElem( "title" ).ondblclick =
		this._getElem( "headContent" ).ondblclick = this._ondblclickTitle.bind( this );
		this._elHandlers.onmousedown = this._onmousedownHandlers.bind( this );
		this._setZIndex( 0 );
		this.setTitle( id );
		this.setPosition( 0, 0 );
		this.setSize( 300, 150 );
	}

	open() { return this.openToggle( true ); }
	close() { return this.openToggle( false ); }
	openToggle( b ) {
		if ( b !== this._show ) {
			if ( b ) {
				this._show = true;
				this._setClass( "show", true );
				this.parent._open( this );
			} else if ( !this.onclose || this.onclose() !== false ) {
				this._show = false;
				this._setClass( "show", false );
				this.parent._close( this );
			}
		}
	}

	setIdAttr( id ) {
		this.rootElement.id = id;
	}
	setTitleIcon( icon ) {
		this._getElem( "icon" ).dataset.icon = icon;
	}
	empty() {
		const cnt = this._getElem( "content" ),
			headCnt = this._getElem( "headContent" );

		while ( cnt.lastChild ) {
			cnt.lastChild.remove();
		}
		while ( headCnt.lastChild ) {
			headCnt.lastChild.remove();
		}
	}
	append( ...args ) {
		this._getElem( "content" ).append( ...args );
	}
	headAppend( ...args ) {
		this._getElem( "headContent" ).append( ...args );
	}

	focus() {
		const root = this.rootElement;

		if ( !root.contains( document.activeElement ) ) {
			setTimeout( root.focus.bind( root ), 50 );
		}
	}
	maximize() {
		if ( !this._maximized ) {
			const st = this.rootElement.style;

			this._restoreRect.x = this.rect.x;
			this._restoreRect.y = this.rect.y;
			this._restoreRect.w = this.rect.w;
			if ( !this._minimized ) {
				this._restoreRect.h = this.rect.h;
			}
			st.top = st.left = st.right = st.bottom = st.width = st.height = "";
			this._setClass( "maximized", true );
			this._setClass( "minimized", false );
			this._maximized = true;
			this._minimized = false;
			this._callOnresize();
			this.focus();
			this.parent._winMaximized( this.id );
		}
	}
	minimize() {
		if ( !this._minimized ) {
			const rcRestore = this._restoreRect;

			if ( !this._maximized ) {
				Object.assign( rcRestore, this.rect );
			}
			this._setClass( "minimized", true );
			this._setClass( "maximized", false );
			this._minimized = true;
			this._maximized = false;
			this.setSize( rcRestore.w, this._getHeadHeight(), "nocallback" );
			this.setPosition( rcRestore.x, rcRestore.y );
			this.parent._winRestored( this.id );
		}
	}
	restore() {
		if ( this._minimized || this._maximized ) {
			const rcRestore = this._restoreRect;

			this.focus();
			this._setClass( "minimized", false );
			this._setClass( "maximized", false );
			this._minimized =
			this._maximized = false;
			this.setSize( rcRestore.w, rcRestore.h );
			this.setPosition( rcRestore.x, rcRestore.y );
			this.parent._winRestored( this.id );
		}
	}

	movable( b ) {
		this._setClass( "movable", b );
	}
	setTitle( t ) {
		this._getElem( "title" ).textContent = t;
	}
	setSize( w, h, nocb ) {
		this.rect.w = w;
		this.rect.h = h;
		this.rootElement.style.width = `${ w }px`;
		this.rootElement.style.height = `${ h }px`;
		if ( nocb !== "nocallback" ) {
			this._callOnresize();
		}
	}
	setMinSize( w, h ) {
		this._wMin = w;
		this._hMin = h;
	}
	setPosition( x, y ) {
		this.rect.x = x;
		this.rect.y = y;
		this.rootElement.style.left = `${ x }px`;
		this.rootElement.style.top = `${ y }px`;
	}

	// events:
	_onclickBtns( e ) {
		const act = e.target.dataset.icon;

		if ( act ) {
			this[ act ]();
		}
	}
	_ondblclickTitle( e ) {
		if ( e.target === e.currentTarget ) {
			this._maximized
				? this.restore()
				: this.maximize();
		}
	}
	_onmousedownHead( e ) {
		const clTar = e.target.classList,
			clicked =
				clTar.contains( "gsuiWindow-head" ) ||
				clTar.contains( "gsuiWindow-title" ) ||
				clTar.contains( "gsuiWindow-headContent" );

		if ( clicked && !this._maximized ) {
			this._mousedownPos.x = e.clientX;
			this._mousedownPos.y = e.clientY;
			this._mousemovePos.x =
			this._mousemovePos.y = 0;
			this._setClass( "dragging", true );
			this.parent._startMousemoving( "move",
				this._onmousemoveHead.bind( this ),
				this._onmouseupHead.bind( this ) );
		}
	}
	_onmousedownHandlers( e ) {
		const dir = e.target.dataset.dir;

		if ( dir ) {
			this._mousedownPos.x = e.clientX;
			this._mousedownPos.y = e.clientY;
			this._mousemovePos.x =
			this._mousemovePos.y = 0;
			this._mousedownHeadHeight = this._getHeadHeight();
			this._setClass( "dragging", true );
			this.parent._startMousemoving( `${ dir }-resize`,
				this._onmousemoveHandler.bind( this, dir ),
				this._onmouseupHandler.bind( this, dir ) );
		}
	}
	_onmousemoveHead( e ) {
		const x = e.clientX - this._mousedownPos.x,
			y = e.clientY - this._mousedownPos.y,
			mmPos = this._mousemovePos,
			magnet = this._calcCSSmagnet( "nesw", x, y );

		mmPos.x = x + magnet.x;
		mmPos.y = y + magnet.y;
		this._setCSSrelativeMove( this._elHandlers.style, mmPos.x, mmPos.y );
		if ( !this.parent._lowGraphics ) {
			this._setCSSrelativeMove( this._elWrap.style, mmPos.x, mmPos.y );
		}
	}
	_onmouseupHead() {
		const { x, y } = this.rect,
			m = this._mousemovePos;

		this._setClass( "dragging", false );
		this._resetCSSrelative( this._elWrap.style );
		this._resetCSSrelative( this._elHandlers.style );
		if ( m.x || m.y ) {
			this.setPosition( x + m.x, y + m.y );
			this._restoreRect.x = this.rect.x;
			this._restoreRect.y = this.rect.y;
		}
	}
	_onmousemoveHandler( dir, e ) {
		const fnResize = this.onresizing,
			x = e.clientX - this._mousedownPos.x,
			y = e.clientY - this._mousedownPos.y,
			mmPos = this._mousemovePos,
			magnet = this._calcCSSmagnet( dir, x, y );

		mmPos.x = x + magnet.x;
		mmPos.y = y + magnet.y;
		this._calcCSSrelativeResize( dir, mmPos );
		this._setCSSrelativeResize( this._elHandlers.style, dir, mmPos );
		if ( !this.parent._lowGraphics ) {
			this._setCSSrelativeResize( this._elWrap.style, dir, mmPos );
			if ( fnResize ) {
				const w = this.rect.w,
					h = this.rect.h - this._mousedownHeadHeight;

				switch ( dir ) {
					case "n":  fnResize( w,     h - y ); break;
					case "w":  fnResize( w - x, h     ); break;
					case "e":  fnResize( w + x, h     ); break;
					case "s":  fnResize( w,     h + y ); break;
					case "nw": fnResize( w - x, h - y ); break;
					case "ne": fnResize( w + x, h - y ); break;
					case "sw": fnResize( w - x, h + y ); break;
					case "se": fnResize( w + x, h + y ); break;
				}
			}
		}
	}
	_onmouseupHandler( dir, e ) {
		const { x, y, w, h } = this.rect,
			m = this._mousemovePos;

		this._setClass( "dragging", false );
		this._resetCSSrelative( this._elWrap.style );
		this._resetCSSrelative( this._elHandlers.style );
		if ( m.x || m.y ) {
			switch ( dir ) {
				case "e" : this.setSize( w + m.x, h       ); break;
				case "se": this.setSize( w + m.x, h + m.y ); break;
				case "s" : this.setSize( w,       h + m.y ); break;
				case "sw": this.setSize( w - m.x, h + m.y ); this.setPosition( x + m.x, y       ); break;
				case "w" : this.setSize( w - m.x, h       ); this.setPosition( x + m.x, y       ); break;
				case "nw": this.setSize( w - m.x, h - m.y ); this.setPosition( x + m.x, y + m.y ); break;
				case "n" : this.setSize( w,       h - m.y ); this.setPosition( x,       y + m.y ); break;
				case "ne": this.setSize( w + m.x, h - m.y ); this.setPosition( x,       y + m.y ); break;
			}
		}
	}

	// private:
	_getElem( c ) {
		return this.rootElement.querySelector( `.gsuiWindow-${ c }` );
	}
	_attachTo( parentElem ) {
		parentElem.append( this.rootElement );
	}
	_setClass( clazz, b ) {
		this.rootElement.classList.toggle( `gsuiWindow-${ clazz }`, b );
	}
	_setZIndex( z ) {
		this.zIndex =
		this.rootElement.style.zIndex = z;
	}
	_callOnresize() {
		if ( this.onresize ) {
			const bcr = this._getElem( "content" ).getBoundingClientRect();

			this.onresize( bcr.width, bcr.height );
		}
	}
	_getHeadHeight() {
		return this._getElem( "head" ).getBoundingClientRect().height;
	}
	_calcCSSmagnet( dir, x, y ) {
		const rc = this.rect,
			dirW = dir.includes( "w" ),
			dirN = dir.includes( "n" ),
			dirE = dir.includes( "e" ),
			dirS = dir.includes( "s" ),
			tx = dirW ? rc.x + x : rc.x,
			ty = dirN ? rc.y + y : rc.y,
			parBCR = this.parent.rootElement.getBoundingClientRect(),
			wins = [
				...this.parent._arrWindows,
				{ _show: true, rect: { x: 0, y: 0, w: parBCR.width - 4, h: parBCR.height - 4 } }
			];
		let mgX = 0,
			mgY = 0;

		if ( dirE && dirW ) {
			const mgXa = this._findClosestWin( wins, "x", tx + rc.w, 2, 0 ),
				mgXb = this._findClosestWin( wins, "x", tx, 0, 2 );

			if ( mgXa || mgXb ) {
				mgX = Math.abs( mgXa || Infinity ) < Math.abs( mgXb || Infinity ) ? mgXa : mgXb;
			}
		} else if ( dirE ) {
			mgX = this._findClosestWin( wins, "x", tx + rc.w + x, 2, 0 );
		} else {
			mgX = this._findClosestWin( wins, "x", tx, 0, 2 );
		}
		if ( dirS && dirN ) {
			const mgYa = this._findClosestWin( wins, "y", ty + rc.h, 2, 0 ),
				mgYb = this._findClosestWin( wins, "y", ty, 0, 2 );

			if ( mgYa || mgYb ) {
				mgY = Math.abs( mgYa || Infinity ) < Math.abs( mgYb || Infinity ) ? mgYa : mgYb;
			}
		} else if ( dirS ) {
			mgY = this._findClosestWin( wins, "y", ty + rc.h + y, 2, 0 );
		} else {
			mgY = this._findClosestWin( wins, "y", ty, 0, 2 );
		}
		return { x: mgX, y: mgY };
	}
	_findClosestWin( wins, dir, value, brdL, brdR ) {
		let vAbsMin = Infinity;

		return wins.reduce( ( vMin, win ) => {
			if ( win._show && win.id !== this.id ) {
				const wrc = win.rect,
					wrcDir = wrc[ dir ],
					v1 = wrcDir - brdL - value,
					v2 = wrcDir + ( dir === "x" ? wrc.w : wrc.h ) + brdR - value,
					v1Abs = Math.abs( v1 ),
					v2Abs = Math.abs( v2 ),
					abs = Math.min( v1Abs, v2Abs );

				if ( abs < 10 && abs < vAbsMin ) {
					vAbsMin = abs;
					return v1Abs < v2Abs ? v1 : v2;
				}
			}
			return vMin;
		}, 0 );
	}
	_resetCSSrelative( st ) {
		st.top =
		st.left =
		st.right =
		st.bottom = 0;
	}
	_setCSSrelativeMove( st, x, y ) {
		st.top    = `${  y }px`;
		st.left   = `${  x }px`;
		st.right  = `${ -x }px`;
		st.bottom = `${ -y }px`;
	}
	_calcCSSrelativeResize( dir, mm ) {
		const w = this.rect.w - this._wMin,
			h = this.rect.h - this._mousedownHeadHeight - this._hMin;

		switch ( dir ) {
			case "n" : if ( h - mm.y < 0 ) { mm.y =  h; } break;
			case "s" : if ( h + mm.y < 0 ) { mm.y = -h; } break;
			case "w" :                                    if ( w - mm.x < 0 ) { mm.x =  w; } break;
			case "e" :                                    if ( w + mm.x < 0 ) { mm.x = -w; } break;
			case "nw": if ( h - mm.y < 0 ) { mm.y =  h; } if ( w - mm.x < 0 ) { mm.x =  w; } break;
			case "ne": if ( h - mm.y < 0 ) { mm.y =  h; } if ( w + mm.x < 0 ) { mm.x = -w; } break;
			case "sw": if ( h + mm.y < 0 ) { mm.y = -h; } if ( w - mm.x < 0 ) { mm.x =  w; } break;
			case "se": if ( h + mm.y < 0 ) { mm.y = -h; } if ( w + mm.x < 0 ) { mm.x = -w; } break;
		}
	}
	_setCSSrelativeResize( st, dir, mm ) {
		switch ( dir ) {
			case "n" : st.top    = `${  mm.y }px`; break;
			case "s" : st.bottom = `${ -mm.y }px`; break;
			case "w" : st.left   = `${  mm.x }px`; break;
			case "e" : st.right  = `${ -mm.x }px`; break;
			case "nw": st.left   = `${  mm.x }px`; st.top    = `${  mm.y }px`; break;
			case "ne": st.right  = `${ -mm.x }px`; st.top    = `${  mm.y }px`; break;
			case "sw": st.left   = `${  mm.x }px`; st.bottom = `${ -mm.y }px`; break;
			case "se": st.right  = `${ -mm.x }px`; st.bottom = `${ -mm.y }px`; break;
		}
	}
}

gsuiWindow.template = document.querySelector( "#gsuiWindow-template" );
gsuiWindow.template.remove();
gsuiWindow.template.removeAttribute( "id" );

Object.freeze( gsuiWindow );

function UIdomInit() {
	window.DOM = UIdomFill();
	UIdomGetComments().forEach( com => {
		com.replaceWith( DOM[ com.textContent.substr( 1 ) ] );
	} );
}

function UIdomFill() {
	const DOM = UIdomFillIds(),
		winBtns = DOM.winBtns.querySelectorAll( ".winBtn" );

	DOM.winBtnsMap = Array.prototype.reduce.call( winBtns, ( map, btn ) => {
		map.set( btn.dataset.win, btn );
		return map;
	}, new Map() );
	return DOM;
}

function UIdomFillIds() {
	const ids = document.querySelectorAll( "[id]" );

	return Array.prototype.reduce.call( ids, ( obj, el ) => {
		obj[ el.id ] = el;
		if ( "remove" in el.dataset ) {
			el.remove();
			el.removeAttribute( "data-remove" );
		}
		if ( "removeId" in el.dataset ) {
			el.removeAttribute( "id" );
			el.removeAttribute( "data-remove-id" );
		}
		return obj;
	}, {} );
}

function UIdomGetComments() {
	const list = [],
		treeWalker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_COMMENT,
			{ acceptNode: com => com.textContent[ 0 ] === "#"
				? NodeFilter.FILTER_ACCEPT
				: NodeFilter.FILTER_REJECT
			},
			false
		);

	while ( treeWalker.nextNode() ) {
		list.push( treeWalker.currentNode );
	}
	return list;
}

class TextGlitch {
	constructor( root ) {
		this._root = root;
		this._elClips = root.querySelectorAll( ".TextGlitch-clip" );
		this._elWords = root.querySelectorAll( ".TextGlitch-word" );
		this._frame = this._frame.bind( this );
		this._unglitch = this._unglitch.bind( this );
		this._frameId = null;
		this._text = "";
		this._textAlt = [];
		Object.seal( this );

		this.setTexts( [
			"GridSound",
			"gRIDsOUND",
			"&<:]$+\\#)",
			"6/1)20^?}",
			"9-!>5θnu]",
		] );
	}

	on() {
		if ( !this._frameId ) {
			this._frame();
		}
	}
	off() {
		clearTimeout( this._frameId );
		this._frameId = null;
		this._unglitch();
	}
	setTexts( [ text, ...alt ] ) {
		this._text = text;
		this._textAlt = alt;
	}

	// private:
	_frame() {
		this._glitch();
		setTimeout( this._unglitch, 50 + Math.random() * 200 );
		this._frameId = setTimeout( this._frame, 250 + Math.random() * 800 );
	}
	_glitch() {
		const clip1 = this._randDouble( .2 ),
			clip2 = this._randDouble( .2 );

		this._elClips.forEach( el => {
			const x = this._randDouble( .25 ),
				y = this._randDouble( .05 );

			el.style.transform = `translate(${ x }em, ${ y }em)`;
		} );
		this._elClips[ 0 ].style.clipPath = `inset( 0 0 ${ .6 + clip1 }em 0 )`;
		this._elClips[ 1 ].style.clipPath = `inset( ${ .4 - clip1 }em 0 ${ .3 - clip2 }em 0 )`;
		this._elClips[ 2 ].style.clipPath = `inset( ${ .7 + clip2 }em 0 0 0 )`;
		this._textContent( this._randText() );
		this._root.classList.add( "TextGlitch-blended" );
	}
	_unglitch() {
		this._elClips.forEach( el => {
			el.style.clipPath =
			el.style.transform = "";
		} );
		this._textContent( this._text );
		this._root.classList.remove( "TextGlitch-blended" );
	}

	_randText() {
		const txt = Array.from( this._text );

		for ( let i = 0; i < 5; ++i ) {
			const ind = this._randInt( this._text.length );

			txt[ ind ] = this._textAlt[ this._randInt( this._textAlt.length ) ][ ind ];
		}
		return txt.join( "" );
	}
	_randDouble( d ) {
		return Math.random() * d - d / 2;
	}
	_randInt( n ) {
		return Math.random() * n | 0;
	}
	_textContent( txt ) {
		this._elWords.forEach( el => el.textContent = txt );
	}
}

function UIloading() {
	return new Promise( resolve => {
		const el = document.querySelector( "#loading" ),
			elTitle = document.querySelector( "#gsTitle" ),
			glitch = new TextGlitch( elTitle );

		el.classList.add( "loaded" );
		if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
			glitch.on();
		}
		el.onclick = () => {
			glitch.off();
			el.classList.add( "starting" );
			setTimeout( resolve, 100 );
		};
	} );
}

function UIloaded() {
	const el = document.querySelector( "#loading" );

	el.classList.add( "started" );
	setTimeout( () => el.remove(), 800 );
}

function UIauthInit() {
	DOM.login.onclick = UIauthLogin;
	DOM.logout.onclick = UIauthLogout;
}

function UIauthLoading( b ) {
	DOM.login.dataset.spin =
	DOM.logout.dataset.spin = b ? "on" : "";
}

function UIauthLogout() {
	UIauthLoading( true );
	gsapiClient.logout()
		.finally( () => UIauthLoading( false ) )
		.then( UIauthLogoutThen );
}

function UIauthGetMe() {
	UIauthLoading( true );
	return gsapiClient.getMe()
		.then( me => {
			UIauthLoginThen( me );
			return gsapiClient.getUserCompositions( me.id );
		} )
		.then( cmps => {
			const opt = { saveMode: "cloud" };

			cmps.forEach( cmp => DAW.addComposition( cmp.data, opt ) );
		} )
		.catch( res => {
			if ( res.code !== 401 ) {
				throw res;
			}
		} )
		.finally( () => UIauthLoading( false ) );
}

function UIauthLogin() {
	if ( !gsapiClient.user.id ) {
		gsuiPopup.custom( {
			ok: "Sign in",
			title: "Authentication",
			submit: UIauthLoginSubmit,
			element: DOM.authPopupContent,
		} ).then( () => {
			DOM.authPopupContent.querySelectorAll( "input" )
				.forEach( inp => inp.value = "" );
		} );
		return false;
	}
}

function UIauthLoginSubmit( obj ) {
	UIauthLoading( true );
	DOM.authPopupError.textContent = "";
	return gsapiClient.login( obj.email, obj.password )
		.then( me => {
			UIauthLoginThen( me );
			return gsapiClient.getUserCompositions( me.id );
		} )
		.then( cmps => {
			const opt = { saveMode: "cloud" };

			cmps.forEach( cmp => DAW.addComposition( cmp.data, opt ) );
		} )
		.catch( res => {
			DOM.authPopupError.textContent = res.msg;
			throw res;
		} )
		.finally( () => UIauthLoading( false ) );
}

function UIauthLoginThen( me ) {
	DOM.app.classList.add( "logged" );
	DOM.headUser.href = `https://gridsound.com/#/u/${ me.username }`;
	DOM.headUser.style.backgroundImage = `url("${ me.avatar }")`;
	return me;
}

function UIauthLogoutThen() {
	DOM.app.classList.remove( "logged" );
	DOM.headUser.removeAttribute( "href" );
	DOM.headUser.style.backgroundImage = "";
	Array.from( DOM.cmpsCloudList.children )
		.forEach( el => DAW.deleteComposition( "cloud", el.dataset.id ) );
	if ( !DAW.get.composition() ) {
		UIcompositionClickNewLocal();
	}
}

function UIauthSaveComposition( cmp ) {
	return gsapiClient.saveComposition( cmp )
		.then( () => cmp, err => {
			gsuiPopup.alert( `Error ${ err.code }`,
				"An error happened while saving " +
				"your composition&nbsp;:<br/>" +
				`<code>${ err.msg || err }</code>`
			);
			throw err;
		} );
}

const UIdropCmpExt = {
	gs: true,
	txt: true,
	json: true,
};

function UIdrop( e ) {
	const files = Array.from( e.dataTransfer.files ),
		cmpFile = files.find( f => f.name.split( "." ).pop().toLowerCase() in UIdropCmpExt );

	if ( cmpFile ) {
		DAW.addCompositionByBlob( cmpFile )
			.then( cmp => DAW.openComposition( "local", cmp.id ) );
	}
	return false;
}

const UIdrums = new GSDrums();

function UIdrumsInit() {
	const win = UIwindows.window( "drums" );

	UIdrums.setDAWCore( DAW );
	UIdrums.setFontSize( 42 );
	UIdrums.setPxPerBeat( 120 );
	UIdrums.setWaveforms( window.UIsvgForms.bufferHD );
	UIdrums.rootElement.onfocus = () => DAW.drumsFocus();
	DOM.drumsName.onclick = UIdrumsNameClick;
	win.onresize =
	win.onresizing = ( w, h ) => UIdrums.resize( w, h );
	win.onfocusin = UIdrumsWindowFocusin;
	win.append( UIdrums.rootElement );
	UIdrums.attached();
}

function UIdrumsWindowFocusin( e ) {
	if ( !UIdrums.rootElement.contains( e.target ) ) {
		UIdrums.rootElement.focus();
	}
}

function UIdrumsNameClick() {
	const id = DAW.get.patternDrumsOpened(),
		name = DOM.drumsName.textContent;

	gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
		.then( name => DAW.callAction( "renamePattern", id, name ) );
}

function UItitle( cmpName ) {
	const name = cmpName || "GridSound";

	document.title = DAW.compositionNeedSave() ? `*${ name }` : name;
}

const UIsynth = new GSSynth();

function UIsynthInit() {
	UIsynth.setDAWCore( DAW );
	UIsynth.setWaveList( Array.from( gswaPeriodicWaves.list.keys() ) );
	DOM.synthName.onclick = () => {
		const id = DAW.get.synthOpened(),
			name = DOM.synthName.textContent;

		gsuiPopup.prompt( "Rename synthesizer", "", name, "Rename" )
			.then( name => DAW.callAction( "renameSynth", id, name ) );
	};
	UIwindows.window( "synth" ).append( UIsynth.rootElement );
	UIwindows.window( "synth" ).onresizing = UIsynth.resizing.bind( UIsynth );
	UIwindows.window( "synth" ).onresize = UIsynth.resize.bind( UIsynth );
	UIsynth.attached();
}

function UIsynthOpen( id ) {
	UIsynth.selectSynth( id );
	if ( !id ) {
		DOM.synthName.textContent = "";
		DOM.synthChannelBtn.onclick = null;
	} else {
		const syn = DAW.get.synth( id );

		DOM.synthName.textContent = syn.name;
		DOM.synthChannelBtn.onclick = UImixerOpenChanPopup.bind( null, "synth", id );
		UIwindows.window( "synth" ).open();
	}
}

function UIsynthChange( obj ) {
	if ( "name" in obj ) {
		DOM.synthName.textContent = obj.name;
	}
	if ( "dest" in obj ) {
		DOM.synthChannelBtnText.textContent = DAW.get.channel( obj.dest ).name;
	}
}

const UImixer = new gsuiMixer();

function UImixerInit() {
	const win = UIwindows.window( "mixer" );

	UImixer.onaddChan = UImixerAddChan;
	UImixer.ondeleteChan = UImixerDeleteChan;
	UImixer.onupdateChan = UImixerUpdateChan;
	UImixer.onselectChan = UImixerSelectChan;
	UImixer.oninput = DAW.liveChangeChannel.bind( DAW );
	UImixer.onchange = ( obj, msg ) => DAW.callAction( "changeChannels", obj, msg );
	win.onresize =
	win.onresizing = () => UImixer.resized();
	win.append( UImixer.rootElement );
	UImixer.attached();
}

function UImixerAddChan( id, obj ) {
	const opt = document.createElement( "option" );

	opt.value = id;
	opt.textContent = obj.name;
	DOM.selectChanPopupSelect.append( opt );
}

function UImixerDeleteChan( id ) {
	DOM.selectChanPopupSelect.querySelector( `option[value="${ id }"]` ).remove();
}

function UImixerUpdateChan( id, prop, val ) {
	if ( prop === "name" ) {
		DOM.selectChanPopupSelect.querySelector( `option[value="${ id }"]` ).textContent = val;
		if ( id === UImixer.getCurrentChannelId() ) {
			UIeffectsRenameChan( val );
		}
	}
}

function UImixerSelectChan( id ) {
	UIwindows.window( "mixer" ).open();
	UIwindows.window( "mixer" ).focus();
	UIeffectsSelectChan( id );
}

function UImixerOpenChanPopup( objFamily, objId ) {
	const currChanId = DAW.get[ objFamily ]( objId ).dest;

	DOM.selectChanPopupSelect.value = currChanId;
	gsuiPopup.custom( {
		title: "Channels",
		element: DOM.selectChanPopupContent,
		submit( data ) {
			const dest = data.channel;

			if ( dest !== currChanId ) {
				DAW.callAction( "redirectToChannel", objFamily, objId, dest );
				UImixer.selectChan( dest );
			}
		}
	} );
}

function UIcookieInit() {
	const cookies = document.cookie;

	if ( cookies.indexOf( "cookieAccepted" ) > -1 ) {
		DOM.cookies.remove();
	} else {
		DOM.cookies.onclick = UIcookieClick;
	}
}

function UIcookieClick() {
	gsuiPopup.confirm(
		"Cookie law",
		"Do you accept to let the GridSound's DAW<br/>"
		+ "using Cookies to offers you two features&nbsp;:<ul>"
		+ "<li>Saving compositions locally (localStorage)</li>"
		+ "<li>Offline mode (serviceWorker)</li>"
		+ "</ul>"
		+ "There are no tracker, analytics or adverts of any<br/>"
		+ "kind on this webapp.",
		"Accept", "Decline"
	).then( b => {
		if ( b ) {
			document.cookie = "cookieAccepted";
			DOM.cookies.remove();
		}
	} );
	return false;
}

function UIblocksInit() {
	const win = UIwindows.window( "blocks" ),
		elCnt = win.rootElement.querySelector( ".gsuiWindow-content" ),
		panels = new gsuiPanels( elCnt );

	panels.attached();
}

const UIsynths = new Map();

function UIsynthsAddSynth( id, obj ) {
	const root = DOM.synth.cloneNode( true ),
		html = Object.seal( {
			root,
			name: root.querySelector( ".synth-name" ),
			dest: root.querySelector( ".synth-dest" ),
		} );

	root.dataset.id = id;
	html.name.textContent = obj.name;
	html.dest.textContent = DAW.get.channel( obj.dest ).name;
	UIsynths.set( id, html );
	DOM.keysPatterns.prepend( root );
}

function UIsynthsRemoveSynth( id ) {
	UIsynths.get( id ).root.remove();
	UIsynths.delete( id );
}

function UIsynthsUpdateSynth( id, obj ) {
	if ( "name" in obj ) { UIsynths.get( id ).name.textContent = obj.name; }
	if ( "dest" in obj ) { UIsynthsRedirectSynth( id, obj.dest ); }
}

function UIsynthsRedirectSynth( id, dest ) {
	const html = UIsynths.get( id );

	if ( html ) {
		html.dest.textContent = DAW.get.channel( dest ).name;
	}
}

function UIsynthsUpdateChanName( chanId, name ) {
	UIsynths.forEach( ( html, id ) => {
		if ( DAW.get.synth( id ).dest === chanId ) {
			html.dest.textContent = name;
		}
	} );
}

function UIsynthsExpandSynth( id, b ) {
	const root = UIsynths.get( id ).root,
		show = root.classList.toggle( "synth-show", b );

	root.querySelector( ".synth-showBtn" ).dataset.icon = `caret-${ show ? "down" : "right" }`;
}

function UIsynthsInit() {
	const fnClick = new Map( [
			[ undefined, id => {
				DAW.openSynth( id );
			} ],
			[ "expand", id => {
				UIsynthsExpandSynth( id );
			} ],
			[ "changeDest", id => {
				UImixerOpenChanPopup( "synth", id );
			} ],
			[ "delete", id => {
				if ( Object.keys( DAW.get.synths() ).length > 1 ) {
					DAW.callAction( "removeSynth", id );
				} else {
					gsuiPopup.alert( "Error", "You can not delete the last synthesizer" );
				}
			} ],
			[ "newPattern", id => {
				DAW.callAction( "addPatternKeys", id );
				UIsynthsExpandSynth( id, true );
			} ],
		] );

	DOM.synthNew.onclick = () => DAW.callAction( "addSynth" );
	DOM.keysPatterns.ondragover = e => {
		const syn = e.target.closest( ".synth" );

		if ( syn ) {
			UIsynthsExpandSynth( syn.dataset.id, true );
		}
	};
	DOM.keysPatterns.addEventListener( "dblclick", e => {
		if ( e.target.classList.contains( "synth-info" ) ) {
			UIsynthsExpandSynth( e.target.closest( ".synth" ).dataset.id );
		}
	} );
	DOM.keysPatterns.addEventListener( "click", e => {
		const tar = e.target,
			pat = tar.closest( ".pattern" ),
			syn = !pat && tar.closest( ".synth" );

		if ( syn ) {
			fnClick.get( tar.dataset.action )( syn.dataset.id );
		}
	} );
}

const UIeffects = new GSEffects();

function UIeffectsInit() {
	const win = UIwindows.window( "effects" );

	DOM.channelName.onclick = UIeffectsOnclickName;
	win.append( UIeffects.rootElement );
	win.onresize =
	win.onresizing = () => UIeffects.resized();
	UIeffects.setDAWCore( DAW );
	UIeffects.attached();
	UIeffects._uiEffects.askData = ( fxId, fxType, dataType, ...args ) => {
		if ( fxType === "filter" && dataType === "curve" ) {
			const wafx = DAW.get.audioEffect( fxId );

			return wafx && wafx.updateResponse( args[ 0 ] );
		}
	};
}

function UIeffectsRenameChan( name ) {
	DOM.channelName.textContent = name;
}

function UIeffectsSelectChan( id ) {
	UIeffectsRenameChan( DAW.get.channel( id ).name );
	UIeffects.setDestFilter( id );
}

function UIeffectsOnclickName() {
	const id = UImixer.getCurrentChannelId();

	if ( id !== "main" ) {
		const prev = DOM.channelName.textContent;

		gsuiPopup
			.prompt( "Rename channel", "", prev, "Rename" )
			.then( name => {
				if ( name && name !== prev ) {
					DAW.compositionChange(
						{ channels: { [ id ]: { name } } },
						[ "mixer", "renameChan", name, prev ]
					);
				}
			} );
	}
}

const UIhistoryActions = new Map();

function UIhistoryInit() {
	DAW.cb.historyUndo = act => UIhistoryActions.get( act.index ).classList.add( "historyAction-undone" );
	DAW.cb.historyRedo = act => UIhistoryActions.get( act.index ).classList.remove( "historyAction-undone" );
	DAW.cb.historyAddAction = UIhistoryAddAction;
	DAW.cb.historyDeleteAction = UIhistoryDeleteAction;
	DOM.undo.onclick = () => DAW.history.undo();
	DOM.redo.onclick = () => DAW.history.redo();
}

function UIhistoryAddAction( act ) {
	const div = DOM.historyAction.cloneNode( true );

	UIhistoryActions.set( act.index, div );
	div.children[ 0 ].dataset.icon = act.icon;
	div.children[ 1 ].innerHTML = act.desc;
	div.onclick = () => DAW.history.goToAction( act );
	DOM.historyList.append( div );
	DOM.historyList.scrollTop = 10000000;
}

function UIhistoryDeleteAction( { index } ) {
	UIhistoryActions.get( index ).remove();
	UIhistoryActions.delete( index );
}

const UIwindows = new gsuiWindows();

function UIwindowsInit() {
	UIwindows.setRootElement( DOM.body );
	UIwindows.lowGraphics( true );
	UIwindowsAppendContent( UIwindows );
	UIwindows.onopen = win => UIwindowsBtn( win.id, true );
	UIwindows.onclose = win => {
		UIwindowsBtn( win.id, false );
		switch ( win.id ) {
			case "piano": DAW.closePattern( "keys" ); break;
			case "drums": DAW.closePattern( "drums" ); break;
		}
	};
	DOM.winBtns.onclick = e => {
		const btn = e.target,
			winId = btn.dataset.win;

		if ( winId ) {
			UIwindows.window( winId ).openToggle(
				!btn.classList.contains( "winBtn-open" ) );
		}
	};
	UIwindowsSetPos( "blocks",  "winBlocks",   20,  20, 180, 380, 320, 780, "folder-tree", "blocks" );
	UIwindowsSetPos( "mixer",   "winMixer",   360,  20, 266, 200, 400, 360, "mixer",       "mixer" );
	UIwindowsSetPos( "main",    "winMain",    780,  20, 380, 180, 600, 360, "music",       "composition" );
	UIwindowsSetPos( "synth",   "winSynth",   360, 400, 340, 220, 400, 400, "oscillator",  "synth" );
	UIwindowsSetPos( "piano",   "winPiano",   780, 400, 380, 180, 600, 400, "keys",        "pianoroll" );
	UIwindowsSetPos( "drums",   "winDrums",   410, 450, 380, 180, 900, 400, "drums",       "drums" );
	UIwindowsSetPos( "effects", "winEffects", 480, 120, 230, 180, 420, 360, "effects",     "effects" );
}

function UIwindowsSetPos( winId, attrId, x, y, wmin, hmin, w, h, icon, title ) {
	const win = UIwindows.window( winId );

	win.setSize( w, h );
	win.setMinSize( wmin, hmin );
	win.setTitle( title );
	win.setIdAttr( attrId );
	win.setPosition( x, y );
	win.setTitleIcon( icon );
}

function UIwindowsBtn( winId, b ) {
	DOM.winBtnsMap.get( winId ).classList.toggle( "winBtn-open", b );
}

function UIwindowsAppendContent( UIwindows ) {
	document.querySelectorAll( "div[data-window]" ).forEach( winCnt => {
		const win = UIwindows.createWindow( winCnt.dataset.window ),
			elWinCnt = win.rootElement.querySelector( ".gsuiWindow-content" ),
			child = Array.from( winCnt.children );

		winCnt.remove();
		winCnt.classList.forEach( c => elWinCnt.classList.add( c ) );
		if ( child.length ) {
			const child0 = child[ 0 ];

			if ( child0.classList.contains( "windowMenu" ) ) {
				child.shift();
				win.headAppend.apply( win, child0.children );
			}
			win.append.apply( win, child );
		}
	} );
}

function UIversionsInit() {
	const nums = [
			"0.28.2", "0.28.1", "0.28.0", "0.27.1",
			"0.26.3", "0.26.0", "0.25.4", "0.25.3",
			"0.24.1", "0.24.0", "0.23.1", "0.23.0",
			"0.22.0", "0.21.0", "0.20.3", "0.20.2",
			"0.20.1", "0.19.2",
		],
		curr = document.createElement( "span" );

	curr.classList.add( "versions-link", "versions-linkCurrent" );
	curr.textContent = window.VERSION;
	DOM.versionsList.append( curr, ...nums.map( v => {
		const a = document.createElement( "a" );

		a.classList.add( "versions-link" );
		a.setAttribute( "href", `old/${ v }.html` );
		a.setAttribute( "target", "_blank" );
		a.setAttribute( "rel", "noopener" );
		a.textContent = v;
		return a;
	} ) );
}

window.UIbuffers = new Map();
window.UIpatterns = new Map();
window.UIsvgForms = Object.freeze( {
	keys: new gsuiKeysforms(),
	drums: new gsuiDrumsforms(),
	buffer: new gsuiWaveforms(),
	bufferHD: new gsuiWaveforms(),
} );
window.UIpatternsClickFns = new Map( [
	[ undefined, id => DAW.openPattern( id ) ],
	[ "remove", id => DAW.callAction( "removePattern", id ) ],
	[ "clone", id => DAW.callAction( "clonePattern", id ) ],
	[ "changeDest", id => UImixerOpenChanPopup( "pattern", id ) ],
] );

function UIpatternsInit() {
	const orderBuff = new gsuiReorder({
		rootElement: DOM.buffPatterns,
		itemSelector: "#buffPatterns .pattern",
		handleSelector: "#buffPatterns .pattern-grip",
		parentSelector: "#buffPatterns"
	}),
		orderDrums = new gsuiReorder({
			rootElement: DOM.keysPatterns,
			itemSelector: "#drumsPatterns .pattern",
			handleSelector: "#drumsPatterns .pattern-grip",
			parentSelector: "#drumsPatterns"
		}),
		orderKeys = new gsuiReorder({
			rootElement: DOM.drumsPatterns,
			itemSelector: "#keysPatterns .pattern",
			handleSelector: "#keysPatterns .pattern-grip",
			parentSelector: ".synth-patterns"
		});

	window.UIsvgForms.bufferHD.hdMode( true );
	window.UIsvgForms.bufferHD.setDefaultViewbox( 260, 48 );
	DOM.drumsNew.onclick = () => DAW.callAction( "addPatternDrums" );
	DOM.buffPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "buffer" ) );
	DOM.keysPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "keys" ) );
	DOM.drumsPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "drums" ) );
	document.addEventListener( "drop", e => {
		DAW.dropAudioFiles( e.dataTransfer.files );
	} );
	// orderBuff.onchange = UIpatternsReorderChange.bind( null, DOM.buffPatterns );
	// orderDrums.onchange = UIpatternsReorderChange.bind( null, DOM.drumsPatterns );
	// orderKeys.onchange = UIpatternsKeysReorderChange;
	// orderBuff.setDataTransfert =
	// orderKeys.setDataTransfert =
	// orderDrums.setDataTransfert = UIpatternsDataTransfert;
}

function UIpatternsDataTransfert( elPat ) {
	const id = elPat.dataset.id;

	return `${ id }:${ DAW.get.pattern( id ).duration }`;
}

function UIpatternsReorderChange( el ) {
	const patterns = gsuiReorder.listComputeOrderChange( el, {} );

	DAW.compositionChange( { patterns } );
}

function UIpatternsKeysReorderChange( el, indA, indB, parA, parB ) {
	const patId = el.dataset.id,
		pat = DAW.get.pattern( patId );

	if ( parA === parB ) {
		const patterns = gsuiReorder.listComputeOrderChange( parA, {} );

		DAW.compositionChange(
			{ patterns },
			[ "patterns", "reorderPattern", pat.type, pat.name ]
		);
	} else {
		const synth = parB.parentNode.dataset.id,
			synName = DAW.get.synth( synth ).name,
			patterns = { [ patId ]: { synth } },
			obj = { patterns };

		gsuiReorder.listComputeOrderChange( parA, patterns );
		gsuiReorder.listComputeOrderChange( parB, patterns );
		if ( patId === DAW.get.patternKeysOpened() ) {
			obj.synthOpened = synth;
		}
		DAW.compositionChange(
			obj,
			[ "patterns", "redirectPatternKeys", pat.name, synName ]
		);
	}
}

function UIpatternsBuffersLoaded( buffers ) {
	const pats = DAW.get.patterns();

	Object.entries( buffers ).forEach( ( [ idBuf, buf ] ) => {
		UIbuffers.set( idBuf, buf );
		UIsvgForms.buffer.update( idBuf, buf.buffer );
		UIsvgForms.bufferHD.update( idBuf, buf.buffer );
		UIpatterns.forEach( ( _elPat, idPat ) => {
			if ( pats[ idPat ].buffer === idBuf ) {
				UIupdatePatternContent( idPat );
			}
		} );
	} );
	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern );

		if ( pat.type === "buffer" && pat.buffer in buffers ) {
			UIsvgForms.buffer.setSVGViewbox( elBlc._gsuiSVGform, blc.offset, blc.duration, DAW.get.bpm() / 60 );
		}
	} );
}

function UIpatternsOnclick( type, e ) {
	const pat = e.target.closest( ".pattern" );

	if ( pat ) {
		UIpatternsClickFns.get( e.target.dataset.action )( pat.dataset.id );
	}
}

function UIaddPattern( id, obj ) {
	const pat = DOM.pattern.cloneNode( true );

	pat.dataset.id = id;
	UIpatterns.set( id, pat );
	UIupdatePattern( id, obj );
	switch ( obj.type ) {
		case "buffer":
			UIsvgForms.buffer.add( obj.buffer );
			UIsvgForms.bufferHD.add( obj.buffer );
			pat._gsuiSVGform = window.UIsvgForms.bufferHD.createSVG( obj.buffer );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			DOM.buffPatterns.prepend( pat );
			break;
		case "drums":
			UIsvgForms.drums.add( obj.drums );
			pat._gsuiSVGform = UIsvgForms.drums.createSVG( obj.drums );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			DOM.drumsPatterns.prepend( pat );
			break;
		case "keys": // 1.
			UIsvgForms.keys.add( obj.keys );
			pat._gsuiSVGform = UIsvgForms.keys.createSVG( obj.keys );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			break;
	}
	UIupdatePatternContent( id );
}

function UIremovePattern( id, pat ) {
	const type = pat.type;

	if ( type === "keys" || type === "drums" ) {
		UIsvgForms[ type ].delete( pat[ type ] );
	} else if ( type === "buffer" ) {
		UIsvgForms.buffer.delete( pat.buffer );
		UIsvgForms.bufferHD.delete( pat.buffer );
	}
	UIpatterns.get( id ).remove();
	UIpatterns.delete( id );
}

function UIupdatePattern( id, obj ) {
	if ( obj.synth ) {
		UIchangePatternSynth( id, obj.synth );
	}
	if ( "order" in obj ) {
		UIpatterns.get( id ).dataset.order = obj.order;
	}
	if ( "name" in obj ) {
		UInamePattern( id, obj.name );
	}
	if ( "dest" in obj ) {
		UIredirectPattern( id, obj.dest );
	}
	if ( "duration" in obj && DAW.getFocusedName() === "pianoroll" && id === DAW.get.patternKeysOpened() ) {
		DOM.sliderTime.options( { max: obj.duration } );
	}
}

function UIredirectPattern( id, dest ) {
	const elPat = UIpatterns.get( id );

	if ( elPat ) {
		elPat.querySelector( ".pattern-dest" ).textContent = DAW.get.channel( dest ).name;
	}
}

function UInamePattern( id, name ) {
	UIpatterns.get( id ).querySelector( ".pattern-name" ).textContent = name;
	UIpatternroll.getBlocks().forEach( blc => {
		if ( blc.dataset.pattern === id ) {
			blc.querySelector( ".gsuiPatternroll-block-name" ).textContent = name;
		}
	} );
	if ( id === DAW.get.patternKeysOpened() ) {
		DOM.pianorollName.textContent = name;
	}
	if ( id === DAW.get.patternDrumsOpened() ) {
		DOM.drumsName.textContent = name;
	}
}

function UIchangePatternSynth( patId, synthId ) {
	UIsynths.get( synthId ).root.querySelector( ".synth-patterns" )
		.append( UIpatterns.get( patId ) );
}

function UIupdatePatternsBPM( bpm ) {
	const bps = bpm / 60;

	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern ),
			svg = elBlc._gsuiSVGform;

		if ( svg && pat.type === "buffer" ) {
			UIsvgForms.buffer.setSVGViewbox( svg, blc.offset, blc.duration, bps );
		}
	} );
}

function UIupdatePatternContent( patId ) {
	const get = DAW.get,
		pat = get.pattern( patId ),
		elPat = UIpatterns.get( patId );

	if ( elPat ) {
		const type = pat.type,
			id = pat[ type ];

		if ( type === "keys" ) {
			UIsvgForms.keys.update( id, get.keys( id ), pat.duration );
		} else if ( type === "drums" ) {
			UIsvgForms.drums.update( id, get.drums( id ), get.drumrows(), pat.duration, get.stepsPerBeat() );
		} else if ( type === "buffer" ) {
			const buf = UIbuffers.get( pat.buffer );

			if ( buf ) {
				UIsvgForms.buffer.update( id, buf.buffer );
				UIsvgForms.bufferHD.update( id, buf.buffer );
			}
		}
		if ( type !== "buffer" ) {
			UIsvgForms[ type ].setSVGViewbox( elPat._gsuiSVGform, 0, pat.duration );
		}
	}
}

/*
1. The keys pattern are append with the `synth` attribute.
*/

const UIclock = new gsuiClock();

function UIcontrolsInit() {
	const sliderGain = new gsuiSlider(),
		sliderTime = new gsuiSlider();

	DOM.sliderTime = sliderTime;
	DOM.play.onclick = UIcontrolsClickPlay;
	DOM.stop.onclick = UIcontrolsClickStop;
	DOM.headTempo.onclick = UIcontrolsClickTempo;
	DOM.playToggle.onclick = UIcontrolsClickPlayToggle;
	DOM.tempoBPMTap.onclick = UIcontrolsBPMTap;
	DOM.headCmpInfo.onclick = UIcontrolsClickCmp;
	DOM.headCmpSave.onclick = UIcompositionClickSave;
	DOM.cmpsBtn.onmousedown =
	DOM.undoMore.onmousedown = UIcontrolsDropdownBtnClick;
	sliderGain.oninput = v => DAW.destination.setGain( v );
	sliderGain.options( {
		type: "linear-y", min: 0, max: 1, step: .01, scrollStep: .1,
		value: DAW.destination.getGain(),
	} );
	sliderTime.options( { type: "linear-x", step: .01 } );
	sliderTime.oninput = UIcontrolsSliderTime_oninput;
	sliderTime.onchange = UIcontrolsSliderTime_onchange;
	sliderTime.oninputend = UIcontrolsSliderTime_oninputend;
	sliderTime.oninputstart = UIcontrolsSliderTime_inputstart;
	DOM.headGain.append( sliderGain.rootElement );
	DOM.headCurrentTime.append( sliderTime.rootElement );
	UIclock.rootElement.classList.add( "btnGroup", "btnMarge" );
	DOM.headPlay.after( UIclock.rootElement );
	UIclock.onchangeDisplay = mode => localStorage.setItem( "gsuiClock.display", mode );
	UIclock.setDisplay( localStorage.getItem( "gsuiClock.display" ) || "second" );
	UIclock.attached();
	sliderGain.attached();
	sliderTime.attached();
}

function UIcontrolsSliderTime_inputstart( beat ) {
	DAW.cb.clockUpdate = null;
	UIclock.setTime( beat );
}
function UIcontrolsSliderTime_oninputend( _beat ) {
	DAW.cb.clockUpdate = UIcontrolsClockUpdate;
}
function UIcontrolsSliderTime_oninput( beat ) {
	const beatRound = UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( beat );

	UIclock.setTime( beatRound );
}
function UIcontrolsSliderTime_onchange() {
	const beat = UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( false );

	DAW.getFocusedObject().setCurrentTime( beat );
}

function UIcontrolsBPMTap() {
	DOM.tempoBPM.value = Math.floor( gswaBPMTap.tap() );
}

function UIcontrolsClockUpdate( beat ) {
	UIclock.setTime( beat );
}

function UIcontrolsCurrentTime( beat, focused ) {
	UIcontrolsGetFocusedGrid( focused ).currentTime( beat );
	DOM.sliderTime.setValue( beat );
}

function UIcontrolsClickCmp() {
	gsuiPopup.prompt( "Composition's title", "", DAW.get.name(), "Rename" )
		.then( name => DAW.callAction( "renameComposition", name ) );
}

function UIcontrolsClickPlay() {
	DAW.togglePlay();
}

function UIcontrolsClickPlayToggle() {
	DAW.getFocusedName() === "composition"
		? DAW.pianorollFocus( "-f" )
		: DAW.compositionFocus( "-f" );
}

function UIcontrolsClickStop() {
	DAW.stop();
	switch ( document.activeElement ) {
		case UIdrums.rootElement: DAW.drumsFocus( "-f" ); break;
		case UIpianoroll.rootElement: DAW.pianorollFocus( "-f" ); break;
		case UIpatternroll.rootElement: DAW.compositionFocus( "-f" ); break;
	}
}

function UIcontrolsGetFocusedGrid( focStr = DAW.getFocusedName() ) {
	return focStr === "composition"
		? UIpatternroll
		: focStr === "drums"
			? UIdrums
			: UIpianoroll;
}

function UIcontrolsFocusOn( focStr, b ) {
	if ( b ) {
		const focObj = DAW.getFocusedObject(),
			beat = focObj.getCurrentTime(),
			duration = ( focObj === DAW.composition ? focObj.cmp : focObj ).duration,
			grid = UIcontrolsGetFocusedGrid( focStr ),
			onCmp = focStr === "composition";

		DOM.playToggle.dataset.dir = onCmp ? "up" : "down";
		DOM.sliderTime.options( { max: duration || DAW.get.beatsPerMeasure() } );
		DOM.sliderTime.setValue( beat );
		UIdrums.rootElement.classList.toggle( "selected", focStr === "drums" );
		UIpianoroll.rootElement.classList.toggle( "selected", focStr === "pianoroll" );
		UIpatternroll.rootElement.classList.toggle( "selected", onCmp );
		grid.rootElement.focus();
	}
}

function UIcontrolsDropdownBtnClick( e ) {
	const foc = document.activeElement,
		tar = e.currentTarget;

	if ( foc === tar || foc === tar.nextElementSibling ) {
		e.preventDefault();
		foc.blur();
	}
}

function UIcontrolsClickTempo() {
	DOM.tempoBeatsPM.value = DAW.get.beatsPerMeasure();
	DOM.tempoStepsPB.value = DAW.get.stepsPerBeat();
	DOM.tempoBPM.value = DAW.get.bpm();
	gswaBPMTap.reset();
	gsuiPopup.custom( {
		title: "Tempo",
		element: DOM.tempoPopupContent,
		submit( d ) {
			DAW.callAction( "changeTempo", d.bpm, d.beatsPerMeasure, d.stepsPerBeat );
		},
	} );
}

const UIkeyboardFns = [];

function UIkeyboardInit() {
	UIkeyboardFns.push(
		// ctrlOrAlt, alt, key, fn
		[ true,  false, "o", UIopenPopupShow ],
		[ true,  false, "s", UIcompositionClickSave ],
		[ true,  true,  "n", UIcompositionClickNewLocal ],
		[ true,  false, "z", DOM.undo.onclick ],
		[ true,  false, "Z", DOM.redo.onclick ],
		[ false, false, " ", () => {
			DAW.isPlaying()
				? DOM.stop.onclick()
				: DOM.play.onclick();
		} ],
	);
}

function UIkeyboardUp( e ) {
	UIpianorollKeyboardEvent( false, e );
}

function UIkeyboardDown( e ) {
	if ( !UIkeyboardShortcuts( e ) && !e.ctrlKey && !e.altKey && !e.shiftKey ) {
		UIpianorollKeyboardEvent( true, e );
	}
}

function UIkeyboardShortcuts( e ) {
	return UIkeyboardFns.some( ( [ ctrlOrAlt, alt, key, fn ] ) => {
		if ( ( key === e.key ) &&
			( !alt || e.altKey ) &&
			( ctrlOrAlt === ( e.ctrlKey || e.altKey ) )
		) {
			fn();
			e.preventDefault();
			return true;
		}
	} );
}

function UIopenPopupShow() {
	DOM.inputOpenFile.value =
	DOM.inputOpenURL.value = "";
	gsuiPopup.custom( {
		title: "Open",
		submit: UIopenPopupSubmit,
		element: DOM.openPopupContent,
	} );
	return false;
}

function UIopenPopupSubmit( { url, file } ) {
	if ( url || file[ 0 ] ) {
		return ( url
			? DAW.addCompositionByURL( url )
			: DAW.addCompositionByBlob( file[ 0 ] )
		).then( cmp => DAW.openComposition( "local", cmp.id ) );
	}
}

const UIpianoroll = new gsuiPianoroll(),
	UIkeys = UIpianoroll.uiKeys;

function UIpianorollInit() {
	const win = UIwindows.window( "piano" );

	UIpianoroll.octaves( 1, 7 );
	UIpianoroll.setPxPerBeat( 90 );
	UIpianoroll.setFontSize( 20 );
	UIpianoroll.onchange = obj => DAW.callAction( "changePatternKeys", DAW.get.patternKeysOpened(), obj, UIpianoroll.getDuration() );
	UIpianoroll.onchangeLoop = UIpianorollOnChangeLoop;
	UIpianoroll.onchangeCurrentTime = t => DAW.pianoroll.setCurrentTime( t );
	UIpianoroll.rootElement.onfocus = () => DAW.pianorollFocus();
	UIkeys.onkeydown = midi => DAW.pianoroll.liveKeydown( midi );
	UIkeys.onkeyup = midi => DAW.pianoroll.liveKeyup( midi );
	DOM.pianorollName.onclick = UIpianorollNameClick;
	DOM.pianorollForbidden.classList.remove( "hidden" );
	win.onresize =
	win.onresizing = () => UIpianoroll.resized();
	win.onfocusin = UIpianorollWindowFocusin;
	win.append( UIpianoroll.rootElement );
	UIpianoroll.attached();
}

function UIpianorollOnChangeLoop( looping, a, b ) {
	looping
		? DAW.pianoroll.setLoop( a, b )
		: DAW.pianoroll.clearLoop();
}

function UIpianorollWindowFocusin( e ) {
	if ( !UIpianoroll.rootElement.contains( e.target ) ) {
		UIpianoroll.rootElement.focus();
	}
}

function UIpianorollNameClick() {
	const id = DAW.get.patternKeysOpened(),
		name = DOM.pianorollName.textContent;

	gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
		.then( name => DAW.callAction( "renamePattern", id, name ) );
}

function UIpianorollKeyboardEvent( status, e ) {
	const midi = UIkeys.getMidiKeyFromKeyboard( e );

	if ( midi !== false ) {
		status
			? UIkeys.midiKeyDown( midi )
			: UIkeys.midiKeyUp( midi );
		return true;
	}
}

function UIaboutPopupInit() {
	DOM.helpAbout.onclick = UIaboutPopupShow;
	DOM.versionCheck.onclick = UIaboutPopupVersionCheck;
}

function UIaboutPopupShow() {
	gsuiPopup.custom( {
		title: "About",
		element: DOM.aboutPopupContent,
	} );
	return false;
}

function UIaboutPopupVersionCheck() {
	const dt = DOM.versionIcon.dataset;

	dt.icon = "none";
	dt.spin = "on";
	fetch( `https://gridsound.com/daw/VERSION?${ Math.random() }` )
		.then( res => res.text(), () => {} )
		.then( res => {
			dt.spin = "";
			dt.icon = res === VERSION ? "check" : "warning";
		} );
	return false;
}

const UIpatternroll = new gsuiPatternroll();

function UIpatternrollInit() {
	const win = UIwindows.window( "main" );

	UIpatternroll.setFontSize( 32 );
	UIpatternroll.setPxPerBeat( 40 );
	UIpatternroll.onchangeCurrentTime = t => DAW.composition.setCurrentTime( t );
	UIpatternroll.rootElement.onfocus = () => DAW.compositionFocus();
	UIpatternroll.onchange = UIpatternrollOnChange;
	UIpatternroll.onaddBlock = UIpatternrollOnAddBlock;
	UIpatternroll.oneditBlock = UIpatternrollOnEditBlock;
	UIpatternroll.onchangeLoop = UIpatternrollOnChangeLoop;
	win.onresize =
	win.onresizing = () => UIpatternroll.resized();
	win.onfocusin = UIpatternrollWindowFocusin;
	win.append( UIpatternroll.rootElement );
	UIpatternroll.attached();
}

function UIpatternrollWindowFocusin( e ) {
	if ( !UIpatternroll.rootElement.contains( e.target ) ) {
		UIpatternroll.rootElement.focus();
	}
}

function UIpatternrollOnChange( obj ) {
	const dur = UIpatternroll.getBlocks().size && UIpatternroll.getDuration();

	if ( dur !== DAW.get.duration() ) {
		obj.duration = dur;
	}
	DAW.compositionChange( obj );
}

function UIpatternrollOnChangeLoop( looping, a, b ) {
	DAW.callAction( "changeLoop", looping && a, looping && b );
}

function UIpatternrollOnEditBlock( _id, obj, blc ) {
	if ( blc._gsuiSVGform ) {
		const pat = DAW.get.pattern( obj.pattern );

		UIsvgForms[ pat.type ].setSVGViewbox( blc._gsuiSVGform, obj.offset, obj.duration, DAW.get.bpm() / 60 );
	}
}

function UIpatternrollOnAddBlock( _id, obj, blc ) {
	const pat = DAW.get.pattern( obj.pattern ),
		SVGs = UIsvgForms[ pat.type ],
		svg = SVGs.createSVG( pat[ pat.type ] );

	blc._gsuiSVGform = svg;
	blc.children[ 3 ].append( svg );
	SVGs.setSVGViewbox( svg, obj.offset, obj.duration, DAW.get.bpm() / 60 );
	blc.ondblclick = () => { DAW.openPattern( obj.pattern ); };
	blc.querySelector( ".gsuiPatternroll-block-name" ).textContent = pat.name;
}

function UIrenderPopupInit() {
	DOM.headExport.onclick = UIrenderPopupShow;
	DOM.renderBtn.onclick = UIrenderPopupRender;
}

function UIrenderPopupShow() {
	DOM.renderProgress.value = 0;
	DOM.renderBtn.dataset.status = "0";
	DOM.renderBtn.href = "";
	gsuiPopup.custom( {
		ok: "Close",
		title: "Render",
		element: DOM.renderPopupContent,
	} ).then( () => DAW.abortWAVExport() );
	return false;
}

function UIrenderPopupRender() {
	const a = DOM.renderBtn,
		d = a.dataset;

	if ( d.status === "2" ) {
		return;
	} else if ( d.status === "0" ) {
		const dur = DAW.get.duration() * 60 / DAW.get.bpm();

		d.status = "1";
		UIrenderPopupRender._intervalId = setInterval( () => {
			DOM.renderProgress.value = DAW.ctx.currentTime / dur;
		}, 100 );
		DAW.exportCompositionToWAV().then( obj => {
			clearInterval( UIrenderPopupRender._intervalId );
			DOM.renderProgress.value = 1;
			d.status = "2";
			a.href = obj.url;
			a.download = obj.name;
		} );
	}
	return false;
}

const UImainAnalyser = new gsuiSpectrum();

function UImainAnalyserInit() {
	UImainAnalyser.setCanvas( DOM.headAnalyser );
	UImainAnalyser.setResolution( 140 );
}

const UIcompositions = Object.seal( {
	cloud: new Map(),
	local: new Map(),
	get( cmp ) {
		return this[ cmp.options.saveMode ].get( cmp.id );
	},
	set( cmp, html ) {
		this[ cmp.options.saveMode ].set( cmp.id, html );
	},
	delete( cmp ) {
		this[ cmp.options.saveMode ].delete( cmp.id );
	},
} );

function UIcompositionsInit() {
	DOM.cmpsCloudList.onclick =
	DOM.cmpsLocalList.onclick = UIcompositionClick;
	DOM.cloudNewCmp.onclick = UIcompositionClickNewCloud;
	DOM.localNewCmp.onclick = UIcompositionClickNewLocal;
	DOM.localOpenCmp.onclick = UIopenPopupShow;
	DOM.cmpsCloudList.ondragstart = UIcompositionDragstart.bind( null, "cloud" );
	DOM.cmpsLocalList.ondragstart = UIcompositionDragstart.bind( null, "local" );
	DOM.cmpsCloudList.ondrop = UIcompositionCloudDrop;
	DOM.cmpsLocalList.ondrop = UIcompositionLocalDrop;
}

function UIcompositionDragstart( from, e ) {
	const elCmp = e.target.closest( ".cmp" );

	e.dataTransfer.setData( "text/plain", `${ from }:${ elCmp.dataset.id }` );
}

function UIcompositionDrop( from, to, e ) {
	const [ saveMode, id ] = e.dataTransfer.getData( "text/plain" ).split( ":" );

	if ( saveMode === from ) {
		const cmpFrom = DAW.get.composition( from, id ),
			cmpTo = DAW.get.composition( to, id );

		return !cmpTo
			? Promise.resolve( cmpFrom )
			: gsuiPopup.confirm( "Warning",
				"Are you sure you want to overwrite " +
				`the <b>${ to }</b> composition <i>${ cmpTo.name || "Untitled" }</i>&nbsp;?` )
			.then( b => {
				if ( b ) {
					return cmpFrom;
				}
				throw undefined;
			} );
	}
	return Promise.reject();
}

function UIcompositionLocalDrop( e ) {
	UIcompositionDrop( "cloud", "local", e )
		.then( cmp => DAW.addComposition( cmp, { saveMode: "local" } ) )
		.then( cmp => DAWCore.LocalStorage.put( cmp.id, cmp ) );
}

function UIcompositionCloudDrop( e ) {
	if ( gsapiClient.user.id ) {
		UIcompositionDrop( "local", "cloud", e )
			.then( cmp => UIauthSaveComposition( cmp ) )
			.then( cmp => DAW.addComposition( cmp, { saveMode: "cloud" } ) );
	} else {
		gsuiPopup.alert( "Error",
			"You need to be connected to your account before uploading your composition" );
	}
}

function UIcompositionClick( e ) {
	const cmp = e.target.closest( ".cmp" );

	if ( cmp ) {
		const id = cmp.dataset.id,
			saveMode = DOM.cmpsLocalList.contains( cmp ) ? "local" : "cloud";

		switch ( e.target.dataset.action ) {
			case "save": UIcompositionClickSave(); break;
			case "open": UIcompositionClickOpen( saveMode, id ); e.preventDefault(); break;
			case "json": UIcompositionClickJSONExport( saveMode, id, e ); break;
			case "delete": UIcompositionClickDelete( saveMode, id ); break;
		}
	}
}

function UIcompositionBeforeUnload() {
	if ( DAW.compositionNeedSave() ) {
		return "Data unsaved";
	}
}

function UIcompositionOpened( cmp ) {
	const html = UIcompositions.get( cmp ),
		par = html.root.parentNode;

	html.root.classList.add( "cmp-loaded" );
	par.prepend( html.root );
	par.scrollTop = 0;
	DOM.headCmp.dataset.saveMode =
	DOM.headCmpIcon.dataset.icon = cmp.options.saveMode;
	DOM.headCmpSave.dataset.icon = cmp.options.saveMode === "local" ? "save" : "upload";
	UIsynthsExpandSynth( cmp.synthOpened, true );
	UIeffectsSelectChan( "main" );
	UItitle( cmp.name );
}

function UIcompositionLoading( cmp, loading ) {
	DOM.headCmpSave.dataset.spin =
	UIcompositions.get( cmp ).save.dataset.spin = loading ? "on" : "";
}

function UIcompositionSavedStatus( cmp, saved ) {
	DOM.headCmp.classList.toggle( "cmp-saved", saved );
	UIcompositions.get( cmp ).root.classList.toggle( "cmp-saved", saved );
	UItitle( cmp.name );
}

function UIcompositionDeleted( cmp ) {
	const html = UIcompositions.get( cmp );

	if ( html ) {
		html.root.remove();
		UIcompositions.delete( cmp );
	}
}

function UIcompositionAdded( cmp ) {
	const html = UIcompositions.get( cmp );

	if ( html ) {
		UIcompositionSetInfo( html, cmp );
	} else {
		const root = DOM.cmp.cloneNode( true ),
			local = cmp.options.saveMode === "local",
			html = {
				root,
				bpm: root.querySelector( ".cmp-bpm" ),
				name: root.querySelector( ".cmp-name" ),
				save: root.querySelector( ".cmp-save" ),
				duration: root.querySelector( ".cmp-duration" ),
			};

		root.dataset.id = cmp.id;
		UIcompositionSetInfo( html, cmp );
		UIcompositions.set( cmp, html );
		html.save.dataset.icon = local ? "save" : "upload";
		( local
			? DOM.cmpsLocalList
			: DOM.cmpsCloudList ).append( root );
	}
}

function UIcompositionSetInfo( html, cmp ) {
	const [ min, sec ] = GSUtils.parseBeatsToSeconds( cmp.duration, cmp.bpm );

	html.bpm.textContent = cmp.bpm;
	html.name.textContent = cmp.name;
	html.duration.textContent = `${ min }:${ sec }`;
}

function UIcompositionClosed( cmp ) {
	UIcompositionChanged( {
		bpm: cmp.bpm,
		name: cmp.name,
		duration: cmp.duration,
	}, {} );
	UIcompositions.get( cmp ).root.classList.remove( "cmp-loaded" );
	UIdrums.clear();
	UIdrums.loop( false );
	UIeffects.clear();
	UIsynth.clear();
	// UIdrums.setFontSize( 32 );
	// UIdrums.setPxPerBeat( 40 );
	UIpatternroll.empty();
	UIpatternroll.loop( false );
	UIpatternroll.setFontSize( 32 );
	UIpatternroll.setPxPerBeat( 40 );
	UImixer.empty();
	UIpianoroll.empty();
	UIpianoroll.loop( false );
	DOM.drumsName.textContent =
	DOM.synthName.textContent =
	DOM.pianorollName.textContent = "";
	DOM.pianorollForbidden.classList.add( "hidden" );
	UIpatterns.forEach( pat => pat.remove() );
	UIsynths.forEach( syn => syn.root.remove() );
	UIsynths.clear();
	UIpatterns.clear();
	UIbuffers.clear();
	UIsvgForms.keys.empty();
	UIsvgForms.drums.empty();
	UIsvgForms.buffer.empty();
	UIsvgForms.bufferHD.empty();
}

function UIcompositionClickNewLocal() {
	( !DAW.compositionNeedSave()
		? DAW.addNewComposition()
		: gsuiPopup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
			.then( b => b && DAW.addNewComposition() )
	).then( cmp => cmp && DAW.openComposition( "local", cmp.id ) );
	return false;
}

function UIcompositionClickNewCloud() {
	if ( !gsapiClient.user.id ) {
		gsuiPopup.alert( "Error",
			"You can not create a new composition in the <b>cloud</b><br/>without being connected" );
	} else {
		const saveMode = "cloud",
			opt = { saveMode };

		( !DAW.compositionNeedSave()
			? DAW.addNewComposition( opt )
			: gsuiPopup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
				.then( b => b && DAW.addNewComposition( opt ) )
		).then( cmp => cmp && DAW.openComposition( saveMode, cmp.id ) );
	}
	return false;
}

function UIcompositionClickDelete( saveMode, id ) {
	const html = UIcompositions[ saveMode ].get( id ),
		name = html.name.textContent;

	gsuiPopup.confirm( "Warning",
		`Are you sure you want to delete "${ name }" ? (no undo possible)`,
		"Delete"
	).then( b => {
		if ( b ) {
			( saveMode === "cloud"
			? gsapiClient.deleteComposition( id )
			: Promise.resolve() )
				.catch( err => {
					if ( err.code !== 404 ) {
						gsuiPopup.alert( `Error ${ err.code }`,
							"An error happened while deleting " +
							"your composition&nbsp;:<br/>" +
							`<code>${ err.msg || err }</code>` );
						throw err;
					}
				} )
				.then( () => {
					if ( id === DAW.get.id() ) {
						for ( let next = html.root.nextElementSibling;
							next;
							next = next.nextElementSibling
						) {
							if ( next.dataset.id ) {
								DAW.openComposition( saveMode, next.dataset.id );
								break;
							}
						}
					}
					DAW.deleteComposition( saveMode, id );
				} );
		}
	} );
}

function UIcompositionClickJSONExport( saveMode, id, e ) {
	const json = DAW.exportCompositionToJSON( saveMode, id );

	e.target.href = json.url;
	e.target.download = json.name;
}

function UIcompositionClickOpen( saveMode, id ) {
	if ( DAW.compositionNeedSave() ) {
		gsuiPopup.confirm( "Warning",
			"Are you sure you want to discard unsaved works"
		).then( ok => ok && DAW.openComposition( saveMode, id ) );
	} else {
		DAW.openComposition( saveMode, id );
	}
	return false;
}

function UIcompositionClickSave() {
	if ( document.cookie.indexOf( "cookieAccepted" ) > -1 ) {
		DAW.saveComposition();
	} else {
		gsuiPopup.alert( "Error",
			"You have to accept our cookies before saving locally your composition." );
	}
}

function UIsettingsPopupInit() {
	DOM.headSettings.onclick = UIsettingsPopupShow;
	DOM.settingsUIRateManual.oninput = UIsettingsPopupUIRateOninput;
	DAW.setLoopRate( UIsettingsGetUIRate() );
	UIwindows.lowGraphics( UIsettingsGetLowGraphicsValue() );
}

function UIsettingsPopupUIRateOninput( e ) {
	DOM.settingsUIRateManualFps.textContent = DOM.settingsUIRateManual.value.padStart( 2, "0" );
	if ( e ) {
		DOM.settingsUIRateModeManual.checked = true;
	}
}

function UIsettingsGetLowGraphicsValue() {
	return !!+( localStorage.getItem( "gsuiWindows.lowGraphics" ) || "0" );
}

function UIsettingsGetUIRate() {
	return +localStorage.getItem( "uiRefreshRate" ) || 60;
}

function UIsettingsPopupShow() {
	const uiRefreshRate = UIsettingsGetUIRate();

	( uiRefreshRate >= 60
		? DOM.settingsUIRateModeAuto
		: DOM.settingsUIRateModeManual ).checked = true;
	DOM.settingsUIRateManual.value = uiRefreshRate;
	DOM.settingsWindowsMode.checked = !UIsettingsGetLowGraphicsValue();
	UIsettingsPopupUIRateOninput();
	gsuiPopup.custom( {
		title: "Settings",
		submit: UIsettingsPopupSubmit,
		element: DOM.settingsPopupContent,
	} ).then();
}

function UIsettingsPopupSubmit( form ) {
	const rate = form.UIRateMode === "auto" ? 60 : form.UIRateManual,
		lowGraphics = !form.windowsDirectMode;

	DAW.setLoopRate( rate );
	UIwindows.lowGraphics( lowGraphics );
	localStorage.setItem( "uiRefreshRate", rate );
	localStorage.setItem( "gsuiWindows.lowGraphics", +lowGraphics );
}

function UImidiPopupInit() {
	DOM.headMidi.onclick = UImidiPopupShow;
	DOM.midiUIRateManual.oninput = UImidiPopupUIRateOninput;
	DAW.setLoopRate( UImidiGetUIRate() );
	UIwindows.lowGraphics( UImidiGetLowGraphicsValue() );
}

function UImidiPopupUIRateOninput( e ) {
	DOM.midiUIRateManualFps.textContent = DOM.midiUIRateManual.value.padStart( 2, "0" );
	if ( e ) {
		DOM.midiUIRateModeManual.checked = true;
	}
}

function UImidiGetLowGraphicsValue() {
	return !!+( localStorage.getItem( "gsuiWindows.lowGraphics" ) || "0" );
}

function UImidiGetUIRate() {
	return +localStorage.getItem( "uiRefreshRate" ) || 60;
}

function UImidiPopupShow() {
	const uiRefreshRate = UImidiGetUIRate();

	( uiRefreshRate >= 60
		? DOM.midiUIRateModeAuto
		: DOM.midiUIRateModeManual ).checked = true;
	DOM.midiUIRateManual.value = uiRefreshRate;
	DOM.midiWindowsMode.checked = !UImidiGetLowGraphicsValue();
	UImidiPopupUIRateOninput();
	gsuiPopup.custom( {
		title: "Midi Devices",
		submit: UIMidiPopupSubmit,
		element: DOM.MidiPopupContent,
	} ).then();
}

function UImidiPopupSubmit( form ) {
	const rate = form.UIRateMode === "auto" ? 60 : form.UIRateManual,
		lowGraphics = !form.windowsDirectMode;

	DAW.setLoopRate( rate );
	UIwindows.lowGraphics( lowGraphics );
	localStorage.setItem( "uiRefreshRate", rate );
	localStorage.setItem( "gsuiWindows.lowGraphics", +lowGraphics );
}

function UIshortcutsPopupInit() {
	DOM.helpKeyboardShortcuts.onclick = UIshortcutsPopupShow;
}

function UIshortcutsPopupShow() {
	gsuiPopup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}

function UIcompositionChanged( obj, prevObj ) {
	console.log( "change", obj );
	UIsynth.change( obj );
	UIdrums.change( obj );
	UIeffects.change( obj );
	UIcompositionChanged.fn.forEach( ( fn, attr ) => {
		if ( typeof attr === "string" ) {
			if ( attr in obj ) {
				fn.call( this, obj, prevObj );
			}
		} else if ( attr.some( attr => attr in obj ) ) {
			fn.call( this, obj, prevObj );
		}
	} );
}

UIcompositionChanged.fn = new Map( [
	[ "channels", function( obj ) {
		const synOpenedDest = DAW.get.synth( DAW.get.synthOpened() ).dest,
			synOpenedChan = obj.channels[ synOpenedDest ],
			chanMap = Object.entries( obj.channels ).reduce( ( map, [ id, obj ] ) => {
				if ( obj && "name" in obj ) {
					map.set( id );
				}
				return map;
			}, new Map() );

		UImixer.change( obj );
		Object.entries( DAW.get.synths() ).forEach( ( [ id, syn ] ) => {
			if ( chanMap.has( syn.dest ) ) {
				UIsynthsRedirectSynth( id, syn.dest );
			}
		} );
		Object.entries( DAW.get.patterns() ).forEach( ( [ id, pat ] ) => {
			if ( chanMap.has( pat.dest ) ) {
				UIredirectPattern( id, pat.dest );
			}
		} );
		if ( synOpenedChan && "name" in synOpenedChan ) {
			DOM.synthChannelBtnText.textContent = synOpenedChan.name;
		}
	} ],
	[ "synths", function( { synths }, prevObj ) {
		const synOpened = DAW.get.synthOpened();

		Object.entries( synths ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				UIsynthsRemoveSynth( id );
			} else if ( !prevObj.synths[ id ] ) {
				UIsynthsAddSynth( id, obj );
			} else {
				UIsynthsUpdateSynth( id, obj );
			}
		} );
		if ( synOpened in synths ) {
			UIsynthChange( synths[ synOpened ] );
		}
	} ],
	[ "patterns", function( { patterns }, prevObj ) {
		Object.entries( patterns ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				UIremovePattern( id, prevObj.patterns[ id ] );
			} else if ( !prevObj.patterns[ id ] ) {
				UIaddPattern( id, obj );
			} else {
				UIupdatePattern( id, obj );
			}
		} );
		gsuiReorder.listReorder( DOM.buffPatterns, patterns );
		UIsynths.forEach( syn => {
			const list = syn.root.querySelector( ".synth-patterns" );

			gsuiReorder.listReorder( list, patterns );
		} );
	} ],
	[ [ "tracks", "blocks" ], function( obj ) {
		GSUtils.diffAssign( UIpatternroll.data.tracks, obj.tracks );
		GSUtils.diffAssign( UIpatternroll.data.blocks, obj.blocks );
	} ],
	[ [ "loopA", "loopB" ], function() {
		UIpatternroll.loop(
			DAW.get.loopA(),
			DAW.get.loopB() );
	} ],
	[ [ "beatsPerMeasure", "stepsPerBeat" ], function() {
		const bPM = DAW.get.beatsPerMeasure(),
			sPB = DAW.get.stepsPerBeat();

		UIclock.setStepsPerBeat( sPB );
		UIpatternroll.timeSignature( bPM, sPB );
		UIpianoroll.timeSignature( bPM, sPB );
		DOM.beatsPerMeasure.textContent = bPM;
		DOM.stepsPerBeat.textContent = sPB;
		Object.keys( DAW.get.patterns() ).forEach( UIupdatePatternContent );
	} ],
	[ "bpm", function( { bpm } ) {
		UIclock.setBPM( bpm );
		DOM.bpm.textContent =
		UIcompositions.get( DAW.get.composition() ).bpm.textContent = bpm;
		UIupdatePatternsBPM( bpm );
	} ],
	[ "name", function( { name } ) {
		const cmp = DAW.get.composition();

		UItitle( cmp.name );
		DOM.headCmpName.textContent =
		UIcompositions.get( cmp ).name.textContent = name;
	} ],
	[ "duration", function( { duration } ) {
		const [ min, sec ] = GSUtils.parseBeatsToSeconds( duration, DAW.get.bpm() );

		if ( DAW.getFocusedName() === "composition" ) {
			DOM.sliderTime.options( { max: duration } );
		}
		DOM.headCmpDur.textContent =
		UIcompositions.get( DAW.get.composition() ).duration.textContent = `${ min }:${ sec }`;
	} ],
	[ "drumrows", function( { drumrows } ) {
		const pats = DAW.get.patterns();

		Object.entries( pats ).forEach( ( [ id, pat ] ) => {
			if ( pat.type === "drums" ) {
				UIupdatePatternContent( id );
			}
		} );
	} ],
	[ "drums", function( { drums } ) {
		const pats = DAW.get.patterns(),
			patOpened = pats[ DAW.get.patternDrumsOpened() ];

		Object.entries( pats )
			.filter( kv => kv[ 1 ].type === "drums" && kv[ 1 ].drums in drums )
			.forEach( kv => UIupdatePatternContent( kv[ 0 ] ) );
	} ],
	[ "keys", function( { keys } ) {
		const pats = DAW.get.patterns(),
			patOpened = pats[ DAW.get.patternKeysOpened() ];

		Object.entries( pats )
			.filter( kv => kv[ 1 ].type === "keys" && kv[ 1 ].keys in keys )
			.forEach( kv => UIupdatePatternContent( kv[ 0 ] ) );
		if ( patOpened && patOpened.keys in keys ) {
			GSUtils.diffAssign( UIpianoroll.data, keys[ patOpened.keys ] );
		}
	} ],
	[ "patternDrumsOpened", function( { patternDrumsOpened }, prevObj ) {
		const pat = DAW.get.pattern( patternDrumsOpened ),
			el = pat && UIpatterns.get( patternDrumsOpened ),
			elPrev = UIpatterns.get( prevObj.patternDrumsOpened );

		DOM.drumsName.textContent = pat ? pat.name : "";
		UIdrums.selectPattern( patternDrumsOpened );
		if ( pat ) {
			el.classList.add( "selected" );
			if ( DAW.getFocusedName() === "drums" ) {
				DOM.sliderTime.options( { max: pat.duration } );
			}
			UIwindows.window( "drums" ).open();
		}
		if ( elPrev ) {
			elPrev.classList.remove( "selected" );
		}
	} ],
	[ "synthOpened", function( { synthOpened }, prevObj ) {
		const el = UIsynths.get( synthOpened ),
			elPrev = UIsynths.get( prevObj.synthOpened );

		el && el.root.classList.add( "synth-selected" );
		elPrev && elPrev.root.classList.remove( "synth-selected" );
		UIsynthOpen( synthOpened );
	} ],
	[ "patternKeysOpened", function( { patternKeysOpened }, prevObj ) {
		const pat = DAW.get.pattern( patternKeysOpened ),
			el = pat && UIpatterns.get( patternKeysOpened ),
			elPrev = UIpatterns.get( prevObj.patternKeysOpened );

		UIpianoroll.empty();
		DOM.pianorollName.textContent = pat ? pat.name : "";
		DOM.pianorollForbidden.classList.toggle( "hidden", pat );
		if ( pat ) {
			el.classList.add( "selected" );
			GSUtils.diffAssign( UIpianoroll.data, DAW.get.keys( pat.keys ) );
			UIpianoroll.resetKey();
			UIpianoroll.scrollToKeys();
			if ( DAW.getFocusedName() === "pianoroll" ) {
				DOM.sliderTime.options( { max: pat.duration } );
			}
			UIwindows.window( "piano" ).open();
		} else {
			UIpianoroll.setPxPerBeat( 90 );
		}
		if ( elPrev ) {
			elPrev.classList.remove( "selected" );
		}
	} ],
] );

UIloading().then( UIrun ).then( UIloaded );

function UIrun() {
	const DAW = new DAWCore(),
		hash = new Map( location.hash
			.substr( 1 )
			.split( "&" )
			.map( kv => kv.split( "=" ) )
		);

	gswaPeriodicWaves.list.forEach( ( w, name ) => {
		gsuiPeriodicWave.addWave( name, w.real, w.imag );
	} );

	window.DAW = DAW;
	window.VERSION = "0.28.3";

	UIdomInit();
	UIwindowsInit();

	UIauthInit();
	UIdrumsInit();
	UImixerInit();
	UIsynthInit();
	UIblocksInit();
	UIsynthsInit();
	UIcookieInit();
	UIeffectsInit();
	UIhistoryInit();
	UIversionsInit();
	UIcontrolsInit();
	UIkeyboardInit();
	UIpatternsInit();
	UIpianorollInit();
	UIaboutPopupInit();
	UIpatternrollInit();
	UIrenderPopupInit();
	UImainAnalyserInit();
	UImidiPopupInit();
	UIcompositionsInit();
	UIsettingsPopupInit();
	UIshortcutsPopupInit();

	window.onblur = () => UIkeys.midiReleaseAllKeys();
	window.onkeyup = UIkeyboardUp;
	window.onkeydown = UIkeyboardDown;
	window.onbeforeunload = UIcompositionBeforeUnload;
	document.body.ondrop = UIdrop;
	document.body.ondragover = () => false;
	document.addEventListener( "wheel", e => {
		if ( e.ctrlKey ) {
			e.preventDefault();
		}
	}, { passive: false } );

	DAW.cb.focusOn = UIcontrolsFocusOn;
	DAW.cb.currentTime = UIcontrolsCurrentTime;
	DAW.cb.clockUpdate = UIcontrolsClockUpdate;
	DAW.cb.buffersLoaded = UIpatternsBuffersLoaded;
	DAW.cb.compositionAdded = UIcompositionAdded;
	DAW.cb.compositionOpened = UIcompositionOpened;
	DAW.cb.compositionClosed = UIcompositionClosed;
	DAW.cb.compositionChanged = UIcompositionChanged;
	DAW.cb.compositionDeleted = UIcompositionDeleted;
	DAW.cb.compositionLoading = UIcompositionLoading;
	DAW.cb.compositionSavedStatus = UIcompositionSavedStatus;
	DAW.cb.compositionSavingPromise = UIauthSaveComposition;
	DAW.cb.onstartdrum = rowId => UIdrums.onstartdrum( rowId );
	DAW.cb.onstopdrumrow = rowId => UIdrums.onstopdrumrow( rowId );
	DAW.cb.analyserFilled = UImainAnalyser.draw.bind( UImainAnalyser );
	DAW.cb.channelAnalyserFilled = UImixer.updateAudioData.bind( UImixer );
	DAW.cb.pause =
	DAW.cb.stop = () => DOM.play.dataset.icon = "play";
	DAW.cb.play = () => DOM.play.dataset.icon = "pause";

	DOM.versionNum.textContent =
	DOM.headVersionNum.textContent = window.VERSION;

	DOM.winBtnsMap.forEach( ( btn, id ) => id !== "effects" && id !== "drums" && btn.click() );

	UIauthGetMe();
	DAW.addCompositionsFromLocalStorage();

	if ( !hash.has( "cmp" ) ) {
		UIcompositionClickNewLocal();
	} else {
		DAW.addCompositionByURL( hash.get( "cmp" ) )
			.catch( e => {
				console.error( e );
				return DAW.addNewComposition();
			} )
			.then( cmp => DAW.openComposition( "local", cmp.id ) );
		location.hash = "";
	}
}
