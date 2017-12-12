"use strict";

ui.synths = {
	init() {
		ui.synths.elements = {};
		dom.synth.remove();
		dom.synth.removeAttribute( "id" );
		dom.synthNew.onclick = ui.synths._onclickNew;
	},
	empty() {
		Object.keys( ui.synths.elements ).forEach( ui.synths.delete );
	},
	create( id, obj ) {
		var root = dom.synth.cloneNode( true );

		ui.synths.elements[ id ] = root;
		root.dataset.id = id;
		root.ondrop = ui.synths._ondrop.bind( null, id );
		root.querySelector( ".synth-name" ).onclick = gs.openSynth.bind( null, id );
		root.querySelector( ".synth-showBtn" ).onclick = ui.synths.show.bind( null, id, undefined );
		root.querySelector( ".synth-deleteBtn" ).onclick = ui.synths._onclickDelete.bind( null, id );
		root.querySelector( ".synth-newPatternBtn" ).onclick = ui.synths._onclickNewPattern.bind( null, id );
		ui.synths.update( id, obj );
		dom.patterns.prepend( root );
	}, 
	update( id, obj ) {
		var root = ui.synths.elements[ id ];

		if ( "name" in obj ) {
			root.querySelector( ".synth-name" ).textContent = obj.name;
		}
	},
	delete( id ) {
		var toSel, toDel = ui.synths.elements[ id ];

		if ( id === ui.synths._selected.dataset.id ) {
			toSel = toDel.nextElementSibling || toDel.previousElementSibling;
		}
		delete ui.synths.elements[ id ];
		toDel.remove();
		toSel && gs.openSynth( toSel.dataset.id );
	},
	show( id, b ) {
		ui.synths.elements[ id ].classList.toggle( "synth-show", b );
		return false;
	},
	select( id ) {
		var sel = ui.synths._selected;

		sel && sel.classList.remove( "synth-selected" );
		ui.synths._selected = ui.synths.elements[ id ];
		ui.synths._selected.classList.add( "synth-selected" );
	},
	getFirstPattern( synthId ) {
		var pat = ui.synths.elements[ synthId ].querySelector( ".gsuiAudioBlock" );

		return pat && pat.dataset.id;
	},
	addPattern( synthId, patElement ) {
		ui.synths.elements[ synthId ].querySelector( ".synth-patterns" ).prepend( patElement );
		ui.synths.show( synthId, true );
		if ( patElement.dataset.id === gs.currCmp.patternOpened ) {
			gs.openSynth( synthId );
		}
	},

	// events:
	_ondrop( synthId, e ) {
		var patId = e.dataTransfer.getData( "text" ),
			pat = gs.currCmp.patterns[ patId ];

		if ( pat && pat.synth !== synthId ) {
			gs.pushCompositionChange( jsonActions.patternChangeSynth( patId, synthId ) );
		}
	},
	_onclickNew() {
		var obj = jsonActions.newSynth();

		gs.pushCompositionChange( obj );
		gs.openSynth( Object.keys( obj.synths )[ 0 ] );
		return false;
	},
	_onclickDelete( synthId ) {
		if ( Object.keys( gs.currCmp.synths ).length > 1 ) {
			gs.pushCompositionChange( jsonActions.removeSynth( synthId ) );
		} else {
			gsuiPopup.alert( "Error", "You can not delete the last synthesizer" );
		}
		return false;
	},
	_onclickNewPattern( synthId ) {
		gs.pushCompositionChange( jsonActions.newPattern( synthId ) );
		return false;
	}
};
