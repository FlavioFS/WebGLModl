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
	constructor (centerJSON, radius, height, renderInside = true, name="Cone")
	{
		super (centerJSON, name);
		this.radius = radius;
		this.height = height;
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
		var Rx2 = 2*this.radius;
		var boxEdge = (Rx2 > this.height) ? Rx2 : this.height; // Chooses the largest value
		return super.calcOctree(boxEdge, precision, 0, boxEdge/2);
	}


	/* =====================================================================================================
	 *  IMPLEMENTS SOLID
	 * ===================================================================================================== */
	// Implements Solid.contains
	contains (point)
	{
		/* Height test:
		 *   Y < Yc        ~> below the Cone
		 *     or
		 *   Y > Yc + h    ~> above the tip of the Cone
		 */
		if ( (point.y < this.center.y) || (point.y > this.center.y + this.height) )
			return Primitives.VERTEX_OUT;
		

		/* Circle test:
		 *   |(X,Z) - (Xc,Zc)| <= Ry,   (this one is squared due to performance reasons)
		 *
		 * where Ry is the radius at the height y. Thus, from the similar triangles, we find...
		 *   Ry = ( 1 + ((Yc - Y)/h) ) * r
		 */
		let
			Xl = point.x - this.center.x,
			Zl = point.z - this.center.z,
			dist = Xl*Xl + Zl*Zl,
			Ry = ( 1 + ((this.center.y - point.y)/this.height) ) * this.radius;
		
		if      (dist > Ry*Ry)  return Primitives.VERTEX_OUT;
		else if (dist == Ry*Ry) return Primitives.VERTEX_ON;
		
		return Primitives.VERTEX_IN;
	}

	/* =====================================================================================================
	 *  THREEJS GEOMETRY
	 * ===================================================================================================== */
	geometry()  {
		var rv = new THREE.ConeGeometry(this.radius, this.height, 32);

		var center_mtx = new THREE.Matrix4();
		center_mtx.setPosition( new THREE.Vector3(this.center.x, this.center.y, this.center.z) );
		rv.applyMatrix(center_mtx);

		return rv;
	}
};