"use strict";

gs.addPattern = function( id, data ) {
	var audioBlock = new gsuiAudioBlock();

	data.name = data.name || "";
	audioBlock.data = data;
	audioBlock.name( data.name );
	audioBlock.datatype( "keys" );
	ui.assets.add( id, audioBlock );
};
