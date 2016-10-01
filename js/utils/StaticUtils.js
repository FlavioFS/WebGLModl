// Namespace
var Utils = Utils || {};

/* =====================================================================================================
 *  Model
 * ===================================================================================================== */
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
/* Offsets array to the right by <offset> for
 * every element above a minimum value <min>.
 */
Utils.Array.offset = function (array, offset=1, min=0)
{
	for (element of array)
		if (element > min) element += offset;
};

// Replaces <oldValue> with <newValue>.
Utils.Array.replaceElement = function (array, oldValue, newValue)
{
	for (element of array)
		if (element == oldValue) element = newValue;
};

// Transforms the array into a Set
Utils.Array.removeDuplicates = function (array)
{
	rv = [];

	for (var i = 0; i < array.length-1; i++) {
		for (var j = i+1; j < array.length; j++) {
			if (array[j] == array[i]) {
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