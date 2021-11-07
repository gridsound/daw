"use strict";

GSUI.setTemplate( "popup-tempo", () => (
	GSUI.createElement( "div", { id: "tempoPopupContent", class: "popup" },
		GSUI.createElement( "fieldset", null,
			GSUI.createElement( "legend", null, "Time division / BPM" ),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" }, "Beats per measure" ),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { id: "tempoBeatsPM", name: "beatsPerMeasure", type: "number", min: 1, max: 16, } ),
				),
			),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" }, "Steps per beat" ),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { id: "tempoStepsPB", name: "stepsPerBeat", type: "number", min: 1, max: 16, } ),
				),
			),
			GSUI.createElement( "div", { class: "param" },
				GSUI.createElement( "div", { class: "param-title" }, "BPM (Beats Per Minute)" ),
				GSUI.createElement( "div", { class: "param-values" },
					GSUI.createElement( "input", { id: "tempoBPM", name: "bpm", type: "number", min: 1, max: 999.99, step: .01 } ),
					GSUI.createElement( "a", { id: "tempoBPMTap", class: "gsuiIcon", "data-icon": "tint" } ),
				),
			),
		),
	)
) );
