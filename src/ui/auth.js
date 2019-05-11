"use strict";

function UIauthInit() {
	DOM.login.onclick = UIauthLogin;
	DOM.logout.onclick = UIauthLogout;
}

function UIauthLoading( b ) {
	DOM.app.classList.toggle( "logging", b );
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
		.finally( () => UIauthLoading( false ) )
		.then(
			UIauthLoginThen,
			res => {
				if ( res.code !== 401 ) {
					throw res;
				}
			}
		);
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
		.finally( () => UIauthLoading( false ) )
		.then(
			UIauthLoginThen,
			res => {
				DOM.authPopupError.textContent = res.msg;
				throw res;
			} );
}

function UIauthLoginThen( me ) {
	const opt = { saveMode: "cloud" };

	DOM.app.classList.add( "logged" );
	DOM.headUser.href = `https://gridsound.com/#/u/${ me.user.username }`;
	DOM.headUser.style.backgroundImage = `url("${ me.user.avatar }")`;
	me.compositions.forEach( cmp => DAW.addComposition( cmp.data, opt ) );
	return me;
}

function UIauthLogoutThen() {
	DOM.app.classList.remove( "logged" );
	DOM.headUser.removeAttribute( "href" );
	DOM.headUser.style.backgroundImage = "";
	Array.from( DOM.cmpsCloudList.children )
		.forEach( el => DAW.deleteComposition( "cloud", el.dataset.id ) );
	if ( !DAW.get.id() ) {
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
