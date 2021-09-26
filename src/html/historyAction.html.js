"use strict";

GSUI.setTemplate( "historyAction", ( { icon, desc } ) => (
	GSUI.createElement( "div", { class: "historyAction" },
		GSUI.createElement( "i", { class: "historyAction-icon gsuiIcon", "data-icon": icon } ),
		GSUI.createElement( "span", { class: "historyAction-text" }, desc ),
	)
) );
