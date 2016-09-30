// Namespace
var Utils = Utils || {};

// Blender uses 1 as offset (first vertex is indexed as 1, not 0)
Utils.JSONList2Geometry =  function  (jsonlist, offset=0)
{
	var rv = new THREE.Geometry ();
	var temp;

	for (var i = 0; i < jsonlist.vertices.length; i++) {
		temp = jsonlist.vertices[i];
		rv.vertices.push ( new THREE.Vector3(temp[0], temp[1], temp[2]) );
	}

	for (var i = 0; i < jsonlist.faces.length; i++) {
		temp = jsonlist.faces[i];
		rv.faces.push ( new THREE.Face3(temp[0]-offset, temp[1]-offset, temp[2]-offset) );
	}

	return rv;
};