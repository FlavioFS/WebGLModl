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
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON, radius, height)
	{
		super (centerJSON);
		this.radius = radius;
		this.height = height;
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
		// Height test: |Z - Zc| > h
		var halfHeight = this.height / 2;
		if ( (point.z < this.center.z - halfHeight) || (point.z > this.center.z + halfHeight) ) return false;
		
		// Circle test: |(X,Y) - (Xc,Yc)| <= r      (this one is squared due to performance reasons)
		var
			dx = point.x - this.center.x,
			dy = point.y - this.center.y,
		return (dx*dx + dy*dy <= this.radius*this.radius);
	}
}