"use strict";

const UIdropCmpExt = {
	gs: true,
	txt: true,
	json: true,
};

function UIdrop( e ) {
	const files = Array.from( e.dataTransfer.files ),
		cmpFile = files.find( f => f.name.split( "." ).pop().toLowerCase() in UIdropCmpExt );

	if ( cmpFile ) {
		DAW.addCompositionByBlob( cmpFile )
			.then( cmp => DAW.openComposition( "local", cmp.id ) );
	}
	return false;
}
