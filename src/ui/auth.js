"use strict";

function UIauthInit() {
	DOM.logout.onclick = UIauthLogout;
	DOM.userlink.onclick = UIauthLogin;
}

function UIauthLoading( b ) {
	DOM.userlink.classList.toggle( "loading", b );
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
		.then( UIauthLoginThen )
		.catch( res => {
			if ( res.code !== 401 ) {
				throw( res );
			}
		} )
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
	return gsapiClient.login( obj.email, obj.password )
		.finally( () => UIauthLoading( false ) )
		.then( UIauthLoginThen );
}

function UIauthLoginThen( me ) {
	DOM.userlink.classList.add( "loaded" );
	DOM.userlink.href = `https://gridsound.github.io/#/u/${ me.user.username }`;
	DOM.userlink.style.backgroundImage = `url("${ me.user.avatar }")`;
	return me;
}

function UIauthLogoutThen() {
	DOM.userlink.classList.remove( "loaded" );
	DOM.userlink.removeAttribute( "href" );
	DOM.userlink.style.backgroundImage = "";
}
