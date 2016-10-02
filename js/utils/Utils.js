// Namespace
var Utils = Utils || {};

/* =====================================================================================================
 *  Model
 * ===================================================================================================== */
Utils.Model = Utils.Model || {};

// Blender uses 1 as offset (first vertex is indexed as 1, not 0)
Utils.Model.toGeometry =  function  (model, offset=0)
{
	var rv = new THREE.Geometry ();
	var temp;

	for (var i = 0; i < model.vertices.length; i++) {
		temp = model.vertices[i];
		rv.vertices.push ( new THREE.Vector3(temp[0], temp[1], temp[2]) );
	}

	for (var i = 0; i < model.faces.length; i++) {
		temp = model.faces[i];
		rv.faces.push ( new THREE.Face3(temp[0]-offset, temp[1]-offset, temp[2]-offset) );
	}

	return rv;
};

/* =====================================================================================================
 *  Array
 * ===================================================================================================== */
Utils.Array = Utils.Array || {};

// Centroid of a triangle
Utils.Array.centroid = function (A, B, C)
{
	var rv =
	{
		x: (A[0] + B[0] + C[0])/3,
		y: (A[1] + B[1] + C[1])/3,
		z: (A[2] + B[2] + C[2])/3
	};

	return rv;
};

/* Offsets array to the right by <offset> for
 * every element above a minimum value <min>.
 */
Utils.Array.offset = function (array, offset=1, min=0)
{
	for (var i = 0; i < array.length; i++)
		if (array[i] > min) array[i] += offset;
};

// Replaces <oldValue> with <newValue>.
Utils.Array.replaceElement = function (array, oldValue, newValue)
{
	for (var i = 0; i < array.length; i++)
		if (array[i] == oldValue) array[i] = newValue;
};

// Transforms the array into a Set
Utils.Array.removeDuplicates = function (array)
{
	rv = [];

	for (var i = 0; i < array.length-1; i++) {
		for (var j = i+1; j < array.length; j++) {
			if (array[j].equals(array[i])) {
				rv.push( {"oldValue": j, "newValue": i} );
				array.splice(j, 1);
			}
		}
	}

	return rv;
};


/* =====================================================================================================
 *  Vector
 * ===================================================================================================== */
Utils.Vector = Utils.Vector || {};

Utils.Vector.pointFromArray = function (array)
{
	var rv =
	{
		x: array[0],
		y: array[1],
		z: array[2]
	};

	return rv;
};

// Sum vector
Utils.Vector.sum = function (v1, v2)
{
	var rv =
	{
		x: v1.x + v2.x,
		y: v1.y + v2.y,
		z: v1.z + v2.z
	};

	return rv;
};

// Difference vector
Utils.Vector.diff = function (v1, v2)
{
	var rv =
	{
		x: v1.x - v2.x,
		y: v1.y - v2.y,
		z: v1.z - v2.z
	};

	return rv;
};

// Dot product of two vectors
Utils.Vector.dot = function (v1, v2)
{
	return (v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
};

// Cross product of two vectors
Utils.Vector.cross = function (v1, v2)
{
	var rv =
	{
		x: v1.y*v2.z - v2.y*v1.z,
		y: v1.z*v2.x - v2.z*v1.x,
		z: v1.x*v2.y - v2.x*v1.y
	};

	return rv;
};

Utils.Vector.sqAbs = function (v)
{
	return Utils.dot(v, v);
};

Utils.Vector.abs = function (v)
{
	return Math.sqrt(Utils.Vector.sqAbs(v));
};

Utils.Vector.centroid = function (A, B, C)
{
	var rv =
	{
		x: (A.x + B.x + C.x)/3,
		y: (A.y + B.y + C.y)/3,
		z: (A.z + B.z + C.z)/3
	};

	return rv;
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