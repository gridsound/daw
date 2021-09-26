"use strict";

GSUI.setTemplate( "cmp", () => (
	GSUI.createElement( "div", { class: "cmp", draggable: "true", tabindex: 0 },
		GSUI.createElement( "button", { class: "cmp-btn cmp-save gsuiIcon", "data-action": "save" } ),
		GSUI.createElement( "a", { href: true, class: "cmp-info", "data-action": "open" },
			GSUI.createElement( "div", { class: "cmp-name" } ),
			GSUI.createElement( "div", null,
				GSUI.createElement( "span", { class: "cmp-duration-wrap" },
					GSUI.createElement( "i", { class: "gsuiIcon", "data-icon": "clock" } ),
					GSUI.createElement( "span", { class: "cmp-duration" } ),
				),
				GSUI.createElement( "span", { class: "cmp-bpm-wrap" },
					GSUI.createElement( "i", { class: "gsuiIcon", "data-icon": "speed" } ),
					GSUI.createElement( "span", { class: "cmp-bpm" } ),
				),
			),
		),
		GSUI.createElement( "a", { href: true, class: "cmp-btn cmp-btn-light gsuiIcon", "data-action": "json", "data-icon": "file-export", title: "Export to JSON file" } ),
		GSUI.createElement( "button", { class: "cmp-btn cmp-btn-light gsuiIcon", "data-action": "delete", "data-icon": "minus-oct", title: "Delete" } ),
	)
) );
