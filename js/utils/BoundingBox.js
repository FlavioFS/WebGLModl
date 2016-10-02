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

	// Returns model for THREE.js
	model ()
	{
		var VL = this.vertices(); // Vertex List

		var rmodel =
		{
			"material":
			{
				color: 0xDDDDAA,
				specular: 0xFFFFAA,
				shininess: 30,
				shading: THREE.FlatShading
			},

			"vertices":
			[
				[ VL[0].x, VL[0].y, VL[0].z ],
				[ VL[1].x, VL[1].y, VL[1].z ],
				[ VL[2].x, VL[2].y, VL[2].z ],
				[ VL[3].x, VL[3].y, VL[3].z ],

				[ VL[4].x, VL[4].y, VL[4].z ],
				[ VL[5].x, VL[5].y, VL[5].z ],
				[ VL[6].x, VL[6].y, VL[6].z ],
				[ VL[7].x, VL[7].y, VL[7].z ]
			],

			"faces": Utils.BoundingBox.triangleFaceTopology,

			"normals": Utils.BoundingBox.faceNormals
		};

		return rmodel;
	}

	// Calculates the normal from the topology (even when shifted)
	// Assumes non-rotated cube faces
	static simpleNormal (faceVerts)
	{
		var rv;

		let diff1 = Math.abs(faceVerts[1] - faceVerts[0]);
		let diff2 = Math.abs(faceVerts[2] - faceVerts[1]);

		switch (diff1)
		{
			case 1:
				if 		(diff2 == 2) rv = Utils.Vector.FRONT;
				else if (diff2 == 4) rv = Utils.Vector.DOWN;
			break;

			case 2:
				if 		(diff2 == 1) rv = Utils.Vector.BACK;
				else if (diff2 == 4) rv = Utils.Vector.RIGHT;
			break;

			case 4:
				if 		(diff2 == 1) rv = Utils.Vector.UP;
				else if (diff2 == 2) rv = Utils.Vector.LEFT;
			break;
		}

		return rv;
	}

	// Fixes the faces when vertices are deleted, and the swap log is given
	static fixFaces (swaps, faceList)
	{
		if (swaps.length > 0)
		{
			// For each repeated element removed...
			for (var i = 0; i < swaps.length; i++)
			{
				// ... replaces its value in all faces and...
				for (var j = 0; j < faceList.length; j++)
					Utils.Array.replaceElement(faceList[j], swaps[i].oldValue, swaps[i].newValue);

				// ... offsets higher faces by 1 to the left
				for (var j = 0; j < faceList.length; j++)
					Utils.Array.offset(faceList[j], -1, swaps[i].oldValue);
			}
		}
	}

	static shiftFaces (deletions, faceList)
	{
		if (deletions.length > 0)
		{
			// For each repeated element removed...
			for (var i = 0; i < deletions.length; i++)
			{
				// ... offsets higher faces by 1 to the left
				for (var j = 0; j < faceList.length; j++)
					Utils.Array.offset(faceList[j], -1, deletions[i]);
			}
		}	
	}
}

/* =====================================================================================================
 *  Constants
 * ===================================================================================================== */
// Topology info: which vertices belong to each face/edge of the cube?
// Convention is x->y->z ordered
Utils.BoundingBox.squaredFaceTopology =
[
	[0, 1, 3, 2], // Face 0 - Back
	[4, 6, 7, 5], // Face 1 - Front
	
	[0, 2, 6, 4], // Face 2 - Left
	[5, 7, 3, 1], // Face 3 - Right

	[2, 3, 7, 6], // Face 4 - Top
	[0, 1, 5, 4]  // Face 5 - Down
];

Utils.BoundingBox.triangleFaceTopology =
[
	// Back
	[0, 2, 3],
	[3, 1, 0],

	// Front
	[4, 5, 7],
	[7, 6, 4],

	// Left
	[0, 4, 6],
	[6, 2, 0],

	// Right
	[1, 3, 7],
	[7, 5, 1],

	// Top
	[2, 6, 7],
	[7, 3, 2],

	// Down
	[0, 1, 5],
	[5, 4, 0]
];

Utils.BoundingBox.edgeTopology =
[
	// Top
	[2, 3],
	[3, 7],
	[7, 6],
	[6, 2],

	// Bottom
	[0, 1],
	[1, 5],
	[5, 4],
	[4, 0],

	// Sides
	[0, 2],
	[1, 3],
	[5, 7],
	[4, 6]
];

Utils.BoundingBox.faceNormals =
[
	// Back
	[ 0, 0,-1],
	[ 0, 0,-1],

	// Front
	[ 0, 0, 1],
	[ 0, 0, 1],

	// Left
	[-1, 0, 0],
	[-1, 0, 0],

	// Right
	[ 1, 0, 0],
	[ 1, 0, 0],

	// Top
	[ 0, 1, 0],
	[ 0, 1, 0],

	// Down
	[ 0,-1, 0],
	[ 0,-1, 0]
];