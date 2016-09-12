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
		ui.elHistoryActionList.lastChild.remove();
		elActions.pop();
	}
	elAction.historyAction = action;
	elAction.historyIndex = ind++;
	ui.elHistoryActionList.appendChild( elAction );
	elActions.push( elAction );
};

ui.historyGo = function( n ) {
	if ( n < 0 ) {
		while ( n++ < 0 ) {
			elActions[ --ind ].classList.add( "undone" );
		}
	} else if ( n > 0 ) {
		while ( n-- > 0 ) {
			elActions[ ind++ ].classList.remove( "undone" );
		}
	}
};

var ind, elActions;

} )();
