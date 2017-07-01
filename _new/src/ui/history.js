"use strict";

ui.history = {
	init() {
	},
	undo( action ) {
		action._html.classList.add( "undone" );
	},
	redo( action ) {
		action._html.classList.remove( "undone" );
	},
	cut( len ) {
		var nodes = ui.idElements.history.childNodes;

		while ( len < nodes.length ) {
			nodes[ nodes.length - 1 ].remove();
		}
	},
	push( action ) {
		var div = document.createElement( "div" ),
			icon = document.createElement( "span" ),
			text = document.createElement( "span" ),
			desc = ui.history._nameAction( action );

		action._html = div;
		div.className = "action";
		icon.className = "actionIcon " + desc.i;
		text.className = "actionText";
		text.textContent = desc.t;
		div.append( icon, text );
		div.onclick = ui.history._onclick;
		ui.idElements.history.append( div );
	},

	// private:
	_onclick( e ) {
		var targ = e.target,
			elAct = targ.classList.contains( "action" ) ? targ : targ.parentNode,
			nodes = Array.from( ui.idElements.history.childNodes ),
			nbActs = nodes.lastIndexOf( elAct ) - gs.historyInd + 1;

		if ( nbActs < 0 ) {
			while ( nbActs++ < 0 ) {
				gs.undo();
			}
		} else if ( nbActs > 0 ) {
			while ( nbActs-- > 0 ) {
				gs.redo();
			}
		}
	},
	_nameAction( act ) {
		var r = act.redo,
			u = act.undo;

		return (
			r.name != null ? { i: "name",     t: `Name: "${ u.name }" -> "${ r.name }"` } :
			r.bpm          ? { i: "bpm",      t: `BPM: ${ u.bpm } -> ${ r.bpm }` } :
			r.stepsPerBeat ? { i: "timeSign", t: `Time signature: ${ u.beatsPerMeasure }/${ u.stepsPerBeat } -> ${ r.beatsPerMeasure }/${ r.stepsPerBeat }` } :
			{ i: "", t: "" }
		);
	}
};
