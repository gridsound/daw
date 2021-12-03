"use strict";

GSUI.setTemplate( "window-effects", () => (
	GSUI.createElement( "div", { "data-window": "effects" },
		GSUI.createElement( "div", { class: "windowMenu" },
			GSUI.createElement( "button", { id: "channelName", class: "windowBtn windowDataBtn" } ),
		),
	)
) );
