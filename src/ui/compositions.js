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
	DOM.cmpsCloudList.onclick =
	DOM.cmpsLocalList.onclick = UIcompositionClick;
	DOM.cloudNewCmp.onclick = UIcompositionClickNewCloud;
	DOM.localNewCmp.onclick = UIcompositionClickNewLocal;
	DOM.localOpenCmp.onclick = UIopenPopupShow;
	DOM.cmpsCloudList.ondragstart = UIcompositionDragstart.bind( null, "cloud" );
	DOM.cmpsLocalList.ondragstart = UIcompositionDragstart.bind( null, "local" );
	DOM.cmpsCloudList.ondrop = UIcompositionCloudDrop;
	DOM.cmpsLocalList.ondrop = UIcompositionLocalDrop;
}

function UIcompositionDragstart( from, e ) {
	const elCmp = e.target.closest( ".cmp" );

	e.dataTransfer.setData( "text/plain", `${ from }:${ elCmp.dataset.id }` );
}

function UIcompositionDrop( from, to, e ) {
	const [ saveMode, id ] = e.dataTransfer.getData( "text/plain" ).split( ":" );

	if ( saveMode === from ) {
		const cmpFrom = DAW.get.composition( from, id ),
			cmpTo = DAW.get.composition( to, id );

		return !cmpTo
			? Promise.resolve( cmpFrom )
			: gsuiPopup.confirm( "Warning",
				"Are you sure you want to overwrite " +
				`the <b>${ to }</b> composition <i>${ cmpTo.name || "Untitled" }</i>&nbsp;?` )
			.then( b => {
				if ( b ) {
					return cmpFrom;
				}
				throw undefined;
			} );
	}
	return Promise.reject();
}

function UIcompositionLocalDrop( e ) {
	UIcompositionDrop( "cloud", "local", e )
		.then( cmp => DAW.addComposition( cmp, { saveMode: "local" } ) )
		.then( cmp => DAWCore.LocalStorage.put( cmp.id, cmp ) );
}

function UIcompositionCloudDrop( e ) {
	if ( gsapiClient.user.id ) {
		UIcompositionDrop( "local", "cloud", e )
			.then( cmp => UIauthSaveComposition( cmp ) )
			.then( cmp => DAW.addComposition( cmp, { saveMode: "cloud" } ) );
	} else {
		gsuiPopup.alert( "Error",
			"You need to be connected to your account before uploading your composition" );
	}
}

function UIcompositionClick( e ) {
	const cmp = e.target.closest( ".cmp" );

	if ( cmp ) {
		const id = cmp.dataset.id,
			saveMode = DOM.cmpsLocalList.contains( cmp ) ? "local" : "cloud";

		switch ( e.target.dataset.action ) {
			case "save": UIcompositionClickSave(); break;
			case "open": UIcompositionClickOpen( saveMode, id ); e.preventDefault(); break;
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
	DOM.headCmp.dataset.saveMode =
	DOM.headCmpIcon.dataset.icon = cmp.options.saveMode;
	DOM.headCmpSave.dataset.icon = cmp.options.saveMode === "local" ? "save" : "upload";
	UIpatterns._uiPatterns.expandSynth( cmp.synthOpened, true );
	UIeffectsSelectChan( "main" );
	UItitle( cmp.name );
}

function UIcompositionLoading( cmp, loading ) {
	DOM.headCmpSave.dataset.spin =
	UIcompositions.get( cmp ).save.dataset.spin = loading ? "on" : "";
}

function UIcompositionSavedStatus( cmp, saved ) {
	DOM.headCmp.classList.toggle( "cmp-saved", saved );
	UIcompositions.get( cmp ).root.classList.toggle( "cmp-saved", saved );
	UItitle( cmp.name );
}

function UIcompositionDeleted( cmp ) {
	const html = UIcompositions.get( cmp );

	if ( html ) {
		html.root.remove();
		UIcompositions.delete( cmp );
	}
}

function UIcompositionAdded( cmp ) {
	const html = UIcompositions.get( cmp );

	if ( html ) {
		UIcompositionSetInfo( html, cmp );
	} else {
		const root = DOM.cmp.cloneNode( true ),
			local = cmp.options.saveMode === "local",
			html = {
				root,
				bpm: root.querySelector( ".cmp-bpm" ),
				name: root.querySelector( ".cmp-name" ),
				save: root.querySelector( ".cmp-save" ),
				duration: root.querySelector( ".cmp-duration" ),
			};

		root.dataset.id = cmp.id;
		UIcompositionSetInfo( html, cmp );
		UIcompositions.set( cmp, html );
		html.save.dataset.icon = local ? "save" : "upload";
		( local
			? DOM.cmpsLocalList
			: DOM.cmpsCloudList ).append( root );
	}
}

function UIcompositionSetInfo( html, cmp ) {
	const [ min, sec ] = GSUtils.parseBeatsToSeconds( cmp.duration, cmp.bpm );

	html.bpm.textContent = cmp.bpm;
	html.name.textContent = cmp.name;
	html.duration.textContent = `${ min }:${ sec }`;
}

function UIcompositionClosed( cmp ) {
	UIcompositionChanged( {
		bpm: cmp.bpm,
		name: cmp.name,
		duration: cmp.duration,
	}, {} );
	UIcompositions.get( cmp ).root.classList.remove( "cmp-loaded" );
	UIdrums.clear();
	UIdrums.loop( false );
	UIeffects.clear();
	UIsynth.clear();
	UImixer.clear();
	UIpatternroll.clear();
	UIpatternroll.loop( false );
	UIpianoroll.clear();
	UIpianoroll.loop( false );
	DOM.drumsName.textContent =
	DOM.synthName.textContent =
	DOM.pianorollName.textContent = "";
	DOM.pianorollForbidden.classList.add( "hidden" );
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
