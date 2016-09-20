/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		cubeName = new SolidCube ({"x": 1, "y": 2}, 7);

	Wrong:
		var 	cubeName = new SolidCube ({"x": 1, "y": 2}, 7);
		const 	cubeName = new SolidCube ({"x": 1, "y": 2}, 7);
		let		cubeName = new SolidCube ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.SolidCube = class extends Primitives.Solid
{
	constructor (centerJSON, edge)
	{
		super (centerJSON);
		this.edge = edge;
	}

	get octree ()
	{
		if (this.octr) return this.octr;

		// Bounding box is the cube itself
		var bBox = Utils.BoundingBox (this.center, this.edge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this.octr = new Octree.Node(null, bBox, Octree.BLACK, []);
		return this.octr;
	}
}