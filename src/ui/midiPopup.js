"use strict";

function UImidiPopupInit() {
  DOM.midiSupport.onchange = UImidiSelectToggle;
  DOM.midiDeviceSelect.onchange = UImidiInSelect;
  DOM.headMidi.onclick = UImidiPopupShow;
  midiApiSupport();
  midiAccess(UimidiSelectAddDevicesIn);
}

function midiApiSupport(success) {
  // check for the support of web midi api
  if (!navigator.requestMIDIAccess) {
    DOM.midiSupport.checked = false;
    DOM.midiSupport.disabled = true;
    DOM.midiDeviceSelect.disabled = true;
  } else {
    DOM.midiSupport.checked = true;
    DOM.midiSupport.disabled = false;
    DOM.midiDeviceSelect.disabled = false;
  }
}

function midiAccess(success) {
  navigator.requestMIDIAccess().then(success, function () {
    //error handeling no web midi api
    DOM.midiSupport.checked = false;
    DOM.midiSupport.disabled = true;
    DOM.midiDeviceSelect.disabled = true;
  });
}

function UimidiSelectAddDevicesIn(midi) {
  //update the select when disconnect and connect devices
  UImidiSelectPopulateDevices(midi);
  midi.onstatechange = function (e) {
    for (var i = DOM.midiDeviceSelect.options.length - 1; i >= 0; i--) {
      DOM.midiDeviceSelect.remove(i);
    }
    UImidiSelectPopulateDevices(midi);
  };
  //default midi devices is the first one
  midi.inputs.get("input-0").onmidimessage = midiMessageReceived;
}

function UImidiSelectPopulateDevices(midi) {
  //populate the select with the midi devices
  for (var input of midi.inputs.values()) {
    const opt = document.createElement("option");
    opt.value = input.id;
    opt.text = input.name;
    opt.defaultSelected = true;
    DOM.midiDeviceSelect.append(opt);
  }
}

function UImidiInSelect(e) {
  midiAccess(function (midi) {
    var connectedMidi = midi.inputs.get(e.target.id);
    connectedMidi.onmidimessage = midiMessageReceived;
  });
}

function parseMidiMessage(message) {
  // Parse basic information out of a MIDI message
  return {
    command: message.data[0] >> 4,
    channel: message.data[0] & 0xf,
    note: message.data[1],
    velocity: message.data[2] / 127,
  };
}

function midiMessageReceived(e) {
  if (!!DOM.midiSupport.checked) {
    var midiMessage = parseMidiMessage(e);
    if (midiMessage.velocity > 0) {
      DAW.pianoroll.liveKeydown(midiMessage.note);
      UIkeys.midiKeyDown(midiMessage.note);
    } else {
      DAW.pianoroll.liveKeyup(midiMessage.note);
      UIkeys.midiKeyUp(midiMessage.note);
    }
  }
}

function UImidiSelectToggle(e) {
  // toggle midi support for the app
  if (DOM.midiSupport.checked) {
    DOM.midiDeviceSelect.disabled = false;
  } else {
    DOM.midiDeviceSelect.disabled = true;
  }
}

function UImidiPopupShow() {
  gsuiPopup
    .custom({
      title: "Midi Devices",
      submit: UImidiPopupSubmit,
      element: DOM.midiPopupContent,
    })
    .then();
}

function UImidiPopupSubmit(form) {}
