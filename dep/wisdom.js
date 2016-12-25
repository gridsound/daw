"use strict";

( function() {

var wd = window.wisdom = {},
	arr = [],
	every = arr.every,
	forEach = arr.forEach,
	some = arr.some;



/*	Node.querySelector/All
------------------------------------------------------------------

wisdom.qS( "div" );

document.querySelector( "div" );

  ---

wisdom.qSA( "div" );

document.querySelectorAll( "div" );

  ---

wisdom.qSA( "div" ).forEach( fn );

[].forEach.call( document.querySelectorAll( "div" ), fn );

------------------------------------------------------------------ */
wd.querySelector = wd.qS = qSA.bind( null, false );
wd.querySelectorAll = wd.qSA = qSA.bind( null, true );
function qSA( all, elPar, sel ) {
	if ( !sel ) {
		sel = elPar;
		elPar = document;
	}
	return all
		? attachArrayFn( elPar.querySelectorAll( sel ) )
		: elPar.querySelector( sel );
}



/*	document.createElement
------------------------------------------------------------------

wisdom.cE( "div" );

document.createElement( "div" );
 
  ---

wisdom.cE( "<div id='foo'>" );

var div = document.createElement( "div" );
div.id = "foo";

  ---

wisdom.cE( "<div><b>foo</b></div>" );

var div = document.createElement( "div" );
div.innerHTML = "<b>foo</b>";

  ---

wisdom.cE( "<a></a><b id='foo'></b><i></i>" ).forEach( fn );

var a = document.createElement( "a" ),
    b = document.createElement( "b" ),
    i = document.createElement( "i" );
b.id = "foo";
[ a, b, i ].forEach( fn );

------------------------------------------------------------------ */
wd.createElement = wd.cE = function( nodename ) {
	if ( nodename[ 0 ] !== "<" ) {
		return document.createElement( nodename );
	}
	var div = document.createElement( "div" );
	div.innerHTML = nodename;
	return attachArrayFn( div.children );
};



/* Node.style[ ... ] / getComputedStyle( Node )
------------------------------------------------------------------

.css( element );

getComputedStyle( element );

  ---

.css( [ element, ... ] );

getComputedStyle( [ element, ... ][ 0 ] );

  ---

.css( element, "width" );

getComputedStyle( element ).width;

  ---

.css( [ element, ... ], "width" );

getComputedStyle( [ element, ... ][ 0 ] ).width;

  ---

.css( element, "width", "100%" );

element.style.width = "100%";

  ---

.css( [ element, ... ], "width", "100%" );

[ element, ... ].forEach( function( el ) {
	el.style.width = "100%";
} );

------------------------------------------------------------------ */
wd.css = function( el, prop, val ) {
	var alen = arguments.length;
	return forEachElement( el, alen > 2
		? function( el ) { el.style[ prop ] = val; }
		: function( el ) {
			var st = getComputedStyle( el );
			return alen > 1 ? st[ prop ] : st;
		}
	);
};



/* Node.classList
------------------------------------------------------------------

...

------------------------------------------------------------------ */
wd.cLc = function( el, clazz ) {
	return el.classList.contains( clazz );
};
wd.cLa = setclazz.bind( null, true );
wd.cLr = setclazz.bind( null, false );
wd.cLt = setclazz.bind( null, undefined );
wd.classList = {
	contains: wd.cLc,
	add: wd.cLa,
	remove: wd.cLr,
	toggle: wd.cLt
};
function setclazz( b, el ) {
	var clazz, i = 1,
		cL = el.classList
		aLen = arguments.length,
		lastArg = arguments[ aLen - 1 ];

	if ( typeof lastArg === "boolean" ) {
		b = lastArg;
		--aLen;
	}
	while ( clazz = arguments[ ++i ] ) {
		cL.toggle( clazz, b );
	}
};



// ------------------------------------------------------------------
// Private factorisation stuff
// ------------------------------------------------------------------
// ------------------------------------------------------------------
function forEachElement( els, fn ) {
	if ( els ) {
		if ( els.length === undefined ) {
			return fn( els, 0 );
		}
		for ( var res, el, i = 0; el = els[ i ]; ++i ) {
			if ( ( res = fn( el, i ) ) !== undefined ) {
				return res;
			}
		}
	}
}

function attachArrayFn( nl ) {
	nl.every = every;
	nl.forEach = forEach;
	nl.some = some;
	return nl;
}

} )();
