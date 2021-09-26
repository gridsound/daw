"use strict";

GSUI.setTemplate( "popup-open", () => (
	GSUI.createElement( "div", { id: "openPopupContent", class: "popup" },
		GSUI.createElement( "fieldset", null,
			GSUI.createElement( "legend", null, "Open and load a new composition" ),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" }, "With an URL" ),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { id: "inputOpenURL", name: "url", type: "url", placeholder: "http://" } ),
				),
			),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" },
					"With a local file",
					GSUI.createElement( "br" ),
					GSUI.createElement( "small", null, "(Please notice that you can also drop a file into the app)" ),
				),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { id: "inputOpenFile", name: "file", type: "file" } ),
				),
			),
		),
	)
) );
