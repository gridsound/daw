function UIMIDIPopupInit() {
    // event
    DOM.MIDISupport.onchange = UIMIDISelectToggle;
    DOM.MIDIDeviceSelect.onchange = UIMIDIInSelect;
    DOM.headMIDI.onclick = UIMIDIPopupShow;

  }

  function UiMIDISelectAddDevicesIn(midi) {
    //update the select when disconnect and connect devices
    UImidiSelectPopulateDevices(midi);
    midi.onstatechange = function (e) {
      for (var i = DOM.midiDeviceSelect.options.length - 1; i >= 0; i--) {
        DOM.midiDeviceSelect.remove(i);
      }
      UIMIDISelectPopulateDevices(midi);
    };
    //default MIDI devices is the first one
    DAW.midi.MIDIInputs.get("input-0").onmidimessage = DAW.MIDIMessageReceived(function() {});
  }


  function UIMIDISelectPopulateDevices(midi) {
    //populate the select with the midi devices
    for (var input of DAW.midi.MIDIInputs.values()) {
      const opt = document.createElement("option");
      opt.value = input.id;
      opt.text = input.name;
      opt.defaultSelected = true;
      DOM.MIDIDeviceSelect.append(opt);
    }
  }
  
  function UImidiInSelect(e) {
    var connectedMIDI = DAW.midiInputDevice(e.target.id);
    connectedMIDI = DAW.midi.MIDIMessageReceived(function() {});
  }

  function UIMIDISelectToggle(e) {
    // toggle MIDI support for the app
    if (DOM.MIDISupport.checked) {
      DOM.MIDIDeviceSelect.disabled = false;
      DAW.midi.MIDIEnable = true;
    } else {
      DOM.MIDIDeviceSelect.disabled = true;
      DAW.midi.MIDIEnable = false;
    }
  }

  function UIMIDIPopupShow() {
    gsuiPopup
      .custom({
        title: "MIDI Devices",
        submit: UIMIDIPopupSubmit,
        element: DOM.MIDIPopupContent,
      })
      .then();
  }
  
  function UIMIDIPopupSubmit(form) {}