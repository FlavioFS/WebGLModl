// Namespace
var WingedEdge = WingedEdge || {};

let static_vertex_id = 0;

WingedEdge.Vertex = class
{

	constructor(pos) {
		this._pos = pos;
		// this._edge = edge; // object reference to WingedEdge.Edge
		this._id = static_vertex_id++;

		this._vector = new THREE.Vector3(pos.x, pos.y, pos.z);
	}

	get pos() { return this._pos; }
	set pos(pos) { this._pos = pos; }

	get id() { return this._id; }

	get edge() { return this._edge; }

	get vector() { return this._vector; }


	toString() {
		return this._pos.x + ', ' + this._pos.y + ', ' + this._pos.z;
	}

};