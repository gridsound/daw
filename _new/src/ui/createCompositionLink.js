"use strict";

ui.createCompositionLink = function( cmp ) {
	var div = document.createElement( "div" ),
		time = common.timestampText( cmp.duration );

	div.innerHTML = `<div class="cmp"
		><div class="name">${ cmp.name }</div
		><span class="bpm">${ cmp.bpm }</span
		><span class="duration">${ time.a + ":" + time.b }</span
	></div>`;
	cmp._html = div.firstChild;
	cmp._html.onclick = gs.loadComposition.bind( null, cmp );
	return cmp._html;
};
