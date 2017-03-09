"use strict";

ui.historyAction = function( actobj ) {
	var tpl = document.querySelector( "#historyAction" ).content,
		elRoot = document.importNode( tpl, true );

	ui.dom.templateCloned.appendChild( elRoot );
	elRoot = ui.dom.templateCloned.querySelector( ".historyAction" );
	elRoot.remove();

	this.elRoot = elRoot;
	elRoot.querySelector( ".type" ).classList.add( actobj.type );
	elRoot.querySelector( ".title" ).textContent = actobj.type;
	elRoot.querySelector( ".text" ).textContent = actobj.text;
};

ui.historyAction.prototype = {
	done: function( b ) {
		this.elRoot.classList.toggle( "undone", !b );
	}
};
