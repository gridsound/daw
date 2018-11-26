"use strict";

const UImixer = new gsuiMixer();

function UImixerInit() {
	DOM[ "pan-mixer" ].append( UImixer.rootElement );
	UImixer.attached();
}
