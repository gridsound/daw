"use strict";

GSUI.setTemplate( "popup-selectChan", () => (
	GSUI.createElement( "div", { id: "selectChanPopupContent", class: "popup" },
		GSUI.createElement( "fieldset", null,
			GSUI.createElement( "legend", null, "Select a channel" ),
			GSUI.createElement( "select", { id: "selectChanPopupSelect", name: "channel", size: 8 } ),
		),
	)
) );
