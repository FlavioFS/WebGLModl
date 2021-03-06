/** DOCUMENTATION
 *
 *  =====================================================================================================
 *  Attributes
 *  =====================================================================================================
 *      + center
 *          Description:
 *              Inherits center from Primitives.Solid.
 *          
 *      + edge
 *          Description:
 *              A numbers representing the edge value.
 *          
 *          Usage:
 *              var r = cone.edge;
 *
 *  =====================================================================================================
 *  Methods
 *  =====================================================================================================
 *      + octree (precision=3)
 *          Description:
 *              Overrides the Primitives.Solid method and calculates the octree for this cube.
 *              The precision level is optional, with default value of 5.
 *
 *          Usage:
 *              var oct = cube.octree(7); // The precision level is set to 9.
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
Primitives.SolidCube = class extends Primitives.Solid
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON, edge, name="Cube")
	{
		super (centerJSON, name);
		this._edge = edge;
	}


	/* =====================================================================================================
	 *  GETTERS & SETTERS
	 * ===================================================================================================== */	
	get edge ()   { return this._edge;   }
	get octree () { return this._octree; }

	set edge (edge) { this._edge = edge; }


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.octree
	calcOctree ()
	{
		if (this.octr) return this.octr;

		// Bounding box is the cube itself
		var bBox = new Utils.BoundingBox (this.center, this._edge);
		// var bBox = Utils.BoundingBox (this.center, this._edge);

		// Only the root node completely filled
		// no parent, cube bounding box, filled, no kids
		this.octr = new Octree.Node(null, bBox, Octree.BLACK, []);
		return this.octr;
	}


	/* =====================================================================================================
	 *  IMPLEMENTS SOLID
	 * ===================================================================================================== */
	// Implements Solid.contains
	contains (point)
	{
		var halfEdge = this._edge / 2;

		/* Point exceeds the cube in any axis:
		 *   ~> |X-Xc| > h
		 *   ~> |Y-Yc| > h
		 *   ~> |Z-Zc| > h
		 */
		if ( (point.x < this.center.x - halfEdge) || (point.x > this.center.x + halfEdge) ) return Primitives.VERTEX_OUT;
		if ( (point.y < this.center.y - halfEdge) || (point.y > this.center.y + halfEdge) ) return Primitives.VERTEX_OUT;
		if ( (point.z < this.center.z - halfEdge) || (point.z > this.center.z + halfEdge) ) return Primitives.VERTEX_OUT;
		
		return Primitives.VERTEX_ON;
	}

	/* =====================================================================================================
	 *  THREEJS GEOMETRY
	 * ===================================================================================================== */
	geometry() {
		var rv = new THREE.CubeGeometry(this.edge, this.edge, this.edge);

		var center_mtx = new THREE.Matrix4();
		center_mtx.setPosition( new THREE.Vector3(this.center.x, this.center.y, this.center.z) );
		rv.applyMatrix(center_mtx);

		return rv;
	}
};