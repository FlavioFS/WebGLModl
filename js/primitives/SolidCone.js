/* IMPORTANT: How to create instances at the browser console
	
	Correct:
		coneName = new Primitives.SolidCone ({"x": 1, "y": 2, "z": 3}, 7);

	Wrong:
		var   coneName = new Primitives.SolidCone ({"x": 1, "y": 2, "z": 3}, 7);
		const coneName = new Primitives.SolidCone ({"x": 1, "y": 2, "z": 3}, 7);
		let	  coneName = new Primitives.SolidCone ({"x": 1, "y": 2, "z": 3}, 7);

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
 *              var r = cone.radius;
 *
 *  =====================================================================================================
 *  Methods
 *  =====================================================================================================
 *      + octree (precision=3)
 *          Description:
 *              Overrides the Primitives.Solid method and calculates the octree for this cone.
 *              The precision level is optional, with default value of 5.
 *
 *          Usage:
 *              var oct = cone.octree(7); // The precision level is set to 9.
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
Primitives.SolidCone = class extends Primitives.Solid
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	// This Cone is centered at the base, and points to the z-axis (up)
	constructor (centerJSON, radius, height)
	{
		super (centerJSON);
		this._radius = radius;
		this._height = height;
	}


	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get radius () { return this._radius; }
	get height () { return this._height; }
	get octree () { return this._octree; }

	set radius (radius) { this._radius = radius; }
	set height (height) { this._height = height; }


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.octree
	octree (precision=3)
	{
		var Rx2 = 2*this._radius;
		var boxEdge = (Rx2 > this._height) ? Rx2 : this._height; // Chooses the largest value
		return super.calcOctree(boxEdge, precision);
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
		if ( (point.z < this.center.z) || (point.z > this.center.z + this._height) ) return false;
		

		/* Circle test:
		 *   |(X,Y) - (Xc,Yc)| <= Rz,   (this one is squared due to performance reasons)
		 *
		 * where Rz is the radius at the height z. Thus, from the similar triangles, we find...
		 *   Rz = r * (h-z)/h
		 */
		var
			dx = point.x - this.center.x,
			dy = point.y - this.center.y,
			Rz = this._radius * (this._height - point.z) / this._height;
		return (dx*dx + dy*dy <= Rz*Rz);
	}
}