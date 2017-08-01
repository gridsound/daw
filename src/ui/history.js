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
		ui.idElements.history.scrollTop = 10000000;
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
		var obj, k,
			i = 0,
			r = act.redo,
			u = act.undo;

		if ( obj = r.tracks ) {
			for ( k in obj ) {
				if ( obj[ k ].name ) {
					return { i: "name", t: `Name track: "${ u.tracks[ k ].name }" -> "${ obj[ k ].name }"` }
				}
				if ( i++ ) {
					break;
				}
			}
			return i > 1
				? { i: "toggle", t: `Toggle several tracks` }
				: { i: "toggle", t: ( obj[ k ].toggle ? "Unmute" : "Mute" ) +
					` "${ gs.currCmp.tracks[ k ].name }" track` }
		}
		return (
			r.name != null ? { i: "name", t: `Name, "${ u.name }" -> "${ r.name }"` } :
			r.bpm          ? { i: "bpm",  t: `BPM, ${ u.bpm } -> ${ r.bpm }` } :
			r.stepsPerBeat || r.beatsPerMeasure ? { i: "timeSign", t: `Time signature` } :
			{ i: "", t: "" }
		);
	}
};
