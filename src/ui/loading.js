"use strict";

function UIloading() {
	return new Promise( resolve => {
		const el = document.querySelector( "#loading" );

		el.classList.add( "loaded" );
		UItitleGlitch.init();
		UItitleGlitch.on();
		el.onclick = () => {
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

const UItitleGlitch = {
	init() {
		this._root = document.querySelector( "#gsTitle" );
		this._titles = this._root.querySelectorAll( ".gsTitle-title" );
		this._frame = this._frame.bind( this );
		this.setTexts( [
			"GridSound",
			"gRIDsOUND",
			"&<:]$+\\#)",
			"6/1)20*?}",
			"9-.>5_^!]",
		] );
	},
	on() {
		if ( !this._frameId ) {
			this._frame();
		}
	},
	off() {
		cancelAnimationFrame( this._frameId );
		delete this._frameId;
	},
	setTexts( [ text, ...alt ] ) {
		this._text = text;
		this._textAlt = alt;
	},

	// private:
	_text: "",
	_textAlt: [],
	_rand( n ) {
		return Math.random() * n | 0;
	},
	_textContent( txt ) {
		this._titles.forEach( el => el.textContent = txt );
	},
	_frame() {
		const txt = Array.from( this._text );

		for ( let i = 0; i < 6; ++i ) {
			const ind = this._rand( this._text.length );

			txt[ ind ] = this._textAlt[ this._rand( this._textAlt.length ) ][ ind ];
		}
		this._textContent( txt.join( "" ) );
		this._root.classList.add( "gsTitle-glitched" );
		setTimeout( () => {
			this._textContent( this._text );
			this._root.classList.remove( "gsTitle-glitched" );
		}, 50 + Math.random() * 250 );
		this._frameId = setTimeout( this._frame, 250 + Math.random() * 500 );
	}
};
