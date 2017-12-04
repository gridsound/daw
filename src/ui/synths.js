"use strict";

ui.synths = {
	init() {
		ui.synths.elements = {};
		dom.synth.remove();
		dom.synth.removeAttribute( "id" );
	},
	create( id, obj ) {
		var root = dom.synth.cloneNode( true );

		ui.synths.elements[ id ] = root;
		root.querySelector( ".synth-menuBtn" ).onclick = ui.synths._openMenu.bind( null, id );
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
		ui.synths.elements[ id ].remove();
		delete ui.synths.elements[ id ];
	},
	addPattern( synthId, patElement ) {
		ui.synths.elements[ synthId ].querySelector( ".synth-patterns" ).prepend( patElement );
	},

	// private:
	_openMenu( id, e ) {
		var gBCR = e.target.parentNode.getBoundingClientRect(),
			patternsBCR = dom[ "pan-patterns" ].getBoundingClientRect();

		e.stopPropagation();
		ui.synths._menuId = id;
		dom.synthMenu.style.top = gBCR.top + gBCR.height / 2 - patternsBCR.top + "px";
		dom.synthMenu.classList.remove( "hidden" );
		return false;
	}
};
