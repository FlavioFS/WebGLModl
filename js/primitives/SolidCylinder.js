/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);

	Wrong:
		var   cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);
		const cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);
		let	  cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);

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
	// This Cylinder is centered at the base, and points to the z-axis (up)
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
	octree (precision=5)
	{
		var 2r = 2*this.radius;
		var boxEdge = (2r > this.height) ? 2r : this.height; // Chooses the largest value
		return super.octree(boxEdge, precision);
	}


	/* =====================================================================================================
	 *  IMPLEMENTS SOLID
	 * ===================================================================================================== */
	// Implements Solid.contains
	contains (point)
	{
		/* Height test:
		 *   Z < Zc        ~> below the Cylinder
		 *     or
		 *   Z > Zc + h    ~> above the tip of the Cylinder
		 */
		if ( (point.z < this.center.z) || (point.z > this.center.z + this.height) ) return false;


		// Circle test: |(X,Y) - (Xc,Yc)| <= r      (this one is squared due to performance reasons)
		var
			dx = point.x - this.center.x,
			dy = point.y - this.center.y,
		return (dx*dx + dy*dy <= this.radius*this.radius);
	}
}