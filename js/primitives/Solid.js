/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		primName = new Primitive ({x: 1, y: 2});

	Wrong:
		var 	primName = new Primitive ({x: 1, y: 2});
		const 	primName = new Primitive ({x: 1, y: 2});
		let		primName = new Primitive ({x: 1, y: 2});

	DO NOT use "var", "const" or "let".
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
		this.center = centerJSON;	// Every Solid has a center
		this.octree = null;			// Every Solid has an Octree (this is abstract)
	}


	/* =====================================================================================================
	 *  ABSTRACT METHODS
	 * ===================================================================================================== */
	// This Solid contains the point?
	contains (point)
	{
		console.log(new Error ("Abstract method 'contains' of Solid must be implemented in the Subclass."));
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

	// All of these vertices are outside of this Solid
	outside (vertices)
	{
		for (var i = 0; i < centers.length; i++) {
			if (this.contains(centers[i])) return false;
		}

		return true;
	}

	// Decides the color of a node - concrete method
	decideColor (boundingBox)
	{
		var plusHalf = boundingBox + edge/2;
		var diffHalf = boundingBox - edge/2;

		var vertices =
		[
			{ x: plusHalf, y: plusHalf, z: plusHalf },
			{ x: plusHalf, y: plusHalf, z: diffHalf },
			{ x: plusHalf, y: diffHalf, z: plusHalf },
			{ x: plusHalf, y: diffHalf, z: diffHalf },
			{ x: diffHalf, y: plusHalf, z: plusHalf },
			{ x: diffHalf, y: plusHalf, z: diffHalf },
			{ x: diffHalf, y: diffHalf, z: plusHalf },
			{ x: diffHalf, y: diffHalf, z: diffHalf }
		];

		if (this.inside(vertices))  return Octree.BLACK;
		if (this.outside(vertices)) return Octree.WHITE;
		
		return Octree.GRAY;
	}

	// Solid can define the recursion, it does not depend on the primitive
	octreeRecursion (node, precision, level)
	{
		var color = this.decideColor(node.boundingBox);
		
		// Leafnode
		if (color == Octree.WHITE || color == Octree.BLACK)
		{
			node.value = color;
		}

		// Recursion
		else if (level < precision)
		{
			node.value = Octree.GRAY;

			var cx = this.center.x;
			var cy = this.center.y;
			var cz = this.center.z;

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
				new Octree.Node(this.octr, bBoxes[0], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[1], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[2], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[3], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[4], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[5], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[6], Octree.GRAY, []),
				new Octree.Node(this.octr, bBoxes[7], Octree.GRAY, [])
			];

			// Recursion to each one of them
			for (var i = 0; i < Octree.EIGHT; i++) {
				this.octreeRecursion(node.kids[i], precision, level+1);
			}
		}
	}

	// Generates Octree
	octree (precision, bBoxEdge)
	{
		if (this.octr) return this.octr;

		// Bounding box of the SolidSphere
		var bBox = new Utils.BoundingBox (this.center, bBoxEdge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this.octr = new Octree.Node(null, bBox, Octree.GRAY, []);
		
		// octreeRecursion is implemented in the class 'Solid'
		octreeRecursion (this.octr, precision, 0);

		return this.octr;
	}
}