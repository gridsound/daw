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
		var cmp = gs.currCmp,
			r = act.redo,
			u = act.undo;

		return (
			ui.history.__tracks( cmp, r, u ) ||
			ui.history.__keys( cmp, r, u ) ||
			ui.history.__pattern( cmp, r, u ) ||
			(
				r.name != null ? { i: "name", t: `Name, "${ u.name }" -> "${ r.name }"` } :
				r.bpm          ? { i: "bpm",  t: `BPM, ${ u.bpm } -> ${ r.bpm }` } :
				r.stepsPerBeat || r.beatsPerMeasure ? { i: "timeSign", t: `Time signature` } :
				{ i: "", t: "" }
			)
		);
	},
	__tracks( cmp, r, u ) {
		var a,
			i = 0,
			o = r.tracks;

		if ( o ) {
			for ( a in o ) {
				if ( o[ a ].name ) {
					return { i: "name", t: `Name track: "${ u.tracks[ a ].name }" -> "${ o[ a ].name }"` }
				}
				if ( i++ ) {
					break;
				}
			}
			return i > 1
				? { i: "unmute", t: `Un/mute several tracks` }
				: { i: o[ a ].toggle ? "unmute" : "mute",
					t: ( o[ a ].toggle ? "Unmute" : "Mute" ) + ` "${ cmp.tracks[ a ].name }" track` }
		}
	},
	__pattern( cmp, r, u ) {
		var a, o, msgPat;

		for ( a in r.patterns ) {
			o = r.patterns[ a ];
			msgPat = u.patterns[ a ].name + ": ";
			if ( "name" in o ) {
				return { i: "name", t: msgPat + `rename to "${ o.name }"` };
			}
		}
	},
	__keys( cmp, r, u ) {
		var o, a, b, arrK, msgSmp, msgPat;

		for ( a in r.keys ) {
			o = r.keys[ a ];
			for ( b in o ) {
				arrK = Object.keys( o );
				msgPat = cmp.patterns[ cmp.patternOpened ].name + ": ";
				msgSmp = " " + arrK.length + " sample" + ( arrK.length > 1 ? "s" : "" );
				o = o[ b ];
				return (
					( !o && { i: "erase", t: msgPat + "remove" + msgSmp } ) ||
					( !u.keys[ a ][ b ] && { i: "add", t: msgPat + "add" + msgSmp } ) ||
					( "selected" in o && ( o.selected
						? { i: "selection plus",  t: msgPat + "select" + msgSmp }
						: { i: "selection minus", t: msgPat + "unselect" + msgSmp }
					) )
				);
			}
		}
	}
};
