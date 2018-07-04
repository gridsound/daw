"use strict";

class uiNameAction {
	static name( act ) {
		const cmp = gs.currCmp,
			r = act.redo,
			u = act.undo;

		return (
			uiNameAction.__synth( cmp, r, u ) ||
			uiNameAction.__pattern( cmp, r, u ) ||
			uiNameAction.__tracks( cmp, r, u ) ||
			uiNameAction.__blocks( cmp, r, u ) ||
			uiNameAction.__keys( cmp, r, u ) ||
			(
				r.name != null ? { i: "name", t: `Name: "${ r.name }"` } :
				r.bpm          ? { i: "clock", t: `BPM: ${ r.bpm }` } :
				r.beatsPerMeasure || r.stepsPerBeat ? { i: "clock", t: `Time signature: ${ cmp.beatsPerMeasure }/${ cmp.stepsPerBeat }` } :
				{ i: "", t: "" }
			)
		);
	}

	static __synth( cmp, r, u ) {
		if ( r.synths ) {
			const synthId = Object.keys( r.synths )[ 0 ],
				rSyn = r.synths[ synthId ],
				uSyn = u.synths[ synthId ];

			if ( !rSyn || !uSyn ) {
				return rSyn
					? { i: "add", t: `New synthesizer "${ rSyn.name }"` }
					: { i: "remove", t: `Remove synthesizer "${ uSyn.name }"` };
			}
			if ( "name" in rSyn ) {
				return { i: "name", t: `${ uSyn.name }: rename to "${ rSyn.name }"` };
			}
			if ( rSyn.oscillators ) {
				const idOsc = Object.keys( rSyn.oscillators )[ 0 ],
					rOsc = rSyn.oscillators[ idOsc ],
					uOsc = uSyn.oscillators[ idOsc ],
					msg = cmp.synths[ synthId ].name + ": ";
				let param;

				if ( !rOsc || !uOsc ) {
					return rOsc
						? { i: "add", t: msg + "New oscillator" }
						: { i: "remove", t: msg + "Remove oscillator" };
				}
				param = Object.entries( rOsc )[ 0 ];
				return { i: "param", t: msg + `set ${ param[ 0 ] } to "${ param[ 1 ] }"` };
			}
			if ( rSyn.envelopes ) {
				const [ envName, env ] = Object.entries( rSyn.envelopes )[ 0 ],
					attRel = Object.keys( env )[ 0 ];

				return {
					i: "envelope",
					t: cmp.synths[ synthId ].name + `: change ${ envName } ${ attRel } envelope`,
				};
			}
		}
	}
	static __blocks( cmp, r, u ) {
		const rBlcs = r.blocks;

		for ( const id in rBlcs ) {
			const arrK = Object.keys( rBlcs ),
				msg = " " + arrK.length + " block" + ( arrK.length > 1 ? "s" : "" ),
				rBlc = rBlcs[ id ];

			if ( !rBlc )              { return { i: "erase", t: "Remove" + msg }; }
			if ( !u.blocks[ id ] )    { return { i: "paint", t: "Add" + msg }; }
			if ( "duration" in rBlc ) { return { i: "crop", t: "Crop" + msg }; }
			if ( "when" in rBlc || "track" in rBlc ) { return { i: "move", t: "Move" + msg }; }
			if ( "selected" in rBlc ) { return rBlc.selected
				? { i: "selection ico--plus", t: "Select" + msg }
				: { i: "selection ico--minus", t: "Unselect" + msg };
			}
		}
	}
	static __tracks( cmp, r, u ) {
		const o = r.tracks;

		if ( o ) {
			let a, i = 0;

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
	}
	static __pattern( cmp, r, u ) {
		for ( const id in r.patterns ) {
			const pat = cmp.patterns[ id ],
				rpat = r.patterns[ id ],
				upat = u.patterns[ id ];

			if ( !rpat || !upat ) {
				return rpat
					? { i: "add", t: `New pattern "${ rpat.name }"` }
					: { i: "remove", t: `Remove pattern "${ upat.name }"` };
			}
			if ( rpat.synth ) {
				return { i: "param", t: `${ pat.name }: change its synthesizer` };
			}
			if ( "name" in rpat ) {
				return { i: "name", t: `${ upat.name }: rename to "${ rpat.name }"` };
			}
		}
	}
	static __keys( cmp, r, u ) {
		for ( const a in r.keys ) {
			const o = r.keys[ a ];

			for ( const b in o ) {
				const arrK = Object.keys( o ),
					msgPat = cmp.patterns[ cmp.patternOpened ].name + ": ",
					msgSmp = " " + arrK.length + " key" + ( arrK.length > 1 ? "s" : "" ),
					oB = o[ b ];

				return (
					( !oB && { i: "erase", t: msgPat + "remove" + msgSmp } ) ||
					( !u.keys[ a ][ b ] && { i: "paint", t: msgPat + "add" + msgSmp } ) ||
					( "duration" in oB && { i: "crop", t: msgPat + "crop" + msgSmp } ) ||
					( ( "when" in oB || "key" in oB ) && { i: "move", t: msgPat + "move" + msgSmp } ) ||
					( "selected" in oB && ( oB.selected
						? { i: "selection ico--plus",  t: msgPat + "select" + msgSmp }
						: { i: "selection ico--minus", t: msgPat + "unselect" + msgSmp }
					) )
				);
			}
		}
	}
}
