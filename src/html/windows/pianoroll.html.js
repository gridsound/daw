"use strict";

GSUI.setTemplate( "window-piano", () => (
	GSUI.createElement( "div", { "data-window": "piano" },
		GSUI.createElement( "div", { class: "windowMenu" },
			GSUI.createElement( "button", { id: "pianorollName", class: "windowBtn windowDataBtn" } ),
		),
	)
) );
