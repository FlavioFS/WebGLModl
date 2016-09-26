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
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON, radius)
	{
		super (centerJSON);
		this.radius = radius;
		this.octree = null;
	}


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.octree
	octree (precision)
	{
		return super.octree(precision, 2*this.radius);
	}


	/* =====================================================================================================
	 *  IMPLEMENTS SOLID
	 * ===================================================================================================== */
	// Implements Solid.contains
	contains (point)
	{
		// Sphere equation test: |(X,Y,Z) - (Xc,Yc,Zc)| <= r    (squared due to performance reasons)
		var
			dx = point.x - this.center.x,
			dy = point.y - this.center.y,
			dz = point.z - this.center.z;

		return ( dx*dx + dy*dy + dz*dz <= this.radius * this.radius );
	}
}