/* IMPORTANT: How to create instances at the browser console
	
	Correct:
		cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);

	Wrong:
		var   cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);
		const cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);
		let	  cylinderName = new SolidCylinder ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

/** DOCUMENTATION
 *
 *  =====================================================================================================
 *  Attributes
 *  =====================================================================================================
 *      + center
 *          Description:
 *              Inherits center from Primitives.Solid.
 *
 *      + radius, height
 *          Description:
 *              Numbers representing these measures.
 *          
 *          Usage:
 *              var r = cylinder.height;
 *
 *  =====================================================================================================
 *  Methods
 *  =====================================================================================================
 *      + octree (precision=5)
 *          Description:
 *              Overrides the Primitives.Solid method and calculates the octree for this cylinder.
 *              The precision level is optional, with default value of 5.
 *
 *          Usage:
 *              var oct = cylinder.octree(3); // The precision level is set to 3.
 *
 *
 *      - contains (point)
 *          Description:
 *              Implements Primitives.Solid.contains (point)
 *
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
	 *  GETTERS
	 * ===================================================================================================== */	
	get radius () { return this.radius; }
	get height () { return this.height; }


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.octree
	octree (precision=5)
	{
		var Rx2 = 2*this.radius;
		var boxEdge = (Rx2 > this.height) ? Rx2 : this.height; // Chooses the largest value
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