"use strict";

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
	DOM.newCloudComposition.onclick = UIcompositionClickNewCloud;
	DOM.newLocalComposition.onclick = UIcompositionClickNewLocal;
	DOM.openLocalComposition.onclick = UIopenPopupShow;
	DOM.cloudCmps.onclick =
	DOM.localCmps.onclick = e => {
		const cmp = e.target.closest( ".cmp" );

		if ( cmp ) {
			const id = cmp.dataset.id,
				saveMode = DOM.localCmps.contains( cmp ) ? "local" : "cloud";

			switch ( e.target.dataset.action ) {
				case "save": UIcompositionClickSave(); break;
				case "open": UIcompositionClickOpen( saveMode, id ); break;
				case "json": UIcompositionClickJSONExport( saveMode, id, e ); break;
				case "delete": UIcompositionClickDelete( saveMode, id ); break;
			}
		}
	};
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
	UIsynthsExpandSynth( cmp.synthOpened, true );
	UItitle();
}

function UIcompositionLoading( cmp, loading ) {
	UIcompositions.get( cmp ).root.classList.toggle( "cmp-loading", loading );
}

function UIcompositionSavedStatus( cmp, saved ) {
	UIcompositions.get( cmp ).root.classList.toggle( "cmp-notSaved", !saved );
	UItitle();
}

function UIcompositionDeleted( cmp ) {
	const html = UIcompositions.get( cmp );

	if ( html ) {
		html.root.remove();
		UIcompositions.delete( cmp );
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
	UIcompositions.set( cmp, html );
	( cmp.options.saveMode === "local"
		? DOM.localCmps
		: DOM.cloudCmps ).append( root );
}

function UIcompositionClosed( cmp ) {
	UIcompositions.get( cmp ).root.classList.remove( "cmp-loaded" );
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
