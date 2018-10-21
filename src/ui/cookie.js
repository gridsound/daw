"use strict";

function UIcookieInit() {
	const cookies = document.cookie;

	if ( cookies.indexOf( "cookieAccepted" ) > -1 ) {
		DOM.eatCookies.remove();
	} else {
		DOM.eatCookies.onclick = UIcookieClick;
	}

	// Delete all the cookies if it's not only accepted.
	if ( cookies && cookies !== "cookieAccepted" ) {
		cookies.split( ";" ).forEach( c => {
			const eq = c.indexOf( "=" );

			document.cookie = ( eq < 0 ? c : c.substr( 0, eq ) )
				+ "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		} );
	}
}

function UIcookieClick() {
	gsuiPopup.confirm(
		"Cookie law",
		"Do you accept to let the GridSound's DAW<br/>"
		+ "using Cookies to offers you two features&nbsp;:<ul>"
		+ "<li>Saving compositions locally (localStorage)</li>"
		+ "<li>Offline mode (serviceWorker)</li>"
		+ "</ul>"
		+ "There are no tracker, analytics or adverts of any<br/>"
		+ "kind on this webapp.",
		"Accept", "Decline"
	).then( b => {
		if ( b ) {
			document.cookie = "cookieAccepted";
			DOM.eatCookies.remove();
		}
	} );
	return false;
}
