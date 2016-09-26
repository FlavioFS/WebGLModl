/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		coneName = new SolidCone ({"x": 1, "y": 2}, 7);

	Wrong:
		var   coneName = new SolidCone ({"x": 1, "y": 2}, 7);
		const coneName = new SolidCone ({"x": 1, "y": 2}, 7);
		let	  coneName = new SolidCone ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.SolidCone = class extends Primitives.Solid
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	// This Cone is centered at the base, and points to the z-axis (up)
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
		 *   Z < Zc        ~> below the Cone
		 *     or
		 *   Z > Zc + h    ~> above the tip of the Cone
		 */
		if ( (point.z < this.center.z) || (point.z > this.center.z + this.height) ) return false;
		
		
		/* Circle test:
		 *   |(X,Y) - (Xc,Yc)| <= Rz,   (this one is squared due to performance reasons)
		 *
		 * where Rz is the radius at the height z. Thus, from the similar triangles, we find...
		 *   Rz = r * (h-z)/h
		 */
		var
			dx = point.x - this.center.x,
			dy = point.y - this.center.y,
			Rz = this.radius * (this.height - point.z) / this.height;
		return (dx*dx + dy*dy <= Rz*Rz);
	}
}