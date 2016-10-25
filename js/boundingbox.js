// Namespace
var Octree = Octree || {};

// Class
Octree.BoundingBox = class
{
	constructor (centerJSON, edge)
	{
		super (centerJSON);
		this.edge = edge;
	}
}