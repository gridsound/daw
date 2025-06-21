"use strict";

class gswaCrossfadeProc extends AudioWorkletProcessor {
	#started = true;
	#srcMap = {};

	static get parameterDescriptors() {
		return [
			{ name: "start", automationRate: "a-rate", defaultValue: 0, minValue: 0, maxValue: 2 },
			{ name: "index", automationRate: "a-rate", defaultValue: 0, minValue: 0, maxValue: 1 },
		];
	}

	constructor( opts ) {
		super();
		this.#srcMap = opts.processorOptions.sourceMap;
	}

	process( inputs, outputs, params ) {
		if ( this.#started && params.start.indexOf( 1 ) > -1 ) {
			gswaCrossfadeProc.#process2( outputs, this.#srcMap, params.index );
		}
		if ( params.start.indexOf( 2 ) > -1 ) {
			this.#started = false;
		}
		return this.#started;
	}

	static #process2( outputs, srcMap, ind ) {
		outputs.forEach( ( output, i ) => {
			const chan = output[ 0 ];
			const onlyOne = srcMap.length < 2;

			if ( ind.length > 1 && !onlyOne ) {
				chan.forEach( ( _, j ) => chan[ j ] = gswaCrossfadeProc.#calc( srcMap, i, ind[ j ] ) );
			} else {
				const val = gswaCrossfadeProc.#calc( srcMap, i, onlyOne ? 0 : ind[ 0 ] );

				chan.forEach( ( _, j ) => chan[ j ] = val );
			}
		} );
	}
	static #calc( srcMap, srcI, t ) {
		const srcPos = srcMap[ srcI ];
		const srcPrevPos = srcI === 0                 ? 0 : srcMap[ srcI - 1 ];
		const srcNextPos = srcI === srcMap.length - 1 ? 1 : srcMap[ srcI + 1 ];

		return (
			t === srcPos ? 1 :
			srcPrevPos < t && t < srcPos     ?     ( t - srcPrevPos ) / ( srcPos - srcPrevPos ) :
			srcPos     < t && t < srcNextPos ? 1 - ( t - srcPos )     / ( srcNextPos - srcPos ) : 0
		);
	}
}

registerProcessor( "gswacrossfade", gswaCrossfadeProc );
