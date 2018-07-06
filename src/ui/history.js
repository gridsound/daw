"use strict";

class uiHistory {
	constructor() {
		const undored = gs.undoredo,
			tpl = dom[ "history-action" ];

		tpl.removeAttribute( "id" );
		this._template = tpl;
		undored.onnewAction = this.push.bind( this );
		undored.onundoAction = act => act._html.classList.add( "action-undone" );
		undored.onredoAction = act => act._html.classList.remove( "action-undone" );
		undored.onremoveAction = act => act._html.remove();
		dom.undo.onclick = undored.undo.bind( undored );
		dom.redo.onclick = undored.redo.bind( undored );
	}

	push( act ) {
		const div = this._template.cloneNode( true ),
			desc = uiNameAction.name( act );

		act._html = div;
		div.children[ 0 ].className += " ico-" + desc.i; // 1
		div.children[ 1 ].textContent = desc.t;
		div.onclick = () => ( gs.undoredo.goToAction( act ), false );
		dom.history.append( div );
		dom.history.scrollTop = 10000000;
	}
}

// 1. `desc.i` may contains TWO classes to add, and so we can not use classList.add("a b")
