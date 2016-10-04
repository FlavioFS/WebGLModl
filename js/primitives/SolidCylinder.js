/* IMPORTANT: How to create instances at the browser console
	
	Correct:
		cylinderName = new Primitives.SolidCylinder ({"x": 1, "y": 2, "z": 3}, 7);

	Wrong:
		var   cylinderName = new Primitives.SolidCylinder ({"x": 1, "y": 2, "z": 3}, 7);
		const cylinderName = new Primitives.SolidCylinder ({"x": 1, "y": 2, "z": 3}, 7);
		let	  cylinderName = new Primitives.SolidCylinder ({"x": 1, "y": 2, "z": 3}, 7);

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
 *      + octree (precision=3)
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
	constructor (centerJSON, radius, height, renderInside = true)
	{
		super (centerJSON);
		this._radius = radius;
		this._height = height;
		this._renderInside = renderInside;
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
	// Overrides Solid.calcOctree
	calcOctree (precision=3)
	{
		var Rx2 = 2*this._radius;
		var boxEdge = (Rx2 > this._height) ? Rx2 : this._height; // Chooses the largest value
		return super.calcOctree(boxEdge, precision, 0, boxEdge/2);
	}


	/* =====================================================================================================
	 *  IMPLEMENTS SOLID
	 * ===================================================================================================== */
	// Implements Solid.contains
	contains (point)
	{
		/* Height test:
		 *   Y < Yc        ~> below the Cylinder
		 *     or
		 *   Y > Yc + h    ~> above the tip of the Cylinder
		 */
		if ( (point.y < this.center.y) || (point.y > this.center.y + this._height) )
			return Primitives.VERTEX_OUT;

		// Circle test: |(X,Y) - (Xc,Yc)| <= r      (this one is squared due to performance reasons)
		let
			Xl = point.x - this.center.x,
			Zl = point.z - this.center.z,
			dist = Xl*Xl + Zl*Zl;
		
		if      (dist >  this._radius*this._radius) return Primitives.VERTEX_OUT;
		else if (dist == this._radius*this._radius) return Primitives.VERTEX_ON;
		
		return Primitives.VERTEX_IN;
	}
}