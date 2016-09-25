"use strict";

( function() {

ui.historyReset = function() {
	ind = 0;
	elActions = [];
	while ( ui.elHistoryActionList.hasChildNodes() ) {
		ui.elHistoryActionList.lastChild.remove();
	}
};

ui.historyPush = function( action ) {
	var nbUndoneActions = elActions.length - ind,
		elAction = wisdom.cE( Handlebars.templates.historyAction( action ) )[ 0 ];

	while ( nbUndoneActions-- > 0 ) {
		elActions.pop();
		ui.elHistoryActionList.lastChild.remove();
	}
	ind++;
	elAction.historyAction = action;
	elActions.push( elAction );
	ui.elHistoryActionList.appendChild( elAction );
	ui.elHistoryActionList.scrollTop = 1000000000;
};

ui.historyUndo = function() { elActions[ --ind ].classList.add( "undone" ); };
ui.historyRedo = function() { elActions[ ind++ ].classList.remove( "undone" ); };

var ind, elActions;

} )();
