/** DOCUMENTATION
 *
 *  =====================================================================================================
 *  Attributes
 *  =====================================================================================================
 *      + center
 *          Description:
 *              Inherits center from Primitives.Solid.
 *          
 *      + radius, tubeRadius
 *          Description:
 *              Numbers representing these measures.
 *          
 *          Usage:
 *              var r = torus.radius;
 *
 *  =====================================================================================================
 *  Methods
 *  =====================================================================================================
 *      + octree (precision=3)
 *          Description:
 *              Overrides the Primitives.Solid method and calculates the octree for this torus.
 *              The precision level is optional, with default value of 5.
 *
 *          Usage:
 *              var oct = torus.octree(7); // The precision level is set to 9.
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
Primitives.SolidTorus = class extends Primitives.Solid
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	// This Torus is centered at the base, and points to the z-axis (up)
	constructor (centerJSON, radius, tubeRadius, renderInside = true)
	{
		super (centerJSON);
		this.radius = radius;
		this.tubeRadius = tubeRadius;
		this._renderInside = renderInside;
	}


	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get radius ()     { return this._radius;     }
	get tubeRadius () { return this._tubeRadius; }
	get octree ()     { return this._octree;     }

	set radius (radius)         { this._radius = radius;         }
	set tubeRadius (tubeRadius) { this._tubeRadius = tubeRadius; }


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.calcOctree
	calcOctree (precision=3)
	{
		return super.calcOctree(2*(this.radius + this.tubeRadius), precision, 1);
	}


	/* =====================================================================================================
	 *  IMPLEMENTS SOLID
	 * ===================================================================================================== */
	// Implements Solid.contains
	contains (point)
	{
		/* Some definitions
		 *  R: radius;
		 *  t: tubeRadius;
		 *  The center: (Xc, Yc, Zc);
		 *  The point: (X, Y, Z);
		 *  The point in local coordinates: (Xl, Yl, Zl) = ((X-Xc), (Y-Yc), (Z-Zc));
		 *  The "radius" of Torus slice at height Y: Ry = sqrt(t² - Yl²);
		 */

		/* Height test (vertex is out):
		 *   Yl < -t    ~> below the Torus
		 *   Y  < Yc-t
		 *     or
		 *   Yl >  t    ~> above the tip of the Torus
		 *   Y  > Yc+t
		 */
		if ( (point.y < this.center.y - this.tubeRadius) || (point.y > this.center.y + this.tubeRadius) )
			return Primitives.VERTEX_OUT;

		// Point is too far away to the sides
		let
			Xl = (point.x - this.center.x),
			Yl = (point.y - this.center.y),
			Zl = (point.z - this.center.z),
			hDist2 = Xl*Xl + Zl*Zl,
			Rmax = this.radius + this.tubeRadius;
		if ( hDist2 > Rmax*Rmax )
			return Primitives.VERTEX_OUT;


		/* Torus equation:
		 *   ( R² + t² - (X-Xc)² - (Y-Yc)² - (Z-Zc)² )² = 4R².(t² - (Y-Yc)²)
		 * Replacing the equality sign (=) with an inequality sign (>), we get the subspaces.
		 */
		 let
			lSide = this.radius*this.radius + this.tubeRadius*this.tubeRadius - hDist2 - Yl*Yl,
			rSide = 4*this.radius*this.radius*(this.tubeRadius*this.tubeRadius - Yl*Yl);

		return ( lSide*lSide > rSide ) ? Primitives.VERTEX_OUT : Primitives.VERTEX_IN;
	}

	/* =====================================================================================================
	 *  THREEJS GEOMETRY
	 * ===================================================================================================== */
	geometry() {
		var rv = new THREE.TorusGeometry(this.radius, this.tubeRadius, 32, 16);

		var center_mtx = new THREE.Matrix4();
		center_mtx.setPosition( new THREE.Vector3(this.center.x, this.center.y, this.center.z) );
		rv.applyMatrix(center_mtx);

		return rv;
	}
};