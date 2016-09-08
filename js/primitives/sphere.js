/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		sphName = new Sphere ({x: 1, y: 2}, 7);

	Wrong:
		var 	sphName = new Sphere ({x: 1, y: 2}, 7);
		const 	sphName = new Sphere ({x: 1, y: 2}, 7);
		let		sphName = new Sphere ({x: 1, y: 2}, 7);

	DO NOT use "var", "const" or "let".
*/

class Sphere extends Primitive
{
	constructor (centerJSON, radius)
	{
		super (centerJSON);
		this.radius = radius;
	}

	// Two spheres intersect each other?
	intersectsBall (cx, cy, otherRadius)
	{
		var diff =
		{
			"x": this.center.x - cx,
			"y": this.center.y - cy
		};

		// Squared distance (sum of radius)
		var radius2 = this.radius + otherRadius;
		radius2 *= radius2;

		// Dot product
		var dotP = diff.x * diff.x + diff.y + diff.y;
		
		return dotP <= radius2;
	}	

	intersectsSphere (sphere)
	{
		return this.intersectsBall(sphere.center.x, sphere.center.y, sphere.radius);
	}

	// The sphere contains the point?
	contains (px, py)
	{
		return this.intersectsBall(px, py, 0); // Point treated as a sphere with 0 radius
	}
}