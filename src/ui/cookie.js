"use strict";

function UIcookieInit() {
	const cookies = document.cookie;

	if ( cookies.indexOf( "cookieAccepted" ) > -1 ) {
		DOM.cookies.remove();
	} else {
		DOM.cookies.onclick = UIcookieClick;
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
			DOM.cookies.remove();
		}
	} );
	return false;
}
