"use strict";

const UIsynth = new gsuiSynthesizer();

function UIsynthInit() {
	UIsynth.oninput = obj => DAW.liveChangeSynth( DAW.get.synthOpened(), obj );
	UIsynth.onchange = ( obj, msg ) => {
		DAW.compositionChange( {
			synths: { [ DAW.get.synthOpened() ]: obj }
		}, msg );
	};
	UIsynth.setWaveList( Array.from( gswaPeriodicWaves.list.keys() ) );
	DOM.synthName.onclick = () => {
		const id = DAW.get.synthOpened(),
			name = DOM.synthName.textContent;

		gsuiPopup.prompt( "Rename synthesizer", "", name, "Rename" )
			.then( name => DAW.callAction( "renameSynth", id, name ) );
	};
	UIwindows.window( "synth" ).append( UIsynth.rootElement );
	UIwindows.window( "synth" ).onresizing = UIsynth.resizing.bind( UIsynth );
	UIwindows.window( "synth" ).onresize = UIsynth.resize.bind( UIsynth );
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
		DOM.synthChannelBtn.onclick = UImixerOpenChanPopup.bind( null, "synth", id );
		UIsynthChange( syn );
		UIwindows.window( "synth" ).open();
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
