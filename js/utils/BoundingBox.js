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

			"faces":
			[
				// Back
				[0, 2, 3],
				[0, 3, 1],

				// Front
				[4, 5, 7],
				[4, 7, 6],

				// Left
				[0, 4, 6],
				[0, 6, 2],

				// Right
				[1, 3, 7],
				[1, 7, 5],

				// Top
				[2, 6, 7],
				[2, 7, 3],

				// Down
				[0, 1, 5],
				[0, 5, 4]
			]
		};

		return rmodel;
	}
}

/* =====================================================================================================
 *  Constants
 * ===================================================================================================== */
// Topology info: which vertices belong to each face/edge of the cube?
// Convention is x->y->z ordered
Utils.BoundingBox.faceTopology =
[
	[0, 1, 3, 2], // Face 0 - Back
	[4, 6, 7, 5], // Face 1 - Front
	
	[0, 2, 6, 4], // Face 2 - Left
	[5, 7, 3, 1], // Face 3 - Right

	[2, 3, 7, 6], // Face 4 - Top
	[0, 1, 5, 4]  // Face 5 - Down
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