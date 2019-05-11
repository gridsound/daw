"use strict";

function UIdomInit() {
	window.DOM = UIdomFill();
	// UIdomUnfocusButtons();
	UIdomGetComments().forEach( com => {
		com.replaceWith( DOM[ com.textContent.substr( 1 ) ] );
	} );
}

/*
function UIdomUnfocusButtons() {
	document.body.addEventListener( "click", () => {
		const foc = document.activeElement;

		if ( foc && ( foc.nodeName === "BUTTON" || foc.nodeName === "A" ) ) {
			const par = foc.closest( "[tabindex]" );

			if ( par ) {
				par.focus();
			} else {
				foc.blur();
			}
		}
	}, false );
}
*/

function UIdomFill() {
	const DOM = {};

	document.querySelectorAll( "[id]" ).forEach( el => {
		DOM[ el.id ] = el;
		if ( "remove" in el.dataset ) {
			el.remove();
			el.removeAttribute( "data-remove" );
		}
		if ( "removeId" in el.dataset ) {
			el.removeAttribute( "id" );
			el.removeAttribute( "data-remove-id" );
		}
	} );
	DOM.winBtnsMap = Array.from( DOM.winBtns.children )
		.reduce( ( map, btn ) => {
			map.set( btn.dataset.win, btn );
			return map;
		}, new Map() );
	return DOM;
}

function UIdomGetComments() {
	const list = [],
		treeWalker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_COMMENT,
			{ acceptNode: com => com.textContent[ 0 ] === "#"
				? NodeFilter.FILTER_ACCEPT
				: NodeFilter.FILTER_REJECT
			},
			false
		);

	while ( treeWalker.nextNode() ) {
		list.push( treeWalker.currentNode );
	}
	return list;
}
