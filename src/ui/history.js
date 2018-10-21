"use strict";

function UIhistoryInit() {
	const tpl = DOM.historyAction;

	tpl.removeAttribute( "id" );
	DAW.cb.historyUndo = act => act._html.classList.add( "historyAction-undone" );
	DAW.cb.historyRedo = act => act._html.classList.remove( "historyAction-undone" );
	DAW.cb.historyAddAction = UIhistoryAddAction.bind( null, tpl );
	DAW.cb.historyDeleteAction = act => act._html.remove();
	DOM.undo.onclick = () => DAW.history.undo();
	DOM.redo.onclick = () => DAW.history.redo();
}

function UIhistoryAddAction( tpl, act ) {
	const div = tpl.cloneNode( true );

	act._html = div;
	div.children[ 0 ].className += " ico-" + act.icon; // 1
	div.children[ 1 ].textContent = act.desc;
	div.onclick = () => DAW.history.goToAction( act );
	DOM.history.append( div );
	DOM.history.scrollTop = 10000000;
}

// 1. `act.icon` may contains TWO classes to add, and so we can not use classList.add("a b")
