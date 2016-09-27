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
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (parent = null, boundingBox = null, value = 0, kidsList = [])
	{
		this._parent = parent;
		this._boundingBox = boundingBox;
		this._value = value;
		this._kids = kidsList;
	}

	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get parent ()      { return this._parent;      }
	get boundingBox () { return this._boundingBox; }
	get value ()       { return this._value;       }
	get kids ()        { return this._kids;        }
	
	set parent (parent)           { this._parent = parent;           }
	set boundingBox (boundingBox) { this._boundingBox = boundingBox; }
	set value (value)             { this._value = value;             }
	set kids (kids)               { this._kids = kids;               }
}

