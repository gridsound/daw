"use strict";

GSUI.setTemplate( "window-effects", () => (
	GSUI.createElement( "div", { "data-window": "effects" },
		GSUI.createElement( "div", { class: "windowMenu" },
			GSUI.createElement( "button", { id: "channelName", class: "windowBtn windowDataBtn" } ),
		),
		GSUI.createElement( "div", { class: "windowBetaMsg" }, "Beta: the effects may not work as expected due to browser support" ),
	)
) );
