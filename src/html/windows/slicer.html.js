"use strict";

GSUI.setTemplate( "window-slicer", () => (
	GSUI.createElement( "div", { "data-window": "slicer" },
		GSUI.createElement( "div", { class: "windowMenu" },
			GSUI.createElement( "button", { id: "slicesName", class: "windowBtn windowDataBtn" } ),
		),
	)
) );
