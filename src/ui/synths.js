"use strict";

ui.synths = {
	init() {
		ui.synths.elements = {};
		dom.synth.remove();
		dom.synth.removeAttribute( "id" );
		dom.synthNew.onclick = ui.synths._onclickNew;
		dom.synthMenu.onclick = ui.synths._onclickMenu;
	},
	empty() {
		Object.keys( ui.synths.elements ).forEach( ui.synths.delete );
	},
	create( id, obj ) {
		var root = dom.synth.cloneNode( true );

		ui.synths.elements[ id ] = root;
		root.dataset.id = id;
		root.querySelector( ".synth-name" ).onclick = gs.openSynth.bind( null, id );
		root.querySelector( ".synth-showBtn" ).onclick = ui.synths.show.bind( null, id, undefined );
		root.querySelector( ".synth-menuBtn" ).onclick = ui.synths._onclickMenuBtn.bind( null, id );
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
	},

	// events:
	_onclickNew() {
		gs.pushCompositionChange( jsonActions.newSynth() );
		return false;
	},
	_onclickMenuBtn( id, e ) {
		var gBCR = e.target.parentNode.getBoundingClientRect(),
			patternsBCR = dom[ "pan-patterns" ].getBoundingClientRect();

		e.stopPropagation();
		ui.synths._menuId = id;
		dom.synthMenu.style.top = gBCR.top + gBCR.height / 2 - patternsBCR.top + "px";
		dom.synthMenu.classList.remove( "hidden" );
		return false;
	},
	_onclickMenu( e ) {
		var data,
			id = ui.synths._menuId;

		switch ( e.target.id ) {
			case "synthCreatePat": data = jsonActions.newPattern( id ); break;
			case "synthDelete":    data = jsonActions.removeSynth( id ); break;
		}
		gs.pushCompositionChange( data );
		return false;
	}
};
