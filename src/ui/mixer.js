"use strict";

const UImixer = new gsuiMixer();

function UImixerInit() {
	const win = UIwindows.window( "mixer" );

	UImixer.onaddChan = UImixerAddChan;
	UImixer.ondeleteChan = UImixerDeleteChan;
	UImixer.onupdateChan = UImixerUpdateChan;
	UImixer.onselectChan = UImixerSelectChan;
	UImixer.oninput = DAW.liveChangeChannel.bind( DAW );
	UImixer.onchange = obj => DAW.compositionChange( { channels: obj } );
	win.onresize =
	win.onresizing = () => UImixer.resized();
	win.append( UImixer.rootElement );
	UImixer.attached();
}

function UImixerAddChan( id, obj ) {
	const opt = document.createElement( "option" );

	opt.value = id;
	opt.textContent = obj.name;
	DOM.synthChanSelect.append( opt );
}

function UImixerDeleteChan( id ) {
	DOM.synthChanSelect.querySelector( `option[value="${ id }"]` ).remove();
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
	UIwindows.window( "mixer" ).open();
	UIwindows.window( "mixer" ).focus();
	UIeffectsSelectChan( id );
}
