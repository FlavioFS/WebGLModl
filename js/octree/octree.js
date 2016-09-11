// Namespace
var Octree = Octree || {};

// Constants
Octree.BLACK = 1;
Octree.WHITE = -1;
Octree.GRAY  = 0;
Octree.EIGHT = 8;

// Tree structure
Octree.Node = class Node
{
	constructor (parent = null, boundingBox = null, value = 0, kidsList = [])
	{
		this.parent = parent;
		this.boundingBox = boundingBox;
		this.value = value;
		this.kids = kidsList;
	}
}

