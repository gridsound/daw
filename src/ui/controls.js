"use strict";

function UIcontrolsGetFocusedGrid( focStr = DAW.getFocusedName() ) {
	switch ( focStr ) {
		default: return null;
		case "keys": return UIpianoroll.rootElement;
		case "drums": return UIdrums.rootElement;
		case "slices": return UIslicer.rootElement;
		case "composition": return UIpatternroll.rootElement;
	}
}

function UIcontrolsFocusOn( focStr ) {
	const beat = DAW.getFocusedObject().getCurrentTime(),
		grid = UIcontrolsGetFocusedGrid( focStr ),
		onCmp = focStr === "composition";

	GSUI.setAttribute( UIdaw, "focus", onCmp ? "up" : "down" );
	GSUI.setAttribute( UIdaw, "duration", DAW.getFocusedDuration() );
	GSUI.setAttribute( UIdaw, "currenttime", beat );
	UIpianoroll.rootElement.classList.toggle( "selected", focStr === "keys" );
	UIdrums.rootElement.classList.toggle( "selected", focStr === "drums" );
	UIslicer.rootElement.classList.toggle( "selected", focStr === "slices" );
	UIpatternroll.rootElement.classList.toggle( "selected", onCmp );
	grid.focus();
}
