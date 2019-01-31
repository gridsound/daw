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
	DOM.cloudCmps.onclick =
	DOM.localCmps.onclick = UIcompositionClick;
	DOM.newCloudComposition.onclick = UIcompositionClickNewCloud;
	DOM.newLocalComposition.onclick = UIcompositionClickNewLocal;
	DOM.openLocalComposition.onclick = UIopenPopupShow;
	DOM.cloudCmps.ondragstart = UIcompositionDragstart.bind( null, "cloud" );
	DOM.localCmps.ondragstart = UIcompositionDragstart.bind( null, "local" );
	DOM.cloudCmps.ondrop = UIcompositionCloudDrop;
	DOM.localCmps.ondrop = UIcompositionLocalDrop;
}

function UIcompositionDragstart( from, e ) {
	e.dataTransfer.setData( "text/plain", `${ from }:${ e.target.dataset.id }` );
}

function UIcompositionDrop( from, e ) {
	const [ saveMode, id ] = e.dataTransfer.getData( "text/plain" ).split( ":" );

	return saveMode === from
		? DAW.get.composition( from, id )
		: null;
}

function UIcompositionLocalDrop( e ) {
	const cmp = UIcompositionDrop( "cloud", e );

	cmp && DAW.addComposition( cmp, { saveMode: "local" } )
		.then( cmp => cmp && DAWCore.LocalStorage.put( cmp.id, cmp ) );
}

function UIcompositionCloudDrop( e ) {
	if ( gsapiClient.user.id ) {
		const cmp = UIcompositionDrop( "local", e );

		cmp && UIauthSaveComposition( cmp )
			.then( () => DAW.addComposition( cmp, { saveMode: "cloud" } ) );
	} else {
		gsuiPopup.alert( "Error",
			"You need to be connected before uploading your composition" );
	}
}

function UIcompositionClick( e ) {
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
	UIcompositionChanged( {
		bpm: cmp.bpm,
		name: cmp.name,
		duration: cmp.duration,
	}, {} );
	UIcompositions.get( cmp ).root.classList.remove( "cmp-loaded" );
	UIpatternroll.empty();
	UIpatternroll.loop( false );
	UIpatternroll.setFontSize( 32 );
	UIpatternroll.setPxPerBeat( 40 );
	UIsynth.empty();
	UIpianoroll.empty();
	UIpianoroll.loop( false );
	DOM.synthName.textContent = "";
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
