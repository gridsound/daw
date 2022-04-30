"use strict";

class TextGlitch {
	#root = null;
	#text = "";
	#textAlt = [];
	#frameId = null;
	#elClips = null;
	#elWords = null;
	#frameBind = this.#frame.bind( this );
	#unglitchBind = this.#unglitch.bind( this );

	constructor( root ) {
		this.#root = root;
		this.#elClips = root.querySelectorAll( ".TextGlitch-clip" );
		this.#elWords = root.querySelectorAll( ".TextGlitch-word" );
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
		if ( !this.#frameId ) {
			this.#frameBind();
		}
	}
	off() {
		clearTimeout( this.#frameId );
		this.#frameId = null;
		this.#unglitchBind();
	}
	setTexts( [ text, ...alt ] ) {
		this.#text = text;
		this.#textAlt = alt;
	}

	// .........................................................................
	#frame() {
		this.#glitch();
		setTimeout( this.#unglitchBind, 50 + Math.random() * 200 );
		this.#frameId = setTimeout( this.#frameBind, 250 + Math.random() * 400 );
	}
	#glitch() {
		const clip1 = this.#randDouble( .2 );
		const clip2 = this.#randDouble( .2 );

		this.#elClips.forEach( el => {
			const x = this.#randDouble( .06 );
			const y = this.#randDouble( .0 );

			el.style.transform = `translate(${ x }em, ${ y }em)`;
		} );
		this.#elClips[ 0 ].style.clipPath = `inset( 0 0 ${ .6 + clip1 }em 0 )`;
		this.#elClips[ 1 ].style.clipPath = `inset( ${ .4 - clip1 }em 0 ${ .3 - clip2 }em 0 )`;
		this.#elClips[ 2 ].style.clipPath = `inset( ${ .7 + clip2 }em 0 -1em 0 )`;
		this.#textContent( this.#randText() );
		this.#root.classList.add( "TextGlitch-blended" );
	}
	#unglitch() {
		this.#elClips.forEach( el => {
			el.style.clipPath =
			el.style.transform = "";
		} );
		this.#textContent( this.#text );
		this.#root.classList.remove( "TextGlitch-blended" );
	}

	#randText() {
		const txt = Array.from( this.#text );

		for ( let i = 0; i < 5; ++i ) {
			const ind = this.#randInt( this.#text.length );

			txt[ ind ] = this.#textAlt[ this.#randInt( this.#textAlt.length ) ][ ind ];
		}
		return txt.join( "" );
	}
	#randDouble( d ) {
		return Math.random() * d - d / 2;
	}
	#randInt( n ) {
		return Math.random() * n | 0;
	}
	#textContent( txt ) {
		this.#elWords.forEach( el => el.textContent = txt );
	}
}
