

compositions:
[ {
	id: "60we65r0werw506w6e5rw56+d6f5a",
	bpm: 120,
	name: "My first composition",
	data: {
		5sdf5swf: { type: "buffer", name: "Drumloop", duration: 4, filename: "drumloop.wav" },
		54630546: { type: "buffer", name: "Vocal", duration: 4, filename: "vocal.wav" },
		547df021: { type: "synth", name: "Piano", params: { ... } },
		ergt5314: { type: "keys", name: "Melody", duration: 12, synthId: "547df021", keys: [
			{ when: 0, duration: 4, key: "c5" },
			{ when: 4, duration: 4, key: "c#5" },
			{ when: 8, duration: 4, key: "d5" },
		] },
	},
	nbTracks: 42,
	tracks: {
		fqofojafdf4: { order: 0, name: "drum",  toggle: false },
		dqw2e44fqw9: { order: 1, name: "vocal", toggle: true },
		2r43r53as5f: { order: 2, name: "keys",  toggle: true },
	},
	blocks: {
		ada4s5da: { when: 0, offset: 0, duration:  4, dataId: "5sdf5swf", trackId: "fqofojafdf4" },
		ac1as15s: { when: 4, offset: 0, duration:  4, dataId: "5sdf5swf", trackId: "fqofojafdf4" },
		d4w8qd8w: { when: 8, offset: 0, duration:  4, dataId: "5sdf5swf", trackId: "fqofojafdf4" },
		842384r2: { when: 4, offset: 0, duration:  4, dataId: "54630546", trackId: "dqw2e44fqw9" },
		5f01e1fw: { when: 8, offset: 0, duration:  4, dataId: "54630546", trackId: "dqw2e44fqw9" },
		0s5df4as: { when: 0, offset: 0, duration: 12, dataId: "ergt5314", trackId: "2r43r53as5f" },
	}
},
{
	id: "qwertyuiopasdfghjklzxcvbnm",
	bpm: 441,
	name: "A test composition",
	data: {},
	nbTracks: 42,
	tracks: {},
	blocks: {}
} ]


{
	tracks: {
		fqofojafdf4: { toggle: true },
	}
}
{
	tracks: {
		fqofojafdf4: { toggle: false },
	}
}


window.gs = {};

gs.init = function() {
	gs.currCmp = null;
	gs.currCmpSaved = true;
	gs.storedCmps = localStorage.compositions || [];
};
gs.saveCurrentComposition = function() {};
gs.newComposition = function() {};
gs.loadComposition = function( cmp ) {

};



Faire une compo vide
Finir une compo de test
Avancer le newIndex pour quil puisse
 * avoir acces aux compos du storage
 * load une compo du storage (conversion des "id" en reference vers les objets directement, et aussi trier selon `when`)
 * load une compo vierge (a utiliser pour reset)
 * save une compo dans le storage (en faisant la conversion des "id" inverse)
