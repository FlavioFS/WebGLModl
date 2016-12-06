// Namespace
var WingedEdge = WingedEdge || {};

let static_face_id = 1;

WingedEdge.Face = class
{

	constructor(edges) {
		this._id = static_face_id++;
		this._edges = edges;
	}

};