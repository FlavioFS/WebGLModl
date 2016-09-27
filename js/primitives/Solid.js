/* IMPORTANT: How to create instances at the browser console
	
	Correct:
		solidName = new Primitives.Solid ({x: 1, y: 2, z: 3});

	Wrong:
		var   solidName = new Primitives.Solid ({x: 1, y: 2, z: 3});
		const solidName = new Primitives.Solid ({x: 1, y: 2, z: 3});
		let	  solidName = new Primitives.Solid ({x: 1, y: 2, z: 3});

	DO NOT use "var", "const" or "let".
*/

/** DOCUMENTATION
 *
 *  =====================================================================================================
 *  Attributes
 *  =====================================================================================================
 *      + center
 *          Description:
 *              Every solid must contain a center.
 *          
 *          Usage:
 *              var coordinates =
 *              {
 *                  "x": solid.center.x,
 *                  "y": solid.center.y,
 *                  "z": solid.center.z
 *              }
 *
 *  =====================================================================================================
 *  Methods
 *  =====================================================================================================
 *      + octree (bBoxEdge, precision=5)
 *          Description:
 *              Calculates and returns the octree given the edge of a bounding box (and optionally the
 *              precision level).
 *              The user is advised to NOT CALL this method DIRECTLY from Primitives.Solid, but from the
 *              inherited concrete classes like Primitive.(Sphere, Cube, Cylinder, Cone).
 *
 *          Usage:
 *              var oct = solid.octree(6, 9); // A bounding box with edge 6, and a precision level of 9.
 *
 *
 *      # The remaining methods are internal, and are used by other primitives. Also there is a brief
 *        explanation above each method implementation:
 *          - contains (point)
 *          - inside (vertices)
 *          - outside (vertices)
 *          - decideColor (boundingBox)
 *          - octreeRecursion (node, precision, level)
 *
 */

// Namespace
var Primitives = Primitives || {};

// Base class for primitives
Primitives.Solid = class
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON)
	{
		this._center = centerJSON;	// Every Solid has a center
		this._octree = null;			// Every Solid has an Octree (this is abstract)
	}


	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get center () { return this._center; }

	set center (centerJSON) { this._center = centerJSON; }


	/* =====================================================================================================
	 *  ABSTRACT METHODS
	 * ===================================================================================================== */
	// Does this Solid contain the point?
	contains (point)
	{
		console.error(new Error ("Abstract method 'contains' of Solid must be implemented in the Subclass."));
		return false;
	}


	/* =====================================================================================================
	 *  CONCRETE METHODS
	 * ===================================================================================================== */
	// This Solid contains all of these vertices
	inside (vertices)
	{
		for (var i = 0; i < vertices.length; i++) {
			if (!this.contains(vertices[i])) return false;
		}

		return true;
	}

	// All of these vertices and their center are outside of this Solid
	outside (vertices)
	{
		var center =
		{
			"x": 0,
			"y": 0,
			"z": 0
		};

		console.log("vertices:", vertices);

		for (var i = 0; i < vertices.length; i++) {
			if (this.contains(vertices[i])) return false;

			center.x += vertices[i].x;
			center.y += vertices[i].y;
			center.z += vertices[i].z;

			console.log("(", i, ") center:", center);
		}

		center.x /= vertices.length;
		center.y /= vertices.length;
		center.z /= vertices.length;

		console.log("center:", center);

		if (this.contains(center)) return false;

		return true;
	}

	// Decides the color of a node
	decideColor (boundingBox)
	{
		var plusHalf = boundingBox.center + boundingBox.edge/2;
		var diffHalf = boundingBox.center - boundingBox.edge/2;

		var vertices =
		[
			{ "x": plusHalf, "y": plusHalf, "z": plusHalf },
			{ "x": plusHalf, "y": plusHalf, "z": diffHalf },
			{ "x": plusHalf, "y": diffHalf, "z": plusHalf },
			{ "x": plusHalf, "y": diffHalf, "z": diffHalf },
			{ "x": diffHalf, "y": plusHalf, "z": plusHalf },
			{ "x": diffHalf, "y": plusHalf, "z": diffHalf },
			{ "x": diffHalf, "y": diffHalf, "z": plusHalf },
			{ "x": diffHalf, "y": diffHalf, "z": diffHalf }
		];

		if (this.inside(vertices))  return Octree.BLACK;
		if (this.outside(vertices)) return Octree.WHITE;
		
		return Octree.GRAY;
	}

	// The Primitives.Solid class can define the recursion for the bounding box subdivision!
	// (It does not depend on the primitive)
	octreeRecursion (node, precision, level)
	{
		var color = this.decideColor(node.boundingBox);
		
		// Leafnode
		if (color == Octree.WHITE || color == Octree.BLACK)
		{
			node.color = color;
		}

		// Recursion
		else if (level < precision)
		{
			console.log("RECURSION!! P: %d ~ lvl: %d", precision, level);

			node.color = Octree.GRAY;

			var cx = this._center.x;
			var cy = this._center.y;
			var cz = this._center.z;

			var newEdge = node.boundingBox.edge;
			var newEdgeHalf = newEdge/2;
			
			var cxDiff = cx - newEdgeHalf;
			var cxPlus = cx + newEdgeHalf;

			var cyDiff = cy - newEdgeHalf;
			var cyPlus = cy + newEdgeHalf;

			var czDiff = cz - newEdgeHalf;
			var czPlus = cz + newEdgeHalf;

			var bBoxes =
			[
				new Utils.BoundingBox ({cxDiff, cyDiff, czDiff}, newEdge),
				new Utils.BoundingBox ({cxPlus, cyDiff, czDiff}, newEdge),
				new Utils.BoundingBox ({cxDiff, cyPlus, czDiff}, newEdge),
				new Utils.BoundingBox ({cxPlus, cyPlus, czDiff}, newEdge),
				new Utils.BoundingBox ({cxDiff, cyDiff, czPlus}, newEdge),
				new Utils.BoundingBox ({cxPlus, cyDiff, czPlus}, newEdge),
				new Utils.BoundingBox ({cxDiff, cyPlus, czPlus}, newEdge),
				new Utils.BoundingBox ({cxPlus, cyPlus, czPlus}, newEdge)
			];

			// 8 sub-cubes
			node.kids = 
			[
				new Octree.Node(this._octree, bBoxes[0], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[1], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[2], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[3], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[4], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[5], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[6], Octree.GRAY, []),
				new Octree.Node(this._octree, bBoxes[7], Octree.GRAY, [])
			];

			// Recursion to each one of them
			for (var i = 0; i < Octree.EIGHT; i++) {
				this._octreeRecursion(node.kids[i], precision, level+1);
			}
		}
	}

	// Generates Octree
	octree (bBoxEdge, precision=5)
	{
		if (this._octree != undefined || this._octree != null) return this._octree;

		// Bounding box of the SolidSphere
		var bBox = new Utils.BoundingBox (this._center, bBoxEdge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this._octree = new Octree.Node(null, bBox, Octree.GRAY, []);
		
		// octreeRecursion is implemented in the class 'Solid'
		this.octreeRecursion (this._octree, precision, 0);

		return this._octree;
	}
}