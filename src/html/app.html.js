"use strict";

GSUI.setTemplate( "app", () => (
	GSUI.createElement( "div", { id: "app" },
		GSUI.getTemplate( "head" ),
		GSUI.createElement( "gsui-windows" ),
	)
) );
