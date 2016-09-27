// Namespace
var Utils = Utils || {};

// Class
Utils.BoundingBox = class
{
	constructor (centerJSON, edge)
	{
		this.center = centerJSON;
		this.edge = edge;
	}
}