// Namespace
var Octree = {};

// Constants
Octree.BLACK = 1;
Octree.WHITE = -1;
Octree.GRAY  = 0;

// Tree structure
Octree.Node = class Node
{
	constructor (parent, cube, value = 0, kidsList = [])
	{
		this.parent = parent;
		this.boundingBox = cube;
		this.value = value;
		this.kids = kidsList;
	}
}

