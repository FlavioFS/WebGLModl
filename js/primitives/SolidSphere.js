/* IMPORTANT: How to create instances at the browser console
	
	Correct:
		sphName = new Primitives.SolidSphere ({x: 1, y: 2, z: 3}, 7);

	Wrong:
		var   sphName = new Primitives.SolidSphere ({x: 1, y: 2, z: 3}, 7);
		const sphName = new Primitives.SolidSphere ({x: 1, y: 2, z: 3}, 7);
		let	  sphName = new Primitives.SolidSphere ({x: 1, y: 2, z: 3}, 7);

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
 *      + radius
 *          Description:
 *              A number representing the radius value.
 *          
 *          Usage:
 *              var r = cone.radius;
 *
 *  =====================================================================================================
 *  Methods
 *  =====================================================================================================
 *      + octree (precision=3)
 *          Description:
 *              Overrides the Primitives.Solid method and calculates the octree for this sphere.
 *              The precision level is optional, with default value of 5.
 *
 *          Usage:
 *              var oct = sphere.octree(4); // The precision level is set to 4.
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
Primitives.SolidSphere = class extends Primitives.Solid
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON, radius)
	{
		super (centerJSON);
		this._radius = radius;
		this._octree = null;
	}


	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get radius () { return this._radius; }
	get octree () { return this._octree; }
	
	set radius (radius) { this._radius = radius; }


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.octree
	calcOctree (precision=3)
	{
		return super.calcOctree(2*this.radius, precision);
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