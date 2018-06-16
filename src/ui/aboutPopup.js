"use strict";

class uiAboutPopup {
	constructor() {
		dom.aboutPopupContent.remove();
		dom.about.onclick = this.show.bind( this );
		dom.versionCheck.onclick = this._check.bind( this );
	}

	show() {
		gsuiPopup.custom( "About", dom.aboutPopupContent );
		return false;
	}

	// private:
	_check() {
		const cl = dom.version.classList;

		cl.remove( "ok", "ko" );
		cl.add( "searching" );
		fetch( "https://gridsound.github.io/daw/VERSION?" + Math.random() )
			.then( res => res.text() )
			.then( res => {
				cl.remove( "searching" );
				cl.add( res === env.version ? "ok" : "ko" );
			} );
	}
}
