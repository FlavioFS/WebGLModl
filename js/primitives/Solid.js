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
 *      + calcOctree (bBoxEdge, precision=3)
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
 *          - calcOctreeRecursion (node, precision, level)
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
		this.center = centerJSON; // Every Solid has a center
		this._octree = null;       // Every Solid has an Octree (this is abstract)
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

		let inVerts = 0;
		let inEdges = 0;
		let inFaces = 0;

		let outVerts = 0;
		let outEdges = 0;
		let outFaces = 0;

		// Calculates centers
		let faceCenters = [];
		for (var i = 0; i < Utils.BoundingBox.faceTopology.length; i++)
		{
			faceCenters.push({ "x": 0, "y": 0, "z": 0 });	// Creates an empty room for the new face

			// Sums all points
			for (var j = 0; j < Utils.BoundingBox.faceTopology[i].length; j++)
			{
				faceCenters[i].x += vertices[Utils.BoundingBox.faceTopology[i][j]].x;
				faceCenters[i].y += vertices[Utils.BoundingBox.faceTopology[i][j]].y;
				faceCenters[i].z += vertices[Utils.BoundingBox.faceTopology[i][j]].z;
			}

			// Then finishes with the mean (geometric center) of them
			faceCenters[i].x /= Utils.BoundingBox.faceTopology[i].length;
			faceCenters[i].y /= Utils.BoundingBox.faceTopology[i].length;
			faceCenters[i].z /= Utils.BoundingBox.faceTopology[i].length;
		}

		// Calculates the midpoints of edges
		let edgeCenters = [];
		for (var i = 0; i < Utils.BoundingBox.edgeTopology.length; i++)
		{
			edgeCenters.push
			({
				"x": (vertices[Utils.BoundingBox.edgeTopology[i][0]].x + vertices[Utils.BoundingBox.edgeTopology[i][1]].x) / 2,
				"y": (vertices[Utils.BoundingBox.edgeTopology[i][0]].y + vertices[Utils.BoundingBox.edgeTopology[i][1]].y) / 2,
				"z": (vertices[Utils.BoundingBox.edgeTopology[i][0]].z + vertices[Utils.BoundingBox.edgeTopology[i][1]].z) / 2
			});
		}

		// Votes for centers
		for (var i = 0; i < faceCenters.length; i++)
		{
			if (this.contains(faceCenters[i])) inFaces++;
			else outFaces++;
		}

		// Votes for edges
		for (var i = 0; i < edgeCenters.length; i++)
		{
			if (this.contains(edgeCenters[i])) inEdges++;
			else outEdges++;
		}

		// Votes for vertices
		for (var i = 0; i < vertices.length; i++)
		{
			if (this.contains(vertices[i])) inVerts++;
			else outVerts++;
		}

		inVote = inVerts + inEdges + inFaces;
		outVote = outVerts + outEdges + outFaces;
		console.log(edgeCenters);
		var breakpoint = 7;

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

	// Generates Octree
	calcOctree (bBoxEdge, precision=3)
	{
		// Bounding box of the Solid
		var bBox = new Utils.BoundingBox (this.center, bBoxEdge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this._octree = new Octree.Node(null, bBox, Octree.GRAY, 0, []);
		
		// Starts recursive subdivision
		this.calcOctreeRecursion (this._octree, precision, 0);

		return this._octree;
	}

	// The Primitives.Solid class can define the recursion for the bounding box subdivision!
	// (It does not depend on the primitive)
	calcOctreeRecursion (node, precision, level)
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
					new Octree.Node(node, newBoxes[i], Octree.GRAY, level+1, [])
				);
			}

			// Recursion to each one of them
			for (var i = 0; i < Octree.EIGHT; i++) {
				this.calcOctreeRecursion(node.kids[i], precision, level+1);
			}
		}

		// Leafnode
		else
		{
			if (color == Octree.GRAY) color = this.forceColor(node);
			node.color = color;
		}
	}

	// Returns model for THREE.js
	model ()
	{
		if (!this._octree) return; // Octree was not calculated yet

		return this.modelRecursion (this._octree);
	}

	// Generates the model through DIVIDE AND CONQUER
	modelRecursion (node)
	{
		// Leaf node - Conquer
		if (node.kids.length == 0)
		{
			if (node.color != Octree.BLACK) return;

			return node.boundingBox.model();
		}

		// Branch node - Divide
		else
		{
			var kidsModels = [];
			for (var i = 0; i < node.kids.length; i++)
			{
				var newkid = this.modelRecursion(node.kids[i]);
				if (newkid) kidsModels.push(newkid);
			}

			// This node branch is ALL WHITE!
			if (kidsModels.length == 0) return;

			// Return value (model for this node)
			var rv = {};
			rv.material = kidsModels[0].material;
			rv.vertices = [];
			rv.faces = [];


			//// Offsets faces
			// For every node (octree, 8 children: this length is always 8)
			for (var i = 0; i < kidsModels.length; i++) {

				// For every face (cube, 6 faces: this length is always 6)
				for (var j = 0; j < kidsModels[i].faces.length; j++) {
					
					// Offsetts triangle faces (triangle: this length is always 3)
					for (var k = 0; k < kidsModels[i].faces[j].length; k++) {
						kidsModels[i].faces[j][k] += 8*i; // Offsets by 8 for every child
					}
				}

			}

			//// Now gathers vertices and faces
			// For every node (octree, 8 children: this length is always 8)
			for (var i = 0; i < kidsModels.length; i++) {
				
				// Gathers vertices (cube, 8 vertices: this length is always 8)
				for (var j = 0; j < kidsModels[i].vertices.length; j++) {
					rv.vertices.push(kidsModels[i].vertices[j]);
				}

				// Gathers faces (cube, 6 faces: this length is always 6)
				for (var j = 0; j < kidsModels[i].faces.length; j++) {
					rv.faces.push(kidsModels[i].faces[j]);
				}				

			}

			return rv;
		}
	}
}