"use strict";

GSUI.setTemplate( "cmps", () => (
	GSUI.createElement( "div", { id: "cmps", class: "headDropdown", tabindex: 0 },
		GSUI.createElement( "div", { class: "headDropdown-head", id: "cmpsLocalTitle" },
			GSUI.createElement( "i", { class: "headDropdown-icon gsuiIcon", "data-icon": "local" } ),
			GSUI.createElement( "span", { class: "headDropdown-title" }, "local" ),
			GSUI.getTemplate( "cmps-btn", { id: "localNewCmp", icon: "plus", text: "new", title: "Create a new composition on this computer" } ),
			GSUI.getTemplate( "cmps-btn", { id: "localOpenCmp", icon: "folder-open", text: "open", title: "Open a composition on this computer" } ),
		),
		GSUI.createElement( "div", { class: "headDropdown-head", id: "cmpsCloudTitle" },
			GSUI.createElement( "i", { class: "headDropdown-icon gsuiIcon", "data-icon": "cloud" } ),
			GSUI.createElement( "span", { class: "headDropdown-title" }, "cloud" ),
			GSUI.getTemplate( "cmps-btn", { id: "cloudNewCmp", icon: "plus", text: "new", title: "Create a new composition on your cloud profile" } ),
		),
		GSUI.createElement( "div", { class: "headDropdown-list", id: "cmpsLocalList" },
			GSUI.createElement( "div", { class: "placeholder" },
				GSUI.createElement( "span", null, "there is no local composition here" ),
			),
		),
		GSUI.createElement( "div", { class: "headDropdown-list", id: "cmpsCloudList" },
			GSUI.createElement( "div", { class: "placeholder" },
				GSUI.createElement( "span", null, "you don't have any cloud composition yet" ),
				GSUI.createElement( "span", null, "you are not connected" ),
			),
		),
	)
) );

GSUI.setTemplate( "cmps-btn", ( { id, title, icon, text } ) => (
	GSUI.createElement( "button", { class: "windowBtn", id, title },
		GSUI.createElement( "i", { class: "windowBtnIcon gsuiIcon", "data-icon": icon } ),
		GSUI.createElement( "span", { class: "windowBtnText" }, text ),
	)
) );
