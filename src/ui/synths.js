"use strict";

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
