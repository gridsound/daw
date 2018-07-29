"use strict";

function castToNumber( min, max, def, n ) {
	return Number.isFinite( n ) ? Math.max( min, Math.min( n, max ) ) : def;
}
