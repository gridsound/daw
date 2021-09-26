"use strict";

GSUI.setTemplate( "window-drums", () => (
	GSUI.createElement( "div", { "data-window": "drums" },
		GSUI.createElement( "div", { class: "windowMenu" },
			GSUI.createElement( "button", { id: "drumsName", class: "windowBtn windowDataBtn" } ),
		),
	)
) );
