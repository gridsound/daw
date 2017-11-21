"use strict";

ui.history = {
	init() {
		dom.undo.onclick = gs.undo;
		dom.redo.onclick = gs.redo;
	},
	undo( action ) {
		action._html.classList.add( "undone" );
	},
	redo( action ) {
		action._html.classList.remove( "undone" );
	},
	cut( len ) {
		var nodes = dom.history.childNodes;

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
		dom.history.append( div );
		dom.history.scrollTop = 10000000;
	},

	// private:
	_onclick( e ) {
		var targ = e.target,
			elAct = targ.classList.contains( "action" ) ? targ : targ.parentNode,
			nodes = Array.from( dom.history.childNodes ),
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
			ui.history.__synth( cmp, r, u ) ||
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
	__synth( cmp, r, u ) {
		if ( r.synths ) {
			var idSynth = Object.keys( r.synths )[ 0 ],
				rSyn = r.synths[ idSynth ],
				uSyn = u.synths[ idSynth ],
				synName = cmp.synths[ idSynth ].name;

			if ( !rSyn || !uSyn ) {
				return rSyn
					? { i: "add", t: `New synthesizer "${ rSyn.name }"` }
					: { i: "remove", t: `Remove synthesizer "${ uSyn.name }"` };
			}
			if ( "name" in rSyn ) {
				synName = rSyn.name;
				return { i: "name", t: `${ uSyn.name }: rename to "${ synName }"` };
			}
			if ( rSyn.oscillators ) {
				var param,
					idOsc = Object.keys( rSyn.oscillators )[ 0 ],
					rOsc = rSyn.oscillators[ idOsc ],
					uOsc = uSyn.oscillators[ idOsc ],
					msg = synName + ": ";

				if ( !rOsc || !uOsc ) {
					return rOsc
						? { i: "add", t: msg + "New oscillator" }
						: { i: "remove", t: msg + "Remove oscillator" };
				}
				param = Object.entries( rOsc )[ 0 ];
				return { i: "param", t: msg + `set ${ param[ 0 ] } to "${ param[ 1 ] }"` };
			}
		}
	},
	__blocks( cmp, r, u ) {
		var id, msg, arrK, rBlc = r.blocks;

		for ( id in rBlc ) {
			arrK = Object.keys( rBlc );
			msg = " " + arrK.length + " block" + ( arrK.length > 1 ? "s" : "" );
			rBlc = rBlc[ id ];
			if ( !rBlc )              { return { i: "erase", t: "Remove" + msg }; }
			if ( !u.blocks[ id ] )    { return { i: "paint", t: "Add" + msg }; }
			if ( "duration" in rBlc ) { return { i: "crop", t: "Crop" + msg }; }
			if ( "when" in rBlc || "track" in rBlc ) { return { i: "move", t: "Move" + msg }; }
			if ( "selected" in rBlc ) { return rBlc.selected
				? { i: "selection ico--plus", t: "Select" + msg }
				: { i: "selection ico--minus", t: "Unselect" + msg };
			}
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
				msgSmp = " " + arrK.length + " key" + ( arrK.length > 1 ? "s" : "" );
				o = o[ b ];
				return (
					( !o && { i: "erase", t: msgPat + "remove" + msgSmp } ) ||
					( !u.keys[ a ][ b ] && { i: "paint", t: msgPat + "add" + msgSmp } ) ||
					( "duration" in o && { i: "crop", t: msgPat + "crop" + msgSmp } ) ||
					( ( "when" in o || "key" in o ) && { i: "move", t: msgPat + "move" + msgSmp } ) ||
					( "selected" in o && ( o.selected
						? { i: "selection ico--plus",  t: msgPat + "select" + msgSmp }
						: { i: "selection ico--minus", t: msgPat + "unselect" + msgSmp }
					) )
				);
			}
		}
	}
};
