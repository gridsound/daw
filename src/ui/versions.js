"use strict";

function UIversionsInit() {
	const nums = [
			"0.28.2", "0.28.1", "0.28.0", "0.27.1",
			"0.26.3", "0.26.0", "0.25.4", "0.25.3",
			"0.24.1", "0.24.0", "0.23.1", "0.23.0",
			"0.22.0", "0.21.0", "0.20.3", "0.20.2",
			"0.20.1", "0.19.2",
		],
		curr = document.createElement( "span" );

	curr.classList.add( "versions-link", "versions-linkCurrent" );
	curr.textContent = window.VERSION;
	DOM.versionsList.append( curr, ...nums.map( v => {
		const a = document.createElement( "a" );

		a.classList.add( "versions-link" );
		a.setAttribute( "href", `old/${ v }.html` );
		a.textContent = v;
		return a;
	} ) );
}
