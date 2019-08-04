"use strict";

const UIsynth = new gsuiSynthesizer();

function UIsynthInit() {
	UIsynth.oninput = ( id, attr, val ) => {
		DAW.liveChangeSynth( DAW.get.synthOpened(), {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
	};
	UIsynth.onchange = obj => {
		DAW.compositionChange( { synths: {
			[ DAW.get.synthOpened() ]: obj
		} } );
	};
	UIsynth.setWaveList( Array.from( gswaPeriodicWaves.keys() ) );
	DOM.synthName.onclick = () => {
		const id = DAW.get.synthOpened(),
			name = DOM.synthName.textContent;

		gsuiPopup.prompt( "Rename synthesizer", "", name, "Rename" )
			.then( name => DAW.nameSynth( id, name ) );
	};
	UIwindows.window( "synth" ).append( UIsynth.rootElement );
	UIsynth.attached();
}

function UIsynthOpen( id ) {
	UIsynth.empty();
	if ( !id ) {
		DOM.synthName.textContent = "";
		DOM.synthChannelBtn.onclick = null;
	} else {
		const syn = DAW.get.synth( id );

		DOM.synthName.textContent = syn.name;
		DOM.synthChannelBtn.onclick = UImixerOpenChanPopup.bind( null, "synths", id );
		UIsynthChange( syn );
	}
}

function UIsynthChange( obj ) {
	if ( "name" in obj ) {
		DOM.synthName.textContent = obj.name;
	}
	if ( "dest" in obj ) {
		DOM.synthChannelBtnText.textContent = DAW.get.channel( obj.dest ).name;
	}
	UIsynth.change( obj );
}
