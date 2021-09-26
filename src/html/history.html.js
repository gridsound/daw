"use strict";

GSUI.setTemplate( "history", () => (
	GSUI.createElement( "div", { id: "history", class: "headDropdown", tabindex: 0 },
		GSUI.createElement( "div", { class: "headDropdown-head", id: "historyTitle" },
			GSUI.createElement( "i", { class: "headDropdown-icon gsuiIcon", "data-icon": "history" } ),
			GSUI.createElement( "span", { class: "headDropdown-title" }, "history" ),
		),
		GSUI.createElement( "div", { class: "headDropdown-list", id: "historyList" },
			GSUI.createElement( "div", { class: "placeholder" },
				GSUI.createElement( "span", null, "there is nothing to undo" ),
			),
		),
	)
) );
