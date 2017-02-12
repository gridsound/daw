"use strict";

ui.initElement( "historyList", function( el ) {
	var ind,
		elActions = [];

	return {
		click: function( e ) {
			( e = e.target.historyAction ) && gs.history.goToAction( e );
		},
		reset: function() {
			ind = 0;
			elActions.length = 0;
			while ( el.hasChildNodes() ) {
				el.lastChild.remove();
			}
		},
		undo: function() { elActions[ --ind ].classList.add( "undone" ); },
		redo: function() { elActions[ ind++ ].classList.remove( "undone" ); },
		push: function( action ) {
			var nbUndoneActions = elActions.length - ind,
				elAction = ui.createHTML( Handlebars.templates.historyAction( action ) )[ 0 ];

			while ( nbUndoneActions-- > 0 ) {
				elActions.pop().remove();
			}
			ind++;
			elAction.historyAction = action;
			elActions.push( elAction );
			el.appendChild( elAction );
			el.scrollTop = 1000000000;
		}
	};
} );
