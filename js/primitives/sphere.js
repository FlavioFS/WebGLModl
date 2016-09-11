/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		sphName = new Sphere ({x: 1, y: 2}, 7);

	Wrong:
		var 	sphName = new Sphere ({x: 1, y: 2}, 7);
		const 	sphName = new Sphere ({x: 1, y: 2}, 7);
		let		sphName = new Sphere ({x: 1, y: 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.Sphere = class extends Primitives.Solid
{
	constructor (centerJSON, radius)
	{
		super (centerJSON);
		this.radius = radius;
		this.octree = null;
	}

	// Ball intersects Sphere?
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

	intersectsSphere (sphere)
	{
		return this.intersectsBall(sphere.center.x, sphere.center.y, sphere.center.z, sphere.radius);
	}

	// The sphere contains the point?
	contains (point)
	{
		return this.intersectsBall(point.x, ppoint.y, point.z, 0); // Point treated as a sphere with 0 radius
	}

	decideColor (boundingBox) {
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

		var faceCenters =
		[
			{ x: plusHalf, y: boundingBox.center, z: boundingBox.center },
			{ x: diffHalf, y: boundingBox.center, z: boundingBox.center },

			{ x: boundingBox.center, y: plusHalf, z: boundingBox.center },
			{ x: boundingBox.center, y: diffHalf, z: boundingBox.center },

			{ x: boundingBox.center, y: boundingBox.center, z: plusHalf },
			{ x: boundingBox.center, y: boundingBox.center, z: diffHalf }
		];

		if (boxTotallyInside(vertices, faceCenters))  return Octree.BLACK;
		if (boxTotallyOutside(vertices, faceCenters)) return Octree.WHITE;
		
		return Octree.GRAY;
	}

	boxTotallyInside(vertices, faceCenters)
	{
		for (var i = 0; i < vertices.length; i++) {
			if (!this.contains(vertices[i])) return false;
		}

		for (var i = 0; i < centers.length; i++) {
			if (!this.contains(centers[i])) return false;
		}

		return true;
	}

	boxTotallyOutside (vertices, centers)
	{
		for (var i = 0; i < vertices.length; i++) {
			if (this.contains(vertices[i])) return false;
		}

		for (var i = 0; i < centers.length; i++) {
			if (this.contains(centers[i])) return false;
		}

		return true;
	}

	get octree ()
	{
		if (this.octr) return this.octr;

		// Bounding box of the Sphere
		var bBox = new Utils.BoundingBox (this.center, 2*this.radius);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this.octr = new Octree.Node(null, bBox, Octree.GRAY, []);
		octreeRecursion (this.octr);

		return this.octr;
	}

	octreeRecursion (node)
	{
		var color = decideColor(node.boundingBox);
		
		// Leafnode
		if (color == Octree.WHITE || color == Octree.BLACK)
		{
			node.value = color;
		}

		// Recursion
		else
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
				octreeRecursion(node.kids[i]);
			}
		}
	}
}