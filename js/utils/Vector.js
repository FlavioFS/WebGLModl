// Namespace
var Utils = Utils || {};
Utils.Vector = Utils.Vector || {};

/* =====================================================================================================
 *  Vector
 * ===================================================================================================== */
Utils.Vector = {

	// Converts Array to Point
	pointFromArray: function (array) {
		return {
			x: array[0],
			y: array[1],
			z: array[2]
		};
	},

	// Sum vector
	sum: function (v1, v2)
	{
		return {
			x: v1.x + v2.x,
			y: v1.y + v2.y,
			z: v1.z + v2.z
		};
	},

	// Difference vector
	diff: function (v1, v2)
	{
		return {
			x: v1.x - v2.x,
			y: v1.y - v2.y,
			z: v1.z - v2.z
		};
	},

	// Dot product of two vectors
	dot: function (v1, v2)
	{
		return (v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
	},

	// Cross product of two vectors
	cross: function (v1, v2)
	{
		return {
			x: v1.y*v2.z - v2.y*v1.z,
			y: v1.z*v2.x - v2.z*v1.x,
			z: v1.x*v2.y - v2.x*v1.y
		};
	},

	// Squared absolute value
	sqAbs: function (v)
	{
		return Utils.Vector.dot(v, v);
	},

	// Absolute value
	abs: function (v)
	{
		return Math.sqrt(Utils.Vector.sqAbs(v));
	},

	// Geometric center (mean)
	centroid: function (A, B, C)
	{
		return {
			x: (A.x + B.x + C.x)/3,
			y: (A.y + B.y + C.y)/3,
			z: (A.z + B.z + C.z)/3
		};
	},

	// Calculates normal given 3 points A, B, and C
	// *Note: A, B and C must follow the right-hand rule in this order.
	normal: function (A, B, C)
	{
		var AB = Utils.Vector.diff(B, A);
		var AC = Utils.Vector.diff(C, A);

		var rv = Utils.Vector.cross(AB, AC);
		var norm = Utils.Vector.abs(rv);

		rv.x /= norm;
		rv.y /= norm;
		rv.z /= norm;

		return rv;
	},

	compare: function (v1, v2, origin=Vector.Utils.ZERO)
	{
		var w1 = Vector.utils.diff(v1, origin);
		var w2 = Vector.utils.diff(v2, origin);

		if (Utils.Vector.sqAbs(w1) == Utils.Vector.sqAbs(w2)) return 0;
		if (Utils.Vector.sqAbs(w1) > Utils.Vector.sqAbs(w2)) return 1;
		return -1;
	},

	min: function (v1, v2, origin=Vector.Utils.ZERO)
	{
		if (compare(v1, v2, origin) <= 0)
			return v1;
		return v2;
	}
};

//// Constants
Utils.Vector.RIGHT = { x: 1, y: 0, z: 0 };
Utils.Vector.LEFT  = { x:-1, y: 0, z: 0 };
Utils.Vector.UP    = { x: 0, y: 1, z: 0 };
Utils.Vector.DOWN  = { x: 0, y:-1, z: 0 };
Utils.Vector.FRONT = { x: 0, y: 0, z: 1 };
Utils.Vector.BACK  = { x: 0, y: 0, z:-1 };
Utils.Vector.ZERO  = { x: 0, y: 0, z: 0 };