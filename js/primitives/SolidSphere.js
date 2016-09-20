/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		sphName = new SolidSphere ({x: 1, y: 2}, 7);

	Wrong:
		var 	sphName = new SolidSphere ({x: 1, y: 2}, 7);
		const 	sphName = new SolidSphere ({x: 1, y: 2}, 7);
		let		sphName = new SolidSphere ({x: 1, y: 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.SolidSphere = class extends Primitives.Solid
{
	constructor (centerJSON, radius)
	{
		super (centerJSON);
		this.radius = radius;
		this.octree = null;
	}


	// Implements Solid.contains
	contains (point)
	{
		return this.intersectsBall(point.x, ppoint.y, point.z, 0); // Point treated as a ball with 0 radius
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



	/////////////////////////////////////////// PRIVATE ///////////////////////////////////////////
	// Ball intersects SolidSphere?
	intersectsBall (cx, cy, cz, otherRadius)
	{
		var diff =
		{
			"x": this.center.x - cx,
			"y": this.center.y - cy,
			"z": this.center.z - cz
		};

		// Squared distance (sum of radius)
		var radius2 = this.radius + otherRadius;
		radius2 *= radius2;

		// Dot product
		var dotP = diff.x * diff.x + diff.y * diff.y + diff.z * diff.z;
		
		return (dotP <= radius2);
	}	

	intersectsSolidSphere (sphere)
	{
		return this.intersectsBall(sphere.center.x, sphere.center.y, sphere.center.z, sphere.radius);
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
}