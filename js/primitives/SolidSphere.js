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
	constructor (centerJSON, radius, renderInside = false)
	{
		super (centerJSON);
		this._radius = radius;
		this._octree = null;
		this._renderInside = renderInside;
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
		var dist =    (point.x - this.center.x)*(point.x - this.center.x)
					+ (point.y - this.center.y)*(point.y - this.center.y)
					+ (point.z - this.center.z)*(point.z - this.center.z);


		// return ( dist <= this.radius * this.radius );
		if (dist > this.radius*this.radius)
			return Primitives.VERTEX_OUT;
		else if (dist == this.radius*this.radius)
			return Primitives.VERTEX_ON;
		return Primitives.VERTEX_IN;
	}

	/* =====================================================================================================
	 *  THREEJS GEOMETRY
	 * ===================================================================================================== */
	geometry() {
		return new THREE.SphereGeometry(this._radius, 32, 16);
	}
};