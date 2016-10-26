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

// var totalRenderFalse = 0;

// when an solid vertex is calculated against a primitive, it can be
Primitives.VERTEX_OUT = 0;
Primitives.VERTEX_ON  = 1;
Primitives.VERTEX_IN  = 2;

// Base class for primitives
Primitives.Solid = class
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON={x:0, y:0, z:0})
	{
		this.center = centerJSON; // Every Solid has a center
		this._octree = null;       // Every Solid has an Octree (this is abstract)
		this._boolRenderInside = true;
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
	// Return the octree in the string format, ex.: '((bw(bbbbbww(....'
	toString()
	{
		return this.toStringRecursion(this.octree).toLowerCase();
	}

	toStringRecursion(node)
	{
		if (node == null)
			return '';

		let s = node.color == Octree.GRAY ? '(' : node.color;

		for (var i = 0; i < Octree.EIGHT; i++) 
			s += this.toStringRecursion(node.kids[i]);

		return s;
	}

	// Creates octree from a string ex.: '((bw(bbbbbww(....'
	fromString(str, bBoxEdge = 1)
	{
		str = str.toUpperCase().split('');
		
		let level = 0;
		 // we have to pass the index by reference. let i = 0 doesnt work
		let ref = {i: 0};

		let bBox = new Utils.BoundingBox (Utils.Vector.sum(this.center, {x:0, y:0, z:0}), bBoxEdge)
		this._octree = this.fromStringRecursion(bBox, 0, str, ref)
	}

	fromStringRecursion(bBox, level, colorList, ref) {
		
			var node = null;

			if (colorList[ref.i] == '(' || colorList[ref.i] == Octree.GRAY)
			{
				ref.i++;
				node = new Octree.Node(null, bBox, Octree.GRAY, level, []);
				
				var newBoxes = node.boundingBox.subdivide();
				for (let j = 0; j < Octree.EIGHT; j++)
					node.kids.push(
						this.fromStringRecursion(newBoxes[j], level+1, colorList, ref)
					);
				
				return node;

			} else if (colorList[ref.i] == Octree.BLACK) {
				ref.i++;
				return new Octree.Node(null, bBox, Octree.BLACK, level, []);
			} else if (colorList[ref.i] == Octree.WHITE) {
				ref.i++;
				return new Octree.Node(null, bBox, Octree.WHITE, level, []);
			}

	}


	// This Solid contains all of these vertices
	inside (vertices)
	{
		for (var i = 0; i < vertices.length; i++)
			if (this.contains(vertices[i]) != Primitives.VERTEX_IN) return false;

		return true;
	}

	// All of these vertices and their center are outside of this Solid
	outside (vertices)
	{
		for (var i = 0; i < vertices.length; i++)
			if (this.contains(vertices[i]) != Primitives.VERTEX_OUT) return false;

		return true;
	}

	// At some point we need to force a color decision (at the leaves within the precision limit)
	forceColor (node)
	{
		let vertices = node.boundingBox.vertices();

		if (this.contains(node.boundingBox.center)) return Octree.BLACK;

		for (var i = 0; i < vertices.length; i++)
			if (this.contains(vertices[i])) return Octree.BLACK;

		return Octree.WHITE;
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
	calcOctree (bBoxEdge, precision=3, minDivision=0, yshift=0)
	{
		// Bounding box of the Solid
		var bBox = new Utils.BoundingBox (Utils.Vector.sum(this.center, {x:0, y:yshift, z:0}), bBoxEdge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this._octree = new Octree.Node(null, bBox, Octree.GRAY, 0, []);
		
		// Starts recursive subdivision
		this.calcOctreeRecursion (this._octree, precision, 0, minDivision);

		return this._octree;
	}

	// The Primitives.Solid class can define the recursion for the bounding box subdivision!
	// (It does not depend on the primitive)
	calcOctreeRecursion (node, precision, level, minDivision=0)
	{
		let color = this.decideColor(node.boundingBox);

		if (color == Octree.BLACK) {
			node.willBeRendered = false;
			// totalRenderFalse++;
		}

		// Recursion
		if ((level < minDivision) || ((color == Octree.GRAY) && (level < precision)))
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
				this.calcOctreeRecursion(node.kids[i], precision, level+1, minDivision);
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

		return this.modelRecursion (this.octree);
	}

	// Generates the model through DIVIDE AND CONQUER
	modelRecursion (node)
	{
		// Leaf node - Conquer
		if (node.kids.length == 0)
		{
			// ... OR if a node is to be rendered or we have chosen to render internal nodes, jumps this if
			if (node.color != Octree.BLACK)// || !(node.willBeRendered || this._renderInside))
				return;
			return node.boundingBox.model();
		}

		// Branch node - Divide
		else
		{
			var kidsModels = [];
			var newkid;
			for (var i = 0; i < node.kids.length; i++)
			{
				newkid = this.modelRecursion(node.kids[i]);
				if (newkid) kidsModels.push(newkid);
			}

			// This node branch is ALL WHITE!
			if (kidsModels.length == 0) return;

			// Calculates return value (model for this node)
			var rv = {};
			rv.material = kidsModels[0].material;
			rv.vertices = [];
			rv.faces = [];
			rv.normals = [];

			// Gathers vertices in one array list
			for (var i = 0; i < kidsModels.length; i++)
				for (var j = 0; j < kidsModels[i].vertices.length; j++)
					rv.vertices.push(kidsModels[i].vertices[j]);

			// Gathers normals in one array list
			for (var i = 0; i < kidsModels.length; i++)
				for (var j = 0; j < kidsModels[i].normals.length; j++)
					rv.normals.push(kidsModels[i].normals[j]);

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
			
			var swaps = Utils.Array.removeDuplicates(rv.vertices); // Removes repeated vertices
			Utils.BoundingBox.fixFaces(swaps, rv.faces);           // Now faces must be fixed too

			// Removes faces pointing inside
			var A, B, C;
			var face;
			var faceCenter;
			var solid2Face;
			var normal;
			for (var i = 0; i < rv.faces.length; i++)
			{
				// Working on this face
				face = rv.faces[i];

				// Face composed by points A, B, C (right-hand rule to normal)
				A = rv.vertices[face[0]];
				B = rv.vertices[face[1]];
				C = rv.vertices[face[2]];

				// Converts to point structure
				A = Utils.Vector.pointFromArray(A);
				B = Utils.Vector.pointFromArray(B);
				C = Utils.Vector.pointFromArray(C);

				faceCenter = Utils.Vector.centroid(A, B, C);
				solid2Face = Utils.Vector.diff(faceCenter, this.center);
				normal     = Utils.Vector.pointFromArray(rv.normals[i]);

				// Face normal oposes to vector that comes from the center of solid. Remove it.
				if (Utils.Vector.dot(solid2Face, normal) > 0)
				{
					rv.faces.splice(i, -1);
					rv.normals.splice(i, -1);
				}

				let breakpoint = 0;
			}

			// Now remove a bunch of vertices without faces
			var deletions = [];
			var present;
			var isHere;
			for (var i = 0; i < rv.vertices.length; i++)   // Every vertex that...
			{
				present = false;
				for (var j = 0; j < rv.faces.length; j++)  // ... among all faces...
				{
					// (this one is present somewhere in face <j>)
					isHere = (rv.faces[j].indexOf(i) != -1);
					if ( isHere )
					{
						present = true;
						break;
					}
				}

				if (!present) // ... cannot be found...
				{
					deletions.push(i);         // ... is logged...
					rv.vertices.splice(i, -1); // ... and removed
				}
			}

			// Faces are wrong again, now... They need a shift
			Utils.BoundingBox.shiftFaces(deletions, rv.faces);

			return rv;
		}
	}

	// Adds to scene directly with no optimizations, but colored
	addToSceneColored (scene, precision, offset=0)
	{
		let group = new THREE.Object3D();
		this.addToSceneColoredRecursion (group, this.octree, precision, offset);
		scene.add(group);
	}

	// Adds recursively
	addToSceneColoredRecursion (group, node, precision, offset)
	{
		// Leaf node - Conquer
		if (node.kids.length == 0)
		{
			if (node.color != Octree.BLACK) return;

			var model = node.boundingBox.model();

			switch (node.level)
			{
				case 0:
					model.material.color = 0xFF0000;
					model.material.opacity = 1.0;
				break;

				case 1:
					model.material.color = 0x00FF00;
					model.material.opacity = 0.85;
				break;

				case 2:
					model.material.color = 0xFF0000;
					model.material.opacity = 0.7;
				break;

				case 3:
					model.material.color = 0xFF00FF;
					model.material.opacity = 0.55;
				break;

				case 4:
					model.material.color = 0xFFFF00;
					model.material.opacity = 0.4;
				break;

				case 5:
					model.material.color = 0x0000FF;
					model.material.opacity = 0.25;
				break;

				default:
					model.material.color = 0x0000FF;
					model.material.opacity = 0.2;
				break;
			}
			
			// if (precision == 0)
			// {
			// 	model.material.color = 0x0000FF;
			// 	model.material.opacity = 1.0;
			// }
			// else if (precision == 1)
			// {
			// 	model.material.color = 0x0000FF;
			// 	model.material.opacity = 0.6;	
			// }
			// else
			// {
			// 	// model.material.color -= 0xFF0000 * node.level / precision;
			// 	// model.material.color += 0x0000FF * node.level / precision;
			// 	model.material.color =
			// 		0xFF0000 * (1 - (node.level/precision)) + 0x0000FF * (node.level/precision);

			// 	model.material.opacity = 1.0 * (1 - node.level/precision) + 0.2 * node.level;
			// }

			var geometry = Utils.Model.toGeometry(model, offset);
			var material = new THREE.MeshPhongMaterial (model.material);
			var mesh = new THREE.Mesh(geometry, material);
			if (model.material.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
			group.add(mesh);
		}

		// Branch node - Divide
		else
		{
			for (var i = 0; i < node.kids.length; i++)
			{
				this.addToSceneColoredRecursion (scene, node.kids[i], precision, offset);
			}
		}
	}

	// OPERATIONS

	// Move every bounding box's center
	translate(newPos) 
	{
		this.translateRecursion(this.octree, newPos)
	}

	translateRecursion(node, newPos) 
	{
		node.boundingBox.center.x += newPos.x
		node.boundingBox.center.y += newPos.y
		node.boundingBox.center.z += newPos.z

		for (var i = 0; i < node.kids.length; i++) 
			this.translateRecursion(node.kids[i], newPos)
	}


	/****************************************/
	// BOOLEAN OPERATIONS
	/****************************************/

	// if both solids' bounding box edge and center are different, normalize the solids' nodes.
	// Return the solids' nodes
	normalizeNodesIfNeeded(solid1, solid2, depth=2) {
		if (
			solid1._octree.boundingBox.edge == solid2._octree.boundingBox.edge
			&& solid1._octree.boundingBox.center.x == solid2._octree.boundingBox.center.x
			&& solid1._octree.boundingBox.center.y == solid2._octree.boundingBox.center.y
			&& solid1._octree.boundingBox.center.z == solid2._octree.boundingBox.center.z
		)
			return [solid1._octree, solid2._octree];
		return this.normalizeSolidsBBox(solid1._octree, solid2._octree);

		
	}

	union(solid1, solid2, depth=2) {

		var nodes = this.normalizeNodesIfNeeded(solid1, solid2, depth);
		this._octree = new Octree.Node(null, nodes[0].boundingBox, Octree.GRAY);
		this.unionRecursion(this._octree, nodes[0], nodes[1]);

	}

	unionRecursion(newNode, node1, node2) {
		// both gray
		if (node1.color == Octree.GRAY && node2.color == Octree.GRAY)
		{
			var newBoxes = newNode.boundingBox.subdivide();
			newNode.kids = [];

			for (var i = 0; i < newBoxes.length; i++)
			{
				newNode.kids.push(
					new Octree.Node(newNode, newBoxes[i],
						Octree.GRAY, // it may change
						newNode.level+1, [])
				);

				if (node1.kids[i].color == Octree.BLACK || node2.kids[i].color == Octree.BLACK)
					newNode.kids[i].color = Octree.BLACK;
				else if (node1.kids[i].color == Octree.WHITE && node2.kids[i].color == Octree.WHITE)
					newNode.kids[i].color = Octree.WHITE;
				
				this.unionRecursion(newNode.kids[i], node1.kids[i], node2.kids[i]);
			}
		}

		// both leaves
		// this node is already created, so we skip the recursion
		else if (node1.color != Octree.GRAY && node2.color != Octree.GRAY)
		{
			return;

		// only one is gray, so copy everything from the gray one to the new node
		} else {
			if (node1.color == Octree.GRAY && node2.color == Octree.WHITE)
			{
				var newBoxes = newNode.boundingBox.subdivide();
				newNode.kids = [];

				for (var i = 0; i < newBoxes.length; i++)
					newNode.kids.push(node1.kids[i]);
			}
			else if (node1.color == Octree.WHITE && node2.color == Octree.GRAY)
			{
				var newBoxes = newNode.boundingBox.subdivide();
				newNode.kids = [];

				for (var i = 0; i < newBoxes.length; i++)
					newNode.kids.push(node2.kids[i]);
			}
		}
	}

	intersection(solid1, solid2, depth=2) {

		var nodes = this.normalizeNodesIfNeeded(solid1, solid2, depth);
		this._octree = new Octree.Node(null, nodes[0].boundingBox, Octree.GRAY);
		this.intersectionRecursion(this._octree, nodes[0], nodes[1]);

	}

	intersectionRecursion(newNode, node1, node2) {
		// both gray
		if (node1.color == Octree.GRAY && node2.color == Octree.GRAY)
		{
			var newBoxes = newNode.boundingBox.subdivide();
			newNode.kids = [];

			for (var i = 0; i < newBoxes.length; i++)
			{
				newNode.kids.push(
					new Octree.Node(newNode, newBoxes[i],
						Octree.GRAY, // it may change
						newNode.level+1, [])
				);

				if (node1.kids[i].color == Octree.BLACK && node2.kids[i].color == Octree.BLACK)
					newNode.kids[i].color = Octree.BLACK;
				else if (node1.kids[i].color == Octree.WHITE || node2.kids[i].color == Octree.WHITE)
					newNode.kids[i].color = Octree.WHITE;
				
				this.intersectionRecursion(newNode.kids[i], node1.kids[i], node2.kids[i]);
			}
		}

		// both leaves
		// this node is already created, so we skip the recursion
		else if (node1.color != Octree.GRAY && node2.color != Octree.GRAY)
		{
			return;

		// only one is gray, so copy everything from the gray one to the new node
		} else {
			if (node1.color == Octree.GRAY && node2.color == Octree.BLACK)
			{
				var newBoxes = newNode.boundingBox.subdivide();
				newNode.kids = [];

				for (var i = 0; i < newBoxes.length; i++)
					newNode.kids.push(node1.kids[i]);
			}
			else if (node1.color == Octree.BLACK && node2.color == Octree.GRAY)
			{
				var newBoxes = newNode.boundingBox.subdivide();
				newNode.kids = [];

				for (var i = 0; i < newBoxes.length; i++)
					newNode.kids.push(node2.kids[i]);
			}
		}
	}

	difference(solid1, solid2, depth=2) {

		var nodes = this.normalizeNodesIfNeeded(solid1, solid2, depth);
		this._octree = new Octree.Node(null, nodes[0].boundingBox, Octree.GRAY);
		this.differenceRecursion(this._octree, nodes[0], nodes[1]);

	}

	differenceRecursion(newNode, node1, node2) {
		// both gray
		if (node1.color == Octree.GRAY && node2.color == Octree.GRAY)
		{
			var newBoxes = newNode.boundingBox.subdivide();
			newNode.kids = [];

			for (var i = 0; i < newBoxes.length; i++)
			{
				newNode.kids.push(
					new Octree.Node(newNode, newBoxes[i],
						Octree.GRAY, // it may change
						newNode.level+1, [])
				);

				if (node1.kids[i].color == Octree.BLACK && node2.kids[i].color == Octree.WHITE)
					newNode.kids[i].color = Octree.BLACK;
				else if (
					(node1.kids[i].color == Octree.BLACK && node2.kids[i].color == Octree.BLACK)
					|| (node1.kids[i].color == Octree.WHITE)
				)
					newNode.kids[i].color = Octree.WHITE;
				
				this.differenceRecursion(newNode.kids[i], node1.kids[i], node2.kids[i]);
			}
		}

		// both leaves
		// this node is already created, so we skip the recursion
		else if (node1.color != Octree.GRAY && node2.color != Octree.GRAY)
		{
			return;

		} else {
			// in this case we copy node1 to newNode
			if (node1.color == Octree.GRAY && node2.color == Octree.WHITE)
			{
				var newBoxes = newNode.boundingBox.subdivide();
				newNode.kids = [];

				for (var i = 0; i < newBoxes.length; i++)
					newNode.kids.push(node1.kids[i]);
			}
			// BLACK - GRAY
			else if (node1.color == Octree.BLACK && node2.color == Octree.GRAY)
			{

				// create new black kids[] for node1
				var blackKids = [];
				var node1Boxes = node1.boundingBox.subdivide();

				for (var i = 0; i < node1Boxes.length; i++) {
					blackKids.push(
						new Octree.Node(null, node1Boxes[i],
							Octree.BLACK,
							node1.level+1, [])
					);
				}

				// now we do black_kids - nodes2.kids

				var newBoxes = newNode.boundingBox.subdivide();
				newNode.kids = [];

				for (var i = 0; i < newBoxes.length; i++) {
					newNode.kids.push(
						new Octree.Node(newNode, newBoxes[i],
							Octree.GRAY, // it may change
							newNode.level+1, [])
					);

					if (node2.kids[i].color == Octree.WHITE)
						newNode.kids[i].color = Octree.BLACK;
					else if (node2.kids[i].color == Octree.BLACK)
						newNode.kids[i].color = Octree.WHITE;
					
					this.differenceRecursion(newNode.kids[i], blackKids[i], node2.kids[i]);
				}

			}
		}
	}

	/********
	***** FUNCTIONS FOR SUBDIVIDING BBOX AND APPEND NODES INTO NEW OCTREES
	*/

	// it calculates the precision a new octree with `boxEdge`
	// must have to place inside it another node
	// which has a `dist` distance from the center of another node
	findPrecision(dist, boxEdge, minEdge) {
		// a leave will have at most boxEdge size
		var leavesEdge = [
			boxEdge,
			boxEdge,
			boxEdge
		] // x, y, z

		// with the distances we can calculate what edge could handle this
		// examples: dist=1.75, so we divide for 2, 1, 0.5 and 0.25; finally only 0.25 can be used for it
		for (var i = 0; i < 3; i++) {
			if (dist[i] == 0) {
				leavesEdge[i] = 0;
				continue;
			}

			while (dist[i] % leavesEdge[i] != 0)
			{
				if (leavesEdge[i] <= minEdge)
					break;
				leavesEdge[i] /= 2;
			} 
		}

		
		// the distance will be divided by the wrapperNode1 edge to find out which precision it needs
		// precision = how many times we have to subdivide?
		// example: edge=2, dist.x = 0.5, so 2/0.5 = 8, so we need to 2^3 = 8

		var precisions = [
			(dist[0] == 0) ? 0 : parseInt(Math.log(boxEdge / leavesEdge[0]) / Math.log(2)),
			(dist[1] == 0) ? 0 : parseInt(Math.log(boxEdge / leavesEdge[1]) / Math.log(2)),
			(dist[2] == 0) ? 0 : parseInt(Math.log(boxEdge / leavesEdge[2]) / Math.log(2)),
		]

		return Math.max.apply(Math, precisions)
	}

	// get the biggest boundingBox, duplicates its size so the another solid will be inside this bBox too
	normalizeSolidsBBox(n1, n2, depth=2) {
		var node1, node2;

		if (n1.boundingBox.edge >= n1.boundingBox.edge)
		{
			node1 = n1;
			node2 = n2;
		}
		else
		{
			node2 = n1;
			node1 = n2;
		}
		// var baseNode = (node1.boundingBox.edge >= node2.boundingBox.edge)
		// 				? node1 : node2;

		// testing where each node will be placed
		var sum = {x: node1.boundingBox.edge/2,
					y:node1.boundingBox.edge/2,
					z: node1.boundingBox.edge/2};


		if (node1.boundingBox.center.x > node2.boundingBox.center.x)
			sum.x *= -1;
		if (node1.boundingBox.center.y > node2.boundingBox.center.y)
			sum.y *= -1;
		if (node1.boundingBox.center.z > node2.boundingBox.center.z)
			sum.z *= -1;


		// create two wrappers

		var wrapperBBox1 = new Utils.BoundingBox (Utils.Vector.sum(node1.boundingBox.center, sum),
			node1.boundingBox.edge*2)
		var wrapperBBox2 = new Utils.BoundingBox (Utils.Vector.sum(node1.boundingBox.center, sum),
			node1.boundingBox.edge*2)

		var wrapperNode1 = new Octree.Node(null, wrapperBBox1, Octree.WHITE, node1.level-1, []);
		var wrapperNode2 = new Octree.Node(null, wrapperBBox2, Octree.WHITE, node1.level-1, []);


		// wrapperNodes will be divided based on the distance between node1 and node2
		var dist = [
			Math.abs(node1.boundingBox.center.x - node2.boundingBox.center.x),
			Math.abs(node1.boundingBox.center.y - node2.boundingBox.center.y),
			Math.abs(node1.boundingBox.center.z - node2.boundingBox.center.z),
		] // x, y, z

		var precision = this.findPrecision(dist, wrapperNode2.boundingBox.edge, 0.25);
		console.log(precision)

		this.subdivideWrapperNode(wrapperNode1, 1);
		this.copyNodeKidsToWrapperNode(wrapperNode1, node1, false);

		this.subdivideWrapperNode(wrapperNode2, precision);
		this.copyNodeKidsToWrapperNode(wrapperNode2, node2);

		console.log(this.toStringRecursion(wrapperNode1).toLowerCase())
		console.log(this.toStringRecursion(wrapperNode2).toLowerCase())

		return [ wrapperNode1, wrapperNode2 ];
	}

	subdivideWrapperNode(wrapperNode, precision)
	{
		if (precision == 0)
			return;

		if (wrapperNode.color != Octree.GRAY) {
			wrapperNode.color = Octree.GRAY;

			var newBoxes = wrapperNode.boundingBox.subdivide();
			for (var i = 0; i < newBoxes.length; i++) {
				wrapperNode.kids.push(
					new Octree.Node(wrapperNode, newBoxes[i],
						Octree.WHITE, // it may change
						wrapperNode.level+1, [])
				);
				this.subdivideWrapperNode(wrapperNode.kids[i], precision-1)
			}
		}
	}

	copyNodeKidsToWrapperNode(wrapperNode, node, copyOnlyLeaves=true) {

		if (!copyOnlyLeaves)
			this.copyToWrapperNodeKid(wrapperNode, node);

		for (var i = 0; i < node.kids.length; i++) {
			this.copyToWrapperNodeKid(wrapperNode, node.kids[i]);
			this.copyNodeKidsToWrapperNode(wrapperNode, node.kids[i]);
		}

	}

	copyToWrapperNodeKid(wrapperNode, node)
	{
		if (wrapperNode == undefined )
			return;

		for (var i = 0; i < wrapperNode.kids.length; i++) {
			if (
				wrapperNode.kids[i].boundingBox.edge == node.boundingBox.edge
				&& wrapperNode.kids[i].boundingBox.center.x == node.boundingBox.center.x
				&& wrapperNode.kids[i].boundingBox.center.y == node.boundingBox.center.y
				&& wrapperNode.kids[i].boundingBox.center.z == node.boundingBox.center.z
			) {
				wrapperNode.kids[i] = node;
				return;
			}

			this.copyToWrapperNodeKid(wrapperNode.kids[i], node);
		}

	}

	// given a node, it looks for any wrapperNode kid (even kid of kids)
	// that matches the node
	checkIfNodeMatchesAnyBiggerNodeKid(wrapperNode, node, countMatchedNodes, depth) {

		if (wrapperNode == undefined)
			return;

		for (var i = 0; i < wrapperNode.kids.length; i++) {

			if (
				wrapperNode.kids[i].boundingBox.edge == node.boundingBox.edge
				&& wrapperNode.kids[i].boundingBox.center.x == node.boundingBox.center.x
				&& wrapperNode.kids[i].boundingBox.center.y == node.boundingBox.center.y
				&& wrapperNode.kids[i].boundingBox.center.z == node.boundingBox.center.z
			)
			{
				wrapperNode.kids[i] = node;
				countMatchedNodes.total++;
				return;
			}

		}

		for (var i = 0; i < wrapperNode.kids.length; i++) {
			this.checkIfNodeMatchesAnyBiggerNodeKid(wrapperNode.kids[i], node, countMatchedNodes, depth);
		}

		// if yet it has not matched all nodes, we try placeNodeInsideBiggerNode again
		for (var i = 0; i < node.kids.length; i++) {
			this.placeNodeInsideBiggerNode(wrapperNode, node.kids[i], countMatchedNodes, depth-1);
		}
	}

	placeNodeInsideBiggerNode(wrapperNode, node, countMatchedNodes, depth=2) {

		if (depth == 0)
			return;
		

		if (wrapperNode.color != Octree.GRAY) {
			wrapperNode.color = Octree.GRAY;

			var newBoxes = wrapperNode.boundingBox.subdivide();
			for (var i = 0; i < newBoxes.length; i++) {
				wrapperNode.kids.push(
					new Octree.Node(wrapperNode, newBoxes[i],
						Octree.WHITE, // it may change
						wrapperNode.level+1, [])
				);
			}
		}

		this.checkIfNodeMatchesAnyBiggerNodeKid(wrapperNode, node, countMatchedNodes, depth);
	}


}