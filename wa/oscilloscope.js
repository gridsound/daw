"use strict";

wa.oscilloscope = function () {
	var
		max = 0,
		PI2 = Math.PI / 2
	;

	return function( canvas, ctx, data ) {
		var
			y,
			x = 0,
			w = canvas.width,
			h = canvas.height,
			len = data.length,
			len2 = len / 2,
			mult = w / len
		;

		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = "rgba(" +
			Math.round( 255 - max * 255 ) + "," +
			Math.round( max * 64 ) + "," +
			Math.round( max * 255 ) + "," +
			( .95 - .25 * ( 1 - Math.cos( max * PI2 ) ) ) +
		")";
		ctx.fillRect( 0, 0, w, h );

		max = 0;
		ctx.globalCompositeOperation = "source-over";

		ctx.save();
		ctx.translate( 0, h / 2 );
			ctx.beginPath();

				ctx.moveTo( 0, 0 );
				for ( ; x < len; ++x ) {
					y = ( data[ x ] - 128 ) / 128;
					max = Math.max( Math.abs( y ), max );
					// Pinch the extremities.
					y *= .5 - Math.cos( ( x < len2 ? x : len - x ) / len2 * Math.PI ) / 2;
					ctx.lineTo( x * mult, y * h );
				}

			ctx.lineJoin = "round";
			ctx.lineWidth = 1 + Math.round( 2 * max );
			ctx.strokeStyle = "rgba(255,255,255," + Math.min( .3 + max * 4, 1 ) + ")";
			ctx.stroke();
		ctx.restore();
	};
}();
