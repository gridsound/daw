"use strict";

function UIauthInit() {
	DOM.login.onclick = UIauthLogin;
	DOM.logout.onclick = UIauthLogout;
}

function UIauthLoading( b ) {
	DOM.login.dataset.spin =
	DOM.logout.dataset.spin = b ? "on" : "";
}

function UIauthLogout() {
	UIauthLoading( true );
	gsapiClient.logout()
		.finally( () => UIauthLoading( false ) )
		.then( UIauthLogoutThen );
}

function UIauthGetMe() {
	UIauthLoading( true );
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
		.finally( () => UIauthLoading( false ) );
}

function UIauthLogin() {
	if ( !gsapiClient.user.id ) {
		gsuiPopup.custom( {
			ok: "Sign in",
			title: "Authentication",
			submit: UIauthLoginSubmit,
			element: DOM.authPopupContent,
		} ).then( () => {
			DOM.authPopupContent.querySelectorAll( "input" )
				.forEach( inp => inp.value = "" );
		} );
		return false;
	}
}

function UIauthLoginSubmit( obj ) {
	UIauthLoading( true );
	DOM.authPopupError.textContent = "";
	return gsapiClient.login( obj.email, obj.password )
		.then( me => {
			UIauthLoginThen( me );
			return gsapiClient.getUserCompositions( me.id );
		} )
		.then( cmps => {
			const opt = { saveMode: "cloud" };

			cmps.forEach( cmp => DAW.addComposition( cmp.data, opt ) );
		} )
		.catch( res => {
			DOM.authPopupError.textContent = res.msg;
			throw res;
		} )
		.finally( () => UIauthLoading( false ) );
}

function UIauthLoginThen( me ) {
	DOM.app.classList.add( "logged" );
	DOM.headUser.href = `https://gridsound.com/#/u/${ me.username }`;
	DOM.headUser.style.backgroundImage = `url("${ me.avatar }")`;
	return me;
}

function UIauthLogoutThen() {
	DOM.app.classList.remove( "logged" );
	DOM.headUser.removeAttribute( "href" );
	DOM.headUser.style.backgroundImage = "";
	Array.from( DOM.cmpsCloudList.children )
		.forEach( el => DAW.deleteComposition( "cloud", el.dataset.id ) );
	if ( !DAW.get.cmp() ) {
		UIcompositionClickNewLocal();
	}
}

function UIauthSaveComposition( cmp ) {
	return gsapiClient.saveComposition( cmp )
		.then( () => cmp, err => {
			gsuiPopup.alert( `Error ${ err.code }`,
				"An error happened while saving " +
				"your composition&nbsp;:<br/>" +
				`<code>${ err.msg || err }</code>`
			);
			throw err;
		} );
}
