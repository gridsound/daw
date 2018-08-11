"use strict";

gs.loadCompositionByBlob = blob => (
	new Promise( ( res, rej ) => {
		const reader = new FileReader();

		reader.onload = () => {
			let cmp;

			try {
				cmp = JSON.parse( reader.result );
			} catch( e ) {
				rej();
				return;
			}
			gs.loadComposition( cmp ).then( res, rej );
		};
		reader.readAsText( blob );
	} )
);
