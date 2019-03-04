"use strict";

const UImixer = new gsuiMixer();

function UImixerInit() {
	UImixer.onaddChan = UImixerAddChan;
	UImixer.ondeleteChan = UImixerDeleteChan;
	UImixer.onupdateChan = UImixerUpdateChan;
	UImixer.onselectChan = UImixerSelectChan;
	DOM[ "pan-mixer" ].append( UImixer.rootElement );
	UImixer.attached();
	UImixer.oninput = DAW.liveChangeChannel.bind( DAW );
	UImixer.onchange = obj => {
		DAW.compositionChange( { channels: obj } );
	};
}

function UImixerAddChan( id, obj ) {
	const opt = document.createElement( "option" );

	opt.value = id;
	opt.textContent = obj.name;
	DOM.synthChanSelect.append( opt );
}

function UImixerDeleteChan( id ) {
	DOM.synthChanSelect.querySelector( `option[value="${ chanId }"]` ).remove();
}

function UImixerUpdateChan( id, prop, val ) {
	if ( prop === "name" ) {
		DOM.synthChanSelect.querySelector( `option[value="${ id }"]` ).textContent = val;
		if ( id === DAW.get.synthOpened() ) {
			DOM.synthChanName.textContent = val;
		}
	}
}

function UImixerSelectChan( id ) {
	lg( "UImixerSelectChan", id );
}
