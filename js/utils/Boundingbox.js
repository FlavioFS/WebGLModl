// Namespace
var Utils = Utils || {};

// Class
Utils.BoundingBox = class
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON, edge)
	{
		this._center = centerJSON;
		this._edge = edge;
	}

	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get center () { return this._center; }
	get edge ()   { return this._edge;   }
	
	set center (centerJSON) { this._center = centerJSON; }
	set edge (edge)         { this._edge = edge;         }
}