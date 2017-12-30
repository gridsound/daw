"use strict";

function Undoredo() {
	this.init( {} );
}

Undoredo.prototype = {
	init( obj ) {
		if ( this._stack && this.onremoveAction ) {
			this._stack.forEach( this.onremoveAction );
		}
		this._stack = [];
		this._stackInd = 0;
		this._store = obj || {};
	},
	change( obj ) {
		var act,
			stack = this._stack,
			stackInd = this._stackInd,
			stackLen = stack.length;

		if ( stackInd < stackLen ) {
			if ( this.onremoveAction ) {
				while ( stackInd < stackLen ) {
					this.onremoveAction( this._stack[ --stackLen ] );
				}
			}
			stack.length = stackInd;
		}
		++this._stackInd
		act = {
			redo: obj,
			undo: this._composeUndo( this._store, obj )
		};
		act.index = stack.push( act );
		this.onnewAction && this.onnewAction( act );
		this._assign( this._store, obj );
	},
	goToAction( act ) {
		var n = act.index - this._stackInd;

		if ( n < 0 ) {
			while ( n++ < 0 ) { this.undo(); }
		} else if ( n > 0 ) {
			while ( n-- > 0 ) { this.redo(); }
		}
	},
	getCurrentAction() {
		return this._stack[ this._stackInd - 1 ];
	},
	undo() {
		if ( this._stackInd > 0 ) {
			var act = this._stack[ --this._stackInd ];

			this.onundoAction && this.onundoAction( act );
			this._assign( this._store, act.undo );
			return act.undo;
		}
	},
	redo() {
		if ( this._stackInd < this._stack.length ) {
			var act = this._stack[ this._stackInd++ ];

			this.onredoAction && this.onredoAction( act );
			this._assign( this._store, act.redo );
			return act.redo;
		}
	},

	// private:
	_composeUndo( data, obj ) {
		if ( data && obj && typeof data === "object" && typeof obj === "object" ) {
			var k, undo = {};

			for ( k in obj ) {
				if ( data[ k ] !== obj[ k ] ) {
					undo[ k ] = this._composeUndo( data[ k ], obj[ k ] );
				}
			}
			return undo;
		}
		return data;
	},
	_assign( data, obj, path, objSave ) {
		if ( data && obj && typeof data === "object" && typeof obj === "object" ) {
			var k, val, prev, npath;

			objSave = objSave || obj;
			for ( k in obj ) {
				npath = path ? path + "." + k : k;
				prev = data[ k ];
				val = this._assign( prev, obj[ k ], npath, objSave );
				if ( val !== prev ) {
					if ( val == null ) {
						delete data[ k ];
					} else {
						data[ k ] = val;
					}
					this.onchange && this.onchange( objSave, npath, val, prev );
				}
			}
			return data;
		}
		return obj;
	}
};
