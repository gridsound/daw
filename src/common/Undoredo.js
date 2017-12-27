"use strict";

function Undoredo() {
	this.init( {} );
}

Undoredo.prototype = {
	init( obj ) {
		this._store = obj || {};
		this._stack = [];
		this._stackInd = 0;
	},
	change( obj ) {
		if ( this._stackInd < this._stack.length ) {
			this._stack.length = this._stackInd;
		}
		this._stack.push( [ obj, this._composeUndo( this._store, obj ) ] );
		++this._stackInd;
		this._assign( this._store, obj );
	},
	undo() {
		var r = this._stackInd > 0;

		r && this._assign( this._store, this._stack[ --this._stackInd ][ 1 ] );
		return r;
	},
	redo() {
		var r = this._stackInd < this._stack.length;

		r && this._assign( this._store, this._stack[ this._stackInd++ ][ 0 ] );
		return r;
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
