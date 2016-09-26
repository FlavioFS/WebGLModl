/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		cubeName = new SolidCube ({"x": 1, "y": 2}, 7);

	Wrong:
		var 	cubeName = new SolidCube ({"x": 1, "y": 2}, 7);
		const 	cubeName = new SolidCube ({"x": 1, "y": 2}, 7);
		let		cubeName = new SolidCube ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.SolidCube = class extends Primitives.Solid
{
	/* =====================================================================================================
	 *  CONSTRUCTOR
	 * ===================================================================================================== */	
	constructor (centerJSON, edge)
	{
		super (centerJSON);
		this.edge = edge;
	}


	/* =====================================================================================================
	 *  OVERRIDES SOLID
	 * ===================================================================================================== */
	// Overrides Solid.octree
	octree ()
	{
		if (this.octr) return this.octr;

		// Bounding box is the cube itself
		var bBox = Utils.BoundingBox (this.center, this.edge);

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
		var halfEdge = this.edge / 2;

		/* Point exceeds the cube in any axis:
		 *   ~> |X-Xc| > h
		 *   ~> |Y-Yc| > h
		 *   ~> |Z-Zc| > h
		 */
		if ( (point.x < this.center.x - halfEdge) || (point.x > this.center.x + halfEdge) ) return false;
		if ( (point.y < this.center.y - halfEdge) || (point.y > this.center.y + halfEdge) ) return false;
		if ( (point.z < this.center.z - halfEdge) || (point.z > this.center.z + halfEdge) ) return false;
		
		return true;
	}
}