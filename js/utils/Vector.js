// Namespace
var Utils = Utils || {};
Utils.Vector = Utils.Vector || {};

/* =====================================================================================================
 *  Vector
 * ===================================================================================================== */

// Converts Array to Point
Utils.Vector.pointFromArray = function (array)
{
	return {
		x: array[0],
		y: array[1],
		z: array[2]
	};
};

// Sum vector
Utils.Vector.sum = function (v1, v2)
{
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
		z: v1.z + v2.z
	};
};

// Difference vector
Utils.Vector.diff = function (v1, v2)
{
	return {
		x: v1.x - v2.x,
		y: v1.y - v2.y,
		z: v1.z - v2.z
	};
};

// Dot product of two vectors
Utils.Vector.dot = function (v1, v2)
{
	return (v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
};

// Cross product of two vectors
Utils.Vector.cross = function (v1, v2)
{
	return {
		x: v1.y*v2.z - v2.y*v1.z,
		y: v1.z*v2.x - v2.z*v1.x,
		z: v1.x*v2.y - v2.x*v1.y
	};
};

// Squared absolute value
Utils.Vector.sqAbs = function (v)
{
	return Utils.dot(v, v);
};

// Absolute value
Utils.Vector.abs = function (v)
{
	return Math.sqrt(Utils.Vector.sqAbs(v));
};

// Geometric center (mean)
Utils.Vector.centroid = function (A, B, C)
{
	return {
		x: (A.x + B.x + C.x)/3,
		y: (A.y + B.y + C.y)/3,
		z: (A.z + B.z + C.z)/3
	};
};

// Calculates normal given 3 points A, B, and C
// *Note: A, B and C must follow the right-hand rule in this order.
Utils.Vector.normal = function (A, B, C)
{
	var AB = Utils.Vector.diff(B, A);
	var AC = Utils.Vector.diff(C, A);

	var rv = Utils.Vector.cross(AB, AC);
	var norm = Utils.Vector.abs(rv);

	rv.x /= norm;
	rv.y /= norm;
	rv.z /= norm;

	return rv;
};

//// Constants
Utils.Vector.RIGHT = { x: 1, y: 0, z: 0 };
Utils.Vector.LEFT  = { x:-1, y: 0, z: 0 };
Utils.Vector.UP    = { x: 0, y: 1, z: 0 };
Utils.Vector.DOWN  = { x: 0, y:-1, z: 0 };
Utils.Vector.FRONT = { x: 0, y: 0, z: 1 };
Utils.Vector.BACK  = { x: 0, y: 0, z:-1 };