"use strict";

GSUI.setTemplate( "popup-auth", () => (
	GSUI.createElement( "div", { id: "authPopupContent", class: "popup" },
		GSUI.createElement( "fieldset", null,
			GSUI.createElement( "legend", null, "Sign in" ),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" },
					GSUI.createElement( "span", null, "Email" ),
					GSUI.createElement( "small", null, "or username" ),
				),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { name: "email", type: "text" } ),
				),
			),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" }, "Password" ),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { name: "password", type: "password" } ),
				),
			),
			GSUI.createElement( "div", { id: "authPopupError", class: "popup-error-msg" } ),
		),
		GSUI.createElement( "a", { target: "_blank", rel: "noopener", href: "https://gridsound.com/#/forgotPassword" }, "Forgot password ?" ),
		GSUI.createElement( "br" ),
		GSUI.createElement( "a", { target: "_blank", rel: "noopener", href: "https://gridsound.com/#/auth" }, "Create a new account" ),
	)
) );
