"use strict";

GSUI.setTemplate( "popup-render", () => (
	GSUI.createElement( "div", { id: "renderPopupContent", class: "popup" },
		GSUI.createElement( "fieldset", null,
			GSUI.createElement( "legend", null, "Render the current composition" ),
			GSUI.createElement( "div", { id: "renderWrap" },
				GSUI.createElement( "a", { href: true, id: "renderBtn" },
					GSUI.createElement( "span", { id: "renderBtn0" },
						GSUI.createElement( "span", null, "Render" ),
						GSUI.createElement( "i", { class: "gsuiIcon", "data-icon": "render" } ),
					),
					GSUI.createElement( "span", { id: "renderBtn1" },
						GSUI.createElement( "span", null, "Rendering..." ),
						GSUI.createElement( "i", { class: "gsuiIcon", "data-spin": "on" } ),
					),
					GSUI.createElement( "span", { id: "renderBtn2" },
						GSUI.createElement( "span", null, "Download WAV file" ),
						GSUI.createElement( "i", { class: "gsuiIcon", "data-icon": "export" } ),
					),
				),
				GSUI.createElement( "progress", { id: "renderProgress", value: "", max: 1 } ),
			),
		),
	)
) );
