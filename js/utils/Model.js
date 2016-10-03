// Namespace
var Utils = Utils || {};
Utils.Model = Utils.Model || {};

/* =====================================================================================================
 *  Converts JSON model to geometry
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