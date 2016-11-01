function rgbToHex(r, g, b, multiplyTimes255=true) {
	if (multiplyTimes255)
	{
		r *= 255;
		g *= 255;
		b *= 255;
	}
	r = parseInt(r);
	g = parseInt(g);
	b = parseInt(b);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}