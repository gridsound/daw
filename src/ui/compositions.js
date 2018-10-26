"use strict";

const UIcompositions = new Map();

function UIcompositionsInit() {
	DOM.newComposition.onclick = UIcompositionClickNew;
	DOM.openComposition.onclick = UIopenPopupShow;
	DOM.renderComposition.onclick = UIrenderPopupShow;
	DOM.cmps.onclick = e => {
		const cmp = e.target.closest( ".cmp" );

		if ( cmp ) {
			const id = cmp.dataset.id;

			switch ( e.target.dataset.action ) {
				case "save": UIcompositionClickSave(); break;
				case "open": UIcompositionClickOpen( id ); break;
				case "json": UIcompositionClickJSONExport( id, e ); break;
				case "delete": UIcompositionClickDelete( id ); break;
			}
		}
	};
}

function UIcompositionBeforeUnload() {
	if ( DAW.compositionNeedSave() ) {
		return "Data unsaved";
	}
}

function UIcompositionOpened( { id, synthOpened } ) {
	const html = UIcompositions.get( id );

	html.root.classList.add( "cmp-loaded" );
	DOM.cmps.prepend( html.root );
	DOM.cmps.scrollTop = 0;
	UIsynthsExpandSynth( synthOpened, true );
	UItitle();
}

function UIcompositionSaved( { id }, saved ) {
	UIcompositions.get( id ).root.classList.toggle( "cmp-notSaved", !saved );
	UItitle();
}

function UIcompositionDeleted( { id } ) {
	const html = UIcompositions.get( id );

	if ( html ) {
		html.root.remove();
		UIcompositions.delete( id );
	}
}

function UIcompositionAdded( cmp ) {
	const root = DOM.cmp.cloneNode( true ),
		html = {
			root,
			bpm: root.querySelector( ".cmp-bpm" ),
			name: root.querySelector( ".cmp-name" ),
			duration: root.querySelector( ".cmp-duration" ),
		};

	root.dataset.id = cmp.id;
	html.bpm.textContent = cmp.bpm;
	html.name.textContent = cmp.name;
	html.duration.textContent = DAWCore.time.beatToMinSec( cmp.duration, cmp.bpm );
	UIcompositions.set( cmp.id, html );
	DOM.cmps.append( root );
}

function UIcompositionClosed( cmp ) {
	UIcompositions.get( cmp.id ).root.classList.remove( "cmp-loaded" );
	UIpatternroll.empty();
	UIpatternroll.loop( false );
	UIpatternroll.setFontSize( 32 );
	UIpatternroll.setPxPerBeat( 40 );
	UIsynth.empty();
	UIpianoroll.empty();
	UIpianoroll.loop( false );
	DOM.pianorollName.textContent = "";
	DOM.pianorollBlock.classList.remove( "show" );
	UIsynths.forEach( syn => syn.remove() );
	UIsynths.clear();
	UIpatterns.clear();
}

function UIcompositionClickNew() {
	( !DAW.compositionNeedSave()
		? DAW.addNewComposition()
		: gsuiPopup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
			.then( b => b && DAW.addNewComposition() )
	).then( cmp => cmp && DAW.openComposition( cmp.id ) );
	return false;
}

function UIcompositionClickDelete( id ) {
	const cmp = DAW.get.composition( id );

	gsuiPopup.confirm( "Warning",
		`Are you sure you want to delete "${ cmp.name }" ? (no undo possible)`,
		"Delete"
	).then( b => {
		if ( b ) {
			if ( id === DAW.get.id() ) {
				const next = Array.from( UIcompositions.keys() )[ 1 ];

				if ( next ) {
					DAW.openComposition( next );
				}
			}
			DAW.deleteComposition( id );
		}
	} );
}

function UIcompositionClickJSONExport( id, e ) {
	const json = DAW.exportCompositionToJSON( id );

	e.target.href = json.url;
	e.target.download = json.name;
}

function UIcompositionClickOpen( id ) {
	if ( DAW.compositionNeedSave() ) {
		gsuiPopup.confirm( "Warning",
			"Are you sure you want to discard unsaved works"
		).then( ok => ok && UIcompositionClickOpen_then( id ) );
	} else {
		UIcompositionClickOpen_then( id );
	}
	return false;
}

function UIcompositionClickOpen_then( id ) {
	DAW.openComposition( id ).then( () => {
		DOM.cmps.scrollTop = 0;
	} );
}

function UIcompositionClickSave() {
	if ( document.cookie.indexOf( "cookieAccepted" ) > -1 ) {
		DAW.saveComposition();
	} else {
		gsuiPopup.alert( "Error",
			"You have to accept our cookies before saving locally your composition." );
	}
}
