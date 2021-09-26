"use strict";

GSUI.setTemplate( "window-synth", () => (
	GSUI.createElement( "div", { "data-window": "synth" },
		GSUI.createElement( "div", { class: "windowMenu" },
			GSUI.createElement( "button", { id: "synthName", class: "windowBtn windowDataBtn" } ),
			GSUI.createElement( "i", { id: "synthDestArrow", class: "gsuiIcon", "data-icon": "arrow-right" } ),
			GSUI.createElement( "button", { id: "synthChannelBtn", class: "windowBtn" },
				GSUI.createElement( "i", { class: "windowBtnIcon gsuiIcon", "data-icon": "mixer" } ),
				GSUI.createElement( "span", { id: "synthChannelBtnText", class: "windowBtnText" } ),
			),
		),
	)
) );
