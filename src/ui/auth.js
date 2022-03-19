"use strict";

function UIauthGetMe() {
	GSUI.setAttribute( UIdaw, "logging", true );
	return gsapiClient.getMe()
		.then( me => {
			UIauthLoginThen( me );
			return gsapiClient.getUserCompositions( me.id );
		} )
		.then( cmps => {
			const opt = { saveMode: "cloud" };

			cmps.forEach( cmp => DAW.addComposition( cmp.data, opt ) );
		} )
		.catch( res => {
			if ( res.code !== 401 ) {
				throw res;
			}
		} )
		.finally( () => GSUI.setAttribute( UIdaw, "logging", false ) );
}

function UIauthLoginThen( me ) {
	GSUI.setAttribute( UIdaw, "useravatar", me.avatar );
	GSUI.setAttribute( UIdaw, "username", me.username );
	GSUI.setAttribute( UIdaw, "logged", true );
	return me;
}

function UIauthSaveComposition( cmp ) {
	return gsapiClient.saveComposition( cmp )
		.then( () => cmp, err => {
			GSUI.popup.alert( `Error ${ err.code }`,
				"An error happened while saving " +
				"your composition&nbsp;:<br/>" +
				`<code>${ err.msg || err }</code>`
			);
			throw err;
		} );
}
