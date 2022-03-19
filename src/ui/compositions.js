"use strict";

function UIcompositionDrop( saveMode, id ) {
	const to = saveMode === "local" ? "cloud" : "local",
		cmpFrom = DAW.get.composition( saveMode, id ),
		cmpTo = DAW.get.composition( to, id );

	return !cmpTo
		? Promise.resolve( cmpFrom )
		: GSUI.popup.confirm( "Warning",
			"Are you sure you want to overwrite " +
			`the <b>${ to }</b> composition <i>${ cmpTo.name || "Untitled" }</i>&nbsp;?` )
		.then( b => {
			if ( b ) {
				return cmpFrom;
			}
			throw undefined;
		} );
}

function UIcompositionLocalDrop( saveMode, id ) {
	UIcompositionDrop( saveMode, id )
		.then( cmp => DAW.addComposition( cmp, { saveMode: "local" } ) )
		.then( cmp => DAWCore.LocalStorage.put( cmp.id, cmp ) );
}

function UIcompositionCloudDrop( saveMode, id ) {
	if ( gsapiClient.user.id ) {
		UIcompositionDrop( saveMode, id )
			.then( cmp => UIauthSaveComposition( cmp ) )
			.then( cmp => DAW.addComposition( cmp, { saveMode: "cloud" } ) );
	} else {
		GSUI.popup.alert( "Error",
			"You need to be connected to your account before uploading your composition" );
	}
}

function UIcompositionBeforeUnload() {
	if ( DAW.compositionNeedSave() ) {
		return "Data unsaved";
	}
}

function UIcompositionClosed( cmp ) {
	UIcompositionChanged( {
		bpm: cmp.bpm,
		name: cmp.name,
		duration: cmp.duration,
	}, {} );
	GSUI.setAttribute( UIdaw, "currentcomposition", false );
	UIeffects.clear();
	UIsynth.clear();
	UImixer.clear();
	UIdrums.clear();
	UIpianoroll.clear();
	UIpatternroll.clear();
	UIdrums.rootElement.loop( false );
	UIpianoroll.rootElement.loop( false );
	UIpatternroll.rootElement.loop( false );
	DOM.drumsName.textContent =
	DOM.synthName.textContent =
	DOM.pianorollName.textContent = "";
	UIpatterns.clear();
}

function UIcompositionClickNewLocal() {
	( !DAW.compositionNeedSave()
		? DAW.addNewComposition()
		: GSUI.popup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
			.then( b => b && DAW.addNewComposition() )
	).then( cmp => cmp && DAW.openComposition( "local", cmp.id ) );
}

function UIcompositionClickNewCloud() {
	if ( !gsapiClient.user.id ) {
		GSUI.popup.alert( "Error",
			"You can not create a new composition in the <b>cloud</b><br/>without being connected" );
	} else {
		( !DAW.compositionNeedSave()
			? DAW.addNewComposition( { saveMode: "cloud" } )
			: GSUI.popup.confirm( "Warning", "Are you sure you want to discard unsaved works" )
				.then( b => b && DAW.addNewComposition( { saveMode: "cloud" } ) )
		).then( cmp => cmp && DAW.openComposition( "cloud", cmp.id ) );
	}
}

function UIcompositionClickDelete( saveMode, id ) {
	const cmp = DAW.get.composition( saveMode, id );

	GSUI.popup.confirm( "Warning",
		`Are you sure you want to delete "${ cmp.name }" ? (no undo possible)`,
		"Delete"
	).then( b => {
		if ( b ) {
			( saveMode === "cloud"
			? gsapiClient.deleteComposition( id )
			: Promise.resolve() )
				.catch( err => {
					if ( err.code !== 404 ) {
						GSUI.popup.alert( `Error ${ err.code }`,
							"An error happened while deleting " +
							"your composition&nbsp;:<br/>" +
							`<code>${ err.msg || err }</code>` );
						throw err;
					}
				} )
				.then( () => {
					if ( id === DAW.get.id() ) {
						UIcompositionClickNewLocal();
					}
					DAW.deleteComposition( saveMode, id );
				} );
		}
	} );
}

function UIcompositionClickOpen( saveMode, id ) {
	if ( DAW.compositionNeedSave() ) {
		GSUI.popup.confirm( "Warning",
			"Are you sure you want to discard unsaved works"
		).then( ok => ok && DAW.openComposition( saveMode, id ) );
	} else {
		DAW.openComposition( saveMode, id );
	}
}

function UIcompositionClickSave() {
	if ( document.cookie.indexOf( "cookieAccepted" ) > -1 ) {
		DAW.saveComposition();
	} else {
		GSUI.popup.alert( "Error",
			"You have to accept our cookies before saving locally your composition." );
	}
}
