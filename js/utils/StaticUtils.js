// Namespace
var Utils = Utils || {};

// Blender uses 1 as offset (first vertex is indexed as 1, not 0)
Utils.model2Geometry =  function  (model, offset=0)
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

Utils.dot = function (v1, v2)
{
	return (v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
}

Utils.cross = function (v1, v2)
{
	var rv =
	{
		x: v1.y*v2.z - v2.y*v1.z,
		y: v1.z*v2.x - v2.z*v1.x,
		z: v1.x*v2.y - v2.x*v1.y
	};

	return rv;
}

Utils.sqAbs = function (v)
{
	return Utils.dot(v, v);
}