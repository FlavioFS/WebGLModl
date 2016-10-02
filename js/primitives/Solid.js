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
		return this.contains(node.boundingBox.center) ? Octree.BLACK : Octree.WHITE;
	}

	// Decides the color of a node
	decideColor (boundingBox)
	{
		let vertices = boundingBox.vertices();

		if (this.inside(vertices))  return Octree.BLACK;    // Vertices are totally inside

		// Adds the center
		vertices.push (boundingBox.center);
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

			// Calculates return value (model for this node)
			var rv = {};
			rv.material = kidsModels[0].material;
			rv.vertices = [];
			rv.faces = [];

			// Gathers vertices in one array list
			for (var i = 0; i < kidsModels.length; i++)
				for (var j = 0; j < kidsModels[i].vertices.length; j++)
					rv.vertices.push(kidsModels[i].vertices[j]);

			/* Gathers and offsets (fixes topology of) higher faces.
			 * E.g.: at the leaf, each kid is 8 elements long,
			 *       then they merge into a group of 64, the
			 *       second now starts at position 8; the third,
			 *       16... This group will merge into a 8*64 = 512
			 *       elements group, and this goes on...
			 * 8 x [0, ..., 8^n] -> 1 x [0, ..., 8^(n+1)]
			 */
			let offset = 0;
			for (var i = 0; i < kidsModels.length; i++) {
				for (var j = 0; j < kidsModels[i].faces.length; j++) {
					rv.faces.push
					([
						kidsModels[i].faces[j][0] + offset,
						kidsModels[i].faces[j][1] + offset,
						kidsModels[i].faces[j][2] + offset,
					]);
				}

				offset += kidsModels[i].vertices.length;
			}

			// No repetitions
			var swaps = Utils.Array.removeDuplicates(rv.vertices);

			// Fixes the faces
			if (swaps.length > 0)
			{
				// For each repeated element removed...
				for (var i = 0; i < swaps.length; i++)
				{
					// Replaces its value in all faces
					for (face of rv.faces)
						Utils.Array.replaceElement(face, swaps[i].oldValue, swaps[i].newValue);

					// Offsets higher faces by 1 to the left
					for (face of rv.faces)
						Utils.Array.offset(face, -1, swaps[i].oldValue);
				}
			}

			let hammertime = 0;

			return rv;
		}
	}
}