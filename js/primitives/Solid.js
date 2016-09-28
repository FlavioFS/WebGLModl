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
		this._octree = null;		// Every Solid has an Octree (this is abstract)
	}


	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get center () { return this._center; }
	get octree () { return this._octree; }

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
		for (var i = 0; i < vertices.length; i++)
			if (!this.contains(vertices[i])) return false;

		return true;
	}

	// All of these vertices and their center are outside of this Solid
	outside (vertices)
	{
		for (var i = 0; i < vertices.length; i++)
			if (this.contains(vertices[i])) return false;

		return true;
	}

	// At some point we need to force a color decision (at the leaves within the precision limit)
	forceColor (vertices)
	{
		let inVote  = 0;
		let outVote = 0;

		// Topology info: which vertices belong to each face of the cube?
		let faceVertices =
		[
			[0, 1, 3, 2], // Face 0 - Back
			[4, 6, 7, 5], // Face 1 - Front
			
			[0, 2, 6, 4], // Face 2 - Left
			[5, 7, 3, 1], // Face 3 - Right

			[2, 3, 7, 6], // Face 4 - Top
			[0, 1, 5, 4], // Face 5 - Down
		];

		// Calculates centers
		let faceCenters = [];
		for (var i = 0; i < faceVertices.length; i++)
		{
			for (var j = 0; j < faceVertices.length; j++)
			{
				
			}
			faceCenters.push({ "x": , "y":, "z": });
		}

		// Votes for centers
		for (var i = 0; i < faceVertices.length; i++)

		// Votes for vertices
		for (var i = 0; i < vertices.length; i++)
		{
			if (this.contains(vertices[i])) inVote++;
			else outVote++;

			return
		}
	}

	// Decides the color of a node
	decideColor (boundingBox)
	{
		const halfEdge = boundingBox.edge/2;

		// Center
		const c = { "x": boundingBox.center.x, "y": boundingBox.center.y, "z": boundingBox.center.z };
		
		// Borders
		const
			xmin = c.x - halfEdge,
			ymin = c.y - halfEdge,
			zmin = c.z - halfEdge,
			
			xmax = c.x + halfEdge,
			ymax = c.y + halfEdge,
			zmax = c.z + halfEdge;

		let vertices =
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


		if (this.inside(vertices))  return Octree.BLACK;    // Totally inside

		vertices.push({ "x":  c.x, "y":  c.y, "z":  c.z }); // Adds the center
		if (this.outside(vertices)) return Octree.WHITE;    // Totally outside
		
		return Octree.GRAY;
	}

	// The Primitives.Solid class can define the recursion for the bounding box subdivision!
	// (It does not depend on the primitive)
	octreeRecursion (node, precision, level)
	{
		let color = this.decideColor(node.boundingBox);

		// Recursion
		if ((color == Octree.GRAY) && (level < precision))
		{
			console.log("RECURSION!! P: %d ~ lvl: %d", precision, level);

			node.color = Octree.GRAY;

			let c = { "x": node.boundingBox.center.x, "y": node.boundingBox.center.y, "z": node.boundingBox.center.z };

			let newEdge = node.boundingBox.edge/2;
			let newEdgeHalf = newEdge/2;
			
			let xmin = c.x - newEdgeHalf;
			let xmax = c.x + newEdgeHalf;

			let ymin = c.y - newEdgeHalf;
			let ymax = c.y + newEdgeHalf;

			let zmin = c.z - newEdgeHalf;
			let zmax = c.z + newEdgeHalf;

			let bBoxes =
			[
				new Utils.BoundingBox ({ "x": xmin, "y": ymin, "z": zmin}, newEdge),
				new Utils.BoundingBox ({ "x": xmax, "y": ymin, "z": zmin}, newEdge),
				new Utils.BoundingBox ({ "x": xmin, "y": ymax, "z": zmin}, newEdge),
				new Utils.BoundingBox ({ "x": xmax, "y": ymax, "z": zmin}, newEdge),
				new Utils.BoundingBox ({ "x": xmin, "y": ymin, "z": zmax}, newEdge),
				new Utils.BoundingBox ({ "x": xmax, "y": ymin, "z": zmax}, newEdge),
				new Utils.BoundingBox ({ "x": xmin, "y": ymax, "z": zmax}, newEdge),
				new Utils.BoundingBox ({ "x": xmax, "y": ymax, "z": zmax}, newEdge)
			];

			// 8 sub-cubes
			node.kids = 
			[
				new Octree.Node(node, bBoxes[0], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[1], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[2], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[3], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[4], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[5], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[6], Octree.GRAY, []),
				new Octree.Node(node, bBoxes[7], Octree.GRAY, [])
			];

			// Recursion to each one of them
			for (var i = 0; i < Octree.EIGHT; i++) {
				this.octreeRecursion(node.kids[i], precision, level+1);
			}
		}

		// Leafnode
		else { node.color = color; }
	}

	// Generates Octree
	calcOctree (bBoxEdge, precision=5)
	{
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