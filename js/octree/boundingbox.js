// Namespace
var Utils = Utils || {};

// Class
Utils.BoundingBox = class
{
	constructor (centerJSON, edge)
	{
		super (centerJSON);
		this.edge = edge;
	}
}