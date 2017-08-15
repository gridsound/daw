"use strict";

ui.history = {
	init() {
		ui.idElements.undo.onclick = gs.undo;
		ui.idElements.redo.onclick = gs.redo;
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
		icon.className = "actionIcon icon ico-" + desc.i;
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
			ui.history.__pattern( cmp, r, u ) ||
			ui.history.__tracks( cmp, r, u ) ||
			ui.history.__blocks( cmp, r, u ) ||
			ui.history.__keys( cmp, r, u ) ||
			(
				r.name != null ? { i: "name", t: `Name: "${ r.name }"` } :
				r.bpm          ? { i: "clock", t: `BPM: ${ r.bpm }` } :
				r.beatsPerMeasure || r.stepsPerBeat ? { i: "clock", t: `Time signature: ${ cmp.beatsPerMeasure }/${ cmp.stepsPerBeat }` } :
				{ i: "", t: "" }
			)
		);
	},
	__blocks( cmp, r, u ) {
		var id, msg, arrK, rBlocks = r.blocks;

		for ( id in rBlocks ) {
			arrK = Object.keys( rBlocks );
			msg = " " + arrK.length + " sample" + ( arrK.length > 1 ? "s" : "" );

			return (
				rBlocks[ id ]
					? u.blocks[ id ]
						? { i: "name", t: "edit" + msg }
						: { i: "paint", t: "add" + msg }
					: { i: "erase", t: "remove" + msg }
			);
		}
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
		var id, pat, undoPat;

		for ( id in r.patterns ) {
			pat = r.patterns[ id ];
			undoPat = u.patterns[ id ];
			if ( !pat || !undoPat ) {
				return pat
					? { i: "add", t: `New pattern "${ pat.name }"` }
					: { i: "remove", t: `Remove pattern "${ undoPat.name }"` };
			}
			if ( "name" in pat ) {
				return { i: "name", t: `${ undoPat.name }: rename to "${ pat.name }"` };
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
					( !u.keys[ a ][ b ] && { i: "paint", t: msgPat + "add" + msgSmp } ) ||
					( "duration" in o && { i: "crop", t: msgPat + "crop" + msgSmp } ) ||
					( "selected" in o && ( o.selected
						? { i: "selection ico--plus",  t: msgPat + "select" + msgSmp }
						: { i: "selection ico--minus", t: msgPat + "unselect" + msgSmp }
					) )
				);
			}
		}
	}
};
