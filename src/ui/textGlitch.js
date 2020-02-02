"use strict";

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
