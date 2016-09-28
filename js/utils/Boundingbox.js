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

	/* =====================================================================================================
	 *  METHODS
	 * ===================================================================================================== */
	vertices ()
	{
		const halfEdge = this._edge/2;

		// Borders
		const
			xmin = this._center.x - halfEdge,
			ymin = this._center.y - halfEdge,
			zmin = this._center.z - halfEdge,
			
			xmax = this._center.x + halfEdge,
			ymax = this._center.y + halfEdge,
			zmax = this._center.z + halfEdge;

		
		// Returns the list of vertices
		var vlist = 
		[
			{ "x": xmin, "y": ymin, "z": zmin },
			{ "x": xmax, "y": ymin, "z": zmin },
			{ "x": xmin, "y": ymax, "z": zmin },
			{ "x": xmax, "y": ymax, "z": zmin },
			{ "x": xmin, "y": ymin, "z": zmax },
			{ "x": xmax, "y": ymin, "z": zmax },
			{ "x": xmin, "y": ymax, "z": zmax },
			{ "x": xmax, "y": ymax, "z": zmax }
		];
		return vlist;
		
	}

	subdivide ()
	{
		const newEdge = this._edge/2;
		const newEdgeHalf = this._edge/4;
		
		const xmin = this._center.x - newEdgeHalf;
		const xmax = this._center.x + newEdgeHalf;

		const ymin = this._center.y - newEdgeHalf;
		const ymax = this._center.y + newEdgeHalf;

		const zmin = this._center.z - newEdgeHalf;
		const zmax = this._center.z + newEdgeHalf;

		// Returns the list of BoundingBoxes
		var bList =
		[
			new Utils.BoundingBox ({ "x": xmin, "y": ymin, "z": zmin }, newEdge),
			new Utils.BoundingBox ({ "x": xmax, "y": ymin, "z": zmin }, newEdge),
			new Utils.BoundingBox ({ "x": xmin, "y": ymax, "z": zmin }, newEdge),
			new Utils.BoundingBox ({ "x": xmax, "y": ymax, "z": zmin }, newEdge),
			new Utils.BoundingBox ({ "x": xmin, "y": ymin, "z": zmax }, newEdge),
			new Utils.BoundingBox ({ "x": xmax, "y": ymin, "z": zmax }, newEdge),
			new Utils.BoundingBox ({ "x": xmin, "y": ymax, "z": zmax }, newEdge),
			new Utils.BoundingBox ({ "x": xmax, "y": ymax, "z": zmax }, newEdge)
		];
		return bList;
	}
}