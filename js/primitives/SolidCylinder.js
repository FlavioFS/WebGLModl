/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);

	Wrong:
		var 	cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);
		const 	cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);
		let		cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.SolidCylinder = class extends Primitives.Solid
{
	constructor (centerJSON, radius, height)
	{
		super (centerJSON);
		this.radius = radius;
		this.height = height;
	}

	// Implements Solid.contains
	contains (point)
	{
		//return <boolean>;
	}

	// Implements Solid.inside
	inside(vertices, faceCenters)
	{
		for (var i = 0; i < vertices.length; i++) {
			if (!this.contains(vertices[i])) return false;
		}

		for (var i = 0; i < centers.length; i++) {
			if (!this.contains(centers[i])) return false;
		}

		return true;
	}

	// Implements Solid.outside
	outside (vertices, centers)
	{
		for (var i = 0; i < vertices.length; i++) {
			if (this.contains(vertices[i])) return false;
		}

		for (var i = 0; i < centers.length; i++) {
			if (this.contains(centers[i])) return false;
		}

		return true;
	}

	// Implements Solid.octree
	get octree (precision)
	{
		if (this.octr) return this.octr;

		// Bounding box of the SolidSphere
		var bBox = new Utils.BoundingBox (this.center, 2*this.radius);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this.octr = new Octree.Node(null, bBox, Octree.GRAY, []);
		
		// octreeRecursion is implemented in the class 'Solid'
		octreeRecursion (this.octr, precision, 0);

		return this.octr;
	}
}