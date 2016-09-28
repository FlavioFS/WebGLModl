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
 *      + octree (bBoxEdge, precision=3)
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
	forceColor (node)
	{
		let vertices = node.boundingBox.vertices();

		// So... we are going to vote for colors!
		let inVote  = 0;
		let outVote = 0;

		// Topology info: which vertices belong to each face of the cube?
		// Convention is x->y->z ordered
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
			faceCenters.push({ "x": 0, "y": 0, "z": 0 });	// Creates an empty room for the new face

			// Sums all points
			for (var j = 0; j < faceVertices[i].length; j++)
			{
				faceCenters[i].x += vertices[faceVertices[i][j]].x;
				faceCenters[i].y += vertices[faceVertices[i][j]].y;
				faceCenters[i].z += vertices[faceVertices[i][j]].z;
			}

			// Then finishes with the mean (geometric center) of them
			faceCenters[i].x /= faceVertices[i].length;
			faceCenters[i].y /= faceVertices[i].length;
			faceCenters[i].z /= faceVertices[i].length;
		}

		// Calculates the midpoints of edges
		let edgeCenters = [];
		for (var i = 0; i < vertices.length - 1; i++)
		{
			for (var j = i+1; j < vertices.length; j++)
			{
				edgeCenters.push({
					"x": (vertices[i].x + vertices[j].x) / 2,
					"y": (vertices[i].y + vertices[j].y) / 2,
					"z": (vertices[i].z + vertices[j].z) / 2
				});
			}
		}

		// Votes for centers
		for (var i = 0; i < faceCenters.length; i++)
		{
			if (this.contains(faceCenters[i])) inVote++;
			else outVote++;
		}

		// Votes for edges
		for (var i = 0; i < edgeCenters.length; i++)
		{
			if (this.contains(edgeCenters[i])) inVote++;
			else outVote++;
		}

		// Votes for vertices
		for (var i = 0; i < vertices.length; i++)
		{
			if (this.contains(vertices[i])) inVote++;
			else outVote++;
		}

		// Never returns Octree.GRAY - Remember: Octree.BLACK is a filled node
		// Note: a TIE returns Octree.BLACK
		return ((outVote > inVote) ? Octree.WHITE : Octree.BLACK);
	}

	// Decides the color of a node
	decideColor (boundingBox)
	{
		let vertices = boundingBox.vertices();

		if (this.inside(vertices))  return Octree.BLACK;    // Vertices are totally inside

		// Adds the center
		vertices.push
		({
			"x":  boundingBox.center.x,
			"y":  boundingBox.center.y,
			"z":  boundingBox.center.z
		});
		if (this.outside(vertices)) return Octree.WHITE;    // Vertices are totally outside
		
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
			node.color = Octree.GRAY;
			var newBoxes = node.boundingBox.subdivide();

			// 8 sub-cubes
			node.kids = [];
			for (var i = 0; i < newBoxes.length; i++)
			{
				node.kids.push(
					new Octree.Node(node, newBoxes[i], Octree.GRAY, [])
				);
			}

			// Recursion to each one of them
			for (var i = 0; i < Octree.EIGHT; i++) {
				this.octreeRecursion(node.kids[i], precision, level+1);
			}
		}

		// Leafnode
		else
		{
			if (color == Octree.GRAY) color = this.forceColor(node);
			node.color = color;
		}
	}

	// Generates Octree
	calcOctree (bBoxEdge, precision=3)
	{
		// Bounding box of the SolidSphere
		var bBox = new Utils.BoundingBox (this._center, bBoxEdge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this._octree = new Octree.Node(null, bBox, Octree.GRAY, []);
		
		console.log("!!!!! PRECISION:", precision);

		// octreeRecursion is implemented in the class 'Solid'
		this.octreeRecursion (this._octree, precision, 0);

		return this._octree;
	}
}