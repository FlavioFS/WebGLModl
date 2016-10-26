// Namespace
var Octree = Octree || {};

// Constants
Octree.BLACK = 0;
Octree.WHITE = 1;
Octree.GRAY  = 2;
Octree.EIGHT = 8;

// Tree structure
Octree.Node = class
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (parent = null, boundingBox = null, color = Octree.GRAY, level=0, kidsList = [])
	{
		this._parent = parent;
		this._boundingBox = boundingBox;
		this._color = color;
		this._kids = kidsList;
		this._level = level;
		this._willBeRendered = true;
	}

	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get parent ()       { return this._parent;        }
	get boundingBox ()  { return this._boundingBox;   }
	get color ()        { return this._color;         }
	get kids ()         { return this._kids;          }
	get level ()        { return this._level;         }
	get willBeRendered(){ return this._willBeRendered;}
	
	set parent (parent)           { this._parent = parent;           }
	set boundingBox (boundingBox) { this._boundingBox = boundingBox; }
	set color (color)             { this._color = color;             }
	set kids (kids)               { this._kids = kids;               }
	set level (level)             { this._level = level;             }
	set willBeRendered (b)        { this._willBeRendered = b;        }
};