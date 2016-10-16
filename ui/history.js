"use strict";

( function() {

ui.historyReset = function() {
	ind = 0;
	elActions = [];
	while ( ui.dom.historyList.hasChildNodes() ) {
		ui.dom.historyList.lastChild.remove();
	}
};

ui.historyPush = function( action ) {
	var nbUndoneActions = elActions.length - ind,
		elAction = wisdom.cE( Handlebars.templates.historyAction( action ) )[ 0 ];

	while ( nbUndoneActions-- > 0 ) {
		elActions.pop();
		ui.dom.historyList.lastChild.remove();
	}
	ind++;
	elAction.historyAction = action;
	elActions.push( elAction );
	ui.dom.historyList.appendChild( elAction );
	ui.dom.historyList.scrollTop = 1000000000;
};

ui.historyUndo = function() { elActions[ --ind ].classList.add( "undone" ); };
ui.historyRedo = function() { elActions[ ind++ ].classList.remove( "undone" ); };

var ind, elActions;

} )();
